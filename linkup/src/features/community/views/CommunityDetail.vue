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
        <button @click="confirmDeletePost">삭제</button>
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

      <div class="like-section" >

    <img
        v-if="isLiked"
        src="@/assets/icons/community/heart.svg"
        alt="하트"
        class="like-icon"
        @click.stop="toggleLike"
    />
    <img
        v-else
        src="@/assets/icons/community/empty_heart.svg"
        alt="빈하트"
        class="like-icon"
        @click.stop="toggleLike"
    />

        {{ post?.likeCount || 0 }}
      </div>

    </div>



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
        </div>
    </div>



    <PostCommentForm
        :postId="post?.postId"
        :onCommentAdded="fetchPost"
    />

    <!-- 댓글 리스트 -->
      <div class="comments" v-if="post?.comments?.length">

        <h2 class="comment-header-title">
           <span class="comment-info-group">
            <img src="@/assets/icons/community/comments.svg" alt="댓글" class="like-icon" />
            <span class="comment-count">{{ post?.comments?.length || 0 }}</span>
            </span>

          <span class="comment-info-group">
            <img
                :src="totalCommentLikes > 0 ? HeartIcon : EmptyHeartIcon"
                alt="총 댓글 좋아요"
                class="like-icon"
            />
            <span class="comment-like-count">{{ totalCommentLikes }}</span>
            </span>
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


              <div class="comment-footer">
                <div class="comment-actions">
              <span class="comment-like" @click="toggleCommentLike(comment.commentId)" >
              <img :src="comment.liked ? HeartIcon : EmptyHeartIcon" alt="좋아요" class="like-icon" />
              {{ comment.likeCount ?? 0 }}
            </span>


              <button
                  v-if="Number(comment.userId) === Number(authStore.userId)"
                  class="delete-comment-btn"
                  @click.stop="requestDeleteComment(comment.commentId)"
              >
                <img src="@/assets/icons/community/delete.svg" alt="삭제" class="delete-icon" />
              </button>


                <button class="report-comment-btn" @click="reportComment(comment.commentId)">
                  <img src="@/assets/icons/community/report.svg" alt="신고" class="report-icon" />
                </button>
              </div>
            </div>
            </div>
            <p class="comment-content">{{ comment.commentContent }}</p>

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
      v-if="showDeleteModal"
      title="게시글 삭제"
      message="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      @confirm="deletePost"
      @close="showDeleteModal = false"
  />

  <PostCompleteModal
      v-if="showSuccessModal"
      title="삭제 완료"
      :message="successMessage"
      :cancelText="null"
      @confirm="handleSuccessConfirm"
  />

  <PostCompleteModal
      v-if="showCommentDeleteModal"
      title="댓글 삭제"
      message="댓글을 삭제하시겠습니까?"
      @confirm="deleteComment"
      @close="showCommentDeleteModal = false"
  />

  <!-- 댓글 삭제 완료 안내 모달 -->
  <PostCompleteModal
      v-if="showCommentSuccessModal"
      title="삭제 완료"
      :message="commentSuccessMessage"
      :cancelText="null"
      @confirm="handleCommentDeleteConfirm"
  />

  <!-- 수정 확인 모달 -->
  <PostCompleteModal
      v-if="showEditConfirmModal"
      title="게시글 수정"
      message="게시글을 수정하시겠습니까?"
      @confirm="goToEditPage"
      @close="showEditConfirmModal = false"
  />

  <!-- 권한 없음 모달 -->
  <PostCompleteModal
      v-if="isNoPermission"
      title="권한 없음"
      message="게시글을 수정할 권한이 없습니다."
      :cancelText="null"
      @confirm="closeNoPermissionModal"
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
import HeartIcon from '@/assets/icons/community/heart.svg';
import EmptyHeartIcon from '@/assets/icons/community/empty_heart.svg';

const authStore = useAuthStore();
const isAuthorMismatch = ref(false);
const showDeleteModal = ref(false);
const showCancelModal = ref(false);
const showSuccessModal = ref(false);
const successMessage = ref('');
const showCommentDeleteModal = ref(false);
const targetCommentId = ref(null);
const showCommentSuccessModal = ref(false);
const commentSuccessMessage = ref('');
const showEditConfirmModal = ref(false);
const isNoPermission = ref(false);


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
    post.value.isLiked = isLiked.value;

  } catch (e) {
    console.error('상세 조회 실패', e);
  }
};

const isLiking = ref(false);

const toggleLike = async () => {
  try {
    if (!post.value?.postId) return;
    const userId = authStore.userId;

    let res;

    if (isLiked.value) {
      res = await api.unlikePost(post.value.postId, userId);
      post.value.likeCount = Math.max(0, post.value.likeCount - 1); // 음수 방지
    } else {
      res = await api.likePost(post.value.postId, userId);
      post.value.likeCount = post.value.likeCount + 1;
    }

    isLiked.value = !isLiked.value;

    // 서버 응답에 최신 likeCount 있으면 반영 (null 체크)
    if (res?.data?.data?.likeCount !== undefined) {
      post.value.likeCount = res.data.data.likeCount;
    }

    console.log('[DEBUG] toggleLike 실행됨');
  } catch (e) {
    console.error('좋아요 토글 실패:', e.response?.data || e.message);
    alert('좋아요 요청에 실패했습니다.');
  }
};


