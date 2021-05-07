export const PREDICTIONS_BASE_URL = "http://localhost:5000";
export const BASE_URL = "http://localhost:8000";
export const REACT_APP_URL = "http://localhost:3000";

export const ENDPOINTS = {
    CAPTION: "/caption",
    IMAGES: "/images",
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        PROXY_LOGIN: "/api/auth/login",
        PROXY_REGISTER: "/api/auth/register",
        PROXY_LOGOUT: "/api/auth/logout"
    },
    USER: {
        USERNAME: "/account/profiles/",
        ACCOUNT: "/account/settings",
        PROXY_ACCOUNT: "/api/account"
    }
}