"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type SessionStatus = "upcoming" | "full" | "cancelled";

type StudentReg = {
  id: number;
  name: string;
  nationalCode: string;
};

type CounselingSession = {
  id: number;
  date: string;          // Persian date display
  dayName: string;       // روز هفته
  time: string;          // e.g. "16:00 – 17:30"
  topic: string;
  counselor: string;
  capacity: number;
  registered: number;
  status: SessionStatus;
  registrations?: StudentReg[];
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_SESSIONS: CounselingSession[] = [
  {
    id: 1,
    date: "۱۴۰۳/۰۵/۰۵",
    dayName: "شنبه",
    time: "۱۶:۰۰ – ۱۷:۳۰",
    topic: "مدیریت استرس و اضطراب امتحانات",
    counselor: "دکتر رضایی",
    capacity: 20,
    registered: 4,
    status: "upcoming",
    registrations: [
      { id: 1, name: "علی رضایی", nationalCode: "123456789" },
      { id: 2, name: "سارا حسینی", nationalCode: "987654321" },
      { id: 3, name: "مهدی علوی", nationalCode: "111222333" },
      { id: 4, name: "امیر قاسمی", nationalCode: "444555666" },
    ],
  },
  {
    id: 2,
    date: "۱۴۰۳/۰۵/۰۸",
    dayName: "سه‌شنبه",
    time: "۱۵:۰۰ – ۱۶:۳۰",
    topic: "برنامه‌ریزی تحصیلی و مدیریت وقت",
    counselor: "خانم موسوی",
    capacity: 3,
    registered: 3,
    status: "full",
    registrations: [
      { id: 1, name: "علی رضایی", nationalCode: "123456789" },
      { id: 2, name: "سارا حسینی", nationalCode: "987654321" },
      { id: 3, name: "مهدی علوی", nationalCode: "111222333" },
    ],
  },
  {
    id: 3,
    date: "۱۴۰۳/۰۵/۱۲",
    dayName: "شنبه",
    time: "۱۶:۰۰ – ۱۷:۳۰",
    topic: "اهداف تحصیلی و انگیزه‌بخشی",
    counselor: "دکتر رضایی",
    capacity: 20,
    registered: 1,
    status: "upcoming",
    registrations: [
      { id: 2, name: "سارا حسینی", nationalCode: "987654321" },
    ],
  },
  {
    id: 6,
    date: "۱۴۰۳/۰۵/۲۲",
    dayName: "سه‌شنبه",
    time: "۱۵:۰۰ – ۱۶:۳۰",
    topic: "آمادگی برای کنکور",
    counselor: "خانم موسوی",
    capacity: 15,
    registered: 0,
    status: "cancelled",
    registrations: [],
  },
];

const STATUS_CONFIG: Record<SessionStatus, { label: string; bg: string; text: string; dot: string }> = {
  upcoming:  { label: "ثبت‌نام باز",  bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-400" },
  full:      { label: "تکمیل ظرفیت", bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400"   },
  cancelled: { label: "لغو شده",     bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-400"     },
};

function CapacityBar({ registered, capacity }: { registered: number; capacity: number }) {
  const pct = Math.round((registered / capacity) * 100);
  const color = pct >= 100 ? "bg-amber-400" : pct >= 70 ? "bg-blue-400" : "bg-emerald-400";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-[#EEF0F4] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-[12px] text-[#9DB3C9] shrink-0">
        {new Intl.NumberFormat("fa-IR").format(registered)}/{new Intl.NumberFormat("fa-IR").format(capacity)}
      </span>
    </div>
  );
}

export default function CounselingPage() {
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [sessions, setSessions] = useState<CounselingSession[]>(INITIAL_SESSIONS);

  // Modal create session
  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("شنبه");
  const [time, setTime] = useState("16:00 – 17:30");
  const [topic, setTopic] = useState("");
  const [capacity, setCapacity] = useState(20);

  // View registrations state
  const [viewingSession, setViewingSession] = useState<CounselingSession | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole === "teacher" ? "teacher" : "student");
  }, []);

  const upcomingCount = sessions.filter((s) => s.status === "upcoming").length;
  const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date.trim() || !topic.trim()) return;

    const newSession: CounselingSession = {
      id: Date.now(),
      date: date.trim(),
      dayName,
      time,
      topic: topic.trim(),
      counselor: role === "teacher" ? "استاد احمدی" : "مشاور امین",
      capacity,
      registered: 0,
      status: "upcoming",
      registrations: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setShowAddModal(false);

    // Reset
    setDate("");
    setDayName("شنبه");
    setTime("16:00 – 17:30");
    setTopic("");
    setCapacity(20);
  };

  const handleCancelSession = (id: number) => {
    if (confirm("آیا از لغو این جلسه مشاوره مطمئن هستید؟")) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s))
      );
    }
  };

  const handleToggleRegister = (id: number) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const isRegistered = (s.registrations || []).some((r) => r.nationalCode === "123456789");

        let updatedRegs = [...(s.registrations || [])];
        if (isRegistered) {
          updatedRegs = updatedRegs.filter((r) => r.nationalCode !== "123456789");
        } else {
          if (s.registered >= s.capacity) return s; // Full
          updatedRegs.push({ id: Date.now(), name: "علی رضایی", nationalCode: "123456789" });
        }

        const count = updatedRegs.length;
        const newStatus: SessionStatus = count >= s.capacity ? "full" : "upcoming";

        return {
          ...s,
          registered: count,
          status: newStatus,
          registrations: updatedRegs,
        };
      })
    );
  };

  if (!role) return null;

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-[#1A2B45]">جلسات عمومی مشاوره {role === "teacher" && "(پنل معلم)"}</h2>
          <p className="text-[13px] text-[#9DB3C9] mt-0.5">برنامه جلسات آینده و مدیریت ثبت‌نام دانش‌آموزان</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-[#EEF5FF] text-[#3E66A8] text-[13px] font-bold px-3 py-1.5 rounded-[10px] whitespace-nowrap">
            {faNum(upcomingCount)} جلسه پیش رو
          </span>
          {role === "teacher" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-4 py-2 rounded-[10px] hover:brightness-110 transition shadow-sm cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              تعریف جلسه جدید
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white">
              <th className="px-5 py-3.5 text-[13px] font-semibold">تاریخ و روز هفته</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">ساعت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">موضوع جلسه</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">مشاور</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">ظرفیت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">وضعیت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, idx) => {
              const cfg = STATUS_CONFIG[s.status];
              const isRegistered = (s.registrations || []).some((r) => r.nationalCode === "123456789");

              return (
                <tr
                  key={s.id}
                  className={`border-t border-[#EEF0F4] transition-colors ${idx % 2 === 1 ? "bg-[#FAFCFF]" : "bg-white"} hover:bg-[#F4F8FF]`}
                >
                  {/* Date */}
                  <td className="px-5 py-4">
                    <div className="text-[14px] font-bold text-[#1A2B45]">{s.date}</div>
                    <div className="text-[12px] text-[#9DB3C9] mt-0.5">{s.dayName}</div>
                  </td>

                  {/* Time */}
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-semibold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-1 rounded-[8px] whitespace-nowrap">
                      {s.time}
                    </span>
                  </td>

                  {/* Topic */}
                  <td className="px-5 py-4 max-w-[240px]">
                    <span className="text-[14px] font-bold text-[#1A2B45] leading-relaxed">{s.topic}</span>
                  </td>

                  {/* Counselor */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {s.counselor.slice(-2)}
                      </div>
                      <span className="text-[13px] text-[#4A5568] whitespace-nowrap">{s.counselor}</span>
                    </div>
                  </td>

                  {/* Capacity */}
                  <td className="px-5 py-4">
                    <CapacityBar registered={s.registered} capacity={s.capacity} />
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text} whitespace-nowrap`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    {role === "student" ? (
                      s.status === "upcoming" ? (
                        <button
                          onClick={() => handleToggleRegister(s.id)}
                          className={`text-[13px] font-semibold px-4 py-1.5 rounded-[10px] transition cursor-pointer whitespace-nowrap ${
                            isRegistered
                              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                              : "text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] hover:brightness-110"
                          }`}
                        >
                          {isRegistered ? "لغو ثبت‌نام" : "ثبت‌نام"}
                        </button>
                      ) : s.status === "full" ? (
                        isRegistered ? (
                          <button
                            onClick={() => handleToggleRegister(s.id)}
                            className="text-[13px] font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-1.5 rounded-[10px] transition cursor-pointer whitespace-nowrap"
                          >
                            لغو ثبت‌نام (پر)
                          </button>
                        ) : (
                          <button className="text-[13px] font-semibold text-[#9DB3C9] bg-[#F4F7FB] px-3.5 py-1.5 rounded-[10px] cursor-not-allowed whitespace-nowrap" disabled>
                            تکمیل ظرفیت
                          </button>
                        )
                      ) : (
                        <span className="text-[12px] text-[#C4D3E0]">—</span>
                      )
                    ) : (
                      /* Teacher actions */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingSession(s)}
                          className="text-[12px] font-semibold bg-[#EEF5FF] text-[#3E66A8] hover:bg-[#DDE9F8] px-3 py-1.5 rounded-[10px] border border-[#6FA0D6]/20 transition cursor-pointer whitespace-nowrap"
                        >
                          لیست حضور ({faNum(s.registered)})
                        </button>
                        {s.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelSession(s.id)}
                            className="p-1.5 rounded-[8px] hover:bg-red-50 text-red-500 transition cursor-pointer"
                            title="لغو جلسه"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {sessions.map((s) => {
          const cfg = STATUS_CONFIG[s.status];
          const isRegistered = (s.registrations || []).some((r) => r.nationalCode === "123456789");

          return (
            <div key={s.id} className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[15px] font-bold text-[#1A2B45]">{s.date}</span>
                  <span className="text-[12px] text-[#9DB3C9] mr-2">{s.dayName}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              <span className="inline-block text-[13px] font-semibold text-[#3E66A8] bg-[#EEF5FF] px-3 py-1 rounded-[8px]">
                {s.time}
              </span>

              <p className="text-[14px] font-bold text-[#1A2B45] leading-relaxed">{s.topic}</p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center text-white text-[10px] font-bold">
                    {s.counselor.slice(-2)}
                  </div>
                  <span className="text-[12px] text-[#7A9BB5]">{s.counselor}</span>
                </div>
                <CapacityBar registered={s.registered} capacity={s.capacity} />
              </div>

              {/* Mobile CTAs */}
              {role === "student" ? (
                s.status === "upcoming" ? (
                  <button
                    onClick={() => handleToggleRegister(s.id)}
                    className={`w-full py-2.5 rounded-[12px] text-[14px] font-semibold transition cursor-pointer ${
                      isRegistered
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] hover:brightness-110"
                    }`}
                  >
                    {isRegistered ? "لغو ثبت‌نام" : "ثبت‌نام در جلسه"}
                  </button>
                ) : s.status === "full" ? (
                  isRegistered ? (
                    <button
                      onClick={() => handleToggleRegister(s.id)}
                      className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-2.5 rounded-[12px] text-[14px] font-semibold transition cursor-pointer"
                    >
                      لغو ثبت‌نام (جلسه پر است)
                    </button>
                  ) : (
                    <button className="w-full text-[14px] font-semibold text-[#9DB3C9] bg-[#F4F7FB] py-2.5 rounded-[12px] cursor-not-allowed" disabled>
                      تکمیل ظرفیت
                    </button>
                  )
                ) : null
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingSession(s)}
                    className="flex-1 text-center text-[13px] font-semibold bg-[#EEF5FF] text-[#3E66A8] py-2 rounded-[10px] hover:bg-[#DDE9F8] transition cursor-pointer"
                  >
                    لیست حضور ({faNum(s.registered)})
                  </button>
                  {s.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelSession(s.id)}
                      className="border border-red-200 text-red-500 px-3 rounded-[10px] hover:bg-red-50 transition cursor-pointer"
                    >
                      لغو
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add counseling session modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleCreateSession}
            className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl"
          >
            <h3 className="text-[18px] font-bold text-[#1A2B45]">تعریف جلسه مشاوره جدید</h3>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">موضوع جلسه</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثلاً روش‌های صحیح مطالعه فعال"
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">تاریخ برگزاری</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="مثلاً ۱۴۰۳/۰۵/۲۸"
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">روز هفته</label>
                <select
                  value={dayName}
                  onChange={(e) => setDayName(e.target.value)}
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-2 text-[13px] outline-none bg-white focus:border-[#6FA0D6] transition cursor-pointer"
                >
                  {["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">ساعت برگزاری</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="۱۶:۰۰ – ۱۷:۳۰"
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">حداکثر ظرفیت ثبت‌نام</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-10 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
              >
                ایجاد جلسه
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

      {/* Registrations List Modal */}
      {viewingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setViewingSession(null)} />
          <div className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl">
            <div>
              <h3 className="text-[17px] font-bold text-[#1A2B45]">لیست ثبت‌نام کنندگان</h3>
              <p className="text-[13px] text-[#7A9BB5] mt-1">{viewingSession.topic}</p>
            </div>

            <div className="max-h-[250px] overflow-y-auto pr-1 space-y-2">
              {(viewingSession.registrations || []).length === 0 ? (
                <p className="text-[13px] text-center text-[#9DB3C9] py-8">هنوز هیچ دانش‌آموزی ثبت‌نام نکرده است.</p>
              ) : (
                (viewingSession.registrations || []).map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between border border-[#EEF0F4] rounded-[10px] p-3 bg-[#FAFCFF]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E8F0FA] text-[#3E66A8] flex items-center justify-center text-[11px] font-bold">
                        {i + 1}
                      </span>
                      <span className="text-[13px] font-bold text-[#1A2B45]">{r.name}</span>
                    </div>
                    <span className="text-[11.5px] text-[#9DB3C9]">کد ملی: {r.nationalCode}</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setViewingSession(null)}
              className="w-full h-10 rounded-[10px] border border-[#EEF0F4] hover:bg-[#F4F7FB] text-[#3E66A8] text-[14px] font-semibold transition cursor-pointer"
            >
              بستن پنجره
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
