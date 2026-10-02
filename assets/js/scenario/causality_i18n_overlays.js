/**
 * Runtime i18n patch for causality branch strings + transfer-line clarity.
 * Hooks I18nManager.loadDay / applies into texts[dayN].
 */
(function () {
  var PACK = {};
  function lang() {
    return (document.documentElement.lang || 'ko').slice(0, 2);
  }
  function applyToManager(mgr) {
    if (!mgr || !mgr.texts) return;
    var code = lang();
    var own = PACK[code] || {};
    var fallback = code === 'ko' ? {} : (PACK.en || {});
    var days = {};
    Object.keys(fallback).forEach(function (d) { days[d] = true; });
    Object.keys(own).forEach(function (d) { days[d] = true; });
    Object.keys(days).forEach(function (dayKey) {
      mgr.texts[dayKey] = mgr.texts[dayKey] || {};
      var target = mgr.texts[dayKey];
      var ownDay = own[dayKey] || {};
      var fbDay = fallback[dayKey] || {};
      // Loaded JSON is canonical. PACK only supplies scenes without JSON text,
      // so a reload cannot silently restore an older translated sentence.
      // An overlay-only scene without local copy still falls back to English.
      Object.keys(fbDay).forEach(function (id) {
        if (!ownDay[id] && !target[id]) target[id] = fbDay[id];
      });
      Object.keys(ownDay).forEach(function (id) {
        if (!target[id]) target[id] = ownDay[id];
      });
    });
  }
  function findMgr() {
    if (window.i18nManager) return window.i18nManager;
    if (window.engine && window.engine.i18n) return window.engine.i18n;
    if (window.gameEngine && window.gameEngine.i18n) return window.gameEngine.i18n;
    return null;
  }
  function hook() {
    if (typeof I18nManager === 'undefined') return;
    if (I18nManager.prototype.__nevergradCausalityI18n) return;
    var orig = I18nManager.prototype.loadDay;
    I18nManager.prototype.loadDay = async function (day) {
      var result = await orig.call(this, day);
      applyToManager(this);
      return result;
    };
    var origAll = I18nManager.prototype.loadAll;
    I18nManager.prototype.loadAll = async function () {
      var result = await origAll.call(this);
      applyToManager(this);
      return result;
    };
    I18nManager.prototype.__nevergradCausalityI18n = true;
  }
  hook();
  function tick() {
    hook();
    applyToManager(findMgr());
  }
  tick();
  document.addEventListener('DOMContentLoaded', tick);
  setTimeout(tick, 0);
  setTimeout(tick, 500);
  setTimeout(tick, 2000);
})();
