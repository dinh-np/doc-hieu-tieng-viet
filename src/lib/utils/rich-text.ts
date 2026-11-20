import { cleanVietnameseText } from './vietnamese-text';

/**
 * Loại bỏ các thẻ HTML nguy hiểm (XSS) nhưng giữ nguyên các thẻ định dạng văn bản học tập.
 */
export function sanitizeRichHtml(input: string): string {
  const nfc = cleanVietnameseText(input || '');
  return nfc
    .replace(/<\s*(script|iframe|object|embed|form|meta|link)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|object|embed|form|meta|link)[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '');
}

/**
 * Kiểm tra xem chuỗi có chứa thẻ HTML định dạng hay không.
 */
export function hasHtmlTags(text: string): boolean {
  return /<\s*(p|div|h[1-6]|ul|ol|li|br|span|strong|em|u|s|strike|b|i|font|mark|blockquote|hr)\b[^>]*>/i.test(
    text || ''
  );
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Tương thích ngược: Nếu văn bản lưu trước đây là plain text (chỉ có \n),
 * tự động chuyển từng đoạn thành <p>...</p>. Nếu đã là HTML thì sanitize & chuẩn hóa NFC.
 */
export function normalizeArticleHtml(content: string): string {
  const cleaned = cleanVietnameseText(content || '').trim();
  if (!cleaned) return '';

  if (!hasHtmlTags(cleaned)) {
    return cleaned
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');
  }

  return sanitizeRichHtml(cleaned);
}

/**
 * Lọc bỏ toàn bộ thẻ HTML để lấy văn bản thuần (dùng cho đếm từ & gửi ngữ cảnh RAG cho AI).
 */
export function stripHtmlToPlainText(htmlOrText: string): string {
  const cleaned = cleanVietnameseText(htmlOrText || '');
  if (!cleaned) return '';

  const withLineBreaks = cleaned
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|li|h[1-6]|blockquote|tr)\s*>/gi, '\n');

  const withoutTags = withLineBreaks.replace(/<[^>]+>/g, ' ');

  const decoded = withoutTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"');

  return cleanVietnameseText(
    decoded
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n')
  );
}

/**
 * Đếm chính xác số từ tiếng Việt sau khi đã strip thẻ HTML.
 */
export function countRichTextWords(htmlOrText: string): number {
  const plain = stripHtmlToPlainText(htmlOrText).trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

function formatInlineMarkdownToHtml(text: string): string {
  const escaped = escapeHtml(cleanVietnameseText(text));
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/**
 * Chuyển đổi kết quả Markdown Sơ đồ tư duy dạng thụt lề từ AI (# 🎯, ## 📌, - ...)
 * sang HTML phân cấp chuẩn (<h1>, <h2>, <ul><li> lồng nhau) để nạp vào RichTextEditor.
 */
export function mindmapMarkdownToHtml(markdown: string): string {
  const cleaned = cleanVietnameseText(markdown || '').trim();
  if (!cleaned) return '';

  const lines = cleaned.split('\n');
  const htmlParts: string[] = [];
  let listDepth = 0;

  const closeListsTo = (targetDepth: number) => {
    while (listDepth > targetDepth) {
      htmlParts.push('</ul>');
      listDepth--;
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Gốc Mindmap: # ...
    if (/^#\s+/.test(trimmed)) {
      closeListsTo(0);
      const heading = trimmed.replace(/^#\s+/, '');
      htmlParts.push(`<h1>${formatInlineMarkdownToHtml(heading)}</h1>`);
      continue;
    }

    // Nhánh chính cấp 1: ## ...
    if (/^##\s+/.test(trimmed)) {
      closeListsTo(0);
      const branch = trimmed.replace(/^##\s+/, '');
      htmlParts.push(`<h2>${formatInlineMarkdownToHtml(branch)}</h2>`);
      continue;
    }

    // Nhánh cấp 3 tiêu đề: ### ...
    if (/^###\s+/.test(trimmed)) {
      closeListsTo(0);
      const subBranch = trimmed.replace(/^###\s+/, '');
      htmlParts.push(`<h3>${formatInlineMarkdownToHtml(subBranch)}</h3>`);
      continue;
    }

    // Dòng danh sách thụt lề: - ... hoặc * ...
    const bulletMatch = rawLine.match(/^(\s*)[-*•]\s+(.*)$/);
    if (bulletMatch) {
      const leadingSpaces = bulletMatch[1].replace(/\t/g, '  ').length;
      const targetDepth = Math.min(5, Math.floor(leadingSpaces / 2) + 1);
      const itemContent = bulletMatch[2].trim();

      if (listDepth < targetDepth) {
        while (listDepth < targetDepth) {
          htmlParts.push('<ul>');
          listDepth++;
        }
      } else if (listDepth > targetDepth) {
        closeListsTo(targetDepth);
      }

      htmlParts.push(`<li>${formatInlineMarkdownToHtml(itemContent)}</li>`);
      continue;
    }

    // Đoạn văn thông thường (ví dụ dòng gợi ý cuối sơ đồ)
    closeListsTo(0);
    htmlParts.push(`<p>${formatInlineMarkdownToHtml(trimmed)}</p>`);
  }

  closeListsTo(0);
  return htmlParts.join('');
}
