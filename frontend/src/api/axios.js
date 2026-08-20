import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// har request ke saath token attach karo agar user logged in hai
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jugaadu_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
