import axios from "axios";

const TOKEN_KEY = "auth_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage not available */
  }
};

// One shared axios instance for the whole app.
// It sends the cookie AND the token header, so login keeps working
// even if the browser blocks the cookie.
// In production set VITE_API_URL to your backend address
// (example: https://my-backend.onrender.com, no slash at the end).
// On your computer it is empty, so the Vite proxy is used.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
