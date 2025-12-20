import { SettingOutlined } from '@ant-design/icons';
import React from 'react';

interface SettingButtonProps {
  onClick: () => void;
}

export const SettingButton: React.FC<SettingButtonProps> = ({ onClick }) => {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        cursor: 'pointer',
        borderRadius: 4,
        transition: 'background-color 0.3s',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <SettingOutlined style={{ fontSize: 18 }} />
    </span>
  );
};
