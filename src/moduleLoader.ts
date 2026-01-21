/**
 * 模块加载器
 * 静态导入 modules 目录下的所有模块
 */

import adminModule from './modules/admin';
import appMarketModule from './modules/app-market';
// 静态导入所有模块
import baseModule from './modules/base';
import smsModule from './modules/sms';
import type { ModuleLoadResult, ModuleMeta } from './modules/types';

/**
 * 所有模块列表 - 新增模块时在这里添加
 * 模块对应关系：
 * - base: 公共组件和工具
 * - admin: 后端 Modules/Base
 * - app-market: 后端 Modules/AppMarket
 * - sms: 后端 Modules/Sms
 */
const allModules: ModuleMeta[] = [
  baseModule,
  adminModule,
  appMarketModule,
  smsModule,
];

/**
 * 解析并验证模块
 */
function parseModules(): ModuleMeta[] {
  const modules: ModuleMeta[] = [];

  for (const moduleMeta of allModules) {
    // 验证模块结构
    if (!moduleMeta) {
      console.warn(`[ModuleLoader] 模块没有默认导出，已跳过`);
      continue;
    }

    if (!moduleMeta.name) {
      console.warn(`[ModuleLoader] 模块缺少 name 属性，已跳过`);
      continue;
    }

    if (!moduleMeta.routes || !Array.isArray(moduleMeta.routes)) {
      // base 模块可能没有路由，这是正常的
      if (moduleMeta.routes === undefined) {
        moduleMeta.routes = [];
      }
    }

    modules.push(moduleMeta);
    console.log(`[ModuleLoader] ✓ 已加载模块: ${moduleMeta.name}`);
  }

  return modules;
}

/**
 * 已解析的模块列表
 */
export const moduleList: ModuleMeta[] = parseModules();

/**
 * 获取所有模块的路由
 */
export function getAllRoutes() {
  return moduleList.flatMap((mod) => mod.routes);
}

/**
 * 获取所有模块的权限配置
 */
export function getAllAccess(): Record<string, boolean> {
  const access: Record<string, boolean> = {};

  for (const mod of moduleList) {
    if (mod.access) {
      Object.assign(access, mod.access);
    }
  }

  return access;
}

/**
 * 获取所有模块的国际化配置
 */
export function getAllLocales(): Record<string, Record<string, string>> {
  const locales: Record<string, Record<string, string>> = {};

  for (const mod of moduleList) {
    if (mod.locales) {
      for (const [lang, messages] of Object.entries(mod.locales)) {
        if (!locales[lang]) {
          locales[lang] = {};
        }
        Object.assign(locales[lang], messages);
      }
    }
  }

  return locales;
}

/**
 * 初始化所有模块
 */
export async function initializeModules(): Promise<void> {
  for (const mod of moduleList) {
    if (mod.onInit) {
      try {
        await mod.onInit();
        console.log(`[ModuleLoader] ✓ 模块 ${mod.name} 初始化完成`);
      } catch (error) {
        console.error(`[ModuleLoader] ✗ 模块 ${mod.name} 初始化失败:`, error);
      }
    }
  }
}

/**
 * 获取完整的模块加载结果
 */
export function getModuleLoadResult(): ModuleLoadResult {
  return {
    moduleList,
    allRoutes: getAllRoutes(),
    allAccess: getAllAccess(),
    allLocales: getAllLocales(),
  };
}

export default {
  moduleList,
  getAllRoutes,
  getAllAccess,
  getAllLocales,
  initializeModules,
  getModuleLoadResult,
};
