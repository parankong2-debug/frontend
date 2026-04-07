export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface PostBase {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

// GET /posts (목록 조회) 응답 아이템
export interface PostListItem extends PostBase {
  commentCount: number;
}

// GET /posts/:id (상세 조회) 응답
export interface PostDetail extends PostBase {
  comments: Comment[];
}

// 기존 코드 호환용 (상세 타입과 동일)
export type Post = PostDetail;
