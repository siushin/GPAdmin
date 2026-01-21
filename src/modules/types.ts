/**
 * 模块系统类型定义
 */

import type { IRoute } from '@umijs/max';

/**
 * 模块元数据接口
 * 每个模块的 index.ts 必须默认导出一个符合此接口的对象
 */
export interface ModuleMeta {
  /** 模块唯一标识名称 */
  name: string;
  /** 模块描述（可选） */
  description?: string;
  /** 模块路由配置 */
  routes: IRoute[];
  /** 模块权限配置（可选） */
  access?: Record<string, boolean>;
  /** 模块国际化配置（可选） */
  locales?: Record<string, Record<string, string>>;
  /** 模块初始化函数（可选） */
  onInit?: () => void | Promise<void>;
}

/**
 * 模块加载结果
 */
export interface ModuleLoadResult {
  /** 所有已加载的模块列表 */
  moduleList: ModuleMeta[];
  /** 所有模块的路由合集 */
  allRoutes: IRoute[];
  /** 所有模块的权限合集 */
  allAccess: Record<string, boolean>;
  /** 所有模块的国际化配置合集 */
  allLocales: Record<string, Record<string, string>>;
}
