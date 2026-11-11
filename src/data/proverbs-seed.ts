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

  // ===========================================================================
  // 16. KIẾN THA LÂU CŨNG ĐẦY TỔ (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-16-kien-tha-lau-cung-day-to',
    proverb: 'Kiến tha lâu cũng đầy tổ',
    pillar: 'nature_labor',
    sub_category: 'perseverance',
    literal_meaning:
      'Kiến là giống vật nhỏ tí, trong khi cái tổ thì to sù và ở tận trên cành cây cao vót. Việc tha từng mồi nhỏ từ dưới đất bò lên tổ cao là một công việc gian nan, vất vả vô cùng. So sức kiến với cái tổ thì tưởng chừng không bao giờ tha cho đầy được, thế mà tổ kiến có lúc đầy ắp mồi nhờ kiến chịu khó tha lâu, bền bỉ không nản chí.',
    figurative_meaning:
      'Khuyên người đời phải có lòng kiên gan, vững chí, chịu khó tích lũy từng chút một; công việc dẫu to lớn, khó khăn đến đâu nếu bền bỉ làm mãi không ngừng thì cuối cùng ắt có ngày thành công.',
    life_skill_note:
      'Trong học tập, không cần học dồn dập trước kỳ thi; mỗi ngày chỉ cần đều đặn học thêm vài từ vựng và giải vài bài tập nhỏ, sau một học kỳ sẽ tích lũy được một lượng kiến thức khổng lồ.',
    dialectical_view:
      'Đúng đắn khi ca ngợi sự kiên trì, tích tiểu thành đại. Tuy nhiên, cần tránh áp dụng máy móc theo kiểu làm việc cần cù thụ động, lặp đi lặp lại phương pháp cũ kém hiệu quả mà không chịu cải tiến tư duy hay tìm cách tối ưu hóa.',
    essay_evidence_usage:
      'Rất phù hợp trong bài văn nghị luận xã hội về đức tính kiên trì, lòng nhẫn nại, ý chí vượt khó hoặc tinh thần tích lũy tri thức; nên đặt ở phần Thân bài làm luận cứ chứng minh sức mạnh của hành động nhỏ bền bỉ.',
    sample_sentence:
      "Cổ nhân từng dạy 'Kiến tha lâu cũng đầy tổ' để nhắc nhở rằng mọi thành tựu vĩ đại trên đời đều không đến sau một đêm, mà được đắp bồi từ những nỗ lực thầm lặng và kiên gan mỗi ngày.",
    english_anchor: 'Perseverance & Diligence',
    keywords: ['kiên trì', 'nhẫn nại', 'tích tiểu thành đại', 'chịu khó'],
    is_featured: true,
  },

  // ===========================================================================
  // 17. RUỘNG AI THÌ NẤY ĐẮP BỜ (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-17-ruong-ai-thi-nay-dap-bo',
    proverb: 'Ruộng ai thì nấy đắp bờ',
    pillar: 'skills_conduct',
    sub_category: 'responsibility',
    literal_meaning:
      'Ruộng của ai thì người nấy tự lo liệu đi đắp bờ giữ nước, giữ đất; chuyện đồng áng nhà ai người nấy tự chăm nom lấy, không ai đắp bờ hộ ruộng người khác.',
    figurative_meaning:
      "Mượn việc làm ruộng để nói lẽ đời: cha mẹ ai người nấy phụng dưỡng, con cái ai người nấy bù trì chăm bẵm, sự nghiệp của ai thì người nấy tự xây dựng, không ai làm thay việc riêng của mình. Ngoài ra câu này còn có nghĩa là mình được nhờ vả, hưởng lợi từ ai thì phải có trách nhiệm giữ gìn, bênh vực cho người ấy (gần nghĩa với 'ăn cây nào rào cây nấy').",
    life_skill_note:
      'Nhắc nhở học sinh phải tự chịu trách nhiệm về bổn phận của bản thân: bài vở của mình phải tự làm, đồ dùng của mình phải tự sắp xếp, không được ỷ lại hay trông chờ người khác làm thay.',
    dialectical_view:
      "Đúng khi đề cao tinh thần tự lập và ý thức trách nhiệm cá nhân đối với phận sự của mình. Nhưng cần tránh hiểu cực đoan thành lối sống ích kỷ, bo bo giữ mình 'đèn nhà ai nhà nấy rạng', thờ ơ vô cảm trước khó khăn của tập thể.",
    essay_evidence_usage:
      'Phù hợp với các đề nghị luận về tính tự lập, tinh thần trách nhiệm hoặc phê phán thói ỷ lại, dựa dẫm; đặt thích hợp nhất ở Luận điểm phân tích sự cần thiết của việc tự làm chủ cuộc đời.',
    sample_sentence:
      "Câu tục ngữ 'Ruộng ai thì nấy đắp bờ' là bài học sâu sắc về tinh thần tự chủ: trước khi mong chờ sự giúp đỡ từ người khác, mỗi cá nhân phải tự mình nỗ lực gánh vác và vun vén cho tương lai của chính mình.",
    english_anchor: 'Personal Responsibility',
    keywords: ['tự lập', 'trách nhiệm', 'bổn phận', 'tự chủ'],
    is_featured: true,
  },

  // ===========================================================================
  // 18. SẠCH NỢ LÀM GIÀU (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-18-sach-no-lam-giau',
    proverb: 'Sạch nợ làm giàu',
    pillar: 'skills_conduct',
    sub_category: 'financial_discipline',
    literal_meaning:
      "'Sạch nợ' là trang trải, chi trả hết mọi món nợ nần không còn thiếu thốn ai. 'Làm giàu' là bắt đầu tích lũy của cải để thành giàu có. Hễ trả dứt công nợ thì công sức làm ra mới thực sự thuộc về mình để tích tụ của cải.",
    figurative_meaning:
      'Khi đã trả hết nợ tức là đời sống đã đủ ăn đủ tiêu và thoát khỏi cảnh vay mượn thiếu thốn; sự thanh thản và độc lập tài chính ấy chính là điểm khởi đầu vững chắc nhất để xây dựng cơ nghiệp và làm giàu.',
    life_skill_note:
      'Giúp học sinh rèn luyện thói quen giữ chữ tín và quản lý việc mượn - trả sòng phẳng: mượn đồ dùng học tập hay tiền bạc của ai thì phải ghi nhớ trả dứt điểm, không để nợ nần dây dưa làm mất lòng tin của bạn bè.',
    dialectical_view:
      'Đúng với quy tắc tài chính căn bản về an toàn, bền vững và sự nhẹ nhõm trong tâm hồn. Tuy nhiên, trong kinh tế hiện đại, việc sử dụng các nguồn vốn vay (đòn bẩy tài chính) một cách khoa học, kiểm soát được rủi ro vẫn là một chiến lược phát triển cần thiết chứ không nên quá ác cảm với tín dụng.',
    essay_evidence_usage:
      'Dùng trong bài nghị luận về kỹ năng quản lý tài chính, lối sống có kỷ luật, giữ chữ tín hoặc bàn về sự giàu có bền vững; nên đặt ở Luận điểm bàn về nền tảng nội lực trước khi mở rộng quy mô.',
    sample_sentence:
      "Hiểu được lời căn dặn 'Sạch nợ làm giàu', ta nhận ra rằng một tương lai vững vàng chỉ có thể được tạo dựng khi ta giải phóng bản thân khỏi những gánh nặng nợ nần và làm chủ được đời sống của chính mình.",
    english_anchor: 'Debt-free Independence',
    keywords: ['sạch nợ', 'chữ tín', 'tài chính', 'làm giàu'],
    is_featured: true,
  },

  // ===========================================================================
  // 19. ANH EM NHƯ CHÂN NHƯ TAY (morality_society)
  // ===========================================================================
  {
    id: 'proverb-19-anh-em-nhu-chan-nhu-tay',
    proverb: 'Anh em như chân như tay',
    pillar: 'morality_society',
    sub_category: 'family',
    literal_meaning:
      'Anh em ruột thịt ví như chân và tay trên cùng một thân thể con người. Chân tay là phần tự nhiên liền khối, không ai có thể thay đổi hay lựa chọn; một chiếc chân hay chiếc tay đau thì cả người đau đớn, chân tay què gãy thì cả người sẽ yếu ớt, tật nguyền.',
    figurative_meaning:
      'Khuyên người đời phải biết trân quý, gắn bó và che chở cho anh chị em trong nhà như chính thân thể mình; khi hoạn nạn phải cùng lo lắng, đùm bọc, tuyệt đối không được vì của cải hay mâu thuẫn bên ngoài mà chia lìa, làm tổn thương tình cốt nhục.',
    life_skill_note:
      'Nhắc nhở học sinh luôn yêu thương, nhường nhịn và đồng hành cùng anh chị em trong gia đình; không tranh giành đồ chơi, không ghen tị vặt vãnh mà luôn biết bảo vệ nhau cả ở nhà lẫn ở trường.',
    dialectical_view:
      'Đúng đắn và thiêng liêng khi ca ngợi tình cảm máu mủ gia đình. Song cần tỉnh táo tránh biến thành sự bao che mù quáng, dung túng cho cái xấu hoặc thói gia đình trị vi phạm đạo đức và pháp luật.',
    essay_evidence_usage:
      'Rất đắc địa trong các bài văn nghị luận về tình cảm gia đình, tình anh em ruột thịt hoặc tinh thần đoàn kết tương thân tương ái; có thể đặt mở đầu bài viết để tạo cảm xúc hoặc làm luận điểm trọng tâm trong Thân bài.',
    sample_sentence:
      "Lời ví von mộc mạc 'Anh em như chân như tay' từ ngàn xưa vẫn vẹn nguyên giá trị, khẳng định rằng tình ruột thịt là điểm tựa ấm áp và vững chãi nhất của mỗi con người trước sóng gió cuộc đời.",
    english_anchor: 'Sibling Solidarity',
    keywords: ['anh em', 'tình thân', 'ruột thịt', 'đoàn kết'],
    is_featured: true,
  },

  // ===========================================================================
  // 20. BẮC CẦU MÀ NOI, AI BẮC CẦU MÀ LỘI (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-20-bac-cau-ma-noi-ai-bac-cau-ma-loi',
    proverb: 'Bắc cầu mà noi, ai bắc cầu mà lội',
    pillar: 'skills_conduct',
    sub_category: 'practicality',
    literal_meaning:
      "'Noi' nghĩa là noi theo con đường, đi theo lối cầu có sẵn. Đã nhọc công bắc cầu gỗ, cầu tre thuận tiện thì người ta cứ theo trên mặt cầu mà bước sang, không ai lại cất công bắc xong cầu rồi lại nhảy xuống sông lội bùn, lội nước cho ướt át, nhọc nhằn.",
    figurative_meaning:
      'Theo giải thích của từ điển cổ, câu này ý nói: có của cải, phương tiện thuận lợi thì phải biết sử dụng và thụ hưởng cho hợp lý, không nên hà tiện quá đáng mà làm khổ thân mình; rộng ra là khuyên con người phải biết tận dụng những điều kiện thuận lợi và kinh nghiệm đã được mở sẵn thay vì tự làm khó mình.',
    life_skill_note:
      'Khuyên học sinh biết sử dụng công cụ học tập thông minh và lắng nghe kinh nghiệm hướng dẫn từ thầy cô, cha mẹ để giải quyết vấn đề hiệu quả, không nên cố chấp làm việc một cách thủ công, máy móc tự làm mình kiệt sức.',
    dialectical_view:
      'Đúng khi khuyên con người biết sống thực tế, tận dụng thành quả và phương tiện văn minh. Tuy nhiên, tránh lạm dụng thành thói ỷ lại, ngại khó ngại khổ, không dám bước ra khỏi lối mòn để dấn thân khám phá những con đường mới chưa có cầu sẵn.',
    essay_evidence_usage:
      'Phù hợp cho các bài văn bàn về phương pháp học tập khoa học, lối sống thực tế, biết tận dụng cơ hội và phương tiện, hoặc phê phán thói bủn xỉn, bảo thủ; thích hợp đặt ở phần Thân bài.',
    sample_sentence:
      "Một người có tư duy tiến bộ là người thấu suốt bài học 'Bắc cầu mà noi, ai bắc cầu mà lội', luôn biết đứng trên vai những người đi trước và tận dụng thành tựu sẵn có để tối ưu hóa năng lực bản thân.",
    english_anchor: 'Pragmatism & Utilization',
    keywords: ['thực tế', 'tận dụng', 'không hà tiện', 'kinh nghiệm'],
    is_featured: true,
  },

  // ===========================================================================
  // 21. TỐT DANH HƠN LÀNH ÁO (morality_society)
  // ===========================================================================
  {
    id: 'proverb-21-tot-danh-hon-lanh-ao',
    proverb: 'Tốt danh hơn lành áo',
    pillar: 'morality_society',
    sub_category: 'honor_integrity',
    literal_meaning:
      "'Tốt danh' là có danh thơm, tiếng tốt, nhân cách được mọi người tôn kính. 'Lành áo' là có áo quần nguyên vẹn, đẹp đẽ. Nếu đem manh áo lành và danh dự tốt lên bàn cân thì danh thơm bao giờ cũng nặng hơn; danh thơm có thể che mờ cả áo rách vá, còn manh áo tốt lành không bao giờ tạo nên được nhân phẩm cao quý.",
    figurative_meaning:
      'Khuyên con người phải coi trọng danh dự, phẩm giá, thanh danh và sự trong sạch của tâm hồn hơn là vẻ hào nhoáng, giàu sang hay sự tươm tất của áo quần, của cải vật chất bề ngoài.',
    life_skill_note:
      'Nhắc nhở học sinh giữ gìn tính trung thực trong học tập và đối nhân xử thế; danh dự của một người học sinh tử tế, được bạn bè nể trọng quý giá hơn nhiều việc đua đòi áo quần hàng hiệu hay vẻ ngoài đắt tiền.',
    dialectical_view:
      'Đúng đắn sâu sắc khi khẳng định đạo đức và phẩm hạnh là giá trị cốt lõi cao nhất. Dù vậy, không nên rơi vào thái cực xem thường việc ăn mặc tươm tất, vệ sinh và lịch sự tối thiểu, hoặc sa vào căn bệnh chuộng danh hão, sĩ diện mù quáng.',
    essay_evidence_usage:
      'Dùng rất đắc địa trong bài văn nghị luận về lòng tự trọng, phẩm giá con người, lối sống trung thực, hoặc đề văn so sánh giữa giá trị vật chất và giá trị tinh thần; nên đặt ở Luận điểm chính khẳng định giá trị cốt lõi hoặc phần Kết bài.',
    sample_sentence:
      "Lời răn 'Tốt danh hơn lành áo' của tiền nhân như chiếc la bàn đạo đức nhắc nhở chúng ta rằng, sự giàu có lộng lẫy nhất của một con người chính là một nhân cách thanh sạch và một tâm hồn không tì vết.",
    english_anchor: 'Honor & Integrity',
    keywords: ['danh dự', 'phẩm giá', 'tự trọng', 'trong sạch'],
    is_featured: true,
  },

  // ===========================================================================
  // 22. NGƯỜI SỐNG ĐỐNG VÀNG (morality_society)
  // ===========================================================================
  {
    id: 'proverb-22-nguoi-song-dong-vang',
    proverb: 'Người sống đống vàng',
    pillar: 'morality_society',
    sub_category: 'human_value',
    literal_meaning:
      'Người ốm đau cốt thuốc thang chữa chạy cho sống được là may, dù tốn kém bao nhiêu tiền của cũng không nên tiếc. Người còn là của còn, người chết là của hết, vì chính con người làm nên của cải. Hễ cứu được người sống, khỏe mạnh thì tự nhiên sẽ làm ra cả đống vàng.',
    figurative_meaning:
      'Khẳng định sinh mệnh, sức khỏe và giá trị lao động sáng tạo của con người là vốn quý vô giá nhất trần đời, vượt lên trên mọi thứ vàng ngọc của cải; khuyên người ta không nên vì tham tiền bạc, hà tiện của cải mà coi nhẹ sức khỏe và tính mạng.',
    life_skill_note:
      'Giúp học sinh hiểu rằng sức khỏe, tính mạng và sự an toàn của bản thân cùng người xung quanh là trên hết; không bao giờ liều lĩnh tham gia các trò chơi nguy hiểm để bảo vệ vốn quý nhất của chính mình.',
    dialectical_view:
      "Đúng tuyệt đối về giá trị nhân văn và tinh thần tôn trọng sinh mệnh con người. Tuy nhiên, tránh suy diễn lười biếng thành tư tưởng ỷ lại rằng 'mình là vàng' nên tự cho phép bản thân lêu lổng, không chịu học tập, lao động để tạo ra giá trị thiết thực.",
    essay_evidence_usage:
      'Sử dụng hiệu quả trong các đề văn về quyền con người, tinh thần nhân đạo, bảo vệ sức khỏe, an toàn tính mạng hoặc phê phán lối sống tham lam coi tiền bạc hơn mạng người; thích hợp đặt ở Luận điểm nhấn mạnh giá trị trung tâm của con người.',
    sample_sentence:
      "Triết lý 'Người sống đống vàng' rạng rỡ tinh thần nhân bản của dân tộc Việt, khẳng định rằng con người với sức lao động và trí tuệ bất tận chính là cội nguồn sáng tạo ra mọi giá trị phồn vinh của nhân loại.",
    english_anchor: 'Value of Human Life',
    keywords: ['giá trị con người', 'sinh mệnh', 'sức khỏe', 'nhân đạo'],
    is_featured: true,
  },

  // ===========================================================================
  // 23. ƠN AI MỘT CHÚT CHỚ QUÊN, PHIỀN AI MỘT CHÚT ĐỂ BÊN CẠNH LÒNG (morality_society)
  // ===========================================================================
  {
    id: 'proverb-23-on-ai-mot-chut-cho-quen',
    proverb: 'Ơn ai một chút chớ quên, phiền ai một chút để bên cạnh lòng',
    pillar: 'morality_society',
    sub_category: 'gratitude',
    literal_meaning:
      'Thọ ơn của ai dù chỉ là một chút việc nhỏ mọn cũng không được phép quên; khi làm phiền lụy hay nhờ vả ai điều gì dù rất nhỏ nhặt cũng phải luôn ghi nhớ, để bên cạnh lòng (tâm niệm khắc ghi trong dạ) để tìm dịp đền đáp chu tất.',
    figurative_meaning:
      'Khuyên răn đạo lý sống trọng ân nghĩa; nhắc nhở con người phải luôn khắc cốt ghi tâm sự giúp đỡ của người khác, bất kể việc lớn hay việc nhỏ, sống có trước có sau và không bao giờ được vô ơn bạc bẽo.',
    life_skill_note:
      'Dạy học sinh biết nói lời cảm ơn chân thành và ghi nhớ khi được bạn bè cho mượn cây bút, chia sẻ mẩu bánh hay được thầy cô kiên nhẫn giảng lại bài khó; không coi sự giúp đỡ của người khác là điều hiển nhiên.',
    dialectical_view:
      'Đúng đắn khi bồi dưỡng phẩm chất tri ân và lòng trắc ẩn. Tuy nhiên, cần tránh cực đoan biến lòng biết ơn thành gánh nặng mặc cảm tự ti, hoặc vì mang ơn việc nhỏ mà mù quáng làm theo những yêu cầu sai trái vi phạm đạo đức và pháp luật.',
    essay_evidence_usage:
      "Rất đắc địa trong bài văn nghị luận xã hội về lòng biết ơn, đạo lý 'Uống nước nhớ nguồn', lối sống nghĩa tình; thích hợp đặt ở Luận điểm bàn về nhân cách của người tử tế hoặc phần Kết bài để đọng lại dư ba.",
    sample_sentence:
      "Lời răn 'Ơn ai một chút chớ quên, phiền ai một chút để bên cạnh lòng' không chỉ là thước đo phẩm giá của người xưa, mà còn là ánh sáng soi rọi lối sống ân nghĩa, nhắc ta trân quý từng bàn tay nâng đỡ giữa dòng đời.",
    english_anchor: 'Gratitude & Mindfulness',
    keywords: ['biết ơn', 'ân nghĩa', 'khắc cốt ghi tâm', 'đối nhân xử thế'],
    is_featured: true,
  },

  // ===========================================================================
  // 24. ĐỨT TAY HAY THUỐC (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-24-dut-tay-hay-thuoc',
    proverb: 'Đứt tay hay thuốc',
    pillar: 'skills_conduct',
    sub_category: 'experience_caution',
    literal_meaning:
      "'Đứt tay' là bị thương tổn rách da chảy máu; 'hay thuốc' là biết rõ phương thuốc nào hay, lá thuốc nào rịt vào vết thương thì lành lặn. Khi bị đứt tay đau đớn rồi người ta mới cuống cuồng đi tìm kiếm và sực biết đến thứ thuốc quý.",
    figurative_meaning:
      'Hàm chứa hai nét nghĩa sâu sắc: Một là bài học về quy luật nhận thức, con người phải trải qua vấp váp, đau đớn, thất bại mới rút ra được bài học và kinh nghiệm quý giá; hai là châm biếm thói đời lúc bình yên vô sự thì lãng quên, chỉ khi rơi vào cảnh hoạn nạn nguy cấp mới nhớ đến người tài giỏi, ân nhân để cậy nhờ cứu giúp.',
    life_skill_note:
      "Giúp học sinh lứa tuổi 12 không nản chí trước những lần điểm kém hay sai sót trong học tập; mỗi lần phạm lỗi chính là một lần 'đứt tay' giúp em tìm ra 'phương thuốc' khắc phục lỗ hổng kiến thức để tiến bộ hơn.",
    dialectical_view:
      "Đúng khi nhìn nhận vấp ngã là người thầy nghiêm khắc rèn luyện bản lĩnh. Song không nên thụ động đợi đến khi 'đứt tay' gặp họa mới đi tìm 'thuốc', mà cần có tư duy phòng ngừa, chuẩn bị kỹ lưỡng từ trước để giảm thiểu rủi ro.",
    essay_evidence_usage:
      'Phù hợp với các đề văn nghị luận về thái độ trước thất bại, bài học kinh nghiệm, tinh thần học hỏi từ lỗi lầm hoặc bài học về tính chủ động phòng bị trong cuộc sống; nên đặt ở Luận điểm giải thích quy luật trưởng thành.',
    sample_sentence:
      "Hiểu theo chiều sâu triết lý, 'Đứt tay hay thuốc' là quy luật muôn đời của sự trưởng thành: chính những vết thương đau đớn và những cú vấp ngã đầu đời là người thầy dạy cho ta bản lĩnh vững vàng nhất.",
    english_anchor: 'Learning from Mistakes',
    keywords: ['kinh nghiệm', 'vấp ngã', 'bài học', 'phòng ngừa'],
    is_featured: true,
  },

  // ===========================================================================
  // 25. ĂN CÓ CHỖ, ĐỖ CÓ NƠI (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-25-an-co-cho-do-co-noi',
    proverb: 'Ăn có chỗ, đỗ có nơi',
    pillar: 'skills_conduct',
    sub_category: 'caution_etiquette',
    literal_meaning:
      "'Đỗ' ở đây là ngủ đỗ, ngủ trọ dọc đường bộ hành thời xưa. Ăn uống phải tìm chỗ đàng hoàng, sạch sẽ; dừng chân ngủ trọ phải chọn nơi vững chãi, an toàn và tử tế, tránh những quán trọ ám muội ('hắc điếm') hay bỏ thuốc mê, thuốc độc vào cơm nước để hãm hại cướp của khách bộ hành.",
    figurative_meaning:
      'Khuyên con người khi bước chân ra xã hội phải hết sức cẩn trọng, giữ gìn an toàn tính mạng và phong thái chuẩn mực, có trật tự ngăn nắp; tuyệt đối không bạ đâu ăn đấy, bạ đâu ngả lưng đấy một cách buông tuồng, mất cảnh giác.',
    life_skill_note:
      'Rèn luyện cho học sinh kỹ năng tự bảo vệ bản thân và nếp sống kỷ luật: khi đi dã ngoại hay ra đường phải biết chọn thức ăn hợp vệ sinh, không tự ý đi theo người lạ đến nơi vắng vẻ và luôn giữ nếp sinh hoạt gọn gàng, đúng giờ giấc.',
    dialectical_view:
      'Đúng đắn về nguyên tắc an toàn cá nhân và nếp sống quy củ. Tuy nhiên, không nên quá câu nệ, cứng nhắc hoặc tỏ ra tiểu thư công tử khi rơi vào hoàn cảnh sinh hoạt dã ngoại, khẩn cấp đòi hỏi tinh thần thích nghi cao và linh hoạt.',
    essay_evidence_usage:
      'Rất thích hợp trong bài viết nghị luận về kỹ năng sống, ý thức tự bảo vệ bản thân, lối sống văn minh thanh lịch hoặc nếp sống kỷ luật; nên bố trí ở Luận điểm bàn về lối sống có nguyên tắc.',
    sample_sentence:
      "Lời răn 'Ăn có chỗ, đỗ có nơi' từ thời ông cha đến nay vẫn vẹn nguyên giá trị như một bài học nhập môn về sự thận trọng, nhắc nhở thế hệ trẻ biết tự bảo vệ mình trước những cám dỗ và rủi ro khôn lường của cuộc sống.",
    english_anchor: 'Prudence & Orderliness',
    keywords: ['cẩn trọng', 'an toàn', 'ngăn nắp', 'nếp sống'],
    is_featured: true,
  },

  // ===========================================================================
  // 26. KHÔN RA MIỆNG, DẠI RA TAY (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-26-khon-ra-mieng-dai-ra-tay',
    proverb: 'Khôn ra miệng, dại ra tay',
    pillar: 'skills_conduct',
    sub_category: 'communication_composure',
    literal_meaning:
      'Người khôn ngoan sáng suốt thì trí tuệ hiển hiện rõ ràng qua lời ăn tiếng nói mềm mỏng, gãy gọn, thấu tình đạt lý; kẻ rồ dại, khờ khạo thì sự nông nổi lại bộc lộ ra ở đôi bàn tay: lúng túng làm hỏng việc, hoặc hung hăng dùng nắm đấm, vũ lực đánh người.',
    figurative_meaning:
      'Khuyên con người phải biết dùng trí tuệ, sự điềm đạm và sức mạnh của ngôn từ khéo léo để thuyết phục và giải quyết mâu thuẫn; phê phán những kẻ kém cỏi, thiếu tự chủ hễ gặp chuyện bất bình là vội vàng dùng bạo lực tay chân chuốc lấy tai họa.',
    life_skill_note:
      'Giúp học sinh tuổi dậy thì rèn luyện kỹ năng kiểm soát cơn giận trong các mâu thuẫn học đường: khi bất đồng ý kiến với bạn bè, hãy bình tĩnh dùng lời đối thoại ôn tồn thay vì nóng nảy xô xát, động tay động chân.',
    dialectical_view:
      "Đúng đắn khi đề cao văn hóa đối thoại và giải quyết vấn đề bằng trí tuệ ôn hòa. Tuy nhiên, cần tránh ngộ nhận thành thói 'khôn mồm khôn miệng', chỉ giỏi nói suông hứa hão mà lười biếng hành động thực tế, bởi chân lý cần phải đi đôi với đôi tay lao động.",
    essay_evidence_usage:
      'Đặc biệt đắc địa trong đề văn nghị luận về văn hóa ứng xử, phòng chống bạo lực học đường, nghệ thuật giao tiếp hoặc kiểm soát cảm xúc; thích hợp đặt ở Luận điểm phê phán hành vi bạo lực bốc đồng.',
    sample_sentence:
      "Thấm thía lời răn 'Khôn ra miệng, dại ra tay', người bản lĩnh luôn chọn sức mạnh của sự điềm tĩnh và đối thoại văn minh để hóa giải xích mích thay vì biến đôi tay thành công cụ của bạo lực mù quáng.",
    english_anchor: 'Verbal Wisdom over Force',
    keywords: ['khôn ngoan', 'lời nói', 'kiềm chế', 'phi bạo lực'],
    is_featured: true,
  },

  // ===========================================================================
  // 27. ĂN BỚT BÁT, NÓI BỚT LỜI (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-27-an-bot-bat-noi-bot-loi',
    proverb: 'Ăn bớt bát, nói bớt lời',
    pillar: 'skills_conduct',
    sub_category: 'moderation_temperance',
    literal_meaning:
      "'Ăn bớt bát' là ăn ít đi một vài bát cơm để dạ dày không bị quá no, tránh bội thực sinh bệnh cho thân thể. 'Nói bớt lời' (trong nguyên tác cụ Hòe ghi nhận biến thể 'nói bớt nhời') là nói ít đi vài ba câu để tránh lỡ lời, nói hớ, nói sai mà chuốc lấy vạ miệng, rắc rối cho tinh thần.",
    figurative_meaning:
      'Khuyên con người phải biết giữ chừng mực, tiết độ trong ăn uống và thận trọng, kín kẽ trong phát ngôn; biết điểm dừng đúng lúc để giữ gìn sức khỏe thể chất và bảo vệ sự bình an của tâm hồn trước thị phi cuộc đời.',
    life_skill_note:
      "Nhắc nhở học sinh tuổi 12 rèn thói quen lắng nghe nhiều hơn nói, 'uốn lưỡi bảy lần trước khi nói', không chen ngang lời thầy cô và bạn bè, tránh bình luận ác ý hay lan truyền tin đồn trên mạng xã hội.",
    dialectical_view:
      "Đúng đắn khi rèn luyện tính chừng mực, tránh 'họa từ miệng mà ra'. Dù vậy, không nên áp dụng máy móc thành thái độ rụt rè, 'mũ ni che tai', thụ động im lặng trước cái sai, cái xấu hoặc không dám dũng cảm phát biểu bảo vệ lẽ phải.",
    essay_evidence_usage:
      'Phù hợp với các bài văn nghị luận về sự khiêm tốn, văn hóa phát ngôn trên không gian mạng, sự cẩn trọng và lối sống điều độ; nên đặt ở Luận điểm rèn luyện tu dưỡng bản thân.',
    sample_sentence:
      "Thực hành bài học 'Ăn bớt bát, nói bớt lời' chính là cách ta rèn luyện kỷ luật nội tâm, học cách lắng nghe để mỗi lời nói thốt ra đều mang sức nặng của sự chín chắn và thấu hiểu.",
    english_anchor: 'Moderation & Discretion',
    keywords: ['tiết độ', 'chừng mực', 'cẩn trọng', 'lời nói'],
    is_featured: true,
  },

  // ===========================================================================
  // 28. KHEN NGƯỜI THÌ TỐT, GIỘT NGƯỜI THÌ XẤU (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-28-khen-nguoi-thi-tot-giot-nguoi-thi-xau',
    proverb: 'Khen người thì tốt, giột người thì xấu',
    pillar: 'skills_conduct',
    sub_category: 'communication_empathy',
    literal_meaning:
      "'Giột người' (trong sách cụ Hòe ghi nhận câu: 'Khen người thì tốt, giột người người xấu') là tiếng cổ, chỉ hành động chặn họng, bắt bẻ gay gắt, chê bai hoặc bới móc điều xấu của người khác. Khen ngợi người thì sinh điều tốt lành; bắt bẻ, chê bai người thì rước lấy điều xấu xa, thù oán.",
    figurative_meaning:
      'Khuyên ta nên nhìn vào ưu điểm của người khác để khích lệ, khen ngợi, từ đó tạo dựng mối quan hệ hòa ái, thêm bạn bớt thù; chê trách thói cay nghiệt, hẹp hòi, chỉ chăm chăm bắt bẻ lỗi lầm và nói xấu người khác khiến thiên hạ xa lánh, căm ghét.',
    life_skill_note:
      "Dạy học sinh thói quen hào phóng khen ngợi những nỗ lực và điểm tốt của bạn bè trong lớp, từ bỏ thói quen 'bắt bẻ từng câu chữ' hay trêu chọc, gièm pha khuyết điểm của người khác để xây dựng tình bạn lành mạnh.",
    dialectical_view:
      'Đúng về nghệ thuật giao tiếp tích cực và thái độ độ lượng. Tuy nhiên, lời khen phải chân thành và đúng sự thật, tránh biến tướng thành tâng bốc nịnh hót; đồng thời sự phê bình mang tính xây dựng, trung thực vẫn rất cần thiết để giúp nhau tiến bộ.',
    essay_evidence_usage:
      'Rất phù hợp cho các bài văn bàn về nghệ thuật ứng xử, sức mạnh của lời khen chân thành, văn hóa phê bình và tinh thần bao dung; nên đặt ở Luận điểm phân tích tác động tâm lý trong giao tiếp.',
    sample_sentence:
      "Thấu hiểu triết lý 'Khen người thì tốt, giột người thì xấu', ta nhận ra rằng một lời ngợi khen chân thành có thể thắp sáng niềm tin của một con người, trong khi thói bắt bẻ cay nghiệt chỉ gieo rắc thêm những khoảng cách vô hình.",
    english_anchor: 'Praise vs Fault-finding',
    keywords: ['khen ngợi', 'giột người', 'bắt bẻ', 'bao dung'],
    is_featured: true,
  },

  // ===========================================================================
  // 29. ĐƯỢC VOI ĐÒI TIÊN (morality_society)
  // ===========================================================================
  {
    id: 'proverb-29-duoc-voi-doi-tien',
    proverb: 'Được voi đòi tiên',
    pillar: 'morality_society',
    sub_category: 'contentment_greed',
    literal_meaning:
      "Con voi vốn là loài vật đồ sộ, quý giá bậc nhất chốn rừng xanh; kẻ tham lam khi đã có được con voi quý rồi lại chưa thỏa lòng, lại vòi vĩnh muốn có thứ to lớn và tuyệt mỹ hơn là 'bà tiên' có phép màu huyền diệu.",
    figurative_meaning:
      "Phê phán và châm biếm sâu cay thói tham lam vô độ, lòng tham không đáy; hễ đạt được một điều này lại lập tức nảy sinh đòi hỏi những quyền lợi khác cao xa, quá quắt, 'được đằng chân lân đằng đầu' mà không biết điểm dừng.",
    life_skill_note:
      'Giúp học sinh rèn luyện thái độ biết đủ và biết ơn: biết trân trọng những gì cha mẹ đã hy sinh chu cấp cho mình, không đua đòi đòi hỏi mua sắm điện thoại đắt tiền hay quần áo hàng hiệu khi nhu cầu học tập đã được đáp ứng đầy đủ.',
    dialectical_view:
      "Đúng đắn khi bài trừ thói tham lam vị kỷ, vòi vĩnh hưởng thụ. Dù vậy, cần phân biệt rạch ròi giữa thói 'được voi đòi tiên' (tham lam thụ hưởng vô căn cứ) với ý chí tiến thủ, khát vọng vươn lên không ngừng để chinh phục những đỉnh cao khoa học và tri thức.",
    essay_evidence_usage:
      "Dùng trong các bài nghị luận phê phán lòng tham lam, lối sống thực dụng đòi hỏi, hoặc bàn về đức tính 'tri túc' (biết đủ) và lòng biết ơn; nên đặt ở Luận điểm phản biện, phê phán các biểu hiện tiêu cực.",
    sample_sentence:
      "Căn bệnh 'Được voi đòi tiên' chính là biểu hiện của một tâm hồn nghèo nàn lòng biết ơn, nơi những dục vọng vị kỷ ngày càng lấn át và xói mòn nhân cách tốt đẹp của con người.",
    english_anchor: 'Insatiable Greed',
    keywords: ['tham lam', 'vô độ', 'đòi hỏi', 'biết đủ'],
    is_featured: true,
  },

  // ===========================================================================
  // 30. Ở NHÀ NHẤT MẸ NHÌ CON, RA ĐƯỜNG LẮM KẺ GIÒN HƠN TA (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-30-o-nha-nhat-me-nhi-con',
    proverb: 'Ở nhà nhất mẹ nhì con, ra đường lắm kẻ giòn hơn ta',
    pillar: 'skills_conduct',
    sub_category: 'humility_openmindedness',
    literal_meaning:
      "Trong nguyên tác cụ Lê Văn Hòe ghi nhận câu: 'Ở nhà nhất mẹ nhì con, ra đường chén vạn kẻ dòn hơn ta'. 'Dòn' (giòn) là tiếng cổ chỉ sự xinh xắn, khéo léo, tốt đẹp; 'chén vạn' nghĩa là muôn vạn, rất nhiều. Ở trong góc nhà chật hẹp chỉ có hai mẹ con thì tự thấy mẹ là nhất trần đời rồi kế đến là con; nhưng khi bước chân ra xã hội rộng lớn mới vỡ lẽ rằng thiên hạ có muôn vạn người xinh đẹp, tài hoa hơn ta gấp bội.",
    figurative_meaning:
      "Châm biếm sâu cay thói tự cao tự đại, thói kiêu ngạo hợm hĩnh của những kẻ 'ếch ngồi đáy giếng', chỉ quanh quẩn trong môi trường nhỏ bé đã vội ảo tưởng bản thân là số một; khuyên người đời phải giữ tâm thế khiêm tốn, luôn biết mở rộng tầm mắt ra thế giới mênh mông.",
    life_skill_note:
      'Nhắc nhở học sinh luôn giữ đức tính khiêm nhường: dù đạt điểm cao nhất lớp hay xuất sắc nhất trường thì ra ngoài xã hội biển học vẫn vô bờ, luôn có nhiều tấm gương tài năng hơn để em noi theo và học hỏi.',
    dialectical_view:
      'Đúng khi răn dạy đức khiêm tốn và tinh thần cầu thị học hỏi suốt đời. Tuy nhiên, tránh hiểu lệch thành tâm lý tự ti, tự ti mặc cảm, đánh mất niềm tin vào năng lực và giá trị độc bản của chính mình.',
    essay_evidence_usage:
      'Rất đắc địa trong đề văn nghị luận về đức tính khiêm tốn, phê phán thói kiêu ngạo tự mãn, hoặc bài học về tinh thần không ngừng học hỏi và mở rộng tầm nhìn; thích hợp đặt ở Mở bài để tạo tính hấp dẫn hoặc Luận điểm chính của Thân bài.',
    sample_sentence:
      "Lời nhắc nhở dí dỏm mà thâm thúy 'Ở nhà nhất mẹ nhì con, ra đường lắm kẻ giòn hơn ta' dạy cho người trẻ bài học đầu đời về sự khiêm nhường, để biết bước ra khỏi ao làng chật hẹp và hòa mình vào đại dương tri thức bao la.",
    english_anchor: 'Humility & Modesty',
    keywords: ['khiêm tốn', 'tự mãn', 'ếch ngồi đáy giếng', 'giòn'],
    is_featured: true,
  },

  // ===========================================================================
  // 31. MỘT NONG TẰM BẰNG BA NONG LÚA (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-31-mot-nong-tam-bang-ba-nong-lua',
    proverb: 'Một nong tằm bằng ba nong lúa',
    pillar: 'nature_labor',
    sub_category: 'agricultural_efficiency',
    literal_meaning:
      'Nong là đồ đan bằng tre to và phẳng dùng để nuôi tằm hoặc phơi nông sản. Nuôi một nong tằm cho kén, kéo sợi tơ bán được giá trị kinh tế cao, tính ra tiền của thu được bằng hoặc gấp ba lần năng suất thu hoạch từ một nong lúa gặt ngoài ruộng.',
    figurative_meaning:
      'Kinh nghiệm kinh tế nông nghiệp của tiền nhân: so sánh hiệu quả kinh tế giữa nghề trồng trọt ngũ cốc cơ bản và nghề chăn tằm ươm tơ; khuyên người nông dân nên biết kết hợp làm thêm nghề phụ thủ công để tăng thu nhập, nâng cao giá trị thặng dư.',
    life_skill_note:
      'Giúp học sinh 12 tuổi hiểu khái niệm về hiệu quả và giá trị gia tăng: bên cạnh việc hoàn thành bài tập cơ bản trên lớp (như làm ruộng), nếu biết rèn thêm kỹ năng chuyên sâu như tin học, ngoại ngữ (như nghề tằm) thì cơ hội và năng lực cá nhân sẽ vượt trội hơn rất nhiều.',
    dialectical_view:
      "Đúng khi khuyến khích chuyển dịch cơ cấu ngành nghề và tạo ra giá trị cao. Tuy nhiên, nghề tằm đòi hỏi kỹ thuật tỉ mỉ, thức khuya dậy sớm ('chăn tằm ăn cơm đứng') và phụ thuộc thời tiết; nếu bỏ bê nông nghiệp căn bản mà chạy theo nghề phụ bấp bênh khi chưa đủ kinh nghiệm thì dễ gánh chịu rủi ro lớn.",
    essay_evidence_usage:
      'Phù hợp đưa vào bài nghị luận về việc đa dạng hóa kỹ năng, tư duy tối ưu hóa hiệu suất học tập và lao động; nên đặt ở Luận điểm bàn về cách tạo ra bước đột phá từ năng lực chuyên môn.',
    sample_sentence:
      "Người xưa đã sớm nhận ra bài toán giá trị qua câu tục ngữ 'Một nong tằm bằng ba nong lúa', nhắc nhở chúng ta rằng sự chuyên sâu và sáng tạo luôn mang lại những thành quả vượt bậc so với lao động thuần túy rập khuôn.",
    english_anchor: 'High Value-Added Skill',
    keywords: ['kinh tế', 'chăn tằm', 'trồng lúa', 'năng suất', 'giá trị'],
    is_featured: true,
  },

  // ===========================================================================
  // 32. MỘT MẶT NGƯỜI MƯỜI MẶT CỦA (morality_society)
  // ===========================================================================
  {
    id: 'proverb-32-mot-mat-nguoi-muoi-mat-cua',
    proverb: 'Một mặt người mười mặt của',
    pillar: 'morality_society',
    sub_category: 'human_value',
    literal_meaning:
      "Cụ Lê Văn Hòe giải thích: 'Mặt' ở đây là đơn vị chỉ người hoặc chỉ của cải quý giá. Một mặt người quý gấp mười (hoặc bằng mười) mặt của, ý nói của cải không bao giờ quý bằng sinh mệnh con người, bởi vì 'người làm nên của, chứ của không làm nên người'.",
    figurative_meaning:
      'Tôn vinh sinh mệnh, nhân phẩm và trí tuệ sáng tạo của con người là vốn quý vô giá nhất trong vũ trụ; phê phán thái độ xem trọng đồng tiền, ham mê của cải vật chất mà coi rẻ tình người và sức khỏe con người.',
    life_skill_note:
      'Nhắc nhở học sinh luôn đặt sự an toàn, sức khỏe của bản thân và bạn bè lên trên hết; khi lỡ làm mất đồ dùng học tập hay điện thoại đắt tiền thì không nên quá hoảng loạn, sợ hãi dằn vặt bản thân vì con người mới là cội nguồn tạo ra mọi thứ.',
    dialectical_view:
      'Đúng tuyệt đối về giá trị nhân bản và quyền con người. Song không nên vin vào câu này để cổ xúy thói lãng phí, phá tán của cải hoặc lối sống vô kỷ luật, cẩu thả không biết nâng niu tài sản công sức cha mẹ làm ra.',
    essay_evidence_usage:
      'Rất đắc địa trong đề văn nghị luận về lòng nhân ái, bảo vệ sức khỏe và an toàn sinh mệnh, hoặc phê phán lối sống tôn thờ vật chất thực dụng; thích hợp đặt ở Mở bài hoặc Luận điểm trung tâm khẳng định phẩm giá con người.',
    sample_sentence:
      "Câu tục ngữ 'Một mặt người mười mặt của' như một lời tuyên ngôn nhân bản sâu sắc của ông cha, khẳng định rằng con người với trí tuệ và tình yêu thương chính là thước đo giá trị cao nhất của mọi thời đại.",
    english_anchor: 'Value of Human Life',
    keywords: ['con người', 'nhân phẩm', 'sinh mệnh', 'của cải', 'nhân văn'],
    is_featured: true,
  },

  // ===========================================================================
  // 33. THÁNG HAI TRỒNG CÀ, THÁNG BA TRỒNG ĐỖ (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-33-thang-hai-trong-ca-thang-ba-trong-do',
    proverb: 'Tháng Hai trồng cà, tháng Ba trồng đỗ',
    pillar: 'nature_labor',
    sub_category: 'seasonal_timing',
    literal_meaning:
      'Vào tháng Hai âm lịch tiết trời mưa phùn ẩm ướt là thời điểm thích hợp nhất để tra hạt ươm cây cà; sang tháng Ba âm lịch thời tiết ấm dần lên là thời vụ vàng để gieo hạt các giống đỗ (đậu).',
    figurative_meaning:
      'Đúc kết kinh nghiệm nông vụ lâu đời: lao động sản xuất và gieo trồng phải tuân thủ nghiêm ngặt lịch nông lịch, thời tiết và quy luật của tự nhiên thì cây trái mới phát triển tươi tốt, đạt năng suất cao.',
    life_skill_note:
      "Rèn luyện cho học sinh tính kế hoạch và đúng giờ: việc học tập cũng có 'thời vụ' (ôn thi, nộp bài, đọc sách); biết phân chia thời gian hợp lý và học đúng lúc sẽ đỡ tốn sức mà kết quả lại cao hơn việc nước đến chân mới nhảy.",
    dialectical_view:
      'Đúng với quy luật thích ứng tự nhiên của phương thức canh tác truyền thống. Tuy nhiên trong thời đại nông nghiệp công nghệ cao hiện nay, con người có thể làm chủ nhà kính, điều chỉnh nhiệt độ để trồng trái vụ mà vẫn đạt hiệu quả kinh tế.',
    essay_evidence_usage:
      'Dùng trong bài văn nghị luận về tầm quan trọng của việc lập kế hoạch, sống có kỷ luật và biết nắm bắt thời cơ; nên đặt ở Luận điểm bàn về hành động đúng thời điểm.',
    sample_sentence:
      "Hiểu được quy luật tự nhiên từ lời dạy 'Tháng Hai trồng cà, tháng Ba trồng đỗ', người trẻ càng cần ý thức rõ giá trị của thời gian để gieo trồng những hạt mầm tri thức đúng vào những năm tháng thanh xuân quý báu nhất.",
    english_anchor: 'Right Timing & Planning',
    keywords: ['thời vụ', 'kế hoạch', 'thời gian', 'nông nghiệp', 'thời cơ'],
    is_featured: true,
  },

  // ===========================================================================
  // 34. VĂN ÔN VÕ LUYỆN (morality_society)
  // ===========================================================================
  {
    id: 'proverb-34-van-on-vo-luyen',
    proverb: 'Văn ôn võ luyện',
    pillar: 'morality_society',
    sub_category: 'growth_mindset',
    literal_meaning:
      'Theo cụ Lê Văn Hòe: Học văn chương thì phải siêng năng ôn tập, xem đi ngẫm lại nhiều lần; học võ nghệ thì phải thường xuyên luyện tập cơ bắp, đường nét chiêu thức. Không ôn thì văn quên ý, không luyện thì võ lụt nghề.',
    figurative_meaning:
      'Khẳng định bản chất của tư duy và tài năng: mọi năng lực trí tuệ hay kỹ năng thao tác đều không phải là khối đá cố định sinh ra đã có, mà là kết quả của quá trình kiên trì tôi luyện, lặp đi lặp lại và mài giũa liên tục.',
    life_skill_note:
      "Dạy học sinh lớp 7 tư duy phát triển (Growth Mindset): không có ai 'sinh ra đã dốt Toán' hay 'kém Văn bẩm sinh'; chỉ cần kiên nhẫn làm bài tập và ôn luyện hàng ngày, não bộ sẽ tự động hình thành phản xạ và tiến bộ vượt bậc.",
    dialectical_view:
      "Đúng đắn về nguyên lý rèn luyện để thuần thục kỹ năng. Song việc 'luyện' phải đi đôi với phương pháp học thông minh và tự phản tư (Metacognition); tránh nhồi nhét học vẹt thụ động dẫn đến mệt mỏi mà không phát triển tư duy sáng tạo.",
    essay_evidence_usage:
      'Rất phù hợp cho các đề văn về tinh thần tự học, phương pháp rèn luyện, tư duy vượt khó hoặc bác bỏ quan niệm tự ti về năng khiếu; thích hợp đặt ở Luận cứ then chốt của Thân bài.',
    sample_sentence:
      "Lời răn 'Văn ôn võ luyện' của người xưa là minh chứng bất hủ cho quy luật của sự tiến bộ: năng khiếu bẩm sinh chỉ là điểm khởi đầu, còn chính sự tôi luyện bền bỉ mỗi ngày mới là chìa khóa mở cánh cửa tài năng.",
    english_anchor: 'Growth Mindset & Practice',
    keywords: ['rèn luyện', 'tư duy phát triển', 'kiên trì', 'học tập', 'thực hành'],
    is_featured: true,
  },

  // ===========================================================================
  // 35. CÓ CÔNG MÀI SẮT, CÓ NGÀY NÊN KIM (nature_labor)
  // ===========================================================================
  {
    id: 'proverb-35-co-cong-mai-sat-co-ngay-nen-kim',
    proverb: 'Có công mài sắt, có ngày nên kim',
    pillar: 'nature_labor',
    sub_category: 'perseverance',
    literal_meaning:
      'Cụ Lê Văn Hòe dẫn giải: Thanh sắt to lớn, thô ráp và cứng rắn phi thường, nhưng nếu một người bền gan, chịu khó dốc sức mài giũa nó vào phiến đá qua ngày này tháng khác thì cuối cùng thanh sắt to ấy cũng sẽ nhỏ dần thành chiếc kim may tinh xảo.',
    figurative_meaning:
      'Ca ngợi ý chí kiên định, lòng nhẫn nại và sự bền bỉ của con người; dẫu công việc có gian nan, cách trở đến đâu nếu không nản chí thì cuối cùng ắt sẽ gặt hái được thành công vang dội.',
    life_skill_note:
      'Giúp học sinh không sợ hãi trước những mục tiêu lớn như học một môn ngoại ngữ mới hay luyện chữ viết đẹp; mỗi ngày chỉ cần mài giũa một chút nỗ lực nhỏ, tích lũy dần sẽ tạo nên bước nhảy vọt.',
    dialectical_view:
      "Đúng khi cổ vũ tinh thần không ngại khó, kiên gan vượt khó. Tuy nhiên trong thực tế hiện đại, cần phải chọn lọc mục tiêu thông minh; không nên cố chấp 'mài sắt' khi mục tiêu phi lý hoặc lặp lại phương pháp sai lầm dẫn đến lãng phí thời gian và sức lực vô ích.",
    essay_evidence_usage:
      'Rất phổ biến và đắc địa trong mọi đề bài về ý chí, nghị lực sống, tính kiên trì vượt khó; có thể dùng làm câu dẫn nhập ở Mở bài hoặc làm dẫn chứng mẫu mực ở phần Thân bài.',
    sample_sentence:
      "Triết lý giản dị từ câu tục ngữ 'Có công mài sắt, có ngày nên kim' nhắc nhở thế hệ trẻ rằng, không có con đường tắt nào dẫn đến vinh quang ngoại trừ con đường được lát bằng sự kiên nhẫn và mồ hôi công sức.",
    english_anchor: 'Perseverance & Grit',
    keywords: ['kiên trì', 'bền bỉ', 'nghị lực', 'thành công', 'mài sắt'],
    is_featured: true,
  },

  // ===========================================================================
  // 36. DAO CÓ MÀI MỚI SẮC, NGƯỜI CÓ HỌC MỚI KHÔN (morality_society)
  // ===========================================================================
  {
    id: 'proverb-36-dao-co-mai-moi-sac-nguoi-co-hoc-moi-khon',
    proverb: 'Dao có mài mới sắc, người có học mới khôn',
    pillar: 'morality_society',
    sub_category: 'intellectual_cultivation',
    literal_meaning:
      'Trong sách của cụ Lê Văn Hòe ghi nhận: Dao dù đúc bằng thứ thép tốt đến đâu mà không mài thì cũng cùn mòn gỉ sét không dùng được; con người dù có tư chất thông minh đĩnh ngộ đến mấy mà không chịu khó học hỏi thì tư chất ấy cũng không phát triển được, không thể trở nên khôn ngoan.',
    figurative_meaning:
      'Mượn hình ảnh con dao và hòn mài để khẳng định vai trò cốt tử của giáo dục và sự học: tri thức và sự hiểu biết đạo lý chỉ có được thông qua quá trình học tập nghiêm túc chứ không tự nhiên mà đến.',
    life_skill_note:
      'Nhắc nhở học sinh không được tự mãn khi thấy mình tiếp thu nhanh hơn các bạn; nếu ỷ lại vào trí thông minh mà lười làm bài tập, bỏ bê việc đọc sách thì trí óc sẽ dần trì trệ và tụt hậu.',
    dialectical_view:
      "Đúng đắn khi nhấn mạnh việc học là con đường khai phóng nhận thức duy nhất. Dù vậy, 'học' ở đây phải là học sâu hiểu rộng, học đi đôi với hành, chứ không phải lối học thuộc lòng vẹt vờ nhằm đối phó với thi cử.",
    essay_evidence_usage:
      'Phù hợp với các đề văn bàn về vai trò của việc học, thái độ học tập đúng đắn hoặc phê phán thói kiêu ngạo, ỷ lại vào tư chất; đặt thích hợp nhất ở Luận điểm giải thích vai trò của học tập đối với sự hình thành nhân cách.',
    sample_sentence:
      "Lời khẳng định 'Dao có mài mới sắc, người có học mới khôn' là bài học nhập môn về sự tu dưỡng, nhắc ta nhớ rằng tư chất thông minh chỉ là viên ngọc thô, chỉ có ngọn lửa của sự học mới mài giũa nó thành ánh sáng tỏa rạng.",
    english_anchor: 'Education & Enlightenment',
    keywords: ['học vấn', 'rèn luyện', 'thông minh', 'khôn ngoan', 'tri thức'],
    is_featured: true,
  },

  // ===========================================================================
  // 37. TRĂM HAY CHẲNG TÀY TAY QUEN (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-37-tram-hay-chang-tay-tay-quen',
    proverb: 'Trăm hay chẳng tày tay quen',
    pillar: 'skills_conduct',
    sub_category: 'practical_experience',
    literal_meaning:
      "Cụ Lê Văn Hòe giải thích: 'Trăm hay' là tài giỏi trăm phần, học rộng biết nhiều về mặt lý thuyết; 'chẳng tày' là không bằng; 'tay quen' là bàn tay đã thao tác nhiều lần đến mức quen việc, thành thạo. Biết trăm điều trên sách vở không bằng bàn tay quen làm việc thực tế.",
    figurative_meaning:
      'Đề cao giá trị của kinh nghiệm thực tiễn và kỹ năng thao tác thực tế; phê phán những kẻ chỉ giỏi nói suông, hiểu biết lý thuyết viển vông nhưng khi bắt tay vào làm việc thực tế thì lúng túng, vụng về.',
    life_skill_note:
      'Khuyên học sinh lớp 7 không nên chỉ học thuộc lý thuyết môn Khoa học hay Tin học trong sách giáo khoa, mà phải tích cực làm thí nghiệm, gõ bàn phím và tự tay giải bài tập nhiều lần để kiến thức biến thành kỹ năng phản xạ tự nhiên.',
    dialectical_view:
      'Đúng khi đề cao thực hành và sự tôi luyện kinh nghiệm. Tuy nhiên, không nên tuyệt đối hóa kinh nghiệm thực tế mà xem thường lý thuyết khoa học nền tảng, bởi lý thuyết đúng đắn chính là chiếc la bàn soi sáng giúp kỹ năng phát triển nhanh hơn.',
    essay_evidence_usage:
      "Rất thích hợp trong bài văn bàn về phương châm 'Học đi đôi với hành', mối quan hệ giữa lý thuyết và thực tiễn; nên đặt ở Luận điểm phân tích tầm quan trọng của việc cọ xát thực tế.",
    sample_sentence:
      "Thấu hiểu chân lý 'Trăm hay chẳng tày tay quen', ta nhận ra rằng một người học giả uyên bác trên trang giấy sẽ mãi là người khuyết thiếu nếu không đưa tri thức hòa nhập vào dòng chảy của lao động thực tiễn.",
    english_anchor: 'Practice Makes Perfect',
    keywords: ['thực hành', 'kinh nghiệm', 'lý thuyết', 'quen tay', 'thao tác'],
    is_featured: true,
  },

  // ===========================================================================
  // 38. CƯỜI BA THÁNG, AI CƯỜI BA NĂM (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-38-cuoi-ba-thang-ai-cuoi-ba-nam',
    proverb: 'Cười ba tháng, ai cười ba năm',
    pillar: 'skills_conduct',
    sub_category: 'courage_social_pressure',
    literal_meaning:
      'Theo cụ Lê Văn Hòe: Ở đời nếu ai làm điều gì kỳ lạ, khác thường hoặc lỡ phạm điều sơ suất thì thường bị miệng đời chê cười. Nhưng dư luận chỉ xôn xao cười cợt trong ba tháng là chán rồi quên lãng, chứ không ai rảnh rỗi để chê cười mãi đến ba năm.',
    figurative_meaning:
      'Lời động viên bản lĩnh đối diện với dư luận xã hội: khuyên con người không nên quá sợ hãi những lời đàm tiếu, phán xét tạm thời của người đời mà từ bỏ chí hướng đúng đắn; cũng là lời an ủi những ai trót lầm lỡ biết dũng cảm đứng lên sửa sai.',
    life_skill_note:
      'Giúp học sinh 12 tuổi giải tỏa nỗi sợ bị bạn bè chê cười khi phát biểu sai trên lớp, khi mặc bộ quần áo chưa đẹp hay khi thử sức một môn thể thao mới; dư luận rồi sẽ qua đi rất nhanh, quan trọng là em dám thử và vượt qua sự ngượng ngùng.',
    dialectical_view:
      "Cụ Lê Văn Hòe lưu ý góc nhìn biện chứng sâu sắc: Câu này vốn là lời khuyên vượt qua định kiến, nhưng cũng có nguy cơ bị kẻ làm càn mượn cớ để 'làm liều', bất chấp đạo lý xã hội rồi tự an ủi rằng người ta cười chán thì thôi. Do đó, chỉ áp dụng câu này khi ta làm điều đúng đắn, chính đáng.",
    essay_evidence_usage:
      'Dùng trong các bài văn nghị luận về bản lĩnh sống độc lập, vượt qua áp lực dư luận (peer pressure), lòng tự tin hoặc sự khoan dung với sai lầm; nên đặt ở Luận điểm rèn luyện sự kiên định nội tâm.',
    sample_sentence:
      "Nhắc nhở bản thân bằng lời dạy 'Cười ba tháng, ai cười ba năm' là cách người trẻ tạo dựng tấm khiên tinh thần vững chắc, dám vượt lên những tiếng xì xào của dư luận để kiên định với lẽ phải và mục tiêu của đời mình.",
    english_anchor: 'Overcoming Social Judgment',
    keywords: ['dư luận', 'chê cười', 'bản lĩnh', 'tự tin', 'vượt qua phán xét'],
    is_featured: true,
  },

  // ===========================================================================
  // 39. HÒN ĐẤT NÉM ĐI, HÒN CHÌ NÉM LẠI (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-39-hon-dat-nem-di-hon-chi-nem-lai',
    proverb: 'Hòn đất ném đi, hòn chì ném lại',
    pillar: 'skills_conduct',
    sub_category: 'communication_conflict',
    literal_meaning:
      "Cụ Lê Văn Hòe giải nghĩa: 'Hòn đất' thì xốp nhẹ và dễ vỡ; 'hòn chì' thì bằng kim loại nặng và rắn chắc hơn nhiều. Người kia mới quăng hòn đất nhẹ sang thì kẻ nọ đã ném trả lại bằng hòn chì nặng chịch; người này nói một lời nhẹ mà kẻ kia đáp lại một câu nặng nề, từ đó làm bùng phát chuyện cãi vã, bất hòa to tát.",
    figurative_meaning:
      "Mô tả quy luật leo thang của xung đột trong giao tiếp: sự đối kháng gay gắt, thói ăn miếng trả miếng, 'kẻ đấm một đấm, người đá một đá' chỉ khiến mâu thuẫn thêm trầm trọng và biến chuyện bé xé ra to.",
    life_skill_note:
      'Bài học kiểm soát cảm xúc cho tuổi học trò: khi bạn trót nói một câu trêu chọc hay làm phiền mình (hòn đất), nếu mình đáp trả bằng lời lẽ gay gắt hơn (hòn chì) thì xích mích sẽ bùng nổ thành đánh nhau; biết im lặng hoặc nói lời hòa nhã sẽ dập tắt cơn giận.',
    dialectical_view:
      'Đúng khi cảnh báo về hậu quả của sự hiếu thắng và thái độ trả đũa cực đoan. Tuy nhiên, không trả đũa không có nghĩa là nhu nhược, cam chịu trước sự bất công hay bắt nạt học đường; cần biết lên tiếng bảo vệ bản thân đúng lúc bằng sự bình tĩnh và văn minh.',
    essay_evidence_usage:
      'Rất hiệu quả trong bài văn nghị luận về văn hóa ứng xử, bạo lực học đường, nghệ thuật hòa giải hoặc tinh thần dĩ hòa vi quý; thích hợp đặt ở Luận điểm phê phán thói hiếu thắng trong giao tiếp.',
    sample_sentence:
      "Cảnh báo sâu sắc về xung đột từ câu tục ngữ 'Hòn đất ném đi, hòn chì ném lại' nhắc ta rằng, bạo lực và sự hơn thua không bao giờ có thể dập tắt hận thù, chỉ có sự điềm đạm và đối thoại mới cứu vãn được các mối quan hệ.",
    english_anchor: 'Escalation of Conflict',
    keywords: ['xung đột', 'trả đũa', 'lời nói', 'hòn chì', 'hòn đất'],
    is_featured: true,
  },

  // ===========================================================================
  // 40. MỘT SỰ NHỊN, CHÍN SỰ LÀNH (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-40-mot-su-nhin-chin-su-lanh',
    proverb: 'Một sự nhịn, chín sự lành',
    pillar: 'skills_conduct',
    sub_category: 'forbearance_peace',
    literal_meaning:
      "Theo cụ Lê Văn Hòe: 'Nhịn' là nhẫn nhịn, kiềm chế cơn nóng giận. 'Chín sự lành' ở đây không phải đếm đúng số chín, mà số chín tượng trưng cho rất nhiều điều tốt lành, êm ấm. Nhịn được một điều tức giận bồng bột thì giữ được muôn vàn sự yên ổn, bình an.",
    figurative_meaning:
      "Khuyên con người phải biết lấy chữ 'Nhẫn' làm trọng, biết kiềm chế cái tôi và sự giận dữ nhất thời để bảo toàn hòa khí, tránh được những tai họa khôn lường do xốc nổi gây ra.",
    life_skill_note:
      "Dạy học sinh kỹ năng 'dừng lại 5 giây' khi cảm thấy bực tức với bạn bè: lùi một bước để nhìn nhận lại sự việc, tránh vì một lời cãi vã vặt vãnh mà đánh mất tình bạn đẹp đẽ bấy lâu.",
    dialectical_view:
      "Đúng đắn trong nghệ thuật giữ gìn hòa khí và đối nhân xử thế hàng ngày. Nhưng cần phân biệt rạch ròi giữa 'nhẫn nhịn khôn ngoan' với sự 'nhẫn nhục mù quáng', thỏa hiệp hèn nhát trước cái ác, cái xấu hoặc hành vi chèn ép, bạo lực bất công.",
    essay_evidence_usage:
      'Rất đắc địa trong các bài văn nghị luận về đức tính nhẫn nại, lòng khoan dung, nghệ thuật hóa giải mâu thuẫn hoặc văn hóa sống hòa nhập; thích hợp đặt ở Luận điểm nhấn mạnh giá trị của sự điềm tĩnh.',
    sample_sentence:
      "Lời răn 'Một sự nhịn, chín sự lành' là kết tinh của trí tuệ phương Đông về chữ Nhẫn, khuyên ta biết thu hẹp cái tôi vị kỷ để mở rộng không gian cho sự hòa hợp và bình yên nội tại.",
    english_anchor: 'Forbearance & Patience',
    keywords: ['nhẫn nhịn', 'kiềm chế', 'hòa khí', 'chữ nhẫn', 'bình an'],
    is_featured: true,
  },

  // ===========================================================================
  // 41. TRÁNH VOI CHẲNG XẤU MẶT NÀO (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-41-tranh-voi-chang-xau-mat-nao',
    proverb: 'Tránh voi chẳng xấu mặt nào',
    pillar: 'skills_conduct',
    sub_category: 'tactical_prudence',
    literal_meaning:
      'Cụ Lê Văn Hòe phân tích: Con voi là giống vật to lớn, khỏe mạnh và hung hãn bậc nhất chốn muông thú; nếu người ta có phải lùi bước tránh né nó trên đường đi thì cũng chẳng có gì phải hổ thẹn hay xấu mặt cả, vì đó là lẽ tự nhiên.',
    figurative_meaning:
      'Khuyên người ta nên biết nhún nhường, tạm thời tránh đối đầu trực diện với những kẻ quyền thế hung bạo, những thế lực độc dữ hoặc những đối tượng nguy hiểm; đó là biểu hiện của sự khôn ngoan, mưu trí chứ không phải là hèn nhát.',
    life_skill_note:
      "Rèn luyện kỹ năng tự bảo vệ an toàn cho học sinh 12 tuổi: khi gặp kẻ say xỉn, đối tượng hung hãn mang hung khí hoặc nhóm bạn xấu đang gây gổ, em hãy lập tức né tránh và báo cho người lớn can thiệp, tuyệt đối không xông vào thể hiện 'anh hùng rơm'.",
    dialectical_view:
      "Đúng đắn về mặt chiến thuật tự vệ và bảo toàn lực lượng. Tuy nhiên, không nên biến việc 'tránh voi' thành cớ để thờ ơ vô cảm, sống hèn nhát 'mũ ni che tai' thấy kẻ yếu bị ức hiếp mà không dám tìm cách tương trợ chính nghĩa.",
    essay_evidence_usage:
      'Thích hợp cho các bài nghị luận về kỹ năng sống, lòng dũng cảm đi đôi với trí tuệ, nghệ thuật ứng biến linh hoạt trong hoàn cảnh nguy hiểm; nên đặt ở Luận điểm phân biệt giữa liều lĩnh mù quáng và mưu trí tự vệ.',
    sample_sentence:
      "Câu tục ngữ 'Tránh voi chẳng xấu mặt nào' dạy cho chúng ta bài học sâu sắc về sự khôn ngoan thực tế: biết lùi một bước để giữ an toàn cho bản thân chính là tiền đề để tiến ba bước vững chắc trên hành trình phía trước.",
    english_anchor: 'Prudence & Tactical Retreat',
    keywords: ['nhún nhường', 'khôn ngoan', 'tự vệ', 'tránh đối đầu', 'mưu trí'],
    is_featured: true,
  },

  // ===========================================================================
  // 42. CHÓ SỦA MẶC CHÓ, ĐƯỜNG TA TA CỨ ĐI (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-42-cho-sua-mac-cho-duong-ta-ta-cu-di',
    proverb: 'Chó sủa mặc chó, đường ta ta cứ đi',
    pillar: 'skills_conduct',
    sub_category: 'unwavering_focus',
    literal_meaning:
      'Người bộ hành đi đường thẳng thắn thì cứ vững bước tiến về phía trước; hai bên đường lũ chó nhà có thể xông ra sủa inh ỏi vì lạ mặt, nhưng người đi đường không dừng chân ném đá, đôi co với chó làm gì mà cứ đàng hoàng bước tiếp.',
    figurative_meaning:
      'Khuyên con người khi đã xác định được mục tiêu đúng đắn, chính nghĩa thì phải kiên định vững bước; không để những lời gièm pha, đố kỵ, dèm pha hay bàn tán ác ý của kẻ tiểu nhân làm lung lạc ý chí của mình.',
    life_skill_note:
      'Giúp học sinh rèn bản lĩnh không sợ hãi trước những lời trêu chọc, bàn tán ác ý sau lưng của một vài bạn xấu: hãy tập trung toàn bộ năng lượng vào việc học tập và rèn luyện của chính mình, sự tiến bộ của em sẽ là câu trả lời đanh thép nhất.',
    dialectical_view:
      "Đúng đắn khi bảo vệ lập trường kiên định trước những thị phi vô căn cứ. Song cần tỉnh táo lắng nghe những lời góp ý chân thành, mang tính xây dựng từ thầy cô, cha mẹ và bạn tốt để kịp thời sửa chữa khuyết điểm, tránh sa vào thói bảo thủ, cố chấp xem mọi lời khuyên đều là 'tiếng chó sủa'.",
    essay_evidence_usage:
      'Rất sắc sảo trong các bài văn nghị luận về sự kiên định, bản lĩnh giữ vững ước mơ, vượt qua định kiến xã hội hoặc phê phán thói đố kỵ gièm pha; thích hợp đặt làm điểm nhấn ấn tượng ở Luận điểm phản biện.',
    sample_sentence:
      "Tư thế đĩnh đạc từ câu ngạn ngữ 'Chó sủa mặc chó, đường ta ta cứ đi' khẳng định phẩm chất cốt lõi của người có chí lớn: không bao giờ để những âm thanh hỗn tạp bên lề làm chệch hướng bánh xe của khát vọng.",
    english_anchor: 'Unwavering Determination',
    keywords: ['kiên định', 'bản lĩnh', 'thị phi', 'mục tiêu', 'vững bước'],
    is_featured: true,
  },

  // ===========================================================================
  // 43. LỬA THỬ VÀNG, GIAN NAN THỬ SỨC (morality_society)
  // ===========================================================================
  {
    id: 'proverb-43-lua-thu-vang-gian-nan-thu-suc',
    proverb: 'Lửa thử vàng, gian nan thử sức',
    pillar: 'morality_society',
    sub_category: 'resilience',
    literal_meaning:
      'Vàng ròng cần đưa vào ngọn lửa nhiệt độ cao nung nấu mới phân biệt được với kim loại tạp chất; con người phải đặt vào hoàn cảnh gian nan, hiểm nghèo mới đo lường và phát lộ rõ sức lực, ý chí và nghị lực thực sự.',
    figurative_meaning:
      'Nghịch cảnh và thử thách không phải là sự trừng phạt hay phán xét kém cỏi, mà chính là môi trường tôi luyện cốt lõi để con người tôi rèn bản lĩnh, phát huy tiềm năng và trưởng thành vững vàng.',
    life_skill_note:
      'Khi gặp bài tập khó hoặc thử thách mới trong học tập, đừng vội nản lòng hay sợ hãi; hãy coi đó là bài tập tăng cơ bắp cho não bộ, giúp bản thân trở nên mạnh mẽ và thông minh hơn.',
    dialectical_view:
      'Đúng khi khuyên con người đối diện thử thách với tư duy phát triển. Tuy nhiên, kiên trì phải đi liền với phương pháp thông minh và lượng sức; nếu gặp thử thách quá tầm mà cố chấp mù quáng không chịu học hỏi hay điều chỉnh chiến lược thì chỉ dẫn đến kiệt quệ tâm lý.',
    essay_evidence_usage:
      'Rất đắc địa trong các bài văn nghị luận về ý chí vượt khó, nghị lực sống, tư duy phát triển (growth mindset); thích hợp đặt ở Mở bài hoặc Luận điểm trung tâm khẳng định giá trị của nghịch cảnh.',
    sample_sentence:
      "Cổ nhân từng dạy 'Lửa thử vàng, gian nan thử sức' để khẳng định rằng những bước ngoặt chông gai nhất của cuộc đời chính là chiếc khuôn đúc nên những nhân cách kiên cường và tài năng xuất chúng.",
    english_anchor: 'Resilience & Adversity',
    keywords: ['nghị lực', 'thử thách', 'tôi luyện', 'vượt khó', 'bản lĩnh'],
    is_featured: true,
  },

  // ===========================================================================
  // 44. NGỌC BẤT TRÁC BẤT THÀNH KHÍ, NHÂN BẤT HỌC BẤT TRI ĐẠO (morality_society)
  // ===========================================================================
  {
    id: 'proverb-44-ngoc-bat-trac-bat-thanh-khi',
    proverb: 'Ngọc bất trác bất thành khí, nhân bất học bất tri đạo',
    pillar: 'morality_society',
    sub_category: 'intellectual_cultivation',
    literal_meaning:
      "Câu chữ Hán: 'Trác' là gọt giũa, đục đẽo; 'khí' là đồ dùng, đồ vật quý báu; 'đạo' là đạo lý làm người. Viên ngọc thô nếu không được mài giũa, chạm khắc cẩn thận thì không thể thành đồ trang sức hay bảo vật; con người nếu không chịu học hành thì không thể hiểu biết đạo lý làm người.",
    figurative_meaning:
      'Khẳng định con người dù sinh ra có tư chất tốt đẹp như ngọc quý nhưng nếu không qua giáo dục, rèn giũa và học tập nghiêm túc thì cũng không thể trở thành người có ích, có nhân cách cao đẹp.',
    life_skill_note:
      'Nhắc nhở học sinh không nên ỷ lại vào sự thông minh sẵn có; chỉ có sự chăm chỉ học tập, rèn luyện nề nếp mỗi ngày mới giúp em mài sáng tài năng và hoàn thiện bản thân.',
    dialectical_view:
      "Đúng khi nhấn mạnh sự học và rèn luyện là con đường bắt buộc để thành nhân. Tuy nhiên, việc 'gọt giũa' giáo dục cần tôn trọng cá tính và năng khiếu tự nhiên của trẻ, tránh đục đẽo áp đặt một cách máy móc, cứng nhắc làm thui chột tính sáng tạo.",
    essay_evidence_usage:
      'Phù hợp cho các đề bài về vai trò của học tập, sự tu dưỡng đạo đức, phương pháp giáo dục; nên đặt ở Luận điểm bàn về quá trình rèn luyện để hoàn thiện nhân cách.',
    sample_sentence:
      "Triết lý 'Ngọc bất trác bất thành khí, nhân bất học bất tri đạo' từ ngàn xưa vẫn vẹn nguyên giá trị cảnh tỉnh: tài năng bẩm sinh chỉ là viên đá thô, chỉ có ngọn lửa của sự học và ý thức tự rèn mới biến nó thành viên ngọc tỏa sáng.",
    english_anchor: 'Education & Self-Cultivation',
    keywords: ['học vấn', 'mài giũa', 'đạo lý', 'tu dưỡng', 'ngọc quý'],
    is_featured: true,
  },

  // ===========================================================================
  // 45. THẤT BẠI LÀ MẸ THÀNH CÔNG (morality_society)
  // ===========================================================================
  {
    id: 'proverb-45-that-bai-la-me-thanh-cong',
    proverb: 'Thất bại là mẹ thành công',
    pillar: 'morality_society',
    sub_category: 'growth_mindset',
    literal_meaning:
      'Mượn quan hệ sinh thành trong gia đình (mẹ sinh ra con) để ví von: Mỗi lần thất bại, vấp ngã chính là cội nguồn sinh ra và nuôi dưỡng thành công sau này.',
    figurative_meaning:
      'Thất bại không phải là dấu chấm hết mà là người thầy cung cấp cho ta những dữ liệu quý giá, những bài học kinh nghiệm sâu sắc để sửa chữa sai lầm, từ đó tiến gần hơn đến đích thành công.',
    life_skill_note:
      'Giúp học sinh đối diện tích cực với những lần bị điểm kém hay thi trượt: hãy phân tích xem mình làm sai ở đâu để sửa đổi, bởi mỗi lỗi sai chính là một bậc thang đưa em đến sự tiến bộ.',
    dialectical_view:
      "Đúng khi nhìn nhận sai sót là cơ hội phản tư và học tập. Song thất bại chỉ trở thành 'mẹ thành công' khi ta thực sự rút ra bài học và đổi mới phương pháp; nếu thất bại lặp đi lặp lại do cẩu thả, vô kỷ luật mà không tự sửa mình thì thất bại ấy chỉ dẫn đến sự thụt lùi.",
    essay_evidence_usage:
      'Rất phổ biến trong đề văn nghị luận về thái độ trước vấp ngã, tinh thần bền bỉ theo đuổi ước mơ; thích hợp đặt ở Luận điểm bàn về quy luật của sự thành bại trong cuộc đời.',
    sample_sentence:
      "Lời đúc kết 'Thất bại là mẹ thành công' nhắc nhở chúng ta rằng người chiến thắng không phải là người không bao giờ ngã, mà là người biết biến từng vết sẹo vấp ngã thành bài học đắt giá để đứng dậy kiên cường hơn.",
    english_anchor: 'Failure as a Stepping Stone',
    keywords: ['thất bại', 'thành công', 'bài học', 'tư duy phát triển', 'đứng dậy'],
    is_featured: true,
  },

  // ===========================================================================
  // 46. CÁI KHÓ LÓ CÁI KHÔN (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-46-cai-kho-lo-cai-khon',
    proverb: 'Cái khó ló cái khôn',
    pillar: 'skills_conduct',
    sub_category: 'adaptability',
    literal_meaning:
      "Trong sách cụ Lê Văn Hòe phân tích đối chiếu với câu 'Cái khó bó cái khôn'. 'Ló' là nhú ra, ló rạng ra. Khi rơi vào hoàn cảnh gian khó, túng quẫn, tình thế bế tắc lại thúc bách trí óc con người phải suy nghĩ, xoay xở và nảy sinh ra những sáng kiến, mưu lược khôn khéo phi thường.",
    figurative_meaning:
      'Nghịch cảnh và hoàn cảnh ngặt nghèo là động lực đánh thức tiềm năng sáng tạo, thúc đẩy con người tìm ra những giải pháp đột phá mà lúc bình thường no đủ không bao giờ nghĩ tới.',
    life_skill_note:
      'Rèn luyện cho học sinh tính tự lập và khả năng giải quyết vấn đề: khi gặp tình huống thiếu đồ dùng học tập hay gặp bài toán lạ, hãy bình tĩnh suy nghĩ tìm cách thay thế hoặc thử hướng tiếp cận mới thay vì buông xuôi chờ đợi.',
    dialectical_view:
      "Cụ Lê Văn Hòe lưu ý tư duy biện chứng sâu sắc: 'Cái khó ló cái khôn' chỉ xảy ra với người có ý chí, giàu nghị lực và biết suy nghĩ sáng suốt. Đối với kẻ yếu đuối, lười biếng hoặc thiếu phương tiện cơ bản thì lại rơi vào tình cảnh 'Cái khó bó cái khôn', tức sự nghèo đói trói buộc khiến trí lực bị cùn mòn.",
    essay_evidence_usage:
      'Thích hợp cho các đề văn về năng lực sáng tạo, khả năng thích ứng linh hoạt, tinh thần vượt khó; nên đặt ở Luận điểm phân tích sức mạnh của tư duy đổi mới trước trở ngại.',
    sample_sentence:
      "Hiểu được lẽ đời 'Cái khó ló cái khôn', ta nhận thấy hoàn cảnh khắc nghiệt chưa hẳn là rào cản, mà có thể trở thành đòn bẩy kích hoạt những sáng kiến vượt bậc của trí tuệ con người.",
    english_anchor: 'Necessity is the Mother of Invention',
    keywords: ['sáng tạo', 'thích nghi', 'nghịch cảnh', 'khôn ngoan', 'giải pháp'],
    is_featured: true,
  },

  // ===========================================================================
  // 47. CHỚ THẤY SÓNG CẢ MÀ NGÃ TAY CHÈO (morality_society)
  // ===========================================================================
  {
    id: 'proverb-47-cho-thay-song-ca-ma-nga-tay-cheo',
    proverb: 'Chớ thấy sóng cả mà ngã tay chèo',
    pillar: 'morality_society',
    sub_category: 'perseverance',
    literal_meaning:
      "Cụ Lê Văn Hòe phân tích trong tập 3: 'Sóng cả' là ngọn sóng lớn trên sông biển lúc giông bão; 'ngã tay chèo' là tay chèo bị ngả nghiêng, lơi lỏng, không quả quyết ráo riết giữ chặt lấy mái chèo mà muốn buông xuôi. Thấy sóng to mà nới tay chèo thì thuyền ắt chìm; phải vững vàng tay chèo để lướt qua cơn sóng dữ.",
    figurative_meaning:
      'Khuyên con người trước những khó khăn to lớn, những biến cố dữ dội của cuộc đời không được nản lòng, thối chí hay dao động buông xuôi; phải giữ vững ý chí ban đầu để chèo lái con thuyền số phận vượt qua giông bão.',
    life_skill_note:
      'Nhắc nhở học sinh giữ vững tinh thần khi bước vào giai đoạn ôn thi áp lực hoặc gặp những trở ngại lớn trong cuộc sống: càng khó khăn càng cần bình tĩnh, quyết tâm và giữ vững mục tiêu đã đề ra.',
    dialectical_view:
      'Đúng khi khuyên giữ vững dũng khí và lòng kiên định. Tuy nhiên, giữ vững tay chèo không có nghĩa là liều lĩnh đâm thẳng vào mắt bão một cách tự sát; khi hiểm họa quá lớn, người cầm lái khôn ngoan phải biết lượn theo chiều sóng gió, tạm neo đậu an toàn để bảo toàn sinh mệnh rồi mới tiếp tục hành trình.',
    essay_evidence_usage:
      'Rất đắc địa trong các bài văn nghị luận về lòng can đảm, ý chí kiên định, bản lĩnh đương đầu với thử thách; thích hợp làm câu mở đầu tạo cảm xúc hoặc làm luận cứ then chốt ở phần Thân bài.',
    sample_sentence:
      "Lời căn dặn 'Chớ thấy sóng cả mà ngã tay chèo' như một lời hiệu triệu của tinh thần bất khuất, nhắc nhở ta rằng sự kiên định nơi tâm bão mới chính là phẩm chất phân định người bản lĩnh với kẻ tầm thường.",
    english_anchor: 'Courage Amidst Storms',
    keywords: ['kiên định', 'bản lĩnh', 'sóng cả', 'vững tay chèo', 'không nản chí'],
    is_featured: true,
  },

  // ===========================================================================
  // 48. NGƯỜI TA ĐI MÃI CŨNG THÀNH ĐƯỜNG (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-48-nguoi-ta-di-mai-cung-thanh-duong',
    proverb: 'Người ta đi mãi cũng thành đường',
    pillar: 'skills_conduct',
    sub_category: 'growth_mindset',
    literal_meaning:
      'Đúc kết từ quy luật thực tế: Ban đầu mặt đất chỉ là rừng rậm hoang vu hoặc bụi rậm cỏ gai chưa có lối; nhưng khi có người bước qua nhiều lần, giẫm đạp lên cỏ đá thì đất bằng phẳng lại và tự khắc mở ra một con đường quang đãng, dễ đi.',
    figurative_meaning:
      'Mọi kỹ năng thành thạo, thói quen tốt đẹp và con đường sự nghiệp vĩ đại đều bắt đầu từ những bước chân mò mẫm đầu tiên; chỉ cần con người kiên trì hành động và lặp lại liên tục thì con đường khai phóng sẽ mở ra.',
    life_skill_note:
      "Khớp với cơ chế hình thành đường dẫn thần kinh trong não bộ: khi học một kỹ năng mới khó khăn, đừng nản vì não bộ chưa kịp tạo liên kết; chỉ cần luyện tập đều đặn mỗi ngày, 'lối mòn' tư duy sẽ mở rộng và biến việc khó thành phản xạ tự nhiên.",
    dialectical_view:
      "Đúng khi khẳng định sức mạnh của hành động kiên trì và tiên phong. Nhưng cần lưu ý: con đường mở ra phải đi đúng hướng mục tiêu; nếu đi mãi một con đường sai lầm hoặc lặp lại thói quen xấu thì cũng sẽ 'đổ bê tông' cho một lối mòn tai hại rất khó xóa bỏ.",
    essay_evidence_usage:
      'Phù hợp đưa vào bài văn nghị luận về tinh thần dấn thân, bản lĩnh khai mở con đường mới, phương pháp tự học và tư duy phát triển; nên đặt ở Luận điểm bàn về sự khởi đầu và kiên trì.',
    sample_sentence:
      "Đúng như chân lý 'Người ta đi mãi cũng thành đường', ranh giới giữa những điều bất khả thi và hiện thực đôi khi chỉ cách nhau bằng lòng dũng cảm đặt xuống những bước chân tiên phong đầu tiên.",
    english_anchor: 'Path-making through Persistence',
    keywords: ['mở đường', 'thói quen', 'dấn thân', 'kiên trì', 'phản xạ'],
    is_featured: true,
  },

  // ===========================================================================
  // 49. CÓ ĐI MỚI ĐẾN, CÓ HỌC MỚI HAY (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-49-co-di-moi-den-co-hoc-moi-hay',
    proverb: 'Có đi mới đến, có học mới hay',
    pillar: 'skills_conduct',
    sub_category: 'learning_action',
    literal_meaning:
      "Cụ Lê Văn Hòe giải nghĩa ở tập 2: 'Có đi mới đến' nghĩa là muốn tới được nơi nào thì phải bước chân mà đi, cứ ngồi yên một chỗ thì dù nơi định đến có gần gang tấc cũng không bao giờ tới; 'có học mới hay' là có chịu khó học hỏi mới biết điều hiểu đạo, không học thì điều rất xoàng, rất dễ cũng không bao giờ biết được.",
    figurative_meaning:
      'Khuyên con người phải biết gắn liền nhận thức với hành động thực tế; muốn hiểu biết sâu rộng và đạt được thành tựu trong cuộc đời thì bắt buộc phải chủ động dấn thân, học tập và rèn luyện chứ không thể trông chờ vào phép màu.',
    life_skill_note:
      'Nhắc học sinh không nên chỉ ngồi một chỗ ước mơ đạt điểm tốt hay giỏi giang mà lười mở sách ra học; hãy bắt tay vào làm bài tập ngay từ hôm nay, vì hành động là cây cầu duy nhất biến ước mơ thành hiện thực.',
    dialectical_view:
      "Đúng đắn khi ca ngợi hành động thực tiễn và tinh thần hiếu học. Tuy nhiên, 'đi' phải có định hướng và la bàn chỉ đường, 'học' phải có phương pháp khoa học và tư duy phản biện; nếu đi mù quáng và học vẹt thụ động thì vừa hao công tốn sức vừa không đạt được kết quả.",
    essay_evidence_usage:
      'Thích hợp cho các bài văn nghị luận về mối quan hệ giữa học và hành, tinh thần chủ động trong cuộc sống, bài học về sự dấn thân; nên đặt ở phần Thân bài làm luận điểm thúc đẩy hành động.',
    sample_sentence:
      "Thấm nhuần lời răn 'Có đi mới đến, có học mới hay', người trẻ cần hiểu rằng tri thức và tương lai tươi sáng không bao giờ tự gõ cửa nếu đôi chân ta còn chần chừ và tâm trí ta còn ngại ngùng học hỏi.",
    english_anchor: 'Action & Learning',
    keywords: ['hành động', 'học tập', 'chủ động', 'dấn thân', 'thực tiễn'],
    is_featured: true,
  },

  // ===========================================================================
  // 50. ĐI MỘT NGÀY ĐÀNG, HỌC MỘT SÀNG KHÔN (morality_society)
  // ===========================================================================
  {
    id: 'proverb-50-di-mot-ngay-dang-hoc-mot-sang-khon',
    proverb: 'Đi một ngày đàng, học một sàng khôn',
    pillar: 'morality_society',
    sub_category: 'experiential_learning',
    literal_meaning:
      "Cụ Lê Văn Hòe phân tích ở tập 2: 'Đàng' là đường; đi đường suốt một ngày (tức đi xa khỏi xóm làng quen thuộc) thì thu lượm được một sàng đầy những điều khôn ngoan, hiểu biết mới lạ về phong tục, cảnh vật và lề lối làm ăn của thiên hạ.",
    figurative_meaning:
      "Khuyên con người nên bước chân ra thế giới bên ngoài để trải nghiệm, giao lưu và mở rộng tầm mắt; phê phán lối sống quẩn quanh xó nhà, tự mãn với sự hiểu biết nhỏ hẹp 'ở nhà với mẹ biết ngày nào khôn'.",
    life_skill_note:
      'Khuyến khích học sinh tích cực tham gia các hoạt động ngoại khóa, dã ngoại, đọc sách và kết bạn mới để bồi đắp vốn sống thực tế, giúp bản thân trở nên tự tin, cởi mở và linh hoạt hơn.',
    dialectical_view:
      "Đúng khi đề cao việc học hỏi từ trải nghiệm thực tế. Song việc 'đi' ra ngoài xã hội cần có bản lĩnh sàng lọc và nền tảng đạo đức vững vàng; nếu đi ra ngoài mà không biết chọn bạn, a dua học đòi thói hư tật xấu thì 'sàng khôn' sẽ biến thành 'sàng dại'.",
    essay_evidence_usage:
      'Rất đắc địa trong các bài văn về ý nghĩa của việc trải nghiệm thực tế, tinh thần tự học từ cuộc đời, mở rộng thế giới quan; thích hợp đặt ở Luận điểm bàn về cách bồi dưỡng tri thức đa chiều.',
    sample_sentence:
      "Lời đúc kết 'Đi một ngày đàng, học một sàng khôn' là lời cổ vũ bất hủ cho tinh thần học hỏi từ trường đời, nhắc ta biết vượt thoát khỏi ao làng chật hẹp để đón nhận những chân trời văn hóa mới mẻ.",
    english_anchor: 'Experiential Learning & Travel',
    keywords: ['trải nghiệm', 'đi một ngày đàng', 'sàng khôn', 'mở rộng tầm mắt', 'thế giới quan'],
    is_featured: true,
  },

  // ===========================================================================
  // 51. TRĂM HAY KHÔNG BẰNG TAY QUEN (skills_conduct)
  // ===========================================================================
  {
    id: 'proverb-51-tram-hay-khong-bang-tay-quen',
    proverb: 'Trăm hay không bằng tay quen',
    pillar: 'skills_conduct',
    sub_category: 'practical_experience',
    literal_meaning:
      "Trong sách cụ Lê Văn Hòe ghi nhận biến thể 'Trăm hay chẳng tày tay quen'. 'Trăm hay' là sự hiểu biết lý thuyết rộng lớn, tinh thông trăm điều trên sách vở; 'chẳng tày' là chẳng bằng; 'tay quen' là đôi bàn tay đã thao tác nhiều lần đến mức thành thạo, điêu luyện. Biết trăm điều sách vở không bằng bàn tay quen làm việc thực tế.",
    figurative_meaning:
      'Đề cao giá trị của kỹ năng thực hành và kinh nghiệm cọ xát thực tế; phê phán những người chỉ giỏi lý thuyết suông nhưng khi bắt tay vào việc thực tế thì vụng về, lúng túng.',
    life_skill_note:
      'Nhắc nhở học sinh lớp 7 khi học các môn kỹ năng (Toán, Ngoại ngữ, Tin học, Nhạc cụ...) thì đừng chỉ đọc thuộc công thức trong sách, mà phải luyện tập gõ phím, giải bài, tập nói hàng ngày để tạo thành phản xạ tự nhiên của cơ thể.',
    dialectical_view:
      'Đúng khi nhấn mạnh sự thuần thục kỹ năng thông qua thực hành. Tuy nhiên, không nên tuyệt đối hóa kinh nghiệm thuần túy mà xem nhẹ lý thuyết nền tảng; một đôi bàn tay quen việc khi được dẫn dắt bởi một bộ óc tinh thông lý thuyết khoa học sẽ tạo ra năng suất và sáng tạo vượt bậc.',
    essay_evidence_usage:
      "Phù hợp cho các đề văn bàn về phương châm 'Học đi đôi với hành', tầm quan trọng của thực hành, rèn luyện kỹ năng sống; nên đặt ở Luận điểm phân tích sự kết hợp giữa tri thức và hành động.",
    sample_sentence:
      "Chân lý 'Trăm hay không bằng tay quen' nhắc nhở chúng ta rằng mọi kiến thức uyên bác trên trang giấy sẽ chỉ là lý thuyết chết nếu không được tôi luyện qua sự nhẫn nại của đôi bàn tay thực hành mỗi ngày.",
    english_anchor: 'Practice Makes Perfect',
    keywords: ['thực hành', 'kỹ năng', 'quen tay', 'kinh nghiệm', 'rèn luyện'],
    is_featured: true,
  },
];

export const PROVERBS_SEED_DATA: ProverbItem[] = deepNormalizeVietnamese(RAW_PROVERBS_SEED_DATA);

