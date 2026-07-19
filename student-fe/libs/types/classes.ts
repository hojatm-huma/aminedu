export type KlassSchedule = {
    id: number;
    klass_id: number;
    lesson: string;
    teacher: string;
    day_of_week: number; // 0=Saturday … 6=Friday
    starts_at: string; // "HH:MM:SS"
    ends_at: string; // "HH:MM:SS"
};
