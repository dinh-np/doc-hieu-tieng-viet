/**
 * SCRIPT NẠP VÀ MỞ RỘNG TỪ ĐIỂN THUẦN VIỆT BẰNG GEMINI API
 * (Nâng cấp: Không giới hạn SGK Lớp 7 — Quét kho từ thuần Việt giàu tính gợi hình,
 *  từ láy tâm lý/hành vi, từ đa nghĩa và giao tiếp thường nhật + Hỗ trợ `--words="..."`)
 *
 * Chạy bằng:
 *   npm run expand:thuanviet
 *   npx tsx scripts/expand_thuan_viet.ts --words="gắn bó, dở dang, ngập ngừng"
 *   npx tsx scripts/expand_thuan_viet.ts --count=30
 *   npx tsx scripts/expand_thuan_viet.ts --count=30 --topic="Từ láy tâm lý & hành vi"
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
  targetWords: string[];
}

function parseWordsList(raw: string): string[] {
  return raw
    .replace(/^["']|["']$/g, '')
    .split(/[,;|]+/)
    .map((w) => w.trim().normalize('NFC'))
    .filter((w) => w.length > 0);
}

function parseCliArgs(argv: string[]): ThuanVietCliArgs {
  let count = 30;
  let topic =
    'Kho từ thuần Việt giàu tính gợi hình, từ láy miêu tả tâm lý/hành vi, từ đa nghĩa và từ gợi cảm trong văn học và giao tiếp thường nhật';
  let seedOnly = false;
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
    } else if (arg === '--seed-only') {
      seedOnly = true;
    }
  }

  return { count, topic, seedOnly, targetWords };
}

function cleanNFC(s: string): string {
  return (s || '')
    .replace(/([\p{L}])\s+([\u0300-\u036f]+)/gu, '$1$2')
    .normalize('NFC')
    .trim();
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
  description:
    'Danh sách các từ Thuần Việt giàu hình ảnh, cảm xúc trong văn học, tâm lý hành vi và giao tiếp thường nhật.',
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description:
          'Từ thuần Việt (viết hoa chữ cái đầu, ví dụ: "Bỡ ngỡ", "Chập chững", "Gắn bó", "Dở dang", "Thoang thoảng").',
      },
      word_type: {
        type: Type.STRING,
        description:
          'Phân loại từ, chỉ nhận 1 trong 4 giá trị: "tu_lay", "tu_tuong_hinh", "tu_tuong_thanh", "tu_da_nghia".',
      },
      simple_meaning: {
        type: Type.STRING,
        description: 'Nghĩa đời thường giải thích cực kỳ dễ hiểu cho học sinh 12 tuổi.',
      },
      mental_image: {
        type: Type.STRING,
        description:
          'Gợi ý bức tranh tưởng tượng trong tâm trí (Visual image) giúp học sinh hình dung ngay nghĩa của từ.',
      },
      context_clue: {
        type: Type.STRING,
        description:
          'Mẹo nhận biết qua ngữ cảnh (thường đi kèm với những danh từ/động từ nào đứng trước hoặc sau).',
      },
      english_equivalent: {
        type: Type.STRING,
        description:
          'Từ hoặc cụm từ tiếng Anh tương đương gần nhất (ví dụ: "Bewildered / Unfamiliar", "Faltering / Todlling", "Closely bonded", "Unfinished").',
      },
      example_sentence: {
        type: Type.STRING,
        description: 'Câu ví dụ sinh động trong văn học hoặc giao tiếp đời sống thường nhật.',
      },
      synonyms: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: '2 đến 3 từ đồng nghĩa hoặc gần nghĩa đời thường.',
      },
      subject_tag: {
        type: Type.STRING,
        description: 'Môn học liên quan: "ngu-van", "lich-su", "dia-ly", "khoa-hoc", hoặc "SGK".',
      },
      quiz_data: {
        type: Type.OBJECT,
        description: '1 câu đố trắc nghiệm giúp học sinh hiểu sâu cách dùng và hình ảnh của từ.',
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

const SUB_THEMES = [
  'Nhóm 1: Từ láy & từ ghép thuần Việt miêu tả tâm lý, cảm xúc, sự ngập ngừng, trăn trở, gắn kết trong đời sống (ví dụ: bỡ ngỡ, ngập ngừng, tần ngần, trăn trở, gắn bó, dở dang, vương vấn, bâng khuâng...)',
  'Nhóm 2: Từ tượng hình & từ láy gợi tả hành vi, cử chỉ, bước đi, quá trình trưởng thành của con người (ví dụ: chập chững, lần hồi, tất tả, cần mẫn, tỉ mỉ, lầm lũi, thong thả, chững chạc...)',
  'Nhóm 3: Từ gợi cảm giác quan (hương thơm, làn gió, ánh sáng, âm thanh tinh tế trong văn học và đời thường: thoang thoảng, dịu dàng, ấm áp, trong trẻo, ngân nga, rì rào, lấp lánh...)',
  'Nhóm 4: Từ đa nghĩa và từ ghép thuần Việt giàu hình tượng trong giao tiếp hàng ngày và nghị luận xã hội (ví dụ: đùm bọc, sẻ chia, nâng đỡ, vun đắp, bền bỉ, vững vàng, cởi mở, chân thành...)',
  'Nhóm 5: Từ tượng hình và từ láy miêu tả không gian, cảnh sắc thiên nhiên, quê hương và nhịp sống xã hội (ví dụ: nhộn nhịp, bình yên, mênh mông, trù phú, quanh co, bát ngát...)',
];

const MODELS_TO_TRY = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
];

export function normalizeVietnameseWord(word: string): string {
  return cleanNFC(word)
    .toLowerCase()
    .replace(/oà/g, 'òa')
    .replace(/oá/g, 'óa')
    .replace(/oả/g, 'ỏa')
    .replace(/oã/g, 'õa')
    .replace(/oạ/g, 'ọa')
    .replace(/oè/g, 'òe')
    .replace(/oé/g, 'óe')
    .replace(/oẻ/g, 'ỏe')
    .replace(/uỳ/g, 'ùy')
    .replace(/uý/g, 'úy')
    .replace(/uỷ/g, 'ủy')
    .replace(/uỹ/g, 'ũy')
    .replace(/uỵ/g, 'ụy');
}

async function callGeminiThuanViet(prompt: string, temperature = 0.65): Promise<string> {
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
            responseSchema: THUAN_VIET_RESPONSE_SCHEMA,
            temperature,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout 75s trên model ${modelName}`)), 75000)
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

function normalizeGeneratedItems(parsed: GeneratedThuanVietItem[]): GeneratedThuanVietItem[] {
  const validTypes = new Set(['tu_lay', 'tu_tuong_hinh', 'tu_tuong_thanh', 'tu_da_nghia']);

  return parsed.map((item) => {
    const cleanW = cleanNFC(item.word);
    const formattedWord = cleanW.charAt(0).toUpperCase() + cleanW.slice(1).toLowerCase();

    return {
      ...item,
      word: formattedWord,
      word_type: (validTypes.has(item.word_type) ? item.word_type : 'tu_lay') as ThuanVietWordType,
      simple_meaning: cleanNFC(item.simple_meaning),
      mental_image: cleanNFC(item.mental_image),
      context_clue: cleanNFC(item.context_clue),
      english_equivalent: cleanNFC(item.english_equivalent),
      example_sentence: cleanNFC(item.example_sentence),
      synonyms: (item.synonyms || []).map(cleanNFC),
      grade_level: 7,
      subject_tag: ['ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc', 'SGK'].includes(item.subject_tag)
        ? item.subject_tag
        : 'ngu-van',
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
 * Bóc tách nghĩa đời thường tuổi 12, visual image, context clue, english_equivalent cho danh sách từ chỉ định (`--words`)
 */
