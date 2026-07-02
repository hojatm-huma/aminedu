"use client";

import { useState, useRef, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  isOwn: boolean;
};

type Submission = {
  id: number;
  studentName: string;
  fileName: string;
  submittedAt: string;
  score?: number; // Teacher's grade (e.g., out of 20)
};

type Exercise = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  teacherFile?: { name: string; size: string };
  submission?: { fileName: string; submittedAt: string }; // For student
  submissions?: Submission[]; // For teacher
  comments: Comment[];
};

type Subject = { id: number; name: string; teacher: string; color: string };

const SUBJECTS: Subject[] = [
  { id: 1, name: "ریاضی", teacher: "آقای احمدی", color: "#3E66A8" },
  { id: 2, name: "فیزیک", teacher: "خانم کریمی", color: "#5B8AC4" },
  { id: 3, name: "شیمی", teacher: "آقای رضایی", color: "#4A7BB8" },
  { id: 4, name: "ادبیات", teacher: "خانم موسوی", color: "#6495C4" },
  { id: 5, name: "زبان انگلیسی", teacher: "آقای صادقی", color: "#2D5A9E" },
];

const INITIAL_EXERCISES: Record<number, Exercise[]> = {
  1: [
    {
      id: 1,
      title: "فصل ۲ — معادلات",
      description: "صفحه ۴۵ تا ۵۰ را حل کنید. مسائل ۱ تا ۸ الزامی و ۹ تا ۱۲ اختیاری است.",
      dueDate: "۱۴۰۳/۰۵/۰۵",
      teacherFile: { name: "math_ex_ch2.pdf", size: "۱.۱ مگابایت" },
      submission: { fileName: "math_hw.pdf", submittedAt: "۱۴۰۳/۰۵/۰۳" },
      submissions: [
        { id: 101, studentName: "علی رضایی", fileName: "math_hw_ali.pdf", submittedAt: "۱۴۰۳/۰۵/۰۳", score: 18.5 },
        { id: 102, studentName: "سارا حسینی", fileName: "math_hw_sara.pdf", submittedAt: "۱۴۰۳/۰۵/۰۴" },
      ],
      comments: [
        { id: 1, author: "من", text: "استاد مسئله ۷ در فایل خوانا نیست.", date: "۱۴۰۳/۰۴/۳۰", isOwn: true },
        { id: 2, author: "آقای احمدی", text: "فایل جدید آپلود شد، مشکل برطرف است.", date: "۱۴۰۳/۰۵/۰۱", isOwn: false },
      ],
    },
    {
      id: 2,
      title: "تمرین مشتق‌گیری",
      description: "مسائل ۱ تا ۱۰ صفحه ۶۷ را حل و عکس دست‌نویس آپلود کنید.",
      dueDate: "۱۴۰۳/۰۵/۱۲",
      teacherFile: { name: "derivative_exercises.pdf", size: "۰.۸ مگابایت" },
      submission: undefined,
      submissions: [],
      comments: [],
    },
  ],
  2: [
    {
      id: 3,
      title: "حرکت‌شناسی",
      description: "مسئله‌های انتهای فصل ۳ را حل کنید. مسائل ۱۱، ۱۳ و ۱۵ الزامی است.",
      dueDate: "۱۴۰۳/۰۵/۰۷",
      teacherFile: { name: "kinematics_hw.pdf", size: "۱.۵ مگابایت" },
      submission: undefined,
      submissions: [
        { id: 103, studentName: "مهدی علوی", fileName: "kinematics_v1.pdf", submittedAt: "۱۴۰۳/۰۵/۰۲" },
      ],
      comments: [
        { id: 3, author: "من", text: "فایل تمرین باز نمی‌شه.", date: "۱۴۰۳/۰۵/۰۱", isOwn: true },
      ],
    },
  ],
};

