"use client";

import { formatKoreanDateTime } from "@/lib/date";
import { Comment } from "@/types/post";
import { useAuthStore } from "@/store/authStore";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  deleting?: boolean;
}

export default function CommentItem({
  comment,
  onDelete,
  deleting = false,
}: CommentItemProps) {
  const user = useAuthStore((state) => state.user);
  const canDelete = !!onDelete && !!user && user.username === comment.author;

  const createdAtLabel = formatKoreanDateTime(comment.createdAt);

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">
          {comment.author}
        </span>
        <div className="flex items-center gap-2">
          <time dateTime={comment.createdAt} className="text-xs text-slate-400">
            {createdAtLabel}
          </time>
          {canDelete && (
            <button
              type="button"
              className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => onDelete(comment.id)}
              disabled={deleting}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
        {comment.content}
      </p>
    </article>
  );
}
