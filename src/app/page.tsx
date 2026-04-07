import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">커뮤니티에 오신 것을 환영합니다</h1>
      <p className="text-sm text-muted-foreground">
        게시글과 댓글을 확인하고 자유롭게 소통해보세요.
      </p>
      <Link
        href="/community"
        className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
      >
        커뮤니티 바로가기
      </Link>
    </div>
  );
}
