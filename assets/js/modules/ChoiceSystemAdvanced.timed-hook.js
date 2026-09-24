(function () {
  function patch() {
    var C = window.ChoiceSystemAdvanced;
    if (!C || C.prototype.__timedChoicePatched) return;
    var proto = C.prototype;
    var show = proto.showTimedChoice;
    if (typeof show === 'function') {
      proto.showTimedChoice = function () {
        var ret = show.apply(this, arguments);
        try { this.choiceContainer && this.choiceContainer.classList.add('timed-choice'); } catch (e) {}
        return ret;
      };
    }
    var clean = proto._cleanup;
    if (typeof clean === 'function') {
      proto._cleanup = function () {
        try { this.choiceContainer && this.choiceContainer.classList.remove('timed-choice'); } catch (e) {}
        return clean.apply(this, arguments);
      };
    }
    C.prototype.__timedChoicePatched = true;
  }
  patch();
  document.addEventListener('DOMContentLoaded', patch);
  setTimeout(patch, 0);
  setTimeout(patch, 500);
})();
