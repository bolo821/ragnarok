import api from './api';

const setAuthToken = token => {
  if (token) {
    localStorage.setItem('auth-token-rt', token);
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('auth-token-rt');
  }
};

export default setAuthToken;
