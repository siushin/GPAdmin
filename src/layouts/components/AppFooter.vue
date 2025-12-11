<template>
  <div class="app-footer">
    <div class="footer-links">
      <a @click.prevent>帮助</a>
      <span class="divider">|</span>
      <a @click.prevent>隐私</a>
      <span class="divider">|</span>
      <a @click.prevent>条款</a>
    </div>
    <Copyright />
  </div>
</template>

<script setup lang="ts">
import Copyright from './Copyright.vue'
</script>

<style scoped>
.app-footer {
  text-align: center;
}

.footer-links {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.footer-links a {
  color: rgba(0, 0, 0, 0.45);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #1677ff;
}

.divider {
  color: rgba(0, 0, 0, 0.25);
  margin: 0 4px;
}
</style>
