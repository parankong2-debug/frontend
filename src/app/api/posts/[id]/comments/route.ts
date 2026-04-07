import { NextRequest, NextResponse } from "next/server";
import { addCommentToPost, findPost } from "../../store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = findPost(id);
  if (!post) {
    return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const content = String(body.content ?? "").trim();
    const author = String(body.author ?? "").trim();

    if (!content || !author) {
      return NextResponse.json(
        { message: "댓글 내용과 작성자를 입력해주세요." },
        { status: 400 }
      );
    }

    const newComment = addCommentToPost(id, content, author);
    return NextResponse.json(newComment, { status: 201 });
  } catch {
    return NextResponse.json({ message: "댓글을 생성하지 못했습니다." }, { status: 400 });
  }
}

