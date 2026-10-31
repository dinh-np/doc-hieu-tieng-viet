# CONTEXT HUB: MAP OF ARCHITECTURE & ASSETS

## 1. Schema & Contracts
* **Supabase DDL:** Review table definitions and RLS policies in `PROJECT_SPEC_DOC_HIEU_TIENG_VIET.md` (Section 3).
* **Type Declarations:** Located in `src/types/`:
  * `article.ts`: Interfaces for `structured_data`, 5-step stages, and QAR items.
  * `dictionary.ts`: Interfaces for `han_viet_roots`, `han_viet_compounds`, and `EtymologyFormula`.
  * `session.ts`: Interfaces for the Realtime reading session and Zustand state.

## 2. Component Directory Map
* **Reading Engine Core:** `src/components/reading-engine/`
  * `Step1ThinkAloud.tsx` ➔ Sentence pacing and thought bubble triggers. (Supports multi-paragraph).
  * `Step2GraphicOrganizer.tsx` ➔ Drag-and-drop cards into logical relationship slots.
  * `Step3ReciprocalCards.tsx` ➔ 4 reciprocal role-reversal cards (Mobile-optimized with responsive grid, auto-height textarea, and touch-isolated input zones).
  * `Step4QARDetection.tsx` ➔ 3-tier QAR questions and color highlighters.
  * `Step5ReadingLog.tsx` ➔ Offline pen-and-paper challenge and book suggestions.
* **Reading Routes:** 
  * `src/app/read/` ➔ Standard short-article flow.
  * `src/app/read-pages/` ➔ Long-reading module segmented by page_count (A4 immersion styling).
* **Dictionary Module:** `src/components/dictionary/`
  * `EtymologyFormulaCard.tsx` ➔ Mathematical root addition card.
  * `HanVietTooltip.tsx` ➔ In-text popover for vocabulary breakdown.
  * `MiniEtymologyQuiz.tsx` ➔ Interactive morpheme puzzle.
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