import { StudentProfile } from "@/libs/types/students";
import { apiClient } from "./client";

export const studentApi = {
    getProfile: () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        return apiClient.get<StudentProfile>("/classes/students/profile/", {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    },
};
