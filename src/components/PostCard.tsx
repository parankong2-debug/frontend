"use client";

import { PostBase } from "@/types/post";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: PostBase;
}

function previewText(content: string, maxLen = 140) {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen).trim()}…`;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const createdAtLabel = (() => {
    const date = new Date(post.createdAt);
    return Number.isNaN(date.getTime())
      ? post.createdAt
      : date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  })();

  const handleClick = () => {
    router.push(`/community/${post.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex h-full w-full flex-col border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all duration-300 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-lg"
    >
      <h2 className="font-serif-brand text-lg font-medium leading-snug tracking-wide text-neutral-900 transition-colors group-hover:text-neutral-700">
        {post.title}
      </h2>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-500">
        {previewText(post.content)}
      </p>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-neutral-100 pt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
        <span className="max-w-[55%] truncate text-neutral-600">{post.author}</span>
        <time dateTime={post.createdAt} className="shrink-0 tabular-nums">
          {createdAtLabel}
        </time>
      </div>
    </button>
  );
}
