<template>
  <div class="breadcrumb-wrapper">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <a v-if="index < breadcrumbItems.length - 1" @click="handleBreadcrumbClick(item, index)">
          {{ item.title }}
        </a>
        <span v-else>{{ item.title }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue'
import { useMenuStore } from '@/stores/menu'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

// 初始化菜单数据
onMounted(() => {
  menuStore.initMenu()
})

// 处理面包屑点击
const handleBreadcrumbClick = (item: { path: string; title: string }, index: number) => {
  // 点击首页，跳转到工作台
  if (index === 0 || item.path === '/workbench') {
    router.push('/workbench')
    return
  }

  // 点击当前页，跳转到对应路径
  router.push(item.path)
}

// 生成面包屑数据（只显示首页和当前页）
const breadcrumbItems = computed(() => {
  const path = route.path

  // 如果是首页，只显示首页
  if (path === '/workbench') {
    return [
      {
        path: '/workbench',
        title: '首页'
      }
    ]
  }

  // 其他页面显示：首页 -> 当前页
  const currentTitle = menuStore.routeNameMap[path] || (route.meta?.title as string) || '当前页'

  return [
    {
      path: '/workbench',
      title: '首页'
    },
    {
      path: path,
      title: currentTitle
    }
  ]
})
</script>

<style scoped>
.breadcrumb-wrapper {
  background: transparent !important;
  margin-top: 10px;
  padding: 0 24px;
  height: 22px;
  display: flex;
  align-items: center;
}

.breadcrumb-wrapper :deep(.ant-breadcrumb) {
  background: transparent !important;
}

.breadcrumb-wrapper :deep(.ant-breadcrumb a) {
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: color 0.3s;
}

.breadcrumb-wrapper :deep(.ant-breadcrumb a:hover) {
  color: #1677ff;
}
</style>
