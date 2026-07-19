"use client";
import { SWRConfig } from "swr";
import { fetcher } from "@/libs/hooks/apis/fetcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // tune to your needs
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
