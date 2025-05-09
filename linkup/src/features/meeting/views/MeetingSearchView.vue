<script setup>
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import SearchSportIcons from '@/features/meeting/components/SearchSportIcons.vue'
import MapDisplay from '@/components/common/MapDisplay.vue'
import FilterDropdown from '@/features/meeting/components/FilterDropdown.vue'
import FloatingNav from '@/features/meeting/components/FloatingNav.vue'
import MeetingCard from '@/features/meeting/components/MeetingCard.vue'
import CreateMeetingModal from '@/features/meeting/views/CreateMeetingModal.vue';

// import '@/assets/css/search-common.css'
import { useRouter } from 'vue-router';
import CreatedMeetingsModal from '@/features/meeting/views/CreatedMeetingsModal.vue';
import ParticipatingMeetingsModal from '@/features/meeting/views/ParticipatingMeetingsModal.vue';
import PendingMeetingsModal from '@/features/meeting/views/PendingMeetingsModal.vue';
import InterestedMeetingsModal from '@/features/meeting/views/InterestedMeetingsModal.vue';
import MeetingManageModal from '@/features/meeting/views/MeetingManageModal.vue';
import ParticipantsModal from '@/features/meeting/views/ParticipantsModal.vue';
import api from '@/api/axios.js';
import FullVertialCenterLayout from "@/components/layout/FullVertialCenterLayout.vue";
import Backdrop from "@/components/layout/Backdrop.vue";
import {fetchMeetingList, getAllMeetings } from "@/api/meeting.js";
import SidebarMainLayout from '@/components/layout/SidebarMainLayout.vue';

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


const fetchAllMeetings = async () => {
  try {
    const res = await getAllMeetings(); // => 이 함수는 아래 api/meeting.js 예시 참고
    allMeetings.value = res;
  } catch (error) {
    console.error('전체 모임 목록 불러오기 실패', error);
  }
};

onMounted(() => {
  fetchAllMeetings();
});

function resetModals() {
  Object.keys(showModal).forEach(key => {
    showModal[key] = false;
  });
}



// 지역/운동 필터 데이터
const regionOptions = [
  { name: '서울특별시', code: 'seoul', children: [{ name: '강남구', code: 'gangnam' }, { name: '서초구', code: 'seocho' }, { name: '마포구', code: 'mapo' }] },
  { name: '경기도', code: 'gyeonggi', children: [{ name: '성남시', code: 'seongnam' }, { name: '수원시', code: 'suwon' }, { name: '고양시', code: 'goyang' }] }
]

const sportsList = [
  { type: 'football', label: '풋살', src: '@/assets/icons/sports/football.svg' },
  { type: 'tennis', label: '테니스', src: '@/assets/icons/sports/tennis.svg' },
  { type: 'basketball', label: '농구', src: '@/assets/icons/sports/basketball.svg' }
]

// 상태 관리
const selectedSport = ref('')
const meetings = ref([])
const isFloatingMinimized = ref(true)

const filters = reactive({
  sportType: '',
  regionCode: '',
  gender: '전체',
  ageGroup: '전체',
  skillLevel: '전체',
  status: '전체',
  startDate: '',
  endDate: ''
})

// 드롭다운 위치 관련
const filterDropdownOpen = ref(false)
const filterWrap = ref(null)
const dropdownStyle = ref({})

onMounted(() => {
  // 초기에는 필터 없이 전체 조회
  loadMeetings(true);
});


// 필터 '전체' 에러 수정
function sanitizeFilters(filters) {
  const cleaned = {}
  for (const key in filters) {
    const value = filters[key]
    if (Array.isArray(value)) {
      cleaned[key] = value.includes('전체') ? [] : value
    } else {
      cleaned[key] = value === '전체' ? null : value
    }
  }
  return cleaned
}



// async function loadMeetings() {
//   try {
//     // const resp = await api.get('/common-service/meetings');
//     // meetings.value = await fetchMeetingList(filters);
//     // meetings.value = resp.data.data.meetings;
//     meetings.value = await fetchMeetingList(sanitizeFilters(filters));
//
//   } catch (error) {
//     console.error('모임 데이터를 불러오는 중 오류 발생:', error);
//   }
// }
async function loadMeetings(isInitial = false) {
  try {
    const filterParams = isInitial ? {} : sanitizeFilters(filters);
    meetings.value = await fetchMeetingList(filterParams);

    // ✅ 여기에 로그 찍기
    console.log('[DEBUG] 불러온 meetings 개수:', meetings.value.length);
    console.log('[DEBUG] meetings 내용:', meetings.value);

  } catch (error) {
    console.error('모임 데이터를 불러오는 중 오류 발생:', error);
  }
}


function onFilterApply(newFilters) {
  Object.assign(filters, newFilters)
  filterDropdownOpen.value = false
  loadMeetings()
}

function goToMeetingDetail(meetingId) {
  router.push(`/meetings/${meetingId}`);
}

