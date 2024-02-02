import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import axios from "axios";

export const API_URL = "http://localhost:8000/api/v1";
export const ACCESS_TOKEN_KEY = "access";
export const REFRESH_TOKEN_KEY = "refresh";
export const USER_DATA_KEY = "userFullName";

export type UserData = {
  fullName: string;
  email: string;
};

export const authProvider: AuthBindings = {
  login: async ({ username, email, password }) => {
    if ((username || email) && password) {
      try {
        const res = await axios.post(`${API_URL}/token`, { email, password });

        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
          localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh);

          // Update user data on login
          const resUser = await axios.get(`${API_URL}/users/me`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            },
          });

          if (resUser.status === 200) {
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
          }

          return {
            success: true,
            redirectTo: "/",
          };
        }
      } catch (err) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Invalid username or password",
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
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
  forgotPassword: async ({ email }) => {
    try {
      const res = await axios.post(`${API_URL}/password/reset`, { email });

      if (res.status === 200) {
        notification.success({
          message: "Password reset email sent",
          description: "Please check your email for further instructions",
        });
        return {
          success: true,
        };
      }
    } catch {
      /* empty */
    }

    return {
      success: false,
    };
  },
  updatePassword: async (params) => {
    try {
      const res = await axios.post(`${API_URL}/password/reset/confirm`, {
        new_password1: params.password,
        new_password2: params.password,
        uid: params.uid,
        token: params.token,
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
    } catch {
      /* empty */
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
