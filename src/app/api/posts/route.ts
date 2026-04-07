import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/types/post";
import { getPostStore } from "./store";

export async function GET() {
  return NextResponse.json(getPostStore());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newPost: Post = {
      id: Date.now().toString(),
      title: body.title,
      content: body.content,
      author: body.author ?? "익명",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    const posts = getPostStore();
    posts.unshift(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "게시글을 생성하지 못했습니다." },
      { status: 400 }
    );
  }
}

