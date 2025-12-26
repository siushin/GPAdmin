import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  addMenu,
  deleteMenu,
  getMenuList,
  getMenuTree,
  updateMenu,
} from '@/services/api/system';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import MenuForm from '../system/components/MenuForm';

const Menu: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [parentMenuOptions, setParentMenuOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    const loadParentMenus = async () => {
      try {
        const res = await getMenuTree();
        if (res.code === 200 && res.data) {
          const formatOptions = (
            menus: any[],
          ): Array<{ label: string; value: number }> => {
            const options: Array<{ label: string; value: number }> = [];
            const traverse = (items: any[], level = 0) => {
              items.forEach((item) => {
                const prefix = '  '.repeat(level);
                options.push({
                  label: `${prefix}${item.menu_name}`,
                  value: item.id || item.menu_id,
                });
                if (item.children && item.children.length > 0) {
                  traverse(item.children, level + 1);
                }
              });
            };
            traverse(menus);
            return options;
          };
          setParentMenuOptions(formatOptions(res.data));
        }
      } catch (error) {
        console.error('加载父菜单列表失败:', error);
      }
    };
    loadParentMenus();
  }, []);

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
      const res = await deleteMenu({ id: record.id || record.menu_id });
      if (res.code === 200) {
        message.success('删除成功');
        actionRef.current?.reload();
        // 重新加载父菜单选项
        const treeRes = await getMenuTree();
        if (treeRes.code === 200 && treeRes.data) {
          const formatOptions = (
            menus: any[],
          ): Array<{ label: string; value: number }> => {
            const options: Array<{ label: string; value: number }> = [];
            const traverse = (items: any[], level = 0) => {
              items.forEach((item) => {
                const prefix = '  '.repeat(level);
                options.push({
                  label: `${prefix}${item.menu_name}`,
                  value: item.id || item.menu_id,
                });
                if (item.children && item.children.length > 0) {
                  traverse(item.children, level + 1);
                }
              });
            };
            traverse(menus);
            return options;
          };
          setParentMenuOptions(formatOptions(treeRes.data));
        }
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
          id: editingRecord.id || editingRecord.menu_id,
        });
      } else {
        res = await addMenu(values);
      }
      if (res.code === 200) {
        message.success(editingRecord ? '更新成功' : '新增成功');
        setFormVisible(false);
        setEditingRecord(null);
        actionRef.current?.reload();
        // 重新加载父菜单选项
        const treeRes = await getMenuTree();
        if (treeRes.code === 200 && treeRes.data) {
          const formatOptions = (
            menus: any[],
          ): Array<{ label: string; value: number }> => {
            const options: Array<{ label: string; value: number }> = [];
            const traverse = (items: any[], level = 0) => {
              items.forEach((item) => {
                const prefix = '  '.repeat(level);
                options.push({
                  label: `${prefix}${item.menu_name}`,
                  value: item.id || item.menu_id,
                });
                if (item.children && item.children.length > 0) {
                  traverse(item.children, level + 1);
                }
              });
            };
            traverse(menus);
            return options;
          };
          setParentMenuOptions(formatOptions(treeRes.data));
        }
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
      width: 150,
      render: (_, record) => record.menu_icon || '',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
      width: 100,
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
          const response = await getMenuList(requestParams);
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
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
};

export default Menu;
