/**
 * DATABASE SEED RUNNER for Doc_Hieu_Tieng_Viet
 *
 * Run with:  npm run seed
 * (which executes: tsx --env-file=.env.local src/lib/supabase/seed.ts)
 *
 * Requires tables to be created in Supabase first via DDL SQL.
 */

// Load env is handled by tsx --env-file=.env.local
import { createClient } from '@supabase/supabase-js';

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const HAN_VIET_ROOTS = [
  { hanzi: '逆', reading_vi: 'Nghịch', root_meaning: 'Trái ngược, chống lại' },
  { hanzi: '理', reading_vi: 'Lý', root_meaning: 'Lẽ phải, quy luật' },
  { hanzi: '悲', reading_vi: 'Bi', root_meaning: 'Buồn bã, đau khổ' },
  { hanzi: '觀', reading_vi: 'Quan', root_meaning: 'Nhìn, quan sát, thái độ' },
  { hanzi: '樂', reading_vi: 'Lạc', root_meaning: 'Vui vẻ, hạnh phúc' },
  { hanzi: '仁', reading_vi: 'Nhân', root_meaning: 'Lòng thương người' },
  { hanzi: '道', reading_vi: 'Đạo', root_meaning: 'Đường lối, nguyên tắc' },
  { hanzi: '獨', reading_vi: 'Độc', root_meaning: 'Một mình, riêng biệt' },
  { hanzi: '立', reading_vi: 'Lập', root_meaning: 'Đứng vững, xác lập' },
  { hanzi: '復', reading_vi: 'Phục', root_meaning: 'Khôi phục, trở lại' },
  { hanzi: '興', reading_vi: 'Hưng', root_meaning: 'Thịnh vượng, phát triển' },
  { hanzi: '霸', reading_vi: 'Bá', root_meaning: 'Bá chủ, thống trị' },
  { hanzi: '權', reading_vi: 'Quyền', root_meaning: 'Quyền lực, quyền hạn' },
  { hanzi: '海', reading_vi: 'Hải', root_meaning: 'Biển, đại dương' },
  { hanzi: '燈', reading_vi: 'Đăng', root_meaning: 'Cây đèn, ánh sáng' },
  { hanzi: '氣', reading_vi: 'Khí', root_meaning: 'Hơi, khí, không khí' },
  { hanzi: '壓', reading_vi: 'Áp', root_meaning: 'Áp lực, sức đè' },
  { hanzi: '水', reading_vi: 'Thủy', root_meaning: 'Nước' },
  { hanzi: '潮', reading_vi: 'Triều', root_meaning: 'Thủy triều, dòng chảy' },
  { hanzi: '生', reading_vi: 'Sinh', root_meaning: 'Sự sống, sinh vật' },
  { hanzi: '圈', reading_vi: 'Quyển', root_meaning: 'Vòng, tầng, lớp' },
  { hanzi: '保', reading_vi: 'Bảo', root_meaning: 'Giữ gìn, bảo vệ' },
  { hanzi: '存', reading_vi: 'Tồn', root_meaning: 'Tồn tại, duy trì' },
  { hanzi: '改', reading_vi: 'Cải', root_meaning: 'Thay đổi, sửa đổi' },
  { hanzi: '革', reading_vi: 'Cách', root_meaning: 'Cách mạng, cải cách' },
  { hanzi: '善', reading_vi: 'Thiện', root_meaning: 'Tốt lành, lòng tốt' },
  { hanzi: '志', reading_vi: 'Chí', root_meaning: 'Ý chí, mục tiêu' },
  { hanzi: '遠', reading_vi: 'Viễn', root_meaning: 'Xa, tương lai' },
  { hanzi: '景', reading_vi: 'Cảnh', root_meaning: 'Cảnh vật, tình cảnh' },
  { hanzi: '固', reading_vi: 'Cố', root_meaning: 'Vững chắc, lâu bền' },
];

