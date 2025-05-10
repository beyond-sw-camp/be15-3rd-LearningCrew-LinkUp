<script setup>
import { ref } from 'vue'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import { fetchSettlementList } from '@/api/admin.js'
import { format } from 'date-fns';

// 페이지 제목
const props = defineProps({ pageTitle: String })

// 필터 상태 관리
const filters = ref({
  ownerId: '',
  startDate: '',
  endDate: ''
})

// 컬럼 정의
const columns = [
  { key: 'settlementId', label: '정산 ID' },
  { key: 'ownerId', label: '사업자 ID' },
  { key: 'ownerName', label: '사업자 이름' },
  { key: 'amount', label: '정산 금액', format: v => `${v.toLocaleString()}원` },
  { key: 'completedAt', label: '정산 일시', format: v => v ? format(new Date(v), 'yyyy-MM-dd HH:mm') : '-' }
]

// API 호출 함수 (AdminListTemplate용 fetchFn 규격)
const fetchList = async ({ page = 1 }) => {
  try {
    const params = {
      userId: filters.value.ownerId || '',
      startDate: filters.value.startDate || '',
      endDate: filters.value.endDate || '',
      page
    }

    // null/빈 문자열 제거
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })

    const res = await fetchSettlementList(params)
    console.log('응답 데이터:', res)

    return {
      data: res.data?.data?.content || [],
      totalPages: res.data?.data?.totalPages || 1
    }
  } catch (error) {
    console.error('🚨 정산 내역 조회 실패:', error)
    return { data: [], totalPages: 1 }
  }
}
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchList"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="props.pageTitle"
    :enableModal="false"
  >
    <template #filters>
      <label class="filter-label">
        사업자 ID:
        <input
          v-model="filters.ownerId"
          class="select-box id-input"
          placeholder="ID"
        />
      </label>

      <label class="filter-label">
        정산 일시:
        <input type="date" v-model="filters.startDate" class="select-box date-input" />
        ~
        <input type="date" v-model="filters.endDate" class="select-box date-input" />
      </label>
    </template>
  </AdminListTemplate>
</template>


<style scoped>
.filter-wrapper {
  display: flex;
  margin-bottom: 12px;
  justify-content: space-between;
}

.filter-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

.filter-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 6px;
}

.select-box {
  margin-left: 12px;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
}

.filter-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  border: 0;
  padding: 0;
  margin: 0;
}

.input-box {
  min-width: 160px;
}

select,
input[type="text"] {
  height: 32px;
  padding: 4px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
}

select:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #7d6fb3;
  box-shadow: 0 0 0 2px rgba(125, 111, 179, 0.2);
}

.id-input {
  width: 50px;
}

/* 스크린리더 전용 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
