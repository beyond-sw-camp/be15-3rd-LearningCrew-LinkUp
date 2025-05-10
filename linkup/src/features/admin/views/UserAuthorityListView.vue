<script setup>
import { ref } from 'vue'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import AdminButton from '@/features/admin/components/AdminButton.vue'
import AdminModal from '@/features/admin/components/AdminModal.vue'
import { fetchAllOwners } from '@/api/admin.js'
import { format } from 'date-fns';  // 실제 API 연결

const props = defineProps({ pageTitle: String })

// 필터 상태
const filters = ref({
  status: '',
  userId: ''
})

// 모달 상태
const modalVisible = ref(false)
const modalData = ref(null)
const decision = ref('')
const rejectReason = ref('')

// 실제 API 연동: 사업자 권한 요청 목록 조회
const fetchRequests = async ({ page = 1, status = '', userId = '' }) => {
  try {
    const params = {
      statusName: status || undefined,  // 필터링할 상태 이름
      userId: userId || undefined,      // 사업자 ID
      page,
      size: 10                          // 페이지 크기
    }

    const response = await fetchAllOwners(params)

    // API 응답 구조에 맞게 처리
    return {
      data: response.data || [],
      totalPages: response.totalPages || 1
    }
  } catch (error) {
    console.error('사업자 권한 요청 목록 조회 실패:', error)
    return { data: [], totalPages: 0 }
  }
}

// 테이블 컬럼 정의
const columns = [
  { key: 'ownerId', label: '사업자 ID' },
  { key: 'ownerName', label: '이름' },
  {
    key: 'statusType',
    label: '상태',
    format: v => {
      switch (v) {
        case 'PENDING': return '대기'
        case 'ACCEPTED': return '승인'
        case 'REJECTED': return '거절'
        default: return v
      }
    }
  },
  {
    key: '등록증',
    label: '사업자 등록증',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => openModal(row)
    })
  },
  { key: 'authorizedAt', label: '처리일자',    format: v => v ? format(new Date(v), 'yyyy-MM-dd HH:mm') : '-' },
  { key: 'rejectionReason', label: '거절 사유', format: v => v || '-' }
]

// 모달 열기/닫기
function openModal(row) {
  modalData.value = row
  modalVisible.value = true
  decision.value = ''
  rejectReason.value = ''
  console.log('[DEBUG] modalData', modalData.value)
}
function closeModal() {
  modalVisible.value = false
  modalData.value = null
}

// 처리 버튼
function handleDecision() {
  if (!decision.value) return alert('처리 상태를 선택해주세요.')
  if (decision.value === 'REJECTED' && !rejectReason.value.trim()) {
    return alert('거절 사유를 입력해주세요.')
  }
  alert(`사용자 ${modalData.value.ownerId} ${decision.value === 'ACCEPTED' ? '승인' : '거절'} 처리되었습니다.`)
  closeModal()
}
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchRequests"
    :columns="columns"
    :initFilters="initFilters"
    :pageTitle="props.pageTitle"
    :enableModal="false"
  >
    <!-- 필터 영역 -->
    <template #filters="{ filters }">
      <label class="filter-label">
        상태:
        <select v-model="filters.status" class="select-box">
          <option value="">전체</option>
          <option value="PENDING">대기</option>
          <option value="ACCEPTED">승인</option>
          <option value="REJECTED">거절</option>
        </select>
      </label>
      <label class="filter-label">
        사업자 ID:
        <input v-model="filters.userId" class="select-box id-input" placeholder="ID" />
      </label>
    </template>

    <!-- 모달 -->
    <template #modal>
      <AdminModal v-model="modalVisible">
        <template #title>
          <h2 class="modal-title">사업자 등록 요청 상세</h2>
        </template>

        <div class="modal-left">
          <img
            :src="modalData?.business_registration_document_url || '/default-image.png'"
            alt="사업자 등록증"
            class="modal-image"
          />
        </div>

        <div class="modal-right">
          <p><strong>사업자 ID:</strong> {{ modalData?.ownerId }}</p>
          <p><strong>이름:</strong> {{ modalData?.ownerName }}</p>
<!--          <p><strong>이메일:</strong> {{ modalData?.email || '-' }}</p>-->

          <template v-if="modalData?.status !== 'PENDING'">
            <p><strong>상태:</strong>
              {{ modalData?.status === 'PENDING' ? '대기' : modalData?.status === 'ACCEPTED' ? '승인' : '거절' }}
            </p>
            <p><strong>처리일자:</strong> {{ modalData?.authorizedAt || '-' }}</p>
            <p><strong>거절 사유:</strong> {{ modalData?.rejectionReason || '-' }}</p>
          </template>

          <!-- 상태가 대기인 경우 처리 상태 선택 -->
          <template v-if="modalData?.status === 'PENDING'">
            <label class="modal-label">처리 상태:</label>
            <select v-model="decision" class="modal-select">
              <option value="">선택</option>
              <option value="ACCEPTED">승인</option>
              <option value="REJECTED">거절</option>
            </select>

            <label class="modal-label" v-if="decision === 'REJECTED'">거절 사유:</label>
            <input
              v-if="decision === 'REJECTED'"
              v-model="rejectReason"
              class="modal-input"
              placeholder="거절 사유 입력"
            />
          </template>
        </div>

        <template #footer>
          <AdminButton
            v-if="modalData?.status === 'PENDING'"
            type="approve"
            @click="handleDecision"
          >처리</AdminButton>
          <AdminButton type="secondary" @click="closeModal">닫기</AdminButton>
        </template>
      </AdminModal>
    </template>
  </AdminListTemplate>
</template>

<style scoped>
/* ========== 필터 영역 ========== */
.filter-wrapper {
  display: flex;
  margin-bottom: 12px;
  justify-content: space-between;
}

.filter-box,
.filter-fields {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  border: 0;
  padding: 0;
  margin: 0;
}

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

.select-box {
  margin-left: 12px;
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

.input-box {
  min-width: 160px;
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


/* ========== 모달 내용 박스 ========== */
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #e3e6ef;
  width: 700px;
  max-width: 90%;
}

.modal-title {
  display: block;
  font-size: 1.3em;
  font-weight: bold;
  unicode-bidi: isolate;
}


/* ========== 모달 레이아웃 ========== */
.modal-body {
  display: flex;
  gap: 24px;
  margin-top: 20px;
}

.modal-left,
.modal-right {
  flex: 1;
  display: flex;
}

.modal-left {
  justify-content: center;
  align-items: center;
}

.modal-left img {
  width: 240px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.modal-image {
  max-width: 100%;
  border-radius: 8px;
}

.modal-right {
  flex-direction: column;
  gap: 12px;
  padding-top: 10px;
}


/* ========== 모달 입력 영역 ========== */
.modal-label {
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
}

.modal-select,
.modal-input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  height: auto;
}


/* ========== 모달 푸터 버튼 ========== */
.modal-footer,
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

</style>
