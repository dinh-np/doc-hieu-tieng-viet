import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { METACOGNITION_ARTICLES_SEED } from '@/data/metacognition-seed';
import type { MetacognitionArticle } from '@/types/metacognition';
import { deepNormalizeVietnamese } from '@/lib/utils/vietnamese-text';
import { MetacognitionReaderClient } from './MetacognitionReaderClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function resolveArticle(id: string): Promise<MetacognitionArticle | null> {
  // 1. Tìm trong kho bài mẫu chuẩn (METACOGNITION_ARTICLES_SEED)
  const seedMatch = METACOGNITION_ARTICLES_SEED.find(
    (a) => a.id === id || a.slug === id
  );

  // 2. Thử truy vấn từ bảng `one_page_articles` trên Supabase
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('one_page_articles')
      .select('id, slug, title, structured_data')
      .or(`slug.eq.${id},id.eq.${id}`)
      .maybeSingle();

    if (data && data.structured_data) {
      const sd = data.structured_data as Record<string, unknown>;
      if (Array.isArray(sd.chunks) && sd.planning && sd.evaluating) {
        return deepNormalizeVietnamese({
          ...(sd as unknown as MetacognitionArticle),
          id: (data.slug as string) || (data.id as string),
          slug: data.slug as string,
          title: (data.title as string) || (sd.title as string),
          // Giữ lại han_viet_Popup từ seed nếu bản JSON rút gọn chưa có
          chunks: (sd.chunks as MetacognitionArticle['chunks']).map((c, idx) => ({
            ...c,
            han_viet_Popup:
              c.han_viet_Popup || seedMatch?.chunks[idx]?.han_viet_Popup || [],
          })),
        });
      }
    }
  } catch {
    // Fallback sang seedMatch
  }

  return seedMatch ? deepNormalizeVietnamese(seedMatch) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await resolveArticle(id);
  if (!article) {
    return { title: 'Không tìm thấy bài đọc | Đọc Hiểu Siêu Nhận Thức' };
  }
  return {
    title: `${article.title} | Đọc Siêu Nhận Thức 3 Pha`,
    description: article.subtitle || article.planning.prediction_prompt,
  };
}

export default async function MetacognitionArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await resolveArticle(id);

  if (!article) {
    notFound();
  }

  return <MetacognitionReaderClient article={article} />;
}

