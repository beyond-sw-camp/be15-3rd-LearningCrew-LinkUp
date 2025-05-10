<script setup>
import { reactive, watch, computed } from 'vue'
import FilterRegionDropdown from './FilterRegionDropdown.vue'

const props = defineProps({
  filters: Object,
  regionOptions: Array
})
const emit = defineEmits(['update:filters'])

const localFilters = reactive({ ...props.filters })


watch(() => props.filters, (newVal) => {
  Object.assign(localFilters, newVal)
})

function applyFilter() {
  emit('update:filters', { ...localFilters });
}
</script>

<template>
  <div class="filter-dropdown-panel">
    <div class="filter-title">
      <img src="@/assets/icons/meeting_and_place/filter.svg" alt="상세 필터" width="20" height="20" />
      상세 조건 필터
    </div>

    <!-- 운동 종목 -->
    <div class="filter-group">
      <div class="filter-label">운동 종목</div>
      <div class="filter-chip-group">
        <button
          v-for="sport in ['풋살', '테니스', '볼링', '탁구', '농구', '골프', '배드민턴', '기타']"
          :key="sport"
          class="filter-chip"
          :class="{ active: filters.sportType === sport }"
          @click="filters.sportType = sport"
        >
          {{ sport }}
        </button>
      </div>
    </div>

    <!-- 지역 -->
    <div class="filter-group">
      <label class="filter-label">지역</label>
      <FilterRegionDropdown v-model="localFilters.regionCode" :regions="regionOptions" />
    </div>

    <!-- 성별 -->
    <div class="filter-group">
      <label class="filter-label">성별</label>
      <div class="filter-chip-group">
        <button
          v-for="g in ['전체', '남성', '여성']"
          :key="g"
          :class="{ active: localFilters.gender === g }"
          class="filter-chip"
          @click="localFilters.gender = g"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <!-- 나이대 -->
    <div class="filter-group">
      <label class="filter-label">나이대</label>
      <div class="filter-chip-group">
        <button
          v-for="age in ['전체', '10대', '20대', '30대', '40대', '50대', '60대', '70대 이상']"
          :key="age"
          :class="{ active: localFilters.ageGroup === age }"
          class="filter-chip"
          @click="localFilters.ageGroup = age"
        >
          {{ age }}
        </button>
      </div>
    </div>

    <!-- 상태 -->
    <div class="filter-group">
      <label class="filter-label">상태</label>
      <div class="filter-chip-group">
        <button
          v-for="status in ['전체', '모집중', '최소 모집완료', '모집완료', '진행 완료']"
          :key="status"
          :class="{ active: localFilters.status === status }"
          class="filter-chip"
          @click="localFilters.status = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- 날짜 -->
    <div class="filter-group">
      <label class="filter-label">날짜</label>
      <div class="meeting-filter-date">
        <input type="date" v-model="localFilters.startDate" />
        <span> ~ </span>
        <input type="date" v-model="localFilters.endDate" />
      </div>
    </div>

    <button class="filter-search-btn" @click="applyFilter">검색</button>
  </div>
</template>

<style scoped>
.filter-group {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
  gap: 8px;
  margin-bottom: 20px;
}
.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.filter-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.filter-chip {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip-button {
  padding: 5px 12px;
  margin-left: 15px;
  border-radius: 999px;
  background-color: #fff;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 70px;
}
.filter-chip.active {
  background-color: #5790FF;
  color: #fff;
  border-color: #5790FF;
}

/* ---------------- 필터 영역 ---------------- */
.filter-box {
  background: #fff;
  border-radius: 12px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}
.filter-item span {
  font-weight: 500;
  white-space: nowrap;
}
.filter-item select {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 12px;
  border: 1.5px solid #dcdfe5;
  background: #fff;
  color: #333;
  width: 80px;
  text-align: center;
}
.filter-item input[type="text"] {
  flex: 1;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 10px;
  border: 1.5px solid #dcdfe5;
  background: #fff;
}

/* ---------------- 필터 모달 ---------------- */

.filter-dropdown-panel {
  position: absolute;
  top: 35px;
  left: 150px;
  width: 530px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  padding : 30px 30px;
  gap: 20px;
}

.filter-dropdown-panel-num {
  position: absolute;
  top: 20px;
  left: 120px;
  width: 530px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.filter-dropdown-panel::before {
  display: none !important;
}

.filter-modal-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}
.filter-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}
.region-dropdown {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1.5px solid #dcdfe5;
  border-radius: 10px;
  background-color: #fff;
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23666' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px 14px;
  appearance: none;
  color: #333;
  cursor: pointer;
}
.date-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 10px;
  border: 1.5px solid #dcdfe5;
  background-color: #fff;
  color: #333;
}

.filter-search-btn {
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  background-color: #5790FF;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
}

.filter-icons {
  display: flex;
  gap: 10px;
  min-width: max-content;
}

.meeting-filter-date {
  display: flex;
  align-items: center;
  gap: 8px; /* 날짜 선택 input 사이 간격 */
}

.meeting-filter-date input[type="date"] {
  width: 120px; /* 각 날짜 선택 박스의 너비 */
  padding: 6px 12px; /* 여백 */
  border-radius: 8px; /* 둥근 테두리 */
  font-size: 12px; /* 폰트 크기 */
  border: 1px solid #ccc; /* 테두리 색상 */
  background-color: #fff; /* 배경색 */
  color: #333; /* 텍스트 색상 */
  text-align: center; /* 텍스트 가운데 정렬 */
}
</style>
