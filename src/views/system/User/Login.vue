<template>
    <div class="login-container">
        <!-- 粒子背景 -->
        <vue-particles id="tsparticles" :options="particlesOptions" class="particles-background" />

        <!-- 登录内容 -->
        <div class="login-content">
            <!-- Logo 和标题 -->
            <div class="login-header">
                <div class="header-top">
                    <img src="@/assets/logo.svg" alt="Logo" class="logo" />
                    <h1 class="app-title">{{ appTitle }}</h1>
                </div>
                <p class="app-subtitle">{{ appSubtitle }}</p>
            </div>

            <!-- 登录表单 -->
            <div class="login-form-wrapper">
                <!-- 登录方式切换 -->
                <a-tabs v-model:activeKey="loginType" class="login-tabs" :centered="false">
                    <a-tab-pane key="account" tab="账号密码登录" />
                    <a-tab-pane key="phone" tab="手机号登录" />
                </a-tabs>

                <!-- 账号密码登录表单 -->
                <a-form v-if="loginType === 'account'" :model="accountForm" :rules="accountRules as any"
                    @finish="handleAccountSubmit" layout="vertical" class="login-form"
                    :validate-trigger="['change', 'blur']">
                    <a-form-item name="username">
                        <a-input v-model:value="accountForm.username" placeholder="账户: admin" size="large"
                            class="login-input">
                            <template #prefix>
                                <UserOutlined class="input-icon" />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password">
                        <a-input-password v-model:value="accountForm.password" placeholder="密码: admin or ant.design"
                            size="large" class="login-input">
                            <template #prefix>
                                <LockOutlined class="input-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item>
                        <div class="form-options">
                            <a-checkbox v-model:checked="autoLogin" class="auto-login-checkbox">
                                自动登录
                            </a-checkbox>
                            <a class="forgot-password" @click.prevent>忘记密码</a>
                        </div>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" size="large" block class="login-button"
                            :loading="loading">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>

                <!-- 手机号登录表单 -->
                <a-form v-if="loginType === 'phone'" :model="phoneForm" :rules="phoneRules as any"
                    @finish="handlePhoneSubmit" layout="vertical" class="login-form"
                    :validate-trigger="['change', 'blur']">
                    <a-form-item name="phone">
                        <a-input v-model:value="phoneForm.phone" placeholder="手机号" size="large" class="login-input">
                            <template #prefix>
                                <MobileOutlined class="input-icon" />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="captcha">
                        <div class="captcha-wrapper">
                            <a-input v-model:value="phoneForm.captcha" placeholder="验证码" size="large"
                                class="captcha-input">
                                <template #prefix>
                                    <SafetyOutlined class="input-icon" />
                                </template>
                            </a-input>
                            <a-button size="large" :disabled="captchaCountdown > 0" @click="handleSendCaptcha"
                                class="captcha-button">
                                {{ captchaCountdown > 0 ? `${captchaCountdown}秒后重试` : '获取验证码' }}
                            </a-button>
                        </div>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" size="large" block class="login-button"
                            :loading="loading">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>

                <!-- 其他登录方式 -->
                <div class="other-login">
                    <span class="other-login-text">其他登录方式</span>
                    <div class="other-login-icons">
                        <a-tooltip title="支付宝">
                            <AlipayCircleOutlined class="login-icon" />
                        </a-tooltip>
                        <a-tooltip title="淘宝">
                            <TaobaoCircleOutlined class="login-icon" />
                        </a-tooltip>
                        <a-tooltip title="微博">
                            <WeiboCircleOutlined class="login-icon" />
                        </a-tooltip>
                    </div>
                </div>

                <!-- 注册链接 -->
                <div class="register-link-wrapper">
                    <span class="register-link-text">还没有账户？</span>
                    <a class="register-link" @click="goToRegister">立即注册</a>
                </div>
            </div>
        </div>

        <!-- 底部信息 -->
        <div class="login-footer">
            <AppFooter />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
    UserOutlined,
    LockOutlined,
    MobileOutlined,
    SafetyOutlined,
    AlipayCircleOutlined,
    TaobaoCircleOutlined,
    WeiboCircleOutlined
} from '@ant-design/icons-vue'
import {
    Tabs as ATabs,
    TabPane as ATabPane,
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    InputPassword as AInputPassword,
    Button as AButton,
    Checkbox as ACheckbox,
    Tooltip as ATooltip
} from 'ant-design-vue'
import AppFooter from '@/layouts/components/AppFooter.vue'
import { useUserStore } from '@/stores/user'
import { api } from '@/api'

const router = useRouter()
const userStore = useUserStore()

// 应用标题和副标题
const appTitle = import.meta.env.VITE_APP_TITLE || '野原家管理系统'
const appSubtitle = import.meta.env.VITE_APP_SUBTITLE || '春日部市双叶町最具影响力的家庭管理系统'

// 登录方式
const loginType = ref<'account' | 'phone'>('account')

// 自动登录
const autoLogin = ref(false)

// 登录加载状态
const loading = ref(false)

// 账号密码表单
const accountForm = reactive({
    username: '',
    password: ''
})

// 手机号表单
const phoneForm = reactive({
    phone: '',
    captcha: ''
})

// 验证码倒计时
const captchaCountdown = ref(0)
let captchaTimer: number | null = null

// 表单验证规则
const accountRules = {
    username: [
        { required: true, message: '请输入账户名或邮箱', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
}

const phoneRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ]
}

// 粒子配置
const particlesOptions = {
    background: {
        color: {
            value: '#f0f2f5'
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: '#1677ff'
        },
        links: {
            color: '#1677ff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce'
            },
            random: false,
            speed: 2,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 800
            },
            value: 80
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 1, max: 5 }
        }
    },
    detectRetina: true
}

