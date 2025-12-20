/* eslint-disable */
import { request } from '@umijs/max';

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
