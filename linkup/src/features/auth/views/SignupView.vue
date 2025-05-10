<script setup>
import DefaultMainLayout from '@/components/layout/DefaultMainLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { useSignupFormStore } from '@/stores/signup.js';

const route = useRoute();
const router = useRouter();
const store = useSignupFormStore();

// 새로고침이나 진입 시점 확인
if (route.name !== 'signup-agree') {
  // 현재 경로가 첫 단계가 아니라면 초기화 후 첫 단계로 리다이렉트
  store.resetForm();
  router.replace({ name: 'signup-agree' });
}
</script>

<template>
  <DefaultMainLayout main-class="w-[500px]">
    <RouterView />
  </DefaultMainLayout>
</template>

<style scoped></style>
