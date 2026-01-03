import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';
import { getNotification } from '@/utils/notification';
import { normalizePaginationParams } from '@/utils/pagination';
import {
  clearToken,
  getToken,
  isTokenExpired,
  refreshTokenIfNeeded,
} from '@/utils/token';

const loginPath = '/user/login';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  code: number; // 200为成功，其他为失败
  message?: string;
  data?: any;
  // 保留旧格式兼容性
  success?: boolean;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { code, message, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      // 统一标准：code !== 200 表示失败
      if (code && code !== 200) {
        const error: any = new Error(message || errorMessage || '请求失败');
        error.name = 'BizError';
        error.info = {
          errorCode: code,
          errorMessage: message || errorMessage,
          showType,
          data,
        };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              getNotification().open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    async (config: RequestOptions) => {
      // 检查token是否过期，如果过期则不添加token（让后端返回401，由响应拦截器处理）
      if (isTokenExpired()) {
        // token已过期，不添加token，让后端返回401
        return config;
      }

      // 检查并刷新token（如果快过期）
      await refreshTokenIfNeeded();

      // 拦截请求配置，添加认证token
      const token = getToken();
      if (token && config.headers) {
        // 添加Authorization头
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 统一处理分页参数：确保使用 page 参数
      if (
        config.data &&
        typeof config.data === 'object' &&
        !Array.isArray(config.data)
      ) {
        config.data = normalizePaginationParams(config.data);
      }

      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as any;

      // 统一标准：code !== 200 表示失败
      if (data?.code && data.code !== 200) {
        // 如果是401未授权或token过期，清除token并跳转登录页
        if (data.code === 401 || data.code === 1000) {
          // 检查是否是 getUserMenus 请求（通过 URL 判断，如果无法获取则通过其他方式判断）
          const requestUrl =
            (response as any).config?.url ||
            (response as any).request?.responseURL ||
            '';
          const isGetUserMenusRequest =
            requestUrl.includes('/api/getUserMenus') ||
            requestUrl.includes('getUserMenus');

          // 如果是 getUserMenus 请求，且 localStorage 中有用户信息和 token，可能是刚登录 token 还未完全生效
          // 这种情况下不立即跳转，让调用方处理（getInitialState 中会使用 skipErrorHandler）
          if (
            isGetUserMenusRequest &&
            localStorage.getItem('userInfo') &&
            localStorage.getItem('token')
          ) {
            console.warn('获取菜单时 token 可能还未生效，跳过自动跳转');
            return response;
          }

          clearToken();
          localStorage.removeItem('userInfo');
          if (window.location.pathname !== loginPath) {
            history.push(loginPath);
          }
          // 静默处理，不显示错误消息
          return response;
        }
        const errorMsg = data.message || '请求失败！';
        message.error(errorMsg);
      }
      return response;
    },
  ],
};
