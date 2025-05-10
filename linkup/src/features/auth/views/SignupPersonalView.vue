<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupFormStore } from '@/stores/signup.js';
import { showErrorToast } from '@/utill/toast.js';

const router = useRouter();
const store = useSignupFormStore();

// 폼 입력값
const email = ref(store.form.email || '');
const password = ref(store.form.password || '');
const passwordConfirm = ref('');
const contactNumber = ref(store.form.contactNumber || '');

// 유효성 검사
const isFormValid = computed(() => {
  const emailValid = !!email.value && /\S+@\S+\.\S+/.test(email.value);
  const passwordValid = !!password.value && password.value.length >= 8;
  const confirmValid = !!passwordConfirm.value && password.value === passwordConfirm.value;
  return emailValid && passwordValid && confirmValid;
});

const saveFormToStore = () => {
  store.form.email = email.value;
  store.form.password = password.value;
  store.form.contactNumber = contactNumber.value;
};

// 이동
const goToUserSignup = () => {
  if (!isFormValid.value) return showErrorToast('입력값을 확인해주세요.');
  saveFormToStore();
  router.push('/signup/account/user');
};

const goToBusinessSignup = () => {
  if (!isFormValid.value) return showErrorToast('입력값을 확인해주세요.');
  saveFormToStore();
  router.push('/signup/account/business');
};
</script>

<template>
  <section class="signup-container" aria-labelledby="signup-title">
    <!-- 단계 표시 -->
    <div class="signup-step-indicator">
      <span class="step active">1</span>
      <span class="step-line"></span>
      <span class="step">2</span>
    </div>

    <h1 id="signup-title" class="signup-title">계정 정보를 입력해주세요</h1>

    <form class="signup-form" @submit.prevent>
      <!-- 이메일 -->
      <div class="form-group">
        <label for="email" class="form-label">이메일 <span class="required">*</span></label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          placeholder="example@email.com"
          class="form-input"
        />
      </div>

      <!-- 비밀번호 -->
      <div class="form-group">
        <label for="password" class="form-label">비밀번호 <span class="required">*</span></label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          placeholder="영문, 숫자, 특수문자 포함 8~20자"
          class="form-input"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="form-group">
        <label for="passwordConfirm" class="form-label"
          >비밀번호 확인 <span class="required">*</span></label
        >
        <input
          id="passwordConfirm"
          type="password"
          v-model="passwordConfirm"
          required
          placeholder="비밀번호를 다시 입력해주세요"
          class="form-input"
        />
      </div>

      <!-- 전화번호 -->
      <div class="form-group">
        <label for="contactNumber" class="form-label">전화번호</label>
        <input
          id="contactNumber"
          type="tel"
          v-model="contactNumber"
          placeholder="010-0000-0000"
          class="form-input"
        />
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <button
          type="button"
          class="signup-button outline"
          :disabled="!isFormValid"
          @click="goToUserSignup"
        >
          회원 계정 생성
        </button>
        <button
          type="button"
          class="signup-button primary"
          :disabled="!isFormValid"
          @click="goToBusinessSignup"
        >
          사업자 계정 생성
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.signup-container {
  @apply w-full max-w-md mx-auto bg-white flex flex-col justify-center;
}
.signup-step-indicator {
  @apply flex items-center justify-center mb-8;
}
.step {
  @apply w-9 h-9 rounded-full bg-gray-200 text-gray-500 font-bold flex items-center justify-center text-sm;
}
.step.active {
  @apply bg-blue-500 text-white;
}
.step-line {
  @apply w-10 h-0.5 bg-gray-200 mx-2;
}
.signup-title {
  @apply text-xl font-bold text-center mb-6;
}
.signup-form {
  @apply flex flex-col gap-5;
}
.form-group {
  @apply flex flex-col;
}
.form-label {
  @apply mb-2 font-medium text-gray-700 text-sm;
}
.required {
  @apply text-red-500 text-xs ml-1;
}
.form-input {
  @apply p-3 text-base border border-gray-300 rounded-md;
}
.button-group {
  @apply flex gap-4 mt-4;
}
.signup-button {
  @apply flex-1 py-3 text-base font-semibold rounded-md transition-colors;
}
.signup-button.primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
.signup-button.outline {
  @apply border-2 border-blue-500 text-blue-500 bg-white hover:bg-blue-50;
}
.signup-button:disabled {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed border-none;
}
</style>
