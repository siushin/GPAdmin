import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'

const pinia = createPinia()
const app = createApp(App)

app.use(Antd)
    .use(pinia)
    .mount('#app')
