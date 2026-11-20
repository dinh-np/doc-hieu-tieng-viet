import { NextResponse } from 'next/server';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';
import {
  createLongArticlesSupabase,
  isValidAdminPin,
  slugifyVietnamese,
  countVietnameseWords,
} from '@/lib/supabase/long-articles';

export async function GET() {
  try {
    const supabase = createLongArticlesSupabase();
    const { data, error } = await supabase
      .from('long_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Nếu bảng chưa được tạo trên Supabase, trả về mảng rỗng kèm thông báo gợi ý
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return NextResponse.json({
          articles: [],
          needsMigration: true,
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles: data || [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi tải danh sách bài đọc dài.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const pin = req.headers.get('x-admin-pin');
    if (!isValidAdminPin(pin)) {
      return NextResponse.json(
        { error: 'Mã PIN quản trị không hợp lệ (401 Unauthorized).' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as {
      title?: string;
      subject?: string;
      grade?: number;
      content?: string;
    };

    const title = cleanVietnameseText(body.title || '').trim();
    const subject = cleanVietnameseText(body.subject || 'Tự do').trim() || 'Tự do';
    const grade = Number(body.grade) || 7;
    const content = cleanVietnameseText(body.content || '').trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ tiêu đề và nội dung bài đọc.' },
        { status: 400 }
      );
    }

    const slug = slugifyVietnamese(title);
    const word_count = countVietnameseWords(content);

    const supabase = createLongArticlesSupabase();
    const { data, error } = await supabase
      .from('long_articles')
      .insert({
        slug,
        title,
        subject,
        grade,
        content,
        word_count,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ article: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi khi lưu bài đọc mới.' },
      { status: 500 }
    );
  }
}
