import { deepNormalizeVietnamese } from '@/lib/utils/vietnamese-text';

export type ProverbPillar = 'nature_labor' | 'morality_society' | 'skills_conduct';

export interface ProverbItem {
  id: string;
  proverb: string;
  pillar: ProverbPillar;
  sub_category: string;
  literal_meaning: string;
  figurative_meaning: string;
  life_skill_note: string;
  dialectical_view: string;
  essay_evidence_usage: string;
  sample_sentence: string;
  english_anchor: string;
  keywords: string[];
  is_featured: boolean;
  created_at?: string;
}

export const PROVERB_PILLAR_META: Record<
  ProverbPillar,
  {
    label: string;
    shortLabel: string;
    emoji: string;
    description: string;
    badgeClass: string;
    activeTabClass: string;
    cardAccentClass: string;
  }
> = {
  nature_labor: {
    label: 'Thiên nhiên & Lao động',
    shortLabel: 'Thiên nhiên & Lao động',
    emoji: '🌾',
    description:
      'Đúc kết quy luật mùa vụ, giá trị của nghề nghiệp chân chính và sức mạnh của sự kiên trì bền bỉ.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    activeTabClass: 'bg-emerald-600 text-white border-emerald-700 shadow-sm',
    cardAccentClass: 'border-l-4 border-l-emerald-500',
  },
  morality_society: {
    label: 'Đạo đức & Con người',
    shortLabel: 'Đạo đức & Con người',
    emoji: '❤️',
    description:
      'Gìn giữ lòng biết ơn cội nguồn, nhân cách trong sạch, ý chí tự lực và bài học tỉnh táo trước danh lợi.',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    activeTabClass: 'bg-rose-600 text-white border-rose-700 shadow-sm',
    cardAccentClass: 'border-l-4 border-l-rose-500',
  },
  skills_conduct: {
    label: 'Kỹ năng sống & Ứng xử',
    shortLabel: 'Kỹ năng sống & Ứng xử',
    emoji: '💡',
    description:
      'Nghệ thuật ứng biến thông minh, làm chủ cảm xúc, tinh tế trong giao tiếp và hợp tác trí tuệ tập thể.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    activeTabClass: 'bg-amber-500 text-white border-amber-600 shadow-sm',
    cardAccentClass: 'border-l-4 border-l-amber-500',
  },
};

