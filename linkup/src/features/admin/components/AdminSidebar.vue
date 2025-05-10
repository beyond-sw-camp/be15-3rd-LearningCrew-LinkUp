<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'


const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  }
})

const route = useRoute()

// 현재 경로 기준으로 활성 메뉴 path
const activePath = computed(() =>
  props.menuItems.find(item => route.path.startsWith(item.path))?.path
)
</script>

<template>
  <aside class="admin-sidebar" aria-label="관리자 사이드 메뉴">
    <nav class="sidebar-content" role="navigation">
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="sidebar-link"
            :class="{ active: item.path === activePath }"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- 푸터 링크 -->
    <footer class="sidebar-footer" role="contentinfo">
      <RouterLink to="/" class="return-link">서비스로 돌아가기</RouterLink>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
}

.admin-sidebar {
  width: 220px;
  background-color: #f9f8fb;
  padding: 20px 16px;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 68px);
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-sidebar li {
  margin-bottom: 16px;
}

.admin-sidebar a {
  display: block;
  font-weight: 500;
  color: #555;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
}

.admin-sidebar a.active {
  background-color: #e8e4f7;
}

.sidebar-footer {
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: center;
}

.return-link {
  color: #555;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.return-link:hover {
  color: #333;
}
</style>
