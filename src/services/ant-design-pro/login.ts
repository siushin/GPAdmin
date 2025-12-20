// @ts-expect-error
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送验证码 POST /api/sms/send */
export async function sendCaptcha(
  params: {
    /** 手机号 */
    phone?: string;
    /** 短信类型 */
    type?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.SendCaptchaResponse>('/api/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      phone: params.phone,
      type: params.type || 'login', // 默认使用 login 类型
    },
    ...(options || {}),
  });
}

/** 手机号验证码登录 POST /api/login/code */
export async function loginByCode(
  body: {
    phone?: string;
    code?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.LoginResult>('/api/login/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
