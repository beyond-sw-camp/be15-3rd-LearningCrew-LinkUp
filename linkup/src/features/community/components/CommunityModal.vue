<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-box">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">

        <button v-if="cancelText !== null" class="cancel-btn" @click="$emit('close')">
          {{ cancelText }}
        </button>


        <button class="confirm-btn" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  cancelText: {
    type: String,
    default: '취소',
  },
  confirmText: {
    type: String,
    default: '확인',
  },
});

defineEmits(['confirm', 'close']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-message {
  font-size: 14px;
  color: #555;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.confirm-btn {
  background-color: #4763f3;
  color: white;
}
</style>
