// Automatic language detection based on browser language
(function() {
  'use strict';
  
  // Check if user has already saved a language preference
  var savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang) {
    return; // User has already manually selected a language
  }

  // Get browser language
  var browserLang = navigator.language || navigator.userLanguage;
  var langCode = browserLang.split('-')[0]; // "en-US" → "en"

  // Define available language mappings for root (index.html)
  var langMapRoot = {
    'en': 'en/',     // English
    'da': 'da/',     // Danish
    'de': false      // German - stay on homepage
  };

  // Define available language mappings for /en/ directory
  var langMapEn = {
    'en': false,     // English - stay on this page
    'da': '../da/',   // Danish
    'de': '../'       // German
  };

  // Define available language mappings for /da/ directory
  var langMapDa = {
    'en': '../en/',   // English
    'da': false,      // Danish - stay on this page
    'de': '../'       // German
  };

  // Determine which mapping to use based on current location
  var currentPath = window.location.pathname;
  var langMap = langMapRoot;

  if (currentPath.includes('/en/')) {
    langMap = langMapEn;
  } else if (currentPath.includes('/da/')) {
    langMap = langMapDa;
  }

  // Redirect if browser language matches an available variant
  if (langMap.hasOwnProperty(langCode) && langMap[langCode]) {
    window.location.href = langMap[langCode] + 'index.html';
  }
})();
