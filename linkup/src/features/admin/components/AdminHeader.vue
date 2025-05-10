<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { adminNavItems } from '@/features/admin/constants/adminNavItems.js'


const route = useRoute()

// 현재 경로에 해당하는 네비게이션 활성화 상태 계산
const activePath = computed(() =>
  adminNavItems.find(item => route.path.startsWith(item.path))?.path
)
</script>

<template>
  <header class="admin-header" role="banner">
    <div class="header-left" aria-label="서비스 이름">서비스 관리</div>
    <nav class="admin-nav" role="navigation" aria-label="관리자 메뉴">
      <ul class="admin-nav-list">
        <li v-for="item in adminNavItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="nav-link"
            :class="{ active: activePath === item.path }"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #f5f3fa;
  border-bottom: 1px solid #e3e1ed;
}

.header-left {
  font-size: 18px;
  font-weight: 600;
}

.admin-nav {
  display: flex;
  align-items: center;
}

.admin-nav-list {
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;
}

.admin-nav li {
  margin: 0;
}

.admin-nav a {
  margin-left: 24px;
  font-weight: 500;
  color: #555;
  padding-bottom: 4px;
  text-decoration: none;
}

.admin-nav a.active {
  color: #7d6fb3;
  border-bottom: 2px solid #beb2dd;
}
</style>
