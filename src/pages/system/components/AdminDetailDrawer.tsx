import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAdminDetail } from '@/services/api/system';
import AdminDetailContent from './AdminDetailContent';

interface AdminDetailDrawerProps {
  visible: boolean;
  record: any;
  onClose: () => void;
}

const AdminDetailDrawer: React.FC<AdminDetailDrawerProps> = ({
  visible,
  record,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<{
    account: any;
    profile: any;
    admin: any;
    social: Array<any>;
  } | null>(null);

  useEffect(() => {
    if (visible && record?.id) {
      loadDetailData();
    } else {
      setDetailData(null);
    }
  }, [visible, record]);

  const loadDetailData = async () => {
    if (!record?.id) return;

    setLoading(true);
    try {
      const res = await getAdminDetail({ id: record.id || record.user_id });
      if (res.code === 200 && res.data) {
        setDetailData(res.data);
      }
    } catch (error) {
      console.error('加载管理员详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="管理员详情"
      width={1200}
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      {detailData ? (
        <AdminDetailContent detailData={detailData} loading={loading} />
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          {loading ? '加载中...' : '暂无数据'}
        </div>
      )}
    </Drawer>
  );
};

export default AdminDetailDrawer;
