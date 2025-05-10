export const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/features/auth/views/SignupView.vue'),
    children: [
      {
        path: 'agree',
        name: 'signup-agree',
        component: () => import('@/features/auth/views/SignupAgreeView.vue'),
      },
      {
        path: 'personal',
        name: 'signup-personal',
        component: () => import('@/features/auth/views/SignupPersonalView.vue'),
      },
      {
        path: 'account/user',
        name: 'signup-user-account',
        component: () => import('@/features/auth/views/SignupUserAccountView.vue'),
      },
      {
        path: 'account/business',
        name: 'signup-business-account',
        component: () => import('@/features/auth/views/SignupBusinessAccountView.vue'),
      },
      {
        path: 'complete',
        name: 'signup-complete-account',
        component: () => import('@/features/auth/views/SignupCompleteView.vue'),
        props: (route) => ({ isSuccess: route.query.success === 'true' }),
      },
    ],
  },
  {
    path: '/password/reset',
    name: 'reset-password-link',
    component: () => import('@/features/auth/views/ResetPasswordView.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/features/auth/views/ResetPasswordFormView.vue'),
  },
  {
    path: '/recover',
    name: 'recover-account',
    component: () => import('@/features/auth/views/RecoverAccountView.vue'),
  },
  {
    path: '/email-verification',
    name: 'email-verification',
    component: () => import('@/features/auth/views/EmailVerification.vue'),
  },
  {
    path: '/verify-result',
    name: 'email-verify-result',
    component: () => import('@/features/auth/views/VerifyResultView.vue'),
    props: (route) => ({ isSuccess: route.query.success === 'true' }), // 쿼리 파라미터로 전달받은 success 여부를 props로 전달
  },
];
