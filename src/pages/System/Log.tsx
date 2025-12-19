import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Tabs, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  getActionList,
  getAuditActionList,
  getAuditLogList,
  getBrowserList,
  getDeviceTypeList,
  getHttpMethodList,
  getLoginLogList,
  getLogList,
  getModuleList,
  getOperatingSystemList,
  getOperationActionList,
  getOperationLogList,
  getResourceTypeList,
  getResponseCodeList,
  getSourceTypeList,
} from '@/services/ant-design-pro/api';
import { dateRangeFieldProps } from '@/utils/datePresets';

type LogTabKey = 'operation' | 'login' | 'audit' | 'general';

const Log: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LogTabKey>('operation');
  const actionRef = useRef<ActionType>();

  // 下拉框选项数据
  const [sourceTypeOptions, setSourceTypeOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [actionOptions, setActionOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [operationActionOptions, setOperationActionOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [httpMethodOptions, setHttpMethodOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [browserOptions, setBrowserOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [osOptions, setOsOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [deviceTypeOptions, setDeviceTypeOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [auditActionOptions, setAuditActionOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [resourceTypeOptions, setResourceTypeOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [moduleOptions, setModuleOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [responseCodeOptions, setResponseCodeOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  // 加载下拉框选项数据
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [
          sourceTypeRes,
          actionRes,
          operationActionRes,
          httpMethodRes,
          browserRes,
          osRes,
          deviceTypeRes,
          auditActionRes,
          resourceTypeRes,
          moduleRes,
          responseCodeRes,
        ] = await Promise.all([
          getSourceTypeList(),
          getActionList(),
          getOperationActionList(),
          getHttpMethodList(),
          getBrowserList(),
          getOperatingSystemList(),
          getDeviceTypeList(),
          getAuditActionList(),
          getResourceTypeList(),
          getModuleList(),
          getResponseCodeList(),
        ]);

        if (sourceTypeRes.code === 200) {
          setSourceTypeOptions(
            sourceTypeRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (actionRes.code === 200) {
          setActionOptions(
            actionRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (operationActionRes.code === 200) {
          setOperationActionOptions(
            operationActionRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (httpMethodRes.code === 200) {
          setHttpMethodOptions(
            httpMethodRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (browserRes.code === 200) {
          setBrowserOptions(
            browserRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (osRes.code === 200) {
          setOsOptions(
            osRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (deviceTypeRes.code === 200) {
          setDeviceTypeOptions(
            deviceTypeRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (auditActionRes.code === 200) {
          setAuditActionOptions(
            auditActionRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (resourceTypeRes.code === 200) {
          setResourceTypeOptions(
            resourceTypeRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (moduleRes.code === 200) {
          setModuleOptions(
            moduleRes.data?.map((item: any) => ({
              label:
                typeof item === 'string'
                  ? item
                  : item.label || item.value || item.name,
              value: typeof item === 'string' ? item : item.value || item.name,
            })) || [],
          );
        }
        if (responseCodeRes.code === 200) {
          setResponseCodeOptions(
            responseCodeRes.data?.map((item: any) => ({
              label:
                typeof item === 'number'
                  ? String(item)
                  : item.label || String(item.value || item.name),
              value: typeof item === 'number' ? item : item.value || item.name,
            })) || [],
          );
        }
      } catch (error) {
        console.error('加载下拉框选项失败:', error);
      }
    };

    loadOptions();
  }, []);

  // 操作日志列定义
  const operationLogColumns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '操作人',
      dataIndex: 'username',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '模块名称',
      dataIndex: 'module',
      valueType: 'select',
      valueEnum: moduleOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 100,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      valueType: 'select',
      valueEnum: operationActionOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 100,
    },
    {
      title: 'HTTP方法',
      dataIndex: 'method',
      valueType: 'select',
      valueEnum: httpMethodOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 90,
    },
    {
      title: '请求URL',
      dataIndex: 'path',
      ellipsis: true,
      width: 200,
      fieldProps: {
        placeholder: '请输入请求URL',
      },
    },
    {
      title: '请求参数',
      dataIndex: 'params',
      hideInSearch: true,
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        if (!record.params) return '-';
        let displayText = '';
        let tooltipText = '';
        try {
          // 如果params是字符串，先尝试解析
          const paramsData =
            typeof record.params === 'string'
              ? JSON.parse(record.params)
              : record.params;
          // 格式化JSON用于Tooltip显示
          tooltipText = JSON.stringify(paramsData, null, 2);
          // 单行JSON用于单元格显示
          displayText = JSON.stringify(paramsData);
        } catch (e) {
          // 如果解析失败，直接返回原始值
          tooltipText =
            typeof record.params === 'string'
              ? record.params
              : JSON.stringify(record.params);
          displayText = tooltipText;
        }
        return (
          <Tooltip
            title={
              <pre
                style={{ margin: 0, whiteSpace: 'pre-wrap', maxWidth: '500px' }}
              >
                {tooltipText}
              </pre>
            }
            mouseEnterDelay={0.1}
            overlayStyle={{ maxWidth: '600px' }}
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
              {displayText}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      width: 110,
      fieldProps: {
        placeholder: '请输入IP地址',
      },
    },
    {
      title: 'IP归属地',
      dataIndex: 'ip_location',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '响应状态码',
      dataIndex: 'response_code',
      width: 120,
      valueType: 'select',
      valueEnum: responseCodeOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      render: (_, record) => {
        const code = record.response_code;
        if (code === 200) {
          return <span style={{ color: '#52c41a' }}>{code}</span>;
        }
        return <span style={{ color: '#ff4d4f' }}>{code}</span>;
      },
    },
    {
      title: '执行耗时(ms)',
      dataIndex: 'execution_time',
      hideInSearch: true,
      width: 120,
      sorter: true,
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
      title: '操作时间',
      dataIndex: 'operated_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      sorter: true,
      fieldProps: dateRangeFieldProps,
      render: (_, record) => {
        if (!record.operated_at) return '-';
        // 尝试格式化日期时间
        try {
          return dayjs(record.operated_at).format('YYYY-MM-DD HH:mm:ss');
        } catch (e) {
          return record.operated_at;
        }
      },
    },
  ];

  // 登录日志列定义
  const loginLogColumns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
      fieldProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      title: '账号',
      dataIndex: 'account_username',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '成功', status: 'Success' },
        0: { text: '失败', status: 'Error' },
      },
      width: 100,
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
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      valueType: 'select',
      valueEnum: browserOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 120,
    },
    {
      title: '操作系统',
      dataIndex: 'operating_system',
      valueType: 'select',
      valueEnum: osOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 120,
    },
    {
      title: '设备类型',
      dataIndex: 'device_type',
      valueType: 'select',
      valueEnum: deviceTypeOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 120,
    },
    {
      title: '登录信息',
      dataIndex: 'message',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '登录时间',
      dataIndex: 'login_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      sorter: true,
      fieldProps: dateRangeFieldProps,
    },
  ];

  // 审计日志列定义
  const auditLogColumns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '操作人',
      dataIndex: 'username',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '模块名称',
      dataIndex: 'module',
      width: 120,
      fieldProps: {
        placeholder: '请输入模块名称',
      },
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      valueType: 'select',
      valueEnum: auditActionOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 150,
    },
    {
      title: '资源类型',
      dataIndex: 'resource_type',
      valueType: 'select',
      valueEnum: resourceTypeOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 120,
    },
    {
      title: '资源ID',
      dataIndex: 'resource_id',
      width: 100,
      valueType: 'digit',
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
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
    },
    {
      title: '审计时间',
      dataIndex: 'audited_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      sorter: true,
      fieldProps: dateRangeFieldProps,
    },
  ];

  // 常规日志列定义
  const generalLogColumns: ProColumns<any>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '操作人',
      dataIndex: 'username',
      hideInSearch: true,
      width: 150,
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
      title: '操作类型',
      dataIndex: 'action_type',
      valueType: 'select',
      valueEnum: actionOptions.reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<string, { text: string }>,
      ),
      width: 150,
    },
    {
      title: '日志内容',
      dataIndex: 'content',
      ellipsis: true,
      width: 300,
      fieldProps: {
        placeholder: '请输入关键字',
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
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
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: false,
      width: 180,
      sorter: true,
      fieldProps: dateRangeFieldProps,
    },
  ];

  // 根据Tab类型获取对应的列和请求函数
  const getConfigByTab = (tab: LogTabKey) => {
    switch (tab) {
      case 'operation':
        return {
          columns: operationLogColumns,
          rowKey: 'id',
          request: async (params: any) => {
            // 处理时间范围参数
            const requestParams: any = {
              ...params,
              page: params.current || 1,
              page_size: params.pageSize || 20,
            };

            // 处理时间范围 - 转换为字符串格式
            if (
              params.operated_at &&
              Array.isArray(params.operated_at) &&
              params.operated_at.length === 2
            ) {
              requestParams.date_range = `${params.operated_at[0]},${params.operated_at[1]}`;
              delete requestParams.operated_at;
            }

            const response = await getOperationLogList(requestParams);
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
          },
        };
      case 'login':
        return {
          columns: loginLogColumns,
          rowKey: 'id',
          request: async (params: any) => {
            // 处理时间范围参数
            const requestParams: any = {
              ...params,
              page: params.current || 1,
              page_size: params.pageSize || 20,
            };

            // 处理时间范围 - 转换为字符串格式
            if (
              params.login_at &&
              Array.isArray(params.login_at) &&
              params.login_at.length === 2
            ) {
              requestParams.date_range = `${params.login_at[0]},${params.login_at[1]}`;
              delete requestParams.login_at;
            }

            const response = await getLoginLogList(requestParams);
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
          },
        };
      case 'audit':
        return {
          columns: auditLogColumns,
          rowKey: 'id',
          request: async (params: any) => {
            // 处理时间范围参数
            const requestParams: any = {
              ...params,
              page: params.current || 1,
              page_size: params.pageSize || 20,
            };

            // 处理时间范围 - 转换为字符串格式
            if (
              params.audited_at &&
              Array.isArray(params.audited_at) &&
              params.audited_at.length === 2
            ) {
              requestParams.date_range = `${params.audited_at[0]},${params.audited_at[1]}`;
              delete requestParams.audited_at;
            }

            const response = await getAuditLogList(requestParams);
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
          },
        };
      case 'general':
        return {
          columns: generalLogColumns,
          rowKey: 'log_id',
          request: async (params: any) => {
            // 处理时间范围参数
            const requestParams: any = {
              ...params,
              page: params.current || 1,
              page_size: params.pageSize || 20,
            };

            // 处理时间范围 - 转换为字符串格式
            if (
              params.created_at &&
              Array.isArray(params.created_at) &&
              params.created_at.length === 2
            ) {
              requestParams.date_range = `${params.created_at[0]},${params.created_at[1]}`;
              delete requestParams.created_at;
            }

            const response = await getLogList(requestParams);
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
          },
        };
      default:
        return {
          columns: [],
          rowKey: 'id',
          request: async () => ({ data: [], success: false, total: 0 }),
        };
    }
  };

  return (
    <PageContainer>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as LogTabKey);
          actionRef.current?.reload();
        }}
        items={[
          {
            key: 'operation',
            label: '操作日志',
            children: (() => {
              const config = getConfigByTab('operation');
              return (
                <ProTable<any>
                  actionRef={actionRef}
                  rowKey={config.rowKey}
                  search={{
                    labelWidth: 120,
                    defaultCollapsed: false,
                  }}
                  request={config.request}
                  columns={config.columns}
                  pagination={{
                    defaultPageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  dateFormatter="string"
                  headerTitle="操作日志列表"
                  scroll={{ x: 'max-content' }}
                />
              );
            })(),
          },
          {
            key: 'login',
            label: '登录日志',
            children: (() => {
              const config = getConfigByTab('login');
              return (
                <ProTable<any>
                  actionRef={actionRef}
                  rowKey={config.rowKey}
                  search={{
                    labelWidth: 120,
                    defaultCollapsed: false,
                  }}
                  request={config.request}
                  columns={config.columns}
                  pagination={{
                    defaultPageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  dateFormatter="string"
                  headerTitle="登录日志列表"
                  scroll={{ x: 'max-content' }}
                />
              );
            })(),
          },
          {
            key: 'audit',
            label: '审计日志',
            children: (() => {
              const config = getConfigByTab('audit');
              return (
                <ProTable<any>
                  actionRef={actionRef}
                  rowKey={config.rowKey}
                  search={{
                    labelWidth: 120,
                    defaultCollapsed: false,
                  }}
                  request={config.request}
                  columns={config.columns}
                  pagination={{
                    defaultPageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  dateFormatter="string"
                  headerTitle="审计日志列表"
                  scroll={{ x: 'max-content' }}
                />
              );
            })(),
          },
          {
            key: 'general',
            label: '常规日志',
            children: (() => {
              const config = getConfigByTab('general');
              return (
                <ProTable<any>
                  actionRef={actionRef}
                  rowKey={config.rowKey}
                  search={{
                    labelWidth: 120,
                    defaultCollapsed: false,
                  }}
                  request={config.request}
                  columns={config.columns}
                  pagination={{
                    defaultPageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  dateFormatter="string"
                  headerTitle="常规日志列表"
                  scroll={{ x: 'max-content' }}
                />
              );
            })(),
          },
        ]}
      />
    </PageContainer>
  );
};

export default Log;
