import type { Metadata } from 'next';
import DictionaryPageClient from './DictionaryClient';
import { createClient } from '@/lib/supabase/server';
import { HAN_VIET_COMPOUNDS_SEED } from '@/lib/supabase/seed';
import type { HanVietCompound } from '@/types/dictionary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Từ Điển Hán-Việt | Đọc Hiểu Tiếng Việt',
  description: 'Kho từ điển Hán-Việt chiết tự lớp 7 với công thức toán học gốc hình vị.',
};

export default async function DictionaryPage() {
  const supabase = await createClient();
  const { data: compoundsData } = await supabase
    .from('han_viet_compounds')
    .select('*')
    .order('word', { ascending: true });

  const compounds: HanVietCompound[] =
    compoundsData && compoundsData.length > 0
      ? (compoundsData as HanVietCompound[])
      : HAN_VIET_COMPOUNDS_SEED.map((c) => ({
          ...c,
          id: c.slug,
          created_at: '',
        }));

  return <DictionaryPageClient initialCompounds={compounds} />;
}
