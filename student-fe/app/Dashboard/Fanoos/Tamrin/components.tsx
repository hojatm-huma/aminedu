"use client";

import { useState, useRef } from "react";
import { Comment, faNum } from "./data";

// ── Upload button (Client code used by Student) ───────────────────────────────
export function UploadSection({
  submission,
  onUpload,
}: {
  submission?: { fileName: string; submittedAt: string; url?: string };
  onUpload: (file: File) => Promise<void>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(false);
    try {
      await onUpload(file);
    } catch {
      setError(true);
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div>
      <p className="text-[12px] font-bold text-[#9DB3C9] mb-2">پاسخ تمرین</p>
      {submission ? (
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={submission.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-[10px] px-3 py-2 text-[13px] text-emerald-700 font-semibold hover:bg-emerald-100 transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {submission.fileName}
            <span className="font-normal text-emerald-500 text-[11px]">
              · {submission.submittedAt}
            </span>
          </a>
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="text-[12px] text-[#9DB3C9] hover:text-[#3E66A8] underline transition cursor-pointer disabled:opacity-60"
          >
            {uploading ? "در حال آپلود..." : "جایگزینی فایل"}
          </button>
          <input
            ref={ref}
            type="file"
            className="hidden"
            onChange={handleFile}
            accept=".pdf,.doc,.docx,.jpg,.png,.zip"
          />
        </div>
      ) : (
        <>
          <input
            ref={ref}
            type="file"
            className="hidden"
            onChange={handleFile}
            accept=".pdf,.doc,.docx,.jpg,.png,.zip"
          />
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-[13px] font-semibold bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] text-white px-4 py-2 rounded-[10px] hover:brightness-110 transition disabled:opacity-60 cursor-pointer"
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
                در حال آپلود...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                آپلود پاسخ تمرین
              </>
            )}
          </button>
        </>
      )}
      {error && (
        <p className="text-[12px] text-red-500 mt-2">
          خطا در آپلود فایل. دوباره تلاش کنید.
        </p>
      )}
    </div>
  );
}

// ── Comments block ────────────────────────────────────────────────────────────
export function CommentsSection({
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
        <div
          key={c.id}
          className={`flex gap-2.5 ${c.isOwn ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${c.isOwn ? "bg-gradient-to-br from-[#6FA0D6] to-[#3E66A8]" : "bg-[#C4D3E0]"}`}
          >
            {c.author.slice(0, 1)}
          </div>
          <div
            className={`max-w-[80%] flex flex-col ${c.isOwn ? "items-end" : "items-start"}`}
          >
            <div
              className={`rounded-[12px] px-3.5 py-2 text-[13px] leading-relaxed ${c.isOwn ? "bg-[#EEF5FF] text-[#3E66A8]" : "bg-[#F4F7FB] text-[#1A2B45]"}`}
            >
              {c.text}
            </div>
            <span className="text-[10px] text-[#C4D3E0] mt-0.5 px-1">
              {c.author} · {c.date}
            </span>
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="h-9 w-9 rounded-[10px] bg-gradient-to-l from-[#6FA0D6] to-[#3E66A8] flex items-center justify-center hover:brightness-110 transition disabled:opacity-40 shrink-0 cursor-pointer"
        >
          {sending ? (
            <svg
              className="animate-spin w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
