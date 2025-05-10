import './assets/css/index.css';
import 'pretendard/dist/web/static/pretendard.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth.js';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);

  /* 새로고침시 accessToken 재할당 */
  const authStore = useAuthStore();
  authStore.clearAuth();

  try {
    await authStore.refresh();
  } catch (e) {}
  app.use(router);
  app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
  });

  app.mount('#app');
}

bootstrap();
