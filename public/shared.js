/**
 * shared.js — éléments communs à toutes les pages
 * Injecte le bloc AvertissementSante avant le <footer> sur les pages concernées.
 */

(function () {
  const PAGES_AVEC_AVERTISSEMENT = ['/', '/about', '/methode', '/tarifs', '/bilan', '/publications'];

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const afficher = PAGES_AVEC_AVERTISSEMENT.some(p => path === p || path.startsWith('/publications'));

  if (!afficher) return;

  const bloc = document.createElement('section');
  bloc.id = 'avertissement-sante';
  bloc.style.cssText = [
    'background: #E8EDE7',
    'border-left: 4px solid #C4A265',
    'padding: 28px 32px',
    'margin: 0',
  ].join(';');

  bloc.innerHTML = `
<div style="max-width:1200px;margin:0 auto;padding:0 32px">
  <p style="font-family:'Outfit',system-ui,sans-serif;font-weight:600;font-size:0.82rem;letter-spacing:2px;text-transform:uppercase;color:#1B4D5C;margin-bottom:12px">
    Information importante
  </p>
  <p style="font-family:'Outfit',system-ui,sans-serif;font-size:0.84rem;color:#1B4D5C;line-height:1.75;margin-bottom:8px">
    La naturopathie et la réflexologie sont des pratiques de bien-être et de prévention. Elles ne constituent ni un diagnostic, ni un traitement médical, et ne se substituent en aucun cas à un avis, un suivi ou un traitement prescrit par un médecin.
  </p>
  <p style="font-family:'Outfit',system-ui,sans-serif;font-size:0.84rem;color:#1B4D5C;line-height:1.75;margin-bottom:8px">
    Arielle de Maistre n'est pas médecin. Elle n'interrompt, ne modifie et ne remplace aucun traitement en cours.
  </p>
  <p style="font-family:'Outfit',system-ui,sans-serif;font-size:0.84rem;color:#1B4D5C;line-height:1.75;margin:0">
    En cas de manifestation aiguë ou persistante chez votre enfant, consultez votre médecin traitant ou votre pédiatre.
  </p>
</div>`;

  const footer = document.querySelector('footer');
  if (footer) {
    footer.parentNode.insertBefore(bloc, footer);
  }
})();
