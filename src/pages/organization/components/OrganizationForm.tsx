import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

interface OrganizationFormProps {
  visible: boolean;
  editingRecord: any;
  isAddChild?: boolean;
  isMove?: boolean;
  selectedType: string;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  getOrganizationList: (params?: any) => Promise<any>;
  selectedTypeForFilter: string;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  visible,
  editingRecord,
  isAddChild = false,
  isMove = false,
  selectedType,
  onCancel,
  onSubmit,
  getOrganizationList,
  selectedTypeForFilter,
}) => {
  const [parentOptions, setParentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    if (visible) {
      loadParentOptions();
    }
  }, [visible, selectedTypeForFilter]);

  const loadParentOptions = async () => {
    try {
      const res = await getOrganizationList({
        organization_type: selectedTypeForFilter,
      });
      if (res.code === 200 && res.data) {
        // 将树形数据转换为扁平列表
        const flattenData = (data: any[], excludeId?: number): any[] => {
          const result: any[] = [];
          data.forEach((item) => {
            // 如果是移动操作，排除自己和子级
            if (isMove && editingRecord) {
              const excludeIds = [editingRecord.organization_id];
              // 检查是否是子级（通过 full_organization_pid 判断）
              if (
                editingRecord.full_organization_pid &&
                item.full_organization_pid?.includes(
                  `${editingRecord.organization_id},`,
                )
              ) {
                return;
              }
              if (excludeIds.includes(item.organization_id)) {
                return;
              }
            }
            // 如果是编辑操作，排除自己和子级
            if (!isMove && !isAddChild && editingRecord) {
              const excludeIds = [editingRecord.organization_id];
              if (
                editingRecord.full_organization_pid &&
                item.full_organization_pid?.includes(
                  `${editingRecord.organization_id},`,
                )
              ) {
                return;
              }
              if (excludeIds.includes(item.organization_id)) {
                return;
              }
            }
            // 如果是添加下级，排除自己
            if (isAddChild && editingRecord) {
              const excludeIds = [editingRecord.organization_id];
              if (excludeIds.includes(item.organization_id)) {
                return;
              }
            }
            result.push({
              label: item.organization_name,
              value: item.organization_id,
            });
            if (item.children && item.children.length > 0) {
              result.push(...flattenData(item.children, excludeId));
            }
          });
          return result;
        };
        const options = flattenData(res.data);
        setParentOptions(options);
      }
    } catch (error) {
      console.error('加载父级选项失败:', error);
    }
  };

  const getTitle = () => {
    if (isMove) {
      return '移动组织架构';
    }
    if (isAddChild) {
      return '添加下级组织架构';
    }
    return editingRecord ? '编辑组织架构' : '新增组织架构';
  };

  const getInitialValues = () => {
    if (isMove) {
      return {
        belong_organization_id: editingRecord?.organization_pid,
      };
    }
    if (isAddChild) {
      // 添加下级时，默认上级为当前记录的ID
      return {
        organization_pid: editingRecord?.organization_id || 0,
      };
    }
    if (editingRecord) {
      // 编辑时
      return {
        organization_name: editingRecord.organization_name,
        organization_pid: editingRecord.organization_pid,
      };
    }
    // 新增时
    return {
      organization_pid: 0,
    };
  };

  return (
    <ModalForm
      title={getTitle()}
      open={visible}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnHidden: true,
      }}
      onFinish={async (values) => {
        await onSubmit(values);
        return true;
      }}
      initialValues={getInitialValues()}
      width={600}
    >
      {isMove ? (
        <ProFormSelect
          name="belong_organization_id"
          label="目标组织架构"
          rules={[{ required: true, message: '请选择目标组织架构' }]}
          options={parentOptions}
          fieldProps={{
            placeholder: '请选择目标组织架构',
            showSearch: true,
          }}
          extra="选择要将此组织架构移动到的目标组织架构"
        />
      ) : (
        <div>
          <ProFormText
            name="organization_name"
            label="组织名称"
            rules={[{ required: true, message: '请输入组织名称' }]}
            fieldProps={{
              placeholder: '请输入组织名称',
              autoFocus: true,
            }}
          />
          <ProFormSelect
            name="organization_pid"
            label={isAddChild ? '上级组织架构' : '上级组织架构'}
            options={parentOptions}
            fieldProps={{
              placeholder: isAddChild
                ? '上级组织架构（默认使用当前组织）'
                : '请选择上级组织架构（不选则为顶级）',
              showSearch: true,
              disabled: isAddChild,
            }}
            extra={
              isAddChild
                ? '将在当前组织架构下创建子级组织架构'
                : '不选择则作为顶级组织架构创建'
            }
          />
        </div>
      )}
    </ModalForm>
  );
};

export default OrganizationForm;
