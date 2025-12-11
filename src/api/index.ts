// API 统一入口
import { systemApi } from './system'
import { businessApi } from './business'

// 统一导出所有 API
export const api = {
  ...systemApi,
  ...businessApi
}

// 也可以按模块导出
export { systemApi } from './system'
export { businessApi } from './business'
