// @ts-ignore
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
