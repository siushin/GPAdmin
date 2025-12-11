<template>
  <div class="log-management">
    <a-card :bordered="false" class="content-card">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="operation" tab="操作日志">
          <div class="table-wrapper">
            <!-- 搜索栏 -->
            <div class="table-header">
              <a-form layout="inline" :model="operationSearchForm" class="search-form">
                <a-form-item label="操作类型">
                  <a-input v-model:value="operationSearchForm.operation" placeholder="请输入操作类型" allow-clear />
                </a-form-item>
                <a-form-item label="模块">
                  <a-input v-model:value="operationSearchForm.module" placeholder="请输入模块" allow-clear />
                </a-form-item>
                <a-form-item label="用户">
                  <a-input v-model:value="operationSearchForm.user" placeholder="请输入用户" allow-clear />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="handleOperationSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handleOperationReset">重置</a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 表格 -->
            <a-table :columns="operationColumns" :data-source="operationDataSource" :loading="operationLoading"
              :pagination="operationPagination" :scroll="{ y: tableScrollHeight, x: 'max-content' }"
              @resizeColumn="handleResizeColumn" @change="handleOperationTableChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'result'">
                  <a-tag :color="record.result === '成功' ? 'success' : 'error'">
                    {{ record.result }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="login" tab="登录日志">
          <div class="table-wrapper">
            <!-- 搜索栏 -->
            <div class="table-header">
              <a-form layout="inline" :model="loginSearchForm" class="search-form">
                <a-form-item label="用户">
                  <a-input v-model:value="loginSearchForm.user" placeholder="请输入用户" allow-clear />
                </a-form-item>
                <a-form-item label="状态">
                  <a-select v-model:value="loginSearchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
                    <a-select-option value="成功">成功</a-select-option>
                    <a-select-option value="失败">失败</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="handleLoginSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handleLoginReset">重置</a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 表格 -->
            <a-table :columns="loginColumns" :data-source="loginDataSource" :loading="loginLoading"
              :pagination="loginPagination" :scroll="{ y: tableScrollHeight, x: 'max-content' }"
              @resizeColumn="handleResizeColumn" @change="handleLoginTableChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === '成功' ? 'success' : 'error'">
                    {{ record.status }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="audit" tab="审计日志">
          <div class="table-wrapper">
            <!-- 搜索栏 -->
            <div class="table-header">
              <a-form layout="inline" :model="auditSearchForm" class="search-form">
                <a-form-item label="操作类型">
                  <a-input v-model:value="auditSearchForm.action" placeholder="请输入操作类型" allow-clear />
                </a-form-item>
                <a-form-item label="用户">
                  <a-input v-model:value="auditSearchForm.user" placeholder="请输入用户" allow-clear />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="handleAuditSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handleAuditReset">重置</a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 表格 -->
            <a-table :columns="auditColumns" :data-source="auditDataSource" :loading="auditLoading"
              :pagination="auditPagination" :scroll="{ y: tableScrollHeight, x: 'max-content' }"
              @resizeColumn="handleResizeColumn" @change="handleAuditTableChange">
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import {
  Card as ACard,
  Table as ATable,
  Tag as ATag,
  Button as AButton,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  Select as ASelect,
  SelectOption as ASelectOption,
  Tabs as ATabs,
  TabPane as ATabPane
} from 'ant-design-vue'
import { mockApi } from '@/mock'

const activeTab = ref('operation')
const tableScrollHeight = ref<string>('calc(100vh - 500px)')

// 操作日志相关
const operationLoading = ref(false)
const operationDataSource = ref<any[]>([])
const operationSearchForm = reactive({
  operation: '',
  module: '',
  user: ''
})
const operationPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const operationColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80, resizable: true },
  { title: '操作类型', dataIndex: 'operation', key: 'operation', width: 120, resizable: true },
  { title: '模块', dataIndex: 'module', key: 'module', width: 120, resizable: true },
  { title: '请求方法', dataIndex: 'method', key: 'method', width: 100, resizable: true },
  { title: '请求URL', dataIndex: 'url', key: 'url', width: 250, resizable: true },
  { title: '请求参数', dataIndex: 'params', key: 'params', width: 200, resizable: true },
  { title: '操作结果', key: 'result', width: 100, resizable: true },
  { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 150, resizable: true },
  { title: '操作人', dataIndex: 'user', key: 'user', width: 120, resizable: true },
  { title: '操作时间', dataIndex: 'createTime', key: 'createTime', width: 180, resizable: true }
])

// 登录日志相关
const loginLoading = ref(false)
const loginDataSource = ref<any[]>([])
const loginSearchForm = reactive({
  user: '',
  status: undefined
})
const loginPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const loginColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80, resizable: true },
  { title: '用户', dataIndex: 'user', key: 'user', width: 120, resizable: true },
  { title: '登录状态', key: 'status', width: 100, resizable: true },
  { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 150, resizable: true },
  { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 120, resizable: true },
  { title: '操作系统', dataIndex: 'os', key: 'os', width: 120, resizable: true },
  { title: '登录地点', dataIndex: 'location', key: 'location', width: 150, resizable: true },
  { title: '登录信息', dataIndex: 'message', key: 'message', width: 150, resizable: true },
  { title: '登录时间', dataIndex: 'createTime', key: 'createTime', width: 180, resizable: true }
])

