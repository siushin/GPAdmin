// @ts-ignore
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

/** 退出登录接口 POST /api/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 刷新token接口 POST /api/refreshToken */
export async function refreshToken(options?: { [key: string]: any }) {
  return request<{
    code: number;
    data: {
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

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username: body.username,
      password: body.password,
    },
    ...(options || {}),
  });
}

/** 手机号验证码登录接口 POST /api/login/code */
export async function loginByCode(
  body: { phone: string; code: string },
  options?: { [key: string]: any },
) {
  return request<API.LoginResult>('/api/login/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      phone: body.phone,
      code: body.code,
    },
    ...(options || {}),
  });
}

/** 注册接口 POST /api/register */
export async function register(
  body: {
    username: string;
    password: string;
    confirm_password: string;
    phone: string;
    code: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username: body.username,
      password: body.password,
      confirm_password: body.confirm_password,
      phone: body.phone,
      code: body.code,
    },
    ...(options || {}),
  });
}

/** 重置密码接口 POST /api/resetPassword */
export async function resetPassword(
  body: {
    phone: string;
    code: string;
    password: string;
    confirm_password: string;
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
    data: {
      phone: body.phone,
      code: body.code,
      password: body.password,
      confirm_password: body.confirm_password,
    },
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
      enabled: boolean;
      path: string;
    }>;
  }>('/api/admin/app/myApps', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
