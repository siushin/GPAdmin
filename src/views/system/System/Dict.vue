<template>
  <div class="dict-management">
    <a-card :bordered="false" class="content-card">
      <div class="table-wrapper">
        <!-- 搜索栏 -->
        <div class="table-header">
          <a-form layout="inline" :model="searchForm" class="search-form">
            <a-form-item label="字典类型">
              <a-input v-model:value="searchForm.type" placeholder="请输入字典类型" allow-clear />
            </a-form-item>
            <a-form-item label="字典名称">
              <a-input v-model:value="searchForm.name" placeholder="请输入字典名称" allow-clear />
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
        <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: tableScrollHeight, x: 'max-content' }" @resizeColumn="handleResizeColumn"
          @change="handleTableChange">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 1 ? 'success' : 'error'">
                {{ record.status === 1 ? '启用' : '禁用' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleViewItems(record)">字典项</a-button>
                <a-button type="link" size="small">编辑</a-button>
                <a-button type="link" size="small" danger>删除</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
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
  SelectOption as ASelectOption
} from 'ant-design-vue'
import { PlusOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { mockApi } from '@/mock'

const loading = ref(false)
const dataSource = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const tableScrollHeight = ref<string>('calc(100vh - 500px)')
const searchForm = reactive({
  type: '',
  name: ''
})

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const columns = ref([
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    resizable: true
  },
  {
    title: '字典类型',
    dataIndex: 'type',
    key: 'type',
    width: 150,
    resizable: true
  },
  {
    title: '字典名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    resizable: true
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    resizable: true
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    resizable: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    resizable: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    resizable: true
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    resizable: false,
    fixed: 'right'
  }
])

const handleResizeColumn = (w: number, col: any) => {
  col.width = w
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await mockApi.getDicts({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
      ...searchForm
    })
    if (res.code === 200) {
      dataSource.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取字典列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  const oldPageSize = pagination.value.pageSize
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize

  if (oldPageSize !== pag.pageSize) {
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('table-pagination-change', {
        detail: { pageSize: pag.pageSize }
      }))
    })
  }

  fetchData()
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.name = ''
  pagination.value.current = 1
  fetchData()
}

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const handleViewItems = (record: any) => {
  console.log('查看字典项', record)
  // TODO: 打开字典项弹窗或跳转
}

const calculateTableHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      const tableWrapper = document.querySelector('.dict-management .table-wrapper')
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
  fetchData()
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
.dict-management {
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

:deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none;
}

:deep(.ant-pagination-options-size-changer .ant-select-selection-item) {
  padding-right: 24px;
}
</style>
