const windowEnv = (window as any).env;

const backendBaseUrl =
  windowEnv.VITE_BACKEND_BASE_URL !== "__VITE_BACKEND_BASE_URL__"
    ? windowEnv.VITE_BACKEND_BASE_URL
    : import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api/v1";

const accountConfirmationRequired =
  windowEnv.VITE_EMAIL_CONFIRMATION_REQUIRED !== "__VITE_EMAIL_CONFIRMATION_REQUIRED__"
    ? windowEnv.VITE_EMAIL_CONFIRMATION_REQUIRED
    : import.meta.env.VITE_EMAIL_CONFIRMATION_REQUIRED || true;

export const API_URL = backendBaseUrl;
export const ACCOUNT_CONFIRMATION_REQUIRED = accountConfirmationRequired;
export const ACCESS_TOKEN_KEY = "access";
export const REFRESH_TOKEN_KEY = "refresh";
export const USER_PERMISSIONS_KEY = "userPermissions";
export const USER_DATA_KEY = "userFullName";
export const USER_TEMP_DATA_KEY = "userTempData";