const confirmDeletePost = () => {
  showDeleteModal.value = true;
};

const goToEditPage = async () => {
  showEditConfirmModal.value = false; // 수정 모달 닫기
  await router.push({ name: 'PostEdit', params: { postId: post.value.postId } });
};


const closeNoPermissionModal = () => {
  isNoPermission.value = false; // 권한 없음 모달 닫기
};

// const goToEditPage = async () => {
//   isAuthorMismatch.value = false;
//   await router.push({ name: 'PostEdit', params: { postId: post.value.postId } });
// };



const confirmCancel = () => {
  showCancelModal.value = true;
};


const cancelPost = () => {
  router.push({ name: 'CommunityList' });
};

const editPost = async () => {
  if (!post.value?.postId) {
    alert('게시글 정보를 찾을 수 없습니다.');
    return;
  }

  const userId = authStore.userId;

  try {
    const res = await api.fetchPostById(post.value.postId);
    const postData = res.data.data;

    if (Number(postData.userId) !== Number(userId)) {
      // 작성자와 사용자 ID가 다르면 "권한 없음" 모달 띄움
      isNoPermission.value = true;
      return;
    }

    // 작성자라면 수정할 건지 묻는 모달 띄움
    showEditConfirmModal.value = true;

  } catch (err) {
    console.error('게시글 확인 실패', err);
    alert('게시글을 확인할 수 없습니다.');
  }
};


// const editPost = async () => {
//   if (!post.value?.postId) {
//     alert('게시글 정보를 찾을 수 없습니다.');
//     return;
//   }
//
//   const userId = authStore.userId;
//
//   try {
//     const res = await api.fetchPostById(post.value.postId);
//     const postData = res.data.data;
//
//     if (Number(postData.userId) !== Number(userId)) {
//       isAuthorMismatch.value = true; // 모달로 처리
//       return;
//     }
//
//     // 작성자면 바로 수정 이동
//     await router.push({ name: 'PostEdit', params: { postId: post.value.postId } });
//
//   } catch (err) {
//     console.error('게시글 확인 실패', err);
//     alert('게시글을 확인할 수 없습니다.');
//   }
// };




const goBack = () => {
  router.push({ name: 'CommunityList', query: { refreshed: true } });
};

const deletePost = async () => {
  if (!post.value?.postId) {
    successMessage.value = '삭제할 게시글이 없습니다.';
    showSuccessModal.value = true;
    return;
  }

  const userId = authStore.userId;

  try {
    await api.deletePost(post.value.postId, userId);
    successMessage.value = '게시글이 삭제되었습니다.';
    showSuccessModal.value = true;
  } catch (e) {
    console.error('게시글 삭제 실패:', e.response?.data || e.message);
    successMessage.value = '삭제 중 오류가 발생했습니다.';
    showSuccessModal.value = true;
  } finally {
    showDeleteModal.value = false;
  }
};

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  router.push({ name: 'CommunityList' });
};


const requestDeleteComment = (commentId) => {
  targetCommentId.value = commentId;
  showCommentDeleteModal.value = true;
};

const deleteComment = async () => {
  try {
    const userId = authStore.userId;
    await api.deleteComment(post.value.postId, targetCommentId.value, userId);

    showCommentDeleteModal.value = false;
    commentSuccessMessage.value = '댓글이 삭제되었습니다.';
    showCommentSuccessModal.value = true;

    await fetchPost();
  } catch (e) {
    console.error('댓글 삭제 실패:', e.response?.data || e.message);
    alert('댓글 삭제 중 오류가 발생했습니다.');
    showCommentDeleteModal.value = false;
  }
};

const handleCommentDeleteConfirm = () => {
  showCommentSuccessModal.value = false;
};



const toggleCommentLike = async (commentId) => {
  try {
    const userId = authStore.userId;
    const comment = post.value.comments.find(c => c.commentId === commentId);
    if (!comment) return;

    if (comment.liked) {
      await api.unlikeComment(commentId, userId);
      comment.likeCount--;
    } else {
      await api.likeComment(commentId, userId);
      comment.likeCount++;
    }

    comment.liked = !comment.liked;
  } catch (e) {
    console.error('댓글 좋아요 실패:', e.response?.data || e.message);
    alert('댓글 좋아요 처리 중 오류가 발생했습니다.');
  }
};

const totalCommentLikes = computed(() => {
  if (!post.value?.comments) return 0;
  return post.value.comments.reduce((sum, c) => sum + (c.likeCount || 0), 0);
});


const openMiniProfile = async (event, targetId) => {
  try {
    const res = await getUserProfile({ targetId });
    console.log('[DEBUG] 프로필 응답:', res.data.data);
    console.log('user.id', res.data.data.member.user.userId)
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
}

.action-buttons button:hover {
  background-color: #3548d3;
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

.comment-like {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: black;
}

.comment-like .like-icon {
  width: 20px;
  height: 15px;
}

.comment-header-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 20px 0 12px;
  color: #333;
}


.comment-info-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.comment-count,
.comment-like-count {
  font-size: 1rem;
  color: #000;
}

.like-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  vertical-align: middle;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 6px; /* 하트와 숫자 간격 */
  cursor: pointer;
}

.delete-comment-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.delete-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  filter: none; /* 또는 삭제 */
  margin-left: 8px;
}

.delete-icon:hover {
  filter: none;
}

.comment-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
