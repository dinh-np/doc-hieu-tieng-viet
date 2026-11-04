-- Create isolated table for 1-Page long articles
CREATE TABLE IF NOT EXISTS public.one_page_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'khoa-hoc',
    target_grade INT DEFAULT 7,
    estimated_minutes INT DEFAULT 20,
    page_count INT DEFAULT 1,
    hero_image_url TEXT,
    content_raw TEXT NOT NULL,
    structured_data JSONB NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.one_page_articles ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
CREATE POLICY "Public Read Access for one_page_articles"
ON public.one_page_articles FOR SELECT
USING (is_published = true);

-- Service Role Full Access
CREATE POLICY "Service Role Full Access for one_page_articles"
ON public.one_page_articles FOR ALL
USING (true)
WITH CHECK (true);

-- =============================================================================
-- BỔ SUNG DỮ LIỆU MẪU ĐỌC HIỂU SIÊU NHẬN THỨC 3 PHA (METACOGNITION 3-PHASE)
-- Lịch sử 7 - Bài 6 & Địa lí 7 - Bài 5 (Planning - Monitoring - Evaluating + Feynman)
-- =============================================================================

INSERT INTO public.one_page_articles (
    title,
    slug,
    category,
    target_grade,
    estimated_minutes,
    page_count,
    content_raw,
    structured_data,
    is_published
) VALUES
(
    'Lịch sử 7 - Bài 6: Sự hình thành và phát triển của các vương quốc phong kiến ở Đông Nam Á (Thế kỉ VII – X)',
    'lich-su-7-bai-6-dong-nam-a',
    'lich-su',
    7,
    15,
    1,
    'Từ thế kỉ VII đến thế kỉ X, lịch sử Đông Nam Á chứng kiến một bước ngoặt lớn. Khi vương quốc Phù Nam suy vong, con đường giao thương hàng hải dịch chuyển xuống eo biển Ma-lắc-ca, thúc đẩy sự trỗi dậy của các vương quốc phong kiến ở cả lục địa (Pa-gan, Chân Lạp, Đại Cồ Việt) và hải đảo (Sri Vi-giay-a).',
    '{
      "metacognition_version": "3-phase-v1",
      "subject": "Lịch sử",
      "grade": 7,
      "target_time_minutes": 15,
      "planning": {
        "active_recall_question": "Nhìn lên bản đồ khu vực Đông Nam Á, con thấy vùng biển của chúng ta nằm kẹp giữa hai đại dương và hai nền văn minh khổng lồ nào của châu Á?",
        "prediction_prompt": "Đọc tiêu đề bài học, con thử đoán xem các quốc gia Đông Nam Á thời kỳ này làm giàu từ nghề nông trồng lúa trong đất liền hay từ buôn bán đường biển?"
      },
      "chunks": [
        {
          "chunk_id": "ls7-b6-chunk-1",
          "order": 1,
          "title": "Chặng 1: Ngã tư đường biển và cú chuyển mình thế kỉ VII",
          "original_text": "Từ thế kỉ VII đến thế kỉ X, lịch sử Đông Nam Á chứng kiến một bước ngoặt lớn. Trước đó, vương quốc Phù Nam từng làm chủ vùng biển phía Nam, nhưng đến đầu thế kỉ VII đã **suy vong**. Ngay lập tức, con đường **giao thương** hàng hải nối liền Ấn Độ Dương và Thái Bình Dương dịch chuyển xuống vùng **eo biển** Ma-lắc-ca. Nhờ luồng gió mùa thổi đều đặn theo mùa, hàng loạt quốc gia **phong kiến** mới đã trỗi dậy ở cả vùng lục địa lẫn vùng hải đảo.",
          "feynman_explanation": {
            "dialogue_question": "Tại sao chỉ vì một cái eo biển Ma-lắc-ca mà cả bản đồ Đông Nam Á thay đổi?",
            "dialogue_answer": "Con hãy tưởng tượng tàu buôn thời xưa giống như xe tải đường dài chạy từ Ấn Độ sang Trung Quốc. Khi trạm dừng chân cũ (Phù Nam) đóng cửa, tất cả xe tải buộc phải đi tắt qua con hẻm độc đạo mang tên Eo biển Ma-lắc-ca!",
            "metacognition_modeling": "Ba làm mẫu (Think-Aloud): Khi đọc đoạn này, ba gạch chân ngay cụm Phù Nam suy vong [P] và eo biển Ma-lắc-ca [*]."
          }
        },
        {
          "chunk_id": "ls7-b6-chunk-2",
          "order": 2,
          "title": "Chặng 2: Hai mô hình vương quốc — Nông nghiệp sông lớn & Thương cảng hải đảo",
          "original_text": "Từ thế kỉ VII đến thế kỉ X, các vương quốc Đông Nam Á phát triển theo hai nhánh rõ rệt. Ở vùng **lục địa**, các quốc gia như Pa-gan, Đva-ra-va-ti, Chân Lạp và Đại Cồ Việt hình thành trên những **lưu vực** sông lớn màu mỡ, lấy nông nghiệp trồng lúa nước làm gốc. Ngược lại, ở vùng **hải đảo**, vương quốc Sri Vi-giay-a lại vươn lên **cường thịnh** nhờ kiểm soát toàn bộ tàu thuyền qua lại eo biển Ma-lắc-ca.",
          "feynman_explanation": {
            "dialogue_question": "Cùng ở Đông Nam Á mà sao người làm ruộng, người lại đi thu phí tàu biển?",
            "dialogue_answer": "Giống như hai người bạn khởi nghiệp dựa vào vốn tự có của nhà mình: nhà ở đồng bằng sông lớn thì trồng lúa, nhà ở ngoài đảo ngay mặt tiền đường biển quốc tế thì mở cảng thu thuế và bán gia vị!",
            "metacognition_modeling": "Ba làm mẫu (Think-Aloud): Ba thấy từ Ngược lại — đây là dấu hiệu so sánh đối lập [*] giữa Lục địa và Hải đảo."
          }
        },
        {
          "chunk_id": "ls7-b6-chunk-3",
          "order": 3,
          "title": "Chặng 3: Mạng lưới gia vị và giao lưu văn hóa rực rỡ",
          "original_text": "Không chỉ thu thuế tàu buôn, các thương cảng Đông Nam Á còn cung cấp những **đặc sản** quý hiếm như trầm hương, đinh hương, nhục đậu khấu và hồ tiêu. Thông qua các chuyến tàu buôn, Phật giáo và Ấn Độ giáo cùng chữ Phạn được **du nhập** hòa quyện với tín ngưỡng **bản địa**, tạo nên những công trình kiến trúc kỳ vĩ như đền Bô-rô-bu-đua.",
          "feynman_explanation": {
            "dialogue_question": "Tại sao đi buôn hạt tiêu, trầm hương mà lại xây được cả đại bảo tháp Phật giáo Bô-rô-bu-đua?",
            "dialogue_answer": "Vì thời xưa tàu buôn phải nằm chờ gió mùa đổi chiều mất mấy tháng ở cảng! Các nhà sư và học giả Ấn Độ đi cùng tàu đã truyền dạy chữ viết, kiến trúc và tôn giáo.",
            "metacognition_modeling": "Ba làm mẫu (Think-Aloud): Ba đánh dấu [!] vì bất ngờ khi hạt tiêu quý ngang vàng, và [KL] cho bài học: Giao thương kinh tế luôn kéo theo giao lưu văn hóa!"
          }
        }
      ],
      "evaluating": {
        "qar_questions": [
          {
            "type": "right_there",
            "level_label": "Cấp độ 1: Tìm ngay trong bài (Right There)",
            "question": "Sau khi vương quốc Phù Nam suy vong vào đầu thế kỉ VII, con đường giao thương hàng hải quốc tế đã dịch chuyển xuống khu vực eo biển nào?",
            "hint": "Con nhìn lại Chặng 1, câu thứ 3 có in đậm chữ eo biển nhé!"
          },
          {
            "type": "think_search",
            "level_label": "Cấp độ 2: Tổng hợp & Xâu chuỗi (Think & Search)",
            "question": "Hãy so sánh điểm khác biệt cốt lõi về cơ sở kinh tế giữa các vương quốc ở vùng lục địa và vương quốc ở vùng hải đảo.",
            "hint": "Kết hợp hai nửa của Chặng 2: Lưu vực sông lớn vs. Eo biển thương cảng."
          },
          {
            "type": "author_and_me",
            "level_label": "Cấp độ 3: Suy luận & Liên hệ (Author & Me)",
            "question": "Theo con, Việt Nam ngày nay có thể học được bài học gì từ sự cường thịnh của các vương quốc thương cảng xưa?",
            "hint": "Nghĩ về phát triển cảng biển nước sâu, hậu cần hàng hải và mở cửa giao thương."
          }
        ],
        "mindmap_matrix": [
          { "category": "1. Bối cảnh lịch sử (Thế kỉ VII - X)", "prompt": "Chuyện gì xảy ra với Phù Nam và tuyến đường biển dịch chuyển đi đâu?" },
          { "category": "2. Nhóm vương quốc Lục địa", "prompt": "Gồm những nước nào và làm giàu bằng nghề gì?" },
          { "category": "3. Nhóm vương quốc Hải đảo", "prompt": "Đại diện tiêu biểu là ai và nguồn thu chính từ đâu?" },
          { "category": "4. Thành tựu Văn hóa - Tôn giáo", "prompt": "Tiếp thu tôn giáo nào và để lại công trình tiêu biểu gì?" }
        ],
        "reflection_321": {
          "three_learned": [
            "Các vương quốc phong kiến Đông Nam Á hình thành mạnh mẽ từ thế kỉ VII đến thế kỉ X.",
            "Có 2 mô hình kinh tế chính: Nông nghiệp lúa nước (lục địa) và Thương mại hàng hải (hải đảo).",
            "Con đường buôn bán gia vị trên biển đồng thời là con đường truyền bá Phật giáo và Ấn Độ giáo."
          ],
          "two_surprises": [
            "Hạt tiêu, đinh hương, trầm hương của Đông Nam Á từng được cả thế giới săn lùng như kho báu.",
            "Nhờ các thương nhân chờ gió mùa đổi chiều mà văn hóa và chữ viết lan tỏa hòa bình."
          ],
          "one_traffic_light": { "status": "green", "question": "" }
        },
        "takeaway_sentence": "Vị trí địa lí kết hợp với khả năng tận dụng lợi thế tự nhiên chính là chìa khóa tạo nên sự cường thịnh của các quốc gia Đông Nam Á."
      }
    }'::jsonb,
    true
),
(
    'Địa lí 7 - Bài 5: Vị trí địa lí, đặc điểm tự nhiên châu Á — Bức tranh thiên nhiên kỳ vĩ và phân hóa đa dạng',
    'dia-li-7-bai-5-thien-nhien-chau-a',
    'dia-ly',
    7,
    15,
    1,
    'Châu Á là châu lục rộng lớn nhất thế giới với diện tích đất liền khoảng 41,5 triệu km², trải dài từ vùng cực Bắc đến vùng xích đạo. Địa hình có vùng núi và sơn nguyên đồ sộ ở trung tâm (Hi-ma-lay-a, Tây Tạng), tạo nên sự phân hóa khí hậu và mạng lưới sông ngòi đa dạng bậc nhất.',
    '{
      "metacognition_version": "3-phase-v1",
      "subject": "Địa lí",
      "grade": 7,
      "target_time_minutes": 15,
      "planning": {
        "active_recall_question": "Khi nhắc đến châu Á — châu lục rộng lớn nhất thế giới nơi chúng ta đang sống, con nhớ ngay đến kỷ lục tự nhiên nào?",
        "prediction_prompt": "Vì sao cùng nằm ở châu Á nhưng người dân Việt Nam đón gió mùa ẩm, trong khi vùng Xi-bia chịu lạnh -40°C và vùng Tây Nam Á lại toàn sa mạc cát nóng?"
      },
      "chunks": [
        {
          "chunk_id": "dl7-b5-chunk-1",
          "order": 1,
          "title": "Chặng 1: Kích thước khổng lồ và địa hình Nóc nhà thế giới",
          "original_text": "Châu Á là châu lục rộng lớn nhất thế giới với diện tích phần đất liền khoảng 41,5 triệu km², trải dài từ vùng cực Bắc băng giá đến tận vùng xích đạo nóng ẩm. Địa hình châu Á vô cùng **hiểm trở** và bị **chia cắt** phức tạp: ở chính giữa là vùng núi và **sơn nguyên** đồ sộ cao bậc nhất hành tinh như dãy Hi-ma-lay-a và sơn nguyên Tây Tạng.",
          "feynman_explanation": {
            "dialogue_question": "Tại sao vùng núi cao nhất châu Á lại tập trung dồn cục ở ngay vùng trung tâm?",
            "dialogue_answer": "Con hãy hình dung ở giữa châu Á có một chiếc mái nhà khổng lồ (Tây Tạng & Hi-ma-lay-a). Từ chiếc mái nhà đó, các dãy núi và dòng sông lớn tỏa ra bốn phía chảy xuống các đồng bằng xung quanh!",
            "metacognition_modeling": "Ba làm mẫu (Think-Aloud): Đọc cụm trải dài từ cực Bắc đến xích đạo, ba đánh dấu [P] dự đoán ngay: Trải dài nhiều vĩ độ thì khí hậu chắc chắn có đủ mọi đới!"
          }
        }
      ],
      "evaluating": {
        "qar_questions": [
          {
            "type": "right_there",
            "level_label": "Cấp độ 1: Tìm ngay trong bài (Right There)",
            "question": "Diện tích phần đất liền của châu Á là bao nhiêu và dãy núi nào sở hữu đỉnh núi cao nhất thế giới?",
            "hint": "Xem lại Chặng 1 (41,5 triệu km² và dãy Hi-ma-lay-a)."
          }
        ],
        "mindmap_matrix": [
          { "category": "1. Vị trí & Địa hình châu Á", "prompt": "Kích thước ra sao? Vùng trung tâm và vùng rìa có địa hình gì?" }
        ],
        "reflection_321": {
          "three_learned": ["Châu Á rộng 41,5 triệu km², có đỉnh Everest cao 8.848m."],
          "two_surprises": ["Dãy Hi-ma-lay-a chắn hơi ẩm biển làm nội địa khô hạn."],
          "one_traffic_light": { "status": "green", "question": "" }
        },
        "takeaway_sentence": "Lãnh thổ trải dài từ cực Bắc đến xích đạo cùng địa hình núi cao trung tâm đã tạo nên sự phân hóa tự nhiên đa dạng bậc nhất của châu Á."
      }
    }'::jsonb,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_raw = EXCLUDED.content_raw,
    structured_data = EXCLUDED.structured_data,
    updated_at = now();

