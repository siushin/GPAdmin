// 菜单和路由相关 Mock 数据

// 菜单管理 Mock 数据
const generateMenus = () => {
  const menus = []
  const menuIcons = ['AppstoreOutlined', 'SettingOutlined', 'UserOutlined', 'ProfileOutlined', 'BlockOutlined', 'ApartmentOutlined', 'FileOutlined', 'FolderOutlined']

  // 生成一级菜单
  for (let i = 1; i <= 10; i++) {
    const children = []
    // 每个一级菜单生成3-5个子菜单
    const childCount = 3 + (i % 3)
    for (let j = 1; j <= childCount; j++) {
      children.push({
        id: i * 100 + j,
        name: `子菜单${i}-${j}`,
        path: `/menu${i}/sub${j}`,
        icon: menuIcons[j % menuIcons.length],
        type: j % 3 === 0 ? 'button' : 'menu',
        sort: j,
        status: j % 4 === 0 ? 0 : 1,
        parentId: i
      })
    }

    menus.push({
      id: i,
      name: `菜单${i}`,
      path: `/menu${i}`,
      icon: menuIcons[i % menuIcons.length],
      type: 'menu',
      sort: i,
      status: i % 5 === 0 ? 0 : 1,
      parentId: 0,
      children: children
    })
  }

  return menus
}

export const mockMenus = generateMenus()

// 菜单 Mock 数据（用于侧边栏和路由）
const generateMenuData = () => {
  return [
    {
      id: 1,
      name: '工作台',
      path: '/workbench',
      icon: 'AppstoreOutlined',
      type: 'menu',
      sort: 1,
      status: 1,
      parentId: 0
    },
    {
      id: 2,
      name: '通知管理',
      path: '/notification',
      icon: 'BellOutlined',
      type: 'menu',
      sort: 2,
      status: 1,
      parentId: 0,
      children: [
        {
          id: 21,
          name: '系统通知',
          path: '/notification/system',
          icon: 'NotificationOutlined',
          type: 'menu',
          sort: 1,
          status: 1,
          parentId: 2
        },
        {
          id: 22,
          name: '站内信',
          path: '/notification/message',
          icon: 'MessageOutlined',
          type: 'menu',
          sort: 2,
          status: 1,
          parentId: 2
        },
        {
          id: 23,
          name: '公告管理',
          path: '/notification/announcement',
          icon: 'SoundOutlined',
          type: 'menu',
          sort: 3,
          status: 1,
          parentId: 2
        }
      ]
    },
    {
      id: 3,
      name: '系统管理',
      path: '/system',
      icon: 'SettingOutlined',
      type: 'menu',
      sort: 3,
      status: 1,
      parentId: 0,
      children: [
        {
          id: 31,
          name: '用户管理',
          path: '/system/user',
          icon: 'UserOutlined',
          type: 'menu',
          sort: 1,
          status: 1,
          parentId: 3
        },
        {
          id: 32,
          name: '角色管理',
          path: '/system/role',
          icon: 'ProfileOutlined',
          type: 'menu',
          sort: 2,
          status: 1,
          parentId: 3
        },
        {
          id: 33,
          name: '菜单管理',
          path: '/system/menu',
          icon: 'BlockOutlined',
          type: 'menu',
          sort: 3,
          status: 1,
          parentId: 3
        },
        {
          id: 34,
          name: '组织架构',
          path: '/system/organization',
          icon: 'ApartmentOutlined',
          type: 'menu',
          sort: 4,
          status: 1,
          parentId: 3
        },
        {
          id: 35,
          name: '数据字典',
          path: '/system/dict',
          icon: 'BookOutlined',
          type: 'menu',
          sort: 5,
          status: 1,
          parentId: 3
        },
        {
          id: 36,
          name: '系统日志',
          path: '/system/log',
          icon: 'FileTextOutlined',
          type: 'menu',
          sort: 6,
          status: 1,
          parentId: 3
        }
      ]
    }
  ]
}

export const mockMenuData = generateMenuData()

// 路由名称映射 Mock 数据
const generateRouteNameMap = () => {
  return {
    '/workbench': '工作台',
    '/notification': '通知管理',
    '/notification/system': '系统通知',
    '/notification/message': '站内信',
    '/notification/announcement': '公告管理',
    '/system': '系统管理',
    '/system/user': '用户管理',
    '/system/role': '角色管理',
    '/system/menu': '菜单管理',
    '/system/organization': '组织架构',
    '/system/dict': '数据字典',
    '/system/log': '系统日志'
  }
}

export const mockRouteNameMap = generateRouteNameMap()

// 菜单和路由相关 Mock API
export const menuMock = {
  // 获取菜单列表（用于侧边栏）
  getMenus: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: mockMenuData,
            total: mockMenuData.length
          }
        })
      }, 300)
    })
  },

  // 获取路由名称映射
  getRouteNameMap: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: mockRouteNameMap
        })
      }, 300)
    })
  },

  // 获取菜单列表（用于菜单管理页面）
  getMenuList: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: mockMenus,
            total: mockMenus.length
          }
        })
      }, 500)
    })
  },

  // 获取菜单列表（用于侧边栏）- 别名，保持兼容性
  getMenusForSidebar: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: mockMenuData,
            total: mockMenuData.length
          }
        })
      }, 300)
    })
  }
}
