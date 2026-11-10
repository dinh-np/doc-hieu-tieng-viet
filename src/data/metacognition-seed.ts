import type { MetacognitionArticle } from '@/types/metacognition';
import { deepNormalizeVietnamese } from '@/lib/utils/vietnamese-text';

/**
 * KHO BÀI ĐỌC SIÊU NHẬN THỨC 3 PHA (PLANNING - MONITORING - EVALUATING)
 * Gồm bài đọc nền tảng Growth Mindset (Sức mạnh của Tư duy) và các bài mẫu chuẩn SGK Lớp 7:
 * Lịch sử 7 (Bài 6), Địa lí 7 (Bài 5)
 * Toàn bộ chuỗi văn bản đều được chuẩn hóa về Unicode dựng sẵn (NFC).
 */
const RAW_METACOGNITION_ARTICLES_SEED: MetacognitionArticle[] = [
  // ===========================================================================
  // BÀI NỀN TẢNG: GROWTH MINDSET - SỨC MẠNH CỦA TƯ DUY
  // ===========================================================================
  {
    id: 'growth-mindset-suc-manh-tu-duy',
    slug: 'growth-mindset-suc-manh-tu-duy',
    article_type: 'metacognition',
    subject: 'Kỹ năng sống',
    grade: 7,
    title: 'Mindset - Bài 1 - Sức mạnh của Tư duy - Growth Mindset',
    subtitle:
      'Bài đọc nền tảng giúp rèn luyện Tư duy phát triển (Growth Mindset): biến thất bại thành thông tin học hỏi và mở khóa sức mạnh kỳ diệu của chữ "CHƯA".',
    target_time_minutes: 25,
    planning: {
      active_recall_question:
        "Khi gặp một bài toán khó hoặc một màn chơi game liên tục bị 'Game Over', phản ứng đầu tiên trong đầu em thường là gì: muốn bỏ cuộc hay muốn thử lại?",
      prediction_prompt:
        "Theo em, một người sinh ra thông minh là do gen bẩm sinh hay do bộ não được 'tập tạ' mỗi ngày?",
    },
    chunks: [
      {
        chunk_id: 'gm-chunk-1',
        order: 1,
        title: 'Chặng 1: Khả năng của bạn không hề bị đóng khung',
        original_text:
          "Có bao giờ bạn nghĩ rằng ai sinh ra thông minh thì sẽ luôn giỏi, còn ai kém hơn thì đành chịu? Sự thật không phải vậy! Trí óc của bạn giống như một **khối cơ bắp**. Khi gặp bài toán khó hay thử thách mới, đó không phải là lúc bạn bị **phán xét** 'xem mình kém đến đâu', mà là lúc não bộ đang được rèn luyện để ngày càng mạnh mẽ và thông minh hơn.",
        han_viet_Popup: [
          {
            term: 'phán xét',
            formula: 'Phán [Đoán, quyết định] + Xét [Soi xét, tìm hiểu]',
            meaning: 'Đưa ra lời chê bai hay đánh giá người khác.',
            english_anchor: 'Judge / Criticize',
          },
        ],
        feynman_explanation: {
          dialogue_question: '🤔 Hỏi xoáy: Ủa não bộ mà cũng giống bắp tay được sao ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Tưởng tượng não mình y hệt bắp tay vậy con! Nếu không nâng tạ thì tay mềm xèo. Mỗi lần con 'vò đầu bứt tai' giải một bài khó, chính là lúc các sợi dây thần kinh trong não đang gồng lên nâng tạ để to khỏe hơn đấy!",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Khi đọc từ 'khối cơ bắp', ba dùng ký hiệu [C] để liên kết: à, vậy thông minh không phải số trời định sẵn, mà giống như tập gym vậy!",
        },
        student_reflection: {
          selected_symbols: ['C', '*'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'gm-chunk-2',
        order: 2,
        title: 'Chặng 2: Hai kiểu tư duy: Cố định và Phát triển',
        original_text:
          'Con người có 2 hệ tư duy: **Tư duy cố định (Fixed Mindset)** tin rằng tài năng là sẵn có, làm bạn luôn sợ sai và sợ bị đánh giá. Ngược lại, **Tư duy phát triển (Growth Mindset)** giúp bạn hiểu rằng mọi kỹ năng đều có thể rèn luyện. Người có tư duy phát triển không xem **thất bại** là **bản án**, mà là thông tin quý giá để học hỏi.',
        han_viet_Popup: [
          {
            term: 'thất bại',
            formula: 'Thất [Mất, trượt] + Bại [Thua, hỏng việc]',
            meaning: 'Chưa đạt được mục tiêu trong lần thử này, nhưng là dữ liệu để làm tốt hơn lần sau.',
            english_anchor: 'Failure / Setback',
          },
          {
            term: 'bản án',
            formula: 'Bản [Văn bản] + Án [Phán quyết cố định]',
            meaning: 'Lời kết tội đóng đinh không thể thay đổi.',
            english_anchor: 'Verdict / Sentence',
          },
        ],
        feynman_explanation: {
          dialogue_question: '🤔 Hỏi xoáy: Khác biệt lớn nhất giữa hai kiểu người này là gì?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Giống hệt lúc chơi game! Người tư duy cố định vừa thấy màn hình hiện 'Game Over' là đập máy bảo: 'Game rác, mình dở tệ'. Còn người có tư duy phát triển sẽ cười: 'Ồ, hố sâu chỗ này! Lần sau mình nhảy sớm 1 giây là qua!'.",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba dùng ký hiệu [*] ở câu cuối: Thất bại không phải là dấu chấm hết, nó chỉ là một bản tin hướng dẫn cách đi đúng!',
        },
        student_reflection: {
          selected_symbols: ['*'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'gm-chunk-3',
        order: 3,
        title: "Chặng 3: Sức mạnh kỳ diệu của 'Chữ CHƯA'",
        original_text:
          "Thay vì tự dán nhãn 'Mình không làm được việc này', hãy thêm một từ kỳ diệu: **'Mình CHƯA làm được'**. Chữ **'CHƯA'** mở ra cánh cửa hy vọng và sự **tiến bộ**. Nó nhắc bạn rằng bạn chỉ đang ở trên hành trình học hỏi, và với thời gian cùng phương pháp đúng, bạn hoàn toàn có thể **chinh phục** được.",
        han_viet_Popup: [
          {
            term: 'tiến bộ',
            formula: 'Tiến [Đi lên phía trước] + Bộ [Bước chân]',
            meaning: 'Bước lên phía trước, ngày càng giỏi và hoàn thiện hơn.',
            english_anchor: 'Progress / Improvement',
          },
          {
            term: 'chinh phục',
            formula: 'Chinh [Đi xa vượt thử thách] + Phục [Làm cho khuất phục]',
            meaning: 'Vượt qua thử thách khó khăn để làm chủ mục tiêu.',
            english_anchor: 'Conquer / Master',
          },
        ],
        feynman_explanation: {
          dialogue_question: "🤔 Hỏi xoáy: Chỉ thêm một chữ 'chưa' thôi mà khác nhiều vậy sao?",
          dialogue_answer:
            "💡 Giải thích giản đơn: Nói 'Không làm được' giống như con tự tay khóa trái cửa phòng rồi vứt chìa khóa đi. Nhưng khi thêm chữ 'CHƯA', con đã cắm sẵn chiếc chìa khóa vào ổ, chỉ cần xoay nhẹ là cánh cửa cơ hội mở toang!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [!] ở chữ CHƯA. Đây là thần chú tâm lý: đổi từ bế tắc sang hy vọng chỉ trong 1 giây!',
        },
        student_reflection: {
          selected_symbols: ['!'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'gm-chunk-4',
        order: 4,
        title: 'Chặng 4: Nỗ lực là chiếc cầu nối duy nhất',
        original_text:
          "Cố gắng nhiều không có nghĩa là bạn kém cỏi. Ngược lại, **nỗ lực chính là con đường duy nhất** giúp bạn đi từ 'chưa biết' đến **'thành thạo'**. Mọi vận động viên nhà vô địch hay thiên tài đều không tự nhiên giỏi sẵn, họ vượt lên nhờ **kiên trì** luyện tập qua hàng nghìn lần thử và sai.",
        han_viet_Popup: [
          {
            term: 'thành thạo',
            formula: 'Thành [Hoàn thành, chín muồi] + Thạo [Quen tay, tinh thông]',
            meaning: 'Làm việc gì đó cực kỳ khéo léo, nhuần nhuyễn nhờ rèn luyện nhiều lần.',
            english_anchor: 'Proficient / Mastery',
          },
          {
            term: 'kiên trì',
            formula: 'Kiên [Vững chắc, bền bỉ] + Trì [Giữ vững không buông]',
            meaning: 'Giữ vững quyết tâm theo đuổi đến cùng dù gặp khó khăn.',
            english_anchor: 'Persevere / Persistent',
          },
        ],
        feynman_explanation: {
          dialogue_question: '🤔 Hỏi xoáy: Người ta nói thiên tài thì cần gì luyện tập nhiều?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Không ai vừa cầm cây đàn guitar lên là gảy ngay được bài hát hay. Tất cả các cao thủ đều bấm trật ngón và chai cả đầu ngón tay hàng nghìn lần trước khi lên sân khấu!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ký hiệu [KL]: Nỗ lực là bằng chứng của việc con đang tiến lên, chứ không phải bằng chứng con dở!',
        },
        student_reflection: {
          selected_symbols: ['KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Cấp độ 1: Tìm ngay trong bài (Right There)',
          question: 'Theo bài đọc, não bộ của chúng ta giống với bộ phận nào trên cơ thể?',
          hint: 'Con nhìn ngay Chặng 1, cụm từ được in đậm ở câu thứ ba nhé!',
        },
        {
          type: 'think_search',
          level_label: 'Cấp độ 2: Tổng hợp & Xâu chuỗi (Think & Search)',
          question:
            'Người có Tư duy cố định và Tư duy phát triển phản ứng khác nhau thế nào khi gặp thất bại?',
          hint: 'Xem lại Chặng 2: một bên coi thất bại là bản án/đánh giá, một bên coi thất bại là thông tin quý giá để học hỏi.',
        },
        {
          type: 'author_and_me',
          level_label: 'Cấp độ 3: Suy luận & Liên hệ (Author & Me)',
          question:
            'Tuần này có việc gì con từng nghĩ "mình không làm được", giờ con sẽ thử gắn thêm chữ "CHƯA" vào không?',
          hint: 'Liên hệ một môn học, bài toán khó, kỹ năng thể thao hoặc ngoại ngữ mà con đang rèn luyện.',
        },
      ],
      mindmap_matrix: [
        {
          category: '1. Não bộ giống như',
          prompt: 'Hình ảnh so sánh với bộ phận nào trên cơ thể?',
          sample_keywords: 'Khối cơ bắp cần được nâng tạ rèn luyện',
        },
        {
          category: '2. Tư duy cố định',
          prompt: 'Thái độ trước cái sai và định kiến về tài năng?',
          sample_keywords: 'Sợ sai, sợ bị phán xét, tin tài năng là cố định',
        },
        {
          category: '3. Tư duy phát triển',
          prompt: 'Cách nhìn nhận thất bại và kỹ năng?',
          sample_keywords: 'Xem thất bại là thông tin quý giá để học hỏi',
        },
        {
          category: '4. Từ ma thuật',
          prompt: 'Từ nào biến sự bế tắc thành hy vọng?',
          sample_keywords: 'Chữ "CHƯA" — mở ra chìa khóa hy vọng',
        },
      ],
      reflection_321: {
        three_learned: [
          'Não bộ giống như khối cơ bắp, càng giải bài khó càng phát triển mạnh mẽ hơn.',
          'Thất bại không phải là bản án mà là thông tin quý giá để học hỏi.',
          'Nỗ lực kiên trì là chiếc cầu nối duy nhất đưa ta từ chưa biết đến thành thạo.',
        ],
        two_surprises: [
          'Chỉ thêm một chữ "CHƯA" vào cuối câu đã mở toang cánh cửa hy vọng.',
          'Ngay cả các nhà vô địch và thiên tài cũng phải trải qua hàng nghìn lần thử và sai.',
        ],
        one_traffic_light: {
          status: 'green',
          question: '',
        },
      },
      takeaway_sentence:
        'Giá trị của em không nằm ở chỗ luôn đúng, mà nằm ở chỗ em luôn sẵn sàng học hỏi!',
    },
  },

  // ===========================================================================
  // BÀI NỀN TẢNG 2: SỨC MẠNH CỦA TƯ DUY — NÃO BỘ GIỐNG NHƯ CƠ BẮP
  // ===========================================================================
  {
    id: 'mindset-nao-bo-la-co-bap',
    slug: 'mindset-nao-bo-la-co-bap',
    article_type: 'metacognition',
    category: 'metacognition',
    subject: 'Kỹ năng sống',
    grade: 7,
    title: 'Mindset - Bài 2: Não bộ cần phải được tập "Gym" để không bị đóng khung',
    subtitle:
      'Khám phá cơ chế thần kinh học đằng sau Tư duy phát triển (Growth Mindset): vì sao mỗi bài tập khó chính là một lần não bộ "nâng tạ" để mọc thêm nhánh liên kết neuron mới.',
    target_time_minutes: 25,
    planning: {
      active_recall_question:
        'Khi gặp một bài toán khó hoặc bài tập vượt ngoài khả năng hiện tại, suy nghĩ đầu tiên xuất hiện trong đầu em là gì?',
      prediction_prompt:
        "Theo em, một người sinh ra thông minh là do gen bẩm sinh quy định 100%, hay do bộ não được 'tập tạ' rèn luyện mỗi ngày?",
    },
    chunks: [
      {
        chunk_id: 'chunk-1',
        order: 1,
        title: 'Chặng 1: Trí óc con người không hề bị đóng khung sẵn',
        original_text:
          'Có bao giờ em nghĩ rằng ai sinh ra thông minh thì sẽ luôn giỏi, còn ai kém hơn thì đành chịu? Sự thật khoa học không phải vậy! Trí óc của bạn giống như một **khối cơ bắp**. Khi gặp bài toán khó hay thử thách mới, đó không phải là lúc bạn bị **phán xét** xem mình kém đến đâu, mà là lúc não bộ đang được rèn luyện để ngày càng mạnh mẽ và thông minh hơn.',
        han_viet_Popup: [
          {
            term: 'Phán xét',
            formula: 'Phán (đoán định) + Xét (soi xét, đánh giá)',
            meaning: 'Đưa ra lời chê bai hay đánh giá năng lực của người khác.',
            english_anchor: 'Judge / Judgment',
          },
          {
            term: 'Đóng khung',
            formula: 'Đóng + Khung (giới hạn cứng nhắc)',
            meaning:
              'Tin rằng năng lực là cố định, sinh ra thế nào thì mãi mãi như vậy không đổi được.',
            english_anchor: 'Fixed / Boxed-in',
          },
        ],
        feynman_explanation: {
          dialogue_question: '🤔 Hỏi xoáy: Ủa não bộ mà cũng giống bắp tay được sao Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Y hệt con ạ! Tưởng tượng trí não em y hệt bắp tay vậy. Nếu không tập tạ, bắp tay không thể tự to lên. Mỗi lần con 'vò đầu bứt tai' giải bài khó là các kết nối thần kinh trong não đang gồng lên nâng tạ để to khỏe hơn đấy!",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Khi đọc thấy cụm từ 'khối cơ bắp', ba gắn ngay ký hiệu [C] (Kết nối): Ba liên tưởng ngay đến việc tập gym. Não cũng cần tạ nặng (bài khó) thì mới nở nang được!",
        },
        student_reflection: {
          selected_symbols: ['C', '*'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-2',
        order: 2,
        title: 'Chặng 2: Mạng lưới thần kinh tự tạo liên kết mới',
        original_text:
          'Các nhà khoa học thần kinh đã chứng minh: Mỗi lần bạn học một kỹ năng mới, nỗ lực suy nghĩ và sửa sai, các tế bào thần kinh (**neuron**) trong não sẽ mọc thêm các nhánh **liên kết** mới. Càng luyện tập nhiều, con đường truyền tín hiệu trong não càng rộng lớn và chạy nhanh hơn.',
        han_viet_Popup: [
          {
            term: 'Neuron',
            formula: 'Thuật ngữ sinh học thần kinh',
            meaning: 'Tế bào thần kinh chuyên tiếp nhận và dẫn truyền tín hiệu trong não bộ.',
            english_anchor: 'Neuron',
          },
          {
            term: 'Liên kết',
            formula: 'Liên (nối liền) + Kết (buộc lại)',
            meaning: 'Sự kết nối, truyền dẫn thông tin giữa các tế bào não với nhau.',
            english_anchor: 'Synapse / Connection',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Vậy nghĩa là mình học kém môn nào là do mình chưa mở đường thôi đúng không Ba?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Chính xác! Giống như việc mở một con đường trong rừng rậm vậy. Lần đầu đi qua em phải vạch từng bụi cây rất khó khăn. Nhưng đi lại 100 lần, con đường mòn đó sẽ trở thành đường nhựa phẳng lì! Không ai dở bẩm sinh, chỉ là con đường trong não con đối với môn đó chưa được đi lại nhiều lần thôi.',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba dùng ký hiệu [*] (Cốt lõi) ở câu này: Bản chất việc học giỏi lên là do tế bào não mọc thêm nhánh nối, chứ không phải do phép thuật!',
        },
        student_reflection: {
          selected_symbols: ['*'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-3',
        order: 3,
        title: 'Chặng 3: Thử thách là cơ hội để não bộ lớn lên',
        original_text:
          'Bài tập dễ dàng chỉ giúp bạn ôn lại những gì đã biết, nhưng bài tập khó mới là thứ làm não bạn thực sự phát triển. Nhận ra khó khăn không phải là bằng chứng của sự kém cỏi, mà là dấu hiệu cho thấy bạn đang tiến vào **vùng phát triển** mới.',
        han_viet_Popup: [
          {
            term: 'Vùng phát triển',
            formula: 'Vùng + Phát (mở rộng) + Triển (vươn xa)',
            meaning:
              'Khoảng kiến thức hoặc kỹ năng mới vượt ra ngoài vùng an toàn quen thuộc, nơi ta cần nỗ lực mới chinh phục được.',
            english_anchor: 'Growth Zone',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Vậy từ nay thấy bài khó là con nên mừng hay nên sợ?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Nên mừng chứ! Đi tập gym về bị mỏi cơ không phải vì bị bệnh, mà vì cơ bắp đang vỡ ra để mọc lại to hơn. Cảm giác nhức đầu khi giải bài khó cũng đúng là cảm giác não đang 'nâng tạ' đấy!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [!] (Bất ngờ / Thú vị) và [KL] (Kết luận): Đổi góc nhìn hoàn toàn — thấy bài khó nghĩa là cơ hội nâng cấp não đã tới!',
        },
        student_reflection: {
          selected_symbols: ['!', 'KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Trực tiếp',
          question:
            'Theo bài đọc, trí óc của con người được so sánh với bộ phận nào trên cơ thể?',
          hint: 'Đọc lại Chặng 1, câu so sánh trực tiếp ngay đoạn đầu.',
        },
        {
          type: 'think_search',
          level_label: 'Suy ngẫm & Ghép nối',
          question:
            'Khi gặp một bài toán khó và nỗ lực sửa sai, điều gì thực sự đang xảy ra bên trong các tế bào thần kinh của não bộ?',
          hint: 'Nhìn vào Chặng 2: các tế bào neuron mọc thêm cái gì và con đường tín hiệu thay đổi ra sao?',
        },
        {
          type: 'author_and_me',
          level_label: 'Liên hệ bản thân',
          question:
            'Tuần này có môn học hay bài tập nào em cảm thấy khó? Em sẽ thay đổi góc nhìn về độ khó đó như thế nào dựa vào bài học này?',
          hint: "Em có xem đó là lúc não đang được 'nâng tạ' không?",
        },
      ],
      mindmap_matrix: [
        {
          category: 'Trí óc con người',
          prompt: 'Giống như khối cơ bắp — cần nâng tạ để thông minh hơn',
          sample_keywords: 'Giống như khối cơ bắp — cần nâng tạ để thông minh hơn',
        },
        {
          category: 'Mỗi khi nỗ lực suy nghĩ',
          prompt: 'Các tế bào thần kinh (neuron) mọc thêm nhánh liên kết mới',
          sample_keywords: 'Các tế bào thần kinh (neuron) mọc thêm nhánh liên kết mới',
        },
        {
          category: 'Khi gặp bài tập khó',
          prompt: 'Không phải kém cỏi, mà là dấu hiệu não tiến vào vùng phát triển mới',
          sample_keywords: 'Không phải kém cỏi, mà là dấu hiệu não tiến vào vùng phát triển mới',
        },
      ],
      reflection_321: {
        three_learned: [
          'Trí óc giống như cơ bắp, không bị đóng khung bẩm sinh.',
          'Não mọc thêm liên kết mới và mở đường rộng hơn khi ta nỗ lực.',
          'Bài toán khó chính là phòng tập gym cho não bộ.',
        ],
        two_surprises: [
          'Khó khăn không phải là phán xét sự kém cỏi, mà là dấu hiệu não đang lớn lên.',
          'Càng luyện tập nhiều, con đường truyền tín hiệu trong não càng biến thành đường nhựa phẳng lì.',
        ],
        one_traffic_light: {
          status: 'green',
          question:
            'Mỗi khi thấy nhức đầu khi giải bài khó, em sẽ mỉm cười vì biết não mình đang mạnh lên.',
        },
      },
      takeaway_sentence:
        'Trí óc con người giống như khối cơ bắp — càng thử thách, càng rèn luyện, em sẽ càng thông minh!',
    },
  },

  // ===========================================================================
  // BÀI NỀN TẢNG 3: NHẬN DIỆN HAI KIỂU TƯ DUY — CỐ ĐỊNH VÀ PHÁT TRIỂN
  // ===========================================================================
  {
    id: 'mindset-hai-kieu-tu-duy',
    slug: 'mindset-hai-kieu-tu-duy',
    article_type: 'metacognition',
    category: 'metacognition',
    subject: 'Kỹ năng sống',
    grade: 7,
    title: 'Mindset - Bài 3: Nhận Diện Hai Kiểu Tư Duy — Tư duy Cố Định và Tư duy Phát Triển',
    subtitle:
      'Nhận diện sự khác biệt giữa Tư duy cố định (Fixed Mindset) và Tư duy phát triển (Growth Mindset), học cách thay đổi lời tự trò chuyện nội tâm (Self-Talk) khi đối mặt với khó khăn và thất bại.',
    target_time_minutes: 25,
    planning: {
      active_recall_question:
        "Khi chơi game mà bị 'Game Over' hoặc khi nhận một bài kiểm tra bị điểm thấp, phản ứng đầu tiên của em là giận dỗi muốn bỏ cuộc hay tò mò tìm cách thử lại?",
      prediction_prompt:
        'Theo em, người có Tư duy cố định và người có Tư duy phát triển sẽ phản ứng khác nhau thế nào khi bị người khác góp ý hoặc khi chính mình mắc lỗi?',
    },
    chunks: [
      {
        chunk_id: 'chunk-1',
        order: 1,
        title: 'Chặng 1: Tư duy cố định (Fixed Mindset) — Chiếc áo giáp chật chội',
        original_text:
          '**Tư duy cố định (Fixed Mindset)** tin rằng tài năng và trí thông minh là sẵn có từ khi sinh ra và không thể thay đổi. Người có tư duy cố định luôn **sợ sai**, sợ bị đánh giá là dở, nên họ thường **né tránh** thử thách và chỉ thích làm những việc dễ dàng để tỏ ra mình thông minh.',
        han_viet_Popup: [
          {
            term: 'Tư duy cố định',
            formula: 'Cố (chắc chắn, giữ chặt) + Định (không lay chuyển)',
            meaning:
              'Cách nghĩ rằng năng lực của mình sinh ra đã đóng khung, không thể rèn luyện để giỏi hơn.',
            english_anchor: 'Fixed Mindset',
          },
          {
            term: 'Né tránh',
            formula: 'Né (lạng sang bên) + Tránh (không giáp mặt)',
            meaning:
              'Tìm cách trốn chạy hoặc lảng đi, không dám đối đầu trực diện với khó khăn.',
            english_anchor: 'Avoidance / Evade',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Tại sao người có tư duy cố định lại sợ làm sai vậy Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Tư duy cố định giống như việc con tự khoác lên mình một chiếc áo giáp sắt chật chội và nặng nề. Lúc nào cũng nơm nớp sợ áo bị trầy xước nên con chẳng dám chạy nhảy hay đá bóng cùng bạn bè! Họ sợ sai vì nghĩ rằng nếu lỡ làm trật một bài toán, mọi người sẽ dán nhãn coi họ là 'kẻ kém cỏi' mãi mãi.",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Khi đọc đoạn này, ba gắn ký hiệu [!] (Bất ngờ) và [C] (Kết nối): Chiếc áo giáp tưởng để bảo vệ mình, hóa ra lại trói chặt mình khiến mình không lớn lên được!',
        },
        student_reflection: {
          selected_symbols: ['!', 'C'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-2',
        order: 2,
        title: 'Chặng 2: Tư duy phát triển (Growth Mindset) — Bộ đồ thể thao thoải mái',
        original_text:
          'Ngược lại, **Tư duy phát triển (Growth Mindset)** giúp bạn hiểu rằng mọi kỹ năng đều có thể rèn luyện qua thời gian và phương pháp đúng. Người có tư duy phát triển không xem thất bại là **bản án** phủ nhận giá trị bản thân, mà xem đó là **thông tin quý giá** để học hỏi và điều chỉnh.',
        han_viet_Popup: [
          {
            term: 'Tư duy phát triển',
            formula: 'Phát (mở rộng) + Triển (vươn xa, tiến tới)',
            meaning:
              'Cách suy nghĩ tin rằng trí thông minh và tài năng luôn có thể phát triển nhờ rèn luyện và nỗ lực bền bỉ.',
            english_anchor: 'Growth Mindset',
          },
          {
            term: 'Bản án',
            formula: 'Bản (văn bản) + Án (vụ án, quyết định kết tội)',
            meaning:
              'Lời phán quyết chấm dứt hy vọng, khẳng định ai đó có lỗi hoặc kém cỏi hoàn toàn.',
            english_anchor: 'Verdict / Condemnation',
          },
          {
            term: 'Thông tin phản hồi',
            formula: 'Phản (quay ngược lại) + Hồi (trở về)',
            meaning:
              'Dữ liệu cho biết kết quả thực tế để ta biết đường sửa chữa và làm tốt hơn ở lần sau.',
            english_anchor: 'Feedback',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Vậy người có tư duy phát triển có sợ thất bại không Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Họ cũng chẳng thích thất bại đâu con! Nhưng họ giống như đang mặc bộ đồ thể thao thun co giãn: thoải mái vận động, nếu lỡ té ngã thì tự đứng dậy phủi bụi rồi chạy tiếp. Họ hiểu thất bại không phải dấu chấm hết, nó chỉ là một chiếc 'la bàn' báo rằng: Cách làm cũ chưa đúng, cần đổi chiến lược mới!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [*] (Cốt lõi) ở câu cuối: Thất bại chỉ là dữ liệu phản hồi (feedback), không phải là bản án kết tội con người mình!',
        },
        student_reflection: {
          selected_symbols: ['*'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-3',
        order: 3,
        title: 'Chặng 3: Chuyển đổi lời tự trò chuyện trong đầu (Self-Talk)',
        original_text:
          "Sự khác biệt lớn nhất giữa hai kiểu tư duy nằm ở câu nói em tự nói với chính mình (**Self-Talk**). Thay vì than thở: 'Mình không có **năng khiếu** môn này', người tư duy phát triển sẽ tự nhủ: 'Mình **chưa giỏi** môn này, mình cần luyện tập thêm bằng cách khác'.",
        han_viet_Popup: [
          {
            term: 'Self-Talk',
            formula: 'Thuật ngữ tâm lý học nhận thức',
            meaning:
              'Lời tự trò chuyện nội tâm — những suy nghĩ, câu nói thầm kín ta tự đối thoại với bộ não của mình mỗi ngày.',
            english_anchor: 'Inner Dialogue / Self-Talk',
          },
          {
            term: 'Năng khiếu',
            formula: 'Năng (khả năng) + Khiếu (lỗ hổng bộc lộ thiên bẩm)',
            meaning:
              'Khả năng tự nhiên sẵn có ở một lĩnh vực nào đó, nhưng nếu không mài giũa rèn luyện thì cũng sẽ bị thui chột.',
            english_anchor: 'Innate Talent / Gift',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Con có thể tự chuyển từ Tư duy cố định sang Tư duy phát triển được không Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Hoàn toàn được chứ con! Hãy tưởng tượng trong đầu con có một chiếc đĩa hát. Mỗi khi thấy đĩa phát bài 'Game rác quá, mình dở tệ', con hãy bấm dừng lại và đổi sang đĩa mới: 'Ồ, hố sâu chỗ này! Lần sau mình căn giờ nhảy sớm 1 giây là vượt qua ngay!'. Đổi câu thoại là đổi cả tương lai!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ký hiệu [KL] (Kết luận): Đừng tin mọi suy nghĩ tiêu cực thoảng qua trong đầu. Mình hoàn toàn có thể tự đổi kịch bản suy nghĩ của chính mình!',
        },
        student_reflection: {
          selected_symbols: ['KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Trực tiếp',
          question:
            'Theo bài đọc, người có Tư duy cố định tin rằng tài năng và trí thông minh đến từ đâu?',
          hint: 'Đọc lại Chặng 1, câu đầu tiên: họ nghĩ tài năng có sẵn hay do rèn luyện?',
        },
        {
          type: 'think_search',
          level_label: 'Suy ngẫm & Ghép nối',
          question:
            "Sự khác biệt căn bản trong cách nhìn nhận về 'thất bại' giữa người có Tư duy cố định và người có Tư duy phát triển là gì?",
          hint: "So sánh hình ảnh 'bản án kết tội' ở Chặng 1 và 'thông tin quý giá/la bàn' ở Chặng 2.",
        },
        {
          type: 'author_and_me',
          level_label: 'Liên hệ bản thân',
          question:
            'Trong tình huống nào gần đây (học tập, thể thao, chơi game) em nhận thấy mình đã có suy nghĩ của Tư duy cố định? Em sẽ đổi lời tự trò chuyện (Self-Talk) đó ra sao?',
          hint: "Thử đổi từ câu 'Mình dở môn này quá' sang câu 'Mình CHƯA... và mình cần...'.",
        },
      ],
      mindmap_matrix: [
        {
          category: 'Tư duy cố định (Fixed Mindset)',
          prompt:
            'Chiếc áo giáp sắt chật chội: Sợ sai, né tránh thử thách, xem thất bại là bản án phủ nhận bản thân.',
          sample_keywords:
            'Chiếc áo giáp sắt chật chội: Sợ sai, né tránh thử thách, xem thất bại là bản án phủ nhận bản thân.',
        },
        {
          category: 'Tư duy phát triển (Growth Mindset)',
          prompt:
            'Bộ đồ thể thao thoải mái: Xem thất bại là dữ liệu quý giá để học hỏi, mọi kỹ năng đều rèn luyện được.',
          sample_keywords:
            'Bộ đồ thể thao thoải mái: Xem thất bại là dữ liệu quý giá để học hỏi, mọi kỹ năng đều rèn luyện được.',
        },
        {
          category: 'Lời tự thoại (Self-Talk)',
          prompt:
            "Đổi từ 'Mình không có năng khiếu' thành 'Mình CHƯA làm được, cần tìm thêm chiến lược khác'.",
          sample_keywords:
            "Đổi từ 'Mình không có năng khiếu' thành 'Mình CHƯA làm được, cần tìm thêm chiến lược khác'.",
        },
      ],
      reflection_321: {
        three_learned: [
          'Tư duy cố định sợ bị đánh giá và chỉ thích làm việc dễ.',
          'Tư duy phát triển tập trung vào tiến bộ và rèn luyện kỹ năng qua thời gian.',
          'Thất bại là bài học chỉ đường, không phải bản án.',
        ],
        two_surprises: [
          'Tư duy cố định lo chứng minh bản thân; Tư duy phát triển tập trung vào việc học hỏi.',
          'Chỉ cần thay đổi một câu nói trong đầu (Self-Talk), ta có thể đổi từ bỏ cuộc sang kiên trì tiếp tục.',
        ],
        one_traffic_light: {
          status: 'green',
          question:
            'Lắng nghe lời nói nội tâm của mình mỗi ngày và chủ động thay thế câu nói cố định bằng câu nói phát triển.',
        },
      },
      takeaway_sentence:
        'Tư duy cố định đóng khung tiềm năng — Tư duy phát triển mở ra vô hạn cơ hội học hỏi!',
    },
  },

  // ===========================================================================
  // BÀI NỀN TẢNG 4: THẤT BẠI LÀ 'DẤU CHẤM HẾT' HAY 'TÍN HIỆU ĐỂ NHÌN LẠI MÌNH'?
  // ===========================================================================
  {
    id: 'mindset-giai-ma-that-bai',
    slug: 'mindset-giai-ma-that-bai',
    article_type: 'metacognition',
    category: 'metacognition',
    subject: 'Kỹ năng sống',
    grade: 7,
    title: "Mindset - Bài 4: Thất Bại Là 'Dấu Chấm Hết' Hay 'Tín Hiệu Để Nhìn Lại Mình'?",
    subtitle:
      'Giải mã cảm xúc khi gặp thất bại hay làm bài sai: không coi thất bại là "Game-Over" dán nhãn bản thân, mà xem đó là "tín hiệu dữ liệu" của bản đồ GPS để điều chỉnh chiến lược và tiến bộ.',
    target_time_minutes: 25,
    planning: {
      active_recall_question:
        'Khi con bị điểm kém hoặc làm sai một bài tập khó, cảm xúc đầu tiên xuất hiện trong đầu con là gì?',
      prediction_prompt:
        "Con thường nghĩ việc làm sai đó là do bản thân mình 'dở tệ' bẩm sinh, hay do 'chiến lược làm bài' của mình chưa đúng?",
    },
    chunks: [
      {
        chunk_id: 'chunk-1',
        order: 1,
        title: "Chặng 1: Thất bại không phải là dấu chấm hết, không phải là 'Game-Over'",
        original_text:
          "Khi gặp một kết quả không như ý — như điểm số kém hay bị thua trong một trận thi đấu — người mang tư duy cố định thường coi đó là **'dấu chấm hết'**, một kết luận rằng bản thân kém cỏi. Tuy nhiên, người có tư duy phát triển hiểu rằng thất bại không **dán nhãn** giá trị con người em. Nó chỉ đơn giản báo hiệu rằng cách làm hiện tại chưa mang lại hiệu quả và em cần điều chỉnh.",
        han_viet_Popup: [
          {
            term: 'Dấu chấm hết',
            formula: 'Dấu + Chấm + Hết',
            meaning:
              'Suy nghĩ tuyệt vọng cho rằng mọi chuyện đã kết thúc hoàn toàn, không còn cơ hội để sửa chữa hay làm lại.',
            english_anchor: 'Dead End / Game Over',
          },
          {
            term: 'Dán nhãn',
            formula: 'Dán (gắn chặt) + Nhãn (mác đánh dấu)',
            meaning:
              "Vội vàng đưa ra kết luận đóng khung, gán cho bản thân hoặc người khác một tính chất cố định (ví dụ: 'mình là kẻ dở tệ').",
            english_anchor: 'Labeling / Stereotyping',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            "🤔 Hỏi xoáy: Khi làm sai bài, con có thấy mình như bị dán nhãn 'dở tệ' không?",
          dialogue_answer:
            "💡 Giải thích giản đơn: Tưởng tượng con đang đi xe theo bản đồ GPS trên điện thoại. Khi con lỡ quẹo nhầm đường, ứng dụng GPS đâu có mắng con 'Sao ngốc thế!' rồi tự tắt máy đâu! Nó chỉ bình tĩnh phát tín hiệu: 'Đang tính toán lại tuyến đường!'. Thất bại cũng y hệt vậy con à, đó chỉ là chiếc bản đồ GPS đang nhắc con rẽ sang một hướng đi mới thôi!",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Khi đọc đoạn này, ba gắn ký hiệu [!] (Bất ngờ) và [C] (Kết nối): Thất bại không phải là bảng thông báo 'Game Over' đóng cửa trò chơi, mà chỉ là tín hiệu nhắc mình đổi hướng lái xe!",
        },
        student_reflection: {
          selected_symbols: ['!', 'C'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-2',
        order: 2,
        title: 'Chặng 2: Làm sai là tín hiệu dữ liệu giúp điều chỉnh chiến lược',
        original_text:
          "Một điểm số chưa tốt không phải là đòn trừng phạt, mà là một **'tín hiệu dữ liệu'** vô cùng quý giá. Nó chỉ ra chính xác lỗ hổng kiến thức hoặc phương pháp ôn tập chưa đúng. Thay vì trốn tránh hay tức giận, người có tư duy phát triển phân tích lỗi sai để tìm ra **chiến lược** làm bài tốt hơn cho lần sau.",
        han_viet_Popup: [
          {
            term: 'Tín hiệu dữ liệu',
            formula: 'Tín hiệu (dấu hiệu báo trước) + Dữ liệu (thông tin thu thập)',
            meaning:
              'Thông tin thực tế khách quan thu được qua kết quả làm bài để phân tích và rút ra manh mối cải thiện.',
            english_anchor: 'Data Signal / Feedback',
          },
          {
            term: 'Chiến lược',
            formula: 'Chiến (đấu tranh, hành động) + Lược (kế sách, phương lược)',
            meaning:
              'Kế hoạch hành động và phương pháp thông minh được chuẩn bị có chủ đích để đạt được mục tiêu.',
            english_anchor: 'Strategy',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Làm bài tập bị sai thì có gì quý giá mà bảo là dữ liệu hả Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Giống hệt như khi con chơi game nhập vai vậy! Khi nhân vật của con bị sập bẫy và thua trận, trò chơi không bảo con hãy bỏ cuộc đi. Trò chơi đang tặng con một 'mẹo qua màn' (hint) cực kỳ rõ ràng: Lần sau đến đúng chỗ này thì né ra hoặc nhảy lên! Nhận bài kiểm tra sai, chúng mình cùng làm nhà điều tra để giải mã xem 'tín hiệu dữ liệu' đang chỉ cho con lỗ hổng nào nhé!",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [*] (Cốt lõi) ở cụm 'tín hiệu dữ liệu': Điểm kém là thông tin dẫn đường (data), không phải chiếc roi trừng phạt giá trị của con!",
        },
        student_reflection: {
          selected_symbols: ['*'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-3',
        order: 3,
        title: 'Chặng 3: Biến cảm giác dằn vặt thành hành động tiến bộ',
        original_text:
          "Sự **dằn vặt** và tự trách chỉ làm tiêu tốn năng lượng của trí não mà không giúp giải quyết vấn đề. Khi nhận diện được thất bại chỉ là tín hiệu nhìn lại, em hãy chủ động đặt câu hỏi **phản tư**: 'Lần sau mình sẽ thay đổi bước nào? Mình cần sự hỗ trợ từ ai?'. Chính hành động chủ động này sẽ biến mọi sai lầm thành bệ phóng cho sự trưởng thành.",
        han_viet_Popup: [
          {
            term: 'Dằn vặt',
            formula: 'Từ láy miêu tả tâm lý',
            meaning:
              'Tự dằn xé, giày vò và trách móc bản thân liên tục trong tâm trí mà không tạo ra bất kỳ hành động sửa chữa nào.',
            english_anchor: 'Self-blame / Guilt',
          },
          {
            term: 'Phản tư',
            formula: 'Phản (quay ngược lại) + Tư (suy nghĩ, tư duy)',
            meaning:
              'Tự soi rọi, nhìn nhận lại suy nghĩ và hành động của bản thân một cách tỉnh táo để đúc kết bài học.',
            english_anchor: 'Self-Reflection',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Lỡ làm sai mà buồn bã, ân hận thì có sao đâu Ba?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Nếu con vô tình làm đổ một cốc nước lênh láng ra bàn, con có ngồi khóc hay quát mắng chiếc cốc thì nước cũng chẳng tự khô được! Cách thông minh nhất là gì? Lấy ngay chiếc khăn lau sạch nước và đặt lại cốc cẩn thận hơn. Sửa sai trong học tập cũng nhẹ nhàng và thực tế y như việc cầm khăn lau bàn vậy!',
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Ký hiệu [KL] (Kết luận): Đừng lãng phí 1 giây nào để tự trách móc. Hãy chuyển toàn bộ năng lượng đó thành danh sách 'chìa khóa hành động sửa sai'!",
        },
        student_reflection: {
          selected_symbols: ['KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Trực tiếp',
          question:
            "Theo bài đọc, người có tư duy phát triển coi thất bại là điều gì thay vì coi đó là 'dấu chấm hết'?",
          hint: 'Nhìn vào Chặng 1 và Chặng 2: Thất bại là tín hiệu dữ liệu của cái gì?',
        },
        {
          type: 'think_search',
          level_label: 'Suy ngẫm & Ghép nối',
          question:
            'Tại sao việc tự dằn vặt và trách móc bản thân khi làm sai lại không giúp ích cho việc tiến bộ?',
          hint: 'Đọc lại Chặng 3 và liên tưởng đến ví dụ chiếc cốc nước bị đổ của Feynman.',
        },
        {
          type: 'author_and_me',
          level_label: 'Liên hệ bản thân',
          question:
            'Lần tới khi làm sai một bài toán khó hoặc bị điểm chưa như ý, con sẽ tự nói với bản thân câu gì đầu tiên?',
          hint: "Em có nhớ đến câu nói 'Đang tính toán lại tuyến đường' của bản đồ GPS không?",
        },
      ],
      mindmap_matrix: [
        {
          category: 'Khi gặp thất bại / điểm kém',
          prompt: "Không phải 'Game Over' hay dấu chấm hết dán nhãn bản thân kém cỏi.",
          sample_keywords:
            "Không phải 'Game Over' hay dấu chấm hết dán nhãn bản thân kém cỏi.",
        },
        {
          category: 'Bản chất của lỗi sai',
          prompt:
            "Là 'tín hiệu dữ liệu' giống như GPS báo: 'Đang tính toán lại tuyến đường!'",
          sample_keywords:
            "Là 'tín hiệu dữ liệu' giống như GPS báo: 'Đang tính toán lại tuyến đường!'",
        },
        {
          category: 'Hành động thông minh',
          prompt:
            "Dừng dằn vặt vô ích — lập tức cầm 'khăn lau bàn' để điều chỉnh chiến lược mới.",
          sample_keywords:
            "Dừng dằn vặt vô ích — lập tức cầm 'khăn lau bàn' để điều chỉnh chiến lược mới.",
        },
      ],
      reflection_321: {
        three_learned: [
          'Thất bại không định nghĩa giá trị con người em.',
          'Điểm số chưa tốt là tín hiệu dữ liệu chỉ ra lỗ hổng phương pháp để sửa chữa.',
          'Sửa sai nhẹ nhàng và thực tế như việc lấy khăn lau cốc nước bị đổ.',
        ],
        two_surprises: [
          'Ứng dụng GPS không bao giờ chê con người ngốc, nó chỉ tính lại lộ trình mới.',
          'Tự trách bản thân chỉ làm hao tổn pin năng lượng của bộ não mà không làm bài toán đúng lên được.',
        ],
        one_traffic_light: {
          status: 'green',
          question:
            "Mỗi khi làm bài sai, em sẽ mỉm cười như chiếc máy GPS: 'Đang tính lại chiến lược mới!' rồi bắt tay vào sửa ngay.",
        },
      },
      takeaway_sentence:
        'Thất bại không định nghĩa con người em. Nó không phải là dấu chấm hết, mà là tín hiệu dữ liệu báo hiệu chiếc bản đồ GPS đang giúp em điều chỉnh chiến lược để chạm tới thành công!',
    },
  },

  // ===========================================================================
  // BÀI NỀN TẢNG 6: SỨC MẠNH KỲ DIỆU CỦA CHỮ 'CHƯA'
  // ===========================================================================
  {
    id: 'mindset-suc-manh-chu-chua',
    slug: 'mindset-suc-manh-chu-chua',
    article_type: 'metacognition',
    category: 'metacognition',
    subject: 'Kỹ năng sống',
    grade: 7,
    title: "Mindset – Bài 6: Sức Mạnh Kỳ Diệu Của Chữ 'CHƯA'",
    subtitle:
      'Khám phá chiếc chìa khóa ngôn ngữ chuyển đổi trạng thái não bộ từ "đóng sập / bế tắc" sang "đang trên hành trình tiến bộ", trao lại quyền kiểm soát tương lai cho chính em.',
    target_time_minutes: 25,
    planning: {
      active_recall_question:
        "Khi đối mặt với một kỹ năng khó (như bơi lội, chơi một nhạc cụ, hoặc giải một bài toán hóc búa), phản xạ đầu tiên của em có phải là buột miệng nói: 'Em không làm được' không?",
      prediction_prompt:
        "Em thử đoán xem điều gì kỳ diệu sẽ xảy ra bên trong bộ não nếu em gắn thêm đúng một từ 'CHƯA' vào ngay sau câu 'Em không làm được'?",
    },
    chunks: [
      {
        chunk_id: 'chunk-1',
        order: 1,
        title: "Chặng 1: Từ 'Không làm được' — Cánh cửa bị khóa chặt",
        original_text:
          "Khi em thốt lên câu: 'Em không làm được bài này' hay 'Em không có năng khiếu vẽ', bộ não của em sẽ lập tức **đóng sập** lại. Nó phát đi **tín hiệu** rằng mọi chuyện đã kết thúc, không còn hy vọng gì nữa và em nên bỏ cuộc ngay lập tức.",
        han_viet_Popup: [
          {
            term: 'Đóng sập',
            formula: 'Động từ hình ảnh',
            meaning:
              'Hành động khép lại đột ngột và dứt khoát, ngắt hoàn toàn cơ hội suy nghĩ hay tìm tòi cách giải quyết.',
            english_anchor: 'Shut Down / Slam Shut',
          },
          {
            term: 'Tín hiệu',
            formula: 'Tín (tin tức, dấu hiệu) + Hiệu (nhận biết)',
            meaning:
              'Thông điệp hay mệnh lệnh truyền đi trong mạng lưới thần kinh điều khiển hành vi của não bộ.',
            english_anchor: 'Signal / Command',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            "🤔 Hỏi xoáy: Nói một câu 'không làm được' thôi mà nghe nguy hiểm vậy sao Ba?",
          dialogue_answer:
            "💡 Giải thích giản đơn: Nói câu 'Tôi không làm được' giống hệt như việc con tự tay khóa chặt then cửa phòng lại rồi tiện tay vứt luôn chiếc chìa khóa qua cửa sổ vậy! Bộ não con cực kỳ nghe lời con; khi con phát lệnh bảo 'bó tay rồi', bộ não sẽ lập tức tắt nguồn và đình công, không chịu suy nghĩ thêm một giây nào nữa!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Khi đọc đoạn này, ba gắn ký hiệu [!] (Bất ngờ) và [?] (Cảnh báo): Lời nói ra có sức mạnh điều khiển não bộ. Câu nói tiêu cực là chiếc khóa tự giam hãm chính mình!',
        },
        student_reflection: {
          selected_symbols: ['!', '?'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-2',
        order: 2,
        title: "Chặng 2: Thần chú tâm lý: Thêm một chữ 'CHƯA'",
        original_text:
          "Thay vì tự dán nhãn bế tắc, hãy thêm một từ **kỳ diệu**: 'Mình **CHƯA** làm được'. Chữ **'CHƯA'** ngay lập tức mở ra cánh cửa của hy vọng và sự tiến bộ. Nó nhắc nhở em rằng em chỉ đang ở trên **hành trình** học hỏi, và với thời gian cùng nỗ lực đúng, em hoàn toàn sẽ làm được.",
        han_viet_Popup: [
          {
            term: 'Kỳ diệu',
            formula: 'Kỳ (lạ lùng, đặc biệt) + Diệu (khéo léo, sâu xa)',
            meaning:
              'Tạo ra sự biến chuyển phi thường, mang lại kết quả bất ngờ vượt ngoài sức tưởng tượng.',
            english_anchor: 'Magical / Miraculous',
          },
          {
            term: 'Hành trình',
            formula: 'Hành (đi lại, bước đi) + Trình (quãng đường, lộ trình)',
            meaning:
              'Quá trình tiến bước qua từng chặng để đạt tới mục tiêu, đòi hỏi thời gian và sự kiên trì.',
            english_anchor: 'Journey / Process',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            "🤔 Hỏi xoáy: Chỉ đổi thêm đúng một chữ 'chưa' thôi mà có sức mạnh lớn vậy sao Ba?",
          dialogue_answer:
            "💡 Giải thích giản đơn: Sức mạnh cực kỳ lớn con à! Khi thêm chữ 'CHƯA' vào câu nói ('Em chưa làm được bài này'), con đang cắm chiếc chìa khóa vào ổ khóa. Chỉ cần vặn nhẹ là cánh cửa cơ hội lại mở toang ra! Chữ 'CHƯA' thay đổi hoàn toàn trạng thái tâm trí của con: từ chỗ 'dừng cuộc chơi' chuyển sang 'mình đang trên đường đi tới đích'!",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [*] (Cốt lõi) và [C] (Kết nối): Chữ 'CHƯA' chính là câu thần chú tâm lý chuyển từ bế tắc (Dead End) sang tiến trình (In Progress) trong tích tắc!",
        },
        student_reflection: {
          selected_symbols: ['*', 'C'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-3',
        order: 3,
        title: "Chặng 3: Biến chữ 'CHƯA' thành thói quen hàng ngày",
        original_text:
          "Bất cứ khi nào em gặp **rào cản** trong học tập hay cuộc sống, hãy tập thói quen nhắc nhở bản thân: 'Bây giờ mình chưa giỏi, nhưng nếu luyện tập mỗi ngày, mình sẽ ngày càng tốt hơn'. Chữ 'CHƯA' trao cho em **quyền kiểm soát** tương lai của chính mình.",
        han_viet_Popup: [
          {
            term: 'Rào cản',
            formula: 'Rào (ngăn chặn) + Cản (chặn lại)',
            meaning:
              'Chướng ngại vật hoặc khó khăn tạm thời xuất hiện cản bước tiến của mình.',
            english_anchor: 'Barrier / Obstacle',
          },
          {
            term: 'Quyền kiểm soát',
            formula: 'Quyền (thẩm quyền) + Kiểm (xem xét) + Soát (nắm bắt, trông coi)',
            meaning:
              'Khả năng tự mình làm chủ suy nghĩ, hành động và quyết định kết quả tương lai của chính bản thân.',
            english_anchor: 'Locus of Control / Autonomy',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Làm sao để con nhớ dùng chữ này mỗi khi gặp chuyện khó?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Giống như con đang leo núi vậy! Khi ngước lên thấy đỉnh núi còn ở xa, chưa lên tới đỉnh đâu có nghĩa là con bị ngã hay thất bại; điều đó chỉ đơn giản có nghĩa là con cần bước tiếp thêm vài trăm bước nữa thôi! Từ hôm nay, mỗi lần nghe con dùng chữ 'CHƯA' khi gặp bài khó, Ba sẽ mỉm cười và cực kỳ tự hào về tinh thần chiến binh của con!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ký hiệu [KL] (Kết luận): Đừng vội phán xét kết quả ở thời điểm hiện tại. Tương lai nằm trong tay con nếu con kiên trì tiến thêm từng bước nhỏ!',
        },
        student_reflection: {
          selected_symbols: ['KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Trực tiếp',
          question:
            "Theo bài đọc, việc thốt lên câu 'Em không làm được' được ví với hành động nào đối với cánh cửa?",
          hint: 'Đọc lại Chặng 1 và hình ảnh Feynman giải thích về chiếc chìa khóa phòng.',
        },
        {
          type: 'think_search',
          level_label: 'Suy ngẫm & Ghép nối',
          question:
            "Tại sao việc gắn thêm từ 'CHƯA' lại có thể chuyển hóa trạng thái của não bộ từ bế tắc sang hy vọng?",
          hint: "So sánh hai trạng thái ở Chặng 2: trạng thái 'dừng lại / khóa cửa' khác gì với trạng thái 'đang trên đường đi / cắm chìa khóa'?",
        },
        {
          type: 'author_and_me',
          level_label: 'Liên hệ bản thân',
          question:
            "Hôm nay hoặc tuần này có bài tập, môn học hay kỹ năng nào em từng nghĩ 'mình không làm được'? Em hãy viết lại câu đó thật trọn vẹn với chữ 'CHƯA'?",
          hint: "Mẫu câu gợi ý: 'Hiện tại mình CHƯA làm được việc..., nhưng nếu mình thử... thì mình sẽ tiến bộ'.",
        },
      ],
      mindmap_matrix: [
        {
          category: "Khi nói 'Không làm được'",
          prompt:
            'Não bộ đóng sập cửa, khóa chặt then và ném chìa khóa đi — rơi vào bế tắc.',
          sample_keywords:
            'Não bộ đóng sập cửa, khóa chặt then và ném chìa khóa đi — rơi vào bế tắc.',
        },
        {
          category: "Sức mạnh của chữ 'CHƯA'",
          prompt:
            'Cắm chìa khóa vào ổ, mở ra cánh cửa hy vọng và khẳng định mình đang trên hành trình tiến bộ.',
          sample_keywords:
            'Cắm chìa khóa vào ổ, mở ra cánh cửa hy vọng và khẳng định mình đang trên hành trình tiến bộ.',
        },
        {
          category: 'Hành động rèn luyện mỗi ngày',
          prompt:
            "Biến chữ 'CHƯA' thành câu cửa miệng khi leo núi: Chưa đến đỉnh nghĩa là chỉ cần bước tiếp!",
          sample_keywords:
            "Biến chữ 'CHƯA' thành câu cửa miệng khi leo núi: Chưa đến đỉnh nghĩa là chỉ cần bước tiếp!",
        },
      ],
      reflection_321: {
        three_learned: [
          "Nói 'Không làm được' là tự tay khóa sập cánh cửa hoạt động của não bộ.",
          "Chữ 'CHƯA' là chiếc chìa khóa thần kỳ mở toang cơ hội học hỏi.",
          "Chữ 'CHƯA' nhắc nhở em đang ở trên hành trình, chưa xong không có nghĩa là thất bại.",
        ],
        two_surprises: [
          'Bộ não rất biết nghe lời: nếu ta bảo không được thì nó sẽ tắt nguồn nghỉ ngơi luôn.',
          "Chữ 'CHƯA' biến rào cản tuyệt vọng thành hành trình hy vọng và trao lại quyền kiểm soát tương lai.",
        ],
        one_traffic_light: {
          status: 'green',
          question:
            "Gắn chữ 'CHƯA' vào mọi câu nói bế tắc của mình từ hôm nay để luôn sẵn sàng bước tiếp.",
        },
      },
      takeaway_sentence:
        "Chữ 'CHƯA' là chìa khóa thần kỳ giúp em chuyển mọi bế tắc thành hành trình tiến bộ!",
    },
  },

  // ===========================================================================
  // BÀI NỀN TẢNG 7: CỞI BỎ NHÃN DÁN VÀ TẬP TRUNG VÀO QUÁ TRÌNH
  // ===========================================================================
  {
    id: 'mindset-coi-bo-nhan-dan',
    slug: 'mindset-coi-bo-nhan-dan',
    article_type: 'metacognition',
    category: 'metacognition',
    subject: 'Kỹ năng sống',
    grade: 7,
    title: 'Mindset – Bài 7: Cởi Bỏ Nhãn Dán Và Tập Trung Vào Quá Trình',
    subtitle:
      'Nhận diện chiếc bẫy tâm lý của các "nhãn dán" (dù khen hay chê), rèn luyện sự tự tin bền vững qua Quá trình (Process Praise) và nhìn nhận bản thân như một cái cây đang lớn mỗi ngày.',
    target_time_minutes: 25,
    planning: {
      active_recall_question:
        "Em có thích được người khác khen 'Con thông minh quá' không? Em có từng sợ rằng nếu lần sau mình làm bài sai thì sẽ bị mọi người coi là hết thông minh không?",
      prediction_prompt:
        "Em thử nghĩ xem tại sao việc tập trung vào 'sự nỗ lực và quá trình học hỏi' lại giúp ta tự tin, vững vàng hơn rất nhiều so với việc chỉ bám víu vào lời khen tài năng bẩm sinh?",
    },
    chunks: [
      {
        chunk_id: 'chunk-1',
        order: 1,
        title: 'Chặng 1: Bẫy tâm lý của các nhãn dán',
        original_text:
          "Khi em bị **dán nhãn** — dù là nhãn xấu ('dở toán', 'vụng về') hay nhãn tốt ('thông minh', 'thiên tài') — em đều rất dễ bị **mắc kẹt**. Nhãn xấu làm em tự ti không dám thử sức. Nhãn tốt lại tạo ra áp lực vô hình, khiến em sợ làm sai sẽ đánh mất đi danh hiệu 'thông minh' trong mắt người khác.",
        han_viet_Popup: [
          {
            term: 'Dán nhãn',
            formula: 'Dán (gắn chặt) + Nhãn (mác đánh dấu)',
            meaning:
              'Hành động vội vàng gán ghép cho bản thân hoặc người khác một tên gọi cố định, biến đặc điểm tạm thời thành tính chất vĩnh viễn.',
            english_anchor: 'Labeling',
          },
          {
            term: 'Mắc kẹt',
            formula: 'Từ ghép tượng hình/tâm lý',
            meaning:
              'Rơi vào tình thế bị giam hãm tâm lý, không dám hành động hoặc không tìm thấy lối thoát để phát triển bản thân.',
            english_anchor: 'Trapped / Stuck',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Được khen thông minh mà cũng có nguy cơ bị mắc kẹt sao Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Nhãn dán 'Thông minh' giống hệt như một chiếc mũ bảo hiểm làm bằng pha lê quý giá vậy con! Lúc nào con cũng nơm nớp sợ mũ bị vỡ, nên con chẳng dám chạy nhảy, đá bóng hay leo núi khám phá thế giới xung quanh. Khen thông minh dễ làm con nghĩ mình không cần cố gắng nữa, hoặc làm con sợ bài khó vì sợ lộ ra mình không hoàn hảo!",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Khi đọc đoạn này, ba gắn ký hiệu [!] (Bất ngờ) và [?] (Cảnh báo): Chiếc nhãn 'thông minh' tưởng là phần thưởng, hóa ra lại có thể biến thành chiếc lồng giam hãm sự dũng cảm bước vào thử thách!",
        },
        student_reflection: {
          selected_symbols: ['!', '?'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-2',
        order: 2,
        title: 'Chặng 2: Tập trung vào Quá trình (Process Praise)',
        original_text:
          'Giá trị thực sự và niềm tự hào **bền vững** không đến từ nhãn dán, mà đến từ **Quá trình**: sự kiên trì, các chiến lược thông minh em đã thử và sự tiến bộ từng ngày của em. Khen ngợi quá trình (**Process Praise**) giúp em luôn chủ động và không sợ thử thách.',
        han_viet_Popup: [
          {
            term: 'Quá trình',
            formula: 'Quá (đi qua) + Trình (chặng đường, thứ tự)',
            meaning:
              'Toàn bộ chuỗi hành động nỗ lực, phương pháp và các bước đi thực tế để đạt tới kết quả.',
            english_anchor: 'Process',
          },
          {
            term: 'Bền vững',
            formula: 'Bền (lâu dài, dẻo dai) + Vững (chắc chắn, không lung lay)',
            meaning:
              'Giá trị có nội lực thực sự bên trong, tồn tại lâu dài và không dễ bị sụp đổ trước biến động bên ngoài.',
            english_anchor: 'Sustainable / Resilient',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Vậy từ nay Ba nên khen con như thế nào mới đúng?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Hãy tự hào về chiếc xe đạp do chính chân con đạp và những vết xước dũng cảm khi tập xe, chứ đừng chỉ tự hào vì chiếc cúp nhựa mua ngoài tiệm! Ba sẽ không khen 'Con thông minh quá' nữa, mà Ba sẽ tự hào bảo: 'Ba rất khâm phục vì con đã kiên trì ngồi thử tới 3 cách giải khác nhau cho bài toán hóc búa này!'.",
          metacognition_modeling:
            "🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [*] (Cốt lõi) và [C] (Kết nối): Đổi mục tiêu từ 'chứng minh mình giỏi' sang 'tận hưởng quá trình học hỏi và sửa sai'!",
        },
        student_reflection: {
          selected_symbols: ['*', 'C'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'chunk-3',
        order: 3,
        title: 'Chặng 3: Em là cái cây đang lớn, không phải chiếc hộp đóng tem',
        original_text:
          'Đừng bao giờ để bất kỳ ai hay bất kỳ điểm số nào dán nhãn **định nghĩa** con người em. Em không phải là một đồ vật cố định mang tem nhãn. Em là một **sinh thể sống**, một cái cây đang không ngừng vươn lên ra lá và lớn lên mỗi ngày nhờ nước ngọt của sự học hỏi.',
        han_viet_Popup: [
          {
            term: 'Sinh thể sống',
            formula: 'Sinh (sống, sinh sôi) + Thể (bản thể, cơ thể)',
            meaning:
              'Một cơ thể sống tự nhiên có khả năng thích nghi, tự tái tạo, học hỏi và không ngừng phát triển.',
            english_anchor: 'Living Organism',
          },
          {
            term: 'Định nghĩa',
            formula: 'Định (chốt lại, xác định) + Nghĩa (ý nghĩa, giá trị)',
            meaning:
              'Áp đặt một giới hạn hoặc phán quyết cố định về giá trị bản chất của một con người.',
            english_anchor: 'Define / Limit',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Nghĩa là con sẽ tự do lớn lên theo cách của con đúng không Ba?',
          dialogue_answer:
            "💡 Giải thích giản đơn: Đúng vậy con yêu! Chiếc hộp carton nhựa cứng mới cần người ta dán chiếc tem 'Hàng dễ vỡ'. Còn con là một cây cổ thụ non; hôm nay có thể thân còn mảnh mai, nhưng cứ được bón phân tưới nước (nỗ lực học tập và rút kinh nghiệm) thì chắc chắn sẽ vươn tán rợp bóng mát! Hãy cởi bỏ mọi nhãn dán và tự tin lớn lên!",
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ký hiệu [KL] (Kết luận): Con người là một quá trình liên tục tiến hóa (Growing organism). Không có điểm số hay lời phán xét nào có thể đóng khung tiềm năng của con!',
        },
        student_reflection: {
          selected_symbols: ['KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Trực tiếp',
          question:
            "Theo lời giải thích Feynman trong bài đọc, nhãn dán 'Thông minh' được so sánh với đồ vật bằng thủy tinh/pha lê nào?",
          hint: 'Đọc lại Chặng 1, câu Ba ví von về chiếc mũ bảo hiểm.',
        },
        {
          type: 'think_search',
          level_label: 'Suy ngẫm & Ghép nối',
          question:
            'Tại sao việc khen ngợi quá trình và sự nỗ lực (Process Praise) lại giúp học sinh tự tin và vững vàng hơn là chỉ khen ngợi tài năng bẩm sinh?',
          hint: "Kết nối Chặng 1 và Chặng 2: Sự khác biệt giữa 'chiếc mũ pha lê sợ vỡ' và 'chiếc xe tự đạp có vết xước dũng cảm'.",
        },
        {
          type: 'author_and_me',
          level_label: 'Liên hệ bản thân',
          question:
            "Nếu trong lớp hoặc ở nhà có ai đó vô tình dán nhãn em là 'không có năng khiếu môn X', em sẽ tự nhủ với bản thân điều gì và chứng minh ngược lại bằng cách nào?",
          hint: "Em có nhớ hình ảnh 'cái cây đang lớn' cần được tưới nước học hỏi mỗi ngày ở Chặng 3 không?",
        },
      ],
      mindmap_matrix: [
        {
          category: 'Bẫy của nhãn dán',
          prompt:
            'Chiếc mũ pha lê sợ vỡ: Nhãn xấu gây tự ti, nhãn tốt tạo áp lực sợ làm sai mất danh hiệu.',
          sample_keywords:
            'Chiếc mũ pha lê sợ vỡ: Nhãn xấu gây tự ti, nhãn tốt tạo áp lực sợ làm sai mất danh hiệu.',
        },
        {
          category: 'Tập trung vào Quá trình',
          prompt:
            'Tự hào về sự kiên trì, các chiến lược đã thử và những bước tiến bộ thực tế mỗi ngày.',
          sample_keywords:
            'Tự hào về sự kiên trì, các chiến lược đã thử và những bước tiến bộ thực tế mỗi ngày.',
        },
        {
          category: 'Hình ảnh bản thân',
          prompt:
            'Là cái cây đang lớn không ngừng vươn tán — không phải chiếc hộp nhựa đóng tem cứng nhắc.',
          sample_keywords:
            'Là cái cây đang lớn không ngừng vươn tán — không phải chiếc hộp nhựa đóng tem cứng nhắc.',
        },
      ],
      reflection_321: {
        three_learned: [
          'Nhãn dán (dù khen hay chê) đều có thể biến thành chiếc bẫy làm ta mắc kẹt.',
          'Khen ngợi quá trình và chiến lược giúp xây dựng sự tự tin bền vững.',
          'Em là một sinh thể sống đang lớn lên, không ai có quyền dán nhãn định nghĩa em.',
        ],
        two_surprises: [
          "Được khen 'thông minh' đôi khi lại làm mình sợ thử sức với bài toán khó.",
          'Chiếc xe tự đạp và vết xẹo dũng cảm đáng tự hào hơn nhiều so với chiếc cúp nhựa mua ngoài tiệm.',
        ],
        one_traffic_light: {
          status: 'green',
          question:
            'Chủ động cởi bỏ mọi nhãn dán, tập trung tự hào về từng bước nỗ lực và kiên trì học hỏi mỗi ngày.',
        },
      },
      takeaway_sentence:
        'Đừng để nhãn dán định nghĩa em — Hãy để sự kiên trì và học hỏi vẽ nên tương lai của em!',
    },
  },

  // ===========================================================================
  // BÀI 1: LỊCH SỬ 7 - BÀI 6 (CÁC VƯƠNG QUỐC PHONG KIẾN ĐÔNG NAM Á)
  // ===========================================================================
  {
    id: 'lich-su-7-bai-6-dong-nam-a',
    slug: 'lich-su-7-bai-6-dong-nam-a',
    article_type: 'metacognition',
    subject: 'Lịch sử',
    grade: 7,
    title:
      'Lịch sử 7 - Bài 6: Sự hình thành và phát triển của các vương quốc phong kiến ở Đông Nam Á (Thế kỉ VII – X)',
    subtitle:
      'Giải mã vì sao vị trí "ngã tư đường biển" và gió mùa đã biến các tiểu quốc cổ thành những đế chế thương mại cường thịnh.',
    target_time_minutes: 15,
    planning: {
      active_recall_question:
        'Nhìn lên bản đồ khu vực Đông Nam Á, con thấy vùng biển của chúng ta nằm kẹp giữa hai đại dương và hai nền văn minh khổng lồ nào của châu Á?',
      prediction_prompt:
        'Đọc tiêu đề "Sự hình thành các vương quốc phong kiến Đông Nam Á (Thế kỉ VII - X)", con thử đoán xem các quốc gia này làm giàu từ nghề nông trồng lúa trong đất liền hay từ buôn bán đường biển?',
    },
    chunks: [
      {
        chunk_id: 'ls7-b6-chunk-1',
        order: 1,
        title: 'Chặng 1: "Ngã tư đường biển" và cú chuyển mình thế kỉ VII',
        original_text:
          'Từ thế kỉ VII đến thế kỉ X, lịch sử Đông Nam Á chứng kiến một bước ngoặt lớn. Trước đó, vương quốc Phù Nam từng làm chủ vùng biển phía Nam, nhưng đến đầu thế kỉ VII đã **suy vong**. Ngay lập tức, con đường **giao thương** hàng hải nối liền Ấn Độ Dương và Thái Bình Dương dịch chuyển xuống vùng **eo biển** Ma-lắc-ca. Nhờ luồng gió mùa thổi đều đặn theo mùa, hàng loạt quốc gia **phong kiến** mới đã trỗi dậy ở cả vùng lục địa lẫn vùng hải đảo.',
        han_viet_Popup: [
          {
            term: 'suy vong',
            formula: 'Suy [Yếu dần đi] + Vong [Mất đi, sụp đổ]',
            meaning: 'Yếu dần rồi đi đến chỗ sụp đổ, tan rã hoàn toàn.',
            english_anchor: 'Decline and Fall',
          },
          {
            term: 'giao thương',
            formula: 'Giao [Qua lại, trao đổi] + Thương [Buôn bán]',
            meaning: 'Hoạt động trao đổi, mua bán hàng hóa giữa các vùng hoặc các nước.',
            english_anchor: 'Trade / Commerce',
          },
          {
            term: 'phong kiến',
            formula: 'Phong [Ban cấp đất đai] + Kiến [Xây dựng, thiết lập]',
            meaning: 'Chế độ xã hội mà vua đứng đầu, ban đất cho quý tộc cai quản nông dân.',
            english_anchor: 'Feudal / Feudalism',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Tại sao chỉ vì một cái "eo biển Ma-lắc-ca" mà cả bản đồ Đông Nam Á thay đổi?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Con hãy tưởng tượng tàu buôn thời xưa giống như xe tải đường dài chạy từ Ấn Độ sang Trung Quốc. Khi "trạm dừng chân" cũ (Phù Nam) đóng cửa, tất cả xe tải buộc phải đi tắt qua con hẻm độc đạo mang tên Eo biển Ma-lắc-ca. Ai mở "trạm xăng và siêu thị" ngay con hẻm này thì chắc chắn hốt bạc!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Khi đọc đoạn này, ba gạch chân ngay cụm "Phù Nam suy vong" [P] và "eo biển Ma-lắc-ca" [*]. Ba tự hỏi: Khi một trung tâm cũ sụp đổ thì dòng tiền thương mại chảy đi đâu? À, nó chảy xuống eo biển phía Nam!',
        },
        student_reflection: {
          selected_symbols: ['*', 'P'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'ls7-b6-chunk-2',
        order: 2,
        title: 'Chặng 2: Hai mô hình vương quốc — Nông nghiệp sông lớn & Thương cảng hải đảo',
        original_text:
          'Từ thế kỉ VII đến thế kỉ X, các vương quốc Đông Nam Á phát triển theo hai nhánh rõ rệt. Ở vùng **lục địa**, các quốc gia như Pa-gan (My-an-ma), Đva-ra-va-ti (Thái Lan), Chân Lạp (Cam-pu-chia) và Đại Cồ Việt hình thành trên những **lưu vực** sông lớn màu mỡ, lấy nông nghiệp trồng lúa nước làm gốc. Ngược lại, ở vùng **hải đảo**, vương quốc Sri Vi-giay-a (trên đảo Su-ma-tra, In-đô-nê-xi-a) lại vươn lên **cường thịnh** nhờ kiểm soát toàn bộ tàu thuyền qua lại eo biển Ma-lắc-ca.',
        han_viet_Popup: [
          {
            term: 'lục địa',
            formula: 'Lục [Đất liền] + Địa [Vùng đất]',
            meaning: 'Phần đất liền rộng lớn nối liền nhau trên bề mặt Trái Đất.',
            english_anchor: 'Mainland / Continent',
          },
          {
            term: 'lưu vực',
            formula: 'Lưu [Dòng nước chảy] + Vực [Vùng, khu vực]',
            meaning: 'Vùng đất rộng lớn quanh con sông, nơi nước mưa và phù sa đổ dồn về.',
            english_anchor: 'River Basin',
          },
          {
            term: 'cường thịnh',
            formula: 'Cường [Mạnh mẽ] + Thịnh [Phát triển rực rỡ, giàu có]',
            meaning: 'Giàu mạnh và phát triển rực rỡ ở mức cao nhất.',
            english_anchor: 'Prosperous & Powerful',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Cùng ở Đông Nam Á mà sao người làm ruộng, người lại đi thu phí tàu biển?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Giống như hai người bạn khởi nghiệp dựa vào "vốn tự có" của nhà mình! Nhà bạn ở vùng đồng bằng có sông lớn nhiều phù sa (như Chân Lạp, Đại Cồ Việt) thì mở nông trại trồng lúa nuôi quân. Còn nhà bạn Sri Vi-giay-a ở ngoài đảo nhiều núi đá nhưng nằm ngay mặt tiền đường biển quốc tế thì mở cảng thu thuế và bán gia vị!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba thấy từ "Ngược lại" — đây là dấu hiệu so sánh đối lập! Ba đánh dấu [*] cho cặp đối lập: Lục địa (Lưu vực sông ➔ Trồng lúa) vs. Hải đảo (Eo biển ➔ Thương cảng Sri Vi-giay-a).',
        },
        student_reflection: {
          selected_symbols: ['*', 'C'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'ls7-b6-chunk-3',
        order: 3,
        title: 'Chặng 3: Mạng lưới gia vị và giao lưu văn hóa rực rỡ',
        original_text:
          'Không chỉ thu thuế tàu buôn, các thương cảng Đông Nam Á còn cung cấp những **đặc sản** quý hiếm mà thế giới săn lùng như trầm hương, đinh hương, nhục đậu khấu và hồ tiêu. Thông qua các chuyến tàu buôn, những luồng tư tưởng tôn giáo lớn như Phật giáo và Ấn Độ giáo (Hin-đu giáo) cùng chữ Phạn được **du nhập** hòa quyện với tín ngưỡng **bản địa**, tạo nên những công trình kiến trúc kỳ vĩ như đền Bô-rô-bu-đua (In-đô-nê-xi-a).',
        han_viet_Popup: [
          {
            term: 'đặc sản',
            formula: 'Đặc [Riêng biệt, nổi bật] + Sản [Sản vật làm ra]',
            meaning: 'Sản vật quý, nổi tiếng chỉ riêng một vùng đất mới có.',
            english_anchor: 'Specialty / Local Delicacy',
          },
          {
            term: 'du nhập',
            formula: 'Du [Đưa từ xa tới] + Nhập [Đi vào bên trong]',
            meaning: 'Đưa văn hóa, kiến thức hoặc giống mới từ nước ngoài vào trong nước.',
            english_anchor: 'Introduce / Import (Culture)',
          },
          {
            term: 'bản địa',
            formula: 'Bản [Gốc rễ vốn có] + Địa [Vùng đất]',
            meaning: 'Có nguồn gốc lâu đời ngay tại vùng đất đó từ xưa.',
            english_anchor: 'Indigenous / Native',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Tại sao đi buôn hạt tiêu, trầm hương mà lại xây được cả đại bảo tháp Phật giáo Bô-rô-bu-đua?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Vì thời xưa tàu buôn phải nằm chờ gió mùa đổi chiều mất mấy tháng trời ở cảng! Trên tàu không chỉ có thương nhân mà còn có các nhà sư, học giả Ấn Độ. Trong lúc chờ gió, họ trò chuyện, truyền dạy chữ viết, kiến trúc và tôn giáo. Người Đông Nam Á cực kỳ thông minh: học cái hay của Ấn Độ nhưng biến tấu theo gu riêng (bản địa) của mình!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba đánh dấu [!] vì bất ngờ khi biết hạt tiêu, đinh hương thời xưa quý ngang vàng ròng, và đánh dấu [KL] cho bài học: Giao thương kinh tế luôn kéo theo giao lưu văn hóa!',
        },
        student_reflection: {
          selected_symbols: ['!', 'KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Cấp độ 1: Tìm ngay trong bài (Right There)',
          question:
            'Sau khi vương quốc Phù Nam suy vong vào đầu thế kỉ VII, con đường giao thương hàng hải quốc tế đã dịch chuyển xuống khu vực eo biển nào?',
          hint: 'Con nhìn lại Chặng 1, câu thứ 3 có in đậm chữ "eo biển" nhé!',
        },
        {
          type: 'think_search',
          level_label: 'Cấp độ 2: Tổng hợp & Xâu chuỗi (Think & Search)',
          question:
            'Hãy so sánh điểm khác biệt cốt lõi về cơ sở kinh tế giữa các vương quốc ở vùng lục địa (như Chân Lạp, Pa-gan) và vương quốc ở vùng hải đảo (như Sri Vi-giay-a).',
          hint: 'Kết hợp hai nửa của Chặng 2: Một bên dựa vào lưu vực sông lớn, một bên dựa vào eo biển và thương cảng.',
        },
        {
          type: 'author_and_me',
          level_label: 'Cấp độ 3: Suy luận & Liên hệ (Author & Me)',
          question:
            'Ngày nay, eo biển Ma-lắc-ca và Biển Đông vẫn là tuyến đường vận tải biển nhộn nhịp bậc nhất thế giới. Theo con, Việt Nam có thể học được bài học gì từ sự cường thịnh của các vương quốc thương cảng xưa?',
          hint: 'Hãy nghĩ về việc phát triển cảng biển nước sâu, dịch vụ hậu cần hàng hải và mở cửa giao lưu quốc tế.',
        },
      ],
      mindmap_matrix: [
        {
          category: '1. Bối cảnh lịch sử (Thế kỉ VII - X)',
          prompt: 'Chuyện gì xảy ra với Phù Nam và tuyến đường biển dịch chuyển đi đâu?',
          sample_keywords: 'Phù Nam suy vong ➔ Tuyến thương mại dồn xuống eo biển Ma-lắc-ca',
        },
        {
          category: '2. Nhóm vương quốc Lục địa',
          prompt: 'Gồm những nước nào và làm giàu bằng nghề gì?',
          sample_keywords: 'Pa-gan, Chân Lạp, Đại Cồ Việt ➔ Lưu vực sông lớn ➔ Nông nghiệp lúa nước',
        },
        {
          category: '3. Nhóm vương quốc Hải đảo',
          prompt: 'Đại diện tiêu biểu là ai và nguồn thu chính từ đâu?',
          sample_keywords: 'Sri Vi-giay-a ➔ Kiểm soát eo biển Ma-lắc-ca, xuất khẩu gia vị, trầm hương',
        },
        {
          category: '4. Thành tựu Văn hóa - Tôn giáo',
          prompt: 'Tiếp thu tôn giáo nào và để lại công trình tiêu biểu gì?',
          sample_keywords: 'Phật giáo & Hin-đu giáo hòa quyện văn hóa bản địa (Đền Bô-rô-bu-đua)',
        },
      ],
      reflection_321: {
        three_learned: [
          'Các vương quốc phong kiến Đông Nam Á hình thành mạnh mẽ từ thế kỉ VII đến thế kỉ X.',
          'Có 2 mô hình kinh tế chính: Nông nghiệp lúa nước (lục địa) và Thương mại hàng hải (hải đảo).',
          'Con đường buôn bán gia vị trên biển đồng thời là con đường truyền bá Phật giáo và Ấn Độ giáo.',
        ],
        two_surprises: [
          'Hạt tiêu, đinh hương, trầm hương của Đông Nam Á từng được cả thế giới săn lùng như kho báu.',
          'Nhờ các thương nhân chờ gió mùa đổi chiều mà văn hóa và chữ viết lan tỏa hòa bình.',
        ],
        one_traffic_light: {
          status: 'green',
          question: '',
        },
      },
      takeaway_sentence:
        'Vị trí địa lí kết hợp với khả năng tận dụng lợi thế tự nhiên (dòng sông màu mỡ hoặc tuyến đường biển quốc tế) chính là chìa khóa tạo nên sự cường thịnh của các quốc gia Đông Nam Á.',
    },
  },

  // ===========================================================================
  // BÀI 2: ĐỊA LÍ 7 - BÀI 5 (THIÊN NHIÊN CHÂU Á)
  // ===========================================================================
  {
    id: 'dia-li-7-bai-5-thien-nhien-chau-a',
    slug: 'dia-li-7-bai-5-thien-nhien-chau-a',
    article_type: 'metacognition',
    subject: 'Địa lí',
    grade: 7,
    title:
      'Địa lí 7 - Bài 5: Vị trí địa lí, đặc điểm tự nhiên châu Á — Bức tranh thiên nhiên kỳ vĩ và phân hóa đa dạng',
    subtitle:
      'Khám phá nguyên lý địa lí giải thích vì sao châu Á vừa có đỉnh Everest cao nhất hành tinh, vừa có đủ mọi đới khí hậu trên Trái Đất.',
    target_time_minutes: 15,
    planning: {
      active_recall_question:
        'Khi nhắc đến châu Á — châu lục rộng lớn nhất thế giới nơi chúng ta đang sống, con nhớ ngay đến kỷ lục tự nhiên nào (ngọn núi cao nhất, hồ sâu nhất hay hoang mạc nào)?',
      prediction_prompt:
        'Theo con, vì sao cùng nằm ở châu Á nhưng người dân Việt Nam mặc áo ngắn đón gió mùa ẩm, trong khi người dân vùng Xi-bia (Nga) chịu lạnh -40°C và người Ả Rập sống giữa sa mạc cát nóng?',
    },
    chunks: [
      {
        chunk_id: 'dl7-b5-chunk-1',
        order: 1,
        title: 'Chặng 1: Kích thước khổng lồ và địa hình "Nóc nhà thế giới"',
        original_text:
          'Châu Á là châu lục rộng lớn nhất thế giới với diện tích phần đất liền khoảng 41,5 triệu km², trải dài từ vùng cực Bắc băng giá đến tận vùng xích đạo nóng ẩm. Địa hình châu Á vô cùng **hiểm trở** và bị **chia cắt** phức tạp: ở chính giữa là vùng núi và **sơn nguyên** đồ sộ cao bậc nhất hành tinh như dãy Hi-ma-lay-a (với đỉnh Ê-vơ-rét cao 8.848m) và sơn nguyên Tây Tạng, bao quanh là các đồng bằng châu thổ rộng lớn.',
        han_viet_Popup: [
          {
            term: 'hiểm trở',
            formula: 'Hiểm [Nguy hiểm, cheo leo] + Trở [Ngăn trở, khó vượt qua]',
            meaning: 'Địa hình có nhiều núi cao vực sâu, rất khó đi lại.',
            english_anchor: 'Rugged & Precarious',
          },
          {
            term: 'sơn nguyên',
            formula: 'Sơn [Núi] + Nguyên [Vùng đất rộng và tương đối bằng ở trên cao]',
            meaning: 'Khu vực đất rộng lớn gồm cả núi và các cao nguyên đồ sộ hợp thành.',
            english_anchor: 'Highland / Plateau Massif',
          },
          {
            term: 'chia cắt',
            formula: 'Chia [Tách ra] + Cắt [Ngăn thành nhiều mảnh]',
            meaning: 'Địa hình đan xen giữa núi cao, thung lũng sâu và đồng bằng, không bằng phẳng đồng nhất.',
            english_anchor: 'Fragmented Terrain',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Tại sao vùng núi cao nhất châu Á lại tập trung dồn cục ở ngay vùng trung tâm?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Con hãy hình dung ở giữa châu Á có một "chiếc mái nhà khổng lồ" (Sơn nguyên Tây Tạng và dãy Hi-ma-lay-a). Từ chiếc mái nhà cao chót vót ở trung tâm đó, các dãy núi và dòng sông lớn tỏa ra bốn phía giống như những máng nước chảy xuống các vùng đồng bằng thấp xung quanh!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Khi đọc số liệu "trải dài từ cực Bắc đến xích đạo", ba đánh dấu ngay [P] (Dự đoán): Trải dài nhiều vĩ độ như vậy thì chắc chắn đoạn tiếp theo sẽ nói về khí hậu phân hóa thành nhiều đới!',
        },
        student_reflection: {
          selected_symbols: ['*', 'P'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'dl7-b5-chunk-2',
        order: 2,
        title: 'Chặng 2: Quy luật phân hóa khí hậu 2 chiều (Bắc - Nam & Đông - Tây)',
        original_text:
          'Khí hậu châu Á **phân hóa** cực kỳ đa dạng theo hai quy luật. Thứ nhất, từ Bắc xuống Nam có đủ các đới khí hậu: đới cực và cận cực, đới ôn đới, đới cận nhiệt và đới nhiệt đới. Thứ hai, trong mỗi đới lại chia thành nhiều kiểu khí hậu khác nhau từ vùng duyên hải vào sâu trong **nội địa**: ven biển có khí hậu **gió mùa** mưa nhiều, ẩm ướt; còn vùng trung tâm và Tây Nam Á lại mang khí hậu **lục địa** khô hạn khắc nghiệt.',
        han_viet_Popup: [
          {
            term: 'phân hóa',
            formula: 'Phân [Chia tách ra] + Hóa [Biến đổi thành khác nhau]',
            meaning: 'Tách ra và biến đổi thành nhiều vùng có đặc điểm tự nhiên khác hẳn nhau.',
            english_anchor: 'Differentiation / Zonation',
          },
          {
            term: 'nội địa',
            formula: 'Nội [Bên trong] + Địa [Đất liền]',
            meaning: 'Vùng đất nằm sâu bên trong lục địa, cách rất xa biển.',
            english_anchor: 'Inland / Interior',
          },
          {
            term: 'lục địa',
            formula: 'Lục [Đất liền] + Địa [Vùng đất]',
            meaning: 'Kiểu khí hậu đặc trưng của vùng xa biển: mùa hè rất nóng, mùa đông rất lạnh và ít mưa.',
            english_anchor: 'Continental Climate',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Tại sao vùng ở sâu bên trong châu Á lại khô hạn đến mức thành hoang mạc?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Mây mưa sinh ra từ hơi nước biển. Nhưng châu Á quá "bụng bự" (diện tích quá rộng) lại thêm "bức tường đá" Hi-ma-lay-a cao gần 9km chắn ngang! Khi gió biển mang mây mưa thổi vào, đi hết quãng đường hàng ngàn cây số và vướng núi cao thì rớt hết nước ở ven biển rồi, vào tới trung tâm chỉ còn gió khô khốc!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba vẽ ngay trong đầu trục tọa độ 2 chiều [*]: Chiều dọc (Bắc ➔ Nam) đổi theo ánh nắng mặt trời; Chiều ngang (Ven biển ➔ Nội địa) đổi theo lượng mưa từ ẩm sang khô!',
        },
        student_reflection: {
          selected_symbols: ['*', 'C'],
          thought_note: '',
        },
      },
      {
        chunk_id: 'dl7-b5-chunk-3',
        order: 3,
        title: 'Chặng 3: Mạng lưới sông ngòi và kho tàng khoáng sản bậc nhất',
        original_text:
          'Từ vùng núi cao trung tâm, nhiều hệ thống sông lớn **bắt nguồn** và đổ ra các đại dương xung quanh như sông Ô-bi, sông Hoàng Hà, sông Trường Giang, sông Mê Công và sông Ấn - Hằng. Chế độ nước sông phụ thuộc chặt chẽ vào chế độ mưa và băng tuyết tan. Bên cạnh đó, châu Á còn sở hữu nguồn tài nguyên **khoáng sản** hết sức **phong phú**, nổi bật nhất là dầu mỏ, khí đốt (tập trung ở Tây Nam Á), than đá và sắt.',
        han_viet_Popup: [
          {
            term: 'khoáng sản',
            formula: 'Khoáng [Quặng mỏ dưới lòng đất] + Sản [Sản vật tự nhiên]',
            meaning: 'Các tài nguyên quý trong lòng đất như dầu mỏ, than đá, quặng sắt, vàng...',
            english_anchor: 'Mineral Resources',
          },
          {
            term: 'phong phú',
            formula: 'Phong [Dồi dào, đầy đặn] + Phú [Giàu có, nhiều]',
            meaning: 'Có số lượng nhiều và đa dạng về chủng loại.',
            english_anchor: 'Abundant & Diverse',
          },
        ],
        feynman_explanation: {
          dialogue_question:
            '🤔 Hỏi xoáy: Sông Mê Công chảy qua Việt Nam bắt nguồn từ đâu mà mùa khô vẫn không cạn trơ đáy?',
          dialogue_answer:
            '💡 Giải thích giản đơn: Bắt nguồn từ "tháp nước" Tây Tạng đó con! Mùa xuân - hạ, băng tuyết trên đỉnh núi cao tan ra cộng với mưa gió mùa tạo thành nguồn nước khổng lồ chảy qua 6 quốc gia rồi bồi đắp nên vựa lúa Đồng bằng sông Cửu Long của Việt Nam mình!',
          metacognition_modeling:
            '🧠 Ba làm mẫu (Think-Aloud): Ba gắn ký hiệu [C] (Kết nối đời sống) ngay tại chữ "sông Mê Công" vì con sông này gắn trực tiếp với hạt gạo chúng ta ăn mỗi ngày, và [KL] cho mối liên hệ: Địa hình trung tâm cao ➔ Sông chảy tỏa ra 4 phía.',
        },
        student_reflection: {
          selected_symbols: ['C', 'KL'],
          thought_note: '',
        },
      },
    ],
    evaluating: {
      qar_questions: [
        {
          type: 'right_there',
          level_label: 'Cấp độ 1: Tìm ngay trong bài (Right There)',
          question:
            'Diện tích phần đất liền của châu Á là bao nhiêu và dãy núi nào sở hữu đỉnh núi cao nhất thế giới?',
          hint: 'Xem lại câu đầu và câu thứ hai của Chặng 1 (con số triệu km² và tên dãy núi).',
        },
        {
          type: 'think_search',
          level_label: 'Cấp độ 2: Tổng hợp & Xâu chuỗi (Think & Search)',
          question:
            'Giải thích vì sao khí hậu châu Á vừa phân hóa thành nhiều đới (từ Bắc xuống Nam), lại vừa phân hóa thành kiểu khí hậu gió mùa ẩm và kiểu khí hậu lục địa khô hạn (từ Đông sang Tây)?',
          hint: 'Kết hợp kích thước trải dài vĩ độ ở Chặng 1 với độ rộng lớn + núi cao chắn gió ở Chặng 2.',
        },
        {
          type: 'author_and_me',
          level_label: 'Cấp độ 3: Suy luận & Liên hệ (Author & Me)',
          question:
            'Việt Nam nằm ở khu vực Đông Nam Á thuộc kiểu khí hậu nhiệt đới gió mùa. Điều kiện tự nhiên này mang lại thuận lợi và thử thách gì cho cuộc sống của người dân nước ta?',
          hint: 'Nghĩ về thuận lợi cho cây lúa, cây ăn quả xanh tốt quanh năm nhưng cũng thường gặp bão lũ, hạn hán theo mùa.',
        },
      ],
      mindmap_matrix: [
        {
          category: '1. Vị trí & Địa hình châu Á',
          prompt: 'Kích thước ra sao? Vùng trung tâm và vùng rìa có địa hình gì?',
          sample_keywords: 'Rộng 41,5 triệu km²; Trung tâm là núi & sơn nguyên cao (Hi-ma-lay-a), rìa là đồng bằng',
        },
        {
          category: '2. Khí hậu theo chiều Bắc - Nam',
          prompt: 'Vì sao chia thành nhiều đới khí hậu từ cực đến xích đạo?',
          sample_keywords: 'Do lãnh thổ trải dài từ vùng cực Bắc đến vùng xích đạo (Đủ 4-5 đới khí hậu)',
        },
        {
          category: '3. Khí hậu theo chiều Ven biển - Nội địa',
          prompt: 'Sự khác nhau giữa vùng ven biển (Đông, Nam Á) và vùng nội địa (Trung, Tây Nam Á)?',
          sample_keywords: 'Ven biển: Gió mùa ẩm, mưa nhiều vs. Nội địa: Lục địa khô hạn, khắc nghiệt',
        },
        {
          category: '4. Sông ngòi & Khoáng sản',
          prompt: 'Các sông lớn bắt nguồn từ đâu và khoáng sản nào nổi bật nhất?',
          sample_keywords: 'Sông tỏa ra từ núi cao trung tâm (Mê Công, Trường Giang...); Giàu dầu mỏ, khí đốt, than',
        },
      ],
      reflection_321: {
        three_learned: [
          'Châu Á là châu lục rộng nhất thế giới (41,5 triệu km²), có đỉnh Everest cao 8.848m.',
          'Khí hậu châu Á phân hóa theo 2 chiều: Bắc - Nam (theo vĩ độ) và Ven biển - Nội địa (theo độ ẩm).',
          'Các sông lớn ở châu Á chảy tỏa từ vùng núi cao trung tâm ra các đại dương xung quanh.',
        ],
        two_surprises: [
          'Dãy Hi-ma-lay-a đóng vai trò như bức tường khổng lồ chặn hơi ẩm từ biển vào nội địa.',
          'Dòng sông Cửu Long ở miền Tây nước ta có nguồn nước bắt nguồn từ tận sơn nguyên Tây Tạng.',
        ],
        one_traffic_light: {
          status: 'green',
          question: '',
        },
      },
      takeaway_sentence:
        'Chính lãnh thổ rộng lớn trải dài từ cực Bắc đến xích đạo cùng địa hình núi cao đồ sộ ở trung tâm đã tạo nên sự phân hóa khí hậu và sông ngòi đa dạng bậc nhất của châu Á.',
    },
  },
];

export const METACOGNITION_ARTICLES_SEED: MetacognitionArticle[] = deepNormalizeVietnamese(
  RAW_METACOGNITION_ARTICLES_SEED
);


