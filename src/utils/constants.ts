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

/**
 * 将表单值中的 undefined 和 null 转换为空字符串，确保清空的下拉框值也能传递到后端
 * 确保所有字段都被包含，不要过滤任何字段
 * @param values 表单值对象
 * @returns 处理后的表单值对象
 */
export const processFormValues = (values: any): any => {
  if (!values || typeof values !== 'object') {
    return values;
  }
  // 处理所有字段，将 undefined 和 null 转换为空字符串，确保所有字段都被传递
  return Object.keys(values).reduce((acc: any, key) => {
    const value = values[key];
    // 将 undefined 和 null 转换为空字符串，其他值保持不变
    acc[key] = value === undefined || value === null ? '' : value;
    return acc;
  }, {});
};

/**
 * 确保表单所有字段都被包含在提交数据中，即使字段值为空
 * @param formRef 表单引用
 * @param values 表单提交的值
 * @param allFields 所有表单字段名称数组
 * @returns 包含所有字段的完整表单值对象
 */
export const ensureAllFormFields = (
  formRef: any,
  values: any,
  allFields: string[],
): any => {
  // 获取表单所有字段的值
  const allValues = formRef?.current?.getFieldsValue() || {};
  // 构建完整的表单值，确保所有字段都被包含
  const completeValues: any = {};
  allFields.forEach((field) => {
    // 优先使用 values 中的值，如果没有则使用 allValues 中的值，都没有则使用空字符串
    completeValues[field] =
      values[field] !== undefined
        ? values[field]
        : allValues[field] !== undefined
          ? allValues[field]
          : '';
  });
  return completeValues;
};
