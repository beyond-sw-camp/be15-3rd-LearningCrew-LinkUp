<script setup>

import { onMounted, ref } from 'vue';
import api from '@/api/axios.js';
import { useAuthStore } from '@/stores/auth.js';

const auth = useAuthStore();

const meetings = ref([]);

// meetings.value = [{
//   meetingId: 1,
//   meetingTitle: "제목",
//   placeName: "종합운동장",
//   statusId: 1
// }
// ];

const isLoading = ref(true);

onMounted(async() => {
  try {
    const userId = auth.userId;
    const response = await api.get(`common-service/meetings/user/${userId}/created`)
    meetings.value = response.data.data.meetings;
  } catch (e) {
    console.error('개설 모임 조회 실패', e);
  } finally {
    isLoading.value = false;
  }
})

const statusName = (id) => {
  switch(id) {
    case 1:
      return '모집중';
    case 2:
      return '최소 인원 모집 완료';
    case 3:
      return '모집 완료';
    case 4:
      return '모집 취소';
    case 5:
      return '모임 진행 완료';
  }
}

const emits = defineEmits(['close', 'select']);
</script>

<template>
  <template v-if="isLoading">
    로딩중
  </template>
  <template v-else>
  <div class="assignment-modal">
    <div class="modal-box">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <img src="@/assets/icons/meeting_and_place/sidebar-created_meetings.svg" alt="개설 모임 목록" class="icon-img"/>
        <h2>개설 모임 목록</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="assignment-list">
        <!-- 예시 카드 -->
        <div class="assignment-card"
             v-for="meeting in meetings"
             :key="meeting.meetingId"
             @click="$emit('select', meeting)"
        >
          <img src="https://cdn.pixabay.com/photo/2019/03/10/14/04/table-tennis-4046278_640.jpg" alt="썸네일" class="assignment-thumb" />
          <div class="assignment-content">
            <div class="assignment-title"> {{meeting.meetingTitle}} </div>
            <div class="assignment-address"> {{ meeting.placeName || meeting.customPlaceAddress }} </div>
          </div>
          <div class="assignment-status"> {{ statusName(meeting.statusId) }} </div>
        </div>

      </div>

    </div>
  </div>
  </template>
</template>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
}

.modal-header .icon-img {
  width: 28px;
  height: 28px;
  margin-top: 2px;
}

.assignment-modal {
  position: fixed;
  top: 160px; /* 정확히 두 번째 버튼과 정렬 */
  right: 90px; /* 버튼 오른쪽 여백 기준 */
  width: 27%; /* 모달 너비 확장 */
  min-width: 500px; /* 최소 너비 설정 */
  max-width: 600px; /* 최대 너비 설정 */
  background-color: #ffffff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: block;
}

.assignment-modal .close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #94a3b8;
}

/* 개설 모임 카드 */
.assignment-card {
  background-color: #f4f6fb;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
.assignment-thumb {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
}
.assignment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.assignment-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.assignment-address {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.assignment-status {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.assignment-status.모집중 {
  color: #3b82f6;
}
.assignment-status.진행완료 {
  color: #7c3aed;
}
</style>