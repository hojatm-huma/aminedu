"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  isOwn: boolean;
};

type Handout = {
  id: number;
  subject: string;
  title: string;
  description: string;
  teacher: string;
  uploadedAt: string;
  fileType: "pdf" | "doc" | "ppt" | "img" | "zip";
  fileSize: string;
  fileName: string;
  comments: Comment[];
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_HANDOUTS: Handout[] = [
  {
    id: 1,
    subject: "ریاضی",
    title: "خلاصه فصل ۲ — مشتق و کاربردهای آن",
    description: "جزوه کامل مشتق شامل قوانین، مثال‌های حل شده و تمرینات تکمیلی",
    teacher: "آقای احمدی",
    uploadedAt: "۱۴۰۳/۰۴/۲۰",
    fileType: "pdf",
    fileSize: "۲.۳ مگابایت",
    fileName: "math_ch2_derivative.pdf",
    comments: [
      { id: 1, author: "علی رضایی", text: "ممنون از استاد. صفحه ۱۲ کمی ناخوانا بود.", date: "۱۴۰۳/۰۴/۲۱", isOwn: false },
    ],
  },
  {
    id: 2,
    subject: "فیزیک",
    title: "جزوه دینامیک — نیرو و حرکت",
    description: "مباحث نیوتن، اصطکاک، و حرکت روی سطح شیبدار",
    teacher: "خانم کریمی",
    uploadedAt: "۱۴۰۳/۰۴/۲۵",
    fileType: "pdf",
    fileSize: "۳.۱ مگابایت",
    fileName: "physics_dynamics.pdf",
    comments: [],
  },
  {
    id: 3,
    subject: "شیمی",
    title: "اسلایدهای پیوند شیمیایی",
    description: "پاورپوینت درس پیوند یونی، کووالانسی و فلزی با تصاویر",
    teacher: "آقای رضایی",
    uploadedAt: "۱۴۰۳/۰۵/۰۱",
    fileType: "ppt",
    fileSize: "۵.۷ مگابایت",
    fileName: "chem_bonding.pptx",
    comments: [
      { id: 2, author: "من", text: "فایل باز نمی‌شه، لطفاً بررسی کنید.", date: "۱۴۰۳/۰۵/۰۲", isOwn: true },
      { id: 3, author: "آقای رضایی", text: "فایل جدید آپلود شد، مشکل برطرف است.", date: "۱۴۰۳/۰۵/۰۲", isOwn: false },
    ],
  },
  {
    id: 4,
    subject: "ادبیات",
    title: "خلاصه آرایه‌های ادبی",
    description: "جدول کامل آرایه‌های ادبی با تعریف و مثال از متون کلاسیک",
    teacher: "خانم موسوی",
    uploadedAt: "۱۴۰۳/۰۵/۰۳",
    fileType: "doc",
    fileSize: "۱.۲ مگابایت",
    fileName: "literature_rhetorical.docx",
    comments: [],
  },
  {
    id: 5,
    subject: "زبان انگلیسی",
    title: "Grammar Reference Sheet",
    description: "A quick reference guide for all tenses and grammar rules covered in the course",
    teacher: "آقای صادقی",
    uploadedAt: "۱۴۰۳/۰۵/۰۵",
    fileType: "pdf",
    fileSize: "۰.۸ مگابایت",
    fileName: "english_grammar_ref.pdf",
    comments: [],
  },
];

const ALL_SUBJECTS = ["همه", ...Array.from(new Set(INITIAL_HANDOUTS.map((h) => h.subject)))];

// ── File type config ──────────────────────────────────────────────────────────
const FILE_CFG: Record<string, { bg: string; text: string; label: string }> = {
  pdf: { bg: "bg-red-50",    text: "text-red-500",    label: "PDF"  },
  doc: { bg: "bg-blue-50",   text: "text-blue-500",   label: "DOC"  },
  ppt: { bg: "bg-orange-50", text: "text-orange-500", label: "PPT"  },
  img: { bg: "bg-green-50",  text: "text-green-500",  label: "IMG"  },
  zip: { bg: "bg-purple-50", text: "text-purple-500", label: "ZIP"  },
};

function FileIcon({ type }: { type: string }) {
  const cfg = FILE_CFG[type] ?? FILE_CFG.pdf;
  return (
    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${cfg.bg}`}>
      <span className={`text-[11px] font-black ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}

// ── Comment block ─────────────────────────────────────────────────────────────
function CommentsSection({
  handoutId,
  comments,
  onAdd,
}: {
  handoutId: number;
  comments: Comment[];
  onAdd: (handoutId: number, text: string) => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    setSending(true);
    setTimeout(() => {
      onAdd(handoutId, text.trim());
      setText("");
      setSending(false);
    }, 600);
  };

  return (
    <div className="border-t border-[#EEF0F4] px-5 py-4 bg-[#FAFCFF] space-y-3">
      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`flex gap-2.5 ${c.isOwn ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${c.isOwn ? "bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8]" : "bg-[#C4D3E0]"}`}>
                {c.author.slice(0, 1)}
              </div>
              <div className={`max-w-[75%] ${c.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`rounded-[12px] px-3.5 py-2 text-[13px] leading-relaxed ${c.isOwn ? "bg-[#EEF5FF] text-[#3E66A8]" : "bg-white border border-[#EEF0F4] text-[#1A2B45]"}`}>
                  {c.text}
                </div>
                <span className="text-[10px] text-[#C4D3E0] mt-0.5 px-1">{c.author} · {c.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New comment input */}
      <div className="flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="کامنت بگذارید (مثلاً: فایل خراب است...)"
          className="flex-1 rounded-[10px] border border-[#DADADA] bg-white px-3 py-2 text-[13px] text-[#4A4543] outline-none focus:border-[#6FA0D6] focus:ring-4 focus:ring-[#6FA0D6]/10 resize-none placeholder:text-[#C4D3E0] transition"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="h-9 w-9 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center hover:brightness-110 transition disabled:opacity-40 shrink-0"
          aria-label="ارسال"
        >
          {sending
            ? <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

// ── Handout card ──────────────────────────────────────────────────────────────
function HandoutCard({
  handout,
  onAddComment,
}: {
  handout: Handout;
  onAddComment: (id: number, text: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden hover:shadow-sm transition-shadow">
      <div className="px-5 py-4 flex items-start gap-4">
        {/* File icon */}
        <FileIcon type={handout.fileType} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[12px] font-bold text-[#3E66A8] bg-[#EEF5FF] px-2.5 py-0.5 rounded-[8px]">
              {handout.subject}
            </span>
            <span className="text-[11px] text-[#C4D3E0]">{handout.uploadedAt}</span>
          </div>

          <p className="text-[15px] font-bold text-[#1A2B45] leading-snug">{handout.title}</p>
          <p className="text-[13px] text-[#7A9BB5] mt-0.5 leading-relaxed">{handout.description}</p>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Teacher */}
            <div className="flex items-center gap-1.5 text-[12px] text-[#9DB3C9]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {handout.teacher}
            </div>

            {/* File size */}
            <span className="text-[12px] text-[#C4D3E0]">{handout.fileSize}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          {/* Download */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-3.5 py-1.5 rounded-[10px] hover:brightness-110 transition"
            title={handout.fileName}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            دانلود
          </a>

          {/* Comment toggle */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[10px] transition ${showComments ? "bg-[#EEF5FF] text-[#3E66A8]" : "text-[#9DB3C9] hover:bg-[#F4F7FB]"}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {handout.comments.length > 0
              ? `${new Intl.NumberFormat("fa-IR").format(handout.comments.length)} کامنت`
              : "کامنت"}
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <CommentsSection
          handoutId={handout.id}
          comments={handout.comments}
          onAdd={onAddComment}
        />
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function JozovatPage() {
  const [handouts, setHandouts] = useState<Handout[]>(INITIAL_HANDOUTS);
  const [activeSubject, setActiveSubject] = useState("همه");
  const [search, setSearch] = useState("");

  const handleAddComment = (handoutId: number, text: string) => {
    setHandouts((prev) =>
      prev.map((h) =>
        h.id !== handoutId ? h : {
          ...h,
          comments: [
            ...h.comments,
            {
              id: Date.now(),
              author: "من",
              text,
              date: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date()),
              isOwn: true,
            },
          ],
        }
      )
    );
  };

  const filtered = handouts.filter((h) => {
    const matchSubject = activeSubject === "همه" || h.subject === activeSubject;
    const matchSearch  = !search || h.title.includes(search) || h.subject.includes(search) || h.teacher.includes(search);
    return matchSubject && matchSearch;
  });

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-[#1A2B45]">جزوات</h2>
        <span className="text-[13px] text-[#9DB3C9]">
          {new Intl.NumberFormat("fa-IR").format(filtered.length)} جزوه
        </span>
      </div>

      {/* Search + subject filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 h-10 rounded-[10px] bg-white border border-[#EEF0F4] flex items-center px-3 gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] text-[#587181] placeholder:text-[#C4D3E0]"
            placeholder="جستجو در جزوات..."
          />
        </div>

        {/* Subject filter chips */}
        <div className="flex gap-1.5 flex-wrap">
          {ALL_SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-[10px] transition ${
                activeSubject === s
                  ? "bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white shadow-sm"
                  : "bg-white border border-[#EEF0F4] text-[#9DB3C9] hover:border-[#6FA0D6] hover:text-[#3E66A8]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Handout list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-16 flex flex-col items-center text-[#9DB3C9]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p className="text-[15px]">جزوه‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <HandoutCard key={h.id} handout={h} onAddComment={handleAddComment} />
          ))}
        </div>
      )}
    </div>
  );
}
