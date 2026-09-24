/**
 * ChoiceSystemAdvanced.js — temporary loader (restores real module after accidental path placeholder)
 * Loads last-known-good source, then timed-hook (FaviconManager) adds timed-choice class.
 */
(function () {
  var url = 'https://cdn.jsdelivr.net/gh/JangHyunGyu/nevergrad@572cf95f46a61d2a6f6fe3fd6ecba565b1cda7ce/assets/js/modules/ChoiceSystemAdvanced.js';
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText && xhr.responseText.indexOf('ChoiceSystemAdvanced') !== -1 && xhr.responseText.indexOf('@/workspace') === -1) {
      (0, eval)(xhr.responseText);
    }
  } catch (e) { /* non-fatal */ }
})();
