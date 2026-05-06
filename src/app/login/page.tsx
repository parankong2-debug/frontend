"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface ErrorResponse {
  detail?: {
    error?: string;
  };
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse | undefined;
    return (
      data?.detail?.error ?? "이메일 또는 비밀번호가 올바르지 않습니다."
    );
  }

  return "이메일 또는 비밀번호가 올바르지 않습니다.";
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedEmail = email.trim();
  const canSubmit = !!trimmedEmail && !!password && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await login({
        email: trimmedEmail,
        password,
      });

      setAuth(data.access_token, data.user);
      router.push("/community");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <main className="mx-auto flex w-full max-w-md flex-col px-5 py-10 sm:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.07)] sm:px-7">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              로그인
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              계정으로 로그인하고 커뮤니티에 참여하세요.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
            >
              회원가입
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
