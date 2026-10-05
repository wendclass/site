import React, { useState } from 'react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';
import { Accordion } from '../ui/Accordion';
import { CtaButton } from '../ui/CtaButton';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Combien de temps faut-il pour recevoir mes visuels ou mon identité ?',
    answer: 'Les délais dépendent de l’envergure du projet : les visuels à l’unité et supports imprimés urgents sont livrés sous 24 heures. Un site web vitrine est conçu et mis en ligne en quelques jours. Pour une identité visuelle complète (recherche de concepts, déclinaisons, charte), le délai moyen est convenu au préalable lors de notre premier échange et rigoureusement respecté.'
  },
  {
    id: 'faq-2',
    question: 'Comment se passe le règlement d’un projet ?',
    answer: 'La collaboration démarre à la signature du bon de commande avec un acompte de 70% pour réserver le créneau de production et engager les recherches stratégiques. Le solde restant de 30% est réglé à la validation finale, avant la transmission intégrale des fichiers sources et droits d’utilisation.'
  },
  {
    id: 'faq-3',
    question: 'Est-ce que je peux demander des retouches si le résultat ne me convient pas ?',
    answer: 'Absolument. Toutes nos formules intègrent des cycles de révisions. Grâce à la phase de cadrage en amont (où nous validons ensemble vos objectifs et vos préférences), les propositions tombent juste dès le premier jet, et les ajustements nécessaires sont apportés rapidement.'
  },
  {
    id: 'faq-4',
    question: 'Pourquoi passer par Class S plutôt que par un logo généré par IA ou un freelance low-cost ?',
    answer: 'Une IA ou un générateur assemble des formes génériques sans comprendre votre marché local, vos concurrents ni le comportement d’achat de vos clients. Chez Class S, nous concevons une identité stratégique unique, mémorable et pensée pour vendre. Votre logo ne ressemblera à aucun autre sur votre secteur.'
  },
  {
    id: 'faq-5',
    question: 'Je ne sais pas encore exactement ce qu’il me faut, puis-je quand même vous contacter ?',
    answer: 'C’est justement le meilleur moment pour échanger. Choisissez l’option « Je ne sais pas encore » dans le formulaire : nous prendrons un temps d’échange sur WhatsApp pour évaluer vos priorités et vous orienter vers la solution la plus rentable pour votre stade de développement.'
  }
];

export const FaqSection: React.FC = () => {
  // Only one accordion open at a time (exclusive accordion)
  const [activeId, setActiveId] = useState<string | null>('faq-1');

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <section className="py-20 bg-white relative border-t border-violet-imperial/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-violet-imperial" />
            Questions fréquentes
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            Tout ce que vous devez savoir avant de démarrer
          </h2>

          <p className="text-base text-onyx/75 font-body max-w-xl mx-auto">
            Des réponses claires et transparentes pour vous permettre d'avancer en toute confiance.
          </p>
        </div>

        {/* Accordions */}
        <div className="bg-ivoire-violet/60 rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft divide-y divide-violet-imperial/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isItemOpen = activeId === item.id;
            return (
              <div key={item.id} className={idx === 0 ? '' : 'pt-2'}>
                <Accordion
                  title={item.question}
                  isOpen={isItemOpen}
                  onToggle={() => handleToggle(item.id)}
                  id={item.id}
                  className="!border-none !pt-2 !mt-0"
                >
                  <p className="text-sm sm:text-base text-onyx/80 font-body leading-relaxed pl-2 border-l-2 border-violet-imperial/30 py-1">
                    {item.answer}
                  </p>
                </Accordion>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bridge */}
        <div className="text-center pt-2">
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
