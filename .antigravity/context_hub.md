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
* **Dictionary Routes & Components:**
  * `src/app/dictionary/page.tsx` & `DictionaryClient.tsx` ➔ Server-fetched dynamic catalog of all Supabase `han_viet_compounds` with search and subject tag filters.
  * `src/app/dictionary/[slug]/page.tsx` ➔ Dynamic detail view joining `han_viet_compounds`, `compound_root_links`, and `han_viet_roots`.
  * `src/components/dictionary/EtymologyFormulaCard.tsx` ➔ Mathematical root addition card.
  * `src/components/dictionary/HanVietTooltip.tsx` ➔ In-text popover for vocabulary breakdown.
  * `src/components/dictionary/MiniEtymologyQuiz.tsx` ➔ Interactive morpheme puzzle.
* **AI Agents & Dictionary Scripts:**
  * `src/lib/agents/han_viet_scraper.ts` ➔ Gemini API (`@google/genai`) agent to automatically extract Sino-Vietnamese compounds, root morphemes, math formulas, and quizzes from new SGK passages and sync them to Supabase (`han_viet_roots`, `han_viet_compounds`, `compound_root_links`).
  * `scripts/extract_han_viet.ts` ➔ CLI runner for the Han-Viet scraper agent (`npx tsx scripts/extract_han_viet.ts "<text>"`).
  * `scripts/seed_han_viet.ts` ➔ Seed runner (`npm run seed:hanviet`) that parses `./learning_materials/tu_dien_han_viet_co_ban_sgk_100_tu.md` and `./learning_materials/tu_dien_han_viet_chiet_tu.md` into Supabase.
  * `scripts/expand_han_viet.ts` ➔ Automated batch dictionary expander (`npm run expand:hanviet` or `npx tsx scripts/expand_han_viet.ts --count=30 --topic="Lịch sử"`), querying existing Supabase words as an exclusion list and generating new Grade 7 words via Gemini API.
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
