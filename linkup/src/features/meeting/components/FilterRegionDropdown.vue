<template>
  <div class="region-selector">
    <!-- 선택된 지역 요약 -->
    <div class="region-selected-row">
      <button class="region-btn main-region-btn" @click="toggleDropdown">
        {{ selectedMain }}
      </button>
      <button class="region-btn sub-region-btn" @click="toggleDropdown">
        {{ selectedSub }}
      </button>
    </div>

    <!-- 드롭다운 -->
    <div v-show="showDropdown" class="region-dropdown-scroll">
      <!-- 시/도 목록 -->
      <div class="region-category-list scroll">
        <ul>
          <li
            v-for="[area] in areaList"
            :key="area"
            :class="{ active: selectedMain === area }"
            @click="selectMain(area)"
          >
            {{ area }}
          </li>
        </ul>
      </div>

      <!-- 시/군/구 목록 -->
      <div class="region-subcategory-list scroll" ref="subListRef">
        <ul>
          <li
            v-for="sub in currentSubList"
            :key="sub"
            :class="{ active: selectedSub === sub }"
            @click="selectSub(sub)"
          >
            {{ sub }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const areas = {
  '서울': ['강남', '건대입구', '가양', '노원', '도곡', '신림', '영등포'],
  '경기/인천': ['수원', '성남', '고양', '인천', '부천'],
  '충청/대전': ['대전', '천안', '청주'],
  '전라/광주': ['광주', '전주', '목포'],
  '경북/대구': ['대구', '구미', '포항'],
  '경남/부산/울산': ['부산', '울산', '창원'],
  '강원': ['춘천', '강릉'],
  '제주': ['제주시', '서귀포시']
}

const selectedMain = ref('전체')
const selectedSub = ref('전체')
const showDropdown = ref(false)
const subListRef = ref(null)

const areaList = Object.entries(areas)
const currentSubList = computed(() =>
  selectedMain.value === '전체' ? [] : areas[selectedMain.value] || []
)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectMain(area) {
  selectedMain.value = area
  selectedSub.value = '전체'
}

function selectSub(sub) {
  selectedSub.value = sub
  emit('update:modelValue', sub)
  showDropdown.value = false

  nextTick(() => {
    const activeEl = subListRef.value?.querySelector('.active')
    activeEl?.scrollIntoView({ behavior: 'auto', block: 'center' })
  })
}

watch(() => props.modelValue, (val) => {
  for (const [main, subs] of areaList) {
    if (subs.includes(val)) {
      selectedMain.value = main
      selectedSub.value = val
      return
    }
  }
  selectedMain.value = '전체'
  selectedSub.value = '전체'
})
</script>

<style scoped>
/* ---------------- 지역 필터 ---------------- */
.region-buttons {
  display: flex;
}
.region-btn {
  cursor: pointer;
  transition: all 0.2s ease;
}
.region-btn:hover {
  background: #f0f0f0;
}
.region-btn.active {
  background: #5790FF;
  color: #fff;
  border-color: #5790FF;
}
.region-dropdown {
  position: absolute;
  top: 50px;
  display: none;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 10;
}
.region-dropdown.show {
  display: flex;
}
.region-category-list, .region-subcategory-list {
  width: 160px;
  background: #fafafa;
  border-radius: 8px;
  max-height: 260px;
  overflow-y: auto;
}
.region-category-list ul, .region-subcategory-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.region-category-list li, .region-subcategory-list li {
  padding: 12px 14px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.region-category-list li.active, .region-subcategory-list li.active {
  background: #3461F6;
  color: #fff;
  font-weight: bold;
}
.region-category-list li.active::after {
  content: "✔";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

/* ---------------- 필터 영역 ---------------- */
.filter-box {
  background: #fff;
  border-radius: 12px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}
.filter-item span {
  font-weight: 500;
  white-space: nowrap;
}
.filter-item select,
.region-btn {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 12px;
  border: 1.5px solid #dcdfe5;
  background: #fff;
  color: #333;
  width: 80px;
  text-align: center;
}
.filter-item input[type="text"] {
  flex: 1;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 10px;
  border: 1.5px solid #dcdfe5;
  background: #fff;
}
.filter-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.filter-item.grow {
  flex: 1;
}
.search-btn {
  padding: 8px 16px;
  font-size: 14px;
  background: #5790FF;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 60px;
}
.search-btn:hover {
  background: #5790FF;
}

/* 지역 필터 */
.region-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  width: 100%;
}

.region-selected-row {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.region-btn {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fff;
  font-weight: 500;
  cursor: pointer;
}

.region-btn.active {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
}

.region-dropdown-scroll {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  height: 200px;
}

.scroll {
  width: 50%;
  overflow-y: auto;
  padding: 8px;
  background: #f9f9f9;
}

.scroll ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.scroll li {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
}

.scroll li.active {
  background-color: #5790FF;
  color: white;
}

.scroll {
  overflow-y: auto;
  scrollbar-width: none;
}

.scroll::-webkit-scrollbar {
  display: none;
}
</style>
