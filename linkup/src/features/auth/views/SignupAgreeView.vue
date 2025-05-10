<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupFormStore } from '@/stores/signup.js';
import { showErrorToast } from '@/utill/toast.js';

const router = useRouter();
const store = useSignupFormStore();

const agreeAll = ref(false);

const agreeTerms = ref(store.form.termsOfServiceAgreed);
const agreePrivacy = ref(store.form.privacyPolicyAgreed);
const agreeMarketing = ref(store.form.marketingAgreed);

// 전체 체크 시 개별 항목도 함께 변경
const toggleAll = () => {
  agreeTerms.value = agreeAll.value;
  agreePrivacy.value = agreeAll.value;
  agreeMarketing.value = agreeAll.value;
};

// 개별 항목 중 하나라도 변경되면 전체 동의 상태 재계산
watch([agreeTerms, agreePrivacy, agreeMarketing], () => {
  agreeAll.value = agreeTerms.value && agreePrivacy.value && agreeMarketing.value;
});

// 다음 단계로 이동
const handleSubmit = () => {
  if (!agreeTerms.value || !agreePrivacy.value) {
    showErrorToast('이용 약관에 동의해주세요');
    return;
  }

  store.form.termsOfServiceAgreed = agreeTerms.value;
  store.form.privacyPolicyAgreed = agreePrivacy.value;
  store.form.marketingAgreed = agreeMarketing.value;

  router.push('/signup/personal');
};
</script>

<template>
  <section class="agreement-container" aria-labelledby="agreement-title">
    <h1 id="agreement-title" class="agreement-title">회원가입을 위해 약관에 동의해주세요</h1>

    <form class="agreement-form" @submit.prevent="handleSubmit">
      <!-- 전체 동의 -->
      <div class="agreement-all">
        <label class="agreement-label">
          <input
            type="checkbox"
            v-model="agreeAll"
            @change="toggleAll"
            class="agreement-checkbox"
          />
          <strong>전체 약관에 동의합니다</strong>
        </label>
      </div>

      <hr class="agreement-divider" />

      <!-- 필수 약관 -->
      <div class="agreement-item">
        <label class="agreement-label">
          <input type="checkbox" v-model="agreeTerms" class="agreement-checkbox" />
          <span>[필수] 이용약관 동의</span>
          <a href="#" class="agreement-link">보기</a>
        </label>
      </div>

      <div class="agreement-item">
        <label class="agreement-label">
          <input type="checkbox" v-model="agreePrivacy" class="agreement-checkbox" />
          <span>[필수] 개인정보 수집 및 이용 동의</span>
          <a href="#" class="agreement-link">보기</a>
        </label>
      </div>

      <!-- 선택 항목 -->
      <div class="agreement-item">
        <label class="agreement-label">
          <input type="checkbox" v-model="agreeMarketing" class="agreement-checkbox" />
          <span>[선택] 마케팅 정보 수신 동의</span>
          <a href="#" class="agreement-link">보기</a>
        </label>
      </div>

      <button type="submit" class="agreement-button">다음으로</button>
    </form>
  </section>
</template>

<style scoped>
.agreement-container {
  @apply w-full flex-1 bg-white flex flex-col justify-center h-full;
}

.agreement-title {
  @apply text-2xl font-bold  mb-8;
}

.agreement-form {
  @apply flex flex-col gap-6;
}

.agreement-all {
  @apply text-lg;
}

.agreement-item {
  @apply flex items-center justify-between text-sm;
}

.agreement-label {
  @apply flex items-center gap-3 text-gray-700;
}

.agreement-checkbox {
  @apply w-5 h-5;
}

.agreement-divider {
  @apply border-t border-gray-200;
}

.agreement-link {
  @apply text-sm text-blue-500 hover:underline;
}

.agreement-button {
  @apply mt-8 w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors;
}
</style>
