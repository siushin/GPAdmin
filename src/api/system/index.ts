// 系统管理 API 统一入口
import { authApi } from './auth'
import { menuApi } from './menu'
import { userApi } from './user'
import { roleApi } from './role'
import { organizationApi } from './organization'
import { dictApi } from './dict'
import { logApi } from './log'

// 统一导出所有系统管理相关 API
export const systemApi = {
  ...authApi,
  ...menuApi,
  ...userApi,
  ...roleApi,
  ...organizationApi,
  ...dictApi,
  ...logApi
}

// 也可以按模块导出
export { authApi } from './auth'
export { menuApi } from './menu'
export { userApi } from './user'
export { roleApi } from './role'
export { organizationApi } from './organization'
export { dictApi } from './dict'
export { logApi } from './log'
