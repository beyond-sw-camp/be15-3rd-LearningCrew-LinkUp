<template>
  <div class="community-detail">
    <!-- 목록 + 액션버튼 묶어서 한 줄에 배치 -->
    <div class="button-row">
      <!-- 목록으로 돌아가기 -->
      <button class="back-button" @click="goBack">
        ← 목록으로
      </button>

      <!-- 수정/삭제/신고 버튼 -->
      <div class="action-buttons">
        <button @click="editPost">수정</button>
        <button @click="deletePost">삭제</button>
        <button @click="reportPost">신고</button>
      </div>
    </div>

    <!-- 제목 -->
    <h1 class="post-title">{{ post?.title }}</h1>

    <div class="author-row">
    <!-- 작성자 정보 -->
    <div class="author-info">
      <img :src="post?.profileImageUrl || defaultImage"
           alt="프로필"
           class="author-img"
           @click="openMiniProfile($event, post?.userId)" />
      <div>
        <div class="nickname" @click="openMiniProfile($event, post?.userId)">
          {{ post?.nickname }}
        </div>
        <div class="date">작성일: {{ formatDate(post?.createdAt) }}</div>
      </div>
    </div>
    </div>

    <div class="like-section" @click="toggleLike" style="cursor: pointer;">
           <span v-if="isLiked">
        <img src="@/assets/icons/community/heart.svg" alt="하트"  class="like-icon"/>
      </span>
      <span v-else>
        <img src="@/assets/icons/community/empty_heart.svg" alt="빈하트" class="like-icon" />
      </span>
      {{ post?.likeCount || 0 }}





      <!-- 게시글 이미지 -->
    <div class="post-images" v-if="post?.imageUrls?.length">
      <img
          v-for="(url, index) in post.imageUrls"
          :key="index"
          :src="url"
          class="post-image"
          alt="게시글 이미지"
      />
    </div>

    <!-- 게시글 본문 -->
    <div class="post-box">
      <p class="content">{{ post?.content }}</p>
      <div class="post-footer">
        <div></div>
<!--        <div class="like-section" @click="toggleLike" style="cursor: pointer;">-->
<!--           <span v-if="isLiked">-->
<!--        <img src="@/assets/icons/community/heart.svg" alt="하트"  class="like-icon"/>-->
<!--      </span>-->
<!--          <span v-else>-->
<!--        <img src="@/assets/icons/community/empty_heart.svg" alt="빈하트" class="like-icon" />-->
<!--      </span>-->
<!--          {{ post?.likeCount || 0 }}-->


        </div>
    </div>



    <PostCommentForm
        :postId="post?.postId"
        :onCommentAdded="fetchPost"
    />

    <!-- 댓글 리스트 -->
      <div class="comments" v-if="post?.comments?.length">
        <h2 class="comment-header-title">
          <img src="@/assets/icons/community/comments.svg" alt="댓글" class="like-icon" />
          {{ post?.comments?.length || 0 }}
        </h2>

      <div class="comment" v-for="comment in post.comments" :key="comment.commentId">
        <div class="comment-header">
          <img :src="comment.profileImageUrl || defaultImage"
               class="comment-img"
               alt="comment_img"
               @click="openMiniProfile($event, comment.userId)" />
          <div class="comment-meta">
            <div class="comment-user">
          <span class="comment-nickname" @click="openMiniProfile($event, comment.userId)">
            {{ comment.nickname }}
          </span>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              <span class="comment-like">❤️ {{ comment.likeCount || 0 }}</span>
            </div>
            <p class="comment-content">{{ comment.commentContent }}</p>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- 미니 프로필 컴포넌트 삽입 예정 위치 -->
    <UserMiniProfile
        v-if="showProfile"
        :user="selectedUser"
        :position="profilePosition"
        @close="closeMiniProfile"
    />
  </div>

  <PostCompleteModal
      v-if="isAuthorMismatch"
      title="접근 불가"
      message="작성자만 수정할 수 있습니다."
      @confirm="isAuthorMismatch = false"
      @close="isAuthorMismatch = false"
  />

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/features/community/communityApi';
import {getUserProfile} from "@/api/user.js";
import UserMiniProfile from "@/features/community/components/UserMiniProfile.vue";
import PostCommentForm from "@/features/community/components/PostCommentForm.vue";
import PostCompleteModal from '@/features/community/components/CommunityModal.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isAuthorMismatch = ref(false);
const route = useRoute();
const router = useRouter();
const postId = computed(() => route.params.id);
const post = ref(null);
const isLiked = ref(false);
const newComment = ref('');


const showProfile = ref(false);
const selectedUser = ref(null);
const profilePosition = ref({ x: 0, y: 0 });
const defaultImage = 'https://api.dicebear.com/7.x/thumbs/svg?seed=%EA%B1%B4%ED%9D%AC';

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

