/**
 * GallerySystem.js - integrated unlockable gallery.
 *
 * Tracks endings, event CG, BGM, and character expression images in localStorage.
 * Items unlock when they are encountered during normal play.
 */

class GallerySystem {
    static STORAGE_KEY = 'nevergrad_gallery';
    static LEGACY_ENDING_STORAGE_KEY = 'nevergrad_endings';
    static VERSION = 2;

    static ENDINGS = [
        'TRUE END',
        'RESIST END',
        'FORGET END',
        'CAGE END',
        'GHOST END',
        'ESCAPE END',
        'COMPLICIT END'
    ];

    static REPLAY_SCENES = {
        cg_cycle07_seolhwa: 'day5_archive_cycle07_1',
        cg_cycle12_yuna: 'day5_archive_cycle12_1',
        'TRUE END': 'day5_ending_true_1',
        'RESIST END': 'day5_ending_resist_1',
        'FORGET END': 'day5_ending_forget_1',
        'CAGE END': 'day5_ending_cage_sea_1',
        'GHOST END': 'day5_ending_ghost_1',
        'ESCAPE END': 'day5_ending_escape_1',
        'COMPLICIT END': 'day5_ending_complicit_1'
    };

    static ENDING_DESCRIPTIONS = {
        'TRUE END': {
            ko: '진실을 마주한 끝에 졸업했다.',
            en: 'Faced the truth, and chose to graduate.',
            ja: '真実と向き合い、卒業を選んだ。',
            es: 'Enfrentaste la verdad y elegiste graduarte.',
            fr: 'Tu as fait face a la verite et choisi de partir.',
            de: 'Du hast die Wahrheit erkannt und den Abschluss gewaehlt.',
            pt: 'Voce encarou a verdade e escolheu se formar.',
            zh: '直面真相之后，毕业了。'
        },
        'RESIST END': {
            ko: '은수와 함께 교실을 나와 기록을 넘겼다.',
            en: 'You left the classroom with Ms. Eunsu and handed over the records.',
            ja: 'ウンス先生と教室を出て、記録を引き渡した。',
            es: 'Saliste del aula con la profesora Eunsu y entregaste los registros.',
            fr: 'Tu as quitté la classe avec Mme Eunsu et remis les dossiers.',
            de: 'Du hast mit Frau Eunsu das Klassenzimmer verlassen und die Unterlagen übergeben.',
            pt: 'Você saiu da sala com a professora Eunsu e entregou os registros.',
            zh: '和恩秀老师一起走出教室，交出了记录。'
        },
        'FORGET END': {
            ko: '모든 것을 잊고 열네 번째 등교를 시작했다.',
            en: 'You forgot everything and returned to ordinary days.',
            ja: 'すべてを忘れ、普通の日々へ戻った。',
            es: 'Lo olvidaste todo y volviste a la rutina.',
            fr: 'Tu as tout oublie et tu es retourne a ta vie ordinaire.',
            de: 'Du hast alles vergessen und bist in den Alltag zurueckgekehrt.',
            pt: 'Voce esqueceu tudo e voltou aos dias comuns.',
            zh: '忘记了一切，开始了第十四次上学。'
        },
        'CAGE END': {
            ko: '행복한 교실. 영원히.',
            en: 'A happy classroom. Forever.',
            ja: '幸せな教室。永遠に。',
            es: 'Un aula feliz. Para siempre.',
            fr: 'Une classe heureuse. Pour toujours.',
            de: 'Ein glueckliches Klassenzimmer. Fuer immer.',
            pt: 'Uma sala de aula feliz. Para sempre.',
            zh: '幸福的教室。永远。'
        },
        'GHOST END': {
            ko: '학교를 빠져나왔지만 교실에는 무언가 남았다.',
            en: 'You left, but something stayed behind in the classroom.',
            ja: 'あなたは去ったが、何かが教室に残った。',
            es: 'Te fuiste, pero algo se quedó en el aula.',
            fr: 'Tu es parti, mais quelque chose est reste dans la classe.',
            de: 'Du bist gegangen, aber etwas blieb im Klassenzimmer zurueck.',
            pt: 'Voce foi embora, mas algo ficou na sala de aula.',
            zh: '你离开了学校，但教室里留下了什么。'
        },
        'ESCAPE END': {
            ko: '탈출했지만 증거는 충분하지 않았다.',
            en: 'You escaped. But there was a price.',
            ja: '脱出した。けれど代償があった。',
            es: 'Escapaste. Pero hubo un precio.',
            fr: "Tu t'es echappe. Mais il y a eu un prix.",
            de: 'Du bist entkommen. Aber es hatte seinen Preis.',
            pt: 'Voce escapou. Mas houve um preco.',
            zh: '逃出来了，但证据并不充分。'
        },
        'COMPLICIT END': {
            ko: '공범이 되었다.',
            en: 'You became an accomplice.',
            ja: 'あなたは共犯者になった。',
            es: 'Te convertiste en cómplice.',
            fr: 'Tu es devenu complice.',
            de: 'Du wurdest zum Komplizen.',
            pt: 'Voce se tornou cumplice.',
            zh: '你成了共犯。'
        }
    };

    static LABELS = {
        ko: {
            "title": "갤러리",
            "progress": "해금률",
            "back": "돌아가기",
            "tabs": {
                "endings": "엔딩",
                "cg": "이벤트 CG",
                "music": "음악",
                "characters": "캐릭터"
            },
            "locked": "미해금",
            "lockedEnding": "아직 도달하지 못한 결말",
            "lockedCg": "게임에서 이 이벤트 CG를 보면 해금됩니다.",
            "lockedMusic": "게임에서 이 BGM이 재생되면 해금됩니다.",
            "lockedCharacter": "게임에서 이 인물을 만나면 해금됩니다.",
            "lockedExpression": "게임에서 이 표정을 보면 해금됩니다.",
            "play": "재생",
            "stop": "정지",
            "replay": "장면 회상",
            "artist": "Nevergrad OST",
            "expressions": "표정",
            "close": "닫기"
        },
        en: {
            title: 'Gallery',
            progress: 'Progress',
            back: 'Back',
            tabs: { endings: 'Endings', cg: 'Event CG', music: 'Music', characters: 'Expressions' },
            locked: 'Locked',
            lockedEnding: 'An ending yet to be reached',
            lockedCg: 'Unlocks after this event CG appears in the game.',
            lockedMusic: 'Unlocks after this BGM plays in the game.',
            lockedCharacter: 'Unlocks after meeting this character in the game.',
            lockedExpression: 'Unlocks after seeing this expression in the game.',
            play: 'Play',
            stop: 'Stop',
            artist: 'Nevergrad OST',
            expressions: 'Expressions',
            close: 'Close'
        },
        ja: {
            title: 'ギャラリー',
            progress: '解放率',
            back: '戻る',
            tabs: { endings: 'エンディング', cg: 'イベントCG', music: '音楽', characters: '表情' },
            locked: '未解放',
            lockedEnding: 'まだ到達していないエンディング',
            lockedCg: 'ゲーム内でこのイベントCGを見ると解放されます。',
            lockedMusic: 'ゲーム内でこのBGMが再生されると解放されます。',
            lockedCharacter: 'ゲーム内でこのキャラクターに出会うと解放されます。',
            lockedExpression: 'ゲーム内でこの表情を見ると解放されます。',
            play: '再生',
            stop: '停止',
            artist: 'Nevergrad OST',
            expressions: '表情',
            close: '閉じる'
        },
        es: {
            title: 'Galería',
            progress: 'Progreso',
            back: 'Volver',
            tabs: { endings: 'Finales', cg: 'CG de eventos', music: 'Música', characters: 'Expresiones' },
            locked: 'Bloqueado',
            lockedEnding: 'Final aún no alcanzado',
            lockedCg: 'Se desbloquea al ver este CG de evento en el juego.',
            lockedMusic: 'Se desbloquea cuando este BGM suena en el juego.',
            lockedCharacter: 'Se desbloquea al conocer a este personaje en el juego.',
            lockedExpression: 'Se desbloquea al ver esta expresión en el juego.',
            play: 'Reproducir',
            stop: 'Detener',
            artist: 'Nevergrad OST',
            expressions: 'Expresiones',
            close: 'Cerrar'
        },
        fr: {
            title: 'Galerie',
            progress: 'Progression',
            back: 'Retour',
            tabs: { endings: 'Fins', cg: "CG d’événement", music: 'Musique', characters: 'Expressions' },
            locked: 'Verrouillé',
            lockedEnding: 'Une fin qui reste à atteindre',
            lockedCg: "Se déverrouille après avoir vu ce CG d’événement dans le jeu.",
            lockedMusic: 'Se déverrouille lorsque cette musique est jouée dans le jeu.',
            lockedCharacter: 'Se déverrouille après avoir rencontré ce personnage dans le jeu.',
            lockedExpression: 'Se déverrouille après avoir vu cette expression dans le jeu.',
            play: 'Lire',
            stop: 'Arrêter',
            artist: 'Nevergrad OST',
            expressions: 'Expressions',
            close: 'Fermer'
        },
        de: {
            title: 'Galerie',
            progress: 'Fortschritt',
            back: 'Zurück',
            tabs: { endings: 'Enden', cg: 'Event-CG', music: 'Musik', characters: 'Ausdrücke' },
            locked: 'Gesperrt',
            lockedEnding: 'Ein noch nicht erreichtes Ende',
            lockedCg: 'Wird freigeschaltet, sobald dieses Event-CG im Spiel erscheint.',
            lockedMusic: 'Wird freigeschaltet, sobald diese Musik im Spiel abgespielt wird.',
            lockedCharacter: 'Wird freigeschaltet, nachdem du dieser Figur im Spiel begegnet bist.',
            lockedExpression: 'Wird freigeschaltet, nachdem du diesen Ausdruck im Spiel gesehen hast.',
            play: 'Abspielen',
            stop: 'Stoppen',
            artist: 'Nevergrad OST',
            expressions: 'Ausdrücke',
            close: 'Schließen'
        },
        pt: {
            title: 'Galeria',
            progress: 'Progresso',
            back: 'Voltar',
            tabs: { endings: 'Finais', cg: 'CG de eventos', music: 'Música', characters: 'Expressões' },
            locked: 'Bloqueado',
            lockedEnding: 'Um final ainda não alcançado',
            lockedCg: 'Desbloqueia após este CG de evento aparecer no jogo.',
            lockedMusic: 'Desbloqueia quando esta música tocar no jogo.',
            lockedCharacter: 'Desbloqueia após encontrar este personagem no jogo.',
            lockedExpression: 'Desbloqueia após ver esta expressão no jogo.',
            play: 'Reproduzir',
            stop: 'Parar',
            artist: 'Nevergrad OST',
            expressions: 'Expressões',
            close: 'Fechar'
        },
        zh: {
            title: '图鉴',
            progress: '解锁率',
            back: '返回',
            tabs: { endings: '结局', cg: '事件CG', music: '音乐', characters: '表情' },
            locked: '未解锁',
            lockedEnding: '尚未抵达的结局',
            lockedCg: '在游戏中看到该事件CG后解锁。',
            lockedMusic: '在游戏中播放该BGM后解锁。',
            lockedCharacter: '在游戏中遇到该人物后解锁。',
            lockedExpression: '在游戏中看到该表情后解锁。',
            play: '播放',
            stop: '停止',
            artist: 'Nevergrad OST',
            expressions: '表情',
            close: '关闭'
        }
    };

