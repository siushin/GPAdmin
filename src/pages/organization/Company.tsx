import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addCompany,
  deleteCompany,
  getCompanyList,
  updateCompany,
} from '@/services/api/organization';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import CompanyDetail from './components/CompanyDetail';
import CompanyForm from './components/CompanyForm';

const Company: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<any>(null);

  const handleAdd = () => {
    setEditingRecord(null);
    setFormVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormVisible(true);
  };

  const handleDetail = (record: any) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  const handleDelete = async (record: any) => {
    try {
      const res = await deleteCompany({
        company_id: record.company_id,
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
        res = await updateCompany({
          ...values,
          company_id: editingRecord.company_id,
        });
      } else {
        res = await addCompany(values);
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
      title: '公司名称',
      dataIndex: 'company_name',
      width: 200,
      ellipsis: true,
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入公司名称',
      },
      render: (_, record) => record.company_name || '',
    },
    {
      title: '公司编码',
      dataIndex: 'company_code',
      width: 150,
      fieldProps: {
        placeholder: '请输入公司编码',
      },
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'company_credit_code',
      width: 180,
      hideInSearch: true,
      copyable: true,
      render: (_, record) => record.company_credit_code || '-',
    },
    {
      title: '法人代表',
      dataIndex: 'legal_person',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.legal_person || '-',
    },
    {
      title: '联系电话',
      dataIndex: 'contact_phone',
      width: 130,
      hideInSearch: true,
      render: (_, record) => record.contact_phone || '-',
    },
    {
      title: '联系邮箱',
      dataIndex: 'contact_email',
      width: 180,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => record.contact_email || '-',
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
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'success' : 'error'}>
          {record.status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            created_at_start: value[0],
            created_at_end: value[1],
          };
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: 180,
      hideInSearch: true,
      render: (_, record) => record.created_at || '',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleDetail(record)}>
            详情
          </Button>
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
        rowKey="company_id"
        size={TABLE_SIZE}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const requestParams: any = {
            ...params,
            current: params.current || 1,
            pageSize: params.pageSize ?? 10,
          };
          const response = await getCompanyList(requestParams);
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
        dateFormatter="string"
        headerTitle="公司列表"
        scroll={{ x: 'max-content' }}
        pagination={{
          ...DEFAULT_PAGINATION,
          pageSize,
          onShowSizeChange: (_current, size) => {
            setPageSize(size);
          },
        }}
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
      <CompanyForm
        visible={formVisible}
        editingRecord={editingRecord}
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
      />
      <CompanyDetail
        visible={detailVisible}
        record={detailRecord}
        onClose={() => {
          setDetailVisible(false);
          setDetailRecord(null);
        }}
      />
    </PageContainer>
  );
};

export default Company;
