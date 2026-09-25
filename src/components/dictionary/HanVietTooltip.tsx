'use client';

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { HanVietCompound } from '@/types/dictionary';

interface HanVietTooltipProps {
  word: string;
  compound: HanVietCompound;
  root1?: { reading_vi: string; root_meaning: string; hanzi?: string };
  root2?: { reading_vi: string; root_meaning: string; hanzi?: string };
  highlighted?: boolean;
}

export function HanVietTooltip({
  word,
  compound,
  root1,
  root2,
  highlighted = false,
}: HanVietTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          className={`han-viet-trigger ${highlighted ? 'highlighted' : ''}`}
          aria-label={`Xem nghĩa từ Hán-Việt: ${word}`}
        >
          {word}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-2xl bg-white shadow-sm border border-gray-200 shadow-2xl shadow-black/50 p-4 animate-fade-in"
          sideOffset={8}
          align="center"
        >
          {/* Word header */}
          <div className="mb-3">
            <p className="text-lg font-bold text-slate-900">{compound.word}</p>
            <p className="text-xs text-slate-600 mt-0.5">{compound.full_meaning}</p>
          </div>

          {/* Mini formula */}
          {root1 && root2 && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              <div className="rounded-lg bg-blue-900/40 border border-blue-500/20 px-2 py-1 text-center">
                {root1.hanzi && <p className="text-xs text-blue-500/60">{root1.hanzi}</p>}
                <p className="text-sm font-bold text-blue-300">{root1.reading_vi}</p>
                <p className="text-xs text-blue-400/60">{root1.root_meaning}</p>
              </div>
              <span className="text-slate-500 font-bold text-sm">+</span>
              <div className="rounded-lg bg-amber-900/40 border border-amber-500/20 px-2 py-1 text-center">
                {root2.hanzi && <p className="text-xs text-amber-500/60">{root2.hanzi}</p>}
                <p className="text-sm font-bold text-amber-300">{root2.reading_vi}</p>
                <p className="text-xs text-amber-400/60">{root2.root_meaning}</p>
              </div>
              <span className="text-slate-500">➔</span>
              <div className="rounded-lg bg-emerald-900/30 border border-emerald-200 px-2 py-1">
                <p className="text-xs font-bold text-emerald-300">{compound.word}</p>
              </div>
            </div>
          )}

          {/* Example */}
          <div className="rounded-lg bg-indigo-950/40 px-3 py-2 mb-3">
            <p className="text-xs text-slate-600 italic">"{compound.example_sentence}"</p>
          </div>

          {/* Link to full dictionary */}
          <Link
            href={`/dictionary/${compound.slug}`}
            className="flex items-center gap-1.5 text-xs text-[#0066ab] hover:text-[#0066ab] transition-colors"
            onClick={() => setOpen(false)}
          >
            Xem đầy đủ trong Từ điển
            <ExternalLink className="w-3 h-3" />
          </Link>

          <Popover.Arrow className="fill-slate-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
