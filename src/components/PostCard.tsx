"use client";

import { useRouter } from "next/navigation";
import { PostListItem } from "@/types/post";

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "16px",
  cursor: "pointer",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "28px",
  fontWeight: 700,
  color: "#111827",
};

const metaStyle: React.CSSProperties = {
  margin: "0 0 10px 0",
  color: "#374151",
  fontSize: "18px",
};

const dateStyle: React.CSSProperties = {
  margin: "0 0 18px 0",
  color: "#6b7280",
  fontSize: "18px",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  color: "#374151",
  fontSize: "18px",
};

export default function PostCard({ post }: { post: PostListItem }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      style={cardStyle}
    >
      <h3 style={titleStyle}>{post.title}</h3>
      <p style={metaStyle}>작성자: {post.author}</p>
      <p style={dateStyle}>작성일: {post.createdAt}</p>
      <div style={infoRowStyle}>
        <span>👍 {post.likes}</span>
        <span>💬 {post.commentCount}</span>
      </div>
    </div>
  );
}