const faNum = (n: number | string) => new Intl.NumberFormat("fa-IR").format(Number(n) || 0);
const today = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export default function TamrinPage() {
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Record<number, Exercise[]>>(INITIAL_EXERCISES);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole === "teacher" ? "teacher" : "student");
  }, []);

  const selectedSubject = SUBJECTS.find((s) => s.id === selectedId);
  const subjectExercises = selectedId ? (exercises[selectedId] ?? []) : [];

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
          comments: [...ex.comments, { id: Date.now(), author: role === "teacher" ? "استاد" : "من", text, date: today, isOwn: true }],
        }
      ),
    }));
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate.trim()) return;

    const newEx: Exercise = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      dueDate: newDueDate.trim(),
      teacherFile: newFileName.trim() ? { name: newFileName.trim(), size: "۱.۵ مگابایت" } : undefined,
      submissions: [],
      comments: [],
    };

    setExercises((prev) => ({
      ...prev,
      [selectedId!]: [...(prev[selectedId!] || []), newEx],
    }));

    setShowAddModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewDueDate("");
    setNewFileName("");
  };

  const handleGrade = (exerciseId: number, submissionId: number, score: number) => {
    setExercises((prev) => ({
      ...prev,
      [selectedId!]: prev[selectedId!].map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          submissions: (ex.submissions || []).map((sub) =>
            sub.id === submissionId ? { ...sub, score } : sub
          ),
        };
      }),
    }));
  };

  if (!role) return null;

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {selectedSubject && (
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-1.5 text-[13px] text-[#6FA0D6] hover:text-[#3E66A8] font-semibold transition cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              بازگشت
            </button>
          )}
          <h2 className="text-[20px] font-bold text-[#1A2B45]">
            {selectedSubject ? `تمرین‌های ${selectedSubject.name}` : "تمرین کلاسی"} {role === "teacher" && "(پنل معلم)"}
          </h2>
        </div>

        {selectedSubject && role === "teacher" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-4 py-2 rounded-[10px] hover:brightness-110 transition shadow-sm cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            تعریف تمرین جدید
          </button>
        )}
      </div>

      {/* Subject list */}
      {!selectedSubject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBJECTS.map((subj) => {
            const exList = exercises[subj.id] ?? [];
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedId(subj.id)}
                className="bg-white rounded-[16px] border border-[#EEF0F4] p-5 text-right hover:shadow-md hover:border-[#6FA0D6]/40 transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white font-bold text-[16px] shrink-0" style={{ background: subj.color }}>
                  {subj.name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-[#1A2B45] group-hover:text-[#3E66A8] transition">{subj.name}</p>
                  <p className="text-[12px] text-[#9DB3C9] mt-0.5">{subj.teacher}</p>
                  <span className="text-[11px] inline-block bg-[#EEF5FF] text-[#3E66A8] font-semibold px-2 py-0.5 rounded-full mt-2">
                    {faNum(exList.length)} تمرین تعریف شده
                  </span>
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
              <div key={ex.id} className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
                <div className="flex">
                  <div className="w-1.5 shrink-0" style={{ background: selectedSubject.color }} />
                  <div className="flex-1 p-5 space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-[17px] font-bold text-[#1A2B45]">{ex.title}</p>
                        <p className="text-[13px] text-[#7A9BB5] mt-1 leading-relaxed">{ex.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#9DB3C9]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        مهلت: {ex.dueDate}
                      </div>
                    </div>

                    {/* Teacher file */}
                    {ex.teacherFile && (
                      <div>
                        <p className="text-[12px] font-bold text-[#9DB3C9] mb-2">فایل تمرین</p>
                        <div className="inline-flex items-center gap-2.5 bg-[#F4F7FB] border border-[#EEF0F4] rounded-[10px] px-3.5 py-2">
                          <div className="w-8 h-8 rounded-[8px] bg-red-50 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-red-400">PDF</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#1A2B45]">{ex.teacherFile.name}</p>
                            <p className="text-[11px] text-[#C4D3E0]">{ex.teacherFile.size}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="h-px bg-[#EEF0F4]" />

                    {/* Student/Teacher specific section */}
                    {role === "student" ? (
                      /* STUDENT: Upload answers */
                      <UploadSection
                        submission={ex.submission}
                        onUploaded={(fileName) => handleUpload(ex.id, fileName)}
                      />
                    ) : (
                      /* TEACHER: View and Grade student submissions */
                      <div>
                        <p className="text-[12px] font-bold text-[#9DB3C9] mb-3">پاسخ‌های ارسال شده دانش‌آموزان</p>
                        {(ex.submissions || []).length === 0 ? (
                          <p className="text-[13px] text-[#7A9BB5]">هیچ پاسخی تا کنون ارسال نشده است.</p>
                        ) : (
                          <div className="space-y-2">
                            {(ex.submissions || []).map((sub) => (
                              <div key={sub.id} className="flex flex-wrap items-center justify-between border border-[#EEF0F4] rounded-[12px] p-3 bg-[#FAFCFF] gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#E8F0FA] text-[#3E66A8] flex items-center justify-center text-[13px] font-bold">
                                    {sub.studentName.slice(0, 1)}
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-bold text-[#1A2B45]">{sub.studentName}</p>
                                    <span className="text-[11px] text-[#9DB3C9]">{sub.fileName} · {sub.submittedAt}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="text-[12px] font-semibold text-[#3E66A8] hover:underline"
                                  >
                                    دانلود فایل پاسخ
                                  </a>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] text-[#4A5568]">نمره:</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="20"
                                      step="0.25"
                                      placeholder="---"
                                      value={sub.score !== undefined ? sub.score : ""}
                                      onChange={(e) => handleGrade(ex.id, sub.id, Number(e.target.value))}
                                      className="w-14 h-8 rounded-[8px] border border-[#DADADA] text-center text-[13px] font-bold outline-none focus:border-[#6FA0D6]"
                                    />
                                    <span className="text-[12px] text-[#9DB3C9]">از ۲۰</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="h-px bg-[#EEF0F4]" />

                    {/* Comments */}
                    <CommentsSection
                      comments={ex.comments}
                      onAdd={(text) => handleComment(ex.id, text)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleAddExercise}
            className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl"
          >
            <h3 className="text-[18px] font-bold text-[#1A2B45]">تعریف تمرین جدید</h3>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">عنوان تمرین</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثلاً تمرین فصل ۲"
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">توضیحات تمرین</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                placeholder="توضیحات و دستورالعمل حل..."
                className="w-full rounded-[10px] border border-[#DADADA] p-3 text-[13px] outline-none focus:border-[#6FA0D6] transition resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">مهلت ارسال</label>
              <input
                type="text"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="مثلاً ۱۴۰۳/۰۵/۱۵"
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">نام فایل صورت تمرین (اختیاری)</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="مثلاً math_exercises_ch2.pdf"
                className="w-full h-10 rounded-[10px] border border-[#DADADA] px-3 text-[13px] outline-none focus:border-[#6FA0D6] transition"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-10 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
              >
                ثبت تمرین
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
    </div>
  );
}

// ── Upload button (Client code used by Student) ───────────────────────────────
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
    setTimeout(() => {
      setUploading(false);
      onUploaded(file.name);
    }, 1200);
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
            className="text-[12px] text-[#9DB3C9] hover:text-[#3E66A8] underline transition cursor-pointer"
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
            className="flex items-center gap-2 text-[13px] font-semibold bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white px-4 py-2 rounded-[10px] hover:brightness-110 transition disabled:opacity-60 cursor-pointer"
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

// ── Comments block ────────────────────────────────────────────────────────────
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
    setTimeout(() => {
      onAdd(text.trim());
      setText("");
      setSending(false);
    }, 600);
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-bold text-[#9DB3C9]">
        کامنت‌ها {comments.length > 0 && `(${faNum(comments.length)})`}
      </p>

      {comments.map((c) => (
        <div key={c.id} className={`flex gap-2.5 ${c.isOwn ? "flex-row-reverse" : ""}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${c.isOwn ? "bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8]" : "bg-[#C4D3E0]"}`}>
            {c.author.slice(0, 1)}
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
          className="h-9 w-9 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center hover:brightness-110 transition disabled:opacity-40 shrink-0 cursor-pointer"
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
