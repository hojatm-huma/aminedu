import { studentApi } from "@/libs/apis/students";

export function useStudents() {
    return {
        getProfile: studentApi.getProfile,
    };
}
