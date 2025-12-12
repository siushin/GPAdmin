# GPAdmin管理后台

一个基于 Vue 3 + TypeScript + Vite 构建的现代化管理后台系统，采用 Ant Design Vue 组件库，提供完整的用户管理、角色管理、菜单管理、部门管理等功能。

## 📋 目录

- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [安装说明](#安装说明)
- [开发指南](#开发指南)
- [Mock 使用说明](#mock-使用说明)
- [环境变量配置](#环境变量配置)
- [构建部署](#构建部署)

## 🏗️ 系统架构

### 架构概览

```
┌─────────────────────────────────────────────────┐
│                  用户界面层                      │
│  (Vue 3 Components + Ant Design Vue)           │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              页面视图层 (Views)                  │
│  - 登录/注册页  - 工作台  - 系统管理页面        │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              布局组件层 (Layouts)                │
│  - BasicLayout  - Header  - Sidebar  - Tabs    │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              状态管理层 (Pinia Store)            │
│  - UserStore  - 其他业务 Store                  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              路由层 (Vue Router)                 │
│  - 路由守卫  - 权限验证  - 页面跳转             │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              接口服务层 (API Service)            │
│  - Request 拦截器  - Mock 数据  - 错误处理      │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              工具层 (Utils)                      │
│  - HTTP 请求封装  - 日期处理  - 工具函数        │
└─────────────────────────────────────────────────┘
```

### 核心设计理念

- **组件化开发**：基于 Vue 3 Composition API，使用 `<script setup>` 语法
- **类型安全**：全面使用 TypeScript，提供完整的类型定义
- **状态管理**：使用 Pinia 进行全局状态管理
- **路由守卫**：实现登录验证和权限控制
- **Mock 支持**：内置 Mock 数据支持，可无缝切换真实接口
- **错误处理**：统一的错误处理和提示机制

## 💻 技术栈

### 核心框架

- **Vue 3.5.24** - 渐进式 JavaScript 框架
- **TypeScript 5.9.3** - JavaScript 的超集，提供类型系统
- **Vite 7.2.4** - 下一代前端构建工具

### UI 组件库

- **Ant Design Vue 4.2.6** - 企业级 UI 设计语言和组件库
- **@ant-design/icons-vue 7.0.1** - Ant Design Vue 图标库

### 路由与状态管理

- **Vue Router 4.6.3** - Vue.js 官方路由管理器
- **Pinia 3.0.4** - Vue 的官方状态管理库

### 工具库

- **Axios 1.13.2** - 基于 Promise 的 HTTP 客户端
- **Day.js 1.11.19** - 轻量级日期处理库
- **Lodash-es 4.17.21** - JavaScript 工具库
- **NProgress 0.2.0** - 页面加载进度条

### 特效与动画

- **@tsparticles/vue3 3.0.1** - 粒子动画效果库
- **@tsparticles/slim 3.9.1** - 粒子系统精简版

### 开发工具

- **Vue TSC 3.1.4** - Vue 3 TypeScript 类型检查工具
- **@vueuse/core 14.1.0** - Vue Composition API 工具集

## ✨ 功能特性

### 用户认证

- ✅ 账号密码登录
- ✅ 手机号验证码登录
- ✅ 用户注册
- ✅ 自动登录（记住用户名）
- ✅ Token 管理
- ✅ 路由守卫与权限验证

### 系统管理

- ✅ 用户管理（列表、增删改查）
- ✅ 角色管理（角色权限配置）
- ✅ 菜单管理（动态菜单生成）
- ✅ 部门管理（树形结构管理）

### UI/UX 特性

- ✅ 响应式布局设计
- ✅ 侧边栏折叠/展开
- ✅ 标签页导航
- ✅ 面包屑导航
- ✅ 粒子背景动画效果
- ✅ 全屏功能
- ✅ 消息通知中心

### 开发体验

- ✅ TypeScript 完整支持
- ✅ Mock 数据自动拦截
- ✅ 统一错误处理
- ✅ 环境变量配置
- ✅ 代码热更新

## 📁 项目结构

```
GPAdmin/
├── public/                 # 静态资源目录
├── src/
│   ├── api/               # API 接口定义
│   │   └── index.ts       # 接口集合
│   ├── assets/            # 静态资源（图片、样式等）
│   │   └── logo.svg       # Logo
│   ├── layouts/           # 布局组件
│   │   ├── BasicLayout.vue          # 基础布局
│   │   └── components/              # 布局子组件
│   │       ├── Header.vue           # 顶部导航
│   │       ├── Sidebar.vue          # 侧边栏
│   │       ├── Tabs.vue             # 标签页
│   │       ├── Breadcrumb.vue       # 面包屑
│   │       ├── AppFooter.vue        # 页脚
│   │       └── Copyright.vue        # 版权信息
│   ├── mock/              # Mock 数据
│   │   └── index.ts       # Mock 数据配置
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义和守卫
│   ├── stores/            # Pinia 状态管理
│   │   ├── index.ts       # Store 入口
│   │   └── user.ts        # 用户状态管理
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts       # 全局类型
│   ├── utils/             # 工具函数
│   │   ├── request.ts     # Axios 封装
│   │   ├── dayjs.ts       # 日期工具
│   │   └── index.ts       # 其他工具
│   ├── views/             # 页面组件
│   │   ├── Dashboard/     # 工作台
│   │   ├── System/        # 系统管理页面
│   │   │   ├── User.vue   # 用户管理
│   │   │   ├── Role.vue   # 角色管理
│   │   │   ├── Menu.vue   # 菜单管理
│   │   │   └── Dept.vue   # 部门管理
│   │   └── User/          # 用户相关页面
│   │       ├── Login.vue  # 登录页
│   │       └── Register.vue # 注册页
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口
│   └── env.d.ts           # 环境变量类型定义
├── .env                   # 生产环境变量
├── .env.development       # 开发环境变量
├── index.html             # HTML 模板
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目文档
```

## 🚀 安装说明

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0 (或 yarn >= 1.22.0, pnpm >= 6.0.0)

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd GPAdmin
```

2. **安装依赖**

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

3. **配置环境变量**

复制 `.env.development` 文件并根据需要修改：

```bash
cp .env.development .env.local
```

编辑 `.env.local` 文件：

```env
# 应用配置
VITE_APP_TITLE=GPAdmin管理后台
VITE_APP_SUBTITLE=你的宝可梦仓库再也不会乱成精灵球堆啦
VITE_APP_COMPANY=GPAdmin
VITE_APP_COPYRIGHT_START_YEAR=2025

# API 配置
VITE_API_BASE_URL=/api

# Mock 配置
VITE_USE_MOCK=true  # 设置为 false 使用真实接口
```

4. **启动开发服务器**

```bash
npm run dev

# 或
yarn dev

# 或
pnpm dev
```

项目将在 `http://localhost:5173` 启动（端口可能不同，请查看终端输出）

5. **构建生产版本**

```bash
npm run build

# 或
yarn build

# 或
pnpm build
```

构建产物将输出到 `dist` 目录。

6. **预览生产构建**

```bash
npm run preview

# 或
yarn preview

# 或
pnpm preview
```

## 📖 开发指南

### 添加新页面

1. 在 `src/views` 目录下创建新的页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如果需要，在 `src/api/index.ts` 中添加对应的 API 接口

### 添加新的 API 接口

1. 在 `src/api/index.ts` 中定义接口：

```typescript
export const api = {
  // 你的新接口
  yourNewApi: (data: any): Promise<ApiResponse<any>> => {
    return request.post('/your/endpoint', data)
  }
}
```

2. 如果使用 Mock，在 `src/mock/index.ts` 中添加对应的 Mock 数据

### 使用 Pinia Store

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 读取状态
const token = userStore.token
const userInfo = userStore.userInfo

// 调用方法
userStore.setToken('your-token')
userStore.setUserInfo({ id: 1, username: 'admin' })
```

## 🔧 Mock 使用说明

### Mock 简介

本项目内置了 Mock 数据支持，可以在不连接后端的情况下进行前端开发。Mock 数据会在请求拦截器中被自动拦截并返回模拟数据。

### 启用/禁用 Mock

在 `.env` 或 `.env.development` 文件中配置：

```env
# 启用 Mock（默认）
VITE_USE_MOCK=true

# 禁用 Mock，使用真实接口
VITE_USE_MOCK=false
```

### Mock 工作原理

1. **请求拦截**：在 `src/utils/request.ts` 中，当 `VITE_USE_MOCK=true` 时，请求会被拦截
2. **URL 匹配**：根据请求 URL 匹配对应的 Mock handler
3. **数据返回**：返回 Mock 数据，跳过真实 HTTP 请求

### 添加新的 Mock 接口

1. **在 `src/mock/index.ts` 中添加 Mock 数据函数**

```typescript
// 例如：添加获取商品列表的 Mock
const mockGetProducts = (params?: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: [
            { id: 1, name: '商品1', price: 99 },
            { id: 2, name: '商品2', price: 199 }
          ],
          total: 2
        }
      })
    }, 500) // 模拟网络延迟
  })
}

