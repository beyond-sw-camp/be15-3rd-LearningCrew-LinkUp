<script setup>
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';

const props = defineProps({
  isSuccess: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goLogin = () => {
  router.push('/login');
};
</script>

<template>
  <main class="signup-complete-page" aria-labelledby="complete-title">
    <section class="signup-container">
      <div class="success-icon" v-if="isSuccess">🎉</div>
      <div class="success-icon" v-else>❌</div>

      <h1 id="complete-title" class="signup-title">
        {{ isSuccess ? '가입이 완료되었습니다!' : '회원가입에 실패했습니다.' }}
      </h1>

      <p class="signup-description">
        {{
          isSuccess
            ? '환영합니다. 회원가입이 정상적으로 완료되었습니다. 이제 로그인을 통해 서비스를 이용하실 수 있습니다.'
            : '죄송합니다. 예기치 못한 오류로 인해 회원가입이 완료되지 않았습니다.'
        }}
      </p>

      <div class="button-group">
        <button class="button outline" @click="goHome">홈으로 가기</button>
        <button v-if="isSuccess" class="button primary" @click="goLogin">로그인하러 가기</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.signup-complete-page {
  @apply min-h-screen flex items-center justify-center bg-gray-100 px-4;
}

.signup-container {
  @apply text-center bg-white rounded-2xl p-10 shadow-lg max-w-lg w-full;
}

.success-icon {
  @apply text-6xl mb-5;
}

.signup-title {
  @apply text-2xl font-bold mb-2 text-gray-800;
}

.signup-description {
  @apply text-base text-gray-600 mb-6 leading-relaxed;
}

.button-group {
  @apply flex justify-center gap-4 flex-wrap;
}

.button {
  @apply px-6 py-3 rounded-lg text-base font-semibold transition-colors duration-200;
}

.button.primary {
  @apply bg-blue-500 text-white hover:bg-blue-700;
}

.button.outline {
  @apply border-2 border-blue-500 text-blue-500 bg-white hover:bg-blue-50;
}
</style>
