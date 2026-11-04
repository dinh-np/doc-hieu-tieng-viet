'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles, Eye, Compass, Gamepad2, BookOpen } from 'lucide-react';
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

export default function DictionaryPageClient({
  initialCompounds,
  initialThuanViet,
}: DictionaryPageClientProps) {
  const [activeTab, setActiveTab] = useState<'han-viet' | 'thuan-viet'>('han-viet');
  const [query, setQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [activeWordType, setActiveWordType] = useState('Tất cả');

  const filteredHanViet = initialCompounds.filter((c) => {
    const q = query.toLowerCase();
    const matchQuery =
      !query ||
      c.word.toLowerCase().includes(q) ||
      c.full_meaning.toLowerCase().includes(q) ||
      c.math_formula?.toLowerCase().includes(q) ||
      c.english_equivalent?.toLowerCase().includes(q);
    const matchSubject =
      activeSubject === 'Tất cả' || c.subject_tag === activeSubject;
    return matchQuery && matchSubject;
  });

  const filteredThuanViet = initialThuanViet.filter((tv) => {
    const q = query.toLowerCase();
    const matchQuery =
      !query ||
      tv.word.toLowerCase().includes(q) ||
      tv.simple_meaning.toLowerCase().includes(q) ||
      tv.mental_image?.toLowerCase().includes(q) ||
      tv.english_equivalent?.toLowerCase().includes(q) ||
      tv.example_sentence?.toLowerCase().includes(q);
    const matchType =
      activeWordType === 'Tất cả' || tv.word_type === activeWordType;
    return matchQuery && matchType;
  });

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

        {/* Mode Switcher Tabs: Hán - Việt vs Thuần Việt */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white shadow-sm border border-gray-200 mb-6 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('han-viet')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'han-viet'
                ? 'bg-[#0066ab] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Từ điển Hán - Việt
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'han-viet'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {initialCompounds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('thuan-viet')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'thuan-viet'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Từ điển Thuần Việt
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'thuan-viet'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {initialThuanViet.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === 'han-viet'
                ? 'Tìm từ Hán-Việt hoặc nghĩa tiếng Anh... (vd: giang sơn, hải đăng, renaissance)'
                : 'Tìm từ Thuần Việt hoặc hình ảnh... (vd: màu mỡ, nhấp nhô, bạt ngàn, fertile)'
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-200 text-slate-800 placeholder-slate-500 text-sm focus:outline-none focus:border-[#0066ab]/40 transition-all"
          />
        </div>

        {/* ── TAB 1: TỪ ĐIỂN HÁN - VIỆT ──────────────────────────────────────── */}
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
              {filteredHanViet.map((compound, i) => (
                <Link
                  key={compound.slug}
                  href={`/dictionary/${compound.slug}`}
                  className="card rounded-2xl p-5 group hover:scale-[1.01] hover:border-[#0066ab]/30 transition-all animate-fade-in-up flex flex-col justify-between"
                  style={{ animationDelay: `${Math.min(i * 20, 300)}ms` }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="text-xl font-black gradient-text">{compound.word}</h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                          SUBJECT_TAG_COLORS[compound.subject_tag] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {SUBJECT_TAG_LABELS[compound.subject_tag] || compound.subject_tag}
                      </span>
                    </div>

                    {compound.english_equivalent && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                          🇬🇧 {compound.english_equivalent}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {compound.full_meaning}
                    </p>
                    <p className="text-xs text-slate-600 font-mono leading-relaxed line-clamp-2 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200/70">
                      {compound.math_formula}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#0066ab] opacity-80 group-hover:opacity-100 transition-opacity">
                    Xem chiết tự & Quiz <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>

            {filteredHanViet.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-4xl mb-3">🔍</p>
                <p>Không tìm thấy từ Hán-Việt phù hợp</p>
              </div>
            )}
          </>
        )}

        {/* ── TAB 2: TỪ ĐIỂN THUẦN VIỆT ─────────────────────────────────────── */}
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
              {filteredThuanViet.map((tv, i) => (
                <div
                  key={tv.id || tv.word}
                  className="card rounded-2xl p-5 space-y-3.5 hover:border-emerald-400/50 transition-all animate-fade-in-up flex flex-col justify-between"
                  style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}
                >
                  <div className="space-y-3">
                    {/* Word title + word_type badge + English badge */}
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
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {tv.simple_meaning}
                    </p>

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
              ))}
            </div>

            {filteredThuanViet.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-4xl mb-3">🔍</p>
                <p>Không tìm thấy từ Thuần Việt phù hợp</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
