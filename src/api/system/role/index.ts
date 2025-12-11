import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 角色管理相关 API
export const roleApi = {
  // 获取角色列表
  getRoles(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/role/list', { params })
  }
}
