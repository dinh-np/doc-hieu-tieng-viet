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

### 3. Database Seeding & AI Etymology Scraper
* **3-Table Relational Integrity:** Always maintain relational consistency across:
  1. `han_viet_roots` (`id`, `hanzi`, `reading_vi` unique, `root_meaning`, `created_at`).
  2. `han_viet_compounds` (`id`, `word` unique, `slug` unique, `full_meaning`, `example_sentence`, `math_formula`, `subject_tag`, `grade_level`, `quiz_data`, `created_at`).
  3. `compound_root_links` (`id`, `compound_id`, `root_id`, `position_order` 1 or 2, `related_words` text[]).
* **Seed 100 Core SGK Words:** Run `npm run seed:hanviet` (`tsx scripts/seed_han_viet.ts`) to parse `./learning_materials/tu_dien_han_viet_co_ban_sgk_100_tu.md` and `./learning_materials/tu_dien_han_viet_chiet_tu.md` and upsert into Supabase.
* **Automated SGK Extraction Agent:** Use `scrapeAndSaveHanVietFromText` from `src/lib/agents/han_viet_scraper.ts` (or CLI `npx tsx scripts/extract_han_viet.ts`) powered by `@google/genai` (`GEMINI_API_KEY`) to extract new Grade 7 Sino-Vietnamese compounds from textbook passages without duplicating existing roots or compounds.
