<template>
  <div ref="mapContainer" class="map-wrapper">
    <!-- 설정 아이콘 (지도 우측 상단 고정) -->
    <div class="gear-icon">
      <img src="@/assets/icons/meeting_and_place/sidebar-gear.svg" alt="설정" width="24" height="24" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'

const props = defineProps({
  meetings: Array
})
const emit = defineEmits(['select'])

const mapContainer = ref(null)
let map = null
let markers = []

function loadMapScript() {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=12dbd011a1ea44fdcaf77a5d5bdb81bc&autoload=false&libraries=services`
      script.onload = () => kakao.maps.load(resolve)
      document.head.appendChild(script)
    }
  })
}

function initMap() {
  const center = new kakao.maps.LatLng(37.5665, 126.9780)
  map = new kakao.maps.Map(mapContainer.value, {
    center,
    level: 5
  })
}

function setMarkers(meetings) {
  if (!Array.isArray(meetings)) return

  markers.forEach(marker => marker.setMap(null))
  markers = []

  meetings.forEach(meeting => {
    if (!meeting.lat || !meeting.lng) return
    const markerPosition = new kakao.maps.LatLng(meeting.lat, meeting.lng)
    const marker = new kakao.maps.Marker({ position: markerPosition, map })

    kakao.maps.event.addListener(marker, 'click', () => {
      emit('select', meeting.meetingId)
    })

    markers.push(marker)
  })

  if (meetings.length > 0 && meetings[0].lat && meetings[0].lng) {
    map.setCenter(new kakao.maps.LatLng(meetings[0].lat, meetings[0].lng))
  }
}

onMounted(async () => {
  await loadMapScript()
  initMap()
  if (Array.isArray(props.meetings)) {
    setMarkers(props.meetings)
  }
})

watch(() => props.meetings, (newVal) => {
  if (map && Array.isArray(newVal)) {
    setMarkers(newVal)
  }
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.gear-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
  background-color: white;
  border-radius: 9999px;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
