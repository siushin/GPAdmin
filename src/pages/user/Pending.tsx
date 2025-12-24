import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';
import React from 'react';

const Pending: React.FC = () => {
  return (
    <PageContainer>
      <Empty description="待审核用户列表功能开发中..." />
    </PageContainer>
  );
};

export default Pending;
