import { defineStore } from 'pinia';
import { reactive } from 'vue';

// 초기 상태 객체 정의
const initialState = {
  termsOfServiceAgreed: false,
  privacyPolicyAgreed: false,
  marketingAgreed: false,
  name: '',
  email: '',
  password: '',
  contactNumber: '',
  gender: '',
  nickname: '',
  birthDate: '',
  introduction: '',
  desiredSports: '',
  profileImageUrl: '',
  businessRegistrationDocumentUrl: '',
  companyName: '',
};

export const useSignupFormStore = defineStore('signupForm', () => {
  const form = reactive({ ...initialState });

  const resetForm = () => {
    Object.assign(form, initialState);
  };

  return { form, resetForm };
});
