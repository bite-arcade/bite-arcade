/**
 * BiteArcade Cookie Consent Script
 * GDPR/ePrivacy compliance — controls cookie consent banner
 * Uses event delegation (no inline onclick handlers for CSP compliance)
 */
(function() {
  'use strict';

  var consent = localStorage.getItem('ba_cookie_consent');
  var banner = document.getElementById('cookieConsent');

  // Show banner only if user hasn't consented yet
  if (!consent && banner) {
    banner.style.display = 'block';
  }

  // Event delegation for Accept/Decline buttons
  document.addEventListener('click', function(e) {
    var action = e.target.getAttribute('data-action');
    if (!action) return;

    if (action === 'accept-cookies') {
      localStorage.setItem('ba_cookie_consent', 'accepted');
      if (banner) banner.style.display = 'none';
    } else if (action === 'decline-cookies') {
      localStorage.setItem('ba_cookie_consent', 'declined');
      if (banner) banner.style.display = 'none';
      // Remove any ad placeholders if user declines
      var adZones = document.querySelectorAll('.ad-zone, .ad-placeholder');
      adZones.forEach(function(el) { el.style.display = 'none'; });
    }
  });
})();
