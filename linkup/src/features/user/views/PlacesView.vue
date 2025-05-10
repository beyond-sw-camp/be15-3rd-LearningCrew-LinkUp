<template>
  <main class="flex-1">
    <div class="mx-auto bg-white">
      <h2 class="text-2xl font-bold mb-8">운영 중인 장소 목록</h2>

      <div class="flex flex-col gap-5">
        <!-- 장소 카드 1 -->
        <div class="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center flex-wrap">
          <div class="flex flex-col gap-2">
            <div class="text-lg font-bold text-gray-900">신촌 풋살 센터</div>
            <div class="text-sm text-gray-500">서울 서대문구 연세로 12</div>
            <div class="text-sm text-blue-500 font-semibold">₩130,000 / 최대 10명</div>
          </div>
          <div class="flex gap-3 mt-3 sm:mt-0">
            <button
              class="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              기본 정보 수정
            </button>
            <button
              class="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              운영 정보 수정
            </button>
          </div>
        </div>

        <!-- 장소 카드 2 -->
        <div class="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center flex-wrap">
          <div class="flex flex-col gap-2">
            <div class="text-lg font-bold text-gray-900">여의도 러닝 트랙</div>
            <div class="text-sm text-gray-500">서울 영등포구 여의도공원로</div>
            <div class="text-sm text-blue-500 font-semibold">₩50,000 / 최대 20명</div>
          </div>
          <div class="flex gap-3 mt-3 sm:mt-0">
            <button
              class="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              기본 정보 수정
            </button>
            <button
              class="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              운영 정보 수정
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Tailwind 기반이라 별도 스타일은 필요 없습니다. */
</style>
