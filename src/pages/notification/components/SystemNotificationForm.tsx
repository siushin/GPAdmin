import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormItem,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

interface SystemNotificationFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const SystemNotificationForm: React.FC<SystemNotificationFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  const formRef = useRef<ProFormInstance>(undefined);
  const [contentValue, setContentValue] = useState<string>('');
  const [startTime, setStartTime] = useState<Dayjs | null>(null);

  // 如果编辑的记录是禁用状态，不允许编辑
  const isReadOnly = editingRecord && editingRecord.status === 0;

  useEffect(() => {
    if (visible && editingRecord) {
      const values = {
        ...editingRecord,
        start_time: editingRecord.start_time
          ? dayjs(editingRecord.start_time)
          : null,
        end_time: editingRecord.end_time ? dayjs(editingRecord.end_time) : null,
        status: editingRecord.status === 1 ? true : false,
      };
      formRef.current?.setFieldsValue(values);
      setContentValue(editingRecord.content || '');
      setStartTime(
        editingRecord.start_time ? dayjs(editingRecord.start_time) : null,
      );
    } else if (visible && !editingRecord) {
      formRef.current?.resetFields();
      formRef.current?.setFieldsValue({ status: true });
      setContentValue('');
      setStartTime(null);
    }
  }, [visible, editingRecord]);

  return (
    <DrawerForm
      formRef={formRef}
      title={
        editingRecord
          ? isReadOnly
            ? '查看系统通知（已禁用）'
            : '编辑系统通知'
          : '新增系统通知'
      }
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
      submitter={isReadOnly ? false : undefined}
      onFinish={async (values) => {
        // 将开关的布尔值转换为数字，将时间对象转换为字符串
        const submitValues = {
          ...values,
          status: values.status ? 1 : 0,
          start_time: values.start_time
            ? dayjs(values.start_time).format('YYYY-MM-DD HH:mm:ss')
            : null,
          end_time: values.end_time
            ? dayjs(values.end_time).format('YYYY-MM-DD HH:mm:ss')
            : null,
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
      <ProFormRadio.Group
        name="type"
        label="通知类型"
        options={[
          { label: '系统通知', value: 'system' },
          { label: '业务通知', value: 'business' },
          { label: '活动通知', value: 'activity' },
          { label: '其他', value: 'other' },
        ]}
        disabled={isReadOnly}
      />
      <ProFormRadio.Group
        name="target_platform"
        label="目标平台"
        options={[
          { label: '全平台', value: 'all' },
          { label: '用户端', value: 'user' },
          { label: '管理端', value: 'admin' },
          { label: '小程序', value: 'miniapp' },
        ]}
        disabled={isReadOnly}
      />
      <ProFormDateTimePicker
        name="start_time"
        label="开始时间"
        fieldProps={{
          placeholder: '请选择开始时间',
          style: { width: '100%' },
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          disabledDate: (current: Dayjs) => {
            // 不能选择今天之前的日期
            return current && current.isBefore(dayjs(), 'day');
          },
          disabledTime: (current: Dayjs | null) => {
            if (!current) return {};
            const now = dayjs();
            // 如果是今天，不能选择当前时间之前的时间
            if (current.isSame(now, 'day')) {
              return {
                disabledHours: () => {
                  const hours = [];
                  for (let i = 0; i < now.hour(); i++) {
                    hours.push(i);
                  }
                  return hours;
                },
                disabledMinutes: (selectedHour: number) => {
                  if (selectedHour === now.hour()) {
                    const minutes = [];
                    for (let i = 0; i <= now.minute(); i++) {
                      minutes.push(i);
                    }
                    return minutes;
                  }
                  return [];
                },
                disabledSeconds: (
                  selectedHour: number,
                  selectedMinute: number,
                ) => {
                  if (
                    selectedHour === now.hour() &&
                    selectedMinute === now.minute()
                  ) {
                    const seconds = [];
                    for (let i = 0; i <= now.second(); i++) {
                      seconds.push(i);
                    }
                    return seconds;
                  }
                  return [];
                },
              };
            }
            return {};
          },
          onChange: (value: Dayjs | null) => {
            setStartTime(value);
            // 如果结束时间早于新的开始时间，清空结束时间
            const endTime = formRef.current?.getFieldValue('end_time');
            if (endTime && value && dayjs(endTime).isBefore(value)) {
              formRef.current?.setFieldValue('end_time', null);
            }
          },
        }}
        extra="留空则立即生效"
      />
      <ProFormDateTimePicker
        name="end_time"
        label="结束时间"
        fieldProps={{
          placeholder: '请选择结束时间',
          style: { width: '100%' },
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          disabled: isReadOnly,
          disabledDate: (current: Dayjs) => {
            // 不能选择今天之前的日期
            if (current && current.isBefore(dayjs(), 'day')) {
              return true;
            }
            // 如果选择了开始时间，不能选择开始时间之前的日期
            if (startTime && current && current.isBefore(startTime, 'day')) {
              return true;
            }
            return false;
          },
          disabledTime: (current: Dayjs | null) => {
            if (!current) return {};
            const now = dayjs();
            // 如果是今天，不能选择当前时间之前的时间
            if (current.isSame(now, 'day')) {
              return {
                disabledHours: () => {
                  const hours = [];
                  for (let i = 0; i < now.hour(); i++) {
                    hours.push(i);
                  }
                  return hours;
                },
                disabledMinutes: (selectedHour: number) => {
                  if (selectedHour === now.hour()) {
                    const minutes = [];
                    for (let i = 0; i <= now.minute(); i++) {
                      minutes.push(i);
                    }
                    return minutes;
                  }
                  return [];
                },
                disabledSeconds: (
                  selectedHour: number,
                  selectedMinute: number,
                ) => {
                  if (
                    selectedHour === now.hour() &&
                    selectedMinute === now.minute()
                  ) {
                    const seconds = [];
                    for (let i = 0; i <= now.second(); i++) {
                      seconds.push(i);
                    }
                    return seconds;
                  }
                  return [];
                },
              };
            }
            // 如果选择了开始时间，且是同一天，不能选择开始时间之前的时间
            if (startTime && current.isSame(startTime, 'day')) {
              return {
                disabledHours: () => {
                  const hours = [];
                  for (let i = 0; i < startTime.hour(); i++) {
                    hours.push(i);
                  }
                  return hours;
                },
                disabledMinutes: (selectedHour: number) => {
                  if (selectedHour === startTime.hour()) {
                    const minutes = [];
                    for (let i = 0; i <= startTime.minute(); i++) {
                      minutes.push(i);
                    }
                    return minutes;
                  }
                  return [];
                },
                disabledSeconds: (
                  selectedHour: number,
                  selectedMinute: number,
                ) => {
                  if (
                    selectedHour === startTime.hour() &&
                    selectedMinute === startTime.minute()
                  ) {
                    const seconds = [];
                    for (let i = 0; i <= startTime.second(); i++) {
                      seconds.push(i);
                    }
                    return seconds;
                  }
                  return [];
                },
              };
            }
            return {};
          },
        }}
        extra="留空则长期有效，必须晚于开始时间"
      />
      <ProFormSwitch
        name="status"
        label="状态"
        checkedChildren="启用"
        unCheckedChildren="禁用"
        initialValue={true}
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
          placeholder="请输入通知内容..."
          maxLength={5000}
          disabled={isReadOnly}
        />
      </ProFormItem>
    </DrawerForm>
  );
};

export default SystemNotificationForm;
