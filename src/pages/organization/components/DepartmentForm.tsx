import {
  DrawerForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { getDepartmentList } from '@/services/api/organization';
import { MODAL_WIDTH } from '@/utils/constants';

interface DepartmentFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
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
      const res = await getDepartmentList();
      if (res.code === 200 && res.data) {
        // 将树形数据转换为扁平列表
        const flattenData = (data: any[]): any[] => {
          const result: any[] = [];
          data.forEach((item) => {
            result.push({
              label: item.department_name,
              value: item.department_id,
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
          const excludeIds = [editingRecord.department_id];
          // 递归获取所有子部门ID
          const getAllChildIds = (data: any[], parentId: number): number[] => {
            const childIds: number[] = [];
            data.forEach((item) => {
              if (item.parent_id === parentId) {
                childIds.push(item.department_id);
                childIds.push(...getAllChildIds(data, item.department_id));
              }
            });
            return childIds;
          };
          const allData = flattenData(res.data);
          const childIds = getAllChildIds(allData, editingRecord.department_id);
          excludeIds.push(...childIds);
          setParentOptions(
            options.filter((opt) => !excludeIds.includes(opt.value)),
          );
        } else {
          setParentOptions(options);
        }
      }
    } catch (error) {
      console.error('加载父级选项失败:', error);
      setParentOptions([]);
    }
  };

  return (
    <DrawerForm
      title={editingRecord ? '编辑部门' : '新增部门'}
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
      initialValues={{
        ...(editingRecord || {}),
        parent_id: editingRecord?.parent_id ?? 0,
        status: editingRecord?.status ?? 1,
        sort_order: editingRecord?.sort_order ?? 0,
      }}
      width={MODAL_WIDTH.MEDIUM}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormText
        name="department_name"
        label="部门名称"
        rules={[{ required: true, message: '请输入部门名称' }]}
        fieldProps={{
          placeholder: '请输入部门名称',
        }}
      />
      <ProFormText
        name="department_code"
        label="部门编码"
        fieldProps={{
          placeholder: '请输入部门编码（可选）',
        }}
      />
      <ProFormSelect
        name="parent_id"
        label="上级部门"
        options={[{ label: '顶级部门', value: 0 }, ...parentOptions]}
        fieldProps={{
          placeholder: '请选择上级部门（不选则为顶级）',
          showSearch: true,
        }}
      />
      <ProFormTextArea
        name="description"
        label="部门描述"
        fieldProps={{
          placeholder: '请输入部门描述（可选）',
          rows: 3,
        }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
      <ProFormDigit
        name="sort_order"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
        }}
      />
    </DrawerForm>
  );
};

export default DepartmentForm;
