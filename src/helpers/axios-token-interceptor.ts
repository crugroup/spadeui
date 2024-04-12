import axios, { AxiosResponse } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { HttpError } from "@refinedev/core";
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from "../config/constants";

const axiosInstance = axios.create();
const axiosRefreshInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error): Promise<HttpError> =>
    Promise.reject({
      ...error,
      message: error.response.data?.message,
      statusCode: error.response.status,
    })
);

const refreshAuthLogic = (failedRequest: { response: AxiosResponse }) =>
  axiosRefreshInstance
    .post(`${API_URL}/token/refresh`, {
      refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
    })
    .then((tokenRefreshResponse) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokenRefreshResponse.data.access);
      failedRequest.response.config.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.access;

      return Promise.resolve();
    })
    .catch(() => {
      localStorage.clear();
      window.location.href = "/login";
    });

export default {
  axiosInstance,
  setAxiosTokenInterceptor: () => {
    createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
      shouldRefresh: (error) => {
        return error?.response?.status === 401 && error?.config?.url !== `${API_URL}/token`;
      },
    });
  },
};
