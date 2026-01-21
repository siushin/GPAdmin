import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { refreshToken } from '@/modules/admin/services/user';
import {
  clearToken,
  getMessage,
  getNotification,
  getToken,
  isTokenExpired,
  isTokenExpiringSoon,
  saveToken,
} from '@/modules/base';

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
 * 刷新token（仅在token快过期时刷新）
 */
async function refreshTokenIfNeeded(): Promise<boolean> {
  const token = getToken();
  if (!token) {
    return false;
  }

  // 如果token已过期，不在这里处理，让响应拦截器处理401错误
  if (isTokenExpired()) {
    return false;
  }

  // 如果token快过期，尝试刷新
  if (isTokenExpiringSoon()) {
    try {
      const response = await refreshToken({ skipErrorHandler: true });
      if (response?.code === 200 && response?.data?.token) {
        const tokenData = response.data.token;
        if (tokenData.access_token) {
          saveToken(tokenData.access_token, tokenData.expires_in);
          console.log('✓ Token已刷新');
          return true;
        }
      }
    } catch (error) {
      console.error('刷新token失败:', error);
      return false;
    }
  }

  return true;
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
              getMessage().warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              getMessage().error(errorMessage);
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
              getMessage().error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        getMessage().error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        getMessage().error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        getMessage().error('Request error, please retry.');
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
          // 检查是否是 getUserMenus 请求
          const requestUrl =
            (response as any).config?.url ||
            (response as any).request?.responseURL ||
            '';
          const isGetUserMenusRequest =
            requestUrl.includes('/api/getUserMenus') ||
            requestUrl.includes('getUserMenus');

          // 如果是 getUserMenus 请求，且 localStorage 中有用户信息和 token，可能是刚登录 token 还未完全生效
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

        // 检查是否是登录接口
        const requestUrl =
          (response as any).config?.url ||
          (response as any).request?.responseURL ||
          '';
        const isLoginRequest =
          requestUrl.includes('/api/login/account') ||
          requestUrl.includes('/api/login/code');

        // 如果不是登录接口，显示错误消息
        if (!isLoginRequest) {
          const errorMsg = data.message || '请求失败！';
          getMessage().error(errorMsg);
        }
      }
      return response;
    },
  ],
};
