<script setup>
import { ref } from 'vue'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import { fetchAllPosts } from '@/api/admin.js'
import { format } from 'date-fns';  // 실제 API 연동

const props = defineProps({ pageTitle: String })

// 필터 초기값
const filters = ref({
  writerId: '',
  isDeleted: ''
})

// 게시글 조회 API 함수
async function fetchPostListData({ page = 1, writerId = '', isDeleted = '' }) {
  try {
    const res = await fetchAllPosts({
      page,
      writerId,
      isDeleted
    })
    console.log("응답 데이터:", res)  // 응답 데이터 확인

    return {
      data: res.data?.data?.posts || [],  // 실제 API 응답 데이터 구조에 맞게 수정
      totalPages: res.data?.data?.pagination?.totalPages || 1  // 페이지 정보
    }
  } catch (error) {
    console.error('🚨 게시글 목록 조회 실패:', error)
    return { data: [], totalPages: 1 }
  }
}

// 컬럼 정의
const columns = [
  { key: 'postId', label: '게시글 ID' },
  { key: 'userId', label: '작성자 ID' },
  { key: 'nickname', label: '작성자 닉네임' },
  { key: 'title', label: '제목' },
  { key: 'createdAt', label: '생성일', format: v => v ? format(new Date(v), 'yyyy-MM-dd HH:mm') : '-' },
  { key: 'deletedAt', label: '삭제일', format: v => v ? format(new Date(v), 'yyyy-MM-dd HH:mm') : '-' },
  { key: 'isDeleted', label: '공개 여부', format: v => (v === 'Y' ? '비공개' : '공개') },
  {
    key: 'detail',
    label: '상세보기',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => alert(`게시글 ${row.postId} 상세보기`)
    })
  }
]
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchPostListData"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="props.pageTitle"
    :enableModal="false"
  >
    <template #filters="{ filters }">
      <label class="filter-label">
        작성자 ID:
        <input v-model="filters.writerId" class="select-box id-input" placeholder="ID" />
      </label>
      <label class="filter-label">
        공개 여부:
        <select v-model="filters.isDeleted" class="select-box">
          <option value="">전체</option>
          <option value="N">공개</option>
          <option value="Y">비공개</option>
        </select>
      </label>
    </template>
  </AdminListTemplate>
</template>


<style scoped>

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

</style>
