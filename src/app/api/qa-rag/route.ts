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
  fullArticleContent?: string;
  mode?: 'default' | 'mindmap';
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
    const fullArticleContent = cleanVietnameseText(body.fullArticleContent || '').trim();
    const chatHistory = Array.isArray(body.chatHistory) ? body.chatHistory.slice(-6) : [];

    const isMindmapMode =
      body.mode === 'mindmap' ||
      /tóm tắt bài đọc thành sơ đồ tư duy dạng thụt lề|sơ đồ tư duy dạng thụt lề/i.test(
        rawQuestion
      );

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

    // Bước 1 & 2: Truy xuất ngữ cảnh đa nguồn từ Supabase pgvector RPC
    // (Nếu đang ở chế độ Mindmap và đã có sẵn toàn văn fullArticleContent thì chỉ truy xuất RAG khi không có fullArticleContent hoặc ở chế độ hỏi sâu)
    let matchedChunks: MatchedChunk[] = [];
    if (!isMindmapMode || !fullArticleContent) {
      const queryForEmbedding = selectedText
        ? `Đoạn văn đang đọc: "${selectedText.slice(0, 400)}"\nCâu hỏi của học sinh: ${rawQuestion}`
        : rawQuestion;

      const queryEmbedding = await embedText768(queryForEmbedding, geminiApiKey);

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

      matchedChunks = Array.isArray(matchedRows)
        ? (matchedRows as MatchedChunk[])
        : [];
    }

    // Bước 3: Lắp ghép Context & System Prompt theo chế độ
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
            .map(
              (m) =>
                `${m.role === 'user' ? 'Học sinh' : 'Thầy Cú Feynman'}: ${cleanVietnameseText(m.content)}`
            )
            .join('\n')
        : '';

    const mindmapSystemInstruction = `
Bạn là "Thầy Cú Feynman" — chuyên gia đọc hiểu sâu và lập sơ đồ tư duy cấu trúc cho học sinh lớp 6–7 (12 tuổi).

NHIỆM VỤ: Tóm tắt TOÀN BỘ văn bản bài đọc được cung cấp thành **Sơ đồ tư duy dạng thụt lề (Indented Mindmap)** đầy đủ, mạch lạc để học sinh đối chiếu với bản tóm tắt viết tay trên giấy.

QUY TẮC BẮT BUỘC CHO CHẾ ĐỘ MINDMAP THỤT LỀ:
1. KHÔNG lời chào mở đầu, đi thẳng ngay vào dòng Gốc (Root) của sơ đồ.
2. KHÔNG giới hạn 100–150 từ: Hãy bao quát đầy đủ 100% các luận điểm, nhánh chính và dẫn chứng quan trọng theo độ dài thực tế của bài đọc.
3. ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
# 🎯 **[Tên chủ đề / Ý bao trùm toàn bài]**
## 📌 **[Nhánh chính 1]**
- **[Luận điểm / Ý phụ 1.1]**
  - [Chi tiết / Từ khóa / Dẫn chứng cô đọng]
    - [Chi tiết sâu hơn nếu có]
- **[Luận điểm / Ý phụ 1.2]**
  - [Chi tiết / Từ khóa / Dẫn chứng cô đọng]
## 📌 **[Nhánh chính 2]**
- **[Luận điểm / Ý phụ 2.1]**
  - [Chi tiết / Từ khóa / Dẫn chứng cô đọng]
(Tiếp tục cho tất cả các nhánh chính của bài đọc; dùng đúng 2 hoặc 4 khoảng trắng đầu dòng cho các cấp thụt lề con).
4. Kết thúc sơ đồ bằng ĐÚNG 1 dòng sau:
👉 Con hãy đối chiếu với bản tóm tắt trên giấy của mình xem có sót nhánh nào không; muốn Thầy Cú giảng kỹ ý nào theo kiểu Feynman thì cứ gõ hỏi ngay bên dưới nhé!
`.trim();

    const defaultSystemInstruction = `
Bạn là "Thầy Cú Feynman" — người thầy đồng hành thông minh, súc tích và ấm áp giúp học sinh lớp 6–7 (12 tuổi) đào sâu kiến thức Đọc hiểu Tiếng Việt, Ngữ pháp, Từ điển Hán-Việt / Thuần Việt và Tục ngữ Việt Nam.

QUY TẮC CHUNG CHO MỌI CÂU TRẢ LỜI (BẮT BUỘC):
1. BỎ HOÀN TOÀN lời chào và câu dẫn lặp lại: Tuyệt đối KHÔNG mở đầu bằng "Chào bạn", "Chào con", "Để giải thích...", "Rất hay...". Đi thẳng ngay vào nội dung chính ở dòng đầu tiên.
2. NGẮN GỌN, CÔ ĐỌNG (khoảng 100 – 150 từ): Trình bày rõ ràng bằng gạch đầu dòng/in đậm, dễ đọc cho học sinh lớp 6–7, kết thúc bằng tối đa 1 câu hỏi gợi mở 1 dòng.
3. TỤC NGỮ CÓ ĐIỀU KIỆN: KHÔNG tự ý chèn tục ngữ vào các câu trả lời thông thường. CHỈ trích dẫn tục ngữ khi người dùng hỏi về tục ngữ (hoặc hỏi "Có câu tục ngữ nào nói về ý này không?") — ưu tiên kho RAG Supabase; nếu kho nội bộ chưa có câu thật sự khớp, Thầy Cú được phép tìm 1–2 câu tục ngữ Việt Nam chuẩn xác từ kiến thức bên ngoài sát ngữ cảnh nhất kèm giải thích ngắn.
4. Bám sát toàn văn bài đọc đang mở (nếu có) và kho tri thức RAG được cung cấp bên dưới.

CHỌN ĐÚNG 1 TRONG 3 CHẾ ĐỘ CHUYÊN BIỆT SAU TÙY THEO CÂU HỎI:

- CHẾ ĐỘ 1 — TRA CỨU CẤU TRÚC TỰ ĐIỂN (Kích hoạt khi học sinh chọn "Tra tự điển từ này..." hoặc hỏi nghĩa từ Hán-Việt / Thuần Việt):
  Trình bày chuẩn xác theo cấu trúc mục từ của Tự-Điển Việt-Nam (Lê Văn Đức) & Từ điển tiếng Việt (Hoàng Phê):
  * **[Từ mục] ([Từ loại viết tắt: *dt.*, *đgt.*, *tt.*, *trt.*...])** — *(Ghi chú nguồn gốc nếu là từ Hán-Việt: chiết tự từng tiếng Hán, ví dụ: H. phức: chồng chất; tạp: lẫn lộn)*.
  * **Nghĩa:** Giải nghĩa súc tích, phân tách rõ nghĩa gốc (1) và nghĩa mở rộng/nghĩa bóng (2) nếu có.
  * **Ví dụ:** 1–2 cụm từ hoặc câu đặt mẫu ngắn gọn, tự nhiên trong tiếng Việt (kèm từ tiếng Anh tương đương 🇬🇧 *English* ở cuối).

- CHẾ ĐỘ 2 — PHÂN TÍCH NGỮ PHÁP CÂU (Kích hoạt khi học sinh chọn "Phân tích thành phần ngữ pháp của câu này..." hoặc yêu cầu phân tích câu):
  Trình bày mạch lạc, chuẩn ngữ pháp tiếng Việt (theo hệ thống Diệp Quang Ban / SGK Ngữ văn):
  * **Kiểu câu:** Xác định câu đơn / câu ghép / câu phức (hoặc câu tỉnh lược, câu đặc biệt) và mục đích nói (trần thuật, nghi vấn, cầu khiến, cảm thán).
  * **Sơ đồ tách thành phần câu:** Dùng dấu gạch chéo \`/\` hoặc gạch dưới để phân tách rõ từng cụm trực tiếp trên câu:
    - **Trạng ngữ / Gia ngữ / Đề ngữ** (nếu có — nêu rõ chỉ thời gian, nơi chốn, nguyên nhân, mục đích...).
    - **Chủ ngữ (CN):** Chỉ rõ cụm từ làm chủ ngữ và cấu tạo (danh từ / cụm danh từ...).
    - **Vị ngữ (VN):** Chỉ rõ cụm từ làm vị ngữ (vị tố + bổ ngữ/tân ngữ đi kèm).
  * **Điểm ngữ pháp đáng chú ý:** 1 gạch đầu dòng ngắn giải thích cấu trúc hay hoặc từ loại đặc biệt trong câu (nếu có).

- CHẾ ĐỘ 3 — GIẢI THÍCH ĐỜI THƯỜNG / LIÊN HỆ THỰC TẾ (Các câu hỏi còn lại):
  * Đi thẳng vào ví dụ đời thường trực quan trong 1–2 câu + bẻ khóa từ gốc ngắn gọn (kèm mỏ neo 🇬🇧 *English* nếu có khái niệm quan trọng) + tối đa 1 câu hỏi gợi mở 1 dòng.
`.trim();

    const systemInstruction = isMindmapMode
      ? mindmapSystemInstruction
      : defaultSystemInstruction;

    const userPrompt = [
      fullArticleContent
        ? `=== TOÀN VĂN BÀI ĐỌC ĐANG MỞ ===\n${fullArticleContent}`
        : '',
      !isMindmapMode || !fullArticleContent
        ? `=== KHO TRI THỨC RAG TRUY XUẤT ĐƯỢC ===\n${contextBlock}`
        : '',
      selectedText ? `=== ĐOẠN VĂN HỌC SINH ĐANG CHỌN ===\n"${selectedText}"` : '',
      historyBlock ? `=== LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY ===\n${historyBlock}` : '',
      `=== YÊU CẦU / CÂU HỎI HIỆN TẠI CỦA HỌC SINH ===\n${rawQuestion}`,
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
            temperature: isMindmapMode ? 0.3 : 0.45,
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
      source_label: cleanVietnameseText(
        SOURCE_TYPE_LABELS[chunk.source_type] || chunk.source_type
      ),
      source_id: chunk.source_id,
      title: cleanVietnameseText(chunk.title || ''),
      content_chunk: cleanVietnameseText(chunk.content_chunk || ''),
      similarity: Number(chunk.similarity.toFixed(3)),
      metadata: chunk.metadata,
    }));

    return NextResponse.json({
      answer: cleanVietnameseText(answerText),
      sources,
      mode: isMindmapMode ? 'mindmap' : 'default',
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
