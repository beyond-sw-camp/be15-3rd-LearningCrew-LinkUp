<script setup>
import { ref } from 'vue'
import ReportModal from '@/components/common/ReportModal.vue'
import {
  reportUser,
  reportPost,
  reportComment
} from '@/api/admin.js' // API 연동

const isModalOpen = ref(false)
const modalType = ref('')
const targetInfo = ref('')

// 테스트용 고정 데이터 (실제 프로젝트에선 로그인된 사용자 등에서 가져와야 함)
const reporterMemberId = 28
const targetMemberId = 42
const postId = 24
const commentId = 30

// 모달 열기
const openModal = (type) => {
  modalType.value = type

  if (type === 'user') targetInfo.value = '악성유저123'
  else if (type === 'post') targetInfo.value = '이 게시글 내용은 너무 도배가 심해요.'
  else if (type === 'comment') targetInfo.value = '비속어가 포함된 댓글입니다.'

  isModalOpen.value = true
}

// 신고 제출
const handleSubmit = async (payload) => {
  const reportTypeId = Number(payload.reportType)
  const reason = payload.reason
  const base = { reporterMemberId, targetMemberId, reportTypeId, reason }

  try {
    let res

    if (modalType.value === 'user') {
      res = await reportUser(base)
    } else if (modalType.value === 'post') {
      res = await reportPost({ ...base, postId })
    } else if (modalType.value === 'comment') {
      res = await reportComment({ ...base, commentId })
    }

    alert(`✅ 신고가 접수되었습니다.\n\n📌 대상: ${targetInfo.value}\n📄 사유: ${reason}\n\n💬 서버 응답: ${res.data.message}`)
  } catch (e) {
    console.error('🚨 신고 실패:', e)
    alert('신고 등록 중 오류가 발생했습니다.')
  } finally {
    isModalOpen.value = false
  }
}
</script>

<template>
  <div class="report-view">
    <h1>신고 예시 화면</h1>
    <div class="report-button-group">
      <button class="report-btn" @click="openModal('user')">👤 사용자 신고</button>
      <button class="report-btn" @click="openModal('post')">📝 게시글 신고</button>
      <button class="report-btn" @click="openModal('comment')">💬 댓글 신고</button>
    </div>

    <ReportModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :type="modalType"
      :target-info="targetInfo"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>

.report-button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 32px;
}
.report-btn {
  padding: 12px 24px;
  background-color: #7d6fb3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.report-btn:hover {
  background-color: #6c5da8;
}
</style>


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

</style>
