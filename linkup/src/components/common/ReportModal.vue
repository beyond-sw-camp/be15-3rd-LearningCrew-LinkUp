<script setup>
import { computed, ref, onMounted } from 'vue'
import { fetchReportTypes } from '@/api/admin.js'
// import '@/assets/css/report-styles.css'

const props = defineProps({
  modelValue: Boolean,
  type: String, // 'user' | 'post' | 'comment'
  targetInfo: Object // { content: string, nickname: string }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const reason = ref('')
const reportTypeId = ref(null)
const reportTypes = ref([]) // 신고 유형 목록

// 신고 유형 API 호출
onMounted(async () => {
  try {
    const res = await fetchReportTypes()
    reportTypes.value = res.data
    if (reportTypes.value.length > 0) {
      reportTypeId.value = reportTypes.value[0].id
    }
  } catch (e) {
    console.error('🚨 신고 유형 로딩 실패:', e)
    reportTypes.value = []
  }
})

const title = computed(() => {
  return props.type === 'user'
    ? '사용자 신고'
    : props.type === 'post'
      ? '게시글 신고'
      : '댓글 신고'
})

const contentLabel = computed(() => {
  return props.type === 'user' ? '닉네임'
    : props.type === 'post' ? '게시글 내용'
      : '댓글 내용'
})

const handleSubmit = () => {
  if (!reportTypeId.value || !reason.value.trim()) {
    alert('신고 유형과 신고 사유를 모두 입력해주세요.')
    return
  }

  emit('submit', {
    type: props.type,
    reportTypeId: reportTypeId.value,
    reason: reason.value
  })
  emit('update:modelValue', false)
}
</script>

<template>
  <div class="modal" @click.self="$emit('update:modelValue', false)">
    <div class="report-modal">
      <h2 class="modal-report-title">{{ title }}</h2>

      <!-- 대상 정보 -->
      <div class="modal-report-section">
        <div class="info-grid-user">
          <div class="section-title">
            {{ props.type === 'user' ? '사용자 정보' : props.type === 'post' ? '게시글 정보' : '댓글 정보' }}
          </div>
          <div class="info-item-user">
            <div class="label">{{ contentLabel }}</div>
            <div class="value">{{ targetInfo.content }}</div>
          </div>
        </div>
      </div>

      <!-- 신고자 정보 -->
      <div class="modal-report-section">
        <div class="info-grid-user">
          <div class="section-title">신고자 정보</div>
          <div class="info-item info-item-user">
            <div class="label">신고자 닉네임</div>
            <div class="value">{{ targetInfo.nickname }}</div>
          </div>
        </div>
      </div>

      <!-- 신고 유형 -->
      <div class="modal-report-section">
        <div class="section-title">신고 내용</div>
        <div class="info-grid-input">
          <div class="info-item">
            <div class="label">신고 유형</div>
            <div class="value">
              <select v-model.number="reportTypeId" class="modal-select">
                <option v-for="type in reportTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 신고 사유 -->
      <div class="modal-report-section">
        <div class="section-title">신고 사유</div>
        <div class="info-grid-input">
          <div class="info-item">
            <div class="value">
              <textarea
                v-model="reason"
                rows="4"
                placeholder="신고 내용을 작성해 주세요."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="modal-buttons">
        <button class="btn btn-approve" @click="handleSubmit">제출</button>
        <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기본 글꼴 및 초기화 */
body {
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  background-color: #f8f8fc;
  color: #333;
}

/* 컨테이너 레이아웃 */
.container {
  max-width: 800px;
  margin: 80px auto;
  padding: 0 24px;
}

/* 신고 모달 컨테이너 */
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.report-modal {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  width: 600px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 제목 */
.modal-report-title {
  margin-top: 16px;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

/* 섹션 제목 */
.modal-report-section {
  margin-bottom: 12px;
  padding-top: 12px;
}

/* 라벨/값 배치용 그리드 */
.info-grid-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.info-grid-input {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  flex: 1;
}

.info-item-user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.label {
  font-size: 14px;
  color: #777;
  margin-bottom: 6px;
}

.value {
  font-weight: 600;
  font-size: 15px;
}

/* section 타이틀 */
.section-title {
  font-weight: 600;
  font-size: 16px;
  color: #365EC9;
  margin-bottom: 12px;
  border-left: 4px solid #365EC9;
  padding-left: 10px;
}

/* 셀렉트 스타일 */
.modal-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  background: white;
}

/* 텍스트에어리어 */
textarea {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  resize: vertical;
  min-height: 120px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);
}

/* 버튼 */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: 0.2s all ease;
}

.btn-approve {
  background-color: #365EC9;
  color: white;
}

.btn-approve:hover {
  background-color: #5c67d3;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #444;
}

.btn-secondary:hover {
  background-color: #e2e2e2;
}
</style>