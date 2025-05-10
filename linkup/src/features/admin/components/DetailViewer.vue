<script setup>
import AdminButton from '@/features/admin/components/AdminButton.vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '상세 보기'
  },
  description: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// 닫기 핸들러
const close = () => emit('update:modelValue', false)
</script>

<template>
  <div
    v-if="modelValue"
    class="modal detail-viewer"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
    @click.self="close"
  >
    <section class="modal-content">
      <!-- 타이틀 영역 -->
      <header class="modal-header">
        <slot name="title">
          <h2 id="modalTitle" class="modal-title">{{ title }}</h2>
          <p v-if="description" class="sub-text">{{ description }}</p>
        </slot>
      </header>

      <!-- 내용 영역 -->
      <section class="modal-section" aria-label="상세 내용 영역">
        <slot />
      </section>

      <!-- 푸터 영역 -->
      <footer class="modal-footer">
        <slot name="footer">
          <AdminButton type="secondary" @click="close">닫기</AdminButton>
        </slot>
      </footer>
    </section>
  </div>
</template>

<style scoped>
/* ===== 모달 오버레이 ===== */
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

/* ===== 모달 컨텐츠 박스 ===== */
.modal-content {
  background: #fff;
  border: 1px solid #e3e6ef;
  border-radius: 12px;
  padding: 40px;
  width: 700px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ===== 헤더 영역 ===== */
.modal-header .modal-title {
  font-size: 1.3em;
  font-weight: bold;
}

.sub-text {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
}

/* ===== 내용 영역 ===== */
.modal-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-section:last-child {
  border-bottom: none;
}

/* ===== 푸터 영역 ===== */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* ===== 재사용 정보 블록 ===== */
.section-title,
.report-title {
  font-size: 18px;
  font-weight: 600;
  color: #7d6fb3;
  margin: 20px 0 12px;
  padding-left: 10px;
  border-left: 4px solid #7d6fb3;
}

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

/* ===== 정보 항목 레이아웃 ===== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 32px;
  margin-bottom: 10px;
}

.info-item,
.info-report-item {
  display: flex;
}

.info-item {
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

/* ===== 신고 사유 박스 ===== */
.reason-box {
  background: #f9f9fb;
  border: 1px solid #e0e0e0;
  padding: 18px;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  line-height: 1.6;
}

</style>
