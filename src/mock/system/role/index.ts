// 角色管理相关 Mock 数据

// 角色管理 Mock 数据
const generateRoles = () => {
  const roles = []
  const roleNames = ['超级管理员', '普通用户', '访客', '编辑', '审核员', '运营', '市场', '财务', '人事', '产品']
  const roleCodes = ['admin', 'user', 'guest', 'editor', 'auditor', 'ops', 'market', 'finance', 'hr', 'product']
  const descriptions = [
    '拥有所有权限',
    '普通用户权限',
    '只读权限',
    '编辑权限',
    '审核权限',
    '运营权限',
    '市场权限',
    '财务权限',
    '人事权限',
    '产品权限'
  ]
  const permissionsList = [
    ['*'],
    ['read', 'write'],
    ['read'],
    ['read', 'write', 'edit'],
    ['read', 'audit'],
    ['read', 'write', 'ops'],
    ['read', 'write', 'market'],
    ['read', 'write', 'finance'],
    ['read', 'write', 'hr'],
    ['read', 'write', 'product']
  ]

  for (let i = 0; i < 35; i++) {
    const index = i % roleNames.length
    roles.push({
      id: i + 1,
      name: roleNames[index] + (i >= roleNames.length ? `(${Math.floor(i / roleNames.length) + 1})` : ''),
      code: roleCodes[index] + (i >= roleCodes.length ? String(Math.floor(i / roleCodes.length) + 1) : ''),
      description: descriptions[index],
      status: i % 3 === 0 ? 0 : 1,
      createTime: `2024-01-${String(Math.floor(i / 3) + 1).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String((i * 3) % 60).padStart(2, '0')}:00`,
      permissions: permissionsList[index]
    })
  }
  return roles
}

export const mockRoles = generateRoles()

// 角色管理相关 Mock API
export const roleMock = {
  // 获取角色列表
  getRoles: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { current = 1, pageSize = 10 } = params || {}
        const start = (current - 1) * pageSize
        const end = start + pageSize
        const list = mockRoles.slice(start, end)
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: list,
            total: mockRoles.length
          }
        })
      }, 500)
    })
  }
}
