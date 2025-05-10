<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { format } from 'date-fns'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import {
  fetchBlacklist,
  fetchBlacklistDetail,
  unblockBlacklist
} from '@/api/admin.js'
import AdminButton from '@/features/admin/components/AdminButton.vue';

// DetailViewer lazy import
const DetailViewer = defineAsyncComponent(() =>
  import('@/features/admin/components/DetailViewer.vue')
)

const pageTitle = '블랙리스트 조회'

// 필터 상태 (v-model 바인딩 대상)
const filters = ref({ userId: '' })

// 상세 정보
const selected = ref(null)

// 날짜 포맷
const createdAtFormatted = computed(() =>
  selected.value?.createdAt ? format(new Date(selected.value.createdAt), 'yyyy-MM-dd HH:mm') : ''
)

// 목록 API
const fetchList = async ({ page, userId }) => {
  try {
    const res = await fetchBlacklist({ memberId: userId, page })
    return {
      data: res.data.blacklists || [],
      totalPages: res.data.pagination?.totalPage || 1
    }
  } catch {
    return { data: [], totalPages: 1 }
  }
}

// 상세 조회
const openModal = async (row) => {
  try {
    const res = await fetchBlacklistDetail(row.memberId)
    selected.value = res.data
  } catch {
    selected.value = null
  }
}

// 해제
const handleUnblock = async () => {
  try {
    await unblockBlacklist(selected.value.memberId)
    selected.value = null
  } catch {}
}

// 모달 닫기
const closeModal = () => {
  selected.value = null
}

// 테이블 컬럼
const columns = [
  { key: 'memberId', label: '사용자 ID' },
  { key: 'userName', label: '사용자 이름' },
  { key: 'reason', label: '사유' },
  {
    key: 'createdAt',
    label: '등록 일시',
    format: v => format(new Date(v), 'yyyy-MM-dd HH:mm')
  },
  {
    key: 'action',
    label: '상세',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => openModal(row)
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
      <label class="filter-label">
        사용자 ID:
        <input
          v-model="filters.userId"
          class="select-box id-input"
          placeholder="ID"
        />
      </label>
    </template>

    <template #modal>
      <DetailViewer
        v-if="selected"
        :model-value="true"
        @update:modelValue="closeModal"
        title="블랙리스트 상세 정보"
        description="블랙리스트 대상의 상세 정보를 확인하고 후속 조치를 진행할 수 있습니다."
      >
        <template #default>
          <section class="modal-section">
            <h3 class="section-title">사용자 정보</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">사용자 ID</span>
                <span class="value">{{ selected.memberId }}</span>
              </div>
              <div class="info-item">
                <span class="label">이름</span>
                <span class="value">{{ selected.userName }}</span>
              </div>
            </div>

            <section class="modal-section">
              <h3 class="section-title">블랙리스트 정보</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">등록 일시</span>
                  <span class="value">{{ createdAtFormatted }}</span>
                </div>
              </div>
            </section>

            <section class="modal-section">
              <h3 class="section-title">사유</h3>
              <div class="reason-box">{{ selected.reason }}</div>
            </section>
          </section>
        </template>

        <template #footer>
          <AdminButton type="reject" @click="handleUnblock">블랙리스트 해제</AdminButton>
          <AdminButton type="secondary" @click="closeModal">닫기</AdminButton>
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

input[type="text"]:focus,
select:focus {
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

/* ========== 모달 구조 섹션 ========== */
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

/* ========== 모달 하단 버튼 ========== */
.modal-footer,
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* ========== 제목 및 텍스트 ========== */
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

/* ========== 정보 블록 그리드 ========== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 32px;
  margin-bottom: 10px;
}

.info-item,
.info-report-item {
  display: flex;
  flex-direction: column;
}

.info-report-item {
  flex-direction: row;
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
