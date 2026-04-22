import client from './client';

export const getAdminPlans = async () => {
  const response = await client.get('/payments/admin/plans/');
  return response.data;
};

export const createAdminPlan = async (data: any) => {
  const response = await client.post('/payments/admin/plans/', data);
  return response.data;
};

export const updateAdminPlan = async (id: number | string, data: any) => {
  const response = await client.put(`/payments/admin/plans/${id}/`, data);
  return response.data;
};

export const deleteAdminPlan = async (id: number | string) => {
  const response = await client.delete(`/payments/admin/plans/${id}/`);
  return response.data;
};

export const getAdminUserSubscriptions = async () => {
  const response = await client.get('/payments/admin/users-subscriptions/');
  return response.data;
};

export const getAdminStats = async () => {
  const response = await client.get('/payments/admin/stats/');
  return response.data;
};

export const getAdminUsers = async (page: number = 1, search: string = '') => {
  const response = await client.get(`/users/admin/users/?page=${page}&search=${encodeURIComponent(search)}`);
  return response.data;
};

export const manageAdminUser = async (userId: number, action: 'toggle_active' | 'delete') => {
  const response = await client.post('/users/admin/users/', { user_id: userId, action });
  return response.data;
};
