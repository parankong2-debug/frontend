"use client";

import { Comment } from "@/types/post";

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
  const createdAtLabel = (() => {
    const date = new Date(comment.createdAt);
    return Number.isNaN(date.getTime())
      ? comment.createdAt
      : date.toLocaleString("ko-KR");
  })();

  return (
    <article className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{comment.author}</span>
        <div className="flex items-center gap-2">
          <time
            dateTime={comment.createdAt}
            className="text-xs text-muted-foreground"
          >
            {createdAtLabel}
          </time>
          <button
            type="button"
            className="text-xs text-destructive underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => onDelete?.(comment.id)}
            disabled={deleting}
          >
            {deleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
        {comment.content}
      </p>
    </article>
  );
}
