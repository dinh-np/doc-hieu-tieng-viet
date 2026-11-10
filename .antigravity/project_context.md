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
  * **Design System:** Corporate Light Theme inspired by Krones (Primary color: `#0066AB`, Backgrounds: `#ffffff`, `#f8f9fa`, Typography: `Noto Sans` & `Be Vietnam Pro` loaded with full `["vietnamese", "latin", "latin-ext"]` subsets in `src/app/layout.tsx`, plus Unicode `NFC` normalization via `src/lib/utils/vietnamese-text.ts` to prevent split diacritics).
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
* Utilizes Supabase table `one_page_articles` filtered strictly to `article_type = 'one_page'` (excluding `metacognition` articles so `/read-pages` and `/metacognition-read` never overlap).
* Seeded via dedicated python script `data_input/import_1page_articles.py`.
* Utilizes the same 5-step engine but optimized for extensive immersion.

## 5. Dual Dictionary & Gamification Module (`/dictionary` & `/games`)
* **Sino-Vietnamese Etymology (`Từ điển Hán - Việt`):**
  * Mathematical formula layout: `Root A (meaning) + Root B (meaning) ➔ Compound Meaning`.
  * English Cognitive Anchor (`🇬🇧 english_equivalent`): Bridges Grade 7 English vocabulary (e.g., `"Prosperous / Flourishing"`, `"Form / Take shape"`, `"Mechanism"`) to abstract Sino-Vietnamese compounds.
  * Morpheme tree: Click any root to explore related compounds sharing that root.
  * Contextual popover embedded directly into reading passages plus mini guessing quizzes.
* **Pure Vietnamese Sensory Dictionary (`Từ điển Thuần Việt`):**
  * Table `public.thuan_viet_dictionary` (with curated fallback entries in `src/lib/supabase/thuan-viet-seed.ts`): `word`, `word_type` (`tu_lay`, `tu_tuong_hinh`, `tu_tuong_thanh`, `tu_da_nghia`, `khac`), `simple_meaning`, `mental_image`, `context_clue`, `english_equivalent`, `example_sentence`, `synonyms`, `grade_level`, `subject_tag`, `quiz_data`.
  * Helps 12-year-olds visualize evocative Vietnamese words (`khúc khích`, `lênh đênh`, `gắn bó`, `dở dang`, `ngập ngừng`, `bỡ ngỡ`...) through sensory mental imagery (`mental_image`) and context clues.
* **Centralized Vocabulary Arena (`/games` - Đấu Trường Từ Vựng):**
  * **Mode 1 (🧩 Thợ Rèn Hình Vị - Hán Việt):** Combine 2 root morphemes (`han_viet_roots`) matching the target compound meaning (`han_viet_compounds`).
  * **Mode 2 (🎨 Bức Họa Ngôn Từ - Thuần Việt):** Guess pure Vietnamese words from `mental_image` or cloze `example_sentence`.
  * **Mode 3 (⚔️ Đấu Trường Thực Chiến - Tổng Hợp):** *Flashcard Blitz* (15s countdown timer matching meanings + `🇬🇧 english_equivalent`) and *Bác Sĩ Câu Văn* (diagnosing and fixing contextually misused words).
  * Features Score, Combo Streak, visual countdown bar, Web Audio API sound effects, `canvas-confetti`, and `localStorage` high score persistence.
* **Dynamic Supabase Rendering on PWA:**
  * `/dictionary` (`src/app/dictionary/page.tsx` & `DictionaryClient.tsx`), `/dictionary/[slug]`, and `/games` (`src/app/games/page.tsx` & `GamesClient.tsx`) dynamically query `han_viet_compounds`, `compound_root_links`, `han_viet_roots`, and `thuan_viet_dictionary` from Supabase (`force-dynamic`).
* **Normalized Relational Schema in Supabase (`supabase/migrations/create_thuan_viet_dictionary.sql`):**
  * `han_viet_roots` (**305+** root morphemes: `id`, `hanzi`, `reading_vi`, `root_meaning`, `created_at`).
  * `han_viet_compounds` (**287+** compounds: `id`, `word`, `slug`, `full_meaning`, `english_equivalent`, `example_sentence`, `math_formula`, `subject_tag`, `grade_level`, `quiz_data`, `created_at`).
  * `compound_root_links` (**548+** N-N links: `id`, `compound_id`, `root_id`, `position_order` 1 or 2, `related_words`).
  * `thuan_viet_dictionary` (**274+** entries: `id`, `word`, `word_type`, `simple_meaning`, `mental_image`, `context_clue`, `english_equivalent`, `example_sentence`, `synonyms`, `grade_level`, `subject_tag`, `quiz_data`, `created_at`).