    static BGM_TITLES = {
        cycle07_elegy: 'Cycle 07: Elegy',
        complicit_cold_pulse: 'Complicit: Cold Pulse',
        yuna_theme: 'Yuna Theme',
        spring_bright: 'Spring Bright',
        daily_bright: 'Daily Bright',
        sunset_warm: 'Sunset Warm',
        night_calm: 'Night Calm',
        morning_bright: 'Morning Bright',
        morning_uneasy: 'Morning Uneasy',
        daily_tense: 'Daily Tense',
        riin_theme: 'Riin Theme',
        sea_theme: 'Sea Theme',
        eunsu_theme: 'Eunsu Theme',
        tension: 'Tension',
        tension_low: 'Low Tension',
        wind_ambient: 'Wind Ambient',
        tension_night: 'Night Tension',
        sea_obsession: 'Sea Obsession',
        heartbeat_loop: 'Heartbeat Loop',
        silence_tension: 'Silence Tension',
        music_box_broken: 'Broken Music Box',
        seolhwa_theme_broken: 'Seolhwa Broken Theme',
        confrontation: 'Confrontation',
        ending_dark: 'Ending: Dark',
        ending_ghost: 'Ending: Ghost',
        ending_hope: 'Ending: Hope',
        ending_melancholy: 'Ending: Melancholy',
        ending_bittersweet: 'Ending: Bittersweet',
        morning_peaceful: 'Morning Peaceful',
        chase: 'Chase'
    };

