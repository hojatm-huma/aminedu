"use client";

import { useState, useMemo, useEffect } from "react";
import { useClasses } from "@/libs/hooks/apis/classes";
import { KlassSchedule } from "@/libs/types/classes";

// ── Persian calendar helpers ──────────────────────────────────────────────────
function faToEn(fa: string): number {
  const map: Record<string, string> = {
    "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
  };
  // Handle some simple digit conversions
  return Number(fa.replace(/[۰-۹]/g, (d) => map[d] ?? d).replace(/٬/g, "")) || 0;
}

function getPersianDay(date: Date): { day: number; monthName: string } {
  const fmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long", day: "numeric" });
  const parts = fmt.formatToParts(date);
  return {
    day: faToEn(parts.find((p) => p.type === "day")?.value ?? "0"),
    monthName: parts.find((p) => p.type === "month")?.value ?? "",
  };
}

function jsToPerIdx(jsDay: number) { return (jsDay + 1) % 7; }

const WEEK_NAMES = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];

// The API returns times as "HH:MM:SS"; the UI renders "HH:MM".
function toHm(time: string): string {
  return time?.slice(0, 5) ?? time;
}

const STRIPE_COLORS = ["#3E66A8","#5B8AC4","#7FA8D5","#4A7BB8","#2D5A9E","#6495C4","#3870B0"];

