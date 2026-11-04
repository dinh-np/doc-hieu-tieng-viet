-- =============================================================================
-- MIGRATION: TẠO BẢNG BÀI TẬP NGỮ PHÁP TIẾNG VIỆT TƯƠNG TÁC (grammar_exercises)
-- Thiết kế theo lộ trình 4 cấp độ (Nguyễn Hiến Lê - Trương Văn Chình & Diệp Quang Ban)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.grammar_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_order INT NOT NULL DEFAULT 1,          -- 1: Khung xương, 2: Đề-Thuyết, 3: Cắt câu/Logic, 4: Từ vị
  lesson_category TEXT NOT NULL,               -- 'sentence_core' | 'topic_comment' | 'sentence_slicing' | 'connectors_logic'
  title TEXT NOT NULL,                         -- Ví dụ: "Tìm Khung Xương Câu (S-V Core)"
  rule_explanation TEXT NOT NULL,              -- Lời giải thích ngắn gọn tuổi 12 (kèm lời giảng Feynman)
  english_anchor TEXT,                         -- Ví dụ: "Subject + Verb | Cause - Effect"
  original_sentence TEXT NOT NULL,             -- Câu văn dài lấy từ SGK 7 (Sử, Địa, Văn)
  interactive_type TEXT NOT NULL,              -- 'pick_core' | 'slice_slash' | 'drag_logic_arrow'
  exercise_payload JSONB NOT NULL,             -- Dữ liệu tương tác (tokens từ, vị trí cắt đúng, vị từ, chủ đề, vế A, vế B...)
  explanation_after TEXT NOT NULL,             -- Lời giải thích rõ ràng sau khi hoàn thành
  source_reference TEXT DEFAULT 'SGK 7',       -- Nguồn đối chiếu (SGK 7, Nguyễn Hiến Lê, Diệp Quang Ban)
  grade_level INT DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (RLS) và tạo Policies cho grammar_exercises
ALTER TABLE public.grammar_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public grammar_exercises readable" ON public.grammar_exercises;
CREATE POLICY "Public grammar_exercises readable"
  ON public.grammar_exercises
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service Role Full Access for grammar_exercises" ON public.grammar_exercises;
CREATE POLICY "Service Role Full Access for grammar_exercises"
  ON public.grammar_exercises
  FOR ALL
  USING (true)
  WITH CHECK (true);

