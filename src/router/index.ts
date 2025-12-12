import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import NProgress from 'nprogress'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/workbench',
    children: [
      {
        path: '/workbench',
        name: 'Workbench',
        component: () => import('@/views/system/Dashboard/Dashboard.vue'),
        meta: {
          title: '工作台',
          icon: 'AppstoreOutlined'
        }
      },
      {
        path: '/system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/System/User.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserOutlined'
        }
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/System/Role.vue'),
        meta: {
          title: '角色管理',
          icon: 'ProfileOutlined'
        }
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/System/Menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'BlockOutlined'
        }
      },
      {
        path: '/system/organization',
        name: 'SystemOrganization',
        component: () => import('@/views/system/System/Organization.vue'),
        meta: {
          title: '组织架构',
          icon: 'ApartmentOutlined'
        }
      },
      {
        path: '/system/dict',
        name: 'SystemDict',
        component: () => import('@/views/system/System/Dict.vue'),
        meta: {
          title: '数据字典',
          icon: 'BookOutlined'
        }
      },
      {
        path: '/system/log',
        name: 'SystemLog',
        component: () => import('@/views/system/System/Log.vue'),
        meta: {
          title: '系统日志',
          icon: 'FileTextOutlined'
        }
      },
      {
        path: '/notification/system',
        name: 'NotificationSystem',
        component: () => import('@/views/system/Notification/SystemNotification.vue'),
        meta: {
          title: '系统通知',
          icon: 'NotificationOutlined'
        }
      },
      {
        path: '/notification/message',
        name: 'NotificationMessage',
        component: () => import('@/views/system/Notification/Message.vue'),
        meta: {
          title: '站内信',
          icon: 'MessageOutlined'
        }
      },
      {
        path: '/notification/announcement',
        name: 'NotificationAnnouncement',
        component: () => import('@/views/system/Notification/Announcement.vue'),
        meta: {
          title: '公告管理',
          icon: 'SoundOutlined'
        }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/system/User/Profile/index.vue'),
        meta: {
          title: '个人中心',
          hideInMenu: true
        }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/system/User/Settings/index.vue'),
        redirect: '/settings/basic',
        meta: {
          title: '个人设置',
          hideInMenu: true
        },
        children: [
          {
            path: 'basic',
            name: 'SettingsBasic',
            component: () => import('@/views/system/User/Settings/Basic.vue'),
            meta: {
              title: '基础设置'
            }
          },
          {
            path: 'security',
            name: 'SettingsSecurity',
            component: () => import('@/views/system/User/Settings/Security.vue'),
            meta: {
              title: '安全设置'
            }
          },
          {
            path: 'binding',
            name: 'SettingsBinding',
            component: () => import('@/views/system/User/Settings/Binding.vue'),
            meta: {
              title: '账户绑定'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/system/User/Login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
      layout: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/system/User/Register.vue'),
    meta: {
      title: '注册',
      hideInMenu: true,
      layout: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/system/User/ForgotPassword.vue'),
    meta: {
      title: '重置密码',
      hideInMenu: true,
      layout: false
    }
  },
  {
    path: '/qrcode/:platform',
    name: 'QrCode',
    component: () => import('@/views/system/User/Settings/Binding/QrCode.vue'),
    meta: {
      title: '二维码',
      hideInMenu: true,
      layout: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 配置 NProgress
NProgress.configure({ showSpinner: false })

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 开始进度条
  NProgress.start()

  const userStore = useUserStore()
  const token = userStore.token

  // 白名单：不需要登录的页面
  const whiteList = ['/login', '/register', '/forgot-password']

  // 二维码页面路径匹配
  const isQrCodePage = to.path.startsWith('/qrcode/')

  // 如果已登录，访问登录/注册页时重定向到首页
  if (token && whiteList.includes(to.path)) {
    next('/')
    return
  }

  // 如果未登录，访问需要登录的页面时重定向到登录页（二维码页面允许访问）
  if (!token && !whiteList.includes(to.path) && !isQrCodePage) {
    next('/login')
    return
  }

  // 设置页面标题
  const appTitle = import.meta.env.VITE_APP_TITLE || 'GPAdmin管理后台'
  document.title = to.meta.title ? `${to.meta.title} - ${appTitle}` : appTitle

  next()
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

export function setupRouter(app: App) {
  app.use(router)
}

export default router
