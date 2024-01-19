import axios, { AxiosResponse } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from "../authProvider";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const refreshAuthLogic = (failedRequest: { response: AxiosResponse }) =>
  axiosInstance
    .post(`${API_URL}/token/refresh`, {
      refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
    })
    .then((tokenRefreshResponse) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokenRefreshResponse.data.access);
      failedRequest.response.config.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.access;

      return Promise.resolve();
    })
    .catch(() => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    });

export default {
  axiosInstance,
  setAxiosTokenInterceptor: () => {
    createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);
  },
};
