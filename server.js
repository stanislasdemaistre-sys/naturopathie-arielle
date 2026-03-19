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

// S'assurer que le répertoire data/ existe (nécessaire sur Railway)
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

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

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Serve jsPDF locally (évite dépendance CDN)
app.get('/jspdf.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js'));
});

// Explicit routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/audit', (req, res) => res.sendFile(path.join(__dirname, 'public', 'audit.html')));
app.get('/crm', (req, res) => res.sendFile(path.join(__dirname, 'public', 'crm.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/methode', (req, res) => res.sendFile(path.join(__dirname, 'public', 'methode.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Audit result silencieux (scores seuls, sans PDF) ───────────────────────
app.post('/api/audit-result', express.json(), async (req, res) => {
  try {
    const { childName, childAge, globalScore, charges, zones, suggestOligo, suggestKinesio, suggestReflexo, date, clientEmail } = req.body;

    // Stocker dans le JSON CRM
    saveAudit({ childName, childAge, globalScore, charges, zones, suggestOligo, suggestKinesio, suggestReflexo: suggestReflexo || false, date, clientEmail: clientEmail || null, hasPdf: false, receivedAt: new Date().toISOString() });

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      subject: `🌿 Nouvel audit — ${childName} (${childAge})`,
      html: `<h2>Audit Horizon Santé</h2>
        <p><strong>Prénom :</strong> ${childName} — <strong>Âge :</strong> ${childAge}</p>
        <p><strong>Score global :</strong> ${globalScore}/100</p>
        <p><strong>Pétales :</strong> Sommeil ${charges.sommeil}/9 · Éclat ${charges.eclat}/9 · Sérénité ${charges.serenite}/9 · Immunité ${charges.immunite}/9 · Confiance ${charges.confiance}/9</p>
        <p><strong>Zones d'alerte :</strong> ${zones.map(z => z.petale + ' (' + z.level + ')').join(', ') || 'aucune'}</p>
        <p><strong>Suggestion Oligoscan :</strong> ${suggestOligo ? 'oui' : 'non'} · <strong>Kinésiologie :</strong> ${suggestKinesio ? 'oui' : 'non'} · <strong>Réflexologie :</strong> ${suggestReflexo ? 'oui' : 'non'}</p>
        ${clientEmail ? `<p><strong>Email client :</strong> ${clientEmail}</p>` : '<p><em>Pas d\'email client renseigné</em></p>'}
        <p><em>Réalisé le ${new Date(date).toLocaleString('fr-FR')}</em></p>`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('audit-result error:', err.message);
    res.status(500).json({ ok: false });
  }
});

// ─── Envoi PDF audit (client + Arielle) ────────────────────────────────────
app.post('/api/send-audit-pdf', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { childName, childAge, globalScore, charges, zones, suggestOligo, suggestKinesio, suggestReflexo, date, clientEmail, pdfBase64 } = req.body;

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const filename = `Audit_Horizon_Sante_${childName}_${new Date(date).toISOString().slice(0, 10)}.pdf`;

    // Mettre à jour l'entrée CRM (ou en créer une nouvelle)
    const audits = loadAudits();
    const existing = audits.find(a => a.childName === childName && a.date === date);
    if (existing) { existing.hasPdf = true; existing.clientEmail = clientEmail || existing.clientEmail; }
    else { audits.unshift({ childName, childAge, globalScore, charges, zones, suggestOligo, suggestKinesio, suggestReflexo: suggestReflexo || false, date, clientEmail: clientEmail || null, hasPdf: true, receivedAt: new Date().toISOString() }); }
    fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));

    const attachment = { filename, content: pdfBuffer, contentType: 'application/pdf' };
    const summaryHtml = `<h2>Audit Horizon Santé — ${childName} (${childAge})</h2>
      <p><strong>Score global :</strong> ${globalScore}/100</p>
      <p><strong>Pétales :</strong> Sommeil ${charges.sommeil}/9 · Éclat ${charges.eclat}/9 · Sérénité ${charges.serenite}/9 · Immunité ${charges.immunite}/9 · Confiance ${charges.confiance}/9</p>
      <p><strong>Zones :</strong> ${zones.map(z => z.petale + ' (' + z.level + ')').join(', ') || 'Aucune zone d\'alerte'}</p>
      <p><strong>Suggestions :</strong> Oligoscan ${suggestOligo ? '✅' : '—'} · Kinésiologie ${suggestKinesio ? '✅' : '—'} · Réflexologie ${suggestReflexo ? '✅' : '—'}</p>
      <p><em>Réalisé le ${new Date(date).toLocaleString('fr-FR')}</em></p>`;

    // Email au client (si email fourni)
    if (clientEmail) {
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [clientEmail],
        reply_to: process.env.CONTACT_EMAIL,
        subject: `🌿 Votre bilan Horizon Santé — ${childName}`,
        html: `<p>Bonjour ${childName},</p>
          <p>Merci d'avoir réalisé l'audit Horizon Santé. Vous trouverez ci-joint votre bilan personnalisé en PDF.</p>
          ${summaryHtml}
          <p>N'hésitez pas à me contacter si vous avez des questions.</p>
          <p>Arielle de Maistre<br>Flux & Équilibre · Naturopathe · Kinésiologue · Réflexologue</p>`,
        attachments: [attachment]
      });
    }

    // Copie à Arielle
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      subject: `📋 PDF Audit — ${childName} (${childAge})${clientEmail ? ' — envoyé à ' + clientEmail : ''}`,
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

// ─── Contact formulaire ───────────────────────────────────────────────────
app.post('/api/contact', express.json(), async (req, res) => {
  try {
    const { prenom, email, ageEnfant, objet, message } = req.body;
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      reply_to: email,
      subject: `📩 Contact Flux & Équilibre — ${objet} (${prenom})`,
      html: `<h2>Nouveau message</h2>
        <p><strong>De :</strong> ${prenom} (${email})</p>
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
