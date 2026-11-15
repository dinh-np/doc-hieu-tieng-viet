'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Sparkles,
  X,
  BookOpen,
  Scissors,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';

export interface RagSourceItem {
  id: string;
  source_type: string;
  source_label: string;
  source_id: string;
  title: string;
  content_chunk?: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export interface RagChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: RagSourceItem[];
}

interface DeepDiveChatPanelProps {
  currentArticleId?: string;
  articleTitle?: string;
  initialSelectedText?: string;
  onClearSelectedText?: () => void;
  mode?: 'drawer' | 'page';
}

const QUICK_PROMPTS = [
  'Giải thích đoạn này theo cách đời thường nhất đi Cú Đôi!',
  'Từ khóa quan trọng nhất ở đây có gốc Hán-Việt hay tiếng Anh là gì?',
  'Chuyện này liên hệ gì với thực tế cuộc sống của tớ?',
  'Có câu tục ngữ nào nói về ý này không?',
];

const SOURCE_BADGE_STYLES: Record<string, { icon: string; badgeClass: string }> = {
  metacognition: {
    icon: '🧠',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  han_viet: {
    icon: '📘',
    badgeClass: 'bg-blue-50 text-[#0066ab] border-blue-200',
  },
  thuan_viet: {
    icon: '✨',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  proverb: {
    icon: '📜',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  one_page: {
    icon: '📄',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  short_reading: {
    icon: '📖',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
  },
};

function renderFormattedLine(line: string, lineKey: string) {
  const cleaned = cleanVietnameseText(line);
  const tokens = cleaned.split(/(\*\*[^*]+\*\*|\*[^*]+\*|🇬🇧)/g);

  return (
    <span key={lineKey}>
      {tokens.map((tok, i) => {
        if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
          return (
            <strong key={i} className="font-bold text-slate-900">
              {tok.slice(2, -2)}
            </strong>
          );
        }
        if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
          return (
            <em key={i} className="italic text-[#0066ab] font-medium">
              {tok.slice(1, -1)}
            </em>
          );
        }
        if (tok === '🇬🇧') {
          return (
            <span
              key={i}
              className="inline-flex items-center px-1 py-0.2 rounded bg-indigo-50 border border-indigo-200/80 text-[11px] mx-0.5 align-baseline"
            >
              🇬🇧
            </span>
          );
        }
        return <span key={i}>{tok}</span>;
      })}
    </span>
  );
}

function RichMessageContent({ text }: { text: string }) {
  const lines = cleanVietnameseText(text).split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-700">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (/^[-*•]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[-*•]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#0066ab] font-bold mt-0.5">•</span>
              <div className="flex-1">{renderFormattedLine(content, `li-${idx}`)}</div>
            </div>
          );
        }
        return <p key={idx}>{renderFormattedLine(trimmed, `p-${idx}`)}</p>;
      })}
    </div>
  );
}

