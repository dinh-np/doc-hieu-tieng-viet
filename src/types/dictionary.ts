// Types for the Han-Viet Etymology Dictionary Module

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
  word: string;           // e.g. "Hải đăng", "Nghịch lý"
  slug: string;
  full_meaning: string;
  example_sentence: string;
  math_formula: string;   // e.g. "Hải (Biển) + Đăng (Đèn) → Ngọn đèn biển"
  subject_tag: string;    // 'ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc'
  grade_level: number;
  quiz_data: QuizData;
  created_at: string;
  root_links?: CompoundRootLink[];
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
  'ngu-van': 'Ngữ Văn',
  'lich-su': 'Lịch Sử',
  'dia-ly': 'Địa Lý',
  'khoa-hoc': 'Khoa Học',
};

export const SUBJECT_TAG_COLORS: Record<string, string> = {
  'ngu-van': 'bg-violet-100 text-violet-700',
  'lich-su': 'bg-amber-100 text-amber-700',
  'dia-ly': 'bg-emerald-100 text-emerald-700',
  'khoa-hoc': 'bg-blue-100 text-blue-700',
};
