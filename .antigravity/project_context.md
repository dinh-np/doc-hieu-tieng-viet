### 2. File: `.antigravity/project_context.md`
```markdown 
# PROJECT CONTEXT: DOC_HIEU_TIENG_VIET

## 1. Problem Statement & Core Objectives
* **Target Audience:** Vietnamese middle school students (focusing on Grade 7) suffering from reading comprehension decline and passive skimming caused by short-form video overexposure.
* **System Mission:** Build a 15-minute nightly PWA based on an international 6-step (0-5) reading methodology, integrated with a mathematical Sino-Vietnamese (Hán - Việt) Etymology Dictionary and a physical paper-book bridge.
* **Remote Parenting Scenario:** The father often works away from home. Voice/video communication runs independently via Zalo, while the Web App drives synchronized real-time interactive pedagogy using a single shared family account.

## 2. Technology Stack
* **Framework:** Next.js 15+ (App Router, React 19, TypeScript strict mode).
* **Styling & UI:** Tailwind CSS v4, Lucide React, Radix UI Primitives. 
  * **Design System:** Corporate Light Theme inspired by Krones (Primary color: `#0066AB`, Backgrounds: `#ffffff`, `#f8f9fa`, Typography: `Noto Sans`, `Georgia`).
* **Backend & DB:** Supabase (PostgreSQL, Row Level Security, Supabase Auth via Magic Link/Google).
* **AI & Automation SDK:** `@google/genai` (Gemini API with Structured Outputs `responseSchema` for automated Sino-Vietnamese etymology extraction and dictionary expansion).
* **Realtime Sync:** Supabase Realtime Broadcast Channels (Two-way sync: Child View - Con ↔ Parent Co-pilot - Cha Mẹ).
* **State Management:** Zustand (`useReadingSession.ts`).
* **Mobile-First & Touch Interaction:** Fully responsive components with strict event propagation isolation on mobile devices.
* **Print & Offline:** Tailwind `@media print` layout (A4 Landscape 2-column folded mini-magazine).
* **Hosting:** Vercel Edge Platform.

## 3. Pedagogical 6-Step Engine (0-5)
1. **Step 0 (Book-page Immersion & Prediction):** Immerse in authentic full-text reading (A4 book simulation with native sticky scroll progress) and formulate intuitive predictions before deep analysis.
2. **Step 1 (Think-Aloud):** Parent models metacognitive processes (Visualizing, Connecting, Clarifying, Inferring). Child echoes on the subsequent paragraph. Supports multi-paragraph auto-role assignment.
2. **Step 2 (Graphic Organizers):** Drag-and-drop structural diagrams (Cause & Effect, Venn Diagram, Story Mountain).
3. **Step 3 (Reciprocal Teaching):** Role-reversal via 4 task cards: Predict, Clarify, Question, Summarize. Features auto-expanding text areas (`h-auto` containers) for longer responses without internal scrollbars.
4. **Step 4 (QAR Framework):** Three question tiers: Right There (literal), Think & Search (synthesis), Author & Me (inference).
5. **Step 5 (Screen-to-Paper Bridge):** Hand-drawn paper tasks and curated physical book recommendations.

## 4. Long-form Reading Module (`/read-pages`)
* Parallel catalog and reading experience for multi-page articles (e.g., "1 Trang").
* Utilizes a fully isolated Supabase table: `one_page_articles`.
* Seeded via dedicated python script `data_input/import_1page_articles.py`.
* Utilizes the same 5-step engine but optimized for extensive immersion.

## 5. Dual Dictionary & Gamification Module (`/dictionary` & `/games`)
* **Sino-Vietnamese Etymology (`Từ điển Hán - Việt`):**
  * Mathematical formula layout: `Root A (meaning) + Root B (meaning) ➔ Compound Meaning`.
  * English Cognitive Anchor (`🇬🇧 english_equivalent`): Bridges Grade 7 English vocabulary (e.g., `"Prosperous / Flourishing"`) to abstract Sino-Vietnamese compounds.
  * Morpheme tree: Click any root to explore related compounds sharing that root.
  * Contextual popover embedded directly into reading passages plus mini guessing quizzes.
* **Pure Vietnamese Sensory Dictionary (`Từ điển Thuần Việt`):**
  * Table `public.thuan_viet_dictionary` (with 30+ curated Grade 7 fallback entries in `src/lib/supabase/thuan-viet-seed.ts`): `word`, `word_type` (`tu_lay`, `tu_tuong_hinh`, `tu_tuong_thanh`, `tu_da_nghia`, `khac`), `simple_meaning`, `mental_image`, `context_clue`, `english_equivalent`, `example_sentence`, `synonyms`, `grade_level`, `subject_tag`, `quiz_data`.
  * Helps 12-year-olds visualize evocative Vietnamese words (`khúc khích`, `lênh đênh`, `xào xạc`, `lắt léo`...) through sensory mental imagery (`mental_image`) and context clues.
