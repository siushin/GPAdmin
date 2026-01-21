import * as Icons from '@ant-design/icons';
import React from 'react';

interface IconDisplayProps {
  /**
   * 图标名称，如 'AppstoreOutlined'
   */
  iconName?: string | null;
  /**
   * 图标大小
   */
  fontSize?: number;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

/**
 * 根据图标名称动态获取并显示图标组件
 */
const IconDisplay: React.FC<IconDisplayProps> = ({
  iconName,
  fontSize = 18,
  style,
}) => {
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
      return React.createElement(IconComponent, {
        style: { fontSize, ...style },
      });
    }
  }

  return null;
};

export default IconDisplay;
