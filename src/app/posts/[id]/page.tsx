'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
  authorId: number;
}

export default function PostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/posts/${id}`);
          if (!res.ok) {
            throw new Error('Post not found');
          }
          const data = await res.json();
          setPost(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;

    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '게시물 삭제에 실패했습니다.');
        }

        router.push('/posts');
        router.refresh();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="container mx-auto p-4">게시물을 찾을 수 없습니다.</div>;
  }

  const isAuthor = session?.user?.id === post.authorId.toString();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-2">작성자: {post.author.name}</p>
        <p className="text-gray-500 text-sm mb-6">
          작성일: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>

        {(isAuthor || isAdmin) && (
          <div className="mt-6 flex space-x-4">
            <Link href={`/posts/${post.id}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded">
              수정
            </Link>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

