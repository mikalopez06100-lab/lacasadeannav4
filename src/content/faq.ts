/**
 * FAQ (brief §7 section 11 + §10). 8 questions minimum.
 * Invisible à l'œil (accordéon fermé) mais présente dans le HTML → indexable Google + LLM.
 * Densifie naturellement les mots-clés géo et les requêtes cibles.
 */

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "Où intervient le studio La Casa de Anna ?",
    answer:
      "Notre bureau et showroom sont à Bluffy (20 chemin du Maltondu), au bord du lac d'Annecy. Nous travaillons dans tout le bassin annécien — Annecy, Annecy-le-Vieux, Talloires, Menthon-Saint-Bernard, Megève — et nous n'avons pas de frontière géographique : projets à distance et déplacements partout en France et à l'international.",
  },
  {
    question: "Combien coûte une consultation ?",
    answer:
      "La consultation dure 3 heures et coûte 790 €, à domicile ou en visio. Vous repartez avec une direction claire, des premiers choix de matières et une estimation budgétaire indicative.",
  },
  {
    question: "Quelle est la différence entre le dossier de conception et le clé-en-main ?",
    answer:
      "Le dossier de conception vous remet un document complet (plans, matières, mobilier, lumière) que vous pilotez ensuite vous-même. Le clé-en-main signifie que le studio prend tout en charge : coordination des artisans et livraison finale.",
  },
  {
    question: "Réalisez-vous du mobilier et des rideaux sur mesure ?",
    answer:
      "Oui. Nous dessinons et faisons fabriquer du mobilier sur mesure (banquettes, bibliothèques, têtes de lit) et nous confectionnons rideaux, voilages et banquettes ajustés à chaque pièce. Ces prestations peuvent être commandées seules ou dans le cadre d'un projet complet.",
  },
  {
    question: "Travaillez-vous sur des projets professionnels ?",
    answer:
      "Oui : hôtels, restaurants, boutiques et bureaux. Nous concevons des lieux qui racontent une marque, avec la même exigence éditoriale que pour les projets résidentiels.",
  },
  {
    question: "Peut-on travailler avec vous à distance ?",
    answer:
      "Tout à fait. Natalia et Coline gèrent une partie des projets à distance, par visio et échanges de documents, et se déplacent sur le chantier quand le projet l'exige. C'est ce qui nous permet d'intervenir bien au-delà de la Haute-Savoie.",
  },
  {
    question: "Combien de temps dure un projet ?",
    answer:
      "Cela dépend de l'ampleur : quelques semaines pour une décoration, plusieurs mois pour une rénovation complète clé-en-main. Nous fixons un calendrier réaliste dès la phase de conception.",
  },
  {
    question: "Comment démarrer un projet avec le studio ?",
    answer:
      "Le plus simple est de nous écrire via le formulaire « Démarrer un projet » ou par e-mail. Nous échangeons sur vos besoins, puis nous proposons la formule la plus adaptée — souvent une première consultation pour poser les bases.",
  },
];