* **Centralized Vocabulary Arena (`/games` - Đấu Trường Từ Vựng):**
  * **Mode 1 (🧩 Thợ Rèn Hình Vị - Hán Việt):** Combine 2 root morphemes (`han_viet_roots`) matching the target compound meaning (`han_viet_compounds`).
  * **Mode 2 (🎨 Bức Họa Ngôn Từ - Thuần Việt):** Guess pure Vietnamese words from `mental_image` or cloze `example_sentence`.
  * **Mode 3 (⚔️ Đấu Trường Thực Chiến - Tổng Hợp):** *Flashcard Blitz* (15s countdown timer matching meanings + `🇬🇧 english_equivalent`) and *Bác Sĩ Câu Văn* (diagnosing and fixing contextually misused words).
  * Features Score, Combo Streak, visual countdown bar, Web Audio API sound effects, `canvas-confetti`, and `localStorage` high score persistence.
* **Dynamic Supabase Rendering on PWA:**
  * `/dictionary` (`src/app/dictionary/page.tsx` & `DictionaryClient.tsx`), `/dictionary/[slug]`, and `/games` (`src/app/games/page.tsx` & `GamesClient.tsx`) dynamically query `han_viet_compounds`, `compound_root_links`, `han_viet_roots`, and `thuan_viet_dictionary` from Supabase (`force-dynamic`).
* **Normalized Relational Schema in Supabase (`supabase/migrations/create_thuan_viet_dictionary.sql`):**
  * `han_viet_roots` (197+ root morphemes: `id`, `hanzi`, `reading_vi`, `root_meaning`, `created_at`).
  * `han_viet_compounds` (154+ compounds: `id`, `word`, `slug`, `full_meaning`, `english_equivalent`, `example_sentence`, `math_formula`, `subject_tag`, `grade_level`, `quiz_data`, `created_at`).
  * `compound_root_links` (282+ N-N links: `id`, `compound_id`, `root_id`, `position_order` 1 or 2, `related_words`).
  * `thuan_viet_dictionary` (83+ entries: `id`, `word`, `word_type`, `simple_meaning`, `mental_image`, `context_clue`, `english_equivalent`, `example_sentence`, `synonyms`, `grade_level`, `subject_tag`, `quiz_data`, `created_at`).
* **Automated Seeding, Scraping & Expansion Pipeline:**
  * `scripts/seed_han_viet.ts` (`npm run seed:hanviet`): Seeds 100 textbook compounds, roots, links, and interactive quizzes into Supabase.
  * `src/lib/agents/han_viet_scraper.ts` & `scripts/extract_han_viet.ts`: Gemini-powered agent that extracts new Grade 7 Sino-Vietnamese compounds (including `english_equivalent`) from textbook passages.
  * `scripts/expand_han_viet.ts` (`npm run expand:hanviet`): Automated CLI generator for new non-duplicate Grade 7 Sino-Vietnamese compounds with `english_equivalent`.
  * `scripts/expand_thuan_viet.ts` (`npm run expand:thuanviet`): Automated CLI seeder and Gemini expander for Grade 7 Pure Vietnamese sensory words (`thuan_viet_dictionary`) with rotating sub-themes and Vietnamese diacritic normalization.

## 6. Interactive Vietnamese Grammar Module (`/grammar` - Phẫu Thuật Cấu Trúc Câu)
* **Pedagogical Framework:** Designed for Grade 7 (12-year-old) students with strong logic & English skills who struggle with complex Vietnamese syntax. Converts dry grammar theory into visual **Sentence Anatomy** based on research by Nguyễn Hiến Lê - Trương Văn Chình and GS. Diệp Quang Ban across a 4-Level Cognitive Progression:
  * **[Tab 1] Level 1 (`sentence_core` / `pick_core`, `level_order: 1`):** 🦴 *Khung Xương Câu* (Chủ từ + Thuật từ / Vị từ làm đỉnh — `🇬🇧 Subject + Verb Core`) with an interactive **X-Ray "Lọc Xương"** filter that fades out peripheral modifiers.
  * **[Tab 2] Level 2 (`sentence_slicing` / `slice_slash`, `level_order: 2`):** ✂️ *Dao Mổ Tách Câu* (slicing long textbook compound sentences into independent clauses with `/`).
  * **[Tab 3] Level 3 (`connectors_logic` / `drag_logic_arrow`, `level_order: 3`):** 🔗 *Mũi Tên Logic* (mapping `Nhờ/Do/Vì... nên...`, `Mặc dù... nhưng...` into Cause ➔ Effect / Contrast diagrams).
  * **[Tab 4] Level 4 (`topic_comment`, `level_order: 4`):** 🔜 *Cấu Trúc Đề - Thuyết & Từ Vị Theo Ngữ Cảnh* (`🇬🇧 Topic - Comment & Part of Speech vs. Syntactic Role`).
* **Schema & Fallback Seed:**
  * Table `public.grammar_exercises` (`supabase/migrations/create_grammar_exercises.sql`) and seed runner `scripts/seed_grammar.ts` (`npm run seed:grammar`).
  * Curated seed bank `src/data/grammar-seed.ts` (16 Grade 7 textbook exercises across History, Geography, Literature, and Science) synced to Supabase with instant local fallback.
```
