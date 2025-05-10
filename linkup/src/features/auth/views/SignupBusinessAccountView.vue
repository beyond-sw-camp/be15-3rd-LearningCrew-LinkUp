<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupFormStore } from '@/stores/signup.js';
import { registerBusinessUser } from '@/api/user';
import { startLoading } from '@/composables/useLoadingBar.js';

const router = useRouter();
const store = useSignupFormStore();

// 폼 바인딩
const name = ref(store.form.name);
const businessRegistrationDocumentUrl = ref(store.form.businessRegistrationDocumentUrl);
const fileInput = ref(null);

// 파일 업로드 핸들러
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  businessRegistrationDocumentUrl.value = file.name;
};

// 회원가입 완료
const handleSubmit = async () => {
  try {
    store.form.name = name.value;
    store.form.businessRegistrationDocumentUrl = businessRegistrationDocumentUrl.value;

    const payload = {
      name: store.form.name,
      email: store.form.email,
      password: store.form.password,
      contactNumber: store.form.contactNumber,
      businessRegistrationDocumentUrl: store.form.businessRegistrationDocumentUrl,
    };

    startLoading();
    await registerBusinessUser(payload);

    await router.push('/email-verification');
  } catch (err) {
    console.error('회원가입 실패:', err);
  }
};
</script>

<template>
  <section class="signup-container" aria-labelledby="business-info-title">
    <!-- 단계 표시 -->
    <div class="signup-step-indicator">
      <span class="step">1</span>
      <span class="step-line"></span>
      <span class="step active">2</span>
    </div>

    <h1 id="business-info-title" class="signup-title">사업자 정보를 입력해주세요</h1>

    <form class="signup-form flex-1" @submit.prevent="handleSubmit">
      <!-- 이름 -->
      <div class="form-group">
        <label class="form-label">이름 <span class="required">*</span></label>
        <input v-model="name" type="text" class="form-input" required />
      </div>

      <!-- 등록증 업로드 -->
      <div class="form-group">
        <label class="form-label">사업자 등록증 <span class="required">*</span></label>
        <div class="upload-box" @click="fileInput?.click()">
          <span v-if="businessRegistrationDocumentUrl">{{ businessRegistrationDocumentUrl }}</span>
          <span v-else class="text-gray-400">+ 파일 업로드</span>
          <input
            type="file"
            ref="fileInput"
            accept="image/*,.pdf"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>

      <!-- 회원가입 버튼 -->
      <div class="form-group flex-1 flex flex-col justify-end">
        <button type="submit" class="signup-button">회원가입 완료</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.signup-container {
  @apply w-full max-w-md mx-auto bg-white p-10 flex flex-col min-h-[85vh];
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
  @apply flex flex-col gap-6;
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
.upload-box {
  @apply w-full h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer text-center;
}
.signup-button {
  @apply w-full py-3 bg-blue-500 text-white font-bold rounded-md text-base hover:bg-blue-700 transition-colors;
}
</style>
