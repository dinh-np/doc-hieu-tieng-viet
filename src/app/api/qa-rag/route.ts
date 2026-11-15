import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { embedText768 } from '@/lib/rag/embedding';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QaRagRequest {
  question?: string;
  currentArticleId?: string;
  selectedText?: string;
  chatHistory?: ChatMessage[];
}

interface MatchedChunk {
  id: string;
  source_type: string;
  source_id: string;
  title: string;
  content_chunk: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

const CHAT_MODELS_TO_TRY = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
] as const;

const SOURCE_TYPE_LABELS: Record<string, string> = {
  short_reading: 'Bài đọc ngắn',
  one_page: 'Bài đọc 1 trang',
  metacognition: 'Siêu nhận thức',
  han_viet: 'Từ điển Hán - Việt',
  thuan_viet: 'Từ điển Thuần Việt',
  proverb: 'Tục ngữ Việt Nam',
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as QaRagRequest;
    const rawQuestion = cleanVietnameseText(body.question || '').trim();
    const selectedText = cleanVietnameseText(body.selectedText || '').trim();
    const currentArticleId = (body.currentArticleId || '').trim();
    const chatHistory = Array.isArray(body.chatHistory) ? body.chatHistory.slice(-6) : [];

    if (!rawQuestion) {
      return NextResponse.json(
        { error: 'Vui lòng nhập câu hỏi để cùng đào sâu kiến thức.' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ.' },
        { status: 500 }
      );
    }

    // Bước 1: Tạo embedding 768 chiều cho câu hỏi (kết hợp đoạn văn đang bôi đen nếu có)
    const queryForEmbedding = selectedText
      ? `Đoạn văn đang đọc: "${selectedText.slice(0, 400)}"\nCâu hỏi của học sinh: ${rawQuestion}`
      : rawQuestion;

    const queryEmbedding = await embedText768(queryForEmbedding, geminiApiKey);

    // Bước 2: Truy xuất ngữ cảnh đa nguồn từ Supabase pgvector RPC
    const supabase = await createClient();
    const { data: matchedRows, error: rpcError } = await supabase.rpc(
      'match_knowledge_chunks',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.52,
        match_count: 6,
        priority_article_id: currentArticleId || null,
      }
    );

    if (rpcError) {
      console.error('Lỗi RPC match_knowledge_chunks:', rpcError.message);
    }

    const matchedChunks: MatchedChunk[] = Array.isArray(matchedRows)
      ? (matchedRows as MatchedChunk[])
      : [];

    // Bước 3: Lắp ghép Context & gọi Gemini theo phong cách Feynman tuổi 12
    const contextBlock =
      matchedChunks.length > 0
        ? matchedChunks
            .map((chunk, idx) => {
              const typeLabel = SOURCE_TYPE_LABELS[chunk.source_type] || chunk.source_type;
              return `--- NGUỒN ${idx + 1} [${typeLabel}] (${chunk.title}) ---\n${chunk.content_chunk}`;
            })
            .join('\n\n')
        : 'Chưa tìm thấy trích đoạn khớp trực tiếp trong kho dữ liệu nội bộ.';

    const historyBlock =
      chatHistory.length > 0
        ? chatHistory
            .map((m) => `${m.role === 'user' ? 'Học sinh' : 'Người đồng hành'}: ${cleanVietnameseText(m.content)}`)
            .join('\n')
        : '';

    const systemInstruction = `
Bạn là "Cú Đôi Feynman" — người bạn đồng hành thông minh, dí dỏm và ấm áp giúp học sinh lớp 7 (12 tuổi) đào sâu kiến thức Đọc hiểu Tiếng Việt, Tư duy phát triển (Growth Mindset), Từ điển Hán-Việt / Thuần Việt và Tục ngữ Việt Nam.

NGUYÊN TẮC SƯ PHẠM BẮT BUỘC:
1. Bám sát ngữ cảnh bài học và kho tri thức RAG được cung cấp bên dưới. Khi trích dẫn ý từ bài đọc, từ điển chiết tự Hán-Việt, từ Thuần Việt hoặc câu tục ngữ trong RAG, hãy nhắc tên nguồn một cách tự nhiên để học sinh thấy sự liên kết giữa các kho kiến thức.
2. Được phép dùng kiến thức khoa học/lịch sử/đời sống mở rộng bên ngoài để giải thích sâu hơn, nhưng PHẢI diễn đạt theo phong cách Feynman: so sánh bằng hình ảnh đời thường gần gũi với tuổi 12 (tập gym, chơi game, bản đồ GPS, cốc nước, cái cây...), tuyệt đối không nói lý thuyết khô khan.
3. Khi gặp khái niệm trừu tượng hoặc từ Hán-Việt quan trọng, hãy lồng thêm mỏ neo tiếng Anh (ví dụ: 🇬🇧 *Growth Mindset*, 🇬🇧 *Feedback*...) để kết nối tư duy song ngữ.
4. Trình bày gọn gàng, rõ ý (dùng bullet ngắn hoặc in đậm từ khóa quan trọng), độ dài vừa phải (khoảng 120–220 từ).
5. LUÔN kết thúc câu trả lời bằng ĐÚNG 1 câu hỏi gợi mở ngắn gọn, thú vị để kích thích học sinh suy nghĩ tiếp.
`.trim();

    const userPrompt = [
      `=== KHO TRI THỨC RAG TRUY XUẤT ĐƯỢC ===\n${contextBlock}`,
      selectedText ? `=== ĐOẠN VĂN HỌC SINH ĐANG CHỌN ===\n"${selectedText}"` : '',
      historyBlock ? `=== LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY ===\n${historyBlock}` : '',
      `=== CÂU HỎI HIỆN TẠI CỦA HỌC SINH ===\n${rawQuestion}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    let answerText = '';
    let lastError: unknown;

    for (const modelName of CHAT_MODELS_TO_TRY) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.45,
          },
        });
        if (res.text) {
          answerText = cleanVietnameseText(res.text).trim();
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!answerText) {
      throw lastError instanceof Error
        ? lastError
        : new Error('Không nhận được phản hồi từ Gemini.');
    }

    const sources = matchedChunks.map((chunk) => ({
      id: chunk.id,
      source_type: chunk.source_type,
      source_label: SOURCE_TYPE_LABELS[chunk.source_type] || chunk.source_type,
      source_id: chunk.source_id,
      title: chunk.title,
      content_chunk: chunk.content_chunk,
      similarity: Number(chunk.similarity.toFixed(3)),
      metadata: chunk.metadata,
    }));

    return NextResponse.json({
      answer: answerText,
      sources,
    });
  } catch (err) {
    console.error('Lỗi API /api/qa-rag:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Đã có lỗi xảy ra khi xử lý câu hỏi RAG.',
      },
      { status: 500 }
    );
  }
}

