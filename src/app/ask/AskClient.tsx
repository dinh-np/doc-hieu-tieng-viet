'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { DeepDiveChatPanel } from '@/components/rag/DeepDiveChatPanel';
import { Filter, Globe2 } from 'lucide-react';

export interface AskArticleOption {
  id: string;
  title: string;
  group: 'metacognition' | 'one_page' | 'short_reading';
  groupLabel: string;
}

interface AskClientProps {
  articles: AskArticleOption[];
}

export default function AskClient({ articles }: AskClientProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  const metaArticles = articles.filter((a) => a.group === 'metacognition');
  const onePageArticles = articles.filter((a) => a.group === 'one_page');
  const shortArticles = articles.filter((a) => a.group === 'short_reading');

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-5">
        {/* Tiêu đề & Bộ lọc phạm vi bài học */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
              <span className="mr-2">🦉</span>
              <span className="gradient-text">Hỏi Đáp Đào Sâu</span>{' '}
              <span>Kiến Thức</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Trò chuyện cùng Thầy Cú Feynman — kết nối thông minh từ Bài đọc, Từ điển Hán-Việt/Thuần Việt &amp; Tục ngữ Việt Nam
            </p>
          </div>

          {/* Bộ chọn bài học để khoanh vùng RAG */}
          <div className="w-full md:w-80 shrink-0">
            <label
              htmlFor="rag-article-scope"
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
            >
              <Filter className="w-3 h-3 text-[#0066ab]" />
              Phạm vi ưu tiên:
            </label>
            <div className="relative">
              <select
                id="rag-article-scope"
                value={selectedArticleId}
                onChange={(e) => setSelectedArticleId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-[#0066ab]/50 focus:ring-2 focus:ring-[#0066ab]/10"
              >
                <option value="">🌐 Hỏi toàn bộ kho tri thức (5 nguồn)</option>
                {metaArticles.length > 0 && (
                  <optgroup label="🧠 Đọc Siêu Nhận Thức">
                    {metaArticles.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </optgroup>
                )}
                {onePageArticles.length > 0 && (
                  <optgroup label="📄 Bài Đọc 1 Trang">
                    {onePageArticles.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </optgroup>
                )}
                {shortArticles.length > 0 && (
                  <optgroup label="📖 Bài Đọc Ngắn">
                    {shortArticles.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Badge chế độ hiện tại */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {selectedArticle ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066ab] font-bold">
              <span>🎯 Ưu tiên bài: {selectedArticle.title}</span>
              <button
                type="button"
                onClick={() => setSelectedArticleId('')}
                className="underline text-[11px] hover:text-blue-900"
              >
                (Chuyển về toàn bộ kho)
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Chế độ: Tra cứu chéo toàn bộ 5 nguồn tri thức</span>
            </div>
          )}
        </div>

        {/* Khung Chat Sư phạm */}
        <DeepDiveChatPanel
          mode="page"
          currentArticleId={selectedArticle?.id}
          articleTitle={selectedArticle?.title}
        />
      </main>
    </div>
  );
}

