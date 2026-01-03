/**
 * 分页参数统一处理工具
 * 统一使用 page 作为分页参数名
 */

/**
 * 标准化分页参数：确保使用 page 和 pageSize
 * @param params 请求参数对象
 * @returns 标准化后的参数对象
 */
export function normalizePaginationParams<T extends Record<string, any>>(
  params: T,
): Omit<T, 'current'> & { page?: number; pageSize?: number } {
  const { current, page, pageSize, ...rest } = params;

  const normalized: any = { ...rest };

  // 统一使用 page
  if (page !== undefined && page !== null) {
    normalized.page = page;
  }

  // 保留 pageSize
  if (pageSize !== undefined && pageSize !== null) {
    normalized.pageSize = pageSize;
  }

  return normalized;
}
