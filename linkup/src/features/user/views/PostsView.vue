<script setup>
import { ref, onMounted } from 'vue';
import { getMyPosts } from '@/api/user';
import dayjs from 'dayjs';

const posts = ref([]);

onMounted(async () => {
  const { data } = await getMyPosts(); // 게시글 조회 API
  posts.value = data.data;
});
</script>

<template>
  <section class="post-wrapper" aria-label="작성한 게시글">
    <h2 class="section-title">작성한 게시글</h2>

    <div class="post-list">
      <div v-for="post in posts" :key="post.postId" class="post-card">
        <div class="post-header">
          <h3 class="post-title">{{ post.title }}</h3>
          <span class="post-date">{{ dayjs(post.createdAt).format('YYYY.MM.DD') }}</span>
        </div>
        <p class="post-excerpt">{{ post.content }}</p>
        <div class="post-meta">
          <span>댓글 {{ post.commentCount }}</span>
          <a :href="`/community/${post.postId}`" class="view-detail">자세히 보기 →</a>
        </div>
      </div>

      <div v-if="posts.length === 0" class="empty-message">작성한 게시글이 없습니다.</div>
    </div>
  </section>
</template>

<style scoped>
.post-wrapper {
  @apply bg-white;
}

.section-title {
  @apply text-xl font-bold text-gray-900 mb-6;
}

.post-list {
  @apply flex flex-col gap-6;
}

.post-card {
  @apply p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow;
}

.post-header {
  @apply flex justify-between items-baseline mb-3;
}

.post-title {
  @apply text-lg font-semibold text-gray-900;
}

.post-date {
  @apply text-sm text-gray-500;
}

.post-excerpt {
  @apply text-base text-gray-800 mb-4 leading-relaxed;
}

.post-meta {
  @apply flex justify-between text-sm text-gray-500;
}

.view-detail {
  @apply text-blue-500 hover:underline font-medium;
}

.empty-message {
  @apply text-center text-gray-400 text-sm mt-8;
}
</style>
