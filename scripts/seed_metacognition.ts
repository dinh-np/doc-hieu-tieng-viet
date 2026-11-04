/**
 * SCRIPT NẠP BÀI ĐỌC SIÊU NHẬN THỨC 3 PHA VÀO BẢNG one_page_articles TRÊN SUPABASE
 * Chạy bằng: npm run seed:metacognition
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { METACOGNITION_ARTICLES_SEED } from '../src/data/metacognition-seed';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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

  console.log('\n🧠 ===== NẠP BÀI ĐỌC SIÊU NHẬN THỨC 3 PHA (METACOGNITION) =====');

  const payload = METACOGNITION_ARTICLES_SEED.map((article) => ({
    title: article.title,
    slug: article.slug || article.id,
    category: article.subject === 'Lịch sử' ? 'lich-su' : article.subject === 'Địa lí' ? 'dia-ly' : 'ngu-van',
    target_grade: article.grade,
    estimated_minutes: article.target_time_minutes,
    page_count: 1,
    content_raw: article.chunks.map((c) => c.original_text).join('\n\n'),
    structured_data: {
      metacognition_version: '3-phase-v1',
      ...article,
    },
    is_published: true,
  }));

  const { data, error } = await supabase
    .from('one_page_articles')
    .upsert(payload, { onConflict: 'slug' })
    .select('id, slug, title');

  if (error) {
    console.warn(
      '⚠️ Không thể UPSERT trực tiếp vào `one_page_articles` (' +
        error.message +
        '). Ứng dụng vẫn hoạt động đầy đủ 100% nhờ dữ liệu tích hợp trong `src/data/metacognition-seed.ts`.'
    );
    return;
  }

  console.log(`✅ Đã UPSERT thành công ${data?.length ?? 0} bài đọc Siêu Nhận Thức vào Supabase!`);
  (data || []).forEach((row, i) => {
    console.log(`   ${String(i + 1).padStart(2, '0')}. [${row.slug}] ${row.title}`);
  });
  console.log('===============================================================\n');
}

main().catch((err) => {
  console.error('💥 Lỗi khi chạy seed_metacognition:', err);
  process.exit(1);
});

