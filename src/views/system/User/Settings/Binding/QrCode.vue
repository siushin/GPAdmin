<template>
  <div class="qr-page">
    <div class="qr-container">
      <h2 class="qr-title">{{ title }}</h2>
      <div class="qr-code-wrapper">
        <canvas ref="qrCanvasRef" class="qr-canvas"></canvas>
      </div>
      <div class="qr-tips">
        <p>请使用{{ platform }}扫描二维码完成绑定</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const qrCanvasRef = ref<HTMLCanvasElement | null>(null)

// 从路由参数获取平台信息
const platform = computed(() => {
  const platformMap: Record<string, string> = {
    wechat: '微信',
    alipay: '支付宝',
    taobao: '淘宝',
    weibo: '微博'
  }
  return platformMap[route.params.platform as string] || route.params.platform as string
})

const title = computed(() => {
  const titleParam = route.query.title as string
  return titleParam ? decodeURIComponent(titleParam) : `绑定${platform.value}`
})

// 生成二维码
const generateQRCode = () => {
  nextTick(() => {
    if (!qrCanvasRef.value) return

    const canvas = qrCanvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 200
    canvas.width = size
    canvas.height = size

    // 清空画布
    ctx.clearRect(0, 0, size, size)

    // 绘制白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    // 绘制简单的二维码占位图案（黑白格子）
    const gridSize = 10
    const gridCount = size / gridSize

    ctx.fillStyle = '#000000'
    for (let i = 0; i < gridCount; i++) {
      for (let j = 0; j < gridCount; j++) {
        // 随机生成黑白格子（模拟二维码）
        if ((i + j) % 3 === 0 || (i * j) % 7 === 0) {
          ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize)
        }
      }
    }

    // 绘制三个定位角（二维码特征）
    const cornerSize = 30
    const corners: Array<{ x: number; y: number }> = [
      { x: 0, y: 0 },
      { x: size - cornerSize, y: 0 },
      { x: 0, y: size - cornerSize }
    ]

    corners.forEach((corner) => {
      const { x, y } = corner
      // 外框
      ctx.fillStyle = '#000000'
      ctx.fillRect(x, y, cornerSize, cornerSize)
      // 内框
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x + 5, y + 5, cornerSize - 10, cornerSize - 10)
      // 中心点
      ctx.fillStyle = '#000000'
      ctx.fillRect(x + 10, y + 10, cornerSize - 20, cornerSize - 20)
    })
  })
}

onMounted(() => {
  generateQRCode()
})
</script>

<style scoped>
.qr-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  margin: 0;
  padding: 0;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 32px;
  margin-top: 0;
}

.qr-code-wrapper {
  width: 200px;
  height: 200px;
  padding: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.qr-canvas {
  display: block;
  width: 200px;
  height: 200px;
}

.qr-tips {
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.qr-tips p {
  margin: 0;
}
</style>
