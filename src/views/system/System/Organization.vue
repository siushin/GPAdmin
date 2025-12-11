<template>
  <div class="organization-management">
    <a-card :bordered="false" class="content-card">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="dept" tab="部门管理">
          <div class="table-wrapper">
            <!-- 搜索栏 -->
            <div class="table-header">
              <a-form layout="inline" :model="searchForm" class="search-form">
                <a-form-item label="部门名称">
                  <a-input v-model:value="searchForm.name" placeholder="请输入部门名称" allow-clear />
                </a-form-item>
                <a-form-item label="状态">
                  <a-select v-model:value="searchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="handleSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 操作按钮组 -->
            <div class="table-actions">
              <a-space>
                <a-button type="primary">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  新增
                </a-button>
                <a-button>
                  <template #icon>
                    <ExportOutlined />
                  </template>
                  导出
                </a-button>
              </a-space>
            </div>

            <!-- 表格 -->
            <a-table :columns="deptColumns" :data-source="deptDataSource" :loading="deptLoading"
              :pagination="deptPagination" :default-expand-all-rows="true" row-key="id"
              :scroll="{ y: tableScrollHeight, x: 'max-content' }" @resizeColumn="handleResizeColumn"
              @change="handleDeptTableChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 1 ? 'success' : 'error'">
                    {{ record.status === 1 ? '启用' : '禁用' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small">编辑</a-button>
                    <a-button type="link" size="small" danger>删除</a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="position" tab="职位管理">
          <div class="table-wrapper">
            <!-- 搜索栏 -->
            <div class="table-header">
              <a-form layout="inline" :model="positionSearchForm" class="search-form">
                <a-form-item label="职位名称">
                  <a-input v-model:value="positionSearchForm.name" placeholder="请输入职位名称" allow-clear />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="handlePositionSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handlePositionReset">重置</a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 操作按钮组 -->
            <div class="table-actions">
              <a-space>
                <a-button type="primary">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  新增
                </a-button>
              </a-space>
            </div>

            <!-- 表格 -->
            <a-table :columns="positionColumns" :data-source="positionDataSource" :loading="positionLoading"
              :pagination="positionPagination" :scroll="{ y: tableScrollHeight, x: 'max-content' }"
              @resizeColumn="handleResizeColumn" @change="handlePositionTableChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 1 ? 'success' : 'error'">
                    {{ record.status === 1 ? '启用' : '禁用' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small">编辑</a-button>
                    <a-button type="link" size="small" danger>删除</a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="post" tab="岗位管理">
          <div class="table-wrapper">
            <!-- 搜索栏 -->
            <div class="table-header">
              <a-form layout="inline" :model="postSearchForm" class="search-form">
                <a-form-item label="岗位名称">
                  <a-input v-model:value="postSearchForm.name" placeholder="请输入岗位名称" allow-clear />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="handlePostSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handlePostReset">重置</a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 操作按钮组 -->
            <div class="table-actions">
              <a-space>
                <a-button type="primary">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  新增
                </a-button>
              </a-space>
            </div>

            <!-- 表格 -->
            <a-table :columns="postColumns" :data-source="postDataSource" :loading="postLoading"
              :pagination="postPagination" :scroll="{ y: tableScrollHeight, x: 'max-content' }"
              @resizeColumn="handleResizeColumn" @change="handlePostTableChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 1 ? 'success' : 'error'">
                    {{ record.status === 1 ? '启用' : '禁用' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small">编辑</a-button>
                    <a-button type="link" size="small" danger>删除</a-button>
                  </a-space>
                </template>
              </template>
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
  Space as ASpace,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  Select as ASelect,
  SelectOption as ASelectOption,
  Tabs as ATabs,
  TabPane as ATabPane
} from 'ant-design-vue'
import { PlusOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { mockApi } from '@/mock'

const activeTab = ref('dept')
const tableScrollHeight = ref<string>('calc(100vh - 500px)')

// 部门相关
const deptLoading = ref(false)
const deptDataSource = ref<any[]>([])
const searchForm = reactive({
  name: '',
  status: undefined
})
const deptPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const deptColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80, resizable: true },
  { title: '部门名称', dataIndex: 'name', key: 'name', width: 150, resizable: true },
  { title: '部门编码', dataIndex: 'code', key: 'code', width: 150, resizable: true },
  { title: '负责人', dataIndex: 'leader', key: 'leader', width: 120, resizable: true },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 150, resizable: true },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 200, resizable: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, resizable: true },
  { title: '状态', key: 'status', width: 100, resizable: true },
  { title: '操作', key: 'action', width: 150, resizable: false, fixed: 'right' }
])

// 职位相关
const positionLoading = ref(false)
const positionDataSource = ref<any[]>([])
const positionSearchForm = reactive({
  name: ''
})
const positionPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const positionColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80, resizable: true },
  { title: '职位名称', dataIndex: 'name', key: 'name', width: 150, resizable: true },
  { title: '职位编码', dataIndex: 'code', key: 'code', width: 150, resizable: true },
  { title: '职级', dataIndex: 'level', key: 'level', width: 100, resizable: true },
  { title: '描述', dataIndex: 'description', key: 'description', width: 200, resizable: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, resizable: true },
  { title: '状态', key: 'status', width: 100, resizable: true },
  { title: '操作', key: 'action', width: 150, resizable: false, fixed: 'right' }
])

