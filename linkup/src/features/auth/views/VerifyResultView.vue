<script setup>
import { defineProps } from 'vue';
import FullVertialCenterLayout from '@/components/layout/FullVertialCenterLayout.vue';

const props = defineProps({
  isSuccess: { type: Boolean, required: true },
});
</script>

<template>
  <FullVertialCenterLayout>
    <section class="verify-container">
      <header class="verify-header">
        <div class="verify-icon">
          {{ isSuccess ? '✅' : '❌' }}
        </div>
        <h1 class="verify-title">
          {{ isSuccess ? '이메일 인증 완료' : '이메일 인증 실패' }}
        </h1>
        <p class="verify-description">
          <template v-if="isSuccess">
            이메일 인증이 성공적으로 완료되었습니다.<br />
            이제 로그인하여 서비스를 이용해 주세요!
          </template>
          <template v-else>
            유효하지 않거나 만료된 링크입니다.<br />
            다시 시도하거나 지원팀에 문의해 주세요.
          </template>
        </p>
      </header>

      <nav class="button-group" aria-label="페이지 이동 버튼">
        <RouterLink to="/" class="button outline">홈으로 가기</RouterLink>
        <RouterLink to="/login" class="button primary">로그인하러 가기</RouterLink>
      </nav>
    </section>
  </FullVertialCenterLayout>
</template>

<style scoped>
.verify-container {
  @apply bg-white p-8  text-center w-full max-w-md;
}

.verify-header {
  @apply flex flex-col items-center gap-4 mb-8;
}

.verify-icon {
  @apply text-5xl;
}

.verify-title {
  @apply text-2xl font-bold text-gray-900;
}

.verify-description {
  @apply text-gray-600 text-base leading-relaxed;
}

.button-group {
  @apply flex flex-wrap justify-center gap-4;
}

.button {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-base transition;
}

.button.primary {
  @apply bg-primary-default text-white hover:bg-primary-hover;
}

.button.outline {
  @apply border-primary-default text-primary-default bg-white hover:bg-primary-active hover:text-white;
}
</style>
