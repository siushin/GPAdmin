/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 *
 * 业务路由配置在各模块的 routes.ts 中定义
 * 在此处统一引入并合并
 *
 * 模块对应关系：
 * - admin: 后端 Modules/Base
 * - app-market: 后端 Modules/AppMarket
 * - sms: 后端 Modules/Sms
 *
 * @doc https://umijs.org/docs/guides/routes
 */

// 引入各模块路由
import adminRoutes from '../src/modules/admin/routes';
import appMarketRoutes from '../src/modules/app-market/routes';
import smsRoutes from '../src/modules/sms/routes';

export default [
  // 登录相关路由（无布局）- 使用业务代码的登录页
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: '@/modules/admin/pages/user/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: '@/modules/admin/pages/user/register',
      },
      {
        name: 'resetPassword',
        path: '/user/reset-password',
        component: '@/modules/admin/pages/user/reset-password',
      },
    ],
  },

  // 根路由 - 包含所有需要布局的业务路由
  {
    path: '/',
    routes: [
      // 默认重定向到工作台
      {
        path: '/',
        redirect: '/workbench',
      },
      // 注入 admin 模块路由（后端 Modules/Base）
      ...adminRoutes,
      // 注入 app-market 模块路由（后端 Modules/AppMarket）
      ...appMarketRoutes,
      // 注入 sms 模块路由（后端 Modules/Sms）
      ...smsRoutes,
    ],
  },

  // 404 页面
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
