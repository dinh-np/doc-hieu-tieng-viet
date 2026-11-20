import { NextResponse } from 'next/server';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';
import {
  createLongArticlesSupabase,
  isValidAdminPin,
  countVietnameseWords,
  normalizeArticleHtml,
} from '@/lib/supabase/long-articles';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createLongArticlesSupabase();
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const query = supabase
      .from('long_articles')
      .select('*')
      .eq(isUuid ? 'id' : 'slug', id)
      .single();

    const { data, error } = await query;
    if (error || !data) {
      return NextResponse.json(
        { error: 'Không tìm thấy bài đọc.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi tải bài đọc.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const pin = req.headers.get('x-admin-pin');
    if (!isValidAdminPin(pin)) {
      return NextResponse.json(
        { error: 'Mã PIN quản trị không hợp lệ (401 Unauthorized).' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = (await req.json()) as {
      title?: string;
      subject?: string;
      grade?: number;
      content?: string;
    };

    const title = cleanVietnameseText(body.title || '').trim();
    const subject = cleanVietnameseText(body.subject || 'Tự do').trim() || 'Tự do';
    const grade = Number(body.grade) || 7;
    const content = normalizeArticleHtml(body.content || '');
    const word_count = countVietnameseWords(content);

    if (!title || word_count === 0) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ tiêu đề và nội dung bài đọc.' },
        { status: 400 }
      );
    }

    const supabase = createLongArticlesSupabase();

    const { data, error } = await supabase
      .from('long_articles')
      .update({
        title,
        subject,
        grade,
        content,
        word_count,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ article: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi khi cập nhật bài đọc.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const pin = req.headers.get('x-admin-pin');
    if (!isValidAdminPin(pin)) {
      return NextResponse.json(
        { error: 'Mã PIN quản trị không hợp lệ (401 Unauthorized).' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const supabase = createLongArticlesSupabase();
    const { error } = await supabase.from('long_articles').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi khi xóa bài đọc.' },
      { status: 500 }
    );
  }
}
