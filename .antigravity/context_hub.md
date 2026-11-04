# CONTEXT HUB: MAP OF ARCHITECTURE & ASSETS

## 1. Schema & Contracts
* **Supabase DDL:** Review table definitions and RLS policies in `src/lib/supabase/schema.sql` and `PROJECT_SPEC_DOC_HIEU_TIENG_VIET.md` (Section 3).
* **Type Declarations:** Located in `src/types/`:
  * `article.ts`: Interfaces for `structured_data`, 5-step stages, and QAR items.
  * `dictionary.ts`: Interfaces for `han_viet_roots`, `han_viet_compounds`, `compound_root_links`, `EtymologyFormula`, and `SUBJECT_TAG_LABELS` (`SGK`, `ngu-van`, `lich-su`, `dia-ly`, `khoa-hoc`).
  * `session.ts`: Interfaces for the Realtime reading session and Zustand state.

## 2. Component & Script Directory Map
* **Reading Engine Core:** `src/components/reading-engine/`
  * `Step1ThinkAloud.tsx` ➔ Sentence pacing and thought bubble triggers. (Supports multi-paragraph).
  * `Step2GraphicOrganizer.tsx` ➔ Drag-and-drop cards into logical relationship slots.
  * `Step3ReciprocalCards.tsx` ➔ 4 reciprocal role-reversal cards (Mobile-optimized with responsive grid, auto-height textarea, and touch-isolated input zones).
  * `Step4QARDetection.tsx` ➔ 3-tier QAR questions and color highlighters.
  * `Step5ReadingLog.tsx` ➔ Offline pen-and-paper challenge and book suggestions.
* **Reading Routes:** 
  * `src/app/read/` ➔ Standard short-article flow.
  * `src/app/read-pages/` ➔ Long-reading module segmented by page_count (A4 immersion styling).
* **Dictionary & Gamification Routes & Components:**
  * `src/app/dictionary/page.tsx` & `DictionaryClient.tsx` ➔ Server-fetched dynamic dual-dictionary catalog with smooth tab switching between **Từ điển Hán - Việt** (`han_viet_compounds`) and **Từ điển Thuần Việt** (`thuan_viet_dictionary`), search, subject filters, word-type filters, and `🇬🇧 english_equivalent` cognitive anchors.
  * `src/app/dictionary/[slug]/page.tsx` ➔ Dynamic detail view joining `han_viet_compounds`, `compound_root_links`, and `han_viet_roots` with English anchor badges.
  * `src/app/games/page.tsx` & `src/app/games/GamesClient.tsx` ➔ Centralized Vocabulary Arena (**Đấu Trường Từ Vựng**) with 3 modes: 🧩 *Thợ Rèn Hình Vị* (Hán-Việt), 🎨 *Bức Họa Ngôn Từ* (Thuần Việt), and ⚔️ *Đấu Trường Thực Chiến* (Flashcard Blitz 15s + Bác Sĩ Câu Văn), complete with Web Audio sound effects, confetti, and `localStorage` high scores.
  * `src/app/grammar/page.tsx` & `src/app/grammar/GrammarClient.tsx` ➔ Interactive Vietnamese Grammar Workbench (**Phẫu Thuật Cấu Trúc Câu** `/grammar`) with 4 cognitive progression tabs (Level 1: 🦴 *Khung Xương Câu*, Level 2: ✂️ *Dao Mổ Tách Câu*, Level 3: 🔗 *Mũi Tên Logic*, Level 4: 🔜 *Cấu Trúc Đề - Thuyết*), X-Ray filter ("Lọc Xương"), Feynman tips, English Cognitive Anchors, Before/After surgery comparison, Web Audio sound effects, and `localStorage` progress tracking.
  * `src/data/grammar-seed.ts` & `scripts/seed_grammar.ts` (`npm run seed:grammar`) ➔ 16 curated Grade 7 grammar exercises from SGK Sử, Địa, Văn, KHTN & Nguyễn Hiến Lê / Diệp Quang Ban (`supabase/migrations/create_grammar_exercises.sql`).
  * `src/components/dictionary/EtymologyFormulaCard.tsx` ➔ Mathematical root addition card with `🇬🇧 english_equivalent`.
  * `src/components/dictionary/HanVietTooltip.tsx` ➔ In-text popover for vocabulary breakdown.
  * `src/components/dictionary/MiniEtymologyQuiz.tsx` ➔ Interactive morpheme puzzle.
  * `src/lib/supabase/thuan-viet-seed.ts` ➔ Curated seed data of 30 Grade 7 pure Vietnamese entries (`THUAN_VIET_SEED_DATA`) and 154 English cognitive anchors (`HAN_VIET_ENGLISH_ANCHORS`).
* **AI Agents & Dictionary Scripts:**
  * `supabase/migrations/create_thuan_viet_dictionary.sql` ➔ SQL migration adding `english_equivalent` to `han_viet_compounds` and creating `public.thuan_viet_dictionary` with RLS policies.
  * `src/lib/agents/han_viet_scraper.ts` ➔ Gemini API (`@google/genai`) agent to automatically extract Sino-Vietnamese compounds, `english_equivalent`, root morphemes, math formulas, and quizzes from new SGK passages.
  * `scripts/extract_han_viet.ts` ➔ CLI runner for the Han-Viet scraper agent (`npx tsx scripts/extract_han_viet.ts "<text>"`).
  * `scripts/seed_han_viet.ts` ➔ Seed runner (`npm run seed:hanviet`) that parses `./learning_materials/tu_dien_han_viet_co_ban_sgk_100_tu.md` and `./learning_materials/tu_dien_han_viet_chiet_tu.md` into Supabase.
  * `scripts/expand_han_viet.ts` ➔ Automated batch Sino-Vietnamese dictionary expander (`npm run expand:hanviet`), generating new Grade 7 words + `english_equivalent` via Gemini API.
  * `scripts/expand_thuan_viet.ts` ➔ Automated batch Pure Vietnamese dictionary seeder & expander (`npm run expand:thuanviet`), populating `thuan_viet_dictionary` via seed + Gemini API.
* **Learning Materials (`learning_materials/`):**
  * `tu_dien_han_viet_co_ban_sgk_100_tu.md` (and `tu_dien_han_viet_co_ban_sgk.md`) ➔ Master table of 100 core THCS Sino-Vietnamese compounds and interactive quizzes.
  * `tu_dien_han_viet_chiet_tu.md` ➔ Detailed etymological breakdowns and morpheme quizzes.
* **Print Template:** `src/components/print/A4WorksheetTemplate.tsx`
* **Data Input Pipeline:** `data_input/`
  * `import_articles.py` ➔ Python script to generate vertical Excel templates and batch upsert structured reading articles into Supabase (`reading_articles`).

## 3. Realtime Event Registry (`src/lib/supabase/realtime.ts`)
| Event Name | Emitter | Listener | Purpose |
| :--- | :--- | :--- | :--- |
| `STEP_CHANGE` | Parent | Child | Parent navigates to next step; Child screen auto-scrolls/transitions |
| `HIGHLIGHT_WORD` | Parent | Child | Parent highlights a term; Child screen highlights word with glowing border |
| `ORGANIZER_UPDATE`| Child | Parent | Child matches a card; Parent receives instant pass/fail validation |
| `QAR_SELECTED` | Child | Parent | Child selects option; Parent receives answer and rationale telemetry |
| `SEND_PRAISE` | Parent | Child | Parent taps praise; Child screen explodes with Confetti |
