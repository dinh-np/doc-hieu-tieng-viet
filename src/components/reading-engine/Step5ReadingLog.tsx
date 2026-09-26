'use client';

import { BookOpen, Printer, Pencil, Star } from 'lucide-react';
import Link from 'next/link';
import { Step5ScreenToPaper } from '@/types/article';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface Step5ReadingLogProps {
  data: Step5ScreenToPaper;
  articleId: string;
  isParentView?: boolean;
  onComplete: () => void;
}

export function Step5ReadingLog({
  data,
  articleId,
  isParentView = false,
  onComplete,
}: Step5ReadingLogProps) {

  useEffect(() => {
    // Celebration confetti on mount
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#a855f7'],
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-300 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bước 5: Cầu Nối Sách Giấy</h2>
          <p className="text-xs text-slate-600">Từ màn hình → giấy bút → sách thật</p>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-violet-950/60 border border-[#0066ab]/30 p-6 text-center">
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6 text-amber-400 fill-amber-400"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <h3 className="text-2xl font-bold gradient-text mb-1">Tuyệt vời! 5/5 bước!</h3>
        <p className="text-slate-600 text-sm">
          Bạn đã hoàn thành toàn bộ bài đọc hôm nay 🎉
        </p>
      </div>

      {/* Handwritten task */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Pencil className="w-4 h-4 text-amber-400" />
          <p className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            Nhiệm vụ Giấy Bút
          </p>
        </div>
        <p className="text-slate-800 leading-relaxed font-reading text-base">
          {data.handwritten_task}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/read/${articleId}/print`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066ab] text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Printer className="w-4 h-4" />
            In Worksheet A4
          </Link>
        </div>
      </div>

      {/* Book Recommendations */}
      {data.offline_books.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            📚 Sách thực tế gợi ý
          </p>
          {data.offline_books.map((book, i) => (
            <div
              key={i}
              className="card flex gap-4 rounded-2xl animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Book cover placeholder */}
              <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                <BookOpen className="w-6 h-6 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm leading-tight">{book.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {book.author} · {book.publisher}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{book.highlight}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strategy Reflection */}
      {!isParentView && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 space-y-3 mb-6">
          <p className="text-sm font-bold text-indigo-800 uppercase tracking-wider">
            🧠 Tự đánh giá chiến lược
          </p>
          <p className="text-slate-800 text-sm font-medium">Hôm nay chiến thuật nào giúp con hiểu sâu bài đọc nhất?</p>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Sơ đồ tư duy
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Phân tích từ khó
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Đặt câu hỏi phản biện
            </label>
          </div>
        </div>
      )}

      {/* Complete Session Button */}
      <button
        onClick={onComplete}
        className="w-full py-4 rounded-2xl bg-[#0066ab] text-white font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-md"
      >
        🎓 Hoàn thành buổi học hôm nay!
      </button>
    </div>
  );
}
