# Refonte du site Horizon & Équilibre — Prompt Claude Code

> **Comment utiliser ce fichier**
> Place-le à la racine du dépôt et ouvre Claude Code dessus.
> Demande-lui de traiter **un lot à la fois**, dans l'ordre, en validant chaque lot avant de passer au suivant.
> Les blocs marqués `⚠️ À COMPLÉTER` ne doivent jamais être inventés : laisse le placeholder visible.

---

## LOT 0 — Contexte et règles permanentes

### Le projet

Site vitrine de **Horizon & Équilibre**, cabinet d'Arielle de Maistre, praticienne en naturopathie et réflexologie à Sainte-Consorce (69280), spécialisée dans l'accompagnement des bébés, enfants, adolescents et jeunes adultes.

Stack existante : Next.js, déployé sur Railway (URL provisoire).
Charte : Bleu Pétrole `#1B4D5C`, Vert Sauge `#8FA98B`, Doré `#C4A265`. Typographies Cormorant Garamond + Outfit.

### Périmètre de cette refonte

**Dans le périmètre** : le fond (contenus, vocabulaire, conformité rédactionnelle, refonte du questionnaire) et la forme (structure des pages, cohérence, ergonomie).

Arielle accompagne **tous les âges, du nourrisson à l'adulte**, avec une spécialité sur l'enfance et l'adolescence. Le site actuel affirme l'inverse : il annonce « de 0 à 30 ans » et s'intitule « Naturopathie Enfant & Adolescent ». Le LOT 10 corrige ce positionnement, et cette règle doit guider chaque reformulation dans tous les autres lots.

**Hors périmètre pour l'instant** — ne rien construire sur ces sujets, ne pas créer de pages vides :
- hébergement et nom de domaine définitifs
- module de prise de rendez-vous en ligne
- mentions légales, politique de confidentialité, CGV (en cours de rédaction côté client)
- paiement en ligne (prévu ultérieurement, uniquement pour les visios)

Le lien « Mentions légales » du pied de page renvoie aujourd'hui une **404**. Tant que la page n'existe pas, remplace le lien par un `<span>` non cliquable ou retire-le, plutôt que de laisser un lien mort sur toutes les pages.

### Cinq règles qui s'appliquent à TOUT le site, en permanence

1. **Aucun nom de produit, de plante, d'huile essentielle, de complément ou d'élixir** ne doit apparaître nulle part sur le site public. Voir LOT 3.
2. **Aucun nom de maladie, de diagnostic ou de trouble médical.** On décrit des vécus et des manifestations, jamais des pathologies. Voir LOT 2.
3. **Aucun verbe d'acte médical** : traiter, soigner, guérir, prescrire, diagnostiquer, remède, patient, ordonnance, posologie. Voir le glossaire du LOT 2.
4. **Aucune affirmation absolue** : « sans contre-indication », « compatible avec tout traitement », « efficace », « garanti », « résultats ». Formuler en « peut contribuer à », « vise à », « accompagne ».
5. **Aucune formule qui oppose la naturopathie à la médecine conventionnelle** ou qui suggère de la retarder, de l'éviter ou de s'en passer.

---

## LOT 1 — Suppression complète de la kinésiologie

La kinésiologie ne fait pas partie de l'offre actuelle. Elle sera réintroduite bien plus tard. **Supprimer toute trace**, sans laisser de page orpheline ni de lien mort.

Occurrences repérées à traiter :

| Emplacement | Ce qu'il y a | Action |
|---|---|---|
| Accueil — bandeau haut | « Naturopathie · Réflexologie » | Déjà correct, vérifier |
| Accueil — section « Trois approches » | Titre annonce 3, seulement 2 cartes rendues | Retitrer en **« Deux approches »**, garder les 2 cartes |
| Accueil — bloc À propos | Carte « Kinésiologie — Écouter le corps, libérer les émotions enfouies » | Supprimer la carte, passer le bloc de 3 à 2 colonnes |
| Page Guides — pied de page | « · Kinésiologue » dans la ligne de copyright | Supprimer |
| Page Publications (LOT 7) — guide Émotions | « Techniques de régulation nerveuse issues de la kinésiologie » | Supprimer la ligne |
| Tout le code | Variables, constantes, routes, clés i18n, données mockées | `grep -ri "kinesio"` et nettoyer |

Vérification de fin de lot : `grep -ri "kinésio\|kinesio" .` ne doit retourner aucun résultat dans les sources du site public.

---

## LOT 2 — Vocabulaire et conformité rédactionnelle

C'est le lot le plus important. Le site emploie aujourd'hui un vocabulaire médical qui expose Arielle au regard de l'article L.4161-1 du Code de la santé publique (exercice illégal de la médecine), d'autant plus qu'elle s'adresse à un public mineur.

### 2.1 — Glossaire de substitution, à appliquer partout

| À remplacer | Par |
|---|---|
| patient / patiente | personne accompagnée, client, votre enfant |
| traiter, soigner | accompagner, soutenir |
| guérir, guérison | retrouver un équilibre, mieux-être |
| médecine de terrain | approche de terrain |
| diagnostic, diagnostiquer | (supprimer — aucune substitution) |
| prescrire, prescrit, prescription | proposer, conseiller, suggérer |
| remède | (supprimer) |
| posologie | (supprimer) |
| thérapeute | praticienne en naturopathie et réflexologie |
| soin (comme acte) | séance, accompagnement |
| pathologie | situation, besoin |
| symptôme | manifestation, ce que le corps exprime |
| protocole | programme d'hygiène de vie, plan d'accompagnement |
| efficacité, efficace | (supprimer ou reformuler en « peut contribuer à ») |

### 2.2 — Noms de maladies à supprimer et à reformuler

Ces termes apparaissent actuellement sur les pages Accueil, À propos, Méthode et Guides. **Aucun ne doit subsister.**

À supprimer : TDAH, HPI, endométriose, plagiocéphalie, torticolis, eczéma, sinusite, otites, angines, rhinites, gastros, reflux, coliques, migraine, céphalée, burnout, stress post-traumatique, dysbiose, énurésie, acné (comme entité clinique), dérèglement hormonal, déficit immunitaire, fatigue chronique, anxiété, hypersensibilité, troubles du sommeil, troubles digestifs, hyperactivité.

Méthode de reformulation : on passe du nom clinique à la **description du vécu quotidien**.

Exemples de transformation à appliquer :

- « Coliques, reflux, troubles digestifs du nourrisson » → « Un ventre qui semble inconfortable, des pleurs difficiles à apaiser »
- « Immunité fragilisée, infections récurrentes » → « Un enfant qui semble fatigué à chaque changement de saison »
- « Acné et problèmes de peau hormonaux » → « Une peau qui change et qui inquiète à l'adolescence »
- « Stress des examens et blocages cognitifs » → « Les périodes d'examens, la pression scolaire, la difficulté à se concentrer »
- « Hyperactivité, difficultés de concentration (TDAH, HPI) » → « Une agitation difficile à canaliser, un besoin de retrouver du calme »
- « Burnout ou prévention du burnout » → « Une accélération professionnelle qui pèse, un besoin de souffler »
- « Troubles du sommeil et cauchemars » → « Des nuits agitées, des endormissements difficiles »
- « Anxiété de séparation et peurs » → « Les séparations qui coûtent, les peurs du soir »

Applique la même logique à toutes les listes des pages Accueil, À propos et Méthode.

### 2.3 — Phrases à supprimer intégralement

Ces formulations sont les plus exposées du site. Elles ne doivent pas être reformulées : elles doivent **disparaître**.

