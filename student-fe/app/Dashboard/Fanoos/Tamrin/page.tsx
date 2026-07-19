"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  MdAssignment,
  MdEvent,
  MdExpandMore,
  MdMenuBook,
  MdPerson,
} from "react-icons/md";
import { useClasses } from "@/libs/hooks/apis/classes";
import { Exercise, KlassRegistration } from "@/libs/types/classes";

const STRIPE_COLORS = [
  "#3E66A8",
  "#5B8AC4",
  "#7FA8D5",
  "#4A7BB8",
  "#2D5A9E",
  "#6495C4",
  "#3870B0",
];

const faNum = (n: number | string) =>
  new Intl.NumberFormat("fa-IR").format(Number(n) || 0);

const faDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
};

type ExercisesState = {
  items?: Exercise[];
  loading: boolean;
  error: boolean;
};

export default function FanoosPage() {
  const { getRegistrations, getRegistrationExercises } = useClasses();
  const [registrations, setRegistrations] = useState<KlassRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Record<number, ExercisesState>>({});

  useEffect(() => {
    getRegistrations()
      .then((res) => setRegistrations(res.data))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(
    (registrationId: number) => {
      setExpandedId((current) =>
        current === registrationId ? null : registrationId,
      );

      // Fetch once per registration, then reuse the cached result.
      setExercises((current) => {
        if (current[registrationId]) return current;

        getRegistrationExercises(registrationId)
          .then((res) =>
            setExercises((prev) => ({
              ...prev,
              [registrationId]: { items: res.data, loading: false, error: false },
            })),
          )
          .catch(() =>
            setExercises((prev) => ({
              ...prev,
              [registrationId]: { loading: false, error: true },
            })),
          );

        return {
          ...current,
          [registrationId]: { loading: true, error: false },
        };
      });
    },
    [getRegistrationExercises],
  );

  return (
    <div dir="rtl" className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[#6FA0D6] to-[#3E66A8]" />
        <h2 className="text-[20px] font-bold text-[#1A2B45]">
          کلاس‌های ثبت‌نام‌شده
        </h2>
      </div>

      {loading ? (
        <div className="rounded-[16px] bg-white border border-[#EEF0F4] py-16 flex items-center justify-center text-[#9DB3C9] text-[15px]">
          در حال بارگذاری...
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-[16px] bg-white border border-[#EEF0F4] py-16 flex flex-col items-center justify-center text-[#9DB3C9]">
          <MdMenuBook size={50} className="mb-3 opacity-40" />
          <p className="text-[15px]">در هیچ کلاسی ثبت‌نام نکرده‌اید</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg, idx) => {
            const isExpanded = expandedId === reg.id;
            const state = exercises[reg.id];

            return (
              <div
                key={reg.id}
                className="bg-white rounded-[14px] border border-[#EEF0F4] flex overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Color stripe */}
                <div
                  className="w-[5px] shrink-0"
                  style={{
                    background: STRIPE_COLORS[idx % STRIPE_COLORS.length],
                  }}
                />

                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggle(reg.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`exercises-${reg.id}`}
                    className="w-full text-right px-5 py-4 flex items-center gap-5 cursor-pointer"
                  >
                    {/* Class name & teacher */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-bold text-[#1A2B45] truncate">
                        {reg.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MdPerson size={13} className="text-[#9DB3C9]" />
                        <span className="text-[13px] text-[#7A9BB5] truncate">
                          {reg.teacher}
                        </span>
                      </div>
                    </div>

                    {/* Exercise count pill */}
                    <div className="mr-auto shrink-0">
                      <span className="flex items-center gap-1.5 text-[12px] bg-[#EEF5FF] text-[#3E66A8] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                        <MdAssignment size={13} />
                        {faNum(reg.exercise_count)} تمرین
                      </span>
                    </div>

                    <MdExpandMore
                      size={18}
                      className={`shrink-0 text-[#9DB3C9] transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      id={`exercises-${reg.id}`}
                      className="bg-[#F2F4F6] px-5 py-4"
                    >
                      {state?.loading ? (
                        <p className="text-[14px] text-[#9DB3C9] py-3">
                          در حال بارگذاری تمرین‌ها...
                        </p>
                      ) : state?.error ? (
                        <p className="text-[14px] text-[#BA1A1A] py-3">
                          خطا در دریافت تمرین‌ها
                        </p>
                      ) : state?.items?.length ? (
                        <ul className="space-y-2">
                          {state.items.map((exercise) => (
                            <li key={exercise.id}>
                              <Link
                                href={`/Dashboard/Fanoos/Tamrin/${exercise.id}`}
                                className="bg-white rounded-[10px] px-4 py-3 flex items-center gap-4 hover:bg-[#FAFCFF] transition-colors"
                              >
                                <span className="text-[15px] text-[#191C1E] min-w-0 flex-1 truncate">
                                  {exercise.title}
                                </span>
                                <span className="flex items-center gap-1.5 text-[12.5px] text-[#424753] shrink-0 whitespace-nowrap">
                                  <MdEvent
                                    size={13}
                                    className="text-[#9DB3C9]"
                                  />
                                  {faDate(exercise.due_date)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[14px] text-[#9DB3C9] py-3">
                          تمرینی برای این کلاس ثبت نشده است
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
