'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  FileText,
  Network,
  Loader2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { DeepDiveDrawer } from '@/components/rag/DeepDiveDrawer';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import {
  TextSelectionToolbar,
  useReadingTextSelection,
  MarkedHighlightsList,
} from '@/components/reading/TextSelectionToolbar';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';
import {
  normalizeArticleHtml,
  stripHtmlToPlainText,
  countRichTextWords,
  mindmapMarkdownToHtml,
} from '@/lib/utils/rich-text';
import type { LongArticle } from '@/types/long-article';

interface LongReadClientProps {
  article: LongArticle;
}

export function LongReadClient({ article }: LongReadClientProps) {
  const articleKey = article.id || article.slug;
  const mindmapStorageKey = `long_read_mindmap_v1:${articleKey}`;

  const [fontSize, setFontSize] = useState<number>(18);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState<boolean>(false);
  const [deepDiveSelectedText, setDeepDiveSelectedText] = useState<
    string | undefined
  >(undefined);

  // State cho Box Sơ đồ tư duy dạng thụt lề ở cuối bài đọc
  const [mindmapHtml, setMindmapHtml] = useState<string>('');
  const [generatingMindmap, setGeneratingMindmap] = useState<boolean>(false);
  const [mindmapError, setMindmapError] = useState<string | null>(null);
  const [copiedMindmap, setCopiedMindmap] = useState<boolean>(false);

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

  // Nội dung HTML sạch (tương thích ngược với bài lưu dạng plain text có \n)
  const formattedArticleHtml = useMemo(
    () => normalizeArticleHtml(article.content || ''),
    [article.content]
  );

  // Văn bản thuần (strip HTML) để gửi ngữ cảnh cho AI Thầy Cú & tạo Mindmap
  const plainTextContent = useMemo(
    () => stripHtmlToPlainText(article.content || ''),
    [article.content]
  );

  const displayWordCount = useMemo(
    () => article.word_count || countRichTextWords(article.content || ''),
    [article.word_count, article.content]
  );

  // Khôi phục Mindmap đã lưu tạm theo bài đọc từ localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(mindmapStorageKey);
      if (saved && saved.trim()) {
        setMindmapHtml(saved);
      }
    } catch {
      // ignore
    }
  }, [mindmapStorageKey]);

  // Tự động lưu Mindmap đã chỉnh sửa vào localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (mindmapHtml.trim()) {
        window.localStorage.setItem(mindmapStorageKey, mindmapHtml);
      }
    } catch {
      // ignore
    }
  }, [mindmapHtml, mindmapStorageKey]);

  // Reset thuộc tính data-print-target sau khi đóng hộp thoại in A4
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleAfterPrint = () => {
      document.body.removeAttribute('data-print-target');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const triggerPrint = useCallback((target: 'article' | 'mindmap') => {
    if (typeof window === 'undefined') return;
    document.body.setAttribute('data-print-target', target);
    setTimeout(() => {
      window.print();
    }, 60);
  }, []);

  const handleAskFromSelection = (text: string) => {
    setDeepDiveSelectedText(cleanVietnameseText(text));
    clearSelection();
    setIsDeepDiveOpen(true);
  };

  const handleGenerateMindmap = async () => {
    if (generatingMindmap) return;
    setGeneratingMindmap(true);
    setMindmapError(null);

    try {
      const res = await fetch('/api/qa-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'mindmap',
          fullArticleContent: plainTextContent,
          currentArticleId: article.slug || article.id,
          question: 'Tóm tắt bài đọc thành sơ đồ tư duy dạng thụt lề',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || 'Không thể tạo sơ đồ tư duy lúc này. Vui lòng thử lại.'
        );
      }

      const rawMarkdown = cleanVietnameseText(data.answer || '');
      const convertedHtml = mindmapMarkdownToHtml(rawMarkdown);
      setMindmapHtml(convertedHtml);
    } catch (err) {
      setMindmapError(
        err instanceof Error
          ? err.message
          : 'Đã xảy ra lỗi khi tạo sơ đồ tư duy.'
      );
    } finally {
      setGeneratingMindmap(false);
    }
  };

  const handleCopyMindmap = async () => {
    try {
      const plain = stripHtmlToPlainText(mindmapHtml);
      await navigator.clipboard.writeText(plain);
      setCopiedMindmap(true);
      setTimeout(() => setCopiedMindmap(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      <Header />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 space-y-6">
        {/* ==================== PHẦN 1: BÀI ĐỌC GỐC ==================== */}
        <section className="print-article-section space-y-5">
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
                {displayWordCount} từ
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Tăng / Giảm cỡ chữ */}
              <div className="inline-flex items-center rounded-xl border border-gray-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(15, s - 1))}
                  className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Giảm cỡ chữ"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                  className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Tăng cỡ chữ"
                >
                  A+
                </button>
              </div>

              {/* Nút In A4 luyện trên giấy (Chỉ in sạch bài đọc, ẩn Mindmap) */}
              <button
                type="button"
                onClick={() => triggerPrint('article')}
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
            className="card rounded-3xl p-6 sm:p-10 bg-white border border-gray-200 shadow-sm select-text print:shadow-none print:border-0 print:p-0 print:pr-12"
          >
            {/* Tiêu đề bài đọc (Dùng div thay vì header để không bị ẩn bởi rule header trong @media print) */}
            <div className="border-b border-gray-200 pb-5 mb-6 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
                <span>
                  Môn / Chủ đề: <strong>{article.subject || 'Tự do'}</strong> · Khối lớp{' '}
                  <strong>{article.grade || 7}</strong>
                </span>
                <span>Độ dài: {displayWordCount} từ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug font-reading">
                {cleanVietnameseText(article.title)}
              </h1>
              <p className="no-print print:hidden text-xs text-slate-500 italic">
                💡 Mẹo: Bôi đen bất kỳ từ hoặc câu nào để gắn 6 ký hiệu Marking Text hoặc
                bấm <strong>🦉 Hỏi - Đáp</strong> để mở khung Thầy Cú Feynman!
              </p>
            </div>

            {/* Nội dung HTML của bài đọc dài */}
            <div
              style={{ fontSize: `${fontSize}px` }}
              className="rich-text-content text-slate-800 font-reading leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedArticleHtml }}
            />

            {/* Khung ghi chú khi in A4 để con tự tóm tắt tay trên giấy */}
            <div className="hidden print:block mt-10 pt-6 border-t-2 border-dashed border-slate-400 space-y-3">
              <h2 className="text-base font-bold text-slate-900">
                ✍️ PHẦN TỰ TÓM TẮT SƠ ĐỒ TƯ DUY TRÊN GIẤY CỦA CON:
              </h2>
              <p className="text-xs text-slate-600">
                Sau khi đọc và gạch chân từ khóa, con hãy tự vẽ hoặc viết sơ đồ ý chính
                dạng thụt lề vào khung dưới đây trước khi đối chiếu với Mindmap trên ứng
                dụng nhé:
              </p>
              <div className="h-56 border border-slate-400 rounded-xl" />
            </div>
          </article>

          {/* Danh sách các đoạn đã gắn ký hiệu Marking Text */}
          <MarkedHighlightsList
            highlights={highlights}
            onRemove={removeHighlight}
            onAskDeepDive={handleAskFromSelection}
          />
        </section>

        {/* ==================== PHẦN 2: SƠ ĐỒ TƯ DUY DẠNG THỤT LỀ ==================== */}
        <section className="print-mindmap-section pt-2">
          {!mindmapHtml ? (
            <div className="no-print print:hidden card rounded-3xl p-6 bg-gradient-to-br from-amber-50 via-yellow-50/70 to-amber-50 border border-amber-200/90 text-center space-y-3 shadow-2xs">
              <p className="text-xs sm:text-sm font-semibold text-amber-950 max-w-xl mx-auto">
                ✍️ Khi con đã đọc xong và tự tóm tắt ý chính ra giấy, hãy bấm nút dưới đây
                để tạo <strong>Sơ đồ tư duy dạng thụt lề</strong> đối chiếu và chỉnh sửa
                trực tiếp:
              </p>
              <button
                type="button"
                disabled={generatingMindmap}
                onClick={handleGenerateMindmap}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm sm:text-base font-extrabold shadow-md transition-all cursor-pointer"
              >
                {generatingMindmap ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Thầy Cú đang tổng hợp Sơ đồ tư duy dạng thụt lề...</span>
                  </>
                ) : (
                  <>
                    <Network className="w-5 h-5" />
                    <span>🌳 Tóm tắt bài đọc thành sơ đồ tư duy dạng thụt lề</span>
                  </>
                )}
              </button>

              {mindmapError && (
                <p className="text-xs font-bold text-rose-600 pt-1">
                  ⚠️ {mindmapError}
                </p>
              )}
            </div>
          ) : (
            <div className="card rounded-3xl p-6 sm:p-8 bg-white border-2 border-amber-300 shadow-sm space-y-4 print:border-0 print:shadow-none print:p-0">
              {/* Thanh hành động trên đầu Box Mindmap (Ẩn khi in A4) */}
              <div className="no-print print:hidden flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌳</span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      🌳 Sơ đồ tư duy dạng thụt lề
                    </h2>
                    <p className="text-xs text-slate-500">
                      Con có thể chỉnh sửa, tô sáng, đổi màu chữ hoặc thêm ghi chú trực tiếp
                      vào sơ đồ bên dưới
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerPrint('mindmap')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all cursor-pointer"
                    title="Chỉ in sạch Sơ đồ tư duy này trên khổ giấy A4"
                  >
                    <Printer className="w-4 h-4" />
                    <span>🖨️ Xuất / In Mindmap A4</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMindmap}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold transition-colors cursor-pointer"
                    title="Sao chép nội dung Sơ đồ tư duy"
                  >
                    {copiedMindmap ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>📋 Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={generatingMindmap}
                    onClick={handleGenerateMindmap}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Yêu cầu AI tóm tắt lại từ đầu"
                  >
                    {generatingMindmap ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    <span>🔄 Tạo lại</span>
                  </button>
                </div>
              </div>

              {mindmapError && (
                <div className="no-print print:hidden rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-700">
                  ⚠️ {mindmapError}
                </div>
              )}

              {/* Tiêu đề hiển thị riêng khi Xuất / In Mindmap A4 */}
              <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Sơ đồ tư duy dạng thụt lề · {article.subject || 'Tự do'} (Lớp{' '}
                  {article.grade || 7})
                </p>
                <h1 className="text-2xl font-black text-slate-900">
                  Sơ đồ tư duy: {cleanVietnameseText(article.title)}
                </h1>
              </div>

              {/* Trình soạn thảo RichTextEditor cho phép biên tập trực tiếp Sơ đồ tư duy */}
              <RichTextEditor
                value={mindmapHtml}
                onChange={setMindmapHtml}
                placeholder="Nội dung sơ đồ tư duy dạng thụt lề..."
                minHeightClass="min-h-[320px]"
                maxHeightClass="max-h-[72vh]"
                className="print:border-0"
              />
            </div>
          )}
        </section>
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

      {/* Nút nổi "🦉 Hỏi - Đáp" & Pop-up Drawer Thầy Cú Feynman */}
      <DeepDiveDrawer
        currentArticleId={article.slug || article.id}
        articleTitle={article.title}
        fullArticleContent={plainTextContent}
        isOpen={isDeepDiveOpen}
        onOpenChange={setIsDeepDiveOpen}
        selectedText={deepDiveSelectedText}
        onClearSelectedText={() => setDeepDiveSelectedText(undefined)}
      />
    </div>
  );
}
