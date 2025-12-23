import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addDictionary,
  batchDeleteDictionary,
  deleteDictionary,
  getDictionaryCategoryList,
  getDictionaryList,
  getDictionaryPidData,
  updateDictionary,
} from '@/services/api/system';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import DictionaryForm from './components/DictionaryForm';

const Dict: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 加载数据字典分类选项
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  React.useEffect(() => {
    const loadCategoryOptions = async () => {
      try {
        const res = await getDictionaryCategoryList();
        if (res.code === 200 && res.data) {
          setCategoryOptions(
            res.data.map((item: any) => ({
              label: item.category_name,
              value: item.category_id,
            })),
          );
        }
      } catch (error) {
        console.error('加载数据字典分类失败:', error);
      }
    };
    loadCategoryOptions();
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
      const res = await deleteDictionary({
        dictionary_id: record.dictionary_id,
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

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的数据');
      return;
    }
    try {
      const res = await batchDeleteDictionary({
        dictionary_ids: selectedRowKeys,
      });
      if (res.code === 200) {
        message.success('批量删除成功');
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      } else {
        message.error(res.message || '批量删除失败');
      }
    } catch (_error) {
      message.error('批量删除失败');
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      let res: { code: number; message: string; data?: any };
      if (editingRecord) {
        res = await updateDictionary({
          ...values,
          dictionary_id: editingRecord.dictionary_id,
        });
      } else {
        res = await addDictionary(values);
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
      title: '字典分类',
      dataIndex: 'category_id',
      valueType: 'select',
      valueEnum: categoryOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<number, { text: string }>,
      ),
      width: 150,
      fieldProps: {
        placeholder: '请选择字典分类',
      },
    },
    {
      title: '字典名称',
      dataIndex: 'dictionary_name',
      width: 150,
      fieldProps: {
        placeholder: '请输入字典名称',
      },
    },
    {
      title: '字典值',
      dataIndex: 'dictionary_value',
      width: 150,
      fieldProps: {
        placeholder: '请输入字典值',
      },
    },
    {
      title: '父级',
      dataIndex: 'parent_id',
      valueType: 'select',
      hideInTable: true,
      request: async (params) => {
        try {
          const res = await getDictionaryPidData({
            category_id: params.category_id,
          });
          if (res.code === 200 && res.data) {
            return res.data.map((item: any) => ({
              label: item.dictionary_name,
              value: item.dictionary_id,
            }));
          }
        } catch (error) {
          console.error('加载父级数据失败:', error);
        }
        return [];
      },
      dependencies: ['category_id'],
      fieldProps: {
        placeholder: '请选择父级',
      },
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '字典名称、字典值',
      },
    },
    {
      title: '扩展数据',
      dataIndex: 'extend_data',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (!record.extend_data) return '-';
        try {
          const data =
            typeof record.extend_data === 'string'
              ? JSON.parse(record.extend_data)
              : record.extend_data;
          return JSON.stringify(data);
        } catch (_e) {
          return record.extend_data;
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
        rowKey="dictionary_id"
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
          const response = await getDictionaryList(requestParams);
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
        headerTitle="数据字典列表"
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        toolBarRender={() => [
          <Button
            key="batchDelete"
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>,
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
      <DictionaryForm
        visible={formVisible}
        editingRecord={editingRecord}
        categoryOptions={categoryOptions}
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
        getDictionaryPidData={getDictionaryPidData}
      />
    </PageContainer>
  );
};

export default Dict;