1. Page Accueil — **« pharmacienne de vocation »**. Arielle n'est pas pharmacienne : c'était un projet professionnel, pas un diplôme. Cette mention expose à l'usurpation de titre (art. L.4223-1 CSP). Remplacer la phrase d'accroche par : *« Ingénieure chimiste de formation, maman de trois enfants. »*
2. Page À propos — *« la naturopathie peut corriger bien des déséquilibres avant d'avoir recours à la médecine allopathique »*
3. Page À propos, citation encadrée — *« Ma conviction profonde : la prévention par la naturopathie avant la médecine allopathique. Le corps envoie des signaux d'alerte que nous pouvons apprendre à corriger. »*
4. Page Guides — *« agir à la source — sans sérum miracle ni antibiotiques »*
5. Page Méthode, réflexologie — *« une approche douce, sans contre-indication »*
6. Page Méthode, fleurs de Bach — *« Ils n'ont pas de contre-indications et sont compatibles avec tout traitement, y compris allopathique »*
7. Page Méthode, réflexologie crânienne — *« Elle s'inspire de l'ostéopathie crânio-sacrée et travaille sur les rythmes subtils du liquide cérébrospinal »*. L'ostéopathie est un titre protégé, et la référence au liquide cérébrospinal est une allégation physiologique non fondée.
8. Page Méthode, titre — *« Traiter la cause, pas le symptôme »* → remplacer par **« Comprendre le terrain, pas seulement ce qui se voit »** (et corriger les deux autres occurrences de cette formule sur Accueil et À propos).
9. Citation de Bach *« Elles élèvent nos vibrations et ouvrent la voie à la guérison »* → supprimer de la mise en exergue. Si la citation est conservée, la reléguer en note historique attribuée, en petits caractères.

### 2.4 — Titres et qualifications à corriger

| Actuel | Corrigé |
|---|---|
| « Réflexologue QUALIOPI » (pied de page de 3 pages + page À propos) | **« Formée en réflexologie globale à Mélodie des Sens, organisme de formation certifié Qualiopi »** — Qualiopi certifie les organismes de formation, jamais les praticiens. La mention actuelle est un détournement. |
| « Certification agréée par le Conseil de l'Europe et l'UNESCO (Fédération Européenne des Écoles) » | **« Certification délivrée par la FEDE — Fédération Européenne des Écoles »** — sans référence au Conseil de l'Europe ni à l'UNESCO. |
| « Naturopathe certifiée FEDE » | Conserver, c'est exact. |
| « thérapeute en conscience », « Accompagnatrice du vivant » | **« Praticienne en naturopathie et réflexologie »** |
| « Le corps sait guérir, il suffit de lui en donner les moyens » (citation de marque, présente 2 fois) | **« Le corps possède des ressources ; mon rôle est de l'aider à les mobiliser. »** |

### 2.5 — Bloc d'avertissement obligatoire

Créer un composant `<AvertissementSante />` et l'afficher **en bas de contenu** sur : Accueil, À propos, Méthode, Tarifs, Bilan Santé, Publications.

Texte exact :

> **Information importante**
> La naturopathie et la réflexologie sont des pratiques de bien-être et de prévention. Elles ne constituent ni un diagnostic, ni un traitement médical, et ne se substituent en aucun cas à un avis, un suivi ou un traitement prescrit par un médecin.
> Arielle de Maistre n'est pas médecin. Elle n'interrompt, ne modifie et ne remplace aucun traitement en cours.
> En cas de manifestation aiguë ou persistante chez votre enfant, consultez votre médecin traitant ou votre pédiatre.

Style : fond Vert Sauge très désaturé, texte Bleu Pétrole, taille légèrement réduite, bordure gauche Doré. Doit rester lisible, pas noyé.

Ajouter également une version courte d'une ligne **dans l'écran de résultat du Bilan Santé**, avant le bouton d'appel à l'action.

---

## LOT 3 — Suppression de toute référence produit (prévention de l'automédication)

**Règle** : aucun nom de substance, de plante, d'huile essentielle, de complément, de fleur de Bach ni de marque ne doit apparaître sur le site public. Le visiteur ne doit repartir avec aucun élément permettant de s'auto-administrer quoi que ce soit.

Ce point est particulièrement critique ici : le site cite aujourd'hui le millepertuis pour l'anxiété alors qu'il s'agit d'un inducteur enzymatique majeur, notamment avec la contraception orale — donc précisément le public adolescentes visé. Il annonce aussi l'aromathérapie « en usage interne » pour un public incluant les nourrissons.

### 3.1 — Accueil, section « Votre enfant se reconnaît ici ? »

Les 9 vignettes associent aujourd'hui un motif à un remède (« Anxiété & Peurs → Mélisse · Millepertuis », « Acné → Pensée sauvage · HE Tea Tree », etc.).

**Supprimer la ligne de remède de chaque vignette.** Les remplacer par une phrase de vécu, en appliquant aussi le LOT 2 sur les intitulés.

Nouvelle structure d'une vignette : `icône` + `titre reformulé` + `une ligne de vécu`.

Exemple : `🌙` + **« Des nuits difficiles »** + *« Endormissements longs, réveils fréquents, fatigue au réveil »*.

### 3.2 — Page Méthode, carte « Aromathérapie »

Supprimer la mention « en usage externe ou interne ». Réécrire la carte selon le LOT 5.

### 3.3 — Page Méthode, carte « Oligothérapie »

Supprimer l'énumération « zinc, magnésium, sélénium, fer… ». Décrire la famille d'outils sans nommer les éléments.

### 3.4 — Page Guides / Publications

Supprimer de tous les sommaires : « zinc, bardane, chardon-marie, probiotiques », « zinc, vitamine D, oméga-3 », « les 7 huiles essentielles indispensables », « les 10 plantes à avoir chez soi », « les 12 fleurs de Bach essentielles », « plantes adaptogènes et immunostimulantes : posologies et durées de cure », « plantes et compléments sûrs pour l'enfant : dosages et formes adaptés ».

### 3.5 — Fleurs de Bach

Les fleurs de Bach **restent** une approche proposée : elles sont intégrées à la naturopathie (LOT 5). En revanche, ne jamais nommer un élixir individuel (Larch, Mimulus, Rescue…) ni donner de mode d'emploi (« 4 fois par jour, quelques gouttes »). On explique le principe et le cadre, pas l'usage.

### Vérification de fin de lot

`grep -riE "tea tree|millepertuis|mélisse|passiflore|ashwagandha|échinacée|larch|mimulus|rescue|bardane|chardon|pensée sauvage|laurier|fenouil|camomille|figuier|oméga|probiotique|zinc|magnésium|sélénium|vitamine" .`
→ aucun résultat dans les sources du site public.

---

## LOT 4 — Suppression complète de l'Oligoscan

L'Oligoscan sort entièrement de l'offre publique. Il est aujourd'hui cité sur l'Accueil, dans le Bilan, dans les pieds de page, et dans la logique de recommandation du questionnaire — sans jamais avoir de page ni de tarif.

À traiter :

1. **Accueil, bloc Bilan Horizon Santé** — supprimer « Les résultats visuels guident ensuite vers un bilan Oligoscan pour affiner le conseil », ainsi que les puces « Identification des carences minérales potentielles » et « Suggestion de bilan Oligoscan si pertinent ».
2. **Pieds de page** — supprimer l'entrée « Bilan Oligoscan » de la colonne Services.
3. **Moteur du questionnaire** — la logique actuelle oriente les pétales *Éclat* et *Immunité* vers une recommandation Oligoscan. La remplacer intégralement : **tous** les pétales en alerte orientent désormais vers un premier bilan naturopathie au cabinet. Un seul appel à l'action, unique, en fin de questionnaire.
4. **Texte de conclusion du questionnaire** — retirer toute mention de « carences minérales », « équilibre minéral », « métaux lourds », « analyse minérale ». Remplacer par : *« Un premier échange au cabinet permettrait de mieux comprendre d'où vient ce déséquilibre. »*
5. `grep -ri "oligoscan\|oligo-scan\|métaux lourds\|carence minérale"` → aucun résultat.

> Note : le CRM interne (Carnet de Cheminement) est hors périmètre de ce lot. N'y touche pas.

---

## LOT 5 — Refonte de la page Méthode

