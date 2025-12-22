import {
  ApartmentOutlined,
  AppstoreOutlined,
  BellOutlined,
  BlockOutlined,
  BookOutlined,
  FileTextOutlined,
  GithubOutlined,
  IdcardOutlined,
  LinkOutlined,
  MessageOutlined,
  NotificationOutlined,
  ProfileOutlined,
  SettingOutlined,
  ShareAltOutlined,
  ShopOutlined,
  SoundOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { ProConfigProvider, SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { App } from 'antd';
import React, { useEffect } from 'react';
import {
  AvatarDropdown,
  AvatarName,
  Footer,
  SelectLang,
  SettingButton,
} from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { setNotificationInstance } from '@/utils/notification';
import { clearToken, isTokenExpired } from '@/utils/token';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

// 图标映射表，支持通过字符串名称获取图标组件
const iconMap: Record<string, React.ComponentType<any>> = {
  AppstoreOutlined,
  BellOutlined,
  SettingOutlined,
  NotificationOutlined,
  MessageOutlined,
  SoundOutlined,
  UserOutlined,
  ProfileOutlined,
  BlockOutlined,
  ApartmentOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  IdcardOutlined,
  ShareAltOutlined,
  ShopOutlined,
};

/**
 * 根据字符串名称获取图标组件
 * @param iconName 图标名称，如 'AppstoreOutlined'
 * @returns 图标组件类型，如果不存在则返回 null
 */
const getIconComponent = (
  iconName: string,
): React.ComponentType<any> | null => {
  // 从映射表中获取图标组件
  const IconComponent = iconMap[iconName];

  // React forward_ref 组件是对象类型，不是函数类型，所以需要检查是否是有效的 React 组件
  if (IconComponent) {
    // 检查是否是 React 组件（forward_ref 组件是对象类型）
    const isReactComponent =
      typeof IconComponent === 'function' ||
      (typeof IconComponent === 'object' &&
        IconComponent !== null &&
        '$$typeof' in IconComponent);

    if (isReactComponent) {
      return IconComponent as React.ComponentType<any>;
    }
  }

  return null;
};

// 转换菜单数据，将图标字符串转换为图标组件，并处理国际化
const patchMenuIcon = (menuData: any[], parentName?: string): any[] => {
  return menuData.map((item) => {
    const newItem = { ...item };

    // 转换图标：如果 icon 是字符串，获取对应的图标组件（先处理当前项）
    if (typeof newItem.icon === 'string' && newItem.icon.trim() !== '') {
      const IconComponent = getIconComponent(newItem.icon);
      if (IconComponent) {
        // 使用 JSX 语法创建图标元素（ProLayout 推荐方式）
        newItem.icon = React.createElement(IconComponent);
      } else {
        // 如果图标不存在，移除 icon 字段，避免显示错误
        delete newItem.icon;
      }
    }

    // 确保使用 name 字段作为 locale key 来查找翻译
    // ProLayout 会使用 locale 字段（如果存在）来查找翻译
    // 如果 name 存在，将 name 转换为 locale 格式（menu.前缀）
    // 注意：ProLayout 在处理嵌套路由时可能会自动拼接父路由的 name 和子路由的 name
    // 为了避免重复拼接，我们需要确保 locale 是完整的，并且明确设置
    const originalName = newItem.name; // 保存原始 name，用于传递给子菜单
    if (newItem.name) {
      // 根据后端返回的数据，name 已经是完整的 menu_key（如 organization.organization）
      // 直接使用，不需要拼接父路由的 name
      newItem.locale = `menu.${newItem.name}`;
      // 移除 title 字段，让 ProLayout 使用 locale 来查找翻译
      delete newItem.title;

      // 如果 ProLayout 会自动拼接父路由的 name，我们需要调整子路由的 name
      // 如果子路由的 name 以父路由的 name 开头，移除父路由的 name 前缀
      // 这样 ProLayout 拼接后就能得到正确的完整路径
      if (parentName && newItem.name.startsWith(parentName + '.')) {
        // 子路由的 name 已经包含父路由的 name，为了避免 ProLayout 重复拼接
        // 我们只保留相对于父路由的部分
        const relativeName = newItem.name.substring(parentName.length + 1);
        newItem.name = relativeName;
        // 但 locale 仍然使用完整的 menu_key，这样即使 ProLayout 拼接 name，locale 也能正确使用
      }
      // 注意：如果子路由的 name 不包含父路由的 name 前缀（如父路由 name = "organization.management"，子路由 name = "organization.organization"）
      // ProLayout 可能会拼接成 "organization.management.organization"
      // 但实际的 menu_key 是 "organization.organization"
      // 在这种情况下，我们已经设置了 locale 为 "menu.organization.organization"
      // 如果 ProLayout 仍然使用拼接后的 name，我们已经在语言包中添加了这些键作为后备
    }

    // 处理子菜单，确保子菜单的图标也被转换（后处理子菜单）
    // 传递当前项的原始完整 name（在修改前）给子菜单，以便处理嵌套情况
    if (newItem.routes && Array.isArray(newItem.routes)) {
      newItem.routes = patchMenuIcon(newItem.routes, originalName);
    }

    return newItem;
  });
};

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * 欢迎通知组件
 */
const WelcomeNotification: React.FC<{
  currentUser?: API.CurrentUser;
  children: React.ReactNode;
}> = ({ currentUser, children }) => {
  const { notification } = App.useApp();

  useEffect(() => {
    // 设置全局 notification 实例
    setNotificationInstance(notification);
  }, [notification]);

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
  }, [currentUser, notification]);

  return <>{children}</>;
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  menuData?: any[];
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

    // 检查 token 是否过期
    if (isTokenExpired()) {
      clearToken();
      localStorage.removeItem('userInfo');
      history.push(loginPath);
      return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }

    // 有 token 且未过期时，从 localStorage 读取用户信息和菜单数据，不请求接口
    const userInfoStr = localStorage.getItem('userInfo');
    const menuDataStr = localStorage.getItem('menuData');
    let currentUser: API.CurrentUser | undefined;
    let menuData: any[] | undefined;

    if (userInfoStr) {
      try {
        currentUser = JSON.parse(userInfoStr);
        // 解析菜单数据
        if (menuDataStr) {
          try {
            menuData = JSON.parse(menuDataStr);
          } catch (e) {
            console.error('解析菜单数据失败:', e);
          }
        }
      } catch (e) {
        console.error('解析用户信息失败:', e);
        // 如果解析失败，清除 token 并跳转登录页
        clearToken();
        localStorage.removeItem('userInfo');
        localStorage.removeItem('menuData');
        history.push(loginPath);
      }
    } else {
      // 如果没有用户信息，清除 token 并跳转登录页
      clearToken();
      localStorage.removeItem('menuData');
      history.push(loginPath);
    }

    return {
      fetchUserInfo,
      currentUser,
      menuData,
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
  const handleSettingClick = () => {
    // 直接触发 SettingDrawer 的打开
    // 由于 handle 被 CSS 隐藏，我们需要临时显示它并触发点击
    const handle = document.querySelector(
      '.ant-pro-setting-drawer-handle',
    ) as HTMLElement;
    if (handle) {
      // 临时显示并触发点击
      const originalDisplay = handle.style.display;
      handle.style.display = 'block';
      handle.click();
      // 立即隐藏
      setTimeout(() => {
        handle.style.display = originalDisplay || 'none';
      }, 0);
    }
  };

  return {
    actionsRender: () => [
      <a
        key="github"
        href="https://github.com/siushin/gpadmin"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          color: 'inherit',
        }}
      >
        <GithubOutlined style={{ fontSize: 18 }} />
      </a>,
      <SelectLang key="SelectLang" />,
      <SettingButton key="SettingButton" onClick={handleSettingClick} />,
    ],
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
    menuDataRender: () => {
      const menuData = initialState?.menuData || [];
      // 转换图标字符串为图标组件
      return patchMenuIcon(menuData);
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
          <Link key="doc" to="//doc.gpadmin.siushin.com/" target="_blank">
            <LinkOutlined />
            <span>GPAdmin开发手册</span>
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
        <ProConfigProvider valueTypeMap={{}}>
          <App>
            <WelcomeNotification currentUser={initialState?.currentUser}>
              {children}
            </WelcomeNotification>
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
          </App>
        </ProConfigProvider>
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
