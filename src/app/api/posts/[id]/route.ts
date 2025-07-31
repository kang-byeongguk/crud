import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = params.id;

    const post = await db.post.findUnique({
      where: {
        id: parseInt(postId),
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const postId = params.id;
    const { title, content } = await req.json();

    if (!title || !content) {
      return new NextResponse("Missing title or content", { status: 400 });
    }

    const existingPost = await db.post.findUnique({
      where: {
        id: parseInt(postId),
      },
    });

    if (!existingPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (existingPost.authorId !== parseInt(session.user.id)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedPost = await db.post.update({
      where: {
        id: parseInt(postId),
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, params: { id: string }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const postId = params.id;

    const existingPost = await db.post.findUnique({
      where: {
        id: parseInt(postId),
      },
    });

    if (!existingPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Only allow admin or the author to delete the post
    if (session.user.role !== "ADMIN" && existingPost.authorId !== parseInt(session.user.id)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.post.delete({
      where: {
        id: parseInt(postId),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
