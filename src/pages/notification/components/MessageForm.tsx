import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormDigit,
  ProFormItem,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

interface MessageFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  const formRef = useRef<ProFormInstance>(undefined);
  const [contentValue, setContentValue] = useState<string>('');

  // 如果编辑的记录是已读状态，不允许编辑
  const isReadOnly = editingRecord && editingRecord.status === 1;

  useEffect(() => {
    if (visible && editingRecord) {
      formRef.current?.setFieldsValue({
        ...editingRecord,
        status: editingRecord.status === 1 ? true : false,
      });
      setContentValue(editingRecord.content || '');
    } else if (visible && !editingRecord) {
      formRef.current?.resetFields();
      formRef.current?.setFieldsValue({ status: false });
      setContentValue('');
    }
  }, [visible, editingRecord]);

  return (
    <DrawerForm
      formRef={formRef}
      title={
        editingRecord
          ? isReadOnly
            ? '查看站内信（已读）'
            : '编辑站内信'
          : '新增站内信'
      }
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      submitter={isReadOnly ? false : undefined}
      onFinish={async (values) => {
        // 将开关的布尔值转换为数字
        const submitValues = {
          ...values,
          status: values.status ? 1 : 0,
        };
        await onSubmit(submitValues);
        return true;
      }}
      width={800}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormText
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
        fieldProps={{
          placeholder: '请输入标题',
          disabled: isReadOnly,
        }}
      />
      <ProFormDigit
        name="receiver_id"
        label="接收者ID"
        rules={[{ required: true, message: '请输入接收者ID' }]}
        fieldProps={{
          placeholder: '请输入接收者ID',
          disabled: isReadOnly,
        }}
      />
      <ProFormRadio.Group
        name="target_platform"
        label="目标平台"
        options={[
          { label: '全部平台', value: 'all' },
          { label: '用户端', value: 'user' },
          { label: '管理端', value: 'admin' },
          { label: '小程序', value: 'miniapp' },
        ]}
        disabled={isReadOnly}
      />
      <ProFormSwitch
        name="status"
        label="状态"
        checkedChildren="已读"
        unCheckedChildren="未读"
        initialValue={false}
        disabled={isReadOnly}
      />
      <ProFormItem
        name="content"
        label="内容"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <RichTextEditor
          value={contentValue}
          onChange={(value) => {
            setContentValue(value);
            formRef.current?.setFieldValue('content', value);
          }}
          placeholder="请输入站内信内容..."
          maxLength={5000}
          disabled={isReadOnly}
        />
      </ProFormItem>
    </DrawerForm>
  );
};

export default MessageForm;
