export type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  isOwn: boolean;
};

export type Submission = {
  id: number;
  studentName: string;
  fileName: string;
  submittedAt: string;
  score?: number; // Teacher's grade (e.g., out of 20)
};

export type Exercise = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  teacherFile?: { name: string; size: string };
  submission?: { fileName: string; submittedAt: string }; // For student
  submissions?: Submission[]; // For teacher
  comments: Comment[];
};

export type Subject = {
  id: number;
  name: string;
  teacher: string;
  color: string;
};

export const SUBJECTS: Subject[] = [
  { id: 1, name: "ریاضی", teacher: "آقای احمدی", color: "#3E66A8" },
  { id: 2, name: "فیزیک", teacher: "خانم کریمی", color: "#5B8AC4" },
  { id: 3, name: "شیمی", teacher: "آقای رضایی", color: "#4A7BB8" },
  { id: 4, name: "ادبیات", teacher: "خانم موسوی", color: "#6495C4" },
  { id: 5, name: "زبان انگلیسی", teacher: "آقای صادقی", color: "#2D5A9E" },
];

export const INITIAL_EXERCISES: Record<number, Exercise[]> = {
  1: [
    {
      id: 1,
      title: "فصل ۲ — معادلات",
      description:
        "صفحه ۴۵ تا ۵۰ را حل کنید. مسائل ۱ تا ۸ الزامی و ۹ تا ۱۲ اختیاری است.",
      dueDate: "۱۴۰۳/۰۵/۰۵",
      teacherFile: { name: "math_ex_ch2.pdf", size: "۱.۱ مگابایت" },
      submission: { fileName: "math_hw.pdf", submittedAt: "۱۴۰۳/۰۵/۰۳" },
      submissions: [
        {
          id: 101,
          studentName: "علی رضایی",
          fileName: "math_hw_ali.pdf",
          submittedAt: "۱۴۰۳/۰۵/۰۳",
          score: 18.5,
        },
        {
          id: 102,
          studentName: "سارا حسینی",
          fileName: "math_hw_sara.pdf",
          submittedAt: "۱۴۰۳/۰۵/۰۴",
        },
      ],
      comments: [
        {
          id: 1,
          author: "من",
          text: "استاد مسئله ۷ در فایل خوانا نیست.",
          date: "۱۴۰۳/۰۴/۳۰",
          isOwn: true,
        },
        {
          id: 2,
          author: "آقای احمدی",
          text: "فایل جدید آپلود شد، مشکل برطرف است.",
          date: "۱۴۰۳/۰۵/۰۱",
          isOwn: false,
        },
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
      description:
        "مسئله‌های انتهای فصل ۳ را حل کنید. مسائل ۱۱، ۱۳ و ۱۵ الزامی است.",
      dueDate: "۱۴۰۳/۰۵/۰۷",
      teacherFile: { name: "kinematics_hw.pdf", size: "۱.۵ مگابایت" },
      submission: undefined,
      submissions: [
        {
          id: 103,
          studentName: "مهدی علوی",
          fileName: "kinematics_v1.pdf",
          submittedAt: "۱۴۰۳/۰۵/۰۲",
        },
      ],
      comments: [
        {
          id: 3,
          author: "من",
          text: "فایل تمرین باز نمی‌شه.",
          date: "۱۴۰۳/۰۵/۰۱",
          isOwn: true,
        },
      ],
    },
  ],
};

export const faNum = (n: number | string) =>
  new Intl.NumberFormat("fa-IR").format(Number(n) || 0);

export const today = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
