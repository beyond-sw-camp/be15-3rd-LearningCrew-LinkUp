<script setup>
import { computed, ref, watch } from 'vue'
import AdminButton from '@/features/admin/components/AdminButton.vue'

// Props
const props = defineProps({
  title: String,
  filters: Object
})

const emit = defineEmits(['search', 'update:filters'])

// 제목 여부 확인
const hasTitle = computed(() => props.title?.trim())

// 로컬 복사본 생성 (props.filters는 반응형 아님)
const localFilters = ref({ ...props.filters })

// localFilters 변경 시 부모로 emit
watch(localFilters, (newVal) => {
  emit('update:filters', newVal)
}, { deep: true })

// 검색 버튼 클릭 시 emit
const triggerSearch = () => {
  console.log('[AdminFilter] 검색 버튼 눌림', localFilters.value)  // 디버깅용
  emit('search', localFilters.value)  // localFilters 값을 emit하여 부모에서 처리하도록 함
}
</script>

<template>
  <section class="filter-wrapper" role="search" aria-labelledby="filter-title">
    <!-- 제목 -->
    <h1 v-if="hasTitle" id="filter-title" class="page-title">
      {{ props.title }}
    </h1>

    <!-- 필터 form -->
    <form class="filter-box" @submit.prevent="triggerSearch">
      <fieldset class="filter-fields">
        <legend class="sr-only">필터 조건 입력 영역</legend>

        <!-- scoped slot: 로컬 filters 전달 -->
        <slot name="filters" :filters="localFilters" />
      </fieldset>

      <!-- 검색 버튼 -->
      <AdminButton
        type="primary"
        aria-label="검색 버튼"
        native-type="submit"
      >
        검색
      </AdminButton>
    </form>
  </section>
</template>

<style scoped>
.filter-wrapper {
  display: flex;
  margin-bottom: 12px;
  justify-content: space-between;
}

.filter-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

.filter-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 6px;
}

.select-box {
  margin-left: 12px;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
}

.filter-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  border: 0;
  padding: 0;
  margin: 0;
}

.input-box {
  min-width: 160px;
}

select,
input[type="text"] {
  height: 32px;
  padding: 4px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
}

select:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #7d6fb3;
  box-shadow: 0 0 0 2px rgba(125, 111, 179, 0.2);
}

</style>