const HAN_VIET_COMPOUNDS = [
  {
    word: 'Nghịch lý', slug: 'nghich-ly',
    full_meaning: 'Điều trái với logic thông thường nhưng lại đúng',
    example_sentence: 'Sự bình yên trong mắt bão là một nghịch lý của thiên nhiên.',
    math_formula: 'Nghịch (trái ngược) + Lý (quy luật) → Điều trái với quy luật thông thường',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: 'Từ nào dưới đây mang nghĩa gần với "Nghịch lý"?', options: [{ text: 'Mâu thuẫn', is_correct: true }, { text: 'Hài hòa', is_correct: false }, { text: 'Tuần tự', is_correct: false }, { text: 'Logic', is_correct: false }], explanation: 'Nghịch lý là điều trái với quy luật, tương tự như mâu thuẫn — hai điều đối lập cùng tồn tại.' },
  },
  {
    word: 'Bi quan', slug: 'bi-quan',
    full_meaning: 'Nhìn mọi việc theo hướng xấu, thiếu hy vọng',
    example_sentence: 'Đừng bi quan, mọi khó khăn rồi sẽ qua đi.',
    math_formula: 'Bi (buồn bã) + Quan (nhìn nhận) → Nhìn đời theo hướng u tối',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: 'Trái nghĩa với "Bi quan" là gì?', options: [{ text: 'Lạc quan', is_correct: true }, { text: 'Thất vọng', is_correct: false }, { text: 'Lo lắng', is_correct: false }, { text: 'Buồn bã', is_correct: false }], explanation: 'Trái với bi quan (nhìn u tối) là lạc quan (nhìn tươi sáng).' },
  },
  {
    word: 'Lạc quan', slug: 'lac-quan',
    full_meaning: 'Nhìn mọi việc theo hướng tích cực, đầy hy vọng',
    example_sentence: 'Người lạc quan luôn tìm thấy cơ hội trong khó khăn.',
    math_formula: 'Lạc (vui vẻ) + Quan (nhìn nhận) → Nhìn đời theo hướng tươi sáng',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: 'Người "Lạc quan" thường có thái độ như thế nào?', options: [{ text: 'Luôn tin vào điều tốt đẹp', is_correct: true }, { text: 'Hay lo lắng, sợ hãi', is_correct: false }, { text: 'Thờ ơ với mọi việc', is_correct: false }, { text: 'Bi quan về tương lai', is_correct: false }], explanation: 'Lạc quan nghĩa là luôn nhìn về phía tích cực và tin vào kết quả tốt đẹp.' },
  },
  {
    word: 'Nhân đạo', slug: 'nhan-dao',
    full_meaning: 'Tinh thần thương yêu, tôn trọng phẩm giá con người',
    example_sentence: 'Hành động nhân đạo là trao áo ấm cho người nghèo trong mùa đông.',
    math_formula: 'Nhân (lòng thương người) + Đạo (đường lối) → Đường lối lấy lòng thương người làm trọng',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: 'Hoạt động nào dưới đây thể hiện tinh thần "Nhân đạo"?', options: [{ text: 'Quyên góp ủng hộ nạn nhân lũ lụt', is_correct: true }, { text: 'Thi đấu thể thao', is_correct: false }, { text: 'Học bài chuẩn bị thi', is_correct: false }, { text: 'Xem phim giải trí', is_correct: false }], explanation: 'Nhân đạo là hành động xuất phát từ lòng thương yêu con người.' },
  },
  {
    word: 'Độc lập', slug: 'doc-lap',
    full_meaning: 'Tự mình đứng vững, không phụ thuộc vào ai',
    example_sentence: 'Ngày 2/9/1945, Việt Nam tuyên bố độc lập.',
    math_formula: 'Độc (một mình) + Lập (đứng vững) → Tự đứng vững không phụ thuộc',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: '"Độc lập" dùng để chỉ điều gì?', options: [{ text: 'Tự chủ, không lệ thuộc', is_correct: true }, { text: 'Sống một mình cô đơn', is_correct: false }, { text: 'Học tập riêng biệt', is_correct: false }, { text: 'Đứng tách khỏi đám đông', is_correct: false }], explanation: 'Độc lập là trạng thái tự chủ về chính trị, kinh tế hay cá nhân.' },
  },
  {
    word: 'Tự chủ', slug: 'tu-chu',
    full_meaning: 'Tự quyết định và điều hành bản thân, không phụ thuộc',
    example_sentence: 'Con tự chủ là con biết sắp xếp thời gian học tập.',
    math_formula: 'Tự (bản thân) + Chủ (chủ động) → Bản thân chủ động kiểm soát',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: '"Tự chủ" thể hiện điều gì?', options: [{ text: 'Tự kiểm soát và quyết định', is_correct: true }, { text: 'Phụ thuộc vào người khác', is_correct: false }, { text: 'Không quan tâm đến bản thân', is_correct: false }, { text: 'Làm theo lệnh người khác', is_correct: false }], explanation: 'Tự chủ là khả năng tự điều hành cuộc sống và quyết định của mình.' },
  },
  {
    word: 'Thiện chí', slug: 'thien-chi',
    full_meaning: 'Ý chí, lòng muốn làm điều tốt, thành ý',
    example_sentence: 'Hai nước đàm phán với thiện chí hướng đến hòa bình.',
    math_formula: 'Thiện (tốt lành) + Chí (ý chí) → Ý muốn làm điều tốt',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: '"Thiện chí" được dùng khi nào?', options: [{ text: 'Khi muốn thể hiện lòng thành và mong muốn hợp tác', is_correct: true }, { text: 'Khi tức giận và đối đầu', is_correct: false }, { text: 'Khi không quan tâm đến kết quả', is_correct: false }, { text: 'Khi từ chối đề nghị', is_correct: false }], explanation: 'Thiện chí là ý muốn tốt lành, thường dùng trong ngoại giao và hợp tác.' },
  },
  {
    word: 'Viễn cảnh', slug: 'vien-canh',
    full_meaning: 'Cảnh tượng xa, tầm nhìn về tương lai',
    example_sentence: 'Viễn cảnh của nền kinh tế xanh đang dần trở thành hiện thực.',
    math_formula: 'Viễn (xa) + Cảnh (cảnh vật) → Cảnh nhìn về phía xa, tương lai',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: '"Viễn cảnh" thường dùng để chỉ điều gì?', options: [{ text: 'Tầm nhìn về tương lai', is_correct: true }, { text: 'Cảnh vật gần đây', is_correct: false }, { text: 'Ký ức trong quá khứ', is_correct: false }, { text: 'Hiện thực đang xảy ra', is_correct: false }], explanation: 'Viễn cảnh = viễn (xa) + cảnh = tầm nhìn dài hạn, tương lai.' },
  },
  {
    word: 'Cố hữu', slug: 'co-huu',
    full_meaning: 'Sẵn có từ lâu, mang tính cố định và khó thay đổi',
    example_sentence: 'Thói quen đọc sách là đức tính cố hữu của nhà khoa học này.',
    math_formula: 'Cố (vững chắc) + Hữu (có sẵn) → Cái đã có từ trước rất vững chắc',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: '"Cố hữu" nghĩa là gì?', options: [{ text: 'Sẵn có, khó thay đổi', is_correct: true }, { text: 'Mới phát sinh gần đây', is_correct: false }, { text: 'Tạm thời, dễ thay đổi', is_correct: false }, { text: 'Được thêm vào sau này', is_correct: false }], explanation: 'Cố hữu chỉ đặc tính hoặc thói quen đã ăn sâu, khó thay đổi.' },
  },
  {
    word: 'Trực giác', slug: 'truc-giac',
    full_meaning: 'Cảm nhận trực tiếp, không qua suy luận hay phân tích',
    example_sentence: 'Trực giác của người mẹ mách bảo con mình đang gặp nguy hiểm.',
    math_formula: 'Trực (thẳng, trực tiếp) + Giác (cảm giác) → Cảm nhận thẳng không qua suy nghĩ',
    subject_tag: 'ngu-van', grade_level: 7,
    quiz_data: { question: '"Trực giác" là gì?', options: [{ text: 'Cảm nhận trực tiếp không qua phân tích', is_correct: true }, { text: 'Suy nghĩ logic có hệ thống', is_correct: false }, { text: 'Kết luận từ bằng chứng', is_correct: false }, { text: 'Ghi nhớ thông tin', is_correct: false }], explanation: 'Trực giác là cảm nhận bản năng, không qua quá trình suy luận.' },
  },
  // History & Social Studies
  {
    word: 'Phục hưng', slug: 'phuc-hung',
    full_meaning: 'Khôi phục và phát triển trở lại sau suy tàn',
    example_sentence: 'Phong trào Phục hưng châu Âu thế kỷ 14-17 đã khai sinh nền văn minh hiện đại.',
    math_formula: 'Phục (khôi phục) + Hưng (thịnh vượng) → Khôi phục sự thịnh vượng',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Phục hưng" được dùng để mô tả hiện tượng gì?', options: [{ text: 'Sự hồi sinh và phát triển trở lại', is_correct: true }, { text: 'Sự sụp đổ của một nền văn minh', is_correct: false }, { text: 'Quá trình chinh phục lãnh thổ', is_correct: false }, { text: 'Thời kỳ chiến tranh', is_correct: false }], explanation: 'Phục hưng là sự hồi sinh — phục (khôi phục) + hưng (thịnh).' },
  },
  {
    word: 'Cải cách', slug: 'cai-cach',
    full_meaning: 'Thay đổi theo hướng tốt hơn, tiến bộ hơn',
    example_sentence: 'Cải cách ruộng đất giúp nông dân có đất canh tác.',
    math_formula: 'Cải (thay đổi) + Cách (cách thức) → Thay đổi cách thức làm việc',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Cải cách" có nghĩa là gì?', options: [{ text: 'Đổi mới để tiến bộ hơn', is_correct: true }, { text: 'Phá hủy cái cũ', is_correct: false }, { text: 'Giữ nguyên hiện trạng', is_correct: false }, { text: 'Quay về quá khứ', is_correct: false }], explanation: 'Cải cách là sự thay đổi có chủ đích nhằm cải thiện tình hình.' },
  },
  {
    word: 'Bá quyền', slug: 'ba-quyen',
    full_meaning: 'Quyền lực thống trị, chi phối các nước khác',
    example_sentence: 'Các nước nhỏ phải đối mặt với tham vọng bá quyền của cường quốc.',
    math_formula: 'Bá (bá chủ) + Quyền (quyền lực) → Quyền lực của kẻ thống trị',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: 'Từ "Bá quyền" thường dùng trong ngữ cảnh nào?', options: [{ text: 'Quan hệ quốc tế và chính trị thế giới', is_correct: true }, { text: 'Cuộc sống gia đình', is_correct: false }, { text: 'Hoạt động thể thao', is_correct: false }, { text: 'Học tập trường học', is_correct: false }], explanation: 'Bá quyền là khái niệm chính trị chỉ sức mạnh thống trị quốc tế.' },
  },
  {
    word: 'Khởi nghĩa', slug: 'khoi-nghia',
    full_meaning: 'Nổi dậy đấu tranh có tổ chức chống lại kẻ thù hay áp bức',
    example_sentence: 'Khởi nghĩa Lam Sơn do Lê Lợi lãnh đạo giải phóng đất nước.',
    math_formula: 'Khởi (bắt đầu) + Nghĩa (chính nghĩa) → Bắt đầu cuộc chiến vì chính nghĩa',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Khởi nghĩa" có nghĩa là gì?', options: [{ text: 'Nổi dậy đấu tranh có tổ chức', is_correct: true }, { text: 'Từ bỏ đất nước', is_correct: false }, { text: 'Đàm phán hòa bình', is_correct: false }, { text: 'Xây dựng đất nước', is_correct: false }], explanation: 'Khởi nghĩa là bắt đầu (khởi) cuộc chiến đấu vì chính nghĩa (nghĩa).' },
  },
  {
    word: 'Thuộc địa', slug: 'thuoc-dia',
    full_meaning: 'Vùng lãnh thổ bị nước khác chiếm đóng và thống trị',
    example_sentence: 'Việt Nam từng là thuộc địa của Pháp trong gần 100 năm.',
    math_formula: 'Thuộc (thuộc về) + Địa (đất đai) → Đất đai thuộc về nước khác',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Thuộc địa" là khái niệm dùng để chỉ gì?', options: [{ text: 'Lãnh thổ bị nước khác chiếm đóng', is_correct: true }, { text: 'Vùng đất hoang sơ chưa khai phá', is_correct: false }, { text: 'Lãnh thổ mới phát hiện', is_correct: false }, { text: 'Khu vực tự trị', is_correct: false }], explanation: 'Thuộc địa là vùng đất (địa) thuộc quyền kiểm soát của nước ngoài.' },
  },
  {
    word: 'Giai cấp', slug: 'giai-cap',
    full_meaning: 'Tầng lớp xã hội có vị trí và quyền lợi kinh tế khác nhau',
    example_sentence: 'Xung đột giai cấp là nguyên nhân của nhiều cuộc cách mạng.',
    math_formula: 'Giai (bậc, tầng) + Cấp (cấp độ) → Tầng bậc trong xã hội',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Giai cấp" dùng để chỉ điều gì?', options: [{ text: 'Tầng lớp xã hội', is_correct: true }, { text: 'Trình độ học vấn', is_correct: false }, { text: 'Chức vụ trong chính phủ', is_correct: false }, { text: 'Dân tộc thiểu số', is_correct: false }], explanation: 'Giai cấp phân chia xã hội theo vị trí kinh tế và xã hội.' },
  },
  {
    word: 'Hòa hoãn', slug: 'hoa-hoan',
    full_meaning: 'Giảm căng thẳng, tạm thời đình chỉ xung đột',
    example_sentence: 'Hai bên đồng ý hòa hoãn để tiến hành đàm phán hòa bình.',
    math_formula: 'Hòa (hòa bình) + Hoãn (trì hoãn) → Tạm hoãn xung đột để hướng đến hòa bình',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Hòa hoãn" có nghĩa là gì?', options: [{ text: 'Tạm ngừng xung đột, giảm căng thẳng', is_correct: true }, { text: 'Tuyên bố chiến tranh', is_correct: false }, { text: 'Ký hiệp ước vĩnh viễn', is_correct: false }, { text: 'Cắt đứt quan hệ ngoại giao', is_correct: false }], explanation: 'Hòa hoãn là trạng thái tạm thời giảm căng thẳng giữa các bên.' },
  },
  {
    word: 'Hưng thịnh', slug: 'hung-thinh',
    full_meaning: 'Thịnh vượng và phát triển mạnh mẽ',
    example_sentence: 'Thời kỳ hưng thịnh của nhà Lý kéo dài gần 200 năm.',
    math_formula: 'Hưng (phát triển) + Thịnh (thịnh vượng) → Phát triển đến mức thịnh vượng',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Hưng thịnh" mô tả trạng thái nào?', options: [{ text: 'Phát triển mạnh mẽ, thịnh vượng', is_correct: true }, { text: 'Suy tàn, yếu kém', is_correct: false }, { text: 'Bình thường, ổn định', is_correct: false }, { text: 'Bắt đầu hình thành', is_correct: false }], explanation: 'Hưng thịnh kép sức mạnh của hai từ cùng nghĩa thịnh vượng để nhấn mạnh.' },
  },
  {
    word: 'Suy vong', slug: 'suy-vong',
    full_meaning: 'Đi xuống và tan rã, mất đi sức mạnh',
    example_sentence: 'Sự xa hoa quá mức đã dẫn đến suy vong của đế chế La Mã.',
    math_formula: 'Suy (yếu đi) + Vong (mất đi) → Yếu đi rồi mất đi hoàn toàn',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Suy vong" trái nghĩa với từ nào?', options: [{ text: 'Hưng thịnh', is_correct: true }, { text: 'Sụp đổ', is_correct: false }, { text: 'Tàn lụi', is_correct: false }, { text: 'Diệt vong', is_correct: false }], explanation: 'Suy vong (yếu đi, mất) đối lập với hưng thịnh (mạnh lên, phát triển).' },
  },
  {
    word: 'Tôn giáo', slug: 'ton-giao',
    full_meaning: 'Hệ thống tín ngưỡng và thực hành thờ phụng thần linh',
    example_sentence: 'Phật giáo là tôn giáo có ảnh hưởng lớn đến văn hóa Việt Nam.',
    math_formula: 'Tôn (tôn kính) + Giáo (giáo lý) → Giáo lý được tôn kính',
    subject_tag: 'lich-su', grade_level: 7,
    quiz_data: { question: '"Tôn giáo" đề cập đến lĩnh vực nào?', options: [{ text: 'Tín ngưỡng và thờ phụng', is_correct: true }, { text: 'Luật pháp và chính trị', is_correct: false }, { text: 'Kinh tế và thương mại', is_correct: false }, { text: 'Khoa học và công nghệ', is_correct: false }], explanation: 'Tôn giáo là hệ thống niềm tin và nghi lễ hướng đến thần linh hay đấng tối cao.' },
  },
  // Geography & Science
  {
    word: 'Hải đăng', slug: 'hai-dang',
    full_meaning: 'Ngọn đèn chiếu sáng trên mặt biển dẫn đường cho tàu thuyền',
    example_sentence: 'Ngọn hải đăng sáng rực trong đêm tối, dẫn đường cho ngư dân trở về.',
    math_formula: 'Hải (biển) + Đăng (cây đèn) → Ngọn đèn soi sáng trên biển',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Hải đăng" nghĩa là gì?', options: [{ text: 'Đèn chiếu sáng trên biển', is_correct: true }, { text: 'Loài cá ở biển', is_correct: false }, { text: 'Tàu biển lớn', is_correct: false }, { text: 'Cảng biển lớn', is_correct: false }], explanation: 'Hải (biển) + Đăng (đèn) = ngọn đèn trên biển dẫn đường.' },
  },
  {
    word: 'Khí áp', slug: 'khi-ap',
    full_meaning: 'Áp lực của không khí tác động lên bề mặt Trái Đất',
    example_sentence: 'Khí áp thấp là dấu hiệu của thời tiết xấu sắp đến.',
    math_formula: 'Khí (không khí) + Áp (áp lực) → Áp lực của không khí',
    subject_tag: 'khoa-hoc', grade_level: 7,
    quiz_data: { question: '"Khí áp" đề cập đến điều gì?', options: [{ text: 'Áp lực của không khí', is_correct: true }, { text: 'Nhiệt độ không khí', is_correct: false }, { text: 'Độ ẩm không khí', is_correct: false }, { text: 'Tốc độ gió', is_correct: false }], explanation: 'Khí áp = Khí (không khí) + Áp (áp lực) = sức đè của không khí.' },
  },
  {
    word: 'Bão hòa', slug: 'bao-hoa',
    full_meaning: 'Trạng thái đã đạt mức tối đa, không thể chứa thêm',
    example_sentence: 'Dung dịch bão hòa không thể hòa tan thêm muối.',
    math_formula: 'Bão (đầy đủ, tràn ngập) + Hòa (hòa tan) → Hòa tan đến mức tối đa',
    subject_tag: 'khoa-hoc', grade_level: 7,
    quiz_data: { question: '"Bão hòa" trong khoa học chỉ trạng thái gì?', options: [{ text: 'Đạt mức tối đa, không thể thêm', is_correct: true }, { text: 'Đang ở trạng thái ban đầu', is_correct: false }, { text: 'Đang giảm dần', is_correct: false }, { text: 'Chưa đến mức trung bình', is_correct: false }], explanation: 'Bão hòa là trạng thái đã đạt giới hạn tối đa (không thể hòa tan thêm).' },
  },
  {
    word: 'Thủy triều', slug: 'thuy-trieu',
    full_meaning: 'Sự lên xuống của nước biển do lực hút của Mặt Trăng',
    example_sentence: 'Ngư dân ra khơi dựa vào chu kỳ thủy triều.',
    math_formula: 'Thủy (nước) + Triều (dòng chảy) → Dòng chảy của nước biển theo chu kỳ',
    subject_tag: 'khoa-hoc', grade_level: 7,
    quiz_data: { question: '"Thủy triều" là hiện tượng gì?', options: [{ text: 'Nước biển lên xuống theo chu kỳ', is_correct: true }, { text: 'Sóng biển do bão tạo ra', is_correct: false }, { text: 'Dòng chảy của sông', is_correct: false }, { text: 'Nước ngầm dâng lên', is_correct: false }], explanation: 'Thủy triều là chu kỳ lên xuống của mực nước biển do lực hút Mặt Trăng.' },
  },
  {
    word: 'Phong hóa', slug: 'phong-hoa',
    full_meaning: 'Quá trình đất đá bị vỡ vụn do tác động của thiên nhiên',
    example_sentence: 'Phong hóa lý học làm vỡ vụn đá mà không thay đổi thành phần hóa học.',
    math_formula: 'Phong (gió, thiên nhiên) + Hóa (biến đổi) → Biến đổi do tác động của thiên nhiên',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Phong hóa" trong địa lý là quá trình gì?', options: [{ text: 'Đất đá vỡ vụn do thiên nhiên', is_correct: true }, { text: 'Núi lửa phun trào', is_correct: false }, { text: 'Đất bị ngập lụt', is_correct: false }, { text: 'Đất được bồi đắp phù sa', is_correct: false }], explanation: 'Phong hóa là quá trình phá vỡ đất đá do gió, nước, nhiệt độ.' },
  },
  {
    word: 'Xâm thực', slug: 'xam-thuc',
    full_meaning: 'Quá trình nước mang vật liệu đất đá đi nơi khác',
    example_sentence: 'Xâm thực bờ biển làm mất dần diện tích đất ven biển.',
    math_formula: 'Xâm (xâm lấn) + Thực (ăn mòn) → Ăn mòn và lấn dần',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Xâm thực" trong địa lý chỉ hiện tượng nào?', options: [{ text: 'Nước cuốn đất đá đi nơi khác', is_correct: true }, { text: 'Đất bị nứt vỡ', is_correct: false }, { text: 'Núi hình thành', is_correct: false }, { text: 'Đất bồi đắp thêm', is_correct: false }], explanation: 'Xâm thực là quá trình nước (sông, biển, mưa) cuốn trôi vật liệu đất đá.' },
  },
  {
    word: 'Sinh quyển', slug: 'sinh-quyen',
    full_meaning: 'Tầng sự sống của Trái Đất, nơi sinh vật có thể tồn tại',
    example_sentence: 'Con người đang tàn phá sinh quyển qua việc khai thác rừng bừa bãi.',
    math_formula: 'Sinh (sự sống) + Quyển (tầng, lớp) → Tầng sự sống của Trái Đất',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Sinh quyển" là gì?', options: [{ text: 'Tầng sự sống của Trái Đất', is_correct: true }, { text: 'Bầu khí quyển', is_correct: false }, { text: 'Đại dương', is_correct: false }, { text: 'Lớp vỏ Trái Đất', is_correct: false }], explanation: 'Sinh quyển = Sinh (sự sống) + Quyển (tầng) = tầng có sự sống.' },
  },
  {
    word: 'Địa hình', slug: 'dia-hinh',
    full_meaning: 'Hình dạng và cấu trúc bề mặt đất đai của một vùng',
    example_sentence: 'Địa hình miền Bắc Việt Nam phức tạp với nhiều đồi núi.',
    math_formula: 'Địa (đất đai) + Hình (hình dạng) → Hình dạng của mặt đất',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Địa hình" dùng để mô tả điều gì?', options: [{ text: 'Hình dạng bề mặt đất đai', is_correct: true }, { text: 'Loại đất trồng trọt', is_correct: false }, { text: 'Ranh giới quốc gia', is_correct: false }, { text: 'Tài nguyên khoáng sản', is_correct: false }], explanation: 'Địa hình mô tả hình thái bề mặt Trái Đất: đồng bằng, đồi, núi...' },
  },
  {
    word: 'Lưu vực', slug: 'luu-vuc',
    full_meaning: 'Vùng đất mà nước mưa chảy về một con sông hay hồ',
    example_sentence: 'Lưu vực sông Mê Kông trải rộng qua sáu quốc gia.',
    math_formula: 'Lưu (dòng chảy) + Vực (vùng trũng) → Vùng trũng thu dòng chảy về',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Lưu vực" là gì?', options: [{ text: 'Vùng đất tập trung nước về một con sông', is_correct: true }, { text: 'Vùng ngập lụt thường xuyên', is_correct: false }, { text: 'Lòng sông', is_correct: false }, { text: 'Bãi cát ven sông', is_correct: false }], explanation: 'Lưu vực là toàn bộ vùng đất mà nước mưa chảy về một hệ thống sông.' },
  },
  {
    word: 'Bảo tồn', slug: 'bao-ton',
    full_meaning: 'Giữ gìn và duy trì để không bị mất đi',
    example_sentence: 'Bảo tồn rừng ngập mặn giúp bảo vệ bờ biển khỏi xói lở.',
    math_formula: 'Bảo (giữ gìn) + Tồn (tồn tại) → Giữ gìn để tồn tại',
    subject_tag: 'dia-ly', grade_level: 7,
    quiz_data: { question: '"Bảo tồn" có nghĩa gần nhất với từ nào?', options: [{ text: 'Gìn giữ', is_correct: true }, { text: 'Phá hủy', is_correct: false }, { text: 'Phát triển', is_correct: false }, { text: 'Sử dụng', is_correct: false }], explanation: 'Bảo tồn = giữ gìn + duy trì sự tồn tại.' },
  },
];