    static EXPANSION_CG_LABELS = {
        "ko": {
            "cg_cycle07_seolhwa": [
                "제7차 주기: 왼손",
                "빗속의 비상구에서 끝내 놓지 못한 설화의 손"
            ],
            "cg_cycle12_yuna": [
                "제12차 주기: 암실",
                "다음 등교를 위해 현상액 속에 남긴 유나의 필름"
            ],
            "ending_cage_eunsu": [
                "CAGE END: 은수의 교실",
                "은색 밴드와 영구히 유예된 졸업"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END: 관제실",
                "다음 주기의 승인 서류에 남은 내 서명"
            ],
            "ending_true": [
                "TRUE END: 열세 번째 졸업",
                "왼손에 쥔 연필과 마침내 열린 교문 너머의 아침"
            ],
            "ending_escape": [
                "ESCAPE END: 빗속의 탈출로",
                "충분한 증거 없이 학교 담장을 넘어 빠져나온 새벽"
            ],
            "ending_cage": [
                "CAGE END: 영원한 교실",
                "절대 졸업하지 않는 교실에 남아 맞이하는 오후"
            ],
            "ending_ghost": [
                "GHOST END: 빈자리의 흔적",
                "학교를 빠져나온 뒤에도 창가 책상에 남은 기척"
            ],
            "ending_forget": [
                "FORGET END: 열네 번째 등교",
                "모든 기억을 지우고 처음처럼 다시 건너는 교문"
            ],
            "ending_resist": [
                "RESIST END: 비상구의 기록",
                "은수와 함께 들고 나온 열두 번의 실험 기록"
            ],
            "ending_complicit": [
                "COMPLICIT END: 서명된 각서",
                "시스템의 일부가 되기로 승인한 마지막 페이지"
            ],
            "ending_cage_sea": [
                "CAGE END: 세아의 학생회실",
                "같은 도시락과 같은 노래가 끝없이 이어지는 방과 후"
            ],
            "closeup_m13_ampoule_tray": [
                "단서: M-13 앰플 트레이",
                "1번부터 12번까지 비어 있고 13번 홈만 남은 금속 트레이"
            ],
            "closeup_rooftop_etching": [
                "단서: 옥상 난간의 칼자국",
                "회색 페인트 아래 일곱 번째마다 깊게 패인 열두 줄의 홈"
            ]
        },
        "en": {
            "cg_cycle07_seolhwa": [
                "Cycle 07: The Left Hand",
                "Seolhwa’s hand, which I could never let go of at the rain-soaked emergency exit"
            ],
            "cg_cycle12_yuna": [
                "Cycle 12: The Darkroom",
                "Yuna’s film left in the developing solution for the next arrival at school"
            ],
            "ending_cage_eunsu": [
                "CAGE END: Eunsu’s Classroom",
                "A silver band and a graduation postponed forever"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END: The Control Room",
                "My signature on the approval papers for the next cycle"
            ],
            "ending_true": [
                "TRUE END: The Thirteenth Graduation",
                "A pencil in my left hand, and morning beyond the school gate that finally opened"
            ],
            "ending_escape": [
                "ESCAPE END: The Rainy Escape Route",
                "Dawn beyond the school wall, escaped without enough evidence"
            ],
            "ending_cage": [
                "CAGE END: The Eternal Classroom",
                "An afternoon spent in the classroom where graduation never comes"
            ],
            "ending_ghost": [
                "GHOST END: Traces of an Empty Seat",
                "A presence at the window-side desk, even after leaving the school"
            ],
            "ending_forget": [
                "FORGET END: The Fourteenth Arrival",
                "Crossing the gate as if for the first time, with every memory erased"
            ],
            "ending_resist": [
                "RESIST END: The Emergency-Exit Records",
                "Records from twelve experiments, brought out of the school with Eunsu"
            ],
            "ending_complicit": [
                "COMPLICIT END: The Signed Pledge",
                "The final page approving my place in the system"
            ],
            "ending_cage_sea": [
                "CAGE END: Sea’s Student Council Room",
                "The same lunchbox and the same song in an endless after-school afternoon"
            ],
            "closeup_m13_ampoule_tray": [
                "Clue: The M-13 Ampoule Tray",
                "A metal tray with slots 1 through 12 empty, leaving only slot 13"
            ],
            "closeup_rooftop_etching": [
                "Clue: Knife Marks on the Rooftop Railing",
                "Twelve grooves beneath the gray paint, cut deeper at every seventh stroke"
            ]
        },
        "ja": {
            "cg_cycle07_seolhwa": [
                "第7周期：左手",
                "雨の非常口で、最後まで離せなかったソルファの手"
            ],
            "cg_cycle12_yuna": [
                "第12周期：暗室",
                "次の登校のため、現像液の中に残したユナのフィルム"
            ],
            "ending_cage_eunsu": [
                "CAGE END：ウンスの教室",
                "銀のバンドと、永遠に延期された卒業"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END：管制室",
                "次の周期の承認書類に残る自分の署名"
            ],
            "ending_true": [
                "TRUE END：十三回目の卒業",
                "左手の鉛筆と、ようやく開いた校門の向こうの朝"
            ],
            "ending_escape": [
                "ESCAPE END：雨の脱出路",
                "十分な証拠を持たず、学校の塀を越えた夜明け"
            ],
            "ending_cage": [
                "CAGE END：永遠の教室",
                "決して卒業できない教室で迎える午後"
            ],
            "ending_ghost": [
                "GHOST END：空席の痕跡",
                "学校を出たあとも、窓際の机に残る気配"
            ],
            "ending_forget": [
                "FORGET END：十四回目の登校",
                "すべての記憶を消し、初めてのようにくぐる校門"
            ],
            "ending_resist": [
                "RESIST END：非常口の記録",
                "ウンスと一緒に持ち出した十二回の実験記録"
            ],
            "ending_complicit": [
                "COMPLICIT END：署名した誓約書",
                "システムの一部になることを認めた最後のページ"
            ],
            "ending_cage_sea": [
                "CAGE END：セアの生徒会室",
                "同じ弁当と同じ歌が、放課後にいつまでも続く"
            ],
            "closeup_m13_ampoule_tray": [
                "手がかり：M-13アンプルトレー",
                "1番から12番が空で、13番のくぼみだけが残った金属トレー"
            ],
            "closeup_rooftop_etching": [
                "手がかり：屋上の手すりの刃傷",
                "灰色の塗料の下にある十二本の溝。七本目ごとに深く刻まれている"
            ]
        },
        "es": {
            "cg_cycle07_seolhwa": [
                "Ciclo 07: La mano izquierda",
                "La mano de Seolhwa que no pude soltar ante la salida de emergencia bajo la lluvia"
            ],
            "cg_cycle12_yuna": [
                "Ciclo 12: El cuarto oscuro",
                "La película que Yuna dejó en el revelador para la próxima llegada a la escuela"
            ],
            "ending_cage_eunsu": [
                "CAGE END: El aula de Eunsu",
                "Una pulsera plateada y una graduación pospuesta para siempre"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END: La sala de control",
                "Mi firma en los documentos que autorizan el próximo ciclo"
            ],
            "ending_true": [
                "TRUE END: La decimotercera graduación",
                "Un lápiz en la mano izquierda y la mañana al otro lado del portón, por fin abierto"
            ],
            "ending_escape": [
                "ESCAPE END: La fuga bajo la lluvia",
                "El amanecer tras saltar el muro de la escuela sin suficientes pruebas"
            ],
            "ending_cage": [
                "CAGE END: El aula eterna",
                "Una tarde en el aula de la que nadie se gradúa"
            ],
            "ending_ghost": [
                "GHOST END: El rastro del asiento vacío",
                "Una presencia junto a la ventana, incluso después de escapar de la escuela"
            ],
            "ending_forget": [
                "FORGET END: La decimocuarta llegada",
                "Sin ningún recuerdo, cruzar el portón como si fuera la primera vez"
            ],
            "ending_resist": [
                "RESIST END: Los registros de la salida",
                "Los registros de doce experimentos que sacamos Eunsu y yo"
            ],
            "ending_complicit": [
                "COMPLICIT END: El compromiso firmado",
                "La última página que autoriza mi incorporación al sistema"
            ],
            "ending_cage_sea": [
                "CAGE END: El consejo de Sea",
                "La misma lonchera y la misma canción en una tarde que no termina"
            ],
            "closeup_m13_ampoule_tray": [
                "Pista: La bandeja de ampollas M-13",
                "Una bandeja metálica con los huecos 1 al 12 vacíos; solo queda el 13"
            ],
            "closeup_rooftop_etching": [
                "Pista: Los cortes de la baranda",
                "Doce surcos bajo la pintura gris, más profundos cada siete trazos"
            ]
        },
        "fr": {
            "cg_cycle07_seolhwa": [
                "Cycle 07 : La main gauche",
                "La main de Seolhwa, impossible à lâcher à la sortie de secours sous la pluie"
            ],
            "cg_cycle12_yuna": [
                "Cycle 12 : La chambre noire",
                "La pellicule de Yuna, laissée dans le révélateur pour la prochaine arrivée à l’école"
            ],
            "ending_cage_eunsu": [
                "CAGE END : La classe d’Eunsu",
                "Un bracelet argenté et une remise des diplômes repoussée à jamais"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END : La salle de contrôle",
                "Ma signature sur les autorisations du prochain cycle"
            ],
            "ending_true": [
                "TRUE END : Le treizième diplôme",
                "Un crayon dans la main gauche, et le matin au-delà du portail enfin ouvert"
            ],
            "ending_escape": [
                "ESCAPE END : La fuite sous la pluie",
                "L’aube après avoir franchi le mur de l’école sans preuves suffisantes"
            ],
            "ending_cage": [
                "CAGE END : La classe éternelle",
                "Un après-midi dans la classe où personne ne reçoit jamais son diplôme"
            ],
            "ending_ghost": [
                "GHOST END : Les traces d’une place vide",
                "Une présence au pupitre près de la fenêtre, même après avoir quitté l’école"
            ],
            "ending_forget": [
                "FORGET END : La quatorzième rentrée",
                "Tous les souvenirs effacés, le portail franchi comme au premier jour"
            ],
            "ending_resist": [
                "RESIST END : Les dossiers de la sortie de secours",
                "Les traces de douze expériences emportées avec Eunsu"
            ],
            "ending_complicit": [
                "COMPLICIT END : L’engagement signé",
                "La dernière page approuvant mon entrée dans le système"
            ],
            "ending_cage_sea": [
                "CAGE END : Le conseil de Sea",
                "La même boîte-repas et la même chanson après les cours, à l’infini"
            ],
            "closeup_m13_ampoule_tray": [
                "Indice : Le plateau d’ampoules M-13",
                "Un plateau métallique aux logements 1 à 12 vides ; seul le 13 reste"
            ],
            "closeup_rooftop_etching": [
                "Indice : Les entailles du toit",
                "Douze rainures sous la peinture grise, plus profondes tous les sept traits"
            ]
        },
        "de": {
            "cg_cycle07_seolhwa": [
                "Zyklus 07: Die linke Hand",
                "Seolhwas Hand, die ich am regennassen Notausgang nicht loslassen konnte"
            ],
            "cg_cycle12_yuna": [
                "Zyklus 12: Die Dunkelkammer",
                "Yunas Film im Entwicklerbad, aufbewahrt für die nächste Ankunft in der Schule"
            ],
            "ending_cage_eunsu": [
                "CAGE END: Eunsus Klassenzimmer",
                "Ein silbernes Band und ein für immer vertagter Abschluss"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END: Der Kontrollraum",
                "Meine Unterschrift unter der Genehmigung für den nächsten Zyklus"
            ],
            "ending_true": [
                "TRUE END: Der dreizehnte Abschluss",
                "Ein Bleistift in der linken Hand und der Morgen hinter dem endlich offenen Schultor"
            ],
            "ending_escape": [
                "ESCAPE END: Der Fluchtweg im Regen",
                "Morgengrauen nach der Flucht über die Schulmauer, ohne genügend Beweise"
            ],
            "ending_cage": [
                "CAGE END: Das ewige Klassenzimmer",
                "Ein Nachmittag im Klassenzimmer, in dem es niemals einen Abschluss gibt"
            ],
            "ending_ghost": [
                "GHOST END: Spuren eines leeren Platzes",
                "Eine Präsenz am Fensterplatz, auch nach der Flucht aus der Schule"
            ],
            "ending_forget": [
                "FORGET END: Der vierzehnte Schultag",
                "Alle Erinnerungen gelöscht, wieder zum ersten Mal durch das Schultor"
            ],
            "ending_resist": [
                "RESIST END: Die Unterlagen am Notausgang",
                "Mit Eunsu hinausgetragene Aufzeichnungen über zwölf Experimente"
            ],
            "ending_complicit": [
                "COMPLICIT END: Die unterschriebene Erklärung",
                "Die letzte Seite, die mich zum Teil des Systems macht"
            ],
            "ending_cage_sea": [
                "CAGE END: Seas Schülerratsraum",
                "Dieselbe Brotdose, dasselbe Lied und ein endloser Nachmittag nach dem Unterricht"
            ],
            "closeup_m13_ampoule_tray": [
                "Hinweis: Die M-13-Ampullenschale",
                "Eine Metallschale mit leeren Fächern 1 bis 12; nur Fach 13 bleibt"
            ],
            "closeup_rooftop_etching": [
                "Hinweis: Messerspuren am Dachgeländer",
                "Zwölf Rillen unter grauer Farbe, jede siebte tiefer eingeschnitten"
            ]
        },
        "pt": {
            "cg_cycle07_seolhwa": [
                "Ciclo 07: A mão esquerda",
                "A mão de Seolhwa que não consegui soltar na saída de emergência sob a chuva"
            ],
            "cg_cycle12_yuna": [
                "Ciclo 12: A sala escura",
                "O filme de Yuna deixado no revelador para a próxima chegada à escola"
            ],
            "ending_cage_eunsu": [
                "CAGE END: A sala de Eunsu",
                "Uma pulseira prateada e uma formatura adiada para sempre"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END: A sala de controle",
                "Minha assinatura nos documentos que aprovam o próximo ciclo"
            ],
            "ending_true": [
                "TRUE END: A décima terceira formatura",
                "Um lápis na mão esquerda e a manhã além do portão que enfim se abriu"
            ],
            "ending_escape": [
                "ESCAPE END: A fuga na chuva",
                "O amanhecer após fugir pelo muro da escola sem provas suficientes"
            ],
            "ending_cage": [
                "CAGE END: A sala eterna",
                "Uma tarde na sala onde a formatura nunca chega"
            ],
            "ending_ghost": [
                "GHOST END: Vestígios de um lugar vazio",
                "Uma presença na carteira junto à janela, mesmo depois de sair da escola"
            ],
            "ending_forget": [
                "FORGET END: A décima quarta chegada",
                "Sem nenhuma lembrança, atravessar o portão como na primeira vez"
            ],
            "ending_resist": [
                "RESIST END: Os registros da saída",
                "Os registros de doze experimentos levados para fora com Eunsu"
            ],
            "ending_complicit": [
                "COMPLICIT END: O compromisso assinado",
                "A última página aprovando minha entrada no sistema"
            ],
            "ending_cage_sea": [
                "CAGE END: O conselho de Sea",
                "A mesma lancheira e a mesma música numa tarde sem fim depois da aula"
            ],
            "closeup_m13_ampoule_tray": [
                "Pista: A bandeja de ampolas M-13",
                "Uma bandeja de metal com os espaços 1 a 12 vazios; só resta o 13"
            ],
            "closeup_rooftop_etching": [
                "Pista: Os cortes no corrimão",
                "Doze sulcos sob a tinta cinza, mais profundos a cada sete traços"
            ]
        },
        "zh": {
            "cg_cycle07_seolhwa": [
                "第7次周期：左手",
                "雨中的逃生门前，始终没能松开的雪花的手"
            ],
            "cg_cycle12_yuna": [
                "第12次周期：暗房",
                "由娜为下次上学留在显影液里的胶片"
            ],
            "ending_cage_eunsu": [
                "CAGE END：恩秀的教室",
                "银色手环与被永远推迟的毕业"
            ],
            "ending_complicit_monitors": [
                "COMPLICIT END：管制室",
                "下个周期的批准文件上留下的我的签名"
            ],
            "ending_true": [
                "TRUE END：第十三次毕业",
                "左手握着铅笔，终于敞开的校门外迎来清晨"
            ],
            "ending_escape": [
                "ESCAPE END：雨中的逃生路",
                "没有足够证据，翻越学校围墙逃出的黎明"
            ],
            "ending_cage": [
                "CAGE END：永恒的教室",
                "留在永不毕业的教室里迎来的午后"
            ],
            "ending_ghost": [
                "GHOST END：空座的痕迹",
                "逃离学校后，窗边课桌仍残留的气息"
            ],
            "ending_forget": [
                "FORGET END：第十四次上学",
                "清除所有记忆，再次如初次般走过校门"
            ],
            "ending_resist": [
                "RESIST END：逃生门的记录",
                "与恩秀一起带出的十二次实验记录"
            ],
            "ending_complicit": [
                "COMPLICIT END：签署的承诺书",
                "批准自己成为系统一部分的最后一页"
            ],
            "ending_cage_sea": [
                "CAGE END：世雅的学生会室",
                "同样的便当和歌声，在放学后无尽重复"
            ],
            "closeup_m13_ampoule_tray": [
                "线索：M-13安瓿托盘",
                "1至12号都是空的，只剩13号凹槽的金属托盘"
            ],
            "closeup_rooftop_etching": [
                "线索：天台栏杆的刀痕",
                "灰漆下的十二道凹痕，每第七道刻得更深"
            ]
        }
    };

    static EXPRESSION_TITLES = {
        normal: 'Normal',
        smile: 'Smile',
        gentle: 'Gentle',
        warm: 'Warm',
        shy: 'Shy',
        serious: 'Serious',
        angry: 'Angry',
        close: 'Close',
        cold: 'Cold',
        dark: 'Dark',
        obsessed: 'Obsessed',
        shaking: 'Shaking',
        crying: 'Crying',
        seductive: 'Seductive',
        pleased: 'Pleased',
        neutral: 'Neutral',
        pain: 'Pain',
        relief: 'Relief',
        sad: 'Sad',
        hurt: 'Hurt',
        cry: 'Crying',
        yandere: 'Yandere',
        vulnerable: 'Vulnerable',
        broken_smile: 'Broken Smile',
        scared: 'Scared',
        desperate: 'Desperate',
        weak: 'Weak',
        determined: 'Determined',
        fade: 'Fading',
        ghost: 'Ghost',
        quiet: 'Quiet'
    };

