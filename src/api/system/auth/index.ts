import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 登录认证相关 API
export const authApi = {
  // 账号密码登录
  login(data: { username: string; password: string }): Promise<ApiResponse<{ token: string; userInfo: any; expiresIn?: number }>> {
    return request.post('/admin/login', data)
  },

  // 手机号登录
  loginByCode(data: { mobile: string; code: string }): Promise<ApiResponse<{ token: string; userInfo: any; expiresIn?: number }>> {
    return request.post('/admin/loginByCode', data)
  },

  // 刷新 token
  refreshToken(): Promise<ApiResponse<{ token: string; expiresIn?: number }>> {
    return request.post('/admin/refreshToken')
  },

  // 获取用户信息
  getUserInfo(): Promise<ApiResponse<any>> {
    return request.get('/user/info')
  },

  // 登出
  logout(): Promise<ApiResponse<void>> {
    return request.post('/admin/logout')
  },

  // 修改密码
  changePassword(data: { current_password: string; password: string; confirm_password: string }): Promise<ApiResponse<void>> {
    return request.post('/admin/changePassword', data)
  },

  // 发送短信验证码
  sendSmsCode(data: { mobile: string; type: 'login' | 'register' | 'reset_password' }): Promise<ApiResponse<void>> {
    return request.post('/sms/send', data)
  },

  // 用户注册
  register(data: { username: string; password: string; confirm_password: string; mobile: string; code: string }): Promise<ApiResponse<void>> {
    return request.post('/admin/register', data)
  },

  // 重置密码
  resetPassword(data: { mobile: string; code: string; password: string; confirm_password: string }): Promise<ApiResponse<void>> {
    return request.post('/admin/resetPassword', data)
  }
}
