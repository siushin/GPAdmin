/**
 * @see https://umijs.org/docs/max/access#access
 *
 * 权限配置支持两种方式：
 * 1. 静态配置：在各模块的 index.ts 中通过 access 字段定义
 * 2. 动态配置：根据 initialState 中的用户信息动态计算
 */
import { getAllAccess } from './moduleLoader';

export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};

  // 获取所有模块定义的权限
  const moduleAccess = getAllAccess();

  // 基础权限：已登录用户
  // 因为菜单数据是从后端获取的，后端已经做了权限控制
  // 如果用户没有权限，后端不会返回对应的菜单
  const canAdmin = !!currentUser;

  return {
    // 基础权限
    canAdmin,
    // 合并模块权限（模块权限可以覆盖基础权限）
    ...moduleAccess,
  };
}
