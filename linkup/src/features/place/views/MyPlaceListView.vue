<template>
  <div class="business-place-page">
    <SidebarMainLayout width="400px" sidebarClass="h-[calc(100vh-80px)]">
      <!-- 왼쪽: 장소 목록 -->
      <template #sidebar>
        <section class="sidebar-content">
          <PlaceList :places="places" @select="handleSelect" />
        </section>
      </template>

      <!-- 오른쪽: 지도 -->
      <template #main>
        <main class="map-area">
          <PlaceMap :places="places" @select="handleSelect" />
        </main>
      </template>
    </SidebarMainLayout>

    <!-- 모달: PlaceDetailOwner -->
    <Teleport to="body">
      <PlaceDetailOwner
        v-if="selectedPlace?.placeId"
        :place="{ ...selectedPlace }"
        @close="selectedPlace = null"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getPlacesByOwner } from '@/api/place';

import SidebarMainLayout from '@/components/layout/SidebarMainLayout.vue';
import PlaceList from '@/features/place/components/PlaceList.vue';
import PlaceMap from '@/features/place/components/PlaceMap.vue';
import PlaceDetailOwner from '@/features/place/components/PlaceDetailOwner.vue';

const authStore = useAuthStore();
const places = ref([]);
const selectedPlace = ref(null);

// 장소 클릭 시 모달 열기
function handleSelect(place) {
  selectedPlace.value = place;
}

// 토큰에서 ownerId 추출
function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return parseInt(payload.sub);
  } catch {
    return null;
  }
}

// 컴포넌트 마운트 시 장소 목록 조회
onMounted(async () => {
  const token = authStore.accessToken;
  const ownerId = getUserIdFromToken(token);

  if (!ownerId) {
    console.warn('유효한 사용자 ID 없음');
    return;
  }

  try {
    const { data } = await getPlacesByOwner(ownerId);
    places.value = data.data.place.map(p => ({
      ...p,
      name: p.placeName,
      image: p.imageUrl?.[0] || '',
      price: p.rentalCost,
    }));
  } catch (err) {
    console.error('[사업자 장소 목록 조회 실패]', err);
  }
});
</script>

<style scoped>
.business-place-page {
  @apply h-[calc(100vh-100px)];
}
.sidebar-content {
  @apply relative flex flex-col gap-4 h-full pt-[20px];
}
.map-area {
  @apply flex-1 h-full;
}
</style>
