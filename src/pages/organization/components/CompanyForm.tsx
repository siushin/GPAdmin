import {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';
import { MODAL_WIDTH } from '@/utils/constants';

interface CompanyFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  return (
    <ModalForm
      title={editingRecord ? '编辑公司' : '新增公司'}
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
      }}
      width={MODAL_WIDTH.MEDIUM}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormText
        name="company_code"
        label="公司编码"
        fieldProps={{
          placeholder: '请输入公司编码（可选）',
        }}
      />
      <ProFormText
        name="company_name"
        label="公司名称"
        rules={[{ required: true, message: '请输入公司名称' }]}
        fieldProps={{
          placeholder: '请输入公司名称',
        }}
      />
      <ProFormText
        name="legal_person"
        label="法人代表"
        fieldProps={{
          placeholder: '请输入法人代表（可选）',
        }}
      />
      <ProFormText
        name="contact_phone"
        label="联系电话"
        fieldProps={{
          placeholder: '请输入联系电话（可选）',
        }}
      />
      <ProFormText
        name="contact_email"
        label="联系邮箱"
        fieldProps={{
          placeholder: '请输入联系邮箱（可选）',
        }}
      />
      <ProFormText
        name="address"
        label="公司地址"
        fieldProps={{
          placeholder: '请输入公司地址（可选）',
        }}
      />
      <ProFormTextArea
        name="description"
        label="公司描述"
        fieldProps={{
          placeholder: '请输入公司描述（可选）',
          rows: 3,
        }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
        initialValue={1}
      />
    </ModalForm>
  );
};

export default CompanyForm;
