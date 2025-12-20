/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 POST /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取用户菜单列表 POST /api/getUserMenus */
export async function getUserMenus(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: any[];
  }>('/api/getUserMenus', {
    method: 'POST',
    ...(options || {}),
  });
}
