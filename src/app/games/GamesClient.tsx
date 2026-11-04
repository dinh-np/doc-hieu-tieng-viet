'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Puzzle,
  Palette,
  Swords,
  Trophy,
  Flame,
  Timer,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Stethoscope,
  Zap,
  BookOpen,
} from 'lucide-react';
import {
  HanVietCompound,
  HanVietRoot,
  ThuanVietEntry,
  THUAN_VIET_TYPE_LABELS,
} from '@/types/dictionary';

export interface EnrichedHanVietGameItem extends HanVietCompound {
  root1: HanVietRoot;
  root2: HanVietRoot;
}

interface GamesClientProps {
  hanVietItems: EnrichedHanVietGameItem[];
  thuanVietItems: ThuanVietEntry[];
}

type GameMode = 'morpheme-forge' | 'word-painter' | 'battle-arena';
type ArenaSubMode = 'flashcard-blitz' | 'sentence-doctor';

const HIGHSCORE_STORAGE_KEY = 'doc_hieu_vocab_arena_highscores_v1';

interface HighScores {
  'morpheme-forge': number;
  'word-painter': number;
  'battle-arena': number;
}

// ─── WEB AUDIO SOUND EFFECTS ──────────────────────────────────────────────────

function playGameSound(type: 'correct' | 'wrong' | 'click' | 'victory', muted: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.14, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.18);
      });
    } else if (type === 'wrong') {
      [260, 195].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.1, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.18);
      });
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.15, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.25);
      });
    }
  } catch {
    // Ignore audio context errors on restricted browsers
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function maskTargetWord(sentence: string, word: string): string {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  if (regex.test(sentence)) {
    return sentence.replace(regex, ' [ ___ ] ');
  }
  return `${sentence} (Từ cần điền: [ ___ ])`;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function GamesClient({ hanVietItems, thuanVietItems }: GamesClientProps) {
  const [mode, setMode] = useState<GameMode>('morpheme-forge');
  const [arenaSubMode, setArenaSubMode] = useState<ArenaSubMode>('flashcard-blitz');
  const [muted, setMuted] = useState(false);

  // Gamification states
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [highScores, setHighScores] = useState<HighScores>({
    'morpheme-forge': 0,
    'word-painter': 0,
    'battle-arena': 0,
  });

  // Load HighScores from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHighScores((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const updateScoreAndRecord = useCallback(
    (pointsToAdd: number, newStreak: number) => {
      setScore((prev) => {
        const nextScore = Math.max(0, prev + pointsToAdd);
        setHighScores((prevHigh) => {
          if (nextScore > (prevHigh[mode] || 0)) {
            const updated = { ...prevHigh, [mode]: nextScore };
            try {
              localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(updated));
            } catch {
              // Ignore
            }
            return updated;
          }
          return prevHigh;
        });
        return nextScore;
      });
      setStreak(newStreak);
      setBestStreak((prevBest) => Math.max(prevBest, newStreak));
    },
    [mode]
  );

  // ── MODE 1 STATE: THỢ RÈN HÌNH VỊ (MORPHEME FORGE) ─────────────────────────
  const [forgeSeed, setForgeSeed] = useState(0);
  const forgeQuestions = useMemo(() => {
    void forgeSeed;
    return shuffleArray(hanVietItems).slice(0, 15);
  }, [hanVietItems, forgeSeed]);

  const currentForgeItem = forgeQuestions[questionIndex % Math.max(1, forgeQuestions.length)];

  const forgePool = useMemo(() => {
    if (!currentForgeItem) return [];
    const others = shuffleArray(
      hanVietItems.filter((item) => item.slug !== currentForgeItem.slug)
    ).slice(0, 2);

    const tiles = [
      { id: `r1-${currentForgeItem.slug}`, root: currentForgeItem.root1, role: 'correct-1' },
      { id: `r2-${currentForgeItem.slug}`, root: currentForgeItem.root2, role: 'correct-2' },
      ...others.flatMap((o, idx) => [
        { id: `d1-${idx}-${o.slug}`, root: o.root1, role: 'distractor' },
        { id: `d2-${idx}-${o.slug}`, root: o.root2, role: 'distractor' },
      ]),
    ];
    return shuffleArray(tiles);
  }, [currentForgeItem, hanVietItems]);

  const [slot1Tile, setSlot1Tile] = useState<{ id: string; root: HanVietRoot } | null>(null);
  const [slot2Tile, setSlot2Tile] = useState<{ id: string; root: HanVietRoot } | null>(null);
  const [forgeFeedback, setForgeFeedback] = useState<'correct' | 'wrong' | null>(null);

  // ── MODE 2 STATE: BỨC HỌA NGÔN TỪ (WORD PAINTER) ───────────────────────────
  const [painterSeed, setPainterSeed] = useState(0);
  const [painterStyle, setPainterStyle] = useState<'mental_image' | 'cloze'>('mental_image');
  const painterQuestions = useMemo(() => {
    void painterSeed;
    return shuffleArray(thuanVietItems);
  }, [thuanVietItems, painterSeed]);

  const currentPainterItem = painterQuestions[questionIndex % Math.max(1, painterQuestions.length)];

  const painterOptions = useMemo(() => {
    if (!currentPainterItem) return [];
    const distractors = shuffleArray(
      thuanVietItems.filter((t) => t.word !== currentPainterItem.word)
    ).slice(0, 3);
    return shuffleArray([currentPainterItem, ...distractors]);
  }, [currentPainterItem, thuanVietItems]);

  const [painterSelected, setPainterSelected] = useState<string | null>(null);

  // ── MODE 3 STATE: ĐẤU TRƯỜNG THỰC CHIẾN (UNION MIXED ARENA) ────────────────
  const [arenaSeed, setArenaSeed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [arenaSelected, setArenaSelected] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  interface UnifiedArenaQuestion {
    id: string;
    source: 'Hán - Việt' | 'Thuần Việt';
    word: string;
    meaning: string;
    english: string;
    example: string;
    wrongWordInSentence: string;
    options: Array<{
      id: string;
      word: string;
      meaning: string;
      english: string;
      isCorrect: boolean;
    }>;
  }

  const arenaDeck = useMemo<UnifiedArenaQuestion[]>(() => {
    void arenaSeed;
    const unifiedPool = [
      ...hanVietItems.map((hv) => ({
        id: `hv-${hv.slug}`,
        source: 'Hán - Việt' as const,
        word: hv.word,
        meaning: hv.full_meaning,
        english: hv.english_equivalent || ' Vocabulary',
        example: hv.example_sentence,
      })),
      ...thuanVietItems.map((tv) => ({
        id: `tv-${tv.word}`,
        source: 'Thuần Việt' as const,
        word: tv.word,
        meaning: tv.simple_meaning,
        english: tv.english_equivalent || 'Idiomatic Word',
        example: tv.example_sentence,
      })),
    ];

    const shuffled = shuffleArray(unifiedPool).slice(0, 25);
    return shuffled.map((target) => {
      const distractors = shuffleArray(
        unifiedPool.filter((u) => u.word.toLowerCase() !== target.word.toLowerCase())
      ).slice(0, 3);

      const wrongCandidate = distractors[0]?.word || 'khác biệt';

      const options = shuffleArray([
        {
          id: target.id,
          word: target.word,
          meaning: target.meaning,
          english: target.english,
          isCorrect: true,
        },
        ...distractors.map((d) => ({
          id: d.id,
          word: d.word,
          meaning: d.meaning,
          english: d.english,
          isCorrect: false,
        })),
      ]);

      return {
        ...target,
        wrongWordInSentence: wrongCandidate,
        options,
      };
    });
  }, [hanVietItems, thuanVietItems, arenaSeed]);

  const currentArenaQuestion = arenaDeck[questionIndex % Math.max(1, arenaDeck.length)];

  // Countdown timer for Mode 3 (Flashcard Blitz 15s)
  useEffect(() => {
    if (mode !== 'battle-arena' || arenaSubMode !== 'flashcard-blitz') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (arenaSelected !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setArenaSelected('__TIMEOUT__');
          playGameSound('wrong', muted);
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, arenaSubMode, questionIndex, arenaSelected, muted]);

  // Reset question state when switching modes
  const handleSwitchMode = (nextMode: GameMode) => {
    playGameSound('click', muted);
    setMode(nextMode);
    setQuestionIndex(0);
    setSlot1Tile(null);
    setSlot2Tile(null);
    setForgeFeedback(null);
    setPainterSelected(null);
    setArenaSelected(null);
  };

  const handleNextChallenge = () => {
    playGameSound('click', muted);
    setSlot1Tile(null);
    setSlot2Tile(null);
    setForgeFeedback(null);
    setPainterSelected(null);
    setArenaSelected(null);
    setQuestionIndex((prev) => prev + 1);
  };

  const handleRestartMode = () => {
    playGameSound('click', muted);
    setScore(0);
    setStreak(0);
    setQuestionIndex(0);
    setSlot1Tile(null);
    setSlot2Tile(null);
    setForgeFeedback(null);
    setPainterSelected(null);
    setArenaSelected(null);
    if (mode === 'morpheme-forge') setForgeSeed((s) => s + 1);
    if (mode === 'word-painter') setPainterSeed((s) => s + 1);
    if (mode === 'battle-arena') setArenaSeed((s) => s + 1);
  };

  // ── HANDLERS FOR MODE 1 (MORPHEME FORGE) ───────────────────────────────────
  const handlePickForgeTile = (tile: { id: string; root: HanVietRoot }) => {
    if (forgeFeedback === 'correct') return;
    playGameSound('click', muted);
    setForgeFeedback(null);

    if (slot1Tile?.id === tile.id) {
      setSlot1Tile(null);
      return;
    }
    if (slot2Tile?.id === tile.id) {
      setSlot2Tile(null);
      return;
    }

    if (!slot1Tile) {
      setSlot1Tile(tile);
    } else if (!slot2Tile) {
      setSlot2Tile(tile);
    } else {
      setSlot2Tile(tile);
    }
  };

  const handleCheckForge = () => {
    if (!currentForgeItem || !slot1Tile || !slot2Tile) return;
    const isMatch =
      slot1Tile.root.reading_vi.trim().toLowerCase() ===
        currentForgeItem.root1.reading_vi.trim().toLowerCase() &&
      slot2Tile.root.reading_vi.trim().toLowerCase() ===
        currentForgeItem.root2.reading_vi.trim().toLowerCase();

    if (isMatch) {
      setForgeFeedback('correct');
      playGameSound('correct', muted);
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 3 ? 25 : 15;
      updateScoreAndRecord(bonus, nextStreak);
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
      });
    } else {
      setForgeFeedback('wrong');
      playGameSound('wrong', muted);
      updateScoreAndRecord(0, 0);
    }
  };

  // ── HANDLERS FOR MODE 2 (WORD PAINTER) ─────────────────────────────────────
  const handleSelectPainterOption = (word: string) => {
    if (painterSelected || !currentPainterItem) return;
    setPainterSelected(word);

    const isCorrect = word === currentPainterItem.word;
    if (isCorrect) {
      playGameSound('correct', muted);
      const nextStreak = streak + 1;
      updateScoreAndRecord(nextStreak >= 3 ? 20 : 10, nextStreak);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
      });
    } else {
      playGameSound('wrong', muted);
      updateScoreAndRecord(0, 0);
    }
  };

  // ── HANDLERS FOR MODE 3 (BATTLE ARENA) ─────────────────────────────────────
  const handleSelectArenaOption = (opt: { id: string; isCorrect: boolean }) => {
    if (arenaSelected !== null) return;
    setArenaSelected(opt.id);

    if (opt.isCorrect) {
      playGameSound('correct', muted);
      const nextStreak = streak + 1;
      const speedBonus = arenaSubMode === 'flashcard-blitz' ? Math.max(2, Math.floor(timeLeft / 2)) : 5;
      updateScoreAndRecord(10 + speedBonus + (nextStreak >= 3 ? 10 : 0), nextStreak);
      if (nextStreak % 3 === 0) {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      playGameSound('wrong', muted);
      updateScoreAndRecord(0, 0);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 pb-20">
        {/* Top Banner & Scoreboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0066ab] flex items-center justify-center text-white shadow-md">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Đấu Trường <span className="gradient-text">Từ Vựng Lớp 7</span>
              </h1>
              <p className="text-xs text-slate-500">
                Rèn phản xạ Hán-Việt & Thuần Việt · Phá kỷ lục mỗi ngày!
              </p>
            </div>
          </div>

          {/* Score / Streak / Highscore Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200">
              <Sparkles className="w-4 h-4 text-[#0066ab]" />
              <span className="text-xs text-slate-600 font-medium">Điểm:</span>
              <span className="text-sm font-black text-[#0066ab]">{score}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-600 font-medium">Chuỗi thắng:</span>
              <span className="text-sm font-black text-amber-600">
                {streak} 🔥 {bestStreak > 2 ? `(Max: ${bestStreak})` : ''}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-slate-600 font-medium">Kỷ lục:</span>
              <span className="text-sm font-black text-emerald-700">
                {highScores[mode] || 0}
              </span>
            </div>

            <button
              onClick={() => setMuted((m) => !m)}
              className="p-2 rounded-xl border border-gray-200 bg-gray-50 text-slate-600 hover:text-slate-900 transition-colors"
              title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleRestartMode}
              className="p-2 rounded-xl border border-gray-200 bg-gray-50 text-slate-600 hover:text-slate-900 transition-colors"
              title="Chơi lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Game Mode Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <button
            onClick={() => handleSwitchMode('morpheme-forge')}
            className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              mode === 'morpheme-forge'
                ? 'bg-blue-50/90 border-[#0066ab] shadow-md ring-2 ring-[#0066ab]/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0066ab] text-white flex items-center justify-center flex-shrink-0">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0066ab]">
                Chế độ 1 · Chuyên Hán-Việt
              </p>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                🧩 Thợ Rèn Hình Vị
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ghép 2 gốc chữ Hán-Việt vào lò rèn để tạo thành từ ghép khớp định nghĩa.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSwitchMode('word-painter')}
            className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              mode === 'word-painter'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Chế độ 2 · Chuyên Thuần Việt
              </p>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                🎨 Bức Họa Ngôn Từ
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Nhìn gợi ý bức tranh tâm trí hoặc câu đục lỗ để chọn từ láy, từ tượng hình.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSwitchMode('battle-arena')}
            className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              mode === 'battle-arena'
                ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Chế độ 3 · Trộn 2 Từ Điển
              </p>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                ⚔️ Đấu Trường Thực Chiến
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Phản xạ nhanh 15s (Flashcard Blitz) & Bác sĩ câu văn chữa lỗi dùng từ SGK.
              </p>
            </div>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            MODE 1: 🧩 THỢ RÈN HÌNH VỊ (MORPHEME FORGE)
           ═══════════════════════════════════════════════════════════════════════ */}
        {mode === 'morpheme-forge' && currentForgeItem && (
          <div className="card rounded-3xl p-6 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#0066ab] border border-blue-200">
                Thử thách #{questionIndex + 1} · Ghép 2 gốc hình vị Hán-Việt
              </span>
              {currentForgeItem.english_equivalent && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  🇬🇧 Gợi ý tiếng Anh: {currentForgeItem.english_equivalent}
                </span>
              )}
            </div>

            {/* Target Meaning Prompt */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 p-5 text-center space-y-2">
              <p className="text-xs font-bold text-[#0066ab] uppercase tracking-wider">
                🎯 Định nghĩa từ cần rèn:
              </p>
              <p className="text-lg sm:text-xl font-black text-slate-900">
                &ldquo;{currentForgeItem.full_meaning}&rdquo;
              </p>
              <p className="text-xs text-slate-600 italic">
                Ví dụ: {maskTargetWord(currentForgeItem.example_sentence, currentForgeItem.word)}
              </p>
            </div>

            {/* Forge Slots (Root 1 + Root 2 = Compound) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2">
              {/* Slot 1 */}
              <div
                onClick={() => slot1Tile && setSlot1Tile(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const tileId = e.dataTransfer.getData('text/plain');
                  const found = forgePool.find((t) => t.id === tileId);
                  if (found) setSlot1Tile(found);
                }}
                className={`w-full sm:w-48 min-h-[96px] rounded-2xl border-2 border-dashed p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  slot1Tile
                    ? 'border-[#0066ab] bg-blue-50/80 shadow-sm'
                    : 'border-slate-300 bg-slate-50/70 hover:border-[#0066ab]/50'
                }`}
              >
                {slot1Tile ? (
                  <>
                    {slot1Tile.root.hanzi && (
                      <span className="text-base font-bold text-[#0066ab]/70">
                        {slot1Tile.root.hanzi}
                      </span>
                    )}
                    <span className="text-lg font-black text-[#0066ab]">
                      {slot1Tile.root.reading_vi}
                    </span>
                    <span className="text-xs text-slate-600 text-center">
                      ({slot1Tile.root.root_meaning})
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    + Chọn / Kéo Hình vị 1
                  </span>
                )}
              </div>

              <span className="text-2xl font-black text-slate-400">+</span>

              {/* Slot 2 */}
              <div
                onClick={() => slot2Tile && setSlot2Tile(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const tileId = e.dataTransfer.getData('text/plain');
                  const found = forgePool.find((t) => t.id === tileId);
                  if (found) setSlot2Tile(found);
                }}
                className={`w-full sm:w-48 min-h-[96px] rounded-2xl border-2 border-dashed p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  slot2Tile
                    ? 'border-amber-500 bg-amber-50/80 shadow-sm'
                    : 'border-slate-300 bg-slate-50/70 hover:border-amber-500/50'
                }`}
              >
                {slot2Tile ? (
                  <>
                    {slot2Tile.root.hanzi && (
                      <span className="text-base font-bold text-amber-700/70">
                        {slot2Tile.root.hanzi}
                      </span>
                    )}
                    <span className="text-lg font-black text-amber-700">
                      {slot2Tile.root.reading_vi}
                    </span>
                    <span className="text-xs text-slate-600 text-center">
                      ({slot2Tile.root.root_meaning})
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    + Chọn / Kéo Hình vị 2
                  </span>
                )}
              </div>

              <span className="text-2xl font-black text-slate-400">➔</span>

              {/* Result Preview */}
              <div className="w-full sm:w-52 min-h-[96px] rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-emerald-700 uppercase">
                  Từ ghép tạo thành
                </span>
                <span className="text-xl font-black text-emerald-900 mt-1">
                  {slot1Tile?.root.reading_vi || '...'}{' '}
                  {slot2Tile?.root.reading_vi || '...'}
                </span>
              </div>
            </div>

            {/* Morpheme Tiles Pool */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Kho mảnh ghép hình vị (Chạm hoặc kéo thả vào ô):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {forgePool.map((tile) => {
                  const isUsed =
                    slot1Tile?.id === tile.id || slot2Tile?.id === tile.id;
                  return (
                    <button
                      key={tile.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', tile.id)}
                      onClick={() => handlePickForgeTile(tile)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                        isUsed
                          ? 'border-[#0066ab] bg-blue-50 text-[#0066ab] opacity-60 scale-[0.98]'
                          : 'border-gray-200 bg-white hover:border-[#0066ab]/50 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <p className="text-base font-black text-slate-900">
                          {tile.root.reading_vi}{' '}
                          {tile.root.hanzi && (
                            <span className="text-xs font-normal text-slate-500">
                              ({tile.root.hanzi})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          = {tile.root.root_meaning}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Banner */}
            {forgeFeedback === 'correct' && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-emerald-900">
                      Chính xác! {currentForgeItem.word} ({currentForgeItem.english_equivalent})
                    </p>
                    <p className="text-xs text-emerald-800 mt-0.5 font-mono">
                      {currentForgeItem.math_formula}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNextChallenge}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  Từ tiếp theo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {forgeFeedback === 'wrong' && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold text-red-800">
                    Chưa khớp rồi! Hãy thử đổi mảnh ghép hình vị khác nhé.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSlot1Tile(null);
                    setSlot2Tile(null);
                    setForgeFeedback(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-xs font-bold text-red-700"
                >
                  Chọn lại
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {forgeFeedback !== 'correct' && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleNextChallenge}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-600 hover:bg-gray-50"
                >
                  Bỏ qua từ này
                </button>
                <button
                  onClick={handleCheckForge}
                  disabled={!slot1Tile || !slot2Tile}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    slot1Tile && slot2Tile
                      ? 'bg-[#0066ab] text-white shadow-md hover:opacity-95'
                      : 'bg-gray-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  🔨 Rèn Từ Ghép Ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            MODE 2: 🎨 BỨC HỌA NGÔN TỪ (WORD PAINTER - THUẦN VIỆT)
           ═══════════════════════════════════════════════════════════════════════ */}
        {mode === 'word-painter' && currentPainterItem && (
          <div className="card rounded-3xl p-6 space-y-6 animate-fade-in-up">
            {/* Sub-mode toggle: Bức tranh tâm trí vs Câu văn đục lỗ */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="inline-flex p-1 rounded-xl bg-slate-100">
                <button
                  onClick={() => setPainterStyle('mental_image')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    painterStyle === 'mental_image'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  🖼️ Nhìn Tranh Tâm Trí
                </button>
                <button
                  onClick={() => setPainterStyle('cloze')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    painterStyle === 'cloze'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  ✍️ Điền Khuyết Ngữ Cảnh
                </button>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {THUAN_VIET_TYPE_LABELS[currentPainterItem.word_type] || 'Từ Thuần Việt'} ·🇬🇧{' '}
                {currentPainterItem.english_equivalent}
              </span>
            </div>

            {/* Visual Clue / Cloze Prompt Box */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200 p-6 space-y-3">
              {painterStyle === 'mental_image' ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <Eye className="w-4 h-4" />
                    Hãy tưởng tượng bức tranh sau:
                  </div>
                  <p className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
                    &ldquo;{currentPainterItem.mental_image || currentPainterItem.simple_meaning}&rdquo;
                  </p>
                  <p className="text-xs text-slate-600">
                    💡 Nghĩa đời thường: {currentPainterItem.simple_meaning}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    Chọn từ Thuần Việt điền vào chỗ trống [ ___ ]:
                  </div>
                  <p className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
                    &ldquo;
                    {maskTargetWord(
                      currentPainterItem.example_sentence,
                      currentPainterItem.word
                    )}
                    &rdquo;
                  </p>
                  {currentPainterItem.context_clue && (
                    <p className="text-xs text-emerald-800">
                      🧭 Mẹo ngữ cảnh: {currentPainterItem.context_clue}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {painterOptions.map((opt, idx) => {
                const isThisCorrect = opt.word === currentPainterItem.word;
                const isSelected = painterSelected === opt.word;
                const showResult = painterSelected !== null;

                return (
                  <button
                    key={opt.word}
                    onClick={() => handleSelectPainterOption(opt.word)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      showResult && isThisCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : showResult && isSelected && !isThisCorrect
                        ? 'border-red-400 bg-red-50 text-red-900'
                        : 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div>
                        <p className="text-base font-black text-slate-900">{opt.word}</p>
                        <p className="text-xs text-slate-500">
                          {THUAN_VIET_TYPE_LABELS[opt.word_type] || opt.word_type}
                        </p>
                      </div>
                    </div>
                    {showResult && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {painterSelected && (
              <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Đáp án: <span className="text-emerald-700">{currentPainterItem.word}</span> (🇬🇧{' '}
                    {currentPainterItem.english_equivalent})
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    Câu hoàn chỉnh: &ldquo;{currentPainterItem.example_sentence}&rdquo;
                  </p>
                </div>
                <button
                  onClick={handleNextChallenge}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  Câu tiếp theo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            MODE 3: ⚔️ ĐẤU TRƯỜNG THỰC CHIẾN (TRỘN CHUNG CẢ 2 TỪ ĐIỂN)
           ═══════════════════════════════════════════════════════════════════════ */}
        {mode === 'battle-arena' && currentArenaQuestion && (
          <div className="card rounded-3xl p-6 space-y-6 animate-fade-in-up">
            {/* Sub-mode switcher: Flashcard Blitz (15s) vs Bác Sĩ Câu Văn */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="inline-flex p-1 rounded-xl bg-slate-100">
                <button
                  onClick={() => {
                    setArenaSubMode('flashcard-blitz');
                    setArenaSelected(null);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    arenaSubMode === 'flashcard-blitz'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Dạng 1: Flashcard Blitz (15s)
                </button>
                <button
                  onClick={() => {
                    setArenaSubMode('sentence-doctor');
                    setArenaSelected(null);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    arenaSubMode === 'sentence-doctor'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Dạng 2: Bác Sĩ Câu Văn
                </button>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  currentArenaQuestion.source === 'Hán - Việt'
                    ? 'bg-blue-50 text-[#0066ab] border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                Nguồn: Kho từ {currentArenaQuestion.source}
              </span>
            </div>

            {/* Countdown Timer Bar for Flashcard Blitz */}
            {arenaSubMode === 'flashcard-blitz' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Timer className="w-4 h-4" />
                    Thời gian phản xạ:
                  </span>
                  <span
                    className={`${
                      timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-slate-700'
                    }`}
                  >
                    {timeLeft} giây
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${
                      timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Question Display */}
            {arenaSubMode === 'flashcard-blitz' ? (
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 p-6 text-center space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  ⚡ Phản xạ nhanh: Chọn nghĩa & Mỏ neo Tiếng Anh đúng cho từ:
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
                  {currentArenaQuestion.word}
                </h3>
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Stethoscope className="w-4 h-4" />
                  Bác sĩ câu văn: Câu dưới đây đang bị đục lỗ / dùng từ sai, hãy chọn từ đúng để chữa lại!
                </div>
                <p className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
                  &ldquo;
                  {maskTargetWord(
                    currentArenaQuestion.example,
                    currentArenaQuestion.word
                  ).replace(
                    '[ ___ ]',
                    `[ ❌ ${currentArenaQuestion.wrongWordInSentence} ➔ ___ ]`
                  )}
                  &rdquo;
                </p>
                <p className="text-xs text-slate-600">
                  💡 Gợi ý nghĩa cần điền: {currentArenaQuestion.meaning} (🇬🇧{' '}
                  {currentArenaQuestion.english})
                </p>
              </div>
            )}

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentArenaQuestion.options.map((opt, idx) => {
                const isSelected = arenaSelected === opt.id;
                const showResult = arenaSelected !== null;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectArenaOption(opt)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      showResult && opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : showResult && isSelected && !opt.isCorrect
                        ? 'border-red-400 bg-red-50 text-red-900'
                        : 'border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {arenaSubMode === 'flashcard-blitz' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
                            🇬🇧 {opt.english}
                          </span>
                          <p className="text-sm font-medium text-slate-800 leading-snug">
                            {opt.meaning}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-base font-black text-slate-900">{opt.word}</p>
                          <p className="text-xs text-slate-500">🇬🇧 {opt.english}</p>
                        </div>
                      )}
                    </div>

                    {showResult && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result & Next */}
            {arenaSelected !== null && (
              <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                  {arenaSelected === '__TIMEOUT__' && (
                    <p className="text-xs font-bold text-red-600">
                      ⏰ Hết 15 giây! Hãy phản xạ nhanh hơn ở câu sau nhé.
                    </p>
                  )}
                  <p className="text-sm font-bold text-slate-900">
                    Từ chuẩn: <span className="text-[#0066ab]">{currentArenaQuestion.word}</span> (🇬🇧{' '}
                    {currentArenaQuestion.english})
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    &ldquo;{currentArenaQuestion.example}&rdquo;
                  </p>
                </div>

                <button
                  onClick={handleNextChallenge}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  Thử thách tiếp theo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Link back to Dictionary */}
        <div className="text-center pt-2">
          <Link
            href="/dictionary"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0066ab] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Tra cứu lại toàn bộ Kho Từ Điển Hán-Việt & Thuần Việt
          </Link>
        </div>
      </main>
    </div>
  );
}