// 岗位相关
const postLoading = ref(false)
const postDataSource = ref<any[]>([])
const postSearchForm = reactive({
  name: ''
})
const postPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const postColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80, resizable: true },
  { title: '岗位名称', dataIndex: 'name', key: 'name', width: 150, resizable: true },
  { title: '岗位编码', dataIndex: 'code', key: 'code', width: 150, resizable: true },
  { title: '所属部门', dataIndex: 'deptName', key: 'deptName', width: 150, resizable: true },
  { title: '描述', dataIndex: 'description', key: 'description', width: 200, resizable: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, resizable: true },
  { title: '状态', key: 'status', width: 100, resizable: true },
  { title: '操作', key: 'action', width: 150, resizable: false, fixed: 'right' }
])

const handleResizeColumn = (w: number, col: any) => {
  col.width = w
}

const flattenTree = (tree: any[]): any[] => {
  const result: any[] = []
  const traverse = (nodes: any[]) => {
    nodes.forEach(node => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(tree)
  return result
}

const fetchDeptData = async () => {
  deptLoading.value = true
  try {
    const res: any = await mockApi.getDepts()
    if (res.code === 200) {
      const flattened = flattenTree(res.data.list)
      const start = (deptPagination.value.current - 1) * deptPagination.value.pageSize
      const end = start + deptPagination.value.pageSize
      deptDataSource.value = flattened.slice(start, end)
      deptPagination.value.total = flattened.length
    }
  } catch (error) {
    console.error('获取部门列表失败', error)
  } finally {
    deptLoading.value = false
  }
}

const fetchPositionData = async () => {
  positionLoading.value = true
  try {
    const res: any = await mockApi.getPositions({
      current: positionPagination.value.current,
      pageSize: positionPagination.value.pageSize
    })
    if (res.code === 200) {
      positionDataSource.value = res.data.list
      positionPagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取职位列表失败', error)
  } finally {
    positionLoading.value = false
  }
}

const fetchPostData = async () => {
  postLoading.value = true
  try {
    const res: any = await mockApi.getPosts({
      current: postPagination.value.current,
      pageSize: postPagination.value.pageSize
    })
    if (res.code === 200) {
      postDataSource.value = res.data.list
      postPagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取岗位列表失败', error)
  } finally {
    postLoading.value = false
  }
}

const handleTabChange = (key: string) => {
  if (key === 'dept' && deptDataSource.value.length === 0) {
    fetchDeptData()
  } else if (key === 'position' && positionDataSource.value.length === 0) {
    fetchPositionData()
  } else if (key === 'post' && postDataSource.value.length === 0) {
    fetchPostData()
  }
}

const handleDeptTableChange = (pag: any) => {
  deptPagination.value.current = pag.current
  deptPagination.value.pageSize = pag.pageSize
  fetchDeptData()
}

const handlePositionTableChange = (pag: any) => {
  positionPagination.value.current = pag.current
  positionPagination.value.pageSize = pag.pageSize
  fetchPositionData()
}

const handlePostTableChange = (pag: any) => {
  postPagination.value.current = pag.current
  postPagination.value.pageSize = pag.pageSize
  fetchPostData()
}

const handleSearch = () => {
  deptPagination.value.current = 1
  fetchDeptData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.status = undefined
  deptPagination.value.current = 1
  fetchDeptData()
}

const handlePositionSearch = () => {
  positionPagination.value.current = 1
  fetchPositionData()
}

const handlePositionReset = () => {
  positionSearchForm.name = ''
  positionPagination.value.current = 1
  fetchPositionData()
}

const handlePostSearch = () => {
  postPagination.value.current = 1
  fetchPostData()
}

const handlePostReset = () => {
  postSearchForm.name = ''
  postPagination.value.current = 1
  fetchPostData()
}

const calculateTableHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      const tableWrapper = document.querySelector('.organization-management .table-wrapper')
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
  fetchDeptData()
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
.organization-management {
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

.table-actions {
  margin-bottom: 16px;
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
