'use strict';

// ─── Configuration centrale du site ────────────────────────────────────────
// Toutes les pages et le serveur lisent ces valeurs.
// Ne jamais écrire ces informations en dur dans d'autres fichiers.

const SITE_URL           = 'https://www.horizonetequilibre.fr';
const CONTACT_EMAIL      = 'contact@horizonetequilibre.fr';
const CONTACT_PHONE      = '06 51 14 07 26';
const CONTACT_PHONE_INTL = '+33651140726';
const CALCOM_USERNAME    = 'horizonetequilibre';

// Passe à true quand le compte Stripe sera validé
const VISIO_BOOKING_ACTIVE = false;

// ─── Grille tarifaire ──────────────────────────────────────────────────────
const SEANCES = {
  cabinet: [
    {
      nom:   'Premier bilan naturopathique',
      duree: '1h30',
      tarif: 80,
      slug:  'bilan-cabinet',
      icon:  '🌱',
      desc:  'Première consultation approfondie. Anamnèse complète, évaluation du terrain et programme personnalisé remis en fin de séance.'
    },
    {
      nom:   'Suivi naturopathique adulte (13 ans et +)',
      duree: '1h',
      tarif: 60,
      slug:  'suivi-cabinet',
      icon:  '🌿',
      desc:  'Séance régulière pour ajuster le programme et accompagner l\'évolution. Compte-rendu remis en fin de séance.'
    },
    {
      nom:   'Suivi naturopathique enfant (jusqu\'à 12 ans)',
      duree: '30 min',
      tarif: 45,
      slug:  'suivi-enfant-cabinet',
      icon:  '🌱',
      desc:  'Séance adaptée à l\'enfant pour suivre l\'évolution et ajuster le programme naturopathique.'
    },
    {
      nom:   'Réflexologie enfant (jusqu\'à 12 ans)',
      duree: '30 min',
      tarif: 40,
      slug:  'reflexologie-enfant',
      icon:  '🌿',
      desc:  'Pression douce adaptée à l\'âge. La technique est choisie en séance selon les besoins et les préférences de l\'enfant.'
    },
    {
      nom:   'Réflexologie ado et adulte (13 ans et +)',
      duree: '1h',
      tarif: 65,
      slug:  'reflexologie-adulte-cabinet',
      icon:  '🤲',
      desc:  'Séance complète. La technique est choisie ensemble : drainage, apaisement, recentrage ou soutien du sommeil.'
    },
    {
      nom:   'Séance combinée adulte (13 ans et +)',
      duree: '1h30',
      tarif: 90,
      slug:  'seance-combinee-adulte-cabinet',
      icon:  '✨',
      desc:  'Échange naturopathique et ajustement du programme, suivi d\'une séance complète de réflexologie. Les deux approches en une rencontre.'
    },
    {
      nom:   'Séance combinée enfant (jusqu\'à 12 ans)',
      duree: '1h',
      tarif: 75,
      slug:  'seance-combinee-enfant-cabinet',
      icon:  '🌱',
      desc:  'Échange naturopathique et séance de réflexologie adaptée à l\'enfant, en une seule consultation.'
    }
  ],
  visio: [
    {
      nom:   'Premier bilan naturopathique',
      duree: '1h30',
      tarif: 80,
      slug:  'bilan-visio',
      icon:  '🌱',
      desc:  'Même contenu qu\'au cabinet, en visioconférence. Règlement en ligne sécurisé au moment de la réservation.'
    },
    {
      nom:   'Suivi naturopathique adulte (13 ans et +)',
      duree: '1h',
      tarif: 60,
      slug:  'suivi-adulte-visio',
      icon:  '🌿',
      desc:  'Séance de suivi en visioconférence. Règlement en ligne sécurisé au moment de la réservation.'
    },
    {
      nom:   'Suivi naturopathique enfant (jusqu\'à 12 ans)',
      duree: '30 min',
      tarif: 45,
      slug:  'suivi-enfant-visio',
      icon:  '🌱',
      desc:  'Séance de suivi enfant en visioconférence. Règlement en ligne sécurisé au moment de la réservation.'
    }
  ]
};

module.exports = {
  SITE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_INTL,
  CALCOM_USERNAME,
  VISIO_BOOKING_ACTIVE,
  SEANCES
};
