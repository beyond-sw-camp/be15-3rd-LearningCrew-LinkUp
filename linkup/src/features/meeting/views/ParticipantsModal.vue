<template>
    <!-- 참가자 관리 모달 -->
    <div v-if="visible" class="participant-modal">
      <div class="modal-header">
        <img src="@/assets/icons/meeting_and_place/sidebar-participated_meetings.svg" alt="참가자 목록" class="icon-img"/>
        <h2>참가자 목록</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      <hr class="divider" />

      <div class="participant-modal-content">
        <h2>참가자 목록</h2>
        <div
          v-for="(participant, index) in participants"
          :key="'participant-' + index"
          class="participant-card"
        >
          <img :src="participant.profileImageUrl" alt="프로필" class="participant-thumb" />
          <div class="participant-content">
            <div class="participant-nickname">{{ participant.nickname }}</div>
            <div class="participant-subinfo">매너온도: {{ participant.mannerTemperature }}°C</div>
          </div>
          <div class="participant-actions">
            <template v-if="participant.nickname === leaderNickname">
              <button class="participant-btn disabled" disabled>
                <img src="@/assets/icons/meeting_and_place/crown.svg" alt="개설자" class="leader"/>
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="participant-modal-button">
        <button class="btn accept" @click="goToMeetingDetails">모임 바로가기</button>
        <button class="btn cancel" @click="cancelParticipation">모임 참가 취소</button>
      </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import api from '@/api/axios.js';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const leaderNickname = ref([]);
// 참가자 목록 조회 api.get(`common-service/my/meetings/${meetingId}/participation`);

const participants = ref([]);
// const participants = ref([
//   {
//     nickname: '방구석메시',
//     mannerTemperature: 38,
//     profileImageUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=linkup',
//   },
//   {
//     nickname: '운동광인생',
//     mannerTemperature: 40,
//     profileImageUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=linkup2',
//   },
// ])

const props = defineProps({
  visible: Boolean,
  meeting: Object
});

const meetingId = computed(() => props.meeting?.meetingId);

const fetchParticipants = async () => {
  try {
    const response = await api.get(`/common-service/my/meetings/${meetingId.value}/participation`, {
      params: { memberId: auth.userId, requesterId: auth.userId }
    });
    participants.value = response.data.data.participants;
    const meetingResponse = await api.get(`/common-service/meetings/${meetingId.value}`);
    leaderNickname.value = meetingResponse.data.data.meeting.leaderNickname;
  } catch (error) {
    console.error('참가자 목록을 불러오는 중 오류 발생:', error);
  }
};

// watch로 meetingId가 변경될 때마다 데이터 로드
watch(meetingId, (newMeetingId) => {
  if (newMeetingId) {
    fetchParticipants();
  }
});


const emit = defineEmits(['close']);
function closeModal() {
  emit('close');
}

const goToMeetingDetails = () => {
  router.push(`/meetings/${meetingId.value}`)
}

const cancelParticipation = async () => {
  try {
    const result = confirm('정말 참가를 취소하시겠습니까?');
    if (result) {
      api.delete(`common-service/meetings/${meetingId.value}/participation/${auth.userId}`, {
          params: {
            memberId: auth.userId,  // 요청자 ID 등 필요한 파라미터
            // 다른 필요한 파라미터들 추가
          }
        }
      );
      closeModal();
    }
  } catch (e) {
    console.error('참가 취소 실패', e);
    alert('참가 취소에 실패했습니다.');
  }
}
</script>

<style scoped>
/* ---------------- 참가자 조회 모달 ---------------- */
.participant-modal {
  position: fixed;
  top: 200px; /* assignment-modal과 같은 높이 */
  right: calc(84px + 480px + 35px); /* assignment-modal 오른쪽 끝 + 여유 24px */
  width: 32%;
  min-width: 400px;
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  z-index: 1100;
  display: flex;
  flex-direction: column;
}

.participant-modal h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.participant-modal .close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #94a3b8;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.participant-modal-content {
  margin-top: 20px;
  margin-bottom: 10px;
}

.participant-modal-button {
  padding: 6px 12px;
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.modal-header .icon-img {
  width: 28px;
  height: 28px;
  margin-top: 2px;
}

.participant-btn {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.participant-btn.accept {
  background-color: #5790FF;
  color: #fff;
}

.participant-btn.accept:hover {
  background-color: #3b69d1;
}

.participant-btn.reject {
  background-color: #E64980;
  color: #fff;
}

.participant-btn.reject:hover {
  background-color: #cc3a6a;
}

.btn {
  flex: 1;
}

.leader {
  width: 28px;
  height: 28px;
}

.hidden-text {
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* 참가자 카드 스타일 */
.participant-card {
  background: #f4f6fb;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;
}

.participant-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: #e0e0e0;
}

.participant-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.participant-nickname {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.participant-subinfo {
  font-size: 13px;
  color: #6b7280;
}

.participant-actions {
  display: flex;
  gap: 8px;
}

/* 버튼 영역 */
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

.btn.reject {
  background-color: #FEB5A1;
  color: #fff;
}

.btn.reject:hover {
  background-color: #E64980;
}

.btn.cancel {
  background-color: #939DC1;
  color: #fff;
  width: 100%;
}

.btn.cancel:hover {
  background-color: #939DC1;
}

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 10px 0; /* 여유 있는 구분선 */
}
</style>
