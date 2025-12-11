<template>
  <div class="dashboard">
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Workbench from './components/Workbench.vue'

const route = useRoute()

// 根据路由名称或路径动态加载组件
const currentComponent = computed(() => {
  // 可以根据路由名称或路径来决定加载哪个组件
  if (route.name === 'Workbench' || route.path === '/workbench') {
    return Workbench
  }
  // 默认返回工作台
  return Workbench
})
</script>

<style scoped>
.dashboard {
  padding: 0;
  height: 100%;
}
</style>
