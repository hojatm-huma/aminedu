"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type QuestionStatus = "answered" | "pending";

type Question = {
  id: number;
  studentName?: string;
  subject: string;
  topic: string;
  body: string;
  submittedAt: string;
  status: QuestionStatus;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const SUBJECTS = ["ریاضی", "فیزیک", "شیمی", "ادبیات", "زبان انگلیسی", "عربی", "دینی"];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    studentName: "علی رضایی",
    subject: "ریاضی",
    topic: "مشتق توابع مرکب",
    body: "در مثال صفحه ۶۷ کتاب، چطور مشتق تابع sin(x²) را محاسبه می‌کنیم؟ مرحله سوم را متوجه نمی‌شوم.",
    submittedAt: "۱۴۰۳/۰۴/۲۸",
    status: "answered",
    answer: "برای مشتق sin(x²) از قانون زنجیره استفاده می‌کنیم. ابتدا مشتق تابع بیرونی (sin) را می‌گیریم که cos(x²) می‌شود، سپس ضرب در مشتق تابع درونی (x²) که ۲x است. پس نتیجه: 2x·cos(x²)",
    answeredBy: "آقای احمدی",
    answeredAt: "۱۴۰۳/۰۴/۲۹",
  },
  {
    id: 2,
    studentName: "سارا حسینی",
    subject: "فیزیک",
    topic: "قانون دوم نیوتن در دستگاه آتوود",
    body: "در دستگاه آتوود وقتی دو جرم نابرابر داریم، چطور شتاب سیستم را بدست می‌آوریم؟",
    submittedAt: "۱۴۰۳/۰۵/۰۱",
    status: "answered",
    answer: "در دستگاه آتوود: a = (m₁-m₂)g / (m₁+m₂). برای هر جرم معادله نیوتن را جداگانه بنویس و بعد حل همزمان کن.",
    answeredBy: "خانم کریمی",
    answeredAt: "۱۴۰۳/۰۵/۰۲",
  },
  {
    id: 3,
    studentName: "مهدی علوی",
    subject: "شیمی",
    topic: "پیوند هیدروژنی",
    body: "فرق بین پیوند هیدروژنی درون‌مولکولی و بین‌مولکولی چیست؟ مثال می‌خوام.",
    submittedAt: "۱۴۰۳/۰۵/۰۳",
    status: "pending",
  },
];

