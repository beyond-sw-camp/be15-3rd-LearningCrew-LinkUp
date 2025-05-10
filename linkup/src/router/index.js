import { createRouter, createWebHistory } from 'vue-router';
import { mainRoutes } from '@/features/main/router.js';
import { adminRoutes } from '@/features/admin/router.js';
import { meetingRoutes } from '@/features/meeting/router.js';
import { placeRoutes } from '@/features/place/router.js';
import { communityRoute } from '@/features/community/router.js';
import { authRoutes } from '@/features/auth/router.js';
import { userRoutes } from '@/features/user/router.js';
import { useAuthStore } from '@/stores/auth.js';
import { tossRoutes } from '@/features/point/router.js';
import { showErrorToast } from '@/utill/toast.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...mainRoutes,
    ...adminRoutes,
    ...authRoutes,
    ...userRoutes,
    ...meetingRoutes,
    ...placeRoutes,
    ...communityRoute,
    ...tossRoutes,
  ],
});

// 전역 가드
router.beforeEach((to) => {
  const authStore = useAuthStore();

  /* 인증이 필요한 서비스인데 인증이 안되어 있는 경우 login으로 이동*/
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  /* 로그인 되어 있는데 Login 및 signup으로 이동시 메인으로 이동 */
  if ((to.name === 'login' || to.name === 'signup') && authStore.isAuthenticated) {
    return { name: 'main' };
  }

  /* admin 권한 체크 */
  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated || authStore.userRole !== 'ADMIN') {
      showErrorToast('관리자만 접근할 수 있습니다.');
    }
  }

  /* Businesss 권한 체크 */
  if (
    to.name === 'PlaceRegisterStep1' ||
    to.name === 'PlaceRegisterStep2' ||
    to.name === 'PlaceRegisterStep3'
  ) {
    if (!authStore.isAuthenticated || authStore.userRole !== 'BUSINESS') {
      showErrorToast('관리자만 접근할 수 있습니다.');
    }
  }

  /* 비밀번호 재설정 및 계정 복구 가드 */
  if (
    (to.name === 'reset-password-link' ||
      to.name === 'reset-password' ||
      to.name === 'recover-account') &&
    authStore.isAuthenticated
  ) {
    return { name: 'main' };
  }
});

export default router;
