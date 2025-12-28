import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addDepartment,
  deleteDepartment,
  getDepartmentList,
  updateDepartment,
} from '@/services/api/organization';
import { TABLE_SIZE } from '@/utils/constants';
import DepartmentForm from './components/DepartmentForm';

const Department: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
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
      const res = await deleteDepartment({
        department_id: record.department_id,
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

  const handleFormSubmit = async (values: any) => {
    try {
      let res: { code: number; message: string; data?: any };
      if (editingRecord) {
        res = await updateDepartment({
          ...values,
          department_id: editingRecord.department_id,
        });
      } else {
        res = await addDepartment(values);
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
      title: '部门名称',
      dataIndex: 'department_name',
      width: 300,
      fieldProps: {
        placeholder: '请输入部门名称',
      },
      render: (_, record) => record.department_name || '',
    },
    {
      title: '部门编码',
      dataIndex: 'department_code',
      width: 150,
      fieldProps: {
        placeholder: '请输入部门编码',
      },
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '正常', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'success' : 'error'}>
          {record.status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
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
            title="确定要删除这条数据吗？删除将同时删除所有子级数据"
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
        rowKey="department_id"
        size={TABLE_SIZE}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const response = await getDepartmentList({
            ...params,
            department_name: params.department_name,
            department_code: params.department_code,
            status: params.status,
          });
          if (response.code === 200) {
            // 后端返回的是树形结构
            return {
              data: response.data || [],
              success: true,
            };
          }
          return {
            data: [],
            success: false,
          };
        }}
        columns={columns}
        dateFormatter="string"
        headerTitle="部门列表"
        scroll={{ x: 'max-content' }}
        pagination={false}
        defaultExpandAllRows
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
      <DepartmentForm
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

export default Department;
