import { GoogleGenAI } from '@google/genai';

export const EMBEDDING_DIMENSION = 768;
const EMBEDDING_MODELS = ['gemini-embedding-001', 'text-embedding-004'] as const;

function getAiClient(apiKey?: string): GoogleGenAI {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Thiếu GEMINI_API_KEY trong biến môi trường.');
  }
  return new GoogleGenAI({ apiKey: key });
}

/**
 * Tạo vector embedding 768 chiều cho một chuỗi văn bản.
 */
export async function embedText768(text: string, apiKey?: string): Promise<number[]> {
  const vectors = await embedBatch768([text], apiKey);
  if (!vectors[0] || vectors[0].length !== EMBEDDING_DIMENSION) {
    throw new Error('Không nhận được vector embedding 768 chiều hợp lệ từ Gemini.');
  }
  return vectors[0];
}

/**
 * Tạo vector embedding 768 chiều theo lô (batch) cho nhiều văn bản cùng lúc.
 */
export async function embedBatch768(texts: string[], apiKey?: string): Promise<number[][]> {
  if (texts.length === 0) return [];
  const ai = getAiClient(apiKey);
  const cleanedTexts = texts.map((t) => t.trim().normalize('NFC'));

  let lastError: unknown;
  for (const model of EMBEDDING_MODELS) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: cleanedTexts,
        config: {
          outputDimensionality: EMBEDDING_DIMENSION,
        },
      });

      const embeddings = response.embeddings || [];
      if (embeddings.length === cleanedTexts.length) {
        return embeddings.map((item) => {
          const vals = item.values || [];
          if (vals.length !== EMBEDDING_DIMENSION) {
            throw new Error(`Số chiều vector trả về (${vals.length}) khác ${EMBEDDING_DIMENSION}`);
          }
          return vals;
        });
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Lỗi khi gọi Gemini Embedding API.');
}

