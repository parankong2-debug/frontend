"use client";

import PostCard from "@/components/PostCard";
import { getKoreanDateKey, parseUtcDate } from "@/lib/date";
import { PostBase } from "@/types/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const POSTS_PER_PAGE = 6;

export default function BoardPage({
  posts,
  loading,
  error,
}: {
  posts: (PostBase & { commentCount?: number })[];
  loading: boolean;
  error: string | null;
}) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aTime = parseUtcDate(a.createdAt).getTime();
      const bTime = parseUtcDate(b.createdAt).getTime();
      return bTime - aTime;
    });
  }, [posts]);

  const visiblePosts = sortedPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < sortedPosts.length;
  const todayKey = getKoreanDateKey(new Date());
  const todayPostCount = posts.filter((post) => {
    const createdAt = parseUtcDate(post.createdAt);
    return (
      !Number.isNaN(createdAt.getTime()) &&
      getKoreanDateKey(createdAt) === todayKey
    );
  }).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.1),_transparent_42%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Community Platform
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Community Board
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
              생각을 나누고, 연결되는 공간
              가볍게 질문하고, 경험을 공유해보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/community/write"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(79,70,229,0.28)] transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                글 작성하기
              </Link>
              <button
                type="button"
                onClick={() => router.push("/community")}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                둘러보기
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <p className="text-xs text-slate-400">ALL POSTS</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{posts.length}</p>
              <p className="mt-1 text-sm text-slate-500">전체 게시글 수</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-[0_10px_30px_rgba(99,102,241,0.12)]">
              <p className="text-xs text-indigo-500">TODAY POSTS</p>
              <p className="mt-2 text-2xl font-semibold text-indigo-700">
                {todayPostCount}
              </p>
              <p className="mt-1 text-sm text-indigo-600/80">오늘 등록된 글</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:col-span-2">
              <p className="text-xs text-slate-400">PREVIEW</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                질문하고, 답하고, 경험을 나누는 공간입니다. <br />
                서로의 이야기를 통해 새로운 연결이 만들어집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Latest Posts</h2>
            <p className="mt-1 text-sm text-slate-500">커뮤니티 최신 글을 빠르게 확인하세요.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/community/write")}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            + 새 글 작성
          </button>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            게시글을 불러오는 중입니다...
          </p>
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
            {error}
          </p>
        ) : sortedPosts.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>

            {hasMorePosts ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) => count + POSTS_PER_PAGE)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-indigo-600"
                  aria-label="+ 더보기"
                >
                  + 더보기
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            아직 게시글이 없습니다. 첫 글을 작성해보세요.
          </p>
        )}
      </section>

      <footer id="about" className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-slate-500 sm:px-8">
          <p className="font-medium text-slate-700">Water Forest</p>
          <p>질문하고 경험을 나누는 커뮤니티 공간</p>
        </div>
      </footer>
    </div>
  );
}
