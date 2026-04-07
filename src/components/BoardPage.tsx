"use client";

import PostCard from "@/components/PostCard";
import { PostBase } from "@/types/post";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "discussion", label: "DISCUSSION" },
  { id: "qna", label: "Q&A" },
  { id: "tips", label: "TIPS" },
] as const;

export default function BoardPage({
  posts,
  loading,
  error,
}: {
  posts: PostBase[];
  loading: boolean;
  error: string | null;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:px-10">
          <Link
            href="/community"
            className="font-serif-brand shrink-0 text-sm font-medium tracking-[0.35em] text-neutral-800"
          >
            FIELD
          </Link>

          <nav
            className="flex flex-1 flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium tracking-[0.2em] text-neutral-600 sm:justify-center"
            aria-label="Main"
          >
            <Link href="/community" className="transition-colors hover:text-neutral-900">
              BOARD
            </Link>
            <Link href="/community/write" className="transition-colors hover:text-neutral-900">
              WRITE
            </Link>
            <Link href="#about" className="transition-colors hover:text-neutral-900">
              ABOUT
            </Link>
          </nav>

          <div className="flex items-center justify-center gap-6 text-xs tracking-[0.15em] text-neutral-500 sm:justify-end">
            <button type="button" className="transition-colors hover:text-neutral-900">
              LOG IN
            </button>
            <span className="text-neutral-300" aria-hidden>
              /
            </span>
            <button type="button" className="transition-colors hover:text-neutral-900">
              SIGN UP
            </button>
          </div>
        </div>
      </header>

      <section
        className="border-b border-neutral-200/80 bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.045) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.45em] text-neutral-400">
            Journal &amp; Stories
          </p>
          <h1 className="font-serif-brand text-4xl font-normal tracking-[0.08em] text-neutral-900 md:text-5xl lg:text-6xl">
            COMMUNITY
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neutral-500">
            질문과 경험을 나누는 공간입니다. 여백 속에서 천천히 읽고 기록해 보세요.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-14 md:flex-row md:gap-16 md:px-10 md:py-20">
        <aside className="shrink-0 md:w-28" aria-label="카테고리">
          <ul className="flex flex-row gap-8 md:flex-col md:gap-6">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-400">
                  {cat.label}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-10 flex flex-col gap-2 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif-brand text-2xl font-normal tracking-wide text-neutral-900">
                Board
              </h2>
              <p className="mt-1 text-xs text-neutral-500">최근 게시글</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/community/write")}
              className="self-start border border-neutral-300 bg-white px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white md:self-auto"
            >
              New post
            </button>
          </div>

          {loading ? (
            <p className="py-16 text-center text-sm text-neutral-500">로딩 중…</p>
          ) : error ? (
            <p className="py-16 text-center text-sm text-red-600">{error}</p>
          ) : posts.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id} className="min-h-0">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-16 text-center text-sm text-neutral-500">아직 게시글이 없습니다.</p>
          )}
        </div>
      </div>

      <footer id="about" className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
          <p className="text-center text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            © {new Date().getFullYear()} Field Community. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
