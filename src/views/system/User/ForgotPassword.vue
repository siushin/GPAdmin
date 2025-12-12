<template>
    <div class="forgot-password-container">
        <!-- 粒子背景 -->
        <vue-particles id="tsparticles-forgot-password" :options="particlesOptions" class="particles-background" />

        <!-- 重置密码内容 -->
        <div class="forgot-password-content">
            <!-- Logo 和标题 -->
            <div class="forgot-password-header">
                <div class="header-top">
                    <img src="@/assets/pokemon.png" alt="Logo" class="logo" />
                    <h1 class="app-title">{{ appTitle }}</h1>
                </div>
                <p class="app-subtitle">{{ appSubtitle }}</p>
            </div>

            <!-- 重置密码表单 -->
            <div class="forgot-password-form-wrapper">
                <h2 class="form-title">重置密码</h2>

                <a-form :model="resetForm" :rules="resetRules as any" @finish="handleResetSubmit" layout="vertical"
                    class="forgot-password-form" :validate-trigger="['change', 'blur']">
                    <a-form-item name="mobile">
                        <a-input v-model:value="resetForm.mobile" placeholder="手机号" size="large"
                            class="forgot-password-input">
                            <template #prefix>
                                <MobileOutlined class="input-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="code">
                        <div class="captcha-row">
                            <a-input v-model:value="resetForm.code" placeholder="验证码" size="large"
                                class="captcha-input forgot-password-input">
                                <template #prefix>
                                    <SafetyOutlined class="input-icon" />
                                </template>
                            </a-input>
                            <a-button :disabled="countdown > 0" @click="sendCaptcha" class="captcha-btn" size="large">
                                {{ countdown > 0 ? `${countdown}秒后获取` : '获取验证码' }}
                            </a-button>
                        </div>
                    </a-form-item>

                    <a-form-item name="password">
                        <a-input-password v-model:value="resetForm.password" placeholder="新密码（至少8位，区分大小写）" size="large"
                            class="forgot-password-input">
                            <template #prefix>
                                <LockOutlined class="input-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item name="confirmPassword">
                        <a-input-password v-model:value="resetForm.confirmPassword" placeholder="确认新密码" size="large"
                            class="forgot-password-input">
                            <template #prefix>
                                <LockOutlined class="input-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" block size="large" :loading="loading"
                            class="reset-button">
                            重置密码
                        </a-button>
                    </a-form-item>
                </a-form>

                <!-- 返回登录 -->
                <div class="login-link-wrapper">
                    <span class="login-link-text">想起密码了？</span>
                    <a class="login-link" @click="goToLogin">返回登录</a>
                </div>
            </div>

            <!-- 底部信息 -->
            <div class="forgot-password-footer">
                <AppFooter />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
    LockOutlined,
    MobileOutlined,
    SafetyOutlined
} from '@ant-design/icons-vue'
import {
    Form as AForm,
    Input as AInput,
    Button as AButton,
    message
} from 'ant-design-vue'
import type { ISourceOptions } from '@tsparticles/engine'
import AppFooter from '@/layouts/components/AppFooter.vue'
import { api } from '@/api'

const router = useRouter()

// 环境变量
const appTitle = import.meta.env.VITE_APP_TITLE || 'GPAdmin管理后台'
const appSubtitle = import.meta.env.VITE_APP_SUBTITLE || '你的宝可梦仓库再也不会乱成精灵球堆啦'

const loading = ref(false)
const countdown = ref(0)

const resetForm = reactive({
    mobile: '',
    code: '',
    password: '',
    confirmPassword: ''
})

// 自定义验证：确认密码
const validateConfirmPassword = (_rule: any, value: string) => {
    if (!value) {
        return Promise.reject('请确认密码')
    }
    if (value !== resetForm.password) {
        return Promise.reject('两次输入的密码不一致')
    }
    return Promise.resolve()
}

const resetRules: any = {
    mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 8, message: '密码至少8位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_.]+$/, message: '密码只能包含数字、英文大小写、下划线和点', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
}