    static BGM_TITLES_KO = {
        "cycle07_elegy": "제7차 주기: 빗속의 엘레지",
        "complicit_cold_pulse": "공범: 차가운 맥박",
        "yuna_theme": "유나의 테마: 뷰파인더 너머",
        "spring_bright": "봄날의 교정",
        "daily_bright": "쉬는 시간의 햇살",
        "sunset_warm": "방과 후의 노을",
        "night_calm": "잠든 교실의 숨결",
        "morning_bright": "첫 등교의 아침",
        "morning_uneasy": "어긋난 조회 시간",
        "daily_tense": "복도에 남은 시선",
        "riin_theme": "리인의 테마: 캐모마일과 소독약",
        "sea_theme": "세아의 테마: 이어폰 한쪽",
        "eunsu_theme": "은수의 테마: 담임의 커피잔",
        "tension": "좁혀오는 발소리",
        "tension_low": "낮게 깔린 정적",
        "wind_ambient": "옥상 철망의 바람",
        "tension_night": "자정의 순찰등",
        "sea_obsession": "잠긴 학생회실",
        "heartbeat_loop": "열세 번째 맥박",
        "silence_tension": "끊어진 방송",
        "music_box_broken": "태엽이 나간 오르골",
        "seolhwa_theme_broken": "설화의 테마: 지워진 출석부",
        "confrontation": "대면: 열세 번의 기록",
        "ending_dark": "결말: 닫힌 교문",
        "ending_ghost": "결말: 창가의 잔상",
        "ending_hope": "결말: 졸업식 아침",
        "ending_melancholy": "결말: 젖은 아스팔트",
        "ending_bittersweet": "결말: 남겨진 필름",
        "morning_peaceful": "아무 일 없던 아침",
        "chase": "비상계단 추격"
    };

    static EXPRESSION_TITLES_KO = {
        "normal": "평소",
        "smile": "미소",
        "gentle": "다정함",
        "warm": "온화함",
        "shy": "수줍음",
        "serious": "진지함",
        "angry": "분노",
        "close": "다가섬",
        "cold": "차가움",
        "dark": "그늘짐",
        "obsessed": "집착",
        "shaking": "흔들림",
        "crying": "눈물",
        "seductive": "속삭임",
        "pleased": "만족",
        "neutral": "무표정",
        "pain": "고통",
        "relief": "안도",
        "sad": "슬픔",
        "hurt": "상처",
        "cry": "오열",
        "yandere": "광기",
        "vulnerable": "위태로움",
        "broken_smile": "부서진 미소",
        "scared": "공포",
        "desperate": "절박함",
        "weak": "수척함",
        "determined": "결의",
        "fade": "흐려짐",
        "ghost": "잔상",
        "quiet": "침묵"
    };

    static BGM_TITLES_LOCALIZED = {
        "ko": {
            "cycle07_elegy": "제7차 주기: 빗속의 엘레지",
            "complicit_cold_pulse": "공범: 차가운 맥박",
            "yuna_theme": "유나의 테마: 뷰파인더 너머",
            "spring_bright": "봄날의 교정",
            "daily_bright": "쉬는 시간의 햇살",
            "sunset_warm": "방과 후의 노을",
            "night_calm": "잠든 교실의 숨결",
            "morning_bright": "첫 등교의 아침",
            "morning_uneasy": "어긋난 조회 시간",
            "daily_tense": "복도에 남은 시선",
            "riin_theme": "리인의 테마: 캐모마일과 소독약",
            "sea_theme": "세아의 테마: 이어폰 한쪽",
            "eunsu_theme": "은수의 테마: 담임의 커피잔",
            "tension": "좁혀오는 발소리",
            "tension_low": "낮게 깔린 정적",
            "wind_ambient": "옥상 철망의 바람",
            "tension_night": "자정의 순찰등",
            "sea_obsession": "잠긴 학생회실",
            "heartbeat_loop": "열세 번째 맥박",
            "silence_tension": "끊어진 방송",
            "music_box_broken": "태엽이 나간 오르골",
            "seolhwa_theme_broken": "설화의 테마: 지워진 출석부",
            "confrontation": "대면: 열세 번의 기록",
            "ending_dark": "결말: 닫힌 교문",
            "ending_ghost": "결말: 창가의 잔상",
            "ending_hope": "결말: 졸업식 아침",
            "ending_melancholy": "결말: 젖은 아스팔트",
            "ending_bittersweet": "결말: 남겨진 필름",
            "morning_peaceful": "아무 일 없던 아침",
            "chase": "비상계단 추격"
        },
        "en": {
            "cycle07_elegy": "Cycle 07: Elegy in the Rain",
            "complicit_cold_pulse": "Accomplice: A Cold Pulse",
            "yuna_theme": "Yuna’s Theme: Beyond the Viewfinder",
            "spring_bright": "The Schoolyard in Spring",
            "daily_bright": "Sunlight at Recess",
            "sunset_warm": "Sunset After School",
            "night_calm": "The Breath of a Sleeping Classroom",
            "morning_bright": "Morning on the First Day",
            "morning_uneasy": "Homeroom Out of Step",
            "daily_tense": "A Gaze Left in the Hallway",
            "riin_theme": "Riin’s Theme: Chamomile and Disinfectant",
            "sea_theme": "Sea’s Theme: One Earbud",
            "eunsu_theme": "Eunsu’s Theme: The Homeroom Teacher’s Coffee Cup",
            "tension": "Footsteps Drawing Closer",
            "tension_low": "A Low, Settled Silence",
            "wind_ambient": "Wind Through the Rooftop Fence",
            "tension_night": "The Midnight Patrol Light",
            "sea_obsession": "The Locked Student Council Room",
            "heartbeat_loop": "The Thirteenth Pulse",
            "silence_tension": "The Interrupted Broadcast",
            "music_box_broken": "The Unwound Music Box",
            "seolhwa_theme_broken": "Seolhwa’s Theme: The Erased Register",
            "confrontation": "Confrontation: Records of Thirteen Times",
            "ending_dark": "Ending: The Closed School Gate",
            "ending_ghost": "Ending: Afterimage by the Window",
            "ending_hope": "Ending: Graduation Morning",
            "ending_melancholy": "Ending: Wet Asphalt",
            "ending_bittersweet": "Ending: The Film Left Behind",
            "morning_peaceful": "A Morning When Nothing Happened",
            "chase": "Chase on the Emergency Stairs"
        },
        "ja": {
            "cycle07_elegy": "第7周期：雨のエレジー",
            "complicit_cold_pulse": "共犯：冷たい脈",
            "yuna_theme": "ユナのテーマ：ファインダーの向こう",
            "spring_bright": "春の校庭",
            "daily_bright": "休み時間の日差し",
            "sunset_warm": "放課後の夕焼け",
            "night_calm": "眠る教室の息遣い",
            "morning_bright": "初登校の朝",
            "morning_uneasy": "ずれたホームルーム",
            "daily_tense": "廊下に残る視線",
            "riin_theme": "リインのテーマ：カモミールと消毒液",
            "sea_theme": "セアのテーマ：片方のイヤホン",
            "eunsu_theme": "ウンスのテーマ：担任のコーヒーカップ",
            "tension": "迫る足音",
            "tension_low": "低く沈む静けさ",
            "wind_ambient": "屋上の金網を抜ける風",
            "tension_night": "真夜中の巡回灯",
            "sea_obsession": "鍵のかかった生徒会室",
            "heartbeat_loop": "十三回目の脈",
            "silence_tension": "途切れた放送",
            "music_box_broken": "ぜんまいの切れたオルゴール",
            "seolhwa_theme_broken": "ソルファのテーマ：消された出席簿",
            "confrontation": "対面：十三回の記録",
            "ending_dark": "結末：閉ざされた校門",
            "ending_ghost": "結末：窓際の残像",
            "ending_hope": "結末：卒業式の朝",
            "ending_melancholy": "結末：濡れたアスファルト",
            "ending_bittersweet": "結末：残されたフィルム",
            "morning_peaceful": "何事もなかった朝",
            "chase": "非常階段の追跡"
        },
        "es": {
            "cycle07_elegy": "Ciclo 07: Elegía bajo la lluvia",
            "complicit_cold_pulse": "Cómplice: Un pulso frío",
            "yuna_theme": "Tema de Yuna: Más allá del visor",
            "spring_bright": "El patio en primavera",
            "daily_bright": "Sol durante el recreo",
            "sunset_warm": "El atardecer después de clases",
            "night_calm": "El aliento del aula dormida",
            "morning_bright": "La mañana del primer día",
            "morning_uneasy": "Un pase de lista desajustado",
            "daily_tense": "Una mirada en el pasillo",
            "riin_theme": "Tema de Riin: Manzanilla y desinfectante",
            "sea_theme": "Tema de Sea: Un solo audífono",
            "eunsu_theme": "Tema de Eunsu: La taza de la tutora",
            "tension": "Pasos que se acercan",
            "tension_low": "Un silencio que pesa",
            "wind_ambient": "Viento en la malla de la azotea",
            "tension_night": "La luz de la ronda de medianoche",
            "sea_obsession": "La sala del consejo cerrada",
            "heartbeat_loop": "El decimotercer latido",
            "silence_tension": "La transmisión interrumpida",
            "music_box_broken": "La caja de música sin cuerda",
            "seolhwa_theme_broken": "Tema de Seolhwa: La lista borrada",
            "confrontation": "Cara a cara: Trece registros",
            "ending_dark": "Final: El portón cerrado",
            "ending_ghost": "Final: La imagen junto a la ventana",
            "ending_hope": "Final: La mañana de la graduación",
            "ending_melancholy": "Final: El asfalto mojado",
            "ending_bittersweet": "Final: La película que quedó atrás",
            "morning_peaceful": "Una mañana sin incidentes",
            "chase": "Persecución en la escalera de emergencia"
        },
        "fr": {
            "cycle07_elegy": "Cycle 07 : Élégie sous la pluie",
            "complicit_cold_pulse": "Complice : Un pouls glacé",
            "yuna_theme": "Thème de Yuna : Au-delà du viseur",
            "spring_bright": "La cour au printemps",
            "daily_bright": "Le soleil de la récréation",
            "sunset_warm": "Le couchant après les cours",
            "night_calm": "Le souffle de la classe endormie",
            "morning_bright": "Le matin du premier jour",
            "morning_uneasy": "Un appel décalé",
            "daily_tense": "Un regard dans le couloir",
            "riin_theme": "Thème de Riin : Camomille et désinfectant",
            "sea_theme": "Thème de Sea : Un seul écouteur",
            "eunsu_theme": "Thème d’Eunsu : La tasse de la professeure principale",
            "tension": "Des pas qui se rapprochent",
            "tension_low": "Un silence pesant",
            "wind_ambient": "Le vent dans le grillage du toit",
            "tension_night": "La lumière de la ronde de minuit",
            "sea_obsession": "La salle du conseil verrouillée",
            "heartbeat_loop": "Le treizième battement",
            "silence_tension": "La diffusion interrompue",
            "music_box_broken": "La boîte à musique au ressort détendu",
            "seolhwa_theme_broken": "Thème de Seolhwa : Le registre effacé",
            "confrontation": "Face-à-face : Treize séries de traces",
            "ending_dark": "Fin : Le portail fermé",
            "ending_ghost": "Fin : Une rémanence à la fenêtre",
            "ending_hope": "Fin : Le matin de la remise des diplômes",
            "ending_melancholy": "Fin : L’asphalte mouillé",
            "ending_bittersweet": "Fin : La pellicule laissée derrière",
            "morning_peaceful": "Un matin sans incident",
            "chase": "Poursuite dans l’escalier de secours"
        },
        "de": {
            "cycle07_elegy": "Zyklus 07: Elegie im Regen",
            "complicit_cold_pulse": "Komplize: Ein kalter Puls",
            "yuna_theme": "Yunas Thema: Hinter dem Sucher",
            "spring_bright": "Der Schulhof im Frühling",
            "daily_bright": "Sonne in der Pause",
            "sunset_warm": "Sonnenuntergang nach dem Unterricht",
            "night_calm": "Der Atem des schlafenden Klassenzimmers",
            "morning_bright": "Der Morgen des ersten Schultags",
            "morning_uneasy": "Ein verschobener Morgenappell",
            "daily_tense": "Ein Blick im Flur",
            "riin_theme": "Riins Thema: Kamille und Desinfektionsmittel",
            "sea_theme": "Seas Thema: Ein Ohrhörer",
            "eunsu_theme": "Eunsus Thema: Die Kaffeetasse der Klassenlehrerin",
            "tension": "Näher kommende Schritte",
            "tension_low": "Eine tief liegende Stille",
            "wind_ambient": "Wind am Dachzaun",
            "tension_night": "Das Licht der Mitternachtsrunde",
            "sea_obsession": "Der verschlossene Schülerratsraum",
            "heartbeat_loop": "Der dreizehnte Puls",
            "silence_tension": "Die unterbrochene Durchsage",
            "music_box_broken": "Die Spieluhr ohne Aufzug",
            "seolhwa_theme_broken": "Seolhwas Thema: Das gelöschte Klassenbuch",
            "confrontation": "Gegenüber: Dreizehn Aufzeichnungen",
            "ending_dark": "Ende: Das geschlossene Schultor",
            "ending_ghost": "Ende: Das Nachbild am Fenster",
            "ending_hope": "Ende: Der Morgen der Abschlussfeier",
            "ending_melancholy": "Ende: Nasser Asphalt",
            "ending_bittersweet": "Ende: Der zurückgelassene Film",
            "morning_peaceful": "Ein Morgen ohne Zwischenfall",
            "chase": "Verfolgung auf der Nottreppe"
        },
        "pt": {
            "cycle07_elegy": "Ciclo 07: Elegia na chuva",
            "complicit_cold_pulse": "Cúmplice: Um pulso frio",
            "yuna_theme": "Tema de Yuna: Além do visor",
            "spring_bright": "O pátio na primavera",
            "daily_bright": "Sol no recreio",
            "sunset_warm": "O entardecer depois da aula",
            "night_calm": "A respiração da sala adormecida",
            "morning_bright": "A manhã do primeiro dia",
            "morning_uneasy": "Uma chamada fora de compasso",
            "daily_tense": "Um olhar no corredor",
            "riin_theme": "Tema de Riin: Camomila e desinfetante",
            "sea_theme": "Tema de Sea: Um lado do fone",
            "eunsu_theme": "Tema de Eunsu: A xícara da professora titular",
            "tension": "Passos se aproximando",
            "tension_low": "Um silêncio que pesa",
            "wind_ambient": "Vento na cerca do terraço",
            "tension_night": "A luz da ronda da meia-noite",
            "sea_obsession": "A sala trancada do conselho",
            "heartbeat_loop": "O décimo terceiro pulso",
            "silence_tension": "A transmissão interrompida",
            "music_box_broken": "A caixa de música sem corda",
            "seolhwa_theme_broken": "Tema de Seolhwa: A chamada apagada",
            "confrontation": "Frente a frente: Treze registros",
            "ending_dark": "Final: O portão fechado",
            "ending_ghost": "Final: O vulto junto à janela",
            "ending_hope": "Final: A manhã da formatura",
            "ending_melancholy": "Final: O asfalto molhado",
            "ending_bittersweet": "Final: O filme que ficou",
            "morning_peaceful": "Uma manhã sem incidentes",
            "chase": "Perseguição na escada de emergência"
        },
        "zh": {
            "cycle07_elegy": "第7次周期：雨中挽歌",
            "complicit_cold_pulse": "共犯：冰冷的脉搏",
            "yuna_theme": "由娜的主题：取景器彼端",
            "spring_bright": "春日校园",
            "daily_bright": "课间的阳光",
            "sunset_warm": "放学后的晚霞",
            "night_calm": "沉睡教室的呼吸",
            "morning_bright": "第一次上学的早晨",
            "morning_uneasy": "错位的早会",
            "daily_tense": "走廊里留下的视线",
            "riin_theme": "莉仁的主题：洋甘菊与消毒水",
            "sea_theme": "世雅的主题：一边耳机",
            "eunsu_theme": "恩秀的主题：班主任的咖啡杯",
            "tension": "逐渐逼近的脚步",
            "tension_low": "低低笼罩的寂静",
            "wind_ambient": "天台铁丝网的风",
            "tension_night": "午夜巡逻灯",
            "sea_obsession": "锁住的学生会室",
            "heartbeat_loop": "第十三次脉搏",
            "silence_tension": "中断的广播",
            "music_box_broken": "发条失灵的八音盒",
            "seolhwa_theme_broken": "雪花的主题：被抹去的点名册",
            "confrontation": "对面：十三次记录",
            "ending_dark": "结局：紧闭的校门",
            "ending_ghost": "结局：窗边残影",
            "ending_hope": "结局：毕业典礼的清晨",
            "ending_melancholy": "结局：湿润的柏油路",
            "ending_bittersweet": "结局：留下的胶片",
            "morning_peaceful": "若无其事的早晨",
            "chase": "逃生楼梯追逐"
        }
    };

