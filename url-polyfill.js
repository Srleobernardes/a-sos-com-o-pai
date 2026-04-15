// Metro polyfill: Patch Hermes URL to have writable protocol property
// This runs BEFORE any module code, including expo-asset
(function () {
  if (typeof URL === 'undefined') return;

  // Check if URL.prototype.protocol is read-only (Hermes bug)
  var desc = Object.getOwnPropertyDescriptor(URL.prototype, 'protocol');
  if (!desc || desc.set) return; // Already has setter, no patch needed

  // Load the pure-JS WHATWG URL implementation that ships with Expo
  try {
    var polyfill = require('whatwg-url-without-unicode');
    var PolyURL = polyfill.URL;
    var PolyURLSearchParams = polyfill.URLSearchParams;

    // Preserve any static methods from the native URL
    var origCreateObjectURL = URL.createObjectURL;
    var origRevokeObjectURL = URL.revokeObjectURL;

    // Replace globals
    globalThis.URL = PolyURL;
    globalThis.URLSearchParams = PolyURLSearchParams;

    // Restore static methods
    if (origCreateObjectURL) {
      globalThis.URL.createObjectURL = origCreateObjectURL;
    }
    if (origRevokeObjectURL) {
      globalThis.URL.revokeObjectURL = origRevokeObjectURL;
    }

    // Add canParse if missing
    if (!globalThis.URL.canParse) {
      globalThis.URL.canParse = function canParse(url, base) {
        try {
          new globalThis.URL(url, base);
          return true;
        } catch (e) {
          return false;
        }
      };
    }
  } catch (e) {
    // Fallback: If whatwg-url-without-unicode is not available,
    // try to make URL.protocol writable manually
    try {
      var OrigURL = URL;
      var NewURL = function URL(url, base) {
        return new OrigURL(url, base);
      };
      NewURL.prototype = OrigURL.prototype;
      if (OrigURL.createObjectURL) NewURL.createObjectURL = OrigURL.createObjectURL;
      if (OrigURL.revokeObjectURL) NewURL.revokeObjectURL = OrigURL.revokeObjectURL;
      globalThis.URL = NewURL;
    } catch (e2) {
      // give up
    }
  }
})();
