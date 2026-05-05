"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  createComment,
  deleteComment,
  deletePost,
  fetchPost,
  toggleLike,
} from "@/lib/api";
import { Comment, PostDetail } from "@/types/post";
import CommentItem from "@/components/CommentItem";
import { formatKoreanDateTime } from "@/lib/date";
import { useAuthStore } from "@/store/authStore";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [commentContent, setCommentContent] = useState("");
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const loadPost = async () => {
    if (!postId) {
      setPost(null);
      setError("잘못된 게시글 경로입니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchPost(postId);
      setPost(data);
    } catch (e) {
      setPost(null);
      if (e instanceof AxiosError && e.response?.status === 404) {
        setError("존재하지 않는 게시글입니다.");
      } else {
        setError("게시글을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const createdAtLabel = (() => {
    if (!post) return "";
    return formatKoreanDateTime(post.createdAt);
  })();

  const canDeletePost = !!post && !!user && post.author === user.username;

  const handleLike = async () => {
    if (!postId || !post || isLiking) return;

    setIsLiking(true);
    try {
      const updated = await toggleLike(postId);
      setPost(updated);
    } catch {
      alert("좋아요 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!postId || !post || isCommenting) return;

    const content = commentContent.trim();
    if (!content) {
      setCommentError("댓글 내용을 입력해주세요.");
      return;
    }

    setCommentError("");
    setIsCommenting(true);
    try {
      const newComment = (await createComment(postId, { content })) as Comment;
      setPost((prev) =>
        prev ? { ...prev, comments: [...(prev.comments ?? []), newComment] } : prev
      );
      setCommentContent("");
    } catch {
      setCommentError("댓글 작성에 실패했습니다.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!postId || isDeleting) return;
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deletePost(postId);
      router.push("/community");
    } catch {
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!post || deletingCommentId) return;
    const ok = confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((comment) => comment.id !== commentId),
            }
          : prev
      );
    } catch {
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <button
          type="button"
          onClick={() => router.push("/community")}
          className="mb-6 inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          ← 목록으로
        </button>

        {loading ? (
          <p className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            로딩 중...
          </p>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-rose-600">{error}</p>
            <Link
              href="/community"
              className="mt-4 inline-flex rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
            >
              목록으로 돌아가기
            </Link>
          </div>
        ) : !post ? (
          <p className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            게시글을 찾을 수 없습니다.
          </p>
        ) : (
          <div className="space-y-6">
            <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.07)] sm:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {post.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>작성자 {post.author}</span>
                <span className="text-slate-300">|</span>
                <time dateTime={post.createdAt}>{createdAtLabel}</time>
              </div>

              <div className="my-6 h-px bg-slate-100" />

              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                {post.content}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={isLiking}
                  className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(79,70,229,0.25)] transition-all hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLiking ? "처리 중..." : `Like ${post.likes}`}
                </button>
                {canDeletePost && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isDeleting ? "삭제 중..." : "삭제"}
                  </button>
                )}
              </div>
            </article>

            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.07)] sm:p-8">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  댓글
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  로그인한 사용자 이름으로 댓글이 작성됩니다.
                </p>
              </div>

              {isLoggedIn ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="min-h-[150px] w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                  {commentError && (
                    <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                      {commentError}
                    </p>
                  )}
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleComment}
                      disabled={isCommenting || !commentContent.trim()}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isCommenting ? "작성 중..." : "댓글 작성"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center">
                  <p className="text-sm text-slate-500">
                    로그인 후 댓글을 작성할 수 있습니다.
                  </p>
                  <Link
                    href="/login"
                    className="mt-3 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                  >
                    로그인
                  </Link>
                </div>
              )}

              <div className="mt-5 space-y-3">
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onDelete={handleCommentDelete}
                      deleting={deletingCommentId === comment.id}
                    />
                  ))
                ) : (
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    아직 댓글이 없습니다. 첫 댓글을 작성해보세요.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
