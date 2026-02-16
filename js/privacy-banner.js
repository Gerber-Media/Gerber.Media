// Privacy Transparency Banner
// Displays once and respects user's dismissal preference
(function() {
  'use strict';

  function initPrivacyBanner() {
    var banner = document.getElementById('privacy-banner');
    if (!banner) return;

    var closeBtn = banner.querySelector('.privacy-banner__close');
    if (!closeBtn) return;

    // Check if user has dismissed banner
    var dismissed = localStorage.getItem('privacyBannerDismissed');
    if (dismissed) {
      banner.classList.add('hidden');
      return;
    }

    // Show banner with slight delay for better accessibility
    setTimeout(function() {
      banner.classList.remove('hidden');
    }, 500);

    // Handle close button
    closeBtn.addEventListener('click', function() {
      banner.classList.add('hidden');
      localStorage.setItem('privacyBannerDismissed', 'true');
    });

    // Allow ESC key to dismiss (accessibility)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !banner.classList.contains('hidden')) {
        banner.classList.add('hidden');
        localStorage.setItem('privacyBannerDismissed', 'true');
      }
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrivacyBanner);
  } else {
    initPrivacyBanner();
  }
})();
