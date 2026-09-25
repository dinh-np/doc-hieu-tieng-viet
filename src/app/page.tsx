import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import { BookOpen, Search, Bookmark, ArrowRight, Zap, Brain, Printer } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đọc Hiểu Tiếng Việt | Trang chủ',
  description: 'Nền tảng rèn kỹ năng đọc hiểu Tiếng Việt 5 bước cho học sinh lớp 7. Đồng hành cùng phụ huynh qua chế độ thời gian thực.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 border border-[#0066ab]/20 text-xs text-[#0066ab] font-medium mb-2">
            <Zap className="w-3 h-3" />
            Nền tảng học đọc thông minh cho học sinh lớp 7
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
            <span className="gradient-text">Đọc Hiểu</span>
            <br />
            <span className="text-slate-800">Tiếng Việt</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Phương pháp <strong className="text-slate-700">5 bước quốc tế</strong> giúp con xây dựng tư duy đọc sâu.
            Bố/mẹ đồng hành qua <strong className="text-slate-700">chế độ thời gian thực</strong> — dù ở xa.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/read"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0066ab] text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-md"
            >
              Bắt đầu đọc bài <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dictionary"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white shadow-sm border border-gray-200 border border-gray-200 text-slate-800 font-semibold text-base hover:border-gray-300 transition-all"
            >
              <Search className="w-4 h-4" />
              Từ điển Hán-Việt
            </Link>
          </div>
        </section>

        {/* 5-Step Feature Cards */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            Phương pháp 5 Bước
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="card rounded-2xl p-4 text-center hover:scale-[1.02] transition-all animate-fade-in-up stagger"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center text-lg"
                  style={{ background: step.bg }}
                >
                  {step.emoji}
                </div>
                <p className="text-xs font-bold text-slate-600 mb-1">Bước {i + 1}</p>
                <p className="text-sm font-bold text-slate-800">{step.name}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.iconBg}`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Quick links */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickLink
            href="/read"
            icon={<BookOpen className="w-5 h-5" />}
            title="Danh sách bài đọc"
            desc="Bài học theo chủ đề"
            gradient="from-indigo-600 to-violet-600"
          />
          <QuickLink
            href="/dictionary"
            icon={<Brain className="w-5 h-5" />}
            title="Từ điển Hán-Việt"
            desc="30 từ lớp 7 cần học"
            gradient="from-amber-500 to-orange-500"
          />
          <QuickLink
            href="/passport"
            icon={<Bookmark className="w-5 h-5" />}
            title="Hộ chiếu đọc sách"
            desc="Theo dõi tiến trình"
            gradient="from-emerald-500 to-teal-500"
          />
        </section>
      </main>
    </div>
  );
}

const STEPS = [
  { emoji: '💬', name: 'Think-Aloud', desc: 'Đọc to & suy nghĩ cùng nhau', bg: 'rgba(99,102,241,0.2)' },
  { emoji: '🗺️', name: 'Sơ Đồ', desc: 'Kéo thẻ vào sơ đồ tư duy', bg: 'rgba(245,158,11,0.2)' },
  { emoji: '🔄', name: 'Dạy Ngược', desc: 'Lật thẻ và dạy lại cho bố', bg: 'rgba(168,85,247,0.2)' },
  { emoji: '🎯', name: 'QAR', desc: '3 cấp độ câu hỏi tư duy', bg: 'rgba(16,185,129,0.2)' },
  { emoji: '📝', name: 'Giấy Bút', desc: 'Nhiệm vụ thực hành tay', bg: 'rgba(236,72,153,0.2)' },
];

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-[#0066ab]" />,
    iconBg: 'bg-indigo-500/10',
    title: 'Đồng bộ Thời Gian Thực',
    desc: 'Bố/mẹ quét QR để kết nối. Mọi hành động của con hiện ngay trên điện thoại bố/mẹ.',
  },
  {
    icon: <Brain className="w-5 h-5 text-amber-400" />,
    iconBg: 'bg-amber-500/10',
    title: 'Từ điển Hán-Việt',
    desc: '30 từ lớp 7 với công thức toán học. Chạm vào từ trong bài để xem ngay nghĩa gốc.',
  },
  {
    icon: <Printer className="w-5 h-5 text-emerald-400" />,
    iconBg: 'bg-emerald-500/10',
    title: 'Bản in A4',
    desc: 'Worksheet 2 cột khổ A4 ngang cho phép gấp thành mini-magazine bỏ túi.',
  },
];

function QuickLink({
  href,
  icon,
  title,
  desc,
  gradient,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="card rounded-2xl p-5 flex items-center gap-4 group hover:scale-[1.01] transition-all"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 text-white shadow-lg group-hover:shadow-xl transition-shadow`}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
