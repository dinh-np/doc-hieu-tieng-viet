import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import { BookOpen, Star, Leaf, ArrowRight, Trophy } from 'lucide-react';
import { HAN_VIET_COMPOUNDS_SEED } from '@/lib/supabase/seed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng Tiến Trình | Đọc Hiểu Tiếng Việt',
};

export default function DashboardPage() {
  // Static demo data — in production would come from Supabase
  const gardenWords = HAN_VIET_COMPOUNDS_SEED.slice(0, 6);
  const progress = { completed: 1, total: 5, streak: 3 };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">
              <span className="gradient-text">Tiến trình</span>{' '}
              <span className="text-slate-800">của con</span>
            </h1>
            <p className="text-slate-600 mt-1">
              Chuỗi ngày đọc sách:{' '}
              <span className="text-amber-400 font-bold">🔥 {progress.streak} ngày</span>
            </p>
          </div>
          <Link
            href="/passport"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-200 border border-gray-200 text-sm text-slate-700 hover:border-gray-300 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Hộ chiếu
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Bài đã đọc', value: progress.completed, icon: '📖', color: 'text-[#0066ab]' },
            { label: 'Từ đã học', value: gardenWords.length, icon: '🌱', color: 'text-emerald-400' },
            { label: 'Ngày liên tiếp', value: progress.streak, icon: '🔥', color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="card rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Etymology Garden */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800">Vườn Từ Vựng</h2>
            <span className="text-xs text-slate-500 ml-auto">{gardenWords.length} từ đã trồng</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger">
            {gardenWords.map((word, i) => (
              <Link
                key={word.slug}
                href={`/dictionary/${word.slug}`}
                className="card rounded-2xl p-4 text-center group hover:scale-[1.02] transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-200 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="font-bold gradient-text text-sm">{word.word}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{word.full_meaning.slice(0, 30)}...</p>
              </Link>
            ))}

            {/* Add more placeholder */}
            <Link
              href="/dictionary"
              className="card rounded-2xl p-4 text-center border-dashed group hover:scale-[1.02] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2">
                <span className="text-slate-500 text-lg">+</span>
              </div>
              <p className="text-xs text-slate-500">Học thêm từ mới</p>
            </Link>
          </div>
        </div>

        {/* Next reading */}
        <div className="card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0066ab] flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800">Sẵn sàng đọc bài tiếp theo?</p>
            <p className="text-sm text-slate-600">Bắt đầu phiên đọc 15 phút hôm nay với bố/mẹ</p>
          </div>
          <Link
            href="/read"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066ab] text-white text-sm font-semibold hover:opacity-90 transition-all flex-shrink-0"
          >
            Đọc ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
