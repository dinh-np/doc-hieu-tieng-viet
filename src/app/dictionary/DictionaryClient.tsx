'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Sparkles,
  Eye,
  Compass,
  Gamepad2,
  BookOpen,
  X,
  Layers,
} from 'lucide-react';
import {
  HanVietCompound,
  ThuanVietEntry,
  SUBJECT_TAG_LABELS,
  SUBJECT_TAG_COLORS,
  THUAN_VIET_TYPE_LABELS,
  THUAN_VIET_TYPE_COLORS,
} from '@/types/dictionary';

const SUBJECTS = ['Tất cả', 'SGK', 'ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc'];
const THUAN_VIET_TYPES = ['Tất cả', 'tu_lay', 'tu_tuong_hinh', 'tu_tuong_thanh', 'tu_da_nghia'];

interface DictionaryPageClientProps {
  initialCompounds: HanVietCompound[];
  initialThuanViet: ThuanVietEntry[];
}

type UnifiedSearchItem =
  | { kind: 'han-viet'; score: number; data: HanVietCompound }
  | { kind: 'thuan-viet'; score: number; data: ThuanVietEntry };

function norm(text?: string | null): string {
  return (text || '').toLowerCase().normalize('NFC');
}

export default function DictionaryPageClient({
  initialCompounds,
  initialThuanViet,
}: DictionaryPageClientProps) {
  const [activeTab, setActiveTab] = useState<'han-viet' | 'thuan-viet'>('han-viet');
  const [searchScope, setSearchScope] = useState<'all' | 'han-viet' | 'thuan-viet'>('all');
  const [query, setQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [activeWordType, setActiveWordType] = useState('Tất cả');

  const normalizedQuery = useMemo(() => query.trim().toLowerCase().normalize('NFC'), [query]);
  const isSearching = normalizedQuery.length > 0;

  // Khi duyệt danh mục bình thường (không có từ khóa tìm kiếm)
  const browseHanViet = useMemo(() => {
    if (activeSubject === 'Tất cả') return initialCompounds;
    return initialCompounds.filter((c) => c.subject_tag === activeSubject);
  }, [initialCompounds, activeSubject]);

  const browseThuanViet = useMemo(() => {
    if (activeWordType === 'Tất cả') return initialThuanViet;
    return initialThuanViet.filter((tv) => tv.word_type === activeWordType);
  }, [initialThuanViet, activeWordType]);

  // Khi có từ khóa tìm kiếm: tìm song song trên cả 2 kho từ điển (không bị giới hạn bởi bộ lọc môn học/loại từ)
  const searchHanVietMatches = useMemo(() => {
    if (!isSearching) return [];
    const q = normalizedQuery;
    return initialCompounds
      .filter((c) => {
        return (
          norm(c.word).includes(q) ||
          norm(c.full_meaning).includes(q) ||
          norm(c.math_formula).includes(q) ||
          norm(c.english_equivalent).includes(q) ||
          norm(c.example_sentence).includes(q)
        );
      })
      .map((c) => {
        const w = norm(c.word);
        const score = w === q ? 100 : w.startsWith(q) ? 80 : w.includes(q) ? 60 : 20;
        return { kind: 'han-viet' as const, score, data: c };
      });
  }, [initialCompounds, isSearching, normalizedQuery]);

  const searchThuanVietMatches = useMemo(() => {
    if (!isSearching) return [];
    const q = normalizedQuery;
    return initialThuanViet
      .filter((tv) => {
        const synonymsText = (tv.synonyms || []).map((s) => norm(s)).join(' ');
        return (
          norm(tv.word).includes(q) ||
          norm(tv.simple_meaning).includes(q) ||
          norm(tv.mental_image).includes(q) ||
          norm(tv.context_clue).includes(q) ||
          norm(tv.english_equivalent).includes(q) ||
          norm(tv.example_sentence).includes(q) ||
          synonymsText.includes(q)
        );
      })
      .map((tv) => {
        const w = norm(tv.word);
        const score = w === q ? 100 : w.startsWith(q) ? 80 : w.includes(q) ? 60 : 20;
        return { kind: 'thuan-viet' as const, score, data: tv };
      });
  }, [initialThuanViet, isSearching, normalizedQuery]);

  const unifiedSearchResults: UnifiedSearchItem[] = useMemo(() => {
    if (!isSearching) return [];
    let combined: UnifiedSearchItem[] = [];
    if (searchScope === 'all') {
      combined = [...searchHanVietMatches, ...searchThuanVietMatches];
    } else if (searchScope === 'han-viet') {
      combined = [...searchHanVietMatches];
    } else {
      combined = [...searchThuanVietMatches];
    }
    return combined.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.data.word.localeCompare(b.data.word, 'vi');
    });
  }, [isSearching, searchScope, searchHanVietMatches, searchThuanVietMatches]);

  const totalSearchMatches = searchHanVietMatches.length + searchThuanVietMatches.length;

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length > 0 && query.trim().length === 0) {
      setSearchScope('all');
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchScope('all');
  };

  const renderHanVietCard = (compound: HanVietCompound, index: number) => (
    <Link
      key={`hv-${compound.slug}`}
      href={`/dictionary/${compound.slug}`}
      className="card rounded-2xl p-5 group hover:scale-[1.01] hover:border-[#0066ab]/30 transition-all animate-fade-in-up flex flex-col justify-between"
      style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <h2 className="text-xl font-black gradient-text">{compound.word}</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-[#0066ab] border border-blue-200/80">
              📘 Hán - Việt
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                SUBJECT_TAG_COLORS[compound.subject_tag] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {SUBJECT_TAG_LABELS[compound.subject_tag] || compound.subject_tag}
            </span>
          </div>
        </div>

        {compound.english_equivalent && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              🇬🇧 {compound.english_equivalent}
            </span>
          </div>
        )}

        <p className="text-sm text-slate-600 leading-relaxed mb-3">{compound.full_meaning}</p>
        <p className="text-xs text-slate-600 font-mono leading-relaxed line-clamp-2 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200/70">
          {compound.math_formula}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#0066ab] opacity-80 group-hover:opacity-100 transition-opacity">
        Xem chiết tự & Quiz <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );

  const renderThuanVietCard = (tv: ThuanVietEntry, index: number) => (
    <div
      key={`tv-${tv.id || tv.word}`}
      className="card rounded-2xl p-5 space-y-3.5 hover:border-emerald-400/50 transition-all animate-fade-in-up flex flex-col justify-between"
      style={{ animationDelay: `${Math.min(index * 25, 300)}ms` }}
    >
      <div className="space-y-3">
        {/* Word title + dictionary badge + word_type badge + English badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-xl font-black text-slate-900">{tv.word}</h2>
            {tv.english_equivalent && (
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                🇬🇧 {tv.english_equivalent}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              ✨ Thuần Việt
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                THUAN_VIET_TYPE_COLORS[tv.word_type] ||
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {THUAN_VIET_TYPE_LABELS[tv.word_type] || tv.word_type}
            </span>
            {tv.subject_tag && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  SUBJECT_TAG_COLORS[tv.subject_tag] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {SUBJECT_TAG_LABELS[tv.subject_tag] || tv.subject_tag}
              </span>
            )}
          </div>
        </div>

        {/* Simple meaning for 12-year-olds */}
        <p className="text-sm text-slate-700 leading-relaxed font-medium">{tv.simple_meaning}</p>

        {/* Mental Image (Visual Clue) */}
        {tv.mental_image && (
          <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 flex items-start gap-2.5">
            <Eye className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Bức tranh tâm trí: </span>
              {tv.mental_image}
            </div>
          </div>
        )}

        {/* Context Clue */}
        {tv.context_clue && (
          <div className="rounded-xl bg-sky-50/70 border border-sky-200/70 px-3 py-2 flex items-start gap-2">
            <Compass className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-sky-900">
              <span className="font-bold">Mẹo ngữ cảnh: </span>
              {tv.context_clue}
            </p>
          </div>
        )}
      </div>

      {/* Example sentence & synonyms */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/60 px-3.5 py-2.5">
          <p className="text-xs text-emerald-900 italic leading-relaxed">
            &ldquo;{tv.example_sentence}&rdquo;
          </p>
        </div>

        {tv.synonyms && tv.synonyms.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500">Đồng nghĩa:</span>
            {tv.synonyms.map((syn) => (
              <span
                key={syn}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium"
              >
                {syn}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header + Quick Link to Games */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black mb-1.5">
              <span className="gradient-text">Kho Từ Điển</span>{' '}
              <span className="text-slate-800">Lớp 7</span>
            </h1>
            <p className="text-slate-600 text-sm">
              {initialCompounds.length} từ Hán-Việt chiết tự · {initialThuanViet.length} từ Thuần Việt giàu hình ảnh
            </p>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0066ab] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all w-fit"
          >
            <Gamepad2 className="w-4 h-4" />
            Vào Đấu Trường Từ Vựng
          </Link>
        </div>

        {/* ── UNIFIED SEARCH BAR (ƯU TIÊN TRÊN CÙNG, TÌM ĐỒNG THỜI CẢ 2 TỪ ĐIỂN) ── */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Tìm bất kỳ từ nào trong cả 2 từ điển Hán-Việt & Thuần Việt (vd: nỗ lực, kém cỏi, giang sơn, bạt ngàn, effort)..."
            className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white shadow-sm border border-gray-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#0066ab]/50 focus:ring-2 focus:ring-[#0066ab]/10 transition-all"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Xóa từ khóa tìm kiếm"
              title="Xóa tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── MODE SWITCHER TABS (CẬP NHẬT SỐ ĐẾM ĐỘNG KHI ĐANG TÌM KIẾM) ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-white shadow-sm border border-gray-200 w-full sm:w-auto gap-1">
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearchScope('all')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  searchScope === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                Xem tất cả kết quả
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    searchScope === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {totalSearchMatches}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (isSearching) {
                  setSearchScope('han-viet');
                } else {
                  setActiveTab('han-viet');
                }
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                (isSearching ? searchScope === 'han-viet' : activeTab === 'han-viet')
                  ? 'bg-[#0066ab] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Từ điển Hán - Việt
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  (isSearching ? searchScope === 'han-viet' : activeTab === 'han-viet')
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isSearching ? searchHanVietMatches.length : initialCompounds.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSearching) {
                  setSearchScope('thuan-viet');
                } else {
                  setActiveTab('thuan-viet');
                }
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                (isSearching ? searchScope === 'thuan-viet' : activeTab === 'thuan-viet')
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Từ điển Thuần Việt
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  (isSearching ? searchScope === 'thuan-viet' : activeTab === 'thuan-viet')
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isSearching ? searchThuanVietMatches.length : initialThuanViet.length}
              </span>
            </button>
          </div>
        </div>

        {/* ── CHẾ ĐỘ 1: ĐANG TÌM KIẾM HỢP NHẤT (CROSS-DICTIONARY SEARCH) ───── */}
        {isSearching ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
              <p className="text-xs sm:text-sm text-slate-600">
                Tìm thấy <strong className="text-slate-900">{totalSearchMatches}</strong> kết quả cho từ khóa{' '}
                <span className="font-bold text-[#0066ab]">&ldquo;{query.trim()}&rdquo;</span> (
                <span className="text-[#0066ab] font-semibold">
                  {searchHanVietMatches.length} Hán - Việt
                </span>{' '}
                ·{' '}
                <span className="text-emerald-700 font-semibold">
                  {searchThuanVietMatches.length} Thuần Việt
                </span>
                )
              </p>
              {searchScope !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSearchScope('all')}
                  className="text-xs font-bold text-[#0066ab] hover:underline"
                >
                  Xem tất cả kết quả ({totalSearchMatches})
                </button>
              )}
            </div>

            {unifiedSearchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
                {unifiedSearchResults.map((item, idx) =>
                  item.kind === 'han-viet'
                    ? renderHanVietCard(item.data, idx)
                    : renderThuanVietCard(item.data, idx)
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/80 rounded-2xl border border-gray-200/80 text-slate-500">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-slate-700 mb-1">
                  Không tìm thấy từ phù hợp với &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Hãy thử kiểm tra lại chính tả hoặc bấm Xóa để xem toàn bộ danh mục.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Xóa từ khóa tìm kiếm
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── CHẾ ĐỘ 2: DUYỆT THEO TAB KHI Ô TÌM KIẾM TRỐNG ───────────────── */}
            {activeTab === 'han-viet' && (
              <>
                {/* Subject filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSubject(s)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeSubject === s
                          ? 'bg-[#0066ab] text-white'
                          : 'bg-white shadow-sm border border-gray-200 text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {s === 'Tất cả'
                        ? `Tất cả (${initialCompounds.length})`
                        : SUBJECT_TAG_LABELS[s] || s}
                    </button>
                  ))}
                </div>

                {/* Word grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                  {browseHanViet.map((compound, i) => renderHanVietCard(compound, i))}
                </div>

                {browseHanViet.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-4xl mb-3">🔍</p>
                    <p>Không có từ Hán-Việt trong chủ đề này</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'thuan-viet' && (
              <>
                {/* Word type filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                  {THUAN_VIET_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveWordType(t)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeWordType === t
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white shadow-sm border border-gray-200 text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {t === 'Tất cả'
                        ? `Tất cả (${initialThuanViet.length})`
                        : THUAN_VIET_TYPE_LABELS[t] || t}
                    </button>
                  ))}
                </div>

                {/* Thuan-Viet Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
                  {browseThuanViet.map((tv, i) => renderThuanVietCard(tv, i))}
                </div>

                {browseThuanViet.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-4xl mb-3">🔍</p>
                    <p>Không có từ Thuần Việt trong nhóm này</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
