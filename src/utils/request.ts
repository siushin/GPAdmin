import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
import { mockApi } from '@/mock'
import { useUserStore } from '@/stores/user'

// 是否使用 Mock
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// token 刷新锁，防止并发请求时多次刷新
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

// 订阅 token 刷新
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

// 通知所有订阅者 token 已刷新
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

// 刷新 token
const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    // 如果正在刷新，等待刷新完成
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token)
      })
    })
  }

  isRefreshing = true
  const userStore = useUserStore()

  try {
    // 动态导入避免循环依赖
    const { authApi } = await import('@/api/system/auth')
    const response = await authApi.refreshToken()

    if (response && (response.code === 200 || response.code === 0)) {
      const responseData = response.data || response
      // 优先使用 access_token
      let newToken = responseData.access_token || responseData.token || responseData.accessToken

      if (newToken) {
        // 确保 token 是字符串类型
        if (typeof newToken !== 'string') {
          // 如果 token 是对象，尝试提取字符串值
          if (typeof newToken === 'object' && newToken !== null) {
            newToken = (newToken as any).token || (newToken as any).access_token || (newToken as any).value
            if (typeof newToken !== 'string') {
              console.error('刷新 token 返回的值不是字符串类型:', newToken)
              isRefreshing = false
              return null
            }
          } else {
            newToken = String(newToken)
          }
        }

        // 计算新的过期时间
        const expiresIn = responseData.expiresIn || responseData.expires_in || 7200 // 默认2小时
        const expireTime = Date.now() + expiresIn * 1000

        userStore.setToken(newToken, expireTime)
        onTokenRefreshed(newToken)
        isRefreshing = false
        return newToken
      }
    }

    isRefreshing = false
    return null
  } catch (error) {
    isRefreshing = false
    console.error('刷新 token 失败:', error)
    // 刷新失败，清除 token 并跳转到登录页
    userStore.logout()
    router.push('/login')
    return null
  }
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 安全解析请求数据（兼容对象和字符串格式）
const parseRequestData = (data: any): any => {
  if (!data) return {}
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return {}
    }
  }
  return data
}

// Mock 请求映射表
const mockUrlMap: Record<string, (config: InternalAxiosRequestConfig) => Promise<any>> = {
  '/admin/login': (config) => {
    const data = parseRequestData(config.data)
    return mockApi.login(data)
  },
  '/auth/login/phone': (config) => {
    const data = parseRequestData(config.data)
    return mockApi.loginByPhone(data)
  },
  '/user/info': () => mockApi.getUserInfo(),
  '/user/list': (config) => {
    const params = config.params || {}
    return mockApi.getUsers(params)
  },
  '/role/list': (config) => {
    const params = config.params || {}
    return mockApi.getRoles(params)
  },
  '/menu/list': () => mockApi.getMenuList(),
  '/menu/sidebar': () => mockApi.getMenus(),
  '/dept/list': () => mockApi.getDepts(),
  '/route/name-map': () => mockApi.getRouteNameMap()
}

