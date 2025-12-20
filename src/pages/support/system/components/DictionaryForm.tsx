import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

interface DictionaryFormProps {
  visible: boolean;
  editingRecord: any;
  categoryOptions: Array<{ label: string; value: number }>;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  getDictionaryPidData: (params: any) => Promise<any>;
}

const DictionaryForm: React.FC<DictionaryFormProps> = ({
  visible,
  editingRecord,
  categoryOptions,
  onCancel,
  onSubmit,
  getDictionaryPidData,
}) => {
  const [parentOptions, setParentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [categoryId, setCategoryId] = useState<number | undefined>();

  useEffect(() => {
    if (visible) {
      if (editingRecord?.category_id) {
        setCategoryId(editingRecord.category_id);
      }
      if (categoryId) {
        loadParentOptions();
      } else {
        setParentOptions([]);
      }
    } else {
      setCategoryId(undefined);
      setParentOptions([]);
    }
  }, [visible, categoryId, editingRecord]);

  const loadParentOptions = async () => {
    try {
      const res = await getDictionaryPidData({ category_id: categoryId });
      if (res.code === 200 && res.data) {
        setParentOptions(
          res.data.map((item: any) => ({
            label: item.dictionary_name,
            value: item.dictionary_id,
          })),
        );
      }
    } catch (error) {
      console.error('加载父级数据失败:', error);
      setParentOptions([]);
    }
  };

  return (
    <ModalForm
      title={editingRecord ? '编辑数据字典' : '新增数据字典'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
          setCategoryId(undefined);
        }
      }}
      onFinish={async (values) => {
        await onSubmit(values);
      }}
      initialValues={
        editingRecord
          ? {
              ...editingRecord,
              category_id: editingRecord.category_id,
            }
          : {}
      }
      width={600}
    >
      <ProFormSelect
        name="category_id"
        label="字典分类"
        options={categoryOptions}
        rules={[{ required: true, message: '请选择字典分类' }]}
        fieldProps={{
          placeholder: '请选择字典分类',
          onChange: (value) => {
            setCategoryId(value);
          },
        }}
      />
      <ProFormText
        name="dictionary_name"
        label="字典名称"
        rules={[{ required: true, message: '请输入字典名称' }]}
        fieldProps={{
          placeholder: '请输入字典名称',
        }}
      />
      <ProFormText
        name="dictionary_value"
        label="字典值"
        rules={[{ required: true, message: '请输入字典值' }]}
        fieldProps={{
          placeholder: '请输入字典值',
        }}
      />
      <ProFormSelect
        name="parent_id"
        label="父级"
        options={parentOptions}
        fieldProps={{
          placeholder: '请选择父级（可选）',
        }}
      />
      <ProFormTextArea
        name="extend_data"
        label="扩展数据"
        fieldProps={{
          placeholder: '请输入扩展数据（JSON格式）',
          rows: 4,
        }}
      />
    </ModalForm>
  );
};

export default DictionaryForm;
