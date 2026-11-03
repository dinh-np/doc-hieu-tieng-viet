# SKILL: VERCEL DEPLOYMENT & ENVIRONMENT SETUP

Guidelines for verifying builds and deploying to Vercel:

## 1. Required Environment Variables (`.env.local` & Vercel `Production, Preview, Development`)
```env
NEXT_PUBLIC_SUPABASE_URL="https://xbndmusvhpqnhbasonhv.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-supabase-publishable-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-supabase-service-role-secret-key>"
NEXT_PUBLIC_APP_URL="https://doc-hieu-tieng-viet.vercel.app"
GEMINI_API_KEY="<your-gemini-api-key>"
```
*(All 5 variables are synced across `Production`, `Preview`, and `Development` environments on Vercel).*

## 2. Pre-Build Verification Checklist
* Run `npm run type-check` (or `npx tsc --noEmit`) to verify zero TypeScript errors, untyped `any` usages, or missing JSON properties.
* Verify dynamic routes (`/read/[id]`, `/dictionary/[slug]`) include proper `loading.tsx` and `not-found.tsx` fallbacks.
* Enforce `'use client'` at the absolute top of every file utilizing React hooks (`useState`, `useEffect`, `useReadingSession`). It MUST be on line 1, before any `export` statements, otherwise the Vercel build will fail with Turbopack errors.
* Never export route segment configs (like `export const dynamic = 'force-dynamic'`) inside a `'use client'` file. Use a `layout.tsx` Server Component instead.

## 3. Next.js Configuration (`next.config.ts`)
Ensure asset caching, image domains, and headers are properly declared:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
};

export default nextConfig;
```
