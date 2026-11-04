import type { Metadata } from 'next';
import DictionaryPageClient from './DictionaryClient';
import { createClient } from '@/lib/supabase/server';
import { HAN_VIET_COMPOUNDS_SEED } from '@/lib/supabase/seed';
import { THUAN_VIET_SEED_DATA, HAN_VIET_ENGLISH_ANCHORS } from '@/lib/supabase/thuan-viet-seed';
import type { HanVietCompound, ThuanVietEntry } from '@/types/dictionary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Từ Điển Hán-Việt & Thuần Việt | Đọc Hiểu Tiếng Việt',
  description: 'Kho từ điển Hán-Việt chiết tự và Từ điển Thuần Việt giàu hình ảnh cho học sinh lớp 7.',
};

export default async function DictionaryPage() {
  const supabase = await createClient();

  const [hanVietRes, thuanVietRes] = await Promise.all([
    supabase.from('han_viet_compounds').select('*').order('word', { ascending: true }),
    supabase.from('thuan_viet_dictionary').select('*').order('word', { ascending: true }),
  ]);

  const rawCompounds: HanVietCompound[] =
    hanVietRes.data && hanVietRes.data.length > 0
      ? (hanVietRes.data as HanVietCompound[])
      : HAN_VIET_COMPOUNDS_SEED.map((c) => ({
          ...c,
          id: c.slug,
          created_at: '',
        }));

  // Bổ sung english_equivalent từ bộ mỏ neo nếu bản ghi trên DB chưa có
  const compounds: HanVietCompound[] = rawCompounds.map((c) => ({
    ...c,
    english_equivalent: c.english_equivalent || HAN_VIET_ENGLISH_ANCHORS[c.slug] || null,
  }));

  const thuanVietWords: ThuanVietEntry[] =
    thuanVietRes.data && thuanVietRes.data.length > 0
      ? (thuanVietRes.data as ThuanVietEntry[])
      : THUAN_VIET_SEED_DATA;

  return (
    <DictionaryPageClient
      initialCompounds={compounds}
      initialThuanViet={thuanVietWords}
    />
  );
}
