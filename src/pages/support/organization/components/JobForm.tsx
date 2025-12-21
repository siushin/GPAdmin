import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

interface JobFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  getJobList: (params?: any) => Promise<any>;
}

const JobForm: React.FC<JobFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
  getJobList,
}) => {
  const [parentOptions, setParentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    if (visible) {
      loadParentOptions();
    }
  }, [visible]);

  const loadParentOptions = async () => {
    try {
      const res = await getJobList();
      if (res.code === 200 && res.data) {
        // 将树形数据转换为扁平列表
        const flattenData = (data: any[]): any[] => {
          const result: any[] = [];
          data.forEach((item) => {
            result.push({
              label: item.organization_name,
              value: item.organization_id,
            });
            if (item.children && item.children.length > 0) {
              result.push(...flattenData(item.children));
            }
          });
          return result;
        };
        const options = flattenData(res.data);
        // 编辑时，排除自己和子级
        if (editingRecord) {
          const excludeIds = [editingRecord.organization_id];
          setParentOptions(
            options.filter((opt) => !excludeIds.includes(opt.value)),
          );
        } else {
          setParentOptions(options);
        }
      }
    } catch (error) {
      console.error('加载父级选项失败:', error);
    }
  };

  return (
    <DrawerForm
      title={editingRecord ? '编辑岗位' : '新增岗位'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      onFinish={async (values) => {
        await onSubmit(values);
        return true;
      }}
      initialValues={
        editingRecord
          ? {
              organization_name: editingRecord.organization_name,
              organization_pid: editingRecord.organization_pid,
            }
          : {
              organization_pid: 0,
            }
      }
      width={600}
    >
      <ProFormText
        name="organization_name"
        label="岗位名称"
        rules={[{ required: true, message: '请输入岗位名称' }]}
        fieldProps={{
          placeholder: '请输入岗位名称',
        }}
      />
      <ProFormSelect
        name="organization_pid"
        label="上级岗位"
        options={parentOptions}
        fieldProps={{
          placeholder: '请选择上级岗位（不选则为顶级）',
          showSearch: true,
        }}
        extra="不选择则作为顶级岗位创建"
      />
    </DrawerForm>
  );
};

export default JobForm;
