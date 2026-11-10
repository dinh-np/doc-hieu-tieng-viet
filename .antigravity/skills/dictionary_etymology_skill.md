# SKILL: ETYMOLOGY & HAN-VIET DICTIONARY

When developing `/dictionary` routes, `<HanVietTooltip />`, and dictionary data pipelines:

### 1. Mathematical Formula Layout
`<EtymologyFormulaCard />` must render a high-contrast horizontal flexbox:
* **Root 1 Badge:** Light blue background (`bg-blue-50 text-blue-700 border-blue-200`), muted Hanzi on top, large Vietnamese reading in center, concise meaning below.
* **Math Symbol:** `+` symbol centered between badges (`text-xl text-slate-400 font-bold`).
* **Root 2 Badge:** Light amber background (`bg-amber-50 text-amber-700 border-amber-200`), identical layout to Root 1.
* **Inference Arrow:** Prominent `➔` icon.
* **Compound Result Badge:** Emerald container (`bg-emerald-50 text-emerald-800 font-semibold`).
* **Morpheme Family:** Render `related_words` as rounded pill tags below each root to foster associative vocabulary learning.

### 2. Contextual In-Text Tooltip (`<HanVietTooltip />`)
* Match words in `content_raw` against `han_viet_compounds` records and wrap matches with `<HanVietTooltip />`.
* Styled with bold text and a dashed blue underline (`underline decoration-dashed decoration-blue-400 cursor-pointer`).
* Clicking or hovering triggers a Radix Popover displaying the mathematical root breakdown and a direct link to the dictionary entry.

### 3. Database Seeding, Dual Dictionary & Gamification Arena
* **Relational Integrity (`supabase/migrations/create_thuan_viet_dictionary.sql`):**
  1. `han_viet_roots` (`id`, `hanzi`, `reading_vi` unique, `root_meaning`, `created_at`).
  2. `han_viet_compounds` (`id`, `word` unique, `slug` unique, `full_meaning`, `english_equivalent`, `example_sentence`, `math_formula`, `subject_tag`, `grade_level`, `quiz_data`, `created_at`).
  3. `compound_root_links` (`id`, `compound_id`, `root_id`, `position_order` 1 or 2, `related_words` text[]).
  4. `thuan_viet_dictionary` (`id`, `word` unique, `word_type`, `simple_meaning`, `mental_image`, `context_clue`, `english_equivalent`, `example_sentence`, `synonyms` text[], `grade_level`, `subject_tag`, `quiz_data` jsonb, `created_at`).
* **Cognitive Anchor (`🇬🇧 english_equivalent`):** Display the concise English equivalent badge on both Hán-Việt and Thuần Việt cards to leverage the student's existing Grade 7 English vocabulary.
* **Dynamic PWA Fetching:** `/dictionary`, `/dictionary/[slug]`, and `/games` must query Supabase directly (`export const dynamic = 'force-dynamic'; export const revalidate = 0;`) with graceful fallback to `src/lib/supabase/thuan-viet-seed.ts`.
* **Gamification Arena (`/games`):** Maintain 3 distinct modes in `src/app/games/GamesClient.tsx`:
  - Mode 1: 🧩 *Thợ Rèn Hình Vị* (combining 2 `han_viet_roots` to forge a compound).
  - Mode 2: 🎨 *Bức Họa Ngôn Từ* (guessing `thuan_viet_dictionary` words from `mental_image` or cloze `example_sentence`).
  - Mode 3: ⚔️ *Đấu Trường Thực Chiến* (15-second *Flashcard Blitz* & *Bác Sĩ Câu Văn* mixing both dictionaries).
* **Automated Expansion & Seed CLI Scripts:**
  - `npm run seed:hanviet` (`tsx scripts/seed_han_viet.ts`)
  - `npm run expand:hanviet` (`tsx scripts/expand_han_viet.ts --count=30` or targeted `npx tsx scripts/expand_han_viet.ts --words="phán xét, liên kết, mật độ, phân bố, lục địa, bồi tụ"`) — Scans academic THCS vocabulary, social life, science journalism, and **Root Morpheme Genealogy ("Gia phả hình vị")** from `han_viet_roots`.
  - `npm run expand:thuanviet` (`tsx scripts/expand_thuan_viet.ts --count=30` or targeted `npx tsx scripts/expand_thuan_viet.ts --words="đóng khung, đóng, khung"`) — Scans vivid pure Vietnamese sensory, psychological, literary, and daily communication vocabulary.
  - `npm run seed:proverbs` (`tsx scripts/seed_proverbs.ts`) — Upserts 30+ curated Vietnamese proverbs (`src/data/proverbs-seed.ts`) into `public.proverbs`.
  - `npm run seed:grammar` (`tsx scripts/seed_grammar.ts`)
  - `npm run seed:metacognition` (`tsx scripts/seed_metacognition.ts`)

### 4. Interactive Sentence Anatomy (`/grammar`)
* **4-Level Cognitive Progression (`public.grammar_exercises` & `src/data/grammar-seed.ts`):**
  - **Level 1 (`sentence_core` / `pick_core`, `level_order: 1`):** Identify Subject + Predicate core and toggle the **🦴 Lọc Xương (X-Ray)** filter to fade out modifiers.
  - **Level 2 (`sentence_slicing` / `slice_slash`, `level_order: 2`):** Slice long compound sentences at clause boundaries using `✂️ /`.
  - **Level 3 (`connectors_logic` / `drag_logic_arrow`, `level_order: 3`):** Map logical conjunctions (`Nhờ/Do/Vì... nên...`, `Mặc dù... nhưng...`) into `[Vế A] ➔ [Vế B]` diagrams.
  - **Level 4 (`topic_comment`, `level_order: 4`):** Topic-Comment (Đề - Thuyết) and Contextual Word Roles (Từ tính vs. Từ vị).

### 5. Vietnamese Proverbs & Cultural Metaphors (`/proverbs`)
* **Table & Seed (`public.proverbs` & `src/data/proverbs-seed.ts`):**
  - Each entry includes `proverb`, `pillar` (`nature_labor` | `morality_society` | `skills_conduct`), `sub_category` (mapped to Vietnamese labels in `SUB_CATEGORY_LABELS`), `literal_meaning`, `figurative_meaning`, `life_skill_note`, `dialectical_view`, `essay_evidence_usage`, `sample_sentence`, `english_anchor`, and `keywords`.
  - Features 3D flip cards (Literal ➔ Figurative), **💡 Lăng Kính Tuổi 12** drawer with 1-click sample essay sentence copy, and **🎮 Mini-Game "Tục Ngữ Ứng Chiến"**.
