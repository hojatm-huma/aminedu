"use client";

import { useEffect, useState } from "react";
import { useClasses } from "@/libs/hooks/apis/classes";
import { KlassRegistration } from "@/libs/types/classes";

const STRIPE_COLORS = [
  "#3E66A8",
  "#5B8AC4",
  "#7FA8D5",
  "#4A7BB8",
  "#2D5A9E",
  "#6495C4",
  "#3870B0",
];

const faNum = (n: number | string) =>
  new Intl.NumberFormat("fa-IR").format(Number(n) || 0);

export default function FanoosPage() {
  const { getRegistrations } = useClasses();
  const [registrations, setRegistrations] = useState<KlassRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRegistrations()
      .then((res) => setRegistrations(res.data))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl" className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[#6FA0D6] to-[#3E66A8]" />
        <h2 className="text-[20px] font-bold text-[#1A2B45]">
          کلاس‌های ثبت‌نام‌شده
        </h2>
      </div>

      {loading ? (
        <div className="rounded-[16px] bg-white border border-[#EEF0F4] py-16 flex items-center justify-center text-[#9DB3C9] text-[15px]">
          در حال بارگذاری...
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-[16px] bg-white border border-[#EEF0F4] py-16 flex flex-col items-center justify-center text-[#9DB3C9]">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3 opacity-40"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <p className="text-[15px]">در هیچ کلاسی ثبت‌نام نکرده‌اید</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg, idx) => (
            <div
              key={reg.id}
              className="bg-white rounded-[14px] border border-[#EEF0F4] flex overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color stripe */}
              <div
                className="w-[5px] shrink-0"
                style={{
                  background: STRIPE_COLORS[idx % STRIPE_COLORS.length],
                }}
              />

              <div className="flex-1 px-5 py-4 flex items-center gap-5">
                {/* Class name & teacher */}
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold text-[#1A2B45] truncate">
                    {reg.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9DB3C9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[13px] text-[#7A9BB5] truncate">
                      {reg.teacher}
                    </span>
                  </div>
                </div>

                {/* Exercise count pill */}
                <div className="mr-auto shrink-0">
                  <span className="flex items-center gap-1.5 text-[12px] bg-[#EEF5FF] text-[#3E66A8] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="13" x2="15" y2="13" />
                      <line x1="9" y1="17" x2="15" y2="17" />
                    </svg>
                    {faNum(reg.exercise_count)} تمرین
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
