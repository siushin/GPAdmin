import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Tooltip } from 'antd';
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

  // 设置表单初始值（解决 initialValues 异步加载警告）
  useEffect(() => {
    if (visible && formRef.current) {
      // 先重置表单
      formRef.current.resetFields();

      if (editingRecord) {
        // 编辑模式：设置编辑记录的值
        formRef.current.setFieldsValue({
          ...editingRecord,
          // admin账号强制状态为正常
          status:
            editingRecord.username === 'admin'
              ? true
              : editingRecord.status === 1,
        });
      } else {
        // 新增模式：设置默认值
        formRef.current.setFieldsValue({
          status: true,
          is_super: 0,
        });
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
        const submitValues: any = {
          ...values,
          status: values.status ? 1 : 0,
        };
        // admin账号不能修改状态和超级管理员设置，强制使用原始值
        if (editingRecord && editingRecord.username === 'admin') {
          submitValues.status = 1; // 强制为正常状态
          submitValues.is_super = editingRecord.is_super; // 保持原始超级管理员状态
        }
        await onSubmit(submitValues);
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
          suffix:
            editingRecord && editingRecord.username === 'admin' ? (
              <Tooltip title="admin账号的用户名不能修改">
                <span style={{ color: '#999', cursor: 'help' }}>ℹ️</span>
              </Tooltip>
            ) : undefined,
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
        initialValue={0}
        extra={
          editingRecord && editingRecord.username === 'admin' ? (
            <Tooltip title="admin账号的超级管理员状态不能修改">
              <span style={{ color: '#999', cursor: 'help', fontSize: '12px' }}>
                ℹ️ admin账号的超级管理员状态不能修改
              </span>
            </Tooltip>
          ) : undefined
        }
        options={[
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择是否超级管理员' }]}
        fieldProps={{
          disabled: editingRecord && editingRecord.username === 'admin',
        }}
      />
      <ProFormSwitch
        name="status"
        label="账号状态"
        initialValue={true}
        extra={
          editingRecord && editingRecord.username === 'admin' ? (
            <Tooltip title="admin账号不能禁用，状态固定为正常">
              <span style={{ color: '#999', cursor: 'help', fontSize: '12px' }}>
                ℹ️ admin账号不能禁用
              </span>
            </Tooltip>
          ) : undefined
        }
        fieldProps={{
          checkedChildren: '正常',
          unCheckedChildren: '禁用',
          disabled: editingRecord && editingRecord.username === 'admin',
        }}
      />
    </DrawerForm>
  );
};

export default AdminForm;
