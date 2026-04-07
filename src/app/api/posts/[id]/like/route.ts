import { NextResponse } from "next/server";
import { toggleLikeById } from "../../store";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = toggleLikeById(id);
  if (!post) {
    return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(post);
}

