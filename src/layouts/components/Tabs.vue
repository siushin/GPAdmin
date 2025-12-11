<template>
  <div class="tabs-container">
    <!-- 标签栏 -->
    <div class="tabs-content">
      <a-tabs v-model:activeKey="activeKey" type="editable-card" hide-add @edit="handleEdit" @change="handleChange"
        class="page-tabs">
        <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.title" :closable="tab.closable" />
      </a-tabs>
    </div>

    <!-- 右侧操作组 -->
    <div class="tabs-actions-right">
      <a-dropdown>
        <a-button type="text" size="small" class="tabs-action-btn ellipsis-btn">
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
        <template #overlay>
          <a-menu @click="handleRightMenuClick">
            <a-menu-item key="closeLeft">
              <LeftOutlined />
              关闭左侧
            </a-menu-item>
            <a-menu-item key="closeRight">
              <RightOutlined />
              关闭右侧
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="closeOthers">
              <CloseOutlined />
              关闭其他
            </a-menu-item>
            <a-menu-item key="closeAll">
              <CloseCircleOutlined />
              关闭全部
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="refresh">
              <ReloadOutlined />
              刷新当前
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Tabs as ATabs,
  TabPane as ATabPane,
  Dropdown as ADropdown,
  Button as AButton,
  Menu as AMenu,
  MenuItem as AMenuItem,
  MenuDivider as AMenuDivider
} from 'ant-design-vue'
import {
  EllipsisOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

export interface TabItem {
  key: string
  title: string
  path: string
  closable: boolean
}

const router = useRouter()
const route = useRoute()

const props = defineProps<{
  tabs: TabItem[]
}>()

const emit = defineEmits<{
  'update:tabs': [tabs: TabItem[]]
  'change': [key: string]
  'remove': [key: string]
}>()

const activeKey = ref<string>('')

const tabs = computed({
  get: () => props.tabs,
  set: (value) => emit('update:tabs', value)
})

// 获取工作台标签
const getWorkbenchTab = (): TabItem => ({
  key: 'workbench',
  title: '工作台',
  path: '/workbench',
  closable: false
})

// 确保工作台标签存在
const ensureWorkbenchTab = (newTabs: TabItem[]): TabItem[] => {
  const workbenchTab = getWorkbenchTab()
  const hasWorkbench = newTabs.some(tab => tab.key === 'workbench')
  if (!hasWorkbench) {
    return [workbenchTab, ...newTabs]
  }
  return newTabs
}

// 监听路由变化，更新激活的标签
watch(
  () => route.path,
  (path) => {
    const tab = tabs.value.find(t => t.path === path)
    if (tab) {
      activeKey.value = tab.key
    }
  },
  { immediate: true }
)

const handleChange = (key: string | number) => {
  const keyStr = String(key)
  const tab = tabs.value.find(t => t.key === keyStr)
  if (tab) {
    router.push(tab.path)
    emit('change', keyStr)
  }
}

const handleEdit = (targetKey: string | number | MouseEvent | KeyboardEvent, action: 'add' | 'remove') => {
  if (action === 'remove') {
    const key = typeof targetKey === 'string' ? targetKey : String(targetKey)
    const targetIndex = tabs.value.findIndex(tab => tab.key === key)
    if (targetIndex === -1) return

    // 如果只剩下一个标签，不允许关闭，而是打开工作台
    if (tabs.value.length === 1) {
      const workbenchTab = getWorkbenchTab()
      tabs.value = [workbenchTab]
      activeKey.value = workbenchTab.key
      router.push(workbenchTab.path)
      return
    }

    const newTabs = [...tabs.value]
    newTabs.splice(targetIndex, 1)

    // 确保工作台标签存在
    const finalTabs = ensureWorkbenchTab(newTabs)
    tabs.value = finalTabs

    // 如果关闭的是当前激活的标签，切换到相邻的标签或工作台
    if (key === activeKey.value) {
      const newActiveKey = finalTabs[targetIndex]?.key || finalTabs[targetIndex - 1]?.key || finalTabs[0]?.key || 'workbench'
      activeKey.value = newActiveKey
      const newTab = finalTabs.find(t => t.key === newActiveKey)
      if (newTab) {
        router.push(newTab.path)
      } else {
        // 如果找不到，跳转到工作台
        const workbenchTab = getWorkbenchTab()
        activeKey.value = workbenchTab.key
        router.push(workbenchTab.path)
      }
    }

    emit('remove', key)
  }
}

const handleRightMenuClick = (info: any) => {
  const key = String(info.key)
  const currentIndex = tabs.value.findIndex(tab => tab.key === activeKey.value)
  const workbenchTab = getWorkbenchTab()

  switch (key) {
    case 'closeLeft':
      // 关闭左侧标签
      const leftTabs = tabs.value.slice(0, currentIndex).filter(tab => tab.closable)
      leftTabs.forEach(tab => {
        const index = tabs.value.findIndex(t => t.key === tab.key)
        if (index !== -1) {
          const newTabs = [...tabs.value]
          newTabs.splice(index, 1)
          tabs.value = ensureWorkbenchTab(newTabs)
        }
      })
      // 确保至少有一个标签（工作台）
      if (tabs.value.length === 0) {
        tabs.value = [workbenchTab]
        activeKey.value = workbenchTab.key
        router.push(workbenchTab.path)
      } else {
        const firstTab = tabs.value[0]
        if (tabs.value.length === 1 && firstTab && firstTab.closable) {
          // 如果只剩下一个可关闭的标签，打开工作台
          tabs.value = [workbenchTab]
          activeKey.value = workbenchTab.key
          router.push(workbenchTab.path)
        } else {
          // 确保当前激活的标签存在
          const currentTab = tabs.value.find(t => t.key === activeKey.value)
          if (!currentTab && firstTab) {
            activeKey.value = firstTab.key
            router.push(firstTab.path)
          }
        }
      }
      break
    case 'closeRight':
      // 关闭右侧标签
      const rightTabs = tabs.value.slice(currentIndex + 1).filter(tab => tab.closable)
      rightTabs.forEach(tab => {
        const index = tabs.value.findIndex(t => t.key === tab.key)
        if (index !== -1) {
          const newTabs = [...tabs.value]
          newTabs.splice(index, 1)
          tabs.value = ensureWorkbenchTab(newTabs)
        }
      })
      // 确保至少有一个标签（工作台）
      if (tabs.value.length === 0) {
        tabs.value = [workbenchTab]
        activeKey.value = workbenchTab.key
        router.push(workbenchTab.path)
      } else {
        const firstTab = tabs.value[0]
        if (tabs.value.length === 1 && firstTab && firstTab.closable) {
          // 如果只剩下一个可关闭的标签，打开工作台
          tabs.value = [workbenchTab]
          activeKey.value = workbenchTab.key
          router.push(workbenchTab.path)
        } else {
          // 确保当前激活的标签存在
          const currentTab = tabs.value.find(t => t.key === activeKey.value)
          if (!currentTab && firstTab) {
            activeKey.value = firstTab.key
            router.push(firstTab.path)
          }
        }
      }
      break
    case 'closeOthers':
      // 关闭其他标签，默认打开工作台
      tabs.value = [workbenchTab]
      activeKey.value = workbenchTab.key
      router.push(workbenchTab.path)
      break
    case 'closeAll':
      // 关闭全部，重新打开工作台
      tabs.value = [workbenchTab]
      activeKey.value = workbenchTab.key
      router.push(workbenchTab.path)
      break
    case 'refresh':
      // 刷新当前页
      router.go(0)
      break
  }
}
</script>

<style scoped>
.tabs-container {
  background: #fff;
  padding: 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  position: relative;
}

.tabs-actions-right {
  position: absolute;
  right: 16px;
  z-index: 10;
  padding: 0;
  height: 40px;
  display: flex;
  align-items: center;
  background: #fff;
}

.tabs-action-btn {
  color: rgba(0, 0, 0, 0.45);
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs-action-btn:hover {
  color: rgba(0, 0, 0, 0.85);
  background: rgba(0, 0, 0, 0.04);
}

.ellipsis-btn :deep(span),
.ellipsis-btn :deep(svg) {
  display: inline-block;
  transform: rotate(90deg);
}

.ellipsis-btn :deep(svg) {
  stroke-width: 2.5;
}

.ellipsis-btn :deep(path) {
  stroke-width: 2.5;
  stroke: currentColor;
}

.tabs-content {
  flex: 1;
  margin: 0;
  overflow: hidden;
}

.page-tabs {
  margin: 0;
}

.page-tabs :deep(.ant-tabs-nav) {
  margin: 0;
  padding: 0 16px 0 8px;
}

.page-tabs :deep(.ant-tabs-tab) {
  padding: 6px 12px;
  margin: 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  height: 40px;
  line-height: 28px;
}

.page-tabs :deep(.ant-tabs-tab-active) {
  background: transparent;
  border-bottom-color: #1677ff;
}

.page-tabs :deep(.ant-tabs-tab-btn) {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  padding: 0;
}

.page-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1677ff;
  font-weight: 500;
}

.page-tabs :deep(.ant-tabs-ink-bar) {
  display: none;
}

.page-tabs :deep(.ant-tabs-tab-remove) {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.6;
}

.page-tabs :deep(.ant-tabs-tab-remove:hover) {
  opacity: 1;
}
</style>
