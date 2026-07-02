"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ExamStatus = "graded" | "pending" | "upcoming";

type Exam = {
  id: number;
  subject: string;
  title: string;
  date: string;
  dayName: string;
  time: string;
  totalScore: number;
  score: number | null;   // null = not graded yet or upcoming
  status: ExamStatus;
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const EXAMS: Exam[] = [
  { id:1,  subject:"ریاضی",         title:"آزمون فصل اول — حد و پیوستگی",       date:"۱۴۰۳/۰۳/۱۰", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:17.5, status:"graded"   },
  { id:2,  subject:"فیزیک",         title:"آزمون حرکت‌شناسی",                    date:"۱۴۰۳/۰۳/۱۷", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:15,   status:"graded"   },
  { id:3,  subject:"شیمی",          title:"آزمون اتم و جدول تناوبی",             date:"۱۴۰۳/۰۳/۲۴", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:18,   status:"graded"   },
  { id:4,  subject:"ادبیات",        title:"آزمون آرایه‌های ادبی",                date:"۱۴۰۳/۰۴/۰۷", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:12,   status:"graded"   },
  { id:5,  subject:"زبان انگلیسی", title:"Grammar & Vocabulary Test",           date:"۱۴۰۳/۰۴/۱۴", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:19,   status:"graded"   },
  { id:6,  subject:"ریاضی",         title:"آزمون فصل دوم — مشتق",               date:"۱۴۰۳/۰۴/۲۸", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:14,   status:"graded"   },
  { id:7,  subject:"عربی",          title:"آزمون قواعد فعل",                     date:"۱۴۰۳/۰۵/۰۴", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:null, status:"pending"  },
  { id:8,  subject:"فیزیک",         title:"آزمون دینامیک",                       date:"۱۴۰۳/۰۵/۱۱", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:null, status:"upcoming" },
  { id:9,  subject:"شیمی",          title:"آزمون پیوند شیمیایی",                 date:"۱۴۰۳/۰۵/۱۸", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:null, status:"upcoming" },
  { id:10, subject:"ریاضی",         title:"آزمون فصل سوم — انتگرال",             date:"۱۴۰۳/۰۵/۲۵", dayName:"یکشنبه",   time:"۱۰:۰۰", totalScore:20, score:null, status:"upcoming" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

function scoreColor(score: number, total: number): string {
  const pct = score / total;
  if (pct >= 0.85) return "text-emerald-600";
  if (pct >= 0.60) return "text-[#3E66A8]";
  if (pct >= 0.40) return "text-amber-600";
  return "text-red-500";
}

function scoreBg(score: number, total: number): string {
  const pct = score / total;
  if (pct >= 0.85) return "bg-emerald-50";
  if (pct >= 0.60) return "bg-[#EEF5FF]";
  if (pct >= 0.40) return "bg-amber-50";
  return "bg-red-50";
}

function ScoreBar({ score, total }: { score: number; total: number }) {
  const pct = (score / total) * 100;
  const color = pct >= 85 ? "bg-emerald-400" : pct >= 60 ? "bg-[#6FA0D6]" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#EEF0F4] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[14px] font-bold ${scoreColor(score, total)}`}>
        {faNum(score)}/{faNum(total)}
      </span>
    </div>
  );
}

const STATUS_CONFIG = {
  graded:   { label: "نمره‌دهی شد",  bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  pending:  { label: "در انتظار نمره", bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400"   },
  upcoming: { label: "پیش رو",        bg: "bg-[#EEF5FF]",  text: "text-[#3E66A8]",  dot: "bg-[#6FA0D6]"   },
};

type Filter = "all" | "graded" | "upcoming";

// ── Main component ─────────────────────────────────────────────────────────────
export default function AzmoonPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const gradedExams = EXAMS.filter((e) => e.status === "graded");
  const avg = gradedExams.length
    ? gradedExams.reduce((s, e) => s + (e.score ?? 0) / e.totalScore, 0) / gradedExams.length * 20
    : 0;
  const best = gradedExams.length
    ? Math.max(...gradedExams.map((e) => ((e.score ?? 0) / e.totalScore) * 20))
    : 0;

  const filtered = EXAMS.filter((e) => {
    if (filter === "graded")   return e.status === "graded";
    if (filter === "upcoming") return e.status !== "graded";
    return true;
  });

  return (
    <div dir="rtl" className="space-y-5">

      {/* Header */}
      <h2 className="text-[20px] font-bold text-[#1A2B45]">آزمون‌ها</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "کل آزمون‌ها",    value: faNum(EXAMS.length),            sub: "آزمون",    color: "from-[#6FA0D6] to-[#3E66A8]", textColor: "text-white" },
          { label: "نمره‌دهی شده",   value: faNum(gradedExams.length),      sub: "آزمون",    color: "from-white to-white border border-[#EEF0F4]", textColor: "text-[#1A2B45]" },
          { label: "میانگین نمره",   value: avg.toFixed(1).replace(".", "٫"), sub: "از ۲۰",  color: "from-white to-white border border-[#EEF0F4]", textColor: avg >= 14 ? "text-emerald-600" : avg >= 10 ? "text-[#3E66A8]" : "text-amber-600" },
          { label: "بهترین نمره",    value: best.toFixed(1).replace(".", "٫"), sub: "از ۲۰", color: "from-white to-white border border-[#EEF0F4]", textColor: "text-emerald-600" },
        ].map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-[14px] px-4 py-4 shadow-sm`}>
            <p className={`text-[11px] font-semibold opacity-70 ${c.textColor}`}>{c.label}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-[26px] font-bold ${c.textColor}`}>{c.value}</span>
              <span className={`text-[12px] opacity-60 ${c.textColor}`}>{c.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-[#F4F7FB] p-1 rounded-[12px] w-fit">
        {([["all","همه"], ["graded","نمره‌دهی شده"], ["upcoming","پیش رو"]] as [Filter,string][]).map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`text-[13px] font-semibold px-4 py-1.5 rounded-[10px] transition ${
              filter === val ? "bg-white text-[#3E66A8] shadow-sm" : "text-[#9DB3C9] hover:text-[#4A5568]"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white">
              <th className="px-5 py-3.5 text-[13px] font-semibold">#</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">درس</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">عنوان آزمون</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">تاریخ</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">ساعت</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">نمره</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((exam, idx) => {
              const cfg = STATUS_CONFIG[exam.status];
              return (
                <tr
                  key={exam.id}
                  className={`border-t border-[#EEF0F4] transition-colors ${idx % 2 === 1 ? "bg-[#FAFCFF]" : "bg-white"} hover:bg-[#F4F8FF]`}
                >
                  <td className="px-5 py-4 text-[13px] text-[#C4D3E0] font-bold">{faNum(idx + 1)}</td>

                  {/* Subject */}
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-bold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-1 rounded-[8px]">
                      {exam.subject}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-5 py-4 max-w-[220px]">
                    <span className="text-[14px] text-[#1A2B45]">{exam.title}</span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <div className="text-[14px] font-bold text-[#1A2B45]">{exam.date}</div>
                    <div className="text-[11px] text-[#9DB3C9]">{exam.dayName}</div>
                  </td>

                  {/* Time */}
                  <td className="px-5 py-4 text-[13px] text-[#7A9BB5]">{exam.time}</td>

                  {/* Score */}
                  <td className="px-5 py-4">
                    {exam.status === "graded" && exam.score !== null ? (
                      <div className={`inline-flex flex-col items-end gap-1 px-3 py-1.5 rounded-[10px] ${scoreBg(exam.score, exam.totalScore)}`}>
                        <ScoreBar score={exam.score} total={exam.totalScore} />
                      </div>
                    ) : (
                      <span className="text-[13px] text-[#C4D3E0]">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {filtered.map((exam) => {
          const cfg = STATUS_CONFIG[exam.status];
          return (
            <div key={exam.id} className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
              <div className="h-1 bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8]" />
              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-bold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-0.5 rounded-[8px]">{exam.subject}</span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[14px] font-semibold text-[#1A2B45]">{exam.title}</p>
                <div className="flex items-center gap-4 text-[12px] text-[#9DB3C9]">
                  <span>{exam.date} — {exam.dayName}</span>
                  <span>{exam.time}</span>
                </div>
                {exam.status === "graded" && exam.score !== null && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] ${scoreBg(exam.score, exam.totalScore)}`}>
                    <span className="text-[12px] text-[#9DB3C9]">نمره:</span>
                    <ScoreBar score={exam.score} total={exam.totalScore} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
