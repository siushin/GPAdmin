/**
 * Sms 模块路由配置
 * 基于后端 Modules/Sms/data/menu.csv 生成
 */

import type { IRoute } from '@umijs/max';

const routes: IRoute[] = [
  // 短信发送
  {
    path: '/sms/send',
    name: 'sms.send',
    redirect: '/sms/send/single',
    access: 'canAdmin',
  },
  {
    path: '/sms/send/single',
    name: 'sms.send.single',
    component: '@/modules/sms/pages/Send/Single',
    access: 'canAdmin',
  },
  {
    path: '/sms/send/batch',
    name: 'sms.send.batch',
    component: '@/modules/sms/pages/Send/Batch',
    access: 'canAdmin',
  },
  {
    path: '/sms/send/timing',
    name: 'sms.send.timing',
    component: '@/modules/sms/pages/Send/Timing',
    access: 'canAdmin',
  },
  {
    path: '/sms/send/draft',
    name: 'sms.send.draft',
    component: '@/modules/sms/pages/Send/Draft',
    access: 'canAdmin',
  },

  // 通讯录管理
  {
    path: '/sms/contact',
    name: 'sms.contact',
    redirect: '/sms/contact/list',
    access: 'canAdmin',
  },
  {
    path: '/sms/contact/list',
    name: 'sms.contact.list',
    component: '@/modules/sms/pages/Contact/List',
    access: 'canAdmin',
  },
  {
    path: '/sms/contact/group',
    name: 'sms.contact.group',
    component: '@/modules/sms/pages/Contact/Group',
    access: 'canAdmin',
  },
  {
    path: '/sms/contact/blackwhite',
    name: 'sms.contact.blackwhite',
    component: '@/modules/sms/pages/Contact/Blackwhite',
    access: 'canAdmin',
  },

  // 模板管理
  {
    path: '/sms/template',
    name: 'sms.template',
    redirect: '/sms/template/list',
    access: 'canAdmin',
  },
  {
    path: '/sms/template/list',
    name: 'sms.template.list',
    component: '@/modules/sms/pages/Template/List',
    access: 'canAdmin',
  },
  {
    path: '/sms/template/add',
    name: 'sms.template.add',
    component: '@/modules/sms/pages/Template/Add',
    access: 'canAdmin',
  },

  // 签名管理
  {
    path: '/sms/sign',
    name: 'sms.sign',
    redirect: '/sms/sign/list',
    access: 'canAdmin',
  },
  {
    path: '/sms/sign/list',
    name: 'sms.sign.list',
    component: '@/modules/sms/pages/Sign/List',
    access: 'canAdmin',
  },
  {
    path: '/sms/sign/apply',
    name: 'sms.sign.apply',
    component: '@/modules/sms/pages/Sign/Apply',
    access: 'canAdmin',
  },
  {
    path: '/sms/sign/audit-list',
    name: 'sms.sign.auditList',
    component: '@/modules/sms/pages/Sign/AuditList',
    access: 'canAdmin',
  },

  // 记录与统计
  {
    path: '/sms/record',
    name: 'sms.record',
    redirect: '/sms/record/history',
    access: 'canAdmin',
  },
  {
    path: '/sms/record/history',
    name: 'sms.record.history',
    component: '@/modules/sms/pages/Record/History',
    access: 'canAdmin',
  },
  {
    path: '/sms/record/statistics',
    name: 'sms.record.statistics',
    component: '@/modules/sms/pages/Record/Statistics',
    access: 'canAdmin',
  },
  {
    path: '/sms/record/failed',
    name: 'sms.record.failed',
    component: '@/modules/sms/pages/Record/Failed',
    access: 'canAdmin',
  },

  // 短信渠道
  {
    path: '/sms/channel',
    name: 'sms.channel',
    redirect: '/sms/channel/list',
    access: 'canAdmin',
  },
  {
    path: '/sms/channel/list',
    name: 'sms.channel.list',
    component: '@/modules/sms/pages/Channel/List',
    access: 'canAdmin',
  },
  {
    path: '/sms/channel/add',
    name: 'sms.channel.add',
    component: '@/modules/sms/pages/Channel/Add',
    access: 'canAdmin',
  },
  {
    path: '/sms/channel/config',
    name: 'sms.channel.config',
    component: '@/modules/sms/pages/Channel/Config',
    access: 'canAdmin',
  },
];

export default routes;
