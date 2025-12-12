import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  real_name?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
}

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 恢复 token
  const storedToken = localStorage.getItem('token') || ''
  const token = ref<string>(storedToken)

  // 从 localStorage 恢复 token 过期时间（时间戳，毫秒）
  const storedTokenExpireTime = localStorage.getItem('tokenExpireTime')
  const tokenExpireTime = ref<number | null>(storedTokenExpireTime ? parseInt(storedTokenExpireTime, 10) : null)

  // 从 localStorage 恢复用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  const userInfo = ref<UserInfo | null>(storedUserInfo ? JSON.parse(storedUserInfo) : null)

  // 登录响应的完整 data 数据
  const storedLoginData = localStorage.getItem('loginData')
  const loginData = ref<any>(storedLoginData ? JSON.parse(storedLoginData) : null)

  // 设置 token 和过期时间
  const setToken = (newToken: string, expireTime?: number | string | Date) => {
    // 确保 token 是字符串类型
    if (typeof newToken !== 'string') {
      console.error('setToken 接收到的 token 不是字符串类型:', newToken)
      // 如果是对象，尝试提取字符串值
      if (typeof newToken === 'object' && newToken !== null) {
        const extractedToken = (newToken as any).token || (newToken as any).access_token || (newToken as any).value
        if (typeof extractedToken === 'string') {
          newToken = extractedToken
        } else {
          console.error('无法从对象中提取 token 字符串值')
          return
        }
      } else {
        // 尝试转换为字符串
        newToken = String(newToken)
      }
    }

    token.value = newToken
    localStorage.setItem('token', newToken)

    // 处理过期时间：支持时间戳（秒或毫秒）、Date对象、或秒数
    if (expireTime) {
      let expireTimestamp: number

      if (typeof expireTime === 'string') {
        // 如果是字符串，尝试解析为数字或日期
        const parsed = parseInt(expireTime, 10)
        if (!isNaN(parsed)) {
          expireTimestamp = parsed > 10000000000 ? parsed : parsed * 1000 // 判断是秒还是毫秒
        } else {
          expireTimestamp = new Date(expireTime).getTime()
        }
      } else if (expireTime instanceof Date) {
        expireTimestamp = expireTime.getTime()
      } else {
        // 数字类型：判断是秒还是毫秒（大于10000000000认为是毫秒）
        expireTimestamp = expireTime > 10000000000 ? expireTime : expireTime * 1000
      }

      tokenExpireTime.value = expireTimestamp
      localStorage.setItem('tokenExpireTime', expireTimestamp.toString())
    } else {
      // 如果没有提供过期时间，清除过期时间
      tokenExpireTime.value = null
      localStorage.removeItem('tokenExpireTime')
    }
  }

  // 检查 token 是否即将过期（默认提前5分钟刷新）
  const isTokenExpiringSoon = (bufferMinutes: number = 5): boolean => {
    if (!tokenExpireTime.value) {
      return false // 如果没有过期时间，不进行刷新
    }
    const now = Date.now()
    const bufferTime = bufferMinutes * 60 * 1000 // 转换为毫秒
    return tokenExpireTime.value - now <= bufferTime
  }

  // 检查 token 是否已过期
  const isTokenExpired = (): boolean => {
    if (!tokenExpireTime.value) {
      return false // 如果没有过期时间，认为未过期
    }
    return Date.now() >= tokenExpireTime.value
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 设置登录响应的完整 data 数据
  const setLoginData = (data: any) => {
    loginData.value = data
    localStorage.setItem('loginData', JSON.stringify(data))
  }

  // 登出
  const logout = async () => {
    // 调用后端登出接口（不管成功或失败都继续执行退出流程）
    try {
      const { authApi } = await import('@/api/system/auth')
      await authApi.logout()
    } catch (error) {
      // 接口调用失败也不影响退出流程，静默处理
      console.warn('登出接口调用失败，继续执行退出流程:', error)
    }

    // 无论接口响应如何，都执行正常的退出系统流程
    token.value = ''
    tokenExpireTime.value = null
    userInfo.value = null
    loginData.value = null

    // 只清除用户相关的数据，保留其他应用配置
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpireTime')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('loginData')
    // 注意：不清除 rememberUsername 和 rememberPassword，保留自动登录的用户名和密码
    // localStorage.removeItem('rememberUsername')
    // localStorage.removeItem('rememberPassword')

    // 清除 sessionStorage（如果有使用）
    sessionStorage.clear()
  }

  return {
    token,
    tokenExpireTime,
    userInfo,
    loginData,
    setToken,
    setUserInfo,
    setLoginData,
    isTokenExpiringSoon,
    isTokenExpired,
    logout
  }
})
