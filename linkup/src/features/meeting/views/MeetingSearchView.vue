<template>
  <div class="container">
    <!-- 사이드바 -->
    <div class="sidebar">
      <!-- 종목 필터 및 상세 필터 버튼 -->
      <div class="filter-toggle-wrap" ref="filterWrap">
        <SearchSportIcons :sports="sportsList" v-model:selected="selectedSport" />
        <button class="filter-chip-button" @click="toggleFilterDropdown">
          <img src="@/assets/icons/meeting_and_place/filter.svg" alt="필터" width="16" height="16" />
          필터
        </button>
      </div>

      <!-- 상세 필터 드롭다운 -->
      <div v-show="filterDropdownOpen" class="filter-dropdown-panel-num" :style="dropdownStyle">
        <FilterDropdown :filters="filters" :region-options="regionOptions" @update:filters="onFilterApply" />
      </div>

      <!-- 전체 모임 목록 -->
      <div class="all-meeting-list">
        <h4>전체 모임</h4>
        <ul>
          <li
            v-for="meeting in allMeetings"
            :key="meeting.meetingId"
            @click="goToMeetingDetail(meeting.meetingId)"
          >
            {{ meeting.title }}
          </li>
        </ul>
      </div>

      <!-- 모임 카드 목록 -->
      <MeetingCard
        v-for="meeting in meetings"
        :key="meeting.meetingId"
        :meeting="meeting"
        @click="goToMeetingDetail(meeting.meetingId)"
      />
    </div>

    <!-- 지도 영역 -->
    <div class="map-section">
      <MapDisplay :places="meetings" @select="goToMeetingDetail" />
    </div>

    <!-- 플로팅 네비게이션 -->
    <FloatingNav
      :minimized="isFloatingMinimized"
      @toggle="isFloatingMinimized = !isFloatingMinimized"
      @navigate="handleNavigate"
    />

    <!-- 모달 -->
    <CreateMeetingModal v-if="showModal.create" @close="showModal.create = false" @select="handleCreateModal" />
    <CreatedMeetingsModal v-if="showModal.created" @close="showModal.created = false" @select="handleCreatedModal" />
    <MeetingManageModal :visible="showModal.manage" :meeting="selectedMeeting" @close="handleManageModal" />
    <ParticipatingMeetingsModal
      v-if="showModal.participated"
      @close="showModal.participated = false"
      @select="handleParticipatedModal"
    />
    <ParticipantsModal :visible="showModal.participants" :meeting="selectedMeeting" @close="handleParticipantsModal" />
    <PendingMeetingsModal v-if="showModal.pending" @close="showModal.pending = false" @select="handlePendingModal" />
    <InterestedMeetingsModal
      v-if="showModal.interested"
      @close="showModal.interested = false"
      @select="handleInterestedModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import SearchSportIcons from '@/features/meeting/components/SearchSportIcons.vue'
import FilterDropdown from '@/features/meeting/components/FilterDropdown.vue'
import FloatingNav from '@/features/meeting/components/FloatingNav.vue'
import MeetingCard from '@/features/meeting/components/MeetingCard.vue'
import MapDisplay from '@/components/common/MapDisplay.vue'
import CreateMeetingModal from '@/features/meeting/views/CreateMeetingModal.vue'
import CreatedMeetingsModal from '@/features/meeting/views/CreatedMeetingsModal.vue'
import ParticipatingMeetingsModal from '@/features/meeting/views/ParticipatingMeetingsModal.vue'
import PendingMeetingsModal from '@/features/meeting/views/PendingMeetingsModal.vue'
import InterestedMeetingsModal from '@/features/meeting/views/InterestedMeetingsModal.vue'
import MeetingManageModal from '@/features/meeting/views/MeetingManageModal.vue'
import ParticipantsModal from '@/features/meeting/views/ParticipantsModal.vue'
import { fetchMeetingList, getAllMeetings } from '@/api/meeting.js'

const router = useRouter()

const showModal = reactive({
  create: false,
  created: false,
  participated: false,
  manage: false,
  participants: false,
  pending: false,
  interested: false
})

