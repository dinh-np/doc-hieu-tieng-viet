-- =============================================================================
-- BẢNG LƯU TRỮ BÀI ĐỌC ĐỘ DÀI KHÔNG GIỚI HẠN (LONG ARTICLES)
-- Dùng cho trang /long-read (Đọc Sâu & Tóm Tắt Mindmap Thụt Lề + Hỏi Sâu Feynman)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.long_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'Tự do',
    grade INT NOT NULL DEFAULT 7,
    content TEXT NOT NULL,
    word_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_long_articles_created_at
    ON public.long_articles (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_long_articles_slug
    ON public.long_articles (slug);

-- Bật Row Level Security (RLS)
ALTER TABLE public.long_articles ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai (SELECT) để học sinh mở bài đọc tự do không cần PIN
DROP POLICY IF EXISTS "Public Read Access for long_articles" ON public.long_articles;
CREATE POLICY "Public Read Access for long_articles"
    ON public.long_articles
    FOR SELECT
    USING (true);

-- Cho phép Server API (Service Role / Admin PIN Gate) thực hiện INSERT / UPDATE / DELETE
DROP POLICY IF EXISTS "Service Role Full Access for long_articles" ON public.long_articles;
CREATE POLICY "Service Role Full Access for long_articles"
    ON public.long_articles
    FOR ALL
    USING (true)
    WITH CHECK (true);
