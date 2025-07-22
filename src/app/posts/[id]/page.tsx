import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await getServerSession(authOptions);
  const postId = parseInt(params.id);

  const post = await db.post.findUnique({
    where: {
      id: postId,
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
    return <div className="container mx-auto p-4">Post not found.</div>;
  }

  const handleDelete = async () => {
    "use server";
    if (!session) {
      redirect("/api/auth/signin");
    }

    if (session.user.id !== String(post.authorId) && session.user.role !== "ADMIN") {
      return;
    }

    try {
      await db.post.delete({
        where: {
          id: postId,
        },
      });
      redirect("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <p className="text-sm text-gray-500">Author: {post.author.name} ({post.author.email})</p>
        <p className="text-sm text-gray-500">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">Last Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>

        {session && (session.user.id === String(post.authorId) || session.user.role === "ADMIN") && (
          <div className="mt-4 flex space-x-4">
            <Link href={`/posts/${post.id}/edit`} className="bg-green-500 text-white px-4 py-2 rounded">
              Edit
            </Link>
            <form action={handleDelete}>
              <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
