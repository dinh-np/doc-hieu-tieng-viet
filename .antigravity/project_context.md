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

## 5. Sino-Vietnamese Etymology Module
* Mathematical formula layout: `Root A (meaning) + Root B (meaning) ➔ Compound Meaning`.
* Morpheme tree: Click any root to explore related compounds sharing that root.
* Contextual popover embedded directly into reading passages plus mini guessing quizzes.