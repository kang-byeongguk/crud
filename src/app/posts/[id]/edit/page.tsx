import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import { db } from "@/lib/db";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const postId = parseInt(params.id);

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return <div className="container mx-auto p-4">Post not found.</div>;
  }

  if (post.authorId !== parseInt(session.user.id) && session.user.role !== "ADMIN") {
    redirect("/posts"); // Or show an unauthorized message
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={{ title: post.title, content: post.content }} postId={post.id} />
    </div>
  );
}
