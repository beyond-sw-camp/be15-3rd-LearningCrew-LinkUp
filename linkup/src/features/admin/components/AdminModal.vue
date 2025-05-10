<!-- src/features/admin/components/AdminModal.vue -->
<script setup>
import AdminButton from '@/features/admin/components/AdminButton.vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 닫기 동작 실행
const close = () => emit('update:modelValue', false)
</script>

<template>
  <!-- 모달 외부 클릭 시 닫기 -->
  <div
    v-if="modelValue"
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
    @click.self="close"
  >
    <section class="modal-content" aria-describedby="modalContent">
      <!-- 모달 헤더 -->
      <header class="modal-header">
        <slot name="title">
          <h2 class="modal-title" id="modalTitle">상세 보기</h2>
        </slot>
      </header>

      <!-- 모달 본문 -->
      <section id="modalContent" class="modal-body" aria-label="상세 정보">
        <slot />
      </section>

      <!-- 모달 푸터 -->
      <footer class="modal-footer">
        <slot name="footer">
          <AdminButton type="secondary" @click="close">닫기</AdminButton>
        </slot>
      </footer>
    </section>
  </div>
</template>

<style scoped>
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
 .modal-header {
   margin-bottom: 16px;
 }

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #e3e6ef;
  width: 700px;
  max-width: 90%;
}

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

.modal-right {
  flex-direction: column;
  gap: 12px;
  padding-top: 10px;
}

.modal-title {
  display: block;
  font-size: 1.3em;
  font-weight: bold;
  unicode-bidi: isolate;
}

.modal-label {
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
}

.modal-image {
  max-width: 100%;
  border-radius: 8px;
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

.modal-footer,
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
