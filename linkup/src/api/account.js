import api from '@/api/axios';

/* 1. 계좌 조회 */
export const getAccount = () => api.get('/common-service/users/me/account');

/* 2. 계좌 등록 */
export const registerAccount = (body) => api.post('/common-service/users/me/account', body);

/* 3. 계좌 수정 */
export const updateAccount = (body) => api.put('/common-service/users/me/account', body);
