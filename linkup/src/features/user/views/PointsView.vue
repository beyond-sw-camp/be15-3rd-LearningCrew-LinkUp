<script setup>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import PointFilter from '@/features/user/components/PointFilter.vue';
import { getUserPointTransactions } from '@/api/user';
import { usePagination } from '@/composables/usePagination';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();
const pointBalance = computed(() => authStore.pointBalance ?? 0);

const selectedYearMonth = ref('');
const selectedTransactionType = ref('');

// 페이징 함수
const fetchPoints = (page, size) =>
  getUserPointTransactions({
    yearMonth: selectedYearMonth.value || undefined,
    transactionType: selectedTransactionType.value || undefined,
    page,
    size,
  });

const {
  items: pointTransactions,
  loadMore,
  reset,
  hasNext,
  isLoading,
} = usePagination(fetchPoints);

// 필터 변경 시
const handleFilterChange = ({ yearMonth, transactionType }) => {
  selectedYearMonth.value = yearMonth;
  selectedTransactionType.value = transactionType;
  reset();
  loadMore();
};

// 리스트 스크롤 이벤트
const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;
  if (bottom && hasNext.value && !isLoading.value) {
    loadMore();
  }
};

// 포맷팅 함수
const getTransactionLabel = (type) => {
  switch (type) {
    case 'CHARGE':
      return '포인트 충전';
    case 'PAYMENT':
      return '모임 참가';
    case 'REFUND':
      return '환불';
    case 'WITHDRAW':
      return '출금';
    default:
      return '기타';
  }
};

const formatAmount = (amount) => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toLocaleString()}P`;
};

onMounted(() => {
  loadMore();
});
</script>

<template>
  <section class="point-history-page">
    <h2 class="section-title">포인트 내역</h2>

    <div class="balance-card">
      <p class="balance-label">나의 포인트</p>
      <p class="balance-amount">{{ pointBalance.toLocaleString() }}P</p>
      <button class="charge-button">포인트 환불하기</button>
    </div>

    <PointFilter @filter-change="handleFilterChange" />

    <!-- ✅ 포인트 내역이 없을 때 -->
    <div
      v-if="!isLoading && pointTransactions.length === 0"
      class="empty-indicator h-[400px] flex items-center justify-center text-sm text-gray-400"
    >
      포인트 내역이 없습니다.
    </div>

    <!-- ✅ 포인트 리스트 (고정 높이 + 스크롤) -->
    <ul v-else class="history-list" @scroll.passive="handleScroll">
      <li
        v-for="tx in pointTransactions"
        :key="tx.pointTransactionId"
        :class="['history-item', tx.transactionType.toLowerCase()]"
      >
        <div class="info">
          <p class="label">{{ getTransactionLabel(tx.transactionType) }}</p>
          <p class="date">{{ dayjs(tx.createdAt).format('YYYY.MM.DD') }}</p>
        </div>
        <div class="amount">
          {{ formatAmount(tx.amount) }}
        </div>
      </li>

      <!-- ✅ 로딩 중 -->
      <div v-if="isLoading" class="loading-indicator">불러오는 중...</div>
    </ul>
  </section>
</template>

<style scoped>
.point-history-page {
  @apply flex flex-col gap-8 w-full max-w-2xl mx-auto px-6 py-8;
}

.section-title {
  @apply text-2xl font-bold text-text-default;
}

.balance-card {
  @apply flex flex-col items-center gap-4 bg-background-surface shadow-sm rounded-lg py-6 px-8;
}

.balance-label {
  @apply text-base text-text-subtle;
}

.balance-amount {
  @apply text-3xl font-bold text-primary-active;
}

.charge-button {
  @apply mt-2 px-6 py-2 bg-warning-default text-white font-bold rounded-md hover:bg-rose-300 transition;
}

.history-list {
  @apply flex flex-col gap-4 w-full h-[400px] overflow-y-auto;
}

.history-item {
  @apply flex justify-between items-center bg-background-surface shadow-sm rounded-lg p-4;
}

.history-item.charge .amount {
  @apply text-primary-default font-bold text-lg;
}

.history-item.payment .amount {
  @apply text-warning-text font-bold text-lg;
}

.history-item.refund .amount {
  @apply text-primary-active font-bold text-lg;
}

.info {
  @apply flex flex-col;
}

.label {
  @apply font-semibold text-text-default;
}

.date {
  @apply text-sm text-text-subtle mt-1;
}

.loading-indicator {
  @apply text-center text-sm text-gray-500 py-2;
}
</style>