export default function KelasPage() {
  const { getSchedule } = useClasses();
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [classes, setClasses] = useState<KlassSchedule[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New class form state
  const [lessonName, setLessonName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [startsAt, setStartsAt] = useState("08:00");
  const [endsAt, setEndsAt] = useState("09:30");
  const [dayOfWeek, setDayOfWeek] = useState(0);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole === "teacher" ? "teacher" : "student");
  }, []);

  useEffect(() => {
    getSchedule()
      .then((res) => setClasses(res.data))
      .catch(() => setClasses([]));
  }, []);

  const today = new Date();
  const todayIdx = jsToPerIdx(today.getDay());

  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() + weekOffset * 7);

    const daysFromSat = jsToPerIdx(baseDate.getDay());
    const sat = new Date(baseDate);
    sat.setDate(baseDate.getDate() - daysFromSat);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sat);
      d.setDate(sat.getDate() + i);
      const { day, monthName } = getPersianDay(d);
      return { 
        dayOfWeek: i, 
        dayName: WEEK_NAMES[i], 
        persianDay: day, 
        monthName, 
        isToday: weekOffset === 0 && i === todayIdx 
      };
    });
  }, [weekOffset, todayIdx]);

  const [selectedDay, setSelectedDay] = useState(todayIdx);

  const dayClasses = classes
    .filter((c) => c.day_of_week === selectedDay)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));

  const faNum = (n: number | string) => new Intl.NumberFormat("fa-IR").format(Number(n) || 0);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonName.trim() || !teacherName.trim()) return;

    const newClass: KlassSchedule = {
      id: Date.now(),
      klass_id: Date.now(),
      lesson: lessonName.trim(),
      teacher: teacherName.trim(),
      starts_at: startsAt,
      ends_at: endsAt,
      day_of_week: dayOfWeek,
    };

    setClasses((prev) => [...prev, newClass]);
    setShowAddModal(false);

    // Reset form
    setLessonName("");
    setTeacherName("");
    setStartsAt("08:00");
    setEndsAt("09:30");
  };

  const handleDeleteClass = (id: number) => {
    if (confirm("آیا از حذف این کلاس مطمئن هستید؟")) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (!role) return null; // Avoid hydration mismatch

  return (
    <div dir="rtl" className="space-y-5 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#1A2B45]">برنامه کلاسی هفتگی {role === "teacher" && "(پنل معلم)"}</h2>
        {role === "teacher" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-4 py-2 rounded-[10px] hover:brightness-110 transition shadow-sm cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            تعریف کلاس جدید
          </button>
        )}
      </div>

      {/* ── Week navigation controller ── */}
      <div className="flex items-center justify-between bg-white rounded-[14px] border border-[#EEF0F4] p-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#1A2B45]">
            {weekOffset === 0 ? "هفته جاری" : weekOffset === 1 ? "هفته آینده" : `هفته (${weekOffset > 0 ? "+" : ""}${faNum(weekOffset)})`}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-1.5 rounded-[8px] border border-[#EEF0F4] hover:bg-[#F4F7FB] text-[#7A9BB5] transition cursor-pointer"
            title="هفته قبل"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border border-[#EEF0F4] hover:bg-[#F4F7FB] text-[#7A9BB5] disabled:opacity-40 transition cursor-pointer"
          >
            هفته جاری
          </button>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-1.5 rounded-[8px] border border-[#EEF0F4] hover:bg-[#F4F7FB] text-[#7A9BB5] transition cursor-pointer"
            title="هفته بعد"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Day selector strip ── */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max">
          {weekDays.map((d) => {
            const isSelected = selectedDay === d.dayOfWeek;
            const hasClass = classes.some((c) => c.day_of_week === d.dayOfWeek);
            return (
              <button
                key={d.dayOfWeek}
                onClick={() => setSelectedDay(d.dayOfWeek)}
                className={[
                  "flex flex-col items-center px-4 py-3 rounded-[14px] min-w-[82px] border transition-all duration-200 focus:outline-none cursor-pointer",
                  isSelected
                    ? "bg-gradient-to-b from-[#6FA0D6] to-[#3E66A8] text-white border-transparent shadow-md scale-[1.04]"
                    : d.isToday
                    ? "bg-[#EEF5FF] border-[#6FA0D6] text-[#3E66A8]"
                    : "bg-white border-[#EEF0F4] text-[#4A5568] hover:border-[#6FA0D6] hover:bg-[#F4F8FF]",
                ].join(" ")}
              >
                <span className="text-[12px] font-semibold">{d.dayName}</span>
                <span className={`text-[24px] font-bold mt-0.5 leading-tight ${isSelected ? "text-white" : "text-[#1A2B45]"}`}>
                  {faNum(d.persianDay)}
                </span>
                <span className={`text-[11px] mt-0.5 ${isSelected ? "text-white/80" : "text-[#9DB3C9]"}`}>
                  {d.monthName}
                </span>
                {/* dot: has class */}
                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full transition-opacity ${
                    hasClass ? "opacity-100" : "opacity-0"
                  } ${isSelected ? "bg-white" : "bg-[#6FA0D6]"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected day header ── */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[#6FA0D6] to-[#3E66A8]" />
        <h3 className="text-[16px] font-bold text-[#4A5568]">
          {WEEK_NAMES[selectedDay]}
          {weekDays[selectedDay] && (
            <span className="font-normal text-[#9DB3C9] mr-2">
              {faNum(weekDays[selectedDay].persianDay)} {weekDays[selectedDay].monthName}
            </span>
          )}
        </h3>
      </div>

      {/* ── Class cards ── */}
      {dayClasses.length === 0 ? (
        <div className="rounded-[16px] bg-white border border-[#EEF0F4] py-16 flex flex-col items-center justify-center text-[#9DB3C9]">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p className="text-[15px]">کلاسی برای این روز ثبت نشده است</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayClasses.map((cls, idx) => (
            <div key={cls.id} className="bg-white rounded-[14px] border border-[#EEF0F4] flex overflow-hidden hover:shadow-md transition-shadow">
              {/* Color stripe */}
              <div className="w-[5px] shrink-0" style={{ background: STRIPE_COLORS[idx % STRIPE_COLORS.length] }} />

              <div className="flex-1 px-5 py-4 flex items-center gap-5">
                {/* Time block */}
                <div className="shrink-0 text-center min-w-[60px]">
                  <div className="text-[15px] font-bold text-[#3E66A8]">{toHm(cls.starts_at)}</div>
                  <div className="text-[10px] text-[#C4D3E0] my-0.5">—</div>
                  <div className="text-[15px] font-bold text-[#3E66A8]">{toHm(cls.ends_at)}</div>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-[#EEF0F4] shrink-0" />

                {/* Lesson & teacher */}
                <div className="min-w-0 flex-1 sm:flex-initial">
                  <p className="text-[17px] font-bold text-[#1A2B45] truncate">{cls.lesson}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9DB3C9"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[13px] text-[#7A9BB5] truncate">{cls.teacher}</span>
                  </div>
                </div>

                {/* Duration pill */}
                <div className="mr-auto flex items-center gap-3">
                  <span className="text-[11px] bg-[#EEF5FF] text-[#3E66A8] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                    {(() => {
                      const [sh, sm] = cls.starts_at.split(":").map(Number);
                      const [eh, em] = cls.ends_at.split(":").map(Number);
                      const mins = (eh * 60 + em) - (sh * 60 + sm);
                      return `${faNum(mins)} دقیقه`;
                    })()}
                  </span>

                  {role === "teacher" && (
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="p-1 rounded-[6px] hover:bg-red-50 text-red-500 transition cursor-pointer"
                      title="حذف کلاس"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Class Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleAddClass}
            className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl"
          >
            <h3 className="text-[18px] font-bold text-[#1A2B45] mb-2">تعریف کلاس جدید</h3>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">نام درس</label>
              <input
                type="text"
                required
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="مثلاً ریاضی، شیمی و..."
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] focus:ring-4 focus:ring-[#6FA0D6]/10 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">نام دبیر</label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="مثلاً آقای احمدی"
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] focus:ring-4 focus:ring-[#6FA0D6]/10 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">ساعت شروع</label>
                <input
                  type="time"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">ساعت پایان</label>
                <input
                  type="time"
                  required
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">روز هفته</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] bg-white transition cursor-pointer"
              >
                {WEEK_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-10 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
              >
                ثبت کلاس
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-10 rounded-[10px] border border-[#EEF0F4] hover:bg-[#F4F7FB] text-[#7A9BB5] text-[14px] font-semibold transition cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
