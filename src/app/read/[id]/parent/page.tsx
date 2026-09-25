'use client';


import { useState, useEffect, use } from 'react';
import { SmilePlus, ChevronRight, Wifi, BookOpen } from 'lucide-react';
import { Step1ThinkAloud } from '@/components/reading-engine/Step1ThinkAloud';
import { Step2GraphicOrganizer } from '@/components/reading-engine/Step2GraphicOrganizer';
import { Step3ReciprocalCards } from '@/components/reading-engine/Step3ReciprocalCards';
import { Step4QARDetection } from '@/components/reading-engine/Step4QARDetection';
import { Step5ReadingLog } from '@/components/reading-engine/Step5ReadingLog';
import { subscribeToSession, broadcastEvent } from '@/lib/supabase/realtime';
import { createClient } from '@/lib/supabase/client';
import { ReadingArticle } from '@/types/article';
import { ReadingStep } from '@/types/session';

const STEP_LABELS = ['Dự đoán', 'Think-Aloud', 'Sơ Đồ', 'Dạy Ngược', 'QAR', 'Giấy Bút'];

export default function ParentViewPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { id } = use(params);
  const { session: sessionId } = use(searchParams);
  const [activeStep, setActiveStep] = useState<ReadingStep>(0);
  const [connected, setConnected] = useState(false);
  const [childAnswers, setChildAnswers] = useState<Record<string, { idx: number; correct: boolean }>>({});
  const [cardMatches, setCardMatches] = useState<Array<{ slotId: string; correct: boolean }>>([]);
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

  useEffect(() => {
    if (!sessionId) return;

    broadcastEvent(sessionId, {
      event: 'PARENT_JOINED',
      payload: { sessionId },
    });
    setConnected(true);

    const channel = subscribeToSession(sessionId, (payload) => {
      if (payload.event === 'STEP_CHANGE') {
        setActiveStep(payload.payload.step);
      }
      if (payload.event === 'QAR_SUBMITTED') {
        const p = payload.payload;
        setChildAnswers((prev) => ({
          ...prev,
          [p.questionId]: { idx: p.selectedIndex, correct: p.isCorrect },
        }));
      }
      if (payload.event === 'CARD_MATCHED') {
        const p = payload.payload;
        setCardMatches((prev) => [...prev, { slotId: p.slotId, correct: p.isCorrect }]);
      }
    });

    return () => { channel.unsubscribe(); };
  }, [sessionId]);

  const sendPraise = () => {
    if (!sessionId) return;
    broadcastEvent(sessionId, { event: 'TRIGGER_CONFETTI', payload: { source: 'parent' } });
  };

  const sendStepChange = (step: ReadingStep) => {
    if (!sessionId) return;
    setActiveStep(step);
    broadcastEvent(sessionId, { event: 'STEP_CHANGE', payload: { step } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-600">Đang tải...</p>
      </div>
    );
  }

  if (!article || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-600">Không tìm thấy bài đọc</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border border-gray-200 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0066ab]" />
            <div>
              <p className="text-xs font-bold text-slate-800">Chế độ Cha - Mẹ</p>
              <p className="text-xs text-slate-500 leading-tight">{article.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connected ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Kết nối</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">Đang kết nối...</span>
            )}
          </div>
        </div>

        {/* Step nav */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-0.5">
          {STEP_LABELS.map((label, i) => {
            const step = i as ReadingStep;
            return (
              <button
                key={i}
                onClick={() => sendStepChange(step)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeStep === step
                    ? 'bg-[#0066ab] text-white'
                    : 'bg-gray-50 text-slate-600 hover:bg-white/10'
                }`}
              >
                {i}. {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
        {/* Praise button */}
        <button
          onClick={sendPraise}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
        >
          <SmilePlus className="w-5 h-5" />
          Gửi Lời Khen cho Con 🎉
        </button>

        {/* Live telemetry */}
        {Object.keys(childAnswers).length > 0 && (
          <div className="card rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              📊 Kết quả QAR của Con
            </p>
            {Object.entries(childAnswers).map(([qId, ans]) => {
              const question = data.step_4_qar_questions.find((q) => q.id === qId);
              if (!question) return null;
              const option = question.options?.[ans.idx];
              return (
                <div key={qId} className="flex items-start gap-2 text-sm">
                  <span className={ans.correct ? 'text-emerald-400' : 'text-red-400'}>
                    {ans.correct ? '✅' : '❌'}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-xs leading-tight">{question.question}</p>
                    {option && (
                      <p className={`text-xs font-medium mt-0.5 ${ans.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                        Con chọn: {option}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Parent coaching view per step */}
        <div className="card rounded-2xl p-5">
          {activeStep === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#0066ab]" />
                <h2 className="text-lg font-black text-slate-800">
                  Hướng dẫn Cha đồng hành: Khởi động trí tò mò (Bước 0)
                </h2>
              </div>
              
              <div className="bg-[#f8f9fa] border-l-4 border-[#0066ab] p-4 rounded-r-lg">
                <p className="text-sm text-slate-600 mb-2 font-bold uppercase tracking-wider">Cha nói với Con (qua điện thoại):</p>
                <p className="text-slate-800 font-medium italic">
                  "Con hãy nhìn bức ảnh vệ tinh và tiêu đề bài đọc trên màn hình. Con có thấy lạ không khi giữa một cơn bão cuồng phong cấp 12 lại có một khu vực trời quang đãng và le lói ánh nắng? Con thử đoán xem điều kỳ lạ gì đang ẩn giấu ở đó?"
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-bold">Lưu ý sư phạm:</span> Cha đừng vội giải thích khoa học ngay, hãy khuyến khích con đưa ra giả thuyết ban đầu dựa trên trực giác.
                </p>
              </div>

              <button
                onClick={() => sendStepChange(1)}
                className="w-full py-3 mt-4 rounded-xl bg-[#0066ab] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#005590] transition-colors shadow-md"
              >
                Kích hoạt Bước 1 (Think-Aloud) cho Con <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          {activeStep === 1 && (
            <Step1ThinkAloud
              paragraphs={data.step_1_think_aloud.paragraphs}
              isParentView={true}
              onComplete={() => sendStepChange(2)}
            />
          )}
          {activeStep === 2 && (
            <Step2GraphicOrganizer
              data={data.step_2_graphic_organizer}
              isParentView={true}
              onComplete={() => sendStepChange(3)}
            />
          )}
          {activeStep === 3 && (
            <Step3ReciprocalCards
              cards={data.step_3_reciprocal_cards}
              isParentView={true}
              onComplete={() => sendStepChange(4)}
            />
          )}
          {activeStep === 4 && (
            <Step4QARDetection
              questions={data.step_4_qar_questions}
              isParentView={true}
              onComplete={() => sendStepChange(5)}
            />
          )}
          {activeStep === 5 && (
            <Step5ReadingLog
              data={data.step_5_screen_to_paper}
              articleId={id}
              isParentView={true}
              onComplete={() => {}}
            />
          )}
        </div>

        {/* Next step button */}
        {activeStep < 5 && (
          <button
            onClick={() => sendStepChange((activeStep + 1) as ReadingStep)}
            className="w-full py-3 rounded-2xl bg-[#0066ab] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            Chuyển sang Bước {activeStep + 1}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
