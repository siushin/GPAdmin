/**
 * 分页参数转换工具
 * 将前端使用的 current 转换为后端需要的 page
 */

/**
 * 转换分页参数：将 current 转换为 page，删除多余的 current 字段
 * @param params 请求参数对象
 * @returns 转换后的参数对象
 */
export function transformPaginationParams<T extends Record<string, any>>(
  params: T,
): Omit<T, 'current'> & { page?: number; pageSize?: number } {
  const { current, pageSize, ...rest } = params;

  const transformed: any = { ...rest };

  // 如果存在 current，转换为 page
  if (current !== undefined && current !== null) {
    transformed.page = current;
  }

  // 保留 pageSize
  if (pageSize !== undefined && pageSize !== null) {
    transformed.pageSize = pageSize;
  }

  return transformed;
}
