<template>
  <div class="profile-container">
    <a-row :gutter="24">
      <!-- 左侧用户信息 -->
      <a-col :span="8">
        <a-card class="profile-card">
          <div class="profile-header">
            <a-avatar :size="104" class="avatar" :src="userInfo.avatar">
              <template v-if="!userInfo.avatar" #icon>
                <UserOutlined />
              </template>
            </a-avatar>
            <div class="user-name">{{ userInfo.name }}</div>
            <div class="user-slogan">{{ userInfo.slogan }}</div>
          </div>

          <a-divider />

          <div class="profile-info">
            <div class="info-item">
              <UserOutlined class="info-icon" />
              <span>{{ userInfo.role }}</span>
            </div>
            <div class="info-item">
              <BankOutlined class="info-icon" />
              <span>{{ userInfo.organization }}</span>
            </div>
            <div class="info-item">
              <EnvironmentOutlined class="info-icon" />
              <span>{{ userInfo.location }}</span>
            </div>
          </div>

          <a-divider />

          <!-- 标签 -->
          <div class="tags-section">
            <div class="section-title">标签</div>
            <div class="tags-list">
              <a-tag v-for="tag in userInfo.tags" :key="tag" color="blue">{{ tag }}</a-tag>
              <a-tag class="add-tag" @click="handleAddTag">
                <PlusOutlined />
                新建
              </a-tag>
            </div>
          </div>

          <a-divider />

          <!-- 团队 -->
          <div class="teams-section">
            <div class="section-title">团队</div>
            <div class="teams-list">
              <div v-for="team in userInfo.teams" :key="team.id" class="team-item">
                <a-avatar :size="24" :src="team.avatar" class="team-avatar">
                  <template v-if="!team.avatar" #icon>
                    <TeamOutlined />
                  </template>
                </a-avatar>
                <span class="team-name">{{ team.name }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧成就徽章 -->
      <a-col :span="16">
        <a-card class="badges-card">
          <template #title>
            <span>个人成就</span>
          </template>
          <div class="badges-container">
            <div class="badges-grid">
              <div v-for="badge in badges" :key="badge.id" class="badge-item"
                :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }">
                <div class="badge-icon">
                  <component :is="badge.icon" v-if="badge.unlocked" />
                  <LockOutlined v-else />
                </div>
                <div class="badge-name">{{ badge.name }}</div>
                <div class="badge-desc">{{ badge.description }}</div>
                <div v-if="badge.unlocked" class="badge-date">
                  获得时间：{{ badge.unlockDate }}
                </div>
                <div v-else class="badge-progress">
                  进度：{{ badge.progress }}%
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  TeamOutlined,
  LockOutlined,
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
  RocketOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 从 userStore 读取用户信息，并提供默认值
const userInfo = computed(() => {
  const storeUserInfo = userStore.userInfo
  return {
    name: storeUserInfo?.nickname || storeUserInfo?.username || 'admin',
    slogan: '海纳百川，有容乃大',
    role: storeUserInfo?.roles?.[0] || '交互专家',
    organization: '蚂蚁金服 - 某某某事业群 - 某某平台部 - 某某技术部 - UED',
    location: '浙江省杭州市',
    avatar: storeUserInfo?.avatar || '',
    tags: ['很有想法的', '专注设计', '辣~', '大长腿', '川妹子', '海纳百川'],
    teams: [
      { id: 1, name: '科学搬砖组', avatar: '' },
      { id: 2, name: '全组都是吴彦祖', avatar: '' },
      { id: 3, name: '中二少女团', avatar: '' },
      { id: 4, name: '程序员日常', avatar: '' },
      { id: 5, name: '高逼格设计天团', avatar: '' },
      { id: 6, name: '骗你来学计算机', avatar: '' }
    ]
  }
})

const badges = ref([
  {
    id: 1,
    name: '初出茅庐',
    description: '完成首次登录',
    icon: TrophyOutlined,
    unlocked: true,
    unlockDate: '2024-01-15'
  },
  {
    id: 2,
    name: '活跃之星',
    description: '连续登录7天',
    icon: StarOutlined,
    unlocked: true,
    unlockDate: '2024-02-20'
  },
  {
    id: 3,
    name: '热情如火',
    description: '连续登录30天',
    icon: FireOutlined,
    unlocked: false,
    unlockDate: '2024-03-15'
  }
])

const handleAddTag = () => {
  message.info('添加标签功能开发中...')
}
</script>

<style scoped>
.profile-container {
  padding: 0;
  min-height: calc(100vh - 200px);
}

.profile-card {
  height: fit-content;
}

.profile-header {
  text-align: center;
  padding: 20px 0;
}

.avatar {
  background-color: #1890ff;
  margin-bottom: 16px;
}

.user-name {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.user-slogan {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  font-style: italic;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
}

.info-icon {
  color: #1890ff;
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.tags-section,
.teams-section {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.add-tag {
  cursor: pointer;
  border-style: dashed;
}

.teams-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.team-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.team-avatar {
  background-color: #1890ff;
  flex-shrink: 0;
}

.team-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.badges-card {
  min-height: 600px;
}

.badges-container {
  padding: 8px 0;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background: #fff;
  transition: all 0.3s;
  cursor: pointer;
}

.badge-item.unlocked {
  border-color: #1890ff;
  background: linear-gradient(135deg, #e6f7ff 0%, #fff 100%);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.badge-item.locked {
  opacity: 0.6;
  background: #fafafa;
}

.badge-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #1890ff;
}

.badge-item.locked .badge-icon {
  color: #d9d9d9;
}

.badge-name {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
  text-align: center;
}

.badge-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 8px;
  text-align: center;
}

.badge-date {
  font-size: 12px;
  color: #52c41a;
  text-align: center;
}

.badge-progress {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
}

:deep(.ant-divider) {
  margin: 16px 0;
}
</style>
