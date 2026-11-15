/**
 * SCRIPT ĐỒNG BỘ KHO TRI THỨC VECTOR HỢP NHẤT (5 NGUỒN DỮ LIỆU) LÊN SUPABASE pgvector
 * Chạy bằng:
 *   npm run sync:rag
 *   npx tsx scripts/sync_knowledge_embeddings.ts --source=proverb
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { embedBatch768 } from '../src/lib/rag/embedding';
import { cleanVietnameseText } from '../src/lib/utils/vietnamese-text';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export type RagSourceType =
  | 'short_reading'
  | 'one_page'
  | 'metacognition'
  | 'han_viet'
  | 'thuan_viet'
  | 'proverb';

interface RagChunkRecord {
  source_type: RagSourceType;
  source_id: string;
  title: string;
  content_chunk: string;
  metadata: Record<string, unknown>;
}

function clean(text?: string | null): string {
  return cleanVietnameseText(text || '').trim();
}

/**
 * Chia văn bản dài thành các đoạn ~700-950 ký tự theo ranh giới đoạn văn (\n\n).
 */
function splitIntoParagraphChunks(text: string, maxLen = 900): string[] {
  const normalized = clean(text);
  if (!normalized) return [];

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buffer = '';

  for (const para of paragraphs) {
    if (buffer.length > 0 && buffer.length + para.length + 2 > maxLen) {
      chunks.push(buffer);
      buffer = para;
    } else {
      buffer = buffer ? `${buffer}\n\n${para}` : para;
    }
  }
  if (buffer) {
    chunks.push(buffer);
  }
  return chunks.length > 0 ? chunks : [normalized];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedWithRetry(texts: string[], retries = 3): Promise<number[][]> {
  let attempt = 0;
  while (true) {
    try {
      return await embedBatch768(texts);
    } catch (err) {
      attempt++;
      if (attempt >= retries) throw err;
      const waitMs = 1500 * attempt;
      console.log(`   ⚠️ Lỗi embedding tạm thời, thử lại sau ${waitMs}ms...`);
      await sleep(waitMs);
    }
  }
}

function parseSourceFilter(argv: string[]): RagSourceType | null {
  for (const arg of argv) {
    if (arg.startsWith('--source=')) {
      const val = arg.slice('--source='.length).trim() as RagSourceType;
      return val;
    }
  }
  return null;
}

async function main() {
  const sourceFilter = parseSourceFilter(process.argv.slice(2));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Thiếu GEMINI_API_KEY trong .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n🧠 ===== ĐỒNG BỘ KHO TRI THỨC VECTOR HỢP NHẤT (5 NGUỒN DỮ LIỆU) =====');
  if (sourceFilter) {
    console.log(`🎯 Chỉ đồng bộ nguồn: ${sourceFilter}`);
  }

  const chunks: RagChunkRecord[] = [];
  const shouldRun = (t: RagSourceType) => !sourceFilter || sourceFilter === t;

  // ── NGUỒN 1: BÀI ĐỌC NGẮN (`reading_articles`) ──────────────────────────────
  if (shouldRun('short_reading')) {
    const { data: shortArticles, error } = await supabase
      .from('reading_articles')
      .select('id, slug, title, category, target_grade, content_raw')
      .eq('is_published', true)
      .range(0, 999);

    if (error) {
      console.error('⚠️ Lỗi đọc reading_articles:', error.message);
    } else {
      let count = 0;
      for (const art of shortArticles || []) {
        const paraChunks = splitIntoParagraphChunks(art.content_raw);
        paraChunks.forEach((p, idx) => {
          const articleKey = art.slug || art.id;
          chunks.push({
            source_type: 'short_reading',
            source_id: `${articleKey}_chunk_${idx + 1}`,
            title: clean(art.title),
            content_chunk: clean(
              `[Bài đọc ngắn - ${art.category}] ${art.title}\n\n${p}`
            ),
            metadata: {
              article_id: articleKey,
              db_id: art.id,
              slug: art.slug,
              subject: art.category,
              grade: art.target_grade || 7,
              chunk_index: idx + 1,
            },
          });
          count++;
        });
      }
      console.log(`   📖 Nguồn 1 (reading_articles): ${shortArticles?.length || 0} bài -> ${count} chunks`);
    }
  }

  // ── NGUỒN 2 & 3: BÀI ĐỌC 1 TRANG & SIÊU NHẬN THỨC (`one_page_articles`) ─────
  if (shouldRun('one_page') || shouldRun('metacognition')) {
    const { data: onePageRows, error } = await supabase
      .from('one_page_articles')
      .select('*')
      .eq('is_published', true)
      .range(0, 999);

    if (error) {
      console.error('⚠️ Lỗi đọc one_page_articles:', error.message);
    } else {
      let onePageCount = 0;
      let metaCount = 0;

      for (const row of onePageRows || []) {
        const sd = (row.structured_data || {}) as Record<string, unknown>;
        const isMeta =
          row.article_type === 'metacognition' ||
          row.category === 'metacognition' ||
          sd.article_type === 'metacognition' ||
          sd.metacognition_version === '3-phase-v1';

        const articleKey = row.slug || row.id;

        if (isMeta && shouldRun('metacognition')) {
          const metaChunks = Array.isArray(sd.chunks)
            ? (sd.chunks as Array<Record<string, unknown>>)
            : [];
          const subject = clean((sd.subject as string) || row.category || 'Siêu nhận thức');

          metaChunks.forEach((ch, idx) => {
            const feynman = (ch.feynman_explanation || {}) as Record<string, unknown>;
            const popups = (ch.han_viet_Popup || ch.han_viet_popups || []) as Array<
              Record<string, unknown>
            >;
            const popupText = popups
              .map(
                (p) =>
                  `- ${p.term} (${p.formula || ''}): ${p.meaning || ''} [🇬🇧 ${p.english_anchor || ''}]`
              )
              .join('\n');

            const contentParts = [
              `[Bài đọc Siêu Nhận Thức - ${subject}] ${row.title}`,
              ch.title ? `Chặng: ${ch.title}` : '',
              ch.original_text ? `Nội dung bài đọc: ${ch.original_text}` : '',
              feynman.dialogue_question ? `Hỏi xoáy: ${feynman.dialogue_question}` : '',
              feynman.dialogue_answer ? `Giải thích giản đơn (Feynman): ${feynman.dialogue_answer}` : '',
              feynman.metacognition_modeling
                ? `Think-Aloud Cha - Con: ${feynman.metacognition_modeling}`
                : '',
              popupText ? `Từ khóa trọng tâm:\n${popupText}` : '',
            ].filter(Boolean);

            chunks.push({
              source_type: 'metacognition',
              source_id: `${articleKey}_chunk_${idx + 1}`,
              title: clean(`${row.title} — ${ch.title || `Chặng ${idx + 1}`}`),
              content_chunk: clean(contentParts.join('\n')),
              metadata: {
                article_id: articleKey,
                db_id: row.id,
                slug: row.slug,
                subject,
                grade: row.target_grade || 7,
                chunk_index: idx + 1,
              },
            });
            metaCount++;
          });

          // Chunk tổng kết bài Siêu nhận thức (Planning + Takeaway)
          const planning = (sd.planning || {}) as Record<string, unknown>;
          const evaluating = (sd.evaluating || {}) as Record<string, unknown>;
          if (evaluating.takeaway_sentence || planning.active_recall_question) {
            const summaryText = [
              `[Tổng kết bài Siêu Nhận Thức - ${subject}] ${row.title}`,
              planning.active_recall_question
                ? `Câu hỏi gợi mở (Planning): ${planning.active_recall_question}`
                : '',
              evaluating.takeaway_sentence
                ? `Thông điệp cốt lõi (Takeaway): ${evaluating.takeaway_sentence}`
                : '',
            ]
              .filter(Boolean)
              .join('\n');

            chunks.push({
              source_type: 'metacognition',
              source_id: `${articleKey}_chunk_summary`,
              title: clean(`${row.title} — Thông điệp cốt lõi`),
              content_chunk: clean(summaryText),
              metadata: {
                article_id: articleKey,
                db_id: row.id,
                slug: row.slug,
                subject,
                grade: row.target_grade || 7,
              },
            });
            metaCount++;
          }
        } else if (!isMeta && shouldRun('one_page')) {
          const paraChunks = splitIntoParagraphChunks(row.content_raw);
          paraChunks.forEach((p, idx) => {
            chunks.push({
              source_type: 'one_page',
              source_id: `${articleKey}_chunk_${idx + 1}`,
              title: clean(row.title),
              content_chunk: clean(`[Bài đọc 1 trang - ${row.category}] ${row.title}\n\n${p}`),
              metadata: {
                article_id: articleKey,
                db_id: row.id,
                slug: row.slug,
                subject: row.category,
                grade: row.target_grade || 7,
                chunk_index: idx + 1,
              },
            });
            onePageCount++;
          });
        }
      }

      if (shouldRun('one_page')) {
        console.log(`   📄 Nguồn 2 (one_page): ${onePageCount} chunks`);
      }
      if (shouldRun('metacognition')) {
        console.log(`   🧠 Nguồn 3 (metacognition + Feynman): ${metaCount} chunks`);
      }
    }
  }

  // ── NGUỒN 4A: TỪ ĐIỂN HÁN - VIỆT (`han_viet_compounds`) ─────────────────────
  if (shouldRun('han_viet')) {
    const { data: hanVietRows, error } = await supabase
      .from('han_viet_compounds')
      .select('id, word, slug, full_meaning, english_equivalent, example_sentence, math_formula, subject_tag, grade_level')
      .range(0, 4999);

    if (error) {
      console.error('⚠️ Lỗi đọc han_viet_compounds:', error.message);
    } else {
      for (const hv of hanVietRows || []) {
        const content = [
          `[Từ điển Hán - Việt] Từ: ${hv.word}`,
          hv.math_formula ? `Công thức chiết tự: ${hv.math_formula}` : '',
          `Nghĩa đầy đủ: ${hv.full_meaning}`,
          hv.english_equivalent ? `Tiếng Anh đối chiếu: ${hv.english_equivalent}` : '',
          hv.example_sentence ? `Ví dụ: ${hv.example_sentence}` : '',
        ]
          .filter(Boolean)
          .join('\n');

        chunks.push({
          source_type: 'han_viet',
          source_id: hv.slug || hv.id,
          title: clean(`Hán - Việt: ${hv.word}`),
          content_chunk: clean(content),
          metadata: {
            slug: hv.slug,
            subject: hv.subject_tag || 'SGK',
            english_anchor: hv.english_equivalent || null,
            math_formula: hv.math_formula || null,
            grade: hv.grade_level || 7,
          },
        });
      }
      console.log(`   📘 Nguồn 4a (han_viet_compounds): ${hanVietRows?.length || 0} chunks`);
    }
  }

  // ── NGUỒN 4B: TỪ ĐIỂN THUẦN VIỆT (`thuan_viet_dictionary`) ──────────────────
  if (shouldRun('thuan_viet')) {
    const { data: tvRows, error } = await supabase
      .from('thuan_viet_dictionary')
      .select('id, word, word_type, simple_meaning, mental_image, context_clue, english_equivalent, example_sentence, synonyms, subject_tag, grade_level')
      .range(0, 4999);

    if (error) {
      console.error('⚠️ Lỗi đọc thuan_viet_dictionary:', error.message);
    } else {
      for (const tv of tvRows || []) {
        const syns = Array.isArray(tv.synonyms) && tv.synonyms.length > 0
          ? tv.synonyms.join(', ')
          : '';
        const content = [
          `[Từ điển Thuần Việt] Từ: ${tv.word} (${tv.word_type})`,
          `Nghĩa dễ hiểu: ${tv.simple_meaning}`,
          tv.mental_image ? `Bức tranh tâm trí: ${tv.mental_image}` : '',
          tv.context_clue ? `Mẹo ngữ cảnh: ${tv.context_clue}` : '',
          tv.english_equivalent ? `Tiếng Anh đối chiếu: ${tv.english_equivalent}` : '',
          syns ? `Từ đồng nghĩa: ${syns}` : '',
          tv.example_sentence ? `Ví dụ: ${tv.example_sentence}` : '',
        ]
          .filter(Boolean)
          .join('\n');

        chunks.push({
          source_type: 'thuan_viet',
          source_id: clean(tv.word).toLowerCase(),
          title: clean(`Thuần Việt: ${tv.word}`),
          content_chunk: clean(content),
          metadata: {
            word_type: tv.word_type,
            subject: tv.subject_tag || 'SGK',
            english_anchor: tv.english_equivalent || null,
            grade: tv.grade_level || 7,
          },
        });
      }
      console.log(`   ✨ Nguồn 4b (thuan_viet_dictionary): ${tvRows?.length || 0} chunks`);
    }
  }

  // ── NGUỒN 5: KHO TỤC NGỮ VIỆT NAM (`proverbs`) ──────────────────────────────
  if (shouldRun('proverb')) {
    const { data: proverbRows, error } = await supabase
      .from('proverbs')
      .select('*')
      .range(0, 4999);

    if (error) {
      console.error('⚠️ Lỗi đọc proverbs:', error.message);
    } else {
      for (const pv of proverbRows || []) {
        const content = [
          `[Tục ngữ Việt Nam] "${pv.proverb}"`,
          `Nghĩa đen: ${pv.literal_meaning}`,
          `Nghĩa bóng: ${pv.figurative_meaning}`,
          `Bài học kỹ năng sống (tuổi 12): ${pv.life_skill_note}`,
          pv.dialectical_view ? `Góc nhìn biện chứng: ${pv.dialectical_view}` : '',
          pv.essay_evidence_usage ? `Cách dùng làm dẫn chứng văn nghị luận: ${pv.essay_evidence_usage}` : '',
          pv.english_anchor ? `Tiếng Anh đối chiếu: ${pv.english_anchor}` : '',
        ]
          .filter(Boolean)
          .join('\n');

        chunks.push({
          source_type: 'proverb',
          source_id: clean(pv.proverb),
          title: clean(`Tục ngữ: "${pv.proverb}"`),
          content_chunk: clean(content),
          metadata: {
            pillar: pv.pillar,
            sub_category: pv.sub_category,
            english_anchor: pv.english_anchor || null,
          },
        });
      }
      console.log(`   📜 Nguồn 5 (proverbs): ${proverbRows?.length || 0} chunks`);
    }
  }

  console.log(`\n📦 Tổng cộng chuẩn bị embed & upsert: ${chunks.length} chunks`);
  if (chunks.length === 0) {
    console.log('ℹ️ Không có chunk nào cần đồng bộ.');
    return;
  }

  // ── TẠO EMBEDDING THEO BATCH & UPSERT LÊN SUPABASE ──────────────────────────
  const BATCH_SIZE = 15;
  let processed = 0;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.content_chunk);

    const vectors = await embedWithRetry(texts);
    const rowsToUpsert = batch.map((c, idx) => ({
      source_type: c.source_type,
      source_id: c.source_id,
      title: c.title,
      content_chunk: c.content_chunk,
      metadata: c.metadata,
      embedding: vectors[idx],
    }));

    let upsertErr: { message: string } | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const { error } = await supabase
        .from('knowledge_embeddings')
        .upsert(rowsToUpsert, { onConflict: 'source_type,source_id' });
      if (!error) {
        upsertErr = null;
        break;
      }
      upsertErr = error;
      if (attempt < 3) {
        const waitMs = 1200 * attempt;
        console.log(`   ⚠️ Lỗi UPSERT tạm thời (${error.message}), thử lại sau ${waitMs}ms...`);
        await sleep(waitMs);
      }
    }

    if (upsertErr) {
      console.error(`❌ Lỗi UPSERT batch ${i + 1}-${i + batch.length}:`, upsertErr.message);
      process.exit(1);
    }

    processed += batch.length;
    console.log(`   ✅ Đã đồng bộ ${processed}/${chunks.length} chunks`);
    if (i + BATCH_SIZE < chunks.length) {
      await sleep(350);
    }
  }

  console.log('\n🎉 HOÀN TẤT ĐỒNG BỘ TOÀN BỘ KHO TRI THỨC RAG LÊN SUPABASE!\n');
}

main().catch((err) => {
  console.error('❌ Lỗi không mong muốn:', err);
  process.exit(1);
});