const RAW_PROVERBS_SEED_DATA: ProverbItem[] = [
  // ===========================================================================
  // 1. ĐAN LỖI HÓA MIẾNG TRÁM (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-01-dan-loi-hoa-mieng-tram',
    proverb: 'Đan lỗi hóa miếng trám',
    pillar: 'skills_conduct',
    sub_category: 'Ứng biến & Xoay chuyển sai lầm',
    literal_meaning:
      'Người thợ đan lát rổ rá bằng tre nứa lỡ tay đan trật nhịp nan (đan lỗi / đan lồi), thay vì vứt bỏ thì khéo léo xoay chiều nan tre để tạo thành "miếng trám" (hình thoi trang trí hoặc miếng vá đáy thúng vừa đẹp vừa chắc).',
    figurative_meaning:
      'Gặp sự cố hay lỡ phạm sai sót trong công việc, nếu bình tĩnh và linh hoạt ứng biến thì có thể biến cái sai ban đầu thành một kết quả hữu ích, thậm chí sáng tạo bất ngờ.',
    life_skill_note:
      'Khi vẽ tranh lỡ lem một nét mực hay thuyết trình lỡ quên lời, con đừng hoảng hốt bỏ cuộc! Hãy bình tĩnh biến nét mực lem thành đám mây hoặc chiếc lá — đó chính là tư duy phát triển (Growth Mindset).',
    dialectical_view:
      'Câu tục ngữ khen ngợi sự nhanh trí khi "chữa cháy" sai sót ngoài ý muốn, nhưng KHÔNG được lạm dụng để làm việc cẩu thả, thiếu chuẩn bị rồi ngụy biện rằng mình đang sáng tạo.',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về: Sự linh hoạt ứng biến trước nghịch cảnh, thái độ biến nguy thành cơ, hoặc không đầu hàng trước sai lầm đầu tiên.',
    sample_sentence:
      'Trong hành trình học tập và sáng tạo, không ai tránh khỏi những phút lỡ nhịp, nhưng như người xưa từng đúc kết "Đan lỗi hóa miếng trám", chính sự bình tĩnh và óc ứng biến thông minh sẽ giúp ta xoay chuyển sai sót thành những giá trị mới mẻ.',
    english_anchor: 'Turn a mistake into a masterpiece / Make lemonade out of lemons',
    keywords: ['ứng biến', 'sáng tạo', 'sai lầm', 'sửa sai', 'linh hoạt'],
    is_featured: true,
  },

  // ===========================================================================
  // 2. ĐÂM LAO PHẢI THEO LAO (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-02-dam-lao-phai-theo-lao',
    proverb: 'Đâm lao phải theo lao',
    pillar: 'skills_conduct',
    sub_category: 'Quyết đoán & Trách nhiệm hành động',
    literal_meaning:
      'Người đi săn hoặc chiến sĩ thời xưa khi đã phóng ngọn giáo (cây lao) về phía mục tiêu thì phải lập tức chạy vọt theo đà cây lao để dứt điểm, không thể đứng khựng lại nửa chừng.',
    figurative_meaning:
      'Khi đã bắt tay khởi sự một công việc khó khăn hoặc đã đưa ra quyết định, ta buộc phải kiên quyết theo đuổi đến cùng để giải quyết trọn vẹn thay vì bỏ dở nửa đường.',
    life_skill_note:
      'Khi con đã nhận lời tham gia một dự án nhóm hay cuộc thi học thuật ở trường, dù giữa chừng thấy vấtả cũng hãy nỗ lực hoàn thành trọn trách nhiệm với đồng đội.',
    dialectical_view:
      'Nếu mục tiêu là đúng đắn thì "theo lao" là bản lĩnh kiên định. Ngược lại, nếu phát hiện việc mình đang làm là sai trái, nguy hiểm hoặc vi phạm đạo đức thì phải dũng cảm DỪNG LẠI ngay, tuyệt đối không "đâm lao theo lao" một cách mù quáng.',
    essay_evidence_usage:
      'Dùng làm dẫn chứng phản biện sắc bén trong bài nghị luận về: Bản lĩnh kiên định (mặt tích cực) so với sự cố chấp bảo thủ không dám nhận sai (mặt tiêu cực).',
    sample_sentence:
      'Kiên trì theo đuổi mục tiêu là phẩm chất đáng quý, nhưng người trưởng thành cần phân biệt rõ giữa lòng kiên định và sự cố chấp theo kiểu "Đâm lao phải theo lao" khi biết rõ con đường phía trước là sai lầm.',
    english_anchor: 'In for a penny, in for a pound / Follow through',
    keywords: ['quyết đoán', 'trách nhiệm', 'cố chấp', 'theo đuổi', 'bản lĩnh'],
    is_featured: true,
  },

  // ===========================================================================
  // 3. NGƯỜI CÓ CHÍ ẮT PHẢI NÊN (morality_society)
  // ===========================================================================
  {
    id: 'proverb-03-nguoi-co-chi-at-phai-nen',
    proverb: 'Người có chí ắt phải nên',
    pillar: 'morality_society',
    sub_category: 'Ý chí & Nghị lực vượt khó',
    literal_meaning:
      '"Chí" là ý chí, hoài bão bền bỉ trong lòng; "nên" là làm nên sự nghiệp, thành công trọn vẹn. Người nuôi dưỡng ý chí kiên cường chắc chắn sẽ gặt hái thành quả.',
    figurative_meaning:
      'Khẳng định sức mạnh quyết định của ý chí và nghị lực con người: xuất phát điểm có thể khó khăn, nhưng hễ có mục tiêu rõ ràng và bền lòng rèn luyện thì nhất định sẽ thành công.',
    life_skill_note:
      'Giống như thông điệp "Có chí thì nên", mỗi khi gặp môn học khó như Toán hình hay Tiếng Anh học thuật, chỉ cần con giữ vững mục tiêu mỗi ngày tiến bộ 1% thì chắc chắn sẽ chinh phục được.',
    dialectical_view:
      'Có "chí" là điều kiện tiên quyết, nhưng để "nên" việc lớn trong thời đại hôm nay, ý chí ấy phải đi kèm với phương pháp học tập khoa học, kế hoạch hành động cụ thể và sự khiêm tốn học hỏi.',
    essay_evidence_usage:
      'Dùng làm câu chốt mở bài hoặc thân bài trong các đề văn nghị luận xã hội về: Ý chí nghị lực, sức mạnh của ước mơ, và tinh thần vượt khó.',
    sample_sentence:
      'Lịch sử đã chứng minh từ thầy giáo Nguyễn Ngọc Ký đến các nhà khoa học lỗi lạc, không nghịch cảnh nào có thể khuất phục được con người bởi "Người có chí ắt phải nên".',
    english_anchor: 'Where there is a will, there is a way',
    keywords: ['ý chí', 'nghị lực', 'thành công', 'kiên trì', 'hoài bão'],
    is_featured: true,
  },

  // ===========================================================================
  // 4. UỐNG NƯỚC NHỚ NGUỒN (morality_society)
  // ===========================================================================
  {
    id: 'proverb-04-uong-nuoc-nho-nguon',
    proverb: 'Uống nước nhớ nguồn',
    pillar: 'morality_society',
    sub_category: 'Lòng biết ơn & Đạo lý cội nguồn',
    literal_meaning:
      'Khi bưng bát nước mát lành lên uống giữa ngày nắng, ta nhớ tới mạch nước ngầm trên rừng sâu, đầu nguồn suối đã âm thầm chảy về xuôi.',
    figurative_meaning:
      'Đạo lý căn bản của người Việt: Khi được thừa hưởng hòa bình, tri thức và cuộc sống ấm no hôm nay, phải luôn ghi nhớ và đền đáp công ơn của tổ tiên, cha mẹ, thầy cô và những thế hệ đi trước.',
    life_skill_note:
      'Lòng biết ơn bắt đầu từ việc rất nhỏ mỗi ngày: lời cảm ơn chân thành khi mẹ nấu bữa cơm ngon, sự trân trọng trang sách thầy cô giảng dạy, và giữ gìn truyền thống gia đình.',
    dialectical_view:
      '"Nhớ nguồn" không chỉ dừng ở lời nói suông hay hoài niệm quá khứ, mà phải thể hiện bằng hành động tiếp nối: học tập giỏi, sống tử tế để làm rạng danh "nguồn cội" và tạo dựng nguồn nước sạch cho thế hệ mai sau.',
    essay_evidence_usage:
      'Dẫn chứng kinh điển cho các đề văn nghị luận về: Lòng biết ơn, truyền thống tôn sư trọng đạo, trách nhiệm của thế hệ trẻ với lịch sử dân tộc.',
    sample_sentence:
      'Truyền thống "Uống nước nhớ nguồn" từ ngàn đời nay vẫn chảy mãi trong huyết quản dân tộc Việt, nhắc nhở thế hệ trẻ chúng em rằng mọi thành tựu hôm nay đều được vun đắp từ mồ hôi và xương máu của cha ông.',
    english_anchor: 'Gratitude is the memory of the heart / Remember the source when drinking water',
    keywords: ['biết ơn', 'cội nguồn', 'cha mẹ', 'thầy cô', 'truyền thống'],
    is_featured: true,
  },

  // ===========================================================================
  // 5. ĂN QUẢ NHỚ KẺ TRỒNG CÂY (morality_society)
  // ===========================================================================
  {
    id: 'proverb-05-an-qua-nho-ke-trong-cay',
    proverb: 'Ăn quả nhớ kẻ trồng cây',
    pillar: 'morality_society',
    sub_category: 'Lòng biết ơn & Trân trọng lao động',
    literal_meaning:
      'Khi cầm trái ngọt thơm lành trên tay để thưởng thức, hãy nhớ tới người nông dân đã vất vả gieo hạt, tưới nước, bắt sâu và chăm bón suốt nhiều năm ròng.',
    figurative_meaning:
      'Nhắc nhở con người khi thụ hưởng bất kỳ thành quả vật chất hay tinh thần nào cũng phải trân trọng công sức lao động và sự hy sinh thầm lặng của những người đã tạo ra nó.',
    life_skill_note:
      'Mỗi khi dùng chiếc máy tính, mặc bộ quần áo mới hay đi trên con đường sạch đẹp, con hiểu rằng phía sau đó là giọt mồ hôi của cha mẹ, cô chú công nhân và các nhà phát minh.',
    dialectical_view:
      'Bên cạnh việc "nhớ kẻ trồng cây", mỗi học sinh hôm nay còn phải tự rèn luyện để trở thành "người trồng cây mới" — biết gieo mầm tri thức và làm việc tốt cho cộng đồng chứ không chỉ ngồi chờ hưởng quả ngọt.',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về: Sự trân trọng giá trị sức lao động, lòng biết ơn người đi trước, và lối sống cống hiến.',
    sample_sentence:
      'Thấm nhuần lời dạy "Ăn quả nhớ kẻ trồng cây", chúng ta không chỉ trân quý những trái ngọt mà thế hệ trước để lại, mà còn tự nhủ phải gieo trồng thêm nhiều mầm xanh tri thức cho tương lai.',
    english_anchor: 'Reap the fruit, remember the planter / Appreciate others’ labor',
    keywords: ['biết ơn', 'lao động', 'thành quả', 'cống hiến', 'trân trọng'],
    is_featured: true,
  },

  // ===========================================================================
  // 6. ĐÓI CHO SẠCH, RÁCH CHO THƠM (morality_society)
  // ===========================================================================
  {
    id: 'proverb-06-doi-cho-sach-rach-cho-thom',
    proverb: 'Đói cho sạch, rách cho thơm',
    pillar: 'morality_society',
    sub_category: 'Lòng tự trọng & Nhân cách liêm chính',
    literal_meaning:
      'Dù bụng có đói vẫn phải ăn uống sạch sẽ, không ăn đồ bẩn thỉu; dù áo quần có sờn rách vì nghèo vẫn phải giặt giũ tinh tươm, thơm tho.',
    figurative_meaning:
      'Dù rơi vào hoàn cảnh thiếu thốn, khó khăn hay cám dỗ đến đâu, con người vẫn phải giữ gìn phẩm giá, lòng tự trọng và danh dự trong sáng, tuyệt đối không làm điều gian dối, xấu xa.',
    life_skill_note:
      'Trong phòng thi, thà đạt điểm số thực chất của mình để biết chỗ cần cố gắng còn hơn nhìn bài bạn để lấy điểm cao giả tạo — đó chính là "Đói cho sạch, rách cho thơm" của người học sinh tự trọng.',
    dialectical_view:
      'Câu tục ngữ đề cao sự thanh liêm trong nghịch cảnh, đồng thời thúc đẩy ta nỗ lực học tập và lao động chân chính để vừa "no ấm, lành lặn" về vật chất, vừa "sạch, thơm" về nhân cách.',
    essay_evidence_usage:
      'Dẫn chứng đắt giá cho bài nghị luận về: Lòng tự trọng, tính trung thực trong thi cử và cuộc sống, giữ gìn phẩm giá trước cám dỗ.',
    sample_sentence:
      'Giữa những cám dỗ của điểm số ảo hay lợi ích trước mắt, phương châm "Đói cho sạch, rách cho thơm" chính là chiếc la bàn đạo đức giúp mỗi người giữ trọn lòng tự trọng và sự trung thực.',
    english_anchor: 'Integrity over wealth / Better poor with honor than rich with shame',
    keywords: ['tự trọng', 'trung thực', 'nhân cách', 'danh dự', 'liêm chính'],
    is_featured: true,
  },

  // ===========================================================================
  // 7. TẰM CÓ LỨA, RUỘNG CÓ MÙA (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-07-tam-co-lua-ruong-co-mua',
    proverb: 'Tằm có lứa, ruộng có mùa',
    pillar: 'nature_labor',
    sub_category: 'Quy luật tự nhiên & Quản lý thời điểm',
    literal_meaning:
      'Con tằm phải nuôi đúng lứa (đúng chu kỳ sinh trưởng) mới nhả tơ vàng; cây lúa ngoài đồng phải gieo cấy đúng mùa vụ mới trổ bông trĩu hạt.',
    figurative_meaning:
      'Mọi sự vật trong tự nhiên và công việc của con người đều vận hành theo quy luật thời gian và giai đoạn phát triển nhất định; biết nắm bắt đúng thời điểm ("đúng độ chín") và kiên nhẫn tôn trọng quy trình thì mới thành công.',
    life_skill_note:
      'Tuổi 12 - 15 chính là "mùa vàng" để con tích lũy nền tảng ngôn ngữ, tư duy đọc hiểu và thói quen tự học. Đừng đốt cháy giai đoạn nhưng cũng đừng để mùa gieo hạt trôi qua lãng phí!',
    dialectical_view:
      'Tôn trọng quy luật mùa vụ giúp ta không nóng vội "chín ép", nhưng trong kỷ nguyên khoa học hiện đại, con người cũng cần chủ động chuẩn bị kỹ năng sớm để tự tạo ra thời cơ cho chính mình.',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về: Giá trị của thời gian tuổi trẻ, sự kiên nhẫn tích lũy theo quy luật, và biết nắm bắt thời cơ.',
    sample_sentence:
      'Ông cha ta từng nhắc nhở "Tằm có lứa, ruộng có mùa"; tuổi học trò chính là mùa xuân quý giá nhất của đời người để gieo hạt giống tri thức trước khi bước vào mùa gặt hái trưởng thành.',
    english_anchor: 'Everything has its season / Timing and natural rhythm',
    keywords: ['mùa vụ', 'thời điểm', 'quy luật', 'tuổi trẻ', 'kiên nhẫn'],
    is_featured: true,
  },

  // ===========================================================================
  // 8. RUỘNG BỀ BỀ KHÔNG BẰNG NGHỀ TRONG TAY (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-08-ruong-be-be-khong-bang-nghe-trong-tay',
    proverb: 'Ruộng bề bề không bằng nghề trong tay',
    pillar: 'nature_labor',
    sub_category: 'Giá trị năng lực & Kỹ năng thực chất',
    literal_meaning:
      '"Ruộng bề bề" là ruộng đất cò bay thẳng cánh, tài sản bề thế bên ngoài; nhưng tất cả số ruộng đất ấy cũng không quý và bền vững bằng một "nghề tinh thông" nằm ngay trong đôi bàn tay và khối óc của mình.',
    figurative_meaning:
      'Tài sản vật chất có sẵn lớn đến mấy cũng có thể hao hụt theo biến cố, chỉ có tri thức, chuyên môn và kỹ năng nghề nghiệp thực thụ trong bản thân mỗi người mới là nguồn vốn bất tận nuôi sống ta suốt đời.',
    life_skill_note:
      'Điều quý giá nhất ba mẹ trao cho con không phải là tiền bạc có sẵn, mà là việc giúp con rèn luyện "nghề trong tay" — tức là năng lực tự đọc, tự tư duy, ngoại ngữ và kỹ năng giải quyết vấn đề.',
    dialectical_view:
      'Nếu kết hợp được cả nguồn lực hỗ trợ của gia đình ("ruộng") lẫn năng lực tự thân sắc bén ("nghề trong tay") thì con người càng có bệ phóng vững chắc để đóng góp lớn cho xã hội.',
    essay_evidence_usage:
      'Dẫn chứng xuất sắc cho các bài văn nghị luận về: Tầm quan trọng của việc học tập rèn luyện kỹ năng, tinh thần tự lập không ỷ lại vào gia đình.',
    sample_sentence:
      'Trong thế giới biến động không ngừng của kỷ nguyên số, lời đúc kết "Ruộng bề bề không bằng nghề trong tay" càng trở nên chí lý: chỉ có tri thức và kỹ năng thực chất mới là điểm tựa vững bền nhất của mỗi người.',
    english_anchor: 'Skill in hand outweighs inherited wealth / Competence is the best asset',
    keywords: ['kỹ năng', 'nghề nghiệp', 'tự lập', 'năng lực', 'tri thức'],
    is_featured: true,
  },

  // ===========================================================================
  // 9. NƯỚC CHẢY ĐÁ MỀM (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-09-nuoc-chay-da-mem',
    proverb: 'Nước chảy đá mềm',
    pillar: 'nature_labor',
    sub_category: 'Sức mạnh của sự kiên trì & Mềm dẻo',
    literal_meaning:
      'Dòng nước tuy mềm mại, mỏng manh còn tảng đá suối thì rắn chắc, nhưng nước chảy mãi ngày này qua tháng khác cũng làm mặt đá nhẵn bóng, bào mòn cả đá cứng.',
    figurative_meaning:
      'Sự kiên trì, bền bỉ đều đặn mỗi ngày kết hợp với thái độ mềm mỏng, ôn hòa có thể cảm hóa được lòng người cứng rắn hoặc vượt qua những thử thách tưởng chừng bất khả thi.',
    life_skill_note:
      'Mỗi tối con đọc sâu 15 phút và học 5 từ Hán-Việt trông có vẻ nhỏ bé như giọt nước, nhưng duy trì đều đặn 365 ngày sẽ tạo nên sức mạnh "Nước chảy đá mềm", biến những văn bản khó nhất trở nên dễ hiểu.',
    dialectical_view:
      'Bên cạnh nghĩa kiên trì bền bỉ (tương tự "Nước chảy đá mòn"), chữ "Đá mềm" (theo phân tích của học giả Lê Văn Hòe) còn nhấn mạnh nghệ thuật thuyết phục bằng sự dịu dàng, chân thành thay vì dùng bạo lực hay nóng nảy.',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về: Sức mạnh của thói quen tích lũy nhỏ mỗi ngày (Kaizen), lòng kiên nhẫn, và sức mạnh cảm hóa của sự chân thành.',
    sample_sentence:
      'Không có đỉnh cao tri thức nào được chinh phục chỉ sau một đêm, nhưng với sự bền bỉ theo phương châm "Nước chảy đá mềm", những nỗ lực nhỏ bé mỗi ngày sẽ kết tinh thành kỳ tích lớn lao.',
    english_anchor: 'Constant dripping wears away the stone / Gentle persistence conquers all',
    keywords: ['kiên trì', 'bền bỉ', 'thói quen', 'mềm mỏng', 'tích lũy'],
    is_featured: true,
  },

  // ===========================================================================
  // 10. ĐÁNH CHÓ NGÓ CHÚA (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-10-danh-cho-ngo-chua',
    proverb: 'Đánh chó ngó chúa',
    pillar: 'skills_conduct',
    sub_category: 'Ứng xử tinh tế & Quan sát tổng thể',
    literal_meaning:
      'Muốn xua đuổi hay quất roi vào con chó đang sủa, người ta phải nhìn xem chủ nhà ("chúa" / chủ nuôi nó) là ai và đang đứng ở đâu để giữ lễ độ, tránh làm mất lòng người chủ.',
    figurative_meaning:
      'Khi phê bình, góp ý hay xử lý một sự việc liên quan đến người khác, cần có cái nhìn bao quát các mối quan hệ xung quanh, biết nể trọng tập thể, gia đình hoặc người đứng đầu để ứng xử khéo léo, thấu tình đạt lý.',
    life_skill_note:
      'Khi góp ý cho một bạn trong lớp, con nên chọn lời nói lịch sự, tôn trọng danh dự của bạn và tập thể lớp thay vì chê bai nặng lời trước đám đông.',
    dialectical_view:
      '"Ngó chúa" ở đây là sự tinh tế, biết giữ thể diện và hòa khí trong giao tiếp xã hội, chứ KHÔNG có nghĩa là nịnh bợ kẻ mạnh hay bao che, làm ngơ trước cái sai của người có quyền thế.',
    essay_evidence_usage:
      'Dùng trong bài nghị luận về: Nghệ thuật giao tiếp ứng xử khéo léo, sự tinh tế khi phê bình và tôn trọng mối quan hệ cộng đồng.',
    sample_sentence:
      'Trong giao tiếp hàng ngày, sự thẳng thắn luôn cần đi đôi với lòng tinh tế; hiểu đúng tinh thần "Đánh chó ngó chúa" giúp ta biết cân nhắc hoàn cảnh và giữ trọn sự tôn trọng dành cho những người xung quanh.',
    english_anchor: 'Look at the master before striking the dog / Tactful diplomacy',
    keywords: ['giao tiếp', 'tinh tế', 'quan sát', 'ứng xử', 'thấu tình đạt lý'],
    is_featured: true,
  },

  // ===========================================================================
  // 11. NO MẤT NGON, GIẬN MẤT KHÔN (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-11-no-mat-ngon-gian-mat-khon',
    proverb: 'No mất ngon, giận mất khôn',
    pillar: 'skills_conduct',
    sub_category: 'Quản trị cảm xúc (EQ) & Tự chủ',
    literal_meaning:
      'Khi bụng đã ăn quá no thì sơn hào hải vị bày trước mặt cũng không còn thấy ngon miệng; cũng giống như khi cơn tức giận bốc lên đầu thì người thông minh mấy cũng dễ mất đi sự sáng suốt, khôn ngoan.',
    figurative_meaning:
      'Cảnh báo quy luật tâm lý con người: Cơn nóng giận làm mờ lý trí, khiến ta dễ buông lời làm tổn thương người khác hoặc đưa ra những quyết định sai lầm đáng tiếc.',
    life_skill_note:
      'Quy tắc 6 giây vàng cho tuổi 12: Khi bị trêu chọc hoặc bất đồng ý kiến với bạn, hãy hít thở sâu 3 nhịp và uống một ngụm nước trước khi phản ứng, bởi "No mất ngon, giận mất khôn"!',
    dialectical_view:
      'Cảm xúc tức giận trước sự bất công là phản ứng tự nhiên của con người, nhưng người bản lĩnh là người làm chủ được cơn giận ấy để biến nó thành lập luận sắc bén, điềm tĩnh chứ không để cơn giận điều khiển hành vi.',
    essay_evidence_usage:
      'Dẫn chứng cực kỳ thuyết phục cho đề văn nghị luận về: Kỹ năng làm chủ cảm xúc (EQ), bản lĩnh kiềm chế cơn giận, và văn hóa ứng xử văn minh trên mạng xã hội.',
    sample_sentence:
      'Người xưa đã đặt hai vế song hành đầy hàm súc "No mất ngon, giận mất khôn" để nhắc nhở mỗi chúng ta rằng: làm chủ được cơn nóng giận trong một khoảnh khắc chính là giữ vững trí tuệ và tránh được muôn vàn hối tiếc về sau.',
    english_anchor: 'Anger clouds wisdom / Emotional self-control',
    keywords: ['cảm xúc', 'nóng giận', 'bình tĩnh', 'tự chủ', 'EQ'],
    is_featured: true,
  },

  // ===========================================================================
  // 12. TAM NGU THÀNH HIỀN (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-12-tam-ngu-thanh-hien',
    proverb: 'Tam ngu thành hiền',
    pillar: 'skills_conduct',
    sub_category: 'Trí tuệ tập thể & Hợp tác nhóm',
    literal_meaning:
      '"Tam" là ba người, "ngu" là người bình thường chưa giỏi giang, "hiền" là bậc hiền tài sáng suốt. Ba người bình thường biết chụm đầu bàn bạc, góp ý kiến lại với nhau sẽ sánh ngang trí tuệ của một bậc hiền triết.',
    figurative_meaning:
      'Đề cao sức mạnh của trí tuệ tập thể và tinh thần lắng nghe, học hỏi lẫn nhau: Không một cá nhân đơn lẻ nào biết hết mọi thứ, khi biết hợp tác thì những người bình thường cũng giải quyết được bài toán lớn.',
    life_skill_note:
      'Khi làm bài tập nhóm hoặc thảo luận câu hỏi khó, đừng tự ti nghĩ mình chưa giỏi và cũng đừng tự cao làm một mình! Hãy lắng nghe góc nhìn của các bạn trong nhóm vì "Tam ngu thành hiền".',
    dialectical_view:
      '"Tam ngu thành hiền" chỉ phát huy tác dụng khi mỗi thành viên đều chịu suy nghĩ độc lập, tôn trọng lý lẽ và bổ sung góc nhìn cho nhau; ngược lại, nếu cả nhóm ỷ lại hoặc hùa theo đám đông thiếu suy xét thì sẽ rơi vào "tâm lý bầy đàn".',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về: Tinh thần làm việc nhóm (Teamwork), sự khiêm tốn học hỏi bạn bè, và sức mạnh đoàn kết trí tuệ.',
    sample_sentence:
      'Tương đồng với câu "Ba cây chụm lại nên hòn núi cao", phương ngôn "Tam ngu thành hiền" khẳng định rằng khi những bộ óc biết khiêm tốn lắng nghe và cộng hưởng cùng nhau, trí tuệ tập thể sẽ mở ra những lời giải vượt bậc.',
    english_anchor: 'Two heads are better than one / Collective intelligence',
    keywords: ['hợp tác', 'làm việc nhóm', 'trí tuệ tập thể', 'khiêm tốn', 'đoàn kết'],
    is_featured: true,
  },

  // ===========================================================================
  // 13. GIÀU ĐỔI BẠN, SANG ĐỔI VỢ (morality_society)
  // ===========================================================================
  {
    id: 'proverb-13-giau-doi-ban-sang-doi-vo',
    proverb: 'Giàu đổi bạn, sang đổi vợ',
    pillar: 'morality_society',
    sub_category: 'Phê phán thói bạc bẽo & Giữ trọn thủy chung',
    literal_meaning:
      'Khi mới phát tài giàu có đã vội quay lưng bỏ những người bạn thuở hàn vi; khi mới có chức quyền cao sang đã phụ bạc người bạn đời từng tần tảo đồng cam cộng khổ.',
    figurative_meaning:
      'Câu tục ngữ đúc kết và phê phán nghiêm khắc thói đời bạc nghĩa, chạy theo danh lợi phù phiếm mà quên mất tình nghĩa thủy chung với những người đã cùng mình vượt qua lúc gian khó.',
    life_skill_note:
      'Khi con đạt giải thưởng cao hay tiến bộ vượt bậc, hãy luôn trân trọng và giữ tình bạn chân thành với những người bạn đã cùng con chia sẻ từ những ngày đầu bỡ ngỡ.',
    dialectical_view:
      'Đây là câu tục ngữ phản ánh một hiện tượng tiêu cực để RĂN ĐE (chứ không phải lời khuyên làm theo!). Người có nhân cách lớn càng thành đạt, giàu sang lại càng phải trọng tình trọng nghĩa.',
    essay_evidence_usage:
      'Dùng làm dẫn chứng phản đề trong bài nghị luận về: Tình bạn chân chính, lòng thủy chung son sắt, và bản lĩnh không biến chất trước danh lợi.',
    sample_sentence:
      'Dân gian từng chua xót lên án lối sống thực dụng qua câu "Giàu đổi bạn, sang đổi vợ" để nhắc nhở mỗi người rằng: thước đo đích thực của phẩm giá không nằm ở sự hào nhoáng khi thành đạt, mà ở lòng thủy chung với những người từng sẻ chia cùng ta thuở khó khăn.',
    english_anchor: 'Fickleness in prosperity / True loyalty withstands wealth and status',
    keywords: ['thủy chung', 'tình bạn', 'nhân nghĩa', 'phê phán', 'bạc bẽo'],
    is_featured: true,
  },

  // ===========================================================================
  // 14. QUÍT LÀM CAM CHỊU (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-14-quit-lam-cam-chiu',
    proverb: 'Quít làm cam chịu',
    pillar: 'skills_conduct',
    sub_category: 'Tinh thần trách nhiệm & Sự công bằng',
    literal_meaning:
      'Cây quít và cây cam cùng họ hàng, dáng lá và quả khá giống nhau; nhưng lỗi do "quít" gây ra mà "cam" lại bị đem ra chịu phạt oan uổng.',
    figurative_meaning:
      'Chỉ tình huống bất công trong cuộc sống khi người này gây ra lỗi lầm, hậu quả nhưng người khác (thường là người thân cận, cùng nhóm hoặc người hiền lành) lại phải gánh chịu tiếng xấu hoặc hình phạt thay.',
    life_skill_note:
      'Sống bản lĩnh là "Dám làm dám nhận": Nếu mình lỡ làm hỏng đồ hay mắc lỗi trong nhóm, hãy dũng cảm nhận trách nhiệm, tuyệt đối không im lặng để bạn khác hoặc cả lớp bị trách phạt oan theo kiểu "Quít làm cam chịu".',
    dialectical_view:
      'Ở góc độ người mắc lỗi, để xảy ra "Quít làm cam chịu" là thiếu trung thực. Ở góc độ người đánh giá (như lớp trưởng, người quản lý), cần tìm hiểu kỹ sự thật khách quan trước khi kết luận để không trách nhầm người vô tội.',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về: Lòng dũng cảm nhận lỗi, tinh thần trách nhiệm cá nhân đối với tập thể, và sự công tâm khi đánh giá sự việc.',
    sample_sentence:
      'Một tập thể văn minh chỉ thực sự vững mạnh khi mỗi cá nhân đều dũng cảm chịu trách nhiệm trước hành động của mình, xóa bỏ hoàn toàn cảnh tượng bất công "Quít làm cam chịu".',
    english_anchor: 'One does the crime, another takes the blame / Accountability',
    keywords: ['trách nhiệm', 'công bằng', 'dũng cảm nhận lỗi', 'trung thực', 'oan uổng'],
    is_featured: true,
  },

  // ===========================================================================
  // 15. RƯỚC VOI VỀ GIÀY MỒ (morality_society)
  // ===========================================================================
  {
    id: 'proverb-15-ruoc-voi-ve-giay-mo',
    proverb: 'Rước voi về giày mồ',
    pillar: 'morality_society',
    sub_category: 'Tự tôn dân tộc & Cảnh giác bảo vệ gia đình, đất nước',
    literal_meaning:
      'Tự mình dẫn con voi dữ từ rừng xa về để nó giẫm đạp, phá nát chính ngôi mộ thiêng liêng của ông bà tổ tiên nhà mình ("giày mồ" = giẫm nát mồ mả tổ tiên).',
    figurative_meaning:
      'Hình ảnh ẩn dụ đanh thép lên án hành động vì ích kỷ, hẹp hòi hoặc lợi ích cá nhân mà cầu viện kẻ xấu bên ngoài về làm hại chính gia đình, tập thể, quê hương và Tổ quốc của mình.',
    life_skill_note:
      'Giúp con hiểu bài học lịch sử sâu sắc (như chuyện Lê Chiêu Thống cầu viện quân Thanh bị Quang Trung đánh tan) đồng thời biết bảo vệ sự đoàn kết của gia đình, trường lớp trước những tác động xấu.',
    dialectical_view:
      'Cần phân biệt rõ giữa việc "Rước voi về giày mồ" (đưa thế lực xấu về phá hoại nội bộ, đánh mất chủ quyền) với việc "Mở cửa giao lưu, học hỏi tinh hoa quốc tế" trên tinh thần độc lập, tự chủ để làm giàu mạnh đất nước.',
    essay_evidence_usage:
      'Dẫn chứng lịch sử - văn học sắc bén cho bài nghị luận về: Lòng yêu nước, ý thức bảo vệ chủ quyền dân tộc, đoàn kết nội bộ (kết nối trực tiếp với tác phẩm *Hoàng Lê nhất thống chí* và Lịch sử THCS).',
    sample_sentence:
      'Trang sử dân tộc luôn khắc ghi bài học cảnh tỉnh từ câu tục ngữ "Rước voi về giày mồ", nhắc nhở mỗi người con đất Việt phải luôn đặt lợi ích Tổ quốc và sự đoàn kết dân tộc lên trên mọi mưu cầu vị kỷ.',
    english_anchor: 'Invite the elephant to trample ancestral graves / Betraying one’s own roots',
    keywords: ['yêu nước', 'đoàn kết', 'lịch sử', 'tự chủ', 'cảnh giác'],
    is_featured: true,
  },
];

export const PROVERBS_SEED_DATA: ProverbItem[] = deepNormalizeVietnamese(RAW_PROVERBS_SEED_DATA);

