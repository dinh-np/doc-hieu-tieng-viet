-- =============================================================================
-- MIGRATION: CẢI TẠO TỪ ĐIỂN HÁN-VIỆT & TẠO BẢNG TỪ ĐIỂN THUẦN VIỆT
-- =============================================================================

-- 1. Bổ sung cột english_equivalent (mỏ neo nhận thức tiếng Anh) vào bảng han_viet_compounds
ALTER TABLE public.han_viet_compounds
  ADD COLUMN IF NOT EXISTS english_equivalent TEXT;

-- 2. Tạo bảng thuan_viet_dictionary (Từ điển Thuần Việt lớp 7)
CREATE TABLE IF NOT EXISTS public.thuan_viet_dictionary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,              -- Ví dụ: "màu mỡ", "nhấp nhô", "bạt ngàn"
  word_type TEXT NOT NULL,                -- 'tu_lay' | 'tu_tuong_hinh' | 'tu_tuong_thanh' | 'tu_da_nghia'
  simple_meaning TEXT NOT NULL,           -- Nghĩa đời thường cho học sinh 12 tuổi
  mental_image TEXT,                      -- Gợi ý bức tranh tưởng tượng (Visual clue)
  context_clue TEXT,                      -- Mẹo nhận biết qua ngữ cảnh (3 chữ trước / sau)
  english_equivalent TEXT,                -- Từ tiếng Anh tương đương (ví dụ: "Fertile", "Undulating")
  example_sentence TEXT NOT NULL,         -- Câu ví dụ chuẩn văn cảnh SGK hoặc đời sống
  synonyms TEXT[] DEFAULT ARRAY[]::TEXT[],-- Từ đồng nghĩa đời thường
  grade_level INT DEFAULT 7,
  subject_tag TEXT DEFAULT 'SGK',
  quiz_data JSONB,                        -- Câu đố tương tác mini cho từ này
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bật Row Level Security (RLS) và tạo Policies cho thuan_viet_dictionary
ALTER TABLE public.thuan_viet_dictionary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public thuan_viet_dictionary readable" ON public.thuan_viet_dictionary;
CREATE POLICY "Public thuan_viet_dictionary readable"
  ON public.thuan_viet_dictionary
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service Role Full Access for thuan_viet_dictionary" ON public.thuan_viet_dictionary;
CREATE POLICY "Service Role Full Access for thuan_viet_dictionary"
  ON public.thuan_viet_dictionary
  FOR ALL
  USING (true)
  WITH CHECK (true);