export async function generateSpecificThuanVietWordsFromGemini(
  words: string[]
): Promise<GeneratedThuanVietItem[]> {
  const prompt = `
Bạn là chuyên gia Ngôn ngữ Tiếng Việt và Sư phạm THCS (dành cho học sinh 12 tuổi).
Hãy biên soạn dữ liệu từ điển Thuần Việt giàu hình ảnh cho ĐÚNG ${words.length} từ được chỉ định dưới đây:
Danh sách từ bắt buộc: [${words.map((w) => `"${w}"`).join(', ')}]

⚠️ QUY TẮC BẮT BUỘC:
1. Trả về đúng và đủ ${words.length} từ trong danh sách trên.
2. Trường "word_type" bắt buộc chọn đúng 1 trong 4 nhãn: "tu_lay" | "tu_tuong_hinh" | "tu_tuong_thanh" | "tu_da_nghia".
3. Trường "simple_meaning": giải thích nghĩa đời thường cực kỳ gần gũi, dễ hiểu cho học sinh 12 tuổi.
4. Trường "mental_image": gợi ra một bức tranh sống động trong tâm trí (Visual image).
5. Trường "context_clue": mẹo nhận biết ngữ cảnh (thường đi với danh từ/động từ nào).
6. Trường "english_equivalent": từ hoặc cụm từ tiếng Anh tương đương chuẩn xác làm mỏ neo nhận thức.
7. Trường "quiz_data": 4 phương án trả lời (1 phương án is_correct = true, 3 phương án is_correct = false).
`.trim();

  const rawText = await callGeminiThuanViet(prompt, 0.3);
  const parsed = JSON.parse(rawText) as GeneratedThuanVietItem[];
  return normalizeGeneratedItems(parsed);
}

