# 3주차 과제: 백엔드 API 연결하기

## 과제 목표

2주차에 만든 커뮤니티 게시판의 **localStorage 기반 데이터 관리**를 **백엔드 API 호출 방식**으로 전환합니다.

기존에는 게시글 조회, 작성, 좋아요, 댓글 등 모든 데이터를 브라우저의 localStorage에 저장했습니다. 이번 과제에서는 이 **모든 데이터 처리를 서버 API로 옮깁니다.** 더 이상 `getPosts()`, `savePosts()` 같은 localStorage 함수를 사용하지 않고, axios를 통해 서버와 통신하여 데이터를 관리합니다.

이를 통해 **비동기 API 통신**, **로딩/에러 상태 처리**, **서버-클라이언트 데이터 흐름**을 학습합니다.

---

## 주요 변경 사항 요약

| 2주차 (localStorage)              | 3주차 (API)                          |
| --------------------------------- | ------------------------------------ |
| `getPosts()` — 동기 함수          | `GET /posts` — 비동기 API 호출       |
| `savePosts()` — localStorage 저장 | `POST /posts` — 서버에 저장          |
| 작성자 "익명" 하드코딩            | 작성자 이름 직접 입력                |
| 좋아요 +1 (localStorage)          | `PATCH /posts/{id}/like` (API 호출)  |
| 댓글 localStorage 저장            | `POST /posts/{id}/comments` API 호출 |
| 삭제 기능 없음                    | `DELETE` API로 게시글/댓글 삭제      |
| 에러 처리 없음                    | try-catch + 사용자 알림              |
| 로딩 상태 없음                    | 로딩 중 UI 표시                      |

---

## API 명세서

> **Base URL**: `https://study-community-backend.vercel.app/api`

API의 자세한 명세는 `docs/api-board-specification.md`를 참고하세요.

### API 요약

| Method   | URL                    | 설명        |
| -------- | ---------------------- | ----------- |
| `GET`    | `/posts`               | 게시글 목록 |
| `GET`    | `/posts/{id}`          | 게시글 상세 |
| `POST`   | `/posts`               | 게시글 작성 |
| `DELETE` | `/posts/{id}`          | 게시글 삭제 |
| `PATCH`  | `/posts/{id}/like`     | 좋아요 토글 |
| `POST`   | `/posts/{id}/comments` | 댓글 작성   |
| `DELETE` | `/comments/{id}`       | 댓글 삭제   |

---

## 공통 규칙

이번 과제부터 아래 규칙을 반드시 지켜주세요.

### 1. 커밋 자주 하기 + 커밋 메시지 컨벤션

기능 하나를 완성할 때마다 커밋하세요. 과제를 다 끝내고 한 번에 커밋하지 마세요!

```
feat: 글 목록 API 연결
feat: 글 작성 페이지 작성자 입력 추가
feat: 좋아요 토글 기능 구현
feat: 게시글 삭제 기능 추가
fix: 댓글 작성 후 목록 갱신 안되는 버그 수정
style: 글 상세 페이지 디자인 개선
```

| 접두사     | 사용 시점                        |
| ---------- | -------------------------------- |
| `feat`     | 새로운 기능 추가                 |
| `fix`      | 버그 수정                        |
| `style`    | 디자인/CSS 변경 (기능 변화 없음) |
| `refactor` | 코드 리팩토링 (기능 변화 없음)   |
| `chore`    | 설정, 패키지 설치 등 기타 작업   |

### 2. 디자인 개선

2주차에 기능 구현에 집중했다면, 이번에는 **디자인도 깔끔하게** 만들어주세요.
AI 도구를 활용한 바이브 코딩!!

- 일관된 색상, 간격, 폰트 사용
- 로딩/에러/빈 상태 UI도 신경 쓰기
- 반응형 (모바일에서도 깨지지 않도록)

### 3. 환경변수로 API URL 관리

API 주소는 **코드에 직접 쓰지 말고** 반드시 환경변수로 관리하세요.

`frontend/.env.local` 파일을 생성하고 아래 내용을 넣으세요:

```
NEXT_PUBLIC_API_URL=https://study-community-backend.vercel.app/api
```

코드에서는 이렇게 사용합니다:

