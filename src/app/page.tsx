"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          커뮤니티에 오신 것을 환영합니다
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          버튼을 눌러 커뮤니티 페이지로 이동하세요.
        </p>
        <Link
          href="/community"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          커뮤니티 페이지로 이동
        </Link>
      </div>
    </main>
  );
}
