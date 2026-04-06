import type { Metadata } from "next";
import "./globals.css";
import "pretendard/dist/web/static/pretendard.css";
import { Noto_Serif_KR } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Community | Field",
  description: "커뮤니티 게시판",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", notoSerifKr.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
