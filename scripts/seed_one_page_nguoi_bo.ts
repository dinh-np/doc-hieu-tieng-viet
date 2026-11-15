import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function nfcDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return value.normalize('NFC') as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => nfcDeep(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = nfcDeep(v);
    }
    return out as T;
  }
  return value;
}

const SLUG = 'phan-tich-nhan-vat-nguoi-bo-vua-nham-mat-vua-mo-cua-so';

const CONTENT_RAW = [
  'Trong tác phẩm "Vừa nhắm mắt vừa mở cửa sổ" của nhà văn Nguyễn Ngọc Thuần, nhân vật người bố hiện lên như một hình tượng mẫu mực về tình phụ tử, kết hợp hài hòa giữa tình yêu thương ấm áp của người cha và sự kiên nhẫn của một người thầy.',
  'Trước hết, người bố có phương pháp giáo dục vừa khoa học vừa tinh tế. Thay vì giảng giải lí thuyết khô khan cho con, bố tự làm cho con một chiếc bình tưới nhỏ và thiết kế những trò chơi rèn luyện giác quan từ việc nhắm mắt sờ hoa, ngửi hương thơm cho đến lắng nghe tiếng bước chân. Thái độ của bố luôn kiên trì và bao dung; khi con đoán sai, bố nhẹ nhàng động viên: "không sao cả, dần dần tôi sẽ nói đúng". Nhờ sự khích lệ ấy, người bố đã rèn luyện cho con một "con mắt thần" để cảm nhận thiên nhiên bằng cả tâm hồn.',
  'Không chỉ vậy, người bố còn là một con người nhân hậu, dũng cảm và ứng xử vô cùng lịch thiệp. Khi nghe thấy tiếng kêu cứu, bố lập tức quẳng chén cơm đang ăn dở, dũng cảm lao mình xuống dòng sông có nước xoáy để cứu sống cậu bé Tí. Đặc biệt, vẻ đẹp nhân cách của bố tỏa sáng qua cách đón nhận những trái ổi mà Tí đem cho; dù ít khi ăn ổi nhưng vì trân trọng tấm lòng đứa trẻ, "bố ăn" và dạy con bài học sâu sắc: "Một món quà bao giờ cũng đẹp. Khi ta nhận hay cho một món quà, ta cũng đẹp lây vì món quà đó". Câu nói giản dị ấy đã chứng minh bố là một người có trái tim nhân ái và luôn biết ơn cuộc sống.',
  'Tóm lại, người bố chính là điểm tựa tinh thần vững chắc, thắp sáng tâm hồn đứa trẻ bằng tình yêu thương và sự thấu hiểu. Nhân vật đã để lại cho em bài học quý giá về lòng biết ơn cha mẹ và cách mở rộng trái tim để đón nhận vẻ đẹp của cuộc đời.',
].join('\n\n');