const fetchPost = async () => {
  try {
    const res = await api.fetchPostById(postId.value);
    console.log('[DEBUG] 게시글 데이터:', res.data.data);
    post.value = res.data.data;
    isLiked.value = res.data.data.isLiked;
  } catch (e) {
    console.error('상세 조회 실패', e);
  }
};

const toggleLike = async () => {
  try {
    if (!post.value?.postId) return;
    const userId = authStore.userId;

    if (isLiked.value) {
      await api.unlikePost(post.value.postId, userId);
      post.value.likeCount--;
    } else {
      await api.likePost(post.value.postId, userId);
      post.value.likeCount++;
    }

    isLiked.value = !isLiked.value;
    console.log('[DEBUG] toggleLike 실행됨');
  } catch (e) {
    console.error('좋아요 토글 실패', e.response?.data || e.message);
    alert('좋아요 요청에 실패했습니다.');
  }
};

const editPost = async () => {
  if (!post.value?.postId) {
    alert('게시글 정보를 찾을 수 없습니다.');
    return;
  }

  const userId = authStore.userId;

  // 🔍 서버로부터 정확한 작성자 정보 재조회
  try {
    const res = await api.fetchPostById(post.value.postId);
    const postData = res.data.data;

    // if (postData.userId !== userId) {
    if (Number(postData.userId) !== Number(userId)) {
      console.log('userId', postData.userId)
      console.log('userId', userId)
      isAuthorMismatch.value = true; // 모달 열기
      return;
    }

    // 작성자인 경우에만 이동
    await router.push({name: 'PostEdit', params: {postId: post.value.postId}});

  } catch (err) {
    console.error('게시글 확인 실패', err);
    alert('게시글을 확인할 수 없습니다.');
  }
};

const goBack = () => {
  router.back();
};

const deletePost = async () => {
  if (!post.value?.postId) {
    alert('삭제할 게시글이 없습니다.');
    return;
  }

  const confirmed = confirm('정말 삭제하시겠습니까?');
  if (!confirmed) return;

  const userId = authStore.userId;

  try {
    await api.deletePost(post.value.postId, userId);
    alert('게시글이 삭제되었습니다.');
    router.push({ name: 'CommunityList' }); // ✅ 목록 페이지로 이동
  } catch (e) {
    console.error('게시글 삭제 실패:', e.response?.data || e.message);
    alert('삭제 중 오류가 발생했습니다.');
  }
};


const openMiniProfile = async (event, targetId) => {
  try {
    const res = await getUserProfile({ targetId });
    // console.log('[DEBUG] 프로필 응답:', res.data.data);
    // console.log('user.id', res.data.data.member.user.userId)
    selectedUser.value = res.data.data.member;

    const targetEl = event.currentTarget || event.target;
    if (!targetEl || !targetEl.getBoundingClientRect) return;

    const rect = targetEl.getBoundingClientRect();
    profilePosition.value = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY + 8,
    };

    showProfile.value = true;
  } catch (e) {
    console.error('프로필 조회 실패', e);
  }
};


const closeMiniProfile = () => {
  showProfile.value = false;
};

onMounted(fetchPost);
</script>

<style scoped>
.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.community-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}
.back-button {
  background: none;
  border: none;
  font-size: 1rem;
  color: #555;
  cursor: pointer;
  text-decoration: underline;
}
.post-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.author-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.nickname {
  font-weight: bold;
}
.date {
  font-size: 0.9rem;
  color: #888;
}
.action-buttons {
  display: flex;
  gap: 10px;
}
.action-buttons button {
  padding: 8px 16px;
  background-color: #5790ff;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  //padding: 6px 12px;
  //border: none;
  //border-radius: 6px;
  //background-color: #f0f0f0;
  //cursor: pointer;
  //box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  //transition: background-color 0.3s ease;
}
.action-buttons button:hover {
  background-color: #3548d3;
  //background-color: #d0d0ff;
}
.post-images {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.post-image {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
}
.post-box {
  background-color: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}
.content {
  font-size: 1.1rem;
  margin-bottom: 20px;
}
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.like-section {
  font-size: 1.2rem;
}
.comment {
  margin-bottom: 20px;
}
.comment-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.comment-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}
.comment-meta {
  flex: 1;
}
.comment-user {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  margin-bottom: 4px;
}
.comment-nickname {
  font-weight: bold;
}
.comment-date {
  color: #888;
}
.comment-like {
  color: #e25555;
}
.comment-content {
  margin-left: 2px;
  font-size: 1rem;
  white-space: pre-wrap;
}

/* 추가 */
.comment-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.comment-nickname {
  font-weight: bold;
  margin-left: 8px;
}
.comment-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.comment-content {
  margin-bottom: 4px;
  font-size: 1rem;
}

.author-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.like-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
}

.comment-count {
  margin-left: 12px;
  font-size: 1rem;
  color: #555;
}

.comment-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 20px 0 12px;
  color: #333;
}



</style>
