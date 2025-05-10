<template>
  <div class="post-detail-content">
    <h1 class="title">{{ post.title }}</h1>

    <div class="meta">
      <div class="meta-left">
        <span class="nickname">{{ post.nickname }}</span>
      <span class="date">{{ formatDate(post.createdAt) }}</span>
      </div>
        <div class="meta-right">
        <img
            :src="post.likeCount > 0
          ? require('@/assets/icons/community/heart.svg')
          : require('@/assets/icons/community/empty_heart.svg')"
            alt="좋아요"
            class="like-icon"
        />
          <span class="like-count">{{ post.likeCount || 0 }}</span>
      </div>
    </div>

    <div v-if="post.imageUrls && post.imageUrls.length" class="image-list">
      <img v-for="(url, index) in post.imageUrls" :key="index" :src="url" class="post-image" />
    </div>

    <div class="content">{{ post.content }}</div>
  </div>

</template>

<script setup>
defineProps({
  post: Object,
});

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

</script>

<style scoped>

.post-detail-content {
  padding: 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}


.left-info {
  display: flex;
  gap: 12px;
}



.image-list {
  margin: 16px 0;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 12px;
  border-radius: 8px;
}

.content {
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}



.nickname {
  font-weight: bold;
}


.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: gray;
  flex-wrap: nowrap;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.like-icon {
  width: 16px;
  height: 16px;
}

.like-count {
  font-size: 14px;
  color: #333;
}

</style>
