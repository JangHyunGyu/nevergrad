/**
 * Runtime i18n patch for causality branch strings + transfer-line clarity.
 * Hooks I18nManager.loadDay / applies into texts[dayN].
 */
(function () {
  var PACK = {"ko":{"day1":{"day1_eunsu_11_honest":{"text":"음… 게임이랑 음악 듣는 거요. 둘 다 좀 합니다."},"day1_eunsu_11_brief":{"text":"음악이요."},"day1_eunsu_11_sea":{"text":"*먼저 세아 쪽을 봤다. 세아가 턱으로 살짝 가리킨다. 그제야 입을 연다.*\n\n…음악요."}},"day4":{"day4_lunch_nurse_ask_name":{"text":"그거… 이름이 뭐예요?"},"day4_lunch_nurse_ask_name_2":{"text":"영양제. 라벨 읽을 필요 없어. 그냥 누워."},"day4_lunch_nurse_ask_yuna":{"text":"유나한테도 그거 주셨어요?"},"day4_lunch_nurse_ask_yuna_2":{"text":"…유나 얘기는 내일. 지금은 너 약부터."},"day4_lunch_nurse_leave_ask":{"text":"*대답을 듣지 않고 나왔다. 등 뒤에서 앰플이 트레이에 닿는 소리가 짧게 났다.*"},"day4_lunch_nurse_leave_yuna":{"text":"*유나 이름을 꺼낸 뒤로는 더 묻지 못했다. 복도로 나오자 문틈으로 낮은 한숨이 새어 나온다.*"},"day4_lunch_nurse_15":{"text":"*웃으며 부드럽게 말하지만 손에는 아직 주사기를 들고 있다.*","choices":["바로 거절한다","약 이름을 묻는다","유나 이야기를 꺼낸다"]}},"day5":{"day5_morning_true_26":{"text":"*일지엔 격리, 출석부엔 어젯밤 시각의 '전학'. 같은 이름이 서류마다 다르게 적혀 있다.*"}}},"en":{"day1":{"day1_eunsu_11_honest":{"text":"Uh… games, and music. I do both a bit."},"day1_eunsu_11_brief":{"text":"Music."},"day1_eunsu_11_sea":{"text":"*I look at Sea first. She tips her chin toward the teacher. Only then do I speak.*\n\n…Music."}},"day4":{"day4_lunch_nurse_ask_name":{"text":"That… what's it called?"},"day4_lunch_nurse_ask_name_2":{"text":"A supplement. You don't need the label. Just lie down."},"day4_lunch_nurse_ask_yuna":{"text":"Did you give Yuna that too?"},"day4_lunch_nurse_ask_yuna_2":{"text":"…Yuna can wait until tomorrow. Your dose first."},"day4_lunch_nurse_leave_ask":{"text":"*I leave without waiting for more. Behind me an ampoule clicks against the tray.*"},"day4_lunch_nurse_leave_yuna":{"text":"*After saying Yuna's name I can't push further. In the hall a low sigh slips through the door.*"},"day4_lunch_nurse_15":{"text":"*A smiling face. A soft voice. A syringe in hand.*","choices":["Refuse immediately","Ask the drug name","Bring up Yuna"]}},"day5":{"day5_morning_true_26":{"text":"*The log says isolation. The roster stamps 'transfer' with last night's time. Same name, two different labels.*"}}},"ja":{"day5":{"day5_morning_true_26":{"text":"*日誌には隔離、出席簿には昨夜の時刻の『転校』。同じ名前が書類ごとに違う言葉で残っている。*"}},"day1":{"day1_eunsu_11_honest":{"text":"ええと……ゲームと、音楽を聴くことです。どっちも少しやります。"},"day1_eunsu_11_brief":{"text":"音楽です。"},"day1_eunsu_11_sea":{"text":"*先にセアのほうを見た。セアが顎で軽く先生のほうを指す。それでようやく口を開く。*\n\n……音楽です。"}}},"es":{"day5":{"day5_morning_true_26":{"text":"*El informe dice aislamiento. La lista marca 'traslado' con la hora de anoche. El mismo nombre, dos etiquetas.*"}},"day1":{"day1_eunsu_11_honest":{"text":"Eh… videojuegos y música. Hago un poco de las dos cosas."},"day1_eunsu_11_brief":{"text":"Música."},"day1_eunsu_11_sea":{"text":"*Miro primero a Sea. Ella señala con la barbilla hacia la profesora. Solo entonces hablo.*\n\n…Música."}}},"fr":{"day5":{"day5_morning_true_26":{"text":"*Le journal dit isolement. Le registre tamponne « transfert » à l'heure d'hier soir. Même nom, deux libellés.*"}},"day1":{"day1_eunsu_11_honest":{"text":"Euh… les jeux vidéo et la musique. Je fais un peu des deux."},"day1_eunsu_11_brief":{"text":"La musique."},"day1_eunsu_11_sea":{"text":"*Je regarde d'abord Sea. D'un petit mouvement du menton, elle désigne la professeure. Ce n'est qu'alors que je parle.*\n\n…La musique."}}},"de":{"day5":{"day5_morning_true_26":{"text":"*Im Protokoll steht Isolation. Auf der Liste steht 'Transfer' mit der Uhrzeit von letzter Nacht. Derselbe Name, zwei Stempel.*"}},"day1":{"day1_eunsu_11_honest":{"text":"Äh… Spiele und Musik. Beides mache ich ein bisschen."},"day1_eunsu_11_brief":{"text":"Musik."},"day1_eunsu_11_sea":{"text":"*Ich sehe zuerst zu Sea. Sie deutet mit dem Kinn kurz zur Lehrerin. Erst dann rede ich.*\n\n…Musik."}}},"pt":{"day5":{"day5_morning_true_26":{"text":"*O registro diz isolamento. A lista carimba 'transferência' com o horário de ontem à noite. Mesmo nome, dois rótulos.*"}},"day1":{"day1_eunsu_11_honest":{"text":"Hum… jogos e música. Faço um pouco dos dois."},"day1_eunsu_11_brief":{"text":"Música."},"day1_eunsu_11_sea":{"text":"*Olho primeiro para Sea. Ela aponta de leve com o queixo para a professora. Só então eu falo.*\n\n…Música."}}},"zh":{"day5":{"day5_morning_true_26":{"text":"*日志上写的是隔离，点名册上写的是昨晚那个时间的“转学”。同一个名字，每份文件里的说法都不一样。*"}},"day1":{"day1_eunsu_11_honest":{"text":"嗯……玩游戏，还有听音乐。两样都会一点。"},"day1_eunsu_11_brief":{"text":"音乐。"},"day1_eunsu_11_sea":{"text":"*我先看了世雅一眼。世雅用下巴朝老师那边轻轻点了点。我这才开口。*\n\n……音乐。"}}}};
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
      // Per-key resolution: the language's own PACK entry wins. A key that the
      // language has neither in PACK nor in its i18n JSON falls back to en so
      // that "[MISSING: ...]" never reaches the player.
      Object.keys(fbDay).forEach(function (id) {
        if (!ownDay[id] && !target[id]) target[id] = fbDay[id];
      });
      Object.assign(target, ownDay);
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
