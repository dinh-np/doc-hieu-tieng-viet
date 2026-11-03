/**
 * SCRIPT NẠP 100 TỪ HÁN-VIỆT CHIẾT TỰ VÀO SUPABASE (SEED DATA)
 *
 * Chạy bằng: npm run seed:hanviet
 * (hoặc: npx tsx scripts/seed_han_viet.ts)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { QuizData } from '../src/types/dictionary';

// Load biến môi trường từ .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

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

export interface ParsedRoot {
  reading_vi: string;
  hanzi?: string;
  root_meaning: string;
  related_words: string[];
}

export interface ParsedCompound {
  index: number;
  word: string;
  slug: string;
  full_meaning: string;
  example_sentence: string;
  math_formula: string;
  grade_level: number;
  subject_tag: string;
  root1: ParsedRoot;
  root2: ParsedRoot;
  quiz_data: QuizData;
}

/**
 * Bóc tách 1 ô Hình vị trong bảng Markdown:
 * Ví dụ: "**Giang** (江) = sông; lq: *giang hồ, trường giang*"
 * hoặc: "**Ngòi** = nhánh sông nhỏ; lq: *ngòi lạch, kênh ngòi*"
 */
function parseTableRootCell(cell: string): ParsedRoot {
  const cleaned = cell.trim();

  // Tách phần trước "; lq:" và phần từ liên quan
  const [mainPart, lqPart] = cleaned.split(/;\s*lq:\s*/i);

  let related_words: string[] = [];
  if (lqPart) {
    const rawLq = lqPart.replace(/\*/g, '').trim();
    related_words = rawLq
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Tách reading_vi, hanzi và root_meaning từ mainPart
  // Ví dụ: "**Giang** (江) = sông" hoặc "**Gió** = luồng không khí di chuyển"
  const [leftSide, ...meaningParts] = mainPart.split('=');
  const root_meaning = meaningParts.join('=').trim() || 'Từ tố Hán-Việt';

  const readingMatch = leftSide.match(/\*\*([^*]+)\*\*/);
  const reading_vi = readingMatch ? readingMatch[1].trim() : leftSide.replace(/\(.*\)/, '').trim();

  const hanziMatch = leftSide.match(/\(([^)]+)\)/);
  const hanzi = hanziMatch ? hanziMatch[1].trim() : undefined;

  return {
    reading_vi,
    hanzi,
    root_meaning,
    related_words,
  };
}

/**
 * Đọc và bóc tách file chi tiết: `tu_dien_han_viet_chiet_tu.md`
 * (chứa 44 từ chiết tự chi tiết + 5 câu đố cuối file)
 */
