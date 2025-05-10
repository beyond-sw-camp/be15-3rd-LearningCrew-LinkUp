<script setup>
import { ref, onMounted } from 'vue';
import { getFriendCreatedMeetings } from '@/api/user.js';
import { usePagination } from '@/composables/usePagination.js';

const {
  items: meetings,
  loadMore,
  reset,
  hasNext,
  isLoading,
} = usePagination(getFriendCreatedMeetings);

const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  if (bottom && hasNext.value && !isLoading.value) {
    loadMore();
  }
};

onMounted(() => {
  loadMore();
});
</script>

<template>
  <section class="friend-meeting-history" @scroll.passive="handleScroll">
    <h2 class="title">친구가 개설한 모임</h2>

    <div class="meeting-list">
      <article v-for="meeting in meetings" :key="meeting.meetingId" class="meeting-card">
        <h3 class="meeting-title">{{ meeting.title }}</h3>
        <p class="meeting-info">일시: {{ meeting.date }}</p>
        <p class="meeting-info">장소: {{ meeting.location }}</p>
        <p class="meeting-info">개설자: {{ meeting.creatorNickname }}</p>
      </article>
    </div>

    <p v-if="meetings.length === 0 && !isLoading" class="empty-message">
      친구가 개설한 예정 모임이 없습니다.
    </p>
    <p v-if="isLoading" class="loading-message">불러오는 중...</p>
  </section>
</template>

<style scoped>
.friend-meeting-history {
  @apply flex flex-col gap-6 h-[600px] overflow-y-auto px-6 py-8;
}

.title {
  @apply text-2xl font-bold text-gray-900;
}

.meeting-list {
  @apply flex flex-col gap-4;
}

.meeting-card {
  @apply bg-white p-6 rounded-xl shadow flex flex-col gap-2;
}

.meeting-title {
  @apply text-lg font-semibold text-gray-800;
}

.meeting-info {
  @apply text-sm text-gray-600;
}

.empty-message,
.loading-message {
  @apply text-center text-gray-400 text-sm mt-6;
}
</style>
