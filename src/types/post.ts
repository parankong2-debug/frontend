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
    commentCount: number; // 🔥 중요 (comments 아님)
  }
  
  // 글 상세에서 쓰는 타입
  export interface PostDetail {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    likes: number;
    comments: Comment[]; // 🔥 여기서는 배열 있음
  }