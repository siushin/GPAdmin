import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';

interface UserFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  const [formKey, setFormKey] = useState<string>(
    editingRecord?.id || editingRecord?.user_id || `new-${Date.now()}`,
  );
  const formRef = useRef<ProFormInstance>(undefined);

  // 初始化表单 key，确保表单正确重置
  useEffect(() => {
    if (visible) {
      if (!editingRecord) {
        setFormKey(`new-${Date.now()}`);
      } else {
        setFormKey(
          editingRecord.id || editingRecord.user_id || `edit-${Date.now()}`,
        );
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
            });
          } else {
            formRef.current.setFieldsValue({
              status: 1,
            });
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [visible, editingRecord]);

  return (
    <DrawerForm
      key={formKey}
      formRef={formRef}
      title={editingRecord ? '编辑用户' : '新增用户'}
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
      width={800}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
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
        name="status"
        label="账号状态"
        options={[
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择账号状态' }]}
        fieldProps={{
          placeholder: '请选择账号状态',
          style: { width: 200 },
        }}
      />
    </DrawerForm>
  );
};

export default UserForm;
