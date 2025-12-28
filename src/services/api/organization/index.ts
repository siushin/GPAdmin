/* eslint-disable */
import { request } from '@umijs/max';

// ========== 公司管理 API ==========

/** 公司列表 POST /api/admin/company/index */
export async function getCompanyList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/company/index', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 新增公司 POST /api/admin/company/add */
export async function addCompany(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/company/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新公司 POST /api/admin/company/update */
export async function updateCompany(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/company/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除公司 POST /api/admin/company/delete */
export async function deleteCompany(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/company/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 移动公司 POST /api/admin/organization/move */
export async function moveCompany(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/organization/move', {
    method: 'POST',
    data: { ...body, type: 'company' },
    ...(options || {}),
  });
}

// ========== 部门管理 API ==========

/** 部门列表 POST /api/admin/department/index */
export async function getDepartmentList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/department/index', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 新增部门 POST /api/admin/department/add */
export async function addDepartment(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/department/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新部门 POST /api/admin/department/update */
export async function updateDepartment(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/department/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除部门 POST /api/admin/department/delete */
export async function deleteDepartment(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/department/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 移动部门 POST /api/admin/organization/move */
export async function moveDepartment(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/organization/move', {
    method: 'POST',
    data: { ...body, type: 'department' },
    ...(options || {}),
  });
}

// ========== 职位管理 API ==========

/** 职位列表 POST /api/admin/position/index */
export async function getPositionList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/position/index', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 新增职位 POST /api/admin/position/add */
export async function addPosition(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/position/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新职位 POST /api/admin/position/update */
export async function updatePosition(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/position/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除职位 POST /api/admin/position/delete */
export async function deletePosition(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/position/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 移动职位 POST /api/admin/organization/move */
export async function movePosition(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/organization/move', {
    method: 'POST',
    data: { ...body, type: 'position' },
    ...(options || {}),
  });
}

// ========== 岗位管理 API ==========

/** 岗位列表 POST /api/admin/post/index */
export async function getJobList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/post/index', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 新增岗位 POST /api/admin/post/add */
export async function addJob(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/post/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新岗位 POST /api/admin/post/update */
export async function updateJob(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/post/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除岗位 POST /api/admin/post/delete */
export async function deleteJob(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/post/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 移动岗位 POST /api/admin/organization/move */
export async function moveJob(
  body: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any;
  }>('/api/admin/organization/move', {
    method: 'POST',
    data: { ...body, type: 'job' },
    ...(options || {}),
  });
}
