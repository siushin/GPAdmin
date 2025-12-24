import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Menu, message, Popconfirm, Space } from 'antd';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  addOrganization,
  deleteOrganization,
  getOrganizationList,
  getOrganizationTypeList,
  moveOrganization,
  updateOrganization,
} from '@/services/api/system';
import { TABLE_SIZE } from '@/utils/constants';
import OrganizationForm from '../organization/components/OrganizationForm';
import useStyles from '../organization/style.style';

const DictTree: React.FC = () => {
  const { styles } = useStyles();
  const [selectedType, setSelectedType] = useState<number>(0);
  const [typeList, setTypeList] = useState<
    Array<{
      dictionary_id: number;
      dictionary_name: string;
      dictionary_value: string;
    }>
  >([]);
  const actionRef = useRef<ActionType | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [moveFormVisible, setMoveFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isAddChild, setIsAddChild] = useState(false);
  const [movingRecord, setMovingRecord] = useState<any>(null);
  const dom = useRef<HTMLDivElement>(null);
  const [initConfig, setInitConfig] = useState<{
    mode: 'inline' | 'horizontal';
  }>({
    mode: 'inline',
  });

  // 加载组织架构类型列表
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const res = await getOrganizationTypeList();
        if (res.code === 200 && res.data) {
          setTypeList(res.data);
          // 默认选中第一个
          if (res.data.length > 0 && selectedType === 0) {
            setSelectedType(res.data[0].dictionary_id);
          }
        }
      } catch (error) {
        console.error('加载组织架构类型失败:', error);
      }
    };
    loadTypes();
  }, []);

  // 响应式处理
  useLayoutEffect(() => {
    const resize = () => {
      requestAnimationFrame(() => {
        if (!dom.current) {
          return;
        }
        let mode: 'inline' | 'horizontal' = 'inline';
        const { offsetWidth } = dom.current;
        if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
          mode = 'horizontal';
        }
        if (window.innerWidth < 768 && offsetWidth > 400) {
          mode = 'horizontal';
        }
        setInitConfig({
          mode: mode as 'inline' | 'horizontal',
        });
      });
    };
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleTypeSelect = (typeKey: string) => {
    setSelectedType(Number(typeKey));
    // dictionary_id 的变化会自动导致 ProTable 重新挂载并请求数据，同时清空搜索表单
  };

  const handleAdd = () => {
    if (!selectedType || selectedType === 0) {
      message.warning('请先选择组织架构类型');
      return;
    }
    setEditingRecord(null);
    setIsAddChild(false);
    setFormVisible(true);
  };

  const handleAddChild = (record: any) => {
    setEditingRecord(record);
    setIsAddChild(true);
    setFormVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsAddChild(false);
    setFormVisible(true);
  };

  const handleMove = (record: any) => {
    setMovingRecord(record);
    setMoveFormVisible(true);
  };

  const handleDelete = async (record: any) => {
    try {
      const res = await deleteOrganization({
        organization_id: record.organization_id,
      });
      if (res.code === 200) {
        message.success('删除成功');
        // 删除后清空搜索条件并重新加载
        actionRef.current?.reloadAndRest?.();
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
      if (editingRecord && !isAddChild) {
        // 编辑
        res = await updateOrganization({
          ...values,
          organization_id: editingRecord.organization_id,
        });
      } else {
        // 新增或添加下级
        const submitValues = isAddChild
          ? { ...values, organization_pid: editingRecord?.organization_id || 0 }
          : { ...values, organization_pid: values.organization_pid || 0 };
        res = await addOrganization({
          ...submitValues,
          organization_tid: selectedType,
        });
      }
      if (res.code === 200) {
        message.success(editingRecord && !isAddChild ? '更新成功' : '新增成功');
        setFormVisible(false);
        setEditingRecord(null);
        setIsAddChild(false);
        // 操作后清空搜索条件并重新加载
        actionRef.current?.reloadAndRest?.();
      } else {
        message.error(
          res.message ||
            (editingRecord && !isAddChild ? '更新失败' : '新增失败'),
        );
      }
    } catch (_error) {
      message.error(editingRecord && !isAddChild ? '更新失败' : '新增失败');
    }
  };

  const handleMoveSubmit = async (values: any) => {
    try {
      const res = await moveOrganization({
        organization_id: movingRecord.organization_id,
        belong_organization_id: values.belong_organization_id,
      });
      if (res.code === 200) {
        message.success('移动成功');
        setMoveFormVisible(false);
        setMovingRecord(null);
        // 移动后清空搜索条件并重新加载
        actionRef.current?.reloadAndRest?.();
      } else {
        message.error(res.message || '移动失败');
      }
    } catch (_error) {
      message.error('移动失败');
    }
  };

  const menuItems = typeList.map((type) => ({
    key: String(type.dictionary_id),
    label: type.dictionary_value,
  }));

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
      width: 280,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => handleAddChild(record)}
            >
              添加下级
            </Button>
            <Button type="link" size="small" onClick={() => handleMove(record)}>
              移动
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
        );
      },
    },
  ];

  return (
    <PageContainer>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            dom.current = ref;
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={selectedType ? [String(selectedType)] : []}
            onClick={({ key }) => {
              handleTypeSelect(key as string);
            }}
            items={menuItems}
          />
        </div>
        <div className={styles.right}>
          <ProTable<any>
            key={String(selectedType)}
            actionRef={actionRef}
            rowKey="organization_id"
            size={TABLE_SIZE}
            search={{
              labelWidth: 120,
              defaultCollapsed: false,
            }}
            request={async (params) => {
              if (!selectedType || selectedType === 0) {
                return {
                  data: [],
                  success: true,
                  total: 0,
                };
              }
              const requestParams: any = {
                ...params,
                organization_tid: selectedType,
                organization_name: params.organization_name,
              };
              const response = await getOrganizationList(requestParams);
              if (response.code === 200) {
                return {
                  data: response.data || [],
                  success: true,
                  total: response.data?.length || 0,
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
            headerTitle={
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  disabled={!selectedType || selectedType === 0}
                >
                  新增
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  disabled={!selectedType || selectedType === 0}
                >
                  导入
                </Button>
              </Space>
            }
            scroll={{ x: 'max-content' }}
            pagination={false}
            expandable={{
              defaultExpandAllRows: true,
            }}
          />
        </div>
      </div>

      <OrganizationForm
        visible={formVisible}
        editingRecord={editingRecord}
        isAddChild={isAddChild}
        selectedType={String(selectedType)}
        onCancel={() => {
          setFormVisible(false);
          setEditingRecord(null);
          setIsAddChild(false);
        }}
        onSubmit={handleFormSubmit}
        getOrganizationList={getOrganizationList}
        selectedTypeForFilter={String(selectedType)}
      />

      {moveFormVisible && (
        <OrganizationForm
          visible={moveFormVisible}
          editingRecord={movingRecord}
          isMove={true}
          selectedType={String(selectedType)}
          onCancel={() => {
            setMoveFormVisible(false);
            setMovingRecord(null);
          }}
          onSubmit={handleMoveSubmit}
          getOrganizationList={getOrganizationList}
          selectedTypeForFilter={String(selectedType)}
        />
      )}
    </PageContainer>
  );
};

export default DictTree;
