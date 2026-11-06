/**
 * SCRIPT MỞ RỘNG TỰ ĐỘNG KHO TỪ ĐIỂN HÁN-VIỆT BẰNG GEMINI API
 * (Nâng cấp: Quét từ vựng học thuật THCS, đời sống xã hội, báo chí khoa học,
 *  Mở rộng theo "Gia phả hình vị" từ bảng `han_viet_roots` & Hỗ trợ nạp danh sách từ chỉ định `--words`)
 *
 * Chạy bằng:
 *   npm run expand:hanviet
 *   npx tsx scripts/expand_han_viet.ts --words="hình thành, hình thức, cơ chế, phương pháp"
 *   npx tsx scripts/expand_han_viet.ts --count=30
 *   npx tsx scripts/expand_han_viet.ts --count=30 --topic="Khoa học & Tư duy"
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import {
  ExtractedHanVietItem,
  saveExtractedHanVietToSupabase,
  toSlug,
} from '../src/lib/agents/han_viet_scraper';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ─── CLI ARGUMENT PARSER ──────────────────────────────────────────────────────

interface ExpandCliArgs {
  count: number;
  topic: string;
  targetWords: string[];
}

function parseWordsList(raw: string): string[] {
  return raw
    .replace(/^["']|["']$/g, '')
    .split(/[,;|]+/)
    .map((w) => w.trim().normalize('NFC'))
    .filter((w) => w.length > 0);
}

function parseCliArgs(argv: string[]): ExpandCliArgs {
  let count = 30;
  let topic =
    'Từ vựng Hán-Việt học thuật thông dụng bậc THCS, đời sống xã hội, báo chí khoa học và các khái niệm trừu tượng thường gặp';
  let targetWords: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--count=')) {
      const val = parseInt(arg.split('=')[1], 10);
      if (!isNaN(val) && val > 0) count = val;
    } else if (arg === '--count' && argv[i + 1]) {
      const val = parseInt(argv[++i], 10);
      if (!isNaN(val) && val > 0) count = val;
    } else if (arg.startsWith('--topic=')) {
      topic = arg.slice('--topic='.length).replace(/^["']|["']$/g, '').trim();
    } else if (arg === '--topic' && argv[i + 1]) {
      topic = argv[++i].replace(/^["']|["']$/g, '').trim();
    } else if (arg.startsWith('--words=')) {
      targetWords = parseWordsList(arg.slice('--words='.length));
    } else if (arg === '--words' && argv[i + 1]) {
      targetWords = parseWordsList(argv[++i]);
    }
  }

  return { count, topic, targetWords };
}

function resolveDefaultSubjectTag(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes('lịch sử') || lower.includes('lich su')) return 'lich-su';
  if (lower.includes('địa lí') || lower.includes('địa lý') || lower.includes('dia ly')) return 'dia-ly';
  if (lower.includes('ngữ văn') || lower.includes('ngu van') || lower.includes('đạo đức')) return 'ngu-van';
  if (lower.includes('khoa học') || lower.includes('khoa hoc')) return 'khoa-hoc';
  return 'SGK';
}

function cleanNFC(s: string): string {
  return (s || '')
    .replace(/([\p{L}])\s+([\u0300-\u036f]+)/gu, '$1$2')
    .normalize('NFC')
    .trim();
}

// ─── GEMINI SCHEMA FOR BATCH & TARGETED GENERATION ───────────────────────────

const EXPAND_RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  description:
    'Danh sách các từ ghép Hán-Việt 2 âm tiết thông dụng trong học thuật THCS, đời sống xã hội và báo chí khoa học.',
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description:
          'Từ ghép Hán-Việt 2 âm tiết (viết hoa chữ cái đầu, ví dụ: "Hình thành", "Hình thức", "Phương pháp", "Cơ chế").',
      },
      full_meaning: {
        type: Type.STRING,
        description: 'Nghĩa tổng quát súc tích, dễ hiểu cho học sinh THCS (12-15 tuổi).',
      },
      example_sentence: {
        type: Type.STRING,
        description: 'Câu ví dụ dễ hiểu, sinh động và gần gũi với học tập, khoa học hoặc đời sống.',
      },
      math_formula: {
        type: Type.STRING,
        description:
          'Công thức ngữ nghĩa theo dạng: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng quát".',
      },
      english_equivalent: {
        type: Type.STRING,
        description:
          'Từ hoặc cụm từ tiếng Anh tương đương gần nhất làm mỏ neo nhận thức cho học sinh (ví dụ: "Form / Take shape", "Form / Format", "Mechanism", "Method").',
      },
      subject_tag: {
        type: Type.STRING,
        description: 'Một trong các giá trị: "ngu-van", "lich-su", "dia-ly", "khoa-hoc", hoặc "SGK".',
      },
      root1: {
        type: Type.OBJECT,
        description: 'Hình vị 1 (yếu tố đứng trước).',
        properties: {
          hanzi: { type: Type.STRING, description: 'Chữ Hán tương ứng (1 chữ Hán).' },
          reading_vi: { type: Type.STRING, description: 'Âm đọc Hán-Việt viết hoa chữ đầu.' },
          root_meaning: { type: Type.STRING, description: 'Nghĩa gốc ngắn gọn của hình vị 1.' },
          related_words: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 đến 4 từ ghép Hán-Việt thông dụng có chứa hình vị 1.',
          },
        },
        required: ['hanzi', 'reading_vi', 'root_meaning', 'related_words'],
      },
      root2: {
        type: Type.OBJECT,
        description: 'Hình vị 2 (yếu tố đứng sau).',
        properties: {
          hanzi: { type: Type.STRING, description: 'Chữ Hán tương ứng (1 chữ Hán).' },
          reading_vi: { type: Type.STRING, description: 'Âm đọc Hán-Việt viết hoa chữ đầu.' },
          root_meaning: { type: Type.STRING, description: 'Nghĩa gốc ngắn gọn của hình vị 2.' },
          related_words: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 đến 4 từ ghép Hán-Việt thông dụng có chứa hình vị 2.',
          },
        },
        required: ['hanzi', 'reading_vi', 'root_meaning', 'related_words'],
      },
      quiz_data: {
        type: Type.OBJECT,
        description: '1 câu đố trắc nghiệm giúp học sinh luyện tập chiết tự và hiểu sâu từ này.',
        properties: {
          question: { type: Type.STRING, description: 'Câu hỏi trắc nghiệm ngắn gọn, thú vị.' },
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
            description: 'Giải thích ngắn gọn dựa trên nghĩa gốc hai hình vị.',
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
      'english_equivalent',
      'subject_tag',
      'root1',
      'root2',
      'quiz_data',
    ],
  },
};

const ACADEMIC_SUB_THEMES = [
  'Nhóm 1: Các khái niệm tư duy, phương pháp luận & nghiên cứu học thuật (ví dụ: phương pháp, cơ chế, kết quả, nguyên nhân, nguyên tắc, quy luật, quy trình, hệ thống, phân tích, tổng hợp, khái quát, giả thuyết...)',
  'Nhóm 2: Mở rộng theo Gia phả hình vị "Hình - Thể - Chất - Lượng - Cấu - Trúc" (ví dụ: hình thái, biến thể, bản chất, hiện tượng, cấu trúc, tính chất, dung lượng, định lượng, định tính, mô hình...)',
  'Nhóm 3: Từ vựng đời sống xã hội, tâm lý, nhân cách & giao tiếp hiện đại (ví dụ: nhận thức, quan điểm, thái độ, trách nhiệm, bản lĩnh, nghị lực, đồng cảm, cống hiến, hợp tác, thích nghi...)',
  'Nhóm 4: Từ vựng báo chí khoa học, công nghệ, môi trường & kinh tế - xã hội (ví dụ: năng lượng, hiệu suất, tác động, biến đổi, cân bằng, phát triển, bền vững, sáng tạo, ứng dụng, chuyển hóa...)',
  'Nhóm 5: Mở rộng theo Gia phả hình vị "Tác - Động - Biến - Hóa - Quan - Hệ" (ví dụ: tương tác, tác nhân, biến động, tiến hóa, thoái hóa, tương quan, liên hệ, phản xạ, phản hồi, điều chỉnh...)',
  'Nhóm 6: Từ vựng văn hóa, nghệ thuật, lịch sử - văn minh & tư tưởng (ví dụ: truyền thống, di sản, bản sắc, giá trị, chuẩn mực, biểu tượng, thẩm mỹ, nhân văn, tiến bộ, hội nhập...)',
];

const MODELS_TO_TRY = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
];

async function callGeminiWithFallback(prompt: string, temperature = 0.35): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Thiếu GEMINI_API_KEY trong .env.local');
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown;

  for (const modelName of MODELS_TO_TRY) {
    try {
      process.stdout.write(`   ⏳ Đang gọi model ${modelName}... `);
      const t0 = Date.now();
      const response = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: EXPAND_RESPONSE_SCHEMA,
            temperature,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout sau 75s trên model ${modelName}`)), 75000)
        ),
      ]);

      if (response.text) {
        console.log(`✅ Xong (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
        return response.text;
      }
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`⚠️ Chuyển model khác (${msg.slice(0, 75)})`);
    }
  }

  throw lastError || new Error('Không nhận được phản hồi từ Gemini API');
}

function normalizeExtractedItems(
  parsed: ExtractedHanVietItem[],
  defaultTag: string
): ExtractedHanVietItem[] {
  return parsed.map((item) => {
    const cleanWord = cleanNFC(item.word);
    // Viết hoa chữ cái đầu tiên của từ ghép
    const formattedWord =
      cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase();

    return {
      ...item,
      word: formattedWord,
      slug: toSlug(formattedWord),
      full_meaning: cleanNFC(item.full_meaning),
      example_sentence: cleanNFC(item.example_sentence),
      math_formula: cleanNFC(item.math_formula),
      english_equivalent: cleanNFC(item.english_equivalent || ''),
      grade_level: 7,
      subject_tag: ['ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc', 'SGK'].includes(item.subject_tag)
        ? item.subject_tag
        : defaultTag,
      root1: {
        hanzi: cleanNFC(item.root1.hanzi),
        reading_vi: cleanNFC(item.root1.reading_vi),
        root_meaning: cleanNFC(item.root1.root_meaning),
        related_words: (item.root1.related_words || []).map(cleanNFC),
      },
      root2: {
        hanzi: cleanNFC(item.root2.hanzi),
        reading_vi: cleanNFC(item.root2.reading_vi),
        root_meaning: cleanNFC(item.root2.root_meaning),
        related_words: (item.root2.related_words || []).map(cleanNFC),
      },
      quiz_data: {
        question: cleanNFC(item.quiz_data.question),
        options: (item.quiz_data.options || []).map((o) => ({
          text: cleanNFC(o.text),
          is_correct: Boolean(o.is_correct),
        })),
        explanation: cleanNFC(item.quiz_data.explanation),
      },
    };
  });
}

/**
 * Sinh chiết tự cho danh sách từ Hán-Việt chỉ định cụ thể (`--words="..."`)
 */
