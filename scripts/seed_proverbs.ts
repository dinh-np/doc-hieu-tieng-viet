/**
 * SCRIPT NẠP DỮ LIỆU KHO TÀNG TỤC NGỮ VIỆT NAM VÀO BẢNG `public.proverbs`
 * Chạy bằng:
 *   npm run seed:proverbs
 *   npx tsx scripts/seed_proverbs.ts
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PROVERBS_SEED_DATA } from '../src/data/proverbs-seed';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function cleanNFC(str: string): string {
  return (str || '')
    .replace(/([\p{L}])\s+([\u0300-\u036f]+)/gu, '$1$2')
    .normalize('NFC')
    .trim();
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n📜 ===== NẠP KHO TÀNG TỤC NGỮ VIỆT NAM (15 CÂU TIÊU BIỂU) =====');

  const payload = PROVERBS_SEED_DATA.map((item) => ({
    proverb: cleanNFC(item.proverb),
    pillar: item.pillar,
    sub_category: cleanNFC(item.sub_category),
    literal_meaning: cleanNFC(item.literal_meaning),
    figurative_meaning: cleanNFC(item.figurative_meaning),
    life_skill_note: cleanNFC(item.life_skill_note),
    dialectical_view: cleanNFC(item.dialectical_view),
    essay_evidence_usage: cleanNFC(item.essay_evidence_usage),
    sample_sentence: cleanNFC(item.sample_sentence),
    english_anchor: cleanNFC(item.english_anchor),
    keywords: item.keywords.map(cleanNFC),
    is_featured: item.is_featured,
  }));

  const { data, error } = await supabase
    .from('proverbs')
    .upsert(payload, { onConflict: 'proverb', ignoreDuplicates: false })
    .select('id, proverb, pillar, sub_category');

  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('proverbs')) {
      console.warn(
        '\n⚠️  Bảng `public.proverbs` chưa được tạo trên Supabase.\n' +
          '   👉 Hãy chạy file `supabase/migrations/create_proverbs_table.sql` trong Supabase SQL Editor rồi chạy lại `npm run seed:proverbs`.\n' +
          '   ✅ Trang `/proverbs` vẫn hoạt động đầy đủ 100% ngay lập tức nhờ bộ dữ liệu tích hợp trong `src/data/proverbs-seed.ts`!\n'
      );
      return;
    }
    console.error('❌ Lỗi khi UPSERT vào bảng proverbs:', error.message);
    process.exit(1);
  }

  console.log(`✅ Đã UPSERT thành công ${data?.length ?? 0} câu tục ngữ vào bảng public.proverbs:`);
  (data || []).forEach((row, idx) => {
    console.log(
      `   ${String(idx + 1).padStart(2, '0')}. [${row.pillar}] "${row.proverb}" — ${row.sub_category}`
    );
  });
  console.log('===================================================================\n');
}

main().catch((err) => {
  console.error('💥 Lỗi khi chạy seed_proverbs:', err);
  process.exit(1);
});

