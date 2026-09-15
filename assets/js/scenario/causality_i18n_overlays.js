/**
 * Runtime i18n patch for causality branch strings + transfer-line clarity.
 * Hooks I18nManager.loadDay / applies into texts[dayN].
 */
(function () {
  var PACK = {"ko":{"day1":{"day1_eunsu_11_honest":{"text":"음… 게임이랑 음악 듣는 거요. 둘 다 좀 합니다."},"day1_eunsu_11_brief":{"text":"음악이요."},"day1_eunsu_11_sea":{"text":"*먼저 세아 쪽을 봤다. 세아가 턱으로 살짝 가리킨다. 그제야 입을 연다.*\n\n…음악요."}},"day2":{"day2_night_ft_groupchat":{"text":"*예전 단톡방을 다시 열었다. '3명 읽음'은 그대로다. 새 말풍선은 없다.*"},"day2_night_ft_groupchat_2":{"text":"*손가락이 민수 개인 채팅으로 돌아간다. 이번엔 문장을 끝까지 치고 보냈다.*"},"day2_night_ft_putdown":{"text":"*화면을 끄고 휴대폰을 베개 옆에 내려놓았다. 액정은 이미 검은데 엄지 끝이 아직 가장자리에 남아 있다.*"},"day2_night_ft_putdown_2":{"text":"*천장 틈을 세고 있었다. 진동이 한 번 울렸다. 세아다.*"}},"day3":{"day3_morning_photo_back":{"text":"*조각 뒷면을 뒤집었다. 날짜만 흐릿하다. 그다음에야 주머니에 넣었다.*"},"day3_morning_photo_look":{"text":"*복도를 한 번 훑었다. 지나가는 발소리는 있어도 눈은 없다. 조각을 주머니에 밀어 넣었다.*"}},"day4":{"day4_lunch_nurse_ask_name":{"text":"그거… 이름이 뭐예요?"},"day4_lunch_nurse_ask_name_2":{"text":"영양제. 라벨 읽을 필요 없어. 그냥 누워."},"day4_lunch_nurse_ask_yuna":{"text":"유나한테도 그거 주셨어요?"},"day4_lunch_nurse_ask_yuna_2":{"text":"…유나 얘기는 내일. 지금은 너 약부터."},"day4_lunch_nurse_leave_ask":{"text":"*대답을 듣지 않고 나왔다. 등 뒤에서 앰플이 트레이에 닿는 소리가 짧게 났다.*"},"day4_lunch_nurse_leave_yuna":{"text":"*유나 이름을 꺼낸 뒤로는 더 묻지 못했다. 복도로 나오자 문틈으로 낮은 한숨이 새어 나온다.*"},"day4_lunch_nurse_15":{"text":"*웃으며 부드럽게 말하지만 손에는 아직 주사기를 들고 있다.*","choices":["바로 거절한다","약 이름을 묻는다","유나 이야기를 꺼낸다"]}},"day5":{"day5_morning_true_26":{"text":"*일지엔 격리, 출석부엔 어젯밤 시각의 '전학'. 같은 이름이 서류마다 다르게 적혀 있다.*"}}},"en":{"day1":{"day1_eunsu_11_honest":{"text":"Uh… games, and music. I do both a bit."},"day1_eunsu_11_brief":{"text":"Music."},"day1_eunsu_11_sea":{"text":"*I look at Sea first. She tips her chin toward the teacher. Only then do I speak.*\n\n…Music."}},"day2":{"day2_night_ft_groupchat":{"text":"*I open the old group chat again. Still '3 read'. No new bubbles.*"},"day2_night_ft_groupchat_2":{"text":"*My thumb slides back to Minsu's DM. This time I finish the sentence and send it.*"},"day2_night_ft_putdown":{"text":"*I shut the screen and set the phone by the pillow. The glass is already black, but my thumb stays on the edge.*"},"day2_night_ft_putdown_2":{"text":"*I was counting cracks in the ceiling when it buzzed once. Sea.*"}},"day3":{"day3_morning_photo_back":{"text":"*I flip the fragment. Only a date, half gone. Then it goes in my pocket.*"},"day3_morning_photo_look":{"text":"*I sweep the hall once. Footsteps pass, no eyes. I push the scrap into my pocket.*"}},"day4":{"day4_lunch_nurse_ask_name":{"text":"That… what's it called?"},"day4_lunch_nurse_ask_name_2":{"text":"A supplement. You don't need the label. Just lie down."},"day4_lunch_nurse_ask_yuna":{"text":"Did you give Yuna that too?"},"day4_lunch_nurse_ask_yuna_2":{"text":"…Yuna can wait until tomorrow. Your dose first."},"day4_lunch_nurse_leave_ask":{"text":"*I leave without waiting for more. Behind me an ampoule clicks against the tray.*"},"day4_lunch_nurse_leave_yuna":{"text":"*After saying Yuna's name I can't push further. In the hall a low sigh slips through the door.*"},"day4_lunch_nurse_15":{"text":"*A smiling face. A soft voice. A syringe in hand.*","choices":["Refuse immediately","Ask the drug name","Bring up Yuna"]}},"day5":{"day5_morning_true_26":{"text":"*The log says isolation. The roster stamps 'transfer' with last night's time. Same name, two different labels.*"}}},"ja":{"day5":{"day5_morning_true_26":{"text":"*日誌には隔離、出席簿には昨夜の時刻の『転校』。同じ名前が書類ごとに違う言葉で残っている。*"}}},"es":{"day5":{"day5_morning_true_26":{"text":"*El informe dice aislamiento. La lista marca 'traslado' con la hora de anoche. El mismo nombre, dos etiquetas.*"}}},"fr":{"day5":{"day5_morning_true_26":{"text":"*Le journal dit isolement. Le registre tamponne « transfert » à l'heure d'hier soir. Même nom, deux libellés.*"}}},"de":{"day5":{"day5_morning_true_26":{"text":"*Im Protokoll steht Isolation. Auf der Liste steht 'Transfer' mit der Uhrzeit von letzter Nacht. Derselbe Name, zwei Stempel.*"}}},"pt":{"day5":{"day5_morning_true_26":{"text":"*O registro diz isolamento. A lista carimba 'transferência' com o horário de ontem à noite. Mesmo nome, dois rótulos.*"}}}};
  function lang() {
    return (document.documentElement.lang || 'ko').slice(0, 2);
  }
  function applyToManager(mgr) {
    if (!mgr || !mgr.texts) return;
    var entriesByDay = PACK[lang()] || PACK.en || {};
    Object.keys(entriesByDay).forEach(function (dayKey) {
      mgr.texts[dayKey] = mgr.texts[dayKey] || {};
      Object.assign(mgr.texts[dayKey], entriesByDay[dayKey]);
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
