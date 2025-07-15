"use client";

import "./globals.css";

import * as React from "react";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProtector from "./components/auth_protector";
import dynamic from "next/dynamic";

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const queryClient = new QueryClient();

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body>
        <CssBaseline />
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <AuthProtector />
              {children}
            </QueryClientProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });