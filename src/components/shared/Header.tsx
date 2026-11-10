'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Search, Home, Bookmark, Gamepad2, Dna, Brain, ScrollText } from 'lucide-react';
import { InstallAppButton } from '@/components/InstallAppButton';

export function Header() {
  const pathname = usePathname();

  const isPassportActive = pathname?.startsWith('/passport');

  return (
    <header className="no-print sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 lg:py-0 lg:h-14 flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-2 gap-y-2">
        {/* HÀNG 1 (Trái): Logo + Tên ứng dụng */}
        <Link href="/" className="order-1 flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#0066ab] flex items-center justify-center shadow-sm shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight flex flex-col sm:flex-row sm:items-center leading-tight">
            <span className="text-[#0066ab] whitespace-nowrap">Đọc Hiểu</span>
            <span className="text-slate-600 sm:ml-1 whitespace-nowrap">Tiếng Việt</span>
          </span>
        </Link>

        {/* HÀNG 1 (Phải trên Mobile / Cuối trên Desktop): Nút Hộ chiếu + Nút Cài App (PWA) */}
        <div className="order-2 lg:order-3 flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/passport"
            title="Hộ chiếu đọc hiểu"
            aria-label="Hộ chiếu đọc hiểu"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isPassportActive
                ? 'bg-blue-50 text-[#0066ab] border-blue-200 font-semibold'
                : 'text-slate-600 border-gray-200/80 hover:text-slate-800 hover:bg-gray-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#0066ab] shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Hộ chiếu</span>
          </Link>

          <InstallAppButton />
        </div>

        {/* HÀNG 2 trên Mobile / Giữa trên Desktop: Dải icon điều hướng chính */}
        <nav
          aria-label="Điều hướng chính"
          className="order-3 lg:order-2 w-full lg:w-auto flex items-center justify-between sm:justify-center gap-1 overflow-x-auto no-scrollbar border-t border-gray-100 pt-1.5 lg:border-t-0 lg:pt-0"
        >
          <NavLink
            href="/"
            active={pathname === '/'}
            icon={<Home className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />}
            label="Trang chủ"
          />
          <NavLink
            href="/read"
            active={pathname === '/read' || pathname?.startsWith('/read/')}
            icon={<BookOpen className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />}
            label="Bài ngắn"
          />
          <NavLink
            href="/read-pages"
            active={pathname?.startsWith('/read-pages')}
            icon={
              <span className="inline-flex items-center justify-center font-bold text-[10px] bg-blue-100/60 text-[#0066ab] px-1 py-0.5 rounded border border-[#0066ab]/20 w-4 h-4 shrink-0">
                1T
              </span>
            }
            label="1 Trang"
          />
          <NavLink
            href="/metacognition-read"
            active={pathname?.startsWith('/metacognition-read')}
            icon={<Brain className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#0066ab] shrink-0" />}
            label="Siêu Nhận Thức"
          />
          <NavLink
            href="/dictionary"
            active={pathname?.startsWith('/dictionary')}
            icon={<Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />}
            label="Từ điển"
          />
          <NavLink
            href="/proverbs"
            active={pathname?.startsWith('/proverbs')}
            icon={<ScrollText className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />}
            label="Tục Ngữ"
          />
          <NavLink
            href="/grammar"
            active={pathname?.startsWith('/grammar')}
            icon={<Dna className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#0066ab] shrink-0" />}
            label="Cấu trúc câu"
          />
          <NavLink
            href="/games"
            active={pathname?.startsWith('/games')}
            icon={<Gamepad2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#0066ab] shrink-0" />}
            label="Đấu trường"
          />
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-xs font-medium shrink-0 ${
        active
          ? 'bg-blue-50 text-[#0066ab] border border-blue-200/80 font-semibold'
          : 'text-slate-600 hover:text-slate-800 hover:bg-gray-50 border border-transparent'
      }`}
    >
      {icon}
      <span className="hidden md:inline whitespace-nowrap">{label}</span>
    </Link>
  );
}
