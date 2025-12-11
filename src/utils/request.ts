import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
import { mockApi } from '@/mock'

// 是否使用 Mock
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

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
  '/auth/login': (config) => {
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

    // 在发送请求之前做些什么
    // 可以在这里添加 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
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

    // 如果返回的状态码不是 200，则视为错误
    if (res.code !== undefined && res.code !== 200) {
      message.error(res.message || '请求失败')

      // 401: 未登录或 token 过期
      if (res.code === 401) {
        // 清除 token 并跳转到登录页
        localStorage.removeItem('token')
        router.push('/login')
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    let errorMessage = '请求失败'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求资源不存在'
          break
        case 500:
          errorMessage = '服务器错误'
          break
        default:
          errorMessage = `连接错误${error.response.status}`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败'
    }

    message.error(errorMessage)
    return Promise.reject(error)
  }
)

export default service
