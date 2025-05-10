<template>
  <main class="mypage-content">
    <div class="main-wrapper">
      <h2 class="section-title">월별 정산 대금 조회</h2>

      <!-- 요약 박스 -->
      <section class="settlement-summary">
        <div class="settlement-info">
          <div class="info-title">4월 총 정산 대금</div>
          <div class="info-amount">₩5,320,000</div>
        </div>

        <div class="month-selector">
          <label for="month">월 선택</label>
          <select id="month">
            <option>2025년 04월</option>
            <option>2025년 03월</option>
            <option>2025년 02월</option>
            <option>2025년 01월</option>
          </select>
        </div>
      </section>

      <!-- 정산 상세 -->
      <section class="settlement-details">
        <h3 class="details-title">정산 내역</h3>
        <table class="settlement-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>장소명</th>
              <th>참가 인원</th>
              <th>총 금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025.04.05</td>
              <td>신촌 풋살 센터</td>
              <td>12명</td>
              <td>₩240,000</td>
            </tr>
            <tr>
              <td>2025.04.12</td>
              <td>강남 테니스장</td>
              <td>8명</td>
              <td>₩320,000</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>

<style scoped>
.mypage-content {
  @apply flex-1;
}

.main-wrapper {
  @apply max-w-xl mx-auto bg-white;
}

.section-title {
  @apply text-2xl font-bold mb-4;
}

.settlement-summary {
  @apply bg-white p-6 rounded-xl shadow mb-8;
}

.settlement-info {
  @apply text-center mb-6;
}

.info-title {
  @apply text-base text-gray-500 mb-2;
}

.info-amount {
  @apply text-3xl font-bold text-blue-700;
}

.month-selector {
  @apply flex justify-center items-center gap-3;
}

.month-selector label {
  @apply font-semibold text-gray-600;
}

.month-selector select {
  @apply px-4 py-2 rounded-lg border border-gray-300 text-base;
}

.settlement-details {
  @apply mt-10;
}

.details-title {
  @apply text-xl font-semibold mb-4;
}

.settlement-table {
  @apply w-full border-collapse;
}

.settlement-table th,
.settlement-table td {
  @apply py-3 px-4 text-center border-b border-gray-200;
}

.settlement-table th {
  @apply bg-gray-100 text-gray-500 font-semibold;
}

.settlement-table td {
  @apply text-sm text-gray-700;
}
</style>
