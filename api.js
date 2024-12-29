import axios from 'axios';

// Configure the base URL for all API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the configured Axios instance
export default api;
