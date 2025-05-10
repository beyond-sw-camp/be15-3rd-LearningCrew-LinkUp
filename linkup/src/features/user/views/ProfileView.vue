<script setup>
import { onMounted, ref } from 'vue';
import { getMyProfile, getUserDetail } from '@/api/user.js'; // 유저 상세 조회 API 호출
import WithdrawModal from '@/features/user/components/WithdrawModal.vue';

// 사용자 데이터 구조
const user = ref({
  nickname: '',
  userName: '',
  email: '',
  phoneNumber: '',
  gender: '',
  birthDate: '',
  pointBalance: 0,
  mannerTemperature: 0,
  introduction: '',
  profileImageUrl: '',
});

const isWithdrawModalOpen = ref(false);

// 프로필 데이터 불러오기
const fetchUserProfile = async () => {
  try {
    const res = await getMyProfile();
    console.log(res);
    const data = res.data.data.member;

    user.value = {
      nickname: data.nickname,
      userName: data.user.userName,
      email: data.user.email,
      phoneNumber: data.user.contactNumber,
      gender: data.gender,
      birthDate: data.birthdate,
      pointBalance: data.user.pointBalance,
      mannerTemperature: data.mannerTemperature,
      introduction: data.introduction,
      profileImageUrl: data.profileImageUrl,
    };
  } catch (error) {
    console.error('프로필 불러오기 실패', error);
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <section class="profile-container" aria-label="프로필 조회 섹션">
    <div class="profile-card">
      <header class="profile-header">
        <img
          :src="user.profileImageUrl || 'https://via.placeholder.com/120'"
          alt="프로필 이미지"
          class="profile-image"
        />
        <div class="profile-basic">
          <div class="nickname-line">
            <h2 class="nickname">{{ user.nickname }}</h2>
            <span class="manner-temp">{{ user.mannerTemperature }}° 매너온도</span>
          </div>
          <p class="name-email">{{ user.userName }} / {{ user.email }}</p>
        </div>
      </header>

      <div class="profile-info">
        <div class="info-item">
          <label class="info-label">연락처</label>
          <div class="info-value">{{ user.phoneNumber }}</div>
        </div>
        <div class="info-item">
          <label class="info-label">성별</label>
          <div class="info-value">{{ user.gender === 'M' ? '남성' : '여성' }}</div>
        </div>
        <div class="info-item">
          <label class="info-label">생년월일</label>
          <div class="info-value">{{ user.birthDate }}</div>
        </div>
        <div class="info-item">
          <label class="info-label">포인트 잔액</label>
          <div class="info-value">{{ user.pointBalance.toLocaleString() }}P</div>
        </div>
      </div>

      <section class="introduction-box" aria-label="자기소개 섹션">
        <h3 class="introduction-title">자기소개</h3>
        <p class="introduction-content">
          {{ user.introduction || '자기소개가 없습니다.' }}
        </p>
      </section>
    </div>

    <!-- 탈퇴 버튼 -->
    <button @click="isWithdrawModalOpen = true" class="withdraw-button">회원 탈퇴</button>

    <WithdrawModal v-if="isWithdrawModalOpen" @cancel="isWithdrawModalOpen = false" />
  </section>
</template>

<style scoped>
.profile-card {
  @apply w-full max-w-2xl bg-white;
}

.profile-header {
  @apply flex items-center gap-6 mb-8;
}

.profile-image {
  @apply w-14 h-14 rounded-full object-cover;
}

.profile-basic {
  @apply flex flex-col gap-2 flex-1;
}

.nickname-line {
  @apply flex items-center gap-4;
}

.nickname {
  @apply text-2xl font-bold text-gray-900;
}

.manner-temp {
  @apply text-yellow-400 bg-yellow-100 text-base font-semibold px-3 py-1 rounded-full;
}

.name-email {
  @apply text-sm text-gray-500;
}

.profile-info {
  @apply grid gap-6 mt-8;
}

.info-item {
  @apply flex flex-col;
}

.info-label {
  @apply text-sm text-gray-500 mb-1;
}

.info-value {
  @apply text-base font-medium text-gray-900;
}

.introduction-box {
  @apply mt-8;
}

.introduction-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.introduction-content {
  @apply bg-gray-100 p-4 rounded-md text-sm leading-relaxed text-gray-700;
}

.withdraw-button {
  @apply mt-8 bg-warning-default text-white font-semibold py-2 px-4 rounded hover:bg-red-600;
}
</style>
