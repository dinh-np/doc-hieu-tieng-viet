'use client';


import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, X, CheckCircle2, Users } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Step0BookImmersion } from '@/components/reading-engine/Step0BookImmersion';
import { Step1ThinkAloud } from '@/components/reading-engine/Step1ThinkAloud';
import { Step2GraphicOrganizer } from '@/components/reading-engine/Step2GraphicOrganizer';
import { Step3ReciprocalCards } from '@/components/reading-engine/Step3ReciprocalCards';
import { Step4QARDetection } from '@/components/reading-engine/Step4QARDetection';
import { Step5ReadingLog } from '@/components/reading-engine/Step5ReadingLog';
import { useReadingSession } from '@/lib/stores/useReadingSession';
import { subscribeToSession, broadcastEvent } from '@/lib/supabase/realtime';
import { createClient } from '@/lib/supabase/client';
import { ReadingArticle } from '@/types/article';
import { ReadingStep } from '@/types/session';

const STEP_LABELS = [
  'Dự đoán',
  'Think-Aloud',
  'Sơ Đồ',
  'Dạy Ngược',
  'QAR',
  'Giấy Bút',
];

export default function ReadArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const {
    activeStep, setStep, completeStep, setArticle, sessionId, setSessionId,
    setSyncStatus, syncStatus, completedSteps, highlightedWord, setHighlightedWord,
    triggerConfetti, setParentConnected, parentConnected, currentArticle,
  } = useReadingSession();

  const [showQR, setShowQR] = useState(false);
  const [article, setArticleState] = useState<ReadingArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const supabase = createClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      let query = supabase.from('reading_articles').select('*');
      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }
      
      const { data, error } = await query.single();
      if (data) {
        setArticleState(data as ReadingArticle);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  const data = article?.structured_data;

  // Init session
  useEffect(() => {
    if (!article) return;
    setArticle(article);
    
    // Reset to step 0 if it's a new session or a different article
    if (!sessionId || currentArticle?.slug !== article.slug) {
      const newId = `${id}-${Date.now()}`;
      setSessionId(newId);
      setStep(0);
    }
  }, [article, id, sessionId, setArticle, setSessionId, currentArticle, setStep]);

  // Realtime subscription
  useEffect(() => {
    if (!sessionId) return;
    setSyncStatus('connecting');
    const channel = subscribeToSession(sessionId, (payload) => {
      if (payload.event === 'PARENT_JOINED') {
        setParentConnected(true);
        setSyncStatus('parent_connected');
      }
      if (payload.event === 'TRIGGER_CONFETTI') {
        triggerConfetti();
      }
      if (payload.event === 'HIGHLIGHT_WORD') {
        setHighlightedWord(payload.payload.word);
        setTimeout(() => setHighlightedWord(null), 4000);
      }
    });
    setSyncStatus('synced');
    return () => { channel.unsubscribe(); };
  }, [sessionId, setSyncStatus, setParentConnected, triggerConfetti, setHighlightedWord]);

  const handleStepComplete = useCallback(
    (step: ReadingStep) => {
      completeStep(step);
      if (step < 5) {
        const next = (step + 1) as ReadingStep;
        setStep(next);
        if (sessionId) {
          broadcastEvent(sessionId, { event: 'STEP_CHANGE', payload: { step: next } });
        }
      }
    },
    [completeStep, setStep, sessionId]
  );

  const handleQARAnswer = useCallback(
    (questionId: string, selectedIndex: number, isCorrect: boolean) => {
      if (sessionId) {
        broadcastEvent(sessionId, {
          event: 'QAR_SUBMITTED',
          payload: { questionId, selectedIndex, isCorrect },
        });
      }
    },
    [sessionId]
  );

  const handleCardMatched = useCallback(
    (slotId: string, cardId: string, isCorrect: boolean) => {
      if (sessionId) {
        broadcastEvent(sessionId, {
          event: 'CARD_MATCHED',
          payload: { slotId, cardId, isCorrect },
        });
      }
    },
    [sessionId]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Đang tải...</p>
      </div>
    );
  }

  if (!article || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Bài đọc không tìm thấy</p>
      </div>
    );
  }

  const parentUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/read/${id}/parent?session=${sessionId}`;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Article title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black gradient-text">{article.title}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {article.estimated_minutes} phút · Lớp {article.target_grade}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-1">
          {STEP_LABELS.map((label, i) => {
            const step = i as ReadingStep;
            const isActive = activeStep === step;
            const isComplete = completedSteps.includes(step);
            return (
              <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => isComplete && setStep(step)}
                  className={`step-dot ${
                    isActive
                      ? 'step-dot-active'
                      : isComplete
                      ? 'step-dot-complete'
                      : 'step-dot-inactive'
                  }`}
                  title={label}
                >
                  {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
                </button>
                {i < 5 && (
                  <div
                    className={`h-px w-6 transition-all ${
                      isComplete ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            );
          })}
          <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
            {STEP_LABELS[activeStep]}
          </span>
        </div>

        {/* Step content */}
        <div className="card rounded-2xl p-6">
          {activeStep === 0 && (
            <Step0BookImmersion
              article={article}
              onComplete={() => handleStepComplete(0)}
            />
          )}
          {activeStep === 1 && (
            <Step1ThinkAloud
              paragraphs={data.step_1_think_aloud.paragraphs}
              highlightedWord={highlightedWord}
              onComplete={() => handleStepComplete(1)}
            />
          )}
          {activeStep === 2 && (
            <Step2GraphicOrganizer
              data={data.step_2_graphic_organizer}
              onSlotMatched={handleCardMatched}
              onComplete={() => handleStepComplete(2)}
            />
          )}
          {activeStep === 3 && (
            <Step3ReciprocalCards
              cards={data.step_3_reciprocal_cards}
              onComplete={() => handleStepComplete(3)}
            />
          )}
          {activeStep === 4 && (
            <Step4QARDetection
              questions={data.step_4_qar_questions}
              onAnswerSubmit={handleQARAnswer}
              onComplete={() => handleStepComplete(4)}
            />
          )}
          {activeStep === 5 && (
            <Step5ReadingLog
              data={data.step_5_screen_to_paper}
              articleId={id}
              onComplete={() => router.push('/')}
            />
          )}
        </div>
      </main>

      {/* Floating QR button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {parentConnected && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 border border-emerald-300 text-xs text-emerald-400">
            <Users className="w-3 h-3" />
            Cha - Mẹ đang xem
          </div>
        )}
        <button
          onClick={() => setShowQR(true)}
          className="w-12 h-12 rounded-2xl bg-[#0066ab] flex items-center justify-center shadow-xl shadow-indigo-950/60 hover:opacity-90 transition-all"
          title="Kết nối bố/mẹ"
        >
          <QrCode className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white shadow-sm border border-gray-200 rounded-3xl p-6 max-w-sm w-full space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Mời Cha - Mẹ tham gia</h3>
              <button onClick={() => setShowQR(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
              <div className="text-slate-800 text-xs text-center p-4">
                <div className="w-32 h-32 bg-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-600" />
                </div>
                <p className="font-mono text-xs break-all text-slate-600">{parentUrl}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 text-center">
              Bố/mẹ quét QR hoặc mở link trên điện thoại để vào chế độ đồng hành
            </p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(parentUrl);
              }}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-slate-700 hover:bg-gray-50 transition-all"
            >
              📋 Sao chép đường link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
