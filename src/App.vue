<script setup lang="ts">
import { onMounted } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

onMounted(() => {
  // 应用初始化逻辑
})
</script>

<template>
  <ConfigProvider :locale="zhCN">
  <router-view />
  </ConfigProvider>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* NProgress 样式覆盖 */
#nprogress .bar {
  background: #1890ff !important;
  height: 3px !important;
}

#nprogress .peg {
  box-shadow: 0 0 10px #1890ff, 0 0 5px #1890ff !important;
}
</style>
