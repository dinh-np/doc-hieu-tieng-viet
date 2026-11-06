import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Brain,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Printer,
  MessageSquareQuote,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { createClient } from '@/lib/supabase/server';
import { METACOGNITION_ARTICLES_SEED } from '@/data/metacognition-seed';
import type { MetacognitionArticle } from '@/types/metacognition';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Đọc Siêu Nhận Thức 3 Pha | Feynman & Giàn Giáo Ba - Con',
  description:
    'Phương pháp đọc hiểu Siêu nhận thức (Metacognition) 3 pha: Planning - Monitoring - Evaluating kết hợp Lời giảng Feynman, Marking Text 6 ký hiệu và mô hình Ba làm mẫu Think-Aloud.',
};

async function getMetacognitionArticles(): Promise<MetacognitionArticle[]> {
  const articles: MetacognitionArticle[] = [...METACOGNITION_ARTICLES_SEED];
  const seenIds = new Set(articles.map((a) => a.id));

  try {
    const supabase = await createClient();
    // Ưu tiên truy vấn theo `.eq('article_type', 'metacognition')`, fallback sang `.eq('category', 'metacognition')`
    let rows: { id: unknown; slug: unknown; title: unknown; category?: unknown; article_type?: unknown; structured_data: unknown }[] | null = null;

    const { data: byType, error: typeErr } = await supabase
      .from('one_page_articles')
      .select('id, slug, title, category, article_type, structured_data')
      .eq('is_published', true)
      .eq('article_type', 'metacognition');

    if (!typeErr && byType) {
      rows = byType;
    } else {
      const { data: byCategory } = await supabase
        .from('one_page_articles')
        .select('id, slug, title, category, structured_data')
        .eq('is_published', true)
        .eq('category', 'metacognition');
      rows = byCategory;
    }

    if (rows) {
      for (const row of rows) {
        const sd = row.structured_data as Record<string, unknown> | null;
        if (sd && Array.isArray(sd.chunks)) {
          const slugOrId = (row.slug as string) || (row.id as string);
          if (!seenIds.has(slugOrId)) {
            seenIds.add(slugOrId);
            articles.push({
              ...(sd as unknown as MetacognitionArticle),
              id: slugOrId,
              slug: row.slug as string,
              title: (row.title as string) || (sd.title as string),
            });
          }
        }
      }
    }
  } catch {
    // Fallback sang METACOGNITION_ARTICLES_SEED
  }

  return articles;
}

export default async function MetacognitionListPage() {
  const articles = await getMetacognitionArticles();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        {/* Hero Banner */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0066ab]">
            <Brain className="w-3.5 h-3.5" />
            PHƯƠNG PHÁP SIÊU NHẬN THỨC 3 PHA (METACOGNITION)
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Đọc Hiểu Siêu Nhận Thức{' '}
              <span className="text-[#0066ab]">(Planning – Monitoring – Evaluating)</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Thiết kế chuyên biệt cho học sinh lớp 7 (12 tuổi): Chia bài đọc SGK thành từng chặng
              song song 2 cột với <strong>Lời giảng Feynman</strong>, mô hình{' '}
              <strong>Ba làm mẫu (Think-Aloud)</strong>, bộ <strong>6 ký hiệu Marking Text</strong> và
              xuất trực tiếp ra <strong>Phiếu thực hành A4 / Word</strong>.
            </p>
          </div>

          {/* 3-Phase Overview Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0066ab]">
                PHA 1 • PLANNING
              </span>
              <p className="font-bold text-slate-900 text-sm">Kích Hoạt Tư Duy & Dự Đoán</p>
              <p className="text-xs text-slate-600">
                Khởi động não bộ (Active Recall), dự đoán mục đích bài học và nắm vững 6 ký hiệu Marking Text.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                PHA 2 • MONITORING
              </span>
              <p className="font-bold text-slate-900 text-sm">Đọc Sâu Chia Chặng & Feynman</p>
              <p className="text-xs text-slate-600">
                Bố cục 2 cột (60% Văn bản gốc bẻ khóa Hán-Việt & bôi đen gắn thẻ — 40% Lời giảng Feynman & Góc của con).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                PHA 3 • EVALUATING
              </span>
              <p className="font-bold text-slate-900 text-sm">Tổng Kết QAR & Phản Tư 3-2-1</p>
              <p className="text-xs text-slate-600">
                Thử thách QAR 3 cấp độ, Bảng ma trận từ khóa, Đèn giao thông 🟢🟡🔴 và Ô Takeaway vàng rực rỡ.
              </p>
            </div>
          </div>
        </section>

        {/* Danh sách bài đọc */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0066ab]" />
              Danh Sách Bài Đọc Mẫu SGK Lớp 7 ({articles.length} bài)
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Hỗ trợ in A4 & xuất file Word (.doc)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {articles.map((article) => {
              const subjectColor =
                article.subject === 'Lịch sử'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : article.subject === 'Địa lí'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-blue-100 text-blue-800 border-blue-300';

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${subjectColor}`}
                      >
                        📚 {article.subject} Lớp {article.grade}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[#0066ab]" />
                        {article.target_time_minutes} phút
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        {article.chunks.length} chặng đọc sâu
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <Printer className="w-3.5 h-3.5" />
                        Chuẩn in A4 / Word
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {article.title}
                    </h3>

                    {article.subtitle && (
                      <p className="text-sm text-slate-600 leading-relaxed">{article.subtitle}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-[#0066ab]" />
                        Tích hợp Lời giảng Feynman & Ba làm mẫu
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {article.evaluating.qar_questions.length} câu hỏi QAR + Ma trận tóm tắt
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/metacognition-read/${article.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0066ab] text-white font-extrabold text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-md w-full md:w-auto"
                    >
                      Bắt đầu đọc 3 pha
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