// 粒子配置 - 与登录页保持一致
const particlesOptions: ISourceOptions = {
    background: {
        color: {
            value: '#f0f2f5'
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: false
            },
            onHover: {
                enable: true,
                mode: 'grab'
            }
        },
        modes: {
            grab: {
                distance: 140,
                links: {
                    opacity: 0.4
                }
            }
        }
    },
    particles: {
        color: {
            value: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']
        },
        links: {
            color: '#d9d9d9',
            distance: 120,
            enable: true,
            opacity: 0.25,
            width: 1
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce'
            },
            random: false,
            speed: 0.8,
            straight: false
        },
        number: {
            density: {
                enable: true
            },
            value: 60
        },
        opacity: {
            value: 0.4
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 1, max: 2.5 }
        }
    },
    detectRetina: true
}

const handleResetSubmit = async () => {
    loading.value = true
    try {
        // 调用重置密码接口
        await api.resetPassword({
            mobile: resetForm.mobile,
            code: resetForm.code,
            password: resetForm.password,
            confirm_password: resetForm.confirmPassword
        })

        // 重置成功
        message.success('密码重置成功，请登录')

        // 跳转到登录页
        setTimeout(() => {
            router.push('/login')
        }, 1000)
    } catch (error: any) {
        // 错误信息已在 request 拦截器中统一处理
        console.error('重置密码失败:', error)
    } finally {
        loading.value = false
    }
}

const sendCaptcha = async () => {
    if (!resetForm.mobile) {
        message.warning('请先输入手机号')
        return
    }
    if (!/^1[3-9]\d{9}$/.test(resetForm.mobile)) {
        message.warning('请输入正确的手机号')
        return
    }

    try {
        // 调用发送验证码接口
        await api.sendSmsCode({
            mobile: resetForm.mobile,
            type: 'reset_password'
        })
        message.success('验证码已发送')
        countdown.value = 60
        const timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(timer)
            }
        }, 1000)
    } catch (error: any) {
        // 错误信息已在 request 拦截器中统一处理
        console.error('发送验证码失败:', error)
    }
}

const goToLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
.forgot-password-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f0f2f5;
    padding: 24px 24px 100px 24px;
    overflow: hidden;
}

.particles-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.forgot-password-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
}

.forgot-password-header {
    text-align: center;
    margin-bottom: 40px;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-bottom: 8px;
}

.logo {
    width: 48px;
    height: 48px;
}

.app-title {
    font-size: 32px;
    font-weight: 600;
    color: #262626;
    margin: 0;
}

.app-subtitle {
    font-size: 16px;
    color: #8c8c8c;
    margin: 0;
}

.forgot-password-form-wrapper {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin: 0 0 24px 0;
    text-align: center;
}

.forgot-password-form {
    margin-top: 0;
}

.forgot-password-input {
    height: 40px;
}

.forgot-password-input :deep(.ant-input),
.forgot-password-input :deep(.ant-input-password) {
    font-size: 14px;
}

.input-icon {
    color: rgba(0, 0, 0, 0.25);
    font-size: 16px;
}

.captcha-row {
    display: flex;
    gap: 8px;
}

.captcha-input {
    flex: 1;
}

.captcha-btn {
    white-space: nowrap;
    min-width: 120px;
}

.reset-button {
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    margin-top: 8px;
}

.login-link-wrapper {
    margin-top: 24px;
    text-align: center;
}

.login-link-text {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-right: 8px;
}

.login-link {
    color: #1677ff;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s;
}

.login-link:hover {
    color: #4096ff;
    text-decoration: none;
}

.forgot-password-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 0;
    background: transparent;
    z-index: 1;
}

/* 响应式设计 */
@media (max-width: 480px) {
    .forgot-password-content {
        padding: 0;
    }

    .forgot-password-form-wrapper {
        padding: 24px;
    }

    .app-title {
        font-size: 28px;
    }

    .logo {
        width: 56px;
        height: 56px;
    }
}
</style>
