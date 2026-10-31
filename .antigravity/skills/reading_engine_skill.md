# SKILL: 5-STEP READING ENGINE IMPLEMENTATION

When implementing components in `src/components/reading-engine/`, follow these UI and logic rules:

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