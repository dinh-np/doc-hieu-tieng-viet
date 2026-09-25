import { notFound } from 'next/navigation';
import { use } from 'react';
import { Header } from '@/components/shared/Header';
import { EtymologyFormulaCard } from '@/components/dictionary/EtymologyFormulaCard';
import { MiniEtymologyQuiz } from '@/components/dictionary/MiniEtymologyQuiz';
import { HAN_VIET_COMPOUNDS_SEED, HAN_VIET_ROOTS_SEED } from '@/lib/supabase/seed';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const compound = HAN_VIET_COMPOUNDS_SEED.find((c) => c.slug === slug);
  return {
    title: compound ? `${compound.word} | Từ Điển Hán-Việt` : 'Từ Điển Hán-Việt',
    description: compound?.full_meaning,
  };
}

export default function DictionarySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const compound = HAN_VIET_COMPOUNDS_SEED.find((c) => c.slug === slug);
  if (!compound) return notFound();

  // Get roots from the math formula (simplified: use seed roots)
  // For "Nghịch lý" -> root1=Nghịch, root2=Lý
  const words = compound.word.split(' ');
  const root1Data = HAN_VIET_ROOTS_SEED.find(
    (r) => r.reading_vi.toLowerCase() === words[0]?.toLowerCase()
  ) || HAN_VIET_ROOTS_SEED[0];
  const root2Data = HAN_VIET_ROOTS_SEED.find(
    (r) => r.reading_vi.toLowerCase() === words[1]?.toLowerCase()
  ) || HAN_VIET_ROOTS_SEED[1];

  const root1 = {
    id: root1Data.reading_vi,
    reading_vi: root1Data.reading_vi,
    root_meaning: root1Data.root_meaning,
    hanzi: root1Data.hanzi,
    created_at: '',
    related_words: HAN_VIET_COMPOUNDS_SEED
      .filter((c) => c.word.includes(root1Data.reading_vi) && c.slug !== compound.slug)
      .slice(0, 4)
      .map((c) => c.word),
  };

  const root2 = {
    id: root2Data.reading_vi,
    reading_vi: root2Data.reading_vi,
    root_meaning: root2Data.root_meaning,
    hanzi: root2Data.hanzi,
    created_at: '',
    related_words: HAN_VIET_COMPOUNDS_SEED
      .filter((c) => c.word.includes(root2Data.reading_vi) && c.slug !== compound.slug)
      .slice(0, 4)
      .map((c) => c.word),
  };

  // Related words (same subject)
  const related = HAN_VIET_COMPOUNDS_SEED
    .filter((c) => c.subject_tag === compound.subject_tag && c.slug !== compound.slug)
    .slice(0, 4);

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
            compound={{
              ...compound,
              id: compound.slug,
              created_at: '',
            }}
            root1={root1}
            root2={root2}
          />
        </div>

        {/* Quiz */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <MiniEtymologyQuiz
            compound={{ ...compound, id: compound.slug, created_at: '' }}
          />
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
