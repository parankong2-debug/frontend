# 커뮤니티 게시판 API 명세서

## Base URL

```
http://localhost:8000/api
```

---

## 타입 정의

### PostSummary (게시글 목록용)

```ts
interface PostSummary {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  commentCount: number;
}
```

### Post (게시글 상세용)

```ts
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}
```

### Comment

```ts
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}
```

---

## 게시글 API

### 1. 게시글 목록 조회

```
GET /posts
```

**Response** `200 OK`

```json
[
  {
    "id": "1",
    "title": "커뮤니티에 오신 것을 환영합니다!",
    "content": "안녕하세요! 이곳은 자유롭게 소통하는 커뮤니티입니다.",
    "author": "관리자",
    "createdAt": "2026-03-20T09:00:00",
    "likes": 5,
    "commentCount": 2
  }
]
```

---

### 2. 게시글 상세 조회

```
GET /posts/:id
```

**Response** `200 OK`

```json
{
  "id": "1",
  "title": "커뮤니티에 오신 것을 환영합니다!",
  "content": "안녕하세요! 이곳은 자유롭게 소통하는 커뮤니티입니다.",
  "author": "관리자",
  "createdAt": "2026-03-20T09:00:00",
  "likes": 5,
  "comments": [
    {
      "id": "c1",
      "content": "반갑습니다!",
      "author": "수빈",
      "createdAt": "2026-03-20T10:30:00"
    }
  ]
}
```

**Error** `404 Not Found`

```json
{
  "error": "게시글을 찾을 수 없습니다."
}
```

---

### 3. 게시글 작성

```
POST /posts
```

**Request Body**

```json
{
  "title": "새 게시글 제목",
  "content": "새 게시글 내용입니다.",
  "author": "익명"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | O | 게시글 제목 |
| `content` | string | O | 게시글 내용 |
| `author` | string | O | 작성자 이름 |

**Response** `201 Created`

```json
{
  "id": "1743300000000",
  "title": "새 게시글 제목",
  "content": "새 게시글 내용입니다.",
  "author": "익명",
  "createdAt": "2026-03-30T09:00:00",
  "likes": 0,
  "comments": []
}
```

**Error** `400 Bad Request`

```json
{
  "error": "제목과 내용은 필수입니다."
}
```

---

### 4. 좋아요 토글

```
PATCH /posts/:id/like
```

호출할 때마다 좋아요 수가 +1 / -1 토글됩니다. 인증이 없으므로 서버 재시작 시 토글 상태가 초기화됩니다. 프론트에서 `isLiked` 상태를 로컬(useState, localStorage 등)로 관리해야 합니다.

**Response** `200 OK`

```json
{
  "id": "1",
  "title": "커뮤니티에 오신 것을 환영합니다!",
  "content": "안녕하세요! 이곳은 자유롭게 소통하는 커뮤니티입니다.",
  "author": "관리자",
  "createdAt": "2026-03-20T09:00:00",
  "likes": 6,
  "comments": [...]
}
```

**Error** `404 Not Found`

```json
{
  "error": "게시글을 찾을 수 없습니다."
}
```

---

### 5. 게시글 삭제

```
DELETE /posts/:id
```

**Response** `200 OK`

```json
{
  "message": "게시글이 삭제되었습니다."
}
```

**Error** `404 Not Found`

```json
{
  "error": "게시글을 찾을 수 없습니다."
}
```

---

## 댓글 API

### 6. 댓글 목록 조회

```
GET /posts/:id/comments
```

**Response** `200 OK`

```json
[
  {
    "id": "c1",
    "content": "반갑습니다!",
    "author": "수빈",
    "createdAt": "2026-03-20T10:30:00"
  }
]
```

**Error** `404 Not Found`

```json
{
  "error": "게시글을 찾을 수 없습니다."
}
```

---

### 7. 댓글 작성

```
POST /posts/:id/comments
```

**Request Body**

```json
{
  "content": "좋은 글이네요!",
  "author": "익명"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `content` | string | O | 댓글 내용 |
| `author` | string | O | 작성자 이름 |

**Response** `201 Created`

```json
{
  "id": "1743300000000",
  "content": "좋은 글이네요!",
  "author": "익명",
  "createdAt": "2026-03-30T09:05:00"
}
```

**Error** `400 Bad Request`

```json
{
  "error": "댓글 내용은 필수입니다."
}
```

**Error** `404 Not Found`

```json
{
  "error": "게시글을 찾을 수 없습니다."
}
```

---

### 8. 댓글 삭제

```
DELETE /comments/:id
```

**Response** `200 OK`

```json
{
  "message": "댓글이 삭제되었습니다."
}
```

**Error** `404 Not Found`

```json
{
  "error": "댓글을 찾을 수 없습니다."
}
```

---

## API 요약

| # | 기능 | 메서드 | URL | Request Body | Response |
| --- | --- | --- | --- | --- | --- |
| 1 | 게시글 목록 | `GET` | `/posts` | - | `PostSummary[]` |
| 2 | 게시글 상세 | `GET` | `/posts/:id` | - | `Post` |
| 3 | 게시글 작성 | `POST` | `/posts` | `{ title, content, author }` | `Post` |
| 4 | 좋아요 토글 | `PATCH` | `/posts/:id/like` | - | `Post` |
| 5 | 게시글 삭제 | `DELETE` | `/posts/:id` | - | `{ message }` |
| 6 | 댓글 목록 | `GET` | `/posts/:id/comments` | - | `Comment[]` |
| 7 | 댓글 작성 | `POST` | `/posts/:id/comments` | `{ content, author }` | `Comment` |
| 8 | 댓글 삭제 | `DELETE` | `/comments/:id` | - | `{ message }` |

---

## 에러 응답 형식

모든 에러는 아래 형식으로 반환됩니다.

```json
{
  "error": "에러 메시지"
}
```

| 상태 코드 | 의미 |
| --- | --- |
| `400` | 잘못된 요청 (필수 값 누락 등) |
| `404` | 리소스를 찾을 수 없음 |
| `500` | 서버 내부 오류 |

---

## 참고사항

- 인증/로그인 기능 없음
- 좋아요 토글 상태는 서버 메모리에 저장되며, 서버 재시작 시 초기화
- 프론트에서 좋아요 여부(`isLiked`)는 로컬 상태로 관리 필요
- 게시글/댓글 ID는 타임스탬프 기반 문자열로 자동 생성