const STATUS_CFG = {
  answered: { label: "پاسخ داده شد", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  pending:  { label: "در انتظار پاسخ", bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400"  },
};

export default function QAPage() {
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole === "teacher" ? "teacher" : "student");
  }, []);

  const handleNew = (q: Question) => {
    setQuestions((prev) => [q, ...prev]);
  };

  const handleAnswerSubmit = (qId: number, answerText: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          status: "answered",
          answer: answerText,
          answeredBy: "استاد احمدی",
          answeredAt: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
        };
      })
    );
  };

  const answered = questions.filter((q) => q.status === "answered").length;
  const pending  = questions.filter((q) => q.status === "pending").length;
  const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

  if (!role) return null;

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-[#1A2B45]">سوال و رفع اشکال {role === "teacher" && "(پنل معلم)"}</h2>
        <div className="flex gap-2">
          <span className="text-[12px] font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
            {faNum(answered)} پاسخ داده شده
          </span>
          <span className="text-[12px] font-semibold bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
            {faNum(pending)} در انتظار
          </span>
        </div>
      </div>

      {/* Form (Student only) */}
      {role === "student" && <NewQuestionForm onSubmit={handleNew} />}

      {/* Question list */}
      {questions.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-[14px] font-bold text-[#9DB3C9]">
            {role === "teacher" ? "صندوق سوالات دانش‌آموزان" : "سوال‌های قبلی شما"}
          </h3>
          {questions.map((q) => (
            <QuestionCard key={q.id} q={q} role={role} onAnswer={handleAnswerSubmit} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-14 flex items-center justify-center text-[#9DB3C9] text-[15px]">
          سوالی ثبت نشده است
        </div>
      )}
    </div>
  );
}

// ── Question card ─────────────────────────────────────────────────────────────
function QuestionCard({
  q,
  role,
  onAnswer,
}: {
  q: Question;
  role: "student" | "teacher";
  onAnswer: (qId: number, answerText: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const cfg = STATUS_CFG[q.status];

  const handleSend = () => {
    if (!answerText.trim()) return;
    onAnswer(q.id, answerText.trim());
    setAnswerText("");
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        className="w-full text-right px-5 py-4 flex items-start gap-4 hover:bg-[#FAFCFF] transition cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Subject pill */}
        <span className="shrink-0 mt-0.5 text-[12px] font-bold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-1 rounded-[8px]">
          {q.subject}
        </span>

        {/* Title + preview */}
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[15px] font-bold text-[#1A2B45] leading-snug">{q.topic}</p>
          <p className="text-[13px] text-[#9DB3C9] mt-0.5 truncate">{q.body}</p>
          <p className="text-[11px] text-[#C4D3E0] mt-1">
            {q.submittedAt} {q.studentName && `· ارسال شده توسط: ${q.studentName}`}
          </p>
        </div>

        {/* Status + chevron */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <svg
            className={`w-4 h-4 text-[#C4D3E0] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-[#EEF0F4] px-5 py-4 space-y-4">
          {/* Student's question */}
          <div className="bg-[#F4F7FB] rounded-[12px] p-4">
            <p className="text-[12px] font-bold text-[#9DB3C9] mb-1.5">
              {role === "teacher" ? `سوال ${q.studentName || "دانش‌آموز"}` : "سوال شما"}
            </p>
            <p className="text-[14px] text-[#1A2B45] leading-relaxed">{q.body}</p>
          </div>

          {/* Answer section */}
          {q.status === "answered" && q.answer ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-[12px] p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-bold text-emerald-700">پاسخ مدرس</p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  {q.answeredBy} · {q.answeredAt}
                </div>
              </div>
              <p className="text-[14px] text-[#1A2B45] leading-relaxed">{q.answer}</p>
            </div>
          ) : role === "student" ? (
            <div className="bg-amber-50 border border-amber-100 rounded-[12px] p-4 text-[13px] text-amber-600">
              سوال شما ثبت شده است. مدرس به زودی پاسخ خواهد داد.
            </div>
          ) : (
            /* TEACHER: Provide Answer Input */
            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-[#4A5568]">پاسخ به سوال دانش‌آموز</label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={3}
                placeholder="پاسخ خود را بنویسید..."
                className="w-full rounded-[10px] border border-[#DADADA] bg-white p-3 text-[13.5px] text-[#4A4543] outline-none focus:border-[#6FA0D6] resize-none leading-relaxed transition"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!answerText.trim()}
                className="bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white text-[13px] font-semibold px-4 py-2 rounded-[10px] hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
              >
                ثبت و ارسال پاسخ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── New question form (For Student Only) ──────────────────────────────────────
function NewQuestionForm({ onSubmit }: { onSubmit: (q: Question) => void }) {
  const [subject,  setSubject]  = useState("");
  const [topic,    setTopic]    = useState("");
  const [body,     setBody]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!subject) e.subject = "لطفاً درس را انتخاب کنید";
    if (!topic.trim()) e.topic = "عنوان سوال را بنویسید";
    if (body.trim().length < 10) e.body = "متن سوال حداقل ۱۰ کاراکتر باشد";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit({
        id: Date.now(),
        studentName: "علی رضایی",
        subject,
        topic: topic.trim(),
        body: body.trim(),
        submittedAt: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
        status: "pending",
      });
      setSubject(""); setTopic(""); setBody("");
      setLoading(false); setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 900);
  };

  const inputCls = (field: string) =>
    `w-full rounded-[10px] border ${errors[field] ? "border-red-300 bg-red-50" : "border-[#DADADA] bg-white"} px-4 py-3 text-[14px] text-[#4A4543] outline-none focus:border-[#6FA0D6] focus:ring-4 focus:ring-[#6FA0D6]/10 transition placeholder:text-[#C4D3E0]`;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-[#EEF0F4] p-5 space-y-4">
      <h3 className="text-[16px] font-bold text-[#1A2B45]">ثبت سوال جدید</h3>

      <div className="space-y-1.5">
        <label className="block text-[13px] font-semibold text-[#4A4543]">نام درس <span className="text-red-400">*</span></label>
        <select
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
          className={inputCls("subject")}
        >
          <option value="">انتخاب کنید...</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p className="text-[12px] text-red-500">{errors.subject}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-[13px] font-semibold text-[#4A4543]">عنوان سوال <span className="text-red-400">*</span></label>
        <input
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setErrors((p) => ({ ...p, topic: "" })); }}
          placeholder="مثال: مشتق توابع مرکب"
          className={inputCls("topic")}
        />
        {errors.topic && <p className="text-[12px] text-red-500">{errors.topic}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-[13px] font-semibold text-[#4A4543]">متن سوال <span className="text-red-400">*</span></label>
        <textarea
          value={body}
          onChange={(e) => { setBody(e.target.value); setErrors((p) => ({ ...p, body: "" })); }}
          rows={4}
          placeholder="سوال خود را با جزئیات کامل بنویسید..."
          className={`${inputCls("body")} resize-none leading-relaxed`}
        />
        <div className="flex justify-between">
          {errors.body
            ? <p className="text-[12px] text-red-500">{errors.body}</p>
            : <span />}
          <span className="text-[11px] text-[#C4D3E0]">{body.length} کاراکتر</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white font-semibold text-[14px] px-6 py-2.5 rounded-[12px] hover:brightness-110 transition disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
              </svg>
              در حال ارسال...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              ارسال سوال
            </>
          )}
        </button>

        {done && (
          <span className="flex items-center gap-1.5 text-[13px] text-emerald-600 font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            سوال شما ثبت شد
          </span>
        )}
      </div>
    </form>
  );
}
