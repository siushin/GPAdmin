import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  addDepartment,
  deleteDepartment,
  getCompanyList,
  getDepartmentList,
  updateDepartment,
} from '@/services/api/company';
import { TABLE_SIZE } from '@/utils/constants';
import { dateRangeFieldProps } from '@/utils/datePresets';
import DepartmentForm from './components/DepartmentForm';

const Department: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [companyOptions, setCompanyOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

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

  // 加载公司列表选项
  useEffect(() => {
    const loadCompanyOptions = async () => {
      try {
        const res = await getCompanyList({
          page: 1,
          pageSize: 1000,
          status: 1, // 只加载正常状态的公司
        });
        if (res.code === 200 && res.data?.data) {
          const options = res.data.data.map((item: any) => ({
            label: item.company_name,
            value: item.company_id,
          }));
          setCompanyOptions(options);
        }
      } catch (error) {
        console.error('加载公司列表失败:', error);
      }
    };
    loadCompanyOptions();
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '所属公司',
      dataIndex: 'company_id',
      valueType: 'select',
      width: 200,
      fieldProps: {
        placeholder: '请选择公司',
        allowClear: true,
        options: companyOptions,
        showSearch: true,
        filterOption: (input: string, option: any) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      },
      render: (_, record) => {
        const company = companyOptions.find(
          (opt) => opt.value === record.company_id,
        );
        return company?.label || record.company_name || '-';
      },
    },
    {
      title: '部门名称',
      dataIndex: 'department_name',
      width: 250,
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
      title: '上级部门',
      dataIndex: 'parent_id',
      width: 200,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.parent_id || record.parent_id === 0) {
          return <Tag color="default">顶级部门</Tag>;
        }
        // 这里可以显示上级部门名称，但需要从树形数据中查找
        // 暂时显示ID，实际使用时可以从树形结构中查找
        return record.parent_department_name || `ID: ${record.parent_id}`;
      },
    },
    {
      title: '部门负责人',
      dataIndex: 'manager_id',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.manager_id) return '-';
        return (
          record.manager_name ||
          record.manager_account ||
          `ID: ${record.manager_id}`
        );
      },
    },
    {
      title: '部门描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: {
        showTitle: true,
      },
      hideInSearch: true,
      render: (_, record) => record.description || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      width: 80,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => record.sort_order ?? 0,
    },
    {
      title: '创建时间',
      dataIndex: 'date_range',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: dateRangeFieldProps,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: 180,
      hideInSearch: true,
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
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 180,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.updated_at) return '-';
        try {
          return dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss');
        } catch (_e) {
          return record.updated_at;
        }
      },
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
      fieldProps: {
        placeholder: '请选择状态',
        allowClear: true,
        options: [
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
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
          const requestParams: any = {
            ...params,
            department_name: params.department_name,
            department_code: params.department_code,
            company_id: params.company_id,
            status: params.status,
          };
          // 处理日期范围
          if (params.date_range && Array.isArray(params.date_range)) {
            requestParams.start_date = params.date_range[0];
            requestParams.end_date = params.date_range[1];
          }
          const response = await getDepartmentList(requestParams);
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
