'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { HAN_VIET_COMPOUNDS_SEED } from '@/lib/supabase/seed';
import { SUBJECT_TAG_LABELS, SUBJECT_TAG_COLORS } from '@/types/dictionary';

const SUBJECTS = ['Tất cả', 'ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc'];

export default function DictionaryPageClient() {
  const [query, setQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('Tất cả');

  const filtered = HAN_VIET_COMPOUNDS_SEED.filter((c) => {
    const matchQuery =
      !query ||
      c.word.toLowerCase().includes(query.toLowerCase()) ||
      c.full_meaning.toLowerCase().includes(query.toLowerCase());
    const matchSubject =
      activeSubject === 'Tất cả' || c.subject_tag === activeSubject;
    return matchQuery && matchSubject;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="gradient-text">Từ Điển</span>{' '}
            <span className="text-slate-800">Hán-Việt</span>
          </h1>
          <p className="text-slate-600">
            {HAN_VIET_COMPOUNDS_SEED.length} từ lớp 7 · Công thức toán học gốc hình vị
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm từ... (vd: nghịch lý, hải đăng)"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-200 border border-gray-200 text-slate-800 placeholder-slate-600 text-sm focus:outline-none focus:border-[#0066ab]/40 transition-all"
          />
        </div>

        {/* Subject filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSubject === s
                  ? 'bg-[#0066ab] text-white'
                  : 'bg-white shadow-sm border border-gray-200 border border-gray-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              {s === 'Tất cả' ? 'Tất cả' : SUBJECT_TAG_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Word grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map((compound, i) => (
            <Link
              key={compound.slug}
              href={`/dictionary/${compound.slug}`}
              className="card rounded-2xl p-5 group hover:scale-[1.01] hover:border-[#0066ab]/30 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-xl font-black gradient-text">{compound.word}</h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    SUBJECT_TAG_COLORS[compound.subject_tag] || ''
                  }`}
                >
                  {SUBJECT_TAG_LABELS[compound.subject_tag]}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{compound.full_meaning}</p>
              <p className="text-xs text-slate-600 font-mono leading-relaxed line-clamp-2">
                {compound.math_formula}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-[#0066ab] opacity-0 group-hover:opacity-100 transition-opacity">
                Xem chi tiết <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>Không tìm thấy từ phù hợp</p>
          </div>
        )}
      </main>
    </div>
  );
}
