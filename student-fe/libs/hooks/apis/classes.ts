import { classApi } from "@/libs/apis/classes";

export function useClasses() {
    return {
        getSchedule: classApi.getSchedule,
        getRegistrations: classApi.getRegistrations,
    };
}
