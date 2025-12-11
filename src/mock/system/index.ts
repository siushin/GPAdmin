// 系统管理 Mock 统一入口
import { authMock } from './auth'
import { menuMock } from './menu'
import { userMock } from './user'
import { roleMock } from './role'
import { organizationMock } from './organization'
import { dictMock } from './dict'
import { logMock } from './log'

// 统一导出所有系统管理相关 Mock API
export const systemMock = {
  ...authMock,
  ...menuMock,
  ...userMock,
  ...roleMock,
  ...organizationMock,
  ...dictMock,
  ...logMock
}

// 也可以按模块导出
export { authMock } from './auth'
export { menuMock } from './menu'
export { userMock } from './user'
export { roleMock } from './role'
export { organizationMock } from './organization'
export { dictMock } from './dict'
export { logMock } from './log'

// 导出 Mock 数据（如果需要单独使用）
export { mockUsers } from './user'
export { mockRoles } from './role'
export { mockMenus, mockMenuData, mockRouteNameMap } from './menu'
export { mockDepts, mockPositions, mockPosts } from './organization'
export { mockDicts } from './dict'
export { mockOperationLogs, mockLoginLogs, mockAuditLogs } from './log'
