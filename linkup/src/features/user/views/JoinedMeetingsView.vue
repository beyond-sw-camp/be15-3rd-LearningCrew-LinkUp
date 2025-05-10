<script setup>
import { ref, onMounted } from 'vue';
import { getUserMeetingHistory } from '@/api/user.js';
import { usePagination } from '@/composables/usePagination.js';

const activeTab = ref('전체');

// 탭 이름 -> 서버 요청 status 변환
const tabStatusMap = {
  전체: null,
  예정: 'PENDING',
  취소됨: 'DELETED',
  '진행 완료': 'DONE',
};

// API 요청 함수
const fetchMeetingHistory = async (page, size) => {
  const status = tabStatusMap[activeTab.value];
  return await getUserMeetingHistory({ status, page, size });
};

// 페이지네이션 훅
const { items: meetings, loadMore, reset, hasNext, isLoading } = usePagination(fetchMeetingHistory);

// 탭 변경
const changeTab = (tabName) => {
  if (activeTab.value !== tabName) {
    activeTab.value = tabName;
    reset();
    loadMore();
  }
};

// 내부 스크롤 감지
const handleScroll = (e) => {
  const el = e.target;
  const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

  if (bottom && hasNext.value && !isLoading.value) {
    loadMore();
  }
};

onMounted(() => {
  loadMore();
});
</script>

<template>
  <section class="history-container" aria-label="모임 이력 조회 섹션">
    <!-- 헤더 -->
    <header class="history-header">
      <h2 class="history-title">모임 이력</h2>
      <nav class="history-tabs">
        <button
          v-for="tab in Object.keys(tabStatusMap)"
          :key="tab"
          :class="['tab-button', { active: activeTab === tab }]"
          @click="changeTab(tab)"
        >
          {{ tab }}
        </button>
      </nav>
    </header>

    <!-- 고정 높이 스크롤 영역 -->
    <div class="history-scroll-area" @scroll.passive="handleScroll">
      <div class="history-list">
        <article v-for="meeting in meetings" :key="meeting.meetingId" class="history-card">
          <h3 class="meeting-title">{{ meeting.title }}</h3>
          <div class="meeting-info">
            <span>일시: {{ meeting.date }}</span>
            <span>장소: {{ meeting.location }}</span>
          </div>
          <div :class="['meeting-status', meetingStatusClass(meeting.status)]">
            {{ statusLabel(meeting.status) }}
          </div>
        </article>

        <!-- 로딩 -->
        <div v-if="isLoading" class="loading-message">불러오는 중...</div>

        <!-- 빈 상태 -->
        <div v-else-if="meetings.length === 0" class="empty-message">
          조회된 모임 이력이 없습니다.
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// 상태별 클래스
function meetingStatusClass(status) {
  switch (status) {
    case 'DONE':
      return 'completed';
    case 'DELETED':
      return 'cancelled';
    case 'PENDING':
      return 'upcoming';
    default:
      return '';
  }
}
function statusLabel(status) {
  switch (status) {
    case 'DONE':
      return '참가 완료';
    case 'DELETED':
      return '취소됨';
    case 'PENDING':
      return '예정된 모임';
    default:
      return '';
  }
}
</script>

<style scoped>
.history-container {
  @apply w-full flex flex-col gap-6;
}

.history-header {
  @apply flex flex-col gap-4;
}

.history-title {
  @apply text-2xl font-bold text-gray-900;
}

.history-tabs {
  @apply flex gap-2;
}

.tab-button {
  @apply px-4 py-2 rounded-sm bg-gray-200 text-gray-700 font-medium text-sm hover:bg-primary-default hover:text-white;
}
.tab-button.active {
  @apply bg-primary-default text-white;
}

/* 스크롤 가능한 영역 */
.history-scroll-area {
  @apply h-[600px] overflow-y-auto border-t border-gray-100 pt-4;
}

.history-list {
  @apply flex flex-col gap-6;
}

.history-card {
  @apply bg-white rounded-xl p-6 shadow-md flex flex-col gap-2;
}

.meeting-title {
  @apply text-lg font-bold text-gray-900;
}

.meeting-info {
  @apply flex flex-col text-sm text-gray-600 gap-1;
}

.meeting-status {
  @apply mt-2 text-xs font-bold rounded-full px-3 py-1 w-fit;
}
.meeting-status.completed {
  @apply bg-green-100 text-green-700;
}
.meeting-status.cancelled {
  @apply bg-red-100 text-red-700;
}
.meeting-status.upcoming {
  @apply bg-yellow-100 text-yellow-700;
}

.loading-message {
  @apply text-center text-gray-500 text-sm;
}

.empty-message {
  @apply text-center text-gray-400 text-sm mt-6;
}
</style>
