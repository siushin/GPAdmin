// 组织架构相关 Mock 数据

// 部门 Mock 数据
const generateDepts = () => {
  const depts = []
  const deptNames = ['技术部', '运营部', '市场部', '产品部', '设计部', '财务部', '人事部', '行政部']
  const deptCodes = ['TECH', 'OPS', 'MARKET', 'PRODUCT', 'DESIGN', 'FINANCE', 'HR', 'ADMIN']
  const leaders = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

  // 生成一级部门
  for (let i = 1; i <= 8; i++) {
    const children = []
    // 每个一级部门生成3-6个子部门
    const childCount = 3 + (i % 4)
    for (let j = 1; j <= childCount; j++) {
      const childIndex = (i + j) % deptNames.length
      const deptName = deptNames[childIndex]
      const deptCode = deptCodes[childIndex]
      const leader = leaders[(i + j) % leaders.length]
      if (deptName && deptCode && leader) {
        children.push({
          id: i * 100 + j,
          name: deptName + (j > 1 ? j : ''),
          code: deptCode + (j > 1 ? String(j) : ''),
          leader: leader,
          phone: `138${String(i * 100 + j).padStart(8, '0')}`,
          email: `${deptCode.toLowerCase()}${j}@example.com`,
          sort: j,
          status: j % 4 === 0 ? 0 : 1,
          parentId: i
        })
      }
    }

    const parentIndex = i % deptNames.length
    const parentDeptName = deptNames[parentIndex]
    const parentDeptCode = deptCodes[parentIndex]
    const parentLeader = leaders[i % leaders.length]
    if (parentDeptName && parentDeptCode && parentLeader) {
      depts.push({
        id: i,
        name: parentDeptName + (i > deptNames.length ? `(${Math.floor(i / deptNames.length) + 1})` : ''),
        code: parentDeptCode + (i > deptCodes.length ? String(Math.floor(i / deptCodes.length) + 1) : ''),
        leader: parentLeader,
        phone: `138${String(i).padStart(8, '0')}`,
        email: `${parentDeptCode.toLowerCase()}@example.com`,
        sort: i,
        status: i % 5 === 0 ? 0 : 1,
        parentId: 0,
        children: children
      })
    }
  }

  return depts
}

export const mockDepts = generateDepts()

// 职位 Mock 数据
const generatePositions = () => {
  const positions = []
  const positionNames = ['总经理', '副总经理', '部门经理', '副经理', '主管', '专员', '助理']
  const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']

  for (let i = 1; i <= 20; i++) {
    const index = i % positionNames.length
    const positionName = positionNames[index]
    const level = levels[index]
    if (positionName && level) {
      positions.push({
        id: i,
        name: positionName + (i > positionNames.length ? `(${Math.floor(i / positionNames.length) + 1})` : ''),
        code: `POS${String(i).padStart(3, '0')}`,
        level: level,
        description: `${positionName}职位描述`,
        sort: i,
        status: i % 6 === 0 ? 0 : 1,
        createTime: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      })
    }
  }

  return positions
}

export const mockPositions = generatePositions()

// 岗位 Mock 数据
const generatePosts = () => {
  const posts = []
  const postNames = ['前端开发', '后端开发', '产品经理', 'UI设计师', '测试工程师', '运维工程师', '数据分析师']
  const deptIds = [1, 2, 3, 4, 5, 6, 7, 8]

  for (let i = 1; i <= 30; i++) {
    const index = i % postNames.length
    const postName = postNames[index]
    const deptId = deptIds[i % deptIds.length]
    if (postName) {
      posts.push({
        id: i,
        name: postName + (i > postNames.length ? `(${Math.floor(i / postNames.length) + 1})` : ''),
        code: `POST${String(i).padStart(3, '0')}`,
        deptId: deptId,
        deptName: `部门${deptId}`,
        description: `${postName}岗位描述`,
        sort: i,
        status: i % 7 === 0 ? 0 : 1,
        createTime: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      })
    }
  }

  return posts
}

export const mockPosts = generatePosts()

// 组织架构相关 Mock API
export const organizationMock = {
  // 获取部门列表
  getDepts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: mockDepts,
            total: mockDepts.length
          }
        })
      }, 500)
    })
  },
  // 获取职位列表
  getPositions: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockPositions]
        const { current = 1, pageSize = 10 } = params || {}
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
  // 获取岗位列表
  getPosts: (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockPosts]
        const { current = 1, pageSize = 10 } = params || {}
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
