/**
 * AGENT TỰ ĐỘNG BÓC TÁCH TỪ HÁN-VIỆT TỪ BÀI ĐỌC SGK MỚI
 *
 * Tích hợp Gemini API (@google/genai) sử dụng GEMINI_API_KEY từ .env.local
 * Tự động nhận diện từ Hán-Việt quan trọng lớp 7, bẻ khóa chiết tự theo đúng schema
 * và ghi vào 3 bảng Supabase (`han_viet_roots`, `han_viet_compounds`, `compound_root_links`)
 * mà không làm trùng lặp các từ/hình vị đã có.
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import type { QuizData } from '@/types/dictionary';

// Nạp biến môi trường từ .env.local (khi chạy qua script hoặc server)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────────

export interface ExtractedRootMorpheme {
  hanzi: string;
  reading_vi: string;
  root_meaning: string;
  related_words: string[];
}

export interface ExtractedHanVietItem {
  word: string;
  slug?: string;
  full_meaning: string;
  example_sentence: string;
  math_formula: string;
  subject_tag: string;
  grade_level: number;
  root1: ExtractedRootMorpheme;
  root2: ExtractedRootMorpheme;
  quiz_data: QuizData;
}

export interface HanVietScraperOptions {
  subjectTag?: 'ngu-van' | 'lich-su' | 'dia-ly' | 'khoa-hoc' | 'SGK' | string;
  gradeLevel?: number;
  maxWords?: number;
  dryRun?: boolean;
}

export interface HanVietScraperResult {
  extracted: ExtractedHanVietItem[];
  insertedRootsCount: number;
  upsertedCompoundsCount: number;
  insertedLinksCount: number;
  skippedExistingCompounds: string[];
}

// ─── HELPER: SLUGIFY ──────────────────────────────────────────────────────────

export function toSlug(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── GEMINI EXTRACTION ENGINE ─────────────────────────────────────────────────

const EXTRACTION_RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  description: 'Danh sách các từ ghép Hán-Việt 2 âm tiết được bóc tách và chiết tự từ bài học SGK.',
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description: 'Từ ghép Hán-Việt 2 âm tiết (viết hoa chữ cái đầu, ví dụ: "Địa hình", "Lãnh thổ").',
      },
      full_meaning: {
        type: Type.STRING,
        description: 'Nghĩa giải thích dễ hiểu, súc tích dành cho học sinh lớp 7.',
      },
      example_sentence: {
        type: Type.STRING,
        description: 'Một câu ví dụ minh họa có chứa từ ghép này (lấy từ bài học hoặc ngữ cảnh SGK lớp 7).',
      },
      math_formula: {
        type: Type.STRING,
        description:
          'Công thức ghép nghĩa theo dạng: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng hợp của từ ghép".',
      },
      subject_tag: {
        type: Type.STRING,
        description: 'Môn học liên quan: "dia-ly", "lich-su", "ngu-van", "khoa-hoc", hoặc "SGK".',
      },
      root1: {
        type: Type.OBJECT,
        description: 'Hình vị thứ nhất (yếu tố đứng trước).',
        properties: {
          hanzi: { type: Type.STRING, description: 'Chữ Hán tương ứng (1 chữ Hán, ví dụ: "地").' },
          reading_vi: { type: Type.STRING, description: 'Âm đọc Hán-Việt viết hoa chữ đầu (ví dụ: "Địa").' },
          root_meaning: { type: Type.STRING, description: 'Nghĩa gốc ngắn gọn của hình vị 1 (ví dụ: "đất, mặt đất").' },
          related_words: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 đến 4 từ ghép Hán-Việt thông dụng khác có chứa hình vị này.',
          },
        },
        required: ['hanzi', 'reading_vi', 'root_meaning', 'related_words'],
      },
      root2: {
        type: Type.OBJECT,
        description: 'Hình vị thứ hai (yếu tố đứng sau).',
        properties: {
          hanzi: { type: Type.STRING, description: 'Chữ Hán tương ứng (1 chữ Hán, ví dụ: "形").' },
          reading_vi: { type: Type.STRING, description: 'Âm đọc Hán-Việt viết hoa chữ đầu (ví dụ: "Hình").' },
          root_meaning: { type: Type.STRING, description: 'Nghĩa gốc ngắn gọn của hình vị 2 (ví dụ: "hình dạng, dáng vẻ").' },
          related_words: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 đến 4 từ ghép Hán-Việt thông dụng khác có chứa hình vị này.',
          },
        },
        required: ['hanzi', 'reading_vi', 'root_meaning', 'related_words'],
      },
      quiz_data: {
        type: Type.OBJECT,
        description: '1 câu đố trắc nghiệm giúp học sinh lớp 7 ôn tập nghĩa và chiết tự của từ.',
        properties: {
          question: { type: Type.STRING, description: 'Nội dung câu hỏi trắc nghiệm.' },
          options: {
            type: Type.ARRAY,
            description: '4 phương án trả lời (chỉ có đúng 1 phương án is_correct = true).',
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                is_correct: { type: Type.BOOLEAN },
              },
              required: ['text', 'is_correct'],
            },
          },
          explanation: {
            type: Type.STRING,
            description: 'Giải thích ngắn gọn đáp án đúng dựa theo công thức chiết tự.',
          },
        },
        required: ['question', 'options', 'explanation'],
      },
    },
    required: [
      'word',
      'full_meaning',
      'example_sentence',
      'math_formula',
      'subject_tag',
      'root1',
      'root2',
      'quiz_data',
    ],
  },
};

/**
 * Bước 1 & 2: Dùng Gemini API phân tích văn bản bài đọc SGK và trả về danh sách từ Hán-Việt đã chiết tự
 */
