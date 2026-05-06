"use client";

import { formatKoreanDate } from "@/lib/date";
import { PostBase } from "@/types/post";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: PostBase & { commentCount?: number };
}

function previewText(content: string, maxLen = 140) {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen).trim()}…`;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const createdAtLabel = formatKoreanDate(post.createdAt);

  const handleClick = () => {
    router.push(`/community/${post.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_40px_rgba(79,70,229,0.15)]"
    >
      <h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
        {post.title}
      </h2>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
        {previewText(post.content)}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-slate-700">{post.author}</div>
          <time dateTime={post.createdAt} className="text-xs text-slate-400 tabular-nums">
            {createdAtLabel}
          </time>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-600">
            Like {post.likes}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
            Comments {post.commentCount ?? 0}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center text-xs font-medium text-slate-400 transition-colors group-hover:text-indigo-500">
        Read more -&gt;
      </div>
    </button>
  );
}
