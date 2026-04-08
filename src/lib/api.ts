import axios from "axios";
import type { TokenResponse, User } from "@/types/post";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: localStorage에 저장된 토큰이 있으면 자동 첨부
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// --------------------
// Auth API
// --------------------

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await api.post<TokenResponse>("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get<User>("/auth/me");
  return res.data;
};

// --------------------
// Posts API
// --------------------

export const fetchPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

export const fetchPost = async (id: string) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

// author 제거
export const createPost = async (data: {
  title: string;
  content: string;
}) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLike = async (id: string) => {
  const res = await api.patch(`/posts/${id}/like`);
  return res.data;
};

// --------------------
// Comments API
// --------------------

// author 제거
export const createComment = async (
  postId: string,
  data: {
    content: string;
  }
) => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

export default api;