<script setup>
/**
 * 이 컴포넌트는 상위에서:
 * - 'close' 이벤트 → 모달 닫기
 * - 'select' 이벤트 → reserved/map 중 선택 반환
 */
</script>


<template>
  <div class="create-modal">
    <div class="modal-box">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h2>모임 개설 유형을 선택해주세요</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <!-- 직접 지정 개설 -->
      <div class="option-card" @click="$emit('select', 'reserved')">
        <div class="option-icon">
          <img src="@/assets/icons/meeting_and_place/place.svg" alt="장소 예약" class="icon-img"/>
        </div>
        <div class="option-text">
          <div class="option-title">장소 예약 모임 개설</div>
          <div class="option-sub">예약할 장소를 먼저 선택한 후 모임을 개설합니다.</div>
        </div>
      </div>

      <!-- 지도 선택 개설 -->
      <div class="option-card" @click="$emit('select', 'map')">
        <div class="option-icon">
          <img src="../../../assets/icons/meeting_and_place/sidebar-create_meeting.svg" alt="지정 주소" class="icon-img"/>
        </div>
        <div class="option-text">
          <div class="option-title">지정 주소 모임 개설</div>
          <div class="option-sub">지도를 통해 장소를 선택한 후 모임을 개설합니다.</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.option-icon .icon-img {
  width: 28px;
  height: 28px;
  margin-top: 2px;
}

/* ---------------- 모임 개설 선택 모달 ---------------- */
.create-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-modal .modal-box {
  background: #ffffff;
  border-radius: 24px;
  padding: 40px 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.create-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.create-modal .modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.create-modal .close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #94a3b8;
}


.option-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
  background-color: #f5f8ff;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.1s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.option-card:hover {
  background-color: #e8f0ff;
  transform: translateY(-2px);
}

.option-icon {
  font-size: 28px;
  color: #4f46e5;
  margin-top: 2px;
}

.option-text .option-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.option-text .option-sub {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}


/* ---------------- 모임 목록 모달 ---------------- */
.assignment-modal {
  position: fixed;
  top: 160px; /* 정확히 두 번째 버튼과 정렬 */
  right: 90px; /* 버튼 오른쪽 여백 기준 */
  width: 27%; /* 모달 너비 확장 */
  min-width: 500px; /* 최소 너비 설정 */
  max-width: 600px; /* 최대 너비 설정 */
  background-color: #ffffff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
}
.assignment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  font-size: 22px; /* 헤더 폰트 크기 증가 */
  font-weight: 700;
  color: #111827;
}
.assignment-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.assignment-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
}
.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.material-symbols-outlined.card {
  font-size: 16px !important;
}
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1;
  color: #E64980;
}
</style>