export async function generateThuanVietBatchFromGemini(
  batchCount: number,
  topic: string,
  excludedWords: string[],
  roundIndex = 0
): Promise<GeneratedThuanVietItem[]> {
  const subTheme = SUB_THEMES[roundIndex % SUB_THEMES.length];

  const prompt = `
Bạn là chuyên gia Ngôn ngữ Tiếng Việt và Sư phạm THCS (dành cho học sinh 12-15 tuổi).
Hãy chọn lọc và biên soạn ĐÚNG ${batchCount} từ Thuần Việt giàu tính gợi hình, từ láy miêu tả tâm lý/hành vi, từ đa nghĩa và từ gợi cảm trong văn học và giao tiếp thường nhật.
🎯 Chủ đề: ${topic}
🎯 Trọng tâm đợt này: ${subTheme}

⚠️ QUY TẮC BẮT BUỘC:
1. Không giới hạn chỉ bài đọc SGK lớp 7: Hãy mở rộng sang kho từ thuần Việt tinh tế trong văn học và giao tiếp đời sống (ví dụ: bỡ ngỡ, chập chững, lần hồi, gắn bó, dở dang, thoang thoảng, ngập ngừng, trăn trở, vun đắp, đùm bọc...).
2. TUYỆT ĐỐI KHÔNG TRÙNG với bất kỳ từ nào trong danh sách đã có dưới đây:
[${excludedWords.join(', ')}]
3. Trường "word_type" bắt buộc chọn đúng 1 trong 4 nhãn: "tu_lay" | "tu_tuong_hinh" | "tu_tuong_thanh" | "tu_da_nghia".
4. Trường "mental_image" phải gợi ra một bức tranh sống động trong tâm trí trẻ 12 tuổi.
5. Trường "english_equivalent" cung cấp từ tiếng Anh chuẩn xác làm mỏ neo nhận thức (Cognitive Anchor).
6. Trường "quiz_data" gồm 4 phương án trả lời (1 phương án is_correct = true, 3 phương án is_correct = false).
`.trim();

  const rawText = await callGeminiThuanViet(prompt, 0.75);
  const parsed = JSON.parse(rawText) as GeneratedThuanVietItem[];
  return normalizeGeneratedItems(parsed);
}

// ─── MAIN RUNNER ──────────────────────────────────────────────────────────────

