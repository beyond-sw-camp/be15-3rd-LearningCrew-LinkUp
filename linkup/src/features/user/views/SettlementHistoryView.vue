<template>
  <main class="mypage-content">
    <div class="main-wrapper">
      <h2 class="section-title">정산 내역 조회</h2>

      <section class="settlement-history">
        <div class="filter-section">
          <label for="search-month">정산 월 선택</label>
          <select id="search-month">
            <option>2025년 04월</option>
            <option>2025년 03월</option>
            <option>2025년 02월</option>
          </select>
        </div>

        <table class="history-table">
          <thead>
            <tr>
              <th>정산 ID</th>
              <th>정산일</th>
              <th>정산 금액</th>
              <th>정산 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#SETT202504001</td>
              <td>2025.04.25</td>
              <td>₩3,500,000</td>
              <td><span class="status completed">정산 완료</span></td>
            </tr>
            <tr>
              <td>#SETT202503001</td>
              <td>2025.03.25</td>
              <td>₩2,800,000</td>
              <td><span class="status completed">정산 완료</span></td>
            </tr>
            <tr>
              <td>#SETT202502001</td>
              <td>2025.02.25</td>
              <td>₩3,100,000</td>
              <td><span class="status pending">정산 대기</span></td>
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
  @applyo bg-white;
}

.section-title {
  @apply text-2xl font-bold mb-4;
}

.settlement-history {
  @apply bg-white p-6 rounded-xl;
}

.filter-section {
  @apply flex items-center gap-3 mb-6;
}

.filter-section label {
  @apply font-semibold text-gray-600;
}

.filter-section select {
  @apply px-3 py-2 rounded-lg border border-gray-200 text-base;
}

.history-table {
  @apply w-full border-collapse;
}

.history-table th,
.history-table td {
  @apply px-3 py-3 text-center border-b border-gray-200;
}

.history-table th {
  @apply bg-gray-50 text-gray-500 font-semibold;
}

.history-table td {
  @apply text-sm text-gray-700;
}

.status {
  @apply px-3 py-1 rounded-full text-sm font-semibold;
}

.status.completed {
  @apply bg-green-100 text-green-500;
}

.status.pending {
  @apply bg-yellow-100 text-yellow-400;
}
</style>
