import { initialPosts } from "@/lib/mockData";
import { Comment, Post } from "@/types/post";

type GlobalWithPosts = typeof globalThis & {
  __communityPosts?: Post[];
};

export const getPostStore = (): Post[] => {
  const g = globalThis as GlobalWithPosts;
  if (!g.__communityPosts) {
    g.__communityPosts = [...initialPosts];
  }
  return g.__communityPosts;
};

export const findPost = (id: string): Post | undefined => {
  return getPostStore().find((p) => p.id === id);
};

export const deletePostById = (id: string): boolean => {
  const store = getPostStore();
  const idx = store.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  store.splice(idx, 1);
  return true;
};

export const toggleLikeById = (id: string): Post | undefined => {
  const post = findPost(id);
  if (!post) return undefined;
  post.likes = (post.likes ?? 0) + 1;
  return post;
};

export const addCommentToPost = (
  postId: string,
  content: string,
  author: string
): Comment | undefined => {
  const post = findPost(postId);
  if (!post) return undefined;
  const newComment: Comment = {
    id: Date.now().toString(),
    content,
    author,
    createdAt: new Date().toISOString(),
  };
  post.comments = [...(post.comments ?? []), newComment];
  return newComment;
};

export const deleteCommentById = (commentId: string): boolean => {
  const store = getPostStore();
  for (const post of store) {
    const idx = (post.comments ?? []).findIndex((c) => c.id === commentId);
    if (idx >= 0) {
      post.comments.splice(idx, 1);
      return true;
    }
  }
  return false;
};

