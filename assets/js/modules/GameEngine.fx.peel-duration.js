/** Day3 peel duration bump */
(function () {
  function bump() {
    if (typeof SCENARIO === 'undefined' || !SCENARIO[3]) return;
    var s = SCENARIO[3]['day3_night_stat_crack_4'];
    if (s && s.glitch && s.glitch.peelStatLabel) {
      s.glitch.revealDuration = 1600;
    }
  }
  bump();
  var n = 0, t = setInterval(function () { bump(); if (++n > 80) clearInterval(t); }, 50);
})();
