<script setup>
import { ref, onMounted } from 'vue';
import { getMyComments } from '@/api/user';
import dayjs from 'dayjs';

const comments = ref([]);

onMounted(async () => {
  const { data } = await getMyComments(); // 댓글 조회 API
  comments.value = data.data;
});
</script>

<template>
  <section class="comment-wrapper" aria-label="작성한 댓글">
    <h2 class="section-title">작성한 댓글</h2>

    <div class="comment-list">
      <RouterLink
        :to="`/community/${comment.postId}`"
        v-for="comment in comments"
        :key="comment.commentId"
        class="comment-card"
      >
        <div class="comment-meta">
          <span class="comment-on">[{{ comment.postTitle }}] 글에 남긴 댓글</span>
          <span class="comment-date">{{ dayjs(comment.createdAt).format('YYYY.MM.DD') }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
      </RouterLink>

      <div v-if="comments.length === 0" class="empty-message">작성한 댓글이 없습니다.</div>
    </div>
  </section>
</template>

<style scoped>
.comment-wrapper {
  @apply bg-white;
}

.section-title {
  @apply text-xl font-bold text-gray-900 mb-6;
}

.comment-list {
  @apply flex flex-col gap-6;
}

.comment-card {
  @apply p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer;
}

.comment-meta {
  @apply flex justify-between text-sm text-gray-500 mb-3;
}

.comment-content {
  @apply text-base text-gray-800 leading-relaxed;
}

.empty-message {
  @apply text-center text-gray-400 text-sm mt-8;
}
</style>