    static EXPRESSION_TITLES_LOCALIZED = {
        "ko": {
            "normal": "평소",
            "smile": "미소",
            "gentle": "다정함",
            "warm": "온화함",
            "shy": "수줍음",
            "serious": "진지함",
            "angry": "분노",
            "close": "다가섬",
            "cold": "차가움",
            "dark": "그늘짐",
            "obsessed": "집착",
            "shaking": "흔들림",
            "crying": "눈물",
            "seductive": "속삭임",
            "pleased": "만족",
            "neutral": "무표정",
            "pain": "고통",
            "relief": "안도",
            "sad": "슬픔",
            "hurt": "상처",
            "cry": "오열",
            "yandere": "광기",
            "vulnerable": "위태로움",
            "broken_smile": "부서진 미소",
            "scared": "공포",
            "desperate": "절박함",
            "weak": "수척함",
            "determined": "결의",
            "fade": "흐려짐",
            "ghost": "잔상",
            "quiet": "침묵"
        },
        "en": {
            "normal": "Everyday",
            "smile": "Smile",
            "gentle": "Kindness",
            "warm": "Warmth",
            "shy": "Shyness",
            "serious": "Seriousness",
            "angry": "Anger",
            "close": "Drawing Close",
            "cold": "Coldness",
            "dark": "Shadowed",
            "obsessed": "Obsession",
            "shaking": "Trembling",
            "crying": "Tears",
            "seductive": "Whisper",
            "pleased": "Satisfaction",
            "neutral": "Expressionless",
            "pain": "Pain",
            "relief": "Relief",
            "sad": "Sadness",
            "hurt": "Hurt",
            "cry": "Sobbing",
            "yandere": "Madness",
            "vulnerable": "Vulnerability",
            "broken_smile": "Broken Smile",
            "scared": "Fear",
            "desperate": "Desperation",
            "weak": "Gaunt",
            "determined": "Determination",
            "fade": "Fading",
            "ghost": "Afterimage",
            "quiet": "Silence"
        },
        "ja": {
            "normal": "普段",
            "smile": "微笑み",
            "gentle": "優しさ",
            "warm": "穏やかさ",
            "shy": "照れ",
            "serious": "真剣",
            "angry": "怒り",
            "close": "接近",
            "cold": "冷たさ",
            "dark": "陰り",
            "obsessed": "執着",
            "shaking": "震え",
            "crying": "涙",
            "seductive": "囁き",
            "pleased": "満足",
            "neutral": "無表情",
            "pain": "痛み",
            "relief": "安堵",
            "sad": "悲しみ",
            "hurt": "傷",
            "cry": "嗚咽",
            "yandere": "狂気",
            "vulnerable": "危うさ",
            "broken_smile": "壊れた笑み",
            "scared": "恐怖",
            "desperate": "切迫",
            "weak": "やつれ",
            "determined": "決意",
            "fade": "薄れ",
            "ghost": "残像",
            "quiet": "沈黙"
        },
        "es": {
            "normal": "Habitual",
            "smile": "Sonrisa",
            "gentle": "Ternura",
            "warm": "Calidez",
            "shy": "Timidez",
            "serious": "Seriedad",
            "angry": "Ira",
            "close": "Acercamiento",
            "cold": "Frialdad",
            "dark": "Sombría",
            "obsessed": "Obsesión",
            "shaking": "Temblor",
            "crying": "Lágrimas",
            "seductive": "Susurro",
            "pleased": "Satisfacción",
            "neutral": "Sin expresión",
            "pain": "Dolor",
            "relief": "Alivio",
            "sad": "Tristeza",
            "hurt": "Herida",
            "cry": "Sollozos",
            "yandere": "Locura",
            "vulnerable": "Fragilidad",
            "broken_smile": "Sonrisa rota",
            "scared": "Miedo",
            "desperate": "Desesperación",
            "weak": "Demacrada",
            "determined": "Determinación",
            "fade": "Desvanecimiento",
            "ghost": "Imagen residual",
            "quiet": "Silencio"
        },
        "fr": {
            "normal": "Habituelle",
            "smile": "Sourire",
            "gentle": "Douceur",
            "warm": "Chaleur",
            "shy": "Timidité",
            "serious": "Sérieux",
            "angry": "Colère",
            "close": "Proximité",
            "cold": "Froideur",
            "dark": "Ombre",
            "obsessed": "Obsession",
            "shaking": "Tremblement",
            "crying": "Larmes",
            "seductive": "Murmure",
            "pleased": "Satisfaction",
            "neutral": "Impassibilité",
            "pain": "Douleur",
            "relief": "Soulagement",
            "sad": "Tristesse",
            "hurt": "Blessure",
            "cry": "Sanglots",
            "yandere": "Folie",
            "vulnerable": "Fragilité",
            "broken_smile": "Sourire brisé",
            "scared": "Peur",
            "desperate": "Désespoir",
            "weak": "Épuisement",
            "determined": "Détermination",
            "fade": "Effacement",
            "ghost": "Rémanence",
            "quiet": "Silence"
        },
        "de": {
            "normal": "Gewohnt",
            "smile": "Lächeln",
            "gentle": "Zuneigung",
            "warm": "Wärme",
            "shy": "Schüchternheit",
            "serious": "Ernst",
            "angry": "Wut",
            "close": "Annäherung",
            "cold": "Kälte",
            "dark": "Düster",
            "obsessed": "Besessenheit",
            "shaking": "Zittern",
            "crying": "Tränen",
            "seductive": "Flüstern",
            "pleased": "Zufriedenheit",
            "neutral": "Ausdruckslos",
            "pain": "Schmerz",
            "relief": "Erleichterung",
            "sad": "Trauer",
            "hurt": "Verletzt",
            "cry": "Schluchzen",
            "yandere": "Wahnsinn",
            "vulnerable": "Verletzlichkeit",
            "broken_smile": "Gebrochenes Lächeln",
            "scared": "Angst",
            "desperate": "Verzweiflung",
            "weak": "Ausgezehrt",
            "determined": "Entschlossenheit",
            "fade": "Verblassen",
            "ghost": "Nachbild",
            "quiet": "Schweigen"
        },
        "pt": {
            "normal": "Habitual",
            "smile": "Sorriso",
            "gentle": "Carinho",
            "warm": "Acolhimento",
            "shy": "Timidez",
            "serious": "Seriedade",
            "angry": "Raiva",
            "close": "Aproximação",
            "cold": "Frieza",
            "dark": "Sombra",
            "obsessed": "Obsessão",
            "shaking": "Tremor",
            "crying": "Lágrimas",
            "seductive": "Sussurro",
            "pleased": "Satisfação",
            "neutral": "Sem expressão",
            "pain": "Dor",
            "relief": "Alívio",
            "sad": "Tristeza",
            "hurt": "Mágoa",
            "cry": "Choro",
            "yandere": "Loucura",
            "vulnerable": "Fragilidade",
            "broken_smile": "Sorriso partido",
            "scared": "Medo",
            "desperate": "Desespero",
            "weak": "Abatida",
            "determined": "Determinação",
            "fade": "Desvanecimento",
            "ghost": "Imagem residual",
            "quiet": "Silêncio"
        },
        "zh": {
            "normal": "平常",
            "smile": "微笑",
            "gentle": "亲切",
            "warm": "温和",
            "shy": "害羞",
            "serious": "认真",
            "angry": "愤怒",
            "close": "靠近",
            "cold": "冷淡",
            "dark": "阴沉",
            "obsessed": "执着",
            "shaking": "颤抖",
            "crying": "眼泪",
            "seductive": "低语",
            "pleased": "满足",
            "neutral": "面无表情",
            "pain": "痛苦",
            "relief": "安心",
            "sad": "悲伤",
            "hurt": "受伤",
            "cry": "痛哭",
            "yandere": "疯狂",
            "vulnerable": "脆弱",
            "broken_smile": "破碎的微笑",
            "scared": "恐惧",
            "desperate": "急切",
            "weak": "憔悴",
            "determined": "决心",
            "fade": "淡去",
            "ghost": "残影",
            "quiet": "沉默"
        }
    };

