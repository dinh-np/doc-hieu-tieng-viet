import type { Metadata } from 'next';
import AskClient, { type AskArticleOption } from './AskClient';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Hỏi Đáp Đào Sâu Kiến Thức | Đọc Hiểu Tiếng Việt',
  description:
    'Hỏi đáp cùng Cú Đôi Feynman kết nối toàn bộ kho Bài đọc, Từ điển Hán-Việt, Thuần Việt và Tục ngữ Việt Nam.',
};

export default async function AskPage() {
  const supabase = await createClient();

  const [shortRes, onePageRes] = await Promise.all([
    supabase
      .from('reading_articles')
      .select('id, slug, title')
      .eq('is_published', true)
      .order('title', { ascending: true }),
    supabase
      .from('one_page_articles')
      .select('id, slug, title, category, article_type')
      .eq('is_published', true)
      .order('title', { ascending: true }),
  ]);

  const options: AskArticleOption[] = [];

  for (const row of onePageRes.data || []) {
    const isMeta =
      row.article_type === 'metacognition' || row.category === 'metacognition';
    options.push({
      id: row.slug || row.id,
      title: row.title,
      group: isMeta ? 'metacognition' : 'one_page',
      groupLabel: isMeta ? 'Siêu Nhận Thức' : 'Bài 1 Trang',
    });
  }

  for (const row of shortRes.data || []) {
    options.push({
      id: row.slug || row.id,
      title: row.title,
      group: 'short_reading',
      groupLabel: 'Bài Đọc Ngắn',
    });
  }

  return <AskClient articles={options} />;
}

