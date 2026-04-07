import { NextResponse } from "next/server";
import { deleteCommentById } from "../../posts/store";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const ok = deleteCommentById(commentId);
  if (!ok) {
    return NextResponse.json({ message: "댓글을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

