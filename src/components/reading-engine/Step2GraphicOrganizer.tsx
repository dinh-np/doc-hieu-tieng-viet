'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { GitBranch, CheckCircle2, RotateCcw } from 'lucide-react';
import { Step2GraphicOrganizer as GOType, OrganizerCard, OrganizerSlot } from '@/types/article';

interface Step2GraphicOrganizerProps {
  data: GOType;
  isParentView?: boolean;
  onSlotMatched?: (slotId: string, cardId: string, isCorrect: boolean) => void;
  onComplete: () => void;
}

export function Step2GraphicOrganizer({
  data,
  isParentView = false,
  onSlotMatched,
  onComplete,
}: Step2GraphicOrganizerProps) {
  const [slotFills, setSlotFills] = useState<Record<string, string>>({});
  const [cardPool, setCardPool] = useState<OrganizerCard[]>(data.cards);
  const [shakeSlot, setShakeSlot] = useState<string | null>(null);
  const [correctSlots, setCorrectSlots] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragCard = useRef<string | null>(null);

  const allCorrect = data.slots.every((slot) => correctSlots.has(slot.id));

  // Play audio feedback
  const playSuccess = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch { /* Audio not supported */ }
  }, []);

  const handleDrop = useCallback(
    (slotId: string) => {
      const cardId = dragCard.current;
      if (!cardId) return;

      const slot = data.slots.find((s) => s.id === slotId)!;
      const isCorrect = slot.expected_card_id === cardId;

      if (isCorrect) {
        setSlotFills((prev) => ({ ...prev, [slotId]: cardId }));
        setCardPool((prev) => prev.filter((c) => c.id !== cardId));
        setCorrectSlots((prev) => new Set([...prev, slotId]));
        playSuccess();
        onSlotMatched?.(slotId, cardId, true);
      } else {
        setShakeSlot(slotId);
        setTimeout(() => setShakeSlot(null), 500);
        onSlotMatched?.(slotId, cardId, false);
      }
      dragCard.current = null;
      setDragOver(null);
    },
    [data.slots, onSlotMatched, playSuccess]
  );

  const handleReset = () => {
    setSlotFills({});
    setCardPool(data.cards);
    setCorrectSlots(new Set());
  };

  useEffect(() => {
    if (allCorrect && data.slots.length > 0) {
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
  }, [allCorrect, data.slots.length, onComplete]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bước 2: Sơ Đồ Tư Duy</h2>
          <p className="text-xs text-slate-600">{data.title}</p>
        </div>
        {!isParentView && (
          <button
            onClick={handleReset}
            className="ml-auto text-slate-500 hover:text-slate-700 transition-colors"
            title="Làm lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 gap-3">
        {data.slots.map((slot) => {
          const filledCard = slotFills[slot.id]
            ? data.cards.find((c) => c.id === slotFills[slot.id])
            : null;
          const isCorrect = correctSlots.has(slot.id);

          return (
            <div
              key={slot.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(slot.id);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(slot.id)}
              className={`drop-slot rounded-xl p-4 flex items-center gap-3 transition-all ${
                shakeSlot === slot.id ? 'shake' : ''
              } ${dragOver === slot.id ? 'drag-over' : ''} ${
                isCorrect ? 'correct' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-600">
                  {data.slots.indexOf(slot) + 1}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900 mb-1">{slot.label}</p>
                {filledCard ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-base text-emerald-700 font-medium">{filledCard.text}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-500 italic">Kéo thẻ vào đây...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Pool */}
      {!isParentView && cardPool.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
            Thẻ sự kiện — kéo vào ô phù hợp:
          </p>
          <div className="flex flex-wrap gap-2">
            {cardPool.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => { dragCard.current = card.id; }}
                onDragEnd={() => { dragCard.current = null; }}
                className="drag-card bg-white shadow-sm border border-gray-200 rounded-xl px-4 py-3 text-base text-slate-900 font-medium hover:border-[#0066ab]/40 hover:bg-blue-50 cursor-grab active:cursor-grabbing max-w-xs"
              >
                {card.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All correct celebration */}
      {allCorrect && (
        <div className="rounded-xl bg-emerald-950/50 border border-emerald-300 p-4 text-center animate-fade-in">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-emerald-300 font-bold">Hoàn hảo! Sơ đồ đúng hết!</p>
          <p className="text-emerald-500 text-xs mt-1">Tự động chuyển sang Bước 3...</p>
        </div>
      )}

      {isParentView && (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            🎯 Hướng dẫn cho Cha - Mẹ
          </p>
          {data.slots.map((slot) => (
            <div key={slot.id} className="flex gap-2 text-sm">
              <span className="text-slate-500">{slot.label}:</span>
              <span className="text-emerald-400 font-medium">
                {data.cards.find((c) => c.id === slot.expected_card_id)?.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
