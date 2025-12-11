<template>
  <a-layout-header class="header" :style="{ left: collapsed ? '80px' : '208px' }">
    <div class="header-left">
      <MenuUnfoldOutlined v-if="collapsed" class="trigger" @click="toggleCollapse" />
      <MenuFoldOutlined v-else class="trigger" @click="toggleCollapse" />
    </div>

    <div class="header-right">
      <!-- 全屏 -->
      <FullscreenExitOutlined v-if="isFullscreen" class="header-icon" @click="toggleFullscreen" />
      <FullscreenOutlined v-else class="header-icon" @click="toggleFullscreen" />

      <!-- 通知 -->
      <div class="notification-wrapper">
        <a-badge :count="notificationCount" :number-style="{ backgroundColor: '#ff4d4f' }" class="header-badge">
          <BellOutlined class="header-icon" />
        </a-badge>
      </div>

      <!-- 用户信息 -->
      <a-dropdown>
        <div class="user-info">
          <a-avatar :size="32" class="user-avatar">
            <UserOutlined />
          </a-avatar>
          <span class="user-name">{{ userStore.userInfo?.nickname || 'admin' }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile" @click="handleProfile">
              <UserOutlined />
              个人中心
            </a-menu-item>
            <a-menu-item key="settings" @click="handleSettings">
              <SettingOutlined />
              个人设置
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <LogoutOutlined />
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import {
  Badge as ABadge,
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
  MenuDivider as AMenuDivider,
  Avatar as AAvatar,
  message
} from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const userStore = useUserStore()

const notificationCount = ref(11)
const isFullscreen = ref(false)

const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    })
  }
}

const handleProfile = () => {
  router.push('/profile')
}

const handleSettings = () => {
  router.push('/settings/basic')
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    message.success('已退出登录')
    // 使用 replace 避免返回上一页
    router.replace('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    message.error('退出登录失败，请重试')
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  right: 0;
  height: 64px;
  background: #fff;
  padding: 0 0 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 99;
  transition: left 0.2s;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  color: rgba(0, 0, 0, 0.65);
}

.trigger:hover {
  color: #1677ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding-right: 12px;
}

.notification-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 100%;
  line-height: 1;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.header-badge :deep(.ant-badge) {
  cursor: pointer;
  line-height: 1;
}

.header-badge :deep(.ant-badge-count) {
  cursor: pointer;
}

.header-badge :deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon:hover {
  color: #1677ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.user-avatar {
  background-color: #1677ff;
}

.user-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
