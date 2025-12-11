<template>
  <a-layout class="layout">
    <!-- 左侧菜单栏 -->
    <Sidebar v-model:collapsed="collapsed" />

    <!-- 右侧内容区 -->
    <a-layout :style="{ marginLeft: collapsed ? '80px' : '208px', transition: 'margin-left 0.2s' }">
      <!-- 右上角头部 -->
      <Header v-model:collapsed="collapsed" />

      <!-- 标签栏 -->
      <div class="tabs-wrapper"
        :style="{ top: '64px', left: collapsed ? '80px' : '208px', right: '0', transition: 'left 0.2s' }">
        <Tabs v-model:tabs="tabs" @change="handleTabChange" @remove="handleTabRemove" />
      </div>

      <!-- 面包屑 -->
      <div v-if="route.path !== '/workbench'" class="breadcrumb-wrapper"
        :style="{ top: '104px', left: collapsed ? '80px' : '208px', right: '0', transition: 'left 0.2s' }">
        <Breadcrumb />
      </div>

      <!-- 正文内容区 -->
      <a-layout-content ref="contentRef" class="content" :style="{
        marginTop: route.path === '/workbench' ? '124px' : '146px',
        paddingBottom: shouldShowFooter(route) && !hasScroll ? '80px' : '0'
      }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>

      <!-- 如果内容没有滚动，版权信息固定在页面底部 -->
      <div v-if="shouldShowFooter(route) && !hasScroll" class="layout-footer"
        :style="{ left: collapsed ? '80px' : '208px', right: '0', transition: 'left 0.2s' }">
        <Copyright />
      </div>

      <!-- 如果内容有滚动，版权信息跟在内容后面（不使用固定定位） -->
      <div v-if="shouldShowFooter(route) && hasScroll" class="content-footer">
        <Copyright />
      </div>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Layout as ALayout, LayoutContent as ALayoutContent } from 'ant-design-vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Tabs from './components/Tabs.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Copyright from './components/Copyright.vue'
import type { TabItem } from './components/Tabs.vue'
import { useMenuStore } from '@/stores/menu'

const route = useRoute()
const menuStore = useMenuStore()
const collapsed = ref(false)
const contentRef = ref<InstanceType<typeof ALayoutContent> | null>(null)
const hasScroll = ref(false)
let resizeObserver: ResizeObserver | null = null
const tabs = ref<TabItem[]>([
  {
    key: 'workbench',
    title: '工作台',
    path: '/workbench',
    closable: false
  }
])

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  (path) => {
    // 排除登录和注册页
    if (path === '/login' || path === '/register') {
      return
    }

    // 检查标签是否已存在
    const existingTab = tabs.value.find(tab => tab.path === path)
    if (existingTab) {
      return
    }

    // 添加新标签（优先使用 store 中的路由名称映射）
    const title = menuStore.routeNameMap[path] || (route.meta?.title as string) || '未命名页面'
    const newTab: TabItem = {
      key: path.replace(/\//g, '-').substring(1) || 'default',
      title,
      path,
      closable: path !== '/workbench'
    }

    tabs.value.push(newTab)
  },
  { immediate: true }
)

const handleTabChange = (_key: string) => {
  // 标签切换已在 Tabs 组件中处理
}

const handleTabRemove = (_key: string) => {
  // 标签移除已在 Tabs 组件中处理
}

// 判断是否显示底部版权信息
// 列表页显示，详情页不显示
const shouldShowFooter = (routeInfo: any) => {
  // 排除登录和注册页
  if (routeInfo.path === '/login' || routeInfo.path === '/register') {
    return false
  }
  // 默认显示，除非路由 meta 中明确设置 showFooter: false
  if (routeInfo.meta?.showFooter === false) {
    return false
  }
  // 列表页默认显示
  return true
}

// 检查内容区域是否有滚动
const checkHasScroll = () => {
  nextTick(() => {
    if (!contentRef.value) return

    const element = contentRef.value.$el as HTMLElement
    if (!element) return

    // 检查整个文档是否有垂直滚动
    // 比较文档总高度和窗口可视高度
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
    const windowHeight = window.innerHeight

    // 如果文档高度大于窗口高度，说明有滚动
    hasScroll.value = documentHeight > windowHeight
  })
}

// 监听路由变化，重新检查滚动
watch(
  () => route.path,
  () => {
    checkHasScroll()
  }
)

// 监听侧边栏折叠状态，重新检查滚动
watch(
  () => collapsed.value,
  () => {
    checkHasScroll()
  }
)

// 监听窗口大小变化和内容变化，重新计算布局高度
const recalculateLayout = () => {
  nextTick(() => {
    checkHasScroll()
    // 触发重新布局计算
    if (contentRef.value) {
      const element = contentRef.value.$el as HTMLElement
      if (element) {
        // 强制重新计算高度
        element.style.height = 'auto'
        nextTick(() => {
          element.style.height = ''
        })
      }
    }
  })
}

// 监听全局事件，当表格分页变化时重新计算
onMounted(() => {
  // 初始化菜单数据
  menuStore.initMenu()

  checkHasScroll()

  // 使用 ResizeObserver 监听内容区域大小变化
  if (contentRef.value) {
    const element = contentRef.value.$el as HTMLElement
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        checkHasScroll()
        recalculateLayout()
      })
      resizeObserver.observe(element)

      // 也监听窗口大小变化
      window.addEventListener('resize', () => {
        checkHasScroll()
        recalculateLayout()
      })
    }
  }

  // 监听自定义事件，当表格分页变化时触发
  window.addEventListener('table-pagination-change', recalculateLayout)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', recalculateLayout)
  window.removeEventListener('table-pagination-change', recalculateLayout)
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.tabs-wrapper {
  position: fixed;
  z-index: 98;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.breadcrumb-wrapper {
  position: fixed;
  z-index: 97;
  background: transparent;
}

.content {
  margin: 20px 20px 20px 20px;
  padding: 0;
  background: transparent;
  height: calc(100vh - 224px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.layout-footer {
  position: fixed;
  bottom: 20px;
  padding: 0;
  margin: 0;
  background: transparent;
  z-index: 97;
}

.content-footer {
  margin: 0;
  margin-bottom: 20px;
  padding: 0;
  background: transparent;
  position: relative;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
