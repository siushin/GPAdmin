<template>
  <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="208" :collapsed-width="80"
    class="sidebar">
    <!-- Logo -->
    <div class="logo-wrapper" :class="{ collapsed: collapsed }">
      <img src="@/assets/pokemon.png" alt="Logo" class="logo-img" :class="{ collapsed: collapsed }" />
      <span v-if="!collapsed" class="logo-text">{{ appTitle }}</span>
    </div>

    <!-- 菜单 -->
    <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" theme="dark"
      :items="menuItems" :inline-collapsed="collapsed" @click="handleMenuClick" />

    <!-- 底部折叠按钮 -->
    <div class="sidebar-footer" :class="{ collapsed: collapsed }" :style="{ width: `${sidebarWidth}px` }"
      @click="toggleCollapse">
      <MenuUnfoldOutlined v-if="collapsed" class="collapse-icon" />
      <MenuFoldOutlined v-else class="collapse-icon" />
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch, h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  ProfileOutlined,
  BlockOutlined,
  ApartmentOutlined,
  BookOutlined,
  FileTextOutlined,
  BellOutlined,
  NotificationOutlined,
  MessageOutlined,
  SoundOutlined
} from '@ant-design/icons-vue'
import { useMenuStore, type MenuItem } from '@/stores/menu'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const collapsed = computed({
  get: () => props.collapsed,
  set: (value) => emit('update:collapsed', value)
})

const sidebarWidth = computed(() => collapsed.value ? 80 : 208)

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 环境变量
const appTitle = import.meta.env.VITE_APP_TITLE || 'GPAdmin管理后台'

// 图标映射
const iconMap: Record<string, any> = {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  ProfileOutlined,
  BlockOutlined,
  ApartmentOutlined,
  BookOutlined,
  FileTextOutlined,
  BellOutlined,
  NotificationOutlined,
  MessageOutlined,
  SoundOutlined
}

// 转换菜单项格式，将图标字符串转换为组件
const transformMenuItems = (items: MenuItem[]): any[] => {
  return items.map(item => {
    const menuItem: any = {
      key: item.key,
      label: item.label,
      title: item.title
    }

    // 处理图标
    if (item.icon) {
      if (typeof item.icon === 'string') {
        const IconComponent = iconMap[item.icon]
        if (IconComponent) {
          menuItem.icon = () => h(IconComponent)
        }
      } else if (typeof item.icon === 'function') {
        menuItem.icon = item.icon
      }
    }

    // 处理子菜单
    if (item.children && item.children.length > 0) {
      menuItem.children = transformMenuItems(item.children)
    }

    return menuItem
  })
}

// 菜单配置（从 store 获取）
const menuItems = computed(() => {
  if (menuStore.menuItems.length > 0) {
    return transformMenuItems(menuStore.menuItems)
  }
  // 默认菜单（fallback）
  return [
    {
      key: '/workbench',
      icon: () => h(AppstoreOutlined),
      label: '工作台',
      title: '工作台'
    },
    {
      key: '/notification',
      icon: () => h(BellOutlined),
      label: '通知管理',
      title: '通知管理',
      children: [
        {
          key: '/notification/system',
          icon: () => h(NotificationOutlined),
          label: '系统通知',
          title: '系统通知'
        },
        {
          key: '/notification/message',
          icon: () => h(MessageOutlined),
          label: '站内信',
          title: '站内信'
        },
        {
          key: '/notification/announcement',
          icon: () => h(SoundOutlined),
          label: '公告管理',
          title: '公告管理'
        }
      ]
    },
    {
      key: '/system',
      icon: () => h(SettingOutlined),
      label: '系统管理',
      title: '系统管理',
      children: [
        {
          key: '/system/user',
          icon: () => h(UserOutlined),
          label: '用户管理',
          title: '用户管理'
        },
        {
          key: '/system/role',
          icon: () => h(ProfileOutlined),
          label: '角色管理',
          title: '角色管理'
        },
        {
          key: '/system/menu',
          icon: () => h(BlockOutlined),
          label: '菜单管理',
          title: '菜单管理'
        },
        {
          key: '/system/organization',
          icon: () => h(ApartmentOutlined),
          label: '组织架构',
          title: '组织架构'
        },
        {
          key: '/system/dict',
          icon: () => h(BookOutlined),
          label: '数据字典',
          title: '数据字典'
        },
        {
          key: '/system/log',
          icon: () => h(FileTextOutlined),
          label: '系统日志',
          title: '系统日志'
        }
      ]
    }
  ]
})

// 初始化菜单数据
onMounted(() => {
  menuStore.initMenu()
})

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
    // 自动展开父级菜单
    const matchedRoute = menuItems.value.find(item => {
      if (item.key === path) return true
      if (item.children) {
        return item.children.some((child: any) => child.key === path)
      }
      return false
    })
    if (matchedRoute && matchedRoute.children) {
      openKeys.value = [matchedRoute.key as string]
    }
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 40px;
  overflow: auto;
  z-index: 100;
}

.logo-wrapper {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-wrapper.collapsed {
  justify-content: center;
  padding: 0;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 4px;
  flex-shrink: 0;
}

.logo-img.collapsed {
  margin-right: 0;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  background: #001529;
  z-index: 100;
}

.sidebar-footer.collapsed {
  justify-content: center;
  padding-left: 0;
}

.collapse-icon {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
}
</style>
