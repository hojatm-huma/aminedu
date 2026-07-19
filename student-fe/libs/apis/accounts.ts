import { apiClient } from "./client";

export const accountApi = {
    getToken: (username: string, password: string) => apiClient.post("/accounts/token/", { username, password })
}