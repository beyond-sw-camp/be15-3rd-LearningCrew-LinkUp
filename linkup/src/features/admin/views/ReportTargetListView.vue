<script setup>
import { reactive, ref } from 'vue'
import { format } from 'date-fns'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import ReportDetailModal from '@/features/admin/components/ReportDetailModal.vue'
import { fetchReportedTargetList, fetchTargetDetailById, penalizePost, penalizeComment, registerBlacklist } from '@/api/admin.js'

const pageTitle = '신고 대상별 목록 조회'

const filters = reactive({
  isActive: '',
  targetType: '',
  targetId: ''
})

const selectedRow = ref(null)
const reportRows = ref([])
const summaryInfo = ref([])

const detailHeaders = [
  { key: 'reportId', label: '신고 ID' },
  { key: 'reporterId', label: '신고자 ID' },
  { key: 'reporterName', label: '신고자 이름' },
  { key: 'reportType', label: '신고 유형' },
  { key: 'createdAt', label: '신고 일시' },
  { key: 'status', label: '처리 상태' }
]

const columns = [
  { key: 'targetType', label: '대상 유형' },
  { key: 'targetId', label: '대상 ID' },
  { key: 'reportCount', label: '신고 횟수' },
  {
    key: 'lastReportDate',
    label: '최근 신고일',
    format: v => {
      const date = new Date(v)
      return isNaN(date.getTime()) ? '-' : format(date, 'yyyy-MM-dd HH:mm')
    }
  },
  { key: 'isActive', label: '활성화 여부' },
  {
    key: 'action',
    label: '신고 내역',
    format: (_, __, row) => ({
      type: 'button',
      label: '보기',
      onClick: (actualRow) => openModal(actualRow)
    })
  }
]

async function fetchList({ page }) {
  try {
    const res = await fetchReportedTargetList({
      page,
      isActive: filters.isActive || null,
      targetType: filters.targetType || null,
      targetId: filters.targetId !== '' ? Number(filters.targetId) : null
    })
    return {
      data: res.data.targetList || [],
      totalPages: res.data.pagination?.totalPage || 1
    }
  } catch (e) {
    console.error('🚨 신고 대상 목록 조회 실패:', e)
    return { data: [], totalPages: 1 }
  }
}

async function openModal(row) {
  const fixedRow = {
    targetType: row?.targetType ?? null,
    targetId: Number(row?.targetId),
    reportCount: row?.reportCount ?? 0,
    lastReportDate: row?.lastReportDate ?? '',
    isActive: row?.isActive ?? 'N'
  }

  if (!fixedRow.targetType || isNaN(fixedRow.targetId)) {
    console.warn('❌ targetType 또는 targetId가 잘못됨:', fixedRow)
    return
  }

  try {
    const res = await fetchTargetDetailById(fixedRow.targetType, fixedRow.targetId)
    const reports = res.data.reportList || []

    selectedRow.value = fixedRow
    summaryInfo.value = [
      { label: '대상 유형', value: fixedRow.targetType },
      { label: '대상 ID', value: fixedRow.targetId },
      { label: '신고 횟수', value: fixedRow.reportCount },
      {
        label: '최근 신고일',
        value: fixedRow.lastReportDate
          ? format(new Date(fixedRow.lastReportDate), 'yyyy-MM-dd HH:mm')
          : '-'
      },
      { label: '활성화 여부', value: fixedRow.isActive }
    ]

    const statusMap = { 1: '처리중', 2: '완료', 3: '기각' }

    reportRows.value = reports.map(r => ({
      reportId: r.reportId,
      reporterId: r.reporterId,
      reporterName: r.reporterName,
      reportType: r.reportType,
      createdAt: format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm'),
      status: statusMap[r.statusId] || '-'
    }))
  } catch (e) {
    console.error('🚨 상세 정보 조회 실패:', e)
  }
}

async function handleSanction() {
  if (!selectedRow.value) return

  const { targetType, targetId } = selectedRow.value

  const reason = prompt(`제재 사유를 입력하세요 (대상 ID: ${targetId}, 유형: ${targetType})`)
  if (!reason) {
    alert('제재 사유는 필수입니다.')
    return
  }

  try {
    if (targetType === 'USER') {
      await registerBlacklist(targetId, reason)
    } else if (targetType === 'POST') {
      await penalizePost(targetId, reason)
    } else if (targetType === 'COMMENT') {
      await penalizeComment(targetId, reason)
    } else {
      await registerBlacklist(targetId, reason)
    }

    alert('제재 처리가 완료되었습니다.')
    selectedRow.value = null
  } catch (e) {
    console.error('🚨 제재 처리 실패:', e)
    alert('제재 처리 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <AdminListTemplate
    :fetchFn="fetchList"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="pageTitle"
    :enableModal="true"
  >
    <template #filters>
      <label class="filter-label" for="isActive">활성화 여부:</label>
      <select id="isActive" v-model="filters.isActive" class="select-box">
        <option value="">전체</option>
        <option value="Y">활성화</option>
        <option value="N">비활성화</option>
      </select>

      <label class="filter-label" for="targetType">대상 유형:</label>
      <select id="targetType" v-model="filters.targetType" class="select-box">
        <option value="">전체</option>
        <option value="USER">회원</option>
        <option value="POST">게시글</option>
        <option value="COMMENT">댓글</option>
      </select>

      <label class="filter-label sr-only" for="targetId">대상 ID</label>
      <input
        id="targetId"
        v-model="filters.targetId"
        type="text"
        inputmode="numeric"
        class="select-box id-input"
        placeholder="ID"
      />
    </template>

    <template #modal>
      <ReportDetailModal
        v-if="selectedRow"
        :model-value="true"
        @update:modelValue="selectedRow = null"
        title="신고 대상 상세 정보"
        description="해당 신고 대상에 대한 상세 신고 이력을 확인할 수 있습니다."
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
