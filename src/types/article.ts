// Types for Reading Articles and the 5-Step structured_data JSON contract

export interface ArticleMeta {
  slug: string;
  topic: string;
  target_grade: number;
  word_count: number;
  estimated_minutes: number;
}

export interface ParentCoachingScript {
  say_aloud_script?: string;
  pedagogical_focus?: string;
  ask_child_prompt?: string;
  visual_hint?: string;
}

export interface Paragraph {
  id: string;
  actor: 'parent' | 'student';
  text: string;
  parent_coaching: ParentCoachingScript;
}

export interface InlineVocabulary {
  word: string;
  compound_slug: string;
  anchor_text: string;
}

export interface OrganizerSlot {
  id: string;
  label: string;
  expected_card_id: string;
}

export interface OrganizerCard {
  id: string;
  text: string;
}

export interface Step2GraphicOrganizer {
  type: 'cause_and_effect' | 'venn' | 'story_mountain';
  title: string;
  slots: OrganizerSlot[];
  cards: OrganizerCard[];
}

export interface ReciprocalCard {
  role: 'Predict' | 'Clarify' | 'Question' | 'Summarize';
  task: string;
}

export interface QARQuestion {
  id: string;
  level: 'right_there' | 'think_and_search' | 'author_and_me';
  level_name: string;
  color_tag: string;
  question: string;
  options?: string[];
  correct_index?: number;
  open_ended?: boolean;
  evaluation_criteria?: string;
  text_anchor?: string;
}

export interface OfflineBook {
  title: string;
  author: string;
  publisher: string;
  highlight: string;
}

export interface Step5ScreenToPaper {
  handwritten_task: string;
  offline_books: OfflineBook[];
}

export interface StructuredData {
  article_meta: ArticleMeta;
  step_1_think_aloud: {
    paragraphs: Paragraph[];
  };
  inline_vocabulary: InlineVocabulary[];
  step_2_graphic_organizer: Step2GraphicOrganizer;
  step_3_reciprocal_cards: ReciprocalCard[];
  step_4_qar_questions: QARQuestion[];
  step_5_screen_to_paper: Step5ScreenToPaper;
}

export interface ReadingArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  target_grade: number;
  estimated_minutes: number;
  hero_image_url?: string;
  content_raw: string;
  structured_data: StructuredData;
  is_published: boolean;
  created_at: string;
}
