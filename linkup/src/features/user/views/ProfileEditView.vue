<script setup>
import { ref, onMounted } from 'vue';
import { getMyProfile, updateProfile } from '@/api/user';
import { useRouter } from 'vue-router';

const profileImage = ref('');
const nickname = ref('');
const introduction = ref('');
const name = ref('');
const birth = ref('');
const gender = ref('');

const router = useRouter();

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const fetchUserProfile = async () => {
  try {
    const res = await getMyProfile();
    const data = res.data.data.member;
    profileImage.value = data.profileImageUrl;
    nickname.value = data.nickname;
    introduction.value = data.introduction;
    name.value = data.user.userName;
    birth.value = data.birthdate;
    gender.value = data.gender;
  } catch (error) {
    console.error('프로필 불러오기 실패', error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await updateProfile({
      nickname: nickname.value,
      profileImageUrl: profileImage.value,
      introduction: introduction.value,
    });
    await router.push('/mypage/profile');
  } catch (err) {
    console.error('프로필 저장 실패', err);
  }
};

onMounted(fetchUserProfile);
</script>

<template>
  <div class="profile-edit-wrapper">
    <h2 class="text-xl font-bold text-gray-900 mb-6">프로필 수정</h2>

    <div class="profile-image-section text-center mb-6">
      <label for="profileUpload" class="inline-block cursor-pointer">
        <img
          :src="profileImage"
          alt="프로필 이미지"
          class="w-24 h-24 object-cover rounded-full mx-auto"
        />
        <div class="text-sm text-blue-500 mt-2">사진 바꾸기</div>
      </label>
      <input
        id="profileUpload"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageChange"
      />
    </div>

    <form class="profile-form" @submit="handleSubmit">
      <div class="form-group">
        <label for="name">이름</label>
        <input id="name" type="text" v-model="name" disabled />
      </div>

      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input id="nickname" type="text" v-model="nickname" />
      </div>

      <div class="form-group">
        <label for="birth">생년월일</label>
        <input id="birth" type="date" v-model="birth" disabled />
      </div>

      <div class="form-group">
        <label for="introduction">자기소개</label>
        <textarea id="introduction" v-model="introduction" placeholder="자신을 소개해주세요." />
      </div>

      <div class="form-group">
        <label>성별</label>
        <div class="gender-toggle">
          <button type="button" class="gender-btn" :class="{ active: gender === 'M' }" disabled>
            남자
          </button>
          <button type="button" class="gender-btn" :class="{ active: gender === 'F' }" disabled>
            여자
          </button>
        </div>
      </div>

      <button type="submit" class="save-btn">프로필 저장</button>
    </form>
  </div>
</template>

<style scoped>
.profile-edit-wrapper {
  @apply bg-white;
}

.form-group {
  @apply mb-6 flex flex-col;
}

.profile-form label {
  @apply mb-2 font-semibold text-sm text-gray-700;
}

.profile-form input,
.profile-form textarea {
  @apply p-3 rounded-md border border-gray-200 bg-gray-50 text-sm;
}

.profile-form input:disabled {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed;
}

.profile-form textarea {
  @apply resize-y;
}

.gender-toggle {
  @apply flex gap-3;
}

.gender-btn {
  @apply flex-1 py-2 bg-gray-100 border-2 border-transparent rounded-md font-bold text-gray-800 transition;
}

.gender-btn.active {
  @apply border-blue-500 bg-blue-100 text-blue-600;
}

.gender-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.save-btn {
  @apply w-full py-3 bg-blue-500 text-white font-bold text-base rounded-md hover:bg-blue-700;
}
</style>
