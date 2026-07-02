"use client";

import { useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  isOwn: boolean;
};

type Exercise = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  teacherFile?: { name: string; size: string };
  submission?: { fileName: string; submittedAt: string };
  comments: Comment[];
};

type Subject = { id: number; name: string; teacher: string; color: string };

// ── Mock data ─────────────────────────────────────────────────────────────────
const SUBJECTS: Subject[] = [
  { id:1, name:"ریاضی",         teacher:"آقای احمدی",  color:"#3E66A8" },
  { id:2, name:"فیزیک",         teacher:"خانم کریمی",  color:"#5B8AC4" },
  { id:3, name:"شیمی",          teacher:"آقای رضایی",  color:"#4A7BB8" },
  { id:4, name:"ادبیات",        teacher:"خانم موسوی",  color:"#6495C4" },
  { id:5, name:"زبان انگلیسی",  teacher:"آقای صادقی",  color:"#2D5A9E" },
];

const INITIAL_EXERCISES: Record<number, Exercise[]> = {
  1: [
    {
      id:1,
      title:"فصل ۲ — معادلات",
      description:"صفحه ۴۵ تا ۵۰ را حل کنید. مسائل ۱ تا ۸ الزامی و ۹ تا ۱۲ اختیاری است.",
      dueDate:"۱۴۰۳/۰۵/۰۵",
      teacherFile:{ name:"math_ex_ch2.pdf", size:"۱.۱ مگابایت" },
      submission:{ fileName:"math_hw.pdf", submittedAt:"۱۴۰۳/۰۵/۰۳" },
      comments:[
        { id:1, author:"من", text:"استاد مسئله ۷ در فایل خوانا نیست.", date:"۱۴۰۳/۰۴/۳۰", isOwn:true },
        { id:2, author:"آقای احمدی", text:"فایل جدید آپلود شد، مشکل برطرف است.", date:"۱۴۰۳/۰۵/۰۱", isOwn:false },
      ],
    },
    {
      id:2,
      title:"تمرین مشتق‌گیری",
      description:"مسائل ۱ تا ۱۰ صفحه ۶۷ را حل و عکس دست‌نویس آپلود کنید.",
      dueDate:"۱۴۰۳/۰۵/۱۲",
      teacherFile:{ name:"derivative_exercises.pdf", size:"۰.۸ مگابایت" },
      submission:undefined,
      comments:[],
    },
  ],
  2: [
    {
      id:3,
      title:"حرکت‌شناسی",
      description:"مسئله‌های انتهای فصل ۳ را حل کنید. مسائل ۱۱، ۱۳ و ۱۵ الزامی است.",
      dueDate:"۱۴۰۳/۰۵/۰۷",
      teacherFile:{ name:"kinematics_hw.pdf", size:"۱.۵ مگابایت" },
      submission:undefined,
      comments:[
        { id:3, author:"من", text:"فایل تمرین باز نمی‌شه.", date:"۱۴۰۳/۰۵/۰۱", isOwn:true },
      ],
    },
  ],
  3: [
    {
      id:4,
      title:"اتم و جدول تناوبی",
      description:"سوالات ۱ تا ۱۵ از فصل اول را پاسخ دهید.",
      dueDate:"۱۴۰۳/۰۵/۰۸",
      teacherFile:undefined,
      submission:{ fileName:"chem1.pdf", submittedAt:"۱۴۰۳/۰۵/۰۶" },
      comments:[],
    },
    {
      id:5,
      title:"پیوند شیمیایی",
      description:"مسائل بخش ۲.۳ را حل کنید.",
      dueDate:"۱۴۰۳/۰۵/۱۵",
      teacherFile:{ name:"chemical_bond.pdf", size:"۲.۳ مگابایت" },
      submission:undefined,
      comments:[],
    },
  ],
  4: [
    {
      id:6,
      title:"تحلیل شعر حافظ",
      description:"غزل ۱۸ را تحلیل ادبی کنید. حداقل ۳۰۰ کلمه.",
      dueDate:"۱۴۰۳/۰۵/۱۰",
      teacherFile:{ name:"hafez_poem.pdf", size:"۰.۵ مگابایت" },
      submission:undefined,
      comments:[],
    },
  ],
  5: [
    {
      id:7,
      title:"Reading Comprehension",
      description:"Unit 3 exercises A and B — write answers in full sentences.",
      dueDate:"۱۴۰۳/۰۵/۰۶",
      teacherFile:{ name:"unit3_exercises.pdf", size:"۱.۲ مگابایت" },
      submission:{ fileName:"english_hw.docx", submittedAt:"۱۴۰۳/۰۵/۰۵" },
      comments:[],
    },
    {
      id:8,
      title:"Grammar — Tenses",
      description:"Fill in the blanks worksheet. Download the file and complete it.",
      dueDate:"۱۴۰۳/۰۵/۱۳",
      teacherFile:{ name:"tenses_worksheet.docx", size:"۰.۴ مگابایت" },
      submission:undefined,
      comments:[],
    },
  ],
};

