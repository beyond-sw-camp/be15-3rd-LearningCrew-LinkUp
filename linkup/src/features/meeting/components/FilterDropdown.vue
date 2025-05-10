<template>
  <div class="filter-dropdown-panel">
    <div class="filter-title">
      <img src="@/assets/icons/meeting_and_place/filter.svg" alt="상세 필터" class="w-5 h-5" />
      상세 조건 필터
    </div>
    <div class="filter-group" v-for="(group, label) in filterOptions" :key="label">
      <label class="filter-label">{{ group.label }}</label>
      <div class="filter-chip-group">
        <button
          v-for="value in group.values"
          :key="value"
          class="filter-chip"
          :class="{ active: localFilters[label] === value }"
          @click="localFilters[label] = value"
        >
          {{ value }}
        </button>
      </div>
    </div>
    <div class="filter-group">
      <label class="filter-label">날짜</label>
      <div class="meeting-filter-date">
        <input type="date" v-model="localFilters.startDate" class="date-input" />
        <span>~</span>
        <input type="date" v-model="localFilters.endDate" class="date-input" />
      </div>
    </div>
    <button class="filter-search-btn" @click="applyFilter">검색</button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({ filters: Object })
const emit = defineEmits(['update:filters'])
const localFilters = reactive({ ...props.filters })
const filterOptions = {
  sportType: { label: '운동 종목', values: ['풋살', '테니스', '볼링', '탁구', '농구', '골프', '배드민턴', '기타'] },
  gender: { label: '성별', values: ['전체', '남성', '여성'] },
  ageGroup: { label: '나이대', values: ['전체', '10대', '20대', '30대', '40대', '50대', '60대', '70대 이상'] },
  status: { label: '상태', values: ['전체', '모집중', '최소 모집완료', '모집완료', '진행 완료'] },
}
watch(() => props.filters, (newVal) => Object.assign(localFilters, newVal))
function applyFilter() {
  emit('update:filters', { ...localFilters })
}
</script>

<style scoped>
.filter-dropdown-panel {
  @apply bg-white shadow-md rounded-xl p-4 w-[340px] flex flex-col gap-6;
}
.filter-title {
  @apply flex items-center gap-2 text-base font-semibold text-gray-700;
}
.filter-group {
  @apply flex flex-col gap-2;
}
.filter-label {
  @apply text-sm font-medium text-gray-600;
}
.filter-chip-group {
  @apply flex flex-wrap gap-2;
}
.filter-chip {
  @apply border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 bg-white hover:bg-gray-100 transition;
}
.filter-chip.active {
  @apply bg-blue-100 border-blue-400 text-blue-700;
}
.meeting-filter-date {
  @apply flex items-center gap-2 text-sm;
}
.date-input {
  @apply border border-gray-300 rounded px-2 py-1;
}
.filter-search-btn {
  @apply w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition;
}
</style>
