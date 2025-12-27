import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {
  getDepartmentList,
  getPositionList,
} from '@/services/api/organization';
import { MODAL_WIDTH } from '@/utils/constants';

interface PostFormProps {
  visible: boolean;
  editingRecord: any;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const PostForm: React.FC<PostFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  const [positionOptions, setPositionOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    if (visible) {
      loadOptions();
    }
  }, [visible]);

  const loadOptions = async () => {
    try {
      // 加载职位列表
      const positionRes = await getPositionList({ page: 1, pageSize: 1000 });
      if (positionRes.code === 200 && positionRes.data?.data) {
        const options = positionRes.data.data.map((item: any) => ({
          label: item.position_name,
          value: item.position_id,
        }));
        setPositionOptions(options);
      }

      // 加载部门列表
      const deptRes = await getDepartmentList({ page: 1, pageSize: 1000 });
      if (deptRes.code === 200 && deptRes.data?.data) {
        const options = deptRes.data.data.map((item: any) => ({
          label: item.department_name,
          value: item.department_id,
        }));
        setDepartmentOptions(options);
      }
    } catch (error) {
      console.error('加载选项失败:', error);
    }
  };

  return (
    <ModalForm
      title={editingRecord ? '编辑岗位' : '新增岗位'}
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
        sort_order: editingRecord?.sort_order ?? 0,
      }}
      width={MODAL_WIDTH.MEDIUM}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormSelect
        name="position_id"
        label="所属职位"
        options={positionOptions}
        rules={[{ required: true, message: '请选择所属职位' }]}
        fieldProps={{
          placeholder: '请选择所属职位',
          showSearch: true,
        }}
      />
      <ProFormSelect
        name="department_id"
        label="所属部门"
        options={departmentOptions}
        rules={[{ required: true, message: '请选择所属部门' }]}
        fieldProps={{
          placeholder: '请选择所属部门',
          showSearch: true,
        }}
      />
      <ProFormText
        name="post_code"
        label="岗位编码"
        fieldProps={{
          placeholder: '请输入岗位编码（可选）',
        }}
      />
      <ProFormText
        name="post_name"
        label="岗位名称"
        rules={[{ required: true, message: '请输入岗位名称' }]}
        fieldProps={{
          placeholder: '请输入岗位名称',
        }}
      />
      <ProFormTextArea
        name="post_description"
        label="岗位描述"
        fieldProps={{
          placeholder: '请输入岗位描述（可选）',
          rows: 3,
        }}
      />
      <ProFormTextArea
        name="post_requirements"
        label="岗位要求"
        fieldProps={{
          placeholder: '请输入岗位要求（可选）',
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
      <ProFormDigit
        name="sort_order"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
        }}
        initialValue={0}
      />
    </ModalForm>
  );
};

export default PostForm;
