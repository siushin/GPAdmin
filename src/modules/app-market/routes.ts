/**
 * AppMarket 模块路由配置
 * 基于后端 Modules/AppMarket/data/menu.csv 生成
 */

import type { IRoute } from '@umijs/max';

const routes: IRoute[] = [
  // 应用管理（一级目录）
  {
    path: '/appmarket/app',
    name: 'appmarket.app',
    redirect: '/appmarket/app/list',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/app/list',
    name: 'appmarket.app.list',
    component: '@/modules/app-market/pages/App/List',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/app/audit',
    name: 'appmarket.app.audit',
    component: '@/modules/app-market/pages/App/Audit',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/app/category',
    name: 'appmarket.app.category',
    component: '@/modules/app-market/pages/App/Category',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/app/statistics',
    name: 'appmarket.app.statistics',
    component: '@/modules/app-market/pages/App/Statistics',
    access: 'canAdmin',
  },

  // 提交记录（一级目录）
  {
    path: '/appmarket/submission',
    name: 'appmarket.submission',
    redirect: '/appmarket/submission/list',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/submission/list',
    name: 'appmarket.submission.list',
    component: '@/modules/app-market/pages/Submission/List',
    access: 'canAdmin',
  },

  // 开发者管理（一级目录）
  {
    path: '/appmarket/developer',
    name: 'appmarket.developer',
    redirect: '/appmarket/developer/list',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/developer/list',
    name: 'appmarket.developer.list',
    component: '@/modules/app-market/pages/Developer/List',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/developer/audit',
    name: 'appmarket.developer.audit',
    component: '@/modules/app-market/pages/Developer/Audit',
    access: 'canAdmin',
  },

  // 系统设置（一级目录）
  {
    path: '/appmarket/setting',
    name: 'appmarket.setting',
    redirect: '/appmarket/setting/market',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/setting/market',
    name: 'appmarket.setting.market',
    component: '@/modules/app-market/pages/Setting/Market',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/setting/audit-rule',
    name: 'appmarket.setting.auditRule',
    component: '@/modules/app-market/pages/Setting/AuditRule',
    access: 'canAdmin',
  },
  {
    path: '/appmarket/setting/notification',
    name: 'appmarket.setting.notification',
    component: '@/modules/app-market/pages/Setting/Notification',
    access: 'canAdmin',
  },
];

export default routes;