```typescript
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

> **주의:** `.env.local` 파일은 `.gitignore`에 포함되어 있어 GitHub에 올라가지 않습니다.
> 환경변수를 추가하거나 변경한 후에는 반드시 개발 서버(`npm run dev`)를 **재시작**해야 합니다.

---

## 시작하기 전에

### 1. axios 설치

```bash
npm install axios
```

### 2. 환경변수 설정

위 [공통 규칙 3번](#3-환경변수로-api-url-관리)을 참고하여 `.env.local` 파일을 생성하세요.

### 3. 파일 구조

```
src/
├── app/
│   ├── page.tsx                ← 루트 페이지 (커뮤니티 진입점)
│   └── community/
│       ├── page.tsx            ← 글 목록 (수정)
│       ├── write/
│       │   └── page.tsx        ← 글 작성 (수정)
│       └── [id]/
│           └── page.tsx        ← 글 상세 (수정)
├── components/
│   ├── PostCard.tsx            ← 게시글 카드 (수정)
│   └── CommentItem.tsx         ← 댓글 아이템 (수정)
├── lib/
│   └── api.ts                  ← [신규] API 클라이언트
└── types/
    └── post.ts                 ← 타입 정의 (수정)
```

> `mockData.ts`는 더 이상 사용하지 않습니다. 삭제하거나 그대로 둬도 괜찮습니다.

---

## 과제 진행 순서

```
[Step 1] API 클라이언트 생성 (api.ts)
    │
    ▼
[Step 2] 타입 수정 (post.ts)
    │        ✅ API 응답에 맞게 타입 정의
    ▼
[Step 3] 글 목록 페이지 수정
    │        ✅ 여기서 중간 확인! /community 접속해서 서버 데이터가 보이는지
    ▼
[Step 4] 글 작성 페이지 수정
    │        ✅ 글 작성 후 목록에서 확인!
    ▼
[Step 5] 글 상세 페이지 수정
    │        ✅ 좋아요 토글, 댓글 작성/삭제, 게시글 삭제 확인!
    ▼
[Step 6] 루트 페이지 + 네비게이션 정리
    │        ✅ 최종 확인! 모든 페이지 간 이동이 자연스러운지
    ▼
    완료!
```

---

## Step 1: API 클라이언트 생성

> 파일: `src/lib/api.ts` (신규 생성)

axios 인스턴스를 만들고, 각 API를 호출하는 함수를 구현합니다.

**요구사항:**

- axios 인스턴스 생성 (`baseURL`은 환경변수 `NEXT_PUBLIC_API_URL` 사용)
- 아래 함수들을 구현:

| 함수명                        | 역할             | API                         |
| ----------------------------- | ---------------- | --------------------------- |
| `fetchPosts()`                | 게시글 목록 조회 | `GET /posts`                |
| `fetchPost(id)`               | 게시글 상세 조회 | `GET /posts/{id}`           |
| `createPost(data)`            | 게시글 작성      | `POST /posts`               |
| `deletePost(id)`              | 게시글 삭제      | `DELETE /posts/{id}`        |
| `toggleLike(id)`              | 좋아요 토글      | `PATCH /posts/{id}/like`    |
| `createComment(postId, data)` | 댓글 작성        | `POST /posts/{id}/comments` |
| `deleteComment(commentId)`    | 댓글 삭제        | `DELETE /comments/{id}`     |

**힌트:**

```typescript
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

