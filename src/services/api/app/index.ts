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
