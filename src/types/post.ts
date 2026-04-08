export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// 글 목록에서 쓰는 타입
export interface PostListItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  commentCount: number;
}

// 글 상세에서 쓰는 타입
export interface PostDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}