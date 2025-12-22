import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addJob,
  deleteJob,
  getJobList,
  updateJob,
} from '@/services/api/organization';
import { TABLE_SIZE } from '@/utils/constants';
import JobForm from './components/JobForm';

const Job: React.FC = () => {
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
      const res = await deleteJob({
        organization_id: record.organization_id,
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
        res = await updateJob({
          ...values,
          organization_id: editingRecord.organization_id,
        });
      } else {
        res = await addJob(values);
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
      title: '组织名称',
      dataIndex: 'organization_name',
      width: 300,
      fieldProps: {
        placeholder: '请输入组织名称',
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
        rowKey="organization_id"
        size={TABLE_SIZE}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const response = await getJobList({
            ...params,
            organization_name: params.organization_name,
          });
          if (response.code === 200) {
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
        headerTitle="岗位列表"
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
      <JobForm
        visible={formVisible}
        editingRecord={editingRecord}
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
        getJobList={getJobList}
      />
    </PageContainer>
  );
};

export default Job;