const articlePayload = nfcDeep({
  title: "Phân tích nhân vật Người Bố — Tác phẩm 'Vừa nhắm mắt vừa mở cửa sổ'",
  slug: SLUG,
  category: 'ngu_van_7',
  target_grade: 7,
  estimated_minutes: 15,
  page_count: 1,
  hero_image_url:
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=1600',
  content_raw: CONTENT_RAW,
  is_published: true,
  structured_data: {
    article_type: 'one_page',
    subject: 'Ngữ văn',
    article_meta: {
      slug: SLUG,
      topic: 'ngu_van_7',
      target_grade: 7,
      word_count: 342,
      estimated_minutes: 15,
      page_count: 1,
    },
    step_0_immersion: {
      hero_image_url:
        'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=1600',
      prediction_prompt:
        "Dựa vào nhan đề 'Phân tích nhân vật Người Bố — Tác phẩm Vừa nhắm mắt vừa mở cửa sổ', con hãy dự đoán: Người bố sẽ dạy con cảm nhận thế giới bằng cách đặc biệt nào và thể hiện tấm lòng nhân hậu qua hành động gì?",
    },
    step_1_think_aloud: {
      paragraphs: [
        {
          id: 'p1',
          actor: 'parent',
          text: 'Trong tác phẩm "Vừa nhắm mắt vừa mở cửa sổ" của nhà văn Nguyễn Ngọc Thuần, nhân vật người bố hiện lên như một hình tượng mẫu mực về tình phụ tử, kết hợp hài hòa giữa tình yêu thương ấm áp của người cha và sự kiên nhẫn của một người thầy.',
          parent_coaching: {
            say_aloud_script:
              'Ngay ở đoạn mở bài, tác giả đã nêu hai từ khóa lớn: "mẫu mực" và "tình phụ tử". Cha thấy người bố vừa mang trái tim yêu thương của người cha, vừa có sự kiên nhẫn của một người thầy.',
            pedagogical_focus: 'Nhận diện luận điểm trung tâm của bài văn phân tích nhân vật.',
          },
        },
        {
          id: 'p2',
          actor: 'student',
          text: 'Trước hết, người bố có phương pháp giáo dục vừa khoa học vừa tinh tế. Thay vì giảng giải lí thuyết khô khan cho con, bố tự làm cho con một chiếc bình tưới nhỏ và thiết kế những trò chơi rèn luyện giác quan từ việc nhắm mắt sờ hoa, ngửi hương thơm cho đến lắng nghe tiếng bước chân. Thái độ của bố luôn kiên trì và bao dung; khi con đoán sai, bố nhẹ nhàng động viên: "không sao cả, dần dần tôi sẽ nói đúng". Nhờ sự khích lệ ấy, người bố đã rèn luyện cho con một "con mắt thần" để cảm nhận thiên nhiên bằng cả tâm hồn.',
          parent_coaching: {
            ask_child_prompt:
              'Con thử tìm xem người bố đã dùng những trò chơi giác quan nào để dạy con, và thái độ của bố ra sao khi con đoán sai?',
            pedagogical_focus: 'Khai thác dẫn chứng về phương pháp giáo dục tinh tế của người bố.',
          },
        },
        {
          id: 'p3',
          actor: 'parent',
          text: 'Không chỉ vậy, người bố còn là một con người nhân hậu, dũng cảm và ứng xử vô cùng lịch thiệp. Khi nghe thấy tiếng kêu cứu, bố lập tức quẳng chén cơm đang ăn dở, dũng cảm lao mình xuống dòng sông có nước xoáy để cứu sống cậu bé Tí. Đặc biệt, vẻ đẹp nhân cách của bố tỏa sáng qua cách đón nhận những trái ổi mà Tí đem cho; dù ít khi ăn ổi nhưng vì trân trọng tấm lòng đứa trẻ, "bố ăn" và dạy con bài học sâu sắc: "Một món quà bao giờ cũng đẹp. Khi ta nhận hay cho một món quà, ta cũng đẹp lây vì món quà đó". Câu nói giản dị ấy đã chứng minh bố là một người có trái tim nhân ái và luôn biết ơn cuộc sống.',
          parent_coaching: {
            say_aloud_script:
              'Chi tiết "bố ăn" trái ổi dù ít khi ăn ổi thật sự rất xúc động. Bố không ăn vì ngon miệng, mà ăn để nâng niu tấm lòng biết ơn của cậu bé Tí.',
            pedagogical_focus: 'Phân tích chiều sâu nhân cách qua chi tiết nghệ thuật tiêu biểu.',
          },
        },
        {
          id: 'p4',
          actor: 'student',
          text: 'Tóm lại, người bố chính là điểm tựa tinh thần vững chắc, thắp sáng tâm hồn đứa trẻ bằng tình yêu thương và sự thấu hiểu. Nhân vật đã để lại cho em bài học quý giá về lòng biết ơn cha mẹ và cách mở rộng trái tim để đón nhận vẻ đẹp của cuộc đời.',
          parent_coaching: {
            ask_child_prompt:
              'Đọc đoạn kết, con thấy hình tượng người bố đã để lại bài học gì sâu sắc nhất cho bản thân mình?',
            pedagogical_focus: 'Tổng kết giá trị nội dung và liên hệ bài học bản thân.',
          },
        },
      ],
    },
    inline_vocabulary: [
      {
        word: 'tình phụ tử',
        compound_slug: 'tinh-phu-tu',
        anchor_text: 'Phụ (cha) + Tử (con) → Tình cảm cha con thiêng liêng, gắn bó.',
      },
      {
        word: 'mẫu mực',
        compound_slug: 'mau-muc',
        anchor_text: 'Mẫu (khuôn mẫu) + Mực (thước đo chuẩn xác) → Tấm gương chuẩn mực, đáng để noi theo.',
      },
      {
        word: 'tinh tế',
        compound_slug: 'tinh-te',
        anchor_text: 'Tinh (tỉ mỉ, sắc sảo) + Tế (nhỏ bé, sâu sắc) → Nhạy cảm, khéo léo trong cách quan sát và ứng xử.',
      },
      {
        word: 'nhân ái',
        compound_slug: 'nhan-ai',
        anchor_text: 'Nhân (lòng thương người) + Ái (yêu mến) → Tấm lòng yêu thương, trân trọng con người và cuộc sống.',
      },
    ],
    keywords: [
      {
        term: 'Tình phụ tử',
        formula: 'Phụ (cha) + Tử (con)',
        meaning: 'Tình cảm cha con thiêng liêng, gắn bó.',
      },
      {
        term: 'Mẫu mực',
        formula: 'Mẫu (khuôn mẫu) + Mực (thước đo chuẩn xác)',
        meaning: 'Tấm gương chuẩn mực, đáng để noi theo.',
      },
      {
        term: 'Tinh tế',
        formula: 'Tinh (tỉ mỉ, sắc sảo) + Tế (nhỏ bé, sâu sắc)',
        meaning: 'Nhạy cảm, khéo léo trong cách quan sát và ứng xử.',
      },
      {
        term: 'Nhân ái',
        formula: 'Nhân (lòng thương người) + Ái (yêu mến)',
        meaning: 'Tấm lòng yêu thương, trân trọng con người và cuộc sống.',
      },
    ],
    step_2_graphic_organizer: {
      type: 'cause_and_effect',
      title: 'Sơ đồ phẩm chất & bài học từ nhân vật Người Bố',
      slots: [
        {
          id: 'slot_1',
          label: 'Phương pháp dạy con khoa học, tinh tế',
          expected_card_id: 'card_1',
        },
        {
          id: 'slot_2',
          label: 'Tấm lòng dũng cảm, cứu người không do dự',
          expected_card_id: 'card_2',
        },
        {
          id: 'slot_3',
          label: 'Ứng xử nhân ái khi nhận quà của cậu bé Tí',
          expected_card_id: 'card_3',
        },
      ],
      cards: [
        {
          id: 'card_1',
          text: 'Thiết kế trò chơi nhắm mắt sờ hoa, ngửi hương, nghe tiếng bước chân',
        },
        {
          id: 'card_2',
          text: 'Quẳng chén cơm đang ăn dở, lao xuống dòng sông nước xoáy cứu Tí',
        },
        {
          id: 'card_3',
          text: 'Dù ít khi ăn ổi vẫn ăn để trân trọng tấm lòng và dạy con vẻ đẹp cho - nhận',
        },
      ],
    },
    step_3_reciprocal_cards: [
      {
        role: 'Predict',
        task: 'Dự đoán xem nếu người bố chỉ giảng giải lí thuyết khô khan, cậu con trai có hình thành được "con mắt thần" cảm nhận thiên nhiên không?',
      },
      {
        role: 'Clarify',
        task: 'Giải thích cụm từ "con mắt thần" và câu nói: "Khi ta nhận hay cho một món quà, ta cũng đẹp lây vì món quà đó".',
      },
      {
        role: 'Question',
        task: 'Đặt một câu hỏi vì sao chi tiết "bố ăn" những trái ổi lại làm nổi bật vẻ đẹp nhân cách của người bố.',
      },
      {
        role: 'Summarize',
        task: 'Tóm tắt 2 phẩm chất nổi bật nhất của nhân vật người bố trong 2 câu ngắn gọn.',
      },
    ],
    step_4_qar_questions: [
      {
        id: 'qar_1',
        level: 'right_there',
        level_name: 'Đọc Thẳng (Right There)',
        color_tag: 'amber-500',
        question:
          'Người bố đã thiết kế những trò chơi gì để rèn luyện giác quan cho con?',
        options: [
          'Đọc thuộc lòng tên các loài hoa trong sách giáo khoa',
          'Nhắm mắt sờ hoa, ngửi hương thơm và lắng nghe tiếng bước chân',
          'Vẽ tranh phong cảnh khu vườn vào mỗi buổi sáng',
          'Tập bơi qua dòng sông nước xoáy cùng cậu bé Tí',
        ],
        correct_index: 1,
        text_anchor: 'Đoạn 2 — Trò chơi rèn luyện giác quan của bố',
      },
      {
        id: 'qar_2',
        level: 'think_and_search',
        level_name: 'Suy Luận (Think & Search)',
        color_tag: 'emerald-500',
        question:
          'Vì sao người bố ít khi ăn ổi nhưng vẫn ăn những trái ổi do cậu bé Tí đem tặng?',
        options: [
          'Vì hôm đó bố đang rất đói sau khi quẳng chén cơm đi cứu người',
          'Vì những trái ổi ở vườn nhà Tí ngọt hơn hẳn ổi ngoài chợ',
          'Vì bố trân trọng tấm lòng biết ơn của đứa trẻ và muốn dạy con bài học về vẻ đẹp của việc cho - nhận',
          'Vì bố sợ cậu bé Tí buồn nên ăn thử một miếng cho có lệ',
        ],
        correct_index: 2,
        text_anchor: 'Đoạn 3 — Chi tiết đón nhận món quà từ cậu bé Tí',
      },
      {
        id: 'qar_3',
        level: 'author_and_me',
        level_name: 'Suy Nghĩ Sâu (Author & Me)',
        color_tag: 'purple-500',
        question:
          'Qua nhân vật người bố, em rút ra bài học gì về cách ứng xử khi nhận một món quà từ người khác?',
        open_ended: true,
        evaluation_criteria:
          'Nêu được thái độ trân trọng tấm lòng của người tặng hơn giá trị vật chất, biết nói lời cảm ơn chân thành và đáp lại bằng sự tử tế.',
      },
    ],
    step_5_screen_to_paper: {
      handwritten_task:
        'Viết một đoạn văn (5–7 câu) chia sẻ cảm nhận của em về chi tiết người bố ăn những trái ổi cậu bé Tí tặng, và kể lại một lần em nhận hoặc tặng một món quà ý nghĩa.',
      offline_books: [
        {
          title: 'Vừa nhắm mắt vừa mở cửa sổ',
          author: 'Nguyễn Ngọc Thuần',
          publisher: 'NXB Trẻ',
          highlight:
            'Tập truyện thiếu nhi trong trẻo giúp nuôi dưỡng khả năng cảm nhận thế giới bằng cả trái tim và năm giác quan.',
        },
      ],
    },
  },
});

async function main() {
  console.log(`🚀 Đang upsert bài đọc 1 trang "${SLUG}" vào public.one_page_articles...`);

  const { data, error } = await supabase
    .from('one_page_articles')
    .upsert(articlePayload, { onConflict: 'slug' })
    .select('id, title, slug, category, target_grade, estimated_minutes, is_published')
    .single();

  if (error) {
    console.error('❌ Lỗi khi upsert vào one_page_articles:', error);
    process.exit(1);
  }

  console.log('✅ Upsert thành công:', data);
}

main().catch((err) => {
  console.error('❌ Lỗi không mong đợi:', err);
  process.exit(1);
});
