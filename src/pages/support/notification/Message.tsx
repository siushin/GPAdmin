import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';
import React from 'react';

const Message: React.FC = () => {
  return (
    <PageContainer>
      <Empty description="站内信功能开发中..." />
    </PageContainer>
  );
};

export default Message;
