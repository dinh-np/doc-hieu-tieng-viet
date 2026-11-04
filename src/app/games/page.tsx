import type { Metadata } from 'next';
import GamesClient, { EnrichedHanVietGameItem } from './GamesClient';
import { createClient } from '@/lib/supabase/server';
import { HAN_VIET_COMPOUNDS_SEED, HAN_VIET_ROOTS_SEED } from '@/lib/supabase/seed';
import { THUAN_VIET_SEED_DATA, HAN_VIET_ENGLISH_ANCHORS } from '@/lib/supabase/thuan-viet-seed';
import type { HanVietCompound, HanVietRoot, ThuanVietEntry } from '@/types/dictionary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Đấu Trường Từ Vựng 🎮 | Đọc Hiểu Tiếng Việt',
  description: 'Luyện từ vựng Hán-Việt và Thuần Việt lớp 7 qua 3 chế độ chơi tương tác: Thợ Rèn Hình Vị, Bức Họa Ngôn Từ, và Đấu Trường Thực Chiến.',
};

export default async function GamesPage() {
  const supabase = await createClient();

  const [compoundsRes, rootsRes, linksRes, thuanVietRes] = await Promise.all([
    supabase.from('han_viet_compounds').select('*'),
    supabase.from('han_viet_roots').select('*'),
    supabase.from('compound_root_links').select('*'),
    supabase.from('thuan_viet_dictionary').select('*'),
  ]);

  const rawCompounds: HanVietCompound[] =
    compoundsRes.data && compoundsRes.data.length > 0
      ? (compoundsRes.data as HanVietCompound[])
      : HAN_VIET_COMPOUNDS_SEED.map((c) => ({
          ...c,
          id: c.slug,
          created_at: '',
        }));

  const rawRoots: HanVietRoot[] =
    rootsRes.data && rootsRes.data.length > 0
      ? (rootsRes.data as HanVietRoot[])
      : HAN_VIET_ROOTS_SEED.map((r) => ({
          ...r,
          id: r.reading_vi,
          created_at: '',
        }));

  const rootById = new Map<string, HanVietRoot>();
  const rootByReading = new Map<string, HanVietRoot>();
  for (const r of rawRoots) {
    rootById.set(r.id, r);
    rootByReading.set(r.reading_vi.trim().toLowerCase(), r);
  }

  const linksByCompound = new Map<string, { root1?: HanVietRoot; root2?: HanVietRoot }>();
  for (const l of linksRes.data || []) {
    const r = rootById.get(l.root_id);
    if (!r) continue;
    const entry = linksByCompound.get(l.compound_id) || {};
    if (l.position_order === 1) entry.root1 = r;
    if (l.position_order === 2) entry.root2 = r;
    linksByCompound.set(l.compound_id, entry);
  }

  const hanVietItems: EnrichedHanVietGameItem[] = rawCompounds
    .map((c) => {
      const linked = linksByCompound.get(c.id);
      const syllables = c.word.trim().split(/\s+/);
      const r1 =
        linked?.root1 ||
        rootByReading.get((syllables[0] || '').toLowerCase()) || {
          id: syllables[0] || 'r1',
          reading_vi: syllables[0] || '',
          root_meaning: 'Hình vị 1',
          created_at: '',
        };
      const r2 =
        linked?.root2 ||
        rootByReading.get(syllables.slice(1).join(' ').toLowerCase()) || {
          id: syllables[1] || 'r2',
          reading_vi: syllables.slice(1).join(' ') || '',
          root_meaning: 'Hình vị 2',
          created_at: '',
        };

      return {
        ...c,
        english_equivalent: c.english_equivalent || HAN_VIET_ENGLISH_ANCHORS[c.slug] || null,
        root1: r1,
        root2: r2,
      };
    })
    .filter((item) => item.root1.reading_vi && item.root2.reading_vi);

  const thuanVietItems: ThuanVietEntry[] =
    thuanVietRes.data && thuanVietRes.data.length > 0
      ? (thuanVietRes.data as ThuanVietEntry[])
      : THUAN_VIET_SEED_DATA;

  return (
    <GamesClient
      hanVietItems={hanVietItems}
      thuanVietItems={thuanVietItems}
    />
  );
}

