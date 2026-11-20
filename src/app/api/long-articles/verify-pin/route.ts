import { NextResponse } from 'next/server';
import { isValidAdminPin } from '@/lib/supabase/long-articles';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { pin?: string };
    if (!isValidAdminPin(body.pin)) {
      return NextResponse.json(
        { ok: false, error: 'Mã PIN không chính xác. Vui lòng thử lại.' },
        { status: 401 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Yêu cầu xác thực PIN không hợp lệ.' },
      { status: 400 }
    );
  }
}
