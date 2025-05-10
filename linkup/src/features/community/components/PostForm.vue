<template>
  <div class="post-create-container">
    <h2>{{ isEditMode ? '게시글 수정' : '게시글 작성' }}</h2>
    <form @submit.prevent="submitPost">
      <div class="form-group title-notice-group">
        <label for="title">제목</label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="post.isNotice" />
          공지사항
        </label>
      </div>
      <input type="text" v-model="post.title" placeholder="제목을 입력하세요." required />

      <div class="form-group">
        <label for="content">내용</label>
        <textarea v-model="post.content" placeholder="내용을 입력하세요." required></textarea>
      </div>

      <!-- 이미지 업로드 및 미리보기 + 삭제 버튼 -->
      <div class="form-group">
        <label for="mainImage">대표 이미지</label>
        <div class="image-preview-wrapper">
          <div v-for="(img, index) in imagePreviews" :key="index" class="image-preview">
            <img :src="img" alt="Image Preview" />
            <button class="delete-image-button" @click.prevent="removeImage(index)">
              <img src="@/assets/icons/community/cancel.svg" alt="삭제" />
            </button>
          </div>
          <label class="file-upload">
            +
            <input type="file" @change="handleImageUpload" accept="image/*" multiple hidden />
          </label>
        </div>
      </div>

      <div class="form-group">
        <button type="submit">{{ isEditMode ? '수정하기' : '작성하기' }}</button>
      </div>
    </form>
  </div>

  <!--  작성 완료 모달 -->
  <PostCompleteModal
      v-if="isPopupVisible"
      :title="modalTitle"
      :message="modalMessage"
      :cancelText="null"
      @confirm="goToPostDetail"
  />

<!--  &lt;!&ndash; 작성자 아님 접근 제한 모달 &ndash;&gt;-->
<!--  <PostCompleteModal-->
<!--      v-if="isAuthorMismatch"-->
<!--      title="접근 불가"-->
<!--      message="작성자만 수정할 수 있습니다."-->
<!--      :cancelText="null"-->
<!--      @confirm="goToDetailInstead"-->
<!--  />-->

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';
import PostCompleteModal from '@/features/community/components/CommunityModal.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isEditMode = ref(false);
const postId = ref(null); // 수정 시 사용

const post = ref({
  title: '',
  content: '',
  isNotice: false,
});

const imagePreviews = ref([]);
const selectedFiles = ref([]);
const existingImageUrls = ref([]);
const isPopupVisible = ref(false);
const modalMessage = ref('');
const modalTitle = ref('');
const createdPostId = ref(null);

// 수정 모드일 경우 초기 데이터 세팅
onMounted(async () => {
  if (route.name === 'PostEdit') {
    isEditMode.value = true;
    postId.value = route.params.postId;

    try {
      const response = await api.get(`/common-service/posts/${postId.value}`);
      const data = response.data.data;

      // 작성자 본인인지 확인
      const userId = Number(authStore.userId);
      if (data.userId !== userId) {
        modalTitle.value = '접근 불가';
        modalMessage.value = '작성자만 수정할 수 있습니다.';
        isAuthorMismatch.value = true;
        return;
      }

      // 기존 게시글 정보 세팅
      post.value.title = data.title;
      post.value.content = data.content;
      post.value.isNotice = data.isNotice === 'Y';

      // 기존 이미지 미리보기 추가
      if (data.imageUrls && data.imageUrls.length > 0) {
        data.imageUrls.forEach(url => {
          imagePreviews.value.push(url);
          existingImageUrls.value.push(url);
        });
      }

    } catch (err) {
      alert('게시글 정보를 불러오지 못했습니다.');
      console.error(err);
    }
  } else if (route.name === 'CommunityCreateView') {
    const postData = route?.state?.post;
    if (postData) {
      post.value.title = postData.title;
      post.value.content = postData.content;
      post.value.isNotice = postData.isNotice === 'Y';
    }
  }
});

// 이미지 업로드/삭제 함수 동일
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value.push(...files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreviews.value.push(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  const previewUrl = imagePreviews.value[index];
  const existingIndex = existingImageUrls.value.indexOf(previewUrl);

  if (existingIndex !== -1) {
    existingImageUrls.value.splice(existingIndex, 1); //
  } else {
    selectedFiles.value.splice(index, 1); // 새로 추가된 파일 제거
  }

  imagePreviews.value.splice(index, 1);
};

const goToPostDetail = () => {
  isPopupVisible.value = false;
  router.replace({ path: `/community/${createdPostId.value}`, state: null });
};


const goToDetailInstead = () => {
  router.push(`/community/${postId.value}`);
};


// 작성 or 수정 버튼 클릭
const submitPost = async () => {
  isEditMode.value ? await updatePost() : await createPost();
};

// 게시글 생성
const createPost = async () => {
  try {
    const userId = authStore.userId;
    const formData = new FormData();

    const jsonBlob = new Blob(
        [JSON.stringify({
          userId,
          title: post.value.title,
          content: post.value.content,
          isNotice: post.value.isNotice ? 'Y' : 'N',
        })],
        { type: 'application/json' }
    );

    formData.append('postCreateRequest', jsonBlob);
    selectedFiles.value.forEach(file => formData.append('postImgs', file));

    const response = await api.post('/common-service/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const id = response.data?.data?.postId || response.data?.data?.id;
    createdPostId.value = id;

    modalTitle.value = post.value.isNotice ? '공지사항 작성 완료' : '게시글 작성 완료';
    modalMessage.value = post.value.isNotice ? '공지사항이 등록되었습니다.' : '게시글이 성공적으로 작성되었습니다.';
    isPopupVisible.value = true;
  } catch (err) {
    console.error(err);
    alert('게시글 작성 실패');
  }
};

// 게시글 수정
const updatePost = async () => {
  try {
    const userId = Number(authStore.userId);
    const formData = new FormData();

    const jsonBlob = new Blob(
        [JSON.stringify({
          userId,
          title: post.value.title,
          content: post.value.content,
          isNotice: post.value.isNotice ? 'Y' : 'N',
          existingImageUrls: existingImageUrls.value,
        })],
        { type: 'application/json' }
    );

    formData.append('postUpdateRequest', jsonBlob); // 이 이름은 백엔드 파라미터명과 맞춰야 함
    selectedFiles.value.forEach(file => formData.append('postImgs', file));

    const response = await api.put(`/common-service/posts/${postId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    modalTitle.value = '게시글 수정 완료';
    createdPostId.value = postId.value;
    modalMessage.value = post.value.isNotice ? '공지사항이 수정되었습니다.' : '게시글이 성공적으로 수정되었습니다.';
    isPopupVisible.value = true;
  } catch (err) {
    console.error(err);
    alert('게시글 수정 실패');
  }
};


</script>


<style scoped>
.post-create-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

textarea {
  resize: vertical;
  height: 300px;
}

.title-notice-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title-notice-group label {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 6px;
}

.image-preview-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 12px;
}

.image-preview {
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-image-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.delete-image-button img {
  width: 24px;
  height: 24px;
}

.file-upload {
  border: 2px dashed #ccc;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #999;
  cursor: pointer;
  border-radius: 8px;
  transition: border-color 0.3s, color 0.3s;
}

.file-upload:hover {
  border-color: #5790ff;
  color: #5790ff;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #5790ff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3548d3;
}
</style>
