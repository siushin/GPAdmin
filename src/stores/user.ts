import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
}

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 恢复 token
  const storedToken = localStorage.getItem('token') || ''
  const token = ref<string>(storedToken)

  // 从 localStorage 恢复用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  const userInfo = ref<UserInfo | null>(storedUserInfo ? JSON.parse(storedUserInfo) : null)

  // 设置 token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 登出
  const logout = async () => {
    try {
      // 调用后端登出接口（可选）
      // await api.logout()
    } catch (error) {
      // 即使接口失败也要清除本地数据
      console.error('登出接口调用失败:', error)
    } finally {
      // 清除所有本地存储数据
      token.value = ''
      userInfo.value = null

      // 清除用户相关数据
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')

      // 清除所有 localStorage 缓存
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // 清除 sessionStorage（如果有使用）
      sessionStorage.clear()
    }
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout
  }
})
