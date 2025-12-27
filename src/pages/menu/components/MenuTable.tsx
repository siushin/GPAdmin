import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IconDisplay } from '@/components';
import {
  addMenu,
  deleteMenu,
  getMenuList,
  updateMenu,
} from '@/services/api/system';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import MenuForm from './MenuForm';

interface MenuTableProps {
  accountType: 'admin' | 'user';
}

const MenuTable: React.FC<MenuTableProps> = ({ accountType }) => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [parentMenuOptions, setParentMenuOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  // 当 accountType 变化时，重新加载表格数据
  useEffect(() => {
    actionRef.current?.reload();
    // 暂时使用伪数据作为父菜单选项
    setParentMenuOptions([{ label: '顶级菜单', value: 0 }]);
  }, [accountType]);

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
      const res = await deleteMenu({ menu_id: record.menu_id });
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
        res = await updateMenu({
          ...values,
          menu_id: editingRecord.menu_id,
        });
      } else {
        res = await addMenu(values);
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
      title: '菜单名称',
      dataIndex: 'menu_name',
      width: 150,
      fieldProps: {
        placeholder: '请输入菜单名称',
      },
    },
    {
      title: '菜单Key',
      dataIndex: 'menu_key',
      width: 200,
      fieldProps: {
        placeholder: '请输入菜单Key',
      },
    },
    {
      title: '路由路径',
      dataIndex: 'menu_path',
      width: 200,
      fieldProps: {
        placeholder: '请输入路由路径',
      },
    },
    {
      title: '菜单类型',
      dataIndex: 'menu_type',
      valueType: 'select',
      valueEnum: {
        menu: { text: '菜单', status: 'Success' },
        button: { text: '按钮', status: 'Default' },
      },
      width: 100,
    },
    {
      title: '图标',
      dataIndex: 'menu_icon',
      hideInSearch: true,
      width: 60,
      render: (_, record) => <IconDisplay iconName={record.menu_icon} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
      width: 60,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'success' : 'error'}>
          {record.status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
      width: 80,
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
    <>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="menu_id"
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
            account_type: accountType,
          };
          const response = await getMenuList(requestParams);
          if (response.code === 200) {
            const data = response.data?.data || [];
            // 图标组件会在 render 函数中动态获取并显示
            return {
              data,
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
        headerTitle="菜单列表"
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
      <MenuForm
        visible={formVisible}
        editingRecord={editingRecord}
        parentMenuOptions={parentMenuOptions}
        accountType={accountType}
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default MenuTable;
