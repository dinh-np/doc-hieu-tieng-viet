import type { Metadata } from 'next';
import DictionaryPageClient from './DictionaryClient';

export const metadata: Metadata = {
  title: 'Từ Điển Hán-Việt | Đọc Hiểu Tiếng Việt',
  description: '30 từ Hán-Việt lớp 7 với công thức toán học. Học từ vựng theo gốc hình vị.',
};

export default function DictionaryPage() {
  return <DictionaryPageClient />;
}
