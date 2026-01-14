/* eslint-disable */
import { request } from '@umijs/max';
import type { AppItem } from '@/pages/app/mock';

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
