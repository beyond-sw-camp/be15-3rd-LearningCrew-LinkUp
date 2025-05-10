<script setup>
import { ref, onMounted } from 'vue';
import {
  getReceivedFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from '@/api/friend.js';

const friendRequests = ref([]);

const fetchFriendRequests = async () => {
  try {
    const res = await getReceivedFriendRequests();
    friendRequests.value = res.data.data;
  } catch (e) {
    console.error('친구 요청 목록을 불러오는 데 실패했습니다.', e);
  }
};

const handleAccept = async (memberId) => {
  try {
    await acceptFriendRequest(memberId);
    await fetchFriendRequests();
  } catch (e) {
    console.error('친구 요청 수락 실패', e);
  }
};

const handleDecline = async (memberId) => {
  try {
    await declineFriendRequest(memberId);
    await fetchFriendRequests();
  } catch (e) {
    console.error('친구 요청 거절 실패', e);
  }
};

onMounted(() => {
  fetchFriendRequests();
});
</script>

<template>
  <main class="mypage-content">
    <div class="profile-edit-wrapper">
      <h2 class="section-title">받은 친구 신청</h2>

      <div class="friend-request-list">
        <div v-for="friend in friendRequests" :key="friend.requesterId" class="friend-card">
          <div class="friend-info">
            <img :src="friend.requesterProfileImageUrl" alt="신청자" class="friend-avatar" />
            <div class="friend-name">{{ friend.requesterNickname }}</div>
          </div>
          <div class="friend-actions">
            <button class="btn accept-btn" @click="handleAccept(friend.requesterId)">수락</button>
            <button class="btn decline-btn" @click="handleDecline(friend.requesterId)">거절</button>
          </div>
        </div>

        <div v-if="friendRequests.length === 0" class="empty-message">
          받은 친구 신청이 없습니다.
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.mypage-content {
  @apply flex-1;
}
.profile-edit-wrapper {
  @apply bg-white;
}
.section-title {
  @apply text-xl font-bold mb-6;
}
.friend-request-list {
  @apply flex flex-col gap-4;
}
.friend-card {
  @apply bg-white p-5 rounded-xl shadow flex items-center justify-between;
}
.friend-info {
  @apply flex items-center gap-4;
}
.friend-avatar {
  @apply w-12 h-12 rounded-full object-cover;
}
.friend-name {
  @apply text-base font-semibold;
}
.friend-actions {
  @apply flex gap-3;
}
.btn {
  @apply px-4 py-2 rounded-lg font-medium cursor-pointer;
}
.accept-btn {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
.decline-btn {
  @apply bg-red-300 text-white hover:bg-red-400;
}
.empty-message {
  @apply text-center text-sm text-gray-500 mt-6;
}
</style>
