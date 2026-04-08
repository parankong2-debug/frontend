"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

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
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "32px",
  fontWeight: 700,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "24px",
  color: "#6b7280",
  fontSize: "15px",
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
  marginBottom: "18px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "220px",
  resize: "vertical",
};

const submitButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

export default function WritePage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      await createPost({
        title,
        content,
      });

      router.push("/community");
    } catch (err) {
      console.error(err);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
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
          <h1 style={titleStyle}>글 작성</h1>
          <p style={subtitleStyle}>새 게시글을 작성하고 커뮤니티와 공유해보세요.</p>

          <label style={labelStyle}>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={textareaStyle}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={submitButtonStyle}
          >
            {submitting ? "작성 중..." : "작성"}
          </button>
        </div>
      </div>
    </div>
  );
}