// function handleNavigate(action) {
//   switch (action) {
//     case 'myMeetings': console.log('내 모임 보기'); break
//     case 'create': showModal.create = true; break
//     case 'created': showModal.created = true; break
//     case 'participated': showModal.participated = true; break
//     case 'liked': showModal.interested = true; break
//     case 'pending': showModal.pending = true; break
//     // case 'createMeeting': console.warn('createMeeting 기능은 아직 구현되지 않았습니다.'); break
//     case 'admin': console.warn('admin 기능은 아직 구현되지 않았습니다.'); break
//     default: console.error(`알 수 없는 액션: ${action}`)
//   }
// }
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
    const isAlreadyOpen = showModal[key];
    resetModals();
    showModal[key] = !isAlreadyOpen;
  } else if (action === 'myMeetings') {
    console.log('내 모임 보기');
  } else if (action === 'admin') {
    console.warn('admin 기능은 아직 구현되지 않았습니다.');
  } else {
    console.error(`알 수 없는 액션: ${action}`);
  }
}

function handleCreateModal(type) {
  if (type === 'reserved') {
    router.push('/places');
  }
  if (type === 'map') {
    // router.push('/meetings/create/custom');
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

  showModal.participants = false;
}

function handleInterestedModal() {

  showModal.interested = false;
}

function toggleFilterDropdown() {
  filterDropdownOpen.value = !filterDropdownOpen.value
  if (filterDropdownOpen.value) {
    nextTick(() => {
      const btn = filterWrap.value?.querySelector('.filter-chip-button')
      if (btn) {
        dropdownStyle.value = {
          position: 'absolute',
          top: `${btn.offsetTop + btn.offsetHeight + 16}px`,
          left: `${btn.offsetLeft}px`,
          zIndex: 1000
        }
      }
    })
  }
}
</script>

<template>
  <SidebarMainLayout width="500px">
    <!-- 사이드바 -->
    <template #sidebar>
      <div class="filter-toggle-wrap" ref="filterWrap">
        <SearchSportIcons :sports="sportsList" v-model:selected="selectedSport" />

        <button class="filter-chip-button" @click="toggleFilterDropdown">
          <img src="@/assets/icons/meeting_and_place/filter.svg" alt="필터" width="16" height="16" />
          필터
        </button>

      </div>
        <div v-show="filterDropdownOpen" class="filter-dropdown-panel-num" :style="dropdownStyle">
          <FilterDropdown
            :filters="filters"
            :region-options="regionOptions"
            @update:filters="onFilterApply"
          />
        </div>

      <!-- 전체 모임 목록 추가 -->
<!--      <div class="all-meeting-list">-->
<!--        <h4>전체 모임</h4>-->
<!--        <ul>-->
<!--          <li-->
<!--              v-for="meeting in allMeetings"-->
<!--              :key="meeting.meetingId"-->
<!--              style="margin: 4px 0; font-size: 14px;"-->
<!--              @click="goToMeetingDetail(meeting.meetingId)"-->
<!--          >-->
<!--            {{ meeting.title }}-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

      <!-- 모임 카드 리스트 -->
      <MeetingCard v-for="meeting in meetings" :key="meeting.meetingId" :meeting="meeting" @click="goToMeetingDetail(meeting.meetingId)" />
    </template>
    <!-- 지도 -->
    <template #main>
      <MapDisplay :items="meetings" mapType="meeting" />


    <!-- 플로팅 네비게이션 -->
    <FloatingNav
      :minimized="isFloatingMinimized"
      @toggle="isFloatingMinimized = !isFloatingMinimized"
      @navigate="handleNavigate"
    />


    <!-- 모임 개설 모달 -->
    <CreateMeetingModal v-if="showModal.create" @close="showModal.create = false" @select="handleCreateModal"/>
    <!-- 개설한 모임 모달 -->
    <CreatedMeetingsModal v-if="showModal.created" @close="showModal.created = false" @select="handleCreatedModal" />
    <!-- 개설 모임 관리 모달 -->
    <MeetingManageModal :visible="showModal.manage" :meeting="selectedMeeting" @close="showModal.manage = false" @select="handleManageModal" />
    <!-- 참가한 모임 모달 -->
    <ParticipatingMeetingsModal v-if="showModal.participated" @close="showModal.participated = false" @select="handleParticipatedModal" />
    <!-- 참가자 목록 조회 모달 -->
    <ParticipantsModal :visible="showModal.participants" :meeting="selectedMeeting" @close="showModal.participants = false" @select="handleParticipantsModal"/>
    <!-- 참가 신청한 모임 모달 -->
    <PendingMeetingsModal v-if="showModal.pending" @close="showModal.pending = false" @select="handlePendingModal" />
    <!-- 찜한 모임 모달 -->
    <InterestedMeetingsModal v-if="showModal.interested" @close="showModal.interested = false" @select="handleInterestedModal" />
    </template>
  </SidebarMainLayout>
</template>


<style scoped>
.sidebar {
  width: 500px;
}

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

.sport-filter-bar {
  background: #f8f9fb;
  padding: 14px 20px;
  overflow-x: auto;
  white-space: nowrap;
  border-bottom: 1px solid #e0e0e0;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #d0d7de transparent; /* Firefox */
}

.filter-chip-button {
  @apply flex-shrink-0 flex gap-2 ml-4 px-6 py-3 border border-border-subtle rounded-md text-sm text-text-default;
}

.filter-chip-button {
  margin-left: 12px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 24px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
