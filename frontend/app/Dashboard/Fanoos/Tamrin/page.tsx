"use client";

import { useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Exercise = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  submitted: boolean;
  fileName?: string;
};

type Subject = {
  id: number;
  name: string;
  teacher: string;
  color: string;
};

// ── Mock data (teachers set these via admin; backend model needed later) ───────
const SUBJECTS: Subject[] = [
  { id:1, name:"ریاضی",         teacher:"آقای احمدی",  color:"#3E66A8" },
  { id:2, name:"فیزیک",         teacher:"خانم کریمی",  color:"#5B8AC4" },
  { id:3, name:"شیمی",          teacher:"آقای رضایی",  color:"#4A7BB8" },
  { id:4, name:"ادبیات",        teacher:"خانم موسوی",  color:"#6495C4" },
  { id:5, name:"زبان انگلیسی",  teacher:"آقای صادقی",  color:"#2D5A9E" },
];

const EXERCISES: Record<number, Exercise[]> = {
  1: [
    { id:1, title:"فصل ۲ — معادلات",      description:"صفحه ۴۵ تا ۵۰ را حل کنید",            dueDate:"۱۴۰۳/۰۵/۰۵", submitted:false },
    { id:2, title:"تمرین مشتق‌گیری",      description:"مسائل ۱ تا ۱۰ صفحه ۶۷",              dueDate:"۱۴۰۳/۰۵/۱۲", submitted:true, fileName:"math_hw.pdf" },
  ],
  2: [
    { id:3, title:"حرکت‌شناسی",           description:"مسئله‌های انتهای فصل ۳ را حل کنید",   dueDate:"۱۴۰۳/۰۵/۰۷", submitted:false },
  ],
  3: [
    { id:4, title:"اتم و جدول تناوبی",    description:"سوالات ۱ تا ۱۵ از فصل اول",            dueDate:"۱۴۰۳/۰۵/۰۸", submitted:true, fileName:"chem1.pdf" },
    { id:5, title:"پیوند شیمیایی",        description:"مسائل بخش ۲.۳",                        dueDate:"۱۴۰۳/۰۵/۱۵", submitted:false },
    { id:6, title:"گازها",                description:"قانون گاز ایده‌آل — مسائل تمرینی",     dueDate:"۱۴۰۳/۰۵/۲۰", submitted:false },
  ],
  4: [
    { id:7, title:"تحلیل شعر حافظ",       description:"غزل ۱۸ را تحلیل ادبی کنید",           dueDate:"۱۴۰۳/۰۵/۱۰", submitted:false },
  ],
  5: [
    { id:8, title:"Reading Comprehension", description:"Unit 3 exercises A and B",            dueDate:"۱۴۰۳/۰۵/۰۶", submitted:true, fileName:"english_hw.docx" },
    { id:9, title:"Grammar — Tenses",      description:"Fill in the blanks worksheet",        dueDate:"۱۴۰۳/۰۵/۱۳", submitted:false },
  ],
};

// ── Helper: icon per subject ──────────────────────────────────────────────────
function SubjectIcon({ name, color }: { name: string; color: string }) {
  return (
    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 text-white font-bold text-[15px]"
      style={{ background: color }}>
      {name.slice(0, 1)}
    </div>
  );
}

// ── Upload button per exercise ────────────────────────────────────────────────
function UploadButton({ exercise, onUploaded }: { exercise: Exercise; onUploaded: (id: number, name: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      onUploaded(exercise.id, file.name);
    }, 1200);
  };

  if (exercise.submitted) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-[10px]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {exercise.fileName ?? "ارسال شده"}
      </div>
    );
  }

  return (
    <>
      <input ref={ref} type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png" />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 text-[13px] font-semibold bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white px-4 py-1.5 rounded-[10px] hover:brightness-110 transition disabled:opacity-60"
      >
        {uploading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
            در حال آپلود...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            آپلود تمرین
          </>
        )}
      </button>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TamrinPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  // Local submitted state so upload reflects instantly
  const [localSubmitted, setLocalSubmitted] = useState<Record<number, string>>({});

  const selectedSubject = SUBJECTS.find((s) => s.id === selectedSubjectId);
  const exercises = selectedSubjectId ? (EXERCISES[selectedSubjectId] ?? []) : [];

  const handleUploaded = (exerciseId: number, fileName: string) => {
    setLocalSubmitted((prev) => ({ ...prev, [exerciseId]: fileName }));
  };

  // Merge mock + local state
  const mergedExercises = exercises.map((ex) =>
    localSubmitted[ex.id] ? { ...ex, submitted: true, fileName: localSubmitted[ex.id] } : ex
  );

  const pendingCount = mergedExercises.filter((e) => !e.submitted).length;

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        {selectedSubject && (
          <button
            onClick={() => setSelectedSubjectId(null)}
            className="flex items-center gap-1.5 text-[13px] text-[#6FA0D6] hover:text-[#3E66A8] transition font-semibold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            بازگشت
          </button>
        )}
        <h2 className="text-[20px] font-bold text-[#1A2B45]">
          {selectedSubject ? `تمرین‌های ${selectedSubject.name}` : "تمرین کلاسی"}
        </h2>
        {selectedSubject && pendingCount > 0 && (
          <span className="bg-red-100 text-red-600 text-[12px] font-bold px-2.5 py-0.5 rounded-full">
            {new Intl.NumberFormat("fa-IR").format(pendingCount)} در انتظار ارسال
          </span>
        )}
      </div>

      {/* ── Subject list ── */}
      {!selectedSubject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBJECTS.map((subj) => {
            const exList = EXERCISES[subj.id] ?? [];
            const pending = exList.length;
            const done = exList.filter((e) => e.submitted).length;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className="bg-white rounded-[16px] border border-[#EEF0F4] p-5 text-right hover:shadow-md hover:border-[#6FA0D6]/40 transition-all duration-200 flex items-center gap-4 group"
              >
                <SubjectIcon name={subj.name} color={subj.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-[#1A2B45] group-hover:text-[#3E66A8] transition">{subj.name}</p>
                  <p className="text-[12px] text-[#9DB3C9] mt-0.5">{subj.teacher}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] bg-[#EEF5FF] text-[#3E66A8] font-semibold px-2 py-0.5 rounded-full">
                      {new Intl.NumberFormat("fa-IR").format(pending)} تمرین
                    </span>
                    {done > 0 && (
                      <span className="text-[11px] bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">
                        {new Intl.NumberFormat("fa-IR").format(done)} ارسال شده
                      </span>
                    )}
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4D3E0"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Exercise list for selected subject ── */}
      {selectedSubject && (
        <div className="space-y-3">
          {mergedExercises.length === 0 ? (
            <div className="rounded-[16px] bg-white border border-[#EEF0F4] py-14 flex flex-col items-center text-[#9DB3C9]">
              <p className="text-[15px]">تمرینی برای این درس ثبت نشده است</p>
            </div>
          ) : (
            mergedExercises.map((ex) => (
              <div key={ex.id} className="bg-white rounded-[16px] border border-[#EEF0F4] p-5">
                <div className="flex items-start gap-4">
                  {/* Status dot */}
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${ex.submitted ? "bg-emerald-400" : "bg-amber-400"}`} />

                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-[#1A2B45]">{ex.title}</p>
                    <p className="text-[13px] text-[#7A9BB5] mt-1 leading-relaxed">{ex.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-[12px] text-[#9DB3C9]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        مهلت: {ex.dueDate}
                      </div>

                      {/* Upload button */}
                      <UploadButton exercise={ex} onUploaded={handleUploaded} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
