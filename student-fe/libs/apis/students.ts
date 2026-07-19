import { apiClient } from "./client";

export type StudentProfile = {
    id: number;
    first_name: string;
    last_name: string;
    national_code: string;
};

export const studentApi = {
    getProfile: () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        return apiClient.get<StudentProfile>("/classes/students/profile/", {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    },
};
