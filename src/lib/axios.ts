import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const store = useAuthStore.getState();
      store.clearToken();
      store.clearOnboarded();
      store.clearPhoneNumber();
      window.dispatchEvent(new Event("app-unauthorized"));
    }

    return Promise.reject(error);
  },
);

export const axiosSubInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SUB_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosSubInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosSubInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const store = useAuthStore.getState();
      store.clearToken();
      store.clearOnboarded();
      store.clearPhoneNumber();

      window.dispatchEvent(new Event("app-unauthorized"));
    }

    return Promise.reject(error);
  },
);
