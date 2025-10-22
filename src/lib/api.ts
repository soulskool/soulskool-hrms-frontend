import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5002/api', // Your backend URL
  withCredentials: true, // This is crucial for sending httpOnly cookies
});

export default api;