async function main() {
  const { count, topic, seedOnly, targetWords } = parseCliArgs(process.argv.slice(2));

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

  console.log('\n🌿 ===== NẠP & MỞ RỘNG TỪ ĐIỂN THUẦN VIỆT (VĂN HỌC & ĐỜI SỐNG) =====');

  // ── BƯỚC 1: Đồng bộ cột `english_equivalent` cho bảng `han_viet_compounds` (nếu còn từ chưa có) ──
  const { data: missingEnRows, error: checkHvColErr } = await supabase
    .from('han_viet_compounds')
    .select('id, slug')
    .is('english_equivalent', null);

  if (!checkHvColErr && missingEnRows && missingEnRows.length > 0) {
    let updatedHvCount = 0;
    for (const row of missingEnRows) {
      const enText = HAN_VIET_ENGLISH_ANCHORS[row.slug];
      if (enText) {
        const { error: upErr } = await supabase
          .from('han_viet_compounds')
          .update({ english_equivalent: enText })
          .eq('id', row.id);
        if (!upErr) updatedHvCount++;
      }
    }
    if (updatedHvCount > 0) {
      console.log(`🇬🇧 Đã đồng bộ mỏ neo tiếng Anh cho ${updatedHvCount} từ Hán-Việt.`);
    }
  }

  // ── BƯỚC 2: Kiểm tra bảng `thuan_viet_dictionary` ───────────────────────────
  const { data: existingRows, error: checkTableErr } = await supabase
    .from('thuan_viet_dictionary')
    .select('word');

  if (checkTableErr && checkTableErr.code === 'PGRST205') {
    console.log(
      '\n⚠️  Bảng `public.thuan_viet_dictionary` chưa tồn tại trên Supabase (cần chạy file `supabase/migrations/create_thuan_viet_dictionary.sql`).'
    );
    return;
  } else if (checkTableErr) {
    console.error('❌ Lỗi khi truy vấn thuan_viet_dictionary:', checkTableErr.message);
    process.exit(1);
  }

  const existingWords = new Set((existingRows || []).map((r) => normalizeVietnameseWord(r.word)));
  console.log(`📦 Số từ Thuần Việt hiện có trong DB: ${existingWords.size} từ`);

  const itemsToUpsert: GeneratedThuanVietItem[] = [];

  // ── TRƯỜNG HỢP A: NẠP TỪ CHỈ ĐỊNH QUA `--words="..."` ──
  if (targetWords.length > 0) {
    console.log(`🎯 Chế độ nạp từ chỉ định (--words): [${targetWords.join(', ')}]\n`);
    const wordsToGenerate = targetWords.filter((w) => {
      if (existingWords.has(normalizeVietnameseWord(w))) {
        console.log(`   ℹ️ Từ "${w}" đã có sẵn trong thuan_viet_dictionary, sẽ cập nhật lại chi tiết.`);
      }
      return true;
    });

    const generated = await generateSpecificThuanVietWordsFromGemini(wordsToGenerate);
    itemsToUpsert.push(...generated);
  } else {
    // ── TRƯỜNG HỢP B: MỞ RỘNG TỰ ĐỘNG THEO `--count` ──
    console.log(`🎯 Số lượng từ mục tiêu : ${count} từ`);
    console.log(`📚 Chủ đề               : ${topic}\n`);

    const seedToInsert = THUAN_VIET_SEED_DATA.filter(
      (item) => !existingWords.has(normalizeVietnameseWord(item.word))
    ).slice(0, count);

    for (const s of seedToInsert) {
      itemsToUpsert.push({
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
      });
      existingWords.add(normalizeVietnameseWord(s.word));
    }

    const remainingNeeded = count - itemsToUpsert.length;
    if (remainingNeeded > 0 && !seedOnly && process.env.GEMINI_API_KEY) {
      const BATCH_SIZE = 8;
      let rounds = 0;
      while (itemsToUpsert.length < count && rounds < 8) {
        rounds++;
        const reqCount = Math.min(BATCH_SIZE, count - itemsToUpsert.length + 1);
        console.log(
          `🤖 [Đợt ${rounds}] Đang gọi Gemini sinh thêm ${reqCount} từ Thuần Việt mới (đã chuẩn bị ${itemsToUpsert.length}/${count})...`
        );
        try {
          const generated = await generateThuanVietBatchFromGemini(
            reqCount,
            topic,
            Array.from(existingWords),
            rounds - 1
          );
          for (const g of generated) {
            const key = normalizeVietnameseWord(g.word);
            if (!existingWords.has(key) && itemsToUpsert.length < count) {
              existingWords.add(key);
              itemsToUpsert.push(g);
            }
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.warn(
            `⚠️ Không thể gọi thêm từ Gemini (${msg.slice(0, 80)}). Tiếp tục lưu các từ đã có.`
          );
          break;
        }
      }
    }
  }

  // ── BƯỚC 3: Upsert vào bảng `thuan_viet_dictionary` ─────────────────────────
  if (itemsToUpsert.length > 0) {
    console.log(`\n💾 Đang UPSERT ${itemsToUpsert.length} từ vào bảng thuan_viet_dictionary...`);
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
  (process.argv[1].endsWith('expand_thuan_viet.ts') ||
    process.argv[1].includes('expand_thuan_viet'));

if (isMain) {
  main().catch((err) => {
    console.error('\n💥 Lỗi khi chạy expand_thuan_viet:', err);
    process.exit(1);
  });
}
