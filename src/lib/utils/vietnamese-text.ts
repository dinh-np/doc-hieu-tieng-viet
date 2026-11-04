/**
 * TIỆN ÍCH CHUẨN HÓA VĂN BẢN TIẾNG VIỆT VỀ UNICODE DỰNG SẴN (NFC)
 * Khắc phục triệt để lỗi tách rời dấu thanh (NFD) hoặc ký tự khoảng trắng chèn giữa chữ và dấu.
 */

export function cleanVietnameseText(str: string): string {
  if (!str) return '';
  // Loại bỏ khoảng trắng vô tình bị chèn giữa chữ cái và dấu phụ tổ hợp (Combining Diacritical Marks)
  let cleaned = str.replace(/([\p{L}])\s+([\u0300-\u036f]+)/gu, '$1$2');
  // Chuẩn hóa về Unicode NFC (Canonical Composition - tiếng Việt dựng sẵn)
  cleaned = cleaned.normalize('NFC');
  return cleaned;
}

/**
 * Đệ quy chuẩn hóa toàn bộ các trường string trong một Object / Array về Unicode NFC
 */
export function deepNormalizeVietnamese<T>(input: T): T {
  if (typeof input === 'string') {
    return cleanVietnameseText(input) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => deepNormalizeVietnamese(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      result[key] = deepNormalizeVietnamese(value);
    }
    return result as T;
  }
  return input;
}