export async function extractHanVietFromText(
  articleText: string,
  options: HanVietScraperOptions = {}
): Promise<ExtractedHanVietItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Thiếu biến môi trường GEMINI_API_KEY trong .env.local');
  }

  const gradeLevel = options.gradeLevel ?? 7;
  const maxWords = options.maxWords ?? 10;
  const defaultSubject = options.subjectTag ?? 'SGK';

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Bạn là một chuyên gia Ngôn ngữ học Hán-Việt và Sư phạm THCS (lớp ${gradeLevel}).
Nhiệm vụ của bạn là đọc văn bản bài học SGK dưới đây và:
1. Nhận diện tối đa ${maxWords} từ ghép Hán-Việt (loại từ 2 âm tiết) quan trọng, có giá trị học thuật cao đối với học sinh lớp ${gradeLevel}.
2. Với mỗi từ ghép, hãy phân tích chiết tự chính xác từng hình vị cấu thành:
   - Hình vị 1 (chữ Hán, âm đọc chuẩn viết hoa chữ cái đầu, nghĩa gốc ngắn gọn, 2-3 từ liên quan).
   - Hình vị 2 (chữ Hán, âm đọc chuẩn viết hoa chữ cái đầu, nghĩa gốc ngắn gọn, 2-3 từ liên quan).
   - Công thức ghép nghĩa dạng toán học: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng quát".
   - Nghĩa giải thích phù hợp học sinh lớp ${gradeLevel} và 1 câu ví dụ sinh động.
   - 1 câu đố trắc nghiệm (4 đáp án, 1 đáp án đúng) kèm lời giải thích chiết tự.
3. Gắn thẻ môn học (subject_tag) là "${defaultSubject}" (hoặc một trong: "dia-ly", "lich-su", "ngu-van", "khoa-hoc", "SGK").