const ARTICLE_STRUCTURED_DATA = {
  article_meta: { slug: 'nghich-ly-mat-bao', topic: 'Extreme Weather Phenomena', target_grade: 7, word_count: 215, estimated_minutes: 15 },
  step_1_think_aloud: {
    paragraphs: [
      { id: 'p1', actor: 'parent', text: "Giữa một cơn bão nhiệt đới dữ dội với sức gió giật cấp 12 và sóng biển cuộn trào, tồn tại một khu vực kỳ lạ được gọi là 'mắt bão'. Trái ngược hoàn toàn với khung cảnh hỗn loạn xung quanh, vùng trung tâm này lại lặng gió, trời quang đãng và đôi khi có cả ánh nắng le lói chiếu rọi.", parent_coaching: { say_aloud_script: "Đoạn này cha hình dung ra biển động dữ dội, nhưng tác giả lại dùng cụm từ 'mắt bão'. Cha nghĩ thầm: Tại sao lại gọi là mắt?", pedagogical_focus: 'Highlight the sharp contrast between violent storm and calm eye.' } },
      { id: 'p2', actor: 'student', text: "Tuy nhiên, sự yên bình đó thực chất chỉ là một ảo ảnh đánh lừa thị giác. Bao bọc ngay sát mắt bão là 'thành mắt bão' – bức tường mây khổng lồ quay cuồng với vận tốc khủng khiếp nhất của toàn bộ cơn bão.", parent_coaching: { ask_child_prompt: "Khi con đọc cụm 'ảo ảnh đánh lừa thị giác', con hiểu tại sao tác giả lại bảo sự bình yên này là lừa dối?", visual_hint: 'Guide the child to imagine a rotating vortex.' } },
    ],
  },
  inline_vocabulary: [{ word: 'Nghịch lý', compound_slug: 'nghich-ly', anchor_text: 'nghịch lý' }],
  step_2_graphic_organizer: {
    type: 'cause_and_effect', title: 'Sơ đồ chuyển động của Mắt Bão',
    slots: [{ id: 'slot_1', label: 'Hiện tượng tại Mắt Bão', expected_card_id: 'card_center' }, { id: 'slot_2', label: 'Thành Mắt Bão xung quanh', expected_card_id: 'card_wall' }, { id: 'slot_3', label: 'Hậu quả khi Mắt Bão đi qua', expected_card_id: 'card_effect' }],
    cards: [{ id: 'card_center', text: 'Mắt bão lặng gió, hửng nắng tạo cảm giác bão đã tan' }, { id: 'card_wall', text: 'Thành mắt bão bao quanh sở hữu gió giật cuồng nộ nhất' }, { id: 'card_effect', text: 'Gió dữ dội bất ngờ giật theo hướng ngược lại xé toạc mọi thứ' }],
  },
  step_3_reciprocal_cards: [
    { role: 'Predict', task: 'Nhìn vào sơ đồ bão, sai lầm nguy hiểm nhất mà một thuyền trưởng có thể mắc phải là gì?' },
    { role: 'Clarify', task: "Giải thích cho bố nghe sự khác biệt cấu trúc giữa 'Mắt Bão' và 'Thành Mắt Bão'." },
    { role: 'Question', task: 'Hãy đóng vai giáo viên và đặt một câu hỏi thật khó để kiểm tra sự hiểu bài của bố!' },
    { role: 'Summarize', task: 'Tóm tắt bài học sinh tồn cốt lõi từ đoạn văn này trong đúng một câu.' },
  ],
  step_4_qar_questions: [
    { id: 'qar_1', level: 'right_there', level_name: 'Right There (Đọc thẳng)', color_tag: 'amber-500', question: 'Khu vực nào trong cơn bão có vận tốc gió khủng khiếp nhất?', options: ['Mắt bão', 'Thành mắt bão', 'Rìa ngoài bão', 'Các đám mây tầng cao'], correct_index: 1, text_anchor: 'quay cuồng với vận tốc khủng khiếp nhất' },
    { id: 'qar_2', level: 'think_and_search', level_name: 'Think & Search (Suy luận)', color_tag: 'emerald-500', question: "Tại sao tác giả lại gọi sự bình yên trong mắt bão là một 'ảo ảnh'?", options: ['Vì thực tế trong đó vẫn có sấm chớp lớn', 'Vì nó diễn ra ngắn ngủi và ngay sau đó là gió cuồng phong giật ngược chiều', 'Vì mắt bão chỉ nhìn thấy được từ ảnh chụp vệ tinh', 'Vì mắt người không thể quan sát được tâm bão'], correct_index: 1, text_anchor: 'ảo ảnh đánh lừa thị giác' },
    { id: 'qar_3', level: 'author_and_me', level_name: 'Author & Me (Suy nghĩ sâu)', color_tag: 'purple-500', question: 'Nếu thấy trời bỗng nhiên hửng nắng và lặng gió giữa tâm bão, người dân vội chạy ra ngoài thu dọn đồ đạc thì nguy hiểm gì có thể xảy ra?', open_ended: true, evaluation_criteria: 'Con phải nêu được: Sự bình yên là tạm thời; Thành mắt bão đang tiến đến với gió giật ngược chiều cực mạnh.' },
  ],
  step_5_screen_to_paper: {
    handwritten_task: 'Vẽ mắt bão hình tròn trên tờ giấy trắng, dùng hai mũi tên cong ngược chiều để minh họa cách gió đổi chiều khi thành mắt bão đi qua.',
    offline_books: [{ title: 'Horrible Science - Bão Táp Cuồng Phong', author: 'Anita Ganeri', publisher: 'NXB Trẻ', highlight: 'Chương 4 giải thích cơ chế đối lưu nhiệt và quá trình hình thành bão nhiệt đới.' }],
  },
};

