<template>
  <div class="binding-settings">
    <h2 class="settings-title">账户绑定</h2>

    <div class="binding-list">
      <!-- 手机号 -->
      <div class="binding-item">
        <div class="binding-info">
          <div class="binding-title">
            <MobileOutlined class="binding-icon" />
            <span>手机号</span>
          </div>
          <div class="binding-desc">
            {{ bindings.phone ? `已绑定手机: ${bindings.phone}` : '未绑定手机号' }}
          </div>
        </div>
        <div v-if="!bindings.phone" class="binding-action-wrapper">
          <a-button type="link" class="binding-action" @click="handleBindPhone">
            去绑定
          </a-button>
        </div>
        <div v-else class="binding-status-wrapper">
          <span class="binding-status">已绑定</span>
          <EditOutlined class="edit-icon" @click="handleEditPhone" />
        </div>
      </div>

      <a-divider />

      <!-- 邮箱 -->
      <div class="binding-item">
        <div class="binding-info">
          <div class="binding-title">
            <MailOutlined class="binding-icon" />
            <span>邮箱</span>
          </div>
          <div class="binding-desc">
            {{ bindings.email ? `已绑定邮箱: ${bindings.email}` : '未绑定邮箱' }}
          </div>
        </div>
        <div v-if="!bindings.email" class="binding-action-wrapper">
          <a-button type="link" class="binding-action" @click="handleBindEmail">
            去绑定
          </a-button>
        </div>
        <div v-else class="binding-status-wrapper">
          <span class="binding-status">已绑定</span>
          <EditOutlined class="edit-icon" @click="handleEditEmail" />
        </div>
      </div>

      <a-divider />

      <!-- 微信 -->
      <div class="binding-item">
        <div class="binding-info">
          <div class="binding-title">
            <WechatOutlined class="binding-icon" />
            <span>微信</span>
          </div>
          <div class="binding-desc">
            {{ bindings.wechat ? `已绑定微信: ${bindings.wechat}` : '未绑定微信' }}
          </div>
        </div>
        <a-button v-if="!bindings.wechat" type="link" class="binding-action" @click="handleBindWechat">
          去绑定
        </a-button>
        <span v-else class="binding-status">已绑定</span>
      </div>

      <a-divider />

      <!-- 支付宝 -->
      <div class="binding-item">
        <div class="binding-info">
          <div class="binding-title">
            <AlipayCircleOutlined class="binding-icon" />
            <span>支付宝</span>
          </div>
          <div class="binding-desc">
            {{ bindings.alipay ? `已绑定支付宝: ${bindings.alipay}` : '未绑定支付宝' }}
          </div>
        </div>
        <a-button v-if="!bindings.alipay" type="link" class="binding-action" @click="handleBindAlipay">
          去绑定
        </a-button>
        <span v-else class="binding-status">已绑定</span>
      </div>

      <a-divider />

      <!-- 淘宝 -->
      <div class="binding-item">
        <div class="binding-info">
          <div class="binding-title">
            <TaobaoCircleOutlined class="binding-icon" />
            <span>淘宝</span>
          </div>
          <div class="binding-desc">
            {{ bindings.taobao ? `已绑定淘宝: ${bindings.taobao}` : '未绑定淘宝' }}
          </div>
        </div>
        <a-button v-if="!bindings.taobao" type="link" class="binding-action" @click="handleBindTaobao">
          去绑定
        </a-button>
        <span v-else class="binding-status">已绑定</span>
      </div>

      <a-divider />

      <!-- 微博 -->
      <div class="binding-item">
        <div class="binding-info">
          <div class="binding-title">
            <WeiboCircleOutlined class="binding-icon" />
            <span>微博</span>
          </div>
          <div class="binding-desc">
            {{ bindings.weibo ? `已绑定微博: ${bindings.weibo}` : '未绑定微博' }}
          </div>
        </div>
        <a-button v-if="!bindings.weibo" type="link" class="binding-action" @click="handleBindWeibo">
          去绑定
        </a-button>
        <span v-else class="binding-status">已绑定</span>
      </div>
    </div>

    <!-- 修改手机号/邮箱弹窗 -->
    <a-modal v-model:open="editModalVisible" :title="editModalTitle" :width="500" @ok="handleSubmitEdit"
      @cancel="handleCancelEdit">
      <a-form :model="editFormData" :rules="editFormRules" ref="editFormRef" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }">
        <a-form-item label="当前账号" name="currentAccount">
          <a-input v-model:value="editFormData.currentAccount" disabled />
        </a-form-item>
        <a-form-item :label="editFormData.type === 'phone' ? '新手机号' : '新邮箱'"
          :name="editFormData.type === 'phone' ? 'newPhone' : 'newEmail'">
          <a-input v-if="editFormData.type === 'phone'" v-model:value="editFormData.newPhone" placeholder="请输入新手机号"
            :maxlength="11" />
          <a-input v-else v-model:value="editFormData.newEmail" type="email" placeholder="请输入新邮箱" />
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <div class="code-input-wrapper">
            <a-input v-model:value="editFormData.code" placeholder="请输入验证码" :maxlength="6" />
            <a-button type="primary" :disabled="codeCountdown > 0" @click="handleSendCode" class="send-code-btn">
              {{ codeCountdown > 0 ? `${codeCountdown}秒后重发` : '发送验证码' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  MobileOutlined,
  MailOutlined,
  WechatOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  EditOutlined
} from '@ant-design/icons-vue'

// 绑定状态（可以从API获取，这里使用模拟数据）
const bindings = reactive({
  phone: '138****8293',
  email: 'ant***sign.com',
  wechat: '',
  alipay: '',
  taobao: '',
  weibo: ''
})

// 修改弹窗相关
const editModalVisible = ref(false)
const editModalTitle = ref('')
const editFormRef = ref<FormInstance>()
const codeCountdown = ref(0)
let countdownTimer: number | null = null

const editFormData = reactive({
  type: 'phone' as 'phone' | 'email',
  currentAccount: '',
  newPhone: '',
  newEmail: '',
  code: ''
})

// 表单验证规则
const editFormRules = {
  newPhone: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  newEmail: [
    { required: true, message: '请输入新邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 打开二维码新窗口
const openQrWindow = (platform: string, title: string) => {
  const url = `/qrcode/${platform}?title=${encodeURIComponent(title)}`
  const windowFeatures = 'width=500,height=600,left=' + (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300) + ',resizable=yes,scrollbars=no'
  window.open(url, '_blank', windowFeatures)
}

const handleBindPhone = () => {
  message.info('绑定手机号功能开发中...')
}

const handleBindEmail = () => {
  message.info('绑定邮箱功能开发中...')
}

// 编辑手机号
const handleEditPhone = () => {
  editFormData.type = 'phone'
  editFormData.currentAccount = bindings.phone
  editFormData.newPhone = ''
  editFormData.newEmail = ''
  editFormData.code = ''
  editModalTitle.value = '修改手机号'
  editModalVisible.value = true
}

// 编辑邮箱
const handleEditEmail = () => {
  editFormData.type = 'email'
  editFormData.currentAccount = bindings.email
  editFormData.newPhone = ''
  editFormData.newEmail = ''
  editFormData.code = ''
  editModalTitle.value = '修改邮箱'
  editModalVisible.value = true
}

// 发送验证码
const handleSendCode = () => {
  if (editFormData.type === 'phone') {
    if (!editFormData.newPhone) {
      message.warning('请先输入新手机号')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(editFormData.newPhone)) {
      message.warning('请输入正确的手机号')
      return
    }
    // 这里调用发送验证码的API
    message.success('验证码已发送')
  } else {
    if (!editFormData.newEmail) {
      message.warning('请先输入新邮箱')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.newEmail)) {
      message.warning('请输入正确的邮箱地址')
      return
    }
    // 这里调用发送验证码的API
    message.success('验证码已发送到新邮箱')
  }

  // 开始倒计时
  codeCountdown.value = 60
  countdownTimer = window.setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

// 提交修改
const handleSubmitEdit = async () => {
  try {
    await editFormRef.value?.validate()

    // 这里调用修改手机号/邮箱的API
    if (editFormData.type === 'phone') {
      bindings.phone = editFormData.newPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      message.success('手机号修改成功')
    } else {
      const emailParts = editFormData.newEmail.split('@')
      const emailPrefix = emailParts[0] || ''
      const emailSuffix = emailParts[1] || ''
      if (emailPrefix && emailSuffix) {
        const prefix = emailPrefix.substring(0, Math.min(3, emailPrefix.length))
        bindings.email = prefix + '***' + '@' + emailSuffix
        message.success('邮箱修改成功')
      }
    }

    editModalVisible.value = false
    // 重置表单
    editFormData.newPhone = ''
    editFormData.newEmail = ''
    editFormData.code = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消修改
const handleCancelEdit = () => {
  editModalVisible.value = false
  editFormData.newPhone = ''
  editFormData.newEmail = ''
  editFormData.code = ''
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
    codeCountdown.value = 0
  }
}

const handleBindWechat = () => {
  openQrWindow('wechat', '绑定微信')
}

const handleBindAlipay = () => {
  openQrWindow('alipay', '绑定支付宝')
}

const handleBindTaobao = () => {
  openQrWindow('taobao', '绑定淘宝')
}

const handleBindWeibo = () => {
  openQrWindow('weibo', '绑定微博')
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style scoped>
.binding-settings {
  padding: 0;
}

.settings-title {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.binding-list {
  background: #fff;
}

.binding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.binding-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.binding-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.binding-icon {
  font-size: 18px;
  color: #1890ff;
}

.binding-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-left: 30px;
}

.binding-action {
  padding: 0;
  font-size: 14px;
  color: #1890ff;
}

.binding-action:hover {
  color: #40a9ff;
}

.binding-status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.binding-status {
  font-size: 14px;
  color: #52c41a;
  font-weight: 500;
}

.edit-icon {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: color 0.3s;
}

.edit-icon:hover {
  color: #1890ff;
}

.binding-action-wrapper {
  display: flex;
  align-items: center;
}

.code-input-wrapper {
  display: flex;
  gap: 8px;
}

.send-code-btn {
  white-space: nowrap;
  flex-shrink: 0;
}

:deep(.ant-divider) {
  margin: 0;
}
</style>
