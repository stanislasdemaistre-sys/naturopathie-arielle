-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PRATICIEN', 'ADMIN');

-- CreateEnum
CREATE TYPE "LienParente" AS ENUM ('MERE', 'PERE', 'TUTEUR', 'AUTRE');

-- CreateEnum
CREATE TYPE "Sexe" AS ENUM ('MASCULIN', 'FEMININ');

-- CreateEnum
CREATE TYPE "MineralType" AS ENUM ('CALCIUM', 'MAGNESIUM', 'PHOSPHORE', 'SILICIUM', 'SODIUM', 'POTASSIUM', 'CUIVRE', 'ZINC', 'FER', 'MANGANESE', 'CHROME', 'VANADIUM', 'BORE', 'COBALT', 'MOLYBDENE', 'IODE', 'LITHIUM', 'GERMANIUM', 'SELENIUM', 'SOUFRE');

-- CreateEnum
CREATE TYPE "StatutResultat" AS ENUM ('BAS_MOINS', 'BAS', 'NORMAL', 'OK', 'HAUT', 'HAUT_PLUS');

-- CreateEnum
CREATE TYPE "MetalLourdType" AS ENUM ('ALUMINIUM', 'ANTIMOINE', 'ARGENT', 'ARSENIC', 'BARYUM', 'BERYLLIUM', 'BISMUTH', 'CADMIUM', 'MERCURE', 'NICKEL', 'PLATINE', 'PLOMB', 'THALLIUM', 'THORIUM');

-- CreateEnum
CREATE TYPE "StatutMetalLourd" AS ENUM ('NORMAL', 'HAUT_MOINS', 'HAUT', 'HAUT_PLUS', 'EXCES');

-- CreateEnum
CREATE TYPE "RatioType" AS ENUM ('CA_MG', 'CA_P', 'K_NA', 'CU_ZN');

-- CreateEnum
CREATE TYPE "StatutRatio" AS ENUM ('BAS', 'OK', 'HAUT', 'DEFICIENCE', 'EXCES');

-- CreateEnum
CREATE TYPE "TypeSeance" AS ENUM ('KINESIO', 'REFLEXO', 'NATURO', 'BILAN_INITIAL', 'SUIVI');

-- CreateEnum
CREATE TYPE "CategoriePatho" AS ENUM ('PEAU', 'STRESS_EMOTIONNEL', 'IMMUNITE', 'SOMMEIL', 'DIGESTIF', 'FATIGUE', 'CONFIANCE', 'HYPERSENSIBILITE', 'ALLERGIES');

