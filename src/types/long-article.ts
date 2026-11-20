export type LongArticleSubject =
  | 'Ngữ văn'
  | 'Lịch sử'
  | 'Địa lí'
  | 'Khoa học'
  | 'Kỹ năng sống'
  | 'Tự do';

export const LONG_ARTICLE_SUBJECTS: LongArticleSubject[] = [
  'Ngữ văn',
  'Lịch sử',
  'Địa lí',
  'Khoa học',
  'Kỹ năng sống',
  'Tự do',
];

export interface LongArticle {
  id: string;
  slug: string;
  title: string;
  subject: string;
  grade: number;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}
