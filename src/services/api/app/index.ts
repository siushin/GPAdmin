/* eslint-disable */
import { request } from '@umijs/max';
import type { AppItem } from '@/pages/app/Market';

/** 获取我的应用列表 POST /api/admin/app/myApps */
export async function getMyApps(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: AppItem[];
  }>('/api/admin/app/myApps', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取市场应用列表（所有模块） POST /api/admin/app/marketApps */
export async function getMarketApps(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: AppItem[];
  }>('/api/admin/app/marketApps', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 更新本地模块 POST /api/admin/app/updateModules */
export async function updateModules(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: {
      success: Array<{
        module_name: string;
        path: string;
      }>;
      failed: Array<{
        path: string;
        message: string;
      }>;
    };
  }>('/api/admin/app/updateModules', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 安装模块 POST /api/admin/app/installModule */
export async function installModule(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: {
      module_id: number;
      module_name: string;
    };
  }>('/api/admin/app/installModule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 卸载模块 POST /api/admin/app/uninstallModule */
export async function uninstallModule(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: {
      module_id: number;
      module_name: string;
      module_path: string;
    };
  }>('/api/admin/app/uninstallModule', {
    method: 'POST',
    ...(options || {}),
  });
}
