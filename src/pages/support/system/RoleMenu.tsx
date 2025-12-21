import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  addRoleMenu,
  deleteRoleMenu,
  getMenuTree,
  getRoleList,
  getRoleMenuList,
} from '@/services/api/support/system';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import { dateRangeFieldProps } from '@/utils/datePresets';
import RoleMenuForm from './components/RoleMenuForm';

const RoleMenu: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);

  const handleAdd = () => {
    setFormVisible(true);
  };

  const handleDelete = async (record: any) => {
    try {
      const res = await deleteRoleMenu({
        id: record.id || record.role_menu_id,
      });
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

  const handleFormSubmit = async () => {
    setFormVisible(false);
    actionRef.current?.reload();
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
      title: '角色ID',
      dataIndex: 'role_id',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      width: 150,
      fieldProps: {
        placeholder: '请输入角色名称',
      },
    },
    {
      title: '角色编码',
      dataIndex: 'role_code',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '菜单ID',
      dataIndex: 'menu_id',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '菜单名称',
      dataIndex: 'menu_name',
      width: 150,
      fieldProps: {
        placeholder: '请输入菜单名称',
      },
    },
    {
      title: '菜单路径',
      dataIndex: 'menu_path',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '角色名称、菜单名称',
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除这条关联吗？"
          onConfirm={() => handleDelete(record)}
        >
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>
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
          const response = await getRoleMenuList(requestParams);
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
        headerTitle="角色菜单关联列表"
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
      <RoleMenuForm
        visible={formVisible}
        onCancel={() => {
          setFormVisible(false);
        }}
        onSubmit={handleFormSubmit}
        getRoleList={getRoleList}
        getMenuTree={getMenuTree}
      />
    </PageContainer>
  );
};

export default RoleMenu;
