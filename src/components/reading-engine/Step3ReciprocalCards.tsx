'use client';

import { useState } from 'react';
import { FlipHorizontal, Lightbulb, HelpCircle, Search, AlignLeft } from 'lucide-react';
import { ReciprocalCard } from '@/types/article';

interface Step3ReciprocalCardsProps {
  cards: ReciprocalCard[];
  isParentView?: boolean;
  onComplete: () => void;
}

const ROLE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; gradient: string; bg: string }
> = {
  Predict: {
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-950/30 border-amber-500/30',
  },
  Clarify: {
    icon: <Search className="w-6 h-6" />,
    color: 'text-sky-400',
    gradient: 'from-sky-500 to-blue-500',
    bg: 'bg-sky-950/30 border-sky-500/30',
  },
  Question: {
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-950/30 border-purple-500/30',
  },
  Summarize: {
    icon: <AlignLeft className="w-6 h-6" />,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-950/30 border-emerald-300',
  },
};

const ROLE_LABELS: Record<string, string> = {
  Predict: 'Dự Đoán',
  Clarify: 'Làm Rõ',
  Question: 'Đặt Câu Hỏi',
  Summarize: 'Tóm Tắt',
};

export function Step3ReciprocalCards({
  cards,
  isParentView = false,
  onComplete,
}: Step3ReciprocalCardsProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [done, setDone] = useState<Set<number>>(new Set());

  const handleFlip = (idx: number) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDone = (idx: number) => {
    setDone((prev) => new Set([...prev, idx]));
    if (done.size + 1 >= cards.length) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <FlipHorizontal className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bước 3: Dạy Ngược</h2>
          <p className="text-xs text-slate-600">Lật thẻ và thực hiện nhiệm vụ</p>
        </div>
        <div className="ml-auto text-sm text-slate-500">
          {done.size}/{cards.length} thẻ
        </div>
      </div>

      {!isParentView && (
        <div className="flex items-center gap-1.5 mb-4 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
          <span className="text-xs font-bold">Huấn luyện viên Chiến thuật: AI gợi mở tư duy, không giải bài hộ</span>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {cards.map((card, idx) => {
          const config = ROLE_CONFIG[card.role];
          const isFlipped = flipped[idx] || isParentView;
          const isDone = done.has(idx);

          return (
            <div key={idx} className={`card-flip-container relative ${isFlipped ? 'z-20' : 'z-0'}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <div
                className={`card-flip-inner relative w-full h-auto min-h-[220px] md:min-h-[260px] cursor-pointer rounded-2xl ${isFlipped ? 'flipped' : ''}`}
                onClick={() => !isParentView && handleFlip(idx)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front face */}
                <div
                  className={`card-front rounded-2xl border ${config.bg} p-5 flex flex-col items-center justify-center gap-3 text-center absolute inset-0 w-full h-full`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-[#0066AB]">{config.icon}</div>
                  <p className="text-xl font-bold text-[#0066AB]">
                    {ROLE_LABELS[card.role]}
                  </p>
                  <p className="text-xs text-slate-500">Chạm để xem nhiệm vụ</p>
                </div>

                {/* Back face */}
                <div
                  className={`card-back rounded-2xl border ${config.bg} p-4 flex flex-col gap-3 relative w-full h-auto min-h-[220px] md:min-h-[260px]`}
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-[#0066AB]">{config.icon}</div>
                    <span className="text-xs font-bold text-[#0066AB] uppercase tracking-wider">
                      {ROLE_LABELS[card.role]}
                    </span>
                  </div>
                  <div
                    className="flex flex-col flex-1 mt-1"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm text-slate-800 leading-relaxed flex-1">
                      {card.task.replace(/\bbố\b/gi, (m) => (m === 'Bố' ? 'Cha' : 'cha'))}
                    </p>

                    {!isParentView && (
                      <p className="text-[10px] text-slate-500 mt-2 mb-2 bg-slate-50 p-1.5 rounded border border-slate-100 font-medium leading-relaxed">
                        💡 Con thử vận dụng 3 chiến thuật: (1) Chiết tự từ gốc Hán-Việt, (2) Tìm manh mối ngữ cảnh trong đoạn trước, (3) Tóm tắt theo nguyên nhân - kết quả.
                      </p>
                    )}

                    {!isParentView && (
                      <div className="space-y-3 mt-auto pt-3">
                        <textarea
                          className="w-full rounded-lg bg-gray-100 border border-gray-200 text-xs text-slate-700 p-2 min-h-[70px] resize-none overflow-hidden leading-relaxed focus:outline-none focus:border-indigo-500/50"
                          placeholder="Ghi câu trả lời của con..."
                          rows={2}
                          value={responses[idx] || ''}
                          onChange={(e) =>
                            setResponses((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          onInput={(e) => {
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                          }}
                        />
                        {!isDone && (
                          <button
                            onClick={() => handleDone(idx)}
                            className={`w-full py-1.5 rounded-lg bg-gradient-to-r ${config.gradient} text-white text-xs font-semibold hover:opacity-90 transition-all`}
                          >
                            ✓ Xong
                          </button>
                        )}
                        {isDone && (
                          <div className="text-center text-xs text-emerald-400 font-semibold">
                            ✓ Hoàn thành!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isParentView && done.size >= cards.length && (
        <div className="rounded-xl bg-emerald-950/50 border border-emerald-300 p-4 text-center animate-fade-in">
          <p className="text-2xl mb-1">🌟</p>
          <p className="text-emerald-300 font-bold">Xuất sắc! Hoàn thành tất cả thẻ!</p>
        </div>
      )}

      {isParentView && (
        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl bg-[#0066ab] text-white font-semibold hover:opacity-90 transition-all"
        >
          Chuyển sang Bước 4 →
        </button>
      )}
    </div>
  );
}
