import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { AvatarDropdown, AvatarName, Footer, SelectLang } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * 欢迎通知组件
 */
const WelcomeNotification: React.FC<{
  currentUser?: API.CurrentUser;
  isDev: boolean;
  initialState: any;
  setInitialState: any;
  children: React.ReactNode;
}> = ({ currentUser, isDev, initialState, setInitialState, children }) => {
  useEffect(() => {
    // 检查是否刚刚登录
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true' && currentUser) {
      // 显示欢迎通知
      notification.success({
        message: '欢迎回来',
        description: `欢迎，${currentUser.name || '用户'}！`,
        placement: 'topRight',
        duration: 3,
      });
      // 清除标记
      sessionStorage.removeItem('justLoggedIn');
    }
  }, [currentUser]);

  return (
    <>
      {children}
      {isDev && (
        <SettingDrawer
          disableUrlParams
          enableDarkTheme
          settings={initialState?.settings}
          onSettingChange={(settings) => {
            setInitialState((preInitialState: any) => ({
              ...preInitialState,
              settings,
            }));
          }}
        />
      )}
    </>
  );
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，检查是否有 token
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    // 检查是否有 token，如果没有直接跳转登录页
    const token = localStorage.getItem('token');
    if (!token) {
      history.push(loginPath);
      return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }

    // 有 token 时，从 localStorage 读取用户信息，不请求接口
    const userInfoStr = localStorage.getItem('userInfo');
    let currentUser: API.CurrentUser | undefined;

    if (userInfoStr) {
      try {
        currentUser = JSON.parse(userInfoStr);
      } catch (e) {
        console.error('解析用户信息失败:', e);
        // 如果解析失败，清除 token 并跳转登录页
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        history.push(loginPath);
      }
    } else {
      // 如果没有用户信息，清除 token 并跳转登录页
      localStorage.removeItem('token');
      history.push(loginPath);
    }

    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [<SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <WelcomeNotification
          currentUser={initialState?.currentUser}
          isDev={isDev}
          initialState={initialState}
          setInitialState={setInitialState}
        >
          {children}
        </WelcomeNotification>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // 设置 baseURL，直接请求真实的后端 API
  baseURL: process.env.UMI_APP_API_BASE_URL || 'http://laravel-api.cc',
  ...errorConfig,
};