// 예시: 게시글 목록 조회
export const fetchPosts = async () => {
    const res = await api.get("/posts");
    return res.data;
};
```

---

## Step 2: 타입 수정

> 파일: `src/types/post.ts`

API 응답 형태에 맞게 타입을 수정합니다.

**확인할 점:**

목록 조회 API(`GET /posts`)의 응답을 잘 살펴보세요. 2주차에서 사용하던 `Post` 타입과 **다른 점**이 있습니다.

- 목록 조회 응답에는 `comments` 배열 대신 `commentCount` 숫자가 옵니다
- 상세 조회 응답에는 기존처럼 `comments` 배열이 포함됩니다

필요에 따라 새로운 타입을 추가하세요.

---

## Step 3: 글 목록 페이지

> 파일: `src/app/community/page.tsx`

**변경 사항:**

- `getPosts()` (동기) → `fetchPosts()` (비동기) 로 교체
- `useEffect` 안에서 async 함수로 API 호출

**추가 요구사항:**

| 요구사항  | 설명                                 |
| --------- | ------------------------------------ |
| 로딩 상태 | API 호출 중 "로딩 중..." 메시지 표시 |
| 에러 처리 | API 실패 시 에러 메시지 표시         |
| 빈 상태   | 게시글이 없을 때 안내 메시지 표시    |

**핵심 개념 — useEffect에서 비동기 호출:**

```typescript
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadPosts = async () => {
        try {
            const data = await fetchPosts();
            setPosts(data);
        } catch (err) {
            // 에러 처리
        } finally {
            setLoading(false);
        }
    };
    loadPosts();
}, []);
```

> **왜 useEffect 안에서 바로 async를 쓸 수 없나요?**
> `useEffect`의 콜백은 cleanup 함수를 반환할 수 있는데, `async` 함수는 항상 Promise를 반환하기 때문입니다. 그래서 내부에 `async` 함수를 따로 만들어서 호출합니다.

---

## Step 4: 글 작성 페이지

> 파일: `src/app/community/write/page.tsx`

**변경 사항:**

- `savePosts()` 방식 → `createPost()` API 호출로 교체
- **작성자 입력 필드 추가** (더 이상 "익명" 하드코딩하지 않음)

**추가 요구사항:**

| 요구사항    | 설명                                                                 |
| ----------- | -------------------------------------------------------------------- |
| 작성자 입력 | 작성자 이름을 직접 입력받는 input 추가                               |
| 입력 검증   | 제목, 내용, 작성자가 비어있으면 제출 불가 (alert 또는 버튼 비활성화) |
| 로딩 상태   | 작성 버튼 클릭 후 "작성 중..." 표시 + 버튼 비활성화 (중복 제출 방지) |
| 에러 처리   | API 실패 시 사용자에게 알림                                          |
| 뒤로가기    | "← 목록으로" 버튼 → `/community`로 이동                              |

**힌트:**

```typescript
const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    setSubmitting(true);
    try {
        await createPost({ title, content, author });
        router.push("/community");
    } catch (err) {
        alert("게시글 작성에 실패했습니다.");
        setSubmitting(false);
    }
};
```

---

## Step 5: 글 상세 페이지

> 파일: `src/app/community/[id]/page.tsx`

이번 과제에서 가장 변경이 많은 페이지입니다. 아래 순서대로 하나씩 구현하세요.

### 5-1. 게시글 표시

**변경 사항:**

- localStorage에서 find → `fetchPost(id)` API 호출로 교체
- 로딩 상태, 에러 상태 추가

| 요구사항  | 설명                                                              |
| --------- | ----------------------------------------------------------------- |
| 로딩 상태 | API 호출 중 "로딩 중..." 표시                                     |
| 에러 처리 | 존재하지 않는 게시글 접근 시 에러 메시지 + 목록으로 돌아가기 링크 |
| 뒤로가기  | "← 목록으로" 버튼 → `/community`로 이동                           |

### 5-2. 좋아요 기능

**변경 사항:**

- 2주차: `likes + 1` 후 `savePosts()` (localStorage에 직접 저장)
- 3주차: `PATCH /posts/{id}/like` API 호출 (서버에서 +1 처리)

좋아요 버튼을 누를 때마다 좋아요 수가 1씩 증가합니다.

| 요구사항  | 설명                                                                 |
| --------- | -------------------------------------------------------------------- |
| API 호출  | `PATCH /posts/{id}/like` → 응답으로 온 게시글 데이터로 상태 업데이트 |
| 즉시 반영 | 좋아요 수가 화면에 바로 반영되어야 함                                |
| 에러 처리 | 실패 시 사용자에게 알림                                              |

### 5-3. 게시글 삭제 (신규 기능)

| 요구사항        | 설명                                             |
| --------------- | ------------------------------------------------ |
| 삭제 버튼       | 게시글 상세 페이지에 삭제 버튼 추가              |
| 확인 다이얼로그 | 삭제 전 `confirm("정말 삭제하시겠습니까?")` 표시 |
| API 호출        | `DELETE /posts/{id}` 호출                        |
| 삭제 후 이동    | 성공 시 `/community` 목록 페이지로 이동          |
| 에러 처리       | 실패 시 사용자에게 알림                          |

### 5-4. 댓글 작성

**변경 사항:**

- 댓글 작성 시 **작성자 이름 입력 필드** 추가
- localStorage 저장 → `createComment()` API 호출로 교체

| 요구사항    | 설명                                                            |
| ----------- | --------------------------------------------------------------- |
| 작성자 입력 | 작성자 이름 input 추가                                          |
| 입력 검증   | 작성자, 댓글 내용이 비어있으면 제출 불가                        |
| API 호출    | `POST /posts/{id}/comments` 호출                                |
| 즉시 반영   | 응답으로 받은 댓글을 기존 댓글 목록에 추가하여 화면에 바로 표시 |
| 에러 처리   | 실패 시 사용자에게 알림                                         |

### 5-5. 댓글 삭제 (신규 기능)

| 요구사항        | 설명                                                      |
| --------------- | --------------------------------------------------------- |
| 삭제 버튼       | 각 댓글에 삭제 버튼 추가 (CommentItem 컴포넌트 수정 필요) |
| 확인 다이얼로그 | 삭제 전 확인                                              |
| API 호출        | `DELETE /comments/{id}` 호출                              |
| 즉시 반영       | 삭제된 댓글을 목록에서 즉시 제거                          |
| 에러 처리       | 실패 시 사용자에게 알림                                   |

---

## Step 6: 루트 페이지 + 네비게이션 정리

### 6-1. 루트 페이지

> 파일: `src/app/page.tsx`

기본 루트(`/`) 페이지에서 커뮤니티로 진입할 수 있도록 합니다.

| 요구사항      | 설명                                   |
| ------------- | -------------------------------------- |
| 커뮤니티 링크 | `/community`로 이동하는 버튼 또는 링크 |

> 간단한 환영 메시지 + 커뮤니티 바로가기 버튼 정도면 충분합니다.

### 6-2. 네비게이션 확인

모든 페이지 간 이동이 자연스러운지 확인하세요.

| 페이지                       | 이동 버튼                        |
| ---------------------------- | -------------------------------- |
| 루트 (`/`)                   | → 커뮤니티 목록                  |
| 목록 (`/community`)          | → 글 작성, → 글 상세 (카드 클릭) |
| 글 작성 (`/community/write`) | ← 목록으로                       |
| 글 상세 (`/community/[id]`)  | ← 목록으로                       |

---

## 체크리스트

### 공통 규칙

- [ ] 기능 단위로 커밋하고, 커밋 메시지 컨벤션을 지켰다
- [ ] 디자인이 깔끔하고 일관성 있다
- [ ] API URL을 `.env.local` 환경변수로 관리하고 있다 (코드에 URL 직접 작성 X)

### 기본 설정

- [ ] axios가 설치되어 있다
- [ ] `.env.local`에 `NEXT_PUBLIC_API_URL=https://study-community-backend.vercel.app/api`이 설정되어 있다
- [ ] `src/lib/api.ts`에 API 함수들이 구현되어 있다

