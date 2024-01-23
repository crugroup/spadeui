import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import axios from "axios";

export const ACCESS_TOKEN_KEY = "access";
export const REFRESH_TOKEN_KEY = "refresh";
export const USER_PERMISSIONS_KEY = "userPermissions";
export const API_URL = "http://localhost:8000/api/v1";

export const authProvider: AuthBindings = {
  login: async ({ username, email, password }) => {
    if ((username || email) && password) {
      try {
        const res = await axios.post(`${API_URL}/token`, { email, password });

        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
          localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh);

          // Update permissions list on login
          const resPermissions = await axios.get(`${API_URL}/permissions`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            },
          });

          if (resPermissions.status === 200) {
            localStorage.setItem(
              USER_PERMISSIONS_KEY,
              JSON.stringify(resPermissions.data)
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
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_PERMISSIONS_KEY);

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
  getIdentity: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
