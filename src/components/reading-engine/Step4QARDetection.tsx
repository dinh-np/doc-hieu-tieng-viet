'use client';

import { useState, useEffect, useRef } from 'react';
import { HighlighterIcon, CheckCircle2, XCircle } from 'lucide-react';
import { QARQuestion } from '@/types/article';
import confetti from 'canvas-confetti';

interface Step4QARDetectionProps {
  questions: QARQuestion[];
  isParentView?: boolean;
  onAnswerSubmit?: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onComplete: () => void;
}

const LEVEL_CONFIG = {
  right_there: {
    color: 'bg-amber-500',
    lightBg: 'bg-amber-100 border-amber-200',
    text: 'text-amber-900',
    label: 'Đọc Thẳng',
    emoji: '🟡',
    description: 'Câu trả lời có ngay trong văn bản',
  },
  think_and_search: {
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-100 border-emerald-200',
    text: 'text-emerald-900',
    label: 'Suy Luận',
    emoji: '🟢',
    description: 'Tổng hợp thông tin từ nhiều đoạn',
  },
  author_and_me: {
    color: 'bg-blue-500',
    lightBg: 'bg-blue-100 border-blue-200',
    text: 'text-blue-900',
    label: 'Suy Nghĩ Sâu',
    emoji: '🔵',
    description: 'Kết hợp văn bản + suy nghĩ của em',
  },
} as const;

export function Step4QARDetection({
  questions,
  isParentView = false,
  onAnswerSubmit,
  onComplete,
}: Step4QARDetectionProps) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [openEndedTexts, setOpenEndedTexts] = useState<Record<string, string>>({});
  const allDone = questions.every((q) => submitted.has(q.id));
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCorrect = () => {
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659, ctx.currentTime);
      osc.frequency.setValueAtTime(783, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1046, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch { /* ok */ }
  };

  const handleSelect = (qId: string, idx: number) => {
    if (submitted.has(qId)) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleSubmit = (q: QARQuestion) => {
    if (submitted.has(q.id)) return;
    const answer = answers[q.id];
    if (answer === null || answer === undefined) return;

    const isCorrect = q.correct_index !== undefined && answer === q.correct_index;
    setSubmitted((prev) => new Set([...prev, q.id]));
    onAnswerSubmit?.(q.id, answer as number, isCorrect);

    if (isCorrect) {
      playCorrect();
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b'],
      });
    }
  };

  const handleOpenEndedSubmit = (q: QARQuestion) => {
    setSubmitted((prev) => new Set([...prev, q.id]));
    onAnswerSubmit?.(q.id, 0, true);
  };

  useEffect(() => {
    if (allDone && questions.length > 0) {
      const t = setTimeout(onComplete, 1500);
      return () => clearTimeout(t);
    }
  }, [allDone, questions.length, onComplete]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-[#0066ab]/30 flex items-center justify-center">
          <HighlighterIcon className="w-5 h-5 text-[#0066ab]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bước 4: Câu Hỏi QAR</h2>
          <p className="text-xs text-slate-600">3 cấp độ tư duy</p>
        </div>
        <div className="ml-auto text-sm text-slate-500">
          {submitted.size}/{questions.length} câu
        </div>
      </div>

      {/* Level legend */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => (
          <div
            key={key}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.lightBg} ${cfg.text}`}
          >
            <span>{cfg.emoji}</span>
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4 stagger">
        {questions.map((q, qi) => {
          const cfg = LEVEL_CONFIG[q.level];
          const isSubmitted = submitted.has(q.id);
          const selected = answers[q.id] ?? null;
          const isCorrect = selected === q.correct_index;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 transition-all ${
                isSubmitted && isCorrect
                  ? 'border-emerald-300 bg-emerald-950/20'
                  : isSubmitted && !q.open_ended
                  ? 'border-red-500/20 bg-red-950/10'
                  : cfg.lightBg
              }`}
              style={{ animationDelay: `${qi * 100}ms` }}
            >
              {/* Level badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>
                  {cfg.label}
                </span>
                <span className="text-xs text-slate-600">— {cfg.description}</span>
              </div>

              {/* Question */}
              <p className="text-slate-900 font-medium leading-relaxed mb-4">{q.question}</p>

              {/* Text anchor hint */}
              {q.text_anchor && isParentView && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-500/20">
                  <p className="text-xs text-amber-400">
                    📌 Gợi ý tìm: <em>"{q.text_anchor}"</em>
                  </p>
                </div>
              )}

              {/* MCQ Options */}
              {q.options && !q.open_ended && (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi;
                    const showResult = isSubmitted;
                    const isThisCorrect = oi === q.correct_index;

                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(q.id, oi)}
                        disabled={isSubmitted}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                          showResult && isThisCorrect
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                            : showResult && isSelected && !isThisCorrect
                            ? 'border-red-500 bg-red-950/30 text-red-300'
                            : isSelected
                            ? 'border-indigo-500 bg-blue-50 text-[#0066ab]'
                            : 'border-gray-200 bg-gray-50 text-slate-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                            showResult && isThisCorrect
                              ? 'border-emerald-500 text-emerald-400'
                              : showResult && isSelected && !isThisCorrect
                              ? 'border-red-500 text-red-400'
                              : isSelected
                              ? 'border-indigo-500 text-[#0066ab]'
                              : 'border-slate-600 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                        {showResult && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                        )}
                        {showResult && isSelected && !isThisCorrect && (
                          <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Open-ended */}
              {q.open_ended && !isParentView && (
                <div className="space-y-3">
                  <textarea
                    disabled={isSubmitted}
                    className="w-full rounded-xl bg-gray-100 border border-gray-200 text-slate-800 p-3 text-sm resize-none focus:outline-none focus:border-purple-500/50 disabled:opacity-60"
                    placeholder="Viết câu trả lời của em vào đây..."
                    rows={3}
                    value={openEndedTexts[q.id] || ''}
                    onChange={(e) =>
                      setOpenEndedTexts((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                  />
                  {isParentView && q.evaluation_criteria && (
                    <div className="rounded-lg bg-white shadow-sm p-3">
                      <p className="text-xs text-slate-600">
                        ✅ Tiêu chí đánh giá: {q.evaluation_criteria}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isParentView && q.open_ended && q.evaluation_criteria && (
                <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-3 mt-2">
                  <p className="text-xs font-semibold text-slate-600 mb-1">✅ Tiêu chí đánh giá:</p>
                  <p className="text-xs text-slate-700">{q.evaluation_criteria}</p>
                </div>
              )}

              {/* Submit button */}
              {!isSubmitted && !isParentView && (
                <button
                  onClick={() =>
                    q.open_ended ? handleOpenEndedSubmit(q) : handleSubmit(q)
                  }
                  disabled={!q.open_ended && selected === null}
                  className={`mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    q.open_ended || selected !== null
                      ? 'bg-[#0066ab] text-white hover:opacity-90'
                      : 'bg-gray-50 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Nộp câu trả lời
                </button>
              )}

              {isSubmitted && !q.open_ended && (
                <div
                  className={`mt-3 text-sm font-semibold text-center ${
                    isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng — xem lại văn bản'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="rounded-xl bg-blue-50 border border-[#0066ab]/30 p-4 text-center animate-fade-in">
          <p className="text-3xl mb-2">🏆</p>
          <p className="text-[#0066ab] font-bold text-lg">Hoàn thành QAR!</p>
          <p className="text-[#0066ab] text-xs mt-1">Chuyển sang Bước 5 cuối cùng...</p>
        </div>
      )}
    </div>
  );
}
