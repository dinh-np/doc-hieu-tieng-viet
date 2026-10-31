# SKILL: ETYMOLOGY & HAN-VIET DICTIONARY

When developing `/dictionary` routes and `<HanVietTooltip />`:

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