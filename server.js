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

function loadAudits() {
  try { return JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8')); }
  catch { return []; }
}
function saveAudit(entry) {
  const audits = loadAudits();
  audits.unshift(entry); // plus récent en premier
  fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));
}
function loadAvis() {
  try { return JSON.parse(fs.readFileSync(AVIS_FILE, 'utf8')); }
  catch { return { afficherBlocAvis: false, note: 5.0, nombreAvis: 0, urlGoogleBusiness: '', avis: [] }; }
}

// ─── Static files ──────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

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
  return new Date() >= new Date(dateStr + 'T00:00:00');
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
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/audit', (req, res) => res.sendFile(path.join(__dirname, 'public', 'audit.html')));
app.get('/bilan', (req, res) => res.sendFile(path.join(__dirname, 'public', 'audit.html')));
app.get('/crm', (req, res) => res.sendFile(path.join(__dirname, 'public', 'crm.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/methode', (req, res) => res.sendFile(path.join(__dirname, 'public', 'methode.html')));
app.get('/tarifs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tarifs-accompagnement.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// LOT 7 — Redirect /guides → /publications (301 permanent)
app.get('/guides', (req, res) => res.redirect(301, '/publications'));
app.get('/guides-pratiques', (req, res) => res.redirect(301, '/publications'));

// LOT 7 — Publications index
app.get('/publications', (req, res) => res.sendFile(path.join(__dirname, 'public', 'guides-pratiques.html')));

// LOT 8 — Publications articles avec filtrage par date
app.get('/publications/:slug', (req, res) => {
  const art = ARTICLES.find(a => a.slug === req.params.slug);
  if (!art || !isPublished(art.date)) {
    return res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'publications', `${req.params.slug}.html`));
});

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── LOT 8 — Config avis ───────────────────────────────────────────────────
app.get('/api/config/avis', (req, res) => {
  res.json(loadAvis());
});

// ─── Audit result silencieux (scores seuls, sans PDF) ─────────────────────
app.post('/api/audit-result', express.json(), async (req, res) => {
  try {
    const { childName, childAge, globalScore, charges, zones, suggestReflexo, date, clientEmail } = req.body;

    saveAudit({ childName, childAge, globalScore, charges, zones, suggestReflexo: suggestReflexo || false, date, clientEmail: clientEmail || null, hasPdf: false, receivedAt: new Date().toISOString() });

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      subject: `🌿 Nouveau bilan — ${childName} (${childAge})`,
      html: `<h2>Bilan Horizon Santé</h2>
        <p><strong>Prénom :</strong> ${childName} — <strong>Âge :</strong> ${childAge}</p>
        <p><strong>Score global :</strong> ${globalScore}/100</p>
        <p><strong>Pétales :</strong> Sommeil ${charges.sommeil}/12 · Éclat ${charges.eclat}/12 · Sérénité ${charges.serenite}/12 · Immunité ${charges.immunite}/12 · Confiance ${charges.confiance}/12</p>
        <p><strong>Zones d'alerte :</strong> ${zones.map(z => z.petale + ' (' + z.level + ')').join(', ') || 'aucune'}</p>
        <p><strong>Réflexologie recommandée :</strong> ${suggestReflexo ? 'oui' : 'non'}</p>
        ${clientEmail ? `<p><strong>Email client :</strong> ${clientEmail}</p>` : '<p><em>Pas d\'email client renseigné</em></p>'}
        <p><em>Réalisé le ${new Date(date).toLocaleString('fr-FR')}</em></p>`
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

    // Mettre à jour l'entrée CRM (ou en créer une nouvelle)
    const audits = loadAudits();
    const existing = audits.find(a => a.childName === childName && a.date === date);
    if (existing) { existing.hasPdf = true; existing.clientEmail = clientEmail || existing.clientEmail; }
    else { audits.unshift({ childName, childAge, prenom: prenom||null, nom: nom||null, globalScore, charges, zones, suggestReflexo: suggestReflexo || false, date, clientEmail: clientEmail || null, hasPdf: true, receivedAt: new Date().toISOString() }); }
    fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));

    // Persistance Prisma
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
    const summaryHtml = `<h2>Bilan Horizon Santé — ${childName} (${childAge})</h2>
      <p><strong>Prospect :</strong> ${prenom||''} ${nom||''} · ${clientEmail||'—'}</p>
      <p><strong>Score global :</strong> ${globalScore}/100</p>
      <p><strong>Pétales :</strong> Sommeil ${charges.sommeil}/12 · Éclat ${charges.eclat}/12 · Sérénité ${charges.serenite}/12 · Immunité ${charges.immunite}/12 · Confiance ${charges.confiance}/12</p>
      <p><strong>Zones :</strong> ${zones.map(z => z.petale + ' (' + z.level + ')').join(', ') || 'Aucune zone d\'alerte'}</p>
      <p><strong>Réflexologie :</strong> ${suggestReflexo ? '✅' : '—'}</p>
      <p><em>Réalisé le ${new Date(date).toLocaleString('fr-FR')}</em></p>`;

    // Email au client (si email fourni)
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
    <p>Ce bilan gagne à être complété par une consultation au cabinet afin de définir un protocole de vitalité précis et adapté à son terrain. Lors du Bilan Initial (90 min), nous pourrons approfondir ces résultats et établir un protocole naturopathique personnalisé.</p>
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

    // Copie à Arielle
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      subject: `📋 PDF Bilan — ${prenom||childName} ${nom||''} (${childAge}) — envoyé à ${clientEmail}`,
      html: summaryHtml + (clientEmail ? `<p><strong>Copie envoyée à :</strong> ${clientEmail}</p>` : '<p><em>Pas d\'email client — PDF non envoyé au client</em></p>'),
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
    // Anti-spam honeypot
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
