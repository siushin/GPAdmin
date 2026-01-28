/**
 * @see https://umijs.org/docs/max/access#access
 *
 * 权限配置支持两种方式：
 * 1. 静态配置：在各模块的 index.ts 中通过 access 字段定义
 * 2. 动态配置：根据 initialState 中的用户信息动态计算
 */
export { access as default } from '@/modules/base';
