<template>
  <div class="copyright">
    Copyright © {{ copyrightYear }} {{ appCompany }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 环境变量
const appCompany = import.meta.env.VITE_APP_COMPANY || 'XXX有限公司'

// 动态年份计算（获取当前年份）
const copyrightYear = computed(() => {
  return new Date().getFullYear().toString()
})
</script>

<style scoped>
.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
  padding: 0;
  margin: 0;
}
</style>
