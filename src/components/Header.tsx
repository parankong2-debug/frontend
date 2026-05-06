"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initialize = useAuthStore((state) => state.initialize);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-slate-900 transition-colors hover:text-indigo-600"
        >
          Water Forest
        </Link>

        <nav className="hidden items-center gap-12 text-sm text-slate-600 md:flex">
          <Link href="/community" className="transition-colors hover:text-slate-900">
            Community
          </Link>
          <Link href="/reservation" className="transition-colors hover:text-slate-900">
            Studyroom Reservation
          </Link>
          <Link href="/community/write" className="transition-colors hover:text-slate-900">
            Write
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {user.username}님
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-500"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