// 发送验证码
const handleSendCaptcha = () => {
    if (!phoneForm.phone) {
        message.warning('请先输入手机号')
        return
    }
    if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
        message.warning('请输入正确的手机号')
        return
    }
    // 模拟发送验证码
    message.success('验证码已发送，请查收')
    captchaCountdown.value = 60
    captchaTimer = setInterval(() => {
        captchaCountdown.value--
        if (captchaCountdown.value <= 0) {
            if (captchaTimer) {
                clearInterval(captchaTimer)
                captchaTimer = null
            }
        }
    }, 1000)
}

// 账号密码登录
const handleAccountSubmit = async (values: any) => {
    loading.value = true
    try {
        const response = await api.login({
            username: values.username,
            password: values.password
        })

        if (response.code === 200 && response.data) {
            // 存储 token
            userStore.setToken(response.data.token)

            // 存储用户信息
            if (response.data.userInfo) {
                userStore.setUserInfo(response.data.userInfo)
            } else {
                // 如果没有返回用户信息，调用获取用户信息接口
                try {
                    const userInfoRes = await api.getUserInfo()
                    if (userInfoRes.code === 200 && userInfoRes.data) {
                        userStore.setUserInfo(userInfoRes.data)
                    }
                } catch (error) {
                    console.error('获取用户信息失败:', error)
                }
            }

            // 如果选择了自动登录，保存用户名（可选）
            if (autoLogin.value) {
                localStorage.setItem('rememberUsername', values.username)
            } else {
                localStorage.removeItem('rememberUsername')
            }

            message.success('登录成功')
            // 跳转到管理后台首页
            router.replace('/')
        } else {
            // 错误已在request拦截器中统一处理，这里不需要重复提示
            console.error('登录失败:', response.message || '登录失败')
        }
    } catch (error: any) {
        // 错误已在request拦截器中统一处理，这里不需要重复提示
        console.error('登录失败:', error)
    } finally {
        loading.value = false
    }
}

// 手机号登录
const handlePhoneSubmit = async (values: any) => {
    loading.value = true
    try {
        const response = await api.loginByPhone({
            phone: values.phone,
            captcha: values.captcha
        })

        if (response.code === 200 && response.data) {
            // 存储 token
            userStore.setToken(response.data.token)

            // 存储用户信息
            if (response.data.userInfo) {
                userStore.setUserInfo(response.data.userInfo)
            } else {
                // 如果没有返回用户信息，调用获取用户信息接口
                try {
                    const userInfoRes = await api.getUserInfo()
                    if (userInfoRes.code === 200 && userInfoRes.data) {
                        userStore.setUserInfo(userInfoRes.data)
                    }
                } catch (error) {
                    console.error('获取用户信息失败:', error)
                }
            }

            message.success('登录成功')
            // 跳转到管理后台首页
            router.replace('/')
        } else {
            // 错误已在request拦截器中统一处理，这里不需要重复提示
            console.error('登录失败:', response.message || '登录失败')
        }
    } catch (error: any) {
        // 错误已在request拦截器中统一处理，这里不需要重复提示
        console.error('登录失败:', error)
    } finally {
        loading.value = false
    }
}

// 跳转到注册页
const goToRegister = () => {
    router.push('/register')
}

// 清理定时器
onUnmounted(() => {
    if (captchaTimer) {
        clearInterval(captchaTimer)
    }
})
</script>

<style scoped>
.login-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #f0f2f5;
}

.particles-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.login-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 100px);
    padding: 40px 20px 100px 20px;
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
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

.login-form-wrapper {
    width: 100%;
    max-width: 400px;
    background: #fff;
    border-radius: 8px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-tabs {
    margin-bottom: 24px;
}

.login-tabs :deep(.ant-tabs-tab) {
    font-weight: normal;
    padding: 12px 16px;
}

.login-form {
    width: 100%;
}

.login-input {
    height: 48px;
}

.login-input :deep(.ant-input-prefix) {
    color: #8c8c8c;
}

.input-icon {
    font-size: 16px;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.auto-login-checkbox {
    color: #595959;
}

.forgot-password {
    color: #1677ff;
    text-decoration: none;
}

.forgot-password:hover {
    color: #4096ff;
}

.login-button {
    height: 48px;
    font-size: 16px;
    margin-top: 8px;
}

.captcha-wrapper {
    display: flex;
    gap: 8px;
    width: 100%;
}

.captcha-input {
    flex: 1;
    height: 48px;
}

.captcha-button {
    height: 48px;
    padding: 0 20px;
    white-space: nowrap;
    min-width: 120px;
    flex-shrink: 0;
    border-radius: 6px;
}

.captcha-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.other-login {
    margin-top: 24px;
    text-align: center;
}

.other-login-text {
    display: block;
    color: #8c8c8c;
    font-size: 14px;
    margin-bottom: 16px;
}

.other-login-icons {
    display: flex;
    justify-content: center;
    gap: 24px;
}

.login-icon {
    font-size: 24px;
    color: #8c8c8c;
    cursor: pointer;
    transition: color 0.3s;
}

.login-icon:hover {
    color: #1677ff;
}

.register-link-wrapper {
    margin-top: 24px;
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
}

.register-link-text {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-right: 8px;
}

.register-link {
    color: #1677ff;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s;
    font-weight: 500;
}

.register-link:hover {
    color: #4096ff;
    text-decoration: none;
}

.login-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 0;
    background: transparent;
    z-index: 1;
}
</style>