// 导出到 mockApi
export const mockApi = {
  // ... 其他接口
  getProducts: mockGetProducts
}
```

2. **在 `src/utils/request.ts` 中添加 URL 映射**

```typescript
const mockUrlMap: Record<string, (config: InternalAxiosRequestConfig) => Promise<any>> = {
  // ... 现有映射
  '/product/list': (config) => {
    const params = config.params || {}
    return mockApi.getProducts(params)
  }
}
```

3. **在 `src/api/index.ts` 中定义接口**

```typescript
export const api = {
  // ... 其他接口
  getProducts: (params?: any): Promise<ApiResponse<any>> => {
    return request.get('/product/list', { params })
  }
}
```

### 当前已实现的 Mock 接口

| 接口路径 | 方法 | 说明 |
|---------|------|------|
| `/auth/login` | POST | 账号密码登录 |
| `/auth/login/phone` | POST | 手机号登录 |
| `/user/info` | GET | 获取用户信息 |
| `/user/list` | GET | 获取用户列表 |
| `/role/list` | GET | 获取角色列表 |
| `/menu/list` | GET | 获取菜单列表 |
| `/dept/list` | GET | 获取部门列表 |

### Mock 数据特点

- **异步模拟**：所有 Mock 函数返回 Promise，模拟真实网络请求
- **延迟模拟**：使用 `setTimeout` 模拟网络延迟（通常 300-800ms）
- **数据格式统一**：所有 Mock 数据遵循统一的响应格式：

```typescript
{
  code: 200,           // 状态码，200 表示成功
  message: '提示信息', // 提示信息
  data: {}             // 返回数据
}
```

### 调试 Mock 数据

1. **查看控制台**：Mock 请求不会出现在 Network 面板，但可以在控制台看到相关日志
2. **修改 Mock 数据**：直接编辑 `src/mock/index.ts` 文件
3. **临时禁用 Mock**：将 `.env` 中的 `VITE_USE_MOCK` 设置为 `false`

## ⚙️ 环境变量配置

### 可用环境变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | 应用标题 | - | GPAdmin管理后台 |
| `VITE_APP_SUBTITLE` | 应用副标题 | - | 你的宝可梦仓库再也不会乱成精灵球堆啦 |
| `VITE_APP_COMPANY` | 公司名称 | - | GPAdmin |
| `VITE_APP_COPYRIGHT_START_YEAR` | 版权起始年份 | 2025 | 2025 |
| `VITE_API_BASE_URL` | API 基础路径 | /api | /api 或 <http://localhost:3000/api> |
| `VITE_USE_MOCK` | 是否使用 Mock | false | true/false |

### 环境变量使用

在代码中使用环境变量：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
const useMock = import.meta.env.VITE_USE_MOCK === 'true'
```

## 🚢 构建部署

### 构建命令

```bash
npm run build
```

构建完成后，`dist` 目录包含所有静态文件。

### 部署建议

1. **静态服务器部署**：将 `dist` 目录部署到 Nginx、Apache 等静态服务器
2. **Nginx 配置示例**：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **CDN 部署**：可以部署到 Vercel、Netlify、阿里云 OSS 等 CDN 服务

## 📝 开发规范

### 代码风格

- 使用 TypeScript 进行类型约束
- 使用 ESLint 和 Prettier 保持代码风格一致
- 组件使用 Composition API 和 `<script setup>` 语法

### 命名规范

- **组件名**：使用 PascalCase，如 `UserList.vue`
- **文件名**：使用 camelCase 或 kebab-case
- **变量名**：使用 camelCase
- **常量名**：使用 UPPER_SNAKE_CASE

### Git 提交规范

建议使用约定式提交：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 👥 作者

野原家管理系统开发团队

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

如有问题或建议，请提交 Issue 或 Pull Request。
