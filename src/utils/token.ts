import { history } from '@umijs/max';
import { refreshToken } from '@/services/api/user';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRE_TIME_KEY = 'tokenExpireTime';
const loginPath = '/user/login';

/**
 * 保存token和过期时间
 * @param token token字符串
 * @param expiresIn 过期时间（秒）
 */
export function saveToken(token: string, expiresIn: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  // 计算过期时间戳（当前时间 + 过期秒数 - 缓冲时间300秒，提前刷新）
  const expireTime = Date.now() + (expiresIn - 300) * 1000;
  localStorage.setItem(TOKEN_EXPIRE_TIME_KEY, expireTime.toString());
}

/**
 * 获取token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 检查token是否过期
 */
export function isTokenExpired(): boolean {
  const expireTime = localStorage.getItem(TOKEN_EXPIRE_TIME_KEY);
  if (!expireTime) {
    return true;
  }
  return Date.now() > parseInt(expireTime, 10);
}

/**
 * 检查token是否快过期（剩余时间小于300秒）
 */
export function isTokenExpiringSoon(): boolean {
  const expireTime = localStorage.getItem(TOKEN_EXPIRE_TIME_KEY);
  if (!expireTime) {
    return true;
  }
  const remainingTime = parseInt(expireTime, 10) - Date.now();
  // 剩余时间小于300秒（5分钟）认为快过期
  return remainingTime < 300 * 1000;
}

/**
 * 清除token
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRE_TIME_KEY);
}

/**
 * 刷新token（仅在token快过期时刷新）
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
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
      // 刷新失败不在这里处理，让响应拦截器处理错误
      return false;
    }
  }

  return true;
}
