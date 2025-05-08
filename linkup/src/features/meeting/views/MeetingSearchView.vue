<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import SearchSportIcons from '@/features/meeting/components/SearchSportIcons.vue';
import FilterDropdown from '@/features/meeting/components/FilterDropdown.vue';
import FloatingNav from '@/features/meeting/components/FloatingNav.vue';
import MeetingCard from '@/features/meeting/components/MeetingCard.vue';
import CreateMeetingModal from '@/features/meeting/views/CreateMeetingModal.vue';
import CreatedMeetingsModal from '@/features/meeting/views/CreatedMeetingsModal.vue';
import ParticipatingMeetingsModal from '@/features/meeting/views/ParticipatingMeetingsModal.vue';
import PendingMeetingsModal from '@/features/meeting/views/PendingMeetingsModal.vue';
import InterestedMeetingsModal from '@/features/meeting/views/InterestedMeetingsModal.vue';
import MeetingManageModal from '@/features/meeting/views/MeetingManageModal.vue';
import ParticipantsModal from '@/features/meeting/views/ParticipantsModal.vue';
import PlaceMap from '@/features/place/components/PlaceMap.vue';
import '@/assets/css/search-common.css'

import { fetchMeetingList, getAllMeetings } from '@/api/meeting.js';
const router = useRouter();

const showModal = reactive({
  create: false,
  created: false,
  participated: false,
  manage: false,
  participants: false,
  pending: false,
  interested: false
});

const allMeetings = ref([]);
const meetings = ref([]);

const fetchAllMeetings = async () => {
  try {
    const res = await getAllMeetings();
    allMeetings.value = res;
  } catch (error) {
    console.error('전체 모임 목록 불러오기 실패', error);
  }
};

onMounted(() => {
  fetchAllMeetings();
  loadMeetings(true);
});

const regionOptions = [
  { name: '서울특별시', code: 'seoul', children: [{ name: '강남구', code: 'gangnam' }, { name: '서초구', code: 'seocho' }, { name: '마포구', code: 'mapo' }] },
  { name: '경기도', code: 'gyeonggi', children: [{ name: '성남시', code: 'seongnam' }, { name: '수원시', code: 'suwon' }, { name: '고양시', code: 'goyang' }] }
];

const sportsList = [
  { type: 'football', label: '풋살', src: '@/assets/icons/sports/football.svg' },
  { type: 'tennis', label: '테니스', src: '@/assets/icons/sports/tennis.svg' },
  { type: 'basketball', label: '농구', src: '@/assets/icons/sports/basketball.svg' }
];

const selectedSport = ref('');
const isFloatingMinimized = ref(true);

const filters = reactive({
  sportType: '',
  regionCode: '',
  gender: '전체',
  ageGroup: '전체',
  skillLevel: '전체',
  status: '전체',
  startDate: '',
  endDate: ''
});

const filterDropdownOpen = ref(false);
const filterWrap = ref(null);
const dropdownStyle = ref({});

function sanitizeFilters(filters) {
  const cleaned = {};
  for (const key in filters) {
    const value = filters[key];
    cleaned[key] = value === '전체' ? null : value;
  }
  return cleaned;
}

async function loadMeetings(isInitial = false) {
  try {
    const filterParams = isInitial ? {} : sanitizeFilters(filters);
    const result = await fetchMeetingList(filterParams);
    meetings.value = result;

    console.log('[DEBUG] 불러온 meetings 개수:', meetings.value.length);
    console.log('[DEBUG] meetings 내용:', meetings.value);
  } catch (error) {
    console.error('모임 데이터를 불러오는 중 오류 발생:', error);
  }
}

function onFilterApply(newFilters) {
  Object.assign(filters, newFilters);
  filterDropdownOpen.value = false;
  loadMeetings();
}

function goToMeetingDetail(meeting) {
  const id = meeting.meetingId || meeting.id;
  router.push(`/meetings/${id}`);
}

function handleNavigate(action) {
  const map = {
    create: 'create',
    created: 'created',
    participated: 'participated',
    liked: 'interested',
    pending: 'pending',
  };

  if (Object.keys(map).includes(action)) {
    const key = map[action];
    showModal[key] = !showModal[key];
  }
}

function handleCreateModal(type) {
  if (type === 'reserved') {
    router.push('/places');
  }
  if (type === 'map') {
    alert('준비중입니다');
  }
  showModal.create = false;
}

