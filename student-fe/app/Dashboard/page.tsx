"use client";

import Link from "next/link";
import { NAV_ITEMS, type NavItem } from "./layout";

const MODULE_INFO: Record<string, { subtitle: string; icon: React.ReactNode }> = {
  Fanoos: {
    subtitle: "تحصیلی",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2h6l-1 4h3l-6 9-1-5H7z" />
        <path d="M10 15h4l-.5 4a1.5 1.5 0 0 1-3 0z" />
      </svg>
    ),
  },
  // Sanjeh: {
  //   subtitle: "تفکر",
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V17h6v-1.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  //       <path d="M9 20h6M10 22h4" />
  //     </svg>
  //   ),
  // },
  // Safineh: {
  //   subtitle: "کتاب",
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  //       <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  //     </svg>
  //   ),
  // },
  // Borna: {
  //   subtitle: "کاربردی",
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L21 6l-3-3z" />
  //     </svg>
  //   ),
  // },
  // Yas: {
  //   subtitle: "زبان",
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
  //       <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
  //     </svg>
  //   ),
  // },
  // Mehraneh: {
  //   subtitle: "سلامت روان و خانواده",
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M12 20s-7-4.35-9.3-8.6C1.4 8.4 3 5 6.4 5c1.9 0 3.2 1 3.6 2.1C10.4 6 11.7 5 13.6 5 17 5 18.6 8.4 21.3 11.4 19 15.65 12 20 12 20z" />
  //     </svg>
  //   ),
  // },
  // Kada: {
  //   subtitle: "داده",
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  //       <ellipse cx="12" cy="5" rx="8" ry="3" />
  //       <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
  //       <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
  //     </svg>
  //   ),
  // },
  Poshtibani: {
    subtitle: "ارتباط با ما",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
};

function ModuleCard({ item }: { item: NavItem }) {
  const info = MODULE_INFO[item.key];
  return (
    <Link
      href={item.route}
      className="group flex flex-col items-center justify-center gap-3 rounded-[24px] bg-white px-4 py-8 text-center transition hover:bg-[#EEF5FF]"
      style={{ boxShadow: "0 2px 24px rgba(25,28,30,0.06)" }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] text-white transition group-hover:scale-105">
        {info?.icon}
      </div>
      <div>
        <div className="text-[16px] font-bold text-[#1A2B45]">{item.label}</div>
        {info?.subtitle && (
          <div className="mt-1 text-[13px] text-[#7A9BB5]">({info.subtitle})</div>
        )}
      </div>
    </Link>
  );
}

export default function Dashboard() {
  return (
    <div dir="rtl" className="flex min-h-full items-center justify-center">
      <div className="grid w-full max-w-[820px] grid-cols-2 gap-5 sm:grid-cols-3">
        {NAV_ITEMS.map((item) => (
          <ModuleCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}
