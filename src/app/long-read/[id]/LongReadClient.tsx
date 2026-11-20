'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  BookOpen,
  Network,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { DeepDiveChatPanel } from '@/components/rag/DeepDiveChatPanel';
import {
  TextSelectionToolbar,
  useReadingTextSelection,
  MarkedHighlightsList,
} from '@/components/reading/TextSelectionToolbar';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';
import type { LongArticle } from '@/types/long-article';

interface LongReadClientProps {
  article: LongArticle;
}

export function LongReadClient({ article }: LongReadClientProps) {
  const [fontSize, setFontSize] = useState<number>(18);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'read' | 'chat'>('read');
  const [deepDiveSelectedText, setDeepDiveSelectedText] = useState<
    string | undefined
  >(undefined);

  const readingAreaRef = useRef<HTMLDivElement>(null);

  const {
    selectedText,
    highlights,
    readSelectionIfInside,
    clearSelection,
    addHighlight,
    removeHighlight,
  } = useReadingTextSelection({
    articleId: article.slug || article.id,
    containerRef: readingAreaRef,
  });

  const paragraphs = useMemo(() => {
    const cleaned = cleanVietnameseText(article.content || '');
    return cleaned
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [article.content]);

  const handleAskFromSelection = (text: string) => {
    setDeepDiveSelectedText(cleanVietnameseText(text));
    clearSelection();
    if (isLeftPanelCollapsed) {
      setIsLeftPanelCollapsed(false);
    }
    setMobileTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      <Header />

      {/* Thanh 2 Tab cố định trên Mobile (< lg) */}
      <div className="no-print print:hidden lg:hidden sticky top-14 z-30 bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab('read')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            mobileTab === 'read'
              ? 'bg-[#0066ab] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>📖 Bài đọc ({article.word_count} từ)</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            mobileTab === 'chat'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>🦉 Hỏi - Đáp &amp; Mindmap</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL BÊN TRÁI (5/12 trên Desktop): Thầy Cú Feynman + Mindmap Thụt Lề */}
          <aside
            className={`no-print print:hidden ${
              mobileTab === 'chat' ? 'block' : 'hidden'
            } ${
              isLeftPanelCollapsed
                ? 'lg:hidden'
                : 'lg:block lg:col-span-5 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]'
            }`}
          >
            <div className="h-[calc(100vh-11rem)] lg:h-full rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <DeepDiveChatPanel
                mode="drawer"
                currentArticleId={article.slug || article.id}
                articleTitle={article.title}
                fullArticleContent={article.content}
                showMindmapAction={true}
                initialSelectedText={deepDiveSelectedText}
                onClearSelectedText={() => setDeepDiveSelectedText(undefined)}
              />
            </div>
          </aside>

          {/* VÙNG ĐỌC BÊN PHẢI (7/12 trên Desktop, hoặc 12/12 khi thu gọn Panel trái) */}
          <section
            className={`${
              mobileTab === 'read' ? 'block' : 'hidden'
            } lg:block ${
              isLeftPanelCollapsed ? 'lg:col-span-12' : 'lg:col-span-7'
            } space-y-5`}
          >
            {/* Thanh công cụ bài đọc (Ẩn khi in A4) */}
            <div className="no-print print:hidden card rounded-2xl p-4 bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  href="/long-read"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Danh sách</span>
                </Link>

                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066ab] border border-blue-200 text-xs font-extrabold">
                  {article.subject || 'Tự do'} · Lớp {article.grade || 7}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <FileText className="w-3.5 h-3.5" />
                  {article.word_count} từ
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Nút ẩn/hiện Panel trái trên Desktop */}
                <button
                  type="button"
                  onClick={() => setIsLeftPanelCollapsed((prev) => !prev)}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title={
                    isLeftPanelCollapsed
                      ? 'Mở lại Panel Thầy Cú & Mindmap bên trái'
                      : 'Thu gọn Panel trái để đọc toàn màn hình'
                  }
                >
                  {isLeftPanelCollapsed ? (
                    <>
                      <PanelLeftOpen className="w-3.5 h-3.5 text-[#0066ab]" />
                      <span>Mở Panel Hỏi - Đáp</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-3.5 h-3.5" />
                      <span>Thu gọn Panel trái</span>
                    </>
                  )}
                </button>

                {/* Tăng / Giảm cỡ chữ */}
                <div className="inline-flex items-center rounded-xl border border-gray-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.max(15, s - 1))}
                    className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-white rounded-lg transition-colors"
                    title="Giảm cỡ chữ"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                    className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-white rounded-lg transition-colors"
                    title="Tăng cỡ chữ"
                  >
                    A+
                  </button>
                </div>

                {/* Nút In A4 luyện trên giấy */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0066ab] hover:bg-[#005590] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>🖨️ In A4 luyện trên giấy</span>
                </button>
              </div>
            </div>

            {/* Khung nội dung văn bản bài đọc */}
            <article
              ref={readingAreaRef}
              onMouseUp={readSelectionIfInside}
              onTouchEnd={readSelectionIfInside}
              className="card rounded-3xl p-6 sm:p-10 bg-white border border-gray-200 shadow-sm select-text print:shadow-none print:border-0 print:p-0 print:pr-14"
            >
              {/* Header bài đọc */}
              <header className="border-b border-gray-200 pb-5 mb-6 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
                  <span>
                    Môn / Chủ đề: <strong>{article.subject || 'Tự do'}</strong> · Khối lớp{' '}
                    <strong>{article.grade || 7}</strong>
                  </span>
                  <span>Độ dài: {article.word_count} từ</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug font-reading">
                  {cleanVietnameseText(article.title)}
                </h1>
                <p className="no-print print:hidden text-xs text-slate-500 italic">
                  💡 Mẹo: Bôi đen bất kỳ từ hoặc câu nào để gắn 6 ký hiệu Marking Text hoặc
                  bấm <strong>&ldquo;🦉 Hỏi - Đáp&rdquo;</strong> chuyển thẳng sang Panel
                  Thầy Cú bên trái!
                </p>
              </header>

              {/* Nội dung các đoạn văn */}
              <div
                style={{ fontSize: `${fontSize}px` }}
                className="space-y-5 text-slate-800 font-reading leading-relaxed"
              >
                {paragraphs.map((para, idx) => (
                  <p key={idx} className="text-justify leading-[1.95] indent-6">
                    {para}
                  </p>
                ))}
              </div>

              {/* Khung ghi chú khi in A4 để con tự tóm tắt tay trên giấy */}
              <div className="hidden print:block mt-10 pt-6 border-t-2 border-dashed border-slate-400 space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  ✍️ PHẦN TỰ TÓM TẮT SƠ ĐỒ TƯ DUY TRÊN GIẤY CỦA CON:
                </h2>
                <p className="text-xs text-slate-600">
                  Sau khi đọc và gạch chân từ khóa ở lề phải, con hãy tự vẽ hoặc viết sơ đồ
                  ý chính dạng thụt lề vào khung dưới đây trước khi đối chiếu với Mindmap
                  của Thầy Cú nhé:
                </p>
                <div className="h-64 border border-slate-400 rounded-xl" />
              </div>
            </article>

            {/* Danh sách các đoạn đã gắn ký hiệu Marking Text */}
            <MarkedHighlightsList
              highlights={highlights}
              onRemove={removeHighlight}
              onAskDeepDive={handleAskFromSelection}
            />
          </section>
        </div>
      </main>

      {/* Thanh công cụ nổi khi bôi đen văn bản */}
      {selectedText && (
        <TextSelectionToolbar
          variant="floating"
          selectedText={selectedText}
          onSelectSymbol={addHighlight}
          onAskDeepDive={handleAskFromSelection}
          onClose={clearSelection}
        />
      )}
    </div>
  );
}
