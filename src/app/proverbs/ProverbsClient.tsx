'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Scale,
  PenTool,
  Copy,
  Check,
  Sparkles,
  Eye,
  Lightbulb,
  BookOpenCheck,
  X,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import {
  PROVERB_PILLAR_META,
  type ProverbItem,
  type ProverbPillar,
} from '@/data/proverbs-seed';

interface ProverbsClientProps {
  initialProverbs: ProverbItem[];
}

type PillarFilter = 'all' | ProverbPillar;

const QUICK_KEYWORDS = [
  'biết ơn',
  'kiên trì',
  'ứng biến',
  'tự trọng',
  'cảm xúc',
  'làm việc nhóm',
  'trách nhiệm',
  'kỹ năng',
  'tự lập',
  'tình thân',
];

const SUB_CATEGORY_LABELS: Record<string, string> = {
  perseverance: 'Kiên trì & Tích tiểu thành đại',
  responsibility: 'Tinh thần Tự lập & Trách nhiệm',
  financial_discipline: 'Kỷ luật Tài chính & Chữ tín',
  family: 'Tình cảm Gia đình & Anh em',
  practicality: 'Tư duy Thực tế & Tận dụng công cụ',
  honor_integrity: 'Danh dự & Phẩm giá trong sạch',
  human_value: 'Giá trị Sinh mệnh & Con người',
};