VĂN BẢN BÀI ĐỌC SGK:
"""
${articleText}
"""
`.trim();

  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  let rawText: string | undefined;
  let lastError: unknown;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: EXTRACTION_RESPONSE_SCHEMA,
            temperature: 0.2,
          },
        });
        rawText = response.text;
        break;
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429')) {
          await new Promise((r) => setTimeout(r, 1500 * attempt));
          continue;
        }
        break;
      }
    }
    if (rawText) break;
  }

  if (!rawText && lastError) {
    throw lastError;
  }
  if (!rawText) {
    return [];
  }

  const parsed = JSON.parse(rawText) as ExtractedHanVietItem[];
  return parsed.map((item) => ({
    ...item,
    word: item.word.trim(),
    slug: toSlug(item.word),
    grade_level: gradeLevel,
    subject_tag: options.subjectTag || item.subject_tag || 'SGK',
  }));
}

/**
 * Bước 3: Kiểm tra và ghi dữ liệu mới vào 3 bảng Supabase mà không làm trùng lặp các từ/hình vị đã có
 */
export async function saveExtractedHanVietToSupabase(
  items: ExtractedHanVietItem[]
): Promise<Omit<HanVietScraperResult, 'extracted'>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (items.length === 0) {
    return {
      insertedRootsCount: 0,
      upsertedCompoundsCount: 0,
      insertedLinksCount: 0,
      skippedExistingCompounds: [],
    };
  }

  // 1. Kiểm tra các hình vị trong `han_viet_roots` (tránh trùng lặp chữ Hán & âm đọc)
  const { data: existingRoots, error: rootsErr } = await supabase
    .from('han_viet_roots')
    .select('id, hanzi, reading_vi');

  if (rootsErr) {
    throw new Error(`Lỗi truy vấn han_viet_roots: ${rootsErr.message}`);
  }

  const rootByReading = new Map<string, { id: string; hanzi?: string | null; reading_vi: string }>();
  for (const r of existingRoots || []) {
    rootByReading.set(r.reading_vi.trim().toLowerCase(), r);
  }

  const rootsToInsertMap = new Map<string, { hanzi: string | null; reading_vi: string; root_meaning: string }>();
  for (const item of items) {
    for (const root of [item.root1, item.root2]) {
      const key = root.reading_vi.trim().toLowerCase();
      if (!rootByReading.has(key) && !rootsToInsertMap.has(key)) {
        rootsToInsertMap.set(key, {
          hanzi: root.hanzi?.trim() || null,
          reading_vi: root.reading_vi.trim(),
          root_meaning: root.root_meaning.trim(),
        });
      }
    }
  }

  let insertedRootsCount = 0;
  const newRootsPayload = Array.from(rootsToInsertMap.values());
  if (newRootsPayload.length > 0) {
    const { data: insertedRoots, error: insertRootsErr } = await supabase
      .from('han_viet_roots')
      .upsert(newRootsPayload, { onConflict: 'reading_vi', ignoreDuplicates: false })
      .select('id, hanzi, reading_vi');

    if (insertRootsErr) {
      throw new Error(`Lỗi thêm mới han_viet_roots: ${insertRootsErr.message}`);
    }

    insertedRootsCount = insertedRoots?.length ?? 0;
    for (const r of insertedRoots || []) {
      rootByReading.set(r.reading_vi.trim().toLowerCase(), r);
    }
  }

  // 2. Kiểm tra từ ghép trong `han_viet_compounds` để tránh trùng lặp từ đã có
  const { data: existingCompounds, error: compErr } = await supabase
    .from('han_viet_compounds')
    .select('id, word, slug');

  if (compErr) {
    throw new Error(`Lỗi truy vấn han_viet_compounds: ${compErr.message}`);
  }

  const existingBySlug = new Map<string, { id: string; word: string; slug: string }>();
  const existingByWord = new Map<string, { id: string; word: string; slug: string }>();
  for (const c of existingCompounds || []) {
    existingBySlug.set(c.slug.toLowerCase(), c);
    existingByWord.set(c.word.trim().toLowerCase(), c);
  }

  const skippedExistingCompounds: string[] = [];
  const newCompoundsToInsert: Array<{
    item: ExtractedHanVietItem;
    payload: {
      word: string;
      slug: string;
      full_meaning: string;
      example_sentence: string;
      math_formula: string;
      subject_tag: string;
      grade_level: number;
      quiz_data: QuizData;
    };
  }> = [];

  for (const item of items) {
    const slug = (item.slug || toSlug(item.word)).toLowerCase();
    const wordKey = item.word.trim().toLowerCase();

    if (existingBySlug.has(slug) || existingByWord.has(wordKey)) {
      skippedExistingCompounds.push(item.word);
      continue;
    }

    newCompoundsToInsert.push({
      item,
      payload: {
        word: item.word.trim(),
        slug,
        full_meaning: item.full_meaning.trim(),
        example_sentence: item.example_sentence.trim(),
        math_formula: item.math_formula.trim(),
        subject_tag: item.subject_tag || 'SGK',
        grade_level: item.grade_level || 7,
        quiz_data: item.quiz_data,
      },
    });
  }

  let upsertedCompoundsCount = 0;
  let insertedLinksCount = 0;

  if (newCompoundsToInsert.length > 0) {
    const { data: insertedCompounds, error: insertCompErr } = await supabase
      .from('han_viet_compounds')
      .insert(newCompoundsToInsert.map((x) => x.payload))
      .select('id, word, slug');

    if (insertCompErr) {
      throw new Error(`Lỗi thêm mới han_viet_compounds: ${insertCompErr.message}`);
    }

    upsertedCompoundsCount = insertedCompounds?.length ?? 0;

    const compoundIdBySlug = new Map<string, string>();
    for (const c of insertedCompounds || []) {
      compoundIdBySlug.set(c.slug.toLowerCase(), c.id);
    }

    // 3. Ghi bảng nối `compound_root_links` cho các từ ghép vừa thêm
    const linksPayload: Array<{
      compound_id: string;
      root_id: string;
      position_order: 1 | 2;
      related_words: string[];
    }> = [];

    for (const { item, payload } of newCompoundsToInsert) {
      const compoundId = compoundIdBySlug.get(payload.slug);
      if (!compoundId) continue;

      const r1 = rootByReading.get(item.root1.reading_vi.trim().toLowerCase());
      const r2 = rootByReading.get(item.root2.reading_vi.trim().toLowerCase());

      if (r1) {
        linksPayload.push({
          compound_id: compoundId,
          root_id: r1.id,
          position_order: 1,
          related_words: item.root1.related_words || [],
        });
      }
      if (r2) {
        linksPayload.push({
          compound_id: compoundId,
          root_id: r2.id,
          position_order: 2,
          related_words: item.root2.related_words || [],
        });
      }
    }

    if (linksPayload.length > 0) {
      const { error: linksErr } = await supabase.from('compound_root_links').insert(linksPayload);
      if (linksErr) {
        throw new Error(`Lỗi thêm mới compound_root_links: ${linksErr.message}`);
      }
      insertedLinksCount = linksPayload.length;
    }
  }

  return {
    insertedRootsCount,
    upsertedCompoundsCount,
    insertedLinksCount,
    skippedExistingCompounds,
  };
}

/**
 * Hàm tổng hợp của Agent: Nhận văn bản SGK -> Bóc tách qua Gemini -> Lưu vào Supabase
 */
export async function scrapeAndSaveHanVietFromText(
  articleText: string,
  options: HanVietScraperOptions = {}
): Promise<HanVietScraperResult> {
  const extracted = await extractHanVietFromText(articleText, options);

  if (options.dryRun) {
    return {
      extracted,
      insertedRootsCount: 0,
      upsertedCompoundsCount: 0,
      insertedLinksCount: 0,
      skippedExistingCompounds: [],
    };
  }

  const dbResult = await saveExtractedHanVietToSupabase(extracted);
  return {
    extracted,
    ...dbResult,
  };
}

// ─── CLI RUNNER (Chạy trực tiếp bằng tsx src/lib/agents/han_viet_scraper.ts) ──

async function runCli() {
  const sampleText =
    process.argv[2] ||
    `Vào thời kỳ Phục hưng, sự phát triển của hàng hải và thiên văn học đã thúc đẩy các cuộc phát kiến địa lý lớn. Các nhà thám hiểm vượt đại dương mênh mông, mở rộng giao thương và thiết lập các tuyến mậu dịch xuyên lục địa.`;

  console.log('🤖 Đang chạy Agent bóc tách từ Hán-Việt từ văn bản SGK...');
  console.log(`📝 Văn bản đầu vào:\n"${sampleText}"\n`);

  const result = await scrapeAndSaveHanVietFromText(sampleText, {
    subjectTag: 'SGK',
    gradeLevel: 7,
    maxWords: 5,
  });

  console.log(`✅ Đã nhận diện ${result.extracted.length} từ Hán-Việt:`);
  for (const item of result.extracted) {
    console.log(`   • ${item.word}: ${item.math_formula}`);
  }
  console.log(`\n📊 Kết quả lưu trữ Supabase:`);
  console.log(`   - Hình vị mới thêm vào han_viet_roots: ${result.insertedRootsCount}`);
  console.log(`   - Từ ghép mới thêm vào han_viet_compounds: ${result.upsertedCompoundsCount}`);
  console.log(`   - Liên kết mới thêm vào compound_root_links: ${result.insertedLinksCount}`);
  if (result.skippedExistingCompounds.length > 0) {
    console.log(`   - Đã bỏ qua các từ ghép đã tồn tại: ${result.skippedExistingCompounds.join(', ')}`);
  }
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('han_viet_scraper.ts') || process.argv[1].includes('han_viet_scraper'));

if (isMain) {
  runCli().catch((err) => {
    console.error('❌ Lỗi khi chạy Han-Viet Scraper Agent:', err);
    process.exit(1);
  });
}

