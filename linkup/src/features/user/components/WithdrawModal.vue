<script setup>
import { ref } from 'vue';
import { withdrawUser } from '@/api/user';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const withdraw = async () => {
  try {
    await withdrawUser({ password: password.value });
    await authStore.logout();
    await router.push('/login');
  } catch (e) {
    console.error('회원탈퇴 실패', e);
  }
};
</script>

<template>
  <teleport to="body">
    <div class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">정말 탈퇴 하시겠습니까?</h3>
        <p class="modal-description">탈퇴 후에는 계정 정보와 활동 내역이 모두 삭제됩니다.</p>
        <input v-model="password" type="password" placeholder="비밀번호 입력" class="modal-input" />
        <div class="modal-actions">
          <button @click="$emit('cancel')" class="cancel-button">취소</button>
          <button @click="withdraw" class="confirm-button">탈퇴하기</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center;
}

.modal {
  @apply bg-white rounded-xl p-6 w-full max-w-sm shadow-xl;
}

.modal-title {
  @apply text-lg font-bold mb-2 text-center;
}

.modal-description {
  @apply text-sm text-gray-500 text-center mb-4;
}

.modal-input {
  @apply border border-gray-300 w-full rounded px-3 py-2 mb-4;
}

.modal-actions {
  @apply flex justify-center gap-3;
}

.cancel-button {
  @apply bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500;
}

.confirm-button {
  @apply bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700;
}
</style>
