import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';
import { MODAL_WIDTH } from '@/utils/constants';

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
      initialValues={{
        ...(editingRecord || {}),
        status: editingRecord?.status ?? 1,
        account_type: editingRecord?.account_type || accountType,
        sort: editingRecord?.sort ?? 0,
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
