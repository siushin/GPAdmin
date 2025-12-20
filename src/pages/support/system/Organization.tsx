import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Card, Col, message, Popconfirm, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  addDictionary,
  deleteDictionary,
  getDictionaryCategoryList,
  getDictionaryList,
  getDictionaryPidData,
  updateDictionary,
} from '@/services/api/support/system';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import DictionaryForm from './components/DictionaryForm';

const Organization: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [actionRef, setActionRef] = useState<ActionType | null>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // 加载数据字典分类列表
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getDictionaryCategoryList();
        if (res.code === 200 && res.data) {
          setCategoryList(res.data);
          // 默认选中第一个
          if (res.data.length > 0 && !selectedCategory) {
            setSelectedCategory(res.data[0].category_id);
          }
        }
      } catch (error) {
        console.error('加载数据字典分类失败:', error);
      }
    };
    loadCategories();
  }, []);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    actionRef?.current?.reload();
  };

  const handleAdd = () => {
    if (!selectedCategory) {
      message.warning('请先选择数据字典类型');
      return;
    }
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
        actionRef?.current?.reload();
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
        res = await updateDictionary({
          ...values,
          dictionary_id: editingRecord.dictionary_id,
        });
      } else {
        res = await addDictionary({
          ...values,
          category_id: selectedCategory,
        });
      }
      if (res.code === 200) {
        message.success(editingRecord ? '更新成功' : '新增成功');
        setFormVisible(false);
        setEditingRecord(null);
        actionRef?.current?.reload();
      } else {
        message.error(res.message || (editingRecord ? '更新失败' : '新增失败'));
      }
    } catch (_error) {
      message.error(editingRecord ? '更新失败' : '新增失败');
    }
  };

  const categoryOptions = categoryList.map((item) => ({
    label: item.category_name,
    value: item.category_id,
  }));

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
      fixed: 'left',
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
      request: async () => {
        if (!selectedCategory) return [];
        try {
          const res = await getDictionaryPidData({
            category_id: selectedCategory,
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
      <Row gutter={16}>
        {/* 左侧：数据字典分类卡片 */}
        <Col span={6}>
          <Card title="数据字典类型" bordered>
            {categoryList.map((category) => (
              <Card
                key={category.category_id}
                size="small"
                style={{
                  marginBottom: 8,
                  cursor: 'pointer',
                  border:
                    selectedCategory === category.category_id
                      ? '2px solid #1890ff'
                      : '1px solid #d9d9d9',
                }}
                onClick={() => handleCategorySelect(category.category_id)}
              >
                <div style={{ fontWeight: 'bold' }}>
                  {category.category_name}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {category.category_code}
                </div>
              </Card>
            ))}
          </Card>
        </Col>

        {/* 右侧：数据字典列表 */}
        <Col span={18}>
          <ProTable<any>
            actionRef={setActionRef}
            rowKey="dictionary_id"
            size={TABLE_SIZE}
            search={{
              labelWidth: 120,
              defaultCollapsed: false,
            }}
            request={async (params) => {
              if (!selectedCategory) {
                return {
                  data: [],
                  success: true,
                  total: 0,
                };
              }
              const requestParams: any = {
                ...params,
                category_id: selectedCategory,
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
            headerTitle={
              selectedCategory
                ? `${categoryList.find((c) => c.category_id === selectedCategory)?.category_name || ''} - 数据字典列表`
                : '请选择数据字典类型'
            }
            scroll={{ x: 'max-content' }}
            toolBarRender={() => [
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                disabled={!selectedCategory}
              >
                新增
              </Button>,
            ]}
          />
        </Col>
      </Row>

      <DictionaryForm
        visible={formVisible}
        editingRecord={
          editingRecord
            ? { ...editingRecord, category_id: selectedCategory }
            : null
        }
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

export default Organization;
