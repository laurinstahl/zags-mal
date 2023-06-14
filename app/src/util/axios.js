import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8123', // set the base URL for your API
});

export default api;
