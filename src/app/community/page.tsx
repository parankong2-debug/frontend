"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  commentCount: number;
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

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: 700,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
  fontSize: "15px",
};

const writeButtonStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const messageCardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  color: "#374151",
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h1 style={titleStyle}>커뮤니티</h1>
            <p style={subtitleStyle}>자유롭게 글을 작성하고 의견을 나눠보세요.</p>
          </div>

          <Link href="/community/write">
            <button type="button" style={writeButtonStyle}>
              글 작성
            </button>
          </Link>
        </div>

        {loading && <div style={messageCardStyle}>로딩 중...</div>}

        {!loading && error && (
          <div style={{ ...messageCardStyle, color: "#dc2626" }}>{error}</div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={messageCardStyle}>게시글이 없습니다.</div>
        )}

        {!loading &&
          !error &&
          posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}