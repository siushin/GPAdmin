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

/** 刷新 Token POST /api/refreshToken */
export async function refreshToken(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data?: {
      token: {
        token_type: string;
        expires_in: number;
        access_token: string;
        refresh_token: string;
      };
    };
  }>('/api/refreshToken', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 用户注册 POST /api/register */
export async function register(
  body: {
    username?: string;
    password?: string;
    confirm_password?: string;
    phone?: string;
    code?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.LoginResult>('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 重置密码 POST /api/resetPassword */
export async function resetPassword(
  body: {
    phone?: string;
    code?: string;
    password?: string;
    confirm_password?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
