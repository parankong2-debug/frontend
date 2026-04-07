"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";

export default function WritePage() {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedAuthor = author.trim();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedAuthor || !trimmedTitle || !trimmedContent) {
      alert("작성자, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost({
        author: trimmedAuthor,
        title: trimmedTitle,
        content: trimmedContent,
      });
      router.push("/community");
    } catch (e) {
      alert("글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = !!author.trim() && !!title.trim() && !!content.trim();

  return (
    <div>
      <h1>글 작성</h1>
      <button type="button" onClick={() => router.push("/community")}>
        ← 목록으로
      </button>
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="작성자"
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
      />
      <button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
        {isSubmitting ? "작성 중…" : "작성"}
      </button>
    </div>
  );
}
