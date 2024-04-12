import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import { AxiosError } from "axios";
import formatAxiosErrors from "../helpers/format-axios-errors";
import axiosHelper from "../helpers/axios-token-interceptor";
import {
  ACCESS_TOKEN_KEY,
  ACCOUNT_CONFIRMATION_REQUIRED,
  API_URL,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
  USER_PERMISSIONS_KEY,
  USER_TEMP_DATA_KEY,
} from "./constants";

const axios = axiosHelper.axiosInstance;

export type UserData = {
  fullName: string;
  email: string;
};

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    if (email && password) {
      try {
        const res = await axios.post(`${API_URL}/token`, { email, password });

        if (res.status === 200) {
          const authToken = `Bearer ${res.data.access}`;
          localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
          localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh);

          await Promise.all([
            axios.get(`${API_URL}/users/me`, {
              headers: {
                authorization: authToken,
              },
            }),
            axios.get(`${API_URL}/permissions`, {
              headers: {
                authorization: authToken,
              },
            }),
          ]).then(([resUser, resPermissions]) => {
            localStorage.setItem(USER_PERMISSIONS_KEY, JSON.stringify(resPermissions.data));
            localStorage.setItem(
              USER_DATA_KEY,
              JSON.stringify({
                email,
                fullName:
                  resUser.data.first_name || resUser.data.last_name
                    ? `${resUser.data.first_name} ${resUser.data.last_name}`
                    : null,
              })
            );
          });

          return {
            success: true,
            redirectTo: "/",
          };
        }
      } catch (err) {
        const error = err as AxiosError<Error>;

        return {
          success: false,
          error: {
            message: "Login Error",
            name: formatAxiosErrors(error.response?.data as unknown as { [key: string]: string[] }),
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: "Login Error",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.clear();

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password, first_name, last_name }) => {
    if (email && password && first_name && last_name) {
      try {
        const res = await axios.post(`${API_URL}/registration`, {
          email,
          password,
          first_name,
          last_name,
        });

        if (res.status === 201) {
          if (ACCOUNT_CONFIRMATION_REQUIRED) {
            notification.success({
              message: "Account created successfully",
              description: "Please check your email and activate your account",
            });

            sessionStorage.setItem(USER_TEMP_DATA_KEY, email);

            return {
              success: true,
              redirectTo: "/account-created",
            };
          } else {
            notification.success({
              message: "Account created successfully",
              description: "You can now login to your account",
            });

            return {
              success: true,
              redirectTo: "/login",
            };
          }
        }
      } catch (err) {
        const error = err as AxiosError<Error>;

        return {
          success: false,
          error: {
            message: "Register Error",
            name: formatAxiosErrors(error.response?.data as unknown as { [key: string]: string[] }),
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: "Register Error",
        message: "Invalid data provided",
      },
    };
  },
  forgotPassword: async ({ email }) => {
    try {
      const res = await axios.post(`${API_URL}/password/reset`, { email });

      if (res.status === 200) {
        notification.success({
          message: "Email has been sent",
          description:
            "Email with a link to reset your password has been sent. Please check your email for further instructions.",
        });
        return {
          success: true,
          redirectTo: "/login",
        };
      }
    } catch (err) {
      const error = err as AxiosError<Error>;

      return {
        success: false,
        error: {
          message: "Reset Password Error",
          name: formatAxiosErrors(error.response?.data as unknown as { [key: string]: string[] }),
        },
      };
    }

    return {
      success: false,
    };
  },
  updatePassword: async ({ uid, token, password, confirmPassword }) => {
    try {
      const res = await axios.post(`${API_URL}/password/reset/confirm/${uid}/${token}`, {
        new_password1: password,
        new_password2: confirmPassword,
        uid,
        token,
      });

      if (res.status === 200) {
        notification.success({
          message: "Password updated successfully",
          description: "Login to your account using updated credentials",
        });

        return {
          success: true,
          redirectTo: "/login",
        };
      }
    } catch (err) {
      const error = err as AxiosError<Error>;

      return {
        success: false,
        error: {
          message: "Update Password Error",
          name: formatAxiosErrors(error.response?.data as unknown as { [key: string]: string[] }),
        },
      };
    }

    return {
      success: false,
    };
  },
  check: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async (): Promise<UserData | null> => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      const userData = localStorage.getItem(USER_DATA_KEY);
      const parsedUserData = userData ? JSON.parse(userData) : null;

      return {
        fullName: parsedUserData?.fullName,
        email: parsedUserData?.email,
      };
    }

    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
