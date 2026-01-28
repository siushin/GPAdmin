/**
 * Base 模块
 * 提供公共的工具函数、组件和基础服务
 * 包含模块加载器、类型定义、权限配置等通用功能
 */

import type { ModuleMeta } from './types';

// 导出权限配置
export { default as access } from './access';
// 导出组件
export * from './components';
// 导出模块加载器
export * from './moduleLoader';
// 导出类型定义
export * from './types';
// 导出工具函数
export * from './utils';

/**
 * Base 模块元数据
 * 由于 base 是基础模块，不提供路由
 */
const baseMeta: ModuleMeta = {
  name: 'base',
  description: '基础模块 - 提供公共工具函数和组件',
  routes: [], // base 模块不提供路由
  access: {}, // base 模块不提供权限
};

export default baseMeta;
