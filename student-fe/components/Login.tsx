"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);


  const VALID_USERNAME = "123456789";
  const VALID_PASSWORD = "123456789";

  const REDIRECT_TO = "/Dashboard";

  const handleLogin = () => {
    const u = username.trim();
    const p = password.trim();


    if (!u || !p) {
      if (!u && !p) {
        setError("لطفا نام کاربری و رمز عبور را وارد کنید.");

      } else if (!u) {
        setError("لطفاً نام کاربری را وارد کنید.");

      } else {
        setError("لطفا رمز عبور را وارد کنید.");

      }
      return;
    }
    if (u !== VALID_USERNAME) {
      setError("نام کاربری اشتباه است.");
      return;
    } else if (p !== VALID_PASSWORD) {
      setError("رمزعبور اشتباه است");
      return;
    }


    setError(null);
    localStorage.setItem("username", u);
    router.push(REDIRECT_TO);
  };

  return (
    <main
      dir="ltr"
      className="min-h-screen w-full  bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat"
    >
      <div
        className="
          min-h-screen w-full flex items-center justify-end pr-24
          max-[480px]:justify-center
          max-[480px]:px-4
        "
      >
        <section
          dir="rtl"
          className="
            w-[450px] rounded-[14px] bg-white
            shadow-[0_20px_50px_rgba(0,0,0,0.25)]
            px-12 pt-14 pb-14

            max-[480px]:w-full
            max-[480px]:px-6
            max-[480px]:pt-10
            max-[480px]:pb-10
          "
        >
          <div className="flex flex-row-reverse items-center gap-4 justify-center max-[480px]:hidden">
            <img src="/Group 237546.svg" alt="" />
            <h3 className="text-[26px] font-bold text-[#000000]">پلتفرم امین</h3>
          </div>

          <h1
            className="
              mt-5 text-start text-[40px] font-bold text-[#4A4543]
              max-[480px]:mt-0
              max-[480px]:text-[32px]
            "
          >
            خوش آمدید!
          </h1>

          <p className="text-start text-[16px] text-[#808080]">
            لطفا اطلاعات خود را وارد کنید.
          </p>

          {error && (
            <div className="mt-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
              {error}
            </div>
          )}

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-2">
              <label className="block font-[600] text-[14px] text-[#4A4543]">
                نام کاربری
              </label>
              <input
                value={username}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                  setUsername(onlyNumbers);
                  if (error) setError(null);
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="نام کاربری خود را وارد کنید."
                className="w-full text-[#808080] rounded-[8px] border border-[#DADADA] px-4 py-3 text-[14px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            <div className="space-y-2">
              <label className="block text-[14px] font-[600] text-[#4A4543]">
                رمز عبور
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                    setPassword(onlyNumbers);
                    if (error) setError(null);
                  }}
                  type={showPass ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="رمز عبور خود را وارد کنید."
                  className="w-full text-[#808080] rounded-[8px] border border-[#DADADA] px-4 py-3 text-[14px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />


                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                >
                  {showPass ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                      <path d="M9.88 5.09A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a18.16 18.16 0 0 1-3.16 4.19" />
                      <path d="M6.61 6.61A18.12 18.12 0 0 0 2 12s3 7 10 7a10.45 10.45 0 0 0 2.12-.21" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[14px] font-[600] text-[#4A4543]">
                <span>مرا به خاطر بسپار</span>
                <input
                  type="checkbox"
                  className="
                    h-4 w-4
                    appearance-none
                    rounded
                    border border-[#DADADA]
                    checked:bg-[#125593]
                    checked:border-[#125593]
                    relative
                    cursor-pointer
                    after:content-['✔']
                    after:absolute
                    after:text-white
                    after:text-[10px]
                    after:top-1/2
                    after:left-1/2
                    after:-translate-x-1/2
                    after:-translate-y-1/2
                    after:hidden
                    checked:after:block
                  "
                />
              </label>

              <a
                href="#"
                className="text-[#125593] text-[14px] font-[600] hover:underline"
              >
                فراموشی رمز
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-[6px] bg-[#125593] py-3 text-[16px] font-[600] text-white hover:brightness-110"
            >
              ورود
            </button>
          </form>

          <div dir="ltr" className="hidden max-[480px]:flex mt-10 justify-center">
            <div className="flex items-center gap-3">
              <img src="/Group 237546.svg" alt="" />
              <span className="text-[26px] font-bold text-[#000000]">
                پلتفرم امین
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
