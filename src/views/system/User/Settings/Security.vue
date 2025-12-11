<template>
  <div class="security-settings">
    <h2 class="settings-title">安全设置</h2>

    <div class="security-list">
      <!-- 账户密码 -->
      <div class="security-item">
        <div class="security-info">
          <div class="security-title">账户密码</div>
          <div class="security-desc">当前密码强度:强</div>
        </div>
        <a-button type="link" class="security-action" @click="handleModifyPassword">修改</a-button>
      </div>

      <a-divider />

      <!-- 密保手机 -->
      <div class="security-item">
        <div class="security-info">
          <div class="security-title">密保手机</div>
          <div class="security-desc">已绑定手机:191****2836</div>
        </div>
        <a-button type="link" class="security-action" @click="handleModifyPhone">修改</a-button>
      </div>

      <a-divider />

      <!-- 密保问题 -->
      <div class="security-item">
        <div class="security-info">
          <div class="security-title">密保问题</div>
          <div class="security-desc">未设置密保问题,密保问题可有效保护账户安全</div>
        </div>
        <a-button type="link" class="security-action" @click="handleSetQuestion">设置</a-button>
      </div>

      <a-divider />

      <!-- 备用邮箱 -->
      <div class="security-item">
        <div class="security-info">
          <div class="security-title">备用邮箱</div>
          <div class="security-desc">已绑定邮箱:siu***163.com</div>
        </div>
        <a-button type="link" class="security-action" @click="handleModifyEmail">修改</a-button>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <a-modal v-model:open="passwordModalVisible" title="修改密码" :width="500" @ok="handleSubmitPassword"
      @cancel="handleCancelPassword">
      <a-form :model="passwordFormData" :rules="passwordRules" ref="passwordFormRef" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }">
        <a-form-item label="当前密码" name="currentPassword">
          <a-input-password v-model:value="passwordFormData.currentPassword" placeholder="请输入当前密码" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input-password v-model:value="passwordFormData.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password v-model:value="passwordFormData.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改密保手机弹窗 -->
    <a-modal v-model:open="phoneModalVisible" title="修改密保手机" :width="500" @ok="handleSubmitPhone"
      @cancel="handleCancelPhone">
      <a-form :model="phoneFormData" :rules="phoneRules" ref="phoneFormRef" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }">
        <a-form-item label="当前手机" name="currentPhone">
          <a-input v-model:value="phoneFormData.currentPhone" disabled />
        </a-form-item>
        <a-form-item label="新手机号" name="newPhone">
          <a-input v-model:value="phoneFormData.newPhone" placeholder="请输入新手机号" :maxlength="11" />
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <div class="code-input-wrapper">
            <a-input v-model:value="phoneFormData.code" placeholder="请输入验证码" :maxlength="6" />
            <a-button type="primary" :disabled="phoneCodeCountdown > 0" @click="handleSendPhoneCode"
              class="send-code-btn">
              {{ phoneCodeCountdown > 0 ? `${phoneCodeCountdown}秒后重发` : '发送验证码' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 设置密保问题弹窗 -->
    <a-modal v-model:open="questionModalVisible" title="设置密保问题" :width="500" @ok="handleSubmitQuestion"
      @cancel="handleCancelQuestion">
      <a-form :model="questionFormData" :rules="questionRules" ref="questionFormRef" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }">
        <a-form-item label="问题一" name="question1">
          <a-select v-model:value="questionFormData.question1" placeholder="请选择密保问题">
            <a-select-option value="birthplace">您出生在哪个城市？</a-select-option>
            <a-select-option value="school">您的小学名称是什么？</a-select-option>
            <a-select-option value="pet">您养的宠物名字是什么？</a-select-option>
            <a-select-option value="mother">您母亲的姓名是什么？</a-select-option>
            <a-select-option value="father">您父亲的姓名是什么？</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="答案一" name="answer1">
          <a-input v-model:value="questionFormData.answer1" placeholder="请输入答案" />
        </a-form-item>
        <a-form-item label="问题二" name="question2">
          <a-select v-model:value="questionFormData.question2" placeholder="请选择密保问题">
            <a-select-option value="birthplace">您出生在哪个城市？</a-select-option>
            <a-select-option value="school">您的小学名称是什么？</a-select-option>
            <a-select-option value="pet">您养的宠物名字是什么？</a-select-option>
            <a-select-option value="mother">您母亲的姓名是什么？</a-select-option>
            <a-select-option value="father">您父亲的姓名是什么？</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="答案二" name="answer2">
          <a-input v-model:value="questionFormData.answer2" placeholder="请输入答案" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改备用邮箱弹窗 -->
    <a-modal v-model:open="emailModalVisible" title="修改备用邮箱" :width="500" @ok="handleSubmitEmail"
      @cancel="handleCancelEmail">
      <a-form :model="emailFormData" :rules="emailRules" ref="emailFormRef" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }">
        <a-form-item label="当前邮箱" name="currentEmail">
          <a-input v-model:value="emailFormData.currentEmail" disabled />
        </a-form-item>
        <a-form-item label="新邮箱" name="newEmail">
          <a-input v-model:value="emailFormData.newEmail" type="email" placeholder="请输入新邮箱" />
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <div class="code-input-wrapper">
            <a-input v-model:value="emailFormData.code" placeholder="请输入验证码" :maxlength="6" />
            <a-button type="primary" :disabled="emailCodeCountdown > 0" @click="handleSendEmailCode"
              class="send-code-btn">
              {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}秒后重发` : '发送验证码' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { api } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 弹窗显示状态
const passwordModalVisible = ref(false)
const phoneModalVisible = ref(false)
const questionModalVisible = ref(false)
const emailModalVisible = ref(false)

// 表单引用
const passwordFormRef = ref<FormInstance>()
const phoneFormRef = ref<FormInstance>()
const questionFormRef = ref<FormInstance>()
const emailFormRef = ref<FormInstance>()

// 验证码倒计时
const phoneCodeCountdown = ref(0)
const emailCodeCountdown = ref(0)
let phoneCountdownTimer: number | null = null
let emailCountdownTimer: number | null = null

// 修改密码表单
const passwordFormData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        if (value !== passwordFormData.newPassword) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

// 修改密保手机表单
const phoneFormData = reactive({
  currentPhone: '138****8293',
  newPhone: '',
  code: ''
})

const phoneRules = {
  newPhone: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 设置密保问题表单
const questionFormData = reactive({
  question1: '',
  answer1: '',
  question2: '',
  answer2: ''
})

const questionRules = {
  question1: [
    { required: true, message: '请选择问题一', trigger: 'change' }
  ],
  answer1: [
    { required: true, message: '请输入答案一', trigger: 'blur' },
    { min: 2, max: 20, message: '答案长度为2-20位', trigger: 'blur' }
  ],
  question2: [
    { required: true, message: '请选择问题二', trigger: 'change' }
  ],
  answer2: [
    { required: true, message: '请输入答案二', trigger: 'blur' },
    { min: 2, max: 20, message: '答案长度为2-20位', trigger: 'blur' }
  ]
}

// 修改备用邮箱表单
const emailFormData = reactive({
  currentEmail: 'ant***sign.com',
  newEmail: '',
  code: ''
})

const emailRules = {
  newEmail: [
    { required: true, message: '请输入新邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 打开修改密码弹窗
const handleModifyPassword = () => {
  passwordFormData.currentPassword = ''
  passwordFormData.newPassword = ''
  passwordFormData.confirmPassword = ''
  passwordModalVisible.value = true
}

// 提交修改密码
const handleSubmitPassword = async () => {
  try {
    await passwordFormRef.value?.validate()

    // 调用修改密码的API
    const response = await api.changePassword({
      current_password: passwordFormData.currentPassword,
      password: passwordFormData.newPassword,
      confirm_password: passwordFormData.confirmPassword
    })

    // 检查响应结果
    if (response && response.code === 200) {
      message.success(response.message || '密码修改成功')
      passwordModalVisible.value = false
      passwordFormData.currentPassword = ''
      passwordFormData.newPassword = ''
      passwordFormData.confirmPassword = ''

      // 修改密码成功后，退出登录并跳转到登录页
      setTimeout(async () => {
        await userStore.logout()
        router.replace('/login')
      }, 1500) // 1.5秒后退出，让用户看到成功提示
    } else {
      // 修改密码接口的错误由这里处理，显示错误提示
      const responseData = response as any
      const errorMessage = responseData?.message || responseData?.msg || '密码修改失败'
      message.error(errorMessage)
    }
  } catch (error: any) {
    // 处理错误，显示错误提示
    // token 过期的情况已经在 request.ts 中全局处理，这里只处理其他错误
    const errorResponse = error?.response?.data
    const errorMsg = errorResponse?.message || errorResponse?.msg || error?.message || '密码修改失败，请重试'

    // 如果错误信息不包含 "token已过期"，说明是其他错误，需要显示提示
    // token 过期的情况已经在 request.ts 中处理了，不需要在这里重复处理
    if (!errorMsg.includes('token已过期')) {
      message.error(errorMsg)
    }
    console.error('修改密码失败:', error)
  }
}

// 取消修改密码
const handleCancelPassword = () => {
  passwordModalVisible.value = false
  passwordFormData.currentPassword = ''
  passwordFormData.newPassword = ''
  passwordFormData.confirmPassword = ''
}

// 打开修改密保手机弹窗
const handleModifyPhone = () => {
  phoneFormData.newPhone = ''
  phoneFormData.code = ''
  phoneModalVisible.value = true
}

// 发送手机验证码
const handleSendPhoneCode = () => {
  if (!phoneFormData.newPhone) {
    message.warning('请先输入新手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phoneFormData.newPhone)) {
    message.warning('请输入正确的手机号')
    return
  }
  // 这里调用发送验证码的API
  message.success('验证码已发送')

  // 开始倒计时
  phoneCodeCountdown.value = 60
  phoneCountdownTimer = window.setInterval(() => {
    phoneCodeCountdown.value--
    if (phoneCodeCountdown.value <= 0) {
      if (phoneCountdownTimer) {
        clearInterval(phoneCountdownTimer)
        phoneCountdownTimer = null
      }
    }
  }, 1000)
}

// 提交修改密保手机
const handleSubmitPhone = async () => {
  try {
    await phoneFormRef.value?.validate()
    // 这里调用修改密保手机的API
    message.success('密保手机修改成功')
    phoneModalVisible.value = false
    phoneFormData.newPhone = ''
    phoneFormData.code = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消修改密保手机
const handleCancelPhone = () => {
  phoneModalVisible.value = false
  phoneFormData.newPhone = ''
  phoneFormData.code = ''
  if (phoneCountdownTimer) {
    clearInterval(phoneCountdownTimer)
    phoneCountdownTimer = null
    phoneCodeCountdown.value = 0
  }
}

// 打开设置密保问题弹窗
const handleSetQuestion = () => {
  questionFormData.question1 = ''
  questionFormData.answer1 = ''
  questionFormData.question2 = ''
  questionFormData.answer2 = ''
  questionModalVisible.value = true
}

// 提交设置密保问题
const handleSubmitQuestion = async () => {
  try {
    await questionFormRef.value?.validate()
    // 检查两个问题是否相同
    if (questionFormData.question1 === questionFormData.question2) {
      message.warning('两个密保问题不能相同')
      return
    }
    // 这里调用设置密保问题的API
    message.success('密保问题设置成功')
    questionModalVisible.value = false
    questionFormData.question1 = ''
    questionFormData.answer1 = ''
    questionFormData.question2 = ''
    questionFormData.answer2 = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消设置密保问题
const handleCancelQuestion = () => {
  questionModalVisible.value = false
  questionFormData.question1 = ''
  questionFormData.answer1 = ''
  questionFormData.question2 = ''
  questionFormData.answer2 = ''
}

// 打开修改备用邮箱弹窗
const handleModifyEmail = () => {
  emailFormData.newEmail = ''
  emailFormData.code = ''
  emailModalVisible.value = true
}

// 发送邮箱验证码
const handleSendEmailCode = () => {
  if (!emailFormData.newEmail) {
    message.warning('请先输入新邮箱')
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormData.newEmail)) {
    message.warning('请输入正确的邮箱地址')
    return
  }
  // 这里调用发送验证码的API
  message.success('验证码已发送到新邮箱')

  // 开始倒计时
  emailCodeCountdown.value = 60
  emailCountdownTimer = window.setInterval(() => {
    emailCodeCountdown.value--
    if (emailCodeCountdown.value <= 0) {
      if (emailCountdownTimer) {
        clearInterval(emailCountdownTimer)
        emailCountdownTimer = null
      }
    }
  }, 1000)
}

// 提交修改备用邮箱
const handleSubmitEmail = async () => {
  try {
    await emailFormRef.value?.validate()
    // 这里调用修改备用邮箱的API
    const emailParts = emailFormData.newEmail.split('@')
    const emailPrefix = emailParts[0] || ''
    const emailSuffix = emailParts[1] || ''
    if (emailPrefix && emailSuffix) {
      const prefix = emailPrefix.substring(0, Math.min(3, emailPrefix.length))
      message.success('备用邮箱修改成功')
    }
    emailModalVisible.value = false
    emailFormData.newEmail = ''
    emailFormData.code = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消修改备用邮箱
const handleCancelEmail = () => {
  emailModalVisible.value = false
  emailFormData.newEmail = ''
  emailFormData.code = ''
  if (emailCountdownTimer) {
    clearInterval(emailCountdownTimer)
    emailCountdownTimer = null
    emailCodeCountdown.value = 0
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (phoneCountdownTimer) {
    clearInterval(phoneCountdownTimer)
    phoneCountdownTimer = null
  }
  if (emailCountdownTimer) {
    clearInterval(emailCountdownTimer)
    emailCountdownTimer = null
  }
})
</script>

<style scoped>
.security-settings {
  padding: 0;
}

.settings-title {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.security-list {
  background: #fff;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.security-info {
  flex: 1;
}

.security-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.security-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.security-action {
  padding: 0;
  font-size: 14px;
  color: #1890ff;
}

.security-action:hover {
  color: #40a9ff;
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
