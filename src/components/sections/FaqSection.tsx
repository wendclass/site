import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';
import { CtaButton } from '../ui/CtaButton';
import { FAQ_ITEMS, FaqItem } from '../../data/faq';

export const FaqSection: React.FC = () => {
  // Currently active question ID (null initially so the thread shows the discrete invitation)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Exchange state: 'idle' | 'showing-question' | 'typing' | 'showing-answer' | 'exiting'
  const [exchangeStage, setExchangeStage] = useState<
    'idle' | 'showing-question' | 'typing' | 'showing-answer' | 'exiting'
  >('idle');

  // Next target ID when transitioning between questions
  const pendingIdRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const answerBubbleRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const activeItem: FaqItem | undefined = FAQ_ITEMS.find((it) => it.id === selectedId);

  // Trigger scroll only if answer bubble is partially clipped offscreen
  useEffect(() => {
    if (exchangeStage === 'showing-answer' && answerBubbleRef.current) {
      try {
        answerBubbleRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
        });
      } catch {}
    }
  }, [exchangeStage, prefersReducedMotion]);

  const startNewExchange = (id: string) => {
    setSelectedId(id);

    if (prefersReducedMotion) {
      // Immediate display with zero animation or delay
      setExchangeStage('showing-answer');
      return;
    }

    // Step 1: Question bubble appears immediately
    setExchangeStage('showing-question');

    // Step 2: Show typing indicator after a tiny pause (100ms)
    timerRef.current = setTimeout(() => {
      setExchangeStage('typing');

      // Step 3: Typing indicator pulses for ~700ms, then the answer appears in one block
      timerRef.current = setTimeout(() => {
        setExchangeStage('showing-answer');
      }, 700);
    }, 120);
  };

  const handleQuestionClick = (id: string) => {
    // If already displaying this question at full answer stage, ignore or keep focused
    if (id === selectedId && exchangeStage === 'showing-answer') return;

    // Clear any pending timers from rapid clicks
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // If an exchange is already visible, fade it out first (200ms)
    if (selectedId !== null && exchangeStage !== 'idle') {
      setExchangeStage('exiting');
      pendingIdRef.current = id;
      timerRef.current = setTimeout(() => {
        const nextId = pendingIdRef.current;
        pendingIdRef.current = null;
        if (nextId) startNewExchange(nextId);
      }, 200);
    } else {
      // Start initial exchange
      startNewExchange(id);
    }
  };

  return (
    <section className="py-20 bg-white relative border-t border-violet-imperial/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-violet-imperial" />
            <span>Questions fréquentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            Tout ce que vous devez savoir avant de démarrer
          </h2>

          <p className="text-base text-onyx/75 font-body max-w-xl mx-auto">
            Des réponses claires et transparentes pour vous permettre d'avancer en toute confiance.
          </p>
        </div>

        {/* Conversation Container */}
        <div className="bg-gradient-to-b from-ivoire-violet/50 to-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
          {/* Discussion Thread */}
          <div
            ref={threadRef}
            role="log"
            aria-live="polite"
            className="min-h-[260px] sm:min-h-[220px] flex flex-col justify-end p-5 sm:p-7 rounded-2xl bg-white/80 border border-violet-imperial/10 relative transition-all duration-300"
          >
            {/* Initial State: discrete invitation */}
            {selectedId === null && (
              <div className="my-auto text-center py-8">
                <p className="text-sm sm:text-base text-onyx/65 font-body">
                  Touchez une question pour lancer la discussion.
                </p>
              </div>
            )}

            {/* Active Exchange */}
            {activeItem && selectedId !== null && (
              <div
                className={`space-y-4 transition-all ${
                  exchangeStage === 'exiting'
                    ? 'opacity-0 -translate-y-2 duration-200'
                    : 'opacity-100 translate-y-0 duration-350'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Visitor Bubble (Right-aligned) */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[88%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl rounded-br-xs sm:rounded-br-sm bg-violet-imperial text-white px-5 py-3.5 text-sm sm:text-base font-body shadow-sm leading-relaxed"
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {activeItem.question}
                  </div>
                </div>

                {/* Class S Typing Indicator (~700ms) */}
                {exchangeStage === 'typing' && !prefersReducedMotion && (
                  <div
                    className="flex items-center gap-3 animate-fade-in"
                    aria-label="Class S est en train d'écrire"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-violet-imperial/20 shrink-0 shadow-xs flex items-center justify-center">
                      <img
                        src="/brand/favicon-class-s.png"
                        alt="Avatar Class S"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl rounded-bl-xs sm:rounded-bl-sm bg-[#F8F5FF] border border-[#A87FE8]/30 px-4 py-3 flex items-center gap-1.5 shadow-xs">
                      <span
                        className="w-2 h-2 rounded-full bg-violet-imperial/60 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-violet-imperial/60 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-violet-imperial/60 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                )}

                {/* Class S Response Bubble */}
                {exchangeStage === 'showing-answer' && (
                  <div
                    ref={answerBubbleRef}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-violet-imperial/20 shrink-0 shadow-xs mt-1 flex items-center justify-center">
                      <img
                        src="/brand/favicon-class-s.png"
                        alt="Avatar Class S"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="max-w-[88%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl rounded-bl-xs sm:rounded-bl-sm bg-[#F8F5FF] border border-[#A87FE8]/30 text-[#3A2F5C] px-5 py-4 text-sm sm:text-base font-body shadow-xs leading-relaxed">
                      {activeItem.answer}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Suggestions Question Pills */}
          <div className="mt-6 pt-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-onyx/60 mb-3 font-body">
              Questions suggérées :
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5">
              {FAQ_ITEMS.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleQuestionClick(item.id)}
                    className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-left text-sm font-body font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial flex items-center ${
                      isSelected
                        ? 'bg-violet-imperial text-white shadow-soft scale-[1.01]'
                        : 'bg-white hover:bg-violet-imperial/5 text-onyx/85 border border-violet-imperial/15 hover:border-violet-imperial/35'
                    }`}
                  >
                    <span>{item.question}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SEO fallback: All Q&A accessible for bots & screen readers */}
        <div className="sr-only" aria-hidden="true">
          {FAQ_ITEMS.map((item) => (
            <article key={`seo-${item.id}`}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>

        {/* Bottom Action Bridge */}
        <div className="text-center pt-2">
          <p className="text-sm text-onyx/75 font-body mb-4">
            Vous avez une autre question spécifique à votre projet ?
          </p>
          <CtaButton
            to="/#contact"
            variant="champagne"
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Poser ma question via le formulaire
          </CtaButton>
        </div>
      </div>
    </section>
  );
};
