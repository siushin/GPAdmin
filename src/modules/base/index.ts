/**
 * Base 模块
 * 提供公共的工具函数、组件和基础服务
 * 不包含路由，仅作为其他模块的基础依赖
 */

import type { ModuleMeta } from '../types';

// 导出组件
export * from './components';
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