-- CreateEnum
CREATE TYPE "TypeRemede" AS ENUM ('COMPLEMENT', 'FLEUR_DE_BACH', 'HUILE_ESSENTIELLE', 'HOMEOPATHIE', 'GEMMOTHERAPIE', 'PHYTOTHERAPIE', 'PROBIOTIQUE', 'VITAMINE', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutProtocole" AS ENUM ('EN_COURS', 'TERMINE', 'INTERROMPU', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "CategorieAudit" AS ENUM ('STRESS', 'SOMMEIL', 'IMMUNITE', 'PEAU', 'CONFIANCE', 'DIGESTIF', 'ENERGIE');

-- CreateEnum
CREATE TYPE "TypeKpi" AS ENUM ('SOMMEIL', 'PEAU', 'CONFIANCE', 'ENERGIE', 'SERENITE', 'DIGESTION', 'IMMUNITE');

-- CreateEnum
CREATE TYPE "GroupeBach" AS ENUM ('PEUR', 'INCERTITUDE', 'INTERET_INSUFFISANT', 'SOLITUDE', 'HYPERSENSIBILITE', 'DECOURAGEMENT', 'SOUCI_EXCESSIF', 'URGENCE');

-- CreateTable
CREATE TABLE "therapeutes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "photoUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PRATICIEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapeutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familles" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "therapeuteId" TEXT NOT NULL,

    CONSTRAINT "familles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "lienParente" "LienParente" NOT NULL DEFAULT 'MERE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familleId" TEXT NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enfants" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "sexe" "Sexe" NOT NULL,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familleId" TEXT NOT NULL,

    CONSTRAINT "enfants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bilans_oligoscan" (
    "id" TEXT NOT NULL,
    "dateExamen" TIMESTAMP(3) NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enfantId" TEXT NOT NULL,
    "scoreDeficiences" DOUBLE PRECISION,
    "scoreExces" DOUBLE PRECISION,
    "scoreIntoxication" DOUBLE PRECISION,
    "stressOxydatifAgression" DOUBLE PRECISION,
    "stressOxydatifProtection" DOUBLE PRECISION,

    CONSTRAINT "bilans_oligoscan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultats_mineraux" (
    "id" TEXT NOT NULL,
    "mineral" "MineralType" NOT NULL,
    "symbole" TEXT NOT NULL,
    "resultat" DOUBLE PRECISION NOT NULL,
    "normeBas" DOUBLE PRECISION NOT NULL,
    "normeHaut" DOUBLE PRECISION NOT NULL,
    "statut" "StatutResultat" NOT NULL,
    "bilanId" TEXT NOT NULL,

    CONSTRAINT "resultats_mineraux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultats_metaux_lourds" (
    "id" TEXT NOT NULL,
    "metal" "MetalLourdType" NOT NULL,
    "symbole" TEXT NOT NULL,
    "resultat" DOUBLE PRECISION NOT NULL,
    "statut" "StatutMetalLourd" NOT NULL,
    "bilanId" TEXT NOT NULL,

    CONSTRAINT "resultats_metaux_lourds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultats_ratios" (
    "id" TEXT NOT NULL,
    "ratio" "RatioType" NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "normeBas" DOUBLE PRECISION NOT NULL,
    "normeHaut" DOUBLE PRECISION NOT NULL,
    "statut" "StatutRatio" NOT NULL,
    "bilanId" TEXT NOT NULL,

    CONSTRAINT "resultats_ratios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seances" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "typeSeance" "TypeSeance" NOT NULL,
    "dureeMinutes" INTEGER NOT NULL DEFAULT 60,
    "motif" TEXT,
    "compte_rendu" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enfantId" TEXT NOT NULL,
    "therapeuteId" TEXT NOT NULL,

    CONSTRAINT "seances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details_kinesio" (
    "id" TEXT NOT NULL,
    "emotionsIdentifiees" TEXT[],
    "testMusculaires" TEXT,
    "corrections" TEXT,
    "fleursRecommandees" TEXT[],
    "seanceId" TEXT NOT NULL,

    CONSTRAINT "details_kinesio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details_reflexo" (
    "id" TEXT NOT NULL,
    "zonesTraitees" TEXT[],
    "observations" TEXT,
    "sensibilites" TEXT[],
    "seanceId" TEXT NOT NULL,

    CONSTRAINT "details_reflexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details_naturo" (
    "id" TEXT NOT NULL,
    "bilanVital" TEXT,
    "conseilsHygiene" TEXT,
    "complementsSuggeres" TEXT[],
    "seanceId" TEXT NOT NULL,

    CONSTRAINT "details_naturo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pathologies" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" "CategoriePatho" NOT NULL,
    "description" TEXT,
    "icone" TEXT,
    "levierNaturo" TEXT,
    "levierKinesio" TEXT,
    "levierOligo" TEXT,

    CONSTRAINT "pathologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocoles" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "dureeJours" INTEGER,
    "priorite" INTEGER NOT NULL DEFAULT 1,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pathologieId" TEXT NOT NULL,
    "therapeuteId" TEXT NOT NULL,

    CONSTRAINT "protocoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remedes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "typeRemede" "TypeRemede" NOT NULL,
    "laboratoire" TEXT,
    "description" TEXT,
    "precautions" TEXT,
    "lienAchat" TEXT,

    CONSTRAINT "remedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proto_remedes" (
    "id" TEXT NOT NULL,
    "posologie" TEXT NOT NULL,
    "dureeJours" INTEGER,
    "moment" TEXT,
    "notes" TEXT,
    "protocoleId" TEXT NOT NULL,
    "remedeId" TEXT NOT NULL,

    CONSTRAINT "proto_remedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocoles_enfants" (
    "id" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" "StatutProtocole" NOT NULL DEFAULT 'EN_COURS',
    "observationsParent" TEXT,
    "observationsThera" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enfantId" TEXT NOT NULL,
    "protocoleId" TEXT NOT NULL,

    CONSTRAINT "protocoles_enfants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits_horizon" (
    "id" TEXT NOT NULL,
    "dateAudit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "scoreStress" DOUBLE PRECISION,
    "scoreSommeil" DOUBLE PRECISION,
    "scoreImmunite" DOUBLE PRECISION,
    "scorePeau" DOUBLE PRECISION,
    "scoreConfiance" DOUBLE PRECISION,
    "scoreDigestif" DOUBLE PRECISION,
    "scoreEnergie" DOUBLE PRECISION,
    "scoreResilience" DOUBLE PRECISION,
    "suggestOligoscan" BOOLEAN NOT NULL DEFAULT false,
    "zonesAlerte" TEXT[],
    "enfantId" TEXT NOT NULL,

    CONSTRAINT "audits_horizon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions_audit" (
    "id" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "categorie" "CategorieAudit" NOT NULL,
    "ordre" INTEGER NOT NULL,
    "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "questions_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options_audit" (
    "id" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "icone" TEXT,
    "valeur" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "options_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reponses_audit" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "reponses_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_vitalite" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TypeKpi" NOT NULL,
    "valeur" INTEGER NOT NULL,
    "note" TEXT,
    "enfantId" TEXT NOT NULL,

    CONSTRAINT "kpi_vitalite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiches_conseil" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "envoyeParMail" BOOLEAN NOT NULL DEFAULT false,
    "dateEnvoi" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enfantId" TEXT NOT NULL,
    "therapeuteId" TEXT NOT NULL,

    CONSTRAINT "fiches_conseil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fleurs_de_bach" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "nomLatin" TEXT NOT NULL,
    "groupe" "GroupeBach" NOT NULL,
    "description" TEXT NOT NULL,
    "indication" TEXT NOT NULL,
    "icone" TEXT,

    CONSTRAINT "fleurs_de_bach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "therapeutes_email_key" ON "therapeutes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "resultats_mineraux_bilanId_mineral_key" ON "resultats_mineraux"("bilanId", "mineral");

-- CreateIndex
CREATE UNIQUE INDEX "resultats_metaux_lourds_bilanId_metal_key" ON "resultats_metaux_lourds"("bilanId", "metal");

-- CreateIndex
CREATE UNIQUE INDEX "resultats_ratios_bilanId_ratio_key" ON "resultats_ratios"("bilanId", "ratio");

-- CreateIndex
CREATE UNIQUE INDEX "details_kinesio_seanceId_key" ON "details_kinesio"("seanceId");

-- CreateIndex
CREATE UNIQUE INDEX "details_reflexo_seanceId_key" ON "details_reflexo"("seanceId");

-- CreateIndex
CREATE UNIQUE INDEX "details_naturo_seanceId_key" ON "details_naturo"("seanceId");

-- CreateIndex
CREATE UNIQUE INDEX "pathologies_nom_key" ON "pathologies"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "proto_remedes_protocoleId_remedeId_key" ON "proto_remedes"("protocoleId", "remedeId");

-- CreateIndex
CREATE UNIQUE INDEX "reponses_audit_auditId_questionId_key" ON "reponses_audit"("auditId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "fleurs_de_bach_numero_key" ON "fleurs_de_bach"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "fleurs_de_bach_nom_key" ON "fleurs_de_bach"("nom");

-- AddForeignKey
ALTER TABLE "familles" ADD CONSTRAINT "familles_therapeuteId_fkey" FOREIGN KEY ("therapeuteId") REFERENCES "therapeutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "familles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "familles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bilans_oligoscan" ADD CONSTRAINT "bilans_oligoscan_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultats_mineraux" ADD CONSTRAINT "resultats_mineraux_bilanId_fkey" FOREIGN KEY ("bilanId") REFERENCES "bilans_oligoscan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultats_metaux_lourds" ADD CONSTRAINT "resultats_metaux_lourds_bilanId_fkey" FOREIGN KEY ("bilanId") REFERENCES "bilans_oligoscan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultats_ratios" ADD CONSTRAINT "resultats_ratios_bilanId_fkey" FOREIGN KEY ("bilanId") REFERENCES "bilans_oligoscan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seances" ADD CONSTRAINT "seances_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seances" ADD CONSTRAINT "seances_therapeuteId_fkey" FOREIGN KEY ("therapeuteId") REFERENCES "therapeutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details_kinesio" ADD CONSTRAINT "details_kinesio_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "seances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details_reflexo" ADD CONSTRAINT "details_reflexo_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "seances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details_naturo" ADD CONSTRAINT "details_naturo_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "seances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocoles" ADD CONSTRAINT "protocoles_pathologieId_fkey" FOREIGN KEY ("pathologieId") REFERENCES "pathologies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocoles" ADD CONSTRAINT "protocoles_therapeuteId_fkey" FOREIGN KEY ("therapeuteId") REFERENCES "therapeutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proto_remedes" ADD CONSTRAINT "proto_remedes_protocoleId_fkey" FOREIGN KEY ("protocoleId") REFERENCES "protocoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proto_remedes" ADD CONSTRAINT "proto_remedes_remedeId_fkey" FOREIGN KEY ("remedeId") REFERENCES "remedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocoles_enfants" ADD CONSTRAINT "protocoles_enfants_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocoles_enfants" ADD CONSTRAINT "protocoles_enfants_protocoleId_fkey" FOREIGN KEY ("protocoleId") REFERENCES "protocoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits_horizon" ADD CONSTRAINT "audits_horizon_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options_audit" ADD CONSTRAINT "options_audit_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions_audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reponses_audit" ADD CONSTRAINT "reponses_audit_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "audits_horizon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reponses_audit" ADD CONSTRAINT "reponses_audit_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions_audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reponses_audit" ADD CONSTRAINT "reponses_audit_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "options_audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_vitalite" ADD CONSTRAINT "kpi_vitalite_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiches_conseil" ADD CONSTRAINT "fiches_conseil_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiches_conseil" ADD CONSTRAINT "fiches_conseil_therapeuteId_fkey" FOREIGN KEY ("therapeuteId") REFERENCES "therapeutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
