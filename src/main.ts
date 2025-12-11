import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import 'nprogress/nprogress.css'

// 导入工具
import { setupRouter } from '@/router'
import pinia from '@/stores'
import '@/utils/dayjs' // 初始化 dayjs

// 创建应用实例
const app = createApp(App)

// 注册 Ant Design Vue
app.use(Antd)

// 注册 Particles
app.use(Particles, {
    init: async (engine) => {
        await loadSlim(engine)
    }
})

// 注册 Pinia
app.use(pinia)

// 注册 Vue Router
setupRouter(app)

// 挂载应用
app.mount('#app')
