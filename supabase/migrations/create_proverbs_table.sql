-- =============================================================================
-- MIGRATION: TẠO BẢNG TỤC NGỮ VIỆT NAM (public.proverbs)
-- Dành cho học sinh lớp 7 (12 tuổi): Nghĩa đen, Nghĩa bóng (chuẩn Lê Văn Hòe),
-- Kỹ năng sống, Tư duy biện chứng & Kho dẫn chứng làm văn nghị luận.
-- =============================================================================

create table if not exists public.proverbs (
  id uuid primary key default gen_random_uuid(),
  proverb text unique not null,
  pillar text not null check (pillar in ('nature_labor', 'morality_society', 'skills_conduct')),
  sub_category text not null,
  literal_meaning text not null,
  figurative_meaning text not null,
  life_skill_note text not null,
  dialectical_view text not null,
  essay_evidence_usage text not null,
  sample_sentence text not null,
  english_anchor text not null,
  keywords text[] not null default '{}',
  is_featured boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_proverbs_pillar on public.proverbs(pillar);
create index if not exists idx_proverbs_is_featured on public.proverbs(is_featured);

-- Bật Row Level Security (RLS)
alter table public.proverbs enable row level security;

drop policy if exists "Allow public read access on proverbs" on public.proverbs;
create policy "Allow public read access on proverbs"
  on public.proverbs
  for select
  using (true);

drop policy if exists "Allow service role full access on proverbs" on public.proverbs;
create policy "Allow service role full access on proverbs"
  on public.proverbs
  for all
  using (true)
  with check (true);

