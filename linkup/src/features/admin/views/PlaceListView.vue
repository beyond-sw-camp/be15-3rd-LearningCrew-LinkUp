<script setup>
import { ref } from 'vue'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import { fetchPlaceList } from '@/api/admin.js'
import PlaceDetailMember from '@/features/place/components/PlaceDetailMember.vue';  // 실제 API 연동

// props
const props = defineProps({ pageTitle: String })
const selectedPlace = ref(null)

// 필터 초기값 설정
const filters = {
  sportId: '',
  ownerId: '',
  isActive: ''
}

// 운동 종목 목록
const sportTypes = ref([
  { sportId: '1', sportName: '기타 운동' },
  { sportId: '2', sportName: '축구' },
  { sportId: '3', sportName: '테니스' },
  { sportId: '4', sportName: '볼링' },
  { sportId: '5', sportName: '탁구' },
  { sportId: '6', sportName: '농구' },
  { sportId: '7', sportName: '골프' },
  { sportId: '8', sportName: '배드민턴' }
])


// API 연동 함수 - 장소 목록 조회
async function fetchPlaceListData({ page = 1, sportId = '', ownerId = '', isActive = '' }) {
  try {
    // API 요청
    const res = await fetchPlaceList({
      page,
      sportId,
      ownerId,
      isActive
    })
    console.log("응답 데이터:", res)  // 응답 데이터 확인

    return {
      data: res.data?.data?.adminPlaces || [],
      totalPages: res.data?.data?.pagination?.totalPages || 1
    }
  } catch (error) {
    console.error('🚨 장소 목록 조회 실패:', error)
    return { data: [], totalPages: 1 }
  }
}

// 테이블 컬럼 정의
const columns = [
  { key: 'placeId', label: '장소 ID' },
  { key: 'placeName', label: '장소 이름' },
  { key: 'address', label: '주소' },
  { key: 'ownerId', label: '사업자 ID' },
  { key: 'ownerName', label: '사업자 이름' },
  { key: 'sportName', label: '운동 종목' },
  { key: 'averageScore', label: '평점' },
  { key: 'isActive', label: '활성화', format: (v) => (v === 'Y' ? '공개' : '비공개') },
  {
    key: 'view',
    label: '상세 보기',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => (selectedPlace.value = { ...row })
    })
  }
]
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchPlaceListData"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="props.pageTitle"
  >
  <template #filters="{ filters }">
    <!-- 운동 종목 필터 -->
    <label class="filter-label">
      운동 종목:
      <select v-model="filters.sportId" class="select-box">
        <option value="">전체</option>
        <option v-for="sport in sportTypes" :key="sport.sportId" :value="sport.sportId">
          {{ sport.sportName }}
        </option>
      </select>
    </label>

    <!-- 사업자 ID 필터 -->
    <label class="filter-label">
      사업자 ID:
      <input
        type="text"
        v-model="filters.ownerId"
        class="select-box id-input"
        placeholder="ID"
      />
    </label>

    <!-- 활성화 상태 필터 -->
    <label class="filter-label">
      활성화 상태:
      <select v-model="filters.isActive" class="select-box">
        <option value="">전체</option>
        <option value="Y">활성화</option>
        <option value="N">비활성화</option>
      </select>
    </label>
  </template>
  </AdminListTemplate>

  <Teleport to="body">
    <PlaceDetailMember
      v-if="selectedPlace"
      :place="selectedPlace"
      @close="() => (selectedPlace.value = null)"
    />
  </Teleport>

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
