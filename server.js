require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');
const SITE_CONFIG = require('./config/site.js');

// Prisma : disponible si DATABASE_URL est configurée
let prisma = null;
if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    console.log('Prisma connecté à la base de données.');
  } catch (e) {
    console.warn('Prisma non disponible, mode JSON actif.', e.message);
  }
}

// ─── Constantes dérivées de la config + env ────────────────────────────────
const SITE_URL = process.env.SITE_URL || SITE_CONFIG.SITE_URL;
// Adresse de réception des bilans (configurable indépendamment de l'email public)
const PRACTITIONER_EMAIL = process.env.PRACTITIONER_EMAIL || process.env.CONTACT_EMAIL;

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Redirection Railway → domaine définitif (301) ─────────────────────────
app.use((req, res, next) => {
  const host = req.hostname || '';
  if (host.endsWith('.railway.app') || host.endsWith('.up.railway.app')) {
    return res.redirect(301, SITE_URL + req.url);
  }
  next();
});

const AUDITS_FILE = path.join(__dirname, 'data', 'audits.json');
const AVIS_FILE = path.join(__dirname, 'config', 'avis.json');

// S'assurer que les répertoires existent (nécessaire sur Railway)
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'config'), { recursive: true });

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Partials (chargés une fois au démarrage) ──────────────
const NAV        = fs.readFileSync(path.join(__dirname, 'partials/nav.html'), 'utf8');
const FOOTER     = fs.readFileSync(path.join(__dirname, 'partials/footer.html'), 'utf8');
const CTA        = fs.readFileSync(path.join(__dirname, 'partials/cta.html'), 'utf8');
const DISCLAIMER = fs.readFileSync(path.join(__dirname, 'partials/disclaimer.html'), 'utf8');

function buildPage(filePath, { activePath = '/', noCta = false, canonicalPath = null } = {}) {
  const html = fs.readFileSync(filePath, 'utf8');
  const nav = NAV.replace(`href="${activePath}"`, `href="${activePath}" class="active"`);
  const canonFull = SITE_URL + (canonicalPath || activePath);
  // Remplace l'ancienne URL Railway partout dans la page (canonique, JSON-LD, etc.)
  const canonicalTag = `<link rel="canonical" href="${canonFull}">`;
  const ogUrlTag = `<meta property="og:url" content="${canonFull}">`;
  return html
    .replace('<!-- INJECT:NAV -->', nav)
    .replace('<!-- INJECT:CTA -->', noCta ? '' : CTA)
    .replace('<!-- INJECT:DISCLAIMER -->', DISCLAIMER)
    .replace('<!-- INJECT:FOOTER -->', FOOTER)
    // Injecte ou remplace le canonical
    .replace(/<link rel="canonical"[^>]*>\n?/g, '')
    // Injecte ou remplace og:url
    .replace(/<meta property="og:url"[^>]*>\n?/g, '')
    .replace('</head>', `${canonicalTag}\n${ogUrlTag}\n</head>`)
    // Remplace toutes les anciennes URLs Railway par SITE_URL
    .replace(/https:\/\/naturopathie-arielle-production\.up\.railway\.app/g, SITE_URL);
}

function loadAudits() {
  try { return JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8')); }
  catch { return []; }
}
function saveAudit(entry) {
  const audits = loadAudits();
  audits.unshift(entry);
  fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));
}
function loadAvis() {
  try { return JSON.parse(fs.readFileSync(AVIS_FILE, 'utf8')); }
  catch { return { afficherBlocAvis: false, note: 5.0, nombreAvis: 0, urlGoogleBusiness: '', avis: [] }; }
}

// ─── Static files (images, CSS, JS — hors HTML) ───────────────────────────
// NOTE : déclaré APRÈS les routes HTML pour que buildPage() soit prioritaire.
// Express static est ici uniquement pour servir les assets (images, style.css…)
// Il sera également enregistré après toutes les routes (voir bas de fichier).

// Serve jsPDF locally (évite dépendance CDN)
app.get('/jspdf.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js'));
});

// ─── robots.txt ────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\n` +
    `# Fichiers techniques de signature mail — ne pas indexer\n` +
    `Disallow: /logo-signature.png\n` +
    `Disallow: /signature-finale.html\n` +
    `Sitemap: ${SITE_URL}/sitemap.xml\n`
  );
});

// ─── Sitemap ───────────────────────────────────────────────────────────────
const ARTICLES = require('./public/articles.json');

function isPublished(dateStr) {
  // Fuseau Europe/Paris (CEST été = +02:00)
  const d = new Date(dateStr + 'T00:00:00+02:00');
  return new Date() >= d;
}

app.get('/sitemap.xml', (req, res) => {
  const base = SITE_URL;
  const today = new Date().toISOString().slice(0, 10);
  const publishedArticleUrls = ARTICLES
    .filter(a => isPublished(a.date))
    .map(a => ({ loc: `/publications/${a.slug}`, priority: '0.6', changefreq: 'yearly' }));
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/methode', priority: '0.8', changefreq: 'monthly' },
    { loc: '/tarifs', priority: '0.8', changefreq: 'monthly' },
    { loc: '/rendez-vous', priority: '0.9', changefreq: 'monthly' },
    { loc: '/bilan', priority: '0.7', changefreq: 'monthly' },
    { loc: '/publications', priority: '0.8', changefreq: 'weekly' },
    ...publishedArticleUrls,
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
    { loc: '/cgv', priority: '0.3', changefreq: 'yearly' },
    { loc: '/confidentialite', priority: '0.3', changefreq: 'yearly' },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${base}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

// ─── Page routes ───────────────────────────────────────────────────────────
app.get('/',          (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'index.html'),                       { activePath: '/' })));
app.get('/about',     (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'about.html'),                      { activePath: '/about' })));
app.get('/methode',   (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'methode.html'),                    { activePath: '/methode' })));
app.get('/tarifs',    (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'tarifs-accompagnement.html'),      { activePath: '/tarifs' })));
app.get('/audit',     (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'audit.html'),                      { activePath: '/audit', noCta: true })));
app.get('/bilan',     (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'audit.html'),                      { activePath: '/audit', noCta: true })));
app.get('/contact',   (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'contact.html'),                    { activePath: '/contact', noCta: true })));
app.get('/crm',       (req, res) => res.sendFile(path.join(__dirname, 'public', 'crm.html')));

