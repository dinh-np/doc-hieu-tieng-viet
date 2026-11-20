'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Lock,
  Unlock,
  BookOpen,
  FileText,
  Pencil,
  Trash2,
  X,
  ArrowRight,
  Loader2,
  Network,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import {
  LONG_ARTICLE_SUBJECTS,
  type LongArticle,
} from '@/types/long-article';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';

const PIN_STORAGE_KEY = 'long_read_admin_pin_v1';

const SUBJECT_BADGE_CLASSES: Record<string, string> = {
  'Ngữ văn': 'bg-rose-50 text-rose-700 border-rose-200',
  'Lịch sử': 'bg-amber-50 text-amber-800 border-amber-200',
  'Địa lí': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Khoa học': 'bg-sky-50 text-sky-700 border-sky-200',
  'Kỹ năng sống': 'bg-violet-50 text-violet-700 border-violet-200',
  'Tự do': 'bg-slate-100 text-slate-700 border-slate-200',
};

function countWordsRealtime(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function LongReadListPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<LongArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trạng thái PIN Phụ huynh
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [pendingActionAfterPin, setPendingActionAfterPin] = useState<
    (() => void) | null
  >(null);

  // Trạng thái Modal Nạp / Sửa bài đọc
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<LongArticle | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState<string>('Ngữ văn');
  const [gradeInput, setGradeInput] = useState<number>(7);
  const [contentInput, setContentInput] = useState('');
  const [savingArticle, setSavingArticle] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  const liveWordCount = useMemo(
    () => countWordsRealtime(contentInput),
    [contentInput]
  );

  // Khôi phục PIN đã lưu trên máy phụ huynh
  useEffect(() => {
    try {
      const savedPin = window.localStorage.getItem(PIN_STORAGE_KEY);
      if (savedPin) {
        setAdminPin(savedPin);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/long-articles', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể tải danh sách bài đọc dài.');
      }
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setNeedsMigration(Boolean(data.needsMigration));
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Lỗi tải danh sách bài đọc.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const requirePinThen = (action: () => void) => {
    if (adminPin) {
      action();
      return;
    }
    setPinInput('');
    setPinError(null);
    setPendingActionAfterPin(() => action);
    setIsPinModalOpen(true);
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim() || verifyingPin) return;
    setVerifyingPin(true);
    setPinError(null);

    try {
      const res = await fetch('/api/long-articles/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPinError(data.error || 'Mã PIN không đúng.');
        return;
      }

      const verified = pinInput.trim();
      setAdminPin(verified);
      try {
        window.localStorage.setItem(PIN_STORAGE_KEY, verified);
      } catch {
        // ignore
      }
      setIsPinModalOpen(false);
      if (pendingActionAfterPin) {
        const nextFn = pendingActionAfterPin;
        setPendingActionAfterPin(null);
        nextFn();
      }
    } catch {
      setPinError('Không thể xác thực mã PIN lúc này.');
    } finally {
      setVerifyingPin(false);
    }
  };

  const handleLockParentMode = () => {
    setAdminPin(null);
    try {
      window.localStorage.removeItem(PIN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitleInput('');
    setSubjectInput('Ngữ văn');
    setGradeInput(7);
    setContentInput('');
    setEditorError(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (article: LongArticle) => {
    setEditingArticle(article);
    setTitleInput(article.title);
    setSubjectInput(article.subject || 'Tự do');
    setGradeInput(article.grade || 7);
    setContentInput(article.content);
    setEditorError(null);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin || savingArticle) return;

    const cleanTitle = cleanVietnameseText(titleInput).trim();
    const cleanContent = cleanVietnameseText(contentInput).trim();

    if (!cleanTitle || !cleanContent) {
      setEditorError('Vui lòng nhập đầy đủ tiêu đề và nội dung văn bản.');
      return;
    }

    setSavingArticle(true);
    setEditorError(null);

    try {
      const isEdit = Boolean(editingArticle);
      const url = isEdit
        ? `/api/long-articles/${editingArticle!.id}`
        : '/api/long-articles';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({
          title: cleanTitle,
          subject: subjectInput,
          grade: gradeInput,
          content: cleanContent,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        handleLockParentMode();
        setEditorError('Mã PIN đã hết hạn hoặc không hợp lệ. Vui lòng mở khóa lại.');
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || 'Không thể lưu bài đọc.');
      }

      const saved: LongArticle = data.article;
      setIsEditorOpen(false);
      router.push(`/long-read/${saved.slug || saved.id}`);
    } catch (err) {
      setEditorError(
        err instanceof Error ? err.message : 'Đã có lỗi khi lưu bài đọc.'
      );
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (article: LongArticle) => {
    if (!adminPin) return;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bài đọc "${article.title}" không?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/long-articles/${article.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-pin': adminPin,
        },
      });
      if (res.status === 401) {
        handleLockParentMode();
        alert('Mã PIN không hợp lệ. Vui lòng nhập lại mã PIN.');
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Không thể xóa bài đọc.');
      }
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa bài đọc.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero & Quy trình 4 bước */}
        <div className="card rounded-3xl p-6 sm:p-8 border border-blue-100 bg-white shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066ab] border border-blue-200 text-xs font-extrabold">
                <Network className="w-3.5 h-3.5" />
                Không giới hạn độ dài · Mindmap Thụt Lề · Thầy Cú Feynman
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                📚 Đọc Sâu &amp; Tóm Tắt Mindmap
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Không gian luyện đọc văn bản dài, tự lập sơ đồ tư duy trên giấy rồi đối chiếu với{' '}
                <strong>Sơ đồ tư duy dạng thụt lề</strong> và hỏi sâu cùng{' '}
                <strong>Thầy Cú Feynman</strong> ngay ở cột trái.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {adminPin ? (
                <button
                  type="button"
                  onClick={handleLockParentMode}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                  title="Bấm để khóa lại trước khi đưa máy cho con"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🔓 Chế độ Phụ huynh (Khóa lại)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => requirePinThen(() => {})}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  title="Mở khóa chế độ Phụ huynh bằng mã PIN 4 số"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mở khóa Phụ huynh</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => requirePinThen(openCreateModal)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066ab] hover:bg-[#005590] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>➕ Nạp bài đọc mới</span>
              </button>
            </div>
          </div>

          {/* 4 bước quy trình đọc sâu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              {
                step: 'Bước 1',
                title: 'Nạp bài đọc dài',
                desc: 'Phụ huynh mở PIN 4 số, dán văn bản dài không giới hạn số từ.',
              },
              {
                step: 'Bước 2',
                title: 'Đọc & Tóm tắt ra giấy',
                desc: 'Con đọc kỹ, gắn thẻ Marking Text hoặc in A4 để tự vẽ sơ đồ ra giấy.',
              },
              {
                step: 'Bước 3',
                title: 'So sánh Mindmap thụt lề',
                desc: 'Bấm tạo Mindmap thụt lề ở cột trái để tự kiểm tra xem có sót ý chính nào không.',
              },
              {
                step: 'Bước 4',
                title: 'Hỏi sâu kiểu Feynman',
                desc: 'Bôi đen câu khó hoặc gõ hỏi Thầy Cú để giải mã cặn kẽ từng nhánh.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-3.5 space-y-1"
              >
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0066ab]">
                  {item.step}
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {item.title}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {needsMigration && (
          <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 text-xs sm:text-sm text-amber-950 space-y-1">
            <p className="font-extrabold">
              ⚠️ Bảng <code>public.long_articles</code> chưa được khởi tạo trên Supabase:
            </p>
            <p>
              Vui lòng chạy file SQL{' '}
              <code>supabase/migrations/create_long_articles.sql</code> trong Supabase
              SQL Editor để lưu và đọc các bài đọc dài.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-700 font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Danh sách bài đọc */}
        {loading ? (
          <div className="card rounded-3xl p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#0066ab]" />
            <p className="text-sm font-semibold">Đang tải danh sách bài đọc dài...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="card rounded-3xl p-10 text-center space-y-4 bg-white border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066ab] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-lg font-extrabold text-slate-900">
                Chưa có bài đọc dài nào được nạp
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Hãy bấm nút <strong>&ldquo;➕ Nạp bài đọc mới&rdquo;</strong> (mở khóa bằng mã
                PIN 4 số) để dán bài đọc đầu tiên cho con luyện đọc và tóm tắt Mindmap nhé!
              </p>
            </div>
            <button
              type="button"
              onClick={() => requirePinThen(openCreateModal)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066ab] hover:bg-[#005590] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nạp bài đọc đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map((article) => {
              const badgeClass =
                SUBJECT_BADGE_CLASSES[article.subject] ||
                SUBJECT_BADGE_CLASSES['Tự do'];
              const createdDate = article.created_at
                ? new Date(article.created_at).toLocaleDateString('vi-VN')
                : '';

              return (
                <div
                  key={article.id}
                  className="card rounded-2xl p-5 bg-white border border-gray-200 hover:border-[#0066ab]/40 transition-all flex flex-col justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${badgeClass}`}
                        >
                          {article.subject || 'Tự do'} · Lớp {article.grade || 7}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <FileText className="w-3.5 h-3.5" />
                          {article.word_count || countWordsRealtime(article.content)} từ
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => requirePinThen(() => openEditModal(article))}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0066ab] hover:bg-blue-50 transition-colors"
                          title="Sửa bài đọc (Cần PIN Phụ huynh)"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            requirePinThen(() => handleDeleteArticle(article))
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa bài đọc (Cần PIN Phụ huynh)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <Link
                      href={`/long-read/${article.slug || article.id}`}
                      className="block group"
                    >
                      <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0066ab] transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {article.content.slice(0, 220)}
                      {article.content.length > 220 ? '...' : ''}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {createdDate}
                    </span>

                    <Link
                      href={`/long-read/${article.slug || article.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-[#0066ab] text-[#0066ab] hover:text-white text-xs font-extrabold transition-all"
                    >
                      <span>Đọc &amp; Lập Mindmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL NHẬP MÃ PIN 4 SỐ CHO PHỤ HUYNH */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066ab] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Xác thực Chế độ Phụ huynh
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Nhập mã PIN 4 số để nạp, sửa hoặc xóa bài đọc
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mã PIN (4 số)..."
                className="w-full text-center tracking-[0.4em] text-lg font-black rounded-xl border border-gray-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:border-[#0066ab] focus:ring-2 focus:ring-[#0066ab]/15"
              />

              {pinError && (
                <p className="text-xs font-bold text-rose-600 text-center">
                  ⚠️ {pinError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={verifyingPin || !pinInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066ab] hover:bg-[#005590] disabled:opacity-40 text-white text-xs font-extrabold"
                >
                  {verifyingPin && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Mở khóa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NẠP / SỬA BÀI ĐỌC ĐỘ DÀI KHÔNG GIỚI HẠN */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 my-auto animate-fade-in-up">
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0066ab]" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editingArticle ? 'Chỉnh sửa bài đọc dài' : '➕ Nạp bài đọc dài mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7 space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700">
                    Tiêu đề bài đọc *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Ví dụ: Chương 1 - Dế Mèn phiêu lưu ký / Bài khảo cứu lịch sử..."
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0066ab]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700">
                    Môn học / Chủ đề
                  </label>
                  <select
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0066ab]"
                  >
                    {LONG_ARTICLE_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700">
                    Khối lớp
                  </label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0066ab]"
                  >
                    {[6, 7, 8, 9].map((g) => (
                      <option key={g} value={g}>
                        Lớp {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-700">
                    Nội dung toàn văn bài đọc (Không giới hạn độ dài) *
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066ab] border border-blue-200 text-xs font-extrabold">
                    Bộ đếm realtime: {liveWordCount.toLocaleString('vi-VN')} từ
                  </span>
                </div>
                <textarea
                  rows={12}
                  required
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Dán toàn bộ văn bản bài đọc vào đây (hỗ trợ bài dài hàng nghìn từ, tự động chuẩn hóa tiếng Việt Unicode NFC)..."
                  className="w-full rounded-2xl border border-gray-300 p-3.5 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#0066ab] focus:ring-2 focus:ring-[#0066ab]/10 max-h-[52vh] overflow-y-auto"
                />
              </div>

              {editorError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-700">
                  ⚠️ {editorError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={savingArticle}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066ab] hover:bg-[#005590] disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold shadow-sm"
                >
                  {savingArticle && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {editingArticle
                      ? 'Lưu cập nhật & Mở bài đọc'
                      : 'Lưu & Mở bài đọc ngay'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
