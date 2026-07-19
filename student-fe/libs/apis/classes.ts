import { Exercise, KlassRegistration, KlassSchedule } from "@/libs/types/classes";
import { apiClient } from "./client";

export const classApi = {
    getSchedule: (dayOfWeek?: number) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        return apiClient.get<KlassSchedule[]>("/classes/klass/schedule/", {
            params: dayOfWeek !== undefined ? { day_of_week: dayOfWeek } : undefined,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    },
    getRegistrations: () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        return apiClient.get<KlassRegistration[]>("/classes/klass/registration/", {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    },
    getRegistrationExercises: (registrationId: number) =>
        apiClient.get<Exercise[]>(
            `/classes/klass/registration/${registrationId}/exercises/`,
        ),
};