// 审计日志相关
const auditLoading = ref(false)
const auditDataSource = ref<any[]>([])
const auditSearchForm = reactive({
  action: '',
  user: ''
})
const auditPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const auditColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80, resizable: true },
  { title: '操作类型', dataIndex: 'action', key: 'action', width: 120, resizable: true },
  { title: '操作人', dataIndex: 'user', key: 'user', width: 120, resizable: true },
  { title: '操作对象', dataIndex: 'target', key: 'target', width: 150, resizable: true },
  { title: '修改前', dataIndex: 'before', key: 'before', width: 200, resizable: true },
  { title: '修改后', dataIndex: 'after', key: 'after', width: 200, resizable: true },
  { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 150, resizable: true },
  { title: '操作时间', dataIndex: 'createTime', key: 'createTime', width: 180, resizable: true }
])

const handleResizeColumn = (w: number, col: any) => {
  col.width = w
}

const fetchOperationData = async () => {
  operationLoading.value = true
  try {
    const res: any = await mockApi.getOperationLogs({
      current: operationPagination.value.current,
      pageSize: operationPagination.value.pageSize,
      ...operationSearchForm
    })
    if (res.code === 200) {
      operationDataSource.value = res.data.list
      operationPagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取操作日志失败', error)
  } finally {
    operationLoading.value = false
  }
}

const fetchLoginData = async () => {
  loginLoading.value = true
  try {
    const res: any = await mockApi.getLoginLogs({
      current: loginPagination.value.current,
      pageSize: loginPagination.value.pageSize,
      ...loginSearchForm
    })
    if (res.code === 200) {
      loginDataSource.value = res.data.list
      loginPagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取登录日志失败', error)
  } finally {
    loginLoading.value = false
  }
}

const fetchAuditData = async () => {
  auditLoading.value = true
  try {
    const res: any = await mockApi.getAuditLogs({
      current: auditPagination.value.current,
      pageSize: auditPagination.value.pageSize,
      ...auditSearchForm
    })
    if (res.code === 200) {
      auditDataSource.value = res.data.list
      auditPagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取审计日志失败', error)
  } finally {
    auditLoading.value = false
  }
}

const handleTabChange = (key: string) => {
  if (key === 'operation' && operationDataSource.value.length === 0) {
    fetchOperationData()
  } else if (key === 'login' && loginDataSource.value.length === 0) {
    fetchLoginData()
  } else if (key === 'audit' && auditDataSource.value.length === 0) {
    fetchAuditData()
  }
}

const handleOperationTableChange = (pag: any) => {
  operationPagination.value.current = pag.current
  operationPagination.value.pageSize = pag.pageSize
  fetchOperationData()
}

const handleLoginTableChange = (pag: any) => {
  loginPagination.value.current = pag.current
  loginPagination.value.pageSize = pag.pageSize
  fetchLoginData()
}

const handleAuditTableChange = (pag: any) => {
  auditPagination.value.current = pag.current
  auditPagination.value.pageSize = pag.pageSize
  fetchAuditData()
}

const handleOperationSearch = () => {
  operationPagination.value.current = 1
  fetchOperationData()
}

const handleOperationReset = () => {
  operationSearchForm.operation = ''
  operationSearchForm.module = ''
  operationSearchForm.user = ''
  operationPagination.value.current = 1
  fetchOperationData()
}

const handleLoginSearch = () => {
  loginPagination.value.current = 1
  fetchLoginData()
}

const handleLoginReset = () => {
  loginSearchForm.user = ''
  loginSearchForm.status = undefined
  loginPagination.value.current = 1
  fetchLoginData()
}

const handleAuditSearch = () => {
  auditPagination.value.current = 1
  fetchAuditData()
}

const handleAuditReset = () => {
  auditSearchForm.action = ''
  auditSearchForm.user = ''
  auditPagination.value.current = 1
  fetchAuditData()
}

const calculateTableHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      const tableWrapper = document.querySelector('.log-management .table-wrapper')
      if (!tableWrapper) return
      const tableElement = tableWrapper.querySelector('.ant-table')
      if (!tableElement) return
      const tableHeader = tableElement.querySelector('.ant-table-thead')
      if (!tableHeader) return
      const headerRect = tableHeader.getBoundingClientRect()
      const paginationElement = tableWrapper.querySelector('.ant-pagination')
      if (!paginationElement) return
      const paginationRect = paginationElement.getBoundingClientRect()
      const availableHeight = paginationRect.top - headerRect.bottom - 16
      tableScrollHeight.value = `${Math.max(200, availableHeight)}px`
    }, 200)
  })
}

onMounted(() => {
  fetchOperationData()
  calculateTableHeight()
  window.addEventListener('resize', calculateTableHeight)
  window.addEventListener('table-pagination-change', calculateTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateTableHeight)
  window.removeEventListener('table-pagination-change', calculateTableHeight)
})
</script>

<style scoped>
.log-management {
  padding: 0;
}

.content-card {
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-form {
  margin: 0;
}

.search-form :deep(.ant-form-item) {
  margin-right: 48px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.search-form :deep(.ant-form-item:last-child) {
  margin-right: 0;
}

/* 当按钮换行时，添加上边距 */
@media (max-width: 1400px) {
  .search-form :deep(.ant-form-item:last-child) {
    margin-top: 16px;
  }
}

:deep(.ant-table-thead > tr > th) {
  height: 46px;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td) {
  height: 46px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-pagination-options-size-changer .ant-select-selection-item) {
  padding-right: 24px;
}
</style>
