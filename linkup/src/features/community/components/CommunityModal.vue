<template>
  <div class="popup-overlay" @click.self="$emit('close')">
    <div class="popup">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button @click="$emit('confirm')">확인</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
});

defineEmits(['confirm', 'close']);
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup {
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
}

.popup h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.popup button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #5790ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.popup button:hover {
  background-color: #3548d3;
}
</style>