export async function generateSpecificWordsFromGemini(
  words: string[],
  defaultTag = 'SGK'
): Promise<ExtractedHanVietItem[]> {
  const prompt = `
Bạn là chuyên gia Ngôn ngữ học Hán-Việt và Sư phạm THCS tại Việt Nam.
Hãy phân tích chiết tự chính xác và biên soạn dữ liệu từ điển cho ĐÚNG ${words.length} từ ghép Hán-Việt được chỉ định dưới đây:
Danh sách từ bắt buộc: [${words.map((w) => `"${w}"`).join(', ')}]

⚠️ QUY TẮC BẮT BUỘC:
1. Trả về đúng và đủ ${words.length} từ trong danh sách trên, giữ đúng từng từ đã yêu cầu.
2. Phân tích chính xác chữ Hán (hanzi), âm Hán-Việt (reading_vi), nghĩa gốc (root_meaning) và các từ ghép cùng gia phả hình vị (related_words) cho cả root1 và root2.
3. Công thức ngữ nghĩa (math_formula) trình bày theo dạng: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng hợp dễ hiểu cho học sinh 12 tuổi".
4. Trường "english_equivalent": cung cấp 1-2 từ/cụm từ tiếng Anh tương đương chuẩn xác làm mỏ neo nhận thức (Cognitive Anchor).
5. Câu đố (quiz_data) có 4 phương án (1 phương án is_correct = true, 3 phương án is_correct = false).
`.trim();

  const rawText = await callGeminiWithFallback(prompt, 0.2);
  const parsed = JSON.parse(rawText) as ExtractedHanVietItem[];
  return normalizeExtractedItems(parsed, defaultTag);
}

