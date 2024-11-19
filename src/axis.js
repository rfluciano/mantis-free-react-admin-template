import axios from 'axios';

// Create an instance of axios
const axis = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Adjust base URL as needed
});

// Attach token to every request if available
axis.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optional: Handle responses globally (e.g., for token expiry)
axis.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error scenarios, like token expiry
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally, redirect to login page or display a message
      window.location.href = '/login'; // Adjust path as needed
    }
    return Promise.reject(error);
  }
);

export default axis;
