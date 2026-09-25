'use client';

import { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { HanVietCompound } from '@/types/dictionary';
import confetti from 'canvas-confetti';

interface MiniEtymologyQuizProps {
  compound: HanVietCompound;
  onUnlock?: () => void;
}

export function MiniEtymologyQuiz({ compound, onUnlock }: MiniEtymologyQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const quiz = compound.quiz_data;

  const correctIndex = quiz.options.findIndex((o) => o.is_correct);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);

    const isCorrect = quiz.options[selected]?.is_correct;
    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#a855f7'],
      });
      setTimeout(() => {
        setUnlocked(true);
        onUnlock?.();
      }, 600);
    }
  };

  if (unlocked) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-300 p-5 text-center animate-fade-in">
        <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-emerald-300 font-bold text-lg">
          "{compound.word}" đã thêm vào Vườn Từ Vựng!
        </p>
        <p className="text-emerald-500 text-sm mt-1">🌱 +1 từ mới được trồng</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#0066ab]/30 bg-blue-50 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-[#0066ab]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0066ab]">Mini Quiz</p>
          <p className="text-xs text-slate-500">Trả lời đúng để mở khóa từ này!</p>
        </div>
      </div>

      {/* Question */}
      <p className="text-slate-800 font-medium leading-relaxed">{quiz.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const isSelected = selected === i;
          const isThisCorrect = opt.is_correct;
          const showResult = submitted;

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                showResult && isThisCorrect
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                  : showResult && isSelected && !isThisCorrect
                  ? 'border-red-500 bg-red-950/30 text-red-300'
                  : isSelected
                  ? 'border-violet-500 bg-blue-50 text-[#0066ab]'
                  : 'border-gray-200 bg-gray-50 text-slate-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt.text}
              {showResult && isThisCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
              )}
              {showResult && isSelected && !isThisCorrect && (
                <XCircle className="w-4 h-4 text-red-400 ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {submitted && (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-3 animate-fade-in">
          <p className="text-xs font-semibold text-slate-600 mb-1">💡 Giải thích:</p>
          <p className="text-sm text-slate-700">{quiz.explanation}</p>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
            selected !== null
              ? 'bg-[#0066ab] text-white hover:opacity-90'
              : 'bg-gray-50 text-slate-600 cursor-not-allowed'
          }`}
        >
          Kiểm tra ngay
        </button>
      )}

      {submitted && !quiz.options[selected ?? -1]?.is_correct && (
        <button
          onClick={() => { setSelected(null); setSubmitted(false); }}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-slate-600 hover:text-slate-800 hover:bg-gray-50 transition-all"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
