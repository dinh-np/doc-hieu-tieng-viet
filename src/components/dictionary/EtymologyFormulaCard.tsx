'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { HanVietCompound, HanVietRoot, SUBJECT_TAG_LABELS, SUBJECT_TAG_COLORS } from '@/types/dictionary';

interface EtymologyFormulaCardProps {
  compound: HanVietCompound;
  root1: HanVietRoot & { related_words: string[] };
  root2: HanVietRoot & { related_words: string[] };
  compact?: boolean;
}

export function EtymologyFormulaCard({
  compound,
  root1,
  root2,
  compact = false,
}: EtymologyFormulaCardProps) {
  return (
    <div className={`space-y-${compact ? '3' : '5'}`}>
      {/* Subject tag + word title */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`font-bold gradient-text ${compact ? 'text-xl' : 'text-3xl'}`}>
            {compound.word}
          </h2>
          <p className={`text-slate-600 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
            {compound.full_meaning}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            SUBJECT_TAG_COLORS[compound.subject_tag] || 'bg-slate-700 text-slate-700'
          }`}
        >
          {SUBJECT_TAG_LABELS[compound.subject_tag] || compound.subject_tag}
        </span>
      </div>

      {/* Math formula layout */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Root 1 — Blue */}
        <RootBadge root={root1} variant="blue" compact={compact} />

        <span className="text-xl text-slate-600 font-bold">+</span>

        {/* Root 2 — Amber */}
        <RootBadge root={root2} variant="amber" compact={compact} />

        <span className="text-2xl text-slate-500">➔</span>

        {/* Compound Result — Emerald */}
        <div className="flex-1 min-w-[180px] rounded-xl bg-emerald-50/5 border border-emerald-300 p-3 text-center">
          <p className="text-emerald-200 font-bold text-lg">{compound.word}</p>
          <p className="text-emerald-400/70 text-xs mt-0.5">{compound.full_meaning}</p>
        </div>
      </div>

      {/* Math formula text */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 px-4 py-3">
        <p className="text-xs text-slate-500 font-medium mb-1">Công thức:</p>
        <p className="text-slate-700 text-sm font-mono">{compound.math_formula}</p>
      </div>

      {/* Example sentence */}
      <div className="rounded-xl bg-blue-50 border border-[#0066ab]/20 px-4 py-3">
        <p className="text-xs text-[#0066ab] font-semibold mb-1">Ví dụ trong câu:</p>
        <p className="text-slate-800 text-sm font-reading leading-relaxed italic">
          "{compound.example_sentence}"
        </p>
      </div>

      {/* Link to full page */}
      {compact && (
        <Link
          href={`/dictionary/${compound.slug}`}
          className="flex items-center gap-1.5 text-xs text-[#0066ab] hover:text-[#0066ab] transition-colors"
        >
          Xem chi tiết <ExternalLink className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

function RootBadge({
  root,
  variant,
  compact,
}: {
  root: HanVietRoot & { related_words: string[] };
  variant: 'blue' | 'amber';
  compact: boolean;
}) {
  const styles =
    variant === 'blue'
      ? {
          bg: 'bg-blue-50/5 border-blue-400/30',
          hanzi: 'text-blue-500/60',
          reading: 'text-blue-300',
          meaning: 'text-blue-400/70',
          pill: 'bg-blue-900/40 text-blue-400 border-blue-500/20',
        }
      : {
          bg: 'bg-amber-50/5 border-amber-400/30',
          hanzi: 'text-amber-500/60',
          reading: 'text-amber-300',
          meaning: 'text-amber-400/70',
          pill: 'bg-amber-900/40 text-amber-400 border-amber-500/20',
        };

  return (
    <div className={`rounded-xl border ${styles.bg} p-3 min-w-[120px] text-center`}>
      {root.hanzi && (
        <p className={`text-lg font-bold ${styles.hanzi}`}>{root.hanzi}</p>
      )}
      <p className={`font-bold ${compact ? 'text-base' : 'text-xl'} ${styles.reading}`}>
        {root.reading_vi}
      </p>
      <p className={`text-xs mt-0.5 ${styles.meaning}`}>{root.root_meaning}</p>
      {!compact && root.related_words.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 justify-center">
          {root.related_words.slice(0, 4).map((w) => (
            <span
              key={w}
              className={`text-xs px-1.5 py-0.5 rounded-full border ${styles.pill}`}
            >
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