    static {
        const replays = {"ko":"장면 회상","en":"Replay Scene","ja":"シーン回想","es":"Reproducir escena","fr":"Rejouer la scène","de":"Szene wiederholen","pt":"Cena de repetição","zh":"场景回顾"};
        for (const [lang, label] of Object.entries(replays)) this.LABELS[lang].replay = label;
    }

    constructor(game) {
        this.game = game;
        this.activeTab = 'endings';
        this.playingBgmId = null;
        this.data = this._load();
        this.isAdmin = new URLSearchParams(window.location.search).has('admin');
        this._bound = false;
        this._tabsBound = false;
    }

    getUnlockedEndings() {
        this.data = this._load();
        return [...new Set(this.data.endings || [])];
    }

    unlockEnding(endingTitle) {
        if (!GallerySystem.ENDINGS.includes(endingTitle)) return false;
        const changed = this._unlockListItem('endings', endingTitle);
        if (changed) this._saveLegacyEndings();
        return changed;
    }

    unlockCGByPath(pathOrKey) {
        const normalized = this._normalizeAsset(CONFIG.BACKGROUNDS?.[pathOrKey] || pathOrKey);
        const item = this._getCGItems().find(cg => {
            return this._normalizeAsset(cg.file) === normalized
                || this._normalizeAsset(cg.backgroundKey) === normalized
                || cg.id === pathOrKey;
        });
        if (!item) return false;
        return this._unlockObjectItem('cg', item.id);
    }

    unlockBGM(filename) {
        if (!filename || typeof filename !== 'string') return false;
        const item = this._getMusicItems().find(track => {
            return track.file === filename
                || track.id === this._bgmId(filename)
                || track.id === filename;
        });
        if (!item) return false;
        return this._unlockObjectItem('bgm', item.id);
    }

    unlockCharacterExpression(keyOrPath) {
        const parsed = this._parseCharacterExpression(keyOrPath);
        if (!parsed) return false;

        const items = this._getCharacterItems();
        const char = items.find(item => item.id === parsed.charId);
        if (!char) return false;

        const sourcePath = CONFIG.EXPRESSIONS?.[parsed.charId]?.[parsed.expression];
        const expression = char.expressions.find(expr => {
            return expr.id === parsed.expression
                || (sourcePath && this._normalizeAsset(expr.file) === this._normalizeAsset(sourcePath));
        });
        if (!expression) return false;

        if (!this.data.characters[char.id]) {
            this.data.characters[char.id] = { met: false, expressions: {} };
        }

        const entry = this.data.characters[char.id];
        const wasUnlocked = entry.met && entry.expressions?.[expression.id]?.unlocked;
        entry.met = true;
        entry.expressions = entry.expressions || {};
        entry.expressions[expression.id] = entry.expressions[expression.id] || {};
        entry.expressions[expression.id].unlocked = true;
        entry.expressions[expression.id].unlockedAt = entry.expressions[expression.id].unlockedAt || Date.now();

        this._save();
        return !wasUnlocked;
    }

    open() {
        const screen = document.getElementById('gallery-screen');
        if (!screen) return;

        this.data = this._load();
        this._ensureLayout();
        this._render();

        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }

    close() {
        this._stopBgmPreview();
        this._closeModal();

        const screen = document.getElementById('gallery-screen');
        if (screen) {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        }
        const title = document.getElementById('title-screen');
        if (title) {
            title.classList.remove('hidden');
            title.classList.add('active');
        }
    }

    bind() {
        if (this._bound) return;
        this._bound = true;

        document.getElementById('btn-gallery')?.addEventListener('click', () => {
            this.game.audio?.playUIClick();
            this.open();
        });
        document.getElementById('gallery-back')?.addEventListener('click', () => {
            this.game.audio?.playUIClick();
            this.close();
        });
    }

    _render() {
        this._renderHeader();
        this._renderTabs();

        if (this.activeTab === 'endings') this._renderEndings();
        if (this.activeTab === 'cg') this._renderCG();
        if (this.activeTab === 'music') this._renderMusic();
        if (this.activeTab === 'characters') this._renderCharacters();
    }

    _renderHeader() {
        const labels = this._labels();
        const title = document.querySelector('.gallery-title');
        const back = document.getElementById('gallery-back');
        const progressLabel = document.querySelector('.gallery-progress-label');
        if (title) title.textContent = labels.title;
        if (back) back.textContent = labels.back;
        if (progressLabel) progressLabel.textContent = labels.progress;
    }

    _renderTabs() {
        const tabs = document.querySelector('#gallery-tabs');
        if (!tabs) return;
        const labels = this._labels();

        tabs.querySelectorAll('.gallery-tab').forEach(btn => {
            const tab = btn.dataset.tab;
            btn.textContent = labels.tabs[tab] || tab;
            btn.classList.toggle('active', tab === this.activeTab);
        });
    }

