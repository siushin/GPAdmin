/* eslint-disable */
import { request } from '@umijs/max';

// ========== 公司管理 API ==========

/** 公司列表 POST /api/admin/organization/index */
export async function getCompanyList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any[];
  }>('/api/admin/organization/index', {
    method: 'POST',
    data: { ...params, type: 'company' },
    ...(options || {}),
  });
}

/** 新增公司 POST /api/admin/organization/add */
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
  }>('/api/admin/organization/add', {
    method: 'POST',
    data: { ...body, type: 'company' },
    ...(options || {}),
  });
}

/** 更新公司 POST /api/admin/organization/update */
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
  }>('/api/admin/organization/update', {
    method: 'POST',
    data: { ...body, type: 'company' },
    ...(options || {}),
  });
}

/** 删除公司 POST /api/admin/organization/delete */
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
  }>('/api/admin/organization/delete', {
    method: 'POST',
    data: { ...body, type: 'company' },
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

/** 部门列表 POST /api/admin/organization/index */
export async function getDepartmentList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any[];
  }>('/api/admin/organization/index', {
    method: 'POST',
    data: { ...params, type: 'department' },
    ...(options || {}),
  });
}

/** 新增部门 POST /api/admin/organization/add */
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
  }>('/api/admin/organization/add', {
    method: 'POST',
    data: { ...body, type: 'department' },
    ...(options || {}),
  });
}

/** 更新部门 POST /api/admin/organization/update */
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
  }>('/api/admin/organization/update', {
    method: 'POST',
    data: { ...body, type: 'department' },
    ...(options || {}),
  });
}

/** 删除部门 POST /api/admin/organization/delete */
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
  }>('/api/admin/organization/delete', {
    method: 'POST',
    data: { ...body, type: 'department' },
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

/** 职位列表 POST /api/admin/organization/index */
export async function getPositionList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any[];
  }>('/api/admin/organization/index', {
    method: 'POST',
    data: { ...params, type: 'position' },
    ...(options || {}),
  });
}

/** 新增职位 POST /api/admin/organization/add */
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
  }>('/api/admin/organization/add', {
    method: 'POST',
    data: { ...body, type: 'position' },
    ...(options || {}),
  });
}

/** 更新职位 POST /api/admin/organization/update */
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
  }>('/api/admin/organization/update', {
    method: 'POST',
    data: { ...body, type: 'position' },
    ...(options || {}),
  });
}

/** 删除职位 POST /api/admin/organization/delete */
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
  }>('/api/admin/organization/delete', {
    method: 'POST',
    data: { ...body, type: 'position' },
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

/** 岗位列表 POST /api/admin/organization/index */
export async function getJobList(
  params?: {
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data?: any[];
  }>('/api/admin/organization/index', {
    method: 'POST',
    data: { ...params, type: 'job' },
    ...(options || {}),
  });
}

/** 新增岗位 POST /api/admin/organization/add */
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
  }>('/api/admin/organization/add', {
    method: 'POST',
    data: { ...body, type: 'job' },
    ...(options || {}),
  });
}

/** 更新岗位 POST /api/admin/organization/update */
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
  }>('/api/admin/organization/update', {
    method: 'POST',
    data: { ...body, type: 'job' },
    ...(options || {}),
  });
}

/** 删除岗位 POST /api/admin/organization/delete */
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
  }>('/api/admin/organization/delete', {
    method: 'POST',
    data: { ...body, type: 'job' },
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
