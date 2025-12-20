// @ts-expect-error
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
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
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
      source: string;
      enabled: boolean;
      path: string;
    }>;
  }>('/api/admin/app/myApps', {
    method: 'POST',
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

/** 常规日志列表 POST /api/admin/log/generalLog */
export async function getLogList(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<API.PageResponse>('/api/admin/log/generalLog', {
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

/** 获取常规日志搜索数据 POST /api/admin/log/getGeneralLogSearchData */
export async function getGeneralLogSearchData(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    message: string;
    data: {
      action_type: Array<{ label: string; value: string }>;
      source_type: Array<{ label: string; value: string }>;
    };
  }>('/api/admin/log/getGeneralLogSearchData', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取操作日志搜索数据 POST /api/admin/log/getOperationLogSearchData */
export async function getOperationLogSearchData(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    message: string;
    data: {
      module: Array<{ label: string; value: string }>;
      action: Array<{ label: string; value: string }>;
      method: Array<{ label: string; value: string }>;
      response_code: Array<{ label: string; value: number }>;
      source_type: Array<{ label: string; value: string }>;
    };
  }>('/api/admin/log/getOperationLogSearchData', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取登录日志搜索数据 POST /api/admin/log/getLoginLogSearchData */
export async function getLoginLogSearchData(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: {
      browser: Array<{ label: string; value: string }>;
      operating_system: Array<{ label: string; value: string }>;
      device_type: Array<{ label: string; value: string }>;
      status: Array<{ label: string; value: number }>;
    };
  }>('/api/admin/log/getLoginLogSearchData', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取审计日志搜索数据 POST /api/admin/log/getAuditLogSearchData */
export async function getAuditLogSearchData(options?: { [key: string]: any }) {
  return request<{
    code: number;
    message: string;
    data: {
      module: Array<{ label: string; value: string }>;
      action: Array<{ label: string; value: string }>;
      resource_type: Array<{ label: string; value: string }>;
    };
  }>('/api/admin/log/getAuditLogSearchData', {
    method: 'POST',
    ...(options || {}),
  });
}
