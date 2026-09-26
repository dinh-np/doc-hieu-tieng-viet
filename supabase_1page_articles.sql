-- Create isolated table for 1-Page long articles
CREATE TABLE IF NOT EXISTS public.one_page_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'khoa-hoc',
    target_grade INT DEFAULT 7,
    estimated_minutes INT DEFAULT 20,
    page_count INT DEFAULT 1,
    hero_image_url TEXT,
    content_raw TEXT NOT NULL,
    structured_data JSONB NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.one_page_articles ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
CREATE POLICY "Public Read Access for one_page_articles"
ON public.one_page_articles FOR SELECT
USING (is_published = true);

-- Service Role Full Access
CREATE POLICY "Service Role Full Access for one_page_articles"
ON public.one_page_articles FOR ALL
USING (true)
WITH CHECK (true);
