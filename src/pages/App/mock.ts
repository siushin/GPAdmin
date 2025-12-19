export interface AppItem {
  name: string;
  alias: string;
  description: string;
  keywords: string[];
  priority: number;
  source: string;
  enabled: boolean;
  path: string;
}

// Mock 数据
export const mockApps: AppItem[] = [
  {
    name: 'Base',
    alias: '基础服务',
    description:
      'LaravelAPI 基础服务，提供用户认证、权限管理、日志记录等核心功能',
    keywords: ['基础', '认证', '权限'],
    priority: 100,
    source: '官方',
    enabled: true,
    path: 'Base',
  },
  {
    name: 'Sms',
    alias: '短信服务',
    description: '提供短信发送、验证码管理等功能，支持多种短信服务商',
    keywords: ['短信', '验证码', '通知'],
    priority: 90,
    source: '官方',
    enabled: true,
    path: 'Sms',
  },
  {
    name: 'Payment',
    alias: '支付服务',
    description: '集成多种支付方式，包括支付宝、微信支付、银联等',
    keywords: ['支付', '支付宝', '微信'],
    priority: 85,
    source: '第三方',
    enabled: true,
    path: 'Payment',
  },
  {
    name: 'Oss',
    alias: '对象存储',
    description: '支持阿里云OSS、腾讯云COS、七牛云等对象存储服务',
    keywords: ['存储', 'OSS', '文件'],
    priority: 80,
    source: '第三方',
    enabled: true,
    path: 'Oss',
  },
  {
    name: 'Notification',
    alias: '消息通知',
    description: '统一的消息通知服务，支持邮件、短信、站内信等多种通知方式',
    keywords: ['通知', '消息', '邮件'],
    priority: 75,
    source: '官方',
    enabled: false,
    path: 'Notification',
  },
  {
    name: 'Analytics',
    alias: '数据分析',
    description: '提供数据统计、分析报表等功能，帮助了解业务运营情况',
    keywords: ['分析', '统计', '报表'],
    priority: 70,
    source: '第三方',
    enabled: true,
    path: 'Analytics',
  },
  {
    name: 'Search',
    alias: '搜索服务',
    description: '全文搜索服务，支持 Elasticsearch、Algolia 等搜索引擎',
    keywords: ['搜索', '全文', 'ES'],
    priority: 65,
    source: '第三方',
    enabled: false,
    path: 'Search',
  },
  {
    name: 'Cache',
    alias: '缓存服务',
    description: '高性能缓存服务，支持 Redis、Memcached 等缓存系统',
    keywords: ['缓存', 'Redis', '性能'],
    priority: 60,
    source: '官方',
    enabled: true,
    path: 'Cache',
  },
  {
    name: 'Queue',
    alias: '队列服务',
    description: '异步任务队列服务，支持 RabbitMQ、Kafka 等消息队列',
    keywords: ['队列', '异步', '任务'],
    priority: 55,
    source: '官方',
    enabled: true,
    path: 'Queue',
  },
  {
    name: 'Log',
    alias: '日志服务',
    description: '集中式日志管理服务，支持日志收集、查询、分析等功能',
    keywords: ['日志', '收集', '分析'],
    priority: 50,
    source: '第三方',
    enabled: false,
    path: 'Log',
  },
  {
    name: 'Monitor',
    alias: '监控服务',
    description: '系统监控服务，提供性能监控、告警通知等功能',
    keywords: ['监控', '性能', '告警'],
    priority: 45,
    source: '第三方',
    enabled: true,
    path: 'Monitor',
  },
  {
    name: 'ApiGateway',
    alias: 'API网关',
    description: 'API 网关服务，提供路由、限流、鉴权等功能',
    keywords: ['网关', 'API', '路由'],
    priority: 40,
    source: '官方',
    enabled: false,
    path: 'ApiGateway',
  },
];
