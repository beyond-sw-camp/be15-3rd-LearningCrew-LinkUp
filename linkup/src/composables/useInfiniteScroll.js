// composables/useInfiniteScroll.js
import { ref } from 'vue';

export function useInfiniteScroll(fetchFn) {
  const items = ref([]);
  const page = ref(0);
  const size = ref(20);
  const hasNext = ref(true);
  const isLoading = ref(false);

  const load = async () => {
    if (isLoading.value || !hasNext.value) return;

    isLoading.value = true;
    try {
      const response = await fetchFn(page.value, size.value);
      const { content, last } = response.data.data;
      items.value.push(...content);
      hasNext.value = !last;
      page.value += 1;
    } catch (e) {
      console.error('무한스크롤 데이터 로드 실패', e);
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    items.value = [];
    page.value = 0;
    hasNext.value = true;
  };

  return {
    items,
    load,
    reset,
    hasNext,
    isLoading,
  };
}
