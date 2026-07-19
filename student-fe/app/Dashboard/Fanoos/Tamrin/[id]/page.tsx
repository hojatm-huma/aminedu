"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  SUBJECTS,
  INITIAL_EXERCISES,
  Exercise,
  today,
} from "../data";
import { UploadSection, CommentsSection } from "../components";

export default function TamrinDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Number(params.id);

  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>(
    INITIAL_EXERCISES[subjectId] ?? [],
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole === "teacher" ? "teacher" : "student");
  }, []);

  const selectedSubject = SUBJECTS.find((s) => s.id === subjectId);

  const handleUpload = (exerciseId: number, fileName: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id !== exerciseId
          ? ex
          : { ...ex, submission: { fileName, submittedAt: today } },
      ),
    );
  };

  const handleComment = (exerciseId: number, text: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id !== exerciseId
          ? ex
          : {
              ...ex,
              comments: [
                ...ex.comments,
                {
                  id: Date.now(),
                  author: role === "teacher" ? "استاد" : "من",
                  text,
                  date: today,
                  isOwn: true,
                },
              ],
            },
      ),
    );
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate.trim()) return;

    const newEx: Exercise = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      dueDate: newDueDate.trim(),
      teacherFile: newFileName.trim()
        ? { name: newFileName.trim(), size: "۱.۵ مگابایت" }
        : undefined,
      submissions: [],
      comments: [],
    };

    setExercises((prev) => [...prev, newEx]);

    setShowAddModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewDueDate("");
    setNewFileName("");
  };

  const handleGrade = (
    exerciseId: number,
    submissionId: number,
    score: number,
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          submissions: (ex.submissions || []).map((sub) =>
            sub.id === submissionId ? { ...sub, score } : sub,
          ),
        };
      }),
    );
  };

  if (!role) return null;

  if (!selectedSubject) {
    return (
      <div dir="rtl" className="space-y-5">
        <button
          onClick={() => router.push("/Dashboard/Fanoos/Tamrin")}
          className="flex items-center gap-1.5 text-[13px] text-[#6FA0D6] hover:text-[#3E66A8] font-semibold transition cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          بازگشت
        </button>
        <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-14 flex items-center justify-center text-[#9DB3C9] text-[15px]">
          درس مورد نظر یافت نشد
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/Dashboard/Fanoos/Tamrin")}
            className="flex items-center gap-1.5 text-[13px] text-[#6FA0D6] hover:text-[#3E66A8] font-semibold transition cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            بازگشت
          </button>
          <h2 className="text-[20px] font-bold text-[#1A2B45]">
            {`تمرین‌های ${selectedSubject.name}`}{" "}
            {role === "teacher" && "(پنل معلم)"}
          </h2>
        </div>

        {role === "teacher" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] px-4 py-2 rounded-[10px] hover:brightness-110 transition shadow-sm cursor-pointer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            تعریف تمرین جدید
          </button>
        )}
      </div>

      {/* Exercise list */}
      <div className="space-y-4">
        {exercises.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-14 flex items-center justify-center text-[#9DB3C9] text-[15px]">
            تمرینی ثبت نشده است
          </div>
        ) : (
          exercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden"
            >
              <div className="flex">
                <div
                  className="w-1.5 shrink-0"
                  style={{ background: selectedSubject.color }}
                />
                <div className="flex-1 p-5 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[17px] font-bold text-[#1A2B45]">
                        {ex.title}
                      </p>
                      <p className="text-[13px] text-[#7A9BB5] mt-1 leading-relaxed">
                        {ex.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9DB3C9]">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      مهلت: {ex.dueDate}
                    </div>
                  </div>

                  {/* Teacher file */}
                  {ex.teacherFile && (
                    <div>
                      <p className="text-[12px] font-bold text-[#9DB3C9] mb-2">
                        فایل تمرین
                      </p>
                      <div className="inline-flex items-center gap-2.5 bg-[#F4F7FB] border border-[#EEF0F4] rounded-[10px] px-3.5 py-2">
                        <div className="w-8 h-8 rounded-[8px] bg-red-50 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-black text-red-400">
                            PDF
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#1A2B45]">
                            {ex.teacherFile.name}
                          </p>
                          <p className="text-[11px] text-[#C4D3E0]">
                            {ex.teacherFile.size}
                          </p>
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
                      <p className="text-[12px] font-bold text-[#9DB3C9] mb-3">
                        پاسخ‌های ارسال شده دانش‌آموزان
                      </p>
                      {(ex.submissions || []).length === 0 ? (
                        <p className="text-[13px] text-[#7A9BB5]">
                          هیچ پاسخی تا کنون ارسال نشده است.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {(ex.submissions || []).map((sub) => (
                            <div
                              key={sub.id}
                              className="flex flex-wrap items-center justify-between border border-[#EEF0F4] rounded-[12px] p-3 bg-[#FAFCFF] gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#E8F0FA] text-[#3E66A8] flex items-center justify-center text-[13px] font-bold">
                                  {sub.studentName.slice(0, 1)}
                                </div>
                                <div>
                                  <p className="text-[13px] font-bold text-[#1A2B45]">
                                    {sub.studentName}
                                  </p>
                                  <span className="text-[11px] text-[#9DB3C9]">
                                    {sub.fileName} · {sub.submittedAt}
                                  </span>
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
                                  <span className="text-[12px] text-[#4A5568]">
                                    نمره:
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.25"
                                    placeholder="---"
                                    value={
                                      sub.score !== undefined ? sub.score : ""
                                    }
                                    onChange={(e) =>
                                      handleGrade(
                                        ex.id,
                                        sub.id,
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-14 h-8 rounded-[8px] border border-[#DADADA] text-center text-[13px] font-bold outline-none focus:border-[#6FA0D6]"
                                  />
                                  <span className="text-[12px] text-[#9DB3C9]">
                                    از ۲۰
                                  </span>
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

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
          />
          <form
            onSubmit={handleAddExercise}
            className="bg-white rounded-[18px] border border-[#EEF0F4] p-6 w-full max-w-md relative z-10 space-y-4 shadow-xl"
          >
            <h3 className="text-[18px] font-bold text-[#1A2B45]">
              تعریف تمرین جدید
            </h3>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">
                عنوان تمرین
              </label>
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
              <label className="text-[12px] font-bold text-[#9DB3C9]">
                توضیحات تمرین
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                placeholder="توضیحات و دستورالعمل حل..."
                className="w-full rounded-[10px] border border-[#DADADA] p-3 text-[13px] outline-none focus:border-[#6FA0D6] transition resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#9DB3C9]">
                مهلت ارسال
              </label>
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
              <label className="text-[12px] font-bold text-[#9DB3C9]">
                نام فایل صورت تمرین (اختیاری)
              </label>
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