function parseChietTuFile(content: string): {
  detailsMap: Map<string, Omit<ParsedCompound, 'index' | 'quiz_data'>>;
  quizzesMap: Map<string, QuizData>;
} {
  const detailsMap = new Map<string, Omit<ParsedCompound, 'index' | 'quiz_data'>>();
  const quizzesMap = new Map<string, QuizData>();

  // 1. Parse các mục "## Từ XX: ..."
  const sections = content.split(/^## Từ \d+:\s+/m).slice(1);
  for (const section of sections) {
    const lines = section.split(/\r?\n/);
    const headerLine = lines[0]?.trim() || '';
    // Cắt bỏ phần sau nếu dính "## 🧩"
    const cleanSection = section.split(/^## 🧩/m)[0];

    const wordMatch = cleanSection.match(/### 1\. Từ ghép Hán-Việt:\s*\*\*'([^']+)'\*\*/);
    const word = wordMatch ? wordMatch[1].trim() : headerLine;
    const slug = toSlug(word);

    // Nghĩa toàn từ & câu ví dụ
    const meaningBlockMatch = cleanSection.match(/### 2\. Nghĩa toàn từ\s+([\s\S]*?)### 3\./);
    let full_meaning = '';
    let example_sentence = '';
    if (meaningBlockMatch) {
      const block = meaningBlockMatch[1].trim();
      const exMatch = block.match(/Câu ví dụ:\s*\*"([^"]+)"\*/);
      if (exMatch) {
        example_sentence = exMatch[1].trim();
      }
      full_meaning = block
        .replace(/Câu ví dụ:[\s\S]*/, '')
        .trim();
    }

    // Yếu tố 1 & Yếu tố 2
    const parseFactor = (factorNum: 1 | 2): ParsedRoot => {
      const regex = new RegExp(
        `#### Yếu tố ${factorNum}:\\s*\\*\\*'([^']+)'\\*\\*(?:\\s*\\(([^)]+)\\))?[\\s\\S]*?- \\*\\*Âm đọc:\\*\\*\\s*([^\\r\\n]+)[\\s\\S]*?- \\*\\*Nghĩa gốc:\\*\\*\\s*([^\\r\\n]+)[\\s\\S]*?- \\*\\*Từ liên quan:\\*\\*\\s*([^\\r\\n]+)`
      );
      const m = cleanSection.match(regex);
      if (!m) {
        return { reading_vi: '', root_meaning: '', related_words: [] };
      }
      const reading_vi = m[3].trim() || m[1].trim();
      const hanzi = m[2]?.trim();
      const root_meaning = m[4].trim();
      const related_words = m[5]
        .replace(/\*/g, '')
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);
      return { reading_vi, hanzi, root_meaning, related_words };
    };

    const root1 = parseFactor(1);
    const root2 = parseFactor(2);

    // Công thức ghép nghĩa
    const formulaMatch = cleanSection.match(/### 4\. Công thức ghép nghĩa\s+>\s*\*\*([^*]+)\*\*/);
    const math_formula = formulaMatch ? formulaMatch[1].trim() : '';

    if (word && root1.reading_vi && root2.reading_vi) {
      detailsMap.set(slug, {
        word,
        slug,
        full_meaning,
        example_sentence,
        math_formula,
        grade_level: 7,
        subject_tag: 'SGK',
        root1,
        root2,
      });
    }
  }

  // 2. Parse 5 câu đố ở cuối file `tu_dien_han_viet_chiet_tu.md`
  const quizBlocks = content.split(/### 🎯 Câu đố \d+/m).slice(1);
  for (const qBlock of quizBlocks) {
    const cleanBlock = qBlock.split(/^## 📊/m)[0];
    const qMatch = cleanBlock.match(/❓\s*\*\*(?:Câu hỏi|Hỏi):\*\*\s*([^\r\n]+)/);
    const ansMatch = cleanBlock.match(/(?:✅|📌)\s*\*\*Đáp án:\*\*\s*\*\*([^*]+)\*\*/);
    const expMatch = cleanBlock.match(/💡\s*\*([^*]+)\*/);

    if (qMatch && ansMatch) {
      const rawAns = ansMatch[1].trim(); // Ví dụ: "GIANG SƠN"
      const targetSlug = toSlug(rawAns);
      const questionText = qMatch[1].trim();
      const explanation = expMatch ? expMatch[1].trim() : `Ghép nghĩa hình vị tạo thành từ ${rawAns}.`;

      // Tạo 4 lựa chọn trắc nghiệm theo chuẩn QuizData
      const distractors = ['Quốc gia', 'Độc lập', 'Hoà bình', 'Văn hiến', 'Kiên cường'].filter(
        (d) => toSlug(d) !== targetSlug
      );
      const displayAns =
        rawAns.charAt(0).toUpperCase() + rawAns.slice(1).toLowerCase();

      quizzesMap.set(targetSlug, {
        question: questionText,
        options: [
          { text: displayAns, is_correct: true },
          { text: distractors[0], is_correct: false },
          { text: distractors[1], is_correct: false },
          { text: distractors[2], is_correct: false },
        ],
        explanation,
      });
    }
  }

  return { detailsMap, quizzesMap };
}

/**
 * Đọc và bóc tách file 100 từ SGK: `tu_dien_han_viet_co_ban_sgk_100_tu.md` (hoặc `tu_dien_han_viet_co_ban_sgk.md`)
 */
function parseSgk100File(content: string): {
  compounds: Omit<ParsedCompound, 'quiz_data'>[];
  quizzesMap: Map<string, QuizData>;
  extraQuizCompounds: Array<{
    word: string;
    slug: string;
    full_meaning: string;
    example_sentence: string;
    math_formula: string;
    root1: ParsedRoot;
    root2: ParsedRoot;
    quiz_data: QuizData;
  }>;
} {
  const compounds: Omit<ParsedCompound, 'quiz_data'>[] = [];
  const quizzesMap = new Map<string, QuizData>();
  const extraQuizCompounds: Array<{
    word: string;
    slug: string;
    full_meaning: string;
    example_sentence: string;
    math_formula: string;
    root1: ParsedRoot;
    root2: ParsedRoot;
    quiz_data: QuizData;
  }> = [];

  // 1. Parse bảng 100 từ
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    const cols = trimmed
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

    if (cols.length < 6) continue;
    const indexNum = parseInt(cols[0], 10);
    if (isNaN(indexNum)) continue; // Bỏ qua dòng tiêu đề bảng

    // Cột 1: **Giang sơn**
    const word = cols[1].replace(/\*\*/g, '').trim();
    const slug = toSlug(word);

    // Cột 2: Đất nước, Tổ quốc. *Vd: Non sông giang sơn gấm vóc.*
    const col2 = cols[2].trim();
    const vdMatch = col2.match(/\*Vd:\s*([^*]+)\*/i);
    const example_sentence = vdMatch ? vdMatch[1].trim() : `Từ "${word}" thường xuất hiện trong SGK lớp 7.`;
    const full_meaning = col2
      .replace(/\*Vd:[^*]+\*/i, '')
      .replace(/\.\s*$/, '')
      .trim();

    // Cột 3 & 4: Hình vị 1 & 2
    const root1 = parseTableRootCell(cols[3]);
    const root2 = parseTableRootCell(cols[4]);

    // Cột 5: Công thức ngữ nghĩa
    const math_formula = cols[5].trim();

    compounds.push({
      index: indexNum,
      word,
      slug,
      full_meaning,
      example_sentence,
      math_formula,
      grade_level: 7,
      subject_tag: 'SGK',
      root1,
      root2,
    });
  }

  // 2. Parse 5 câu đố ở cuối file `tu_dien_han_viet_co_ban_sgk_100_tu.md`
  const quizBlocks = content.split(/### 🎯 Câu đố \d+/m).slice(1);
  for (const qBlock of quizBlocks) {
    const cleanBlock = qBlock.split(/^## 📊/m)[0];

    const rootAMatch = cleanBlock.match(/Hình vị A:\s*\*\*"([^"]+)"\*\*\s*\(([^)]+)\)\s*=\s*\*([^*]+)\*/);
    const rootBMatch = cleanBlock.match(/Hình vị B:\s*\*\*"([^"]+)"\*\*\s*\(([^)]+)\)\s*=\s*\*([^*]+)\*/);
    const qMatch = cleanBlock.match(/❓\s*\*\*Hỏi:\*\*\s*([^\r\n]+)/);
    const ansMatch = cleanBlock.match(/📌\s*\*\*Đáp án:\s*([^*]+)\*\*/);
    const formulaLineMatch = cleanBlock.match(/>\s*\*([^*]+)\*/);
    const lqMatches = [...cleanBlock.matchAll(/💡\s*"([^"]+)"\s*còn có(?:\s*trong)?:\s*\*([^*]+)\*/g)];

    if (qMatch && ansMatch) {
      const rawAns = ansMatch[1].trim(); // Ví dụ: "QUỐC KỲ"
      const displayWord = rawAns.charAt(0).toUpperCase() + rawAns.slice(1).toLowerCase();
      const targetSlug = toSlug(displayWord);
      const questionText = qMatch[1].trim();
      const formulaText = formulaLineMatch ? formulaLineMatch[1].trim() : `${displayWord}`;

      const distractors = ['Quốc gia', 'Hải đăng', 'Bất khuất', 'Giang sơn', 'Văn học'].filter(
        (d) => toSlug(d) !== targetSlug
      );

      const quizData: QuizData = {
        question: questionText,
        options: [
          { text: displayWord, is_correct: true },
          { text: distractors[0], is_correct: false },
          { text: distractors[1], is_correct: false },
          { text: distractors[2], is_correct: false },
        ],
        explanation: formulaText,
      };

      quizzesMap.set(targetSlug, quizData);

      // Nếu câu đố có đầy đủ Hình vị A & B, lưu thêm thông tin để gắn hoặc bổ sung
      if (rootAMatch && rootBMatch) {
        const r1Related =
          lqMatches[0]?.[2]
            .replace(/\./g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean) || [];
        const r2Related =
          lqMatches[1]?.[2]
            .replace(/\./g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean) || [];

        extraQuizCompounds.push({
          word: displayWord,
          slug: targetSlug,
          full_meaning: formulaText.split('=')[1]?.trim() || displayWord,
          example_sentence: `Từ "${displayWord}" được ghép từ hình vị ${rootAMatch[1]} và ${rootBMatch[1]}.`,
          math_formula: formulaText.replace('=', '→'),
          root1: {
            reading_vi: rootAMatch[1].trim(),
            hanzi: rootAMatch[2].trim(),
            root_meaning: rootAMatch[3].trim(),
            related_words: r1Related,
          },
          root2: {
            reading_vi: rootBMatch[1].trim(),
            hanzi: rootBMatch[2].trim(),
            root_meaning: rootBMatch[3].trim(),
            related_words: r2Related,
          },
          quiz_data: quizData,
        });
      }
    }
  }

  return { compounds, quizzesMap, extraQuizCompounds };
}

/**
 * Tự động tạo câu đố Quiz chuẩn cho các từ chưa nằm trong 5 câu đố cuối file
 */
function buildDefaultQuiz(
  item: Omit<ParsedCompound, 'quiz_data'>,
  allWords: string[]
): QuizData {
  const distractors = allWords
    .filter((w) => toSlug(w) !== item.slug)
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push('Từ ghép khác');
  }

  return {
    question: `Ghép hình vị "${item.root1.reading_vi}" (${item.root1.root_meaning}) và "${item.root2.reading_vi}" (${item.root2.root_meaning}), ta được từ Hán-Việt nào mang nghĩa: "${item.full_meaning}"?`,
    options: [
      { text: item.word, is_correct: true },
      { text: distractors[0], is_correct: false },
      { text: distractors[1], is_correct: false },
      { text: distractors[2], is_correct: false },
    ],
    explanation: item.math_formula,
  };
}

/**
 * Đọc và hợp nhất dữ liệu từ 2 file markdown trong `./learning_materials/`
 */
export function loadAndParseMaterials(baseDir: string = process.cwd()): ParsedCompound[] {
  const materialsDir = path.resolve(baseDir, 'learning_materials');

  // Hỗ trợ cả tên `tu_dien_han_viet_co_ban_sgk_100_tu.md` và `tu_dien_han_viet_co_ban_sgk.md`
  const sgkFileCandidates = [
    path.join(materialsDir, 'tu_dien_han_viet_co_ban_sgk_100_tu.md'),
    path.join(materialsDir, 'tu_dien_han_viet_co_ban_sgk.md'),
  ];
  const sgkFilePath = sgkFileCandidates.find((p) => fs.existsSync(p));
  if (!sgkFilePath) {
    throw new Error(
      `Không tìm thấy file từ điển 100 từ tại ${materialsDir} (đã tìm: tu_dien_han_viet_co_ban_sgk_100_tu.md / tu_dien_han_viet_co_ban_sgk.md)`
    );
  }

  const chietTuFilePath = path.join(materialsDir, 'tu_dien_han_viet_chiet_tu.md');
  if (!fs.existsSync(chietTuFilePath)) {
    throw new Error(`Không tìm thấy file chiết tự tại: ${chietTuFilePath}`);
  }

  const sgkContent = fs.readFileSync(sgkFilePath, 'utf-8');
  const chietTuContent = fs.readFileSync(chietTuFilePath, 'utf-8');

  const { compounds: sgkList, quizzesMap: sgkQuizzes, extraQuizCompounds } = parseSgk100File(sgkContent);
  const { detailsMap: chietTuDetails, quizzesMap: chietTuQuizzes } = parseChietTuFile(chietTuContent);

  // Ánh xạ 5 câu đố ở cuối file `tu_dien_han_viet_co_ban_sgk` vào các từ tương ứng trong 100 từ
  // (Ví dụ: Câu đố Quốc kỳ -> gắn cho Quốc gia nếu Quốc kỳ không nằm trong 100 từ, hoặc gắn trực tiếp nếu khớp gốc từ)
  const fallbackQuizTargets: Record<string, string> = {
    'quoc-ky': 'quoc-gia',
    'hai-quan': 'hai-dang',
    'bat-cong': 'bat-khuat',
    'son-ha': 'giang-son',
    'van-nhan': 'van-hoc',
  };

  const mergedQuizMap = new Map<string, QuizData>();
  // Ưu tiên 5 câu đố từ file chiết tự (Giang sơn, Bất khuất, Văn minh, Bảo tồn, Phục hưng)
  for (const [slug, q] of chietTuQuizzes.entries()) {
    mergedQuizMap.set(slug, q);
  }
  // Kết hợp thêm 5 câu đố từ file SGK 100 từ
  for (const [slug, q] of sgkQuizzes.entries()) {
    if (sgkList.some((c) => c.slug === slug)) {
      mergedQuizMap.set(slug, q);
    } else if (fallbackQuizTargets[slug] && !mergedQuizMap.has(fallbackQuizTargets[slug])) {
      mergedQuizMap.set(fallbackQuizTargets[slug], q);
    }
  }

  const allWordNames = sgkList.map((c) => c.word);

  // Hợp nhất dữ liệu chi tiết từ `tu_dien_han_viet_chiet_tu.md` vào danh sách 100 từ SGK
  const finalCompounds: ParsedCompound[] = sgkList.map((item) => {
    const detail = chietTuDetails.get(item.slug);
    const mergedItem: Omit<ParsedCompound, 'quiz_data'> = detail
      ? {
          ...item,
          full_meaning: detail.full_meaning || item.full_meaning,
          example_sentence: detail.example_sentence || item.example_sentence,
          math_formula: detail.math_formula || item.math_formula,
          root1: {
            reading_vi: detail.root1.reading_vi || item.root1.reading_vi,
            hanzi: detail.root1.hanzi || item.root1.hanzi,
            root_meaning: detail.root1.root_meaning || item.root1.root_meaning,
            related_words:
              detail.root1.related_words.length > 0
                ? detail.root1.related_words
                : item.root1.related_words,
          },
          root2: {
            reading_vi: detail.root2.reading_vi || item.root2.reading_vi,
            hanzi: detail.root2.hanzi || item.root2.hanzi,
            root_meaning: detail.root2.root_meaning || item.root2.root_meaning,
            related_words:
              detail.root2.related_words.length > 0
                ? detail.root2.related_words
                : item.root2.related_words,
          },
        }
      : item;

    const quiz_data =
      mergedQuizMap.get(item.slug) ||
      buildDefaultQuiz(
        mergedItem,
        allWordNames.filter((w) => w !== item.word)
      );

    return {
      ...mergedItem,
      quiz_data,
    };
  });

  // Trả về đúng 100 từ (đã gắn đầy đủ các câu đố cuối file)
  void extraQuizCompounds;
  return finalCompounds;
}

// ─── SUPABASE SEED EXECUTION ──────────────────────────────────────────────────

async function seedHanViet() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
    console.error('❌ LỖI: Thiếu cấu hình NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }

  console.log('\n🌱 ===== NẠP DỮ LIỆU TỪ ĐIỂN HÁN-VIỆT CHIẾT TỰ (100 TỪ SGK) =====');
  const parsedCompounds = loadAndParseMaterials();
  console.log(`📄 Đã đọc và phân tích thành công ${parsedCompounds.length} từ ghép từ ./learning_materials/`);

  // Tạo client Supabase (ưu tiên SUPABASE_SERVICE_ROLE_KEY)
  let supabase = createClient(supabaseUrl, serviceRoleKey || anonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Kiểm tra kết nối với key hiện tại
  const testQuery = await supabase.from('han_viet_roots').select('id').limit(1);
  if (testQuery.error && (testQuery.error.message?.includes('Unregistered API key') || testQuery.status === 401)) {
    console.error(`❌ LỖI XÁC THỰC SUPABASE (401): Key SUPABASE_SERVICE_ROLE_KEY hiện tại không hợp lệ trên project ${supabaseUrl}.`);
    console.error(`   Chi tiết từ Supabase: "${testQuery.error.message}" (${testQuery.error.hint || ''})`);
    process.exit(1);
  }

  // ── BƯỚC 1: Xử lý bảng `han_viet_roots` (tránh trùng lặp chữ Hán và âm đọc) ──
  console.log('\n1️⃣  Đang đồng bộ bảng `han_viet_roots`...');

  // Lấy toàn bộ các hình vị đã có trong DB
  const { data: existingRoots, error: fetchRootsErr } = await supabase
    .from('han_viet_roots')
    .select('id, hanzi, reading_vi, root_meaning');

  if (fetchRootsErr) {
    console.error('❌ Lỗi khi truy vấn bảng han_viet_roots:', fetchRootsErr.message);
    process.exit(1);
  }

  // Map tra cứu theo reading_vi (lowercase) và theo cặp hanzi+reading_vi
  const rootByReading = new Map<string, { id: string; hanzi?: string | null; reading_vi: string }>();
  for (const r of existingRoots || []) {
    rootByReading.set(r.reading_vi.trim().toLowerCase(), r);
  }

  // Tập hợp các hình vị mới cần thêm từ 100 từ
  const newRootsMap = new Map<string, { hanzi: string | null; reading_vi: string; root_meaning: string }>();
  for (const comp of parsedCompounds) {
    for (const root of [comp.root1, comp.root2]) {
      const key = root.reading_vi.trim().toLowerCase();
      if (!rootByReading.has(key) && !newRootsMap.has(key)) {
        newRootsMap.set(key, {
          hanzi: root.hanzi || null,
          reading_vi: root.reading_vi.trim(),
          root_meaning: root.root_meaning.trim(),
        });
      }
    }
  }

  const newRootsPayload = Array.from(newRootsMap.values());
  if (newRootsPayload.length > 0) {
    const { data: insertedRoots, error: insertRootsErr } = await supabase
      .from('han_viet_roots')
      .upsert(newRootsPayload, { onConflict: 'reading_vi', ignoreDuplicates: false })
      .select('id, hanzi, reading_vi');

    if (insertRootsErr) {
      console.error('❌ Lỗi khi INSERT vào han_viet_roots:', insertRootsErr.message);
      process.exit(1);
    }

    for (const r of insertedRoots || []) {
      rootByReading.set(r.reading_vi.trim().toLowerCase(), r);
    }
    console.log(`   ✅ Đã thêm mới ${insertedRoots?.length ?? 0} hình vị vào han_viet_roots.`);
  } else {
    console.log('   ℹ️ Tất cả hình vị đã tồn tại trong han_viet_roots.');
  }

  // ── BƯỚC 2: UPSERT 100 từ ghép vào `han_viet_compounds` ─────────────────────
  console.log('\n2️⃣  Đang UPSERT 100 từ ghép vào `han_viet_compounds`...');

  const compoundsPayload = parsedCompounds.map((c) => ({
    word: c.word,
    slug: c.slug,
    full_meaning: c.full_meaning,
    example_sentence: c.example_sentence,
    math_formula: c.math_formula,
    subject_tag: c.subject_tag, // 'SGK'
    grade_level: c.grade_level, // 7
    quiz_data: c.quiz_data,
  }));

  const { data: upsertedCompounds, error: upsertCompErr } = await supabase
    .from('han_viet_compounds')
    .upsert(compoundsPayload, { onConflict: 'word', ignoreDuplicates: false })
    .select('id, word, slug');

  if (upsertCompErr) {
    console.error('❌ Lỗi khi UPSERT vào han_viet_compounds:', upsertCompErr.message);
    process.exit(1);
  }

  console.log(`   ✅ Đã UPSERT thành công ${upsertedCompounds?.length ?? 0} từ ghép vào han_viet_compounds.`);

  const compoundIdBySlug = new Map<string, string>();
  for (const c of upsertedCompounds || []) {
    compoundIdBySlug.set(c.slug, c.id);
  }

  // ── BƯỚC 3: Tạo liên kết trong `compound_root_links` ─────────────────────────
  console.log('\n3️⃣  Đang tạo liên kết trong `compound_root_links`...');

  // Lấy các liên kết hiện có để tránh trùng lặp
  const { data: existingLinks, error: fetchLinksErr } = await supabase
    .from('compound_root_links')
    .select('id, compound_id, root_id, position_order');

  if (fetchLinksErr) {
    console.error('❌ Lỗi khi truy vấn compound_root_links:', fetchLinksErr.message);
    process.exit(1);
  }

  const existingLinkKeys = new Set<string>();
  for (const l of existingLinks || []) {
    existingLinkKeys.add(`${l.compound_id}:${l.position_order}`);
  }

  const newLinksPayload: Array<{
    compound_id: string;
    root_id: string;
    position_order: 1 | 2;
    related_words: string[];
  }> = [];

  for (const comp of parsedCompounds) {
    const compoundId = compoundIdBySlug.get(comp.slug);
    if (!compoundId) continue;

    const r1 = rootByReading.get(comp.root1.reading_vi.trim().toLowerCase());
    const r2 = rootByReading.get(comp.root2.reading_vi.trim().toLowerCase());

    if (r1 && !existingLinkKeys.has(`${compoundId}:1`)) {
      newLinksPayload.push({
        compound_id: compoundId,
        root_id: r1.id,
        position_order: 1,
        related_words: comp.root1.related_words,
      });
      existingLinkKeys.add(`${compoundId}:1`);
    }

    if (r2 && !existingLinkKeys.has(`${compoundId}:2`)) {
      newLinksPayload.push({
        compound_id: compoundId,
        root_id: r2.id,
        position_order: 2,
        related_words: comp.root2.related_words,
      });
      existingLinkKeys.add(`${compoundId}:2`);
    }
  }

  if (newLinksPayload.length > 0) {
    const { error: insertLinksErr } = await supabase
      .from('compound_root_links')
      .insert(newLinksPayload);

    if (insertLinksErr) {
      console.error('❌ Lỗi khi INSERT vào compound_root_links:', insertLinksErr.message);
      process.exit(1);
    }
    console.log(`   ✅ Đã tạo mới ${newLinksPayload.length} bản ghi liên kết trong compound_root_links.`);
  } else {
    console.log('   ℹ️ Tất cả bản ghi liên kết trong compound_root_links đã tồn tại.');
  }

  // ── BƯỚC 4: Kiểm tra tổng số bản ghi thực tế trong 3 bảng ───────────────────
  const [rootsCountRes, compoundsCountRes, linksCountRes] = await Promise.all([
    supabase.from('han_viet_roots').select('*', { count: 'exact', head: true }),
    supabase.from('han_viet_compounds').select('*', { count: 'exact', head: true }),
    supabase.from('compound_root_links').select('*', { count: 'exact', head: true }),
  ]);

  console.log('\n📊 ===== BÁO CÁO KẾT QUẢ TRÊN SUPABASE =====');
  console.log(`   • Bảng han_viet_roots      : ${rootsCountRes.count ?? 0} bản ghi`);
  console.log(`   • Bảng han_viet_compounds  : ${compoundsCountRes.count ?? 0} bản ghi`);
  console.log(`   • Bảng compound_root_links : ${linksCountRes.count ?? 0} bản ghi`);
  console.log('============================================\n');
}

// Chạy trực tiếp khi gọi qua CLI
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('seed_han_viet.ts') || process.argv[1].includes('seed_han_viet'));

if (isMain) {
  seedHanViet().catch((err) => {
    console.error('💥 Lỗi thực thi seed_han_viet:', err);
    process.exit(1);
  });
}

