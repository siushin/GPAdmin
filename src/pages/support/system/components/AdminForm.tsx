import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';

interface AdminFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const AdminForm: React.FC<AdminFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  return (
    <DrawerForm
      title={editingRecord ? '编辑管理员' : '新增管理员'}
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
              ...editingRecord,
              account_type: editingRecord.account_type || 'admin',
            }
          : {
              account_type: 'admin',
              status: 1,
              is_super: 0,
            }
      }
      width={600}
    >
      <ProFormText
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
        fieldProps={{
          placeholder: '请输入用户名',
          disabled: !!editingRecord,
        }}
      />
      {!editingRecord && (
        <ProFormText.Password
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
          fieldProps={{
            placeholder: '请输入密码',
          }}
        />
      )}
      {editingRecord && (
        <ProFormText.Password
          name="password"
          label="密码"
          fieldProps={{
            placeholder: '留空则不修改密码',
          }}
        />
      )}
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
          disabled: !!editingRecord,
        }}
      />
      <ProFormSelect
        name="is_super"
        label="是否超级管理员"
        options={[
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择是否超级管理员' }]}
        fieldProps={{
          placeholder: '请选择是否超级管理员',
        }}
      />
      <ProFormDigit
        name="company_id"
        label="所属公司ID"
        fieldProps={{
          placeholder: '请输入所属公司ID（可选）',
        }}
      />
      <ProFormDigit
        name="department_id"
        label="所属部门ID"
        fieldProps={{
          placeholder: '请输入所属部门ID（可选）',
        }}
      />
      <ProFormSelect
        name="status"
        label="账号状态"
        options={[
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择账号状态' }]}
        fieldProps={{
          placeholder: '请选择账号状态',
        }}
      />
    </DrawerForm>
  );
};

export default AdminForm;
