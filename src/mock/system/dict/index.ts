// 数据字典相关 Mock 数据

// 字典 Mock 数据
const generateDicts = () => {
  const dicts = []
  const dictTypes = ['user_status', 'user_type', 'menu_type', 'log_type', 'dept_status', 'role_status']
  const dictNames = ['用户状态', '用户类型', '菜单类型', '日志类型', '部门状态', '角色状态']
  const descriptions = [
    '用户状态字典',
    '用户类型字典',
    '菜单类型字典',
    '日志类型字典',
    '部门状态字典',
    '角色状态字典'
  ]

  for (let i = 0; i < dictTypes.length; i++) {
    const dictType = dictTypes[i]
    const dictName = dictNames[i]
    const description = descriptions[i]
    if (dictType && dictName && description) {
      dicts.push({
        id: i + 1,
        type: dictType,
        name: dictName,
        description: description,
        sort: i + 1,
        status: 1,
        createTime: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      })
    }
  }

  return dicts
}

export const mockDicts = generateDicts()

// 字典项数据映射
const dictItemsMap: Record<string, any[]> = {
  user_status: [
    { label: '启用', value: '1', sort: 1 },
    { label: '禁用', value: '0', sort: 2 }
  ],
  user_type: [
    { label: '管理员', value: 'admin', sort: 1 },
    { label: '普通用户', value: 'user', sort: 2 },
    { label: '访客', value: 'guest', sort: 3 }
  ],
  menu_type: [
    { label: '目录', value: 'M', sort: 1 },
    { label: '菜单', value: 'C', sort: 2 },
    { label: '按钮', value: 'F', sort: 3 }
  ],
  log_type: [
    { label: '操作日志', value: 'operation', sort: 1 },
    { label: '登录日志', value: 'login', sort: 2 },
    { label: '审计日志', value: 'audit', sort: 3 }
  ],
  dept_status: [
    { label: '启用', value: '1', sort: 1 },
    { label: '禁用', value: '0', sort: 2 }
  ],
  role_status: [
    { label: '启用', value: '1', sort: 1 },
    { label: '禁用', value: '0', sort: 2 }
  ]
}

// 数据字典相关 Mock API
export const dictMock = {
  // 获取字典列表
  getDicts: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockDicts]
        const { current = 1, pageSize = 10, type, name } = params || {}

        // 过滤
        if (type) {
          list = list.filter(item => item.type.includes(type))
        }
        if (name) {
          list = list.filter(item => item.name.includes(name))
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
  // 获取字典项列表
  getDictItems: (type: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = dictItemsMap[type] || []
        resolve({
          code: 200,
          message: '获取成功',
          data: items
        })
      }, 300)
    })
  },
  // 获取字典详情
  getDictDetail: (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dict = mockDicts.find(item => item.id === id)
        resolve({
          code: 200,
          message: '获取成功',
          data: dict || null
        })
      }, 300)
    })
  }
}
