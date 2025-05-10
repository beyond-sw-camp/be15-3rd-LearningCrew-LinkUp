<script setup>
import { ref } from 'vue'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import { fetchAllComments } from '@/api/admin.js'
import { format } from 'date-fns';  // 실제 API 연동

const props = defineProps({ pageTitle: String })

// 필터 초기값 설정
const filters = ref({
  userId: '',
  isDeleted: '',
  postId: ''
})

// API 연동 함수 - 댓글 목록 조회
async function fetchCommentListData({ page = 1, userId = '', isDeleted = '', postId = '' }) {
  try {
    const res = await fetchAllComments({
      page,
      userId,
      isDeleted,
      postId
    })
    console.log("응답 데이터:", res)  // 응답 데이터 확인


    return {
      data: res.data?.data?.postComments || [],  // 실제 API 응답 데이터 구조에 맞게 수정
      totalPages: res.data?.data?.pagination?.totalPages || 1  // 페이지 정보
    }
  } catch (error) {
    console.error('🚨 댓글 목록 조회 실패:', error)
    return { data: [], totalPages: 1 }
  }
}

// 테이블 컬럼 정의
const columns = [
  { key: 'commentId', label: '댓글 ID' },
  { key: 'postId', label: '게시글 ID' },
  { key: 'userId', label: '작성자 ID' },
  { key: 'nickname', label: '작성자 닉네임' },
  { key: 'commentContent', label: '내용' },
  { key: 'createdAt', label: '작성일', format: v => v ? format(new Date(v), 'yyyy-MM-dd HH:mm') : '-' },
  { key: 'deletedAt', label: '삭제일',format: v => v ? format(new Date(v), 'yyyy-MM-dd HH:mm') : '-' },
  { key: 'isDeleted', label: '공개 여부', format: v => (v === 'Y' ? '비공개' : '공개') }
]
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchCommentListData"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="props.pageTitle"
    :enableModal="false"
  >
    <template #filters="{ filters }">
      <label class="filter-label">
        작성자 ID:
        <input v-model="filters.userId" class="select-box id-input" placeholder="ID" />
      </label>
      <label class="filter-label">
        공개 여부:
        <select v-model="filters.isDeleted" class="select-box">
          <option value="">전체</option>
          <option value="N">공개</option>
          <option value="Y">비공개</option>
        </select>
      </label>
      <label class="filter-label">
        게시글 ID:
        <input v-model="filters.postId" class="select-box id-input" placeholder="ID" />
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
