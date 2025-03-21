import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.141:3001/auth',
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