const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
const today = new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());

// ── Upload button ─────────────────────────────────────────────────────────────
function UploadSection({
  submission,
  onUploaded,
}: {
  submission?: { fileName: string; submittedAt: string };
  onUploaded: (fileName: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); onUploaded(file.name); }, 1200);
  };

  return (
    <div>
      <p className="text-[12px] font-bold text-[#9DB3C9] mb-2">پاسخ تمرین</p>
      {submission ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-[10px] px-3 py-2 text-[13px] text-emerald-700 font-semibold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {submission.fileName}
            <span className="font-normal text-emerald-500 text-[11px]">· {submission.submittedAt}</span>
          </div>
          <button
            onClick={() => ref.current?.click()}
            className="text-[12px] text-[#9DB3C9] hover:text-[#3E66A8] underline transition"
          >
            جایگزینی فایل
          </button>
          <input ref={ref} type="file" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <>
          <input ref={ref} type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png,.zip" />
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-[13px] font-semibold bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white px-4 py-2 rounded-[10px] hover:brightness-110 transition disabled:opacity-60"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg>
                در حال آپلود...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                آپلود پاسخ تمرین
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

// ── Comments ──────────────────────────────────────────────────────────────────
function CommentsSection({
  comments,
  onAdd,
}: {
  comments: Comment[];
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    setSending(true);
    setTimeout(() => { onAdd(text.trim()); setText(""); setSending(false); }, 600);
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-bold text-[#9DB3C9]">
        کامنت‌ها {comments.length > 0 && `(${faNum(comments.length)})`}
      </p>

      {comments.map((c) => (
        <div key={c.id} className={`flex gap-2.5 ${c.isOwn ? "flex-row-reverse" : ""}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${c.isOwn ? "bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8]" : "bg-[#C4D3E0]"}`}>
            {c.author.slice(0,1)}
          </div>
          <div className={`max-w-[80%] flex flex-col ${c.isOwn ? "items-end" : "items-start"}`}>
            <div className={`rounded-[12px] px-3.5 py-2 text-[13px] leading-relaxed ${c.isOwn ? "bg-[#EEF5FF] text-[#3E66A8]" : "bg-[#F4F7FB] text-[#1A2B45]"}`}>
              {c.text}
            </div>
            <span className="text-[10px] text-[#C4D3E0] mt-0.5 px-1">{c.author} · {c.date}</span>
          </div>
        </div>
      ))}

      {/* Input */}
      <div className="flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="کامنت بگذارید (مثلاً: فایل تمرین خراب است)..."
          className="flex-1 rounded-[10px] border border-[#DADADA] bg-white px-3 py-2 text-[13px] text-[#4A4543] outline-none focus:border-[#6FA0D6] focus:ring-4 focus:ring-[#6FA0D6]/10 resize-none placeholder:text-[#C4D3E0] transition"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="h-9 w-9 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center hover:brightness-110 transition disabled:opacity-40 shrink-0"
        >
          {sending
            ? <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

// ── Exercise card ─────────────────────────────────────────────────────────────
function ExerciseCard({
  exercise,
  subjectColor,
  onUpload,
  onComment,
}: {
  exercise: Exercise;
  subjectColor: string;
  onUpload: (id: number, fileName: string) => void;
  onComment: (id: number, text: string) => void;
}) {
  const submitted = !!exercise.submission;

  return (
    <div className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
      {/* Left color stripe */}
      <div className="flex">
        <div className="w-1.5 shrink-0" style={{ background: subjectColor }} />

        <div className="flex-1 p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[17px] font-bold text-[#1A2B45]">{exercise.title}</p>
              <p className="text-[13px] text-[#7A9BB5] mt-1 leading-relaxed">{exercise.description}</p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              {/* Due date */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#9DB3C9]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                مهلت: {exercise.dueDate}
              </div>
              {/* Submission status */}
              {submitted ? (
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />ارسال شده
                </span>
              ) : (
                <span className="text-[11px] font-semibold bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />ارسال نشده
                </span>
              )}
            </div>
          </div>

          {/* Teacher's file */}
          {exercise.teacherFile && (
            <div>
              <p className="text-[12px] font-bold text-[#9DB3C9] mb-2">فایل تمرین (توسط معلم)</p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2.5 bg-[#F4F7FB] border border-[#EEF0F4] rounded-[10px] px-3.5 py-2 hover:bg-[#EEF5FF] hover:border-[#6FA0D6]/40 transition group"
              >
                <div className="w-8 h-8 rounded-[8px] bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-red-400">PDF</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1A2B45] group-hover:text-[#3E66A8] transition">{exercise.teacherFile.name}</p>
                  <p className="text-[11px] text-[#C4D3E0]">{exercise.teacherFile.size}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9DB3C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-auto">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[#EEF0F4]" />

          {/* Upload section */}
          <UploadSection
            submission={exercise.submission}
            onUploaded={(fileName) => onUpload(exercise.id, fileName)}
          />

          {/* Divider */}
          <div className="h-px bg-[#EEF0F4]" />

          {/* Comments */}
          <CommentsSection
            comments={exercise.comments}
            onAdd={(text) => onComment(exercise.id, text)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function TamrinPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Record<number, Exercise[]>>(INITIAL_EXERCISES);

  const selectedSubject = SUBJECTS.find((s) => s.id === selectedId);
  const subjectExercises = selectedId ? (exercises[selectedId] ?? []) : [];

  const pendingCount = subjectExercises.filter((e) => !e.submission).length;
  const doneCount   = subjectExercises.filter((e) =>  e.submission).length;

  const handleUpload = (exerciseId: number, fileName: string) => {
    setExercises((prev) => ({
      ...prev,
      [selectedId!]: prev[selectedId!].map((ex) =>
        ex.id !== exerciseId ? ex : { ...ex, submission: { fileName, submittedAt: today } }
      ),
    }));
  };

  const handleComment = (exerciseId: number, text: string) => {
    setExercises((prev) => ({
      ...prev,
      [selectedId!]: prev[selectedId!].map((ex) =>
        ex.id !== exerciseId ? ex : {
          ...ex,
          comments: [...ex.comments, { id: Date.now(), author: "من", text, date: today, isOwn: true }],
        }
      ),
    }));
  };

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        {selectedSubject && (
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1.5 text-[13px] text-[#6FA0D6] hover:text-[#3E66A8] font-semibold transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            بازگشت
          </button>
        )}
        <h2 className="text-[20px] font-bold text-[#1A2B45]">
          {selectedSubject ? `تمرین‌های ${selectedSubject.name}` : "تمرین کلاسی"}
        </h2>
        {selectedSubject && (
          <div className="flex gap-2 mr-auto">
            <span className="text-[12px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">{faNum(doneCount)} ارسال شده</span>
            {pendingCount > 0 && <span className="text-[12px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">{faNum(pendingCount)} در انتظار ارسال</span>}
          </div>
        )}
      </div>

      {/* Subject list */}
      {!selectedSubject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBJECTS.map((subj) => {
            const exList = exercises[subj.id] ?? [];
            const pending = exList.filter((e) => !e.submission).length;
            const done    = exList.filter((e) =>  e.submission).length;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedId(subj.id)}
                className="bg-white rounded-[16px] border border-[#EEF0F4] p-5 text-right hover:shadow-md hover:border-[#6FA0D6]/40 transition-all flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white font-bold text-[16px] shrink-0" style={{ background: subj.color }}>
                  {subj.name.slice(0,1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-[#1A2B45] group-hover:text-[#3E66A8] transition">{subj.name}</p>
                  <p className="text-[12px] text-[#9DB3C9] mt-0.5">{subj.teacher}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] bg-[#EEF5FF] text-[#3E66A8] font-semibold px-2 py-0.5 rounded-full">{faNum(exList.length)} تمرین</span>
                    {done > 0    && <span className="text-[11px] bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">{faNum(done)} ارسال شده</span>}
                    {pending > 0 && <span className="text-[11px] bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">{faNum(pending)} در انتظار</span>}
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4D3E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            );
          })}
        </div>
      )}

      {/* Exercise list */}
      {selectedSubject && (
        <div className="space-y-4">
          {subjectExercises.length === 0 ? (
            <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-14 flex items-center justify-center text-[#9DB3C9] text-[15px]">
              تمرینی ثبت نشده است
            </div>
          ) : (
            subjectExercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                subjectColor={selectedSubject.color}
                onUpload={handleUpload}
                onComment={handleComment}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
