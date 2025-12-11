// Mock 统一入口
import { systemMock } from './system'
import { businessMock } from './business'

// 统一导出所有 Mock API
export const mockApi = {
  ...systemMock,
  ...businessMock
}

// 也可以按模块导出
export { systemMock } from './system'
export { businessMock } from './business'

// 导出 Mock 数据（如果需要单独使用）
export { mockUsers, mockRoles, mockMenus, mockDepts, mockMenuData, mockRouteNameMap } from './system'
