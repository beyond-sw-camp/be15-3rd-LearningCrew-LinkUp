<script setup>
import wholeIcon from '@/assets/icons/sports/whole.svg'
import footballIcon from '@/assets/icons/sports/football.svg'
import tennisIcon from '@/assets/icons/sports/tennis.svg'
import bowlingIcon from '@/assets/icons/sports/bowling.svg'
import tableTennisIcon from '@/assets/icons/sports/tableTennis.svg'
import basketballIcon from '@/assets/icons/sports/basketball.svg'
import golfIcon from '@/assets/icons/sports/golf.svg'
import badmintonIcon from '@/assets/icons/sports/badminton.svg'
import etcIcon from '@/assets/icons/sports/etc.svg'

const props = defineProps({
  selected: String
})

defineEmits(['update:selected'])

const sports = [
  { type: 'all', label: '전체', src: wholeIcon },
  { type: 'football', label: '풋살', src: footballIcon },
  { type: 'tennis', label: '테니스', src: tennisIcon },
  { type: 'bowling', label: '볼링', src: bowlingIcon },
  { type: 'tableTennis', label: '탁구', src: tableTennisIcon },
  { type: 'basketball', label: '농구', src: basketballIcon },
  { type: 'golf', label: '골프', src: golfIcon },
  { type: 'badminton', label: '배드민턴', src: badmintonIcon },
  { type: 'etc', label: '기타', src: etcIcon }
]
</script>


<template>
  <div class="filter-scroll-wrapper">
    <div class="filter-icons">
      <button
        v-for="icon in sports"
        :key="icon.type"
        class="icon-btn"
        :class="{ active: icon.type === selected }"
        @click="$emit('update:selected', icon.type)"
      >
        <img :src="icon.src" :alt="icon.label" />
        <span>{{ icon.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-scroll-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  width: 80%;
  -ms-overflow-style: none;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}



.icon-btn {
  border: none;
  background: none;
  padding: 6px;
  cursor: pointer;
  justify-items: center;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.icon-btn img {
  width: 24px;
  height: 24px;
  filter: grayscale(100%);
  transition: filter 0.2s;
}

.icon-btn.active img {
  filter: none;
}


.icon-btn span:last-child {
  margin-top: 4px;
  font-size: 11px;
}

.icon-btn.active span:last-child {
  color: #2977f5;
  font-weight: bold;
}

</style>