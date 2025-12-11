<template>
  <div class="workbench">
    <a-card title="用户登录信息" :bordered="false" class="content-card">
      <pre class="json-content">{{ jsonData }}</pre>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card as ACard } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const jsonData = computed(() => {
  if (userStore.userInfo) {
    return JSON.stringify(userStore.userInfo, null, 2)
  }
  return '暂无数据'
})
</script>

<style scoped>
.workbench {
  padding: 0;
}

.content-card {
  background: #fff;
  border-radius: 4px;
}

.json-content {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}
</style>
