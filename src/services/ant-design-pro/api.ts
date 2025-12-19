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

/** 常规日志列表 POST /api/admin/log/index */
export async function getLogList(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.PageResponse>('/api/admin/log/index', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 操作日志列表 POST /api/admin/log/operationLog */
export async function getOperationLogList(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.PageResponse>('/api/admin/log/operationLog', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 登录日志列表 POST /api/admin/log/loginLog */
export async function getLoginLogList(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.PageResponse>('/api/admin/log/loginLog', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 审计日志列表 POST /api/admin/log/auditLog */
export async function getAuditLogList(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.PageResponse>('/api/admin/log/auditLog', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 获取来源类型列表 POST /api/admin/log/getSourceTypeList */
export async function getSourceTypeList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getSourceTypeList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取常规日志操作类型列表 POST /api/admin/log/getActionList */
export async function getActionList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getActionList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取操作日志操作类型列表 POST /api/admin/log/getOperationActionList */
export async function getOperationActionList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getOperationActionList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取HTTP方法列表 POST /api/admin/log/getHttpMethodList */
export async function getHttpMethodList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getHttpMethodList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取浏览器列表 POST /api/admin/log/getBrowserList */
export async function getBrowserList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getBrowserList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取操作系统列表 POST /api/admin/log/getOperatingSystemList */
export async function getOperatingSystemList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getOperatingSystemList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取设备类型列表 POST /api/admin/log/getDeviceTypeList */
export async function getDeviceTypeList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getDeviceTypeList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取审计操作类型列表 POST /api/admin/log/getAuditActionList */
export async function getAuditActionList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getAuditActionList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取资源类型列表 POST /api/admin/log/getResourceTypeList */
export async function getResourceTypeList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getResourceTypeList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取操作日志模块名称列表 POST /api/admin/log/getModuleList */
export async function getModuleList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: string }>;
  }>('/api/admin/log/getModuleList', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取操作日志响应状态码列表 POST /api/admin/log/getResponseCodeList */
export async function getResponseCodeList(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: Array<{ label: string; value: number }>;
  }>('/api/admin/log/getResponseCodeList', {
    method: 'POST',
    ...(options || {}),
  });
}
