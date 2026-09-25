import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import { Clock, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ReadingArticle } from '@/types/article';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Danh sách bài đọc | Đọc Hiểu Tiếng Việt',
  description: 'Chọn bài đọc theo chủ đề: Thời tiết, Khoa học, Lịch sử, Địa lý cho học sinh lớp 7.',
};

const CATEGORY_LABELS: Record<string, string> = {
  'thoi-tiet': '🌪️ Thời Tiết',
  'khoa-hoc': '🔬 Khoa Học',
  'lich-su': '📜 Lịch Sử',
  'dia-ly': '🌏 Địa Lý',
};

const CATEGORY_COLORS: Record<string, string> = {
  'thoi-tiet': 'from-sky-600 to-blue-700',
  'khoa-hoc': 'from-emerald-600 to-teal-700',
  'lich-su': 'from-amber-600 to-orange-700',
  'dia-ly': 'from-violet-600 to-purple-700',
};

export default async function ReadPage() {
  const supabase = await createClient();
  const { data: articlesData } = await supabase
    .from('reading_articles')
    .select('*')
    .eq('is_published', true);

  const articles = (articlesData || []) as ReadingArticle[];

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            <span className="gradient-text">Bài đọc</span> hôm nay
          </h1>
          <p className="text-slate-600">Chọn một bài để bắt đầu phiên đọc 15 phút cùng Cha</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
          {articles.map((article, i) => {
            const catGradient = CATEGORY_COLORS[article.category] || 'from-indigo-600 to-violet-700';
            const catLabel = CATEGORY_LABELS[article.category] || article.category;

            return (
              <Link
                key={article.slug}
                href={`/read/${article.slug}`}
                className="card rounded-2xl overflow-hidden group hover:scale-[1.01] transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Hero image / gradient */}
                <div className={`aspect-video bg-gradient-to-br ${catGradient} relative overflow-hidden rounded-t-xl`}>
                  {article.hero_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.hero_image_url}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:opacity-50 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-bold text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {catLabel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:gradient-text transition-all">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {article.content_raw.slice(0, 120)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.estimated_minutes} phút
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Lớp {article.target_grade}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        6 bước (0-5)
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#0066ab] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Upcoming articles placeholder */}
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <p className="text-slate-500 text-sm">🚀 Thêm bài mới sẽ được cập nhật hàng tuần</p>
        </div>
      </main>
    </div>
  );
}
