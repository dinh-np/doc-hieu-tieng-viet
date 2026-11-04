/**
 * TYPESCRIPT INTERFACES CHO MODULE ĐỌC HIỂU SIÊU NHẬN THỨC (METACOGNITION 3 PHA)
 * Kết hợp Lời giảng Feynman & Mô hình giàn giáo Ba - Con (Think-Aloud & Marking Text)
 */

export type MarkingSymbol = '?' | '!' | '*' | 'C' | 'P' | 'KL';

export interface MarkingSymbolMeta {
  symbol: MarkingSymbol;
  label: string;
  shortDesc: string;
  fullDesc: string;
  badgeClass: string;
  highlightClass: string;
}

export const MARKING_SYMBOLS_META: Record<MarkingSymbol, MarkingSymbolMeta> = {
  '?': {
    symbol: '?',
    label: 'Khó hiểu',
    shortDesc: '[?] Khó hiểu',
    fullDesc: 'Từ ngữ hoặc ý văn con chưa rõ, cần giải mã thêm.',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    highlightClass: 'bg-rose-100/90 text-rose-950 border-b-2 border-rose-500',
  },
  '!': {
    symbol: '!',
    label: 'Bất ngờ',
    shortDesc: '[!] Bất ngờ',
    fullDesc: 'Chi tiết mới lạ, thú vị khiến con ngạc nhiên.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    highlightClass: 'bg-amber-100/90 text-amber-950 border-b-2 border-amber-500',
  },
  '*': {
    symbol: '*',
    label: 'Cốt lõi',
    shortDesc: '[*] Cốt lõi',
    fullDesc: 'Ý chính hoặc từ khóa quan trọng nhất của đoạn.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    highlightClass: 'bg-blue-100/90 text-blue-950 border-b-2 border-blue-500',
  },
  C: {
    symbol: 'C',
    label: 'Kết nối đời sống',
    shortDesc: '[C] Kết nối đời sống',
    fullDesc: 'Liên hệ với trải nghiệm của con hoặc thực tế hôm nay.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    highlightClass: 'bg-emerald-100/90 text-emerald-950 border-b-2 border-emerald-500',
  },
  P: {
    symbol: 'P',
    label: 'Dự đoán',
    shortDesc: '[P] Dự đoán',
    fullDesc: 'Dự đoán nguyên nhân hoặc hệ quả sắp diễn ra tiếp theo.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    highlightClass: 'bg-purple-100/90 text-purple-950 border-b-2 border-purple-500',
  },
  KL: {
    symbol: 'KL',
    label: 'Kết luận',
    shortDesc: '[KL] Kết luận',
    fullDesc: 'Đúc kết quy luật, nguyên lý hoặc bài học lớn.',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    highlightClass: 'bg-indigo-100/90 text-indigo-950 border-b-2 border-indigo-500',
  },
};

export interface HanVietPopItem {
  term: string;
  formula: string; // Ví dụ: "Cường [Mạnh] + Thịnh [Phát triển rực rỡ]"
  meaning: string; // Nghĩa dễ hiểu cho học sinh 12 tuổi
  english_anchor?: string;
}

export interface TextHighlightAnnotation {
  id: string;
  text: string;
  symbol: MarkingSymbol;
}

export interface ChunkData {
  chunk_id: string;
  order: number;
  title: string;
  original_text: string; // Hỗ trợ định dạng HTML/Markdown (in đậm từ khóa, bẻ khóa từ Hán-Việt)
  han_viet_Popup?: HanVietPopItem[];
  feynman_explanation: {
    dialogue_question: string; // Cặp câu hỏi kích hoạt tò mò
    dialogue_answer: string;   // Lời giải thích Feynman dí dỏm, kéo về đời sống
    metacognition_modeling: string; // Lời thoại "Ba làm mẫu - Think Aloud" giải thích quy trình tư duy
  };
  student_reflection?: {
    selected_symbols: MarkingSymbol[];
    thought_note: string;
  };
}

export interface MetacognitionArticle {
  id: string;
  slug?: string;
  subject: string; // 'Lịch sử' | 'Địa lí' | 'Ngữ văn'
  grade: number;   // 7
  title: string;
  subtitle?: string;
  target_time_minutes: number;
  // PHA 1: PLANNING
  planning: {
    active_recall_question: string;
    prediction_prompt: string;
  };
  // PHA 2: MONITORING (Danh sách các chặng đọc)
  chunks: ChunkData[];
  // PHA 3: EVALUATING
  evaluating: {
    qar_questions: {
      type: 'right_there' | 'think_search' | 'author_and_me';
      level_label: string;
      question: string;
      hint?: string;
    }[];
    mindmap_matrix: {
      category: string;
      prompt: string;
      sample_keywords?: string;
    }[];
    reflection_321: {
      three_learned: string[];
      two_surprises: string[];
      one_traffic_light: {
        status: 'green' | 'yellow' | 'red';
        question: string;
      };
    };
    takeaway_sentence: string;
  };
}

