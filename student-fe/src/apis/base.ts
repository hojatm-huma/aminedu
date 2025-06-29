import axios from "axios";

import { setTokens, removeTokens, getAccessToken } from "src/utils/cookie";

import { refreshToken } from "./auth";


export const myAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: { "Authorization": `Bearer ${getAccessToken()}` },
});

myAxios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const {
                    access: newAccessToken,
                    refresh: newRefreshToken,
                } = await refreshToken()
                setTokens(newAccessToken, newRefreshToken)
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return myAxios(originalRequest);
            } catch (refreshError) {
                // removeTokens()
                window.location.href = "/sign-in";

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);