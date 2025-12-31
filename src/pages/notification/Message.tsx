import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  addMessage,
  deleteMessage,
  getMessageList,
  updateMessage,
} from '@/services/api/notification';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import { dateRangeFieldProps } from '@/utils/datePresets';
import NotificationReadDrawer from './components/NotificationReadDrawer';

const Message: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [readDrawerVisible, setReadDrawerVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any>(null);

  const handleAdd = () => {
    setEditingRecord(null);
    setFormVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormVisible(true);
  };

  const handleDelete = async (record: any) => {
    try {
      const res = await deleteMessage({ id: record.id });
      if (res.code === 200) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (_error) {
      message.error('删除失败');
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      let res: { code: number; message: string; data?: any };
      if (editingRecord) {
        res = await updateMessage({
          ...values,
          id: editingRecord.id,
        });
      } else {
        res = await addMessage(values);
      }
      if (res.code === 200) {
        message.success(editingRecord ? '更新成功' : '新增成功');
        setFormVisible(false);
        setEditingRecord(null);
        actionRef.current?.reload();
      } else {
        message.error(res.message || (editingRecord ? '更新失败' : '新增失败'));
      }
    } catch (_error) {
      message.error(editingRecord ? '更新失败' : '新增失败');
    }
  };

  const handleViewReads = (record: any) => {
    setViewingRecord(record);
    setReadDrawerVisible(true);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
      fixed: 'left',
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入标题',
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      width: 300,
      ellipsis: true,
    },
    {
      title: '发送者ID',
      dataIndex: 'sender_id',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '接收者ID',
      dataIndex: 'receiver_id',
      width: 120,
      fieldProps: {
        placeholder: '请输入接收者ID',
      },
    },
    {
      title: '目标平台',
      dataIndex: 'target_platform',
      width: 150,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部平台' },
        user: { text: '用户端' },
        admin: { text: '管理端' },
        miniapp: { text: '小程序' },
      },
      render: (_, record) => {
        const platforms = record.target_platform?.split(',') || [];
        return (
          <Space>
            {platforms.map((p: string) => (
              <Tag key={p}>
                {p === 'all'
                  ? '全部平台'
                  : p === 'user'
                    ? '用户端'
                    : p === 'admin'
                      ? '管理端'
                      : '小程序'}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '已读', status: 'Success' },
        0: { text: '未读', status: 'Default' },
      },
      width: 100,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'success' : 'default'}>
          {record.status === 1 ? '已读' : '未读'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      fieldProps: dateRangeFieldProps,
      render: (_, record) => {
        if (!record.created_at) return '';
        try {
          return dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss');
        } catch (_e) {
          return record.created_at;
        }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewReads(record)}
          >
            查看记录
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条数据吗？"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        size={TABLE_SIZE}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const requestParams: any = {
            ...params,
            current: params.current || 1,
            pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
          };
          const response = await getMessageList(requestParams);
          if (response.code === 200) {
            return {
              data: response.data?.data || [],
              success: true,
              total: response.data?.page?.total || 0,
            };
          }
          return {
            data: [],
            success: false,
            total: 0,
          };
        }}
        columns={columns}
        pagination={{
          ...DEFAULT_PAGINATION,
          pageSize,
          onShowSizeChange: (_current, size) => {
            setPageSize(size);
          },
        }}
        dateFormatter="string"
        headerTitle="站内信列表"
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增
          </Button>,
        ]}
      />
      {/* TODO: 添加表单弹窗组件 */}
      <NotificationReadDrawer
        visible={readDrawerVisible}
        readType="message"
        targetId={viewingRecord?.id}
        title={`站内信查看记录 - ${viewingRecord?.title || ''}`}
        onClose={() => {
          setReadDrawerVisible(false);
          setViewingRecord(null);
        }}
      />
    </PageContainer>
  );
};

export default Message;
