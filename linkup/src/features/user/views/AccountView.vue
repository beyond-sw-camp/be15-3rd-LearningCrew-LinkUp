<script setup>
import { ref, onMounted } from 'vue';
import { getAccount, registerAccount, updateAccount } from '@/api/account';

const account = ref(null);
const isEditing = ref(false);
const isRegisterModalOpen = ref(false);

const form = ref({
  bankName: '',
  accountNumber: '',
  holderName: '',
});

const fetchAccount = async () => {
  try {
    const { data } = await getAccount();
    account.value = data?.data;
    if (account.value) {
      form.value = { ...account.value };
    }
  } catch {
    account.value = null;
  }
};

const handleRegister = async () => {
  await registerAccount(form.value);
  isRegisterModalOpen.value = false;
  await fetchAccount();
};

const handleUpdate = async () => {
  await updateAccount(form.value);
  isEditing.value = false;
  await fetchAccount();
};

const openRegisterModal = () => {
  form.value = { bankName: '', accountNumber: '', holderName: '' };
  isRegisterModalOpen.value = true;
};

onMounted(fetchAccount);
</script>

<template>
  <section class="account-wrapper">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">계좌 관리</h2>

    <!-- 계좌가 없을 때 -->
    <div v-if="!account" class="text-center">
      <p class="text-gray-500 mb-4">등록된 계좌가 없습니다.</p>
      <button @click="openRegisterModal" class="btn-primary">계좌 등록하기</button>
    </div>

    <!-- 계좌가 있을 때 -->
    <div v-else class="bg-white shadow-md rounded-xl p-6">
      <div v-if="!isEditing">
        <div class="text-gray-700 space-y-2">
          <p><strong>은행명:</strong> {{ account.bankName }}</p>
          <p><strong>계좌번호:</strong> {{ account.accountNumber }}</p>
          <p><strong>예금주:</strong> {{ account.holderName }}</p>
        </div>
        <button @click="isEditing = true" class="btn-primary mt-6">계좌 수정</button>
      </div>

      <form v-else @submit.prevent="handleUpdate" class="space-y-4 mt-4">
        <div class="form-group">
          <label>은행명</label>
          <input v-model="form.bankName" required />
        </div>
        <div class="form-group">
          <label>계좌번호</label>
          <input v-model="form.accountNumber" required />
        </div>
        <div class="form-group">
          <label>예금주명</label>
          <input v-model="form.holderName" required />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="btn-primary">수정 완료</button>
          <button type="button" @click="isEditing = false" class="btn-secondary">취소</button>
        </div>
      </form>
    </div>

    <!-- 등록 모달 -->
    <div v-if="isRegisterModalOpen" class="modal-backdrop">
      <div class="modal-content">
        <h3 class="text-lg font-bold text-gray-800 mb-4">계좌 등록</h3>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="form-group">
            <label>은행명</label>
            <input v-model="form.bankName" required />
          </div>
          <div class="form-group">
            <label>계좌번호</label>
            <input v-model="form.accountNumber" required />
          </div>
          <div class="form-group">
            <label>예금주명</label>
            <input v-model="form.holderName" required />
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="submit" class="btn-primary">등록</button>
            <button type="button" @click="isRegisterModalOpen = false" class="btn-secondary">
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.account-wrapper {
  @apply bg-white;
}

.form-group {
  @apply flex flex-col gap-1;
}

.form-group label {
  @apply text-sm font-medium text-gray-700;
}

.form-group input {
  @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition;
}

.btn-secondary {
  @apply bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition;
}

.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-xl shadow-lg p-6 w-full max-w-md;
}
</style>
