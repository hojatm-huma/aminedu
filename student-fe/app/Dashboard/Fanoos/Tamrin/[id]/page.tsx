"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useClasses } from "@/libs/hooks/apis/classes";
import { ExerciseDetail } from "@/libs/types/classes";
import { UploadSection, CommentsSection } from "../components";
import { Comment } from "../data";

const faDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
};

const fileNameFromUrl = (url: string) => {
  const last = url.split("/").pop() ?? url;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};

export default function TamrinDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const exerciseId = Number(params.id);
  const registrationId = Number(searchParams.get("registrationId"));

  const { getRegistrationExerciseDetail, createExerciseSubmission } = useClasses();

  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [submission, setSubmission] = useState<
    { fileName: string; submittedAt: string; url?: string } | undefined
  >(undefined);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!registrationId || !exerciseId) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    getRegistrationExerciseDetail(registrationId, exerciseId)
      .then((res) => {
        const data = res.data;
        setExercise(data);

        const lastSubmission = data.submissions[data.submissions.length - 1];
        setSubmission(
          lastSubmission
            ? {
                fileName: lastSubmission.name,
                submittedAt: faDate(lastSubmission.created_at),
                url: lastSubmission.url,
              }
            : undefined,
        );

        setComments(
          data.comments.map((c) => ({
            id: c.id,
            author: c.commenter,
            text: c.comment,
            date: faDate(c.created_at),
            isOwn: false,
          })),
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [registrationId, exerciseId, getRegistrationExerciseDetail]);

  const handleUpload = async (file: File) => {
    const res = await createExerciseSubmission(registrationId, exerciseId, file);
    setSubmission({
      fileName: fileNameFromUrl(res.data.file),
      submittedAt: faDate(res.data.created_at),
      url: res.data.file,
    });
  };

  const handleComment = (text: string) => {
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: "من", text, date: faDate(new Date().toISOString()), isOwn: true },
    ]);
  };

  const BackButton = (
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
  );

  if (loading) {
    return (
      <div dir="rtl" className="space-y-5">
        {BackButton}
        <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-14 flex items-center justify-center text-[#9DB3C9] text-[15px]">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div dir="rtl" className="space-y-5">
        {BackButton}
        <div className="bg-white rounded-[16px] border border-[#EEF0F4] py-14 flex items-center justify-center text-[#9DB3C9] text-[15px]">
          تمرین مورد نظر یافت نشد
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        {BackButton}
        <h2 className="text-[20px] font-bold text-[#1A2B45]">{exercise.title}</h2>
      </div>

      {/* Exercise card */}
      <div className="bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
        <div className="flex">
          <div className="w-1.5 shrink-0" style={{ background: "#3E66A8" }} />
          <div className="flex-1 p-5 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[17px] font-bold text-[#1A2B45]">
                  {exercise.title}
                </p>
                <p className="text-[13px] text-[#7A9BB5] mt-1 leading-relaxed">
                  {exercise.description}
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
                مهلت: {faDate(exercise.due_date)}
              </div>
            </div>

            {/* Teacher files */}
            {exercise.files.length > 0 && (
              <div>
                <p className="text-[12px] font-bold text-[#9DB3C9] mb-2">
                  فایل تمرین
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {exercise.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 bg-[#F4F7FB] border border-[#EEF0F4] rounded-[10px] px-3.5 py-2 hover:bg-[#EEF5FF] transition"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-red-50 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-red-400">
                          فایل
                        </span>
                      </div>
                      <p className="text-[13px] font-semibold text-[#1A2B45]">
                        {fileNameFromUrl(file.file)}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-[#EEF0F4]" />

            {/* Upload answers */}
            <UploadSection submission={submission} onUpload={handleUpload} />

            <div className="h-px bg-[#EEF0F4]" />

            {/* Comments */}
            <CommentsSection comments={comments} onAdd={handleComment} />
          </div>
        </div>
      </div>
    </div>
  );
}
