import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">접근 불가</h1>
      <p className="text-lg text-gray-700 mb-8">이 페이지에 접근할 권한이 없습니다.</p>
      <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
