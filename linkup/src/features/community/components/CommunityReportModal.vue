<template>
  <div class="modal" @click.self="$emit('update:modelValue', false)">
    <div class="report-modal">
      <h2 class="modal-title">{{ title }}</h2>

      <!-- 대상 정보 -->
      <div class="modal-report-section">
        <div class="info-grid-user">
          <div class="section-title">{{ title }} 정보</div>
          <div class="info-item-user">
            <div class="label">{{ contentLabel }}</div>
            <div class="value">{{ targetInfo.content }}</div>
          </div>
        </div>
      </div>


      <div class="modal-report-section">
        <div class="info-grid-user">
          <div class="section-title">신고 대상 정보</div>
          <div class="info-item-user">
            <div class="label">신고 대상 닉네임</div>
            <div class="value">{{ targetInfo.nickname }}</div>
          </div>
        </div>
      </div>

      <!-- 신고 유형 -->
      <select v-model="reason.type">
        <option disabled value="">-- 신고 유형 선택 --</option>
        <option value="욕설/비방">욕설/비방</option>
        <option value="도배/스팸">도배/스팸</option>
        <option value="개인정보 노출">개인정보 노출</option>
        <option value="음란물/불쾌한 콘텐츠">음란물/불쾌한 콘텐츠</option>
        <option value="기타">기타</option>
      </select>

      <!-- 상세 사유 -->
      <textarea v-model="reason.detail" placeholder="신고 사유를 작성해 주세요."></textarea>


      <!-- 버튼 -->
      <div class="modal-buttons">
        <button class="btn btn-approve" @click="handleSubmit">제출</button>
        <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import '@/assets/css/report-styles.css'

const props = defineProps({
  modelValue: Boolean,
  type: String, // 'post' | 'comment'
  targetInfo: Object // { content: '내용', nickname: '홍길동' }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const reason = ref({
  type: '',
  detail: ''
});

const title = computed(() => {
  const map = { post: '게시글', comment: '댓글' }
  return `${map[props.type] || ''} 신고`
})

const contentLabel = computed(() => {
  return props.type === 'post' ? '게시글 제목'
      : props.type === 'comment' ? '댓글 내용'
          : '내용'
})



const handleSubmit = () => {
  if (!reason.value.type || !reason.value.detail.trim()) {
    alert('신고 유형과 상세 사유를 모두 작성해 주세요.')
    return
  }
  emit('submit', reason.value)
  emit('update:modelValue', false)
}


</script>

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