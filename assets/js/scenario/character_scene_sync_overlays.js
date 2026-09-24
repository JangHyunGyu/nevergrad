/**
 * Character/scene sync data overlays (nurse office + delayed appear).
 */
(function () {
  function patch(day, id, fields) {
    if (typeof SCENARIO === 'undefined' || !SCENARIO[day] || !SCENARIO[day][id]) return;
    Object.assign(SCENARIO[day][id], fields);
  }
  patch(1, 'day1_lunch_riin_1', { character: 'riin_gentle' });
  patch(1, 'day1_lunch_riin_2', { character: 'riin_gentle' });
  patch(1, 'day1_after_riin_1', { character: 'riin_gentle' });
  patch(1, 'day1_after_riin_12', { character: null, background: 'hallway' });
  patch(1, 'day1_after_yuna_1', { character: 'yuna_shy' });
  patch(3, 'day3_lunch_sea_3', { character: 'sea_smile' });
  patch(4, 'day4_after_sea_route', { character: 'sea_smile' });
})();
