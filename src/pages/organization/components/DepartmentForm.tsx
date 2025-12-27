import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { getCompanyList, getDepartmentList } from '@/services/api/organization';
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
  const [companyOptions, setCompanyOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [parentOptions, setParentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    if (visible) {
      loadOptions();
    }
  }, [visible, editingRecord]);

  const loadOptions = async () => {
    try {
      // 加载公司列表
      const companyRes = await getCompanyList({ page: 1, pageSize: 1000 });
      if (companyRes.code === 200 && companyRes.data?.data) {
        const options = companyRes.data.data.map((item: any) => ({
          label: item.company_name,
          value: item.company_id,
        }));
        setCompanyOptions(options);
      }

      // 加载部门列表（用于选择父部门）
      const deptRes = await getDepartmentList({ page: 1, pageSize: 1000 });
      if (deptRes.code === 200 && deptRes.data?.data) {
        const options = deptRes.data.data.map((item: any) => ({
          label: item.department_name,
          value: item.department_id,
        }));
        // 编辑时，排除自己
        if (editingRecord) {
          setParentOptions(
            options.filter((opt) => opt.value !== editingRecord.department_id),
          );
        } else {
          setParentOptions(options);
        }
      }
    } catch (error) {
      console.error('加载选项失败:', error);
    }
  };

  return (
    <ModalForm
      title={editingRecord ? '编辑部门' : '新增部门'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      onFinish={async (values) => {
        await onSubmit(values);
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
      <ProFormSelect
        name="company_id"
        label="所属公司"
        options={companyOptions}
        rules={[{ required: true, message: '请选择所属公司' }]}
        fieldProps={{
          placeholder: '请选择所属公司',
          showSearch: true,
        }}
      />
      <ProFormText
        name="department_code"
        label="部门编码"
        fieldProps={{
          placeholder: '请输入部门编码（可选）',
        }}
      />
      <ProFormText
        name="department_name"
        label="部门名称"
        rules={[{ required: true, message: '请输入部门名称' }]}
        fieldProps={{
          placeholder: '请输入部门名称',
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
        extra="不选择则作为顶级部门创建"
      />
      <ProFormText
        name="manager_id"
        label="部门负责人"
        fieldProps={{
          placeholder: '请输入部门负责人ID（可选）',
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
        initialValue={1}
      />
      <ProFormDigit
        name="sort_order"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
        }}
        initialValue={0}
      />
    </ModalForm>
  );
};

export default DepartmentForm;
