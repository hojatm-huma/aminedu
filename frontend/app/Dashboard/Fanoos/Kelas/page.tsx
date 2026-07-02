"use client";

import { useState, useMemo } from "react";

// ── Persian calendar helpers ──────────────────────────────────────────────────
function faToEn(fa: string): number {
  const map: Record<string, string> = {
    "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
  };
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

// JS getDay(): 0=Sun … 6=Sat  →  Persian week: 0=Sat … 6=Fri
function jsToPerIdx(jsDay: number) { return (jsDay + 1) % 7; }

const WEEK_NAMES = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];

// ── Mock data (matches backend API shape from /classes/weekly-schedule/) ──────
type ClassItem = {
  id: number;
  lesson: { name: string };
  teacher: { full_name: string };
  starts_at: string;
  ends_at: string;
  day_of_week: number; // 0=Saturday … 6=Friday
};

const MOCK_CLASSES: ClassItem[] = [
  { id:1, lesson:{name:"ریاضی"},         teacher:{full_name:"آقای احمدی"},  starts_at:"08:00", ends_at:"09:30", day_of_week:0 },
  { id:2, lesson:{name:"فیزیک"},         teacher:{full_name:"خانم کریمی"},  starts_at:"10:00", ends_at:"11:30", day_of_week:0 },
  { id:3, lesson:{name:"شیمی"},          teacher:{full_name:"آقای رضایی"}, starts_at:"13:00", ends_at:"14:30", day_of_week:1 },
  { id:4, lesson:{name:"ادبیات"},        teacher:{full_name:"خانم موسوی"},  starts_at:"09:00", ends_at:"10:30", day_of_week:2 },
  { id:5, lesson:{name:"زبان انگلیسی"}, teacher:{full_name:"آقای صادقی"},  starts_at:"11:00", ends_at:"12:30", day_of_week:2 },
  { id:6, lesson:{name:"عربی"},          teacher:{full_name:"خانم حسینی"},  starts_at:"08:30", ends_at:"10:00", day_of_week:4 },
  { id:7, lesson:{name:"دینی"},          teacher:{full_name:"آقای مهدوی"},  starts_at:"14:00", ends_at:"15:30", day_of_week:4 },
  { id:8, lesson:{name:"ریاضی"},         teacher:{full_name:"آقای احمدی"},  starts_at:"08:00", ends_at:"09:30", day_of_week:3 },
];

const STRIPE_COLORS = ["#3E66A8","#5B8AC4","#7FA8D5","#4A7BB8","#2D5A9E","#6495C4","#3870B0"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function KelasPage() {
  const today = new Date();
  const todayIdx = jsToPerIdx(today.getDay());

  // Build this week's 7 days starting from Saturday
  const weekDays = useMemo(() => {
    const daysFromSat = jsToPerIdx(today.getDay());
    const sat = new Date(today);
    sat.setDate(today.getDate() - daysFromSat);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sat);
      d.setDate(sat.getDate() + i);
      const { day, monthName } = getPersianDay(d);
      return { dayOfWeek: i, dayName: WEEK_NAMES[i], persianDay: day, monthName, isToday: i === todayIdx };
    });
  }, []);

  const [selectedDay, setSelectedDay] = useState(todayIdx);

  const dayClasses = MOCK_CLASSES
    .filter((c) => c.day_of_week === selectedDay)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));

  const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

  return (
    <div dir="rtl" className="space-y-5">
      <h2 className="text-[20px] font-bold text-[#1A2B45]">برنامه کلاسی هفتگی</h2>

      {/* ── Day selector strip ── */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max">
          {weekDays.map((d) => {
            const isSelected = selectedDay === d.dayOfWeek;
            const hasClass = MOCK_CLASSES.some((c) => c.day_of_week === d.dayOfWeek);
            return (
              <button
                key={d.dayOfWeek}
                onClick={() => setSelectedDay(d.dayOfWeek)}
                className={[
                  "flex flex-col items-center px-4 py-3 rounded-[14px] min-w-[82px] border transition-all duration-200 focus:outline-none",
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
                  <div className="text-[15px] font-bold text-[#3E66A8]">{cls.starts_at}</div>
                  <div className="text-[10px] text-[#C4D3E0] my-0.5">—</div>
                  <div className="text-[15px] font-bold text-[#3E66A8]">{cls.ends_at}</div>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-[#EEF0F4] shrink-0" />

                {/* Lesson & teacher */}
                <div>
                  <p className="text-[17px] font-bold text-[#1A2B45]">{cls.lesson.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9DB3C9"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[13px] text-[#7A9BB5]">{cls.teacher.full_name}</span>
                  </div>
                </div>

                {/* Duration pill */}
                <div className="mr-auto">
                  <span className="text-[11px] bg-[#EEF5FF] text-[#3E66A8] font-semibold px-2.5 py-1 rounded-full">
                    {(() => {
                      const [sh, sm] = cls.starts_at.split(":").map(Number);
                      const [eh, em] = cls.ends_at.split(":").map(Number);
                      const mins = (eh * 60 + em) - (sh * 60 + sm);
                      return `${faNum(mins)} دقیقه`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
