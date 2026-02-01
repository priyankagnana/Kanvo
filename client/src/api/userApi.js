import fetchClient from './fetchClient';

const userApi = {
  getProfile: () => fetchClient('user/profile', 'GET'),
  updateProfile: (params) => fetchClient('user/profile', 'PUT', params),
  getAnalytics: () => fetchClient('user/analytics', 'GET'),
};

export default userApi;
