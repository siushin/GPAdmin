import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 系统日志相关 API
export const logApi = {
  // 获取操作日志列表
  getOperationLogs(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/log/operation', { params })
  },
  // 获取登录日志列表
  getLoginLogs(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/log/login', { params })
  },
  // 获取审计日志列表
  getAuditLogs(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/log/audit', { params })
  }
}
