import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';

interface MenuFormProps {
  visible: boolean;
  editingRecord: any;
  parentMenuOptions: Array<{ label: string; value: number }>;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const MenuForm: React.FC<MenuFormProps> = ({
  visible,
  editingRecord,
  parentMenuOptions,
  onCancel,
  onSubmit,
}) => {
  return (
    <ModalForm
      title={editingRecord ? '编辑菜单' : '新增菜单'}
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
        ...editingRecord,
        parent_id: editingRecord?.parent_id || 0,
        menu_type: editingRecord?.menu_type || 'menu',
        status: editingRecord?.status ?? 1,
        sort: editingRecord?.sort ?? 0,
        is_required: editingRecord?.is_required ?? 0,
        layout: editingRecord?.layout ?? null,
      }}
      width={700}
    >
      <ProFormText
        name="menu_name"
        label="菜单名称"
        rules={[{ required: true, message: '请输入菜单名称' }]}
        fieldProps={{
          placeholder: '请输入菜单名称',
        }}
      />
      <ProFormText
        name="menu_key"
        label="菜单Key"
        fieldProps={{
          placeholder: '请输入菜单Key（用于国际化，如：workbench）',
        }}
      />
      <ProFormText
        name="menu_path"
        label="路由路径"
        fieldProps={{
          placeholder: '请输入路由路径',
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
      <ProFormSelect
        name="menu_type"
        label="菜单类型"
        options={[
          { label: '菜单', value: 'menu' },
          { label: '按钮', value: 'button' },
        ]}
        rules={[{ required: true, message: '请选择菜单类型' }]}
        fieldProps={{
          placeholder: '请选择菜单类型',
        }}
      />
      <ProFormSelect
        name="parent_id"
        label="父菜单"
        options={[{ label: '顶级菜单', value: 0 }, ...parentMenuOptions]}
        fieldProps={{
          placeholder: '请选择父菜单',
        }}
      />
      <ProFormText
        name="menu_icon"
        label="图标"
        fieldProps={{
          placeholder: '请输入图标名称（如：AppstoreOutlined）',
        }}
      />
      <ProFormText
        name="component"
        label="组件路径"
        fieldProps={{
          placeholder: '请输入组件路径（相对路径，如：./Dashboard/Workplace）',
        }}
      />
      <ProFormText
        name="redirect"
        label="重定向路径"
        fieldProps={{
          placeholder: '请输入重定向路径（可选）',
        }}
      />
      <ProFormSelect
        name="layout"
        label="是否使用布局"
        options={[
          { label: '默认', value: null },
          { label: '使用', value: true },
          { label: '不使用', value: false },
        ]}
        fieldProps={{
          placeholder: '请选择是否使用布局',
        }}
      />
      <ProFormText
        name="access"
        label="权限控制"
        fieldProps={{
          placeholder: '请输入权限控制（如：canAdmin）',
        }}
      />
      <ProFormSwitch
        name="is_required"
        label="是否必须选中"
        fieldProps={{
          checkedChildren: '是',
          unCheckedChildren: '否',
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

export default MenuForm;
