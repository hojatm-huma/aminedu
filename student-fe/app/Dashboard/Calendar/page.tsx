"use client";

import { useMemo } from "react";

type PersianParts = {
  yearFa: string;
  monthNameFa: string;
  dayFa: string;
  year: number;
  day: number;
  monthName: string;
};

type Cell = {
  day: number;
  inMonth: boolean;
};

function faDigitsToEnNumber(fa: string): number {
  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  const en = fa.replace(/[۰-۹]/g, (d) => map[d] ?? d).replace(/٬/g, "");
  const n = Number(en);
  return Number.isFinite(n) ? n : 0;
}

function getPersianParts(date: Date): PersianParts {
  const fmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parts = fmt.formatToParts(date);

  const yearFa = parts.find((p) => p.type === "year")?.value ?? "";
  const monthNameFa = parts.find((p) => p.type === "month")?.value ?? "";
  const dayFa = parts.find((p) => p.type === "day")?.value ?? "";

  return {
    yearFa,
    monthNameFa,
    dayFa,
    year: faDigitsToEnNumber(yearFa),
    day: faDigitsToEnNumber(dayFa),
    monthName: monthNameFa,
  };
}

function jsDayToSaturdayIndex(jsDay: number) {
  return (jsDay + 1) % 7;
}

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export default function CalendarPage() {
  const now = new Date();
  const todayP = getPersianParts(now);

  const { title, cells } = useMemo(() => {
    let cursor = new Date(now);
    let cursorP = getPersianParts(cursor);

    if (!cursorP.monthNameFa || !cursorP.yearFa) {
      return { title: "—", cells: [] as Cell[] };
    }

    while (cursorP.day !== 1) {
      cursor.setDate(cursor.getDate() - 1);
      cursorP = getPersianParts(cursor);
      if (!cursorP.monthNameFa) break;
    }

    const monthStart = new Date(cursor);
    const startIndex = jsDayToSaturdayIndex(monthStart.getDay());

    let daysInMonth = 0;
    {
      const probe = new Date(monthStart);
      const base = getPersianParts(probe);

      while (true) {
        const p = getPersianParts(probe);
        if (p.monthNameFa !== base.monthNameFa || p.yearFa !== base.yearFa)
          break;

        daysInMonth++;
        probe.setDate(probe.getDate() + 1);
        if (daysInMonth > 32) break;
      }
    }

    let prevMonthDays = 0;
    {
      const prev = new Date(monthStart);
      prev.setDate(prev.getDate() - 1);
      prevMonthDays = getPersianParts(prev).day;
    }

    const cells: Cell[] = Array.from({ length: 35 }, (_, i) => {
      if (i < startIndex) {
        const day = prevMonthDays - (startIndex - 1 - i);
        return { day, inMonth: false };
      }

      const d = i - startIndex + 1;

      if (d >= 1 && d <= daysInMonth) {
        return { day: d, inMonth: true };
      }

      return { day: d - daysInMonth, inMonth: false };
    });

    const title = `${todayP.monthNameFa}، ${todayP.yearFa}`;
    return { title, cells };
  }, [now]);

  return (
    <section>
      <div className="bg-white rounded-[14px] p-3 sm:p-4 lg:p-5 ">
        <div className="flex justify-end mb-3">
          <div className="text-[16px] sm:text-[18px] lg:text-[19px] text-[#000000] font-bold">
            {title}
          </div>
        </div>

        <div className="overflow-x-auto border border-[#eef0f4] rounded-[10px] sm:rounded-[12px]">
          <div className="min-w-[720px] sm:min-w-0">
            <div
              dir="rtl"
              className="grid grid-cols-7 bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8] text-white text-[11px] sm:text-[12px]"
            >
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="py-2 px-2 text-start font-bold border-t border-l border-[#eef0f4]"
                >
                  {d}
                </div>
              ))}
            </div>

            <div dir="rtl" className="grid grid-cols-7">
              {cells.map((cell, idx) => {
                const isFridayCol = idx % 7 === 6;
                const isToday = cell.inMonth && cell.day === todayP.day;

                return (
                  <div
                    key={idx}
                    className={[
                      "h-[72px] sm:h-[96px] md:h-[110px] 2xl:h-[140px] lg:h-[120px] border-t border-l border-[#eef0f4] relative",
                      isFridayCol ? "bg-[#F3F6FB]" : "bg-white",
                      !cell.inMonth ? "opacity-55" : "",
                      isToday ? "ring-2 ring-[#3b6fa7]/30" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-2 sm:top-3 right-2 sm:right-3 text-[12px] sm:text-[14px] lg:text-[16px] font-bold",
                        cell.inMonth ? "text-[#000000]" : "text-[#6B7280]",
                      ].join(" ")}
                    >
                      {new Intl.NumberFormat("fa-IR").format(cell.day)}
                    </span>

                    {isToday && (
                      <span className="absolute top-2 sm:top-3 left-2 sm:left-3 h-2 w-2 rounded-full bg-[#3b6fa7]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
