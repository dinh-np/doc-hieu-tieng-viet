import { notFound } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { EtymologyFormulaCard } from '@/components/dictionary/EtymologyFormulaCard';
import { MiniEtymologyQuiz } from '@/components/dictionary/MiniEtymologyQuiz';
import { createClient } from '@/lib/supabase/server';
import { HAN_VIET_COMPOUNDS_SEED, HAN_VIET_ROOTS_SEED } from '@/lib/supabase/seed';
import { HanVietCompound, HanVietRoot } from '@/types/dictionary';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: compound } = await supabase
    .from('han_viet_compounds')
    .select('word, full_meaning')
    .eq('slug', slug)
    .single();

  const fallback = HAN_VIET_COMPOUNDS_SEED.find((c) => c.slug === slug);
  const titleWord = compound?.word || fallback?.word;
  const meaning = compound?.full_meaning || fallback?.full_meaning;

  return {
    title: titleWord ? `${titleWord} | Từ Điển Hán-Việt` : 'Từ Điển Hán-Việt',
    description: meaning,
  };
}

export default async function DictionarySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Lấy thông tin từ ghép từ Supabase
  const { data: compoundRow } = await supabase
    .from('han_viet_compounds')
    .select('*')
    .eq('slug', slug)
    .single();

  const seedFallback = HAN_VIET_COMPOUNDS_SEED.find((c) => c.slug === slug);
  if (!compoundRow && !seedFallback) return notFound();

  const compound: HanVietCompound = compoundRow
    ? (compoundRow as HanVietCompound)
    : {
        ...seedFallback!,
        id: seedFallback!.slug,
        created_at: '',
      };

  // 2. Lấy liên kết hình vị từ bảng `compound_root_links` + `han_viet_roots`
  let root1: HanVietRoot & { related_words: string[] } | null = null;
  let root2: HanVietRoot & { related_words: string[] } | null = null;

  if (compoundRow?.id) {
    const { data: linksData } = await supabase
      .from('compound_root_links')
      .select('position_order, related_words, root:han_viet_roots(*)')
      .eq('compound_id', compoundRow.id)
      .order('position_order', { ascending: true });

    if (linksData && linksData.length > 0) {
      for (const link of linksData) {
        const rawRoot = Array.isArray(link.root) ? link.root[0] : link.root;
        if (!rawRoot) continue;
        const enrichedRoot: HanVietRoot & { related_words: string[] } = {
          id: rawRoot.id,
          hanzi: rawRoot.hanzi,
          reading_vi: rawRoot.reading_vi,
          root_meaning: rawRoot.root_meaning,
          created_at: rawRoot.created_at || '',
          related_words: link.related_words || [],
        };
        if (link.position_order === 1) root1 = enrichedRoot;
        if (link.position_order === 2) root2 = enrichedRoot;
      }
    }
  }

  // Fallback sang tra cứu theo âm đọc nếu chưa có link trong bảng nối
  const words = compound.word.split(' ');
  if (!root1) {
    const { data: r1Db } = await supabase
      .from('han_viet_roots')
      .select('*')
      .ilike('reading_vi', words[0] || '')
      .maybeSingle();

    const r1Seed =
      HAN_VIET_ROOTS_SEED.find((r) => r.reading_vi.toLowerCase() === words[0]?.toLowerCase()) ||
      HAN_VIET_ROOTS_SEED[0];

    root1 = {
      id: r1Db?.id || r1Seed.reading_vi,
      reading_vi: r1Db?.reading_vi || words[0] || r1Seed.reading_vi,
      root_meaning: r1Db?.root_meaning || r1Seed.root_meaning,
      hanzi: r1Db?.hanzi || r1Seed.hanzi,
      created_at: r1Db?.created_at || '',
      related_words: [],
    };
  }

  if (!root2) {
    const secondSyllable = words.slice(1).join(' ') || words[1] || '';
    const { data: r2Db } = await supabase
      .from('han_viet_roots')
      .select('*')
      .ilike('reading_vi', secondSyllable)
      .maybeSingle();

    const r2Seed =
      HAN_VIET_ROOTS_SEED.find((r) => r.reading_vi.toLowerCase() === secondSyllable.toLowerCase()) ||
      HAN_VIET_ROOTS_SEED[1];

    root2 = {
      id: r2Db?.id || r2Seed.reading_vi,
      reading_vi: r2Db?.reading_vi || secondSyllable || r2Seed.reading_vi,
      root_meaning: r2Db?.root_meaning || r2Seed.root_meaning,
      hanzi: r2Db?.hanzi || r2Seed.hanzi,
      created_at: r2Db?.created_at || '',
      related_words: [],
    };
  }

  // 3. Lấy các từ cùng chủ đề từ Supabase
  const { data: relatedData } = await supabase
    .from('han_viet_compounds')
    .select('word, slug, full_meaning, subject_tag')
    .eq('subject_tag', compound.subject_tag)
    .neq('slug', compound.slug)
    .limit(4);

  const related =
    relatedData && relatedData.length > 0
      ? relatedData
      : HAN_VIET_COMPOUNDS_SEED.filter(
          (c) => c.subject_tag === compound.subject_tag && c.slug !== compound.slug
        ).slice(0, 4);

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Back */}
        <Link
          href="/dictionary"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Về danh sách từ điển
        </Link>

        {/* Main Card */}
        <div className="card rounded-3xl p-6 animate-fade-in-up">
          <EtymologyFormulaCard
            compound={compound}
            root1={root1}
            root2={root2}
          />
        </div>

        {/* Quiz */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <MiniEtymologyQuiz compound={compound} />
        </div>

        {/* Related words */}
        {related.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">
              Từ cùng chủ đề
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/dictionary/${r.slug}`}
                  className="card rounded-2xl p-4 hover:scale-[1.01] transition-all"
                >
                  <p className="font-bold gradient-text">{r.word}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{r.full_meaning}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
