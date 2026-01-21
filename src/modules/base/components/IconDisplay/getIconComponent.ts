import * as Icons from '@ant-design/icons';
import React from 'react';

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称，如 'AppstoreOutlined'
 * @returns 图标组件，如果不存在则返回 null
 */
export const getIconComponent = (
  iconName: string | null | undefined,
): React.ComponentType<any> | null => {
  if (!iconName || typeof iconName !== 'string') {
    return null;
  }

  // 从 @ant-design/icons 中动态获取图标组件
  const IconComponent = (Icons as any)[iconName];

  if (IconComponent) {
    // 检查是否是有效的 React 组件
    const isReactComponent =
      typeof IconComponent === 'function' ||
      (typeof IconComponent === 'object' &&
        IconComponent !== null &&
        '$$typeof' in IconComponent);

    if (isReactComponent) {
      return IconComponent as React.ComponentType<any>;
    }
  }

  return null;
};
