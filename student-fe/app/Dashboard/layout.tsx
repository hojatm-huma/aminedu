"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("کاربر");
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/");
  };



  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) setDisplayName(saved);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeCalendar =
    pathname === "/Dashboard/Calendar" || pathname === "/dashboard";
  const activeHome = pathname === "/Dashboard";
  const activeProfile = pathname.startsWith("/Dashboard/Profile");
  const activeSettings = pathname.startsWith("/Dashboard/Settings");

  const NavLinks = () => (
    <nav className="p-4 py-10 space-y-6">
      <Link
        href="/Dashboard"
        className={[
          "group w-full flex items-center gap-6 px-4 py-3 rounded-[20px] transition",
          activeHome
            ? "bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8] text-white shadow-sm"
            : "text-[#9DB3C9] hover:bg-gradient-to-r hover:from-[#6FA0D6] hover:to-[#3E66A8] hover:text-white",
        ].join(" ")}
      >
        <div className="w-[40px] h-[35px] flex items-center justify-center shrink-0">
          <img
            src="/Vector (8).svg"
            alt=""
            className={[activeHome ? "hidden" : "block", "group-hover:hidden"].join(
              " "
            )}
          />
          <img
            src="/home.svg"
            alt=""
            className={[activeHome ? "block" : "hidden", "group-hover:block"].join(
              " "
            )}
          />
        </div>
        <span className="text-[18px] sm:text-[18px] font-semibold">صفحه اصلی</span>
      </Link>

      <Link
        href="/Dashboard/Calendar"
        className={[
          "group w-full flex items-center gap-6 px-4 py-3 rounded-[20px] transition",
          activeCalendar
            ? "bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8] text-white shadow-sm"
            : "text-[#9DB3C9] hover:bg-gradient-to-r hover:from-[#6FA0D6] hover:to-[#3E66A8] hover:text-white",
        ].join(" ")}
      >
        <div className="w-[40px] h-[35px] flex items-center justify-center shrink-0">
          <img
            src="/clandar.svg"
            alt=""
            className={[
              activeCalendar ? "hidden" : "block",
              "group-hover:hidden",
            ].join(" ")}
          />
          <img
            src="/Vector (9).svg"
            alt=""
            className={[
              activeCalendar ? "block" : "hidden",
              "group-hover:block",
            ].join(" ")}
          />
        </div>
        <span className="text-[18px] sm:text-[18px] font-semibold">تقویم</span>
      </Link>

      <Link
        href="/Dashboard/Profile"
        className={[
          "group w-full flex items-center gap-6 px-4 py-3 rounded-[20px] transition",
          activeProfile
            ? "bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8] text-white shadow-sm"
            : "text-[#9DB3C9] hover:bg-gradient-to-r hover:from-[#6FA0D6] hover:to-[#3E66A8] hover:text-white",
        ].join(" ")}
      >
        <div className="w-[40px] h-[35px] flex items-center justify-center shrink-0">
          <img
            src="/Group 237486.svg"
            alt=""
            className={[
              activeProfile ? "hidden" : "block",
              "group-hover:hidden",
            ].join(" ")}
          />
          <img
            src="/prof.svg"
            alt=""
            className={[
              activeProfile ? "block" : "hidden",
              "group-hover:block",
            ].join(" ")}
          />
        </div>
        <span className="text-[18px] sm:text-[18px] font-semibold">پروفایل</span>
      </Link>

      <Link
        href="/Dashboard/Settings"
        className={[
          "group w-full flex items-center gap-6 px-4 py-3 rounded-[20px] transition",
          activeSettings
            ? "bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8] text-white shadow-sm"
            : "text-[#9DB3C9] hover:bg-gradient-to-r hover:from-[#6FA0D6] hover:to-[#3E66A8] hover:text-white",
        ].join(" ")}
      >
        <div className="w-[40px] h-[35px] flex items-center justify-center shrink-0">
          <img
            src="/Vector (10).svg"
            alt=""
            className={[
              activeSettings ? "hidden" : "block",
              "group-hover:hidden",
            ].join(" ")}
          />
          <img
            src="/setting.svg"
            alt=""
            className={[
              activeSettings ? "block" : "hidden",
              "group-hover:block",
            ].join(" ")}
          />
        </div>
        <span className="text-[18px] sm:text-[18px] font-semibold">تنظیمات</span>
      </Link>
    </nav>
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <div className="flex-1 min-w-0">
          <header className="h-[64px] bg-white flex  items-center pt-15 pb-10 max-sm:pt-10 max-sm:pb-2 px-4 sm:px-6 lg:px-12">
            <div
              className="relative group flex items-center gap-2 text-[13px] text-[#4A5568] min-w-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#F9FCFF] px-2 pt-2 rounded-[8px]">
                <img src="/Group 237549.svg" alt="" />
              </div>

              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2"
              >
                <span className="font-bold truncate max-w-[120px]">
                  {displayName}
                </span>
                <img
                  src="/Arrow 45 (Stroke).svg"
                  alt=""
                  className={[
                    "transition-transform duration-200",

                    "rotate-270",


                    "lg:group-hover:rotate-360",

                    userMenuOpen ? "rotate-360 lg:rotate-270" : "",
                  ].join(" ")}
                />

              </button>

              <div
                className={[

                  "absolute top-full left-0 z-50",
                  "pt-3",

                  "w-[160px] ",

                  "transition-all duration-200",

                  "lg:opacity-0 lg:pointer-events-none lg:-translate-y-2",
                  "lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0",

                  userMenuOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-2",
                ].join(" ")}
              >
                <div
                  className="rounded-[14px] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-[#eef0f4] p-1"
                  onClick={(e) => e.stopPropagation()}
                  dir="rtl"
                >
                  <button
                    onClick={handleLogout}
                    className="
          w-full flex items-center gap-3
          px-3 py-3
          rounded-[10px]

          text-[12px] 
          font-bold
          text-[#C53030]

          hover:bg-red-50
          active:bg-red-100
          transition
          cursor-pointer

        "
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>

                    <span>خروج از حساب کاربری</span>
                  </button>
                </div>
              </div>
            </div>


            <div className="flex-1 flex justify-center px-3">
              <div className="w-full max-w-[680px] hidden sm:block">
                <div className="h-10 rounded-[10px] bg-[#F9FCFF] flex items-center px-4">
                  <img src="/Vector (12).svg" alt="" />
                  <input
                    className="w-full bg-transparent pl-2 outline-none text-[14px] text-[#587181] placeholder:text-[#A0AEC0]"
                    placeholder="جستجو"
                  />
                </div>
              </div>
            </div>

            <div className="min-w-[120px] sm:min-w-[180px] flex items-center justify-end gap-3 sm:gap-4">
              <img
                src="/Vector (11).svg"
                className="cursor-pointer"
                alt="اعلان‌ها"
                onClick={() => setOpenNotificationModal(true)}
              />

              <img
                src="/Group 237222.svg"
                className="cursor-pointer"
                alt="پیام‌ها"
                onClick={() => setOpenMessageModal(true)}
              />


              <button
                type="button"
                aria-label="باز کردن منو"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-10 w-10 rounded-[10px] bg-[#F9FCFF] flex items-center justify-center active:scale-[0.98]"
              >
                <span className="relative block w-5 h-4">
                  <span className="absolute right-0 top-0 h-[2px] w-5 bg-[#587181] rounded" />
                  <span className="absolute right-0 top-[6px] h-[2px] w-5 bg-[#587181] rounded" />
                  <span className="absolute right-0 top-[12px] h-[2px] w-5 bg-[#587181] rounded" />
                </span>
              </button>
            </div>
          </header>

          <div className="p-4 sm:p-6">{children}</div>
        </div>

        <aside className="hidden lg:block w-[260px] bg-[#F9FCFF] py-8 px-2">
          <div className="h-[64px] flex items-center justify-between px-7">
            <div className="flex px-2 items-center gap-5">
              <img src="/Group 237546.svg" alt="" />
              <span className="font-bold text-[26px] text-[#000000]">
                پلتفرم امین
              </span>
            </div>
          </div>
          <NavLinks />
        </aside>

        <div
          className={[
            "lg:hidden fixed inset-0 z-40 transition-opacity",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <aside
          className={[
            "lg:hidden fixed top-0 right-0 z-50 h-full w-[85%] max-w-[320px] bg-[#F9FCFF] py-6 px-4",
            "transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-[64px] flex items-center justify-center gap-12 px-3">
            <div className="flex items-center gap-3">
              <img src="/Group 237546.svg" alt="" />
              <span className="font-bold text-[24px] text-[#000000]">
                پلتفرم امین
              </span>
            </div>

            <button
              type="button"
              aria-label="بستن منو"
              onClick={() => setSidebarOpen(false)}
              className="h-10 w-10 rounded-[10px] bg-white flex items-center justify-center"
            >
              <span className="text-[22px] leading-none">×</span>
            </button>
          </div>

          <div className="px-3 mt-3 sm:hidden">
            <div className="h-10 rounded-[10px] bg-white flex items-center px-4">
              <img src="/Vector (12).svg" alt="" />
              <input
                className="w-full bg-transparent pl-2 outline-none text-[14px] text-[#587181] placeholder:text-[#A0AEC0]"
                placeholder="جستجو"
              />
            </div>
          </div>

          <div className="mt-4">
            <NavLinks />
          </div>
        </aside>
      </div>
      {(openNotificationModal || openMessageModal) && (
        <div
          className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4 sm:px-6"
          onClick={() => {
            setOpenNotificationModal(false);
            setOpenMessageModal(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {openNotificationModal && (
              <div className="
          w-full
          max-w-[520px] md:max-w-[600px]
          rounded-[18px]
          bg-white
          p-6 sm:p-8
          shadow-2xl
        ">
                <h3 className="text-[20px] sm:text-[22px] font-bold mb-4">
                  اعلان‌ها
                </h3>

                <div className="space-y-3 text-[14px] sm:text-[15px] text-gray-700 max-h-[50vh] overflow-y-auto">
                  <div className="p-3 rounded-[10px] bg-[#F9FCFF]">
                    اعلان جدیدی وجود ندارد.
                  </div>
                </div>

                <button
                  onClick={() => setOpenNotificationModal(false)}
                  className="
              mt-6 w-full rounded-[12px]
              bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8]
              py-3 text-white font-semibold
              hover:brightness-110 transition
            "
                >
                  بستن
                </button>
              </div>
            )}

            {openMessageModal && (
              <div className="
          w-full
          max-w-[520px] md:max-w-[600px]
          rounded-[18px]
          bg-white
          p-6 sm:p-8
          shadow-2xl
        ">
                <h3 className="text-[20px] sm:text-[22px] font-bold mb-4">
                  پیام‌ها
                </h3>

                <div className="space-y-3 text-[14px] sm:text-[15px] text-gray-700 max-h-[50vh] overflow-y-auto">
                  <div className="p-3 rounded-[10px] bg-[#F9FCFF]">
                    پیامی برای نمایش وجود ندارد.
                  </div>
                </div>

                <button
                  onClick={() => setOpenMessageModal(false)}
                  className="
              mt-6 w-full rounded-[12px]
              bg-gradient-to-r from-[#6FA0D6] to-[#3E66A8]
              py-3 text-white font-semibold
              hover:brightness-110 transition
            "
                >
                  بستن
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
