/* user 관련 api 호출 */
import api from './axios.js';

/**
 * @typedef {Object} TokenResponse
 * @property {string} accessToken - 발급된 액세스 토큰 (Bearer Token)
 * @property {string} refreshToken - 발급된 리프레시 토큰 (HttpOnly 쿠키로도 전달될 수 있음)
 * @property {string} nickname - 회원명
 * @property {string} profileImageUrl - 프로필 이미지
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 요청 성공 여부
 * @property {T} data - 응답 데이터 (제네릭 타입)
 * @property {string} message - 응답 메시지
 */

/* 1-1. 일반 회원 가입 */
export function registerUser(data) {
  return api.post('/user-service/users/register', data);
}

/* 1-2. 사업자 회원 가입 */
export function registerBusinessUser(data) {
  return api.post('/user-service/users/register-business', data);
}

/* 2. 로그인 */
export function loginUser(data) {
  return api.post('/user-service/auth/login', data);
}

/* 3. 로그아웃 */
export function logoutUser() {
  return api.post('/user-service/auth/logout');
}

/* 4. 리프레시 토큰으로 토큰 재발급 */
export function refreshUserToken() {
  return api.post(`/user-service/auth/refresh`);
}

/* 5. 유저 목록 조회 */
export function getUsers() {
  return api.get('/user-service/admin/users');
}

/* 6. 내 정보 조회 */
export function getUserDetail() {
  return api.get('/user-service/users/me');
}

/* 7. 회원 마이페이지 조회 */
export function getUserMypage() {
  return api.get('/user-service/users/me/mypage');
}

/* 8. 사업자 마이페이지 조회 */
export function getBusinessMypage() {
  return api.get('/user-service/users/me/mypage/business');
}

/* 9. 포인트 조회 */
export function getUserPointTransactions(params) {
  return api.get('/common-service/user/point/transaction', { params: params });
}

/* 10. 비밀번호 재설정 링크 전송 */
export function postResetPassword(data) {
  return api.post('/user-service/auth/password/reset-link', data);
}

/* 11. 비밀번호 재설정 */
export function postResetPasswordConfirm(data) {
  return api.post('/user-service/auth/password/reset', data);
}

/* 12. 계정 복구 신청 */
export function postRecoverAccount(data) {
  return api.post('/user-service/users/recover', data);
}

/* 13. 특정 회원 프로필 조회. */
export function getUserProfile(params) {
  return api.get('/user-service/users/me/profile/other', { params });
}

/* 14. 프로필 조회 */
export function getMyProfile() {
  return api.get('/user-service/users/me/profile');
}

/* 15. 정산 계좌 등록 */
export function registerSettlementAccount(data) {
  return api.post('/common-service/users/me/account', data);
}

/* 18. 모임 내역 조회 */
export function getUserMeetingHistory({ status, page, size }) {
  return api.get('/user-service/users/me/meetings/history', {
    params: { status, page, size },
  });
  ㄱ;
}

/* 19. 친구 신청 */
export const sendFriendRequest = (targetMemberId) => {
  return api.post(`/user-service/friends/${targetMemberId}`);
};

/* 20. 프로필 수정 */
export function updateProfile(data) {
  return api.put('/user-service/users/me/profile', data);
}

/* 21. 개설 모임 이력 조회 */
export function getMyCreatedMeetings({ status, page, size }) {
  return api.get('/user-service/users/me/meetings/created', {
    params: { status, page, size },
  });
}

/* 22. 친구 모임 이력 조회 */
export function getFriendCreatedMeetings(page, size) {
  return api.get('/user-service/users/me/meetings/friend/created', {
    params: { page, size },
  });
}

/* 23. 작성한 댓글 조회 */
export function getMyComments() {
  return api.get('/user-service/users/me/comments');
}

/* 24. 작성한 게시글 조회 */
export function getMyPosts() {
  return api.get('/user-service/users/me/posts');
}

/* 25. 회원 탈퇴 */
export const withdrawUser = (request) => {
  return api.delete('/user-service/users/withdraw', { data: request });
};
