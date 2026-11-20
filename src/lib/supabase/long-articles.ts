import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cleanVietnameseText } from '@/lib/utils/vietnamese-text';

export function getExpectedAdminPin(): string {
  return (process.env.LONG_READ_ADMIN_PIN || '2026').trim();
}

export function isValidAdminPin(pin?: string | null): boolean {
  if (!pin) return false;
  return pin.trim() === getExpectedAdminPin();
}

export function createLongArticlesSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}

export function slugifyVietnamese(input: string): string {
  const base = cleanVietnameseText(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || 'bai-doc'}-${suffix}`;
}

export function countVietnameseWords(text: string): number {
  const trimmed = cleanVietnameseText(text).trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}
