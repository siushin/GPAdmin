<template>
  <div class="workbench">
    <a-card title="工作台" :bordered="false" class="content-card">
      <p>欢迎使用工作台</p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { Card as ACard } from 'ant-design-vue'
</script>

<style scoped>
.workbench {
  padding: 0;
}

.content-card {
  background: #fff;
  border-radius: 4px;
}
</style>
