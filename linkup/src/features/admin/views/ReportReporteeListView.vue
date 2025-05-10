<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import ReportDetailModal from '@/features/admin/components/ReportDetailModal.vue'
import { fetchReporteeUserList, fetchReporteeUserDetail, registerBlacklist } from '@/api/admin.js'

const pageTitle = '피신고자 목록 조회'

const filters = ref({
  reporteeId: ''
})

const selectedRow = ref(null)
const reportRows = ref([])
const summaryInfo = ref([])

// 테이블 헤더 (key-label 형식)
const detailHeaders = [
  { key: 'reportId', label: '신고 ID' },
  { key: 'reporterMemberId', label: '신고자 ID' },
  { key: 'reporterName', label: '신고자 이름' },
  { key: 'reportType', label: '신고 유형' },
  { key: 'createdAt', label: '신고 일시' },
  { key: 'statusId', label: '처리 상태' }
]

// 목록 API 호출
const fetchList = async ({ page }) => {
  try {
    const res = await fetchReporteeUserList({
      reporteeId: filters.value.reporteeId || null,
      page
    })
    return {
      data: res.data.userList || [],
      totalPages: res.data.pagination?.totalPage || 1
    }
  } catch (e) {
    console.error('🚨 피신자 목록 조회 실패:', e)
    return { data: [], totalPages: 1 }
  }
}

// 상세 API 호출
async function openModal(row) {
  try {
    const res = await fetchReporteeUserDetail(row.memberId)
    const reports = res.data.reports || []

    selectedRow.value = row
    summaryInfo.value = [
      { label: '피신고자 ID', value: row.memberId },
      { label: '피신고자 이름', value: row.memberName },
      { label: '신고 점수', value: row.reportScore },
      { label: '신고 횟수', value: row.reportCount }
    ]
    const statusMap = {
      1: '처리중',
      2: '완료',
      3: '기각'
    }

    reportRows.value = reports.map(r => ({
      reportId: r.reportId,
      reporterMemberId: r.reporterMemberId,
      reporterName: r.reporterName,
      reportType: r.reportType,
      createdAt: format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm'),
      statusId: statusMap[r.statusId] || '-'
    }))
  } catch (e) {
    console.error('🚨 상세 조회 실패:', e)
  }
}

async function handleSanction() {
  if (!selectedRow.value) return

  const { memberId, memberName } = selectedRow.value

  // 제재 사유 입력 받기
  const reason = prompt(`블랙리스트 사유를 입력하세요 (대상: ${memberName})`)
  if (!reason) {
    alert('사유는 필수입니다.')
    return
  }

  try {
    await registerBlacklist(memberId, reason)
    alert('블랙리스트 등록이 완료되었습니다.')
    selectedRow.value = null
  } catch (e) {
    console.error('🚨 블랙리스트 등록 실패:', e)
    alert('블랙리스트 등록 중 오류가 발생했습니다.')
  }
}

const columns = [
  { key: 'memberId', label: '피신고자 ID' },
  { key: 'memberName', label: '피신고자 이름' },
  { key: 'reportScore', label: '누적 신고 점수' },
  { key: 'reportCount', label: '누적 신고 횟수' },
  {
    key: 'action',
    label: '신고 내역',
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
    <!-- 필터 영역 -->
    <template #filters>
      <label class="filter-label" for="reporteeId">피신고자 ID:</label>
      <input
        id="reporteeId"
        v-model="filters.reporteeId"
        class="select-box id-input"
        placeholder="ID"
        type="text"
        inputmode="numeric"
      />
    </template>

    <!-- 상세 모달 -->
    <template #modal>
      <ReportDetailModal
        v-if="selectedRow"
        :model-value="true"
        @update:modelValue="selectedRow = null"
        title="피신고자 상세 정보"
        description="해당 피신고자에 대한 신고 이력을 확인할 수 있습니다."
        :summary="summaryInfo"
        :headers="detailHeaders"
        :rows="reportRows"
        :showActionButton="true"
        action-label="제재 처리"
        @action="handleSanction"
      />
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


/* ========== 모달 본문 ========== */
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


/* ========== 모달 하단 버튼 ========== */
.modal-footer,
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}


/* ========== 섹션 타이틀 ========== */
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


/* ========== 신고 요약 정보 그리드 ========== */
.report-detail-grid {
  display: flex;
  gap: 30px;
  font-size: 15px;
  margin-bottom: 20px;
  color: #555;
}

.report-detail-grid span {
  margin-right: 5px;
}


/* ========== 상세 정보 그리드 ========== */
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


/* ========== 신고 사유 박스 ========== */
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
