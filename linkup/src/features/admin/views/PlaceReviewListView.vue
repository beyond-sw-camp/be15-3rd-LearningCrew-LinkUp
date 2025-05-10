<script setup>
import { ref } from 'vue'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import AdminModal from '@/features/admin/components/AdminModal.vue'
import { fetchPlaceReviewList } from '@/api/admin.js'  // 실제 API 연동

// props
const props = defineProps({ pageTitle: String })

// 필터 초기값
const initFilters = ref({
  searchType: 'writerId',
  keyword: '',
  isActive: ''
})

// 모달 상태
const isImageModalOpen = ref(false)
const imageUrl = ref('')

// API 연동 함수 - 장소 후기 목록 조회
async function fetchPlaceReviewListData({ page = 1, searchType = 'writerId', keyword = '', isActive = '' }) {
  try {
    // API 요청
    const res = await fetchPlaceReviewList({
      page,
      searchType,
      keyword,
      isActive
    })

    console.log("응답 데이터:", res)  // 응답 데이터 확인

    return {
      data: res.data?.data?.reviews || [],  // 실제 API 응답 데이터 구조에 맞게 수정
      totalPages: res.data?.data?.pagination?.totalPages || 1  // 페이지 정보
    }
  } catch (error) {
    console.error('🚨 장소 후기 목록 조회 실패:', error)
    return { data: [], totalPages: 1 }
  }
}

// 테이블 컬럼 정의
const columns = [
  { key: 'reviewId', label: '후기 ID' },
  { key: 'memberId', label: '작성자 ID' },
  { key: 'writerName', label: '작성자' },
  { key: 'placeId', label: '장소 ID' },
  { key: 'placeName', label: '장소 이름' },
  { key: 'score', label: '평점' },
  { key: 'content', label: '후기 내용' },
  { key: 'isActive', label: '삭제 여부', format: v => v === 'Y' ? '비공개' : '공개' },
  {
    key: 'imageUrl',
    label: '이미지',
    format: (_, row) => {
      return row.reviewImageUrl
        ? {
          type: 'button',
          label: '보기',
          onClick: () => {
            imageUrl.value = row.reviewImageUrl
            isImageModalOpen.value = true
          }
        }
        : '-'
    }
  }
]
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchPlaceReviewListData"
    :columns="columns"
    :initFilters="initFilters"
    :pageTitle="props.pageTitle"
  >
  <template #filters>
    <label class="filter-label">
      검색 기준:
      <select v-model="initFilters.searchType" class="select-box">
        <option value="writerId">작성자 ID</option>
        <option value="placeId">장소 ID</option>
      </select>
      <input type="text" v-model="initFilters.keyword" class="select-box id-input" placeholder="ID" />
    </label>
    <label class="filter-label">
      삭제 여부:
      <select v-model="initFilters.isActive" class="select-box">
        <option value="">전체</option>
        <option value="N">공개</option>
        <option value="Y">비공개</option>
      </select>
    </label>
  </template>

  <template #modal>
    <AdminModal v-model="isImageModalOpen">
      <template #title>
        <h2 class="modal-title">장소 후기 이미지</h2>
      </template>
      <img :src="imageUrl" alt="후기 이미지" style="max-width: 100%; border-radius: 8px;" />
    </AdminModal>
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
