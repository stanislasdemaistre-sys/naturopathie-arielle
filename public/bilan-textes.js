// bilan-textes.js — Textes personnalisés du Bilan Horizon Santé
// Structure : BILAN_TEXTES[theme][etat][profil]
// Profils : A (0-5 ans), B1 (6-12 ans), B2 (13-17 ans), C (adulte)
// États : accompagner, soutenir, equilibre
// Placeholders : {p} = prénom, {dP} = élision+prénom (ex: "d'Astrid", "de Hugo")

const BILAN_TEXTES = {

  // ─────────────────────────────────────────────
  // SOMMEIL
  // ─────────────────────────────────────────────
  sommeil: {

    accompagner: {
      A: {
        observation: "Vos réponses montrent que {p} présente des difficultés de sommeil importantes, ce qui peut se traduire par de la fatigue, de l'irritabilité et un impact sur sa croissance.",
        synthese_phrase: "En revanche, le sommeil de {p} montre des signes de perturbation importants pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Chez le nourrisson et le jeune enfant, le sommeil est étroitement lié aux rythmes de vie, à l'alimentation et aux tensions corporelles. Arielle cherchera avec vous ce qui perturbe les nuits de {p} et vous proposera des ajustements doux, notamment grâce à la réflexologie.",
        geste_attente: "Un rituel du soir calme et régulier : lumière tamisée, voix douce, même heure chaque soir."
      },
      B1: {
        observation: "Vos réponses montrent que {p} présente des difficultés de sommeil qui impactent son énergie et sa concentration au quotidien.",
        synthese_phrase: "En revanche, le sommeil de {p} montre des signes de perturbation pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "À cet âge, le sommeil est essentiel pour les apprentissages et la régulation émotionnelle. Arielle cherchera avec {p} ce qui freine sa récupération et lui proposera un accompagnement adapté.",
        geste_attente: "Un coucher à heure régulière, sans écran dans l'heure qui précède, et une chambre bien aérée."
      },
      B2: {
        observation: "Vos réponses montrent que le sommeil de {p} est perturbé ou insuffisant, ce qui peut se traduire par de la fatigue et un manque d'entrain.",
        synthese_phrase: "En revanche, son sommeil montre des signes de perturbation pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "À l'adolescence, le sommeil est souvent la première victime des changements de rythme et des tensions accumulées. Arielle cherchera avec {p} ce qui freine sa récupération et lui proposera des ajustements adaptés à sa réalité du moment.",
        geste_attente: "Un coucher à heure régulière et pas d'écran dans l'heure qui précède."
      },
      C: {
        observation: "Vos réponses montrent que votre sommeil est perturbé ou insuffisant, ce qui peut affecter votre énergie, votre concentration et votre équilibre émotionnel.",
        synthese_phrase: "En revanche, votre sommeil montre des signes de perturbation pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Le sommeil est le premier pilier de la vitalité. Arielle cherchera avec vous ce qui freine votre récupération — rythmes, alimentation, tensions nerveuses — et vous proposera un programme adapté.",
        geste_attente: "Un coucher à heure fixe, sans écran dans l'heure qui précède, et une température fraîche dans la chambre."
      }
    },

    soutenir: {
      A: {
        observation: "Les nuits sont globalement correctes, avec quelques signes de fatigue à surveiller chez {p}.",
        cabinet: "Au cabinet, Arielle cherchera ce qui freine la récupération de {dP}.",
        geste: "Un rituel du soir constant : bain tiède, lumière douce, bercement."
      },
      B1: {
        observation: "Les nuits sont globalement correctes, avec quelques signes de fatigue à surveiller chez {p}.",
        cabinet: "Au cabinet, Arielle cherchera ce qui freine la récupération de {dP}.",
        geste: "Un coucher à heure régulière et pas d'écran dans l'heure qui précède."
      },
      B2: {
        observation: "Les nuits sont globalement correctes, avec quelques signes de fatigue à surveiller.",
        cabinet: "Au cabinet, Arielle cherchera ce qui freine la récupération de {dP}.",
        geste: "Un coucher à heure régulière et pas d'écran dans l'heure qui précède."
      },
      C: {
        observation: "Votre sommeil est globalement correct, avec quelques signes de fatigue à surveiller.",
        cabinet: "Au cabinet, Arielle cherchera avec vous ce qui freine votre récupération.",
        geste: "Un coucher à heure fixe et une routine apaisante dans l'heure qui précède."
      }
    },

    equilibre: {
      A: {
        observation: "Les nuits de {p} semblent globalement bonnes et réparatrices.",
        geste: "Maintenir le rituel du soir et des horaires réguliers."
      },
      B1: {
        observation: "{p} semble bien récupérer la nuit, c'est une belle base.",
        geste: "Maintenir les horaires réguliers et les habitudes du coucher."
      },
      B2: {
        observation: "Le sommeil de {p} semble équilibré et réparateur.",
        geste: "Maintenir les horaires et éviter les écrans trop proches du coucher."
      },
      C: {
        observation: "Votre sommeil semble équilibré et réparateur.",
        geste: "Maintenir les horaires réguliers et votre rituel du soir."
      }
    }
  },

  // ─────────────────────────────────────────────
  // ÉCLAT
  // ─────────────────────────────────────────────
  eclat: {

    accompagner: {
      A: {
        observation: "Vos réponses montrent que {p} présente des signes de surcharge sur la peau ou la digestion qui méritent une attention particulière.",
        synthese_phrase: "En revanche, l'éclat de {p} montre des signes de surcharge pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Chez le jeune enfant, la peau et la digestion sont souvent les premiers signes d'un terrain en déséquilibre. Arielle explorera avec vous l'alimentation, le transit et les éventuelles réactions de {p} pour proposer un accompagnement doux et adapté.",
        geste_attente: "Privilégier des aliments simples, peu transformés, et veiller à une bonne hydratation de {p}."
      },
      B1: {
        observation: "Vos réponses montrent que {p} présente des signes de surcharge — peau, digestion, énergie — qui méritent une attention particulière.",
        synthese_phrase: "En revanche, l'éclat de {p} montre des signes de surcharge pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Les émonctoires — la peau, les intestins, le foie — sont en première ligne chez l'enfant. Arielle identifiera les facteurs de déséquilibre et proposera des ajustements alimentaires et un accompagnement naturopathique adapté à {p}.",
        geste_attente: "Favoriser les légumes à chaque repas et boire suffisamment d'eau tout au long de la journée."
      },
      B2: {
        observation: "Vos réponses montrent que la peau ou la digestion de {p} présentent des signes de surcharge qui méritent une attention particulière.",
        synthese_phrase: "En revanche, son éclat montre des signes de surcharge pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "À l'adolescence, la peau et la digestion parlent souvent d'un terrain qui a besoin de soutien. Arielle cherchera avec {p} les facteurs alimentaires et de mode de vie à ajuster, et lui proposera un accompagnement adapté.",
        geste_attente: "Boire suffisamment d'eau tout au long de la journée et réduire les aliments ultra-transformés."
      },
      C: {
        observation: "Vos réponses montrent que votre peau, votre digestion ou votre vitalité générale présentent des signes de surcharge qui méritent une attention particulière.",
        synthese_phrase: "En revanche, votre éclat montre des signes de surcharge pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Les émonctoires — foie, peau, intestins — sont en première ligne quand le terrain est surchargé. Arielle cherchera à identifier les facteurs de déséquilibre et vous proposera un accompagnement naturopathique ciblé.",
        geste_attente: "Boire suffisamment d'eau tout au long de la journée et favoriser les légumes à chaque repas."
      }
    },

    soutenir: {
      A: {
        observation: "La peau et la digestion de {p} fonctionnent globalement bien, avec quelques signes à surveiller.",
        cabinet: "Au cabinet, Arielle affinera l'observation de l'éclat et du transit de {dP}.",
        geste: "Privilégier des repas variés, sans sucres en excès, et bien hydrater {p}."
      },
      B1: {
        observation: "La peau et la digestion de {p} sont globalement correctes, avec quelques petits signes à surveiller.",
        cabinet: "Au cabinet, Arielle cherchera les petits déséquilibres alimentaires ou digestifs qui freinent l'éclat de {dP}.",
        geste: "Garder du temps au grand air et une alimentation variée avec beaucoup de légumes."
      },
      B2: {
        observation: "La peau et la digestion semblent fonctionner correctement, avec quelques signes à surveiller.",
        cabinet: "Au cabinet, Arielle cherchera ce qui freine l'éclat de {dP}.",
        geste: "Garder du temps au grand air et une alimentation variée."
      },
      C: {
        observation: "Votre éclat est globalement présent, avec quelques signes de légère surcharge à surveiller.",
        cabinet: "Au cabinet, Arielle cherchera les petits facteurs qui ternissent votre éclat.",
        geste: "Boire suffisamment d'eau et privilégier les légumes à chaque repas."
      }
    },

    equilibre: {
      A: {
        observation: "La peau et la digestion de {p} semblent en bon équilibre.",
        geste: "Continuer à boire de l'eau et à proposer une alimentation variée."
      },
      B1: {
        observation: "La peau et la digestion de {p} semblent en bon équilibre.",
        geste: "Garder du temps au grand air et une alimentation variée."
      },
      B2: {
        observation: "La peau et la digestion semblent en bon équilibre.",
        geste: "Garder du temps au grand air et une alimentation variée."
      },
      C: {
        observation: "Votre éclat et votre digestion semblent en bon équilibre.",
        geste: "Maintenir une alimentation variée et riche en légumes."
      }
    }
  },

  // ─────────────────────────────────────────────
  // SÉRÉNITÉ
  // ─────────────────────────────────────────────
  serenite: {

    accompagner: {
      A: {
        observation: "Vos réponses montrent que {p} traverse une période de tension ou d'agitation qui peut se ressentir dans son corps ou dans son comportement.",
        synthese_phrase: "En revanche, la sérénité de {p} montre des signes de tension pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Chez le jeune enfant, les tensions s'expriment souvent par le corps : agitation, pleurs, difficultés de séparation. Arielle prendra le temps de comprendre ce qui se passe pour {p}, et proposera un accompagnement en réflexologie et des conseils adaptés à son âge.",
        geste_attente: "Moments de calme partagés chaque jour : lecture, chansons, contact physique doux."
      },
      B1: {
        observation: "Vos réponses montrent que {p} traverse une période de tension ou d'anxiété, qui peut se ressentir dans son corps comme dans ses comportements.",
        synthese_phrase: "En revanche, la sérénité de {p} montre des signes de tension pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "À cet âge, les tensions ont souvent plusieurs sources : rythme scolaire, vie sociale, émotions qui cherchent leur chemin. Arielle prendra le temps de démêler tout cela avec {p}, et lui proposera un accompagnement en réflexologie et en fleurs de Bach adapté à sa personnalité.",
        geste_attente: "Un petit moment calme chaque soir pour parler de sa journée sans pression."
      },
      B2: {
        observation: "Vos réponses montrent que {p} traverse en ce moment une période de tension ou d'inquiétude, qui peut se ressentir dans son corps comme dans son humeur.",
        synthese_phrase: "En revanche, sa sérénité montre des signes de tension ou d'inquiétude, pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Chez un adolescent, les tensions ont souvent plusieurs sources mêlées : rythme de vie, sommeil, alimentation, émotions gardées pour soi. Arielle prendra le temps de les démêler avec {p}, puis de l'aider à relâcher ces tensions grâce à la réflexologie et à un accompagnement adapté à sa personnalité.",
        geste_attente: "Un petit moment calme chaque soir pour parler de sa journée."
      },
      C: {
        observation: "Vos réponses montrent que votre système nerveux est sous tension en ce moment, ce qui peut se ressentir dans votre corps et vos émotions.",
        synthese_phrase: "En revanche, votre sérénité montre des signes qui invitent à un rendez-vous avec Arielle.",
        consultation: "Le système nerveux a besoin d'être écouté avant d'être soutenu. Arielle prendra le temps de comprendre d'où viennent vos tensions et vous proposera un accompagnement en réflexologie et en fleurs de Bach, adapté à votre profil émotionnel.",
        geste_attente: "Cinq minutes de respiration profonde le matin avant de commencer la journée."
      }
    },

    soutenir: {
      A: {
        observation: "{p} est globalement serein, avec quelques moments de tension ou d'agitation à surveiller.",
        cabinet: "Au cabinet, Arielle aidera {p} à relâcher les tensions accumulées grâce à la réflexologie.",
        geste: "Des moments de calme réguliers et un environnement prévisible pour {p}."
      },
      B1: {
        observation: "{p} est globalement serein, avec quelques pics d'anxiété ou de tension à surveiller.",
        cabinet: "Au cabinet, un travail doux en réflexologie et fleurs de Bach aide {p} à mieux gérer ses émotions.",
        geste: "Un espace pour parler librement de ses inquiétudes chaque soir."
      },
      B2: {
        observation: "{p} est globalement serein, avec quelques signes de tension qui méritent attention.",
        cabinet: "Au cabinet, Arielle aidera {p} à relâcher les tensions avec la réflexologie et les fleurs de Bach.",
        geste: "Un espace pour parler sans jugement de ce qui le ou la préoccupe."
      },
      C: {
        observation: "Votre sérénité est globalement présente, avec quelques tensions ponctuelles à surveiller.",
        cabinet: "Au cabinet, Arielle vous aidera à relâcher les tensions avec la réflexologie et les fleurs de Bach.",
        geste: "Quelques minutes de marche ou de respiration consciente en milieu de journée."
      }
    },

    equilibre: {
      A: {
        observation: "{p} semble serein et équilibré sur le plan émotionnel.",
        geste: "Maintenir des routines stables et rassurantes."
      },
      B1: {
        observation: "{p} semble gérer ses émotions et le stress de manière équilibrée.",
        geste: "Maintenir les espaces de dialogue et les activités qui lui font du bien."
      },
      B2: {
        observation: "{p} semble gérer ses émotions et le stress de manière équilibrée.",
        geste: "Maintenir les activités ressourcantes et les espaces de parole."
      },
      C: {
        observation: "Votre sérénité semble bien ancrée et votre système nerveux paraît équilibré.",
        geste: "Maintenir vos pratiques ressourcantes au quotidien."
      }
    }
  },

  // ─────────────────────────────────────────────
  // IMMUNITÉ
  // ─────────────────────────────────────────────
  immunite: {

    accompagner: {
      A: {
        observation: "Vos réponses montrent que {p} présente un terrain immunitaire fragilisé, avec des infections fréquentes ou une récupération lente.",
        synthese_phrase: "En revanche, l'immunité de {p} montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Un terrain immunitaire fragile chez le jeune enfant peut avoir plusieurs origines : microbiote, alimentation, stress. Arielle cherchera avec vous les facteurs en jeu et proposera un accompagnement naturel pour renforcer les défenses de {p}.",
        geste_attente: "Veiller à une bonne hydratation et à des repas réguliers, riches en légumes et en protéines."
      },
      B1: {
        observation: "Vos réponses montrent que {p} présente un terrain immunitaire fragile, ce qui se traduit par des infections répétées ou une récupération difficile.",
        synthese_phrase: "En revanche, l'immunité de {p} montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "La fragilité immunitaire chez l'enfant peut toucher le microbiote, l'alimentation ou les rythmes de vie. Arielle cherchera les déséquilibres et proposera à {p} et à sa famille un programme naturel et adapté.",
        geste_attente: "Privilégier une alimentation variée, riche en fruits et légumes, et limiter le sucre raffiné."
      },
      B2: {
        observation: "Vos réponses montrent que les défenses de {p} sont fragilisées, avec des infections fréquentes ou une fatigue persistante.",
        synthese_phrase: "En revanche, son immunité montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "À l'adolescence, le terrain immunitaire peut être fragilisé par les changements hormonaux, le manque de sommeil ou une alimentation déséquilibrée. Arielle cherchera les facteurs en jeu avec {p} et lui proposera un accompagnement naturel.",
        geste_attente: "Boire de l'eau tout au long de la journée et privilégier des repas équilibrés."
      },
      C: {
        observation: "Vos réponses montrent que votre terrain immunitaire est fragilisé, avec des infections fréquentes ou une récupération difficile.",
        synthese_phrase: "En revanche, votre immunité montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Le terrain immunitaire est étroitement lié au microbiote, à l'alimentation et à la gestion du stress. Arielle cherchera avec vous les facteurs de déséquilibre et vous proposera un programme de renforcement naturel.",
        geste_attente: "Privilégier une alimentation variée, riche en fibres et en légumes, et veiller à bien dormir."
      }
    },

    soutenir: {
      A: {
        observation: "Le terrain immunitaire de {p} est globalement correct, avec quelques signes de fragilité à surveiller.",
        cabinet: "Au cabinet, Arielle évaluera le terrain de {dP} et proposera un soutien naturel préventif.",
        geste: "Veiller à une alimentation variée et à une bonne hydratation."
      },
      B1: {
        observation: "{p} a des défenses globalement correctes, avec quelques signes de fragilité à surveiller.",
        cabinet: "Au cabinet, Arielle proposera des pistes naturopathiques pour renforcer le terrain de {dP}.",
        geste: "Limiter le sucre raffiné et privilégier les fruits et légumes de saison."
      },
      B2: {
        observation: "Les défenses de {p} sont globalement correctes, avec quelques fragilités à surveiller.",
        cabinet: "Au cabinet, Arielle aidera à renforcer le terrain de {dP} de manière préventive.",
        geste: "Continuer à boire de l'eau tout au long de la journée."
      },
      C: {
        observation: "Votre immunité est globalement présente, avec quelques fragilités ponctuelles à surveiller.",
        cabinet: "Au cabinet, Arielle vous proposera des pistes pour renforcer votre terrain de manière naturelle.",
        geste: "Privilégier les légumes de saison, les légumineuses et une bonne hydratation."
      }
    },

    equilibre: {
      A: {
        observation: "Le terrain immunitaire de {p} semble solide.",
        geste: "Continuer à proposer une alimentation variée et à bien hydrater {p}."
      },
      B1: {
        observation: "Les défenses naturelles de {p} semblent solides.",
        geste: "Continuer à boire de l'eau tout au long de la journée."
      },
      B2: {
        observation: "Les défenses naturelles semblent solides.",
        geste: "Continuer à boire de l'eau tout au long de la journée."
      },
      C: {
        observation: "Votre terrain immunitaire semble solide et résilient.",
        geste: "Maintenir une alimentation variée et une bonne hydratation."
      }
    }
  },

  // ─────────────────────────────────────────────
  // CONFIANCE
  // ─────────────────────────────────────────────
  confiance: {

    accompagner: {
      A: {
        observation: "Vos réponses montrent que {p} présente des difficultés d'adaptation ou de confiance qui méritent une attention particulière.",
        synthese_phrase: "En revanche, la confiance de {p} montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "Chez le jeune enfant, la confiance en soi se construit dans la sécurité et les interactions. Arielle vous accompagnera pour comprendre ce qui bloque {p} et vous proposera des pistes douces pour l'aider à s'épanouir.",
        geste_attente: "Encourager chaque petit effort de {p} avec des mots simples et bienveillants."
      },
      B1: {
        observation: "Vos réponses montrent que {p} présente des difficultés de confiance en soi qui impactent son quotidien.",
        synthese_phrase: "En revanche, la confiance de {p} montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "La confiance en soi à cet âge se construit dans les échanges et les petites réussites. Arielle prendra le temps d'écouter {p} et vous proposera un accompagnement doux, notamment avec les fleurs de Bach.",
        geste_attente: "Souligner chaque jour un effort de {p}, plutôt qu'un résultat."
      },
      B2: {
        observation: "Vos réponses montrent que {p} traverse une période de doute ou de manque de confiance qui peut impacter son quotidien.",
        synthese_phrase: "En revanche, sa confiance montre des signes de fragilité pour lesquels un rendez-vous avec Arielle est recommandé.",
        consultation: "À l'adolescence, la confiance en soi est souvent fragile et plurielle : corps, regard des autres, avenir. Arielle prendra le temps d'écouter {p}, d'identifier les zones de blocage, et lui proposera un accompagnement adapté.",
        geste_attente: "Remarquer chaque jour un effort de {p}, plutôt qu'un résultat."
      },
      C: {
        observation: "Vos réponses montrent que votre confiance en vous traverse une période difficile, ce qui peut impacter vos relations et votre épanouissement.",
        synthese_phrase: "En revanche, votre confiance montre des signes qui invitent à un rendez-vous avec Arielle.",
        consultation: "La confiance en soi est souvent liée à des mémoires émotionnelles et à des périodes de transition. Arielle vous écoutera sans jugement et vous proposera un accompagnement en fleurs de Bach et en réflexologie, adapté à votre profil.",
        geste_attente: "Écrire chaque soir une chose dont vous êtes fier ou fière de la journée."
      }
    },

    soutenir: {
      A: {
        observation: "{p} a de bonnes ressources, qui gagnent à être encouragées.",
        cabinet: "Au cabinet, un accompagnement doux aide {p} à s'épanouir à son rythme.",
        geste: "Encourager {p} dans ses explorations, même les petites."
      },
      B1: {
        observation: "{p} a de bonnes ressources, qui gagnent à être encouragées.",
        cabinet: "Au cabinet, un accompagnement doux aide {p} à prendre appui sur ses forces.",
        geste: "Remarquer chaque jour un effort de {p}, plutôt qu'un résultat."
      },
      B2: {
        observation: "{p} a de bonnes ressources, qui gagnent à être encouragées.",
        cabinet: "Au cabinet, un accompagnement doux aide {p} à prendre appui sur ses forces.",
        geste: "Remarquer chaque jour un effort que {p} a fait, plutôt qu'un résultat."
      },
      C: {
        observation: "Vous avez de bonnes ressources internes, qui gagnent à être encouragées.",
        cabinet: "Au cabinet, Arielle vous aiderait à reconnaître et à consolider vos appuis.",
        geste: "Identifier chaque jour une chose que vous avez bien faite ou bien gérée."
      }
    },

    equilibre: {
      A: {
        observation: "{p} semble s'épanouir avec confiance dans ses explorations et ses interactions.",
        geste: "Continuer à encourager {p} dans ses initiatives."
      },
      B1: {
        observation: "{p} semble avoir une bonne confiance en soi et bien s'intégrer dans son environnement.",
        geste: "Continuer à valoriser ses efforts et ses curiosités."
      },
      B2: {
        observation: "{p} semble avoir une bonne confiance en ses capacités.",
        geste: "Continuer à encourager les initiatives et les projets de {p}."
      },
      C: {
        observation: "Vous semblez ancré et confiant dans votre rapport à vous-même et aux autres.",
        geste: "Maintenir les pratiques et les relations qui nourrissent votre estime de vous."
      }
    }
  },

  // ─────────────────────────────────────────────
  // ENCADRÉS "Pourquoi un rendez-vous"
  // ─────────────────────────────────────────────
  encadre: {
    A: {
      titre: "Pourquoi un rendez-vous pour {p} ?",
      intro: "Ce bilan est une première photographie. Seul un échange permet de comprendre ce qui se passe vraiment pour {p}. Lors du premier bilan de naturopathie (1h30), Arielle :",
      puce1: "vous écoute, pour comprendre l'origine des déséquilibres observés ;",
      puce2: "regarde l'ensemble de l'équilibre de {p} : sommeil, alimentation, émotions, rythme de vie ;",
      puce3: "vous propose un accompagnement sur mesure, simple à mettre en place à la maison."
    },
    B1: {
      titre: "Pourquoi un rendez-vous pour {p} ?",
      intro: "Ce bilan est une première photographie. Seul un échange permet de comprendre ce qui se passe vraiment pour {p}. Lors du premier bilan de naturopathie (1h30), Arielle :",
      puce1: "écoute {p} et vous, pour comprendre l'origine de ses difficultés ;",
      puce2: "regarde l'ensemble de son équilibre : sommeil, alimentation, émotions, rythme de vie ;",
      puce3: "vous propose un accompagnement sur mesure, simple à mettre en place à la maison."
    },
    B2: {
      titre: "Pourquoi un rendez-vous pour {p} ?",
      intro: "Ce bilan est une première photographie. Seul un échange permet de comprendre ce qui se passe vraiment pour {p}. Lors du premier bilan de naturopathie (1h30), Arielle :",
      puce1: "écoute {p} et vous, pour comprendre l'origine de ses tensions ;",
      puce2: "regarde l'ensemble de son équilibre : sommeil, alimentation, émotions, rythme de vie ;",
      puce3: "vous propose un accompagnement sur mesure, simple à mettre en place à la maison."
    },
    C: {
      titre: "Pourquoi un rendez-vous ?",
      intro: "Ce bilan est une première photographie. Seul un échange permet de comprendre ce qui se passe vraiment. Lors du premier bilan de naturopathie (1h30), Arielle :",
      puce1: "vous écoute, pour comprendre l'origine de vos tensions ;",
      puce2: "regarde l'ensemble de votre équilibre : sommeil, alimentation, émotions, rythme de vie ;",
      puce3: "vous propose un accompagnement sur mesure, simple à mettre en place chez vous."
    },
    equilibre: {
      titre_enfant: "Un bilan de prévention pour {p}",
      titre_adulte: "Un bilan de prévention",
      intro: "Ce bilan révèle un bel équilibre global. Pour l'entretenir et anticiper, un bilan de prévention avec Arielle est une belle façon d'aller plus loin. Lors du premier bilan de naturopathie (1h30), Arielle :",
      puce1_enfant: "fait un tour complet de l'hygiène de vie de {p} ;",
      puce1_adulte: "fait un tour complet de votre hygiène de vie ;",
      puce2: "identifie les points de vigilance avant qu'ils ne deviennent des déséquilibres ;",
      puce3: "vous propose un programme de vitalité personnalisé pour les mois à venir."
    }
  }

};

if (typeof module !== 'undefined') module.exports = BILAN_TEXTES;
