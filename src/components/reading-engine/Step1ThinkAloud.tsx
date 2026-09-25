'use client';

import { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, User, Users } from 'lucide-react';
import { Paragraph } from '@/types/article';

interface Step1ThinkAloudProps {
  paragraphs: Paragraph[];
  isParentView?: boolean;
  highlightedWord?: string | null;
  onComplete: () => void;
}

export function Step1ThinkAloud({
  paragraphs,
  isParentView = false,
  highlightedWord,
  onComplete,
}: Step1ThinkAloudProps) {
  const [activeParagraph, setActiveParagraph] = useState(0);
  const [scriptVisible, setScriptVisible] = useState<Record<number, boolean>>({});

  const toggleScript = (idx: number) => {
    setScriptVisible((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNextParagraph = () => {
    if (activeParagraph < paragraphs.length - 1) {
      setActiveParagraph(activeParagraph + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0066ab] flex items-center justify-center shadow-lg">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bước 1: Think-Aloud</h2>
          <p className="text-xs text-slate-600">Đọc to và suy nghĩ cùng nhau</p>
        </div>
        <div className="ml-auto text-sm text-slate-500">
          {activeParagraph + 1} / {paragraphs.length} đoạn
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-4 stagger">
        {paragraphs.map((para, idx) => {
          const isActive = idx === activeParagraph;
          const isDone = idx < activeParagraph;
          const isParentPara = para.actor === 'parent';

          return (
            <div
              key={para.id}
              className={`relative rounded-2xl border transition-all duration-400 ${
                isActive
                  ? 'border-[#0066ab]/40 bg-blue-50 shadow-lg shadow-sm'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50 opacity-80'
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Actor badge */}
              <div className="absolute -top-3 left-4">
                <div
                  className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                    isParentPara
                      ? 'bg-blue-50 border-[#0066ab]/30 text-[#0066ab]'
                      : 'bg-sky-50 border-sky-200 text-sky-700'
                  }`}
                >
                  {isParentPara ? (
                    <Users className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {isParentPara ? 'Cha - Mẹ đọc mẫu' : 'Con tự đọc'}
                </div>
              </div>

              <div className="p-5 pt-6">
                {/* Paragraph text */}
                <p
                  className={`font-reading leading-[1.9] ${
                    isActive ? 'text-slate-900' : isDone ? 'text-slate-600' : 'text-slate-600'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: highlightedWord
                      ? para.text.replace(
                          new RegExp(highlightedWord, 'gi'),
                          `<span class="han-viet-trigger highlighted">$&</span>`
                        )
                      : para.text,
                  }}
                />

                {/* Parent coaching script — only visible in parent view or via toggle */}
                {isActive && (
                  <div className="mt-4 space-y-2">
                    {isParentView ? (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                        <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wider">
                          📋 Script Cha - Mẹ
                        </p>
                        {para.parent_coaching.say_aloud_script && (
                          <p className="text-emerald-800 text-base leading-relaxed font-medium">
                            "{para.parent_coaching.say_aloud_script}"
                          </p>
                        )}
                        {para.parent_coaching.ask_child_prompt && (
                          <div className="mt-3 pt-3 border-t border-emerald-500/10">
                            <p className="text-xs text-emerald-700 font-semibold mb-1">❓ Hỏi con:</p>
                            <p className="text-emerald-800 text-sm">
                              {para.parent_coaching.ask_child_prompt}
                            </p>
                          </div>
                        )}
                        {para.parent_coaching.pedagogical_focus && (
                          <div className="mt-2">
                            <p className="text-xs text-emerald-600 italic">
                              🎯 {para.parent_coaching.pedagogical_focus}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : isParentPara ? (
                      <button
                        onClick={() => toggleScript(idx)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {scriptVisible[idx] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        {scriptVisible[idx] ? 'Ẩn gợi ý' : 'Xem gợi ý đọc'}
                      </button>
                    ) : null}

                    {scriptVisible[idx] && !isParentView && (
                      <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-3 animate-fade-in">
                        <p className="text-xs text-slate-600">
                          {para.parent_coaching.say_aloud_script ||
                            para.parent_coaching.ask_child_prompt}
                        </p>
                      </div>
                    )}

                    {/* Next button */}
                    {!isParentView && (
                      <button
                        onClick={handleNextParagraph}
                        className="mt-2 w-full py-2.5 rounded-xl bg-[#0066ab] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        {activeParagraph < paragraphs.length - 1
                          ? 'Đọc đoạn tiếp →'
                          : '✓ Hoàn thành Bước 1'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Parent: step advance control */}
      {isParentView && (
        <button
          onClick={handleNextParagraph}
          className="w-full py-3 rounded-xl bg-[#0066ab] text-white font-semibold hover:opacity-90 transition-all"
        >
          {activeParagraph < paragraphs.length - 1
            ? 'Chuyển sang đoạn tiếp →'
            : '✓ Hoàn thành Bước 1'}
        </button>
      )}
    </div>
  );
}