C'est la page la plus stratégique pour la conversion : c'est là que le parent comprend ce qu'Arielle fait réellement. Elle est aujourd'hui incohérente (le titre annonce « Cinq approches », trois onglets s'affichent, un bloc parle de « Six approches », la conclusion dit « Ces 3 approches ») et les techniques de réflexologie sont décrites sans qu'on comprenne leurs apports respectifs.

### 5.1 — Nouvelle architecture : DEUX piliers

```
La Méthode Horizon & Équilibre
└── Sous-titre : « Deux approches complémentaires, une même lecture du terrain »

PILIER 1 — La naturopathie
    ├── Le principe du terrain
    ├── L'hygiène de vie et l'alimentation
    ├── La micronutrition
    ├── Les plantes (phytothérapie, gemmothérapie)
    ├── L'aromathérapie          ← à développer, cf. 5.2
    ├── Les fleurs de Bach       ← à développer, cf. 5.3
    └── Comment se passe un accompagnement (3 étapes)

PILIER 2 — La réflexologie
    ├── Le principe des zones réflexes
    ├── Réflexologie plantaire    ┐
    ├── Réflexologie palmaire     │ ← chacune détaillée, cf. 5.4
    ├── Réflexologie faciale      │
    └── Réflexologie crânienne    ┘

Bloc final — Comment les deux se combinent
AvertissementSante
```

**Supprimer l'onglet « Fleurs de Bach » de premier niveau** : les fleurs de Bach deviennent une composante de la naturopathie, pas une approche autonome. Idem pour l'aromathérapie.

Tous les compteurs du site doivent dire **deux**. Corriger : le sous-titre H1, le bloc « Six approches pour nourrir le terrain », la conclusion « Ces 3 approches se complètent », le titre « Trois approches » de l'accueil, le méta-description de la page.

### 5.2 — Bloc Aromathérapie (rédaction complète fournie)

Le client demande que le rôle et les bienfaits soient **plus développés** qu'aujourd'hui, mais sans jamais nommer de produit. Utilise ce texte :

> ### L'aromathérapie
> **Ce que c'est**
> L'aromathérapie utilise les extraits aromatiques issus de plantes — feuilles, fleurs, écorces, racines. Ce sont des concentrés d'une puissance considérable : quelques gouttes peuvent représenter l'équivalent de plusieurs kilos de plante fraîche. C'est précisément cette concentration qui fait leur intérêt, et qui impose un cadre d'utilisation strict.
>
> **Ce que ça peut apporter**
> Sur le plan physique, les extraits aromatiques sont traditionnellement utilisés pour soutenir les fonctions respiratoires, digestives et cutanées, et pour accompagner le confort musculaire.
> Sur le plan nerveux et émotionnel, l'olfaction est le seul de nos sens à rejoindre directement les zones du cerveau liées à la mémoire et aux émotions, sans passer par un relais intermédiaire. C'est ce qui explique qu'une odeur puisse modifier un état intérieur en quelques secondes — et pourquoi l'aromathérapie est un outil intéressant pour accompagner l'agitation, la préparation au sommeil ou les moments de tension.
> Chez l'enfant, cette voie olfactive est particulièrement réceptive, et c'est presque toujours celle que je privilégie.
>
> **Le cadre que je pose**
> C'est un outil que je manipule avec beaucoup de prudence, et c'est la raison pour laquelle vous ne trouverez sur ce site aucun nom d'extrait ni aucun mode d'emploi.
> Les extraits aromatiques ne conviennent pas à tous les âges, pas à toutes les situations, et certains sont formellement déconseillés chez le nourrisson, le jeune enfant, la femme enceinte ou allaitante. Ils peuvent également interagir avec des traitements en cours.
> Une recommandation aromatique n'a de sens qu'individuelle, posée après un échange complet, en connaissance de l'âge, du terrain et de ce qui est déjà pris par ailleurs. C'est ce travail-là que je fais en séance — et c'est ce qui la distingue d'une recherche sur internet.

### 5.3 — Bloc Fleurs de Bach (rédaction complète fournie)

> ### Les fleurs de Bach
> **Ce que c'est**
> Mises au point dans les années 1930 par Edward Bach, médecin britannique, les fleurs de Bach sont trente-huit préparations florales, chacune associée à un état intérieur précis : le découragement, la peur du noir, la difficulté à s'adapter à un changement, le besoin de tout contrôler, la timidité qui empêche de se faire entendre.
>
> **Ce que ça peut apporter**
> Ce que j'observe le plus souvent en cabinet, ce n'est pas un effet spectaculaire : c'est un apaisement de fond, et surtout un **langage**.
> Un enfant de sept ans ne sait pas toujours dire « je suis anxieux à l'idée de retourner à l'école ». Mais quand on lui décrit un état — « c'est quand on a un peu peur mais qu'on ne sait pas trop de quoi » — il reconnaît. Le travail avec les fleurs de Bach commence là : nommer ce qui se passe à l'intérieur. Pour beaucoup d'enfants et d'adolescents, c'est déjà une grande partie du chemin.
> Sur le plan du quotidien, les familles rapportent le plus souvent un climat émotionnel plus stable : des soirées moins tendues, des transitions mieux vécues, une capacité à traverser une période de changement sans que tout l'équilibre familial vacille.
>
> **Sept familles, trente-huit nuances**
> Bach a regroupé les états intérieurs en sept grandes familles : la peur, l'incertitude, le manque d'intérêt pour le présent, la solitude, la sensibilité aux influences extérieures, le découragement, et le souci excessif des autres.
> [Conserver les 7 cartes existantes, sans jamais nommer un élixir individuel.]
>
> **Comment je travaille avec**
> Par la conversation et l'observation, j'identifie avec vous — et avec votre enfant quand il est en âge de participer — les états qui dominent le moment présent. Une sélection resserrée est composée, puis réévaluée à chaque séance, parce qu'un état émotionnel n'est jamais figé.
> Les fleurs de Bach s'inscrivent dans un accompagnement global. Elles ne remplacent ni un suivi psychologique, ni un traitement médical, et ne constituent pas une réponse à une situation de détresse.

**Supprimer** : la phrase « Le Dr Bach postulait que toute maladie a une origine émotionnelle », la citation sur les vibrations, la mention « 4 fois par jour, quelques gouttes », et la mention « sans contre-indication ».

### 5.4 — Réflexologie : détailler chaque technique

Le client veut comprendre **ce que chaque technique apporte spécifiquement**. Structure identique pour les quatre, en quatre blocs :

```
Le geste          → ce qui est fait concrètement, où, avec quelle pression
Le déroulé        → durée, position, ce que la personne ressent pendant et après
Ce que ça apporte → 4 à 5 bénéfices en langage de vécu (jamais de pathologie)
Pour qui          → âges et situations où cette technique est privilégiée
```

Contenu à produire pour chacune (respecter le LOT 2 : aucun nom de maladie) :

**Plantaire** — la carte réflexe la plus complète, la plus « profonde ». Apports à mettre en avant : sensation de relâchement général, soutien du confort digestif, aide à la récupération quand la fatigue s'installe, détente profonde. Technique de référence en début d'accompagnement.

**Palmaire** — la plus douce et la plus accessible. Apports : apaisement rapide de l'agitation, préparation au sommeil, accessibilité pour un enfant qui n'accepte pas qu'on lui touche les pieds, et surtout **possibilité pour le parent d'apprendre quelques points et de les reproduire à la maison**. C'est son argument différenciant : mettre cet apprentissage parental en avant, il est très parlant pour une famille.

**Faciale** — la plus fine. Apports : relâchement des tensions du visage et de la mâchoire, sensation de dégagement au niveau des sinus, effet de recentrage et de clarté mentale après la séance. Souvent appréciée des adolescents, qui la vivent comme moins intrusive.

**Crânienne** — la plus enveloppante. Apports : apaisement des états de suractivité mentale, soutien de la qualité du sommeil, relâchement des tensions de la nuque et du crâne, état de calme profond pendant la séance. À positionner pour les profils très sollicités mentalement. **Retirer toute référence à l'ostéopathie crânio-sacrée et au liquide cérébrospinal.**

### 5.5 — Bloc de clôture

Ajouter un bloc court expliquant **comment les deux piliers se combinent** en pratique : la naturopathie pose le cadre de fond et l'hygiène de vie, la réflexologie agit sur le ressenti immédiat et la détente, et une séance peut associer les deux. Cela justifie le tarif combiné de la grille (LOT 6).

---

## LOT 6 — Nouvelle grille tarifaire

### 6.1 — Grille à implémenter

Tarifs établis après relevé de la concurrence sur Tassin-la-Demi-Lune, Écully, Villeurbanne et Lyon ouest.

#### Naturopathie

| Prestation | Durée | Cabinet / Visio | À domicile |
|---|---|---|---|
| Premier bilan de vitalité | 1 h 30 | **80 €** | 88 € |
| Séance de suivi | 1 h | **60 €** | 68 € |
| Point d'ajustement (visio uniquement) | 30 min | **45 €** | — |

#### Réflexologie

| Prestation | Durée | Cabinet | À domicile |
|---|---|---|---|
| Séance enfant (jusqu'à 12 ans) — plantaire, palmaire, faciale ou crânienne | 30 min | **40 €** | 48 € |
| Séance ado & adulte (13 ans et +) — plantaire, palmaire, faciale ou crânienne | 1 h | **65 €** | 73 € |

#### Séance combinée

| Prestation | Durée | Cabinet | À domicile |
|---|---|---|---|
| Naturopathie + Réflexologie (ado & adulte) | 1 h 30 | **90 €** | 98 € |
| Naturopathie + Réflexologie (enfant) | 1 h | **75 €** | 83 € |

#### Forfaits et réductions

- **Forfait 3 séances de suivi naturopathie** : 162 € au lieu de 180 € (−10 %), valable 6 mois
- **Forfait 3 séances de réflexologie adulte** : 175 € au lieu de 195 € (−10 %), valable 6 mois
- **Tarif fratrie** : **−10 % sur la séance du second enfant** et des suivants, lorsque les séances sont réservées le même jour. Applicable à toutes les prestations.

#### Déplacement à domicile

Majoration forfaitaire de **8 €** par séance.
Périmètre desservi : **Sainte-Consorce, Vaugneray, Sainte-Foy-lès-Lyon, Tassin-la-Demi-Lune, Écully, Dardilly.** Au-delà, nous consulter.

#### Modalités

- Visioconférence disponible pour la naturopathie, au **même tarif qu'au cabinet**
- Réflexologie : au cabinet ou à domicile uniquement
- Moyens de paiement : **carte bancaire, chèque, espèces**
- Une facture est remise à chaque séance, transmissible à votre mutuelle
- Règlement en ligne pour les séances en visio : à venir

> **Grille validée par Arielle.** Trois points à connaître pour la rédaction :
> — La limite enfant/adulte est fixée à **12 ans révolus** : séance enfant jusqu'à 12 ans inclus, séance ado & adulte à partir de 13 ans. Cette borne doit être **identique dans le questionnaire du Bilan** (LOT 11).
> — Le premier bilan passe de 75 € à 80 € et le suivi de 65 € à 60 €, ce qui rend la progression plus lisible et aligne le suivi sur le marché local.
> — La réduction fratrie de −10 % est un choix commercial, sans équivalent établi dans la profession : ne pas la présenter comme une pratique courante.

### 6.2 — Politique d'annulation

À afficher sur la page Tarifs, dans un bloc dédié, et à reprendre plus tard dans le mail de confirmation de rendez-vous.

> **Annulation et report**
> Un rendez-vous peut être annulé ou reporté sans frais jusqu'à **24 heures** avant l'heure prévue, par téléphone, SMS ou email.
> En deçà de ce délai, ou en cas d'absence non signalée, la séance est due à hauteur de **50 %** de son montant.
> Les situations imprévisibles — maladie soudaine, accident, urgence familiale — sont bien entendu prises en compte : prévenez-moi dès que possible.
> En cas d'empêchement de ma part, la séance est reportée au plus tôt, sans aucun frais.

> **Note technique importante** : cette clause est contractuelle, pas réglementaire. Elle n'est opposable que si le client en a pris connaissance **avant** la séance. Elle devra donc être reprise dans le tunnel de réservation lorsqu'il sera mis en place, avec une case de validation.

### 6.3 — Corrections de forme sur la page Tarifs

1. **Format des prix** : le site affiche aujourd'hui `€75`. La norme française est `75 €`, avec une espace insécable. Corriger partout (`75&nbsp;€`).
2. **Contradiction lieu des soins** : le bandeau annonce « Cabinet · Visio · Domicile » et un paragraphe plus bas affirme « Tous les soins se déroulent au cabinet de Sainte-Consorce ». Réécrire ce paragraphe pour décrire les trois modalités et le périmètre de déplacement.
3. **Harmoniser les durées** avec la page Méthode, qui annonce aujourd'hui des durées différentes pour les mêmes prestations (palmaire 30-45 min vs 45 min, plantaire 45-60 min vs 1 h). La grille tarifaire fait foi.
4. **Bloc mutuelles** : conserver, en ajoutant que la prise en charge dépend du contrat et n'est jamais garantie.
5. **Section « Un accompagnement en trois temps »** : supprimer la mention « Fleurs de Bach prescrites » (verbe interdit) et « Alternance des 3 approches » (→ « des deux approches »).
6. **Remplacer le bloc final « Commencez par le Bilan Horizon Santé »** par un parcours clair : *Bilan Santé en ligne → Premier bilan au cabinet → Séances de suivi toutes les 3 à 4 semaines.*

---

## LOT 7 — Transformation de la page Guides en page Publications

La page vend aujourd'hui cinq guides PDF à 19 € via un bouton qui renvoie vers le formulaire de contact, sans paiement ni sélection du guide. Elle devient une page éditoriale destinée à la visibilité.

### 7.1 — Ce qui change

- Route : `/guides` → `/publications`, avec **redirection 301** de l'ancienne URL
- Libellé de navigation : « Guides Pratiques » → **« Publications »**
- **Supprimer tous les prix**, les mentions « 19 € », « PDF envoyé par email », « Accès immédiat », « Commander ce guide »
- **Supprimer le badge d'en-tête** « PDF · Accès immédiat · 19 € chacun »
- **Supprimer le bloc des 4 réassurances commerciales** (Format PDF / Envoi par email / Rédigé par une praticienne / Questions bienvenues)

### 7.2 — Nouvelle structure

Page d'index listant des articles, chacun avec : titre, chapô de 2 lignes, temps de lecture, date de publication, et une page de détail dédiée.

Les cinq contenus existants deviennent cinq articles fondateurs, retitrés et nettoyés selon les LOT 2 et LOT 3 :

| Ancien guide | Nouveau titre d'article |
|---|---|
| Acné | Comprendre ce que la peau exprime à l'adolescence |
| Immunité Enfant 3-12 ans | Accompagner un enfant qui fatigue à chaque changement de saison |
| Immunité Ados & Adultes | Reconstruire son énergie quand la récupération ne suit plus |
| Émotions | Apaiser le système nerveux : ce qui aide vraiment au quotidien |
| Maux du Quotidien | Les réflexes de bon sens pour les inconforts du quotidien |

Chaque article doit se terminer par le composant `<AvertissementSante />` et un appel à l'action vers la prise de contact.

### 7.3 — Structure technique à prévoir

Prévoir un système simple d'ajout d'articles (fichiers Markdown ou MDX dans un dossier `content/publications/`, avec frontmatter `titre`, `chapo`, `date`, `tempsLecture`, `image`). Arielle doit pouvoir publier un nouvel article sans toucher au code.

Ajouter les balises `article:published_time`, `author` et une image Open Graph par article.

---

## LOT 8 — Avis clients : tout passe par Google

**Décision prise : ne construis aucun système de dépôt d'avis sur le site.** Un formulaire d'avis en propre déclencherait les obligations de l'article L.111-7-2 du Code de la consommation (indiquer si les avis sont vérifiés et selon quelle méthode, afficher les dates, ne pas supprimer sélectivement les avis négatifs) et imposerait une modération continue. Les avis sont gérés sur la **fiche Google Business Profile** du cabinet, où la modération et la vérification relèvent de Google.

### Ce qu'il faut implémenter

1. **Bloc « Avis »** sur l'Accueil et sur la page Tarifs, contenant :
   - la note et le nombre d'avis Google (`⚠️ À COMPLÉTER` — valeurs à renseigner une fois la fiche créée et alimentée ; en attendant, masquer le bloc via un flag de configuration plutôt que d'afficher des valeurs factices)
   - un bouton **« Voir les avis sur Google »** → lien vers la fiche
   - un bouton secondaire **« Laisser un avis »** → lien direct vers le formulaire d'avis Google
2. Stocker les deux URL et les valeurs dans un fichier de configuration unique (`config/avis.ts`), avec un booléen `afficherBlocAvis` par défaut à `false`.
3. **Aucune récupération automatique** de l'API Google Places dans ce lot : cela suppose une clé API, une facturation et une gestion du cache. Les valeurs sont saisies à la main pour l'instant. Structurer le composant pour qu'une source automatique puisse s'y brancher plus tard.

### Hors code, à transmettre à Arielle

Créer la fiche Google Business Profile est le premier levier d'acquisition sur une activité locale, davantage que le site lui-même. Prévoir : catégorie « Naturopathe » en principale et « Réflexologue » en secondaire, zone desservie correspondant au périmètre de déplacement (LOT 6.1), photos du cabinet, et un lien vers le site.

---

## LOT 9 — Cohérences globales

Ces défauts traversent plusieurs pages. À traiter en une passe.

### 9.1 — Pieds de page

Les cinq pages ont aujourd'hui **cinq pieds de page différents** (colonnes Services variables, ligne de copyright variable, « Kinésiologue » sur une seule). Créer un composant `<Footer />` unique, utilisé partout.

Ligne de copyright unifiée :
`© 2026 Horizon & Équilibre — Arielle de Maistre · Naturopathe certifiée FEDE · Praticienne en réflexologie`

### 9.2 — Tranches d'âge

Traité intégralement au **LOT 10**, qui redéfinit le public accueilli sur l'ensemble du site.

### 9.3 — Nommage

« Bilan Santé » dans le menu, « Bilan Horizon Santé » partout ailleurs. Retenir **« Bilan Horizon Santé »** partout, y compris dans le menu.

### 9.4 — Section « Trois approches » de l'accueil

Le titre annonce trois approches mais **seules deux cartes sont rendues** — un bug d'affichage doublé d'une incohérence de comptage. Retitrer en « Deux approches » et vérifier que la grille est bien en 2 colonnes.

### 9.5 — Parcours d'Arielle

La page À propos indique « j'ai exercé pendant dix ans dans le secteur de l'énergie » et mentionne Oman et le Maroc, alors que l'accueil ne cite qu'Oman. Harmoniser les deux récits. `⚠️ À VÉRIFIER` avec Arielle pour la durée exacte.

### 9.6 — Formulaire de contact

- Ajouter un champ **téléphone** (facultatif)
- Aligner le sélecteur d'âge sur celui du LOT 11.1 (liste unique, partagée par les deux formulaires)
- Ajouter à la liste des objets : **« Partager mon expérience »** et **« Prendre rendez-vous »**
- Ajouter une **case de consentement** obligatoire : *« J'accepte que les informations saisies soient utilisées pour répondre à ma demande. »* (le lien vers la politique de confidentialité sera ajouté quand la page existera)
- Ajouter une protection anti-spam (honeypot ou équivalent, sans service tiers)

### 9.7 — Répétitions à supprimer

- La liste des quatre tranches d'âge apparaît **trois fois** à l'identique (Accueil, À propos, Méthode). N'en garder qu'une version détaillée sur À propos, et des versions courtes ailleurs.
- « Traiter la cause, pas le symptôme » apparaît **trois fois**. Voir LOT 2.3.

### 9.8 — Icônes

Les emojis servent d'icônes sur tout le site. Leur rendu varie selon les systèmes et tire visuellement vers le bas une charte qui vise l'élégance. Remplacer par un jeu d'icônes SVG homogène en trait fin, colorées en Bleu Pétrole et Doré. Si le remplacement complet est trop lourd, commencer par l'Accueil et la page Tarifs, qui sont les plus vues.

### 9.9 — Images

Les fichiers portent des noms avec espaces et majuscules (`naturo 6.jpg`, `Reflexo cranienne 2.jpg`, `Fleurs de bach 3.jpg`). Renommer en kebab-case, convertir en WebP avec repli JPEG, activer le lazy-loading, et servir des tailles adaptées via `next/image`. C'est très probablement le premier poste de poids des pages.

### 9.10 — SEO de base

- Ajouter une **méta-description** à l'Accueil, au Bilan Horizon Santé et au Contact (absentes)
- Ajouter les balises **Open Graph** et une image de partage par page — le partage WhatsApp et Instagram est le premier canal d'acquisition sur ce métier
- Ajouter un balisage **Schema.org** `LocalBusiness` + `Person` sur l'Accueil (nom, adresse, téléphone, email, zone desservie, horaires) — `⚠️ À COMPLÉTER` pour l'adresse précise et les horaires
- Générer `sitemap.xml` et `robots.txt`

---

## LOT 10 — Redéfinition du public accueilli

Le site est aujourd'hui **excluant**. Il répète « de 0 à 30 ans », s'intitule « Naturopathie Enfant & Adolescent », et sa dernière tranche s'appelle « Les Jeunes Professionnels ». Un parent de 45 ans, un grand-parent ou un adulte de 50 ans comprend qu'il n'est pas concerné — alors qu'Arielle les accueille.

**Nouvelle règle** : le cabinet accompagne **tous les âges, du nourrisson à l'adulte, sans limite haute**. L'enfance et l'adolescence restent la **spécialité** d'Arielle, ce qui est un argument fort — mais une spécialité n'est pas une restriction, et la formulation doit refléter cette nuance partout.

### 10.1 — Les quatre publics

Structure unique, à utiliser sur l'Accueil, sur À propos et sur Méthode :

| Tranche | Intitulé | Positionnement |
|---|---|---|
| 0 – 3 ans | Les tout-petits | Accompagnement transmis via les parents |
| 3 – 12 ans | Les enfants | Poser les bases, accompagner le quotidien |
| 13 – 18 ans | Les adolescents | Bouleversements, pression scolaire, construction de soi |
| 18 ans et + | Les adultes | Vie professionnelle, parentalité, équilibre à toutes les étapes |

La borne 12/13 ans est la même que celle de la grille tarifaire (LOT 6.1) et que celle du questionnaire (LOT 11). **Ne jamais la faire varier.**

Le bloc « Les adultes » doit explicitement couvrir la vie entière : entrée dans la vie active, parentalité, milieu de vie, et étapes plus avancées. Ne pas le réduire aux jeunes actifs.

### 10.2 — Formulations à corriger

| Emplacement | Actuel | Corrigé |
|---|---|---|
| Balise `<title>` de l'Accueil | « Naturopathie Enfant & Adolescent » | **« Naturopathie & Réflexologie — Sainte-Consorce (Lyon Ouest) »** |
| H1 de l'Accueil | « J'aide votre enfant à retrouver l'équilibre » | **« Accompagner chaque âge vers son équilibre — naturellement »** |
| Chapô de l'Accueil | « j'accompagne bébés, enfants, adolescents et jeunes adultes — de 0 à 30 ans » | **« J'accompagne toute la famille, du nourrisson à l'adulte. Spécialisée dans l'enfance et l'adolescence, j'accueille également les adultes à chaque étape de leur vie. »** |
| Compteur de l'Accueil | « 🍼 De 0 à 30 ans accompagnés » | **« Du nourrisson à l'adulte »** |
| Section « Pour qui » | « De 0 à 30 ans, un accompagnement pensé pour chaque âge » | **« À chaque âge, un accompagnement pensé pour lui »** |
| Quatrième public | « 20 – 30 ans · Les Jeunes Professionnels » | **« 18 ans et + · Les adultes »** |
| Section Méthode | « 20 – 30 ans · Adultes ⚡ Ancrage » | **« 18 ans et + · Adultes ⚡ Ancrage »** |
| Pieds de page | « pour les enfants, adolescents et jeunes adultes » | **« pour toute la famille, du nourrisson à l'adulte »** |
| Sous-titre Bilan | « bébés, enfants, adolescents et jeunes adultes » | **« du nourrisson à l'adulte »** |
| Page À propos, H2 | « Quatre publics, une même conviction » | Conserver, les quatre publics sont redéfinis |

Passer ensuite sur **tous** les textes pour éliminer les mentions résiduelles : `grep -riE "0 à 30|0-30|jeunes adultes|jeunes professionnels|enfant & adolescent|enfant et adolescent"`.

### 10.3 — Attention au ton

En élargissant, ne pas diluer. Deux écueils à éviter :

- **Perdre la spécialité.** L'enfance reste le cœur et le différenciateur. Formuler en « spécialisée dans… et j'accueille également… », jamais en « pour tout le monde ».
- **Des textes qui ne parlent qu'aux parents.** De nombreuses phrases s'adressent implicitement à un parent (« votre enfant », « décoder les messages de son corps »). Dans les sections qui concernent tous les publics, alterner ou neutraliser : « la personne accompagnée », « vous ou votre enfant ».

---

## LOT 11 — Refonte du questionnaire Bilan Horizon Santé

Le questionnaire actuel est unique, en 15 questions, et démarre à 3-5 ans. Il devient **trois questionnaires distincts**, adaptés à qui le remplit, et passe à **20 questions** chacun.

### 11.1 — Aiguillage

L'écran d'accueil du Bilan demande le prénom et la tranche d'âge, puis route vers la bonne version :

| Version | Tranche | Qui remplit | Adresse |
|---|---|---|---|
| **A** | 0 – 12 ans | Le parent | « votre enfant », vouvoiement du parent |
| **B** | 13 – 17 ans | L'adolescent lui-même | tutoiement, ton direct |
| **C** | 18 ans et + | La personne elle-même | vouvoiement |

Sélecteur d'âge unique, utilisé aussi dans le formulaire de contact :

```
0 – 12 mois        → version A (variante nourrisson)
1 – 3 ans          → version A (variante nourrisson)
3 – 6 ans          → version A
6 – 9 ans          → version A
9 – 12 ans         → version A
13 – 15 ans        → version B
15 – 17 ans        → version B
18 – 25 ans        → version C
25 – 40 ans        → version C
40 – 60 ans        → version C
60 ans et +        → version C
```

Sur les versions B et C, ajouter un écran d'introduction : *« Ce questionnaire est pour toi / pour vous. Réponds / Répondez spontanément : il n'y a pas de bonne réponse. »*

### 11.2 — Moteur de calcul

- **5 pétales** inchangés : Sommeil, Éclat, Sérénité, Immunité, Confiance
- **4 questions par pétale**, soit 20 questions
- 4 réponses par question, scorées **0 à 3** (0 = pas de charge, 3 = charge forte)
- **Charge par pétale : sur 12** (ancien barème sur 9 — mettre à jour partout dans le code)
- Nouveaux seuils d'affichage de la Fleur de Vitalité :

| Charge | État | Rendu du pétale |
|---|---|---|
| 0 – 3 | Équilibre | Vert Sauge, opacité 100 % |
| 4 – 7 | Vigilance | Vert Sauge, opacité 50 % |
| 8 – 12 | Alerte | Vert Sauge 50 % + liseré Doré en pointillés |

- L'objet `window.__auditResult` conserve sa structure, avec le barème sur 12 et un champ supplémentaire `version: "A" | "B" | "C"`.
- Barre de progression visible, retour arrière possible, réponses conservées si la personne revient en arrière.

### 11.3 — Version A · Enfant 0-12 ans, remplie par le parent

**Pétale Sommeil**

1. Le soir, comment se passe le moment du coucher ? — `0` Il s'endort en quelques minutes · `1` Il lui faut un peu de temps, mais ça se passe bien · `2` L'endormissement est long et demande souvent notre présence · `3` C'est un moment difficile presque tous les soirs
2. Et pendant la nuit ? — `0` Il dort d'une traite · `1` Il se réveille parfois et se rendort seul · `2` Il se réveille plusieurs fois par semaine et nous appelle · `3` Les nuits sont morcelées presque toutes les nuits
3. Au réveil, dans quel état est-il ? — `0` Reposé et de bonne humeur · `1` Il met un peu de temps à démarrer · `2` Souvent fatigué dès le matin · `3` Épuisé, même après une nuit complète
4. Dans la journée, comment est son énergie ? — `0` Stable, il tient bien la journée · `1` Un coup de fatigue en fin de journée · `2` Des hauts et des bas marqués · `3` Il s'écroule ou devient très irritable en fin de journée

**Pétale Éclat**

5. Comment est sa peau en ce moment ? — `0` Nette et souple · `1` Parfois sèche ou un peu réactive · `2` Souvent sèche, avec des rougeurs qui reviennent · `3` Sa peau est un sujet permanent à la maison
6. Comment va son transit ? — `0` Régulier, sans inconfort · `1` Quelques irrégularités passagères · `2` Souvent irrégulier ou inconfortable · `3` C'est un sujet quotidien
7. Après les repas, comment se sent-il ? — `0` Bien, il repart jouer · `1` Parfois un peu lourd · `2` Il se plaint souvent du ventre · `3` Les repas sont régulièrement suivis d'inconfort
8. Comment décririez-vous son alimentation ? — `0` Variée, il goûte volontiers · `1` Quelques refus, mais l'ensemble est équilibré · `2` Peu variée, beaucoup de produits transformés ou sucrés · `3` C'est un sujet de tension à chaque repas

**Pétale Sérénité**

9. Face à un changement — une sortie, une nouvelle activité, un déménagement ? — `0` Il s'adapte facilement · `1` Un temps d'adaptation, puis ça va · `2` Les changements le déstabilisent nettement · `3` Tout changement provoque une grande détresse
10. Comment se passent les séparations le matin ? — `0` Sans difficulté · `1` Quelques pleurs qui passent vite · `2` C'est souvent difficile et cela dure · `3` Chaque séparation est éprouvante
11. Observez-vous des signes de tension dans son corps — ventre noué avant l'école, ongles rongés, tics, agitation ? — `0` Non · `1` Rarement · `2` Régulièrement · `3` Presque tous les jours
12. Comment sont ses émotions au quotidien ? — `0` Plutôt stables · `1` Des variations normales pour son âge · `2` Des réactions fortes, difficiles à apaiser · `3` Des débordements fréquents qui nous dépassent

**Pétale Immunité**

13. Depuis un an, à quelle fréquence a-t-il été malade ? — `0` Une ou deux fois · `1` Trois à quatre fois · `2` Cinq à six fois · `3` Il enchaîne, sans jamais vraiment récupérer
14. Quand il attrape quelque chose, comment récupère-t-il ? — `0` Rapidement · `1` En quelques jours · `2` Cela traîne souvent · `3` La récupération est toujours longue
15. Aux changements de saison, que constatez-vous ? — `0` Rien de particulier · `1` Un léger coup de mou · `2` C'est systématiquement une période difficile · `3` Chaque changement de saison nous inquiète
16. Combien de temps passe-t-il dehors chaque jour, en moyenne ? — `0` Plus d'une heure · `1` Environ une heure · `2` Moins de trente minutes · `3` Très peu, presque pas

**Pétale Confiance**

17. Face à une nouveauté — une nouvelle activité, un nouveau groupe ? — `0` Il y va volontiers · `1` Il observe d'abord, puis participe · `2` Il a besoin d'être beaucoup encouragé · `3` Il refuse ou reste en retrait
18. Comment parle-t-il de lui-même ? — `0` Plutôt positivement · `1` De façon neutre · `2` Il se dévalorise parfois · `3` Il se dévalorise souvent
19. Face à une erreur ou à un échec ? — `0` Il rebondit · `1` Il est déçu puis passe à autre chose · `2` Cela l'affecte longtemps · `3` Il préfère ne pas essayer plutôt que de rater
20. Dans un groupe d'enfants, comment se situe-t-il ? — `0` Il trouve sa place facilement · `1` Il lui faut un temps d'observation · `2` Il reste souvent en périphérie · `3` Il a du mal à s'intégrer et cela le peine

**Variante nourrisson (0 – 3 ans)**

Certaines questions n'ont pas de sens avant 3 ans. Les remplacer conditionnellement :

- Q8 → *Comment se passent les repas ou les tétées ?* — `0` Sereinement · `1` Quelques moments d'agitation · `2` Souvent difficiles · `3` C'est un sujet à chaque fois
- Q10 → *Se laisse-t-il apaiser quand il pleure ?* — `0` Facilement · `1` Après un moment · `2` Difficilement · `3` Presque jamais
- Q17 → *Face à une personne ou un lieu nouveau ?* — `0` Il s'y fait vite · `1` Un temps d'observation · `2` Il a besoin de beaucoup de réassurance · `3` Il est très vite en détresse
- Q18 → *A-t-il besoin d'un contact physique permanent pour être tranquille ?* — `0` Non, il joue seul par moments · `1` Par périodes · `2` Souvent · `3` En permanence
- Q19 → *Comment réagit-il au bruit, à la lumière, à l'agitation ?* — `0` Sans difficulté · `1` Il est un peu sensible · `2` Il est vite débordé · `3` Toute stimulation forte le met en détresse
- Q20 → *Comment se passent les temps d'éveil ?* — `0` Calmes et curieux · `1` Un peu agités · `2` Souvent tendus · `3` Difficiles la plupart du temps

### 11.4 — Version B · Adolescent 13-17 ans, rempli par l'ado

Ton direct, tutoiement, phrases courtes. Aucune formulation infantilisante, aucun jugement.

**Sommeil**

1. À quelle heure tu t'endors vraiment, en semaine ? — `0` Avant 22h30 · `1` Entre 22h30 et 23h30 · `2` Entre 23h30 et 1h · `3` Après 1h, ou ça dépend des jours
2. Combien de temps tu mets à t'endormir ? — `0` Moins de 15 minutes · `1` Entre 15 et 30 minutes · `2` Entre 30 minutes et une heure · `3` Plus d'une heure, je tourne dans mon lit
3. Le matin, au réveil ? — `0` Je me lève sans trop de mal · `1` C'est dur mais ça va · `2` Je suis épuisé presque tous les matins · `3` Je n'arrive pas à me lever
4. Les écrans le soir ? — `0` J'arrête bien avant de me coucher · `1` J'arrête environ une heure avant · `2` J'arrête juste avant de dormir · `3` Je m'endors avec

**Éclat**

5. Ta peau en ce moment ? — `0` Ça va · `1` Quelques poussées de temps en temps · `2` C'est souvent un sujet · `3` Ça me gêne au quotidien
6. Ton ventre, ta digestion ? — `0` Rien à signaler · `1` Parfois des inconforts · `2` Souvent des ballonnements ou des irrégularités · `3` C'est quotidien
7. Comment tu manges en semaine ? — `0` Des repas réguliers et variés · `1` Ça dépend des jours · `2` Je saute souvent des repas ou je grignote · `3` Aucun rythme, beaucoup de produits transformés
8. Sodas, boissons sucrées ou énergisantes ? — `0` Rarement · `1` De temps en temps · `2` Presque tous les jours · `3` Plusieurs fois par jour

**Sérénité**

9. Avant un contrôle ou un examen ? — `0` Je gère · `1` Un peu stressé, ça reste gérable · `2` Très stressé, ça m'empêche de bien travailler · `3` Je bloque complètement
10. Est-ce que le stress se manifeste dans ton corps — ventre noué, mâchoire serrée, cœur qui s'emballe ? — `0` Jamais · `1` Rarement · `2` Souvent · `3` Presque tout le temps
11. Ta capacité à te détendre quand tu n'as rien à faire ? — `0` Facilement · `1` Ça vient au bout d'un moment · `2` J'ai du mal à décrocher · `3` Je n'y arrive presque jamais
12. Tes pensées le soir ? — `0` Calmes · `1` Un peu agitées parfois · `2` Ça tourne souvent en boucle · `3` Ça tourne tous les soirs

**Immunité**

13. Cette année, combien de fois tu as été malade ? — `0` Zéro ou une fois · `1` Deux ou trois fois · `2` Quatre ou cinq fois · `3` Plus, j'enchaîne
14. Ton niveau d'énergie général ? — `0` Bon · `1` Correct, avec des baisses · `2` Souvent bas · `3` Je suis fatigué en permanence
15. Activité physique par semaine ? — `0` Plus de trois fois · `1` Une à deux fois · `2` Rarement · `3` Jamais
16. Temps passé dehors, à la lumière du jour ? — `0` Tous les jours, un bon moment · `1` Presque tous les jours · `2` Rarement · `3` Quasiment jamais

**Confiance**

17. Comment tu te sens par rapport aux autres de ton âge ? — `0` Bien · `1` Ça dépend des jours · `2` Souvent en décalage · `3` Je me sens souvent à part
18. Prendre la parole devant un groupe ? — `0` Ça ne me pose pas de problème · `1` Stressant, mais je le fais · `2` Je l'évite si je peux · `3` C'est impossible pour moi
19. Ton regard sur ton corps et ton apparence ? — `0` Plutôt serein · `1` Ça va, avec des jours sans · `2` Souvent critique · `3` C'est une source de mal-être au quotidien
20. Quand tu rates quelque chose ? — `0` Je relativise · `1` Ça m'embête, puis ça passe · `2` Ça me poursuit longtemps · `3` Je préfère ne pas essayer plutôt que de rater

> **Point de vigilance sur la version B.** Ce questionnaire touche l'image de soi et le rapport au corps. Il ne doit contenir **aucune question sur le poids, les quantités mangées, les régimes ou le contrôle alimentaire**, et l'écran de résultat ne doit jamais commenter l'apparence. Si les pétales Sérénité et Confiance ressortent tous deux en alerte, le message de conclusion doit ajouter une ligne : *« Si ce que tu ressens te pèse vraiment, parles-en aussi à un adulte de confiance, à l'infirmière scolaire ou à ton médecin. »*

### 11.5 — Version C · Adulte 18 ans et +

Volontairement large : vie professionnelle, vie personnelle, parentalité, toutes les étapes de la vie. Aucune hypothèse sur la situation familiale ou le statut.

**Sommeil**

1. Combien d'heures dormez-vous en moyenne, en semaine ? — `0` Entre 7 et 9 heures · `1` Entre 6 et 7 heures · `2` Entre 5 et 6 heures · `3` Moins de 5 heures, ou très variable
2. Combien de temps mettez-vous à vous endormir ? — `0` Moins de 15 minutes · `1` Entre 15 et 30 minutes · `2` Entre 30 minutes et une heure · `3` Plus d'une heure
3. Vos nuits sont-elles continues ? — `0` Aucun réveil · `1` Des réveils occasionnels, je me rendors · `2` Des réveils fréquents · `3` Toutes les nuits, avec du mal à me rendormir
4. Au réveil ? — `0` Reposé · `1` Correct · `2` Fatigué la plupart du temps · `3` Aussi fatigué qu'au coucher

**Éclat**

5. Votre digestion et votre transit ? — `0` Réguliers · `1` Quelques irrégularités · `2` Souvent inconfortables · `3` C'est un sujet quotidien
6. Votre peau, vos cheveux, vos ongles ? — `0` En bon état · `1` Ternes par moments · `2` Souvent ternes, secs ou réactifs · `3` Une dégradation visible ces derniers mois
7. Le rythme de vos repas en semaine ? — `0` Réguliers, pris assis, faits maison · `1` Globalement corrects · `2` Souvent sautés, pris vite ou devant un écran · `3` Aucun rythme
8. Café, alcool, sucre, écrans le soir — où vous situez-vous ? — `0` Modéré sur tous ces plans · `1` Un point sur lequel je pourrais m'améliorer · `2` Deux ou trois points à revoir · `3` Plusieurs sont excessifs, j'en ai conscience

**Sérénité**

9. Votre charge mentale au quotidien ? — `0` Gérable · `1` Élevée par périodes · `2` Élevée en permanence · `3` Je me sens débordé en continu
10. Votre capacité à décrocher le soir et le week-end ? — `0` Facilement · `1` Il me faut un temps · `2` J'y pense encore souvent · `3` Je n'y arrive pas
11. Des manifestations physiques de tension — nuque, mâchoire, ventre, respiration courte ? — `0` Aucune · `1` Occasionnelles · `2` Fréquentes · `3` Permanentes
12. Du temps pour vous chaque semaine ? — `0` Plusieurs heures · `1` Quelques moments · `2` Très peu · `3` Aucun

**Immunité**

13. Sur les douze derniers mois, combien de fois avez-vous été malade ? — `0` Zéro ou une fois · `1` Deux ou trois fois · `2` Quatre ou cinq fois · `3` Plus, ou quelque chose qui traîne
14. Votre récupération après un effort, une nuit courte ou un épisode de fatigue ? — `0` Rapide · `1` Correcte · `2` Lente · `3` Je ne récupère plus vraiment
15. Activité physique hebdomadaire ? — `0` Trois fois ou plus · `1` Une à deux fois · `2` Rarement · `3` Jamais
16. Exposition à la lumière du jour et au plein air ? — `0` Quotidienne · `1` Régulière · `2` Rare · `3` Quasi nulle

**Confiance**

17. Votre élan et votre motivation en ce moment ? — `0` Bien présents · `1` Variables · `2` Souvent en berne · `3` Éteints
18. Votre capacité à poser des limites — au travail, en famille ? — `0` Sans difficulté · `1` Avec un peu d'effort · `2` Difficilement · `3` Je n'y arrive pas et cela me pèse
19. Le regard que vous portez sur vous-même ? — `0` Bienveillant · `1` Neutre · `2` Souvent critique · `3` Très sévère
20. Vous sentez-vous à votre place dans votre vie actuelle ? — `0` Oui · `1` Globalement · `2` Pas vraiment · `3` Non, et cela dure

### 11.6 — Écran de résultat

Identique dans les trois versions, avec des formulations adaptées à la personne qui lit :

1. La **Fleur de Vitalité** à cinq pétales, avec l'état de chacun
2. Pour chaque pétale, **deux à trois lignes** décrivant ce qu'il mesure et ce que le résultat suggère — en langage de vécu, jamais clinique, et **sans nommer le moindre produit ou remède** (LOT 3)
3. Le rappel court d'avertissement santé (LOT 2.5)
4. **Un seul appel à l'action** : prendre contact pour un premier bilan au cabinet (LOT 4)
5. Un bouton d'export PDF du résultat

Formulations différenciées de l'appel à l'action :
- Version A → *« Un premier échange au cabinet permettrait de mieux comprendre ce que traverse votre enfant. »*
- Version B → *« Si tu veux comprendre d'où vient tout ça, un premier rendez-vous permet d'en parler tranquillement. »*
- Version C → *« Un premier bilan permettrait de mettre de l'ordre dans tout cela et de définir des priorités réalistes. »*

Aucun score chiffré affiché à l'utilisateur : uniquement les trois états visuels. Les chiffres restent internes, pour le CRM.

---

## LOT 12 — Vérification finale

Avant de considérer la refonte terminée, exécute et rends compte de chaque point :

```bash
# 1 — Kinésiologie
grep -riE "kinésio|kinesio" --include="*.{ts,tsx,js,jsx,md,mdx,json}" .

# 2 — Oligoscan
grep -riE "oligoscan|oligo-scan|métaux lourds|carence minérale" .

# 3 — Substances
grep -riE "tea tree|millepertuis|mélisse|passiflore|ashwagandha|échinacée|larch|mimulus|rescue|bardane|chardon|pensée sauvage|laurier|fenouil|camomille|figuier|huile essentielle|oméga|probiotique" .

# 4 — Vocabulaire médical
grep -riE "\bpatient|traiter|soigner|guérir|guérison|prescri|diagnostic|posologie|remède" .

# 5 — Noms de maladies
grep -riE "TDAH|HPI|endométriose|plagiocéphalie|eczéma|sinusite|otite|angine|migraine|burnout|dysbiose|acné|énurésie" .

# 6 — Titres
grep -riE "pharmacienne|QUALIOPI|UNESCO|Conseil de l'Europe|ostéopath" .

# 7 — Format des prix
grep -riE "€[0-9]" .

# 8 — Public restrictif
grep -riE "0 à 30|0-30|jeunes adultes|jeunes professionnels|enfant & adolescent|enfant et adolescent" .

# 9 — Ancien barème du questionnaire
grep -riE "/9|sur 9|15 questions" .
```

Puis, manuellement :

- [ ] Le composant `<AvertissementSante />` est présent sur les 6 pages listées au LOT 2.5
- [ ] Le pied de page est identique sur toutes les pages
- [ ] Aucun lien mort (notamment « Mentions légales »)
- [ ] Les compteurs d'approches disent tous « deux »
- [ ] Le sélecteur d'âge est identique dans le Bilan et dans le Contact, et va de 0 mois à « 60 ans et + »
- [ ] Les trois versions du questionnaire se déclenchent bien selon la tranche choisie, y compris la variante nourrisson
- [ ] Le barème est bien sur 12 partout, et aucun score chiffré n'est affiché à l'utilisateur
- [ ] La version B ne contient aucune question sur le poids ou les quantités alimentaires
- [ ] La fin du questionnaire ne recommande plus l'Oligoscan et propose un appel à l'action unique
- [ ] La borne 12/13 ans est la même dans la grille tarifaire, dans les publics et dans le questionnaire
- [ ] Tous les prix sont au format `75 €`
- [ ] Le bloc Avis est masqué tant que les valeurs Google ne sont pas renseignées
- [ ] Rendu correct sur mobile (375 px) pour les pages Tarifs, Méthode et pour le questionnaire, qui sont les plus denses
- [ ] Contraste suffisant du Doré `#C4A265` sur fond clair — le vérifier, il est probablement en dessous du seuil AA pour du texte courant ; le réserver aux accents et aux filets

---

## Récapitulatif des éléments en attente côté Arielle

| Élément | Statut |
|---|---|
| Forme juridique et SIRET | `⚠️ À COMPLÉTER` |
| Adresse complète du cabinet | `⚠️ À COMPLÉTER` |
| Assurance responsabilité civile professionnelle | `⚠️ À COMPLÉTER` |
| Médiateur de la consommation | `⚠️ À COMPLÉTER` |
| Nom de domaine définitif | `⚠️ À COMPLÉTER` |
| Horaires d'ouverture du cabinet | `⚠️ À COMPLÉTER` |
| URL de la fiche Google Business Profile et du formulaire d'avis | `⚠️ À COMPLÉTER` |
| Note et nombre d'avis Google | `⚠️ À COMPLÉTER` |
| Durée exacte de la carrière dans l'énergie | `⚠️ À VÉRIFIER` |

**Validé et intégré** : grille tarifaire complète, borne enfant/adulte à 12 ans révolus, réduction fratrie à −10 %, majoration domicile de 8 €, politique d'annulation à 24 h, gestion des avis par Google uniquement, public élargi à tous les âges, questionnaire en trois versions de 20 questions.
