"use client";

import { getAccessToken } from "@/utils/tokens";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PAGES = ["sign-in"];
export default function AuthProtector() {
  const isPublic = (url: string) => PUBLIC_PAGES.includes(url);
  const accessTokenExists = () => !!getAccessToken();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isPublic(pathname) && !accessTokenExists()) {
      router.push("sign-in");
    }
  }, [pathname, router]);

  return <></>;
}
