/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',
      },
      {
        name: 'resetPassword',
        path: '/user/reset-password',
        component: './user/reset-password',
      },
    ],
  },

  {
    path: '/',
    component: './index',
  },

  // 工作台
  {
    path: '/workbench',
    name: 'workbench',
    component: './dashboard/Workplace',
    access: 'canAdmin',
  },

  // 用户管理
  {
    path: '/user',
    name: 'user',
    redirect: '/user/list',
    access: 'canAdmin',
  },
  {
    path: '/user/list',
    name: 'user.list',
    component: './user/User',
    access: 'canAdmin',
  },
  {
    path: '/user/pending',
    name: 'user.pending',
    component: './user/Pending',
    access: 'canAdmin',
  },

  // 通知管理
  {
    path: '/notification',
    name: 'notif',
    redirect: '/notification/system',
    access: 'canAdmin',
  },
  {
    path: '/notification/system',
    name: 'notif.system',
    component: './notification/System',
    access: 'canAdmin',
  },
  {
    path: '/notification/message',
    name: 'notif.message',
    component: './notification/Message',
    access: 'canAdmin',
  },
  {
    path: '/notification/announcement',
    name: 'notif.announcement',
    component: './notification/Announcement',
    access: 'canAdmin',
  },

  // 应用管理
  {
    path: '/app',
    name: 'app',
    redirect: '/app/market',
    access: 'canAdmin',
  },
  {
    path: '/app/market',
    name: 'app.market',
    component: './app/Market',
    access: 'canAdmin',
  },
  {
    path: '/app/my',
    name: 'app.my',
    component: './app/My',
    access: 'canAdmin',
  },

  // 组织架构管理
  {
    path: '/organization',
    name: 'org',
    redirect: '/organization/company',
    access: 'canAdmin',
  },
  {
    path: '/organization/company',
    name: 'org.company',
    component: './organization/Company',
    access: 'canAdmin',
  },
  {
    path: '/organization/department',
    name: 'org.dept',
    component: './organization/Department',
    access: 'canAdmin',
  },
  {
    path: '/organization/position',
    name: 'org.position',
    component: './organization/Position',
    access: 'canAdmin',
  },
  {
    path: '/organization/job',
    name: 'org.job',
    component: './organization/Job',
    access: 'canAdmin',
  },

  // 菜单管理
  {
    path: '/menu',
    name: 'menu',
    redirect: '/menu/role',
    access: 'canAdmin',
  },
  {
    path: '/menu/role',
    name: 'menu.role',
    component: './menu/Role',
    access: 'canAdmin',
  },
  {
    path: '/menu/menu',
    name: 'menu.menu',
    component: './menu/Menu',
    access: 'canAdmin',
  },

  // 系统管理
  {
    path: '/system',
    name: 'system',
    redirect: '/system/admin',
    access: 'canAdmin',
  },
  {
    path: '/system/admin',
    name: 'system.admin',
    component: './system/Admin',
    access: 'canAdmin',
  },
  {
    path: '/system/dict',
    name: 'system.dict',
    component: './system/Dict',
    access: 'canAdmin',
  },
  {
    path: '/system/dict/tree',
    name: 'system.dict.tree',
    component: './system/DictTree',
    access: 'canAdmin',
  },
  {
    path: '/system/log',
    name: 'system.log',
    component: './system/Log',
    access: 'canAdmin',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
