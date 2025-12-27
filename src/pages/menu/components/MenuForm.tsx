import {
  DrawerForm,
  ProFormDigit,
  ProFormItem,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Form, Input, Row, Space } from 'antd';
import React from 'react';
import { getIconComponent, IconDisplay } from '@/components';

interface MenuFormProps {
  visible: boolean;
  editingRecord: any;
  parentMenuOptions: Array<{ label: string; value: number }>;
  accountType?: 'admin' | 'user';
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const MenuForm: React.FC<MenuFormProps> = ({
  visible,
  editingRecord,
  parentMenuOptions,
  accountType = 'admin',
  onCancel,
  onSubmit,
}) => {
  const IconPreview: React.FC = () => {
    const iconValue = Form.useWatch('menu_icon');
    const IconComponent = getIconComponent(iconValue);

    if (!iconValue) {
      return null;
    }

    return IconComponent ? (
      <IconDisplay iconName={iconValue} fontSize={20} />
    ) : (
      <span style={{ color: '#ff4d4f' }}>图标不存在</span>
    );
  };

  return (
    <DrawerForm
      key={editingRecord?.menu_id || 'new'}
      title={editingRecord ? '编辑菜单' : '新增菜单'}
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
              parent_id: editingRecord.parent_id ?? 0,
              menu_type: editingRecord.menu_type || 'menu',
              status: editingRecord.status ?? 1,
              sort: editingRecord.sort ?? 0,
              is_required: editingRecord.is_required ?? 0,
              account_type: editingRecord.account_type || accountType,
            }
          : {
              parent_id: 0,
              menu_type: 'menu',
              status: 1,
              sort: 0,
              is_required: 0,
              account_type: accountType,
            }
      }
      width={800}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            name="menu_name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
            fieldProps={{
              placeholder: '请输入菜单名称',
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="menu_key"
            label="菜单Key"
            fieldProps={{
              placeholder: '请输入菜单Key（用于国际化，如：workbench）',
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            name="menu_path"
            label="路由路径"
            fieldProps={{
              placeholder: '请输入路由路径',
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="account_type"
            label="账号类型"
            options={[
              { label: '管理员', value: 'admin' },
              { label: '用户', value: 'user' },
            ]}
            rules={[{ required: true, message: '请选择账号类型' }]}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="parent_id"
            label="父菜单"
            options={[{ label: '顶级菜单', value: 0 }, ...parentMenuOptions]}
            fieldProps={{
              placeholder: '请选择父菜单',
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormItem name="menu_icon" label="图标">
            <Space align="center" style={{ width: '100%' }}>
              <Form.Item name="menu_icon" noStyle>
                <Input
                  placeholder="请输入图标名称（如：AppstoreOutlined）"
                  style={{ width: 200 }}
                />
              </Form.Item>
              <IconPreview />
            </Space>
          </ProFormItem>
        </Col>
        <Col span={12}>
          <ProFormText
            name="component"
            label="组件路径"
            fieldProps={{
              placeholder:
                '请输入组件路径（相对路径，如：./Dashboard/Workplace）',
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            name="redirect"
            label="重定向路径"
            fieldProps={{
              placeholder: '请输入重定向路径（可选）',
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="is_required"
            label="是否必须选中"
            fieldProps={{
              checkedChildren: '是',
              unCheckedChildren: '否',
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormRadio.Group
            name="status"
            label="状态"
            options={[
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]}
            rules={[{ required: true, message: '请选择状态' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="sort"
            label="排序"
            fieldProps={{
              placeholder: '请输入排序值',
              style: { width: 200 },
            }}
          />
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default MenuForm;