    _renderEndings() {
        const grid = this._grid();
        if (!grid) return;
        const lang = this._lang();
        const labels = this._labels();
        const unlockedCount = GallerySystem.ENDINGS.filter(ending => this.isEndingUnlocked(ending)).length;

        grid.className = 'gallery-grid gallery-grid-endings';
        grid.innerHTML = GallerySystem.ENDINGS.map(ending => {
            const isUnlocked = this.isEndingUnlocked(ending);
            const desc = isUnlocked
                ? (GallerySystem.ENDING_DESCRIPTIONS[ending]?.[lang] || GallerySystem.ENDING_DESCRIPTIONS[ending]?.en || '')
                : labels.lockedEnding;
            return `
                <button class="gallery-card ${isUnlocked ? 'gallery-unlocked' : 'gallery-locked'}" data-kind="ending" data-ending="${this._escape(ending)}">
                    <span class="gallery-card-icon">${isUnlocked ? this._getEndingIcon(ending) : ''}</span>
                    <span class="gallery-card-title">${isUnlocked ? this._escape(ending) : this._escape(labels.locked)}</span>
                    <span class="gallery-card-desc">${this._escape(desc)}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedCount, GallerySystem.ENDINGS.length);
    }

    _renderCG() {
        const grid = this._grid();
        if (!grid) return;
        const labels = this._labels();
        const items = this._getCGItems();
        const unlockedCount = items.filter(item => this.isUnlocked('cg', item.id)).length;

        grid.className = 'gallery-grid gallery-grid-cg';
        grid.innerHTML = items.map(item => {
            const unlocked = this.isUnlocked('cg', item.id);
            const image = `
                ${this._imageTag(item.file, unlocked ? item.name : labels.locked)}
                ${unlocked ? '' : '<div class="gallery-lock-mark">LOCK</div>'}
            `;
            return `
                <button class="gallery-card gallery-media-card ${unlocked ? 'gallery-unlocked' : 'gallery-locked'}" data-kind="cg" data-id="${this._escape(item.id)}">
                    <span class="gallery-thumb">${image}</span>
                    <span class="gallery-card-title">${unlocked ? this._escape(item.name) : this._escape(labels.locked)}</span>
                    <span class="gallery-card-desc">${unlocked ? this._escape(item.description) : this._escape(labels.lockedCg)}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedCount, items.length);
    }

    _renderMusic() {
        const grid = this._grid();
        if (!grid) return;
        const labels = this._labels();
        const items = this._getMusicItems();
        const unlockedCount = items.filter(item => this.isUnlocked('bgm', item.id)).length;

        grid.className = 'gallery-grid gallery-grid-music';
        grid.innerHTML = items.map(item => {
            const unlocked = this.isUnlocked('bgm', item.id);
            const isPlaying = this.playingBgmId === item.id;
            return `
                <button class="gallery-music-row ${unlocked ? 'gallery-unlocked' : 'gallery-locked'} ${isPlaying ? 'playing' : ''}"
                        data-kind="music" data-id="${this._escape(item.id)}">
                    <span class="gallery-music-icon">${isPlaying ? 'II' : 'PLAY'}</span>
                    <span class="gallery-music-main">
                        <span class="gallery-card-title">${unlocked ? this._escape(item.name) : this._escape(labels.locked)}</span>
                        <span class="gallery-card-desc">${unlocked ? this._escape(labels.artist) : this._escape(labels.lockedMusic)}</span>
                    </span>
                    <span class="gallery-music-action">${unlocked ? this._escape(isPlaying ? labels.stop : labels.play) : '--'}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedCount, items.length);
    }

    _renderCharacters() {
        const grid = this._grid();
        if (!grid) return;
        const labels = this._labels();
        const items = this._getCharacterItems();
        const total = items.reduce((sum, item) => sum + item.expressions.length, 0);
        const unlockedTotal = items.reduce((sum, item) => {
            return sum + item.expressions.filter(expr => this.isExpressionUnlocked(item.id, expr.id)).length;
        }, 0);

        grid.className = 'gallery-grid gallery-grid-characters';
        grid.innerHTML = items.map(item => {
            const met = this.isCharacterMet(item.id);
            const charName = this._characterName(item.id);
            const unlocked = item.expressions.filter(expr => this.isExpressionUnlocked(item.id, expr.id)).length;
            const image = `
                ${this._imageTag(item.cover, met ? charName : labels.locked)}
                ${met ? '' : '<div class="gallery-lock-mark">LOCK</div>'}
            `;
            return `
                <button class="gallery-card gallery-character-card ${met ? 'gallery-unlocked' : 'gallery-locked'}" data-kind="character" data-id="${this._escape(item.id)}">
                    <span class="gallery-thumb gallery-character-thumb">${image}</span>
                    <span class="gallery-card-title">${met ? this._escape(charName) : this._escape(labels.locked)}</span>
                    <span class="gallery-card-desc">${met ? `${this._escape(labels.expressions)} ${unlocked} / ${item.expressions.length}` : this._escape(labels.lockedCharacter)}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedTotal, total);
    }

    _ensureLayout() {
        const container = document.querySelector('#gallery-screen .gallery-container');
        const grid = this._grid();
        if (!container || !grid) return;

        let tabs = document.querySelector('#gallery-tabs');
        if (!tabs) {
            tabs = document.createElement('div');
            tabs.id = 'gallery-tabs';
            tabs.className = 'gallery-tabs';
            tabs.innerHTML = ['endings', 'cg', 'music', 'characters'].map(tab => (
                `<button class="gallery-tab" type="button" data-tab="${tab}"></button>`
            )).join('');
            container.insertBefore(tabs, grid);
        }

        if (!this._tabsBound) {
            this._tabsBound = true;
            tabs.addEventListener('click', event => {
                const tab = event.target.closest('.gallery-tab')?.dataset.tab;
                if (!tab || tab === this.activeTab) return;
                this.game.audio?.playUIClick?.();
                this._stopBgmPreview();
                this.activeTab = tab;
                this._render();
            });
        }

        grid.onclick = event => this._handleGridClick(event);
    }

    _handleGridClick(event) {
        const target = event.target.closest('[data-kind]');
        if (!target) return;

        const kind = target.dataset.kind;
        const id = target.dataset.id;

        if (kind === 'ending') {
            const ending = target.dataset.ending;
            if (!GallerySystem.ENDINGS.includes(ending)) return;
            if (!this.isEndingUnlocked(ending)) return this._showMessage(this._labels().lockedEnding);
            const description = GallerySystem.ENDING_DESCRIPTIONS[ending]?.[this._lang()]
                || GallerySystem.ENDING_DESCRIPTIONS[ending]?.en || '';
            this._showModal(ending, `<p class="gallery-modal-message">${this._escape(description)}</p>`
                + this._replayButton(ending));
            return;
        }

        if (kind === 'cg') {
            const item = this._getCGItems().find(cg => cg.id === id);
            if (!item) return;
            if (!this.isUnlocked('cg', id)) return this._showMessage(this._labels().lockedCg);
            this._showImageModal(item.name, item.description, item.file, item.backgroundKey);
            return;
        }

        if (kind === 'music') {
            const item = this._getMusicItems().find(track => track.id === id);
            if (!item) return;
            if (!this.isUnlocked('bgm', id)) return this._showMessage(this._labels().lockedMusic);
            this._toggleBgmPreview(item);
            return;
        }

        if (kind === 'character') {
            const item = this._getCharacterItems().find(character => character.id === id);
            if (!item) return;
            if (!this.isCharacterMet(id)) return this._showMessage(this._labels().lockedCharacter);
            this._showCharacterModal(item);
        }
    }

    _showCharacterModal(character) {
        const labels = this._labels();
        const charName = this._characterName(character.id);
        const body = `
            <div class="gallery-character-modal-body">
                <div class="gallery-character-modal-cover">
                    ${this._imageTag(character.cover, charName)}
                </div>
                <div class="gallery-expression-grid">
                    ${character.expressions.map(expr => {
                        const unlocked = this.isExpressionUnlocked(character.id, expr.id);
                        const image = `
                            ${this._imageTag(expr.file, unlocked ? expr.name : labels.locked)}
                            ${unlocked ? '' : '<div class="gallery-lock-mark">LOCK</div>'}
                        `;
                        return `
                            <div class="gallery-expression-card ${unlocked ? 'gallery-unlocked' : 'gallery-locked'}">
                                <div class="gallery-expression-thumb">${image}</div>
                                <div class="gallery-expression-name">${unlocked ? this._escape(expr.name) : this._escape(labels.locked)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        this._showModal(charName, body);
    }

    _replayButton(key) {
        if (!GallerySystem.REPLAY_SCENES[key]) return '';
        return `<button class="menu-btn" type="button" data-replay="${this._escape(key)}">${this._escape(this._labels().replay)}</button>`;
    }

    _showImageModal(title, description, imagePath, replayKey) {
        this._showModal(title, `
            <div class="gallery-image-modal">
                ${this._imageTag(imagePath, title)}
                <p>${this._escape(description || '')}</p>
                ${this._replayButton(replayKey)}
            </div>
        `);
    }

    _showMessage(message) {
        this._showModal(this._labels().locked, `<p class="gallery-modal-message">${this._escape(message)}</p>`);
    }

    _showModal(title, bodyHtml) {
        this._closeModal();

        const modal = document.createElement('div');
        modal.id = 'gallery-modal';
        modal.className = 'gallery-modal-overlay';
        modal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-modal-close" type="button" aria-label="${this._escape(this._labels().close)}">x</button>
                <h3>${this._escape(title)}</h3>
                ${bodyHtml}
            </div>
        `;

        modal.addEventListener('click', event => {
            const replay = event.target.closest('[data-replay]')?.dataset.replay;
            if (replay) {
                let scene = GallerySystem.REPLAY_SCENES[replay];
                if (replay === 'CAGE END'
                    && this.game.state.stats.eunsu.affinity > this.game.state.stats.sea.affinity) {
                    scene = 'day5_ending_cage_eunsu_1';
                }
                const unlocked = GallerySystem.ENDINGS.includes(replay)
                    ? this.isEndingUnlocked(replay) : this.isUnlocked('cg', replay);
                if (scene && unlocked) this.game.startGalleryReplay(scene);
                return;
            }
            if (event.target === modal || event.target.closest('.gallery-modal-close')) {
                this._closeModal();
            }
        });

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('active'));
    }

    _closeModal() {
        const modal = document.querySelector('.gallery-modal-overlay');
        if (modal) modal.remove();
    }

    _toggleBgmPreview(item) {
        if (this.playingBgmId === item.id) {
            this._stopBgmPreview();
            this._renderMusic();
            return;
        }

        this._stopBgmPreview();
        this.playingBgmId = item.id;
        this.game.audio?.playBGM?.(item.file, { fadeIn: 0.15, fadeOut: 0.15 });
        this._renderMusic();
    }

    _stopBgmPreview() {
        if (!this.playingBgmId) return;
        this.game.audio?.stopBGM?.(0.2);
        this.playingBgmId = null;
    }

    isEndingUnlocked(ending) {
        return this.isAdmin || this.getUnlockedEndings().includes(ending);
    }

    isUnlocked(type, id) {
        if (this.isAdmin) return true;
        this.data = this._load();
        return !!this.data[type]?.[id]?.unlocked;
    }

    isCharacterMet(charId) {
        if (this.isAdmin) return true;
        this.data = this._load();
        return !!this.data.characters?.[charId]?.met;
    }

    isExpressionUnlocked(charId, exprId) {
        if (this.isAdmin) return true;
        this.data = this._load();
        return !!this.data.characters?.[charId]?.expressions?.[exprId]?.unlocked;
    }

    _load() {
        const defaults = this._defaultData();
        let parsed = null;

        try {
            const raw = this.game.save._getItem(GallerySystem.STORAGE_KEY);
            if (raw) parsed = JSON.parse(raw);
        } catch (e) {
            console.warn('[Gallery] Failed to load gallery data:', e);
        }

        const data = (!parsed || parsed.version !== GallerySystem.VERSION)
            ? defaults
            : this._mergeDefaults(defaults, parsed);

        const legacy = this._loadLegacyEndings();
        legacy.forEach(ending => {
            if (GallerySystem.ENDINGS.includes(ending) && !data.endings.includes(ending)) {
                data.endings.push(ending);
            }
        });

        return data;
    }

    _save() {
        try {
            this.game.save._setItem(GallerySystem.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('[Gallery] Failed to save gallery data:', e);
        }
    }

    _saveLegacyEndings() {
        try {
            this.game.save._setItem(GallerySystem.LEGACY_ENDING_STORAGE_KEY, JSON.stringify(this.data.endings || []));
        } catch (_) {}
    }

    _loadLegacyEndings() {
        try {
            const raw = this.game.save._getItem(GallerySystem.LEGACY_ENDING_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    _defaultData() {
        const characters = {};
        this._getCharacterItems().forEach(item => {
            characters[item.id] = { met: false, expressions: {} };
        });
        return {
            version: GallerySystem.VERSION,
            endings: [],
            cg: {},
            bgm: {},
            characters
        };
    }

    _mergeDefaults(defaults, parsed) {
        const merged = {
            ...defaults,
            ...parsed,
            cg: { ...defaults.cg, ...(parsed.cg || {}) },
            bgm: { ...defaults.bgm, ...(parsed.bgm || {}) },
            characters: { ...defaults.characters }
        };

        for (const [charId, defaultChar] of Object.entries(defaults.characters)) {
            merged.characters[charId] = {
                ...defaultChar,
                ...(parsed.characters?.[charId] || {}),
                expressions: {
                    ...defaultChar.expressions,
                    ...(parsed.characters?.[charId]?.expressions || {})
                }
            };
        }

        merged.endings = Array.isArray(parsed.endings) ? [...parsed.endings] : [];
        return merged;
    }

    _unlockListItem(key, value) {
        this.data = this._load();
        if (!this.data[key]) this.data[key] = [];
        if (this.data[key].includes(value)) return false;
        this.data[key].push(value);
        this._save();
        return true;
    }

    _unlockObjectItem(type, id) {
        this.data = this._load();
        this.data[type] = this.data[type] || {};
        if (this.data[type][id]?.unlocked) return false;
        this.data[type][id] = { unlocked: true, unlockedAt: Date.now() };
        this._save();
        return true;
    }

    _getCGItems() {
        if (this._cgItems && this._cgLang === this._lang()) return this._cgItems;
        this._cgLang = this._lang();
        const localized = GallerySystem.EXPANSION_CG_LABELS[this._cgLang]
            || GallerySystem.EXPANSION_CG_LABELS.en;

        const map = {
            cg_cycle07_seolhwa: {
                id: 'cg_cycle07_seolhwa', name: 'Cycle 07: The Left Hand',
                description: 'Seolhwa holds the emergency door in the rain.'
            },
            cg_cycle12_yuna: {
                id: 'cg_cycle12_yuna', name: 'Cycle 12: The Darkroom',
                description: 'Yuna keeps the film for the next arrival.'
            },
            ending_cage_eunsu: {
                id: 'ending_cage_eunsu', name: 'Cage Ending: Eunsu',
                description: 'A silver band and a permanently deferred graduation.'
            },
            ending_complicit_monitors: {
                id: 'ending_complicit_monitors', name: 'Complicit: Control Room',
                description: 'The next approval carries your signature.'
            },
            ending_true: {
                id: 'ending_true',
                name: 'True Ending CG',
                description: 'A new classroom and a pencil held in the left hand.'
            },
            ending_escape: {
                id: 'ending_escape',
                name: 'Escape Ending CG',
                description: 'The rain-soaked escape route.'
            },
            ending_cage: {
                id: 'ending_cage',
                name: 'Cage Ending CG',
                description: 'The classroom that never releases you.'
            },
            ending_ghost: {
                id: 'ending_ghost',
                name: 'Ghost Ending CG',
                description: 'A trace left behind in the empty room.'
            },
            ending_forget: {
                id: 'ending_forget',
                name: 'Forget Ending CG',
                description: 'An empty seat in ordinary days.'
            },
            ending_resist: {
                id: 'ending_resist',
                name: 'Resist Ending CG',
                description: 'Leaving through the emergency exit with Eunsu and the records.'
            },
            ending_complicit: {
                id: 'ending_complicit',
                name: 'Complicit Ending CG',
                description: 'The signed page that makes you part of the system.'
            },
            ending_cage_sea: {
                id: 'ending_cage_sea',
                name: 'Cage Ending: Sea',
                description: 'The same lunchbox, the same student council room.'
            }
        };

        this._cgItems = Object.entries(CONFIG.BACKGROUNDS || {})
            .map(([key, file]) => [key === 'closeup_m13_ampoule' ? 'closeup_m13_ampoule_tray' : key, file])
            .filter(([backgroundKey, file]) => String(file).includes('/images/cg/')
                || ['closeup_m13_ampoule_tray', 'closeup_rooftop_etching'].includes(backgroundKey))
            .map(([backgroundKey, file]) => ({
                id: map[backgroundKey]?.id || backgroundKey,
                backgroundKey,
                file,
                name: localized[backgroundKey]?.[0] || map[backgroundKey]?.name || this._titleFromId(backgroundKey),
                description: localized[backgroundKey]?.[1] || map[backgroundKey]?.description || ''
            }));

        return this._cgItems;
    }

    _getMusicItems() {
        if (this._musicItems && this._musicLang === this._lang()) return this._musicItems;
        this._musicLang = this._lang();
        const titles = GallerySystem.BGM_TITLES_LOCALIZED[this._musicLang] || GallerySystem.BGM_TITLES_LOCALIZED.en;

        const seen = new Map();
        const add = (file) => {
            if (!file || typeof file !== 'string') return;
            const id = this._bgmId(file);
            if (seen.has(id)) return;
            seen.set(id, {
                id,
                file,
                name: titles[id] || GallerySystem.BGM_TITLES[id] || this._titleFromId(id)
            });
        };

        for (const day of Object.values(window.SCENARIO || {})) {
            for (const scene of Object.values(day || {})) {
                if (typeof scene.bgm === 'string') add(scene.bgm);
                if (scene.bgm_fade?.to) add(scene.bgm_fade.to);
            }
        }

        this._musicItems = [...seen.values()];
        return this._musicItems;
    }

    _getCharacterItems() {
        if (this._characterItems && this._characterLang === this._lang()) return this._characterItems;
        this._characterLang = this._lang();
        const titles = GallerySystem.EXPRESSION_TITLES_LOCALIZED[this._characterLang] || GallerySystem.EXPRESSION_TITLES_LOCALIZED.en;
        const aliases = { startled: 'shaking', strained_smile: 'broken_smile', casual: 'normal',
            casual_pain: 'pain', casual_relief: 'relief', injured_determined: 'determined' };

        this._characterItems = Object.entries(CONFIG.EXPRESSIONS || {})
            .filter(([charId, expressions]) => charId !== 'classmate' && expressions && Object.values(expressions).some(Boolean))
            .map(([charId, expressions]) => {
                const seenPaths = new Set();
                const items = [];
                for (const [exprId, file] of Object.entries(expressions)) {
                    if (!file) continue;
                    const normalized = this._normalizeAsset(file);
                    if (seenPaths.has(normalized)) continue;
                    seenPaths.add(normalized);
                    items.push({
                        id: exprId,
                        name: titles[exprId] || titles[aliases[exprId]] || GallerySystem.EXPRESSION_TITLES[exprId] || this._titleFromId(exprId),
                        file
                    });
                }

                return {
                    id: charId,
                    name: charId,
                    cover: expressions.normal || items[0]?.file,
                    expressions: items
                };
            });

        return this._characterItems;
    }

    _parseCharacterExpression(keyOrPath) {
        if (!keyOrPath || typeof keyOrPath !== 'string') return null;
        let name = keyOrPath;

        if (keyOrPath.includes('/')) {
            name = keyOrPath.split(/[?#]/)[0].split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
        }

        const idx = name.indexOf('_');
        if (idx <= 0) return null;

        return {
            charId: name.substring(0, idx),
            expression: name.substring(idx + 1)
        };
    }

    _bgmId(filename) {
        return String(filename).split('/').pop().replace(/\.[^.]+$/, '');
    }

    _grid() {
        return document.getElementById('gallery-grid');
    }

    _updateProgress(unlocked, total) {
        const progress = document.getElementById('gallery-progress');
        if (progress) progress.textContent = `${unlocked} / ${total}`;
    }

    _getEndingIcon(ending) {
        const icons = {
            'TRUE END': '\u2605',
            'RESIST END': '\u2694',
            'FORGET END': '\u29BE',
            'CAGE END': '\u25A3',
            'GHOST END': '\u2620',
            'ESCAPE END': '\u2708',
            'COMPLICIT END': '\u2622'
        };
        return icons[ending] || '\u2726';
    }

    _labels() {
        const lang = this._lang();
        return GallerySystem.LABELS[lang] || GallerySystem.LABELS.en;
    }

    _lang() {
        return this.game?.i18n?.currentLang || 'ko';
    }

    _titleFromId(id) {
        return String(id || '')
            .replace(/\.[^.]+$/, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, ch => ch.toUpperCase());
    }

    _characterName(charId) {
        return this.game?.i18n?.getCharacterName?.(charId) || this._titleFromId(charId);
    }

    _normalizeAsset(value) {
        return String(value || '')
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/^\.\.\//, '')
            .split(/[?#]/)[0]
            .toLowerCase();
    }

    _asset(src) {
        if (!src) return '';
        const normalized = String(src).replace(/^\.\//, '');
        if (/^(?:https?:|data:|blob:|\/)/.test(normalized) || normalized.startsWith('../')) {
            return normalized;
        }
        return (window.__NEVERGRAD_LANG__ ? '../' : '') + normalized;
    }

    _versioned(src) {
        const asset = this._asset(src);
        if (!asset || /[?#]/.test(asset) || /^(?:data:|blob:)/.test(asset)) return asset;
        const version = CONFIG.VERSION || '1';
        return `${asset}?v=${encodeURIComponent(version)}`;
    }

    _fallbackImage(src) {
        if (!src || typeof src !== 'string') return '';
        const normalized = src.replace(/\\/g, '/');
        const match = normalized.match(/^([^?#]+)([?#].*)?$/);
        const pathPart = match ? match[1] : normalized;
        const suffix = match?.[2] || '';

        if (!/^(?:\.\.\/)?assets\/images\/(?:background|characters|cg|evidence)\/.+\.webp$/i.test(pathPart)) {
            return '';
        }

        return `${pathPart.replace(/\.webp$/i, '.png')}${suffix}`;
    }

    _imageTag(src, alt) {
        const primary = this._versioned(src);
        const fallback = this._versioned(this._fallbackImage(src));
        const fallbackAttr = fallback && fallback !== primary
            ? ` onerror="this.onerror=null;this.src='${this._escape(fallback)}'"`
            : '';
        return `<img src="${this._escape(primary)}"${fallbackAttr} alt="${this._escape(alt)}">`;
    }

    _escape(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
