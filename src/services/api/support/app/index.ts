/* eslint-disable */
import { request } from '@umijs/max';

/** 获取我的应用列表 POST /api/admin/app/myApps */
export async function getMyApps(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: Array<{
      name: string;
      alias: string;
      description: string;
      keywords: string[];
      priority: number;
      source: string;
      enabled: boolean;
      path: string;
    }>;
  }>('/api/admin/app/myApps', {
    method: 'POST',
    ...(options || {}),
  });
}
