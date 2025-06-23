import { myAxios } from "./base";

export async function listWeeklySchedule() {
    const { data } = await myAxios.get("/classes/weekly-schedule/")
    return data
}