/**
 * MD-first cast sync overlays (SCENARIO.md prose: character already on screen).
 * Applied after day scenario files. Intentional delayed nulls (door/empty room) are NOT touched.
 */
(function () {
  try {
    if (typeof SCENARIO === 'undefined' || !SCENARIO[5]) return;
    var S = SCENARIO[5];
    // day5 morning true: "유나가 가리킨 곳에서" — Yuna present
    if (S.day5_morning_true_1 && S.day5_morning_true_1.character == null) {
      S.day5_morning_true_1.character = 'yuna_injured_determined';
    }
    // endings: prose shows cast on beat 1
    if (S.day5_ending_true_24 && S.day5_ending_true_24.character == null) {
      S.day5_ending_true_24.character = 'yuna_normal';
    }
    if (S.day5_ending_escape_1 && S.day5_ending_escape_1.character == null) {
      S.day5_ending_escape_1.character = 'yuna_normal';
    }
    if (S.day5_ending_resist_22 && S.day5_ending_resist_22.character == null) {
      S.day5_ending_resist_22.character = 'eunsu_normal';
    }
    if (S.day5_ending_complicit_1 && S.day5_ending_complicit_1.character == null) {
      S.day5_ending_complicit_1.character = 'eunsu_normal';
    }
  } catch (e) { /* non-fatal */ }
})();