export function ProverbsClient({ initialProverbs }: ProverbsClientProps) {
  const [selectedPillar, setSelectedPillar] = useState<PillarFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    // Mặc định mở sẵn 2 thẻ đầu tiên để học sinh thấy ngay mẫu Biện chứng & Vũ khí viết văn
    const init: Record<string, boolean> = {};
    if (initialProverbs[0]) init[initialProverbs[0].id] = true;
    if (initialProverbs[1]) init[initialProverbs[1].id] = true;
    return init;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const countsByPillar = useMemo(() => {
    const counts: Record<PillarFilter, number> = {
      all: initialProverbs.length,
      nature_labor: 0,
      morality_society: 0,
      skills_conduct: 0,
    };
    for (const p of initialProverbs) {
      if (counts[p.pillar] !== undefined) {
        counts[p.pillar]++;
      }
    }
    return counts;
  }, [initialProverbs]);

  const filteredProverbs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().normalize('NFC');
    return initialProverbs.filter((item) => {
      if (selectedPillar !== 'all' && item.pillar !== selectedPillar) {
        return false;
      }
      if (!q) return true;

      const haystack = [
        item.proverb,
        item.sub_category,
        item.literal_meaning,
        item.figurative_meaning,
        item.life_skill_note,
        item.essay_evidence_usage,
        item.english_anchor,
        ...(item.keywords || []),
      ]
        .join(' ')
        .toLowerCase()
        .normalize('NFC');

      return haystack.includes(q);
    });
  }, [initialProverbs, selectedPillar, searchQuery]);

  const toggleCardAccordion = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allFilteredExpanded =
    filteredProverbs.length > 0 && filteredProverbs.every((p) => expandedIds[p.id]);

  const handleToggleAllAccordions = () => {
    if (allFilteredExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      for (const p of filteredProverbs) {
        next[p.id] = true;
      }
      setExpandedIds(next);
    }
  };

  const handleCopySample = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        {/* =====================================================================
            HERO HEADER: KHO TÀNG TỤC NGỮ VIỆT NAM
           ===================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            TRÍ TUỆ DÂN GIAN • GIẢI MÃ NGHĨA ĐEN &amp; NGHĨA BÓNG CHUẨN LÊ VĂN HÒE
          </div>

          <div className="space-y-2.5 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              📜 Kho Tàng Tục Ngữ —{' '}
              <span className="text-[#0066ab]">Trí Tuệ Dân Gian &amp; Hành Trang Kỹ Năng</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Thiết kế dành riêng cho học sinh 12 tuổi (THCS): Không học vẹt câu chữ mà nhìn thấu{' '}
              <strong>bức tranh nghĩa đen</strong> của người xưa, đúc kết{' '}
              <strong>bài học kỹ năng sống</strong>, rèn luyện{' '}
              <strong>góc nhìn biện chứng 2 chiều</strong> và biến tục ngữ thành{' '}
              <strong>kho dẫn chứng sắc bén</strong> khi viết văn nghị luận &amp; tự sự.
            </p>
          </div>

          {/* 4 Trụ Cột Giải Mã Tục Ngữ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#0066ab]">
                <Eye className="w-3.5 h-3.5" />
                1. Nghĩa Đen Gợi Hình
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hình dung rõ cảnh đan lát, nuôi tằm, đâm lao... của ông cha xưa.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-800">
                <Lightbulb className="w-3.5 h-3.5" />
                2. Nghĩa Bóng &amp; Kỹ Năng
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bài học ứng xử thực tế cho tuổi 12 ở trường lớp và gia đình.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-800">
                <Scale className="w-3.5 h-3.5" />
                3. Góc Nhìn Biện Chứng
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Biết khi nào áp dụng đúng, khi nào cần tỉnh táo không máy móc.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-800">
                <PenTool className="w-3.5 h-3.5" />
                4. Vũ Khí Viết Văn
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mẫu câu trích dẫn tục ngữ chuẩn xác làm sáng bừng bài văn nghị luận.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            BỘ LỌC 3 MẢNG TỤC NGỮ & THANH TÌM KIẾM
           ===================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
          {/* Tabs theo 3 Mảng chính */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedPillar('all')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer flex items-center gap-2 ${
                selectedPillar === 'all'
                  ? 'bg-[#0066ab] text-white border-[#0066ab] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
              }`}
            >
              <span>🌟 Tất cả mảng</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  selectedPillar === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {countsByPillar.all}
              </span>
            </button>

            {(['nature_labor', 'morality_society', 'skills_conduct'] as ProverbPillar[]).map(
              (pillarKey) => {
                const meta = PROVERB_PILLAR_META[pillarKey];
                const isActive = selectedPillar === pillarKey;
                return (
                  <button
                    key={pillarKey}
                    type="button"
                    onClick={() => setSelectedPillar(pillarKey)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? meta.activeTabClass
                        : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {meta.emoji} {meta.label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {countsByPillar[pillarKey]}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* Mô tả mảng đang chọn */}
          {selectedPillar !== 'all' && (
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <span>{PROVERB_PILLAR_META[selectedPillar].emoji}</span>
              <span>{PROVERB_PILLAR_META[selectedPillar].description}</span>
            </div>
          )}

          {/* Thanh tìm kiếm & Nút Mở/Đóng tất cả Accordion */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo câu tục ngữ, từ khóa (biết ơn, kiên trì, ứng biến...), nghĩa bóng hoặc tiếng Anh..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066ab]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa tìm kiếm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleAllAccordions}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <BookOpenCheck className="w-4 h-4 text-[#0066ab]" />
              {allFilteredExpanded
                ? 'Thu gọn phần Biện chứng & Viết văn'
                : 'Mở rộng tất cả Biện chứng & Viết văn'}
            </button>
          </div>

          {/* Gợi ý từ khóa nhanh */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Từ khóa chủ đề:</span>
            {QUICK_KEYWORDS.map((kw) => {
              const isSelected = searchQuery.toLowerCase() === kw.toLowerCase();
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchQuery(isSelected ? '' : kw)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0066ab] text-white border-[#0066ab]'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-blue-300 hover:text-[#0066ab]'
                  }`}
                >
                  #{kw}
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            DANH SÁCH THẺ TỤC NGỮ (PROVERB CARDS)
           ===================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Hiển thị {filteredProverbs.length} / {initialProverbs.length} câu tục ngữ tiêu biểu
            </h2>
          </div>

          {filteredProverbs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 space-y-3">
              <p className="text-base font-bold text-slate-700">
                Không tìm thấy câu tục ngữ nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPillar('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#0066ab] text-white text-xs font-bold hover:opacity-95 cursor-pointer"
              >
                Xem lại toàn bộ 15 câu tục ngữ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredProverbs.map((item, idx) => {
                const pillarMeta = PROVERB_PILLAR_META[item.pillar];
                const isExpanded = Boolean(expandedIds[item.id]);
                const isCopied = copiedId === item.id;

                return (
                  <article
                    key={item.id}
                    className={`bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all overflow-hidden ${pillarMeta.cardAccentClass}`}
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* ── DÒNG 1: CÂU TỤC NGỮ IN ĐẬM + BADGE MẢNG + MỎ NEO TIẾNG ANH 🇬🇧 ── */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-slate-400">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${pillarMeta.badgeClass}`}
                            >
                              {pillarMeta.emoji} {pillarMeta.label}
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {SUB_CATEGORY_LABELS[item.sub_category] || item.sub_category}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            &ldquo;{item.proverb}&rdquo;
                          </h3>
                        </div>

                        {/* Badge Mỏ neo tiếng Anh 🇬🇧 */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs font-bold text-[#0066ab] shrink-0 self-start">
                          <span>🇬🇧</span>
                          <span>{item.english_anchor}</span>
                        </div>
                      </div>

                      {/* ── DÒNG 2: NGHĨA ĐEN (MENTAL IMAGE) & NGHĨA BÓNG (LIFE SKILL) ── */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Cột Trái: Nghĩa Đen gợi hình ảnh */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                            <Eye className="w-4 h-4 text-[#0066ab] shrink-0" />
                            🖼️ Nghĩa Đen (Bức tranh gợi hình)
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {item.literal_meaning}
                          </p>
                        </div>

                        {/* Cột Phải: Nghĩa Bóng & Bài học tuổi 12 */}
                        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                            💡 Nghĩa Bóng &amp; Bài Học Kỹ Năng Sống
                          </div>
                          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {item.figurative_meaning}
                          </p>
                          <div className="p-3 rounded-xl bg-white/90 border border-amber-200 text-xs text-slate-700 leading-relaxed">
                            <strong className="text-amber-800 font-extrabold">
                              🎯 Góc tuổi 12:{' '}
                            </strong>
                            {item.life_skill_note}
                          </div>
                        </div>
                      </div>

                      {/* Từ khóa (Keywords) */}
                      {item.keywords && item.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {item.keywords.map((kw) => (
                            <button
                              key={kw}
                              type="button"
                              onClick={() => setSearchQuery(kw)}
                              className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-[11px] font-semibold text-slate-600 hover:text-[#0066ab] transition-colors cursor-pointer"
                            >
                              #{kw}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* ── DÒNG 3: ACCORDION GÓC NHÌN BIỆN CHỨNG & VŨ KHÍ VIẾT VĂN ── */}
                      <div className="pt-1 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => toggleCardAccordion(item.id)}
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-gray-200/80 text-xs sm:text-sm font-extrabold text-slate-800 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className="text-purple-700">⚖️ Góc nhìn biện chứng</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-700">
                              ✍️ Vũ khí viết văn (Mẫu câu nghị luận)
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0066ab] shrink-0">
                            {isExpanded ? (
                              <>
                                <span>Thu gọn</span>
                                <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                <span>Mở rộng</span>
                                <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
                            {/* Khối 1: ⚖️ Góc nhìn biện chứng */}
                            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-900">
                                <Scale className="w-4 h-4 text-purple-700 shrink-0" />
                                ⚖️ Góc nhìn biện chứng (Khi nào đúng / Khi nào cẩn trọng?)
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                {item.dialectical_view}
                              </p>
                            </div>

                            {/* Khối 2: ✍️ Vũ khí viết văn */}
                            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-900">
                                  <PenTool className="w-4 h-4 text-emerald-700 shrink-0" />
                                  ✍️ Vũ khí viết văn (Kho dẫn chứng nghị luận)
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopySample(item.id, item.sample_sentence)
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-800 transition-colors cursor-pointer shrink-0"
                                  title="Sao chép câu văn mẫu"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Đã chép!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Chép câu mẫu</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed">
                                <strong className="font-bold text-emerald-950">
                                  📌 Dạng đề áp dụng:{' '}
                                </strong>
                                {item.essay_evidence_usage}
                              </p>

                              <div className="p-3 rounded-xl bg-white border border-emerald-200/90 text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                                &ldquo;{item.sample_sentence}&rdquo;
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

