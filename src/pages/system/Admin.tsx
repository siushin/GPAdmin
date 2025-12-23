import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  addAdmin,
  deleteAdmin,
  getAdminList,
  updateAdmin,
} from '@/services/api/system';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import { dateRangeFieldProps } from '@/utils/datePresets';
import AdminForm from './components/AdminForm';

const Admin: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

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
      const res = await deleteAdmin({ id: record.id || record.user_id });
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
        res = await updateAdmin({
          ...values,
          id: editingRecord.id || editingRecord.user_id,
        });
      } else {
        res = await addAdmin(values);
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

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
      fixed: 'left',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
      fieldProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      title: '账号类型',
      dataIndex: 'account_type',
      valueType: 'select',
      valueEnum: {
        admin: { text: '管理员', status: 'Success' },
        user: { text: '用户', status: 'Default' },
      },
      width: 120,
    },
    {
      title: '是否超级管理员',
      dataIndex: 'is_super',
      valueType: 'select',
      valueEnum: {
        1: { text: '是', status: 'Success' },
        0: { text: '否', status: 'Default' },
      },
      width: 130,
      render: (_, record) => (
        <Tag color={record.is_super === 1 ? 'red' : 'default'}>
          {record.is_super === 1 ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '所属公司ID',
      dataIndex: 'company_id',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '所属部门ID',
      dataIndex: 'department_id',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '正常', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
      width: 100,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'success' : 'error'}>
          {record.status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录IP',
      dataIndex: 'last_login_ip',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      fieldProps: dateRangeFieldProps,
      render: (_, record) => {
        if (!record.last_login_time) return '-';
        try {
          return dayjs(record.last_login_time).format('YYYY-MM-DD HH:mm:ss');
        } catch (_e) {
          return record.last_login_time;
        }
      },
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '用户名、IP地址',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      fieldProps: dateRangeFieldProps,
      render: (_, record) => {
        if (!record.created_at) return '-';
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
            page: params.current || 1,
            pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
          };
          const response = await getAdminList(requestParams);
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
        headerTitle="管理员列表"
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
      <AdminForm
        visible={formVisible}
        editingRecord={editingRecord}
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
};

export default Admin;
