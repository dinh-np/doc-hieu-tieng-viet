import React, { useState } from 'react';
import { ReadingArticle } from '@/types/article';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface Step0Props {
  article: ReadingArticle;
  onComplete: () => void;
}

export function Step0BookImmersion({ article, onComplete }: Step0Props) {
  const [prediction, setPrediction] = useState('');

  const rawParagraphs = (article.content_raw || '').split('\n').filter(p => p.trim() !== '');
  const structuredParagraphs = article.structured_data?.step_1_think_aloud?.paragraphs?.map(p => p.text) || [];
  
  // Ưu tiên hiển thị content_raw, nhưng nếu content_raw bị gộp thành 1 đoạn (hoặc ít đoạn hơn),
  // tự động fallback dùng structured_data để hiển thị đầy đủ các đoạn văn.
  const paragraphs = rawParagraphs.length >= structuredParagraphs.length && rawParagraphs.length > 0 
    ? rawParagraphs 
    : structuredParagraphs;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Section */}
      <div className="rounded-t-xl overflow-hidden bg-[#f8f9fa] border-b border-gray-200 shadow-sm">
        {article.hero_image_url && (
          <img
            src={article.hero_image_url}
            alt={article.title}
            className="w-full aspect-video object-cover object-center"
          />
        )}
        <div className="p-8 text-center bg-white">
          <span className="inline-block px-3 py-1 bg-[#0066ab]/10 text-[#0066ab] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {article.category || 'Bài đọc'}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 font-reading">
            {article.title}
          </h1>
          <p className="text-slate-500 text-sm">
            Thời gian đọc dự kiến: {article.estimated_minutes || 10} phút
          </p>
        </div>
      </div>

      {/* Full Content Canvas */}
      <div className="bg-[#fefefe] border border-gray-200 rounded-lg p-8 md:p-12 shadow-sm">
        <div 
          className="prose prose-lg max-w-none prose-slate font-reading"
          style={{ color: '#1f2937' }}
        >
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-justify leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Prediction Box */}
      <div className="bg-white border-2 border-[#0066ab]/20 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#0066ab]/10 rounded-full">
            <Lightbulb className="w-5 h-5 text-[#0066ab]" />
          </div>
          <h3 className="text-lg font-bold text-[#0066ab]">
            Kích hoạt tư duy: Con dự đoán điều gì?
          </h3>
        </div>
        
        <p className="text-slate-700 mb-4">
          Dựa vào nhan đề và bức ảnh chụp từ trên cao, con hãy dự đoán: Vì sao giữa một cơn bão dữ dội lại xuất hiện vùng 'mắt bão' tĩnh lặng và quang đãng?
        </p>
        
        <textarea
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          placeholder="Nhập dự đoán của con vào đây..."
          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0066ab] focus:border-transparent resize-none mb-4 text-slate-800"
        />

        <button
          onClick={onComplete}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0066ab] text-white rounded-md font-bold hover:bg-[#005590] transition-colors ml-auto"
        >
          Con đã dự đoán xong <ArrowRight className="w-4 h-4" /> Bắt đầu đọc sâu cùng Cha
        </button>
      </div>
    </div>
  );
}
