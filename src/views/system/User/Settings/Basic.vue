<template>
  <div class="basic-settings">
    <h2 class="settings-title">基础设置</h2>

    <a-row :gutter="24">
      <!-- 左侧表单 -->
      <a-col :span="16">
        <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :rules="rules">
          <a-form-item label="* 邮箱" name="email" required>
            <a-input v-model:value="formData.email" disabled />
          </a-form-item>

          <a-form-item label="* 昵称" name="nickname" required>
            <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
          </a-form-item>

          <a-form-item label="个人简介">
            <a-textarea v-model:value="formData.profile" :rows="4" placeholder="请简要介绍自己" />
          </a-form-item>

          <a-form-item label="国家/地区">
            <a-select v-model:value="formData.country" placeholder="请选择国家/地区">
              <a-select-option value="china">中国</a-select-option>
              <a-select-option value="usa">美国</a-select-option>
              <a-select-option value="japan">日本</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="省/市">
            <a-row :gutter="8">
              <a-col :span="12">
                <a-select v-model:value="formData.province" placeholder="请选择省份">
                  <a-select-option value="beijing">北京市</a-select-option>
                  <a-select-option value="shanghai">上海市</a-select-option>
                  <a-select-option value="guangdong">广东省</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <a-select v-model:value="formData.city" placeholder="请选择城市">
                  <a-select-option value="guangzhou">广州市</a-select-option>
                  <a-select-option value="shenzhen">深圳市</a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="* 街道地址" name="address" required>
            <a-input v-model:value="formData.address" placeholder="请输入街道地址" />
          </a-form-item>

          <a-form-item label="* 手机号" name="phone" required>
            <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
            <a-button type="primary" @click="handleSubmit">更新信息</a-button>
          </a-form-item>
        </a-form>
      </a-col>

      <!-- 右侧头像 -->
      <a-col :span="8">
        <div class="avatar-section">
          <a-avatar :size="120" class="avatar" :src="avatarUrl">
            <template v-if="!avatarUrl" #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card" :show-upload-list="false"
            :before-upload="beforeUpload" @change="handleAvatarChange" class="avatar-upload"
            :customRequest="customRequest">
            <div class="upload-btn">
              <UploadOutlined />
              <div class="upload-text">更换</div>
            </div>
          </a-upload>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const formRef = ref()
const fileList = ref([])
const avatarUrl = ref<string>('')

const formData = reactive({
  email: 'admin@foo.com',
  nickname: 'admin',
  profile: '',
  country: 'china',
  province: 'guangdong',
  city: 'shenzhen',
  address: '',
  phone: ''
})

const rules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入街道地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }

  // 立即预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传，使用自定义上传
}

const customRequest = (options: any) => {
  // 自定义上传逻辑，这里可以先不实现，只预览
  // 后续可以在这里调用API上传
  setTimeout(() => {
    options.onSuccess({}, options.file)
  }, 0)
}

const handleAvatarChange = (info: any) => {
  // 文件选择后，beforeUpload已经处理了预览
  // 这里可以处理上传状态
  if (info.file.status === 'uploading') {
    // 上传中
  } else if (info.file.status === 'done') {
    message.success('头像上传成功')
  } else if (info.file.status === 'error') {
    message.error('头像上传失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    message.success('更新成功')
    // 这里可以调用API保存数据
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.basic-settings {
  padding: 0;
}

.settings-title {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
}

.avatar {
  background-color: #1890ff;
  flex-shrink: 0;
}

.avatar-upload {
  display: block;
  width: 120px;
  margin: 0 auto;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-text {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

:deep(.ant-upload-select) {
  width: 120px !important;
  height: 120px !important;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 !important;
  display: block;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-form-item-label > label) {
  position: relative;
}

:deep(.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
  display: none;
}
</style>
