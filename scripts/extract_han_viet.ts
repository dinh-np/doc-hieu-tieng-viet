/**
 * CLI Wrapper cho Agent bóc tách từ Hán-Việt từ bài đọc SGK mới
 * Chạy bằng: npx tsx scripts/extract_han_viet.ts "<nội dung văn bản SGK>"
 */

import { scrapeAndSaveHanVietFromText } from '../src/lib/agents/han_viet_scraper';

export * from '../src/lib/agents/han_viet_scraper';

async function main() {
  const inputArg = process.argv.slice(2).join(' ').trim();
  const sampleText =
    inputArg ||
    `Đới nóng (nhiệt đới) nằm giữa hai chí tuyến Bắc và Nam. Khí hậu nhiệt đới gió mùa có đặc điểm nổi bật là nhiệt độ cao quanh năm và lượng mưa phân bố theo mùa rõ rệt, tạo điều kiện cho hệ sinh thái rừng rậm phát triển đa dạng.`;

  console.log('🤖 [extract_han_viet] Đang phân tích bài đọc SGK bằng Gemini API...');
  const res = await scrapeAndSaveHanVietFromText(sampleText, {
    subjectTag: 'SGK',
    gradeLevel: 7,
    maxWords: 5,
  });

  console.log(`✅ Đã bóc tách ${res.extracted.length} từ ghép Hán-Việt:`);
  res.extracted.forEach((w) => {
    console.log(`   - ${w.word} (${w.root1.hanzi}${w.root2.hanzi}): ${w.math_formula}`);
  });
  console.log(
    `📊 Kết quả lưu vào Supabase: +${res.insertedRootsCount} roots, +${res.upsertedCompoundsCount} compounds, +${res.insertedLinksCount} links.`
  );
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('extract_han_viet.ts') || process.argv[1].includes('extract_han_viet'));

if (isMain) {
  main().catch((err) => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  });
}

