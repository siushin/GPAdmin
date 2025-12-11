<template>
  <div class="settings-container">
    <a-row :gutter="24">
      <!-- 左侧导航 -->
      <a-col :span="6">
        <a-card class="settings-nav-card">
          <a-menu v-model:selectedKeys="selectedKeys" mode="inline" :style="{ border: 'none' }"
            @click="handleMenuClick">
            <a-menu-item key="basic">
              <template #icon>
                <UserOutlined />
              </template>
              基础设置
            </a-menu-item>
            <a-menu-item key="security">
              <template #icon>
                <SafetyOutlined />
              </template>
              安全设置
            </a-menu-item>
            <a-menu-item key="binding">
              <template #icon>
                <LinkOutlined />
              </template>
              账户绑定
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>

      <!-- 右侧内容 -->
      <a-col :span="18">
        <a-card class="settings-content-card">
          <router-view />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserOutlined, SafetyOutlined, LinkOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const selectedKeys = ref<string[]>(['basic'])

// 根据路由设置选中的菜单项
const updateSelectedKeys = () => {
  const path = route.path
  if (path.includes('/security')) {
    selectedKeys.value = ['security']
  } else if (path.includes('/binding')) {
    selectedKeys.value = ['binding']
  } else {
    selectedKeys.value = ['basic']
  }
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateSelectedKeys()
  },
  { immediate: true }
)

onMounted(() => {
  updateSelectedKeys()
  // 如果直接访问 /settings，重定向到基础设置
  if (route.path === '/settings') {
    router.replace('/settings/basic')
  }
})

const handleMenuClick = ({ key }: { key: string }) => {
  if (key === 'basic') {
    router.push('/settings/basic')
  } else if (key === 'security') {
    router.push('/settings/security')
  } else if (key === 'binding') {
    router.push('/settings/binding')
  }
}
</script>

<style scoped>
.settings-container {
  padding: 0;
  min-height: calc(100vh - 200px);
}

.settings-nav-card {
  height: fit-content;
}

.settings-content-card {
  min-height: 600px;
}

:deep(.ant-menu-item) {
  margin: 0;
  height: 48px;
  line-height: 48px;
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>
