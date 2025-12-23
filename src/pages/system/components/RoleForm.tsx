import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';

interface RoleFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const RoleForm: React.FC<RoleFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  return (
    <ModalForm
      title={editingRecord ? '编辑角色' : '新增角色'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      onFinish={async (values) => {
        await onSubmit(values);
      }}
      initialValues={editingRecord || {}}
      width={600}
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
      <ProFormSelect
        name="account_type"
        label="账号类型"
        options={[
          { label: '管理员', value: 'admin' },
          { label: '用户', value: 'user' },
        ]}
        rules={[{ required: true, message: '请选择账号类型' }]}
        fieldProps={{
          placeholder: '请选择账号类型',
        }}
      />
      <ProFormTextArea
        name="description"
        label="角色描述"
        fieldProps={{
          placeholder: '请输入角色描述（可选）',
          rows: 3,
        }}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
        fieldProps={{
          placeholder: '请选择状态',
        }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
        }}
        initialValue={0}
      />
    </ModalForm>
  );
};

export default RoleForm;
