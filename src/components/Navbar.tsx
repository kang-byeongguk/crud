'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          홈
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/posts" className="text-gray-300 hover:text-white">
              게시물
            </Link>
          </li>
          {session ? (
            <>
              {session.user.role === "ADMIN" && (
                <li>
                  <Link href="/admin/dashboard" className="text-gray-300 hover:text-white">
                    관리자
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-300 hover:text-white"
                >
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/admin/login" className="text-gray-300 hover:text-white">
                로그인
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
