'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostFormProps {
  initialData?: { title: string; content: string };
  postId?: number;
}

export default function PostForm({ initialData, postId }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = postId ? 'PUT' : 'POST';
    const url = postId ? `/api/posts/${postId}` : '/api/posts';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      router.push('/posts');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          제목:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          내용:
        </label>
        <textarea
          id="content"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? '저장 중...' : (postId ? '게시물 수정' : '게시물 생성')}
        </button>
      </div>
    </form>
  );
}
