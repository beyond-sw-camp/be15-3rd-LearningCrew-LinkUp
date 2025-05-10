<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import DetailViewer from '@/features/admin/components/DetailViewer.vue'
import AdminButton from '@/features/admin/components/AdminButton.vue'
import {
  fetchObjectionList,
  fetchObjectionDetail,
  acceptObjection,
  rejectObjection
} from '@/api/admin.js'

const pageTitle = '이의 제기 내역 조회'
const STATUS_MAP = { 1: '대기', 2: '승인', 3: '거절' }

const filters = ref({ userId: '', statusId: '' })
const selected = ref(null)

const fetchList = async ({ page, userId, statusId }) => {
  try {
    const res = await fetchObjectionList({ memberId: userId, statusId, page })
    console.log("응답 데이터:", res)  // 응답 데이터 확인

    return {
      data: res.data.objections || [],
      totalPages: res.data.pagination?.totalPage || 1
    }
  } catch (e) {
    return { data: [], totalPages: 1 }
  }
}

const openDetail = async (row) => {
  try {
    const res = await fetchObjectionDetail(row.objectionId)
    selected.value = res.data
  } catch (e) {
  }
}

function close() {
  selected.value = null
}

async function handleAccept() {
  try {
    await acceptObjection(selected.value.objectionId)
    close()
  } catch (e) {
  }
}

async function handleReject() {
  try {
    await rejectObjection(selected.value.objectionId)
    close()
  } catch (e) {
  }
}

const columns = [
  { key: 'objectionId', label: '이의 제기 ID' },
  { key: 'memberId', label: '사용자 ID' },
  { key: 'userName', label: '사용자 이름' },
  { key: 'penaltyId', label: '제재 ID' },
  { key: 'reason', label: '사유' },
  {
    key: 'createdAt',
    label: '제기 일시',
    format: v => format(new Date(v), 'yyyy-MM-dd HH:mm')
  },
  {
    key: 'statusId',
    label: '상태',
    format: v => STATUS_MAP[v] || '-'
  },
  {
    key: 'action',
    label: '상세',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => openDetail(row)
    })
  }
]
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchList"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="pageTitle"
    :enableModal="true"
  >
    <template #filters="{ filters }">
      <label class="filter-label" for="status-select">상태:</label>
      <select
        id="status-select"
        v-model="filters.statusId"
        class="select-box"
      >
        <option value="">전체</option>
        <option value="1">대기</option>
        <option value="2">승인</option>
        <option value="3">거절</option>
      </select>

      <label class="filter-label" for="user-id-input">사용자 ID:</label>
      <input
        id="user-id-input"
        v-model="filters.userId"
        class="select-box id-input"
        placeholder="ID"
      />
    </template>

    <template #modal>
      <DetailViewer
        v-if="selected"
        :model-value="true"
        @update:modelValue="close"
        title="이의 제기 상세 정보"
        description="이의 제기 사유와 제재 내역을 확인하고 후속 조치를 진행할 수 있습니다."
      >
        <template #default>
          <section class="modal-section" aria-labelledby="user-info">
            <h3 class="section-title" id="user-info">사용자 정보</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">사용자 ID</span><span class="value">{{ selected.memberId }}</span></div>
              <div class="info-item"><span class="label">이름</span><span class="value">{{ selected.userName }}</span></div>
            </div>
          </section>

          <section class="modal-section" aria-labelledby="penalty-info">
            <h3 class="section-title" id="penalty-info">제재 정보</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">제재 ID</span><span class="value">{{ selected.penaltyId }}</span></div>
              <div class="info-item"><span class="label">유형</span><span class="value">{{ selected.penaltyInfo.penaltyType }}</span></div>
              <div class="info-item"><span class="label">관련 ID</span><span class="value">
                {{ selected.penaltyInfo.postId ?? selected.penaltyInfo.commentId ?? selected.penaltyInfo.reviewId ?? '-' }}
              </span></div>
              <div class="info-item"><span class="label">사유</span><span class="value">{{ selected.penaltyInfo.reason }}</span></div>
              <div class="info-item"><span class="label">상태</span><span class="value">{{ selected.penaltyInfo.statusId === 2 ? '활성' : '비활성' }}</span></div>
              <div class="info-item"><span class="label">제재 일시</span><span class="value">{{ format(new Date(selected.penaltyInfo.createdAt), 'yyyy-MM-dd HH:mm') }}</span></div>
            </div>
          </section>

          <section class="modal-section" aria-labelledby="objection-reason">
            <h3 class="section-title" id="objection-reason">이의 제기 사유</h3>
            <div class="reason-box">{{ selected.reason }}</div>
          </section>
        </template>

        <template #footer>
          <AdminButton v-if="selected.statusId === 1" type="approve" @click="handleAccept">승인</AdminButton>
          <AdminButton v-if="selected.statusId === 1" type="reject" @click="handleReject">거절</AdminButton>
          <AdminButton type="secondary" @click="close">닫기</AdminButton>
        </template>
      </DetailViewer>
    </template>
  </AdminListTemplate>
</template>


<style scoped>
/* ========== 필터 영역 ========== */
.filter-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 6px;
}

.select-box,
input[type="text"],
select {
  height: 32px;
  padding: 6px 10px;
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


/* ========== 모달 오버레이 ========== */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}


/* ========== 모달 본체 ========== */
.modal-content,
.modal-report,
.penalty-detail-section {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  width: 850px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}


/* ========== 모달 섹션 ========== */
.modal-section,
.modal-report-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-section:last-child,
.modal-report-section:last-child {
  border-bottom: none;
}


/* ========== 제목 및 설명 ========== */
.section-title,
.report-title {
  font-size: 18px;
  font-weight: 600;
  color: #7d6fb3;
  margin: 20px 0 12px;
  padding-left: 10px;
  border-left: 4px solid #7d6fb3;
}

.sub-text {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
}


/* ========== 정보 표시 그리드 ========== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 32px;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 13px;
  color: #777;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 15px;
  font-weight: 500;
  color: #222;
}


/* ========== 사유 박스 ========== */
.reason-box {
  background: #f9f9fb;
  border: 1px solid #e0e0e0;
  padding: 18px;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  line-height: 1.6;
}


/* ========== 모달 버튼 영역 ========== */
.modal-footer,
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}


/* ========== 스크린 리더 전용 텍스트 ========== */
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