### 글 목록 페이지

- [ ] 서버에서 게시글 목록을 불러와 표시한다
- [ ] 로딩 중 상태가 표시된다
- [ ] API 오류 시 에러 메시지가 표시된다
- [ ] "글 작성" 버튼으로 작성 페이지에 진입할 수 있다

### 글 작성 페이지

- [ ] 작성자, 제목, 내용을 모두 입력할 수 있다
- [ ] 빈 항목이 있으면 제출되지 않는다
- [ ] 작성 중 버튼이 비활성화된다 (중복 제출 방지)
- [ ] 작성 완료 후 목록 페이지로 이동한다
- [ ] "← 목록으로" 버튼이 동작한다

### 글 상세 페이지

- [ ] 서버에서 게시글 상세 정보를 불러와 표시한다
- [ ] 로딩 중 상태가 표시된다
- [ ] 존재하지 않는 게시글 접근 시 에러가 표시된다
- [ ] "← 목록으로" 버튼이 동작한다

### 좋아요

- [ ] 좋아요 버튼 클릭 시 API를 호출한다
- [ ] 좋아요 수가 화면에 즉시 반영된다

### 게시글 삭제

- [ ] 삭제 버튼이 표시된다
- [ ] 삭제 전 확인 다이얼로그가 뜬다
- [ ] 삭제 후 목록 페이지로 이동한다

### 댓글 작성

- [ ] 작성자 이름과 댓글 내용을 입력할 수 있다
- [ ] 빈 항목이 있으면 제출되지 않는다
- [ ] 작성한 댓글이 즉시 화면에 표시된다

### 댓글 삭제

- [ ] 각 댓글에 삭제 버튼이 있다
- [ ] 삭제 전 확인 다이얼로그가 뜬다
- [ ] 삭제된 댓글이 즉시 화면에서 사라진다

### 네비게이션

- [ ] 루트 페이지에서 커뮤니티로 이동할 수 있다
- [ ] 모든 페이지에서 적절한 뒤로가기 버튼이 동작한다

---

## 제출 방법

1. 구현을 완료합니다
2. 변경한 파일들을 커밋합니다
3. 포크한 레포지토리에 push합니다
4. 원본 레포지토리로 Pull Request를 생성합니다
    - PR 제목: `[학번_이름] 3주차 과제 제출`

---

## 막히면?

1. **`axios is not defined`** → `npm install axios` 했는지, import 했는지 확인
2. **API 호출이 안 됨** → `.env.local` 파일에 `NEXT_PUBLIC_API_URL` 설정했는지, 개발 서버를 재시작했는지 확인 (환경변수 변경 후에는 `npm run dev`를 다시 실행해야 합니다)
3. **`async/await` 에러** → 함수에 `async` 키워드를 붙였는지, `await`를 빼먹지 않았는지 확인
4. **목록에서 댓글 수가 안 보임** → API 응답의 `commentCount` 필드를 사용하고 있는지 확인 (2주차의 `comments.length`와 다릅니다)
5. **좋아요가 이상하게 동작** → API 응답의 `likes` 값을 그대로 사용하고 있는지 확인
6. **CORS 에러** → API 서버가 CORS를 허용하고 있으므로 정상적으로 동작해야 합니다. URL이 정확한지 다시 확인하세요
