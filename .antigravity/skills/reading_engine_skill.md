# SKILL: 5-STEP READING ENGINE IMPLEMENTATION

When implementing components in `src/components/reading-engine/`, follow these UI and logic rules:

### Step 0: Book Immersion & Prediction (`Step0BookImmersion.tsx`)
* Render dynamic `prediction_prompt` per article (priority: `article.prediction_prompt` ➔ `structured_data.step_0_immersion.prediction_prompt` ➔ `structured_data.prediction_prompt` ➔ `structured_data.step_1_think_aloud.prediction_prompt` ➔ title-based fallback) — never hardcode article-specific prompts.

### Step 1: Think-Aloud
* Decompose passage content into an array of identifiable sentence blocks (`id`).
* **Child Screen:** The active paragraph has a subtle focus border; inactive paragraphs remain slightly dimmed (`opacity-60`) to prevent skimming ahead.
* **Parent Screen:** Each paragraph has a "Show Script" toggle. The parent script renders in soft green, large readable typography for quick glancing while on a Zalo call.

### Step 2: Graphic Organizer
* Implement an intuitive drag-and-drop interface. Provide a crisp click sound (via Web Audio API or short audio clip) on correct card placement.
* Incorrect placements trigger a gentle horizontal shake animation and return the card to the pool without harsh error banners.
* Ensure full touch-event support for tablets and touchscreen laptops.

### Step 3: Reciprocal Cards
* Display 4 face-down cards: Predict, Clarify, Question, Summarize.
* Card selection triggers a 3D flip animation (CSS `perspective` & `rotateY`).
* Provide a single text input (or voice memo recorder) for the child to log their 1-sentence summary constraint.

### Step 4: QAR Framework
* Render 3 distinct highlighter action buttons:
  * Amber: `Right There` (Literal text search)
  * Emerald: `Think & Search` (Synthesis)
  * Purple: `Author & Me` (Inference)
* Validate selection against `correct_index`. Correct answers trigger a mini confetti blast and notify the parent device via Realtime broadcast.

### Step 5: Screen-to-Paper Bridge
* Prominently display a primary action button: "Print A4 Worksheet" (opens `/read/[id]/print`).
* Display up to two curated physical book recommendations featuring cover art, title, author, publisher, and educational relevance summary.

---

### 3-Phase Metacognition Reading Engine (`/metacognition-read` & `MetacognitionReaderClient.tsx`)
* **Phase 1 (Planning):** Active Recall warmup + Prediction prompt + Sticky 6-symbol Marking Text legend (`[?]`, `[!]`, `[*]`, `[C]`, `[P]`, `[KL]`).
* **Phase 2 (Monitoring):** 60/40 two-column split layout:
  * **Left Column (60%):** Original text with inline interactive Han-Viet etymology popups (`🔑` rendered via `createPortal(..., document.body)` with Auto-Flip Top/Bottom `rect.top < 220` and viewport horizontal clamping) and shared `<TextSelectionToolbar variant="inline" />` Marking Text highlighter.
  * **Right Column (40%):** Socratic question (`🤔 Hỏi xoáy`), bold **`💡 Giải thích giản đơn:`** (`<strong>`), Parent Think-Aloud modeling (`🧠 Ba làm mẫu`), and Student 5-word reflection journal (`✍️ Góc của con`).
* **Phase 3 (Evaluating):** 3-tier QAR questions, Mindmap Matrix, 3-2-1 Reflection + Traffic Light (`🟢🟡🔴`), and Golden Takeaway box.
* **Curated Seed Articles (`src/data/metacognition-seed.ts` & `npm run seed:metacognition`):**
  * 6 Growth Mindset lessons (`Mindset - Bài 1, Bài 2, Bài 3, Bài 4, Bài 6, Bài 7`) + 2 Grade 7 Textbook lessons (`Lịch sử 7 - Bài 6`, `Địa lí 7 - Bài 5`), all normalized to Unicode NFC via `cleanVietnameseText` and stored in `public.one_page_articles` with `article_type = 'metacognition'` and `category = 'metacognition'`.
* **Print & Export:** Supports both `@media print` 2-column A4 worksheet and `.doc` Word export.
* **Thầy Cú Feynman Deep Dive Q&A & Shared Selection Toolbar (`TextSelectionToolbar`, `DeepDiveDrawer`, `/ask`, `/long-read`):**
  * `/read/[id]`, `/read-pages/[id]`, `/metacognition-read/[id]`, and `/long-read/[id]` embed `<DeepDiveDrawer />` (`no-print print:hidden`, floating **`🦉 Hỏi - Đáp`** button) connected to `POST /api/qa-rag` (`pgvector` 5-source RAG + `fullArticleContent` on `/long-read/[id]`).
  * `/long-read/[id]` (`LongReadClient.tsx`) uses a spacious 1-column layout (`max-w-4xl mx-auto`) with a bottom **`🌳 Tóm tắt bài đọc thành sơ đồ tư duy dạng thụt lề`** trigger that converts AI Markdown via `mindmapMarkdownToHtml` into an editable `<RichTextEditor />` Mindmap Box with dual A4 print isolation (`data-print-target="article" | "mindmap"`).
  * `src/components/reading/TextSelectionToolbar.tsx` (`TextSelectionToolbar` at `z-50`, `useReadingTextSelection` supporting `extraContainerRefs` and `allowContentEditable`, `MarkedHighlightsList`) provides the shared 6-symbol Marking Text + **`🦉 Hỏi - Đáp`** toolbar across `/read/[id]`, `/read-pages/[id]`, `/long-read/[id]` (covering both the main article and the editable Mindmap Box), and `MetacognitionReaderClient.tsx` (`variant="inline"`), passing highlighted excerpts directly into `DeepDiveDrawer`.