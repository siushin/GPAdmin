// 用户管理相关 Mock 数据

// 用户管理 Mock 数据
const generateUsers = () => {
  const users = []
  const roles = ['超级管理员', '普通用户', '访客', '编辑', '审核员']
  const depts = ['技术部', '运营部', '市场部', '产品部', '设计部', '财务部', '人事部']
  const statuses = [1, 0]

  for (let i = 1; i <= 35; i++) {
    users.push({
      id: i,
      username: `user${i}`,
      nickname: `用户${i}`,
      email: `user${i}@example.com`,
      phone: `138${String(i).padStart(8, '0')}`,
      status: statuses[i % 2],
      role: roles[i % roles.length],
      dept: depts[i % depts.length],
      createTime: `2024-01-${String(Math.floor(i / 3) + 1).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String((i * 3) % 60).padStart(2, '0')}:00`
    })
  }
  return users
}

export const mockUsers = generateUsers()

// 用户管理相关 Mock API
export const userMock = {
  // 获取用户列表
  getUsers: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { current = 1, pageSize = 10 } = params || {}
        const start = (current - 1) * pageSize
        const end = start + pageSize
        const list = mockUsers.slice(start, end)
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: list,
            total: mockUsers.length
          }
        })
      }, 500)
    })
  }
}