// Page rendez-vous (injecte VISIO_BOOKING_ACTIVE côté serveur)
app.get('/rendez-vous', (req, res) => {
  let html = buildPage(path.join(__dirname, 'public', 'rendez-vous.html'), { activePath: '/rendez-vous', noCta: true });
  html = html.replace('<!-- INJECT:VISIO_ACTIVE -->', SITE_CONFIG.VISIO_BOOKING_ACTIVE ? 'true' : 'false');
  res.send(html);
});

// Pages légales
app.get('/mentions-legales', (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'mentions-legales.html'),    { activePath: '/mentions-legales', noCta: true })));
app.get('/cgv',              (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'cgv.html'),                 { activePath: '/cgv', noCta: true })));
app.get('/confidentialite',  (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'confidentialite.html'),     { activePath: '/confidentialite',  noCta: true })));

// Redirect /guides → /publications (301 permanent)
app.get('/guides',           (req, res) => res.redirect(301, '/publications'));
app.get('/guides-pratiques', (req, res) => res.redirect(301, '/publications'));

// Publications index
app.get('/publications', (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'guides-pratiques.html'), { activePath: '/publications' })));

// Publications articles avec filtrage par date
app.get('/publications/:slug', (req, res) => {
  const art = ARTICLES.find(a => a.slug === req.params.slug);
  if (!art || !isPublished(art.date)) {
    return res.status(404).send(buildPage(path.join(__dirname, 'public', 'index.html'), { activePath: '/' }));
  }
  res.send(buildPage(
    path.join(__dirname, 'public', 'publications', `${req.params.slug}.html`),
    { activePath: '/publications', canonicalPath: `/publications/${req.params.slug}` }
  ));
});

// ─── QR code pour le PDF bilan ─────────────────────────────────────────────
app.get('/api/qrcode', async (req, res) => {
  try {
    const QRCode = require('qrcode');
    const url = req.query.url || `${SITE_URL}/rendez-vous`;
    const dataUrl = await QRCode.toDataURL(url, { width: 120, margin: 1, color: { dark: '#0F3540', light: '#FFFFFF' } });
    res.json({ dataUrl });
  } catch(err) {
    res.status(500).json({ ok: false });
  }
});

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Config avis ───────────────────────────────────────────────────────────
app.get('/api/config/avis', (req, res) => {
  res.json(loadAvis());
});

