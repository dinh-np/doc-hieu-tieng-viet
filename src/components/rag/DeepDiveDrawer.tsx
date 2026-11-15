'use client';

import { X } from 'lucide-react';
import { DeepDiveChatPanel } from './DeepDiveChatPanel';

interface DeepDiveDrawerProps {
  currentArticleId?: string;
  articleTitle?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText?: string;
  onClearSelectedText?: () => void;
  buttonPositionClass?: string;
}

export function DeepDiveDrawer({
  currentArticleId,
  articleTitle,
  isOpen,
  onOpenChange,
  selectedText,
  onClearSelectedText,
  buttonPositionClass = 'bottom-6 right-6',
}: DeepDiveDrawerProps) {
  return (
    <>
      {/* Nút bấm nổi góc dưới phải (ẩn hoàn toàn khi in A4) */}
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className={`no-print print:hidden fixed ${buttonPositionClass} z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#0066ab] text-white text-xs sm:text-sm font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/20`}
        title="Mở Cú Đôi Feynman để hỏi sâu kiến thức"
      >
        <span className="text-base leading-none">🦉</span>
        <span>Hỏi Cú Đôi</span>
      </button>

      {/* Slide-over Drawer (Desktop) & Bottom Sheet (Mobile) */}
      {isOpen && (
        <div className="no-print print:hidden fixed inset-0 z-50 flex justify-end items-end sm:items-stretch">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
            onClick={() => onOpenChange(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full sm:w-[420px] h-[82vh] sm:h-full bg-white rounded-t-3xl sm:rounded-none shadow-2xl border-t sm:border-t-0 sm:border-l border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
            {/* Drawer header */}
            <div className="px-4 py-3 bg-[#0066ab] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">🦉</span>
                <span className="text-sm font-extrabold">
                  Hỏi Đáp Đào Sâu Kiến Thức
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
                aria-label="Đóng khung hỏi đáp"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat panel */}
            <div className="flex-1 min-h-0">
              <DeepDiveChatPanel
                mode="drawer"
                currentArticleId={currentArticleId}
                articleTitle={articleTitle}
                initialSelectedText={selectedText}
                onClearSelectedText={onClearSelectedText}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

