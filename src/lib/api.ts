import axios from "axios";
import { TokenResponse, User } from "@/types/auth";
import { PostDetail, PostListItem } from "@/types/post";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://study-community-backend.vercel.app/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type ApiId = number | string;

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}

export const register = async (
  data: RegisterRequest
): Promise<TokenResponse> => {
  const res = await api.post<TokenResponse>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/auth/me");
  return res.data;
};

export const fetchPosts = async (): Promise<PostListItem[]> => {
  const res = await api.get<PostListItem[]>("/posts");
  return res.data;
};

export const fetchPost = async (id: ApiId): Promise<PostDetail> => {
  const res = await api.get<PostDetail>(`/posts/${id}`);
  return res.data;
};

export const createPost = async (data: CreatePostRequest) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const deletePost = async (id: ApiId) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLike = async (id: ApiId) => {
  const res = await api.patch<PostDetail>(`/posts/${id}/like`);
  return res.data;
};

export const createComment = async (postId: ApiId, data: CreateCommentRequest) => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};

export const deleteComment = async (commentId: ApiId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};
