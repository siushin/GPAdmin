/**
 * AppMarket 模块 - 应用市场管理
 * 对应后端 Modules/AppMarket
 */

import type { ModuleMeta } from '../types';
import menuLocales from './locales/zh-CN/menu';
import routes from './routes';

const appMarketMeta: ModuleMeta = {
  name: 'app-market',
  description: '应用市场管理模块',
  routes,
  access: {
    canAppMarket: true,
  },
  locales: {
    'zh-CN': menuLocales,
  },
};

export default appMarketMeta;