// ─── Helper : email détaillé pour la praticienne ──────────────────────────
function buildPractitionerEmail(body) {
  const { childName, childAge, profileLabel, globalScore, charges, suggestReflexo,
          date, clientEmail, reponses, followUpAnswers, prenom, nom } = body;

  const PETAL_NAMES = { sommeil:'Sommeil', eclat:'Éclat', serenite:'Sérénité', immunite:'Immunité', confiance:'Confiance' };
  const toScore = c => Math.round(Math.max(0, (12 - c) / 12 * 100));
  const lvl = c => c <= 3 ? 'good' : c <= 6 ? 'watch' : 'alert';
  const LVL_LABELS = { good:'Équilibre', watch:'À surveiller', alert:'À accompagner' };
  const LVL_COLORS = { good:'#4E6B48', watch:'#D4860A', alert:'#C0392B' };
  const LVL_BG     = { good:'#EEF5EC',  watch:'#FEF5E7',  alert:'#FDEDEC' };

  const dateStr = new Date(date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  const allCharges = charges || {};
  const petals = Object.keys(allCharges);
  const sorted = [...petals].sort((a, b) => (allCharges[b] || 0) - (allCharges[a] || 0));

  // Tableau récapitulatif
  const summaryRows = sorted.map(k => {
    const c = allCharges[k] || 0;
    const s = toScore(c);
    const l = lvl(c);
    return `<tr style="background:${LVL_BG[l]}">
      <td style="padding:9px 12px;font-weight:500">${PETAL_NAMES[k]||k}</td>
      <td style="padding:9px 12px;text-align:center;font-size:16px;font-weight:700;color:#1B4D5C">${s}/100</td>
      <td style="padding:9px 12px;color:${LVL_COLORS[l]};font-weight:500">${LVL_LABELS[l]}</td>
    </tr>`;
  }).join('');

  // Q&A regroupées par thème (même ordre que le tableau)
  let qaHtml = '';
  if (reponses && reponses.length) {
    const byPetal = {};
    reponses.forEach(r => {
      if (!byPetal[r.petale]) byPetal[r.petale] = { label: r.theme, questions: [] };
      byPetal[r.petale].questions.push(r);
    });

    // Follow-up allergies : extraire toutes les réponses (clés imm3)
    const followUpList = [];
    if (followUpAnswers && typeof followUpAnswers === 'object') {
      Object.values(followUpAnswers).forEach(arr => {
        if (Array.isArray(arr)) arr.forEach(v => { if (v && v !== 'Non renseigné') followUpList.push(v); });
      });
    }
    const uniqueFollowUp = [...new Set(followUpList)];

    sorted.forEach(k => {
      const group = byPetal[k];
      if (!group) return;
      const c = allCharges[k] || 0;
      const s = toScore(c);
      const l = lvl(c);
      qaHtml += `<div style="margin-bottom:24px">
        <h3 style="font-family:Georgia,serif;font-size:15px;font-weight:400;color:#1B4D5C;margin:0 0 4px;border-bottom:1px solid #C4A265;padding-bottom:6px">
          ${PETAL_NAMES[k]||k} <span style="font-size:12px;color:${LVL_COLORS[l]};font-weight:normal">— ${s}/100 · ${LVL_LABELS[l]}</span>
        </h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:6px">`;
      group.questions.forEach((r, i) => {
        qaHtml += `<tr style="background:${i%2===0?'#FFFFFF':'#F7F4EE'}">
          <td style="padding:7px 10px;color:#5A6E68;width:56%;vertical-align:top">${r.question}</td>
          <td style="padding:7px 10px;font-weight:500;vertical-align:top">${r.reponse || '—'}</td>
        </tr>`;
      });
      qaHtml += '</table>';
      if (k === 'immunite' && uniqueFollowUp.length > 0) {
        qaHtml += `<p style="margin:8px 0 0;padding:8px 12px;background:#FEF5E7;border-left:3px solid #D4860A;font-size:12px;color:#5A6E68">
          <strong>Allergies / intolérances signalées :</strong> ${uniqueFollowUp.join(', ')}
        </p>`;
      }
      qaHtml += '</div>';
    });
  }

  const reflexoLine = suggestReflexo
    ? '<p style="background:#EEF5EC;border-left:3px solid #4E6B48;padding:10px 14px;margin:12px 0 0;font-size:13px"><strong>Réflexologie recommandée</strong> pour ce profil.</p>'
    : '';
  const contactLine = [prenom, nom].filter(Boolean).join(' ');

  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#2C3E3A;background:#FAF7F2">
    <div style="background:#0F3540;padding:28px 32px;text-align:center">
      <h1 style="color:#FAF7F2;font-size:22px;font-weight:400;margin:0;font-family:Georgia,serif">Horizon &amp; Équilibre</h1>
      <p style="color:#C4A265;font-size:11px;margin:8px 0 0;letter-spacing:2px;text-transform:uppercase">Bilan Horizon Santé</p>
    </div>
    <div style="background:#FAF7F2;padding:24px 32px;border-bottom:1px solid #E8E3DA">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:5px 0;color:#5A6E68;width:140px">Prénom</td><td style="padding:5px 0;font-weight:600;font-size:16px">${childName}</td></tr>
        <tr><td style="padding:5px 0;color:#5A6E68">Profil</td><td style="padding:5px 0">${profileLabel || childAge}</td></tr>
        <tr><td style="padding:5px 0;color:#5A6E68">Date</td><td style="padding:5px 0">${dateStr}</td></tr>
        ${clientEmail ? `<tr><td style="padding:5px 0;color:#5A6E68">Email</td><td style="padding:5px 0"><a href="mailto:${clientEmail}" style="color:#1B4D5C">${clientEmail}</a></td></tr>` : ''}
        ${contactLine ? `<tr><td style="padding:5px 0;color:#5A6E68">Contact</td><td style="padding:5px 0">${contactLine}</td></tr>` : ''}
        <tr><td style="padding:10px 0 5px;color:#5A6E68;font-weight:600">Score global</td><td style="padding:10px 0 5px;font-size:22px;font-weight:700;color:#1B4D5C">${globalScore}/100</td></tr>
      </table>
      ${reflexoLine}
    </div>
    <div style="background:#FFFFFF;padding:24px 32px">
      <h2 style="font-family:Georgia,serif;color:#1B4D5C;font-size:18px;font-weight:400;margin:0 0 14px">Tableau récapitulatif</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#1B4D5C;color:#FAF7F2">
          <th style="padding:10px 12px;text-align:left;font-weight:500">Thème</th>
          <th style="padding:10px 12px;text-align:center;font-weight:500">Vitalité</th>
          <th style="padding:10px 12px;text-align:left;font-weight:500">Niveau</th>
        </tr></thead>
        <tbody>${summaryRows}</tbody>
      </table>
    </div>
    ${qaHtml ? `<div style="background:#FAF7F2;padding:24px 32px;border-top:1px solid #E8E3DA">
      <h2 style="font-family:Georgia,serif;color:#1B4D5C;font-size:18px;font-weight:400;margin:0 0 20px">Détail des réponses</h2>
      ${qaHtml}
    </div>` : ''}
    <div style="background:#0F3540;padding:16px 32px;text-align:center">
      <p style="color:rgba(250,247,242,.45);font-size:11px;margin:0">Bilan généré automatiquement · Horizon &amp; Équilibre</p>
    </div>
  </div>`;
}

// ─── Audit result silencieux (scores seuls, sans PDF) ─────────────────────
app.post('/api/audit-result', express.json(), async (req, res) => {
  try {
    const { childName, childAge, profileLabel, globalScore, charges, zones, suggestReflexo, date, clientEmail } = req.body;

    saveAudit({ childName, childAge, globalScore, charges, zones, suggestReflexo: suggestReflexo || false, date, clientEmail: clientEmail || null, hasPdf: false, receivedAt: new Date().toISOString() });

    const dateStr = new Date(date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [PRACTITIONER_EMAIL],
      subject: `Bilan Horizon Santé : ${childName}, ${profileLabel || childAge}, ${dateStr}`,
      html: buildPractitionerEmail(req.body)
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('audit-result error:', err.message);
    res.status(500).json({ ok: false });
  }
});

// ─── Envoi PDF audit (client + Arielle) ───────────────────────────────────
app.post('/api/send-audit-pdf', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { childName, childAge, prenom, nom, globalScore, charges, zones, suggestReflexo, date, clientEmail, pdfBase64 } = req.body;

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const filename = `Audit_Horizon_Sante_${childName}_${new Date(date).toISOString().slice(0, 10)}.pdf`;

    const audits = loadAudits();
    const existing = audits.find(a => a.childName === childName && a.date === date);
    if (existing) { existing.hasPdf = true; existing.clientEmail = clientEmail || existing.clientEmail; }
    else { audits.unshift({ childName, childAge, prenom: prenom||null, nom: nom||null, globalScore, charges, zones, suggestReflexo: suggestReflexo || false, date, clientEmail: clientEmail || null, hasPdf: true, receivedAt: new Date().toISOString() }); }
    fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));

    if (prisma) {
      try {
        await prisma.leadAudit.create({
          data: {
            prenom: prenom||null,
            nom: nom||null,
            email: clientEmail||null,
            childName,
            childAge: childAge||null,
            globalScore: globalScore||null,
            zonesAlerte: zones.map(z=>z.petale)||[],
            suggestReflexo: !!suggestReflexo,
          }
        });
      } catch(e){ console.warn('Prisma leadAudit skip:', e.message); }
    }

    const attachment = { filename, content: pdfBuffer, contentType: 'application/pdf' };
    const dateStr = new Date(date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
    const practitionerSubject = `Bilan Horizon Santé : ${childName}, ${req.body.profileLabel || childAge}, ${dateStr}`;
    const summaryHtml = buildPractitionerEmail(req.body);

    if (clientEmail) {
      const rdvUrl = `${SITE_URL}/rendez-vous`;
      const clientHtml = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2C3E3A">
  <div style="background:#1B4D5C;padding:32px;text-align:center">
    <h1 style="color:#FAF7F2;font-size:1.6rem;font-weight:400;margin:0">Horizon &amp; Équilibre</h1>
    <p style="color:#C4A265;font-size:.85rem;margin:8px 0 0">Naturopathie · Réflexologie · Fleurs de Bach</p>
  </div>
  <div style="padding:32px;background:#FAF7F2">
    <p>Bonjour ${prenom||''},</p>
    <p>Veuillez trouver en pièce jointe le rapport de synthèse du bilan réalisé pour <strong>${childName}</strong>.</p>
    <p>Ce document présente une évaluation de sa vitalité actuelle selon cinq axes : le sommeil, les surcharges (émonctoires), le stress, l'immunité et la confiance en soi.</p>
    <h3 style="color:#1B4D5C;border-bottom:1px solid #C4A265;padding-bottom:8px">Analyse de la synthèse</h3>
    <p>Les scores obtenus permettent d'identifier les zones d'équilibre et les points de vigilance qui nécessitent un soutien. Les recommandations mentionnées dans le rapport constituent de premières pistes en hygiène de vie pour accompagner votre enfant au quotidien.</p>
    <h3 style="color:#1B4D5C;border-bottom:1px solid #C4A265;padding-bottom:8px">Prochaines étapes</h3>
    <p>Ce bilan gagne à être complété par une consultation au cabinet afin de définir un programme personnalisé et adapté. Lors du premier bilan naturopathique (1h30), Arielle pourra approfondir ces résultats et co-construire un programme naturopathique sur mesure.</p>
    <p>Pour prendre rendez-vous au cabinet de Sainte-Consorce ou en visio :<br>
    <a href="${rdvUrl}" style="color:#1B4D5C;font-weight:600">${rdvUrl}</a></p>
    <p style="margin-top:32px">Bien à vous,</p>
    <p style="font-size:.85rem;color:#5A6E68">Arielle de Maistre<br>Naturopathe · Réflexologue<br>Cabinet de Sainte-Consorce (69280)</p>
  </div>
</div>`;
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [clientEmail],
        reply_to: process.env.CONTACT_EMAIL,
        subject: `📩 Rapport de Bilan Horizon Santé — ${childName}`,
        html: clientHtml,
        attachments: [attachment]
      });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [PRACTITIONER_EMAIL],
      subject: practitionerSubject,
      html: summaryHtml,
      attachments: [attachment]
    });

    res.json({ ok: true, sentToClient: !!clientEmail });
  } catch (err) {
    console.error('send-pdf error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── CRM : liste des audits ────────────────────────────────────────────────
app.get('/api/audits', (req, res) => {
  res.json(loadAudits());
});

// ─── Contact formulaire ────────────────────────────────────────────────────
app.post('/api/contact', express.json(), async (req, res) => {
  try {
    const { prenom, email, tel, ageEnfant, objet, message, honeypot } = req.body;
    if (honeypot) return res.json({ ok: true });
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      reply_to: email,
      subject: `📩 Contact Horizon & Équilibre — ${objet} (${prenom})`,
      html: `<h2>Nouveau message</h2>
        <p><strong>De :</strong> ${prenom} (${email})${tel ? ` · Tel : ${tel}` : ''}</p>
        ${ageEnfant ? `<p><strong>Âge de l'enfant :</strong> ${ageEnfant}</p>` : ''}
        <p><strong>Objet :</strong> ${objet}</p>
        <p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p>`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('contact mail error:', err.message);
    res.status(500).json({ ok: false });
  }
});

// ─── Bilan PDF (Puppeteer) ─────────────────────────────────────────────────
const BILAN_TEXTES = require('./public/bilan-textes.js');

const PETAL_ORDER = ['sommeil', 'eclat', 'serenite', 'immunite', 'confiance'];
const PETAL_META = {
  sommeil:   { label: 'Sommeil',   name: 'SOMMEIL',   cx: 180.0, cy: 98.0,  rotate: 0,   tx: 180.0, ty: 27.0 },
  eclat:     { label: 'Éclat',     name: 'ÉCLAT',     cx: 229.5, cy: 133.9, rotate: 72,  tx: 322.7, ty: 109.9 },
  serenite:  { label: 'Sérénité',  name: 'SÉRÉNITÉ',  cx: 210.6, cy: 192.1, rotate: 144, tx: 268.2, ty: 244.1 },
  immunite:  { label: 'Immunité',  name: 'IMMUNITÉ',  cx: 149.4, cy: 192.1, rotate: 216, tx: 91.8,  ty: 244.1 },
  confiance: { label: 'Confiance', name: 'CONFIANCE', cx: 130.5, cy: 133.9, rotate: 288, tx: 37.3,  ty: 109.9 }
};
const STATE_STYLES = {
  accompagner: { fill: '#F4D2CA', stroke: '#C0453A', sw: 4,   textColor: '#C0453A', stateLabel: 'À accompagner', chipBg: '#C0453A', chipColor: '#FFFFFF', dotFill: '#F4D2CA', dotStroke: '#C0453A', dotSw: 2.6 },
  soutenir:    { fill: '#C6D4C2', stroke: '#fff',    sw: 1.5, textColor: '#4F6B4C', stateLabel: 'À soutenir',    chipBg: '#E7EFE5', chipColor: '#4F6B4C', dotFill: '#C6D4C2', dotStroke: '#8FA98B', dotSw: 1.3 },
  equilibre:   { fill: '#E8D8B6', stroke: '#fff',    sw: 1.5, textColor: '#8A6D3B', stateLabel: 'En équilibre',  chipBg: '#F4EBD9', chipColor: '#8A6D3B', dotFill: '#E8D8B6', dotStroke: '#C4A265', dotSw: 1.3 }
};
const POSSESSIVES = {
  sommeil:   { child: 'son sommeil',   adult: 'votre sommeil' },
  eclat:     { child: 'son éclat',     adult: 'votre éclat' },
  serenite:  { child: 'sa sérénité',   adult: 'votre sérénité' },
  immunite:  { child: 'son immunité',  adult: 'votre immunité' },
  confiance: { child: 'sa confiance',  adult: 'votre confiance' }
};

function chargeToState(c) {
  if (c <= 3) return 'equilibre';
  if (c <= 6) return 'soutenir';
  return 'accompagner';
}

function fillText(text, prenom) {
  if (!text) return '';
  const vowels = 'aeéèêëiîïoôuûùüAEÉÈÊËIÎÏOÔUÛÙÜhH';
  const first = (prenom || '')[0] || '';
  const dP = vowels.includes(first) ? `d'${prenom}` : `de ${prenom}`;
  return text.replace(/\{p\}/g, prenom).replace(/\{dP\}/g, dP);
}

function buildLeadHtml(states, sortedKeys, childName, profile) {
  const isAdult = profile === 'C';
  const accompagnerList = sortedKeys.filter(k => states[k] === 'accompagner');
  const equilibreList   = sortedKeys.filter(k => states[k] === 'equilibre');

  if (accompagnerList.length === 0) {
    // Tout en équilibre
    if (isAdult) {
      return `Votre bilan révèle un bel équilibre global sur les cinq dimensions. <em>Quelques petits ajustements permettraient de le consolider durablement.</em>`;
    }
    return `Le bilan de ${childName} révèle un bel équilibre global sur les cinq dimensions. <em>Quelques petits ajustements permettraient de le consolider durablement.</em>`;
  }

  const worst = accompagnerList[0];
  const txt   = BILAN_TEXTES[worst]?.accompagner?.[profile] || {};
  const synthese = fillText(txt.synthese_phrase || '', childName);

  let firstPart = '';
  if (equilibreList.length > 0) {
    const key  = isAdult ? 'adult' : 'child';
    const parts = equilibreList.map(k => POSSESSIVES[k][key]);
    const verb  = parts.length > 1 ? 'sont' : 'est';
    const list  = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' et ' + parts[parts.length - 1];
    if (isAdult) {
      firstPart = `Vous avez de belles ressources\u00a0: ${list} ${verb} en équilibre. `;
    } else {
      firstPart = `${childName} a de belles ressources\u00a0: ${list} ${verb} en équilibre. `;
    }
  }

  return `${firstPart}<em>${synthese}</em>`;
}

function buildCardHtml(key, state, profile, childName, isBig) {
  const meta  = PETAL_META[key];
  const style = STATE_STYLES[state];
  const texts = BILAN_TEXTES[key]?.[state]?.[profile] || {};

  const chipStyle = `background:${style.chipBg};color:${style.chipColor}`;
  const dot  = `<svg viewBox="0 0 16 16" class="dot"><circle cx="8" cy="8" r="6" fill="${style.dotFill}" stroke="${style.dotStroke}" stroke-width="${style.dotSw}"/></svg>`;
  const head = `<div class="ch">${dot}<span class="cn">${meta.label}</span><span class="chip" style="${chipStyle}">${style.stateLabel}</span></div>`;

  const obsText = fillText(texts.observation || '', childName);
  const obs = isBig && state === 'accompagner'
    ? `<p class="obs">${obsText} <b>C'est le point pour lequel un rendez-vous est recommandé.</b></p>`
    : `<p class="obs">${obsText}</p>`;

  let body = head + obs;

  if (state === 'accompagner') {
    if (isBig) {
      body += `<div class="why"><span>Ce qu'une consultation apporterait</span>${fillText(texts.consultation || '', childName)}</div>`;
    }
    body += `<p class="geste"><span>En attendant le rendez-vous</span>${fillText(texts.geste_attente || '', childName)}</p>`;
  } else if (state === 'soutenir') {
    body += `<p class="cab">${fillText(texts.cabinet || '', childName)}</p>`;
    body += `<p class="geste"><span>Petit geste</span>${fillText(texts.geste || '', childName)}</p>`;
  } else {
    body += `<p class="geste"><span>Petit geste</span>${fillText(texts.geste || '', childName)}</p>`;
  }

  const cls = `card${isBig ? ' big' : ''} ${state}`;
  return `<div class="${cls}">${body}</div>`;
}

async function buildBilanHtml(data) {
  const {
    childName, childAge, charges = {},
    prenom, profileLabel, date
  } = data;

  const profile = childAge || 'C';
  const isAdult = profile === 'C';
  const QRCode  = require('qrcode');

  // États de chaque pétale
  const states = {};
  PETAL_ORDER.forEach(k => { states[k] = chargeToState(charges[k] || 0); });

  // Tri par charge décroissante
  const sorted = PETAL_ORDER.slice().sort((a, b) => (charges[b] || 0) - (charges[a] || 0));

  // QR code (SVG inline) → pointe vers /rendez-vous
  const contactUrl = `${SITE_URL}/rendez-vous`;
  let qrRaw = await QRCode.toString(contactUrl, { type: 'svg', width: 84, margin: 0, color: { dark: '#1b4d5c', light: '#FAF7F2' } });
  // Supprimer l'en-tête XML/DOCTYPE
  qrRaw = qrRaw.replace(/<\?xml[^?]*\?>/i, '').replace(/<!DOCTYPE[^>]*>/i, '').trim();

  // Date formatée
  const dateObj  = date ? new Date(date) : new Date();
  const dateStr  = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  // Lead
  const leadHtml = buildLeadHtml(states, sorted, childName, profile);

  // How text
  const howProp = isAdult ? 'ce qui vous est propre et vous accompagner sur mesure' : `ce qui est propre à ${childName} et l'accompagner sur mesure`;
  const howHtml = `<p class="how">Plus un pétale est doré, plus cet aspect est en équilibre. Un pétale rouge signale celui à accompagner en premier.</p><p class="how">Les petits gestes ci-dessous sont des repères valables pour tous. Une consultation permet d'aller plus loin : comprendre ${howProp}.</p>`;

  // Fleur SVG
  const petalsSvg = PETAL_ORDER.map(k => {
    const m = PETAL_META[k];
    const s = STATE_STYLES[states[k]];
    return `<ellipse cx="${m.cx}" cy="${m.cy}" rx="28" ry="48" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.sw}" transform="rotate(${m.rotate} ${m.cx} ${m.cy})"/>`;
  }).join('');
  const labelsTop = `
<text x="180.0" y="27.0" text-anchor="middle" class="pn">SOMMEIL</text>
<text x="180.0" y="42.0" text-anchor="middle" class="ps" fill="${STATE_STYLES[states.sommeil].textColor}">${STATE_STYLES[states.sommeil].stateLabel}</text>
<text x="322.7" y="109.9" text-anchor="middle" class="pn">ÉCLAT</text>
<text x="322.7" y="124.9" text-anchor="middle" class="ps" fill="${STATE_STYLES[states.eclat].textColor}">${STATE_STYLES[states.eclat].stateLabel}</text>
<text x="268.2" y="244.1" text-anchor="middle" class="pn">SÉRÉNITÉ</text>
<text x="268.2" y="259.1" text-anchor="middle" class="ps" fill="${STATE_STYLES[states.serenite].textColor}">${STATE_STYLES[states.serenite].stateLabel}</text>
<text x="91.8" y="244.1" text-anchor="middle" class="pn">IMMUNITÉ</text>
<text x="91.8" y="259.1" text-anchor="middle" class="ps" fill="${STATE_STYLES[states.immunite].textColor}">${STATE_STYLES[states.immunite].stateLabel}</text>
<text x="37.3" y="109.9" text-anchor="middle" class="pn">CONFIANCE</text>
<text x="37.3" y="124.9" text-anchor="middle" class="ps" fill="${STATE_STYLES[states.confiance].textColor}">${STATE_STYLES[states.confiance].stateLabel}</text>`;
  const centerSvg = `<circle cx="180" cy="150" r="21" fill="#FAF7F2" stroke="#C4A265" stroke-width="1.2"/>
<path d="M169 154 A11 11 0 0 1 191 154 Z" fill="#C4A265"/>
<path d="M166 158 q3.5 -3 7 0 t7 0 t7 0 t7 0" fill="none" stroke="#8FA98B" stroke-width="1.4"/>`;
  const flowerSvg = `<svg viewBox="0 0 360 290" class="flower">${petalsSvg}${centerSvg}${labelsTop}</svg>`;

  // Cards
  const accompagnerList = sorted.filter(k => states[k] === 'accompagner');
  const otherList       = sorted.filter(k => states[k] !== 'accompagner');

  let bigCardHtml = '';
  if (accompagnerList.length > 0) {
    bigCardHtml = buildCardHtml(accompagnerList[0], 'accompagner', profile, childName, true);
  }

  // Cartes dans la grille : les accompagner non-pires + les autres (soutenir + equilibre)
  const gridKeys = [
    ...accompagnerList.slice(1),
    ...otherList
  ];
  // Trier la grille : soutenir avant equilibre, accompagner (s'il y en a) en premier
  gridKeys.sort((a, b) => {
    const order = { accompagner: 0, soutenir: 1, equilibre: 2 };
    return order[states[a]] - order[states[b]];
  });
  const gridHtml = gridKeys.length > 0
    ? `<div class="grid">${gridKeys.map(k => buildCardHtml(k, states[k], profile, childName, false)).join('')}</div>`
    : '';

  // CTA encadré
  const encTexts = BILAN_TEXTES.encadre?.[profile] || BILAN_TEXTES.encadre?.C || {};
  const allEquilibre = accompagnerList.length === 0;
  let ctaTitre, ctaIntro, ctaPuce1, ctaPuce2, ctaPuce3;
  if (allEquilibre) {
    const eq = BILAN_TEXTES.encadre?.equilibre || {};
    ctaTitre = isAdult ? (eq.titre_adulte || '') : fillText(eq.titre_enfant || '', childName);
    ctaIntro = fillText(eq.intro || '', childName);
    ctaPuce1 = isAdult ? (eq.puce1_adulte || '') : fillText(eq.puce1_enfant || '', childName);
    ctaPuce2 = eq.puce2 || '';
    ctaPuce3 = eq.puce3 || '';
  } else {
    ctaTitre = fillText(encTexts.titre || '', childName);
    ctaIntro = fillText(encTexts.intro || '', childName);
    ctaPuce1 = fillText(encTexts.puce1 || '', childName);
    ctaPuce2 = encTexts.puce2 || '';
    ctaPuce3 = fillText(encTexts.puce3 || '', childName);
  }

  const waysHtml = `<p class="ways">Au cabinet de Sainte-Consorce, en visio ou à domicile &nbsp;·&nbsp; <a href="tel:+33651140726">06\u202f51\u202f14\u202f07\u202f26</a> &nbsp;·&nbsp; <a href="${SITE_URL}/rendez-vous">Prendre rendez-vous en ligne</a></p>`;

  const ctaHtml = `<div class="cta"><div style="flex:1">
<h2>${ctaTitre}</h2>
<p>${ctaIntro}</p>
<ul><li>${ctaPuce1}</li><li>${ctaPuce2}</li><li>${ctaPuce3}</li></ul>
${waysHtml}
</div><div class="qr">${qrRaw}<small>Prendre rendez-vous</small></div></div>`;

  // Titre et sous-titre
  const titreH1 = isAdult ? `Mon bilan` : `Le bilan de ${childName}`;
  const subLine = `Bilan Horizon Santé · ${profileLabel || ''}`;

  // Pied de page
  const footHtml = `<div class="foot"><b>Arielle de Maistre</b> · Naturopathe certifiée FEDE · Réflexologue · Sainte-Consorce (69280)<br>Ce bilan est une première orientation de bien-être et de prévention, établie à partir de vos réponses. Il ne constitue ni un diagnostic, ni un avis médical, et ne remplace pas un suivi par votre médecin.</div>`;

  // Fonts via serveur local
  const base = `http://localhost:${PORT}`;
  const fontFaces = `
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:400;src:url('${base}/fonts/cormorant-garamond-400.ttf') format('truetype')}
@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:400;src:url('${base}/fonts/cormorant-garamond-400i.ttf') format('truetype')}
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:500;src:url('${base}/fonts/cormorant-garamond-400.ttf') format('truetype')}
@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:500;src:url('${base}/fonts/cormorant-garamond-400i.ttf') format('truetype')}
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:600;src:url('${base}/fonts/cormorant-garamond-600.ttf') format('truetype')}
@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:600;src:url('${base}/fonts/cormorant-garamond-600i.ttf') format('truetype')}
@font-face{font-family:'Outfit';font-style:normal;font-weight:300;src:url('${base}/fonts/outfit-300.ttf') format('truetype')}
@font-face{font-family:'Outfit';font-style:normal;font-weight:400;src:url('${base}/fonts/outfit-400.ttf') format('truetype')}
@font-face{font-family:'Outfit';font-style:normal;font-weight:500;src:url('${base}/fonts/outfit-500.ttf') format('truetype')}`;

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Bilan Horizon Santé — ${childName}</title>
<style>
${fontFaces}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Outfit,sans-serif;font-weight:300;color:#2C3E3A;background:#fff;width:210mm;height:297mm;position:relative;font-size:8.3pt;line-height:1.4}
.top{background:#1B4D5C;height:17mm;padding:0 16mm;display:flex;align-items:center;justify-content:space-between;border-bottom:1.2px solid #C4A265}
.brand{display:flex;align-items:center;gap:3mm} .logo{width:10mm;height:10mm}
.bn{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:15pt;color:#FAF7F2;line-height:1} .bn i{color:#C4A265;font-weight:500}
.bs{font-size:6.3pt;letter-spacing:.14em;color:#C4A265;text-transform:uppercase;margin-top:1mm}
.date{color:#C9DADA;font-size:7.5pt}
.wrap{padding:6mm 16mm 0}
h1{font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:500;font-size:23pt;color:#1B4D5C;line-height:1.1}
.sub{color:#5A6E68;font-size:8pt;margin-top:1.2mm;letter-spacing:.02em}
.hero{display:flex;align-items:center;gap:4mm;margin-top:1mm}
.flower{width:70mm;flex-shrink:0}
.pn{font-family:Outfit,sans-serif;font-weight:500;font-size:9.5px;letter-spacing:.12em;fill:#1B4D5C}
.ps{font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:12.5px}
.intro p{margin-bottom:2.6mm}
.intro .lead{font-family:"Cormorant Garamond",serif;font-size:13pt;font-weight:500;color:#1B4D5C;line-height:1.3}
.intro .lead em{color:#C0453A;font-style:italic}
.intro .how{color:#5A6E68;font-size:7.8pt}
.card{border-radius:3.2mm;padding:2.8mm 3.8mm;background:#FAF7F2;border:.8px solid #ECE4D6}
.card.big{background:#FCF1EE;border:1.4px solid #C0453A;margin-top:1mm}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:2.2mm;margin-top:2.2mm}
.ch{display:flex;align-items:center;gap:2mm;margin-bottom:1.3mm}
.dot{width:4mm;height:4mm} .cn{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:13pt;color:#1B4D5C}
.chip{margin-left:auto;font-size:6.8pt;font-weight:500;padding:.6mm 2.4mm;border-radius:10mm;letter-spacing:.03em}
.obs{margin-bottom:1.3mm}
.geste{color:#5A6E68;font-size:7.9pt} .geste span{display:inline-block;color:#8A6D3B;font-weight:500;font-size:6.6pt;text-transform:uppercase;letter-spacing:.1em;margin-right:1.6mm}
.cta{margin:3mm 16mm 0;background:#1B4D5C;border-radius:3.5mm;padding:3.6mm 5mm;display:flex;align-items:center;gap:5mm;color:#FAF7F2}
.cta h2{font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:500;font-size:17pt;color:#C4A265;line-height:1.1;margin-bottom:1.2mm}
.cta p{font-size:8.2pt;color:#E6EEEC} .cta .ways{margin-top:2mm;font-size:8.2pt}
.cta a{color:#FAF7F2;text-decoration:none;border-bottom:.8px solid #C4A265}
.cta .qr{background:#FAF7F2;border-radius:2.5mm;padding:1.6mm;text-align:center;flex-shrink:0}
.cta .qr small{display:block;color:#1B4D5C;font-size:5.6pt;margin-top:.6mm;letter-spacing:.04em}
.why{background:#fff;border-radius:2.4mm;padding:2.4mm 3mm;margin:1.8mm 0;border:.8px solid #EFD9D1;font-size:8.2pt} .why span{display:block;color:#9A5A48;font-weight:500;font-size:6.6pt;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.8mm}
.cab{font-size:8pt;color:#1B4D5C;margin-bottom:1.3mm;font-weight:400}
.obs b{font-weight:500;color:#C0453A}
.cta ul{margin:1.2mm 0 0 4mm;font-size:8.1pt;color:#E6EEEC} .cta li{margin-bottom:.4mm}
.foot{position:absolute;left:16mm;right:16mm;bottom:6mm;font-size:6.4pt;color:#5A6E68;text-align:center;line-height:1.5}
.foot b{font-weight:500;color:#1B4D5C}
</style></head><body>
<div class="top"><div class="brand"><svg viewBox="0 0 40 40" class="logo"><circle cx="20" cy="20" r="18.5" fill="none" stroke="#C4A265" stroke-width="1.2"/><path d="M9 21 A11 11 0 0 1 31 21 Z" fill="#C4A265"/><line x1="7" y1="21" x2="33" y2="21" stroke="#FAF7F2" stroke-width="1"/><path d="M9 25 q2.75 -2.2 5.5 0 t5.5 0 t5.5 0 t5.5 0" fill="none" stroke="#8FA98B" stroke-width="1.3"/><path d="M11 29 q2.25 -2 4.5 0 t4.5 0 t4.5 0 t4.5 0" fill="none" stroke="#8FA98B" stroke-width="1.3"/></svg><div><div class="bn">Horizon <i>&amp; Équilibre</i></div><div class="bs">Naturopathie · Réflexologie</div></div></div>
<div class="date">${dateStr}</div></div>
<div class="wrap">
<h1>${titreH1}</h1>
<div class="sub">${subLine}</div>
<div class="hero">${flowerSvg}
<div class="intro">
<p class="lead">${leadHtml}</p>
${howHtml}
</div></div>
${bigCardHtml}
${gridHtml}
</div>
${ctaHtml}
${footHtml}
</body></html>`;
}

async function generateBilanPdf(data) {
  let browser = null;
  try {
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    const html = await buildBilanHtml(data);
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    return pdfBuffer;
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

// ─── POST /api/bilan-pdf : génère PDF, envoie emails, retourne PDF ─────────
app.post('/api/bilan-pdf', express.json({ limit: '2mb' }), async (req, res) => {
  try {
    const body = req.body;
    const { childName, childAge, prenom, nom, profileLabel, globalScore, charges,
            zones, suggestReflexo, date, clientEmail } = body;

    // Générer le PDF
    const pdfBuffer = await generateBilanPdf(body);
    const filename  = `Bilan_Horizon_Sante_${childName}_${new Date(date || Date.now()).toISOString().slice(0, 10)}.pdf`;

    // Sauvegarder dans audits.json
    const audits = loadAudits();
    const existing = audits.find(a => a.childName === childName && a.date === date);
    if (existing) {
      existing.hasPdf = true;
      existing.clientEmail = clientEmail || existing.clientEmail;
    } else {
      audits.unshift({
        childName, childAge, prenom: prenom || null, nom: nom || null,
        globalScore, charges, zones, profileLabel,
        suggestReflexo: !!suggestReflexo, date, clientEmail: clientEmail || null,
        hasPdf: true, receivedAt: new Date().toISOString()
      });
    }
    fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));

    const attachment = { filename, content: pdfBuffer, contentType: 'application/pdf' };
    const dateStr    = new Date(date || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const subject    = `Bilan Horizon Santé : ${childName}, ${profileLabel || childAge}, ${dateStr}`;

    // Email au client (avec PDF)
    if (clientEmail) {
      const rdvUrl = `${SITE_URL}/rendez-vous`;
      const clientHtml = `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2C3E3A">
  <div style="background:#1B4D5C;padding:32px;text-align:center">
    <h1 style="color:#FAF7F2;font-size:1.6rem;font-weight:400;margin:0">Horizon &amp; Équilibre</h1>
    <p style="color:#C4A265;font-size:.85rem;margin:8px 0 0">Naturopathie · Réflexologie · Fleurs de Bach</p>
  </div>
  <div style="padding:32px;background:#FAF7F2">
    <p>Bonjour ${prenom || ''},</p>
    <p>Veuillez trouver en pièce jointe la synthèse du Bilan Horizon Santé réalisé pour <strong>${childName}</strong>.</p>
    <p>Ce document présente l'état de vitalité selon cinq axes et des pistes concrètes pour chacun d'eux. Pour aller plus loin et définir un programme personnalisé, vous pouvez prendre rendez-vous au cabinet de Sainte-Consorce ou en visio :</p>
    <p><a href="${rdvUrl}" style="color:#1B4D5C;font-weight:600">${rdvUrl}</a></p>
    <p style="margin-top:32px">Bien à vous,</p>
    <p style="font-size:.85rem;color:#5A6E68">Arielle de Maistre<br>Naturopathe · Réflexologue<br>Cabinet de Sainte-Consorce (69280)</p>
  </div>
</div>`;
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [clientEmail],
        reply_to: process.env.CONTACT_EMAIL,
        subject: `📩 Votre Bilan Horizon Santé — ${childName}`,
        html: clientHtml,
        attachments: [attachment]
      });
    }

    // Email à Arielle (résumé + PDF)
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [PRACTITIONER_EMAIL],
      subject,
      html: buildPractitionerEmail(body),
      attachments: [attachment]
    });

    // Renvoyer le PDF au navigateur pour téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error('bilan-pdf error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── Static files — après les routes HTML ─────────────────────────────────
// CSS, JS, images, SVG, favicons, etc.
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
