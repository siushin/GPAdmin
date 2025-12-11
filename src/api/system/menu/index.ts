import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 菜单和路由相关 API
export const menuApi = {
  // 获取菜单列表（用于侧边栏）
  getMenus(): Promise<ApiResponse<{ list: any[] }>> {
    return request.get('/menu/sidebar')
  },

  // 获取路由名称映射
  getRouteNameMap(): Promise<ApiResponse<Record<string, string>>> {
    return request.get('/route/name-map')
  },

  // 获取菜单列表（用于菜单管理页面）
  getMenuList(params?: any): Promise<ApiResponse<{ list: any[]; total: number }>> {
    return request.get('/menu/list', { params })
  },

  // 获取菜单列表（用于侧边栏）- 别名，保持兼容性
  getMenusForSidebar(): Promise<ApiResponse<{ list: any[] }>> {
    return request.get('/menu/sidebar')
  }
}
