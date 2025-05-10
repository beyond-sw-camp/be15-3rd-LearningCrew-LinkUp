<script setup>
const emit = defineEmits(['close'])
</script>

<template>
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    @click.self="emit('close')"
  >
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<!--<style scoped>-->
<!--.modal-overlay {-->
<!--  position: fixed;-->
<!--  top: 0; left: 0; right: 0; bottom: 0;-->
<!--  background: rgba(0, 0, 0, 0.4);-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  z-index: 1000;-->
<!--}-->

<!--.modal-content {-->
<!--  background: #fff;-->
<!--  padding: 40px 30px;-->
<!--  border-radius: 20px;-->
<!--  width: 480px;-->
<!--  max-width: 90%;-->
<!--  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);-->
<!--}-->
<!--</style>-->