const allMeetings = ref([])
const meetings = ref([])
const selectedMeeting = ref(null)
const isFloatingMinimized = ref(true)
const selectedSport = ref('')

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

const regionOptions = [
  { name: '서울특별시', code: 'seoul', children: [{ name: '강남구', code: 'gangnam' }, { name: '서초구', code: 'seocho' }, { name: '마포구', code: 'mapo' }] },
  { name: '경기도', code: 'gyeonggi', children: [{ name: '성남시', code: 'seongnam' }, { name: '수원시', code: 'suwon' }, { name: '고양시', code: 'goyang' }] }
]

const sportsList = [
  { type: 'football', label: '풋살', src: '@/assets/icons/sports/football.svg' },
  { type: 'tennis', label: '테니스', src: '@/assets/icons/sports/tennis.svg' },
  { type: 'basketball', label: '농구', src: '@/assets/icons/sports/basketball.svg' }
]

const filterDropdownOpen = ref(false)
const filterWrap = ref(null)
const dropdownStyle = ref({})

onMounted(() => {
  fetchAllMeetings()
  loadMeetings(true)
})

function fetchAllMeetings() {
  getAllMeetings().then(res => {
    allMeetings.value = res
  }).catch(err => {
    console.error('전체 모임 목록 실패:', err)
  })
}

async function loadMeetings(isInitial = false) {
  const cleaned = sanitizeFilters(filters)
  try {
    meetings.value = await fetchMeetingList(isInitial ? {} : cleaned)
  } catch (err) {
    console.error('모임 목록 불러오기 실패:', err)
  }
}

function sanitizeFilters(filters) {
  const cleaned = {}
  for (const key in filters) {
    const val = filters[key]
    cleaned[key] = Array.isArray(val) ? (val.includes('전체') ? [] : val) : (val === '전체' ? null : val)
  }
  return cleaned
}

function onFilterApply(newFilters) {
  Object.assign(filters, newFilters)
  filterDropdownOpen.value = false
  loadMeetings()
}

function goToMeetingDetail(id) {
  router.push(`/meetings/${id}`)
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

function resetModals() {
  Object.keys(showModal).forEach(key => showModal[key] = false)
}

function handleNavigate(action) {
  const key = {
    create: 'create',
    created: 'created',
    participated: 'participated',
    liked: 'interested',
    pending: 'pending'
  }[action]

  if (key) {
    const isAlreadyOpen = showModal[key]
    resetModals()
    showModal[key] = !isAlreadyOpen
  } else if (action === 'myMeetings') {
    console.log('내 모임 보기')
  } else {
    console.warn('미지원 기능:', action)
  }
}

function handleCreateModal(type) {
  if (type === 'reserved') router.push('/places')
  else if (type === 'map') alert('준비중입니다')
  showModal.create = false
}

function handleCreatedModal(m) {
  selectedMeeting.value = m
  showModal.manage = true
}
function handleManageModal() { showModal.manage = false }
function handleParticipatedModal(m) {
  selectedMeeting.value = m
  showModal.participants = true
}
function handleParticipantsModal() { showModal.participants = false }
function handlePendingModal() { showModal.participants = false }
function handleInterestedModal() { showModal.interested = false }
</script>

<style scoped>
.container {
  @apply flex;
}

.sidebar {
  @apply w-[400px] h-[calc(100vh-80px)] flex flex-col gap-4 pt-5 px-4 overflow-y-auto;
}

.filter-toggle-wrap {
  @apply flex items-center gap-2;
}

.filter-chip-button {
  @apply flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 bg-white hover:bg-gray-100 transition;
}

.filter-dropdown-panel-num {
  @apply bg-white shadow-lg rounded-lg p-4 mt-2 w-[340px];
}

.all-meeting-list {
  @apply mt-4;
}

.all-meeting-list h4 {
  @apply font-semibold mb-2 text-gray-800;
}

.all-meeting-list ul {
  @apply space-y-1;
}

.all-meeting-list li {
  @apply cursor-pointer hover:underline text-sm text-gray-700;
}

.map-section {
  @apply flex-1 min-w-0 relative;
  height: calc(100vh - 80px);
}
</style>
