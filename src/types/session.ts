// Types for the Realtime Reading Session and Zustand state

import { ReadingArticle } from './article';

export type SyncStatus = 'disconnected' | 'connecting' | 'synced' | 'parent_connected';
export type ReadingStep = 0 | 1 | 2 | 3 | 4 | 5;

// Realtime broadcast payload types (matches spec)
export type RealtimePayload =
  | { event: 'STEP_CHANGE'; payload: { step: ReadingStep } }
  | { event: 'CARD_MATCHED'; payload: { slotId: string; cardId: string; isCorrect: boolean } }
  | { event: 'QAR_SUBMITTED'; payload: { questionId: string; selectedIndex: number; isCorrect: boolean } }
  | { event: 'TRIGGER_CONFETTI'; payload: { source: 'parent' | 'child' } }
  | { event: 'HIGHLIGHT_WORD'; payload: { word: string } }
  | { event: 'SEND_PRAISE'; payload: { message?: string } }
  | { event: 'PARENT_JOINED'; payload: { sessionId: string } };

// Graphic organizer state: maps slot_id -> card_id
export type OrganizerState = Record<string, string>;

// QAR answers state: maps question_id -> selected index
export type QARAnswers = Record<string, number | string>;

export interface ReadingSessionState {
  sessionId: string | null;
  currentArticle: ReadingArticle | null;
  activeStep: ReadingStep;
  completedSteps: ReadingStep[];
  syncStatus: SyncStatus;
  isParentView: boolean;
  organizerState: OrganizerState;
  qarAnswers: QARAnswers;
  highlightedWord: string | null;
  confettiTrigger: number; // increment to trigger confetti
  parentConnected: boolean;

  // Actions
  setArticle: (article: ReadingArticle) => void;
  setStep: (step: ReadingStep) => void;
  completeStep: (step: ReadingStep) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setSessionId: (id: string) => void;
  setIsParentView: (isParent: boolean) => void;
  updateOrganizerSlot: (slotId: string, cardId: string) => void;
  submitQARAnswer: (questionId: string, answer: number | string) => void;
  triggerConfetti: () => void;
  setHighlightedWord: (word: string | null) => void;
  setParentConnected: (connected: boolean) => void;
  reset: () => void;
}
