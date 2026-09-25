'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { ReadingSessionState, ReadingStep, SyncStatus } from '@/types/session';
import { ReadingArticle } from '@/types/article';

const initialState = {
  sessionId: null,
  currentArticle: null,
  activeStep: 0 as ReadingStep,
  completedSteps: [] as ReadingStep[],
  syncStatus: 'disconnected' as SyncStatus,
  isParentView: false,
  organizerState: {},
  qarAnswers: {},
  highlightedWord: null,
  confettiTrigger: 0,
  parentConnected: false,
};

export const useReadingSession = create<ReadingSessionState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setArticle: (article: ReadingArticle) =>
          set({ currentArticle: article }),

        setStep: (step: ReadingStep) =>
          set({ activeStep: step }),

        completeStep: (step: ReadingStep) =>
          set((state) => ({
            completedSteps: state.completedSteps.includes(step)
              ? state.completedSteps
              : [...state.completedSteps, step],
          })),

        setSyncStatus: (status: SyncStatus) =>
          set({ syncStatus: status }),

        setSessionId: (id: string) =>
          set({ sessionId: id }),

        setIsParentView: (isParent: boolean) =>
          set({ isParentView: isParent }),

        updateOrganizerSlot: (slotId: string, cardId: string) =>
          set((state) => ({
            organizerState: { ...state.organizerState, [slotId]: cardId },
          })),

        submitQARAnswer: (questionId: string, answer: number | string) =>
          set((state) => ({
            qarAnswers: { ...state.qarAnswers, [questionId]: answer },
          })),

        triggerConfetti: () =>
          set((state) => ({ confettiTrigger: state.confettiTrigger + 1 })),

        setHighlightedWord: (word: string | null) =>
          set({ highlightedWord: word }),

        setParentConnected: (connected: boolean) =>
          set({ parentConnected: connected }),

        reset: () => set(initialState),
      }),
      {
        name: 'reading-session-storage',
        partialize: (state) => ({
          sessionId: state.sessionId,
          activeStep: state.activeStep,
          completedSteps: state.completedSteps,
          organizerState: state.organizerState,
          qarAnswers: state.qarAnswers,
        }),
      }
    ),
    { name: 'ReadingSession' }
  )
);
