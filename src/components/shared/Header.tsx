'use client';

import Link from 'next/link';
import { BookOpen, Search, Home, Bookmark, Wifi, WifiOff } from 'lucide-react';
import { useReadingSession } from '@/lib/stores/useReadingSession';

export function Header() {
  const syncStatus = useReadingSession((s) => s.syncStatus);

  return (
    <header className="no-print sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0066ab] flex items-center justify-center shadow-lg">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight flex flex-col sm:flex-row sm:items-center leading-tight">
            <span className="text-[#0066ab] whitespace-nowrap">Đọc Hiểu</span>
            <span className="text-slate-600 sm:ml-1 whitespace-nowrap">Tiếng Việt</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <NavLink href="/" icon={<Home className="w-3.5 h-3.5" />} label="Trang chủ" />
          <NavLink href="/read" icon={<BookOpen className="w-3.5 h-3.5" />} label="Đọc bài" />
          <NavLink href="/dictionary" icon={<Search className="w-3.5 h-3.5" />} label="Từ điển" />
          <NavLink href="/passport" icon={<Bookmark className="w-3.5 h-3.5" />} label="Hộ chiếu" />
        </nav>

        {/* Sync badge */}
        <div className="flex items-center gap-2">
          {syncStatus === 'synced' || syncStatus === 'parent_connected' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-medium">
                {syncStatus === 'parent_connected' ? 'Cha - Mẹ đã kết nối' : 'Đã đồng bộ'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-gray-200">
              <WifiOff className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500 font-medium">Ngoại tuyến</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-gray-50 transition-all text-xs font-medium"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
