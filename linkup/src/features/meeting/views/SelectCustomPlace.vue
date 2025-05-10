<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router';
import MapDisplay from '@/components/common/MapDisplay.vue'
import SidebarMainLayout from '@/components/layout/SidebarMainLayout.vue';

const router = useRouter();

const latitude = ref(null);
const longitude = ref(null);

// const customPlaceAddress

function goToCreate() {
  router.push({name: "CreateMeetingStep1Custom",
    query: {
      latitude: latitude,
      longitude: longitude
    }});

}
</script>

<template>
  <SidebarMainLayout width="500px">
    <!-- 사이드바 -->
    <template #sidebar>
      <div class="filter-toggle-wrap" ref="filterWrap">
        위도: <input type="number" v-model="latitude" class="input-box" readonly/>
        경도: <input type="number" v-model="longitude" class="input-box" readonly/>
        <button class="btn accept" @click="goToCreate">선택</button>
      </div>

      <!--      &lt;!&ndash; 모임 카드 리스트 &ndash;&gt;-->
      <!--      <MeetingCard v-for="meeting in meetings" :key="meeting.id" :meeting="meeting" />-->
    </template>

    <!-- 지도 -->
    <template #main>
      <!--      <MapDisplay :items="meetings" mapType="meeting" />-->
  </template>
  </SidebarMainLayout>
</template>


<style scoped>
.sidebar {
  width: 500px;
}

.container {
  display: flex;
  flex-direction: row;
}

.filter-toggle-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.filter-toggle-btn {
  max-height: 35px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}
.filter-toggle-btn:hover {
  background-color: #dde4f3;
}

.sport-filter-bar {
  background: #f8f9fb;
  padding: 14px 20px;
  overflow-x: auto;
  white-space: nowrap;
  border-bottom: 1px solid #e0e0e0;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #d0d7de transparent; /* Firefox */
}

.btn {
  padding: 6px 10px;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn.accept {
  background-color: #5790FF;
  color: #fff;
}

.btn.accept:hover {
  background-color: #3a6edc;
}

.filter-item input[type="text"] {
  flex: 1;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 10px;
  border: 1.5px solid #dcdfe5;
  background: #fff;
}

.input-box {
  width: 100%;
  padding: 12px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #ffffff;
}
</style>
