import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PROVERBS_SEED_DATA, type ProverbItem } from '@/data/proverbs-seed';
import { deepNormalizeVietnamese } from '@/lib/utils/vietnamese-text';
import { ProverbsClient } from './ProverbsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Kho Tàng Tục Ngữ Việt Nam | Nghĩa Đen, Nghĩa Bóng & Dẫn Chứng Nghị Luận',
  description:
    'Giải mã Tục ngữ Việt Nam cho học sinh 12 tuổi (theo chuẩn Lê Văn Hòe): Nghĩa đen gợi hình, Nghĩa bóng kỹ năng sống, Góc nhìn biện chứng và Vũ khí viết văn nghị luận.',
};

async function getProverbs(): Promise<ProverbItem[]> {
  const merged: ProverbItem[] = [...PROVERBS_SEED_DATA];
  const indexByProverb = new Map<string, number>();

  merged.forEach((item, idx) => {
    indexByProverb.set(item.proverb.trim().toLowerCase().normalize('NFC'), idx);
  });

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('proverbs')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      for (const row of data) {
        const normalizedRow = deepNormalizeVietnamese(row as ProverbItem);
        const key = normalizedRow.proverb.trim().toLowerCase().normalize('NFC');
        const existingIdx = indexByProverb.get(key);
        if (existingIdx !== undefined) {
          merged[existingIdx] = normalizedRow;
        } else {
          indexByProverb.set(key, merged.length);
          merged.push(normalizedRow);
        }
      }
    }
  } catch {
    // Fallback sang PROVERBS_SEED_DATA
  }

  return merged;
}

export default async function ProverbsPage() {
  const proverbs = await getProverbs();
  return <ProverbsClient initialProverbs={proverbs} />;
}

