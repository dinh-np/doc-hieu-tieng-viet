import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { GRAMMAR_SEED_DATA, type GrammarExercise } from '@/data/grammar-seed';
import { GrammarClient } from './GrammarClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Phẫu Thuật Cấu Trúc Câu | Ngữ Pháp Tiếng Việt Tương Tác Lớp 7',
  description:
    'Rèn luyện kỹ năng giải phẫu câu tiếng Việt lớp 7: Tìm Khung Xương Câu (S-V Core), Dao Mổ Tách Câu Ghép (Clause Slicing), và Mũi Tên Logic (Cause-Effect) với mỏ neo tiếng Anh.',
};

export default async function GrammarPage() {
  let exercises: GrammarExercise[] = [...GRAMMAR_SEED_DATA];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('grammar_exercises')
      .select('*')
      .order('level_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      const dbExercises = data as GrammarExercise[];
      const seenIds = new Set(dbExercises.map((e) => e.id));
      const missingSeeds = GRAMMAR_SEED_DATA.filter((s) => !seenIds.has(s.id));
      exercises = [...dbExercises, ...missingSeeds];
    }
  } catch {
    // Fallback sang GRAMMAR_SEED_DATA nếu Supabase chưa chạy migration
  }

  return <GrammarClient initialExercises={exercises} />;
}

