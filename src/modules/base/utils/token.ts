import { history } from '@umijs/max';

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

// 注意: refreshTokenIfNeeded 函数依赖于 services/api/user，
// 为避免循环依赖，该函数移至 admin 模块的 services 中
