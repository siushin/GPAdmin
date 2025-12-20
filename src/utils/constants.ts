/**
 * 全局常量配置
 */

/**
 * 表格尺寸常量
 * 可选值: 'large' | 'middle' | 'small'
 * 'small' 为紧凑模式
 */
export const TABLE_SIZE = 'small' as const;

/**
 * 默认分页大小
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * ProTable 全局默认分页配置
 * 注意：ProTable 使用 defaultPageSize 作为初始值，pageSize 作为受控值
 */
export const DEFAULT_PAGINATION = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
};
