<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import AdminListTemplate from '@/features/admin/components/AdminListTemplate.vue'
import DetailViewer from '@/features/admin/components/DetailViewer.vue'
import AdminButton from '@/features/admin/components/AdminButton.vue'
import {
  fetchReportList,
  fetchReportDetail,
  fetchReportTypes,
  acceptReport,
  rejectReport
} from '@/api/admin.js'

const props = defineProps({ pageTitle: String })

// 필터 상태
const filters = ref({ statusId: '', reportTypeId: '' })
const selected = ref(null)
const reportTypes = ref([])

// 상태 정보
const STATUS_OPTIONS = [
  { id: 1, label: '처리중' },
  { id: 2, label: '완료' },
  { id: 3, label: '기각' }
]

const idToStatus = Object.fromEntries(STATUS_OPTIONS.map(s => [s.id, s.label]))

// 신고 유형 불러오기
onMounted(async () => {
  try {
    const res = await fetchReportTypes()
    reportTypes.value = res.data.map(type => ({
      reportTypeId: type.id,
      reportType: type.name
    }))
  } catch (e) {
    reportTypes.value = []
  }
})

// 신고 목록 불러오기
async function loadReportList({ page, reportTypeId, statusId }) {
  try {
    const res = await fetchReportList({
      reportTypeId: reportTypeId || undefined,
      statusId: statusId || undefined,
      page
    })

    const list = (res.data.reports || []).map(r => ({
      ...r,
      status: idToStatus[r.statusId] ?? '-'
    }))

    return {
      data: list,
      totalPages: res.data.pagination?.totalPage || 1
    }
  } catch (e) {
    return { data: [], totalPages: 1 }
  }
}

// 상세 정보 열기
async function openDetail(row) {
  try {
    const res = await fetchReportDetail(row.reportId)
    selected.value = {
      ...res.data,
      status: idToStatus[res.data.statusId] ?? '-'
    }
  } catch {}
}

// 제재 처리
async function handleSanction(action) {
  if (!selected.value) return
  try {
    const reportId = selected.value.reportId
    if (action === 'REJECTED') {
      await rejectReport(reportId)
    } else if (action === 'APPROVED') {
      await acceptReport(reportId)
    }
    selected.value = null
  } catch {}
}

// 테이블 컬럼 정의
const columns = [
  { key: 'reportId', label: '신고 ID' },
  { key: 'reporterMemberId', label: '신고자 ID' },
  { key: 'reporterName', label: '신고자 이름' },
  { key: 'targetMemberId', label: '피신고자 ID' },
  { key: 'targetName', label: '피신고자 이름' },
  { key: 'reportType', label: '신고 유형' },
  { key: 'status', label: '상태' },
  {
    key: 'createdAt',
    label: '신고 일시',
    format: v => format(new Date(v), 'yyyy-MM-dd HH:mm')
  },
  {
    key: 'detail',
    label: '상세',
    format: (_, row) => ({
      type: 'button',
      label: '보기',
      onClick: () => openDetail(row),
      ariaLabel: '신고 상세 보기'
    })
  }
]
</script>

<template>
  <AdminListTemplate
    :fetchFn="loadReportList"
    :columns="columns"
    :initFilters="filters"
    :pageTitle="props.pageTitle"
    :enableModal="true"
  >
    <!--필터 영역 -->
    <template #filters="{ filters }">
      <label class="filter-label" for="status-filter">상태:</label>
      <select
        id="status-filter"
        v-model="filters.statusId"
        class="select-box"
        aria-label="상태 필터"
      >
        <option value="">전체</option>
        <option v-for="s in STATUS_OPTIONS" :key="s.id" :value="s.id">{{ s.label }}</option>
      </select>

      <label class="filter-label" for="type-filter">신고 유형:</label>
      <select
        id="type-filter"
        v-model="filters.reportTypeId"
        class="select-box"
        aria-label="신고 유형 필터"
      >
        <option value="">전체</option>
        <option v-for="type in reportTypes" :key="type.reportTypeId" :value="type.reportTypeId">
          {{ type.reportType }}
        </option>
      </select>
    </template>

    <!--상세 모달 -->
    <template #modal>
      <DetailViewer
        v-if="selected"
        :model-value="true"
        @update:modelValue="() => (selected = null)"
        title="신고 상세 정보"
        description="신고 대상과 사유를 확인하고 후속 조치를 진행할 수 있습니다."
      >
        <template #default>
          <section class="modal-section" aria-labelledby="section1">
            <h3 id="section1" class="section-title">신고자 / 피신고자</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">신고자</span>
                <span class="value">{{ selected.reporterMemberId }} / {{ selected.reporterName }}</span>
              </div>
              <div class="info-item">
                <span class="label">피신고자</span>
                <span class="value">{{ selected.targetMemberId }} / {{ selected.targetName }}</span>
              </div>
            </div>
          </section>

          <section class="modal-section" aria-labelledby="section2">
            <h3 id="section2" class="section-title">신고 정보</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">신고 유형</span>
                <span class="value">{{ selected.reportType }}</span>
              </div>
              <div class="info-item">
                <span class="label">상태</span>
                <span class="value">{{ selected.status }}</span>
              </div>
              <div class="info-item">
                <span class="label">신고 일시</span>
                <span class="value">{{ format(new Date(selected.createdAt), 'yyyy-MM-dd HH:mm') }}</span>
              </div>
              <div class="info-item" v-if="selected.postId">
                <span class="label">게시글 ID</span>
                <span class="value">{{ selected.postId }}</span>
              </div>
              <div class="info-item" v-if="selected.commentId">
                <span class="label">댓글 ID</span>
                <span class="value">{{ selected.commentId }}</span>
              </div>
            </div>
          </section>

          <section class="modal-section" aria-labelledby="section3">
            <h3 id="section3" class="section-title">신고 사유</h3>
            <div class="reason-box">{{ selected.reason }}</div>
          </section>
        </template>

        <template #footer>
          <AdminButton type="reject" @click="() => handleSanction('APPROVED')">제재 처리</AdminButton>
          <AdminButton type="approve" @click="() => handleSanction('REJECTED')">허위 신고 처리</AdminButton>
          <AdminButton type="secondary" @click="() => (selected = null)">닫기</AdminButton>
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


/* ========== 정보 그리드 ========== */
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
