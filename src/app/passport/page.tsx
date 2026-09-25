import { Header } from '@/components/shared/Header';
import { BookOpen, Stamp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hộ Chiếu Đọc Sách | Đọc Hiểu Tiếng Việt',
};

const STAMPS = [
  { emoji: '🌪️', label: 'Bão Táp', earned: true },
  { emoji: '🔬', label: 'Khoa Học', earned: false },
  { emoji: '📜', label: 'Lịch Sử', earned: false },
  { emoji: '🌏', label: 'Địa Lý', earned: false },
  { emoji: '🌊', label: 'Đại Dương', earned: false },
  { emoji: '🌙', label: 'Vũ Trụ', earned: false },
];

export default function PassportPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Passport Book */}
        <div className="card rounded-3xl p-6 space-y-6">
          {/* Cover */}
          <div className="rounded-xl bg-[#0066ab] p-6 text-center shadow-md">
            <div className="w-16 h-16 rounded-xl bg-[#00528a] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Hộ Chiếu Đọc Sách</h1>
            <p className="text-[#0066ab] text-sm">Con · Lớp 7 · Năm học 2026-2027</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#0066ab] text-sm">
              <span className="text-amber-400 font-bold">🔥 3</span> ngày đọc liên tiếp
            </div>
          </div>

          {/* Stamps collection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stamp className="w-4 h-4 text-[#0066ab]" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Bộ sưu tập con dấu
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3 stagger">
              {STAMPS.map((stamp, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 text-center border transition-all animate-fade-in-up ${
                    stamp.earned
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`text-3xl mb-2 ${stamp.earned ? '' : 'grayscale opacity-30'}`}
                  >
                    {stamp.emoji}
                  </div>
                  <p
                    className={`text-xs font-bold ${
                      stamp.earned ? 'text-[#0066ab]' : 'text-slate-500'
                    }`}
                  >
                    {stamp.label}
                  </p>
                  {stamp.earned && (
                    <p className="text-xs text-[#0066ab] mt-0.5">✓ Đã nhận</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Tiến trình cả năm</span>
              <span>1 / {STAMPS.length} chủ đề</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0066ab] transition-all duration-1000"
                style={{ width: `${(1 / STAMPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
