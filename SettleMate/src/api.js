import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://ravi-settle-mate.vercel.app",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("settlemateToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/api/auth/login")
    ) {
      sessionStorage.removeItem("settlemateToken");
      localStorage.removeItem("loggedInUser");
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
