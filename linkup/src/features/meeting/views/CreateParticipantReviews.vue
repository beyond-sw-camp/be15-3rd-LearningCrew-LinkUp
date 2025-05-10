<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ParticipantReviewLayout from '@/features/meeting/components/ParticipantReviewLayout.vue';
import { useAuthStore } from '@/stores/auth.js';
import api from '@/api/axios.js';

const route = useRoute();
const userStore = useAuthStore();
const reviewerId = userStore.userId; // 예시 reviewerId, 실제 로그인 사용자 ID로 대체
const meetingId = route.params.meetingId;

const participants = ref([]);
const isLoading = ref(true);

const fetchParticipants = async () => {
  isLoading.value = true;

  try {
    const response = await api.get(`/common-service/my/meetings/${meetingId}/participation`, {
      params: {requesterId: reviewerId, memberId: reviewerId}
    });
    participants.value = response.data.data.participants;
    // participants.value = [
    //   {
    //     reviewerId: reviewerId,
    //     revieweeId: 1,
    //     revieweeNickname: '방구석메시',
    //     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    //     score: null
    //   },
    //   {
    //     reviewerId: reviewerId,
    //     revieweeId: 2,
    //     revieweeNickname: '헬린이',
    //     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    //     score: null
    //   },
    //   {
    //     reviewerId: reviewerId,
    //     revieweeId: 3,
    //     revieweeNickname: '메시',
    //     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    //     score: null
    //   },
    // ];
    isLoading.value = false;
  } catch (e) {
    console.error('참가자 조회 실패', e);
  }
};

onMounted(() => {
  fetchParticipants();
})

const handleRate = ({ revieweeId, value }) => {
  const p = participants.value.find((p) => p.revieweeId === revieweeId);
    p.score = p.score === value ? null : value;
};

const submitRatings = async () => {
  const ratedParticipants = participants.value.filter(p => p.score !== null);

  if (ratedParticipants.length === 0) {
    alert('평가가 입력되지 않았습니다.');
    return;
  }

  const requestData = {
    reviewerId: reviewerId,
    reviews: ratedParticipants.map(p => ({
      reviewerId: p.reviewerId,
      revieweeId: p.revieweeId,
      revieweeNickname: p.revieweeNickname,
      score: p.score
    }))
  };
  console.log(requestData);

  try {
    const response = await api.post(`/common-service/meetings/${meetingId}/review`, requestData);
    console.log('제출 완료', response.data);
  } catch (e) {
    console.log('제출 실패', e);
  }
};
</script>

<template>
  <div v-if="isLoading"> 로딩 중...</div>
  <ParticipantReviewLayout
    v-else
    :participants="participants"
    :reviewerId="reviewerId"
    @rate="handleRate"
    @submit="submitRatings"
  />
</template>

<style scoped>
</style>
