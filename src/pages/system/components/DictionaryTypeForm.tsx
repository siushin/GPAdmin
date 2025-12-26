import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { FormInstance } from 'antd';
import React, { useEffect } from 'react';
import { SysParamFlag } from '@/utils/constants';

interface DictionaryTypeFormProps {
  visible: boolean;
  editingRecord?: {
    dictionary_id: number;
    dictionary_name: string;
    dictionary_value: string;
    dictionary_desc?: string;
    sys_param_flag?: number;
  } | null;
  sysParamFlag?: number;
  onCancel: () => void;
  onSubmit: (values: {
    dictionary_name: string;
    dictionary_value: string;
    dictionary_desc?: string;
    dictionary_id?: number;
  }) => Promise<void>;
}

const DictionaryTypeForm: React.FC<DictionaryTypeFormProps> = ({
  visible,
  editingRecord,
  sysParamFlag,
  onCancel,
  onSubmit,
}) => {
  const formRef = React.useRef<FormInstance>();

  useEffect(() => {
    if (visible && formRef.current) {
      if (editingRecord) {
        // 使用 setTimeout 确保表单已渲染
        setTimeout(() => {
          formRef.current?.setFieldsValue({
            dictionary_name: editingRecord.dictionary_name,
            dictionary_value: editingRecord.dictionary_value,
            dictionary_desc: editingRecord.dictionary_desc || '',
          });
        }, 0);
      } else {
        formRef.current?.resetFields();
      }
    }
  }, [visible, editingRecord]);

  const handleFinish = async (values: {
    dictionary_name: string;
    dictionary_value: string;
    dictionary_desc?: string;
  }) => {
    try {
      await onSubmit({
        ...values,
        ...(editingRecord
          ? { dictionary_id: editingRecord.dictionary_id }
          : {}),
      });
      // 只有成功时才清空表单
      formRef.current?.resetFields();
      return true;
    } catch (error) {
      // 失败时返回 false，不清空表单，不关闭弹窗
      return false;
    }
  };

  return (
    <ModalForm
      formRef={formRef}
      title={editingRecord ? '编辑字典类型' : '新增字典类型'}
      open={visible}
      width={520}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={
        editingRecord
          ? {
              dictionary_name: editingRecord.dictionary_name,
              dictionary_value: editingRecord.dictionary_value,
              dictionary_desc: editingRecord.dictionary_desc || '',
            }
          : undefined
      }
      modalProps={{
        onCancel: () => {
          // 点击取消按钮时，不清空表单，只关闭弹窗
          onCancel();
        },
        destroyOnHidden: false,
        maskClosable: false,
      }}
      onFinish={handleFinish}
    >
      <ProFormText
        name="dictionary_name"
        label="字典名称"
        rules={[
          {
            required: true,
            message: '请输入字典名称',
          },
        ]}
        placeholder="请输入字典名称"
        disabled={sysParamFlag === SysParamFlag.Yes}
        fieldProps={{
          title:
            sysParamFlag === SysParamFlag.Yes
              ? '系统支撑数据，禁止修改'
              : undefined,
        }}
      />
      <ProFormText
        name="dictionary_value"
        label="字典值"
        rules={[
          {
            required: true,
            message: '请输入字典值',
          },
        ]}
        placeholder="请输入字典值"
      />
      <ProFormTextArea
        name="dictionary_desc"
        label="描述"
        placeholder="请输入描述（可选）"
        fieldProps={{
          rows: 3,
        }}
      />
    </ModalForm>
  );
};

export default DictionaryTypeForm;
