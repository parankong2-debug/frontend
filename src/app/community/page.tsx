"use client";

import BoardPage from "@/components/BoardPage";
import { fetchPosts } from "@/lib/api";
import { PostBase } from "@/types/post";
import { useCallback, useEffect, useState } from "react";

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("게시글을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();

    // When navigating back from write/detail, the page can be restored from cache.
    // Refetch on focus/visibility to keep the list fresh.
    const onFocus = () => void loadPosts();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void loadPosts();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loadPosts]);

  return <BoardPage posts={posts} loading={loading} error={error} />;
}
