// 登录认证相关 Mock 数据

// 登录 Mock 数据
const mockLogin = (data: { username: string; password: string } | { phone: string; captcha: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟登录成功
      const isPhoneLogin = 'phone' in data
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock_token_' + Date.now(),
          userInfo: {
            id: 1,
            username: isPhoneLogin ? data.phone : data.username,
            nickname: '野原新之助',
            avatar: '',
            roles: ['admin'],
            permissions: ['*']
          }
        }
      })
    }, 800)
  })
}

// 获取用户信息 Mock
const mockGetUserInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          username: 'admin',
          nickname: '野原新之助',
          avatar: '',
          roles: ['admin'],
          permissions: ['*']
        }
      })
    }, 300)
  })
}

// 登录认证相关 Mock API
export const authMock = {
  // 账号密码登录
  login: mockLogin,

  // 手机号登录
  loginByPhone: mockLogin,

  // 获取用户信息
  getUserInfo: mockGetUserInfo
}
