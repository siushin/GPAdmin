import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { getCompanyList } from '@/services/api/system';

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
  const [companyOptions, setCompanyOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [formKey, setFormKey] = useState<string>(
    editingRecord?.id || editingRecord?.user_id || `new-${Date.now()}`,
  );
  const formRef = useRef<ProFormInstance>(undefined);

  // 加载公司列表
  useEffect(() => {
    if (visible) {
      getCompanyList().then((res) => {
        if (res.code === 200 && res.data) {
          setCompanyOptions(
            res.data.map((item) => ({
              label: item.company_name,
              value: item.company_id,
            })),
          );
        }
      });
    }
  }, [visible]);

  // 初始化表单 key
  useEffect(() => {
    if (visible) {
      // 新增时，每次打开都生成新的 key，确保表单被重置
      if (!editingRecord) {
        setFormKey(`new-${Date.now()}`);
      } else {
        setFormKey(
          editingRecord.id || editingRecord.user_id || `edit-${Date.now()}`,
        );
      }
    }
  }, [visible, editingRecord]);

  return (
    <DrawerForm
      key={formKey}
      formRef={formRef}
      title={editingRecord ? '编辑管理员' : '新增管理员'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      onFinish={async (values) => {
        // 将 status 的 boolean 值转换为 1/0
        const submitValues = {
          ...values,
          status: values.status ? 1 : 0,
        };
        await onSubmit(submitValues);
        return true;
      }}
      initialValues={
        editingRecord
          ? {
              ...editingRecord,
              status: editingRecord.status === 1,
            }
          : {
              status: true,
              is_super: 0,
            }
      }
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
      <ProFormText
        name="nickname"
        label="姓名"
        fieldProps={{
          placeholder: '请输入姓名',
        }}
      />
      <ProFormText
        name="phone"
        label="手机号"
        fieldProps={{
          placeholder: '请输入手机号',
        }}
      />
      <ProFormText
        name="email"
        label="邮箱"
        fieldProps={{
          placeholder: '请输入邮箱',
        }}
      />
      <ProFormSelect
        name="company_id"
        label="所属公司"
        options={companyOptions}
        fieldProps={{
          placeholder: '请选择所属公司',
          showSearch: true,
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          style: { minWidth: 200 },
        }}
      />
      <ProFormRadio.Group
        name="is_super"
        label="是否超级管理员"
        options={[
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择是否超级管理员' }]}
      />
      <ProFormSwitch
        name="status"
        label="账号状态"
        fieldProps={{
          checkedChildren: '正常',
          unCheckedChildren: '禁用',
        }}
      />
    </DrawerForm>
  );
};

export default AdminForm;
