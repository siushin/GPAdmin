import {
  DrawerForm,
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
  const [departmentOptions, setDepartmentOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [positionOptions, setPositionOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  useEffect(() => {
    if (visible) {
      loadOptions();
    }
  }, [visible]);

  const loadOptions = async () => {
    try {
      // 加载部门选项
      const deptRes = await getDepartmentList();
      if (deptRes.code === 200 && deptRes.data) {
        const flattenData = (data: any[]): any[] => {
          const result: any[] = [];
          data.forEach((item) => {
            result.push({
              label: item.department_name,
              value: item.department_id,
            });
            if (item.children && item.children.length > 0) {
              result.push(...flattenData(item.children));
            }
          });
          return result;
        };
        const deptOptions = flattenData(deptRes.data);
        setDepartmentOptions(deptOptions);
      }

      // 加载职位选项
      const posRes = await getPositionList({ pageSize: 1000 });
      if (posRes.code === 200 && posRes.data?.data) {
        const posOptions = posRes.data.data.map((item: any) => ({
          label: item.position_name,
          value: item.position_id,
        }));
        setPositionOptions(posOptions);
      }
    } catch (error) {
      console.error('加载选项失败:', error);
    }
  };

  return (
    <DrawerForm
      title={editingRecord ? '编辑岗位' : '新增岗位'}
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
      <ProFormText
        name="post_name"
        label="岗位名称"
        rules={[{ required: true, message: '请输入岗位名称' }]}
        fieldProps={{
          placeholder: '请输入岗位名称',
        }}
      />
      <ProFormText
        name="post_code"
        label="岗位编码"
        fieldProps={{
          placeholder: '请输入岗位编码（可选）',
        }}
      />
      <ProFormSelect
        name="position_id"
        label="所属职位"
        options={positionOptions}
        fieldProps={{
          placeholder: '请选择所属职位（可选）',
          showSearch: true,
        }}
      />
      <ProFormSelect
        name="department_id"
        label="所属部门"
        options={departmentOptions}
        fieldProps={{
          placeholder: '请选择所属部门（可选）',
          showSearch: true,
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
      />
      <ProFormDigit
        name="sort_order"
        label="排序"
        fieldProps={{
          placeholder: '请输入排序值',
        }}
      />
    </DrawerForm>
  );
};

export default PostForm;
