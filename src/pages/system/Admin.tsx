import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Segmented, Space, Tag } from 'antd';
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
import AdminDetailDrawer from './components/AdminDetailDrawer';
import AdminForm from './components/AdminForm';

const Admin: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  // 账号状态筛选：'all' | 0 | 1，默认 'all'
  const [statusFilter, setStatusFilter] = useState<'all' | 0 | 1>('all');

  const handleAdd = () => {
    setEditingRecord(null);
    setFormVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormVisible(true);
  };

  const handleView = (record: any) => {
    setViewingRecord(record);
    setDetailVisible(true);
  };

  const handleDelete = async (record: any) => {
    try {
      const res = await deleteAdmin({ account_id: record.account_id });
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
          account_id: editingRecord.account_id,
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

  // 状态筛选切换处理
  const handleStatusFilterChange = (value: string | number) => {
    setStatusFilter(value as 'all' | 0 | 1);
    // 重置分页到第一页并重新加载数据
    actionRef.current?.reloadAndRest?.();
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
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '用户名、姓名、手机号、邮箱',
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      fixed: 'left',
      hideInSearch: true,
      render: (_, record) => record.username || '',
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      width: 120,
      fixed: 'left',
      hideInSearch: true,
      render: (_, record) => record.nickname || '',
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
      fixed: 'left',
      hideInSearch: true, // 状态筛选使用 Segmented 组件
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'success' : 'error'}>
          {record.status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '是否超级管理员',
      dataIndex: 'is_super',
      valueType: 'select',
      valueEnum: {
        1: { text: '是', status: 'Success' },
        0: { text: '否', status: 'Default' },
      },
      width: 120,
      fixed: 'left',
      hideInTable: false,
      fieldProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      render: (_, record) => (
        <Tag color={record.is_super === 1 ? 'success' : 'default'}>
          {record.is_super === 1 ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      hideInSearch: true,
      width: 130,
      render: (_, record) => record.phone || '',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true,
      width: 180,
      render: (_, record) => record.email || '',
    },
    {
      title: '所属公司',
      dataIndex: 'company_name',
      hideInSearch: true,
      width: 150,
      render: (_, record) => record.company_name || '',
    },
    {
      title: '所属部门',
      dataIndex: 'department_name',
      hideInSearch: true,
      width: 150,
      render: (_, record) => record.department_name || '',
    },
    {
      title: '最后登录IP',
      dataIndex: 'last_login_ip',
      hideInSearch: true,
      width: 130,
      render: (_, record) => record.last_login_ip || '',
    },
    {
      title: '最后登录地',
      dataIndex: 'last_login_location',
      hideInSearch: true,
      width: 150,
      render: (_, record) => record.last_login_location || '',
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      fieldProps: dateRangeFieldProps,
      render: (_, record) => {
        if (!record.last_login_time) return '';
        try {
          return dayjs(record.last_login_time).format('YYYY-MM-DD HH:mm:ss');
        } catch (_e) {
          return record.last_login_time;
        }
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
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
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
        rowKey="account_id"
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

          // 根据 statusFilter 设置状态筛选（覆盖表单中的status值）
          if (statusFilter === 'all') {
            // 全部：显示 0（禁用）和 1（正常）
            requestParams.status = [0, 1];
          } else {
            // 根据 Segmented 选择的状态筛选
            requestParams.status = statusFilter;
          }

          // 是否超级管理员筛选从搜索表单中获取（如果未选择则不传该参数）
          if (
            params.is_super !== undefined &&
            params.is_super !== null &&
            params.is_super !== ''
          ) {
            requestParams.is_super = params.is_super;
          }

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
          <Segmented
            key="statusSegmented"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={[
              { label: '全部', value: 'all' },
              { label: '正常', value: 1 },
              { label: '禁用', value: 0 },
            ]}
          />,
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
      <AdminDetailDrawer
        visible={detailVisible}
        record={viewingRecord}
        onClose={() => {
          setDetailVisible(false);
          setViewingRecord(null);
        }}
      />
    </PageContainer>
  );
};

export default Admin;
