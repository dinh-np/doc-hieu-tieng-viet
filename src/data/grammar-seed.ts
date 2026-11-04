/**
 * DỮ LIỆU HẠT GIỐNG & DỰ PHÒNG CHO MODULE NGỮ PHÁP TIẾNG VIỆT TƯƠNG TÁC (/grammar)
 * Thiết kế theo lộ trình 4 cấp độ dựa trên nghiên cứu của:
 *   - Nguyễn Hiến Lê & Trương Văn Chình (Khảo luận về Ngữ pháp Việt Nam)
 *   - GS. Diệp Quang Ban (Ngữ pháp Tiếng Việt - Cấu trúc Đề-Thuyết & Vị từ làm đỉnh)
 *   - Ngữ liệu trích từ SGK Lớp 7 (Ngữ văn, Lịch sử và Địa lí)
 */

export type GrammarLessonCategory =
  | 'sentence_core'
  | 'topic_comment'
  | 'sentence_slicing'
  | 'connectors_logic';

export type GrammarInteractiveType =
  | 'pick_core'
  | 'slice_slash'
  | 'drag_logic_arrow';

export interface PickCorePayload {
  /** Danh sách các cụm từ (tokens) cấu thành câu gốc */
  tokens: string[];
  /** Chỉ số (index) của các token đóng vai trò Chủ ngữ / Chủ từ (Ai? Cái gì?) */
  subject_indices: number[];
  /** Chỉ số (index) của các token đóng vai trò Vị ngữ / Vị từ trung tâm (Làm gì? Thế nào?) */
  predicate_indices: number[];
  /** Nhãn phân vai phụ cho từng token để giải thích khi bấm "Lọc Xương" */
  token_roles?: string[];
  /** Câu rút gọn sau khi lọc bỏ hết thành phần phụ râu ria */
  core_summary: string;
}

export interface SliceSlashPayload {
  /** Danh sách các cụm từ (tokens) để người học đặt nhát cắt `/` vào khe giữa 2 token */
  tokens: string[];
  /**
   * Vị trí đặt nhát cắt đúng: chỉ số `i` nghĩa là cắt ngay SAU `tokens[i]`
   * (tức là khe giữa `tokens[i]` và `tokens[i + 1]`)
   */
  slash_after_indices: number[];
  /** Các câu đơn ngắn gọn thu được sau khi phẫu thuật tách câu */
  sliced_clauses: {
    label: string;
    text: string;
    role_hint: string;
  }[];
}

export interface DragLogicArrowPayload {
  /** Loại quan hệ logic */
  relation_type: 'cause_effect' | 'contrast' | 'condition_result' | 'purpose';
  /** Nhãn hiển thị trên sơ đồ mũi tên (VD: "NHÂN ➔ QUẢ", "NHƯỢNG BỘ ⚡ ĐỐI LẬP") */
  arrow_label: string;
  /** Cặp từ nối đúng cần chọn */
  correct_connector: string;
  /** Các phương án cặp từ nối để lựa chọn */
  connector_options: string[];
  /** Các mảnh vế câu đã xáo trộn để học sinh lắp vào [Vế A] và [Vế B] */
  clause_pool: {
    id: string;
    text: string;
    tag: string;
  }[];
  /** ID của vế đứng trước mũi tên (Vế A: Nguyên nhân / Nhượng bộ / Điều kiện) */
  correct_clause_a_id: string;
  /** ID của vế đứng sau mũi tên (Vế B: Kết quả / Mệnh đề chính) */
  correct_clause_b_id: string;
  /** Tóm tắt công thức logic sau phẫu thuật */
  logic_formula: string;
}

export type GrammarExercisePayload =
  | PickCorePayload
  | SliceSlashPayload
  | DragLogicArrowPayload;

export interface GrammarExercise {
  id: string;
  level_order: number; // 1: Khung xương, 2: Đề-Thuyết, 3: Cắt câu/Logic, 4: Từ vị
  lesson_category: GrammarLessonCategory;
  title: string;
  rule_explanation: string;
  english_anchor: string;
  original_sentence: string;
  interactive_type: GrammarInteractiveType;
  exercise_payload: GrammarExercisePayload;
  explanation_after: string;
  source_reference: string;
  grade_level: number;
  created_at?: string;
}

