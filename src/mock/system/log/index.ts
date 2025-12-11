// 系统日志相关 Mock 数据

// 操作日志 Mock 数据
const generateOperationLogs = () => {
  const logs = []
  const operations = ['新增', '修改', '删除', '查询', '导出', '导入', '登录', '登出']
  const modules = ['用户管理', '角色管理', '菜单管理', '部门管理', '字典管理', '日志管理']
  const users = ['admin', 'user1', 'user2', 'user3', 'user4']

  for (let i = 1; i <= 100; i++) {
    const operation = operations[i % operations.length]
    const module = modules[i % modules.length]
    const user = users[i % users.length]
    if (operation && module && user) {
      logs.push({
        id: i,
        operation: operation,
        module: module,
        method: i % 2 === 0 ? 'GET' : 'POST',
        url: `/api/${module.toLowerCase()}/${operation.toLowerCase()}`,
        params: JSON.stringify({ id: i }),
        result: i % 10 === 0 ? '失败' : '成功',
        ip: `192.168.1.${i % 255}`,
        user: user,
        createTime: new Date(Date.now() - (100 - i) * 3600000).toISOString().replace('T', ' ').substring(0, 19)
      })
    }
  }

  return logs
}

export const mockOperationLogs = generateOperationLogs()

// 登录日志 Mock 数据
const generateLoginLogs = () => {
  const logs = []
  const users = ['admin', 'user1', 'user2', 'user3', 'user4']
  const statuses = ['成功', '失败']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
  const os = ['Windows', 'macOS', 'Linux', 'iOS', 'Android']

  for (let i = 1; i <= 80; i++) {
    const user = users[i % users.length]
    const status = statuses[i % statuses.length]
    const browser = browsers[i % browsers.length]
    const osName = os[i % os.length]
    if (user && status && browser && osName) {
      logs.push({
        id: i,
        user: user,
        status: status,
        ip: `192.168.1.${i % 255}`,
        browser: browser,
        os: osName,
        location: `北京市朝阳区`,
        message: status === '成功' ? '登录成功' : '密码错误',
        createTime: new Date(Date.now() - (80 - i) * 3600000).toISOString().replace('T', ' ').substring(0, 19)
      })
    }
  }

  return logs
}

export const mockLoginLogs = generateLoginLogs()

// 审计日志 Mock 数据
const generateAuditLogs = () => {
  const logs = []
  const actions = ['数据修改', '权限变更', '配置修改', '数据删除', '敏感操作']
  const users = ['admin', 'user1', 'user2', 'user3']
  const targets = ['用户数据', '角色权限', '系统配置', '菜单结构', '部门信息']

  for (let i = 1; i <= 60; i++) {
    const action = actions[i % actions.length]
    const user = users[i % users.length]
    const target = targets[i % targets.length]
    if (action && user && target) {
      logs.push({
        id: i,
        action: action,
        user: user,
        target: target,
        before: JSON.stringify({ id: i, name: '修改前' }),
        after: JSON.stringify({ id: i, name: '修改后' }),
        ip: `192.168.1.${i % 255}`,
        createTime: new Date(Date.now() - (60 - i) * 3600000).toISOString().replace('T', ' ').substring(0, 19)
      })
    }
  }

  return logs
}

export const mockAuditLogs = generateAuditLogs()

// 系统日志相关 Mock API
export const logMock = {
  // 获取操作日志列表
  getOperationLogs: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockOperationLogs]
        const { current = 1, pageSize = 10, operation, module, user } = params || {}

        // 过滤
        if (operation) {
          list = list.filter(item => item.operation.includes(operation))
        }
        if (module) {
          list = list.filter(item => item.module.includes(module))
        }
        if (user) {
          list = list.filter(item => item.user.includes(user))
        }

        const start = (current - 1) * pageSize
        const end = start + pageSize
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: list.slice(start, end),
            total: list.length
          }
        })
      }, 500)
    })
  },
  // 获取登录日志列表
  getLoginLogs: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockLoginLogs]
        const { current = 1, pageSize = 10, user, status } = params || {}

        // 过滤
        if (user) {
          list = list.filter(item => item.user.includes(user))
        }
        if (status !== undefined) {
          list = list.filter(item => item.status === status)
        }

        const start = (current - 1) * pageSize
        const end = start + pageSize
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: list.slice(start, end),
            total: list.length
          }
        })
      }, 500)
    })
  },
  // 获取审计日志列表
  getAuditLogs: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockAuditLogs]
        const { current = 1, pageSize = 10, action, user } = params || {}

        // 过滤
        if (action) {
          list = list.filter(item => item.action.includes(action))
        }
        if (user) {
          list = list.filter(item => item.user.includes(user))
        }

        const start = (current - 1) * pageSize
        const end = start + pageSize
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: list.slice(start, end),
            total: list.length
          }
        })
      }, 500)
    })
  }
}