/**
 * Gọi Gemini API để sinh một lô (batch) từ ghép Hán-Việt mới dựa trên phạm vi mở rộng + Gia phả hình vị
 */
async function generateBatchFromGemini(
  batchCount: number,
  topic: string,
  excludedWords: string[],
  existingRootsSample: string[],
  roundIndex = 0
): Promise<ExtractedHanVietItem[]> {
  const defaultTag = resolveDefaultSubjectTag(topic);
  const subTheme = ACADEMIC_SUB_THEMES[roundIndex % ACADEMIC_SUB_THEMES.length];

  const prompt = `
Bạn là chuyên gia Từ điển Hán-Việt và Sư phạm THCS tại Việt Nam.
Hãy chọn lọc và biên soạn ĐÚNG ${batchCount} từ ghép Hán-Việt (2 âm tiết) thông dụng, có tính ứng dụng cao trong học thuật THCS, đời sống xã hội, báo chí khoa học và các khái niệm trừu tượng thường gặp.

🎯 Chủ đề tổng quát: "${topic}"
🎯 Trọng tâm đợt này: ${subTheme}
🧬 Gia phả hình vị gợi ý (ưu tiên khai thác các từ ghép phổ thông chứa các hình vị gốc này hoặc các hình vị học thuật thông dụng khác):
[${existingRootsSample.join(', ')}]

⚠️ QUY TẮC BẮT BUỘC:
1. Không giới hạn trong SGK lớp 7: Hãy chọn các từ vựng học thuật và đời sống cực kỳ thông dụng mà học sinh THCS thường gặp khi đọc sách, báo khoa học, bài luận (ví dụ: phương pháp, cơ chế, kết quả, nguyên tắc, quy luật, hiện tượng, bản chất, cấu trúc, tác động, hiệu quả, mục tiêu, giải pháp, nhận thức, quan điểm...).
2. TUYỆT ĐỐI KHÔNG TRÙNG với bất kỳ từ nào trong danh sách ${excludedWords.length} từ đã có dưới đây:
[${excludedWords.join(', ')}]
3. Không tự lặp lại từ trong danh sách ${batchCount} từ bạn trả về.
4. Mỗi từ phải là từ ghép Hán-Việt 2 âm tiết chuẩn xác, có chữ Hán (hanzi) chính xác cho từng hình vị 1 và hình vị 2.
5. Công thức ngữ nghĩa (math_formula) trình bày theo dạng: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng hợp".
6. Trường "english_equivalent": cung cấp 1-2 từ/cụm từ tiếng Anh tương đương gần nhất làm mỏ neo nhận thức cho học sinh.
7. Câu đố (quiz_data) có 4 phương án (1 phương án is_correct = true, 3 phương án is_correct = false).
`.trim();

  const rawText = await callGeminiWithFallback(prompt, 0.45);
  const parsed = JSON.parse(rawText) as ExtractedHanVietItem[];
  return normalizeExtractedItems(parsed, defaultTag);
}

