import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validate input
    if (!name || !email || !password) {
      return new NextResponse('필수 입력 항목이 누락되었습니다.', { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('이미 사용 중인 이메일입니다.', { status: 409 });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // role is USER by default
      },
    });

    return NextResponse.json({ message: '회원가입이 완료되었습니다.' }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return new NextResponse('서버 오류가 발생했습니다.', { status: 500 });
  }
}
