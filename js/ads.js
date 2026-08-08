/**
 * BiteArcade Ad Management Script v2
 * - Blocks deceptive popups (fake download/virus/winner modals)
 * - Repositions floating banner ads to page bottom
 * - NO window.open interception (was blocking legitimate game functionality)
 * - Runs on load + interval + MutationObserver for real-time control
 */
(function() {
  'use strict';

  // Keywords that indicate a deceptive/ad popup
  var DECEPTIVE_KEYWORDS = /download|tap.*proceed|click.*continue|ready|virus|scan|warning|your.*phone|install|free.*gift|winner|congratulations|subscribe|notification|claim.*prize|you.*won|selected.*reward/i;
  var DECEPTIVE_IMAGES = /btn_download|btn_install|cta_button|download_now|get_it_now|install_now|claim_reward/i;

  function isDeceptive(el) {
    var text = (el.innerText || el.textContent || '').slice(0, 300);
    if (DECEPTIVE_KEYWORDS.test(text)) return true;

    var imgs = el.querySelectorAll('img');
    for (var j = 0; j < imgs.length; j++) {
      var src = (imgs[j].src || '') + (imgs[j].alt || '');
      if (DECEPTIVE_IMAGES.test(src)) return true;
    }

    return false;
  }

  function handleAds() {
    var els = document.querySelectorAll('div, iframe, ins, a, span');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var style = window.getComputedStyle(el);
      if (style.position !== 'fixed') continue;
      var z = parseInt(style.zIndex) || 0;
      if (z < 9999) continue; // Only touch ad elements (z-index >= 9999)

      var top = style.top;
      var left = style.left;
      var transform = style.transform;
      var isCentered = (top === '50%' && left === '50%') ||
        /translate\(-50%,\s*-50%\)|translate\(-50%\)/.test(transform);

      // BLOCK deceptive popups (centered modals with suspicious text at very high z)
      if (isCentered && z >= 20000) {
        el.style.setProperty('display', 'none', 'important');
        continue;
      }

      // BLOCK any high-z element with deceptive keywords
      if (isDeceptive(el)) {
        el.style.setProperty('display', 'none', 'important');
        continue;
      }

      // REPOSITION normal banner ads to bottom
      el.style.setProperty('top', 'auto', 'important');
      el.style.setProperty('bottom', '0', 'important');
      el.style.setProperty('inset', 'auto 0 0 0', 'important');
      el.style.setProperty('translate', 'none', 'important');
      el.style.setProperty('transform', 'none', 'important');
    }
  }

  // Run immediately
  handleAds();

  // Run every 2000ms for the first 10 seconds (ads load asynchronously)
  var intervalCount = 0;
  var intervalId = setInterval(function() {
    handleAds();
    intervalCount++;
    if (intervalCount >= 5) {
      clearInterval(intervalId);
    }
  }, 2000);

  // Observe DOM changes for real-time ad control (debounced 300ms)
  if (window.MutationObserver) {
    var debounceTimer = null;
    var observer = new MutationObserver(function() {
      if (debounceTimer) return;
      debounceTimer = setTimeout(function() {
        handleAds();
        debounceTimer = null;
      }, 300);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
})();
