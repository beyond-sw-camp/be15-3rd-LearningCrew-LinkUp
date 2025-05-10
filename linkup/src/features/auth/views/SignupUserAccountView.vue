<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupFormStore } from '@/stores/signup.js';
import { registerUser } from '@/api/user';
import { startLoading } from '@/composables/useLoadingBar.js';

const router = useRouter();
const store = useSignupFormStore();

const userName = ref(store.form.name);
const gender = ref(store.form.gender);
const nickname = ref(store.form.nickname);
const birthDate = ref(store.form.birthDate);
const introduction = ref(store.form.introduction);
const selectedSport = ref(store.form.desiredSports || '');
const profileImageUrl = ref('');

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    profileImageUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleSubmit = async () => {
  store.form.name = userName.value;
  store.form.gender = gender.value;
  store.form.nickname = nickname.value;
  store.form.birthDate = birthDate.value;
  store.form.introduction = introduction.value;
  store.form.profileImageUrl = profileImageUrl.value;
  store.form.desiredSports = selectedSport.value;

  const payload = {
    email: store.form.email,
    password: store.form.password,
    contactNumber: store.form.contactNumber,
    userName: store.form.name,
    gender: store.form.gender,
    nickname: store.form.nickname,
    birthDate: store.form.birthDate,
    introduction: store.form.introduction,
    profileImageUrl: store.form.profileImageUrl,
    desiredSports: store.form.desiredSports,
  };

  try {
    startLoading();
    await registerUser(payload);
    store.resetForm();
    await router.push('/email-verification');
  } catch (err) {
    console.error('회원가입 실패:', err);
  }
};
</script>

<template>
  <section class="signup-container" aria-labelledby="user-info-title">
    <div class="signup-step-indicator">
      <span class="step">1</span>
      <span class="step-line"></span>
      <span class="step active">2</span>
    </div>

    <h1 id="user-info-title" class="signup-title">개인 정보를 입력해주세요</h1>

    <form class="signup-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">이름 <span class="required">*</span></label>
        <input type="text" v-model="userName" class="form-input" required />
      </div>

      <div class="form-group">
        <label class="form-label">성별 <span class="required">*</span></label>
        <div class="radio-group">
          <label><input type="radio" value="M" v-model="gender" /> 남성</label>
          <label><input type="radio" value="F" v-model="gender" /> 여성</label>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">닉네임 <span class="required">*</span></label>
        <input type="text" v-model="nickname" class="form-input" required maxlength="30" />
      </div>

      <div class="form-group">
        <label class="form-label">생년월일</label>
        <input type="date" v-model="birthDate" class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">자기소개</label>
        <textarea v-model="introduction" class="form-input" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">선호하는 운동</label>
        <select v-model="selectedSport" class="form-input" required>
          <option disabled value="">운동을 선택해주세요</option>
          <option value="축구">축구</option>
          <option value="농구">농구</option>
          <option value="배드민턴">배드민턴</option>
          <option value="테니스">테니스</option>
          <option value="탁구">탁구</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">프로필 이미지</label>
        <div class="image-upload-wrapper">
          <div v-if="profileImageUrl" class="image-preview">
            <img :src="profileImageUrl" alt="프로필 미리보기" />
          </div>
          <label v-else class="upload-card">
            <span>＋</span>
            <input type="file" accept="image/*" class="hidden-input" @change="handleImageChange" />
          </label>
        </div>
      </div>

      <button type="submit" class="signup-button">회원가입 완료</button>
    </form>
  </section>
</template>

<style scoped>
.signup-container {
  @apply bg-white flex flex-col justify-center;
}
.signup-step-indicator {
  @apply flex items-center justify-center mb-8;
}
.step {
  @apply w-9 h-9 rounded-full bg-gray-200 text-gray-500 font-bold flex items-center justify-center text-sm;
}
.step.active {
  @apply bg-blue-500 text-white;
}
.step-line {
  @apply w-10 h-0.5 bg-gray-200 mx-2;
}
.signup-title {
  @apply text-xl font-bold text-center mb-6;
}
.signup-form {
  @apply flex flex-col gap-6;
}
.form-group {
  @apply flex flex-col;
}
.form-label {
  @apply mb-2 font-medium text-gray-700 text-sm;
}
.required {
  @apply text-red-500 text-xs ml-1;
}
.form-input {
  @apply p-3 text-base border border-gray-300 rounded-md;
}
.radio-group {
  @apply flex gap-6 text-sm;
}
.signup-button {
  @apply w-full py-3 bg-blue-500 text-white font-bold rounded-md text-base hover:bg-blue-700 transition-colors;
}

.image-upload-wrapper {
  @apply flex flex-wrap gap-3;
}

.image-preview,
.upload-card {
  @apply w-[100px] h-[100px] rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden relative transition-all duration-300;
}

.upload-card {
  @apply border-2 border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-500;
}

.image-preview {
  @apply border-2 border-dashed border-blue-500;
}

.upload-card span {
  @apply text-2xl text-gray-500;
}

.image-preview img {
  @apply w-full h-full object-cover rounded-xl;
}

.hidden-input {
  @apply hidden;
}
</style>
