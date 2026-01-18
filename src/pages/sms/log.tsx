import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { getSmsLogList, getSmsLogSearchData } from '@/services/api/sms';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  TABLE_SIZE,
} from '@/utils/constants';
import { dateRangeFieldProps } from '@/utils/datePresets';

const Log: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // 下拉框选项数据
  const [smsTypeOptions, setSmsTypeOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [sourceTypeOptions, setSourceTypeOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [statusOptions, setStatusOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  // 加载下拉框选项数据
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await getSmsLogSearchData();
        if (res.code === 200 && res.data) {
          const data = res.data;
          setSmsTypeOptions(
            data.sms_type?.map((item: any) => ({
              label: item.label || item.value,
              value: item.value,
            })) || [],
          );
          setSourceTypeOptions(
            data.source_type?.map((item: any) => ({
              label: item.label || item.value,
              value: item.value,
            })) || [],
          );
          setStatusOptions(
            data.status?.map((item: any) => ({
              label: item.label || item.value,
              value: item.value,
            })) || [],
          );
        }
      } catch (error) {
        console.error('加载下拉框选项失败:', error);
      }
    };

    loadOptions();
  }, []);

  // 列定义
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
      fixed: 'left',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
      fieldProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      title: '短信类型',
      dataIndex: 'sms_type',
      valueType: 'select',
      valueEnum: smsTypeOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 150,
    },
    {
      title: '验证码',
      dataIndex: 'code',
      hideInSearch: true,
      width: 100,
      render: (_, record) => {
        // 验证码仅在开发环境可见
        const isDev = process.env.NODE_ENV === 'development';
        return isDev && record.code ? record.code : '***';
      },
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<number, { text: string }>,
      ),
      width: 100,
      render: (_, record) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          0: { color: 'error', text: '失败' },
          1: { color: 'success', text: '成功' },
        };
        const statusInfo = statusMap[record.status] || statusMap[0];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '错误信息',
      dataIndex: 'error_message',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
      render: (_, record) => {
        if (!record.error_message) return '';
        return (
          <Tooltip
            title={
              <pre
                style={{ margin: 0, whiteSpace: 'pre-wrap', maxWidth: '500px' }}
              >
                {record.error_message}
              </pre>
            }
            mouseEnterDelay={0.1}
            styles={{ root: { maxWidth: '600px' } }}
          >
            <div
              style={{
                width: '200px',
                maxWidth: '200px',
                minWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {record.error_message}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '访问来源',
      dataIndex: 'source_type',
      valueType: 'select',
      valueEnum: sourceTypeOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 120,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      width: 130,
      fieldProps: {
        placeholder: '请输入IP地址',
      },
    },
    {
      title: 'IP归属地',
      dataIndex: 'ip_location',
      hideInSearch: true,
      width: 150,
      render: (_, record) => record.ip_location || '',
    },
    {
      title: '过期时间（分钟）',
      dataIndex: 'expire_minutes',
      hideInSearch: true,
      width: 130,
      render: (_, record) => {
        if (
          record.expire_minutes === null ||
          record.expire_minutes === undefined
        ) {
          return '';
        }
        return `${record.expire_minutes} 分钟`;
      },
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '手机号、IP地址、IP归属地、错误信息',
      },
    },
    {
      title: '发送时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      sorter: true,
      fixed: 'right',
      fieldProps: dateRangeFieldProps,
      render: (_, record) => {
        if (!record.created_at) return '';
        try {
          return dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss');
        } catch (_e) {
          return record.created_at;
        }
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        size={TABLE_SIZE}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        request={async (params) => {
          try {
            const requestParams: any = {
              ...params,
              pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
            };

            // 移除空值参数
            Object.keys(requestParams).forEach((key) => {
              if (
                requestParams[key] === '' ||
                requestParams[key] === null ||
                requestParams[key] === undefined
              ) {
                delete requestParams[key];
              }
            });

            const response = await getSmsLogList(requestParams);
            if (response.code === 200) {
              return {
                data: response.data?.data || [],
                success: true,
                total: response.data?.page?.total || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            console.error('获取短信发送记录列表失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          ...DEFAULT_PAGINATION,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, size) => {
            setPageSize(size || DEFAULT_PAGE_SIZE);
          },
        }}
        scroll={{ x: 1500 }}
      />
    </PageContainer>
  );
};

export default Log;
