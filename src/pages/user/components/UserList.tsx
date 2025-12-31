import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  addUser,
  auditUser,
  deleteUser,
  getUserList,
  updateUser,
} from '@/services/api/user';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import { dateRangeFieldProps } from '@/utils/datePresets';
import UserDetailDrawer from './UserDetailDrawer';
import UserForm from './UserForm';

interface UserListProps {
  isPending?: boolean; // true: 待审核列表, false: 用户列表
}

const UserList: React.FC<UserListProps> = ({ isPending = false }) => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any>(null);

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
      const res = await deleteUser({ account_id: record.account_id });
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

  const handleAudit = async (record: any, status: number) => {
    try {
      const res = await auditUser({
        account_id: record.account_id,
        status,
      });
      if (res.code === 200) {
        message.success(status === 1 ? '审核通过' : '审核拒绝');
        actionRef.current?.reload();
      } else {
        message.error(res.message || '审核失败');
      }
    } catch (_error) {
      message.error('审核失败');
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      let res: { code: number; message: string; data?: any };
      if (editingRecord) {
        res = await updateUser({
          ...values,
          account_id: editingRecord.account_id,
        });
      } else {
        res = await addUser(values);
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
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入用户名',
      },
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
      title: '手机号',
      dataIndex: 'phone',
      hideInSearch: true,
      width: 120,
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
      title: '账号状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '-1': { text: '待审核', status: 'Warning' },
        0: { text: '禁用', status: 'Error' },
        1: { text: '正常', status: 'Success' },
      },
      width: 100,
      hideInSearch: isPending, // 待审核列表隐藏状态筛选
      render: (_, record) => {
        const statusMap: Record<
          number | string,
          { color: string; text: string }
        > = {
          '-1': { color: 'warning', text: '待审核' },
          0: { color: 'error', text: '禁用' },
          1: { color: 'success', text: '正常' },
        };
        const statusInfo = statusMap[record.status] || statusMap[0];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '最后登录IP',
      dataIndex: 'last_login_ip',
      hideInSearch: true,
      width: 130,
      render: (_, record) => record.last_login_ip || '',
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
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '姓名、手机号、邮箱',
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
      width: isPending ? 200 : 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          {!isPending && (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => handleEdit(record)}
              >
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
            </>
          )}
          {isPending && (
            <>
              <Popconfirm
                title="确定要通过审核吗？"
                onConfirm={() => handleAudit(record, 1)}
              >
                <Button type="link" size="small" style={{ color: '#52c41a' }}>
                  通过
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要拒绝审核吗？"
                onConfirm={() => handleAudit(record, 0)}
              >
                <Button type="link" size="small" danger>
                  拒绝
                </Button>
              </Popconfirm>
            </>
          )}
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

          // 根据isPending设置status筛选条件
          if (isPending) {
            // 待审核列表：status = -1（固定条件，覆盖用户选择）
            requestParams.status = -1;
          } else {
            // 用户列表：status != -1
            // 如果用户选择了状态筛选（0或1），使用用户选择的值
            if (
              params.status !== undefined &&
              params.status !== null &&
              params.status !== ''
            ) {
              requestParams.status = params.status;
            }
            // 如果用户没有选择状态筛选，不传status参数，后续会在前端过滤掉status=-1的数据
          }

          const response = await getUserList(requestParams);
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
        headerTitle={isPending ? '待审核用户列表' : '用户列表'}
        scroll={{ x: 'max-content' }}
        toolBarRender={() =>
          [
            !isPending ? (
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                新增
              </Button>
            ) : null,
          ].filter(Boolean)
        }
      />
      {!isPending && (
        <UserForm
          visible={formVisible}
          editingRecord={editingRecord}
          onCancel={() => {
            setFormVisible(false);
            setEditingRecord(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
      <UserDetailDrawer
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

export default UserList;
