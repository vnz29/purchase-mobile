// app/lib/axios.ts
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.100.163:3000/api", // Change this to your IP
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/login")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        const res = await axios.post(
          "http://192.168.100.163:3000/api/user/refreshToken",
          {
            refreshToken,
          }
        );

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        await useAuthStore
          .getState()
          .setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
