"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createComment, deletePost, fetchPost, toggleLike } from "@/lib/api";
import { Comment, PostDetail } from "@/types/post";
import CommentItem from "@/components/CommentItem";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const loadPost = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPost(postId);
      setPost(data);
    } catch (e) {
      setPost(null);
      setError("게시글을 불러오지 못했습니다.");
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
    const date = new Date(post.createdAt);
    return Number.isNaN(date.getTime())
      ? post.createdAt
      : date.toLocaleString("ko-KR");
  })();

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
    const author = commentAuthor.trim();
    if (!content || !author) {
      alert("댓글 작성자와 내용을 입력해주세요.");
      return;
    }

    setIsCommenting(true);
    try {
      const newComment = (await createComment(postId, {
        content,
        author,
      })) as Comment;
      setPost((prev) =>
        prev ? { ...prev, comments: [...(prev.comments ?? []), newComment] } : prev
      );
      setCommentContent("");
    } catch {
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!postId || isDeleting) return;
    const ok = confirm("정말 삭제할까요?");
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

  return (
    <div>
      <h1>게시글 상세</h1>
      {loading ? (
        <p>로딩 중…</p>
      ) : error ? (
        <p>{error}</p>
      ) : !post ? (
        <p>게시글을 찾을 수 없습니다.</p>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

          <div>
            <div>작성자: {post.author}</div>
            <div>작성일: {createdAtLabel}</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="button" onClick={handleLike} disabled={isLiking}>
              {isLiking ? "처리 중…" : `좋아요 ${post.likes}`}
            </button>
            <button type="button" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중…" : "삭제"}
            </button>
          </div>

          <section>
            <h3>댓글</h3>
            <div>
              {post.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <input
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="댓글 작성자"
              />
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요"
              />
              <button
                type="button"
                onClick={handleComment}
                disabled={isCommenting || !commentAuthor.trim() || !commentContent.trim()}
              >
                {isCommenting ? "작성 중…" : "댓글 작성"}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
