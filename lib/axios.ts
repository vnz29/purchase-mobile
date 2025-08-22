// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useAuthStore } from "../store/useAuthStore";
// import * as SecureStore from "expo-secure-store";
// import { API_URL } from "@env";
// const api = axios.create({
//   baseURL: `${API_URL}/api`, // Replace with your dev IP or env
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// // Refresh a few minutes early to avoid edge cases
// const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes

// const isTokenExpired = (token: string): boolean => {
//   try {
//     const decoded: any = jwtDecode(token);
//     return decoded.exp * 1000 < Date.now() + TOKEN_REFRESH_BUFFER;
//   } catch (err) {
//     return true; // Consider expired if decoding fails
//   }
// };

// api.interceptors.request.use(
//   async (config) => {
//     console.log(config);
//     let accessToken = useAuthStore.getState().accessToken;
//     config.headers["X-Platform"] = "mobile";
//     if (accessToken && isTokenExpired(accessToken)) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const refreshToken = await SecureStore.getItemAsync("refreshToken");
//           if (!refreshToken) throw new Error("No refresh token");

//           const res = await axios.post(`${API_URL}/api/user/refreshToken`, {
//             refreshToken,
//           });

//           const newAccessToken = res.data.accessToken;
//           const newRefreshToken = res.data.refreshToken;
//           console.log(newRefreshToken);
//           await useAuthStore
//             .getState()
//             .setTokens(newAccessToken, newRefreshToken);

//           processQueue(null, newAccessToken);
//         } catch (err) {
//           processQueue(err, null);
//           // await useAuthStore.getState().logout();
//           return Promise.reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return new Promise((resolve, reject) => {
//         failedQueue.push({
//           resolve: (token: string) => {
//             config.headers.Authorization = `Bearer ${token}`;
//             resolve(config);
//           },
//           reject: (err: any) => reject(err),
//         });
//       });
//     }

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log(error);
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(api(originalRequest));
//             },
//             reject: (err: any) => reject(err),
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refreshToken = await SecureStore.getItemAsync("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token found");

//         const res = await axios.post(
//           "http://192.168.100.163:3000/api/user/refreshToken",
//           { refreshToken }
//         );

//         const newAccessToken = res.data.accessToken;
//         const newRefreshToken = res.data.refreshToken;

//         await useAuthStore
//           .getState()
//           .setTokens(newAccessToken, newRefreshToken);
//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         await useAuthStore.getState().logout();
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useAuthStore } from "../store/useAuthStore";
// import * as SecureStore from "expo-secure-store";
// import { API_URL } from "@env";

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes

// const isTokenExpired = (token: string): boolean => {
//   try {
//     const decoded: any = jwtDecode(token);
//     return decoded.exp * 1000 < Date.now() + TOKEN_REFRESH_BUFFER;
//   } catch (err) {
//     return true;
//   }
// };

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// const refreshTokens = async (): Promise<string> => {
//   const refreshToken = await SecureStore.getItemAsync("refreshToken");
//   if (!refreshToken) throw new Error("No refresh token found");

//   const response = await axios.post(`${API_URL}/api/user/refreshToken`, {
//     refreshToken,
//   });
//   console.log(response, "response");
//   const { accessToken, refreshToken: newRefreshToken } = response.data;
//   console.log("refresh token");
//   console.log(accessToken, newRefreshToken);
//   await useAuthStore.getState().setTokens(accessToken, newRefreshToken);
//   return accessToken;
// };

// // // REQUEST INTERCEPTOR
// api.interceptors.request.use(
//   async (config) => {
//     let accessToken = useAuthStore.getState().accessToken;
//     config.headers["X-Platform"] = "mobile";

//     if (accessToken && isTokenExpired(accessToken)) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const newAccessToken = await refreshTokens();
//           processQueue(null, newAccessToken);
//         } catch (err) {
//           processQueue(err, null);

//           return Promise.reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return new Promise((resolve, reject) => {
//         failedQueue.push({
//           resolve: (token: string) => {
//             config.headers.Authorization = `Bearer ${token}`;
//             resolve(config);
//           },
//           reject: (err: any) => reject(err),
//         });
//       });
//     }

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // RESPONSE INTERCEPTOR
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     console.log("start of error");
//     console.log(error);
//     // console.log("test");
//     // console.log(error);
//     console.log(error.config, "error config");
//     console.log(error.response, "error response");

//     const originalRequest = error.request?._url;

//     console.log("original request");

//     console.log(originalRequest);
//     console.log("end of error");
//     if (error.response?.status === 401) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(api(originalRequest));
//             },
//             reject: (err: any) => reject(err),
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const newAccessToken = await refreshTokens();
//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);

//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     // Any status code within the range of 2xx will trigger this function

//     return response; // Return the response as-is
//   },
//   (error) => {
//     console.log("error");
//     console.log(error);
//     console.log("error response");
//     console.log(error.response);
//     console.log("response");
//     console.log(response);
//     return Promise.reject(error); // Reject the promise to allow catch blocks to handle it
//   }
// );
// api.ts
import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/useAuthStore";
import { API_URL } from "@env";

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}[] = [];

// Process queued requests after refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Refresh access token using refresh token
const refreshToken = async (): Promise<string> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await axios.post(`${API_URL}/api/user/refreshToken`, {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;

  await useAuthStore.getState().setTokens(accessToken, newRefreshToken);
  return accessToken;
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    config.headers = config.headers ?? {}; // ensure headers exist

    config.headers["X-Platform"] = "mobile";

    if (accessToken) {
      // safest way to set Authorization header:
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh if already tried or if the call is to /refreshToken itself
    console.log(originalRequest);
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refreshToken")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Optionally logout user here
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
