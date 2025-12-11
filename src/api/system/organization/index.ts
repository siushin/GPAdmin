import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 组织架构相关 API
export const organizationApi = {
  // 获取部门列表
  getDepts(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.post('/dept/list', { params })
  },
  // 获取职位列表
  getPositions(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.post('/position/list', { params })
  },
  // 获取岗位列表
  getPosts(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.post('/post/list', { params })
  }
}
