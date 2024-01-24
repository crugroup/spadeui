import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import axios from "axios";

export const ACCESS_TOKEN_KEY = "access";
export const REFRESH_TOKEN_KEY = "refresh";
export const USER_PERMISSIONS_KEY = "userPermissions";
export const USER_FIRST_NAME_KEY = "userFirstName";
export const USER_LAST_NAME_KEY = "userLastName";
export const USER_ID_KEY = "userId";
export const USER_EMAIL_KEY = "userEmail";
export const API_URL = "http://localhost:8000/api/v1";

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
            localStorage.setItem(USER_FIRST_NAME_KEY, resUser.data.first_name);
            localStorage.setItem(USER_LAST_NAME_KEY, resUser.data.last_name);
            localStorage.setItem(USER_ID_KEY, resUser.data.id);
            localStorage.setItem(USER_EMAIL_KEY, resUser.data.email);
          }

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
        id: localStorage.getItem(USER_ID_KEY),
        name: [
          localStorage.getItem(USER_FIRST_NAME_KEY),
          localStorage.getItem(USER_LAST_NAME_KEY),
        ]
          .filter(Boolean)
          .join(" "),
        email: localStorage.getItem(USER_EMAIL_KEY),
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
