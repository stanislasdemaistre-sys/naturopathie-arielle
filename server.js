require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');

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

const app = express();
const PORT = process.env.PORT || 3000;
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

function buildPage(filePath, { activePath = '/', noCta = false } = {}) {
  const html = fs.readFileSync(filePath, 'utf8');
  const nav = NAV.replace(`href="${activePath}"`, `href="${activePath}" class="active"`);
  return html
    .replace('<!-- INJECT:NAV -->', nav)
    .replace('<!-- INJECT:CTA -->', noCta ? '' : CTA)
    .replace('<!-- INJECT:DISCLAIMER -->', DISCLAIMER)
    .replace('<!-- INJECT:FOOTER -->', FOOTER);
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
    'User-agent: *\nAllow: /\nSitemap: https://naturopathie-arielle-production.up.railway.app/sitemap.xml\n'
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
  const base = 'https://naturopathie-arielle-production.up.railway.app';
  const today = new Date().toISOString().slice(0, 10);
  const publishedArticleUrls = ARTICLES
    .filter(a => isPublished(a.date))
    .map(a => ({ loc: `/publications/${a.slug}`, priority: '0.6', changefreq: 'yearly' }));
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/methode', priority: '0.8', changefreq: 'monthly' },
    { loc: '/tarifs', priority: '0.8', changefreq: 'monthly' },
    { loc: '/bilan', priority: '0.7', changefreq: 'monthly' },
    { loc: '/publications', priority: '0.8', changefreq: 'weekly' },
    ...publishedArticleUrls,
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
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

// Pages légales
app.get('/mentions-legales', (req, res) => res.send(buildPage(path.join(__dirname, 'public', 'mentions-legales.html'),    { activePath: '/mentions-legales', noCta: true })));
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
    { activePath: '/publications' }
  ));
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
      to: [process.env.CONTACT_EMAIL],
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
      const contactUrl = 'https://naturopathie-arielle-production.up.railway.app/contact';
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
    <p>Ce bilan gagne à être complété par une consultation au cabinet afin de définir un programme de vitalité précis et adapté à son terrain. Lors du Bilan Initial (90 min), nous pourrons approfondir ces résultats et établir un programme naturopathique personnalisé.</p>
    <p>Pour toute question ou pour convenir d'un rendez-vous au cabinet de Sainte-Consorce, je vous invite à me contacter directement via le formulaire de mon site :<br>
    <a href="${contactUrl}" style="color:#1B4D5C;font-weight:600">${contactUrl}</a></p>
    <p style="margin-top:32px">Sincères salutations,</p>
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
      to: [process.env.CONTACT_EMAIL],
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

// ─── Static files — après les routes HTML ─────────────────────────────────
// CSS, JS, images, SVG, favicons, etc.
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
