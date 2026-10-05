import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Compass, Heart, Lightbulb, Target } from 'lucide-react';
import { CtaButton } from '../components/ui/CtaButton';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const APropos: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            L'histoire & la vision
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight">
            Derrière Class S
          </h1>

          <p className="text-base sm:text-lg text-onyx/75 font-body leading-relaxed">
            Comprendre pourquoi une image fait vendre commence par comprendre l’intention derrière chaque coup de crayon.
          </p>
        </div>

        {/* The 5-Step Narrative Progression */}
        <div className="space-y-12 bg-white rounded-3xl p-6 sm:p-12 border border-violet-imperial/15 shadow-soft">
          {/* TEMPS 1 : Contraste d'ouverture */}
          <section className="space-y-4 pb-10 border-b border-violet-imperial/10">
            <div className="flex items-center gap-2 text-violet-imperial text-xs font-bold uppercase tracking-wider font-body">
              <Compass className="w-4 h-4 text-violet-imperial" />
              <span>01. Le constat</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
              Il y a les images qui meublent l'espace, et celles qui génèrent du chiffre.
            </h2>

            <div className="text-onyx/80 space-y-3 font-body text-base sm:text-lg leading-relaxed">
              <p>
                Beaucoup d’entreprises et d’entrepreneurs investissent du temps et de l’énergie dans leur activité, 
                mais confient leur image au hasard ou à des modèles préfabriqués. Le résultat ? Une présence qui passe inaperçue 
                au milieu du flux continu d’informations, ou qui peine à inspirer la confiance nécessaire pour transformer un curieux en acheteur.
              </p>
              <p>
                À l’opposé, une identité visuelle pensée avec méthode ne cherche pas simplement à être « jolie ». 
                Elle attire le bon regard, pose instantanément l’autorité de votre marque et prépare le prospect à passer à l’action.
              </p>
            </div>
          </section>

          {/* TEMPS 2 : Le Parcours + Photo Reveal */}
          <section className="space-y-6 pb-10 border-b border-violet-imperial/10">
            <div className="flex items-center gap-2 text-or-champagne text-xs font-bold uppercase tracking-wider font-body">
              <Lightbulb className="w-4 h-4 text-or-champagne" />
              <span>02. Le parcours</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Text column */}
              <div className="md:col-span-7 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
                  De la passion du graphisme à la rigueur de la marque
                </h2>

                <div className="text-onyx/80 space-y-3 font-body text-base leading-relaxed">
                  <p>
                    Je m’appelle Scott Nana. Depuis Ouagadougou, j'ai fondé <strong>Class S</strong> pour accompagner les dirigeants de PME, 
                    porteurs de projets et organisateurs d’événements qui veulent donner à leur structure la stature visuelle qu’elle mérite.
                  </p>
                  <p>
                    Dès mes débuts et à l’issue de mes premières sélections techniques dans le domaine de la communication, 
                    j’ai rapidement choisi de ne pas me limiter à la simple exécution de visuels. Ce qui m’animait était de comprendre 
                    les rouages commerciaux derrière chaque support pour en faire un véritable levier de croissance.
                  </p>
                </div>
              </div>

              {/* Photo Reveal Column with Curtain / Wipe Animation */}
              <div className="md:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border border-violet-imperial/20 bg-onyx">
                  {/* Container with overflow hidden for the curtain wipe */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* Photo with zoom effect */}
                    <motion.img
                      src="/assets/about/scott-nana.png"
                      alt="Scott Nana — Brand & Graphic Designer, Fondateur de Class S"
                      className="w-full h-full object-cover object-center"
                      initial={prefersReducedMotion ? { opacity: 0 } : { scale: 1.08, opacity: 0 }}
                      whileInView={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.3 : 0.85,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    />

                    {/* Curtain / Wipe Reveal Panel */}
                    {!prefersReducedMotion && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-onyx via-ardoise to-violet-imperial z-20 pointer-events-none"
                        initial={{ y: '0%' }}
                        whileInView={{ y: '-100%' }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.76, 0, 0.24, 1],
                          delay: 0.1,
                        }}
                      />
                    )}

                    {/* Subtle bottom gradient overlay for legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx/90 via-onyx/40 to-transparent pointer-events-none z-10" />

                    {/* Floating caption tag */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-2xl bg-onyx/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block font-body text-or-champagne">Scott Nana</span>
                        <span className="text-[11px] text-ivoire-violet/70 block font-body">Brand & Graphic Designer</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-violet-imperial/40 px-2 py-0.5 rounded-full border border-violet-imperial/40 text-amethyste">
                        Fondateur
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TEMPS 3 : Le Déclic */}
          <section className="space-y-4 pb-10 border-b border-violet-imperial/10">
            <div className="flex items-center gap-2 text-amethyste text-xs font-bold uppercase tracking-wider font-body">
              <Heart className="w-4 h-4 text-amethyste" />
              <span>03. Le déclic</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
              Le moment où tout a pris son sens
            </h2>

            <div className="text-onyx/80 space-y-3 font-body text-base leading-relaxed">
              <p>
                Environ un an après le lancement de Class S, le vrai déclic s’est produit. Ce déclic n’était pas une réaction d’agacement face à des visuels amateurs croisés dans la rue : c’était la prise de conscience éclatante de <strong>l’impact direct et mesurable qu’un design réfléchi a sur le développement des affaires de mes clients</strong>.
              </p>
              <p>
                Lorsqu’un client m’a partagé comment une campagne ou une identité repensée avait débloqué des prises de contact, 
                rempli une salle ou convaincu des partenaires exigeants, ma vision du métier s’est définitivement cristallisée.
              </p>
            </div>
          </section>

          {/* TEMPS 4 : Sa définition du design (Citation exacte obligatoire) */}
          <section className="py-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-onyx text-ivoire-violet border border-violet-imperial/30 shadow-soft-lg text-center space-y-4">
              <span className="text-xs uppercase font-semibold tracking-widest text-or-champagne font-body">
                04. La conviction fondamentale
              </span>

              {/* Exact quote from section 17.1 */}
              <blockquote className="text-2xl sm:text-3xl md:text-4xl font-title font-semibold text-white leading-snug">
                « Le design n'est pas une question d'esthétique. C'est un outil d'impact. »
              </blockquote>

              <p className="text-xs sm:text-sm text-ivoire-violet/70 font-body max-w-lg mx-auto pt-2">
                Tout ce que je conçois pour votre marque — de la couleur d'un bouton au choix d'une typographie — répond à cette seule exigence d'utilité et de résultat.
              </p>
            </div>
          </section>

          {/* TEMPS 5 : Invitation à contacter */}
          <section className="space-y-6 pt-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-violet-imperial text-xs font-bold uppercase tracking-wider font-body">
                <Target className="w-4 h-4" />
                <span>05. Écrivons la suite ensemble</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
                Et si nous donnions à votre marque l'image qui s'impose ?
              </h2>
              <p className="text-sm sm:text-base text-onyx/75 font-body max-w-xl mx-auto">
                Parlez-moi de votre activité, de vos défis actuels et de vos ambitions. Je vous proposerai un cadre de travail sur mesure.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CtaButton to="/#contact" variant="primary" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                Prendre contact avec Scott
              </CtaButton>
              <CtaButton to="/projets" variant="secondary" size="lg">
                Consulter les études de cas
              </CtaButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
