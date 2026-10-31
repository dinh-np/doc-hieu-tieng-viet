Mục đích: Quy định các quy tắc bất biến trong suốt quá trình code, tránh trường hợp AI tự ý thay đổi kiến trúc hoặc quên các ràng buộc kỹ thuật quan trọng.

# CONTINUITY SKILL & DEVELOPMENT INVARIANTS
Whenever the AI performs code generation or refactoring in `Doc_Hieu_Tieng_Viet`, strictly adhere to these invariants:

## 1. No Embedded WebRTC / Video Call
* NEVER install or integrate WebRTC, LiveKit, Agora, or in-app calling libraries.
* Keep the app lightweight and free of media server overhead. Voice/video communication between parent and child is handled externally via Zalo. The app solely handles lightweight real-time interaction packets over Supabase WebSockets.

## 2. Dual-View on a Single Shared Account
* Do not build separate parent and student account role hierarchies. Both devices log into a single family account.
* **Child View (`/read/[id]`):** Zero hints, zero answer keys, zero distractions. Focus purely on reading and interacting.
* **Parent View (`/read/[id]/parent`):** Full director script, "Pedagogical Trap" warnings, remote step navigation controls, and answer telemetry.

## 3. Strict Master JSON Schema Invariance (`structured_data`)
* Any newly added article MUST adhere 100% to the TypeScript interface of `structured_data`. Never skip any of the 5 steps, vocabulary anchors, or offline reading tasks.
* Long-form articles (`page_count > 0`) should be isolated to `/read-pages` keeping `/read` explicitly for short warmup articles.

## 4. Print Media Invariance
* The `/read/[id]/print` route must render correctly on standard A4 Landscape paper when triggering `Ctrl + P` / `Cmd + P`.
* All navigation bars, headers, buttons, and footers must be completely hidden under `@media print`. The page layout must split into two balanced columns separated by a central fold line.

## 5. State Resilience & Session Recovery
* All user actions (drag-and-drop matches, QAR answers) must update the Zustand store immediately and auto-save (debounced) to Supabase `user_reading_sessions`.
* If a page is refreshed or connectivity fluctuates, the session must restore the exact step and current state without data loss.

## 6. Dynamic Content Rendering
* All Next.js page routes fetching data from Supabase (e.g., `/read` list) must disable static caching to ensure fresh data pipeline syncing from Python scripts.
* Use `export const dynamic = 'force-dynamic';` and `export const revalidate = 0;`.
* **CRITICAL RULE:** These route segment configs CANNOT be exported from a Client Component (files with `'use client'`). If `page.tsx` is a Client Component, you MUST place these exports in a Server Component `layout.tsx` inside the same directory to prevent runtime/build errors.

## 7. Mobile-First & Touch Event Isolation
* **Responsive Layouts:** Interactive elements (e.g. flip cards, drag-and-drops) must degrade gracefully on mobile (e.g. `grid-cols-1 md:grid-cols-2`).
* **Z-Index & Sizing:** Avoid fixed absolute heights for containers containing dynamic content; use `min-h` and allow relative wrappers to grow. Active overlay items must explicitly elevate their stacking context (e.g., `z-20`).
* **Touch Isolation:** Ensure nested interactive inputs (textareas, buttons) inside clickable cards contain `onClick={(e) => e.stopPropagation()}` and `onTouchStart={(e) => e.stopPropagation()}` to guarantee typing/scrolling doesn't accidentally trigger parent container actions.