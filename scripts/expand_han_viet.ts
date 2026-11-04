/**
 * SCRIPT MỞ RỘNG TỰ ĐỘNG KHO TỪ ĐIỂN HÁN-VIỆT BẰNG GEMINI API
 *
 * Chạy bằng:
 *   npm run expand:hanviet
 *   npx tsx scripts/expand_han_viet.ts --count=30 --topic="Lịch sử"
 *   npx tsx scripts/expand_han_viet.ts --count=50 --topic="Phổ biến lớp 7"
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
}

function parseCliArgs(argv: string[]): ExpandCliArgs {
  let count = 30;
  let topic = 'Phổ biến lớp 7 (Ngữ văn, Lịch sử, Địa lí, Khoa học tự nhiên, Đạo đức lối sống)';

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
    }
  }

  return { count, topic };
}

function resolveDefaultSubjectTag(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes('lịch sử') || lower.includes('lich su')) return 'lich-su';
  if (lower.includes('địa lí') || lower.includes('địa lý') || lower.includes('dia ly')) return 'dia-ly';
  if (lower.includes('ngữ văn') || lower.includes('ngu van') || lower.includes('đạo đức')) return 'ngu-van';
  if (lower.includes('khoa học') || lower.includes('khoa hoc')) return 'khoa-hoc';
  return 'SGK';
}

// ─── GEMINI SCHEMA FOR BATCH GENERATION ───────────────────────────────────────

const EXPAND_RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  description: 'Danh sách các từ ghép Hán-Việt 2 âm tiết mới dành cho học sinh lớp 7.',
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description: 'Từ ghép Hán-Việt 2 âm tiết (viết hoa chữ cái đầu, ví dụ: "Cương vực", "Khí quyển").',
      },
      full_meaning: {
        type: Type.STRING,
        description: 'Nghĩa tổng quát súc tích, dễ hiểu cho học sinh lớp 7 (12 tuổi).',
      },
      example_sentence: {
        type: Type.STRING,
        description: 'Câu ví dụ dễ hiểu, sinh động và gần gũi với kiến thức SGK lớp 7.',
      },
      math_formula: {
        type: Type.STRING,
        description: 'Công thức ngữ nghĩa theo dạng: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng quát".',
      },
      english_equivalent: {
        type: Type.STRING,
        description:
          'Từ hoặc cụm từ tiếng Anh tương đương gần nhất làm mỏ neo nhận thức cho học sinh (ví dụ: "Prosperous / Flourishing", "Differentiate / Diversify").',
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
            description: '2 đến 3 từ ghép Hán-Việt liên quan có chứa hình vị 1.',
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
            description: '2 đến 3 từ ghép Hán-Việt liên quan có chứa hình vị 2.',
          },
        },
        required: ['hanzi', 'reading_vi', 'root_meaning', 'related_words'],
      },
      quiz_data: {
        type: Type.OBJECT,
        description: '1 câu đố trắc nghiệm giúp học sinh lớp 7 luyện tập chiết tự từ này.',
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
          explanation: { type: Type.STRING, description: 'Giải thích ngắn gọn dựa trên nghĩa gốc hai hình vị.' },
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

/**
 * Gọi Gemini API để sinh một lô (batch) từ ghép Hán-Việt mới không trùng lặp
 */
