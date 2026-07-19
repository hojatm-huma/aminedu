export type KlassRegistration = {
    id: number;
    klass_id: number;
    name: string;
    teacher: string;
    exercise_count: number;
};

export type Exercise = {
    id: number;
    title: string;
    due_date: string; // "YYYY-MM-DD"
};

export type KlassSchedule = {
    id: number;
    klass_id: number;
    lesson: string;
    teacher: string;
    day_of_week: number; // 0=Saturday … 6=Friday
    starts_at: string; // "HH:MM:SS"
    ends_at: string; // "HH:MM:SS"
};
