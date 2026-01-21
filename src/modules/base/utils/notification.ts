import type { App } from 'antd';

// 全局 notification 实例引用
let notificationInstance: ReturnType<typeof App.useApp>['notification'] | null =
  null;

// 全局 message 实例引用
let messageInstance: ReturnType<typeof App.useApp>['message'] | null = null;

/**
 * 设置全局 notification 实例
 * 在 App 组件初始化时调用
 */
export const setNotificationInstance = (
  instance: ReturnType<typeof App.useApp>['notification'],
) => {
  notificationInstance = instance;
};

/**
 * 设置全局 message 实例
 * 在 App 组件初始化时调用
 */
export const setMessageInstance = (
  instance: ReturnType<typeof App.useApp>['message'],
) => {
  messageInstance = instance;
};

/**
 * 获取全局 notification 实例
 * 如果实例不存在，返回 antd 的静态方法（作为降级方案）
 */
export const getNotification = () => {
  if (notificationInstance) {
    return notificationInstance;
  }
  // 降级方案：如果实例不存在，使用静态方法（会有警告，但功能正常）
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { notification } = require('antd');
  return notification;
};

/**
 * 获取全局 message 实例
 * 如果实例不存在，返回 antd 的静态方法（作为降级方案）
 */
export const getMessage = () => {
  if (messageInstance) {
    return messageInstance;
  }
  // 降级方案：如果实例不存在，使用静态方法（会有警告，但功能正常）
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { message } = require('antd');
  return message;
};
