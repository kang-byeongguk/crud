import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(getAuthOptions());

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const postId = parseInt(params.id);

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  // Authorization check
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return <div>이 게시물을 수정할 권한이 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">게시물 수정</h1>
      <PostForm initialData={{ title: post.title, content: post.content }} postId={post.id} />
    </div>
  );
}
