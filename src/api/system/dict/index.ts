import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 数据字典相关 API
export const dictApi = {
  // 获取字典列表
  getDicts(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/dict/list', { params })
  },
  // 获取字典项列表
  getDictItems(type: string): Promise<ApiResponse<any[]>> {
    return request.get(`/dict/items/${type}`)
  },
  // 获取字典详情
  getDictDetail(id: number): Promise<ApiResponse<any>> {
    return request.get(`/dict/${id}`)
  }
}
