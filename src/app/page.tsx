
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">블로그에 오신 것을 환영합니다</h1>
        <div className="space-x-4">
          <Link href="/posts" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            게시물 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
