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

/**
 * 系统参数标识枚举
 */
export const SysParamFlag = {
  No: 0, // 否
  Yes: 1, // 是
} as const;

/**
 * 弹窗尺寸常量
 */
export const MODAL_WIDTH = {
  SMALL: 400, // 小尺寸弹窗
  SMALL_MEDIUM: 500, // 中小尺寸弹窗
  MEDIUM: 600, // 中等尺寸弹窗
  LARGE: 800, // 大尺寸弹窗
  XLARGE: 1000, // 超大尺寸弹窗
} as const;
