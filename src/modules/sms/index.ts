/**
 * Sms 模块 - 短信服务
 * 对应后端 Modules/Sms
 */

import type { ModuleMeta } from '../types';
import menuLocales from './locales/zh-CN/menu';
import routes from './routes';

const smsMeta: ModuleMeta = {
  name: 'sms',
  description: '短信服务模块',
  routes,
  access: {
    canSms: true,
  },
  locales: {
    'zh-CN': menuLocales,
  },
};

export default smsMeta;
