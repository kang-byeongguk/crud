import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const posts = await db.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      {session && (
        <div className="mb-4">
          <Link href="/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create New Post
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content.substring(0, 100)}...</p>
            <p className="text-sm text-gray-500">Author: {post.author.name}</p>
            <p className="text-sm text-gray-500">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
            <Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
