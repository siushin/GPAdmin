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

interface PositionFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const PositionForm: React.FC<PositionFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  const [departmentOptions, setDepartmentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    if (visible) {
      loadDepartmentOptions();
    }
  }, [visible]);

  const loadDepartmentOptions = async () => {
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
        setDepartmentOptions(options);
      }
    } catch (error) {
      console.error('加载部门选项失败:', error);
      setDepartmentOptions([]);
    }
  };

  return (
    <DrawerForm
      title={editingRecord ? '编辑职位' : '新增职位'}
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
        status: editingRecord?.status ?? 1,
        sort_order: editingRecord?.sort_order ?? 0,
      }}
      width={MODAL_WIDTH.MEDIUM}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormText
        name="position_name"
        label="职位名称"
        rules={[{ required: true, message: '请输入职位名称' }]}
        fieldProps={{
          placeholder: '请输入职位名称',
        }}
      />
      <ProFormText
        name="position_code"
        label="职位编码"
        fieldProps={{
          placeholder: '请输入职位编码（可选）',
        }}
      />
      <ProFormSelect
        name="department_id"
        label="所属部门"
        options={departmentOptions}
        fieldProps={{
          placeholder: '请选择所属部门（可选）',
          showSearch: true,
        }}
      />
      <ProFormTextArea
        name="job_description"
        label="职位描述"
        fieldProps={{
          placeholder: '请输入职位描述（可选）',
          rows: 3,
        }}
      />
      <ProFormTextArea
        name="job_requirements"
        label="任职要求"
        fieldProps={{
          placeholder: '请输入任职要求（可选）',
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

export default PositionForm;
