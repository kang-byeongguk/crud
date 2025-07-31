import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // if (!session || session.user.role !== "ADMIN") {
  //   redirect("/api/auth/signin");
  // }

  const users: Awaited<ReturnType<typeof db.user.findMany>> = await db.user.findMany();
  const posts: Awaited<ReturnType<typeof db.post.findMany<{
    include: {
      author: {
        select: {
          name: true,
        },
      },
    };
  }>>> = await db.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  const handleChangeUserRole = async (userId: string, newRole: "USER" | "ADMIN") => {
    "use server";
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return;
    }
    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    redirect("/admin/dashboard");
  };

  const handleDeletePost = async (postId: number) => {
    "use server";
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return;
    }
    await db.post.delete({
      where: { id: postId },
    });
    redirect("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            로그아웃
          </button>
        </div>
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">사용자 관리</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">아이디</th>
                    <th className="py-2 px-4 border-b">이름</th>
                    <th className="py-2 px-4 border-b">이메일</th>
                    <th className="py-2 px-4 border-b">역할</th>
                    <th className="py-2 px-4 border-b">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: typeof users[number]) => (
                    <tr key={user.id}>
                      <td className="py-2 px-4 border-b">{user.id}</td>
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        {user.role === "USER" ? (
                          <form action={async () => handleChangeUserRole(user.id, "ADMIN")}>
                            <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                              관리자로 지정
                            </button>
                          </form>
                        ) : (
                          <form action={async () => handleChangeUserRole(user.id, "USER")}>
                            <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                              일반 사용자로 지정
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">게시물 관리</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">아이디</th>
                    <th className="py-2 px-4 border-b">제목</th>
                    <th className="py-2 px-4 border-b">작성자</th>
                    <th className="py-2 px-4 border-b">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="py-2 px-4 border-b">{post.id}</td>
                      <td className="py-2 px-4 border-b"><Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline">{post.title}</Link></td>
                      <td className="py-2 px-4 border-b">{post.author.name}</td>
                      <td className="py-2 px-4 border-b">
                        <form action={async () => handleDeletePost(post.id)}>
                          <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                            삭제
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
