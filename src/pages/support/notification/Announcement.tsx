import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';
import React from 'react';

const Announcement: React.FC = () => {
  return (
    <PageContainer>
      <Empty description="公告管理功能开发中..." />
    </PageContainer>
  );
};

export default Announcement;
