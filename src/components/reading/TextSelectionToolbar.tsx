'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';
import { Trash2 } from 'lucide-react';
import {
  MARKING_SYMBOLS_META,
  type MarkingSymbol,
  type TextHighlightAnnotation,
} from '@/types/metacognition';

export const ALL_MARKING_SYMBOLS: MarkingSymbol[] = ['?', '!', '*', 'C', 'P', 'KL'];

export interface TextSelectionToolbarProps {
  selectedText: string;
  onSelectSymbol: (sym: MarkingSymbol) => void;
  onAskDeepDive: (text: string) => void;
  onClose: () => void;
  /** 'inline' dùng trong chặng Siêu nhận thức; 'floating' dùng nổi cố định cuối màn hình cho Bài ngắn / 1 Trang */
  variant?: 'inline' | 'floating';
}

export function TextSelectionToolbar({
  selectedText,
  onSelectSymbol,
  onAskDeepDive,
  onClose,
  variant = 'inline',
}: TextSelectionToolbarProps) {
  const containerClass =
    variant === 'floating'
      ? 'no-print print:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-2xl z-40 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white space-y-2 shadow-2xl border border-slate-700/80 animate-fade-in-up'
      : 'no-print print:hidden p-3.5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-lg animate-fade-in-up';

  return (
    <div className={containerClass} role="toolbar" aria-label="Công cụ đánh dấu và hỏi đáp đoạn văn bản">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-amber-300 truncate">
          🖍️ Gắn ký hiệu cho đoạn: &ldquo;{selectedText}&rdquo;
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white shrink-0"
        >
          Đóng ✕
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ALL_MARKING_SYMBOLS.map((sym) => {
          const meta = MARKING_SYMBOLS_META[sym];
          return (
            <button
              key={sym}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelectSymbol(sym)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-transform hover:scale-105 ${meta.badgeClass}`}
            >
              {meta.shortDesc}
            </button>
          );
        })}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onAskDeepDive(selectedText)}
          className="px-3 py-1 rounded-lg text-xs font-black bg-[#0066ab] text-white border border-blue-400 hover:bg-blue-700 transition-transform hover:scale-105 inline-flex items-center gap-1"
          title="Hỏi - Đáp cùng Thầy Cú về đoạn chữ vừa bôi đen"
        >
          🦉 Hỏi - Đáp
        </button>
      </div>
    </div>
  );
}

interface UseReadingTextSelectionOptions {
  articleId?: string;
  containerRef: RefObject<HTMLElement | null>;
  extraContainerRefs?: RefObject<HTMLElement | null>[];
  allowContentEditable?: boolean;
}

export function useReadingTextSelection({
  articleId,
  containerRef,
  extraContainerRefs,
  allowContentEditable = false,
}: UseReadingTextSelectionOptions) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<TextHighlightAnnotation[]>([]);

  const storageKey = articleId ? `reading_marks_v1:${articleId}` : null;

  // Khôi phục danh sách đánh dấu từ localStorage theo articleId
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHighlights(parsed);
          return;
        }
      }
      setHighlights([]);
    } catch {
      setHighlights([]);
    }
  }, [storageKey]);

  // Lưu thay đổi vào localStorage
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(highlights));
    } catch {
      // Bỏ qua nếu đầy bộ nhớ trình duyệt
    }
  }, [storageKey, highlights]);

  const readSelectionIfInside = useCallback(() => {
    if (typeof window === 'undefined') return;
    const containers = [
      containerRef.current,
      ...(extraContainerRefs || []).map((r) => r.current),
    ].filter((el): el is HTMLElement => Boolean(el));

    if (containers.length === 0) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const anchorNode = sel.anchorNode;
    const focusNode = sel.focusNode;
    if (!anchorNode || !focusNode) return;

    const isInsideAny = containers.some(
      (c) => c.contains(anchorNode) && c.contains(focusNode)
    );
    if (!isInsideAny) return;

    // Không kích hoạt khi đang bôi đen bên trong textarea, input hoặc thanh toolbar soạn thảo
    const anchorEl =
      anchorNode.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as Element)
        : anchorNode.parentElement;
    if (!anchorEl) return;

    if (anchorEl.closest('textarea, input, [data-editor-toolbar="true"]')) {
      return;
    }

    if (!allowContentEditable && anchorEl.closest('[contenteditable="true"]')) {
      return;
    }

    const text = sel.toString().trim();
    if (text.length >= 2 && text.length <= 220) {
      setSelectedText(text);
    }
  }, [containerRef, extraContainerRefs, allowContentEditable]);

  // Hỗ trợ tốt cả thao tác kéo chọn chữ trên Mobile/iPad thông qua selectionchange (debounced)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleSelectionChange = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        readSelectionIfInside();
      }, 220);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [readSelectionIfInside]);

  const clearSelection = useCallback(() => {
    setSelectedText(null);
    if (typeof window !== 'undefined') {
      window.getSelection()?.removeAllRanges();
    }
  }, []);

  const addHighlight = useCallback(
    (sym: MarkingSymbol) => {
      if (!selectedText) return;
      const newAnnotation: TextHighlightAnnotation = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: selectedText,
        symbol: sym,
      };
      setHighlights((prev) => [...prev, newAnnotation]);
      clearSelection();
    },
    [selectedText, clearSelection]
  );

  const removeHighlight = useCallback((annotationId: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== annotationId));
  }, []);

  return {
    selectedText,
    setSelectedText,
    highlights,
    readSelectionIfInside,
    clearSelection,
    addHighlight,
    removeHighlight,
  };
}

interface MarkedHighlightsListProps {
  highlights: TextHighlightAnnotation[];
  onRemove: (id: string) => void;
  onAskDeepDive?: (text: string) => void;
}

export function MarkedHighlightsList({
  highlights,
  onRemove,
  onAskDeepDive,
}: MarkedHighlightsListProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="no-print print:hidden mt-6 card rounded-2xl p-5 space-y-2.5 border border-slate-200 bg-white">
      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
        📌 Các đoạn con đã đánh dấu Marking Text ({highlights.length}):
      </p>
      <div className="space-y-1.5">
        {highlights.map((hl) => {
          const meta = MARKING_SYMBOLS_META[hl.symbol];
          return (
            <div
              key={hl.id}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded font-black border shrink-0 ${meta.badgeClass}`}
                >
                  [{hl.symbol}] {meta.label}
                </span>
                <span className="font-semibold text-slate-800 truncate">
                  &ldquo;{hl.text}&rdquo;
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {onAskDeepDive && (
                  <button
                    type="button"
                    onClick={() => onAskDeepDive(hl.text)}
                    className="px-2 py-1 rounded-lg bg-[#0066ab]/10 text-[#0066ab] hover:bg-[#0066ab]/20 font-bold text-[11px] transition-colors"
                    title="Hỏi - Đáp cùng Thầy Cú về đoạn này"
                  >
                    🦉 Hỏi - Đáp
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(hl.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Xóa đánh dấu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