* **Automated Seeding, Scraping & Expansion Pipeline:**
  * `scripts/seed_han_viet.ts` (`npm run seed:hanviet`): Seeds core textbook compounds, roots, links, and interactive quizzes into Supabase.
  * `src/lib/agents/han_viet_scraper.ts` & `scripts/extract_han_viet.ts`: Gemini-powered agent that extracts new Sino-Vietnamese compounds (including `english_equivalent`) from passages.
  * `scripts/expand_han_viet.ts` (`npm run expand:hanviet`): Upgraded CLI generator scanning general middle-school academic vocabulary, social life, science journalism, and **Root Morpheme Genealogy ("Gia phả hình vị")** from `han_viet_roots`. Supports targeted CLI word lists via `--words="phán xét, liên kết, mật độ, phân bố, lục địa, bồi tụ, ..."`.
  * `scripts/expand_thuan_viet.ts` (`npm run expand:thuanviet`): Upgraded CLI seeder and Gemini expander for Pure Vietnamese sensory, psychological, literary, and daily communication vocabulary (`thuan_viet_dictionary`). Supports targeted CLI word lists via `--words="đóng khung, đóng, khung, gắn bó, dở dang"`.

## 6. Interactive Vietnamese Grammar Module (`/grammar` - Phẫu Thuật Cấu Trúc Câu)
* **Pedagogical Framework:** Designed for Grade 7 (12-year-old) students with strong logic & English skills who struggle with complex Vietnamese syntax. Converts dry grammar theory into visual **Sentence Anatomy** based on research by Nguyễn Hiến Lê - Trương Văn Chình and GS. Diệp Quang Ban across a 4-Level Cognitive Progression:
  * **[Tab 1] Level 1 (`sentence_core` / `pick_core`, `level_order: 1`):** 🦴 *Khung Xương Câu* (Chủ từ + Thuật từ / Vị từ làm đỉnh — `🇬🇧 Subject + Verb Core`) with an interactive **X-Ray "Lọc Xương"** filter that fades out peripheral modifiers.
  * **[Tab 2] Level 2 (`sentence_slicing` / `slice_slash`, `level_order: 2`):** ✂️ *Dao Mổ Tách Câu* (slicing long textbook compound sentences into independent clauses with `/`).
  * **[Tab 3] Level 3 (`connectors_logic` / `drag_logic_arrow`, `level_order: 3`):** 🔗 *Mũi Tên Logic* (mapping `Nhờ/Do/Vì... nên...`, `Mặc dù... nhưng...` into Cause ➔ Effect / Contrast diagrams).
  * **[Tab 4] Level 4 (`topic_comment`, `level_order: 4`):** 🔜 *Cấu Trúc Đề - Thuyết & Từ Vị Theo Ngữ Cảnh* (`🇬🇧 Topic - Comment & Part of Speech vs. Syntactic Role`).
* **Schema & Fallback Seed:**
  * Table `public.grammar_exercises` (`supabase/migrations/create_grammar_exercises.sql`) and seed runner `scripts/seed_grammar.ts` (`npm run seed:grammar`).
  * Curated seed bank `src/data/grammar-seed.ts` (16 Grade 7 textbook exercises across History, Geography, Literature, and Science) synced to Supabase with instant local fallback.

## 7. 3-Phase Metacognition Reading Module (`/metacognition-read`)
* **Pedagogical Framework:** Independent 3-Phase Metacognition reader (`Planning – Monitoring – Evaluating`) combining **Simple Explanations (`💡 Giải thích giản đơn:` in bold)**, **Parent Think-Aloud Modeling (Ba làm mẫu)**, and **6-Symbol Marking Text** (`[?]`, `[!]`, `[*]`, `[C]`, `[P]`, `[KL]`):
  * **Phase 1 (Planning):** Active Recall question + Prediction prompt + Sticky 6-Symbol Marking Text Legend Bar.
  * **Phase 2 (Monitoring):** 2-column split screen (60% Original Text with interactive Han-Viet etymology pop-ups & text-selection Marking Text highlighter — 40% **`💡 Giải thích giản đơn:`** in bold, Parent Think-Aloud modeling, and Student 5-word reflection journal). Supports both `han_viet_Popup` and `han_viet_popups` field conventions via `getChunkPopups(chunk)`.
  * **Phase 3 (Evaluating):** 3-level QAR challenge (with Parent/Teacher hints), Interactive Mindmap Matrix Table, 3-2-1 Reflection + Traffic Light (`🟢🟡🔴`), and Golden Takeaway box.
