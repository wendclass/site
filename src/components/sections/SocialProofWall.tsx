import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareQuote, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { fetchPublicTestimonials, DbTestimonial } from '../../lib/supabase';
import { CtaButton } from '../ui/CtaButton';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const SocialProofWall: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchPublicTestimonials().then((data) => {
      if (isMounted) {
        setTestimonials(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Per spec: If no published testimonials exist, keep section hidden
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  // Duplicate items for continuous seamless loop if we have enough items
  const marqueeItems =
    testimonials.length > 0
      ? testimonials.length < 5
        ? [...testimonials, ...testimonials, ...testimonials]
        : [...testimonials, ...testimonials]
      : [];

  // Scroll reveal variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="py-24 bg-ivoire-violet relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-imperial/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-or-champagne fill-or-champagne" />
            Retours d'expérience
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            La satisfaction au cœur de chaque livraison
          </h2>

          <p className="text-base sm:text-lg text-onyx/75 font-body max-w-xl mx-auto">
            Ce que nos clients retiennent de l'impact de leur nouvelle identité visuelle et de nos collaborations.
          </p>
        </motion.div>
      </div>

      {/* Marquee Continuous Flow or Grid Fallback for Reduced Motion */}
      {prefersReducedMotion ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((testim) => (
              <motion.div
                key={testim.id}
                variants={cardVariants}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-or-champagne">
                      {Array.from({ length: testim.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-or-champagne text-or-champagne" />
                      ))}
                    </div>
                    {testim.category && (
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-violet-imperial bg-violet-imperial/10 px-2.5 py-0.5 rounded-full font-body">
                        {testim.category}
                      </span>
                    )}
                  </div>

                  <div className="relative pt-2">
                    <MessageSquareQuote className="w-8 h-8 text-violet-imperial/15 absolute -top-1 -left-2" />
                    <p className="text-sm sm:text-base text-onyx/85 italic font-body relative z-10 leading-relaxed pl-3">
                      {testim.content}
                    </p>
                  </div>

                  {testim.impact_result && (
                    <div className="pt-2 flex items-start gap-2 text-xs text-onyx/70 font-body">
                      <CheckCircle2 className="w-4 h-4 text-violet-imperial shrink-0 mt-0.5" />
                      <span><strong>Impact constaté :</strong> {testim.impact_result}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-violet-imperial/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-onyx block font-body">{testim.author_name}</span>
                    <span className="text-[11px] text-onyx/50 font-body">{testim.author_role_company || 'Client Class S'}</span>
                  </div>
                  {testim.projet_id && (
                    <CtaButton
                      to={`/projets#${testim.projet_id}`}
                      variant="ghost"
                      size="sm"
                      className="!px-2 !py-1 !text-xs text-violet-imperial"
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Étude
                    </CtaButton>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle edge fades */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-ivoire-violet to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-ivoire-violet to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div
            className="animate-marquee flex gap-6 py-4"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              willChange: 'transform',
            }}
          >
            {marqueeItems.map((testim, idx) => (
              <div
                key={`${testim.id}-${idx}`}
                className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between select-none"
              >
                <div className="space-y-4">
                  {/* Rating stars and category */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-or-champagne">
                      {Array.from({ length: testim.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-or-champagne text-or-champagne" />
                      ))}
                    </div>
                    {testim.category && (
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-violet-imperial bg-violet-imperial/10 px-2.5 py-0.5 rounded-full font-body">
                        {testim.category}
                      </span>
                    )}
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative pt-2">
                    <MessageSquareQuote className="w-8 h-8 text-violet-imperial/15 absolute -top-1 -left-2" />
                    <p className="text-sm sm:text-base text-onyx/85 italic font-body relative z-10 leading-relaxed pl-3 line-clamp-3">
                      {testim.content}
                    </p>
                  </div>

                  {/* Result Tag */}
                  {testim.impact_result && (
                    <div className="pt-2 flex items-start gap-2 text-xs text-onyx/70 font-body">
                      <CheckCircle2 className="w-4 h-4 text-violet-imperial shrink-0 mt-0.5" />
                      <span className="line-clamp-2"><strong>Impact constaté :</strong> {testim.impact_result}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Project Link */}
                <div className="mt-6 pt-4 border-t border-violet-imperial/10 flex items-center justify-between">
                  <div className="max-w-[200px]">
                    <span className="text-xs font-bold text-onyx block font-body truncate">{testim.author_name}</span>
                    <span className="text-[11px] text-onyx/50 font-body">{testim.author_role_company || 'Client Class S'}</span>
                  </div>
                  {testim.projet_id && (
                    <CtaButton
                      to={`/projets#${testim.projet_id}`}
                      variant="ghost"
                      size="sm"
                      className="!px-2 !py-1 !text-xs text-violet-imperial shrink-0"
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Étude
                    </CtaButton>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-2">
            <span className="text-[11px] text-onyx/40 font-body">
              (Survolez ou touchez pour mettre le défilement en pause)
            </span>
          </div>
        </motion.div>
      )}

      {/* Call to action bridge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mt-14 text-center">
          <p className="text-sm text-onyx/70 font-body mb-4">
            Envie de faire de votre marque la prochaine réussite ?
          </p>
          <CtaButton to="/#contact" variant="primary" size="md" icon={<ArrowUpRight className="w-4 h-4" />}>
            Démarrer votre projet avec Scott
          </CtaButton>
        </div>
      </div>
    </section>
  );
};
