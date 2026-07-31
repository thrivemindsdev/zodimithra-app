import { useAuthStore } from "@/store/authStore";
import axios, { type AxiosInstance } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosSubInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SUB_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Reusable interceptor attacher to keep your code DRY
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const store = useAuthStore.getState();

        // Reset auth state
        store.clearToken();
        store.clearPhoneNumber();

        // Notify the application to trigger navigation
        window.dispatchEvent(new Event("app-unauthorized"));
      }

      return Promise.reject(error);
    },
  );
};

// Apply interceptors to both instances
setupInterceptors(axiosInstance);
setupInterceptors(axiosSubInstance);
