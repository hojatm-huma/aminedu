export type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  isOwn: boolean;
};

export const faNum = (n: number | string) =>
  new Intl.NumberFormat("fa-IR").format(Number(n) || 0);

export const today = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
