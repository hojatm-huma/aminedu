"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStudents } from "@/libs/hooks/apis/students";

type SubTab = { label: string; route: string };
type NavItem = { label: string; key: string; route: string; subtabs: SubTab[] };

const NAV_ITEMS: NavItem[] = [
  {
    label: "فانوس",
    key: "Fanoos",
    route: "/Dashboard/Fanoos",
    subtabs: [
      { label: "برنامه هفتگی کلاسی", route: "/Dashboard/Fanoos/Kelas" },
      { label: "تمرین کلاسی", route: "/Dashboard/Fanoos/Tamrin" },
      { label: "آزمون", route: "/Dashboard/Fanoos/Azmoon" },
      { label: "مشاوره", route: "/Dashboard/Fanoos/Counseling" },
      { label: "سوال و رفع اشکال", route: "/Dashboard/Fanoos/QA" },
      { label: "جزوات", route: "/Dashboard/Fanoos/Jozovat" },
    ],
  },
  { label: "سنجه",     key: "Sanjeh",     route: "/Dashboard/Sanjeh",     subtabs: [] },
  { label: "سفینه",    key: "Safineh",    route: "/Dashboard/Safineh",    subtabs: [] },
  { label: "برنا",     key: "Borna",      route: "/Dashboard/Borna",      subtabs: [] },
  { label: "یاس",      key: "Yas",        route: "/Dashboard/Yas",        subtabs: [] },
  { label: "مهرانه",   key: "Mehraneh",   route: "/Dashboard/Mehraneh",   subtabs: [] },
  { label: "کادا",     key: "Kada",       route: "/Dashboard/Kada",       subtabs: [] },
  { label: "پشتیبانی", key: "Poshtibani", route: "/Dashboard/Poshtibani", subtabs: [] },
];

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className || ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function NavLinks({
  hoveredKey,
  setHoveredKey,
  pathname,
  onNavigate,
  flyout = false,
}: {
  hoveredKey: string | null;
  setHoveredKey: (k: string | null) => void;
  pathname: string;
  onNavigate?: () => void;
  flyout?: boolean;
}) {
  return (
    <nav dir="rtl" className="px-3 py-6 space-y-1">
      {NAV_ITEMS.map((item) => {
        const isHovered = hoveredKey === item.key;
        const hasSubtabs = item.subtabs.length > 0;
        const isActive = pathname.startsWith(`/Dashboard/${item.key}`);
        const activeCls = "bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white shadow-sm";
        const idleCls   = "text-[#7A9BB5] hover:bg-[#E8F0FA] hover:text-[#3E66A8]";

        return (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => hasSubtabs && setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {/* Parent tab */}
            {hasSubtabs ? (
              <div className={`flex items-center justify-between px-4 py-3 rounded-[14px] transition cursor-default select-none ${isActive || isHovered ? activeCls : idleCls}`}>
                <span className="text-[16px] font-semibold">{item.label}</span>
                {flyout ? (
                  <span className={`transition-transform duration-200 ${isHovered ? "-translate-x-1" : ""}`}>
                    <ChevronLeft />
                  </span>
                ) : (
                  <span className={`transition-transform duration-200 ${isHovered ? "rotate-180" : ""}`}>
                    <ChevronLeft className="rotate-270" />
                  </span>
                )}
              </div>
            ) : (
              <Link
                href={item.route}
                onClick={onNavigate}
                className={`flex items-center px-4 py-3 rounded-[14px] transition ${isActive ? activeCls : idleCls}`}
              >
                <span className="text-[16px] font-semibold">{item.label}</span>
              </Link>
            )}

            {/* Subtabs */}
            {hasSubtabs && (
              flyout ? (
                /* ── Desktop: flyout panel to the LEFT of sidebar ── */
                <div
                  className={[
                    "absolute top-0 right-full z-50 pr-2 transition-all duration-200",
                    isHovered
                      ? "opacity-100 pointer-events-auto translate-x-0"
                      : "opacity-0 pointer-events-none translate-x-2",
                  ].join(" ")}
                >
                  <div className="bg-white rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.13)] border border-[#EEF0F4] py-2 min-w-[200px]" dir="rtl">
                    {/* Arrow tip */}
                    <div className="absolute top-3.5 right-0 translate-x-[6px] w-3 h-3 bg-white border-t border-r border-[#EEF0F4] rotate-45" />
                    {item.subtabs.map((sub) => {
                      const isSubActive = pathname === sub.route;
                      return (
                        <Link
                          key={sub.route}
                          href={sub.route}
                          onClick={onNavigate}
                          className={`flex items-center px-4 py-2.5 text-[14px] transition ${
                            isSubActive
                              ? "bg-[#EEF5FF] text-[#3E66A8] font-bold"
                              : "text-[#4A5568] hover:bg-[#F4F8FF] hover:text-[#3E66A8]"
                          }`}
                        >
                          {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#3E66A8] ml-2 shrink-0" />}
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ── Mobile: accordion expand below ── */
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? "max-h-80 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                  <div className="mr-3 pr-3 border-r-2 border-[#6FA0D6]/40 space-y-1 pb-1">
                    {item.subtabs.map((sub) => {
                      const isSubActive = pathname === sub.route;
                      return (
                        <Link
                          key={sub.route}
                          href={sub.route}
                          onClick={onNavigate}
                          className={`block px-3 py-2 rounded-[10px] text-[14px] transition ${
                            isSubActive
                              ? "bg-[#DDE9F8] text-[#3E66A8] font-bold"
                              : "text-[#7A9BB5] hover:bg-[#EEF5FF] hover:text-[#3E66A8]"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        );
      })}
    </nav>
  );
}

function ProfileAvatar({ name, onClick }: { name: string; onClick: (e: React.MouseEvent) => void }) {
  const initials = name.slice(0, 2);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-[10px] px-2 py-1 hover:bg-[#F0F5FF] transition"
    >
      <span className="text-[13px] font-bold text-[#4A5568] hidden sm:block">{name}</span>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
        {initials}
      </div>
    </button>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { getProfile } = useStudents();

  const [displayName, setDisplayName]             = useState("کاربر");
  const [sidebarOpen, setSidebarOpen]             = useState(false);
  const [userMenuOpen, setUserMenuOpen]           = useState(false);
  const [hoveredKey, setHoveredKey]               = useState<string | null>(null);
  const [openNotifModal, setOpenNotifModal]       = useState(false);
  const [openMsgModal, setOpenMsgModal]           = useState(false);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((res) => {
        if (!active) return;
        const { first_name, last_name } = res.data;
        const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();
        if (fullName) setDisplayName(fullName);
      })
      .catch(() => {
        const saved = localStorage.getItem("username");
        if (active && saved) setDisplayName(saved);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);
  useEffect(() => { setUserMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <div className="flex min-h-screen">

        {/* ── Main content area ── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Header */}
          <header dir="rtl" className="h-[64px] bg-white border-b border-[#EEF0F4] flex items-center px-4 sm:px-6 gap-3 shrink-0">

            {/* Profile avatar (top-right in RTL = start) */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <ProfileAvatar name={displayName} onClick={() => setUserMenuOpen((v) => !v)} />
              {/* Dropdown */}
              <div className={`absolute top-full right-0 z-50 pt-2 transition-all duration-200 ${userMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"}`}>
                <div dir="rtl" className="rounded-[14px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#EEF0F4] p-1 w-[160px]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-[12px] font-bold text-[#C53030] hover:bg-red-50 transition cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>خروج از حساب</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 flex justify-center px-2">
              <div className="w-full max-w-[560px] hidden sm:block">
                <div className="h-9 rounded-[10px] bg-[#F4F7FB] flex items-center px-3 gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input className="w-full bg-transparent outline-none text-[13px] text-[#587181] placeholder:text-[#A0AEC0]" placeholder="جستجو..." />
                </div>
              </div>
            </div>

            {/* Icons (left side in RTL = visually left) */}
            <div className="flex items-center gap-2">
              <button onClick={() => setOpenNotifModal(true)} className="w-9 h-9 rounded-[10px] bg-[#F4F7FB] flex items-center justify-center hover:bg-[#E8F0FA] transition" aria-label="اعلان‌ها">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#587181" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
              <button onClick={() => setOpenMsgModal(true)} className="w-9 h-9 rounded-[10px] bg-[#F4F7FB] flex items-center justify-center hover:bg-[#E8F0FA] transition" aria-label="پیام‌ها">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#587181" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
              {/* Hamburger (mobile only) */}
              <button
                type="button"
                aria-label="باز کردن منو"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 rounded-[10px] bg-[#F4F7FB] flex items-center justify-center"
              >
                <span className="relative block w-5 h-4">
                  <span className="absolute right-0 top-0 h-[2px] w-5 bg-[#587181] rounded" />
                  <span className="absolute right-0 top-[7px] h-[2px] w-5 bg-[#587181] rounded" />
                  <span className="absolute right-0 top-[14px] h-[2px] w-5 bg-[#587181] rounded" />
                </span>
              </button>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </div>

        {/* ── Desktop Sidebar (right) ── */}
        <aside className="hidden lg:flex flex-col w-[240px] bg-white border-l border-[#EEF0F4] shrink-0">
          {/* Logo */}
          <div className="h-[64px] flex items-center justify-center gap-3 border-b border-[#EEF0F4] px-4">
            <img src="/LOGO.png" alt="" className="h-8" />
            <span className="font-bold text-[20px] text-[#1A2B45]">پلتفرم امین</span>
          </div>
          <div className="flex-1 overflow-visible">
            <NavLinks hoveredKey={hoveredKey} setHoveredKey={setHoveredKey} pathname={pathname} flyout={true} />
          </div>
        </aside>

        {/* ── Mobile backdrop ── */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-opacity ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* ── Mobile Sidebar (slides in from right) ── */}
        <aside
          className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[80%] max-w-[300px] bg-white py-4 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 pb-3 border-b border-[#EEF0F4]">
            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-[8px] bg-[#F4F7FB] flex items-center justify-center text-[20px] leading-none">×</button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[18px] text-[#1A2B45]">پلتفرم امین</span>
              <img src="/LOGO.png" alt="" className="h-7" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavLinks hoveredKey={hoveredKey} setHoveredKey={setHoveredKey} pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
          </div>
        </aside>
      </div>

      {/* ── Modals ── */}
      {(openNotifModal || openMsgModal) && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4" onClick={() => { setOpenNotifModal(false); setOpenMsgModal(false); }}>
          <div className="w-full max-w-[480px] rounded-[18px] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-[20px] font-bold mb-4">{openNotifModal ? "اعلان‌ها" : "پیام‌ها"}</h3>
            <div className="p-3 rounded-[10px] bg-[#F4F7FB] text-[14px] text-gray-500">
              {openNotifModal ? "اعلان جدیدی وجود ندارد." : "پیامی برای نمایش وجود ندارد."}
            </div>
            <button
              onClick={() => { setOpenNotifModal(false); setOpenMsgModal(false); }}
              className="mt-5 w-full rounded-[12px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] py-3 text-white font-semibold hover:brightness-110 transition"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
