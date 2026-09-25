import { use } from 'react';
import { ARTICLE_SEED_DATA } from '@/lib/supabase/seed';
import { ReadingArticle } from '@/types/article';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bản in Worksheet A4',
};

const ARTICLE_MAP: Record<string, ReadingArticle> = {
  'nghich-ly-mat-bao': ARTICLE_SEED_DATA as ReadingArticle,
};

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const article = ARTICLE_MAP[id];

  if (!article) return <p>Not found</p>;
  const data = article.structured_data;

  return (
    <div className="print-page bg-white text-black min-h-screen p-0">
      {/* Left Column */}
      <div className="fold-line px-6 py-8 space-y-5">
        {/* Title */}
        <div className="border-b-2 border-slate-800 pb-3">
          <h1 className="text-xl font-black">{article.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {article.estimated_minutes} phút · Lớp {article.target_grade} · Đọc hiểu Tiếng Việt
          </p>
        </div>

        {/* Passage */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-slate-800 pl-2">
            Văn Bản
          </h2>
          {data.step_1_think_aloud.paragraphs.map((p, i) => (
            <div key={p.id} className="space-y-1">
              <p className="text-xs font-bold text-slate-500">Đoạn {i + 1}:</p>
              <p className="text-sm leading-[1.8] text-slate-800">{p.text}</p>
              <div className="h-5 border-b border-dashed border-slate-300" />
            </div>
          ))}
        </div>

        {/* Vocabulary */}
        {data.inline_vocabulary.length > 0 && (
          <div className="space-y-2 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-amber-500 pl-2">
              Từ Ngữ Cần Chú Ý
            </h2>
            {data.inline_vocabulary.map((v) => (
              <div key={v.word} className="flex gap-2 text-sm">
                <span className="font-bold text-slate-800 min-w-20">{v.word}:</span>
                <div className="flex-1 border-b border-dashed border-slate-300" />
              </div>
            ))}
          </div>
        )}

        {/* Notes area */}
        <div className="space-y-1 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-indigo-500 pl-2">
            Ghi Chú Của Em
          </h2>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-7 border-b border-slate-200" />
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="px-6 py-8 space-y-5">
        {/* Graphic Organizer */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-emerald-500 pl-2">
            Sơ Đồ: {data.step_2_graphic_organizer.title}
          </h2>
          <div className="border-2 border-slate-300 rounded-lg p-4 min-h-[140px] space-y-3">
            {data.step_2_graphic_organizer.slots.map((slot, i) => (
              <div key={slot.id} className="space-y-1">
                <p className="text-xs font-bold text-slate-600">{i + 1}. {slot.label}</p>
                <div className="h-10 border border-dashed border-slate-300 rounded px-2 flex items-center">
                  <span className="text-slate-700 text-xs italic">Điền vào đây...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QAR Questions */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-violet-500 pl-2">
            Câu Hỏi QAR
          </h2>
          {data.step_4_qar_questions.map((q, i) => (
            <div key={q.id} className="space-y-1.5">
              <p className="text-xs font-bold text-slate-600">{i + 1}. {q.question}</p>
              {q.options && (
                <div className="grid grid-cols-2 gap-1">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-1 text-xs">
                      <div className="w-3.5 h-3.5 border border-slate-400 rounded-full flex-shrink-0" />
                      <span className="text-slate-600">{opt}</span>
                    </div>
                  ))}
                </div>
              )}
              {q.open_ended && (
                <div className="space-y-1">
                  {[...Array(3)].map((_, li) => (
                    <div key={li} className="h-5 border-b border-dashed border-slate-300" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Paper task */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-amber-500 pl-2">
            Nhiệm Vụ Tay
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            {data.step_5_screen_to_paper.handwritten_task}
          </p>
          <div className="border-2 border-dashed border-slate-200 rounded-lg h-24 flex items-center justify-center">
            <p className="text-slate-700 text-xs">Vẽ / ghi vào đây</p>
          </div>
        </div>

        {/* Parent Signature */}
        <div className="mt-4 border-t border-slate-200 pt-3 flex justify-between text-xs text-slate-600">
          <div>
            <p>Chữ ký Phụ Huynh:</p>
            <div className="w-32 h-8 border-b border-slate-400 mt-1" />
          </div>
          <div className="text-right">
            <p>Ngày: ____/____/______</p>
            <p className="mt-1">⭐⭐⭐⭐⭐</p>
          </div>
        </div>
      </div>

      {/* Print button (hidden in print) */}
      <style>{`
        @media screen {
          .print-page { display: grid; grid-template-columns: 1fr 1fr; gap: 0; max-width: 297mm; margin: 0 auto; }
          body { background: #f5f5f5; }
          .print-page { background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        }
      `}</style>
    </div>
  );
}
