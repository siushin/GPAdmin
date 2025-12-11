import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 用户管理相关 API
export const userApi = {
  // 获取用户列表
  getUsers(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/user/list', { params })
  }
}
