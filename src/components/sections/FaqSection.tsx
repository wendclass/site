import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessagesSquare, Plus, ArrowUpRight } from 'lucide-react';
import { CtaButton } from '../ui/CtaButton';
import { FAQ_ITEMS } from '../../data/faq';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const FaqSection: React.FC = () => {
  // Only one accordion open at a time (first one open by default like the reference)
  const [activeId, setActiveId] = useState<string | null>('faq-1');
  const prefersReducedMotion = useReducedMotion();

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-ivoire-violet/25 to-white relative border-t border-violet-imperial/10 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-imperial/5 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
        {/* Section Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-violet-imperial/15 shadow-sm text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <MessagesSquare className="w-3.5 h-3.5 text-violet-imperial" />
            <span>Questions fréquentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            Je réponds avant même que vous ne demandiez
          </h2>

          <p className="text-base sm:text-lg text-onyx/75 font-body max-w-xl mx-auto">
            Des réponses directes et sans détour pour aborder votre collaboration en toute confiance.
          </p>
        </div>

        {/* Chat / Messaging Conversation Thread */}
        <div className="space-y-4 sm:space-y-5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = activeId === item.id;
            const questionId = `faq-q-${item.id}`;
            const answerId = `faq-a-${item.id}`;

            return (
              <div key={item.id} className="flex flex-col items-start w-full">
                {/* 1. Client Question Bubble (Left-aligned) */}
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => handleToggle(item.id)}
                  className={`group relative inline-flex items-center justify-between gap-4 text-left px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl sm:rounded-[22px] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial/50 ${
                    isOpen
                      ? 'bg-white text-onyx border border-violet-imperial/25 shadow-[0_4px_16px_rgba(102,0,204,0.08)] ring-1 ring-violet-imperial/10'
                      : 'bg-white hover:bg-ivoire-violet/50 text-onyx border border-violet-imperial/12 shadow-[0_2px_8px_rgba(13,10,24,0.04)] hover:shadow-[0_4px_14px_rgba(102,0,204,0.08)] hover:border-violet-imperial/25'
                  }`}
                >
                  <span className="font-body font-semibold text-sm sm:text-base text-onyx leading-snug">
                    {item.question}
                  </span>

                  {/* Toggle icon (+ to ×) */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-45 text-amethyste bg-violet-imperial/10'
                        : 'text-violet-imperial group-hover:scale-110'
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </button>

                {/* 2. Scott Nana Reply Bubble (Right-aligned with Avatar) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -6, scale: 0.98 }
                      }
                      animate={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0, scale: 1 }
                      }
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -4, scale: 0.98 }
                      }
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full flex justify-end items-end gap-2.5 sm:gap-3.5 mt-2.5 mb-2 pl-6 sm:pl-14"
                    >
                      {/* Speech Bubble */}
                      <div className="relative bg-gradient-to-br from-violet-imperial via-violet-imperial to-[#7a12e8] text-white p-4 sm:p-5 rounded-2xl sm:rounded-[22px] rounded-br-xs sm:rounded-br-xs shadow-[0_8px_24px_rgba(102,0,204,0.22)] border border-white/10 max-w-xl sm:max-w-2xl">
                        <p className="text-sm sm:text-base leading-relaxed text-white/95 font-body">
                          {item.answer}
                        </p>
                      </div>

                      {/* Author Avatar (Scott Nana) */}
                      <div className="relative flex-shrink-0 mb-0.5" title="Scott Nana">
                        <img
                          src="/assets/about/scott-avatar.webp"
                          alt="Scott Nana"
                          width={44}
                          height={44}
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover object-center ring-2 ring-violet-imperial/20 shadow-md bg-onyx"
                          onError={(e) => {
                            // Fallback to PNG if webp fails
                            (e.currentTarget as HTMLImageElement).src = '/assets/about/scott-avatar.png';
                          }}
                        />
                        {/* Tiny active/verified status badge */}
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
                          title="En ligne"
                          aria-hidden="true"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bridge */}
        <div className="text-center pt-4">
          <p className="text-sm text-onyx/75 font-body mb-4">
            Vous avez une autre question spécifique à votre projet ?
          </p>
          <CtaButton to="/#contact" variant="champagne" size="md" icon={<ArrowUpRight className="w-4 h-4" />}>
            Poser ma question via le formulaire
          </CtaButton>
        </div>
      </div>
    </section>
  );
};
