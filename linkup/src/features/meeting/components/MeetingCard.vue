<template>
  <article class="meeting-card" @click="handleClick">
    <figure class="meeting-img-wrapper">
      <img
        class="meeting-img"
        :src="meeting.thumbnailUrl || defaultImg"
        alt="모임 이미지"
        @error="onImgError"
      />
    </figure>

    <section class="meeting-info">
      <header class="meeting-meta">
        <p class="date">
          <img src="@/assets/icons/meeting_and_place/date.svg" class="icon" />
          {{ formatDate(meeting.date) }}
        </p>
        <button class="bookmark">
          <img src="@/assets/icons/community/empty_heart.svg" class="icon" />
        </button>
      </header>

      <h3 class="title">{{ meeting.meetingTitle }}</h3>

      <p class="location">
        <img src="@/assets/icons/meeting_and_place/place.svg" class="icon" />
        {{ meeting.placeAddress }}
      </p>

      <p class="likes">
        <img src="@/assets/icons/meeting_and_place/heart.svg" class="icon" />
        {{ meeting.interestedCount || 0 }}명 찜
      </p>

      <p class="price" v-if="meeting.participationFee !== undefined">
        <span class="material-symbols-outlined">attach_money</span>
        <strong>{{ meeting.participationFee.toLocaleString() }}원</strong>
      </p>
    </section>
  </article>
</template>

<script setup>
const props = defineProps({ meeting: Object })
const emit = defineEmits(['click'])

const defaultImg = '/볼링.webp'

function handleClick() {
  emit('click', props.meeting.id)
}

function formatDate(iso) {
  const date = new Date(iso)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  })
}

function onImgError(e) {
  e.target.src = defaultImg
}
</script>

<style scoped>
.meeting-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  margin-bottom: 1rem;

  /* ✅ 추가 */
  min-height: 260px;
}

.meeting-card:hover {
  box-shadow: 0 0 0 2px #60a5fa;
}

.meeting-img-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.meeting-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background-color: #f3f4f6;
}

.meeting-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meeting-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date,
.location,
.likes,
.price {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.icon {
  width: 16px;
  height: 16px;
}

.bookmark {
  color: #9ca3af;
}

.bookmark:hover {
  color: #f87171;
}
</style>