async function generateBatchFromGemini(
  batchCount: number,
  topic: string,
  excludedWords: string[]
): Promise<ExtractedHanVietItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Thiếu GEMINI_API_KEY trong .env.local');
  }

  const ai = new GoogleGenAI({ apiKey });
  const defaultTag = resolveDefaultSubjectTag(topic);

  const prompt = `
Bạn là chuyên gia Từ điển Hán-Việt và Sư phạm THCS tại Việt Nam.
Hãy chọn lọc và biên soạn ĐÚNG ${batchCount} từ ghép Hán-Việt (2 âm tiết) thật sự hữu ích, giàu tính học thuật cho học sinh lớp 7 (12 tuổi) theo chủ đề: "${topic}".

⚠️ QUY TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG TRÙNG với bất kỳ từ nào trong danh sách ${excludedWords.length} từ đã có dưới đây:
[${excludedWords.join(', ')}]
2. Không tự lặp lại từ trong danh sách ${batchCount} từ bạn trả về.
3. Mỗi từ phải là từ ghép Hán-Việt 2 âm tiết chuẩn xác, có chữ Hán (hanzi) chính xác cho từng hình vị 1 và hình vị 2.
4. Trường "subject_tag" phải được phân loại hợp lý vào một trong các nhãn: "ngu-van", "lich-su", "dia-ly", "khoa-hoc", hoặc "SGK" (ưu tiên "${defaultTag}" nếu phù hợp chủ đề).
5. Công thức ngữ nghĩa (math_formula) trình bày theo dạng: "Âm 1 (nghĩa 1) + Âm 2 (nghĩa 2) → Nghĩa tổng hợp".
6. Trường "english_equivalent": cung cấp 1-2 từ/cụm từ tiếng Anh tương đương gần nhất làm mỏ neo nhận thức cho học sinh (ví dụ: "Prosperous / Flourishing", "Differentiate / Diversify").
7. Câu đố (quiz_data) có 4 phương án (1 phương án is_correct = true, 3 phương án is_correct = false).
`.trim();

  // Ưu tiên các model tốc độ cao, kèm cơ chế timeout 90s mỗi lần gọi (không truyền thinkingConfig cho các model không hỗ trợ)
  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];
  let rawText: string | undefined;
  let lastError: unknown;

  for (const modelName of modelsToTry) {
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
            temperature: 0.4,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout sau 90s trên model ${modelName}`)), 90000)
        ),
      ]);
      rawText = response.text;
      if (rawText) {
        console.log(`✅ Xong (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
        break;
      }
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`⚠️ Chuyển model khác (${msg.slice(0, 80)})`);
      continue;
    }
  }

  if (!rawText) {
    throw lastError || new Error('Không nhận được phản hồi từ Gemini API');
  }

  const parsed = JSON.parse(rawText) as ExtractedHanVietItem[];
  return parsed.map((item) => ({
    ...item,
    word: item.word.trim(),
    slug: toSlug(item.word),
    grade_level: 7,
    subject_tag: ['ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc', 'SGK'].includes(item.subject_tag)
      ? item.subject_tag
      : defaultTag,
  }));
}

// ─── MAIN EXECUTION ───────────────────────────────────────────────────────────

async function main() {
  const { count, topic } = parseCliArgs(process.argv.slice(2));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ LỖI: Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n🚀 ===== MỞ RỘNG KHO TỪ ĐIỂN HÁN-VIỆT BẰNG GEMINI AI =====');
  console.log(`🎯 Số lượng từ mục tiêu : ${count} từ mới`);
  console.log(`📚 Chủ đề               : ${topic}`);

  // 1. Truy vấn danh sách từ ghép đã có trong bảng `han_viet_compounds`
  const { data: existingRows, error: fetchErr } = await supabase
    .from('han_viet_compounds')
    .select('word, slug');

  if (fetchErr) {
    console.error('❌ Lỗi khi truy vấn han_viet_compounds:', fetchErr.message);
    process.exit(1);
  }

  const existingWords = (existingRows || []).map((r) => r.word.trim());
  const existingSlugs = new Set((existingRows || []).map((r) => r.slug.toLowerCase()));

  console.log(`📦 Số từ hiện có trong DB: ${existingWords.length} từ (sẽ dùng làm danh sách loại trừ)\n`);

  // 2. Chia nhỏ thành các batch (mỗi batch 5 từ) để phản hồi cực nhanh và không bị timeout khi server Gemini cao điểm
  const BATCH_SIZE = 5;
  const collectedItems: ExtractedHanVietItem[] = [];
  const exclusionList = [...existingWords];
  let safetyRounds = 0;

  while (collectedItems.length < count && safetyRounds < 10) {
    safetyRounds++;
    const needed = count - collectedItems.length;
    // Yêu cầu dư thêm 2 từ phòng trường hợp AI vô tình trùng
    const requestSize = Math.min(BATCH_SIZE, needed + 2);

    console.log(
      `🤖 [Đợt ${safetyRounds}] Đang yêu cầu Gemini sinh ${requestSize} từ mới (đã gom được ${collectedItems.length}/${count})...`
    );

    const batchItems = await generateBatchFromGemini(requestSize, topic, exclusionList);

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

  console.log(`\n✨ Đã sinh thành công ${collectedItems.length} từ ghép Hán-Việt mới hoàn toàn!`);

  // 3. Ghi an toàn vào 3 bảng Supabase (`han_viet_roots`, `han_viet_compounds`, `compound_root_links`)
  console.log('💾 Đang nạp dữ liệu vào 3 bảng Supabase...');
  const saveResult = await saveExtractedHanVietToSupabase(collectedItems);

  console.log('\n📋 DANH SÁCH CÁC TỪ MỚI VỪA ĐƯỢC THÊM:');
  collectedItems.forEach((item, idx) => {
    console.log(
      `   ${String(idx + 1).padStart(2, '0')}. ${item.word} (${item.root1.hanzi}${item.root2.hanzi}) [${item.subject_tag}] — ${item.math_formula}`
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

