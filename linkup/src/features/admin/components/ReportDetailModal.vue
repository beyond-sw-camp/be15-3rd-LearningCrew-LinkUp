<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '상세 정보' },
  description: { type: String, default: '' },
  summary: { type: Array, default: () => [] }, // [{ label, value }]
  headers: { type: Array, required: true },    // [{ key, label }]
  rows: { type: Array, default: () => [] },
  showActionButton: { type: Boolean, default: false },
  actionLabel: { type: String, default: '처리' }
})

const emit = defineEmits(['update:modelValue', 'action'])
const close = () => emit('update:modelValue', false)
</script>

<template>
  <div
    v-if="modelValue"
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @click.self="close"
  >
    <section class="modal-report">
      <!-- 헤더 -->
      <header>
        <h2 id="modal-title" class="modal-title">{{ title }}</h2>
        <p v-if="description" class="sub-text">{{ description }}</p>
      </header>

      <!-- 요약 정보 -->
      <section class="modal-report-section" aria-labelledby="summary-section">
        <h3 id="summary-section" class="sr-only">요약 정보</h3>
        <div class="report-detail-grid">
          <div
            class="info-report-item"
            v-for="item in summary"
            :key="item.label"
          >
            <span class="label"><strong>{{ item.label }}:</strong></span>
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
      </section>

      <!-- 신고 목록 테이블 -->
      <section class="modal-section" aria-labelledby="report-table-title">
        <h3 id="report-table-title" class="report-title">신고 목록</h3>
        <table class="table" role="table">
          <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" scope="col">
              {{ header.label }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, idx) in rows" :key="idx">
            <td v-for="header in headers" :key="header.key">
              {{ row[header.key] ?? '-' }}
            </td>
          </tr>
          </tbody>
        </table>
      </section>

      <!-- 하단 버튼 -->
      <footer class="modal-buttons">
        <button
          v-if="showActionButton"
          class="btn btn-reject"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </button>
        <button class="btn btn-secondary" @click="close">닫기</button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
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
.modal-report {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  width: 850px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ========== 헤더 ========== */
.modal-title {
  font-size: 1.3em;
  font-weight: bold;
}

.sub-text {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
}

/* ========== 본문 영역 섹션 ========== */
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

/* ========== 섹션 제목 ========== */
.section-title,
.report-title {
  font-size: 18px;
  font-weight: 600;
  color: #7d6fb3;
  margin: 20px 0 12px;
  padding-left: 10px;
  border-left: 4px solid #7d6fb3;
}

/* ========== 요약 정보 그리드 ========== */
.report-detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  font-size: 15px;
  color: #555;
  margin-bottom: 20px;
}

.info-report-item {
  display: flex;
  flex-direction: row;
}

.info-report-item .label {
  margin-right: 5px;
}

/* ========== 표 ========== */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 32px;
}

.table th,
.table td {
  padding: 14px 12px;
  text-align: left;
  vertical-align: middle;
}

.table thead th {
  background-color: #f5f3fa;
  border-bottom: 1px solid #e3e1ed;
  font-weight: 500;
  color: #444;
}

.table tbody td {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

/* ========== 하단 버튼 영역 ========== */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* ========== 정보 그리드 공통 ========== */
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

/* ========== 스크린리더 전용 숨김 텍스트 ========== */
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
