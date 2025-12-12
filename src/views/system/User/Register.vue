<template>
    <div class="register-container">
        <!-- 粒子背景 -->
        <vue-particles id="tsparticles-register" :options="particlesOptions" class="particles-background" />

        <!-- 注册内容 -->
        <div class="register-content">
            <!-- Logo 和标题 -->
            <div class="register-header">
                <div class="header-top">
                    <img src="@/assets/logo.svg" alt="Logo" class="logo" />
                    <h1 class="app-title">{{ appTitle }}</h1>
                </div>
                <p class="app-subtitle">{{ appSubtitle }}</p>
            </div>

            <!-- 注册表单 -->
            <div class="register-form-wrapper">
                <h2 class="form-title">注册账户</h2>

                <a-form :model="registerForm" :rules="registerRules as any" @finish="handleRegisterSubmit"
                    layout="vertical" class="register-form" :validate-trigger="['change', 'blur']">
                    <a-form-item name="username">
                        <a-input v-model:value="registerForm.username" placeholder="用户名" size="large"
                            class="register-input">
                            <template #prefix>
                                <UserOutlined class="input-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="password">
                        <a-input-password v-model:value="registerForm.password" placeholder="至少8位密码，区分大小写" size="large"
                            class="register-input">
                            <template #prefix>
                                <LockOutlined class="input-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item name="confirmPassword">
                        <a-input-password v-model:value="registerForm.confirmPassword" placeholder="确认密码" size="large"
                            class="register-input">
                            <template #prefix>
                                <LockOutlined class="input-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item name="phone">
                        <a-input v-model:value="registerForm.phone" placeholder="手机号" size="large"
                            class="register-input">
                            <template #prefix>
                                <MobileOutlined class="input-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="captcha">
                        <div class="captcha-row">
                            <a-input v-model:value="registerForm.captcha" placeholder="验证码" size="large"
                                class="captcha-input register-input">
                                <template #prefix>
                                    <SafetyOutlined class="input-icon" />
                                </template>
                            </a-input>
                            <a-button :disabled="countdown > 0" @click="sendCaptcha" class="captcha-btn" size="large">
                                {{ countdown > 0 ? `${countdown}秒后获取` : '获取验证码' }}
                            </a-button>
                        </div>
                    </a-form-item>

                    <a-form-item name="agreement">
                        <a-checkbox v-model:checked="registerForm.agreement">
                            我已阅读并同意
                            <a @click.prevent>《服务条款》</a>
                            和
                            <a @click.prevent>《隐私政策》</a>
                        </a-checkbox>
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" block size="large" :loading="loading"
                            class="register-button">
                            注册
                        </a-button>
                    </a-form-item>
                </a-form>

                <!-- 已有账户 -->
                <div class="login-link-wrapper">
                    <span class="login-link-text">已有账户？</span>
                    <a class="login-link" @click="goToLogin">去登录</a>
                </div>
            </div>

            <!-- 底部信息 -->
            <div class="register-footer">
                <AppFooter />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
    UserOutlined,
    LockOutlined,
    MobileOutlined,
    SafetyOutlined
} from '@ant-design/icons-vue'
import {
    Form as AForm,
    Input as AInput,
    Button as AButton,
    Checkbox as ACheckbox,
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

const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    captcha: '',
    agreement: false
})

// 自定义验证：确认密码
const validateConfirmPassword = (_rule: any, value: string) => {
    if (!value) {
        return Promise.reject('请确认密码')
    }
    if (value !== registerForm.password) {
        return Promise.reject('两次输入的密码不一致')
    }
    return Promise.resolve()
}

// 自定义验证：协议
const validateAgreement = (_rule: any, value: boolean) => {
    if (!value) {
        return Promise.reject('请先阅读并同意服务条款和隐私政策')
    }
    return Promise.resolve()
}

const registerRules: any = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名至少3位', trigger: 'blur' },
        { max: 20, message: '用户名最多20位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_.]+$/, message: '用户名只能包含数字、英文大小写、下划线和点', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, message: '密码至少8位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_.]+$/, message: '密码只能包含数字、英文大小写、下划线和点', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ],
    agreement: [
        { validator: validateAgreement, trigger: 'change' }
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

const handleRegisterSubmit = async () => {
    loading.value = true
    try {
        // 调用注册接口
        await api.register({
            username: registerForm.username,
            password: registerForm.password,
            password_confirmation: registerForm.confirmPassword,
            mobile: registerForm.phone,
            code: registerForm.captcha
        })

        // 注册成功
        message.success('注册成功')

        // 刷新当前页面
        setTimeout(() => {
            message.success('注册成功，请登录')
            router.push('/login')
            loading.value = false
        }, 1000)
    } catch (error: any) {
        // 处理网络错误或其他异常
        let errorMsg = '注册失败，请稍后重试'

        if (error.response) {
            // HTTP 错误响应
            const status = error.response.status
            const errorData = error.response.data

            if (status === 400) {
                errorMsg = errorData?.message || errorData?.msg || '请求参数错误'
            } else if (status >= 500) {
                errorMsg = errorData?.message || errorData?.msg || '服务器错误，请稍后重试'
            } else {
                errorMsg = errorData?.message || errorData?.msg || `请求失败 (${status})`
            }
        } else if (error.request) {
            // 请求已发出但没有收到响应
            errorMsg = '网络连接失败，请检查网络设置'
        } else if (error.message) {
            // 其他错误
            errorMsg = error.message
        }

        message.error(errorMsg)
        console.error('注册失败:', error)
    } finally {
        loading.value = false
    }
}

const sendCaptcha = async () => {
    if (!registerForm.phone) {
        message.warning('请先输入手机号')
        return
    }
    if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
        message.warning('请输入正确的手机号')
        return
    }

    try {
        // 调用发送验证码接口
        await api.sendSmsCode({
            mobile: registerForm.phone,
            type: 'register'
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
.register-container {
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

.register-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
}

.register-header {
    text-align: center;
    margin-bottom: 40px;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
}

.logo {
    width: 48px;
    height: 48px;
    display: block;
    flex-shrink: 0;
}

.app-title {
    font-size: 33px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin: 0;
    letter-spacing: -0.5px;
}

.app-subtitle {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    margin: 0;
    line-height: 1.5;
}

.register-form-wrapper {
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

.register-form {
    margin-top: 0;
}

.register-input {
    height: 40px;
}

.register-input :deep(.ant-input),
.register-input :deep(.ant-input-password) {
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

.register-button {
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

.register-footer {
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
    .register-content {
        padding: 0;
    }

    .register-form-wrapper {
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
