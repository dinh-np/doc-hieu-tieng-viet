'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Dna,
  Bone,
  Scissors,
  GitCompareArrows,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Volume2,
  VolumeX,
  Lightbulb,
  Globe,
  BookOpen,
  Eye,
  EyeOff,
  ArrowLeftRight,
  Award,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import type {
  GrammarExercise,
  GrammarLessonCategory,
  PickCorePayload,
  SliceSlashPayload,
  DragLogicArrowPayload,
} from '@/data/grammar-seed';

interface GrammarClientProps {
  initialExercises: GrammarExercise[];
}

const STORAGE_COMPLETED_KEY = 'doc_hieu_grammar_completed_v1';

const TABS: {
  id: GrammarLessonCategory;
  label: string;
  sublabel: string;
  levelBadge: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}[] = [
  {
    id: 'sentence_core',
    label: '🦴 Khung Xương Câu',
    sublabel: 'Ai/Cái gì + Làm gì/Thế nào?',
    levelBadge: 'Level 1',
    icon: <Bone className="w-4 h-4" />,
  },
  {
    id: 'sentence_slicing',
    label: '✂️ Dao Mổ Tách Câu',
    sublabel: 'Cắt nhỏ câu ghép dài SGK',
    levelBadge: 'Level 2',
    icon: <Scissors className="w-4 h-4" />,
  },
  {
    id: 'connectors_logic',
    label: '🔗 Mũi Tên Logic',
    sublabel: 'Vì... nên | Mặc dù... nhưng',
    levelBadge: 'Level 3',
    icon: <GitCompareArrows className="w-4 h-4" />,
  },
  {
    id: 'topic_comment',
    label: '🔜 Cấu Trúc Đề - Thuyết',
    sublabel: 'Sắp ra mắt',
    levelBadge: 'Level 4',
    icon: <Layers className="w-4 h-4" />,
    isComingSoon: true,
  },
];

// màu sắc các mảnh câu sau khi dùng Dao Mổ cắt
const SLICE_CARD_STYLES = [
  'bg-blue-50/90 border-blue-300 text-blue-950',
  'bg-amber-50/90 border-amber-300 text-amber-950',
  'bg-emerald-50/90 border-emerald-300 text-emerald-950',
  'bg-purple-50/90 border-purple-300 text-purple-950',
];

