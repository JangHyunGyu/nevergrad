/**
 * SceneRenderer character-sync patch — location-change clear helpers
 * Loaded after SceneRenderer.js
 */
(function () {
  if (typeof SceneRenderer === 'undefined') return;
  const proto = SceneRenderer.prototype;
  if (proto.clearCharacterSlot) return;

  proto._charEl = function (position) {
    if (position === 'left') return this.charLeft;
    if (position === 'right') return this.charRight;
    return this.charCenter;
  };

  proto._wipeCharacterEl = function (el) {
    if (!el) return;
    if (typeof this._removePrevClone === 'function') this._removePrevClone(el);
    if (el._charTimer) {
      clearTimeout(el._charTimer);
      el._charTimer = null;
    }
    el.src = '';
    el.style.opacity = '';
    delete el.dataset.characterId;
    delete el.dataset.characterPosition;
    el.classList.remove('char-fade-out', 'char-fade-in');
  };

  proto.clearCharacterSlot = function (position, options = {}) {
    const el = this._charEl(position);
    if (!el || el.getAttribute('src') === '') return;
    const immediate = options.immediate === true;
    if (immediate) {
      this._wipeCharacterEl(el);
      return;
    }
    if (typeof this._removePrevClone === 'function') this._removePrevClone(el);
    if (el._charTimer) {
      clearTimeout(el._charTimer);
      el._charTimer = null;
    }
    if (window.NevergradMotion?.enabled?.()) {
      window.NevergradMotion.characterOut(el, () => this._wipeCharacterEl(el));
      return;
    }
    el.classList.add('char-fade-out');
    el.style.opacity = '0';
    el._charTimer = setTimeout(() => this._wipeCharacterEl(el), 260);
  };

  const originalClear = proto.clearCharacters;
  proto.clearCharacters = function (options = {}) {
    const immediate = options && options.immediate === true;
    if (immediate || !originalClear) {
      ['left', 'center', 'right'].forEach((pos) => this.clearCharacterSlot(pos, { immediate: true }));
      return;
    }
    // Prefer slot-based clear so options are honored
    ['left', 'center', 'right'].forEach((pos) => this.clearCharacterSlot(pos, options || {}));
  };
})();
