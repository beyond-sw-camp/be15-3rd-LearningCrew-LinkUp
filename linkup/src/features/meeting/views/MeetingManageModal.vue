<template>
    <!-- 참가자 관리 모달 -->
    <div v-if="visible" class="participant-modal">
      <div class="modal-header">
        <img src="@/assets/icons/meeting_and_place/sidebar-participated_meetings.svg" alt="참가자 관리" class="icon-img"/>
        <h2>개설 모임 관리</h2>
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
                <span class="hidden-text">권한 위임</span>
              </button>
            </template>
            <template v-else>
            <button class="participant-btn accept">권한 위임</button>
            </template>
          </div>
        </div>
      </div>

      <hr class="divider" />
      <div class="participant-modal-content">
        <h2>참가 신청 목록</h2>
        <div
          v-for="(applicant, index) in applicants"
          :key="'applicant-' + index"
          class="applicant-card"
        >
          <div class="applicant-profile">
            <img :src="applicant.profileImageUrl" alt="프로필" />
          </div>
          <div class="applicant-info">
            <p><strong>{{ applicant.nickname }}</strong></p>
            <p><strong>{{ applicant.gender }}</strong> | <strong>{{ applicant.age }}세</strong> | <strong>{{ applicant.mannerTemperature
              }}°C</strong></p>
            <p>{{ applicant.introduction }}</p>
          </div>
          <div class="applicant-actions">
            <button class="btn accept" @click="acceptParticipation(applicant)">수락</button>
            <button class="btn reject" @click="rejectParticipation(applicant)">거절</button>
          </div>
        </div>
      </div>

      <div class="participant-modal-button">
        <button class="btn accept" @click="goToMeetingDetails">모임 바로가기</button>
        <button class="btn cancel" @click="cancelMeeting">모임 취소</button>
      </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import api from '@/api/axios.js';
import { useAuthStore } from '@/stores/auth.js';
import {startLoading} from "@/composables/useLoadingBar.js";
import { useRouter } from 'vue-router';

const auth = useAuthStore();

const leaderNickname = ref([]);

const participants = ref([]);
const applicants = ref([]);

const props = defineProps({
  visible: Boolean,
  meeting: Object
});

const router = useRouter();

const meetingId = computed(() => props.meeting?.meetingId);

const fetchParticipants = async () => {
  try {
    const response = await api.get(`common-service/my/meetings/${meetingId.value}/participation`, {
      params: { memberId: auth.userId, requesterId: auth.userId }
    });
    participants.value = response.data.data.participants || [];
    const meetingResponse = await api.get(`common-service/meetings/${meetingId.value}`);
    leaderNickname.value = meetingResponse.data.data.meeting.leaderNickname;
  } catch (error) {
    console.error('참가자 목록을 불러오는 중 오류 발생:', error);
  }
};

const fetchApplicants = async () => {
  try {
    const response = await api.get(`common-service/meetings/${meetingId.value}/participation_request`, {
      params: { requesterId: auth.userId }
    });
    applicants.value = response.data.data.participants || []; // API 응답에 맞게 수정
  } catch (error) {
    console.error('참가 신청자 목록을 불러오는 중 오류 발생:', error);
  }
};

// watch로 meetingId가 변경될 때마다 데이터 로드
watch(meetingId, (newMeetingId) => {
  if (newMeetingId) {
    fetchParticipants();
    fetchApplicants();
  }
});

const emit = defineEmits(['close']);
function closeModal() {
  emit('close');
}

async function acceptParticipation(applicant) {
  try {
    startLoading()
    const memberId = applicant.memberId;
    const response = await api.put(`/common-service/meetings/${meetingId.value}/participation/${memberId}/accept`
    ,  { // 여기에 body 데이터 작성
        memberId: auth.userId  // 예시: 요청자 ID (혹은 다른 필요한 데이터)
        // 필요한 다른 데이터들을 여기에 추가
      });

    console.log(response.data);
  } catch (error) {
    console.error('참가 수락 실패:', error);
    alert('참가 수락에 실패했습니다.');
  }
}

async function rejectParticipation(applicant) {
  try {
    startLoading()
    const memberId = applicant.memberId;
    const response = await api.put(`/common-service/meetings/${meetingId.value}/participation/${memberId}/reject`,
      { // 여기에 body 데이터 작성
        memberId: auth.userId  // 예시: 요청자 ID (혹은 다른 필요한 데이터)
        // 필요한 다른 데이터들을 여기에 추가
      });
    console.log(response.data);
  } catch (error) {
    console.error('참가 거절 실패:', error);
    alert('참가 거절에 실패했습니다.');
  }
}

const cancelMeeting = async () => {
  try {
    const result = confirm('정말 모집을 취소하시겠습니까?');
    if (result) {
      api.delete(`common-service/meetings/${meetingId.value}/cancel`, {
          params: {
            memberId: auth.userId,  // 요청자 ID 등 필요한 파라미터
            // 다른 필요한 파라미터들 추가
          }
        }
      );
      // alert('모집 취소에 성공했습니다.');
      closeModal();
    }
  } catch (e) {
    console.error('모집 취소 실패', e);
    alert('모집 취소에 실패했습니다.');
  }
};

const goToMeetingDetails = () => {
  router.push(`/meetings/${meetingId.value}`)
}
</script>

<style scoped>
/* ---------------- 참가자 관리 모달 ---------------- */
.participant-modal {
  position: fixed;
  top: 160px; /* assignment-modal과 같은 높이 */
  right: calc(84px + 480px + 35px); /* assignment-modal 오른쪽 끝 + 여유 24px */
  width: 32%;
  min-width: 400px;
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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

.applicant-card {
  background: #f8f9fb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  align-items: center;
}

.applicant-profile {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: #e0e0e0;
}


.applicant-profile img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e0e0e0;
  flex-shrink: 0;
}

.applicant-info {
  flex: 1;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.applicant-info p {
  margin: 2px 0;
}

.applicant-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-wrap: wrap;
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
