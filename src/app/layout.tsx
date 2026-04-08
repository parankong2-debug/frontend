"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}