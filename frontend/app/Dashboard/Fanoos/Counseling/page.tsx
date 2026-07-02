"use client";

// ── Types ─────────────────────────────────────────────────────────────────────
type SessionStatus = "upcoming" | "full" | "cancelled";

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
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const SESSIONS: CounselingSession[] = [
  {
    id: 1,
    date: "۱۴۰۳/۰۵/۰۵",
    dayName: "شنبه",
    time: "۱۶:۰۰ – ۱۷:۳۰",
    topic: "مدیریت استرس و اضطراب امتحانات",
    counselor: "دکتر رضایی",
    capacity: 20,
    registered: 14,
    status: "upcoming",
  },
  {
    id: 2,
    date: "۱۴۰۳/۰۵/۰۸",
    dayName: "سه‌شنبه",
    time: "۱۵:۰۰ – ۱۶:۳۰",
    topic: "برنامه‌ریزی تحصیلی و مدیریت وقت",
    counselor: "خانم موسوی",
    capacity: 15,
    registered: 15,
    status: "full",
  },
  {
    id: 3,
    date: "۱۴۰۳/۰۵/۱۲",
    dayName: "شنبه",
    time: "۱۶:۰۰ – ۱۷:۳۰",
    topic: "اهداف تحصیلی و انگیزه‌بخشی",
    counselor: "دکتر رضایی",
    capacity: 20,
    registered: 8,
    status: "upcoming",
  },
  {
    id: 4,
    date: "۱۴۰۳/۰۵/۱۵",
    dayName: "سه‌شنبه",
    time: "۱۵:۰۰ – ۱۶:۳۰",
    topic: "روش‌های مطالعه و یادگیری فعال",
    counselor: "خانم موسوی",
    capacity: 15,
    registered: 11,
    status: "upcoming",
  },
  {
    id: 5,
    date: "۱۴۰۳/۰۵/۱۹",
    dayName: "شنبه",
    time: "۱۶:۰۰ – ۱۷:۳۰",
    topic: "خودشناسی و رشد فردی",
    counselor: "دکتر رضایی",
    capacity: 20,
    registered: 3,
    status: "upcoming",
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
  },
  {
    id: 7,
    date: "۱۴۰۳/۰۵/۲۶",
    dayName: "شنبه",
    time: "۱۶:۰۰ – ۱۷:۳۰",
    topic: "مهارت‌های ارتباطی در محیط تحصیل",
    counselor: "دکتر رضایی",
    capacity: 20,
    registered: 5,
    status: "upcoming",
  },
];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<SessionStatus, { label: string; bg: string; text: string; dot: string }> = {
  upcoming:  { label: "ثبت‌نام باز",  bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-400" },
  full:      { label: "تکمیل ظرفیت", bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400"   },
  cancelled: { label: "لغو شده",     bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-400"     },
};

// ── Capacity bar ──────────────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
export default function CounselingPage() {
  const upcomingCount = SESSIONS.filter((s) => s.status === "upcoming").length;

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-[#1A2B45]">جلسات عمومی مشاوره</h2>
          <p className="text-[13px] text-[#9DB3C9] mt-0.5">برنامه جلسات آینده و امکان ثبت‌نام</p>
        </div>
        <span className="bg-[#EEF5FF] text-[#3E66A8] text-[13px] font-bold px-3 py-1.5 rounded-[10px]">
          {new Intl.NumberFormat("fa-IR").format(upcomingCount)} جلسه پیش رو
        </span>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white">
              <th className="px-5 py-3.5 text-[13px] font-semibold">تاریخ</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">ساعت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">موضوع جلسه</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">مشاور</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">ظرفیت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">وضعیت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((s, idx) => {
              const cfg = STATUS_CONFIG[s.status];
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
                    <span className="text-[13px] font-semibold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-1 rounded-[8px]">
                      {s.time}
                    </span>
                  </td>

                  {/* Topic */}
                  <td className="px-5 py-4 max-w-[240px]">
                    <span className="text-[14px] text-[#1A2B45] leading-relaxed">{s.topic}</span>
                  </td>

                  {/* Counselor */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {s.counselor.slice(-2)}
                      </div>
                      <span className="text-[13px] text-[#4A5568]">{s.counselor}</span>
                    </div>
                  </td>

                  {/* Capacity */}
                  <td className="px-5 py-4">
                    <CapacityBar registered={s.registered} capacity={s.capacity} />
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    {s.status === "upcoming" && (
                      <button className="text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-3.5 py-1.5 rounded-[10px] hover:brightness-110 transition whitespace-nowrap">
                        ثبت‌نام
                      </button>
                    )}
                    {s.status === "full" && (
                      <button className="text-[13px] font-semibold text-[#9DB3C9] bg-[#F4F7FB] px-3.5 py-1.5 rounded-[10px] cursor-not-allowed whitespace-nowrap" disabled>
                        تکمیل شد
                      </button>
                    )}
                    {s.status === "cancelled" && (
                      <span className="text-[12px] text-[#C4D3E0]">—</span>
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
        {SESSIONS.map((s) => {
          const cfg = STATUS_CONFIG[s.status];
          return (
            <div key={s.id} className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
              {/* Top stripe */}
              <div className="h-1 bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8]" />
              <div className="p-4 space-y-3">
                {/* Date + status */}
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

                {/* Time pill */}
                <span className="inline-block text-[13px] font-semibold text-[#3E66A8] bg-[#EEF5FF] px-3 py-1 rounded-[8px]">
                  {s.time}
                </span>

                {/* Topic */}
                <p className="text-[14px] text-[#1A2B45] leading-relaxed">{s.topic}</p>

                {/* Counselor + capacity */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center text-white text-[10px] font-bold">
                      {s.counselor.slice(-2)}
                    </div>
                    <span className="text-[12px] text-[#7A9BB5]">{s.counselor}</span>
                  </div>
                  <CapacityBar registered={s.registered} capacity={s.capacity} />
                </div>

                {/* CTA */}
                {s.status === "upcoming" && (
                  <button className="w-full text-[14px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] py-2.5 rounded-[12px] hover:brightness-110 transition">
                    ثبت‌نام در جلسه
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
