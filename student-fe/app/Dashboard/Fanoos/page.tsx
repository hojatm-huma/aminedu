"use client";

import Link from "next/link";
import { NAV_ITEMS } from "../layout";

const SUBTAB_INFO: Record<string, { icon: React.ReactNode }> = {
  "/Dashboard/Fanoos/Kelas": {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  "/Dashboard/Fanoos/Tamrin": {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
};

const DEFAULT_ICON = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export default function FanoosPage() {
  const fanoos = NAV_ITEMS.find((item) => item.key === "Fanoos");
  const subtabs = fanoos?.subtabs ?? [];

  return (
    <div dir="rtl" className="flex min-h-full items-center justify-center">
      <div className="grid w-full max-w-[820px] grid-cols-2 gap-5 sm:grid-cols-3">
        {subtabs.map((sub) => (
          <Link
            key={sub.route}
            href={sub.route}
            className="group flex flex-col items-center justify-center gap-3 rounded-[24px] bg-white px-4 py-8 text-center transition hover:bg-[#EEF5FF]"
            style={{ boxShadow: "0 2px 24px rgba(25,28,30,0.06)" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] text-white transition group-hover:scale-105">
              {SUBTAB_INFO[sub.route]?.icon ?? DEFAULT_ICON}
            </div>
            <div className="text-[16px] font-bold text-[#1A2B45]">{sub.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