const selectedMeeting = ref(null);
function handleCreatedModal(meeting) {
  selectedMeeting.value = meeting;
  showModal.manage = true;
}
function handleManageModal() {
  showModal.manage = false;
}
function handleParticipatedModal(meeting) {
  selectedMeeting.value = meeting;
  showModal.participants = true;
}
function handleParticipantsModal() {
  showModal.participants = false;
}
function handlePendingModal() {
  showModal.pending = false;
}
function handleInterestedModal() {
  showModal.interested = false;
}

function toggleFilterDropdown() {
  filterDropdownOpen.value = !filterDropdownOpen.value;
  if (filterDropdownOpen.value) {
    nextTick(() => {
      const btn = filterWrap.value?.querySelector('.filter-chip-button');
      if (btn) {
        dropdownStyle.value = {
          position: 'absolute',
          top: `${btn.offsetTop + btn.offsetHeight + 16}px`,
          left: `${btn.offsetLeft}px`,
          zIndex: 1000
        };
      }
    });
  }
}

// ✅ 지도용으로 address, name 포함한 가공 데이터 생성
const meetingsWithAddress = computed(() =>
  meetings.value.map(m => ({
    name: m.placeName || m.title || '제목 없음',
    address: m.place?.address || '',
    ...m
  }))
);
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <!-- 필터 선택 -->
      <div class="filter-toggle-wrap" ref="filterWrap">
        <SearchSportIcons :sports="sportsList" v-model:selected="selectedSport" />
        <button class="filter-chip-button" @click="toggleFilterDropdown">
          <img src="@/assets/icons/meeting_and_place/filter.svg" alt="필터" width="16" height="16" />
          필터
        </button>
      </div>

      <!-- 필터 드롭다운 -->
      <div v-show="filterDropdownOpen" class="filter-dropdown-panel-num" :style="dropdownStyle">
        <FilterDropdown
          :filters="filters"
          :region-options="regionOptions"
          @update:filters="onFilterApply"
        />
      </div>

      <!-- 전체 모임 리스트 텍스트 (단순 제목) -->
      <div class="all-meeting-list">
        <h4>전체 모임</h4>
        <ul>
          <li
            v-for="meeting in allMeetings"
            :key="meeting.meetingId"
            class="meeting-item"
            @click="goToMeetingDetail(meeting)"
          >
            {{ meeting.title }}
          </li>
        </ul>
      </div>

      <!-- MeetingCard 렌더링 -->
      <div class="meeting-card-list">
        <MeetingCard
          v-for="meeting in meetings"
          :key="meeting.id"
          :meeting="meeting"
          @click="goToMeetingDetail(meeting)"
        />
      </div>
    </div>

    <!-- 지도 -->
    <div class="map-section">
      <PlaceMap :places="meetingsWithAddress" @select="goToMeetingDetail" />
    </div>

    <!-- 플로팅 네비게이션 -->
    <FloatingNav
      :minimized="isFloatingMinimized"
      @toggle="isFloatingMinimized = !isFloatingMinimized"
      @navigate="handleNavigate"
    />

    <!-- 모달 영역 -->
    <CreateMeetingModal v-if="showModal.create" @close="showModal.create = false" @select="handleCreateModal" />
    <CreatedMeetingsModal v-if="showModal.created" @close="showModal.created = false" @select="handleCreatedModal" />
    <MeetingManageModal :visible="showModal.manage" :meeting="selectedMeeting" @close="showModal.manage = false" @select="handleManageModal" />
    <ParticipatingMeetingsModal v-if="showModal.participated" @close="showModal.participated = false" @select="handleParticipatedModal" />
    <ParticipantsModal :visible="showModal.participants" :meeting="selectedMeeting" @close="showModal.participants = false" @select="handleParticipantsModal" />
    <PendingMeetingsModal v-if="showModal.pending" @close="showModal.pending = false" @select="handlePendingModal" />
    <InterestedMeetingsModal v-if="showModal.interested" @close="showModal.interested = false" @select="handleInterestedModal" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

/* 좌측 사이드바 */
.sidebar {
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  box-sizing: border-box;
}

.filter-toggle-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-chip-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 16px;
  cursor: pointer;
}

.filter-dropdown-panel-num {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 12px;
  position: absolute;
  width: 300px;
  z-index: 1000;
}

/* 전체 모임 리스트 텍스트 */
.all-meeting-list h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
}

.meeting-item {
  font-size: 14px;
  padding: 4px 0;
  color: #333;
  cursor: pointer;
}

/* 카드 리스트 정돈 */
.meeting-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 우측 지도 */
.map-section {
  flex: 1;
  position: relative;
  height: 100%;
}
</style>