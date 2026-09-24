/**
 * Emergency restore bootstrap: tip was corrupted to a stub.
 * Sync-loads good commit content (FaviconManager-style), then bakes delayed-appear cast.
 */
(function () {
  function syncEval(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
      (0, eval)(xhr.responseText);
      return true;
    }
    return false;
  }
  var ok = syncEval('https://cdn.jsdelivr.net/gh/JangHyunGyu/nevergrad@ec897af5ec64e1b44daade598d887a40945d7b4c/assets/js/scenario/day4_3_afterschool.js');
  if (!ok) {
    syncEval('https://raw.githubusercontent.com/JangHyunGyu/nevergrad/ec897af5ec64e1b44daade598d887a40945d7b4c/assets/js/scenario/day4_3_afterschool.js');
  }
  try {
    if (typeof SCENARIO !== 'undefined' && SCENARIO[4] && SCENARIO[4].day4_after_sea_route) {
      SCENARIO[4].day4_after_sea_route.character = 'sea_smile';
    }
  } catch (e) { /* non-fatal */ }
})();