export const ARTICLE_SEED_DATA = {
  id: '3b6bfae6-3710-4b51-8292-7ca1ab13dad9',
  title: 'Nghịch Lý Mắt Bão',
  slug: 'nghich-ly-mat-bao',
  category: 'thoi-tiet',
  target_grade: 7,
  estimated_minutes: 15,
  hero_image_url: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800',
  content_raw: "Giữa một cơn bão nhiệt đới dữ dội với sức gió giật cấp 12 và sóng biển cuộn trào, tồn tại một khu vực kỳ lạ được gọi là 'mắt bão'. Trái ngược hoàn toàn với khung cảnh hỗn loạn xung quanh, vùng trung tâm này lại lặng gió, trời quang đãng và đôi khi có cả ánh nắng le lói chiếu rọi.\n\nTuy nhiên, sự yên bình đó thực chất chỉ là một ảo ảnh đánh lừa thị giác. Bao bọc ngay sát mắt bão là 'thành mắt bão' – bức tường mây khổng lồ quay cuồng với vận tốc khủng khiếp nhất của toàn bộ cơn bão.",
  structured_data: ARTICLE_STRUCTURED_DATA,
  is_published: true,
};
export const HAN_VIET_COMPOUNDS_SEED = HAN_VIET_COMPOUNDS;
export const HAN_VIET_ROOTS_SEED = HAN_VIET_ROOTS;

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ ERROR: Missing Supabase credentials in .env.local');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ found' : '✗ MISSING');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓ found' : '✗ MISSING');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n🌱 ===== DOC_HIEU_TIENG_VIET — DATABASE SEED =====');
  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  console.log('');

  // ── 1. Upsert han_viet_roots ───────────────────────────────────────────────
  console.log(`📖 [1/4] Inserting ${HAN_VIET_ROOTS.length} Han-Viet root morphemes...`);
  const { data: rootsData, error: rootsError } = await supabase
    .from('han_viet_roots')
    .upsert(HAN_VIET_ROOTS, { onConflict: 'reading_vi', ignoreDuplicates: false })
    .select('id, reading_vi');

  if (rootsError) {
    console.error('❌ Failed to insert roots:', rootsError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${rootsData?.length ?? 0} roots inserted/updated`);

  // Build a lookup map: reading_vi → id
  const rootMap: Record<string, string> = {};
  (rootsData ?? []).forEach((r) => { rootMap[r.reading_vi] = r.id; });

  // ── 2. Upsert han_viet_compounds ──────────────────────────────────────────
  console.log(`\n📚 [2/4] Inserting ${HAN_VIET_COMPOUNDS.length} Han-Viet compounds...`);
  const compoundsPayload = HAN_VIET_COMPOUNDS.map(({ ...c }) => ({
    word: c.word,
    slug: c.slug,
    full_meaning: c.full_meaning,
    example_sentence: c.example_sentence,
    math_formula: c.math_formula,
    subject_tag: c.subject_tag,
    grade_level: c.grade_level,
    quiz_data: c.quiz_data,
  }));

  const { data: compoundsData, error: compoundsError } = await supabase
    .from('han_viet_compounds')
    .upsert(compoundsPayload, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id, slug, word');

  if (compoundsError) {
    console.error('❌ Failed to insert compounds:', compoundsError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${compoundsData?.length ?? 0} compounds inserted/updated:`);
  compoundsData?.forEach((c) => console.log(`      • ${c.word} (${c.slug})`));

  // ── 3. Upsert compound_root_links ─────────────────────────────────────────
  console.log('\n🔗 [3/4] Linking compounds to their root morphemes...');
  const linksPayload: Array<{ compound_id: string; root_id: string; position_order: number; related_words: string[] }> = [];

  for (const compound of HAN_VIET_COMPOUNDS) {
    const compoundRecord = compoundsData?.find((c) => c.slug === compound.slug);
    if (!compoundRecord) continue;

    const words = compound.word.split(' ');
    const r1 = words[0];
    const r2 = words[1];

    // Find matching root IDs (case-insensitive match)
    const root1Id = Object.entries(rootMap).find(([k]) => k.toLowerCase() === r1?.toLowerCase())?.[1];
    const root2Id = r2 ? Object.entries(rootMap).find(([k]) => k.toLowerCase() === r2?.toLowerCase())?.[1] : null;

    if (root1Id) {
      linksPayload.push({ compound_id: compoundRecord.id, root_id: root1Id, position_order: 1, related_words: [] });
    }
    if (root2Id) {
      linksPayload.push({ compound_id: compoundRecord.id, root_id: root2Id, position_order: 2, related_words: [] });
    }
  }

  if (linksPayload.length > 0) {
    const { error: linksError } = await supabase
      .from('compound_root_links')
      .upsert(linksPayload, { ignoreDuplicates: true });

    if (linksError) {
      console.warn('⚠️  Links insert warning (may be duplicates):', linksError.message);
    } else {
      console.log(`   ✅ ${linksPayload.length} root-compound links created`);
    }
  }

  // ── 4. Upsert reading article ─────────────────────────────────────────────
  console.log('\n📰 [4/4] Inserting article "Nghịch Lý Mắt Bão"...');
  const articlePayload = {
    title: 'Nghịch Lý Mắt Bão',
    slug: 'nghich-ly-mat-bao',
    category: 'thoi-tiet',
    target_grade: 7,
    estimated_minutes: 15,
    hero_image_url: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800',
    content_raw: "Giữa một cơn bão nhiệt đới dữ dội với sức gió giật cấp 12 và sóng biển cuộn trào, tồn tại một khu vực kỳ lạ được gọi là 'mắt bão'. Trái ngược hoàn toàn với khung cảnh hỗn loạn xung quanh, vùng trung tâm này lại lặng gió, trời quang đãng và đôi khi có cả ánh nắng le lói chiếu rọi.\n\nTuy nhiên, sự yên bình đó thực chất chỉ là một ảo ảnh đánh lừa thị giác. Bao bọc ngay sát mắt bão là 'thành mắt bão' – bức tường mây khổng lồ quay cuồng với vận tốc khủng khiếp nhất của toàn bộ cơn bão.",
    structured_data: ARTICLE_STRUCTURED_DATA,
    is_published: true,
  };

  const { data: articleData, error: articleError } = await supabase
    .from('reading_articles')
    .upsert(articlePayload, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id, title, slug');

  if (articleError) {
    console.error('❌ Failed to insert article:', articleError.message);
    process.exit(1);
  }
  console.log(`   ✅ Article inserted: "${articleData?.[0]?.title}" (id: ${articleData?.[0]?.id})`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n🎉 ===== SEED COMPLETE =====');
  console.log(`   📖 Reading articles:  1`);
  console.log(`   🈯 Han-Viet roots:    ${rootsData?.length ?? 0}`);
  console.log(`   📚 Han-Viet compounds: ${compoundsData?.length ?? 0}`);
  console.log(`   🔗 Root-compound links: ${linksPayload.length}`);
  console.log('\n✅ Database is ready. Run `npm run dev` to start the app.\n');
}

if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  main().catch((err) => {
    console.error('\n💥 Seed failed with error:', err);
    process.exit(1);
  });
}
