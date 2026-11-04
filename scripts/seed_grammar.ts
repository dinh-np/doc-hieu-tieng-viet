/**
 * SCRIPT NẠP DỮ LIỆU NGỮ PHÁP TƯƠNG TÁC VÀO SUPABASE (grammar_exercises)
 * Chạy bằng: npm run seed:grammar
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GRAMMAR_SEED_DATA } from '../src/data/grammar-seed';

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

  console.log('\n🧬 ===== NẠP BÀI TẬP NGỮ PHÁP TIẾNG VIỆT LỚP 7 (grammar_exercises) =====');

  const { error: checkErr } = await supabase
    .from('grammar_exercises')
    .select('id')
    .limit(1);

  if (checkErr && checkErr.code === 'PGRST205') {
    console.log(
      '⚠️  Bảng `public.grammar_exercises` chưa tồn tại trên Supabase (cần chạy file `supabase/migrations/create_grammar_exercises.sql` trong Supabase SQL Editor).'
    );
    console.log(
      '✅ Tuy nhiên, toàn bộ 16 bài tập mẫu đã được tích hợp sẵn trong `src/data/grammar-seed.ts` để trang `/grammar` hoạt động ngay lập tức!\n'
    );
    return;
  }

  const payload = GRAMMAR_SEED_DATA.map((item) => ({
    id: item.id,
    level_order: item.level_order,
    lesson_category: item.lesson_category,
    title: item.title,
    rule_explanation: item.rule_explanation,
    english_anchor: item.english_anchor,
    original_sentence: item.original_sentence,
    interactive_type: item.interactive_type,
    exercise_payload: item.exercise_payload,
    explanation_after: item.explanation_after,
    source_reference: item.source_reference,
    grade_level: item.grade_level,
  }));

  const { data, error } = await supabase
    .from('grammar_exercises')
    .upsert(payload, { onConflict: 'id' })
    .select('id, title, lesson_category');

  if (error) {
    console.error('❌ Lỗi khi UPSERT vào grammar_exercises:', error.message);
    process.exit(1);
  }

  console.log(`✅ Đã UPSERT thành công ${data?.length ?? 0} bài tập ngữ pháp lên Supabase!`);
  (data || []).forEach((row, i) => {
    console.log(`   ${String(i + 1).padStart(2, '0')}. [${row.lesson_category}] ${row.title}`);
  });
  console.log('========================================================================\n');
}

main().catch((err) => {
  console.error('💥 Lỗi khi chạy seed_grammar:', err);
  process.exit(1);
});

