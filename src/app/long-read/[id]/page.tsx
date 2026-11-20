import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createLongArticlesSupabase } from '@/lib/supabase/long-articles';
import { LongReadClient } from './LongReadClient';
import type { LongArticle } from '@/types/long-article';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Đọc Sâu & Tóm Tắt Mindmap | Đọc Hiểu Tiếng Việt',
  description:
    'Luyện đọc văn bản dài, đối chiếu sơ đồ tư duy dạng thụt lề và hỏi sâu cùng Thầy Cú Feynman.',
};

async function fetchLongArticle(idOrSlug: string): Promise<LongArticle | null> {
  const supabase = createLongArticlesSupabase();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  const { data, error } = await supabase
    .from('long_articles')
    .select('*')
    .eq(isUuid ? 'id' : 'slug', idOrSlug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as LongArticle;
}

export default async function LongReadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await fetchLongArticle(decodeURIComponent(id));

  if (!article) {
    notFound();
  }

  return <LongReadClient article={article} />;
}
