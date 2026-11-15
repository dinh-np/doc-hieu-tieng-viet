-- =============================================================================
-- MIGRATION: KHO TRI THỨC VECTOR HỢP NHẤT CHO DEEP DIVE Q&A (RAG + pgvector)
-- Hợp nhất toàn bộ 5 nguồn dữ liệu:
--   1. short_reading (reading_articles)
--   2. one_page (one_page_articles: article_type = 'one_page')
--   3. metacognition (one_page_articles: article_type = 'metacognition')
--   4. han_viet (han_viet_compounds) & thuan_viet (thuan_viet_dictionary)
--   5. proverb (proverbs)
-- =============================================================================

-- 1. Bật extension pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tạo bảng lưu trữ vector tri thức hợp nhất (768 chiều)
CREATE TABLE IF NOT EXISTS public.knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'short_reading',
      'one_page',
      'metacognition',
      'han_viet',
      'thuan_viet',
      'proverb'
    )
  ),
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_chunk TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id)
);

-- Index tìm kiếm vector cosine tốc độ cao (HNSW) & lọc metadata
CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_hnsw
  ON public.knowledge_embeddings
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_source_type
  ON public.knowledge_embeddings (source_type);

CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_article_id
  ON public.knowledge_embeddings ((metadata->>'article_id'));

-- 3. Thiết lập Row Level Security (RLS)
ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on knowledge_embeddings" ON public.knowledge_embeddings;
CREATE POLICY "Allow public read access on knowledge_embeddings"
  ON public.knowledge_embeddings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow service role full access on knowledge_embeddings" ON public.knowledge_embeddings;
CREATE POLICY "Allow service role full access on knowledge_embeddings"
  ON public.knowledge_embeddings
  FOR ALL
  USING (true)
  with check (true);

-- 4. Hàm RPC truy xuất ngữ cảnh đa nguồn có ưu tiên bài học đang mở
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 6,
  priority_article_id text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  source_type text,
  source_id text,
  title text,
  content_chunk text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  WITH scored AS (
    SELECT
      k.id,
      k.source_type,
      k.source_id,
      k.title,
      k.content_chunk,
      k.metadata,
      (1 - (k.embedding <=> query_embedding))::float AS similarity,
      (
        priority_article_id IS NOT NULL
        AND priority_article_id <> ''
        AND (
          k.metadata->>'article_id' = priority_article_id
          OR k.metadata->>'slug' = priority_article_id
          OR k.source_id = priority_article_id
          OR k.source_id LIKE priority_article_id || '_chunk_%'
        )
      ) AS is_priority
    FROM public.knowledge_embeddings k
  ),
  filtered AS (
    SELECT *
    FROM scored
    WHERE
      similarity >= match_threshold
      OR (is_priority AND similarity >= 0.35)
  )
  SELECT
    f.id,
    f.source_type,
    f.source_id,
    f.title,
    f.content_chunk,
    f.metadata,
    f.similarity
  FROM filtered f
  ORDER BY
    f.is_priority DESC,
    f.similarity DESC
  LIMIT match_count;
$$;

