"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentItem from "@/components/CommentItem";
import {
  fetchPost,
  toggleLike,
  createComment,
  deleteComment,
  deletePost,
} from "@/lib/api";

type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

type PostDetail = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  padding: "40px 20px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
};

const backButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  backgroundColor: "white",
  color: "#111827",
  cursor: "pointer",
  marginBottom: "16px",
  fontSize: "14px",
  fontWeight: 500,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "28px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e5e7eb",
  marginBottom: "16px",
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "16px",
  fontSize: "32px",
  fontWeight: 700,
  color: "#111827",
};

const metaStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  color: "#374151",
  fontSize: "15px",
};

const contentStyle: React.CSSProperties = {
  marginTop: "20px",
  marginBottom: "20px",
  color: "#111827",
  fontSize: "16px",
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  marginBottom: "20px",
  color: "#374151",
  fontSize: "15px",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#dc2626",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const sectionTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "16px",
  fontSize: "22px",
  fontWeight: 700,
  color: "#111827",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#374151",
  fontSize: "14px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: "16px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "140px",
  resize: "vertical",
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchPost(id);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const updatedPost = await toggleLike(id);
      setPost(updatedPost);
    } catch (err) {
      console.error(err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentAuthor.trim() || !comment.trim()) {
      alert("작성자와 댓글 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await createComment(id, {
        author: commentAuthor,
        content: comment,
      });

      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...prev.comments, newComment],
        };
      });

      setCommentAuthor("");
      setComment("");
    } catch (err) {
      console.error(err);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const ok = confirm("정말 댓글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteComment(commentId);

      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId),
        };
      });
    } catch (err) {
      console.error(err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleDeletePost = async () => {
    const ok = confirm("정말 게시글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deletePost(id);
      alert("게시글이 삭제되었습니다.");
      router.push("/community");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <p>{error || "게시글을 찾을 수 없습니다."}</p>
            <button
              type="button"
              onClick={() => router.push("/community")}
              style={backButtonStyle}
            >
              ← 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          onClick={() => router.push("/community")}
          style={backButtonStyle}
        >
          ← 목록으로
        </button>

        <div style={cardStyle}>
          <h1 style={titleStyle}>{post.title}</h1>
          <p style={metaStyle}>작성자: {post.author}</p>
          <p style={metaStyle}>작성일: {post.createdAt}</p>

          <div style={contentStyle}>{post.content}</div>

          <div style={infoRowStyle}>
            <span>👍 좋아요 {post.likes}</span>
            <span>💬 댓글 {post.comments.length}</span>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" onClick={handleLike} style={primaryButtonStyle}>
              좋아요 누르기
            </button>
            <button
              type="button"
              onClick={handleDeletePost}
              style={dangerButtonStyle}
            >
              게시글 삭제
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>댓글</h2>

          {post.comments.length > 0 ? (
            post.comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                onDelete={() => handleDeleteComment(c.id)}
              />
            ))
          ) : (
            <p>아직 댓글이 없습니다.</p>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>댓글 작성</h2>

          <label style={labelStyle}>작성자</label>
          <input
            type="text"
            placeholder="작성자 이름"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>내용</label>
          <textarea
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={textareaStyle}
          />

          <button
            type="button"
            onClick={handleCommentSubmit}
            disabled={submittingComment}
            style={primaryButtonStyle}
          >
            {submittingComment ? "댓글 작성 중..." : "댓글 작성"}
          </button>
        </div>
      </div>
    </div>
  );
}