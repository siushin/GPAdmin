import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 登录认证相关 API
export const authApi = {
  // 账号密码登录
  login(data: { username: string; password: string }): Promise<ApiResponse<{ token: string; userInfo: any }>> {
    return request.post('/auth/login', data)
  },

  // 手机号登录
  loginByPhone(data: { phone: string; captcha: string }): Promise<ApiResponse<{ token: string; userInfo: any }>> {
    return request.post('/auth/login/phone', data)
  },

  // 获取用户信息
  getUserInfo(): Promise<ApiResponse<any>> {
    return request.get('/user/info')
  },

  // 登出
  logout(): Promise<ApiResponse<void>> {
    return request.post('/auth/logout')
  }
}
