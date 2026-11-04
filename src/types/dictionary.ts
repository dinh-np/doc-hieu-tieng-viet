// Types for the Han-Viet & Thuan-Viet Dictionary Modules

export interface HanVietRoot {
  id: string;
  hanzi?: string;
  reading_vi: string;     // e.g. "Hải", "Đăng"
  root_meaning: string;   // e.g. "Biển", "Cây đèn"
  created_at: string;
}

export interface CompoundRootLink {
  id: string;
  compound_id: string;
  root_id: string;
  position_order: 1 | 2;
  related_words: string[];
  root?: HanVietRoot;
}

export interface QuizOption {
  text: string;
  is_correct: boolean;
}

export interface QuizData {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface HanVietCompound {
  id: string;
  word: string;                // e.g. "Hải đăng", "Nghịch lý"
  slug: string;
  full_meaning: string;
  example_sentence: string;
  math_formula: string;        // e.g. "Hải (Biển) + Đăng (Đèn) → Ngọn đèn biển"
  english_equivalent?: string | null; // e.g. "Lighthouse", "Prosperous / Flourishing"
  subject_tag: string;         // 'SGK', 'ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc'
  grade_level: number;
  quiz_data: QuizData;
  created_at: string;
  root_links?: CompoundRootLink[];
}

export type ThuanVietWordType =
  | 'tu_lay'
  | 'tu_tuong_hinh'
  | 'tu_tuong_thanh'
  | 'tu_da_nghia';

export interface ThuanVietEntry {
  id: string;
  word: string;                    // e.g. "màu mỡ", "nhấp nhô", "bạt ngàn"
  word_type: ThuanVietWordType | string;
  simple_meaning: string;          // Nghĩa đời thường cho học sinh 12 tuổi
  mental_image?: string | null;    // Gợi ý bức tranh tưởng tượng (Visual clue)
  context_clue?: string | null;    // Mẹo nhận biết qua ngữ cảnh (3 chữ trước / sau)
  english_equivalent?: string | null; // Từ tiếng Anh tương đương (e.g. "Fertile", "Undulating")
  example_sentence: string;        // Câu ví dụ chuẩn văn cảnh SGK hoặc đời sống
  synonyms?: string[];             // Từ đồng nghĩa đời thường
  grade_level: number;
  subject_tag: string;
  quiz_data?: QuizData | null;     // Câu đố tương tác mini cho từ này
  created_at: string;
}

export interface EtymologyFormula {
  compound: HanVietCompound;
  root1: HanVietRoot & { related_words: string[] };
  root2: HanVietRoot & { related_words: string[] };
}

export interface EtymologyGardenEntry {
  id: string;
  user_id: string;
  compound_id: string;
  unlocked_at: string;
  compound?: HanVietCompound;
}

// Subject tag display names
export const SUBJECT_TAG_LABELS: Record<string, string> = {
  'SGK': 'SGK Cơ Bản',
  'ngu-van': 'Ngữ Văn',
  'lich-su': 'Lịch Sử',
  'dia-ly': 'Địa Lý',
  'khoa-hoc': 'Khoa Học',
};

export const SUBJECT_TAG_COLORS: Record<string, string> = {
  'SGK': 'bg-sky-100 text-sky-700',
  'ngu-van': 'bg-violet-100 text-violet-700',
  'lich-su': 'bg-amber-100 text-amber-700',
  'dia-ly': 'bg-emerald-100 text-emerald-700',
  'khoa-hoc': 'bg-blue-100 text-blue-700',
};

// Thuan-Viet word type display labels & badge colors
export const THUAN_VIET_TYPE_LABELS: Record<string, string> = {
  tu_lay: 'Từ láy',
  tu_tuong_hinh: 'Từ tượng hình',
  tu_tuong_thanh: 'Từ tượng thanh',
  tu_da_nghia: 'Từ đa nghĩa / Giàu hình ảnh',
};

export const THUAN_VIET_TYPE_COLORS: Record<string, string> = {
  tu_lay: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  tu_tuong_hinh: 'bg-teal-100 text-teal-700 border-teal-200',
  tu_tuong_thanh: 'bg-orange-100 text-orange-700 border-orange-200',
  tu_da_nghia: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};
