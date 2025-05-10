<template>
  <div class="community-container">
    <!-- 검색 + 글쓰기 -->
    <div class="search-write-container">
      <div class="search-container">
        <select v-model="searchType">
          <option value="all">제목+본문</option>
          <option value="title">제목</option>
          <option value="content">본문</option>
          <option value="nickname">닉네임</option>
        </select>
        <input v-model="searchKeyword" type="text" placeholder="검색어를 입력하세요" />
        <button @click="searchPosts">검색</button>
      </div>
      <button class="write-button" @click="goToWrite">✏️ 글쓰기</button>
    </div>
    <!-- 게시글 목록 -->
    <div id="postContainer">

      <!-- 공지사항 영역 -->
      <div class="notice-section" v-if="noticePosts.length">

        <CommunityPostCard
            v-for="post in noticePosts"
            :key="'notice-' + post.postId"
            :post="post"
            @click="goToDetail(post.postId)"
        />
      </div>
      <!-- 일반 게시글 영역 -->
      <CommunityPostCard
          v-for="post in generalPosts"
          :key="post.postId"
          :post="post"
          @click="goToDetail(post.postId)"
      />



      <div class="load-more" ref="loadTrigger">
        <p v-if="isLoading">불러오는 중...</p>
        <p v-else-if="isLastPage">마지막 게시글입니다.</p>
        <p v-else>스크롤을 내려 더 많은 글을 확인하세요...</p>
      </div>
    </div>



  </div>

</template>

<script setup>
import {fetchPosts} from '@/features/community/communityApi';
import CommunityPostCard from '@/features/community/components/CommunityPostCard.vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';

const allPosts = ref([]);
const page = ref(1);
const size = 10;
const isLoading = ref(false);
const isLastPage = ref(false);
const loadTrigger = ref(null);

const searchType = ref('all');
const searchKeyword = ref('');
const router = useRouter();
const route = useRoute();


const noticePosts = computed(() => allPosts.value.filter(p => p.isNotice === 'Y'));
const generalPosts = computed(() => allPosts.value.filter(p => p.isNotice !== 'Y'));


const loadPosts = async () => {
  if (isLoading.value || isLastPage.value) return;
  isLoading.value = true;
  try {
    const response = await fetchPosts(
        page.value,
        size,
        searchType.value === 'all' ? null : searchType.value,
        searchKeyword.value
    );
    const { posts: newPosts, pagination } = response.data.data;

    allPosts.value.push(...newPosts);
    isLastPage.value = pagination.totalPage === page.value;
    page.value++;
  } catch (err) {
    console.error('게시글 불러오기 실패:', err);
  } finally {
    isLoading.value = false;
  }
};


const searchPosts = async () => {
  isLoading.value = true;
  page.value = 1;
  isLastPage.value = false;

  try {
    const response = await fetchPosts(
        page.value,
        size,
        searchType.value === 'all' ? null : searchType.value,
        searchKeyword.value
    );
    const { posts: newPosts, pagination } = response.data.data;
    allPosts.value = newPosts;
    isLastPage.value = pagination.totalPage === page.value;
    page.value++;
  } catch (err) {
    console.error('검색 실패:', err);
  } finally {
    isLoading.value = false;
  }
};

const goToWrite = () => {
  router.push('/community/write');
};

const goToDetail = (id) => {
  router.push(`/community/${id}`);
};


onMounted(() => {
  if (route.query.refreshed) {
    // 새로고침 요청인 경우 → 초기화하고 불러오기
    allPosts.value = [];
    page.value = 1;
    isLastPage.value = false;
    loadPosts();

    // URL query 정리 (뒤로가기시 중복 호출 방지)
    router.replace({
      query: {
        ...route.query,
        refreshed: undefined,
      },
    });
  } else {
    loadPosts();
  }

  const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      { threshold: 0.5 }
  );
  if (loadTrigger.value) observer.observe(loadTrigger.value);
});



</script>

<style>

.community-container {
  max-width: 800px;
  margin: 0 auto 40px;
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
}

.search-write-container {
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-grow: 1;
  max-width: 500px;
}

.search-container select,
.search-container input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.search-container button {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #4763f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.write-button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #4763f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.post {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  transition: 0.2s;
  text-decoration: none;
  color: inherit;
  min-height: 220px; /* 카드의 최소 높이를 설정 */
  flex-direction: column; /* 제목, 본문을 수직으로 정렬 */
}

.post:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  border-radius: 12px;
  object-fit: cover;
  background-color: #ddd;
}

.post-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-height: 45px; /* 제목 길이를 제한 */
}

.post-text {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 60px; /* 본문 길이를 제한 */
}

.post-footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-top: 10px;
}

.load-more {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #999;
}

.notice-section {
  margin-bottom: 20px;
  background-color: #f9f9ff;
  padding: 15px;
  border-left: 4px solid #4a6cf7;
}

.notice-post {
  background-color: #f0f8ff;
  border: 1px solid #a3c6ff;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.notice-post .post-title {
  font-weight: bold;
  color: #174ea6;
}

.notice-post .post-text {
  color: #333;
}

</style>