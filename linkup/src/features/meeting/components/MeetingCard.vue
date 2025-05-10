<script setup>
import { defineProps, defineEmits } from 'vue'
import { BanknotesIcon } from '@heroicons/vue/16/solid/index.js';
const props = defineProps({
  meeting: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.meeting.id)
}

const defaultImg = 'https://cdn.pixabay.com/photo/2019/03/10/14/04/table-tennis-4046278_640.jpg'

function formatDate(iso) {
  const date = new Date(iso)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }
  return date.toLocaleDateString('ko-KR', options)
}
</script>

<template>
  <article class="meeting-card" @click="handleClick">
    <!-- 썸네일 이미지 -->
    <figure class="meeting-img-wrapper">
      <img
        class="meeting-img"
        :src="meeting.thumbnailUrl || defaultImg"
        alt="모임 이미지"
      />
    </figure>

    <!-- 본문 정보 -->
    <section class="meeting-info">
      <header class="meeting-meta">
        <p class="date">
          <img src="@/assets/icons/meeting_and_place/date.svg" alt="달력" class="search-icon" />
          {{ formatDate(meeting.date) }}
        </p>
        <button class="bookmark" aria-label="찜하기">
          <img src="@/assets/icons/community/empty_heart.svg" alt="찜" class="search-icon" />
        </button>
      </header>


      <h3 class="title">{{ meeting.meetingTitle }}</h3>

      <p class="location">
        <img src="@/assets/icons/meeting_and_place/place.svg" alt="주소" class="search-icon" />
        {{ meeting.placeAddress }}
      </p>

      <p class="likes">
        <img src="@/assets/icons/meeting_and_place/heart.svg" alt="찜인원" class="search-icon" />
        {{ meeting.interestedCount }}명 찜
      </p>

      <p class="price">
        <BanknotesIcon class="size-6 text-blue-500" />
        <strong>{{ meeting.participationFee.toLocaleString() }}원</strong>
      </p>

    </section>
  </article>
</template>

<style scoped>
.filter-toggle-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.filter-toggle-btn {
  max-height: 35px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}
.filter-toggle-btn:hover {
  background-color: #dde4f3;
}
.meeting-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.meeting-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.meeting-info {
  padding: 16px;
}
.meeting-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.meeting-meta .date {
  font-size: 13px;
  color: #666;
  display: flex;
  gap: 5px;
}
.bookmark {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.title {
  font-size: 15px;
  font-weight: 600;
  margin: 6px 0 10px;
  color: #222;
}
.date, .location, .likes, .price {
  font-size: 14px;
  color: #555;
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 5px;
}
.search-icon {
  width: 16px;
  height: 16px;
}
.price strong {
  color: #3366ff;
  font-weight: 600;
}

.material-symbols-outlined {
  font-size: 24px;
  color: #5790FF;
}

</style>
