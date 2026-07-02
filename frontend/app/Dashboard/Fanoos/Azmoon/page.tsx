"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ExamStatus = "graded" | "pending" | "upcoming";

type StudentResult = {
  id: number;
  studentName: string;
  score: number | null; // Null means ungraded
};

type Exam = {
  id: number;
  subject: string;
  title: string;
  date: string;
  dayName: string;
  time: string;
  totalScore: number;
  score: number | null;   // For student (personal score)
  status: ExamStatus;
  results?: StudentResult[]; // For teacher
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_EXAMS: Exam[] = [
  {
    id: 1,
    subject: "ریاضی",
    title: "آزمون فصل اول — حد و پیوستگی",
    date: "۱۴۰۳/۰۳/۱۰",
    dayName: "یکشنبه",
    time: "۱۰:۰۰",
    totalScore: 20,
    score: 17.5,
    status: "graded",
    results: [
      { id: 1, studentName: "علی رضایی", score: 17.5 },
      { id: 2, studentName: "سارا حسینی", score: 19.0 },
      { id: 3, studentName: "مهدی علوی", score: 15.25 },
    ],
  },
  {
    id: 2,
    subject: "فیزیک",
    title: "آزمون حرکت‌شناسی",
    date: "۱۴۰۳/۰۳/۱۷",
    dayName: "یکشنبه",
    time: "۱۰:۰۰",
    totalScore: 20,
    score: 15,
    status: "graded",
    results: [
      { id: 1, studentName: "علی رضایی", score: 15.0 },
      { id: 2, studentName: "سارا حسینی", score: 18.5 },
      { id: 3, studentName: "مهدی علوی", score: 14.0 },
    ],
  },
  {
    id: 7,
    subject: "عربی",
    title: "آزمون قواعد فعل",
    date: "۱۴۰۳/۰۵/۰۴",
    dayName: "یکشنبه",
    time: "۱۰:۰۰",
    totalScore: 20,
    score: null,
    status: "pending",
    results: [
      { id: 1, studentName: "علی رضایی", score: null },
      { id: 2, studentName: "سارا حسینی", score: null },
      { id: 3, studentName: "مهدی علوی", score: null },
    ],
  },
  {
    id: 8,
    subject: "فیزیک",
    title: "آزمون دینامیک",
    date: "۱۴۰۳/۰۵/۱۱",
    dayName: "یکشنبه",
    time: "۱۰:۰۰",
    totalScore: 20,
    score: null,
    status: "upcoming",
    results: [],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const faNum = (n: number | string) => new Intl.NumberFormat("fa-IR").format(Number(n) || 0);

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

export default function AzmoonPage() {
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [filter, setFilter] = useState<Filter>("all");

  // Create exam state
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("شنبه");
  const [time, setTime] = useState("09:00");
  const [totalScore, setTotalScore] = useState(20);

  // Grade exam state
  const [gradingExam, setGradingExam] = useState<Exam | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole === "teacher" ? "teacher" : "student");
  }, []);

  const gradedExams = exams.filter((e) => e.status === "graded");
  const avg = gradedExams.length
    ? gradedExams.reduce((s, e) => s + (e.score ?? 0) / e.totalScore, 0) / gradedExams.length * 20
    : 0;
  const best = gradedExams.length
    ? Math.max(...gradedExams.map((e) => ((e.score ?? 0) / e.totalScore) * 20))
    : 0;

  const filtered = exams.filter((e) => {
    if (filter === "graded")   return e.status === "graded";
    if (filter === "upcoming") return e.status !== "graded";
    return true;
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !date.trim()) return;

    const newExam: Exam = {
      id: Date.now(),
      subject: subject.trim(),
      title: title.trim(),
      date: date.trim(),
      dayName,
      time,
      totalScore,
      score: null,
      status: "upcoming",
      results: [
        { id: 1, studentName: "علی رضایی", score: null },
        { id: 2, studentName: "سارا حسینی", score: null },
        { id: 3, studentName: "مهدی علوی", score: null },
      ],
    };

    setExams((prev) => [newExam, ...prev]);
    setShowAddModal(false);

    // Reset
    setSubject("");
    setTitle("");
    setDate("");
    setDayName("شنبه");
    setTime("09:00");
    setTotalScore(20);
  };

  const handleSaveGrades = (examId: number, results: StudentResult[]) => {
    setExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== examId) return ex;

        const allGraded = results.every((r) => r.score !== null);
        const hasSomeGrades = results.some((r) => r.score !== null);
        let newStatus: ExamStatus = "upcoming";
        if (allGraded) newStatus = "graded";
        else if (hasSomeGrades) newStatus = "pending";

        // Find ali's score as representative for "personal score" mock
        const aliScore = results.find((r) => r.studentName === "علی رضایی")?.score ?? null;

        return {
          ...ex,
          status: newStatus,
          results,
          score: aliScore,
        };
      })
    );
    setGradingExam(null);
  };

  if (!role) return null;

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#1A2B45]">آزمون‌ها {role === "teacher" && "(پنل معلم)"}</h2>
        {role === "teacher" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-4 py-2 rounded-[10px] hover:brightness-110 transition shadow-sm cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            طراحی آزمون جدید
          </button>
        )}
      </div>

      {/* Summary cards (For students only or global) */}
      {role === "student" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "کل آزمون‌ها",    value: faNum(exams.length),            sub: "آزمون",    color: "from-[#6FA0D6] to-[#3E66A8]", textColor: "text-white" },
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
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 bg-[#F4F7FB] p-1 rounded-[12px] w-fit">
        {([["all","همه"], ["graded","نمره‌دهی شده"], ["upcoming","پیش رو"]] as [Filter,string][]).map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`text-[13px] font-semibold px-4 py-1.5 rounded-[10px] transition cursor-pointer ${
              filter === val ? "bg-white text-[#3E66A8] shadow-sm" : "text-[#9DB3C9] hover:text-[#4A5568]"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Table views */}
      <div className="hidden md:block bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white">
              <th className="px-5 py-3.5 text-[13px] font-semibold">#</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">درس</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">عنوان آزمون</th>
              <th className="px-5 py-3.5 text-[13px] font-semibold">تاریخ و ساعت برگزاری</th>
              {role === "student" ? (
                <th className="px-5 py-3.5 text-[13px] font-semibold">نمره کسب شده</th>
              ) : (
                <th className="px-5 py-3.5 text-[13px] font-semibold">ثبت نمرات</th>
              )}
              <th className="px-5 py-3.5 text-[13px] font-semibold">وضعیت آزمون</th>
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
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-bold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-1 rounded-[8px] whitespace-nowrap">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-[220px]">
                    <span className="text-[14px] font-bold text-[#1A2B45]">{exam.title}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[14px] font-bold text-[#1A2B45]">{exam.date}</div>
                    <div className="text-[11px] text-[#9DB3C9]">{exam.dayName} ساعت {exam.time}</div>
                  </td>
                  <td className="px-5 py-4">
                    {role === "student" ? (
                      exam.status === "graded" && exam.score !== null ? (
                        <div className={`inline-flex flex-col items-end gap-1 px-3 py-1.5 rounded-[10px] ${scoreBg(exam.score, exam.totalScore)}`}>
                          <ScoreBar score={exam.score} total={exam.totalScore} />
                        </div>
                      ) : (
                        <span className="text-[13px] text-[#C4D3E0]">—</span>
                      )
                    ) : (
                      <button
                        onClick={() => setGradingExam(exam)}
                        className="text-[12px] font-semibold bg-[#EEF5FF] text-[#3E66A8] hover:bg-[#DDE9F8] px-3.5 py-1.5 rounded-[10px] border border-[#6FA0D6]/20 transition cursor-pointer"
                      >
                        وارد کردن نمرات
                      </button>
                    )}
                  </td>
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

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {filtered.map((exam) => {
          const cfg = STATUS_CONFIG[exam.status];
          return (
            <div key={exam.id} className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-[#3E66A8] bg-[#EEF5FF] px-2 py-0.5 rounded-[6px]">{exam.subject}</span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              <p className="text-[14px] font-bold text-[#1A2B45]">{exam.title}</p>
              <div className="text-[12px] text-[#9DB3C9]">{exam.date} · {exam.dayName} · ساعت {exam.time}</div>

              {role === "student" ? (
                exam.status === "graded" && exam.score !== null && (
                  <div className={`flex items-center justify-between p-2 rounded-[10px] ${scoreBg(exam.score, exam.totalScore)}`}>
                    <span className="text-[12px] text-[#4A5568]">نمره شما:</span>
                    <ScoreBar score={exam.score} total={exam.totalScore} />
                  </div>
                )
              ) : (
                <button
                  onClick={() => setGradingExam(exam)}
                  className="w-full text-center text-[13px] font-semibold bg-[#EEF5FF] text-[#3E66A8] py-2 rounded-[10px] hover:bg-[#DDE9F8] transition cursor-pointer"
                >
                  وارد کردن نمرات
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleCreateExam}
            className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl"
          >
            <h3 className="text-[18px] font-bold text-[#1A2B45]">طراحی آزمون جدید</h3>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">نام درس</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثلاً فیزیک"
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">عنوان آزمون</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً فصل ۳ — دینامیک"
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
                  placeholder="مثلاً ۱۴۰۳/۰۵/۲۲"
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
                  placeholder="۱۰:۰۰"
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-[#9DB3C9]">بارم کل آزمون</label>
                <input
                  type="number"
                  required
                  value={totalScore}
                  onChange={(e) => setTotalScore(Number(e.target.value))}
                  className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-10 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
              >
                ایجاد آزمون
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

      {/* Grade Exam Drawer / Modal */}
      {gradingExam && (
        <GradeExamModal
          exam={gradingExam}
          onClose={() => setGradingExam(null)}
          onSave={(results) => handleSaveGrades(gradingExam.id, results)}
        />
      )}
    </div>
  );
}

// ── Grading Modal component ──────────────────────────────────────────────────
function GradeExamModal({
  exam,
  onClose,
  onSave,
}: {
  exam: Exam;
  onClose: () => void;
  onSave: (results: StudentResult[]) => void;
}) {
  const [results, setResults] = useState<StudentResult[]>(
    exam.results && exam.results.length > 0
      ? exam.results
      : [
          { id: 1, studentName: "علی رضایی", score: null },
          { id: 2, studentName: "سارا حسینی", score: null },
          { id: 3, studentName: "مهدی علوی", score: null },
        ]
  );

  const handleScoreChange = (id: number, val: string) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const score = val.trim() === "" ? null : Math.min(exam.totalScore, Math.max(0, Number(val)));
        return { ...r, score };
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl">
        <div>
          <h3 className="text-[17px] font-bold text-[#1A2B45]">نمره‌دهی آزمون: {exam.title}</h3>
          <p className="text-[12px] text-[#7A9BB5] mt-1">بارم کل این آزمون {faNum(exam.totalScore)} نمره است.</p>
        </div>

        <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2.5">
          {results.map((r) => (
            <div key={r.id} className="flex items-center justify-between border border-[#EEF0F4] rounded-[10px] p-2.5 bg-[#FAFCFF]">
              <span className="text-[13px] font-bold text-[#1A2B45]">{r.studentName}</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max={exam.totalScore}
                  step="0.25"
                  placeholder="---"
                  value={r.score !== null ? r.score : ""}
                  onChange={(e) => handleScoreChange(r.id, e.target.value)}
                  className="w-16 h-9 rounded-[8px] border border-[#DADADA] text-center text-[13.5px] font-bold outline-none focus:border-[#6FA0D6] bg-white transition"
                />
                <span className="text-[12px] text-[#9DB3C9]">از {faNum(exam.totalScore)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSave(results)}
            className="flex-1 h-10 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
          >
            ثبت نمرات
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[10px] border border-[#EEF0F4] hover:bg-[#F4F7FB] text-[#7A9BB5] text-[14px] font-semibold transition cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
