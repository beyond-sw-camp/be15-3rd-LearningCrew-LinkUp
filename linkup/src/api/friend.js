import api from '@/api/axios.js';

/* 1. 친구 신청 목록 조회 */
export function getReceivedFriendRequests() {
  return api.get('/user-service/friends/received');
}

/* 2. 친구 목록 조회 */
export const getFriendList = () => {
  return api.get('/user-service/friends');
};

/* 3. 친구 신청 수락 */
export function acceptFriendRequest(targetMemberId) {
  return api.put(`/user-service/friends/${targetMemberId}/accept`);
}

/* 4. 친구 신청 거절 */
export function declineFriendRequest(targetMemberId) {
  return api.delete(`/user-service/friends/${targetMemberId}`);
}