export const GRAMMAR_SEED_DATA: GrammarExercise[] = [
  // ===========================================================================
  // LEVEL 1: KHUNG XƯƠNG CÂU (sentence_core / pick_core) — 10 BÀI TẬP SGK LỚP 7
  // ===========================================================================
  {
    id: 'a1000001-0000-4000-8000-000000000001',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 1: Chiến thắng Bạch Đằng năm 938',
    rule_explanation:
      'Bật mí cho con: Câu lịch sử thường mở đầu bằng thời gian, địa điểm dài dòng. Con hãy gạt phần "Năm..., trên sông..." sang một bên để tìm ngay [Ai?] và [Làm gì?].',
    english_anchor: '🇬🇧 Core: [Subject: Ngô Quyền] + [Verb: defeated the Southern Han army]',
    original_sentence:
      'Năm 938, trên sông Bạch Đằng lịch sử, Ngô Quyền đã đánh tan quân xâm lược Nam Hán bằng trận địa cọc ngầm.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Năm 938,',
        'trên sông Bạch Đằng lịch sử,',
        'Ngô Quyền',
        'đã đánh tan quân xâm lược Nam Hán',
        'bằng trận địa cọc ngầm.',
      ],
      subject_indices: [2],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ chỉ thời gian (When)',
        'Trạng ngữ chỉ nơi chốn (Where)',
        'Chủ ngữ / Chủ từ (Subject)',
        'Vị ngữ / Cụm vị từ trung tâm (Verb + Object)',
        'Bổ ngữ phương tiện (By what means)',
      ],
      core_summary: 'Ngô Quyền (Chủ từ) ➔ đã đánh tan quân xâm lược Nam Hán (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Tuyệt vời! Khi lọc bỏ trạng ngữ thời gian ("Năm 938"), địa điểm ("trên sông Bạch Đằng") và phương tiện ("bằng trận địa cọc ngầm"), khung xương câu hiện ra cực gọn: "Ngô Quyền đã đánh tan quân xâm lược Nam Hán".',
    source_reference: 'SGK Lịch sử 7 & Nguyễn Hiến Lê (Chủ từ - Thuật từ)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000002',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 2: Phù sa sông Mê Công (Địa lí 7)',
    rule_explanation:
      'Bật mí cho con: Nhiều khi Chủ ngữ đứng sau một cụm chỉ thời gian và bị kẹp thêm cụm miêu tả dài. Hãy hỏi: "Cái gì thực hiện hành động bồi đắp?"',
    english_anchor: '🇬🇧 Core: [Subject: The Mekong River] + [Verb: deposits fertile silt]',
    original_sentence:
      'Hằng năm, vào mùa nước nổi, dòng sông Mê Công hùng vĩ lại bồi đắp phù sa màu mỡ cho những cánh đồng châu thổ.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Hằng năm,',
        'vào mùa nước nổi,',
        'dòng sông Mê Công',
        'hùng vĩ',
        'lại bồi đắp phù sa màu mỡ',
        'cho những cánh đồng châu thổ.',
      ],
      subject_indices: [2],
      predicate_indices: [4],
      token_roles: [
        'Trạng ngữ tần suất (Frequency)',
        'Trạng ngữ thời gian (Time)',
        'Chủ ngữ cốt lõi (Subject)',
        'Định ngữ miêu tả (Adjective modifier)',
        'Vị ngữ / Vị từ trung tâm (Core Predicate)',
        'Bổ ngữ đối tượng nhận (Recipient)',
      ],
      core_summary: 'Dòng sông Mê Công (Chủ từ) ➔ bồi đắp phù sa màu mỡ (Vị từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Chính xác! "Hùng vĩ" chỉ là tính từ tô điểm cho dòng sông. Bộ khung xương thực sự chỉ là: "Dòng sông Mê Công + lại bồi đắp phù sa màu mỡ".',
    source_reference: 'SGK Lịch sử & Địa lí 7 - Diệp Quang Ban (Vị từ làm đỉnh)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000003',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 3: Chim sơn ca trong nắng sớm (Ngữ văn 7)',
    rule_explanation:
      'Bật mí cho con: Trong văn miêu tả, tác giả hay thêm rất nhiều cụm từ chỉ không gian ở đầu và cuối câu. Con chỉ cần nhặt ra nhân vật chính và hoạt động chính!',
    english_anchor: '🇬🇧 Core: [Subject: The larks] + [Verb: sing melodiously]',
    original_sentence:
      'Giữa cánh đồng lúa chín vàng óng ả buổi bình minh, những chú chim sơn ca nhỏ nhắn cất tiếng hót líu lo vang vọng khắp bầu trời.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Giữa cánh đồng lúa chín vàng óng ả',
        'buổi bình minh,',
        'những chú chim sơn ca',
        'nhỏ nhắn',
        'cất tiếng hót líu lo',
        'vang vọng khắp bầu trời.',
      ],
      subject_indices: [2],
      predicate_indices: [4],
      token_roles: [
        'Trạng ngữ nơi chốn (Place)',
        'Trạng ngữ thời gian (Time)',
        'Chủ ngữ cốt lõi (Subject)',
        'Định ngữ miêu tả (Modifier)',
        'Vị ngữ hành động (Core Verb Phrase)',
        'Bổ ngữ mở rộng kết quả (Extension)',
      ],
      core_summary: 'Những chú chim sơn ca (Chủ từ) ➔ cất tiếng hót líu lo (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Chuẩn xác! Câu văn dài 25 chữ nhưng khi lọc xương chỉ còn 9 chữ cốt lõi: "Những chú chim sơn ca cất tiếng hót líu lo".',
    source_reference: 'SGK Ngữ văn 7 (Mở rộng thành phần chính bằng cụm từ)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000004',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 4: Rừng mưa nhiệt đới Amazon (Địa lí 7)',
    rule_explanation:
      'Bật mí cho con: Khi câu dùng từ "là" hoặc "được coi là", vị ngữ chính là cụm định danh ngay sau đó. Đừng bị đánh lừa bởi cụm giải thích trong ngoặc hoặc sau dấu phẩy!',
    english_anchor: '🇬🇧 Core: [Subject: The Amazon rainforest] + [Linking Verb: is the green lung of the Earth]',
    original_sentence:
      'Với diện tích rộng hơn năm triệu ki-lô-mét vuông, rừng mưa nhiệt đới Amazon ở Nam Mỹ được mệnh danh là lá phổi xanh của Trái Đất.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Với diện tích rộng hơn năm triệu ki-lô-mét vuông,',
        'rừng mưa nhiệt đới Amazon',
        'ở Nam Mỹ',
        'được mệnh danh là lá phổi xanh của Trái Đất.',
      ],
      subject_indices: [1],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ đặc điểm (With-phrase)',
        'Chủ ngữ cốt lõi (Subject)',
        'Định ngữ chỉ vị trí (Location modifier)',
        'Vị ngữ trung tâm (Passive Predicate)',
      ],
      core_summary: 'Rừng mưa nhiệt đới Amazon (Chủ từ) ➔ được mệnh danh là lá phổi xanh của Trái Đất (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Quá giỏi! Cụm "Với diện tích..." và "ở Nam Mỹ" chỉ bổ sung thông tin phụ. Khung xương câu là: "Rừng mưa nhiệt đới Amazon được mệnh danh là lá phổi xanh của Trái Đất".',
    source_reference: 'SGK Lịch sử & Địa lí 7 (Châu Mỹ)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000005',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 5: Hào khí Đông A thời Trần (Lịch sử 7)',
    rule_explanation:
      'Bật mí cho con: Chủ ngữ trong tiếng Việt có thể là cả một cụm danh từ chỉ con người ("quân và dân nhà Trần"). Hãy tìm xem họ đã thực hiện hành động vĩ đại gì!',
    english_anchor: '🇬🇧 Core: [Subject: The Tran army and people] + [Verb: defeated the Mongol invaders three times]',
    original_sentence:
      'Trong thế kỷ XIII, bằng tinh thần đoàn kết "Sát Thát", quân và dân nhà Trần đã ba lần đánh bại đế quốc Mông - Nguyên hùng mạnh.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Trong thế kỷ XIII,',
        'bằng tinh thần đoàn kết "Sát Thát",',
        'quân và dân nhà Trần',
        'đã ba lần đánh bại đế quốc Mông - Nguyên',
        'hùng mạnh.',
      ],
      subject_indices: [2],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ thời gian (Time)',
        'Trạng ngữ phương tiện/cách thức (Manner)',
        'Chủ ngữ ghép (Compound Subject)',
        'Vị ngữ trung tâm (Verb + Object)',
        'Định ngữ phụ cho tân ngữ (Adjective)',
      ],
      core_summary: 'Quân và dân nhà Trần (Chủ từ) ➔ đã ba lần đánh bại đế quốc Mông - Nguyên (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Xuất sắc! Bỏ qua thời gian ("Trong thế kỷ XIII") và cách thức ("bằng tinh thần..."), ta nắm trọn thông điệp lịch sử: "Quân và dân nhà Trần đã ba lần đánh bại đế quốc Mông - Nguyên".',
    source_reference: 'SGK Lịch sử 7 (Ba lần kháng chiến chống quân Mông - Nguyên)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000006',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 6: Hương hoa sầu riêng (Ngữ văn 7 - Mai Văn Tạo)',
    rule_explanation:
      'Bật mí cho con: Vị ngữ không phải lúc nào cũng là hành động chạy nhảy (Action Verb), mà có thể là trạng thái lan tỏa hoặc tính chất (State/Sensory Verb)!',
    english_anchor: '🇬🇧 Core: [Subject: The aroma of ripe durian] + [Verb: wafts richly through the garden]',
    original_sentence:
      'Vào mùa trái chín rộ, hương sầu riêng nồng nàn quyến rũ cứ ngào ngạt tỏa khắp khu vườn miền Tây Nam Bộ.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Vào mùa trái chín rộ,',
        'hương sầu riêng',
        'nồng nàn quyến rũ',
        'cứ ngào ngạt tỏa khắp khu vườn',
        'miền Tây Nam Bộ.',
      ],
      subject_indices: [1],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ thời gian (When)',
        'Chủ ngữ cốt lõi (Subject)',
        'Định ngữ miêu tả (Adjective phrase)',
        'Vị ngữ trung tâm (Core Predicate)',
        'Định ngữ chỉ địa danh (Place modifier)',
      ],
      core_summary: 'Hương sầu riêng (Chủ từ) ➔ cứ ngào ngạt tỏa khắp khu vườn (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Đúng rồi! "Nồng nàn quyến rũ" chỉ là cụm tính từ bổ nghĩa cho "hương sầu riêng". Vị ngữ chính diễn tả hoạt động của hương thơm là "cứ ngào ngạt tỏa khắp khu vườn".',
    source_reference: 'SGK Ngữ văn 7 & Nguyễn Hiến Lê (Thuật từ trạng thái)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000007',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 7: Khí hậu hoang mạc Sahara (Địa lí 7)',
    rule_explanation:
      'Bật mí cho con: Theo GS. Diệp Quang Ban, tính từ như "khô hạn và khắc nghiệt" hoàn toàn làm Vị từ trung tâm (Vị ngữ) trong tiếng Việt mà không cần động từ "to be" như tiếng Anh!',
    english_anchor: '🇬🇧 Core: [Subject: The climate of the Sahara] + [Adjective Predicate: (is) extremely arid and harsh]',
    original_sentence:
      'Do nằm dọc theo đường chí tuyến Bắc, khí hậu của hoang mạc Sahara quanh năm vô cùng khô hạn và khắc nghiệt.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Do nằm dọc theo đường chí tuyến Bắc,',
        'khí hậu của hoang mạc Sahara',
        'quanh năm',
        'vô cùng khô hạn và khắc nghiệt.',
      ],
      subject_indices: [1],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ chỉ nguyên nhân (Reason)',
        'Chủ ngữ cốt lõi (Subject)',
        'Trạng ngữ thời gian (Time)',
        'Vị ngữ tính từ (Adjectival Predicate)',
      ],
      core_summary: 'Khí hậu của hoang mạc Sahara (Chủ từ) ➔ vô cùng khô hạn và khắc nghiệt (Vị từ tính chất)',
    } satisfies PickCorePayload,
    explanation_after:
      'Rất sắc bén! Khác với tiếng Anh phải có "is" (is arid), trong tiếng Việt cụm tính từ "vô cùng khô hạn và khắc nghiệt" trực tiếp làm Vị ngữ chính của câu!',
    source_reference: 'SGK Địa lí 7 (Châu Phi) & Diệp Quang Ban (Vị từ tính chất)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000008',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 8: Tiếng gà trưa của bà (Ngữ văn 7 - Xuân Quỳnh)',
    rule_explanation:
      'Bật mí cho con: Khi Chủ ngữ là một âm thanh ("tiếng gà trưa"), hãy xem âm thanh đó tác động gì đến tâm hồn nhân vật!',
    english_anchor: '🇬🇧 Core: [Subject: The midday rooster crow] + [Verb: awakened childhood memories]',
    original_sentence:
      'Trên đường hành quân xa xôi, tiếng gà trưa xao xác bên xóm nhỏ đã đánh thức bao kỷ niệm tuổi thơ êm đềm bên bà.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Trên đường hành quân xa xôi,',
        'tiếng gà trưa',
        'xao xác bên xóm nhỏ',
        'đã đánh thức bao kỷ niệm tuổi thơ',
        'êm đềm bên bà.',
      ],
      subject_indices: [1],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ hoàn cảnh (Setting)',
        'Chủ ngữ cốt lõi (Subject)',
        'Định ngữ miêu tả âm thanh (Modifier)',
        'Vị ngữ trung tâm (Core Verb + Object)',
        'Định ngữ bổ nghĩa cho kỷ niệm (Modifier)',
      ],
      core_summary: 'Tiếng gà trưa (Chủ từ) ➔ đã đánh thức bao kỷ niệm tuổi thơ (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Chính xác! "Xao xác bên xóm nhỏ" chỉ miêu tả thêm cho tiếng gà. Khung xương cốt lõi là: "Tiếng gà trưa + đã đánh thức bao kỷ niệm tuổi thơ".',
    source_reference: 'SGK Ngữ văn 7 (Bài thơ Tiếng gà trưa)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000009',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 9: Quốc Tử Giám - Trường đại học đầu tiên (Lịch sử 7)',
    rule_explanation:
      'Bật mí cho con: Đừng để các mốc năm tháng và danh hiệu dài dòng làm rối mắt. Hãy tìm Chủ thể (Ai?) và Động từ hành động chính (Làm gì?)!',
    english_anchor: '🇬🇧 Core: [Subject: The Ly Dynasty] + [Verb: established Quoc Tu Giam]',
    original_sentence:
      'Năm 1076, tại kinh thành Thăng Long, triều đại nhà Lý đã cho xây dựng Quốc Tử Giám để đào tạo nhân tài cho đất nước.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Năm 1076,',
        'tại kinh thành Thăng Long,',
        'triều đại nhà Lý',
        'đã cho xây dựng Quốc Tử Giám',
        'để đào tạo nhân tài cho đất nước.',
      ],
      subject_indices: [2],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ thời gian (When)',
        'Trạng ngữ địa điểm (Where)',
        'Chủ ngữ cốt lõi (Subject)',
        'Vị ngữ hành động (Core Predicate)',
        'Trạng ngữ chỉ mục đích (Purpose - in order to)',
      ],
      core_summary: 'Triều đại nhà Lý (Chủ từ) ➔ đã cho xây dựng Quốc Tử Giám (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Tuyệt vời! Cụm "để đào tạo nhân tài..." là trạng ngữ chỉ mục đích (giống "in order to..." trong tiếng Anh). Nòng cốt câu là: "Triều đại nhà Lý đã cho xây dựng Quốc Tử Giám".',
    source_reference: 'SGK Lịch sử 7 (Văn hóa giáo dục thời Lý)',
    grade_level: 7,
  },
  {
    id: 'a1000001-0000-4000-8000-000000000010',
    level_order: 1,
    lesson_category: 'sentence_core',
    title: 'Bài 10: Hiện tượng quang hợp ở cây xanh (KHTN 7)',
    rule_explanation:
      'Bật mí cho con: Trong câu khoa học, các yếu tố "Nhờ ánh sáng mặt trời và chất diệp lục" là điều kiện hỗ trợ. Hãy tìm bộ phận nào của cây trực tiếp thực hiện phản ứng!',
    english_anchor: '🇬🇧 Core: [Subject: Green leaves] + [Verb: synthesize organic matter and release oxygen]',
    original_sentence:
      'Nhờ có ánh sáng mặt trời và chất diệp lục, lá cây xanh tổng hợp chất hữu cơ và giải phóng khí ô-xi ra môi trường.',
    interactive_type: 'pick_core',
    exercise_payload: {
      tokens: [
        'Nhờ có ánh sáng mặt trời',
        'và chất diệp lục,',
        'lá cây xanh',
        'tổng hợp chất hữu cơ và giải phóng khí ô-xi',
        'ra môi trường.',
      ],
      subject_indices: [2],
      predicate_indices: [3],
      token_roles: [
        'Trạng ngữ điều kiện 1 (Thanks to...)',
        'Trạng ngữ điều kiện 2',
        'Chủ ngữ cốt lõi (Subject)',
        'Vị ngữ ghép (Compound Verb Phrase)',
        'Bổ ngữ chỉ hướng (Direction)',
      ],
      core_summary: 'Lá cây xanh (Chủ từ) ➔ tổng hợp chất hữu cơ và giải phóng khí ô-xi (Thuật từ)',
    } satisfies PickCorePayload,
    explanation_after:
      'Hoàn hảo! Con đã nắm vững kỹ thuật Lọc Xương Câu: gạt bỏ trạng ngữ điều kiện ở đầu để thấy ngay chủ thể khoa học "Lá cây xanh + tổng hợp chất hữu cơ và giải phóng khí ô-xi".',
    source_reference: 'SGK Khoa học tự nhiên 7 (Trao đổi chất ở sinh vật)',
    grade_level: 7,
  },

  // ===========================================================================
  // LEVEL 2: DAO MỔ TÁCH CÂU (sentence_slicing / slice_slash) — BÀI TẬP CẮT CÂU GHÉP
  // ===========================================================================
  {
    id: 'a3000001-0000-4000-8000-000000000011',
    level_order: 2,
    lesson_category: 'sentence_slicing',
    title: 'Dao Mổ 1: Cảnh mùa xuân vùng cao (Ngữ văn 7)',
    rule_explanation:
      'Bật mí cho con: Khi gặp câu văn dài tả nhiều sự vật cùng lúc (mưa, hoa, chim...), con hãy cầm "Dao Mổ" cắt ngay tại ranh giới giữa các cụm [Chủ ngữ - Vị ngữ] độc lập!',
    english_anchor: '🇬🇧 Clause Slicing: [Clause 1: S1 + V1] / [Clause 2: S2 + V2] / [Clause 3: S3 + V3]',
    original_sentence:
      'Mưa xuân lất phất bay trên các sườn đồi, hoa đào rừng bung nở hồng rực rỡ và từng đàn chim én chao liệng giữa bầu trời ấm áp.',
    interactive_type: 'slice_slash',
    exercise_payload: {
      tokens: [
        'Mưa xuân',
        'lất phất bay trên các sườn đồi,',
        'hoa đào rừng',
        'bung nở hồng rực rỡ',
        'và từng đàn chim én',
        'chao liệng giữa bầu trời ấm áp.',
      ],
      slash_after_indices: [1, 3],
      sliced_clauses: [
        {
          label: 'Vế 1 (Cảnh mưa)',
          text: 'Mưa xuân (CN1) lất phất bay trên các sườn đồi (VN1).',
          role_hint: 'Chủ thể 1: Mưa xuân',
        },
        {
          label: 'Vế 2 (Cảnh hoa)',
          text: 'Hoa đào rừng (CN2) bung nở hồng rực rỡ (VN2).',
          role_hint: 'Chủ thể 2: Hoa đào rừng',
        },
        {
          label: 'Vế 3 (Cảnh chim)',
          text: 'Và từng đàn chim én (CN3) chao liệng giữa bầu trời ấm áp (VN3).',
          role_hint: 'Chủ thể 3: Từng đàn chim én',
        },
      ],
    } satisfies SliceSlashPayload,
    explanation_after:
      'Hai nhát cắt cực kỳ chuẩn xác! Câu ghép dài 26 chữ đã được tách thành 3 bức tranh nhỏ độc lập: (1) Mưa xuân bay / (2) Hoa đào nở / (3) Chim én chao liệng.',
    source_reference: 'SGK Ngữ văn 7 & Nguyễn Hiến Lê (Phân tích mệnh đề câu ghép đẳng lập)',
    grade_level: 7,
  },
  {
    id: 'a3000001-0000-4000-8000-000000000012',
    level_order: 2,
    lesson_category: 'sentence_slicing',
    title: 'Dao Mổ 2: Kháng chiến chống Tống trên sông Như Nguyệt (Lịch sử 7)',
    rule_explanation:
      'Bật mí cho con: Câu lịch sử dài thường ghép vế [Nguyên nhân / Bối cảnh] với vế [Hành động quyết định] và [Kết quả]. Hãy tìm ranh giới trước từ "nên" hoặc dấu phẩy ngăn cách hai vế chủ-vị!',
    english_anchor: '🇬🇧 Clause Slicing: [Obstacle Clause] / [Action Clause] / [Outcome Clause]',
    original_sentence:
      'Quân Tống nhiều lần tìm cách vượt phòng tuyến sông Như Nguyệt nhưng Lý Thường Kiệt đã chủ động cho quân tập kích trong đêm nên thế giặc nhanh chóng tan rã.',
    interactive_type: 'slice_slash',
    exercise_payload: {
      tokens: [
        'Quân Tống',
        'nhiều lần tìm cách vượt phòng tuyến sông Như Nguyệt',
        'nhưng Lý Thường Kiệt',
        'đã chủ động cho quân tập kích trong đêm',
        'nên thế giặc',
        'nhanh chóng tan rã.',
      ],
      slash_after_indices: [1, 3],
      sliced_clauses: [
        {
          label: 'Vế 1 (Âm mưu của giặc)',
          text: 'Quân Tống (CN1) nhiều lần tìm cách vượt phòng tuyến sông Như Nguyệt (VN1).',
          role_hint: 'Mệnh đề đối lập (Trước "nhưng")',
        },
        {
          label: 'Vế 2 (Đối sách của ta)',
          text: 'Nhưng Lý Thường Kiệt (CN2) đã chủ động cho quân tập kích trong đêm (VN2).',
          role_hint: 'Mệnh đề chuyển ý & nguyên nhân',
        },
        {
          label: 'Vế 3 (Kết cục trận đánh)',
          text: 'Nên thế giặc (CN3) nhanh chóng tan rã (VN3).',
          role_hint: 'Mệnh đề hệ quả (Sau "nên")',
        },
      ],
    } satisfies SliceSlashPayload,
    explanation_after:
      'Tuyệt đỉnh! Chỉ với 2 nhát cắt ngay trước liên từ "nhưng" và "nên", một câu lịch sử phức tạp đã biến thành sơ đồ 3 bước rõ ràng: Giặc tấn công ➔ Lý Thường Kiệt phản kích ➔ Thế giặc tan rã.',
    source_reference: 'SGK Lịch sử 7 (Cuộc kháng chiến chống Tống 1075 - 1077)',
    grade_level: 7,
  },
  {
    id: 'a3000001-0000-4000-8000-000000000013',
    level_order: 2,
    lesson_category: 'sentence_slicing',
    title: 'Dao Mổ 3: Sự phân hóa thiên nhiên châu Âu (Địa lí 7)',
    rule_explanation:
      'Bật mí cho con: Khi câu Địa lí so sánh hai miền (Tây Âu vs Đông Âu), mỗi miền là một vế câu có Chủ ngữ - Vị ngữ riêng. Hãy đặt nhát cắt ngay giữa hai miền!',
    english_anchor: '🇬🇧 Clause Slicing: [Region A: Western Europe...] / [while Region B: Eastern Europe...]',
    original_sentence:
      'Khu vực Tây Âu chịu ảnh hưởng mạnh của dòng biển nóng Bắc Đại Tây Dương nên khí hậu ấm ẩm mưa nhiều, còn khu vực Đông Âu nằm sâu trong nội địa nên mùa đông lạnh giá kéo dài.',
    interactive_type: 'slice_slash',
    exercise_payload: {
      tokens: [
        'Khu vực Tây Âu',
        'chịu ảnh hưởng mạnh của dòng biển nóng Bắc Đại Tây Dương',
        'nên khí hậu ấm ẩm mưa nhiều,',
        'còn khu vực Đông Âu',
        'nằm sâu trong nội địa',
        'nên mùa đông lạnh giá kéo dài.',
      ],
      slash_after_indices: [2],
      sliced_clauses: [
        {
          label: 'Vế A (Đặc điểm Tây Âu)',
          text: 'Khu vực Tây Âu chịu ảnh hưởng mạnh của dòng biển nóng Bắc Đại Tây Dương nên khí hậu ấm ẩm mưa nhiều.',
          role_hint: 'Nhánh 1: Tây Âu (Gần biển ➔ Ấm ẩm)',
        },
        {
          label: 'Vế B (Đặc điểm Đông Âu)',
          text: 'Còn khu vực Đông Âu nằm sâu trong nội địa nên mùa đông lạnh giá kéo dài.',
          role_hint: 'Nhánh 2: Đông Âu (Trong nội địa ➔ Lạnh giá)',
        },
      ],
    } satisfies SliceSlashPayload,
    explanation_after:
      'Rất chuẩn! Nhát cắt ngay trước từ "còn" giúp tách câu dài thành bảng đối chiếu 2 vế rõ rệt: (1) Tây Âu ấm ẩm vs. (2) Đông Âu lạnh giá.',
    source_reference: 'SGK Địa lí 7 (Thiên nhiên châu Âu) & Diệp Quang Ban',
    grade_level: 7,
  },

  // ===========================================================================
  // LEVEL 3B: MŨI TÊN LOGIC (connectors_logic / drag_logic_arrow) — CẶP TỪ NỐI
  // ===========================================================================
  {
    id: 'a3000001-0000-4000-8000-000000000014',
    level_order: 3,
    lesson_category: 'connectors_logic',
    title: 'Mũi Tên Logic 1: Nguyên nhân - Kết quả (Địa lí 7)',
    rule_explanation:
      'Bật mí cho con: Cứ thấy cặp từ "Vì / Do / Nhờ... nên..." là trong đầu con vẽ ngay một mũi tên Nhân ➔ Quả (Cause ➔ Effect). Vế đứng sau "Nhờ/Vì" là Nguyên nhân, vế đứng sau "nên" là Kết quả!',
    english_anchor: '🇬🇧 Logic: Because / Thanks to [Cause A] ➔ Therefore [Result B]',
    original_sentence:
      'Nhờ có dòng biển nóng Bắc Đại Tây Dương chảy sát bờ nên các cảng biển ở bán đảo Xcan-đi-na-vi không bị đóng băng vào mùa đông.',
    interactive_type: 'drag_logic_arrow',
    exercise_payload: {
      relation_type: 'cause_effect',
      arrow_label: 'NGUYÊN NHÂN ➔ KẾT QUẢ',
      correct_connector: 'Nhờ ... nên ...',
      connector_options: ['Nhờ ... nên ...', 'Tuy ... nhưng ...', 'Nếu ... thì ...'],
      clause_pool: [
        {
          id: 'clause-cause-1',
          text: 'có dòng biển nóng Bắc Đại Tây Dương chảy sát bờ',
          tag: 'Hiện tượng tự nhiên',
        },
        {
          id: 'clause-effect-1',
          text: 'các cảng biển ở bán đảo Xcan-đi-na-vi không bị đóng băng vào mùa đông',
          tag: 'Lợi ích kinh tế - hàng hải',
        },
      ],
      correct_clause_a_id: 'clause-cause-1',
      correct_clause_b_id: 'clause-effect-1',
      logic_formula:
        '[Nhờ: Dòng biển nóng chảy sát bờ] ➔ [Nên: Cảng biển không bị đóng băng mùa đông]',
    } satisfies DragLogicArrowPayload,
    explanation_after:
      'Chính xác! Cặp quan hệ từ "Nhờ... nên..." dùng khi Nguyên nhân mang lại Kết quả tích cực (Thanks to A ➔ B).',
    source_reference: 'SGK Địa lí 7 (Khí hậu châu Âu) & Nguyễn Hiến Lê',
    grade_level: 7,
  },
  {
    id: 'a3000001-0000-4000-8000-000000000015',
    level_order: 3,
    lesson_category: 'connectors_logic',
    title: 'Mũi Tên Logic 2: Nhượng bộ - Tương phản (Ngữ văn & Lịch sử 7)',
    rule_explanation:
      'Bật mí cho con: Cặp từ "Mặc dù / Tuy... nhưng..." giống hệt "Although... (yet)..." trong tiếng Anh: Vế A nêu một khó khăn/trở ngại lớn, nhưng Vế B lại vượt lên ngược hẳn dự đoán!',
    english_anchor: '🇬🇧 Logic: Although [Obstacle A] ⚡ Yet [Triumph B]',
    original_sentence:
      'Mặc dù nghĩa quân Lam Sơn buổi đầu thiếu lương thực trầm trọng nhưng các tướng sĩ vẫn một lòng kiên cường bám trụ núi rừng Chí Linh.',
    interactive_type: 'drag_logic_arrow',
    exercise_payload: {
      relation_type: 'contrast',
      arrow_label: 'THỬ THÁCH ⚡ VƯỢT LÊN',
      correct_connector: 'Mặc dù ... nhưng ...',
      connector_options: ['Mặc dù ... nhưng ...', 'Vì ... nên ...', 'Hễ ... thì ...'],
      clause_pool: [
        {
          id: 'clause-obstacle-2',
          text: 'nghĩa quân Lam Sơn buổi đầu thiếu lương thực trầm trọng',
          tag: 'Khó khăn thực tế',
        },
        {
          id: 'clause-triumph-2',
          text: 'các tướng sĩ vẫn một lòng kiên cường bám trụ núi rừng Chí Linh',
          tag: 'Ý chí kiên cường',
        },
      ],
      correct_clause_a_id: 'clause-obstacle-2',
      correct_clause_b_id: 'clause-triumph-2',
      logic_formula:
        '[Mặc dù: Thiếu lương thực trầm trọng] ⚡ [Nhưng: Tướng sĩ vẫn kiên cường bám trụ]',
    } satisfies DragLogicArrowPayload,
    explanation_after:
      'Xuất sắc! Trong câu có cặp "Mặc dù... nhưng...", trọng tâm ý nghĩa nằm ở vế sau chữ "nhưng" (tôn vinh ý chí bất khuất của nghĩa quân Lam Sơn).',
    source_reference: 'SGK Lịch sử 7 (Khởi nghĩa Lam Sơn) & Diệp Quang Ban',
    grade_level: 7,
  },
  {
    id: 'a3000001-0000-4000-8000-000000000016',
    level_order: 3,
    lesson_category: 'connectors_logic',
    title: 'Mũi Tên Logic 3: Nguyên nhân - Hệ quả Sinh thái (KHTN & Địa lí 7)',
    rule_explanation:
      'Bật mí cho con: Khi nguyên nhân mang tính bất lợi hoặc tự nhiên khách quan dẫn đến hệ quả tất yếu, tiếng Việt dùng cặp "Do / Vì... nên...". Hãy xếp đúng chiều mũi tên nhé!',
    english_anchor: '🇬🇧 Logic: Since / Due to [Cause A] ➔ Therefore [Consequence B]',
    original_sentence:
      'Do rừng đầu nguồn bị chặt phá nghiêm trọng nên vào mùa mưa lũ nước sông dâng cao đột ngột và gây sạt lở đất.',
    interactive_type: 'drag_logic_arrow',
    exercise_payload: {
      relation_type: 'cause_effect',
      arrow_label: 'TÁC ĐỘNG ➔ HỆ QUẢ',
      correct_connector: 'Do ... nên ...',
      connector_options: ['Do ... nên ...', 'Tuy ... nhưng ...', 'Chẳng những ... mà còn ...'],
      clause_pool: [
        {
          id: 'clause-cause-3',
          text: 'rừng đầu nguồn bị chặt phá nghiêm trọng',
          tag: 'Tác động ban đầu',
        },
        {
          id: 'clause-effect-3',
          text: 'vào mùa mưa lũ nước sông dâng cao đột ngột và gây sạt lở đất',
          tag: 'Hệ quả môi trường',
        },
      ],
      correct_clause_a_id: 'clause-cause-3',
      correct_clause_b_id: 'clause-effect-3',
      logic_formula:
        '[Do: Rừng đầu nguồn bị chặt phá] ➔ [Nên: Nước lũ dâng cao đột ngột, gây sạt lở đất]',
    } satisfies DragLogicArrowPayload,
    explanation_after:
      'Hoàn toàn chính xác! Khác với "Nhờ... nên..." (kết quả tốt), cặp "Do... nên..." thường dùng cho quan hệ nguyên nhân - hệ quả khách quan hoặc cảnh báo hậu quả xấu.',
    source_reference: 'SGK Địa lí & KHTN 7 (Bảo vệ rừng và thiên nhiên)',
    grade_level: 7,
  },
];

