import axios from "axios";
import store from "../store/store.js";
import { clearCredentials, setCredentials } from "../store/slices/authSlice.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post("/auth/refresh-token")
        .then((response) => {
          const accessToken = response.data.data.accessToken;

          if (!accessToken) {
            throw new Error(
              "Refresh response did not include an access token.",
            );
          }

          store.dispatch(
            setCredentials({
              user: store.getState().auth.user,
              accessToken,
            }),
          );

          return accessToken;
        })
        .catch((refreshError) => {
          store.dispatch(clearCredentials());
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise.then(
      (accessToken) => {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      },
      () => Promise.reject(error),
    );
  },
);

export default api;
