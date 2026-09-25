/**
 * shared.js — éléments communs à toutes les pages
 * - IntersectionObserver pour animations .animate-in
 * - Menu burger mobile
 * - Scroll shadow sur #nav
 */
(function () {

  // ─── Scroll shadow nav ─────────────────────────────────────
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ─── IntersectionObserver animate-in ──────────────────────
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });

  // ─── Menu burger mobile ────────────────────────────────────
  var toggle = document.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var links = document.querySelector('.nav-links');
      if (!links) return;
      if (links.style.display === 'flex') {
        links.style.display = 'none';
      } else {
        links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:68px;left:0;right:0;background:rgba(250,247,242,0.97);backdrop-filter:blur(20px);padding:16px 32px 24px;gap:16px;box-shadow:0 10px 40px rgba(27,77,92,0.1);z-index:99;';
      }
    });
  }

  // Fermer le menu au resize
  window.addEventListener('resize', function () {
    var links = document.querySelector('.nav-links');
    if (links && window.innerWidth > 768) {
      links.style.cssText = '';
    }
  });

})();
