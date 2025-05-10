<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import ReportDetailModal from '@/features/admin/components/ReportDetailModal.vue'
import {
  fetchReporterUserList,
  fetchReporterUserDetail
} from '@/api/admin.js'

const pageTitle = '신고자 목록 조회'
const filters = ref({ reporterId: '' })
const selectedReporter = ref(null)
const summaryInfo = ref([])
const reportRows = ref([])

const detailHeaders = [
  { key: 'reportId', label: '신고 ID' },
  { key: 'targetMemberId', label: '피신고자 ID' },
  { key: 'targetName', label: '피신고자 이름' },
  { key: 'reportType', label: '신고 유형' },
  { key: 'createdAt', label: '신고 일시' },
  { key: 'status', label: '상태' }
]

const columns = [
  { key: 'memberId', label: '신고자 ID' },
  { key: 'memberName', label: '신고자 이름' },
  { key: 'reportCount', label: '신고 횟수' },
  {
    key: 'lastReportDate',
    label: '최근 신고일',
    format: v => format(new Date(v), 'yyyy-MM-dd HH:mm')
  },
  {
    key: 'detail',
    label: '신고 내역',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => openModal(row)
    })
  }
]

// 목록 조회 API
async function fetchReporterList({ page }) {
  try {
    const res = await fetchReporterUserList({
      reporterId: filters.value.reporterId || null,
      page
    })
    return {
      data: res.data.userList || [],
      totalPages: res.data.pagination?.totalPage || 1
    }
  } catch (e) {
    console.error('🚨 신고자 목록 로딩 실패:', e)
    return { data: [], totalPages: 1 }
  }
}

// 상세 조회
async function openModal(row) {
  try {
    const res = await fetchReporterUserDetail(row.memberId)
    const reports = res.data.reports || []

    selectedReporter.value = row
    summaryInfo.value = [
      { label: '신고자 ID', value: row.memberId },
      { label: '이름', value: row.memberName },
      { label: '신고 횟수', value: row.reportCount },
      { label: '최근 신고일', value: format(new Date(row.lastReportDate), 'yyyy-MM-dd HH:mm') }
    ]

    const statusMap = {
      1: '처리중',
      2: '완료',
      3: '기각'
    }

    reportRows.value = reports.map(r => ({
      reportId: r.reportId,
      targetMemberId: r.targetMemberId,
      targetName: r.targetName,
      reportType: r.reportType,
      createdAt: format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm'),
      status: statusMap[r.statusId] || '-'
    }))
  } catch (e) {
    console.error('🚨 신고자 상세 조회 실패:', e)
  }
}
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchReporterList"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="pageTitle"
    :enableModal="true"
  >
    <!-- 필터 영역 -->
    <template #filters>
      <label class="filter-label" for="reporterId">신고자 ID:</label>
      <input
        id="reporterId"
        v-model="filters.reporterId"
        class="select-box id-input"
        placeholder="ID"
        type="text"
        inputmode="numeric"
      />
    </template>

    <!-- 상세 모달 -->
    <template #modal>
      <ReportDetailModal
        v-if="selectedReporter"
        :model-value="true"
        @update:modelValue="selectedReporter = null"
        title="신고자 신고 내역"
        description="신고자의 상세 신고 기록을 확인할 수 있습니다."
        :summary="summaryInfo"
        :headers="detailHeaders"
        :rows="reportRows"
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


/* ========== 모달 컨텐츠 ========== */
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


/* ========== 모달 버튼 영역 ========== */
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


/* ========== 신고 요약 정보 ========== */
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