export function DeepDiveChatPanel({
  currentArticleId,
  articleTitle,
  initialSelectedText,
  onClearSelectedText,
  mode = 'drawer',
}: DeepDiveChatPanelProps) {
  const storageKey = `deepdive_rag_chat_${currentArticleId || 'global'}`;
  const [messages, setMessages] = useState<RagChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedSourceKey, setExpandedSourceKey] = useState<string | null>(null);
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  // Tải lại lịch sử chat tạm thời theo bài học từ sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as RagChatMessage[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          return;
        }
      }
      setMessages([]);
    } catch {
      setMessages([]);
    }
  }, [storageKey]);

  // Lưu lịch sử chat khi thay đổi
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages, storageKey]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customQuestion?: string) => {
    const qText = cleanVietnameseText(customQuestion ?? input).trim();
    if (!qText || loading) return;

    const userMsg: RagChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: qText,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!customQuestion) setInput('');
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/qa-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qText,
          currentArticleId: currentArticleId || undefined,
          selectedText: initialSelectedText || undefined,
          chatHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể kết nối Cú Đôi Feynman lúc này.');
      }

      const aiMsg: RagChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: cleanVietnameseText(data.answer || ''),
        sources: Array.isArray(data.sources) ? data.sources : [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi hỏi Cú Đôi.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setErrorMsg(null);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`flex flex-col bg-white ${
        mode === 'page'
          ? 'h-[calc(100vh-220px)] min-h-[520px] rounded-3xl border border-gray-200 shadow-sm overflow-hidden'
          : 'h-full'
      }`}
    >
      {/* Thanh trạng thái & nút làm mới */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">🦉</span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-slate-800 truncate">
              Cú Đôi Feynman (RAG 5 Nguồn)
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              Kết nối Bài đọc · Hán-Việt · Thuần Việt · Tục ngữ
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors shrink-0"
            title="Bắt đầu cuộc trò chuyện mới"
          >
            <RotateCcw className="w-3 h-3" />
            Mới
          </button>
        )}
      </div>

      {/* Vùng hiển thị tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/80 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066ab]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#0066ab]">
                  Chào bạn nhỏ! Cú Đôi sẵn sàng giải mã
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Hãy hỏi bất cứ điều gì con đang thắc mắc! Cú Đôi sẽ lục tìm trong{' '}
                <strong>Bài đọc</strong>, <strong>Từ điển Hán-Việt / Thuần Việt</strong> và{' '}
                <strong>Kho Tục ngữ</strong> để giải thích cực dễ hiểu nhé.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                💡 Chạm nhanh để hỏi ngay:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-blue-50/70 border border-gray-200 hover:border-[#0066ab]/40 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0066ab] transition-all shadow-2xs"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#0066ab] text-white px-4 py-2.5 text-sm leading-relaxed shadow-xs">
                  {cleanVietnameseText(msg.content)}
                </div>
              ) : (
                <div className="max-w-[95%] w-full space-y-2">
                  <div className="rounded-2xl rounded-bl-sm bg-white border border-gray-200 px-4 py-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🦉</span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0066ab]">
                        Cú Đôi Feynman
                      </span>
                    </div>
                    <RichMessageContent text={msg.content} />
                  </div>

                  {/* Nguồn tham chiếu (Sources) */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pl-1 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400">
                        📚 Nguồn tri thức đã kết nối ({msg.sources.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => {
                          const style = SOURCE_BADGE_STYLES[src.source_type] || {
                            icon: '📎',
                            badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                          };
                          const sKey = `${msg.id}-${src.id}-${sIdx}`;
                          const isExpanded = expandedSourceKey === sKey;
                          return (
                            <button
                              key={sKey}
                              type="button"
                              onClick={() =>
                                setExpandedSourceKey(isExpanded ? null : sKey)
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all hover:opacity-90 ${style.badgeClass}`}
                              title="Bấm để xem đoạn trích nguồn"
                            >
                              <span>{style.icon}</span>
                              <span className="truncate max-w-[180px]">
                                {src.source_label}: {src.title}
                              </span>
                              {src.content_chunk &&
                                (isExpanded ? (
                                  <ChevronUp className="w-3 h-3 shrink-0" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 shrink-0" />
                                ))}
                            </button>
                          );
                        })}
                      </div>

                      {/* Trích đoạn gốc khi bấm vào nguồn */}
                      {msg.sources.map((src, sIdx) => {
                        const sKey = `${msg.id}-${src.id}-${sIdx}`;
                        if (expandedSourceKey !== sKey || !src.content_chunk) return null;
                        return (
                          <div
                            key={`${sKey}-detail`}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed whitespace-pre-line shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-slate-800">
                                {src.title} ({Math.round(src.similarity * 100)}% khớp)
                              </span>
                              <button
                                type="button"
                                onClick={() => setExpandedSourceKey(null)}
                                className="text-slate-400 hover:text-slate-700"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {cleanVietnameseText(src.content_chunk)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066ab]" />
              <span>Cú Đôi đang lục tìm kho tri thức &amp; suy nghĩ ví dụ...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div ref={scrollBottomRef} />
      </div>

      {/* Banner ngữ cảnh & Khung nhập liệu */}
      <div className="border-t border-gray-200 bg-white p-3 space-y-2 shrink-0">
        {(articleTitle || initialSelectedText) && (
          <div className="space-y-1.5">
            {articleTitle && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/70 text-[11px] text-[#0066ab] font-semibold">
                <BookOpen className="w-3 h-3 shrink-0" />
                <span className="truncate">Đang thảo luận bài: {articleTitle}</span>
              </div>
            )}
            {initialSelectedText && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Scissors className="w-3 h-3 text-amber-700 shrink-0" />
                  <span className="truncate font-semibold">
                    Đoạn đang bôi đen: &ldquo;{initialSelectedText}&rdquo;
                  </span>
                </div>
                {onClearSelectedText && (
                  <button
                    type="button"
                    onClick={onClearSelectedText}
                    className="text-amber-700 hover:text-amber-950 p-0.5 shrink-0"
                    title="Bỏ đoạn đang bôi đen"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập câu hỏi cho Cú Đôi Feynman..."
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#0066ab]/50 focus:ring-2 focus:ring-[#0066ab]/10 max-h-28"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-[#0066ab] text-white shadow-sm hover:opacity-95 disabled:opacity-40 transition-all shrink-0"
            title="Gửi câu hỏi"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