export function GrammarClient({ initialExercises }: GrammarClientProps) {
  const [activeTab, setActiveTab] = useState<GrammarLessonCategory>('sentence_core');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // ── State cho Mode 1: Khung Xương Câu (pick_core) ───────────────────────────
  const [activeBrush, setActiveBrush] = useState<'subject' | 'predicate'>('subject');
  const [pickedSubjects, setPickedSubjects] = useState<number[]>([]);
  const [pickedPredicates, setPickedPredicates] = useState<number[]>([]);
  const [xrayFilter, setXrayFilter] = useState<boolean>(false);

  // ── State cho Mode 2: Dao Mổ Tách Câu (slice_slash) ─────────────────────────
  const [slashIndices, setSlashIndices] = useState<number[]>([]);

  // ── State cho Mode 3: Mũi Tên Logic (drag_logic_arrow) ──────────────────────
  const [selectedConnector, setSelectedConnector] = useState<string>('');
  const [slotClauseA, setSlotClauseA] = useState<string | null>(null);
  const [slotClauseB, setSlotClauseB] = useState<string | null>(null);
  const [draggedClauseId, setDraggedClauseId] = useState<string | null>(null);

  // ── State Kiểm tra đáp án ───────────────────────────────────────────────────
  const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Tải tiến độ từ LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedIds(parsed);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const markCompleted = useCallback((exerciseId: string) => {
    setCompletedIds((prev) => {
      if (prev.includes(exerciseId)) return prev;
      const next = [...prev, exerciseId];
      try {
        localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // ── Hiệu ứng âm thanh Web Audio API ─────────────────────────────────────────
  const playFeedbackSound = useCallback(
    (type: 'success' | 'error' | 'slice' | 'click') => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'success') {
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.14, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
          });
        } else if (type === 'error') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(210, now);
          osc.frequency.linearRampToValueAtTime(145, now + 0.25);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'slice') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } else {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
        }
      } catch {
        // ignore audio context errors
      }
    },
    [soundEnabled]
  );

  // Lọc danh sách bài tập theo Tab hiện tại
  const filteredExercises = useMemo(
    () => initialExercises.filter((ex) => ex.lesson_category === activeTab),
    [initialExercises, activeTab]
  );

  const currentExercise: GrammarExercise | undefined =
    filteredExercises[selectedExerciseIndex] || filteredExercises[0];

  // Reset trạng thái bài làm mỗi khi đổi bài hoặc đổi Tab
  const resetWorkbench = useCallback(() => {
    setPickedSubjects([]);
    setPickedPredicates([]);
    setActiveBrush('subject');
    setXrayFilter(false);
    setSlashIndices([]);
    setSelectedConnector('');
    setSlotClauseA(null);
    setSlotClauseB(null);
    setCheckStatus('idle');
    setFeedbackMsg('');
  }, []);

  const handleSelectTab = (tabId: GrammarLessonCategory) => {
    setActiveTab(tabId);
    setSelectedExerciseIndex(0);
    resetWorkbench();
  };

  const handleSelectExercise = (idx: number) => {
    setSelectedExerciseIndex(idx);
    resetWorkbench();
  };

  // ── Xử lý tương tác Mode 1: Khung Xương Câu (pick_core) ─────────────────────
  const handleTokenClickPickCore = (tokenIdx: number) => {
    playFeedbackSound('click');
    setCheckStatus('idle');
    setFeedbackMsg('');

    if (activeBrush === 'subject') {
      // Nếu đang nằm ở Vị ngữ thì gỡ khỏi Vị ngữ
      setPickedPredicates((prev) => prev.filter((i) => i !== tokenIdx));
      setPickedSubjects((prev) =>
        prev.includes(tokenIdx) ? prev.filter((i) => i !== tokenIdx) : [...prev, tokenIdx]
      );
    } else {
      setPickedSubjects((prev) => prev.filter((i) => i !== tokenIdx));
      setPickedPredicates((prev) =>
        prev.includes(tokenIdx) ? prev.filter((i) => i !== tokenIdx) : [...prev, tokenIdx]
      );
    }
  };

  // ── Xử lý tương tác Mode 2: Dao Mổ Tách Câu (slice_slash) ───────────────────
  const handleToggleSlash = (afterTokenIdx: number) => {
    playFeedbackSound('slice');
    setCheckStatus('idle');
    setFeedbackMsg('');
    setSlashIndices((prev) =>
      prev.includes(afterTokenIdx)
        ? prev.filter((i) => i !== afterTokenIdx)
        : [...prev, afterTokenIdx].sort((a, b) => a - b)
    );
  };

  // Tính các dòng câu được tách tự động theo vị trí nhát cắt của học sinh
  const liveSlicedSegments = useMemo(() => {
    if (!currentExercise || currentExercise.interactive_type !== 'slice_slash') return [];
    const payload = currentExercise.exercise_payload as SliceSlashPayload;
    const segments: { startIdx: number; endIdx: number; text: string }[] = [];
    let start = 0;
    const sortedCuts = [...slashIndices].sort((a, b) => a - b);

    for (const cutAfterIdx of sortedCuts) {
      const sliceTokens = payload.tokens.slice(start, cutAfterIdx + 1);
      if (sliceTokens.length > 0) {
        segments.push({
          startIdx: start,
          endIdx: cutAfterIdx,
          text: sliceTokens.join(' '),
        });
      }
      start = cutAfterIdx + 1;
    }
    if (start < payload.tokens.length) {
      segments.push({
        startIdx: start,
        endIdx: payload.tokens.length - 1,
        text: payload.tokens.slice(start).join(' '),
      });
    }
    return segments;
  }, [currentExercise, slashIndices]);

  // ── Xử lý tương tác Mode 3: Mũi Tên Logic (drag_logic_arrow) ────────────────
  const handleAssignClauseToSlot = (clauseId: string, targetSlot?: 'A' | 'B') => {
    playFeedbackSound('click');
    setCheckStatus('idle');
    setFeedbackMsg('');

    if (targetSlot === 'A') {
      if (slotClauseB === clauseId) setSlotClauseB(slotClauseA);
      setSlotClauseA(clauseId);
      return;
    }
    if (targetSlot === 'B') {
      if (slotClauseA === clauseId) setSlotClauseA(slotClauseB);
      setSlotClauseB(clauseId);
      return;
    }

    // Nếu click trực tiếp vào thẻ trong kho: tự động lấp vào ô trống A rồi đến B
    if (slotClauseA === clauseId) {
      setSlotClauseA(null);
    } else if (slotClauseB === clauseId) {
      setSlotClauseB(null);
    } else if (!slotClauseA) {
      setSlotClauseA(clauseId);
    } else if (!slotClauseB) {
      setSlotClauseB(clauseId);
    } else {
      setSlotClauseB(clauseId);
    }
  };

  const handleSwapSlots = () => {
    playFeedbackSound('click');
    setCheckStatus('idle');
    setSlotClauseA(slotClauseB);
    setSlotClauseB(slotClauseA);
  };

  // ── Kiểm tra kết quả phẫu thuật (Check Answer) ──────────────────────────────
  const handleCheckAnswer = () => {
    if (!currentExercise) return;

    const sameSet = (a: number[], b: number[]) =>
      a.length === b.length && a.every((val) => b.includes(val));

    if (currentExercise.interactive_type === 'pick_core') {
      const payload = currentExercise.exercise_payload as PickCorePayload;
      if (pickedSubjects.length === 0 || pickedPredicates.length === 0) {
        playFeedbackSound('error');
        setCheckStatus('wrong');
        setFeedbackMsg(
          'Con hãy chọn đủ cả Chủ ngữ (màu xanh dương) và Vị ngữ (màu cam) trước khi bấm Kiểm tra nhé!'
        );
        return;
      }

      const isSubjectRight = sameSet(pickedSubjects, payload.subject_indices);
      const isPredicateRight = sameSet(pickedPredicates, payload.predicate_indices);

      if (isSubjectRight && isPredicateRight) {
        playFeedbackSound('success');
        setCheckStatus('correct');
        setXrayFilter(true); // Tự động bật chế độ Lọc Xương để thấy rõ thành quả!
        setFeedbackMsg(currentExercise.explanation_after);
        markCompleted(currentExercise.id);
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
      } else {
        playFeedbackSound('error');
        setCheckStatus('wrong');
        if (!isSubjectRight && !isPredicateRight) {
          setFeedbackMsg(
            'Chưa đúng khung xương rồi! Gợi ý: Bỏ qua các cụm thời gian/địa điểm ở đầu câu, hãy tìm đúng [Ai/Cái gì?] và [Làm gì/Thế nào?].'
          );
        } else if (!isSubjectRight) {
          setFeedbackMsg(
            'Vị ngữ (màu cam) đã đúng rồi! Nhưng Chủ ngữ (màu xanh dương) vẫn lẫn thành phần phụ hoặc chưa chính xác.'
          );
        } else {
          setFeedbackMsg(
            'Chủ ngữ (màu xanh dương) rất chuẩn! Nhưng Vị ngữ (màu cam) cần chọn đúng cụm hành động/trạng thái chính của Chủ ngữ nhé.'
          );
        }
      }
    } else if (currentExercise.interactive_type === 'slice_slash') {
      const payload = currentExercise.exercise_payload as SliceSlashPayload;
      if (slashIndices.length === 0) {
        playFeedbackSound('error');
        setCheckStatus('wrong');
        setFeedbackMsg(
          'Con hãy bấm vào biểu tượng cây kéo ✂️ ở khe giữa 2 cụm từ để đặt ít nhất 1 nhát cắt nhé!'
        );
        return;
      }

      if (sameSet(slashIndices, payload.slash_after_indices)) {
        playFeedbackSound('success');
        setCheckStatus('correct');
        setFeedbackMsg(currentExercise.explanation_after);
        markCompleted(currentExercise.id);
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
      } else {
        playFeedbackSound('error');
        setCheckStatus('wrong');
        setFeedbackMsg(
          `Vị trí nhát cắt chưa khớp! Câu này cần đúng ${payload.slash_after_indices.length} nhát cắt tại ranh giới giữa các cụm Chủ - Vị độc lập (hoặc ngay trước liên từ "nhưng", "nên", "và", "còn").`
        );
      }
    } else if (currentExercise.interactive_type === 'drag_logic_arrow') {
      const payload = currentExercise.exercise_payload as DragLogicArrowPayload;
      if (!selectedConnector || !slotClauseA || !slotClauseB) {
        playFeedbackSound('error');
        setCheckStatus('wrong');
        setFeedbackMsg(
          'Con hãy chọn đủ [Cặp từ nối Logic], [Vế A] và [Vế B] trên sơ đồ mũi tên trước khi kiểm tra nhé!'
        );
        return;
      }

      const isConnOk = selectedConnector === payload.correct_connector;
      const isClauseAOk = slotClauseA === payload.correct_clause_a_id;
      const isClauseBOk = slotClauseB === payload.correct_clause_b_id;

      if (isConnOk && isClauseAOk && isClauseBOk) {
        playFeedbackSound('success');
        setCheckStatus('correct');
        setFeedbackMsg(currentExercise.explanation_after);
        markCompleted(currentExercise.id);
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.65 } });
      } else {
        playFeedbackSound('error');
        setCheckStatus('wrong');
        if (!isConnOk) {
          setFeedbackMsg(
            'Cặp từ nối chưa khớp với câu gốc! Hãy đọc lại câu văn để chọn đúng cặp từ nối logic.'
          );
        } else {
          setFeedbackMsg(
            'Thứ tự 2 vế bị ngược chiều mũi tên rồi! Hãy bấm nút "Đảo vị trí 2 vế" để xếp đúng [Nguyên nhân / Nhượng bộ] ➔ [Kết quả].'
          );
        }
      }
    }
  };

  const handleNextExercise = () => {
    if (selectedExerciseIndex < filteredExercises.length - 1) {
      handleSelectExercise(selectedExerciseIndex + 1);
    } else {
      handleSelectExercise(0);
    }
  };

  const completionPercentage = Math.round(
    (completedIds.length / Math.max(initialExercises.length, 1)) * 100
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* ── BANNER ĐẦU TRANG & TIẾN ĐỘ PHẪU THUẬT ───────────────────────────── */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0066ab]">
                <Dna className="w-3.5 h-3.5" />
                PHÒNG LAB GIẢI PHẪU CÂU TIẾNG VIỆT LỚP 7
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Phẫu Thuật Cấu Trúc Câu{' '}
                <span className="text-[#0066ab]">(Sentence Anatomy)</span>
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Không học vẹt lý thuyết hàn lâm! Biến những câu văn dài 3 dòng trong SGK Sử, Địa, Văn
                thành <strong>Khung xương Subject + Verb</strong>, dùng <strong>Dao mổ tách câu</strong> và vẽ{' '}
                <strong>Mũi tên Nhân ➔ Quả</strong>.
              </p>
            </div>

            {/* Thống kê Tiến độ & Nút Âm thanh */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <div className="bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Ca phẫu thuật hoàn tất</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">
                      {completedIds.length}/{initialExercises.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      ({completionPercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                className="p-3 rounded-2xl bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 transition-all"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#0066ab]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Thanh tiến độ ngang */}
          <div className="mt-5 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0066ab] to-emerald-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </section>

        {/* ── THANH CHỌN CẤP ĐỘ (4 FILTER TABS) ───────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const tabExercises = initialExercises.filter((e) => e.lesson_category === tab.id);
            const tabDoneCount = tabExercises.filter((e) => completedIds.includes(e.id)).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-[#0066ab] text-white border-[#0066ab] shadow-md scale-[1.01]'
                    : 'bg-white text-slate-800 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.isComingSoon
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-50 text-[#0066ab]'
                    }`}
                  >
                    {tab.levelBadge}
                  </span>
                  {!tab.isComingSoon && (
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-blue-100' : 'text-emerald-600'
                      }`}
                    >
                      {tabDoneCount}/{tabExercises.length} bài
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-sm sm:text-base">{tab.label}</p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isActive ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {tab.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* ── TAB 4: LỘ TRÌNH MỞ RỘNG LEVEL 4 (ĐỀ - THUYẾT & TỪ VỊ) ── */}
        {activeTab === 'topic_comment' ? (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  🔜 LEVEL 4 • LỘ TRÌNH NÂNG CAO (SCALABILITY ROADMAP)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Cấu Trúc Đề - Thuyết & Từ Vị Theo Ngữ Cảnh (Level 4)
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                Dựa trên nghiên cứu: Nguyễn Hiến Lê - Trương Văn Chình & GS. Diệp Quang Ban
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card Đề - Thuyết */}
              <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                    Level 4A • Topic - Comment
                  </span>
                  <span className="text-xs font-semibold text-purple-700">
                    🇬🇧 Topic (As for X) + Comment
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cấu trúc Đề - Thuyết (Đưa đối tượng lên đầu câu làm Đề tài)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tiếng Anh ưu tiên cấu trúc <strong>Subject + Verb</strong>, nhưng tiếng Việt rất hay đưa
                  đối tượng hoặc phạm vi lên đầu câu làm <strong>Phần Đề (Topic)</strong>, rồi mới nhận xét ở{' '}
                  <strong>Phần Thuyết (Comment)</strong> (thường ngăn cách bởi từ <em>thì, là, mà</em>).
                </p>
                <div className="bg-white rounded-xl p-3.5 border border-purple-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-800">
                    Ví dụ SGK: &ldquo;Cái áo này <span className="text-purple-700 font-black">[ĐỀ / TOPIC]</span>{' '}
                    thì đường chỉ rất khéo <span className="text-amber-700 font-black">[THUYẾT / COMMENT]</span>.&rdquo;
                  </p>
                  <p className="text-slate-500">
                    ➔ Giúp con không bị nhầm &ldquo;Cái áo này&rdquo; là chủ ngữ của động từ, mà hiểu đó là
                    Đề tài đang được đem ra bàn luận!
                  </p>
                </div>
              </div>

              {/* Card Level 4 */}
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-lg">
                    Level 4 • Từ tính vs. Từ vị
                  </span>
                  <span className="text-xs font-semibold text-indigo-700">
                    🇬🇧 Part of Speech vs. Syntactic Role
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Từ loại theo ngữ cảnh (Nguyễn Hiến Lê - Trương Văn Chình)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Trong tiếng Việt, từ không biến đổi hình thái (không thêm đuôi <em>-tion, -ly, -ed</em> như
                  tiếng Anh). Một từ có <strong>Từ tính</strong> (bản chất từ loại gốc) nhưng khi vào câu sẽ
                  đảm nhận <strong>Từ vị</strong> (chức vụ cú pháp) khác nhau tùy vị trí!
                </p>
                <div className="bg-white rounded-xl p-3.5 border border-indigo-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-800">
                    Ví dụ từ &ldquo;Đẹp&rdquo;: Vừa làm Vị từ (&ldquo;Phong cảnh rất <u>đẹp</u>&rdquo;), vừa làm
                    Danh từ hóa (&ldquo;Cái <u>đẹp</u> của thiên nhiên&rdquo;).
                  </p>
                  <p className="text-slate-500">
                    ➔ Database `grammar_exercises` đã sẵn sàng trường `level_order = 2` và `4` để mở rộng
                    bài tập ngay trong đợt tiếp theo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => handleSelectTab('sentence_core')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066ab] text-white font-bold text-sm hover:opacity-90 transition-all"
              >
                Quay lại thực hành Khung Xương Câu (Level 1) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        ) : (
          currentExercise && (
            <>
              {/* ── THANH CHỌN BÀI TẬP TRONG TAB HIỆN TẠI ────────────────────────── */}
              <section className="flex items-center gap-2 overflow-x-auto pb-1">
                {filteredExercises.map((ex, idx) => {
                  const isSelected = idx === selectedExerciseIndex;
                  const isDone = completedIds.includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleSelectExercise(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      <span>Câu {idx + 1}</span>
                    </button>
                  );
                })}
              </section>

              {/* ── KHUNG MẸO FEYNMAN & MỎ NEO TIẾNG ANH ────────────────────────── */}
              <section className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-amber-50/60 rounded-2xl p-5 border border-blue-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-700">
                      <Lightbulb className="w-4 h-4" />
                    </span>
                    <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      {currentExercise.title}
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-gray-200">
                    <BookOpen className="w-3.5 h-3.5 text-[#0066ab]" />
                    {currentExercise.source_reference}
                  </span>
                </div>

                {/* Hộp thoại Feynman */}
                <p className="text-sm text-slate-700 leading-relaxed bg-white/80 rounded-xl p-3.5 border border-blue-100">
                  <strong className="text-[#0066ab]">💡 Mẹo Feynman cho con: </strong>
                  {currentExercise.rule_explanation}
                </p>

                {/* Badge Mỏ neo Tiếng Anh */}
                {currentExercise.english_anchor && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm">
                    <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{currentExercise.english_anchor}</span>
                  </div>
                )}
              </section>

              {/* ── KHU VỰC PHẪU THUẬT CÂU (INTERACTIVE WORKBENCH) ──────────────── */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                {/* ==================== MODE 1: KHUNG XƯƠNG CÂU (pick_core) ==================== */}
                {currentExercise.interactive_type === 'pick_core' &&
                  (() => {
                    const payload = currentExercise.exercise_payload as PickCorePayload;
                    return (
                      <div className="space-y-6">
                        {/* Thanh công cụ Cọ Tô Màu & Nút Lọc Xương */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 mr-1">
                              1. Chọn cọ đánh dấu:
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveBrush('subject')}
                              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                                activeBrush === 'subject'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-current" />
                              Chủ ngữ / Chủ từ (Ai? Cái gì?)
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveBrush('predicate')}
                              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                                activeBrush === 'predicate'
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-current" />
                              Vị ngữ / Vị từ (Làm gì? Thế nào?)
                            </button>
                          </div>

                          {/* Nút Lọc Xương (X-Ray) */}
                          <button
                            type="button"
                            onClick={() => setXrayFilter((x) => !x)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                              xrayFilter
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-slate-100 text-slate-700 border-gray-300 hover:bg-slate-200'
                            }`}
                          >
                            {xrayFilter ? (
                              <>
                                <EyeOff className="w-4 h-4 text-emerald-400" />
                                Đang bật Lọc Xương (X-Ray)
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 text-[#0066ab]" />
                                🦴 Bấm &ldquo;Lọc Xương&rdquo;
                              </>
                            )}
                          </button>
                        </div>

                        {/* Bàn mổ các khối từ (Tokens) */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-500">
                            2. Chạm vào từng cụm từ bên dưới để đánh dấu{' '}
                            <span className="text-blue-600 font-bold">Chủ ngữ (Xanh dương)</span> và{' '}
                            <span className="text-amber-600 font-bold">Vị ngữ (Cam)</span>:
                          </p>

                          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 leading-relaxed">
                            {payload.tokens.map((token, idx) => {
                              const isSubject = pickedSubjects.includes(idx);
                              const isPredicate = pickedPredicates.includes(idx);
                              const isCorePicked = isSubject || isPredicate;
                              const isFaded = xrayFilter && !isCorePicked;

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleTokenClickPickCore(idx)}
                                  className={`group relative px-4 py-3 rounded-2xl border-2 text-left transition-all duration-300 ${
                                    isSubject
                                      ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.03]'
                                      : isPredicate
                                      ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.03]'
                                      : 'bg-white text-slate-800 border-gray-200 hover:border-blue-400 hover:shadow-sm'
                                  } ${
                                    isFaded
                                      ? 'opacity-25 scale-95 line-through decoration-slate-400 bg-gray-100'
                                      : ''
                                  }`}
                                >
                                  {/* Nhãn vai trò trên đỉnh khối từ */}
                                  {isSubject && (
                                    <span className="block text-[10px] font-black uppercase tracking-wider text-blue-100 mb-0.5">
                                      🔵 CHỦ NGỮ (SUBJECT)
                                    </span>
                                  )}
                                  {isPredicate && (
                                    <span className="block text-[10px] font-black uppercase tracking-wider text-amber-100 mb-0.5">
                                      🟠 VỊ NGỮ (PREDICATE)
                                    </span>
                                  )}
                                  {!isCorePicked && xrayFilter && (
                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                                      Thành phần phụ (Đã lọc)
                                    </span>
                                  )}

                                  <span className="text-base sm:text-lg font-bold block">
                                    {token}
                                  </span>

                                  {/* Hiển thị giải thích vai trò ngữ pháp sau khi hoàn thành */}
                                  {checkStatus === 'correct' && payload.token_roles?.[idx] && (
                                    <span
                                      className={`block text-[11px] mt-1 font-medium ${
                                        isCorePicked ? 'text-white/90' : 'text-slate-500'
                                      }`}
                                    >
                                      ➔ {payload.token_roles[idx]}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* ==================== MODE 2: DAO MỔ TÁCH CÂU (slice_slash) ==================== */}
                {currentExercise.interactive_type === 'slice_slash' &&
                  (() => {
                    const payload = currentExercise.exercise_payload as SliceSlashPayload;
                    return (
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                          <p className="text-xs sm:text-sm font-semibold text-slate-600">
                            ✂️ Di chuột hoặc chạm vào <strong>khe trống giữa 2 cụm từ</strong> để đặt nhát
                            cắt <span className="text-rose-600 font-black">/</span> tách câu ghép dài:
                          </p>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Đã đặt {slashIndices.length} nhát cắt
                          </span>
                        </div>

                        {/* Khu vực bấm kéo cắt câu */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-y-3">
                          {payload.tokens.map((token, idx) => {
                            const isCutAfter = slashIndices.includes(idx);
                            const isLast = idx === payload.tokens.length - 1;

                            return (
                              <React.Fragment key={idx}>
                                <span className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-slate-800 font-semibold text-base shadow-2xs">
                                  {token}
                                </span>

                                {!isLast && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSlash(idx)}
                                    title="Bấm để đặt hoặc gỡ nhát cắt /"
                                    className={`mx-1.5 px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1 font-black text-sm ${
                                      isCutAfter
                                        ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-110'
                                        : 'bg-white/80 text-slate-400 border-dashed border-gray-300 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50'
                                    }`}
                                  >
                                    <Scissors className="w-3.5 h-3.5" />
                                    <span>/</span>
                                  </button>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Kết quả tách dòng trực tiếp ngay khi bấm cắt */}
                        <div className="space-y-2.5">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            📐 Các mệnh đề sau khi tách ({liveSlicedSegments.length} dòng):
                          </p>
                          <div className="space-y-2">
                            {liveSlicedSegments.map((seg, sIdx) => (
                              <div
                                key={sIdx}
                                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                                  SLICE_CARD_STYLES[sIdx % SLICE_CARD_STYLES.length]
                                }`}
                              >
                                <span className="px-2.5 py-1 rounded-lg bg-white/80 text-xs font-black shrink-0 border border-current/20">
                                  Mảnh {sIdx + 1}
                                </span>
                                <p className="font-bold text-base leading-relaxed">{seg.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* ==================== MODE 3: MŨI TÊN LOGIC (drag_logic_arrow) ==================== */}
                {currentExercise.interactive_type === 'drag_logic_arrow' &&
                  (() => {
                    const payload = currentExercise.exercise_payload as DragLogicArrowPayload;
                    const clauseAObj = payload.clause_pool.find((c) => c.id === slotClauseA);
                    const clauseBObj = payload.clause_pool.find((c) => c.id === slotClauseB);

                    return (
                      <div className="space-y-6">
                        {/* Câu văn gốc cần giải phẫu */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Câu ghép SGK cần giải phẫu logic:
                          </span>
                          <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
                            &ldquo;{currentExercise.original_sentence}&rdquo;
                          </p>
                        </div>

                        {/* Bước 1: Chọn cặp từ nối */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-600">
                            1. Chọn Cặp từ nối Logic xuất hiện trong câu:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {payload.connector_options.map((conn) => {
                              const active = selectedConnector === conn;
                              return (
                                <button
                                  key={conn}
                                  type="button"
                                  onClick={() => {
                                    playFeedbackSound('click');
                                    setCheckStatus('idle');
                                    setSelectedConnector(conn);
                                  }}
                                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                                    active
                                      ? 'bg-[#0066ab] text-white border-[#0066ab] shadow-sm'
                                      : 'bg-white text-slate-700 border-gray-200 hover:border-blue-300'
                                  }`}
                                >
                                  🔗 {conn}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bước 2: Kho mảnh vế câu (chạm hoặc kéo thả) */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-600">
                            2. Chạm vào mệnh đề bên dưới (hoặc kéo thả) để lắp vào sơ đồ Mũi Tên Logic:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {payload.clause_pool.map((clause) => {
                              const assignedTo =
                                slotClauseA === clause.id
                                  ? 'Vế A (Trước mũi tên)'
                                  : slotClauseB === clause.id
                                  ? 'Vế B (Sau mũi tên)'
                                  : null;

                              return (
                                <div
                                  key={clause.id}
                                  draggable
                                  onDragStart={() => setDraggedClauseId(clause.id)}
                                  onClick={() => handleAssignClauseToSlot(clause.id)}
                                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-1.5 ${
                                    assignedTo
                                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                                      : 'bg-white border-gray-200 hover:border-blue-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                      {clause.tag}
                                    </span>
                                    {assignedTo ? (
                                      <span className="text-[11px] font-extrabold text-[#0066ab]">
                                        ✓ Đã lắp vào {assignedTo}
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-slate-400">
                                        Chạm để lắp vào sơ đồ
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-bold text-sm sm:text-base text-slate-800">
                                    {clause.text}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Sơ đồ Mũi Tên Nhân - Quả / Tương Phản */}
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 via-white to-emerald-50/60 border-2 border-blue-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0066ab]">
                              📐 SƠ ĐỒ MŨI TÊN LOGIC ({payload.arrow_label})
                            </span>
                            <button
                              type="button"
                              onClick={handleSwapSlots}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5 text-[#0066ab]" />
                              Đảo vị trí 2 vế
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
                            {/* Ô Vế A */}
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (draggedClauseId) handleAssignClauseToSlot(draggedClauseId, 'A');
                              }}
                              className={`lg:col-span-4 min-h-24 p-4 rounded-2xl border-2 transition-all flex flex-col justify-center ${
                                clauseAObj
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                  : 'bg-white/90 border-dashed border-blue-300 text-slate-400'
                              }`}
                            >
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                                  clauseAObj ? 'text-blue-100' : 'text-blue-600'
                                }`}
                              >
                                {payload.relation_type === 'contrast'
                                  ? 'VẾ A: THỬ THÁCH / NHƯỢNG BỘ'
                                  : 'VẾ A: NGUYÊN NHÂN (CAUSE)'}
                              </span>
                              <p className="text-sm font-bold">
                                {clauseAObj
                                  ? clauseAObj.text
                                  : 'Chạm hoặc kéo mệnh đề thứ nhất vào đây...'}
                              </p>
                            </div>

                            {/* Mũi tên & Cặp từ nối ở giữa */}
                            <div className="lg:col-span-3 flex flex-col items-center justify-center py-2 text-center">
                              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
                                {selectedConnector || 'Chọn từ nối...'}
                              </span>
                              <div className="my-1.5 flex items-center gap-1 text-[#0066ab] font-black text-lg">
                                <span>━━━━━━</span>
                                <ArrowRight className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">
                                {payload.arrow_label}
                              </span>
                            </div>

                            {/* Ô Vế B */}
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (draggedClauseId) handleAssignClauseToSlot(draggedClauseId, 'B');
                              }}
                              className={`lg:col-span-4 min-h-24 p-4 rounded-2xl border-2 transition-all flex flex-col justify-center ${
                                clauseBObj
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                  : 'bg-white/90 border-dashed border-emerald-300 text-slate-400'
                              }`}
                            >
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                                  clauseBObj ? 'text-emerald-100' : 'text-emerald-700'
                                }`}
                              >
                                {payload.relation_type === 'contrast'
                                  ? 'VẾ B: Ý CHÍNH VƯỢT LÊN'
                                  : 'VẾ B: KẾT QUẢ (EFFECT)'}
                              </span>
                              <p className="text-sm font-bold">
                                {clauseBObj
                                  ? clauseBObj.text
                                  : 'Chạm hoặc kéo mệnh đề thứ hai vào đây...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* ── THANH NÚT HÀNH ĐỘNG (KIỂM TRA / LÀM LẠI / CÂU TIẾP THEO) ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetWorkbench}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-slate-700 font-bold text-xs sm:text-sm hover:bg-gray-200 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Làm lại ca này
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCheckAnswer}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0066ab] text-white font-extrabold text-sm sm:text-base hover:opacity-95 active:scale-[0.99] transition-all shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      Kiểm tra Phẫu thuật
                    </button>

                    <button
                      type="button"
                      onClick={handleNextExercise}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all"
                    >
                      Câu tiếp theo
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ── THÔNG BÁO PHẢN HỒI & BẢNG SO SÁNH "TRƯỚC vs SAU PHẪU THUẬT" ── */}
                {checkStatus !== 'idle' && (
                  <div
                    className={`rounded-2xl p-5 border-2 space-y-4 transition-all ${
                      checkStatus === 'correct'
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/80 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {checkStatus === 'correct' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="font-black text-base">
                          {checkStatus === 'correct'
                            ? '🎉 Phẫu thuật câu thành công xuất sắc!'
                            : '🔎 Cần chỉnh lại một chút!'}
                        </p>
                        <p className="text-sm leading-relaxed">{feedbackMsg}</p>
                      </div>
                    </div>

                    {/* Bảng đối chiếu TRƯỚC PHẪU THUẬT vs SAU PHẪU THUẬT */}
                    {checkStatus === 'correct' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-white/90 border border-gray-200 space-y-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            📄 TRƯỚC PHẪU THUẬT (CÂU DÀI SGK)
                          </span>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            &ldquo;{currentExercise.original_sentence}&rdquo;
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-600 text-white space-y-1.5 shadow-sm">
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                            ✨ SAU PHẪU THUẬT (CÔNG THỨC RÚT GỌN DỄ HIỂU)
                          </span>
                          {currentExercise.interactive_type === 'pick_core' && (
                            <p className="text-sm sm:text-base font-extrabold leading-relaxed">
                              {(currentExercise.exercise_payload as PickCorePayload).core_summary}
                            </p>
                          )}
                          {currentExercise.interactive_type === 'slice_slash' && (
                            <ul className="text-xs sm:text-sm font-bold space-y-1">
                              {(
                                currentExercise.exercise_payload as SliceSlashPayload
                              ).sliced_clauses.map((c, i) => (
                                <li key={i}>
                                  • <u>{c.label}</u>: {c.text}
                                </li>
                              ))}
                            </ul>
                          )}
                          {currentExercise.interactive_type === 'drag_logic_arrow' && (
                            <p className="text-sm sm:text-base font-extrabold leading-relaxed">
                              {
                                (currentExercise.exercise_payload as DragLogicArrowPayload)
                                  .logic_formula
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          )
        )}
      </main>
    </div>
  );
}

