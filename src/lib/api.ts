import axios from "axios";
import { PostDetail, PostListItem } from "@/types/post";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export type ApiId = number | string;
export type RequestBody = Record<string, unknown>;

// If an external API base URL isn't configured, fall back to Next.js route handlers under `/api`.
const withApiPrefix = (path: string) => (baseURL ? path : `/api${path}`);

export const fetchPosts = async (): Promise<PostListItem[]> => {
  const res = await api.get<PostListItem[]>(withApiPrefix("/posts"));
  return res.data;
};

export const fetchPost = async (id: ApiId): Promise<PostDetail> => {
  const res = await api.get<PostDetail>(withApiPrefix(`/posts/${id}`));
  return res.data;
};

export const createPost = async (data: RequestBody) => {
  const res = await api.post(withApiPrefix("/posts"), data);
  return res.data;
};

export const deletePost = async (id: ApiId) => {
  const res = await api.delete(withApiPrefix(`/posts/${id}`));
  return res.data;
};

export const toggleLike = async (id: ApiId) => {
  const res = await api.patch(withApiPrefix(`/posts/${id}/like`));
  return res.data;
};

export const createComment = async (postId: ApiId, data: RequestBody) => {
  const res = await api.post(withApiPrefix(`/posts/${postId}/comments`), data);
  return res.data;
};

export const deleteComment = async (commentId: ApiId) => {
  const res = await api.delete(withApiPrefix(`/comments/${commentId}`));
  return res.data;
};