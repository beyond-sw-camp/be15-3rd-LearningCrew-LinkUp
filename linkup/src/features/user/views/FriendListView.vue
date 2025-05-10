<script setup>
import { ref, onMounted } from 'vue';
import { getFriendList, declineFriendRequest } from '@/api/friend.js';

const friends = ref([]);

const fetchFriends = async () => {
  try {
    const res = await getFriendList();
    friends.value = res.data.data;
    console.log(res);
  } catch (e) {
    console.error('친구 목록을 불러오는 데 실패했습니다.', e);
  }
};

const handleDelete = async (memberId) => {
  try {
    await declineFriendRequest(memberId);
    await fetchFriends();
  } catch (e) {
    console.error('친구 삭제 실패', e);
  }
};

onMounted(() => {
  fetchFriends();
});
</script>

<template>
  <main class="mypage-content">
    <div class="profile-edit-wrapper">
      <h2 class="section-title">나의 친구 목록</h2>

      <div class="friend-request-list">
        <div v-for="friend in friends" :key="friend.friendId" class="friend-card">
          <div class="friend-info">
            <img :src="friend.profileImageUrl" alt="친구 프로필" class="friend-avatar" />
            <div class="friend-name">{{ friend.nickname }}</div>
          </div>
          <div class="friend-actions">
            <button class="btn decline-btn" @click="handleDelete(friend.friendId)">삭제</button>
          </div>
        </div>

        <div v-if="friends.length === 0" class="empty-message">현재 친구가 없습니다.</div>
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
.decline-btn {
  @apply bg-red-300 text-white hover:bg-red-400;
}
.empty-message {
  @apply text-center text-sm text-gray-500 mt-6;
}
</style>