* **Curated Articles (8 Articles in Seed & Supabase):**
  1. `"Mindset - Bài 1 - Sức mạnh của Tư duy - Growth Mindset"` (`id: "growth-mindset-suc-manh-tu-duy"`, `subject: "Kỹ năng sống"`, 4 chunks).
  2. `'Mindset - Bài 2: Não bộ cần phải được tập "Gym" để không bị đóng khung'` (`id: "mindset-nao-bo-la-co-bap"`, `subject: "Kỹ năng sống"`, 3 chunks).
  3. `"Mindset - Bài 3: Nhận Diện Hai Kiểu Tư Duy — Tư duy Cố Định và Tư duy Phát Triển"` (`id: "mindset-hai-kieu-tu-duy"`, `subject: "Kỹ năng sống"`, 3 chunks).
  4. `"Mindset - Bài 4: Thất Bại Là 'Dấu Chấm Hết' Hay 'Tín Hiệu Để Nhìn Lại Mình'?"` (`id: "mindset-giai-ma-that-bai"`, `subject: "Kỹ năng sống"`, 3 chunks).
  5. `"Mindset – Bài 6: Sức Mạnh Kỳ Diệu Của Chữ 'CHƯA'"` (`id: "mindset-suc-manh-chu-chua"`, `subject: "Kỹ năng sống"`, 3 chunks).
  6. `"Mindset – Bài 7: Cởi Bỏ Nhãn Dán Và Tập Trung Vào Quá Trình"` (`id: "mindset-coi-bo-nhan-dan"`, `subject: "Kỹ năng sống"`, 3 chunks).
  7. `"Lịch sử 7 - Bài 6: Sự hình thành và phát triển của các vương quốc phong kiến ở Đông Nam Á (Thế kỉ VII – X)"` (`id: "lich-su-7-bai-6-dong-nam-a"`, `subject: "Lịch sử"`, 3 chunks).
  8. `"Địa lí 7 - Bài 5: Vị trí địa lí, đặc điểm tự nhiên châu Á — Bức tranh thiên nhiên kỳ vĩ và phân hóa đa dạng"` (`id: "dia-li-7-bai-5-thien-nhien-chau-a"`, `subject: "Địa lý"`, 3 chunks).
* **Print & Export:** Built-in **🖨️ Xuất bản in A4** (`@media print` 2-column worksheet) and **📄 Tải file Word (`.doc`)** generator.
* **Data & Sync:** Defined in `src/types/metacognition.ts`, seeded via `src/data/metacognition-seed.ts`, `supabase_1page_articles.sql`, and `scripts/seed_metacognition.ts` (`npm run seed:metacognition`) into `public.one_page_articles` with `article_type = 'metacognition'` (`category = 'metacognition'`).

## 8. Vietnamese Proverbs & Life Skills Module (`/proverbs` - Kho Tàng Tục Ngữ Việt Nam)
* **Pedagogical Framework:** Built for 12-year-olds (Grade 7) to cultivate life skills, decode cultural metaphors (based on Lê Văn Hòe's *Tục ngữ lược giải*), develop dialectical critical thinking, and build a bank of sharp essay evidence for social/narrative writing.
* **Interactive Features (`src/app/proverbs/page.tsx` & `src/app/proverbs/ProverbsClient.tsx`):**
  * **3 Thematic Pillars:** `🌾 Thiên nhiên & Lao động` (`nature_labor`), `🤝 Đạo đức & Quan hệ xã hội` (`morality_society`), `🧠 Kỹ năng sống & Ứng xử` (`skills_conduct`), plus localized Vietnamese sub-category tags (`SUB_CATEGORY_LABELS`).
  * **Interactive Flip Cards:** Front displays the proverb, English anchor (`🇬🇧 english_anchor`), keywords, and **🖼️ Nghĩa đen (Hình ảnh gốc)**; flipping reveals **💎 Nghĩa bóng (Bài học cốt lõi)**.
  * **💡 Lăng Kính Tuổi 12 Drawer:** Expandable section containing `life_skill_note`, `dialectical_view` (critical thinking & exceptions), `essay_evidence_usage`, and `sample_sentence` with a 1-click Copy button for essay writing.
  * **🎮 Mini-Game "Tục Ngữ Ứng Chiến":** Situational multiple-choice quiz testing real-life application of proverbs with instant explanation, score counter, and confetti.
* **Schema & Seed Pipeline:**
  * Table `public.proverbs` (`supabase/migrations/create_proverbs_table.sql`) with public `SELECT` RLS.
  * Seeded with **30 curated proverbs** via `src/data/proverbs-seed.ts` and `scripts/seed_proverbs.ts` (`npm run seed:proverbs`).

## 9. Responsive Mobile Navigation & Multi-Platform PWA Installer (`Header.tsx` & `InstallAppButton.tsx`)
* **2-Row Mobile Navbar (`src/components/shared/Header.tsx`):**
  * **Row 1 (Mobile) / Left & Right (Desktop):** Logo + "Đọc Hiểu Tiếng Việt" on the left; **Hộ chiếu** (`/passport`) + **Cài App** (`<InstallAppButton />`) on the right. No offline/sync badge clutter.
  * **Row 2 (Mobile) / Center (Desktop):** 8 navigation items (`Trang chủ`, `Bài ngắn`, `1 Trang`, `Siêu Nhận Thức`, `Từ điển`, `Tục Ngữ`, `Cấu trúc câu`, `Đấu trường`) evenly distributed with active route highlighting and zero horizontal overflow (`overflow-x: hidden` on `html, body`).
* **Smart PWA Install Button (`src/components/InstallAppButton.tsx`):**
  * Automatically hides (`return null`) when running in installed standalone mode (`display-mode: standalone` or `navigator.standalone`).
  * Triggers native `beforeinstallprompt` on Chrome / Edge / Android, and opens device-specific 2-step installation modals on iPhone/iPad (Safari Share `⬆️` ➔ Add to Home Screen `➕`), Android, and Windows/Mac desktop browsers.
```
