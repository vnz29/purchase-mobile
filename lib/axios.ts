import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/useAuthStore";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";
const api = axios.create({
  baseURL: `${API_URL}/api`, // Replace with your dev IP or env
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

// Refresh a few minutes early to avoid edge cases
const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now() + TOKEN_REFRESH_BUFFER;
  } catch (err) {
    return true; // Consider expired if decoding fails
  }
};

api.interceptors.request.use(
  async (config) => {
    let accessToken = useAuthStore.getState().accessToken;
    config.headers["X-Platform"] = "mobile";
    if (accessToken && isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const res = await axios.post(`${API_URL}/api/user/refreshToken`, {
            refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          const newRefreshToken = res.data.refreshToken;
          console.log(newRefreshToken);
          await useAuthStore
            .getState()
            .setTokens(newAccessToken, newRefreshToken);

          processQueue(null, newAccessToken);
        } catch (err) {
          processQueue(err, null);
          await useAuthStore.getState().logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(config);
          },
          reject: (err: any) => reject(err),
        });
      });
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        const res = await axios.post(
          "http://192.168.100.163:3000/api/user/refreshToken",
          { refreshToken }
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