// ─── MAIN EXECUTION ───────────────────────────────────────────────────────────

async function main() {
  const { count, topic, targetWords } = parseCliArgs(process.argv.slice(2));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ LỖI: Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n🚀 ===== MỞ RỘNG KHO TỪ ĐIỂN HÁN-VIỆT (HỌC THUẬT & GIA PHẢ HÌNH VỊ) =====');

  // 1. Truy vấn danh sách từ ghép đã có trong bảng `han_viet_compounds` và hình vị trong `han_viet_roots`
  const [{ data: existingRows, error: fetchErr }, { data: rootRows }] = await Promise.all([
    supabase.from('han_viet_compounds').select('word, slug'),
    supabase.from('han_viet_roots').select('reading_vi, hanzi, root_meaning'),
  ]);

  if (fetchErr) {
    console.error('❌ Lỗi khi truy vấn han_viet_compounds:', fetchErr.message);
    process.exit(1);
  }

  const existingWords = (existingRows || []).map((r) => cleanNFC(r.word));
  const existingSlugs = new Set((existingRows || []).map((r) => r.slug.toLowerCase()));
  const allRootReadings = (rootRows || []).map(
    (r) => `${cleanNFC(r.reading_vi)} (${cleanNFC(r.root_meaning || '')})`
  );

  console.log(`📦 Số từ ghép hiện có trong DB : ${existingWords.length} từ`);
  console.log(`🈯 Số hình vị gốc trong DB     : ${allRootReadings.length} hình vị`);

  const collectedItems: ExtractedHanVietItem[] = [];

  // ── TRƯỜNG HỢP A: NẠP DANH SÁCH TỪ CHỈ ĐỊNH QUA `--words="..."` ──
  if (targetWords.length > 0) {
    console.log(`🎯 Chế độ nạp từ chỉ định (--words): [${targetWords.join(', ')}]\n`);

    const wordsToFetch = targetWords.filter((w) => {
      const slug = toSlug(w).toLowerCase();
      if (existingSlugs.has(slug)) {
        console.log(`   ℹ️ Từ "${w}" (slug: ${slug}) đã có sẵn trong DB, bỏ qua.`);
        return false;
      }
      return true;
    });

    if (wordsToFetch.length > 0) {
      const CHUNK_SIZE = 8;
      for (let i = 0; i < wordsToFetch.length; i += CHUNK_SIZE) {
        const slice = wordsToFetch.slice(i, i + CHUNK_SIZE);
        console.log(`🤖 Đang phân tích chiết tự cho ${slice.length} từ chỉ định: [${slice.join(', ')}]...`);
        const generated = await generateSpecificWordsFromGemini(
          slice,
          resolveDefaultSubjectTag(topic)
        );
        for (const item of generated) {
          const slug = (item.slug || toSlug(item.word)).toLowerCase();
          if (!existingSlugs.has(slug)) {
            existingSlugs.add(slug);
            collectedItems.push(item);
          }
        }
      }
    }
  } else {
    // ── TRƯỜNG HỢP B: MỞ RỘNG TỰ ĐỘNG THEO SỐ LƯỢNG `--count` & GIA PHẢ HÌNH VỊ ──
    console.log(`🎯 Số lượng từ mục tiêu        : ${count} từ mới`);
    console.log(`📚 Phạm vi quét                : ${topic}\n`);

    const BATCH_SIZE = 6;
    const exclusionList = [...existingWords];
    let safetyRounds = 0;

    while (collectedItems.length < count && safetyRounds < 12) {
      safetyRounds++;
      const needed = count - collectedItems.length;
      const requestSize = Math.min(BATCH_SIZE, needed + 1);

      // Lấy mẫu xoay vòng 25 hình vị từ bảng `han_viet_roots` để kích hoạt cơ chế "Gia phả hình vị"
      const startIdx = ((safetyRounds - 1) * 20) % Math.max(1, allRootReadings.length);
      const rootsSlice =
        allRootReadings.length > 0
          ? allRootReadings.slice(startIdx, startIdx + 25)
          : ['Hình (hình dạng)', 'Pháp (phép tắc)', 'Thể (hình thể)', 'Hóa (biến đổi)', 'Tâm (tâm trí)', 'Cơ (cơ cấu)', 'Chế (quy định)'];

      console.log(
        `🤖 [Đợt ${safetyRounds}] Đang yêu cầu Gemini sinh ${requestSize} từ mới (đã gom được ${collectedItems.length}/${count})...`
      );

      const batchItems = await generateBatchFromGemini(
        requestSize,
        topic,
        exclusionList,
        rootsSlice,
        safetyRounds - 1
      );

      for (const item of batchItems) {
        if (collectedItems.length >= count) break;
        const slug = (item.slug || toSlug(item.word)).toLowerCase();
        if (existingSlugs.has(slug)) {
          continue;
        }
        existingSlugs.add(slug);
        exclusionList.push(item.word);
        collectedItems.push(item);
      }
    }
  }

  if (collectedItems.length === 0) {
    console.log('\nℹ️ Không có từ Hán-Việt mới nào cần thêm.');
    return;
  }

  console.log(`\n✨ Đã chuẩn bị thành công ${collectedItems.length} từ ghép Hán-Việt mới!`);

  // 3. Ghi an toàn vào 3 bảng Supabase (`han_viet_roots`, `han_viet_compounds`, `compound_root_links`)
  console.log('💾 Đang nạp dữ liệu vào 3 bảng Supabase...');
  const saveResult = await saveExtractedHanVietToSupabase(collectedItems);

  console.log('\n📋 DANH SÁCH CÁC TỪ MỚI VỪA ĐƯỢC THÊM:');
  collectedItems.forEach((item, idx) => {
    console.log(
      `   ${String(idx + 1).padStart(2, '0')}. ${item.word} (${item.root1.hanzi}${item.root2.hanzi}) [${item.subject_tag}] — ${item.math_formula} | 🇬🇧 ${item.english_equivalent}`
    );
  });

  // 4. Kiểm tra tổng số bản ghi hiện có trong Database sau khi chạy xong
  const [rootsCount, compoundsCount, linksCount] = await Promise.all([
    supabase.from('han_viet_roots').select('*', { count: 'exact', head: true }),
    supabase.from('han_viet_compounds').select('*', { count: 'exact', head: true }),
    supabase.from('compound_root_links').select('*', { count: 'exact', head: true }),
  ]);

  console.log('\n📊 ===== TỔNG KẾT SAU KHI MỞ RỘNG =====');
  console.log(`   ➕ Số từ ghép mới vừa thêm       : +${saveResult.upsertedCompoundsCount} từ`);
  console.log(`   ➕ Số hình vị gốc mới vừa thêm   : +${saveResult.insertedRootsCount} hình vị`);
  console.log(`   ➕ Số liên kết mới vừa thêm      : +${saveResult.insertedLinksCount} liên kết`);
  console.log('   -----------------------------------------');
  console.log(`   🏛️  Tổng số từ ghép (han_viet_compounds)  : ${compoundsCount.count ?? 0} từ`);
  console.log(`   🈯 Tổng số hình vị (han_viet_roots)      : ${rootsCount.count ?? 0} hình vị`);
  console.log(`   🔗 Tổng số liên kết (compound_root_links): ${linksCount.count ?? 0} liên kết`);
  console.log('============================================\n');
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('expand_han_viet.ts') || process.argv[1].includes('expand_han_viet'));

if (isMain) {
  main().catch((err) => {
    console.error('\n💥 Lỗi khi chạy expand_han_viet:', err);
    process.exit(1);
  });
}
