import api from '@/api/axios';

export const getMonthlySettlement = (request) => {
  return api.get('/common-service/settlements/me/monthly', {
    params: request,
  });
};
