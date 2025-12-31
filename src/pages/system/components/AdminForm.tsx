import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { getCompanyList, getDepartmentList } from '@/services/api/system';

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
  const [departmentOptions, setDepartmentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<
    number | undefined
  >();
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

  // 加载部门列表
  useEffect(() => {
    if (visible && selectedCompanyId) {
      getDepartmentList({ company_id: selectedCompanyId }).then((res) => {
        if (res.code === 200 && res.data) {
          setDepartmentOptions(
            res.data.map((item) => ({
              label: item.department_name,
              value: item.department_id,
            })),
          );
        }
      });
    } else {
      setDepartmentOptions([]);
    }
  }, [visible, selectedCompanyId]);

  // 初始化选中的公司ID和加载部门列表
  useEffect(() => {
    if (editingRecord?.company_id) {
      setSelectedCompanyId(editingRecord.company_id);
      // 编辑时，如果有公司ID，自动加载部门列表
      getDepartmentList({ company_id: editingRecord.company_id }).then(
        (res) => {
          if (res.code === 200 && res.data) {
            setDepartmentOptions(
              res.data.map((item) => ({
                label: item.department_name,
                value: item.department_id,
              })),
            );
          }
        },
      );
    } else {
      setSelectedCompanyId(undefined);
      setDepartmentOptions([]);
    }
  }, [editingRecord]);

  return (
    <DrawerForm
      key={editingRecord?.id || editingRecord?.user_id || 'new'}
      formRef={formRef}
      title={editingRecord ? '编辑管理员' : '新增管理员'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
          setSelectedCompanyId(undefined);
          setDepartmentOptions([]);
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
            }
          : {
              status: 1,
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
      <ProFormRadio.Group
        name="is_super"
        label="是否超级管理员"
        options={[
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择是否超级管理员' }]}
      />
      <ProFormSelect
        name="company_id"
        label="所属公司"
        options={companyOptions}
        fieldProps={{
          placeholder: '请选择所属公司（可选）',
          showSearch: true,
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          style: { minWidth: 200 },
          onChange: (value) => {
            setSelectedCompanyId(value as number | undefined);
            // 清空部门选择
            formRef.current?.setFieldValue('department_id', undefined);
          },
        }}
      />
      <ProFormSelect
        name="department_id"
        label="所属部门"
        options={departmentOptions}
        fieldProps={{
          placeholder: selectedCompanyId
            ? '请选择所属部门（可选）'
            : '请先选择所属公司',
          disabled: !selectedCompanyId,
          showSearch: true,
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          style: { minWidth: 200 },
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
          style: { width: 200 },
        }}
      />
    </DrawerForm>
  );
};

export default AdminForm;
