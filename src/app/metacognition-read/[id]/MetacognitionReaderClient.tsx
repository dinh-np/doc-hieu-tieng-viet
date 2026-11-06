'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { cleanVietnameseText, deepNormalizeVietnamese } from '@/lib/utils/vietnamese-text';
import {
  ArrowLeft,
  Brain,
  Clock,
  Printer,
  FileDown,
  Lightbulb,
  Sparkles,
  MessageSquareQuote,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Highlighter,
  Trash2,
  Table2,
  Trophy,
  BookOpen,
  Eye,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import {
  MARKING_SYMBOLS_META,
  type MarkingSymbol,
  type MetacognitionArticle,
  type ChunkData,
  type HanVietPopItem,
  type TextHighlightAnnotation,
} from '@/types/metacognition';

interface MetacognitionReaderClientProps {
  article: MetacognitionArticle;
}

const ALL_SYMBOLS: MarkingSymbol[] = ['?', '!', '*', 'C', 'P', 'KL'];

interface PersistedStudentState {
  activeRecallAnswer: string;
  predictionAnswer: string;
  chunkSymbols: Record<string, MarkingSymbol[]>;
  chunkNotes: Record<string, string>;
  chunkHighlights: Record<string, TextHighlightAnnotation[]>;
  qarAnswers: Record<number, string>;
  matrixInputs: Record<number, string>;
  learned3: [string, string, string];
  surprises2: [string, string];
  trafficStatus: 'green' | 'yellow' | 'red';
  trafficQuestion: string;
  takeawayInput: string;
}

export function MetacognitionReaderClient({ article: rawArticle }: MetacognitionReaderClientProps) {
  const article = useMemo(() => deepNormalizeVietnamese(rawArticle), [rawArticle]);
  const storageKey = `doc_hieu_metacog_state_${article.id}_v1`;

  // ── State lưu trữ toàn bộ bài làm của học sinh (tự động đồng bộ LocalStorage) ──
  const [activeRecallAnswer, setActiveRecallAnswer] = useState<string>('');
  const [predictionAnswer, setPredictionAnswer] = useState<string>('');
  const [planningOpen, setPlanningOpen] = useState<boolean>(true);

  const [chunkSymbols, setChunkSymbols] = useState<Record<string, MarkingSymbol[]>>(() => {
    const init: Record<string, MarkingSymbol[]> = {};
    article.chunks.forEach((c) => {
      init[c.chunk_id] = c.student_reflection?.selected_symbols || [];
    });
    return init;
  });

  const [chunkNotes, setChunkNotes] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    article.chunks.forEach((c) => {
      init[c.chunk_id] = c.student_reflection?.thought_note || '';
    });
    return init;
  });

  const [chunkHighlights, setChunkHighlights] = useState<
    Record<string, TextHighlightAnnotation[]>
  >({});

  // Văn bản đang được bôi đen trong một chặng để gắn thẻ Marking Text
  const [pendingSelection, setPendingSelection] = useState<{
    chunkId: string;
    text: string;
  } | null>(null);

  // Từ Hán-Việt đang mở Pop-up giải nghĩa
  const [activeHanVietPopup, setActiveHanVietPopup] = useState<{
    chunkId: string;
    item: HanVietPopItem;
  } | null>(null);

  // State cho Pha 3: Evaluating
  const [qarAnswers, setQarAnswers] = useState<Record<number, string>>({});
  const [openQarHints, setOpenQarHints] = useState<Record<number, boolean>>({});
  const [matrixInputs, setMatrixInputs] = useState<Record<number, string>>({});
  const [showSampleMatrix, setShowSampleMatrix] = useState<boolean>(false);

  const [learned3, setLearned3] = useState<[string, string, string]>(['', '', '']);
  const [surprises2, setSurprises2] = useState<[string, string]>(['', '']);
  const [trafficStatus, setTrafficStatus] = useState<'green' | 'yellow' | 'red'>(
    article.evaluating.reflection_321.one_traffic_light.status || 'green'
  );
  const [trafficQuestion, setTrafficQuestion] = useState<string>(
    article.evaluating.reflection_321.one_traffic_light.question || ''
  );
  const [takeawayInput, setTakeawayInput] = useState<string>('');
  const [showSampleTakeaway, setShowSampleTakeaway] = useState<boolean>(false);
  const [activeLegendTooltip, setActiveLegendTooltip] = useState<MarkingSymbol | null>(null);

  // Tải dữ liệu đã lưu từ LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedStudentState>;
        if (parsed.activeRecallAnswer !== undefined)
          setActiveRecallAnswer(parsed.activeRecallAnswer);
        if (parsed.predictionAnswer !== undefined) setPredictionAnswer(parsed.predictionAnswer);
        if (parsed.chunkSymbols) setChunkSymbols(parsed.chunkSymbols);
        if (parsed.chunkNotes) setChunkNotes(parsed.chunkNotes);
        if (parsed.chunkHighlights) setChunkHighlights(parsed.chunkHighlights);
        if (parsed.qarAnswers) setQarAnswers(parsed.qarAnswers);
        if (parsed.matrixInputs) setMatrixInputs(parsed.matrixInputs);
        if (parsed.learned3) setLearned3(parsed.learned3);
        if (parsed.surprises2) setSurprises2(parsed.surprises2);
        if (parsed.trafficStatus) setTrafficStatus(parsed.trafficStatus);
        if (parsed.trafficQuestion !== undefined) setTrafficQuestion(parsed.trafficQuestion);
        if (parsed.takeawayInput !== undefined) setTakeawayInput(parsed.takeawayInput);
      }
    } catch {
      // ignore localStorage read errors
    }
  }, [storageKey]);

  // Tự động lưu vào LocalStorage khi có thay đổi
  useEffect(() => {
    try {
      const payload: PersistedStudentState = {
        activeRecallAnswer,
        predictionAnswer,
        chunkSymbols,
        chunkNotes,
        chunkHighlights,
        qarAnswers,
        matrixInputs,
        learned3,
        surprises2,
        trafficStatus,
        trafficQuestion,
        takeawayInput,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore localStorage write errors
    }
  }, [
    storageKey,
    activeRecallAnswer,
    predictionAnswer,
    chunkSymbols,
    chunkNotes,
    chunkHighlights,
    qarAnswers,
    matrixInputs,
    learned3,
    surprises2,
    trafficStatus,
    trafficQuestion,
    takeawayInput,
  ]);

  // ── Bật/Tắt ký hiệu Marking Text cho từng Chặng ─────────────────────────────
  const handleToggleChunkSymbol = (chunkId: string, sym: MarkingSymbol) => {
    setChunkSymbols((prev) => {
      const current = prev[chunkId] || [];
      const next = current.includes(sym)
        ? current.filter((s) => s !== sym)
        : [...current, sym];
      return { ...prev, [chunkId]: next };
    });
  };

  // ── Bắt sự kiện học sinh bôi đen văn bản trong Chặng để gắn thẻ Marking Text ──
  const handleTextSelectionInChunk = (chunkId: string) => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString().trim() : '';
    if (selectedText && selectedText.length >= 2 && selectedText.length <= 220) {
      setPendingSelection({ chunkId, text: selectedText });
    }
  };

  const handleAttachSymbolToSelection = (sym: MarkingSymbol) => {
    if (!pendingSelection) return;
    const { chunkId, text } = pendingSelection;
    const newAnnotation: TextHighlightAnnotation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      symbol: sym,
    };

    setChunkHighlights((prev) => ({
      ...prev,
      [chunkId]: [...(prev[chunkId] || []), newAnnotation],
    }));

    // Đồng thời bật luôn ký hiệu đó trong "Góc của con"
    setChunkSymbols((prev) => {
      const cur = prev[chunkId] || [];
      return cur.includes(sym) ? prev : { ...prev, [chunkId]: [...cur, sym] };
    });

    setPendingSelection(null);
    if (typeof window !== 'undefined') {
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleRemoveHighlight = (chunkId: string, annotationId: string) => {
    setChunkHighlights((prev) => ({
      ...prev,
      [chunkId]: (prev[chunkId] || []).filter((h) => h.id !== annotationId),
    }));
  };

  // ── Xuất file Word (.doc) chuẩn 2 cột để in hoặc chỉnh sửa ───────────────────
  const handleDownloadWordDoc = useCallback(() => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>${article.title}</title>
        <style>
          @page { size: A4 landscape; margin: 1.2cm; }
          body { font-family: "Times New Roman", serif; font-size: 11pt; color: #1e293b; line-height: 1.45; }
          h1 { font-size: 16pt; color: #0066ab; margin-bottom: 4pt; }
          h2 { font-size: 13pt; color: #0f172a; margin-top: 12pt; margin-bottom: 6pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 3pt; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; }
          th, td { border: 1px solid #94a3b8; padding: 6pt 8pt; vertical-align: top; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .feynman-box { background-color: #f8fafc; padding: 6pt; border-left: 3pt solid #0066ab; margin-bottom: 6pt; }
          .takeaway-box { background-color: #fef3c7; border: 2px solid #f59e0b; padding: 8pt; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>PHIẾU ĐỌC HIỂU SIÊU NHẬN THỨC 3 PHA: ${article.title}</h1>
        <p><strong>Môn:</strong> ${article.subject} Lớp ${article.grade} &nbsp;|&nbsp; <strong>Thời lượng:</strong> ${article.target_time_minutes} phút &nbsp;|&nbsp; <strong>Ký hiệu Marking Text:</strong> [?] Khó hiểu | [!] Bất ngờ | [*] Cốt lõi | [C] Kết nối | [P] Dự đoán | [KL] Kết luận</p>

        <h2>PHA 1: KÍCH HOẠT TƯ DUY (PLANNING PHASE)</h2>
        <table>
          <tr>
            <td width="50%">
              <strong>1. Khởi động não bộ (Active Recall):</strong><br/>
              ${article.planning.active_recall_question}<br/><br/>
              <em>Câu trả lời của con:</em> ${activeRecallAnswer || '................................................................................'}
            </td>
            <td width="50%">
              <strong>2. Dự đoán trước khi đọc (Prediction):</strong><br/>
              ${article.planning.prediction_prompt}<br/><br/>
              <em>Dự đoán của con:</em> ${predictionAnswer || '................................................................................'}
            </td>
          </tr>
        </table>

        <h2>PHA 2: ĐỌC SÂU CHIA CHẶNG & LỜI GIẢNG FEYNMAN (MONITORING PHASE)</h2>
        <table>
          <thead>
            <tr>
              <th width="58%">VĂN BẢN GỐC & TỪ HÁN-VIỆT (60%)</th>
              <th width="42%">LỜI GIẢNG FEYNMAN, BA LÀM MẪU & GÓC CỦA CON (40%)</th>
            </tr>
          </thead>
          <tbody>
            ${article.chunks
              .map((chunk) => {
                const cleanText = chunk.original_text.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                );
                const syms = (chunkSymbols[chunk.chunk_id] || []).map((s) => `[${s}]`).join(' ');
                const note = chunkNotes[chunk.chunk_id] || '';
                const glossaryHtml = (chunk.han_viet_Popup || [])
                  .map((g) => `• <b>${g.term}</b>: ${g.formula} (${g.meaning})`)
                  .join('<br/>');

                return `
                  <tr>
                    <td>
                      <strong>${chunk.title}</strong><br/><br/>
                      ${cleanText}<br/><br/>
                      ${glossaryHtml ? `<small><em>🔑 Giải mã Hán-Việt:</em><br/>${glossaryHtml}</small>` : ''}
                    </td>
                    <td>
                      <div class="feynman-box">
                        <strong>${chunk.feynman_explanation.dialogue_question}</strong><br/>
                        ${chunk.feynman_explanation.dialogue_answer
                          .replace(/Giải thích kiểu Feynman/g, 'Giải thích giản đơn')
                          .replace(
                            /^(💡\s*Giải thích giản đơn:?)/,
                            '<strong>$1</strong>'
                          )}<br/><br/>
                        <em>${chunk.feynman_explanation.metacognition_modeling}</em>
                      </div>
                      <strong>✍️ Góc của con:</strong><br/>
                      Ký hiệu đã chọn: ${syms || '[?] [!] [*] [C] [P] [KL]'}<br/>
                      Nhật ký suy nghĩ: ${note || '......................................................................'}
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>

        <h2>PHA 3: TỔNG KẾT & PHẢN TƯ (EVALUATING PHASE)</h2>
        <table>
          <thead>
            <tr>
              <th width="30%">Cấp độ câu hỏi QAR</th>
              <th width="70%">Câu hỏi & Bài làm của con</th>
            </tr>
          </thead>
          <tbody>
            ${article.evaluating.qar_questions
              .map(
                (q, idx) => `
              <tr>
                <td><strong>${q.level_label}</strong></td>
                <td>
                  ${q.question}<br/>
                  <em>Trả lời:</em> ${qarAnswers[idx] || '..........................................................................................'}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th width="35%">Hạng mục Sơ đồ Ma trận</th>
              <th width="65%">Từ khóa tóm tắt của con</th>
            </tr>
          </thead>
          <tbody>
            ${article.evaluating.mindmap_matrix
              .map(
                (m, idx) => `
              <tr>
                <td><strong>${m.category}</strong><br/><small>${m.prompt}</small></td>
                <td>${matrixInputs[idx] || m.sample_keywords || '..............................................................................'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="takeaway-box">
          🌟 CÂU KẾT LUẬN LỚN NHẤT RÚT RA SAU BÀI ĐỌC (TAKEAWAY):<br/>
          ${takeawayInput || article.evaluating.takeaway_sentence}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.slug || article.id}-phieu-sieu-nhan-thuc.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [
    article,
    activeRecallAnswer,
    predictionAnswer,
    chunkSymbols,
    chunkNotes,
    qarAnswers,
    matrixInputs,
    takeawayInput,
  ]);

  // ── Render đoạn văn bản gốc có in đậm từ khóa `**...**` và chạm mở Pop-up Hán-Việt ──
  const renderFormattedChunkText = (chunk: ChunkData) => {
    const glossaryMap = new Map<string, HanVietPopItem>();
    (chunk.han_viet_Popup || []).forEach((item) => {
      const normalizedKey = cleanVietnameseText(item.term).toLowerCase();
      glossaryMap.set(normalizedKey, {
        ...item,
        term: cleanVietnameseText(item.term),
        formula: cleanVietnameseText(item.formula),
        meaning: cleanVietnameseText(item.meaning),
        english_anchor: item.english_anchor ? cleanVietnameseText(item.english_anchor) : undefined,
      });
    });

    const normalizedOriginalText = cleanVietnameseText(chunk.original_text);
    const parts = normalizedOriginalText.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const innerText = cleanVietnameseText(part.slice(2, -2));
        const hvItem = glossaryMap.get(innerText.toLowerCase());

        if (hvItem) {
          const isOpen =
            activeHanVietPopup?.chunkId === chunk.chunk_id &&
            cleanVietnameseText(activeHanVietPopup?.item.term).toLowerCase() ===
              innerText.toLowerCase();

          return (
            <span key={idx} className="relative inline-block">
              <button
                type="button"
                onClick={() =>
                  setActiveHanVietPopup(
                    isOpen ? null : { chunkId: chunk.chunk_id, item: hvItem }
                  )
                }
                onMouseEnter={() =>
                  setActiveHanVietPopup({ chunkId: chunk.chunk_id, item: hvItem })
                }
                className="font-extrabold text-[#0066ab] bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded-md underline decoration-dashed decoration-[#0066ab] underline-offset-4 cursor-pointer transition-colors whitespace-nowrap"
                title="Chạm để bẻ khóa từ Hán-Việt"
              >
                {innerText.normalize('NFC')}
                <span className="ml-1 text-[10px] font-black text-amber-600 align-top">🔑</span>
              </button>

              {isOpen && (
                <span className="no-print absolute left-0 bottom-full mb-2 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 z-50 text-left block space-y-1.5 font-sans">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      🔑 Bẻ khóa Hán - Việt: {hvItem.term.normalize('NFC')}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHanVietPopup(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                  <span className="block text-xs font-extrabold text-emerald-300 bg-slate-800 px-2.5 py-1.5 rounded-lg">
                    📐 {hvItem.formula.normalize('NFC')}
                  </span>
                  <span className="block text-xs text-slate-200 leading-relaxed">
                    {hvItem.meaning.normalize('NFC')}
                  </span>
                  {hvItem.english_anchor && (
                    <span className="inline-block text-[11px] font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700">
                      🇬🇧 {hvItem.english_anchor.normalize('NFC')}
                    </span>
                  )}
                </span>
              )}
            </span>
          );
        }

        // Từ khóa in đậm thông thường
        return (
          <strong
            key={idx}
            className="font-extrabold text-slate-900 bg-amber-100/70 px-1 rounded"
          >
            {innerText.normalize('NFC')}
          </strong>
        );
      }

      return <React.Fragment key={idx}>{part.normalize('NFC')}</React.Fragment>;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-24">
      <Header />

      {/* ── BANNER CỐ ĐỊNH TRA CỨU NHANH 6 KÝ HIỆU MARKING TEXT (STICKY LEGEND BAR) ── */}
      <div className="no-print sticky top-14 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
            <Highlighter className="w-3.5 h-3.5 text-[#0066ab]" />
            <span>6 Ký Hiệu Marking Text:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {ALL_SYMBOLS.map((sym) => {
              const meta = MARKING_SYMBOLS_META[sym];
              const isTooltipOpen = activeLegendTooltip === sym;
              return (
                <div key={sym} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveLegendTooltip(isTooltipOpen ? null : sym)}
                    onMouseEnter={() => setActiveLegendTooltip(sym)}
                    onMouseLeave={() => setActiveLegendTooltip(null)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${meta.badgeClass}`}
                  >
                    {meta.shortDesc}
                  </button>
                  {isTooltipOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] leading-relaxed shadow-lg z-50 pointer-events-none">
                      <strong className="text-amber-300">{meta.shortDesc}:</strong> {meta.fullDesc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── GIAO DIỆN CHÍNH TRÊN MÀN HÌNH (SCREEN VIEW) ─────────────────────── */}
      <main className="no-print max-w-6xl mx-auto px-4 pt-6 space-y-8">
        {/* Thanh tiêu đề & Nút Xuất Bản In A4 / Word */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/metacognition-read"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0066ab] bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Danh sách bài đọc Siêu nhận thức
            </Link>

            {/* Nút Xuất bản in A4 & Tải file Word */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-xs"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                Xuất bản in A4
              </button>

              <button
                type="button"
                onClick={handleDownloadWordDoc}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066ab] text-white text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                Tải file Word (.doc)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066ab] border border-blue-200 text-xs font-extrabold">
                📚 {article.subject} Lớp {article.grade}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-[#0066ab]" />
                 mục tiêu {article.target_time_minutes} phút
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Brain className="w-3.5 h-3.5 text-amber-600" />
                Mô hình 3 Pha + Feynman + Ba làm mẫu
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-sm sm:text-base text-slate-600">{article.subtitle}</p>
            )}
          </div>
        </section>

        {/* =====================================================================
            PHA 1: KÍCH HOẠT TƯ DUY — PLANNING PHASE
           ===================================================================== */}
        <section className="bg-white rounded-3xl border-2 border-blue-200 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setPlanningOpen((o) => !o)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 flex items-center justify-between text-left border-b border-blue-100"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-[#0066ab] text-white text-xs font-black uppercase tracking-wider">
                PHA 1 • PLANNING
              </span>
              <div>
                <h2 className="font-black text-slate-900 text-base sm:text-lg">
                  Kích Hoạt Tư Duy Trước Khi Đọc (Active Recall & Prediction)
                </h2>
                <p className="text-xs text-slate-500">
                  Khởi động não bộ 2 phút trước khi vào bài đọc chính
                </p>
              </div>
            </div>
            {planningOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {planningOpen && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Active Recall */}
              <div className="rounded-2xl bg-blue-50/50 border border-blue-200 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                      BƯỚC 1.1 • ACTIVE RECALL
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Khởi động não bộ (Gợi nhớ kiến thức cũ)
                    </h3>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  {article.planning.active_recall_question}
                </p>
                <textarea
                  rows={3}
                  value={activeRecallAnswer}
                  onChange={(e) => setActiveRecallAnswer(e.target.value)}
                  placeholder="Con gõ nhanh những gì con nhớ được vào đây nhé..."
                  className="w-full rounded-xl bg-white border border-blue-200 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066ab]"
                />
              </div>

              {/* Card 2: Prediction */}
              <div className="rounded-2xl bg-purple-50/50 border border-purple-200 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-600 text-white">
                    <Lightbulb className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                      BƯỚC 1.2 • PREDICTION
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Dự đoán trước khi đọc (Định hướng mục tiêu)
                    </h3>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  {article.planning.prediction_prompt}
                </p>
                <textarea
                  rows={3}
                  value={predictionAnswer}
                  onChange={(e) => setPredictionAnswer(e.target.value)}
                  placeholder="Con thử đoán trước câu trả lời xem lát nữa đọc bài có đúng không nhé..."
                  className="w-full rounded-xl bg-white border border-purple-200 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </section>

        {/* =====================================================================
            PHA 2: ĐỌC SÂU CHIA CHẶNG — MONITORING PHASE (SPLIT SCREEN 60% / 40%)
           ===================================================================== */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-black uppercase tracking-wider">
                PHA 2 • MONITORING
              </span>
              <h2 className="font-black text-slate-900 text-lg sm:text-xl">
                Đọc Sâu Chia Chặng (60% Văn Bản Gốc — 40% Feynman & Tư Duy)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              💡 Mẹo: Chạm vào từ có biểu tượng 🔑 để bẻ khóa Hán-Việt, hoặc bôi đen chữ để gắn thẻ Marking Text!
            </span>
          </div>

          {/* Danh sách từng Chặng (Chunk) */}
          <div className="space-y-6">
            {article.chunks.map((chunk) => {
              const selectedSyms = chunkSymbols[chunk.chunk_id] || [];
              const noteValue = chunkNotes[chunk.chunk_id] || '';
              const highlights = chunkHighlights[chunk.chunk_id] || [];
              const isSelectionInThisChunk = pendingSelection?.chunkId === chunk.chunk_id;

              return (
                <div
                  key={chunk.chunk_id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Tiêu đề Chặng */}
                  <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#0066ab] text-white font-black text-xs flex items-center justify-center">
                        #{chunk.order}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base">{chunk.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {selectedSyms.map((sym) => (
                        <span
                          key={sym}
                          className={`px-2 py-0.5 rounded text-[11px] font-black border ${MARKING_SYMBOLS_META[sym].badgeClass}`}
                        >
                          [{sym}]
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bố cục 2 Cột: Cột Trái 60% (7/12) - Cột Phải 40% (5/12) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {/* ── CỘT TRÁI (60% - VĂN BẢN GỐC & MARKING TEXT) ── */}
                    <div className="lg:col-span-7 p-6 sm:p-7 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#0066ab]" />
                            Văn bản gốc SGK (Bôi đen chữ để gắn ký hiệu)
                          </span>
                          <span>Chặng {chunk.order}/{article.chunks.length}</span>
                        </div>

                        {/* Đoạn văn bản chính */}
                        <div
                          onMouseUp={() => handleTextSelectionInChunk(chunk.chunk_id)}
                          onTouchEnd={() => handleTextSelectionInChunk(chunk.chunk_id)}
                          className="text-base sm:text-lg leading-[1.85] text-slate-800 font-reading select-text bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90"
                        >
                          {renderFormattedChunkText(chunk)}
                        </div>

                        {/* Thanh công cụ nổi khi học sinh bôi đen một cụm từ */}
                        {isSelectionInThisChunk && pendingSelection && (
                          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-lg animate-fade-in-up">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-amber-300 truncate">
                                🖍️ Gắn ký hiệu cho đoạn: &ldquo;{pendingSelection.text}&rdquo;
                              </span>
                              <button
                                type="button"
                                onClick={() => setPendingSelection(null)}
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                Đóng ✕
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {ALL_SYMBOLS.map((sym) => {
                                const meta = MARKING_SYMBOLS_META[sym];
                                return (
                                  <button
                                    key={sym}
                                    type="button"
                                    onClick={() => handleAttachSymbolToSelection(sym)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-transform hover:scale-105 ${meta.badgeClass}`}
                                  >
                                    {meta.shortDesc}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Danh sách các cụm từ con đã bôi đen đánh dấu trong chặng */}
                        {highlights.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                              📌 Các chi tiết con đã đánh dấu Marking Text ({highlights.length}):
                            </p>
                            <div className="space-y-1.5">
                              {highlights.map((hl) => {
                                const meta = MARKING_SYMBOLS_META[hl.symbol];
                                return (
                                  <div
                                    key={hl.id}
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs"
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
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveHighlight(chunk.chunk_id, hl.id)
                                      }
                                      className="text-slate-400 hover:text-rose-600 p-1"
                                      title="Xóa đánh dấu"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Danh mục giải mã nhanh các từ Hán-Việt trong chặng */}
                      {chunk.han_viet_Popup && chunk.han_viet_Popup.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            🔑 Từ khóa Hán - Việt trong chặng (Chạm để xem công thức gốc từ):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {chunk.han_viet_Popup.map((hv) => (
                              <button
                                key={hv.term}
                                type="button"
                                onClick={() =>
                                  setActiveHanVietPopup({
                                    chunkId: chunk.chunk_id,
                                    item: hv,
                                  })
                                }
                                className="px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0066ab] transition-all flex items-center gap-1.5"
                              >
                                <span>{hv.term}</span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  ({hv.formula})
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── CỘT PHẢI (40% - LỜI GIẢNG FEYNMAN & GÓC CỦA CON) ── */}
                    <div className="lg:col-span-5 p-6 bg-slate-50/60 space-y-5 flex flex-col justify-between">
                      {/* Khối 1: Lời giảng Feynman & Ba làm mẫu */}
                      <div className="rounded-2xl bg-white border border-blue-200 p-4 sm:p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-blue-100 text-[#0066ab]">
                            <MessageSquareQuote className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider text-[#0066ab]">
                            LỜI GIẢNG FEYNMAN & BA LÀM MẪU
                          </span>
                        </div>

                        <p className="text-sm font-extrabold text-slate-900 leading-snug">
                          {chunk.feynman_explanation.dialogue_question}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          {(() => {
                            const normalizedAnswer =
                              chunk.feynman_explanation.dialogue_answer.replace(
                                /Giải thích kiểu Feynman/g,
                                'Giải thích giản đơn'
                              );
                            const match = normalizedAnswer.match(
                              /^(💡\s*Giải thích giản đơn:?)\s*(.*)$/s
                            );
                            if (match) {
                              return (
                                <>
                                  <strong className="font-bold text-slate-900">
                                    {match[1]}
                                  </strong>{' '}
                                  {match[2]}
                                </>
                              );
                            }
                            return normalizedAnswer;
                          })()}
                        </p>

                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                          {chunk.feynman_explanation.metacognition_modeling}
                        </div>
                      </div>

                      {/* Khối 2: Góc của con (Tự ghi tư duy) */}
                      <div className="rounded-2xl bg-white border border-emerald-200 p-4 sm:p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                            ✍️ GÓC CỦA CON (TỰ GHI TƯ DUY)
                          </span>
                          <span className="text-[11px] text-slate-400">Tự động lưu</span>
                        </div>

                        {/* Bộ nút chọn nhanh ký hiệu */}
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-slate-600">
                            1. Đánh dấu cảm nhận của con ở chặng này:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {ALL_SYMBOLS.map((sym) => {
                              const meta = MARKING_SYMBOLS_META[sym];
                              const isPicked = selectedSyms.includes(sym);
                              return (
                                <button
                                  key={sym}
                                  type="button"
                                  onClick={() => handleToggleChunkSymbol(chunk.chunk_id, sym)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                                    isPicked
                                      ? `${meta.badgeClass} ring-2 ring-offset-1 ring-blue-400 scale-105 font-black`
                                      : 'bg-gray-50 text-slate-600 border-gray-200 hover:bg-gray-100'
                                  }`}
                                >
                                  [{sym}] {meta.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Ô textarea Nhật ký 5 từ / Suy nghĩ tức thì */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-600">
                            2. Nhật ký 5 từ / Suy nghĩ tức thì của con:
                          </label>
                          <textarea
                            rows={2}
                            value={noteValue}
                            onChange={(e) =>
                              setChunkNotes((prev) => ({
                                ...prev,
                                [chunk.chunk_id]: e.target.value,
                              }))
                            }
                            placeholder="Tóm tắt chặng này bằng 5-10 từ của riêng con hoặc ghi điều con thắc mắc..."
                            className="w-full rounded-xl bg-slate-50 border border-gray-200 p-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            PHA 3: TỔNG KẾT & PHẢN TƯ — EVALUATING PHASE
           ===================================================================== */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider">
              PHA 3 • EVALUATING
            </span>
            <h2 className="font-black text-slate-900 text-lg sm:text-2xl">
              Tổng Kết Nhận Thức & Phản Tư Sau Đọc
            </h2>
          </div>

          {/* ── MODULE 1: THỬ THÁCH QAR 3 NẤC NHẬN THỨC ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#0066ab]">
                MODULE 1 • QAR FRAMEWORK
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Thử Thách QAR 3 Nấc Nhận Thức (Right There ➔ Think & Search ➔ Author & Me)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {article.evaluating.qar_questions.map((qar, idx) => {
                const badgeStyle =
                  qar.type === 'right_there'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : qar.type === 'think_search'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-purple-100 text-purple-800 border-purple-300';

                const isHintOpen = !!openQarHints[idx];

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${badgeStyle}`}
                      >
                        🎯 {qar.level_label}
                      </span>

                      {qar.hint && (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenQarHints((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066ab] bg-white px-3 py-1 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          {isHintOpen ? 'Ẩn gợi ý của Ba/Thầy' : 'Xem gợi ý của Ba/Thầy'}
                        </button>
                      )}
                    </div>

                    <p className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                      {qar.question}
                    </p>

                    {isHintOpen && qar.hint && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                        <strong>💡 Gợi ý của Ba/Thầy:</strong> {qar.hint}
                      </div>
                    )}

                    <textarea
                      rows={2}
                      value={qarAnswers[idx] || ''}
                      onChange={(e) =>
                        setQarAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                      }
                      placeholder="Nhập câu trả lời của con..."
                      className="w-full rounded-xl bg-white border border-gray-200 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066ab]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MODULE 2: SƠ ĐỒ TƯ DUY DẠNG MA TRẬN BẢNG (INTERACTIVE MATRIX TABLE) ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  MODULE 2 • INTERACTIVE MINDMAP MATRIX
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-amber-600" />
                  Sơ Đồ Tư Duy Ma Trận Bảng (Tự gõ từ khóa chốt bài)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowSampleMatrix((s) => !s)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                {showSampleMatrix ? 'Ẩn từ khóa đối chiếu' : 'Đối chiếu từ khóa mẫu'}
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="p-4 w-1/3 border-r border-slate-700">Mảnh ghép kiến thức</th>
                    <th className="p-4">Từ khóa tóm tắt của con</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {article.evaluating.mindmap_matrix.map((row, idx) => (
                    <tr key={idx} className="bg-white hover:bg-slate-50/70">
                      <td className="p-4 align-top border-r border-gray-200 space-y-1">
                        <p className="font-extrabold text-slate-900">{row.category}</p>
                        <p className="text-xs text-slate-500">{row.prompt}</p>
                      </td>
                      <td className="p-4 align-top space-y-2">
                        <input
                          type="text"
                          value={matrixInputs[idx] || ''}
                          onChange={(e) =>
                            setMatrixInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          placeholder="Gõ từ khóa ngắn gọn (VD: A ➔ B)..."
                          className="w-full rounded-xl bg-slate-50 border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066ab]"
                        />
                        {showSampleMatrix && row.sample_keywords && (
                          <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            ✓ Gợi ý từ khóa: {row.sample_keywords}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MODULE 3: NHẬT KÝ PHẢN TƯ 3-2-1 KẾT HỢP ĐÈN GIAO THÔNG ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                MODULE 3 • REFLECTION 3-2-1 & TRAFFIC LIGHT
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Nhật Ký Phản Tư 3 - 2 - 1 & Đèn Giao Thông Tự Đánh Giá
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3 Điều học được */}
              <div className="space-y-3 p-5 rounded-2xl bg-blue-50/40 border border-blue-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    3️⃣ Ba điều tâm đắc nhất con học được hôm nay:
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setLearned3([
                        article.evaluating.reflection_321.three_learned[0] || '',
                        article.evaluating.reflection_321.three_learned[1] || '',
                        article.evaluating.reflection_321.three_learned[2] || '',
                      ])
                    }
                    className="text-[11px] font-bold text-[#0066ab] hover:underline"
                  >
                    Điền gợi ý mẫu
                  </button>
                </div>
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={learned3[i]}
                    onChange={(e) => {
                      const next: [string, string, string] = [...learned3] as [
                        string,
                        string,
                        string,
                      ];
                      next[i] = e.target.value;
                      setLearned3(next);
                    }}
                    placeholder={`Điều học được thứ ${i + 1}...`}
                    className="w-full rounded-xl bg-white border border-blue-200 px-3.5 py-2 text-xs sm:text-sm text-slate-800"
                  />
                ))}
              </div>

              {/* 2 Điều bất ngờ */}
              <div className="space-y-3 p-5 rounded-2xl bg-amber-50/40 border border-amber-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    2️⃣ Hai chi tiết khiến con bất ngờ / thích thú nhất:
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setSurprises2([
                        article.evaluating.reflection_321.two_surprises[0] || '',
                        article.evaluating.reflection_321.two_surprises[1] || '',
                      ])
                    }
                    className="text-[11px] font-bold text-amber-800 hover:underline"
                  >
                    Điền gợi ý mẫu
                  </button>
                </div>
                {[0, 1].map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={surprises2[i]}
                    onChange={(e) => {
                      const next: [string, string] = [...surprises2] as [string, string];
                      next[i] = e.target.value;
                      setSurprises2(next);
                    }}
                    placeholder={`Chi tiết bất ngờ thứ ${i + 1}...`}
                    className="w-full rounded-xl bg-white border border-amber-200 px-3.5 py-2 text-xs sm:text-sm text-slate-800"
                  />
                ))}
              </div>
            </div>

            {/* 1 Đèn giao thông tự đánh giá */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                1️⃣ Đèn Giao Thông Siêu Nhận Thức (Mức độ hiểu bài của con hiện tại):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTrafficStatus('green')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    trafficStatus === 'green'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-800 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-2xl">🟢</span>
                  <div>
                    <p className="font-extrabold text-sm">Đèn Xanh — Đã hiểu</p>
                    <p
                      className={`text-xs ${
                        trafficStatus === 'green' ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      Con có thể giảng lại cho Ba/Mẹ!
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTrafficStatus('yellow')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    trafficStatus === 'yellow'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-800 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl">🟡</span>
                  <div>
                    <p className="font-extrabold text-sm">Đèn Vàng — Lúng túng</p>
                    <p
                      className={`text-xs ${
                        trafficStatus === 'yellow' ? 'text-amber-100' : 'text-slate-500'
                      }`}
                    >
                      Hiểu ý chính nhưng còn 1 vài chỗ mơ hồ.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTrafficStatus('red')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    trafficStatus === 'red'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-800 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <span className="text-2xl">🔴</span>
                  <div>
                    <p className="font-extrabold text-sm">Đèn Đỏ — Cần hỏi thêm</p>
                    <p
                      className={`text-xs ${
                        trafficStatus === 'red' ? 'text-rose-100' : 'text-slate-500'
                      }`}
                    >
                      Cần Ba/Mẹ hoặc Thầy/Cô giải thích lại.
                    </p>
                  </div>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">
                  ❓ Câu hỏi con muốn hỏi thêm Ba/Mẹ hoặc Thầy/Cô:
                </label>
                <input
                  type="text"
                  value={trafficQuestion}
                  onChange={(e) => setTrafficQuestion(e.target.value)}
                  placeholder="Gõ điều con vẫn còn băn khoăn hoặc muốn tìm hiểu sâu hơn..."
                  className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* ── MODULE 4: Ô TAKEAWAY VÀNG RỰC RỠ ── */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-slate-950 text-amber-300">
                  <Trophy className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-900/80">
                    MODULE 4 • GOLDEN TAKEAWAY
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-950">
                    Câu Kết Luận Lớn Nhất Rút Ra Sau Bài Đọc
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSampleTakeaway(true);
                  if (!takeawayInput.trim()) {
                    setTakeawayInput(article.evaluating.takeaway_sentence);
                  }
                  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
                }}
                className="px-4 py-2 rounded-xl bg-slate-950 text-amber-300 text-xs font-extrabold hover:bg-slate-900 transition-all shadow-sm"
              >
                ✨ Hoàn thành & Đối chiếu câu chốt vàng
              </button>
            </div>

            <textarea
              rows={3}
              value={takeawayInput}
              onChange={(e) => setTakeawayInput(e.target.value)}
              placeholder="Đúc kết toàn bộ bài học hôm nay bằng 1 câu tâm đắc nhất của con..."
              className="w-full rounded-2xl bg-white/95 border-2 border-amber-600/40 p-4 text-sm sm:text-base font-bold text-slate-900 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            {showSampleTakeaway && (
              <div className="p-4 rounded-2xl bg-slate-950/90 text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">🌟 Câu Takeaway chuẩn của bài: </strong>
                  {article.evaluating.takeaway_sentence}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =======================================================================
          BẢN IN A4 WORKSHEET 2 CỘT CHUẨN (@media print)
         ======================================================================= */}
      <div className="hidden print:block p-4 text-black text-[11pt] leading-snug font-serif">
        <div className="border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-[15pt] font-bold uppercase">{article.title}</h1>
            <p className="text-[10pt]">
              Môn: {article.subject} Lớp {article.grade} | Phương pháp Siêu nhận thức 3 Pha (Planning – Monitoring – Evaluating)
            </p>
          </div>
          <div className="text-right text-[9pt] border border-black px-2 py-1">
            <strong>Ký hiệu Marking Text:</strong>
            <br />
            [?] Khó hiểu | [!] Bất ngờ | [*] Cốt lõi | [C] Kết nối | [P] Dự đoán | [KL] Kết luận
          </div>
        </div>

        {/* Pha 1 trên bản in */}
        <div className="mb-3 border border-black p-2">
          <p className="font-bold uppercase text-[10pt] mb-1">
            PHA 1: KÍCH HOẠT TƯ DUY (PLANNING)
          </p>
          <div className="grid grid-cols-2 gap-4 text-[10pt]">
            <div>
              <strong>1. Active Recall:</strong> {article.planning.active_recall_question}
              <br />
              <em>Trả lời:</em> {activeRecallAnswer || '................................................................................'}
            </div>
            <div>
              <strong>2. Dự đoán:</strong> {article.planning.prediction_prompt}
              <br />
              <em>Dự đoán:</em> {predictionAnswer || '................................................................................'}
            </div>
          </div>
        </div>

        {/* Pha 2: Bảng 2 cột trên bản in */}
        <table className="w-full border-collapse border border-black mb-3 text-[10pt]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-[58%] text-left">
                CỘT TRÁI (60%): VĂN BẢN GỐC & GIẢI MÃ HÁN - VIỆT
              </th>
              <th className="border border-black p-2 w-[42%] text-left">
                CỘT PHẢI (40%): FEYNMAN, BA LÀM MẪU & GÓC CỦA CON
              </th>
            </tr>
          </thead>
          <tbody>
            {article.chunks.map((chunk) => (
              <tr key={chunk.chunk_id}>
                <td className="border border-black p-2 align-top">
                  <p className="font-bold mb-1">{chunk.title}</p>
                  <p className="mb-2">{chunk.original_text.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                  {chunk.han_viet_Popup && chunk.han_viet_Popup.length > 0 && (
                    <div className="text-[9pt] border-t border-dashed border-gray-400 pt-1">
                      <strong>🔑 Từ Hán-Việt: </strong>
                      {chunk.han_viet_Popup
                        .map((g) => `${g.term} (${g.formula})`)
                        .join(' • ')}
                    </div>
                  )}
                </td>
                <td className="border border-black p-2 align-top">
                  <p className="font-bold">{chunk.feynman_explanation.dialogue_question}</p>
                  <p className="mb-1">
                    {(() => {
                      const normalizedAnswer =
                        chunk.feynman_explanation.dialogue_answer.replace(
                          /Giải thích kiểu Feynman/g,
                          'Giải thích giản đơn'
                        );
                      const match = normalizedAnswer.match(
                        /^(💡\s*Giải thích giản đơn:?)\s*(.*)$/s
                      );
                      if (match) {
                        return (
                          <>
                            <strong>{match[1]}</strong> {match[2]}
                          </>
                        );
                      }
                      return normalizedAnswer;
                    })()}
                  </p>
                  <p className="italic text-[9pt] mb-2">
                    {chunk.feynman_explanation.metacognition_modeling}
                  </p>
                  <div className="border-t border-black pt-1 text-[9pt]">
                    <strong>✍️ Góc của con:</strong> [?] [!] [*] [C] [P] [KL]
                    <br />
                    Ghi chú: {chunkNotes[chunk.chunk_id] || '............................................................'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pha 3 trên bản in */}
        <div className="border border-black p-2 space-y-1 text-[10pt]">
          <p className="font-bold uppercase">
            PHA 3: TỔNG KẾT QAR, PHẢN TƯ 3-2-1 & TAKEAWAY
          </p>
          {article.evaluating.qar_questions.map((q, idx) => (
            <p key={idx}>
              <strong>• {q.level_label}:</strong> {q.question}
            </p>
          ))}
          <p className="pt-1 font-bold">
            🌟 Takeaway: {takeawayInput || article.evaluating.takeaway_sentence}
          </p>
        </div>
      </div>
    </div>
  );
}

