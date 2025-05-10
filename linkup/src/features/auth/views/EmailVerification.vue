<script setup>
import { useRouter } from 'vue-router';
import FullVertialCenterLayout from '@/components/layout/FullVertialCenterLayout.vue';

const router = useRouter();

const goToLogin = () => {
  router.push('/login'); // 로그인 페이지로 이동 (라우터 경로에 따라 조정)
};
</script>

<template>
  <FullVertialCenterLayout>
    <section class="verification-box">
      <h1 id="email-verification-title" class="title">이메일 인증을 완료해주세요</h1>
      <p class="description">
        회원가입이 완료되었습니다.<br />
        입력하신 이메일 주소로 인증 메일을 발송했어요.<br />
        인증을 완료하시면 서비스를 이용하실 수 있어요.
      </p>
      <button class="login-button" @click="goToLogin">로그인하러 가기</button>
    </section>
  </FullVertialCenterLayout>
</template>

<style scoped>
.verification-box {
  @apply max-w-md w-full p-8 bg-white  text-center;
}

.title {
  @apply text-2xl font-bold text-gray-800 mb-8;
}

.description {
  @apply text-gray-600 text-sm leading-relaxed mb-8;
}

.login-button {
  @apply bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors;
}
</style>
