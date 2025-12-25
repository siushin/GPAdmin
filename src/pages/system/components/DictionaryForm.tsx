import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';
import { CanDeleteEnum, MODAL_WIDTH } from '@/utils/constants';

interface DictionaryFormProps {
  visible: boolean;
  editingRecord: any;
  defaultCategoryId?: number;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const DictionaryForm: React.FC<DictionaryFormProps> = ({
  visible,
  editingRecord,
  defaultCategoryId,
  onCancel,
  onSubmit,
}) => {
  return (
    <ModalForm
      title={editingRecord ? '编辑数据字典' : '新增数据字典'}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      onFinish={async (values) => {
        // 自动添加 category_id（从编辑记录或默认值）
        const submitValues = {
          ...values,
          category_id:
            editingRecord?.category_id || defaultCategoryId || undefined,
        };
        // 新增时，如果没有 category_id，不允许提交
        if (!editingRecord && !submitValues.category_id) {
          return false;
        }
        await onSubmit(submitValues);
      }}
      request={async () => {
        if (editingRecord) {
          return {
            dictionary_name: editingRecord.dictionary_name,
            dictionary_value: editingRecord.dictionary_value,
            dictionary_desc: editingRecord.dictionary_desc,
            sort: editingRecord.sort ?? 0,
            can_delete: editingRecord.can_delete ?? CanDeleteEnum.ALLOWED,
          };
        }
        return {
          sort: 0,
          can_delete: CanDeleteEnum.ALLOWED,
        };
      }}
      width={MODAL_WIDTH.SMALL_MEDIUM}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout="horizontal"
      labelAlign="right"
    >
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
      <ProFormTextArea
        name="dictionary_desc"
        label="字典描述"
        fieldProps={{
          placeholder: '请输入字典描述',
          rows: 3,
        }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
          min: 0,
          style: { width: 100 },
        }}
        extra="数字越小越靠前，默认为0"
      />
      <ProFormSelect
        name="can_delete"
        label="可删除"
        options={[
          { label: '是', value: CanDeleteEnum.ALLOWED },
          { label: '否', value: CanDeleteEnum.DISABLE },
        ]}
        fieldProps={{
          placeholder: '请选择可删除',
          style: { width: 80 },
        }}
        extra='选择"否"时，该数据为系统支撑数据，禁止删除'
      />
    </ModalForm>
  );
};

export default DictionaryForm;
