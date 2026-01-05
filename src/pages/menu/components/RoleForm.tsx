import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { ensureAllFormFields, MODAL_WIDTH } from '@/utils/constants';

interface RoleFormProps {
  visible: boolean;
  editingRecord: any;
  accountType?: 'admin' | 'user';
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const RoleForm: React.FC<RoleFormProps> = ({
  visible,
  editingRecord,
  accountType = 'admin',
  onCancel,
  onSubmit,
}) => {
  const [formKey, setFormKey] = useState<string>(
    editingRecord?.role_id || `new-${Date.now()}`,
  );
  const formRef = useRef<ProFormInstance>(undefined);

  // 初始化表单 key，确保表单正确重置
  useEffect(() => {
    if (visible) {
      if (!editingRecord) {
        setFormKey(`new-${Date.now()}`);
      } else {
        setFormKey(editingRecord.role_id || `edit-${Date.now()}`);
      }
    }
  }, [visible, editingRecord]);

  // 设置表单初始值（使用 setFieldsValue 避免 initialValues 警告）
  useEffect(() => {
    if (visible && formRef.current) {
      const timer = setTimeout(() => {
        if (formRef.current) {
          if (editingRecord) {
            formRef.current.setFieldsValue({
              ...editingRecord,
              status: editingRecord.status ?? 1,
              account_type: editingRecord.account_type || accountType,
              sort: editingRecord.sort ?? 0,
            });
          } else {
            formRef.current.setFieldsValue({
              status: 1,
              account_type: accountType,
              sort: 0,
            });
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [visible, editingRecord, accountType]);

  return (
    <ModalForm
      key={formKey}
      formRef={formRef}
      title={editingRecord ? '编辑角色' : '新增角色'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      onFinish={async (values) => {
        // 定义所有表单字段，确保它们都被包含
        const allFormFields = [
          'role_name',
          'role_code',
          'account_type',
          'description',
          'status',
          'sort',
        ];
        // 确保所有字段都被包含
        const completeValues = ensureAllFormFields(
          formRef,
          values,
          allFormFields,
        );
        await onSubmit(completeValues);
      }}
      width={MODAL_WIDTH.MEDIUM}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormText
        name="role_name"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
        fieldProps={{
          placeholder: '请输入角色名称',
        }}
      />
      <ProFormText
        name="role_code"
        label="角色编码"
        rules={[{ required: true, message: '请输入角色编码' }]}
        fieldProps={{
          placeholder: '请输入角色编码',
        }}
      />
      <ProFormRadio.Group
        name="account_type"
        label="账号类型"
        options={[
          { label: '管理员', value: 'admin' },
          { label: '用户', value: 'user' },
        ]}
        rules={[{ required: true, message: '请选择账号类型' }]}
      />
      <ProFormTextArea
        name="description"
        label="角色描述"
        fieldProps={{
          placeholder: '请输入角色描述（可选）',
          rows: 3,
        }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
        }}
      />
    </ModalForm>
  );
};

export default RoleForm;
