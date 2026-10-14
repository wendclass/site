export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Combien de temps faut-il pour recevoir mes visuels ou mon identité ?',
    answer:
      'Les délais dépendent de l’envergure du projet : les visuels à l’unité et supports imprimés urgents sont livrés sous 24 heures. Un site web vitrine est conçu et mis en ligne en quelques jours. Pour une identité visuelle complète (recherche de concepts, déclinaisons, charte), le délai moyen est convenu au préalable lors de notre premier échange et rigoureusement respecté.',
  },
  {
    id: 'faq-2',
    question: 'Comment se passe le règlement d’un projet ?',
    answer:
      'La collaboration démarre à la signature du bon de commande avec un acompte de 70% pour réserver le créneau de production et engager les recherches stratégiques. Le solde restant de 30% est réglé à la validation finale, avant la transmission intégrale des fichiers sources et droits d’utilisation.',
  },
  {
    id: 'faq-3',
    question: 'Est-ce que je peux demander des retouches si le résultat ne me convient pas ?',
    answer:
      'Absolument. Toutes nos formules intègrent des cycles de révisions. Grâce à la phase de cadrage en amont (où nous validons ensemble vos objectifs et vos préférences), les propositions tombent juste dès le premier jet, et les ajustements nécessaires sont apportés rapidement.',
  },
  {
    id: 'faq-4',
    question: 'Pourquoi passer par Class S plutôt que par un logo généré par IA ou un freelance low-cost ?',
    answer:
      'Une IA ou un générateur assemble des formes génériques sans comprendre votre marché local, vos concurrents ni le comportement d’achat de vos clients. Chez Class S, nous concevons une identité stratégique unique, mémorable et pensée pour vendre. Votre logo ne ressemblera à aucun autre sur votre secteur.',
  },
  {
    id: 'faq-5',
    question: 'Je ne sais pas encore exactement ce qu’il me faut, puis-je quand même vous contacter ?',
    answer:
      'C’est justement le meilleur moment pour échanger. Choisissez l’option « Je ne sais pas encore » dans le formulaire : nous prendrons un temps d’échange sur WhatsApp pour évaluer vos priorités et vous orienter vers la solution la plus rentable pour votre stade de développement.',
  },
];
