/**
 * SCRIPT NẠP VÀ MỞ RỘNG TỪ ĐIỂN THUẦN VIỆT LỚP 7 BẰNG GEMINI API
 *
 * Chạy bằng:
 *   npm run expand:thuanviet
 *   npx tsx scripts/expand_thuan_viet.ts --count=30
 *   npx tsx scripts/expand_thuan_viet.ts --count=30 --topic="Ngữ văn 7"
 *
 * Tính năng:
 * 1. Đồng bộ 30 từ Thuần Việt mẫu (`THUAN_VIET_SEED_DATA`) và mỏ neo tiếng Anh Hán-Việt (`HAN_VIET_ENGLISH_ANCHORS`).
 * 2. Tích hợp Gemini API (@google/genai) để tự động sinh thêm từ Thuần Việt giàu hình ảnh, cảm xúc
 *    (từ láy, từ tượng hình, từ tượng thanh, từ đa nghĩa) trong SGK lớp 7 và upsert vào `thuan_viet_dictionary`.
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import type { QuizData, ThuanVietWordType } from '../src/types/dictionary';
import { THUAN_VIET_SEED_DATA, HAN_VIET_ENGLISH_ANCHORS } from '../src/lib/supabase/thuan-viet-seed';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ─── CLI ARGUMENT PARSER ──────────────────────────────────────────────────────

interface ThuanVietCliArgs {
  count: number;
  topic: string;
  seedOnly: boolean;
}

function parseCliArgs(argv: string[]): ThuanVietCliArgs {
  let count = 30;
  let topic = 'SGK Ngữ văn, Lịch sử và Địa lí lớp 7 (từ láy, từ tượng hình, từ tượng thanh, từ đa nghĩa giàu hình ảnh)';
  let seedOnly = false;

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
    } else if (arg === '--seed-only') {
      seedOnly = true;
    }
  }

  return { count, topic, seedOnly };
}

// ─── GEMINI SCHEMA FOR THUAN VIET GENERATION ──────────────────────────────────

export interface GeneratedThuanVietItem {
  word: string;
  word_type: ThuanVietWordType;
  simple_meaning: string;
  mental_image: string;
  context_clue: string;
  english_equivalent: string;
  example_sentence: string;
  synonyms: string[];
  grade_level: number;
  subject_tag: string;
  quiz_data: QuizData;
}

const THUAN_VIET_RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  description: 'Danh sách các từ Thuần Việt giàu hình ảnh, cảm xúc thường gặp trong SGK lớp 7.',
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description: 'Từ thuần Việt (viết hoa chữ cái đầu, ví dụ: "Màu mỡ", "Nhấp nhô", "Bạt ngàn").',
      },
      word_type: {
        type: Type.STRING,
        description: 'Phân loại từ, chỉ nhận 1 trong 4 giá trị: "tu_lay", "tu_tuong_hinh", "tu_tuong_thanh", "tu_da_nghia".',
      },
      simple_meaning: {
        type: Type.STRING,
        description: 'Nghĩa đời thường giải thích cực kỳ dễ hiểu cho học sinh 12 tuổi (lớp 7).',
      },
      mental_image: {
        type: Type.STRING,
        description: 'Gợi ý bức tranh tưởng tượng trong tâm trí (Visual clue) giúp học sinh hình dung ngay nghĩa của từ.',
      },
      context_clue: {
        type: Type.STRING,
        description: 'Mẹo nhận biết qua ngữ cảnh (thường đi kèm với những danh từ/động từ nào đứng trước hoặc sau).',
      },
      english_equivalent: {
        type: Type.STRING,
        description: 'Từ hoặc cụm từ tiếng Anh tương đương gần nhất (ví dụ: "Fertile", "Undulating", "Vast / Endless").',
      },
      example_sentence: {
        type: Type.STRING,
        description: 'Câu ví dụ chuẩn văn cảnh SGK Ngữ văn, Lịch sử, Địa lí lớp 7 hoặc đời sống.',
      },
      synonyms: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: '2 đến 3 từ đồng nghĩa đời thường.',
      },
      subject_tag: {
        type: Type.STRING,
        description: 'Môn học liên quan: "ngu-van", "lich-su", "dia-ly", "khoa-hoc", hoặc "SGK".',
      },
      quiz_data: {
        type: Type.OBJECT,
        description: '1 câu đố trắc nghiệm giúp học sinh lớp 7 hiểu sâu cách dùng và hình ảnh của từ.',
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                is_correct: { type: Type.BOOLEAN },
              },
              required: ['text', 'is_correct'],
            },
          },
          explanation: { type: Type.STRING },
        },
        required: ['question', 'options', 'explanation'],
      },
    },
    required: [
      'word',
      'word_type',
      'simple_meaning',
      'mental_image',
      'context_clue',
      'english_equivalent',
      'example_sentence',
      'synonyms',
      'subject_tag',
      'quiz_data',
    ],
  },
};

export async function generateThuanVietBatchFromGemini(
  batchCount: number,
  topic: string,
  excludedWords: string[]
): Promise<GeneratedThuanVietItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Thiếu GEMINI_API_KEY trong .env.local');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Bạn là chuyên gia Ngôn ngữ Tiếng Việt và Sư phạm THCS (lớp 7 - 12 tuổi).
Hãy chọn lọc và biên soạn ĐÚNG ${batchCount} từ Thuần Việt giàu hình ảnh, cảm xúc hoặc trừu tượng thường gặp trong ${topic}.

⚠️ QUY TẮC BẮT BUỘC:
1. Chỉ chọn từ Thuần Việt (từ láy, từ tượng hình, từ tượng thanh, từ đa nghĩa giàu hình tượng như: màu mỡ, nhấp nhô, bạt ngàn, khúc khuỷu, chằng chịt, trù phú, khẳng khiu...).
2. TUYỆT ĐỐI KHÔNG TRÙNG với bất kỳ từ nào trong danh sách đã có dưới đây:
[${excludedWords.join(', ')}]
3. Trường "word_type" bắt buộc chọn đúng 1 trong 4 nhãn: "tu_lay" | "tu_tuong_hinh" | "tu_tuong_thanh" | "tu_da_nghia".
4. Trường "mental_image" phải gợi ra một bức tranh sống động trong tâm trí trẻ 12 tuổi.
5. Trường "english_equivalent" cung cấp từ tiếng Anh chuẩn xác làm mỏ neo nhận thức (Cognitive Anchor).
6. Trường "quiz_data" gồm 4 phương án trả lời (1 phương án is_correct = true, 3 phương án is_correct = false).
`.trim();

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
            responseSchema: THUAN_VIET_RESPONSE_SCHEMA,
            temperature: 0.4,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout 60s trên model ${modelName}`)), 60000)
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

  const parsed = JSON.parse(rawText) as GeneratedThuanVietItem[];
  const validTypes = new Set(['tu_lay', 'tu_tuong_hinh', 'tu_tuong_thanh', 'tu_da_nghia']);

  return parsed.map((item) => ({
    ...item,
    word: item.word.trim(),
    word_type: (validTypes.has(item.word_type) ? item.word_type : 'tu_lay') as ThuanVietWordType,
    grade_level: 7,
    subject_tag: ['ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc', 'SGK'].includes(item.subject_tag)
      ? item.subject_tag
      : 'SGK',
  }));
}

// ─── MAIN RUNNER ──────────────────────────────────────────────────────────────

async function main() {
  const { count, topic, seedOnly } = parseCliArgs(process.argv.slice(2));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ LỖI: Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n🌿 ===== NẠP & MỞ RỘNG TỪ ĐIỂN THUẦN VIỆT LỚP 7 =====');
  console.log(`🎯 Số lượng từ mục tiêu : ${count} từ`);
  console.log(`📚 Chủ đề               : ${topic}`);

  // ── BƯỚC 1: Đồng bộ cột `english_equivalent` cho bảng `han_viet_compounds` (nếu cột đã được tạo) ──
  const { error: checkHvColErr } = await supabase
    .from('han_viet_compounds')
    .select('id, slug, english_equivalent')
    .limit(1);

  if (!checkHvColErr) {
    console.log('\n🇬🇧 [1/3] Đang cập nhật english_equivalent cho các từ ghép Hán-Việt hiện có...');
    let updatedHvCount = 0;
    for (const [slug, enText] of Object.entries(HAN_VIET_ENGLISH_ANCHORS)) {
      const { error: upErr } = await supabase
        .from('han_viet_compounds')
        .update({ english_equivalent: enText })
        .eq('slug', slug)
        .is('english_equivalent', null);
      if (!upErr) updatedHvCount++;
    }
    console.log(`   ✅ Đã đồng bộ mỏ neo tiếng Anh cho ${updatedHvCount} từ Hán-Việt.`);
  } else {
    console.log(
      '\nℹ️  [1/3] Cột `english_equivalent` trên `han_viet_compounds` đang chờ chạy file SQL migration (`supabase/migrations/create_thuan_viet_dictionary.sql`).'
    );
  }

  // ── BƯỚC 2: Kiểm tra bảng `thuan_viet_dictionary` ───────────────────────────
  const { data: existingRows, error: checkTableErr } = await supabase
    .from('thuan_viet_dictionary')
    .select('word');

  if (checkTableErr && checkTableErr.code === 'PGRST205') {
    console.log(
      '\n⚠️  Bảng `public.thuan_viet_dictionary` chưa tồn tại trên Supabase (cần chạy file `supabase/migrations/create_thuan_viet_dictionary.sql` trong Supabase SQL Editor).'
    );
    console.log(
      `✅ Tuy nhiên, 30 từ Thuần Việt mẫu đã được tích hợp sẵn vào bộ đệm ứng dụng (src/lib/supabase/thuan-viet-seed.ts) để UI /dictionary và /games hoạt động ngay lập tức!`
    );
    return;
  } else if (checkTableErr) {
    console.error('❌ Lỗi khi truy vấn thuan_viet_dictionary:', checkTableErr.message);
    process.exit(1);
  }

  const existingWords = new Set((existingRows || []).map((r) => r.word.trim().toLowerCase()));
  console.log(`\n📦 [2/3] Số từ Thuần Việt hiện có trong DB: ${existingWords.size} từ`);

  // Nếu DB chưa có đủ 30 từ hạt giống ban đầu, nạp trước từ THUAN_VIET_SEED_DATA
  const seedToInsert = THUAN_VIET_SEED_DATA.filter(
    (item) => !existingWords.has(item.word.trim().toLowerCase())
  ).slice(0, count);

  const itemsToUpsert: GeneratedThuanVietItem[] = seedToInsert.map((s) => ({
    word: s.word,
    word_type: s.word_type as ThuanVietWordType,
    simple_meaning: s.simple_meaning,
    mental_image: s.mental_image || '',
    context_clue: s.context_clue || '',
    english_equivalent: s.english_equivalent || '',
    example_sentence: s.example_sentence,
    synonyms: s.synonyms || [],
    grade_level: s.grade_level,
    subject_tag: s.subject_tag,
    quiz_data: s.quiz_data!,
  }));

  for (const s of itemsToUpsert) {
    existingWords.add(s.word.trim().toLowerCase());
  }

  // Nếu vẫn cần sinh thêm từ mới ngoài 30 từ hạt giống bằng Gemini API
  const remainingNeeded = count - itemsToUpsert.length;
  if (remainingNeeded > 0 && !seedOnly && process.env.GEMINI_API_KEY) {
    const BATCH_SIZE = 5;
    let rounds = 0;
    while (itemsToUpsert.length < count && rounds < 10) {
      rounds++;
      const reqCount = Math.min(BATCH_SIZE, count - itemsToUpsert.length);
      console.log(
        `🤖 [Đợt ${rounds}] Đang gọi Gemini sinh thêm ${reqCount} từ Thuần Việt mới (đã chuẩn bị ${itemsToUpsert.length}/${count})...`
      );
      try {
        const generated = await generateThuanVietBatchFromGemini(
          reqCount,
          topic,
          Array.from(existingWords)
        );
        for (const g of generated) {
          const key = g.word.trim().toLowerCase();
          if (!existingWords.has(key) && itemsToUpsert.length < count) {
            existingWords.add(key);
            itemsToUpsert.push(g);
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn(`⚠️ Không thể gọi thêm từ Gemini (${msg.slice(0, 80)}). Tiếp tục lưu các từ đã có.`);
        break;
      }
    }
  }

  // ── BƯỚC 3: Upsert vào bảng `thuan_viet_dictionary` ─────────────────────────
  if (itemsToUpsert.length > 0) {
    console.log(`\n💾 [3/3] Đang UPSERT ${itemsToUpsert.length} từ vào bảng thuan_viet_dictionary...`);
    const payload = itemsToUpsert.map((item) => ({
      word: item.word,
      word_type: item.word_type,
      simple_meaning: item.simple_meaning,
      mental_image: item.mental_image,
      context_clue: item.context_clue,
      english_equivalent: item.english_equivalent,
      example_sentence: item.example_sentence,
      synonyms: item.synonyms,
      grade_level: item.grade_level,
      subject_tag: item.subject_tag,
      quiz_data: item.quiz_data,
    }));

    const { data: upsertedData, error: upsertErr } = await supabase
      .from('thuan_viet_dictionary')
      .upsert(payload, { onConflict: 'word', ignoreDuplicates: false })
      .select('id, word, word_type, english_equivalent');

    if (upsertErr) {
      console.error('❌ Lỗi khi UPSERT vào thuan_viet_dictionary:', upsertErr.message);
      process.exit(1);
    }

    console.log(`   ✅ Đã UPSERT thành công ${upsertedData?.length ?? 0} từ Thuần Việt:`);
    (upsertedData || []).forEach((w, i) => {
      console.log(
        `      ${String(i + 1).padStart(2, '0')}. ${w.word} [${w.word_type}] — 🇬🇧 ${w.english_equivalent}`
      );
    });
  } else {
    console.log('\nℹ️ Không có từ mới cần thêm.');
  }

  const { count: totalCount } = await supabase
    .from('thuan_viet_dictionary')
    .select('*', { count: 'exact', head: true });

  console.log('\n📊 ===== TỔNG KẾT TỪ ĐIỂN THUẦN VIỆT =====');
  console.log(`   🌿 Tổng số từ trong thuan_viet_dictionary: ${totalCount ?? 0} từ`);
  console.log('===========================================\n');
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('expand_thuan_viet.ts') || process.argv[1].includes('expand_thuan_viet'));

if (isMain) {
  main().catch((err) => {
    console.error('\n💥 Lỗi khi chạy expand_thuan_viet:', err);
    process.exit(1);
  });
}

