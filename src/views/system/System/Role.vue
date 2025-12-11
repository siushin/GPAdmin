<template>
  <div class="role-management">
    <a-card :bordered="false" class="content-card">
      <div class="table-wrapper">
        <!-- 搜索栏 -->
        <div class="table-header">
          <a-form layout="inline" :model="searchForm" class="search-form">
            <a-form-item label="角色名称">
              <a-input v-model:value="searchForm.name" placeholder="请输入角色名称" allow-clear />
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
            <a-button danger>
              <template #icon>
                <DeleteOutlined />
              </template>
              批量删除
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
            <template v-else-if="column.key === 'permissions'">
              <a-tag v-for="perm in record.permissions" :key="perm" style="margin-right: 4px">
                {{ perm }}
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
import { PlusOutlined, ExportOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { mockApi } from '@/mock'

const loading = ref(false)
const dataSource = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const tableScrollHeight = ref<string>('calc(100vh - 500px)')
const searchForm = reactive({
  name: '',
  status: undefined
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
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    resizable: true
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code',
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
    title: '权限',
    key: 'permissions',
    width: 200,
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
    width: 150,
    resizable: false,
    fixed: 'right'
  }
])

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await mockApi.getRoles({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize
    })
    if (res.code === 200) {
      dataSource.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取角色列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  const oldPageSize = pagination.value.pageSize
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize

  // 如果每页显示数量发生变化，触发重新计算布局高度
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
  searchForm.name = ''
  searchForm.status = undefined
  pagination.value.current = 1
  fetchData()
}

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

// 列宽拖拽处理函数
const handleResizeColumn = (w: number, col: any) => {
  col.width = w
}

// 计算表格滚动高度
const calculateTableHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      const tableWrapper = document.querySelector('.role-management .table-wrapper')
      if (!tableWrapper) return

      // 获取表格元素
      const tableElement = tableWrapper.querySelector('.ant-table')
      if (!tableElement) return

      // 获取表格表头位置
      const tableHeader = tableElement.querySelector('.ant-table-thead')
      if (!tableHeader) return

      const headerRect = tableHeader.getBoundingClientRect()
      const tableHeaderTop = headerRect.top

      // 获取分页器实际位置和高度
      const paginationElement = tableWrapper.querySelector('.ant-pagination')
      if (!paginationElement) return

      const paginationRect = paginationElement.getBoundingClientRect()
      const paginationTop = paginationRect.top

      // 获取表格表头底部位置
      const tableHeaderBottom = headerRect.bottom

      // 计算可用高度：分页器顶部位置 - 表格表头底部位置 - 安全边距
      // 这样确保表格body在表头和分页器之间，分页器始终可见
      const availableHeight = paginationTop - tableHeaderBottom - 16 // 16px安全边距
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
.role-management {
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

/* 分页组件中文样式 - 确保显示"条/页"格式 */
:deep(.ant-pagination-options-size-changer .ant-select-selection-item) {
  padding-right: 24px;
}
</style>
