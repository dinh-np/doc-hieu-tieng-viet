'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  IndentIncrease,
  IndentDecrease,
  Quote,
  Minus,
  Eraser,
  Palette,
  Highlighter,
} from 'lucide-react';
import { normalizeArticleHtml, sanitizeRichHtml } from '@/lib/utils/rich-text';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClass?: string;
  maxHeightClass?: string;
  className?: string;
}

const TEXT_COLORS = [
  { label: 'Đen chuẩn', color: '#1e293b' },
  { label: 'Xanh dương đậm', color: '#0066ab' },
  { label: 'Đỏ nhấn mạnh', color: '#dc2626' },
  { label: 'Cam đậm', color: '#d97706' },
  { label: 'Xanh lá đậm', color: '#059669' },
  { label: 'Tím', color: '#7c3aed' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Vàng tươi', color: '#fef08a' },
  { label: 'Xanh lá nhạt', color: '#bbf7d0' },
  { label: 'Xanh dương nhạt', color: '#bae6fd' },
  { label: 'Hồng nhạt', color: '#fbcfe8' },
  { label: 'Xóa màu nền', color: 'transparent' },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập hoặc dán nội dung văn bản vào đây...',
  minHeightClass = 'min-h-[260px]',
  maxHeightClass = 'max-h-[55vh]',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastEmittedHtmlRef = useRef<string>('');
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  // Đồng bộ giá trị ban đầu hoặc khi value được nạp mới từ bên ngoài (ví dụ AI tạo xong Mindmap)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const normalized = normalizeArticleHtml(value);
    if (normalized !== lastEmittedHtmlRef.current && el.innerHTML !== normalized) {
      el.innerHTML = normalized;
      lastEmittedHtmlRef.current = normalized;
    }
  }, [value]);

  const saveSelectionRange = useCallback(() => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelectionRange = useCallback(() => {
    if (typeof window === 'undefined' || !savedRangeRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const cleanHtml = sanitizeRichHtml(el.innerHTML);
    lastEmittedHtmlRef.current = cleanHtml;
    onChange(cleanHtml);
  }, [onChange]);

  const runCommand = useCallback(
    (command: string, arg?: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      restoreSelectionRange();
      try {
        document.execCommand(command, false, arg);
      } catch {
        // ignore unsupported command
      }
      saveSelectionRange();
      emitChange();
    },
    [restoreSelectionRange, saveSelectionRange, emitChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      runCommand(e.shiftKey ? 'outdent' : 'indent');
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-300 bg-white overflow-hidden focus-within:border-[#0066ab] focus-within:ring-2 focus-within:ring-[#0066ab]/10 ${className}`}
    >
      {/* THANH CÔNG CỤ ĐỊNH DẠNG (Ẩn khi in A4) */}
      <div className="rte-toolbar no-print print:hidden bg-slate-50 border-b border-gray-200 px-2.5 py-2 flex flex-wrap items-center gap-1 text-slate-700">
        {/* Lịch sử: Undo / Redo */}
        <ToolbarButton
          onClick={() => runCommand('undo')}
          title="Hoàn tác (Undo)"
          icon={<Undo2 className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('redo')}
          title="Làm lại (Redo)"
          icon={<Redo2 className="w-3.5 h-3.5" />}
        />

        <Divider />

        {/* Cấu trúc đoạn / Tiêu đề */}
        <select
          aria-label="Kiểu đoạn văn hoặc tiêu đề"
          onMouseDown={saveSelectionRange}
          onChange={(e) => {
            runCommand('formatBlock', e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          className="h-7 px-2 rounded-lg border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:border-gray-300 focus:outline-none cursor-pointer"
        >
          <option value="" disabled>
            Cấu trúc
          </option>
          <option value="P">Đoạn văn</option>
          <option value="H1">Tiêu đề H1</option>
          <option value="H2">Tiêu đề H2</option>
          <option value="H3">Tiêu đề H3</option>
        </select>

        {/* Cỡ chữ */}
        <select
          aria-label="Cỡ chữ"
          onMouseDown={saveSelectionRange}
          onChange={(e) => {
            runCommand('fontSize', e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          className="h-7 px-2 rounded-lg border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:border-gray-300 focus:outline-none cursor-pointer"
        >
          <option value="" disabled>
            Cỡ chữ
          </option>
          <option value="2">Nhỏ</option>
          <option value="3">Thường</option>
          <option value="4">Lớn</option>
          <option value="5">Rất lớn</option>
        </select>

        <Divider />

        {/* Kiểu chữ: B / I / U / S */}
        <ToolbarButton
          onClick={() => runCommand('bold')}
          title="In đậm (Ctrl+B)"
          icon={<Bold className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('italic')}
          title="In nghiêng (Ctrl+I)"
          icon={<Italic className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('underline')}
          title="Gạch chân (Ctrl+U)"
          icon={<Underline className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('strikeThrough')}
          title="Gạch ngang chữ"
          icon={<Strikethrough className="w-3.5 h-3.5" />}
        />

        <Divider />

        {/* Màu chữ (Text Color) */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowTextColorMenu((v) => !v);
              setShowHighlightMenu(false);
            }}
            title="Chọn màu chữ"
            icon={<Palette className="w-3.5 h-3.5 text-[#0066ab]" />}
          />
          {showTextColorMenu && (
            <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex items-center gap-1.5">
              {TEXT_COLORS.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    runCommand('foreColor', item.color);
                    setShowTextColorMenu(false);
                  }}
                  title={item.label}
                  className="w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tô sáng nền chữ (Highlight) */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowHighlightMenu((v) => !v);
              setShowTextColorMenu(false);
            }}
            title="Tô sáng nền chữ (Highlight)"
            icon={<Highlighter className="w-3.5 h-3.5 text-amber-600" />}
          />
          {showHighlightMenu && (
            <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex items-center gap-1.5">
              {HIGHLIGHT_COLORS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    runCommand('hiliteColor', item.color);
                    setShowHighlightMenu(false);
                  }}
                  title={item.label}
                  className="w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                  style={{
                    backgroundColor:
                      item.color === 'transparent' ? '#ffffff' : item.color,
                  }}
                >
                  {item.color === 'transparent' ? '✕' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Căn lề */}
        <ToolbarButton
          onClick={() => runCommand('justifyLeft')}
          title="Căn lề trái"
          icon={<AlignLeft className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('justifyCenter')}
          title="Căn giữa"
          icon={<AlignCenter className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('justifyRight')}
          title="Căn lề phải"
          icon={<AlignRight className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('justifyFull')}
          title="Căn đều 2 bên (Justify)"
          icon={<AlignJustify className="w-3.5 h-3.5" />}
        />

        <Divider />

        {/* Danh sách & Phân cấp thụt lề */}
        <ToolbarButton
          onClick={() => runCommand('insertUnorderedList')}
          title="Danh sách gạch đầu dòng (Bullet List)"
          icon={<List className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('insertOrderedList')}
          title="Danh sách đánh số (Ordered List)"
          icon={<ListOrdered className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('indent')}
          title="Tăng thụt lề (Indent / Tab)"
          icon={<IndentIncrease className="w-3.5 h-3.5 text-[#0066ab]" />}
        />
        <ToolbarButton
          onClick={() => runCommand('outdent')}
          title="Giảm thụt lề (Outdent / Shift+Tab)"
          icon={<IndentDecrease className="w-3.5 h-3.5 text-[#0066ab]" />}
        />

        <Divider />

        {/* Bổ trợ: Trích dẫn, Đường kẻ ngang, Xóa định dạng */}
        <ToolbarButton
          onClick={() => runCommand('formatBlock', 'BLOCKQUOTE')}
          title="Khối trích dẫn (Blockquote)"
          icon={<Quote className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('insertHorizontalRule')}
          title="Chèn đường kẻ phân tách"
          icon={<Minus className="w-3.5 h-3.5" />}
        />
        <ToolbarButton
          onClick={() => runCommand('removeFormat')}
          title="Xóa định dạng (Clear Formatting)"
          icon={<Eraser className="w-3.5 h-3.5 text-rose-600" />}
        />
      </div>

      {/* VÙNG SOẠN THẢO WYSIWYG */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onKeyUp={saveSelectionRange}
        onMouseUp={saveSelectionRange}
        onKeyDown={handleKeyDown}
        className={`rich-text-content ${minHeightClass} ${maxHeightClass} overflow-y-auto p-4 text-sm sm:text-base text-slate-800 leading-relaxed focus:outline-none print:max-h-none print:overflow-visible print:p-0`}
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  title,
  icon,
}: {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      aria-label={title}
      className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-slate-200/80 active:bg-slate-300/70 transition-colors cursor-pointer"
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <span className="h-4 w-px bg-gray-300 mx-0.5" />;
}