// 请求拦截器
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 如果启用 Mock，使用 Mock handler 处理请求
    if (USE_MOCK) {
      const url = config.url || ''
      const mockHandler = mockUrlMap[url]

      if (mockHandler) {
        try {
          const mockData = await mockHandler(config)
          // 创建自定义 adapter 返回 mock 数据
          config.adapter = () => {
            const mockResponse: AxiosResponse = {
              data: mockData,
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            }
            return Promise.resolve(mockResponse)
          }
        } catch (error) {
          config.adapter = () => Promise.reject(error)
        }
      }
    }

    // 检查 token 是否即将过期，如果是则先刷新
    const userStore = useUserStore()
    const url = config.url || ''

    // 定义不需要 Token 的公开接口（登录、注册等）
    const isPublicRequest =
      url.includes('/admin/login') ||
      url.includes('/auth/login') ||
      url.includes('/register') ||
      url.includes('/auth/register')

    // 刷新 token 接口需要当前 token
    const isRefreshTokenRequest = url.includes('/admin/refreshToken')

    // 只有非公开接口才需要添加 Bearer Token
    if (!isPublicRequest && userStore.token) {
      // 确保 token 是字符串类型
      const tokenStr = typeof userStore.token === 'string' ? userStore.token : String(userStore.token)

      if (userStore.isTokenExpiringSoon(5)) {
        // token 即将过期，先刷新
        const newToken = await refreshToken()
        if (newToken && config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`
        }
      } else if (config.headers) {
        // token 未过期，直接使用
        config.headers.Authorization = `Bearer ${tokenStr}`
      }
    } else if (isRefreshTokenRequest && userStore.token && config.headers) {
      // 刷新 token 请求，需要当前 token
      const tokenStr = typeof userStore.token === 'string' ? userStore.token : String(userStore.token)
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    // 公开接口（登录、注册等）不添加 Bearer Token

    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    const url = response.config.url || ''

    // 公开接口的特殊处理：允许返回错误信息，不在这里统一提示和 token 过期处理
    const isPublicRequest =
      url.includes('/admin/login') ||
      url.includes('/auth/login') ||
      url.includes('/register') ||
      url.includes('/auth/register')

    // 修改密码接口的特殊处理：错误由调用方自己处理，不在拦截器中提示
    const isChangePasswordRequest = url.includes('/admin/changePassword')

    // 如果返回的状态码不是 200，则视为错误
    // 成功的 code 必须为 200
    if (res.code !== undefined && res.code !== 200) {
      const errorMessage = res.message || res.msg || '请求失败'

      // 401: token 过期处理（公开接口除外，因为公开接口不需要 token）
      if (res.code === 401 && !isPublicRequest && errorMessage.includes('token已过期')) {
        // 显示提示信息
        message.error(errorMessage)
        // 等待提示信息消失后退出系统（message 默认 duration 是 3 秒）
        setTimeout(async () => {
          const userStore = useUserStore()
          await userStore.logout()
          router.replace('/login')
        }, 3500) // 3.5秒后退出，确保提示信息已消失
      } else if (!isPublicRequest && !isChangePasswordRequest) {
        // 所有非 200 的错误都要显示错误提示（公开接口和修改密码接口除外）
        message.error(errorMessage)
      }

      return Promise.reject(new Error(errorMessage))
    }

    // 如果没有 code 字段，认为是直接返回数据，视为成功
    if (res.code === undefined) {
      return res
    }

    return res
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    const url = error.config?.url || ''
    // 定义公开接口（登录、注册等），这些接口不需要 token，也不会报 token 失效错误
    const isPublicRequest =
      url.includes('/admin/login') ||
      url.includes('/auth/login') ||
      url.includes('/register') ||
      url.includes('/auth/register')

    let errorMessage = '请求失败'

    if (error.response) {
      const errorData = error.response.data as any

      switch (error.response.status) {
        case 400:
          errorMessage = errorData?.message || errorData?.msg || '请求参数错误'
          break
        case 401:
          // 公开接口的401错误由调用方自己处理（如登录页面的账号密码错误）
          if (isPublicRequest) {
            errorMessage = errorData?.message || errorData?.msg || '账号或密码错误'
          } else {
            // 系统内接口的401错误，检查是否是 token 过期
            errorMessage = errorData?.message || errorData?.msg || '未授权，请重新登录'
            if (errorMessage.includes('token已过期')) {
              // 显示提示信息
              message.error(errorMessage)
              // 等待提示信息消失后退出系统
              setTimeout(async () => {
                const userStore = useUserStore()
                await userStore.logout()
                router.replace('/login')
              }, 3500) // 3.5秒后退出，确保提示信息已消失
            } else {
              // 其他 401 错误，直接清除 token 并跳转
              localStorage.removeItem('token')
              router.push('/login')
            }
          }
          break
        case 403:
          errorMessage = errorData?.message || errorData?.msg || '拒绝访问'
          break
        case 404:
          errorMessage = errorData?.message || errorData?.msg || '请求资源不存在'
          break
        case 500:
          errorMessage = errorData?.message || errorData?.msg || '服务器错误'
          break
        default:
          errorMessage = errorData?.message || errorData?.msg || `连接错误${error.response.status}`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败'
    }

    // 公开接口的错误由调用方自己处理，不在拦截器中提示
    // token 过期的情况已经在上面处理了，不需要再次提示
    if (!isPublicRequest && !errorMessage.includes('token已过期')) {
      message.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default service
