import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

// 菜单项类型
export interface MenuItem {
  key: string
  icon?: string | (() => any)
  label: string
  title: string
  path?: string
  children?: MenuItem[]
}

// 路由名称映射类型
export interface RouteNameMap {
  [key: string]: string
}

export const useMenuStore = defineStore('menu', () => {
  // 菜单列表
  const menuItems = ref<MenuItem[]>([])

  // 路由名称映射
  const routeNameMap = ref<RouteNameMap>({})

  // 是否已加载
  const loaded = ref(false)

  // 获取菜单数据
  const fetchMenus = async () => {
    try {
      const response = await api.getMenus()
      if (response.code === 200 && response.data) {
        menuItems.value = transformMenuData(response.data.list || response.data)
        // 从菜单数据中提取路由名称映射
        routeNameMap.value = extractRouteNameMap(menuItems.value)
        loaded.value = true
      }
    } catch (error) {
      console.error('获取菜单失败:', error)
      // 如果接口失败，使用默认菜单
      menuItems.value = getDefaultMenus()
      routeNameMap.value = getDefaultRouteNameMap()
      loaded.value = true
    }
  }

  // 获取路由名称映射
  const fetchRouteNameMap = async () => {
    try {
      const response = await api.getRouteNameMap()
      if (response.code === 200 && response.data) {
        routeNameMap.value = response.data
        loaded.value = true
      }
    } catch (error) {
      console.error('获取路由名称映射失败:', error)
      // 如果接口失败，从菜单数据中提取
      if (menuItems.value.length > 0) {
        routeNameMap.value = extractRouteNameMap(menuItems.value)
      } else {
        routeNameMap.value = getDefaultRouteNameMap()
      }
      loaded.value = true
    }
  }

  // 初始化菜单和路由名称映射
  const initMenu = async () => {
    if (!loaded.value) {
      await fetchMenus()
      // 如果菜单数据中没有路由名称映射，尝试单独获取
      if (Object.keys(routeNameMap.value).length === 0) {
        await fetchRouteNameMap()
      }
    }
  }

  // 转换菜单数据格式（将后端数据转换为前端需要的格式）
  const transformMenuData = (data: any[]): MenuItem[] => {
    return data.map(item => ({
      key: item.path || item.key,
      icon: item.icon,
      label: item.name || item.label,
      title: item.name || item.title,
      path: item.path,
      children: item.children ? transformMenuData(item.children) : undefined
    }))
  }

  // 从菜单数据中提取路由名称映射
  const extractRouteNameMap = (menus: MenuItem[]): RouteNameMap => {
    const map: RouteNameMap = {}

    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        if (item.key) {
          map[item.key] = item.title || item.label
        }
        if (item.children) {
          traverse(item.children)
        }
      })
    }

    traverse(menus)
    return map
  }

  // 默认菜单数据
  const getDefaultMenus = (): MenuItem[] => {
    return [
      {
        key: '/workbench',
        icon: 'AppstoreOutlined',
        label: '工作台',
        title: '工作台'
      },
      {
        key: '/notification',
        icon: 'BellOutlined',
        label: '通知管理',
        title: '通知管理',
        children: [
          {
            key: '/notification/system',
            icon: 'NotificationOutlined',
            label: '系统通知',
            title: '系统通知'
          },
          {
            key: '/notification/message',
            icon: 'MessageOutlined',
            label: '站内信',
            title: '站内信'
          },
          {
            key: '/notification/announcement',
            icon: 'SoundOutlined',
            label: '公告管理',
            title: '公告管理'
          }
        ]
      },
      {
        key: '/system',
        icon: 'SettingOutlined',
        label: '系统管理',
        title: '系统管理',
        children: [
          {
            key: '/system/user',
            icon: 'UserOutlined',
            label: '用户管理',
            title: '用户管理'
          },
          {
            key: '/system/role',
            icon: 'ProfileOutlined',
            label: '角色管理',
            title: '角色管理'
          },
          {
            key: '/system/menu',
            icon: 'BlockOutlined',
            label: '菜单管理',
            title: '菜单管理'
          },
          {
            key: '/system/organization',
            icon: 'ApartmentOutlined',
            label: '组织架构',
            title: '组织架构'
          },
          {
            key: '/system/dict',
            icon: 'BookOutlined',
            label: '数据字典',
            title: '数据字典'
          },
          {
            key: '/system/log',
            icon: 'FileTextOutlined',
            label: '系统日志',
            title: '系统日志'
          }
        ]
      }
    ]
  }

  // 默认路由名称映射
  const getDefaultRouteNameMap = (): RouteNameMap => {
    return {
      '/workbench': '工作台',
      '/system': '系统管理',
      '/system/user': '用户管理',
      '/system/role': '角色管理',
      '/system/menu': '菜单管理',
      '/system/organization': '组织架构',
      '/system/dict': '数据字典',
      '/system/log': '系统日志',
      '/notification': '通知管理',
      '/notification/system': '系统通知',
      '/notification/message': '站内信',
      '/notification/announcement': '公告管理',
      '/profile': '个人中心',
      '/settings': '个人设置',
      '/settings/basic': '基础设置',
      '/settings/security': '安全设置',
      '/settings/binding': '账户绑定'
    }
  }

  return {
    menuItems,
    routeNameMap,
    loaded,
    fetchMenus,
    fetchRouteNameMap,
    initMenu
  }
})
