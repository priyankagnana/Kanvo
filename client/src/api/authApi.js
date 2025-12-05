import fetchClient from './fetchClient';

const authApi = {
  signup: (params) => fetchClient('auth/signup', 'POST', params),
  login: (params) => fetchClient('auth/login', 'POST', params),
  verifyToken: () => fetchClient('auth/verify-token', 'POST'),
};

export default authApi;
