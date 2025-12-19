import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Empty, Row, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { getMyApps } from '@/services/ant-design-pro/api';

const { Title, Paragraph } = Typography;

interface AppItem {
  name: string;
  alias: string;
  description: string;
  keywords: string[];
  priority: number;
  enabled: boolean;
  path: string;
}

const My: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await getMyApps();
      if (response.code === 200 && response.data) {
        setApps(response.data);
      }
    } catch (error) {
      console.error('获取应用列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        {apps.length === 0 && !loading ? (
          <Empty description="暂无应用" />
        ) : (
          <Row gutter={[16, 16]}>
            {apps.map((app) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} key={app.name}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: 8,
                  }}
                  styles={{
                    body: {
                      padding: 20,
                    },
                  }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <AppstoreOutlined
                        style={{
                          fontSize: 24,
                          color: app.enabled ? '#52c41a' : '#d9d9d9',
                          marginRight: 8,
                        }}
                      />
                      <Title level={5} style={{ margin: 0, flex: 1 }}>
                        {app.alias}
                      </Title>
                      {app.enabled ? (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          已启用
                        </Tag>
                      ) : (
                        <Tag icon={<CloseCircleOutlined />} color="default">
                          未启用
                        </Tag>
                      )}
                    </div>
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: false }}
                      style={{ margin: 0, color: '#666', fontSize: 14 }}
                    >
                      {app.description || '暂无描述'}
                    </Paragraph>
                  </div>
                  {app.keywords && app.keywords.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      {app.keywords.map((keyword) => (
                        <Tag
                          key={`${app.name}-${keyword}`}
                          style={{ marginBottom: 4 }}
                        >
                          {keyword}
                        </Tag>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
                    模块名: {app.name}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </PageContainer>
  );
};

export default My;
