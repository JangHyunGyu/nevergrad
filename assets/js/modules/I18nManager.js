/**
 * ============================================================================
 * I18nManager.js - 다국어 텍스트 관리
 * ============================================================================
 *
 * [구조 설계 원칙 - Claude 유지보수 최적화]
 *
 * 시나리오(로직)와 텍스트(번역)를 완전 분리:
 *   scenario/day1_1_morning.js  → 분기, 배경, 스탯만 (텍스트 없음)
 *   i18n/ko/day1_morning.json   → 한국어 텍스트만
 *   i18n/en/day1_morning.json   → 영어 텍스트만
 *
 * scene ID가 곧 텍스트 키:
 *   시나리오: { "day1_opening": { next: "day1_opening_2" } }
 *   i18n:    { "day1_opening": { text: "..." } }
 *   speakers: { "day1_opening": "me" }
 *
 * 이 구조의 장점:
 *   - 로직 수정 시: scenario 파일만 봄 (텍스트 노이즈 없음)
 *   - 번역 작업 시: i18n 파일만 봄 (코드 노이즈 없음)
 *   - 디버깅 시: scene ID로 양쪽 즉시 특정 가능
 *   - 언어 추가 시: i18n/xx/ 폴더만 추가 (시나리오 수정 불필요)
 */

class I18nManager {
    // 언어 하위 디렉토리(/en/, /ja/ 등)에서 로드 시 상위 경로 보정
    static BASE = window.__NEVERGRAD_LANG__ ? '../' : '';

    constructor() {
        this.currentLang = 'ko';
        this.texts = {};       // { day1: { scene_id: { text, choices } }, day2: {...} }
        this.loaded = {};      // 로드 완료 추적
    }

    /**
     * 언어 설정
     */
    setLanguage(lang) {
        this.currentLang = lang;
        this.texts = {};
        this.loaded = {};
    }

    /**
     * 특정 Day의 텍스트 로드 (모든 시간대 파일 병합)
     * day1_morning.json + day1_lunch.json + day1_afterschool.json + day1_night.json → texts["day1"]
     * 비한국어 페이지의 번역 미완료 항목은 en 원문으로 폴백
     * @param {number} day - 1~5
     */
    async loadDay(day) {
        const key = `day${day}`;
        if (this.loaded[key]) return;

        const slots = ['_morning', '_lunch', '_afterschool', '_night'];
        this.texts[key] = {};

        const loadFile = async (langCode, slot) => {
            const filename = `day${day}${slot}.json`;
            try {
                const res = await fetch(`${I18nManager.BASE}assets/js/i18n/${langCode}/${filename}`);
                if (!res.ok) return;
                const data = await res.json();
                Object.assign(this.texts[key], data);
            } catch (e) {}
        };

        // 비한국어 페이지에서 한국어 원문이 노출되지 않도록 en을 기본 폴백으로 사용
        const baseLang = this.currentLang === 'ko' ? 'ko' : 'en';
        if (baseLang !== this.currentLang) {
            await Promise.all(slots.map((slot) => loadFile(baseLang, slot)));
        }

        // 대상 언어로 오버레이
        await Promise.all(slots.map((slot) => loadFile(this.currentLang, slot)));

        this.loaded[key] = true;
    }

    /**
     * 모든 Day 텍스트 로드 (게임 시작 시)
     */
    async loadAll() {
        await Promise.all([1, 2, 3, 4, 5].map(d => this.loadDay(d)));
    }

    /**
     * scene ID로 텍스트 가져오기
     * @param {string} sceneId - 예: "day1_opening"
     * @returns {{ text: string, choices?: string[] }}
     */
    get(sceneId) {
        // scene ID에서 day 번호 추출: "day1_opening" → "day1"
        const dayMatch = sceneId.match(/^day(\d)/);
        if (!dayMatch) return { text: "" };

        const dayKey = `day${dayMatch[1]}`;
        const entry = this.texts[dayKey]?.[sceneId];

        if (!entry) {
            console.warn(`[I18n] Missing text: ${this.currentLang}/${dayKey}.json → "${sceneId}"`);
            return { text: `[MISSING: ${sceneId}]` };
        }

        return entry;
    }

    /**
     * 텍스트 내 플레이스홀더 치환
     * {name} → 플레이어 이름
     */
    resolve(text, playerName, extraVars) {
        if (!text) return "";
        const fallback = I18nManager.DEFAULT_PLAYER_NAME[this.currentLang] || I18nManager.DEFAULT_PLAYER_NAME.en || "Transfer Student";
        let result = text
            .replace(/\{name\}/g, playerName || fallback)
            .replace(/\{name\?\}/g, playerName || fallback);
        // 추가 플레이스홀더 치환 ({14th_name}, {new_name} 등)
        if (extraVars) {
            for (const [key, val] of Object.entries(extraVars)) {
                result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
            }
        }
        return result;
    }

    static DEFAULT_PLAYER_NAME = {
        ko: "전학생", en: "Transfer Student", ja: "転校生",
        es: "Estudiante", fr: "Nouvel Élève", de: "Schüler",
        pt: "Estudante transferido"
    };

    /**
     * 특정 키가 존재하는지 확인 (디버깅용)
     */
    has(sceneId) {
        const dayMatch = sceneId.match(/^day(\d)/);
        if (!dayMatch) return false;
        const dayKey = `day${dayMatch[1]}`;
        return !!this.texts[dayKey]?.[sceneId];
    }

    /**
     * 누락된 키 목록 반환 (디버깅/QA용)
     * @param {string[]} sceneIds - 시나리오의 모든 scene ID
     */
    findMissing(sceneIds) {
        return sceneIds.filter(id => !this.has(id));
    }

    /**
     * 지원 언어 목록
     */
    static LANGUAGES = {
        ko: { label: "한국어", flag: "🇰🇷" },
        en: { label: "English", flag: "🇺🇸" },
        ja: { label: "日本語", flag: "🇯🇵" },
        es: { label: "Español", flag: "🇪🇸" },
        fr: { label: "Français", flag: "🇫🇷" },
        de: { label: "Deutsch", flag: "🇩🇪" },
        pt: { label: "Português (Brasil)", flag: "🇧🇷" }
    };

    /**
     * UI 텍스트 (버튼, 제목, 메타 등) — 언어별 정적 번역
     */
    static UI = {
        ko: {
            title: "졸업하지 못한 교실", subtitle: "5일의 기록",
            metaTitle: "졸업하지 못한 교실 - 5일의 기록",
            metaDesc: "전학 첫날, 모든 것이 지나치게 완벽했다.",
            newGame: "새 게임", continue: "이어하기", gallery: "갤러리",
            namePrompt: "당신의 이름은?", namePlaceholder: "이름을 입력하세요", start: "시작",
            save: "저장", load: "불러오기", settings: "설정", toTitle: "타이틀로", resume: "돌아가기",
            settingsBgm: "BGM 볼륨", settingsSfx: "효과음 볼륨", settingsTextSpeed: "텍스트 속도",
            settingsFullscreen: "풀스크린", settingsReset: "초기화", settingsOn: "ON", settingsOff: "OFF",
            ftPlaceholder: "대화를 입력하세요...", ftSend: "전송",
            dayFormat: "{day}일차 - {slot}",
            slots: { morning: "아침", lunch: "점심", afterschool: "방과후", night: "밤" },
            galleryTitle: "엔딩 갤러리", galleryBack: "돌아가기", galleryProgress: "달성률",
            saveComplete: "저장 완료",
            slotAuto: "AUTO", slotEmpty: "빈 슬롯", slotOldFormat: "이전 저장",
            slotOverwrite: "덮어쓰시겠습니까?", slotYes: "예", slotNo: "아니오",
            binauralActivated: "🎧 바이노럴 모드 — 이어폰 권장",
            latenightAlone: "...이 시간에 깨어있는 건 나뿐일까.",
            headphoneHint: "...이어폰을 끼면 더 잘 들릴 텐데.",
            timeDialogue: {
                lateNight:   "지금 {time}이야... 이 시간까지 깨어있는 거야?",
                dawn:        "새벽 {time}. 밤새 한 거야? 그렇게까지 해야 했어?",
                morning:     "{time}. 아침이네. 수업 시작하기 딱 좋은 시간이야.",
                lateMorning: "{time}... 수업 시간 아니야? 여기 있어도 되는 거야?",
                noon:        "{time}. 점심시간이네. 밥은 먹었어?",
                afternoon:   "{time}... 오후네. 방과후까지 얼마 안 남았어.",
                sunset:      "{time}. 해가 지고 있어... 학교에 남아있을 거야?",
                evening:     "{time}... 밤이 되고 있어. 학교가 조용해지는 시간이야.",
                night:       "{time}. 늦었네. 여기 혼자 남아 있을 거야?"
            }
        },
        en: {
            title: "The Classroom That Never Graduates", subtitle: "Five-Day Record",
            metaTitle: "Nevergrad - The Classroom That Never Graduates",
            metaDesc: "The first day of transfer, everything was perfect. Too perfect to be normal.",
            newGame: "New Game", continue: "Continue", gallery: "Gallery",
            namePrompt: "What is your name?", namePlaceholder: "Enter your name", start: "Start",
            save: "Save", load: "Load", settings: "Settings", toTitle: "Title Screen", resume: "Resume",
            settingsBgm: "BGM Volume", settingsSfx: "SFX Volume", settingsTextSpeed: "Text Speed",
            settingsFullscreen: "Fullscreen", settingsReset: "Reset", settingsOn: "ON", settingsOff: "OFF",
            ftPlaceholder: "Type a message...", ftSend: "Send",
            dayFormat: "Day {day} - {slot}",
            slots: { morning: "Morning", lunch: "Lunch", afterschool: "After School", night: "Night" },
            galleryTitle: "Ending Gallery", galleryBack: "Back", galleryProgress: "Completion",
            saveComplete: "Saved",
            slotAuto: "AUTO", slotEmpty: "Empty Slot", slotOldFormat: "Legacy Save",
            slotOverwrite: "Overwrite this slot?", slotYes: "Yes", slotNo: "No",
            binauralActivated: "🎧 Binaural mode — headphones recommended",
            latenightAlone: "...Am I the only one awake at this hour?",
            headphoneHint: "...it'd be clearer with headphones.",
            timeDialogue: {
                lateNight:   "It's {time}... you're still awake at this hour?",
                dawn:        "It's {time} in the morning... did you stay up all night?",
                morning:     "{time}. A fine hour to start class.",
                lateMorning: "{time}... aren't you supposed to be in class?",
                noon:        "{time}. Lunch time. Have you eaten?",
                afternoon:   "{time}... afternoon already. Not long until school ends.",
                sunset:      "{time}. The sun is setting... you're staying at school?",
                evening:     "{time}... it's getting dark. The school gets quiet around this time.",
                night:       "It's {time}... late, isn't it? Aren't you scared being here alone?"
            }
        },
        ja: {
            title: "卒業できない教室", subtitle: "5日間の記録",
            metaTitle: "Nevergrad - 卒業できない教室",
            metaDesc: "転校初日、すべてが完璧だった。完璧すぎて、不気味なほどに。",
            newGame: "ニューゲーム", continue: "つづきから", gallery: "ギャラリー",
            namePrompt: "あなたの名前は？", namePlaceholder: "名前を入力してください", start: "スタート",
            save: "セーブ", load: "ロード", settings: "設定", toTitle: "タイトルへ", resume: "戻る",
            settingsBgm: "BGM 音量", settingsSfx: "効果音 音量", settingsTextSpeed: "テキスト速度",
            settingsFullscreen: "フルスクリーン", settingsReset: "リセット", settingsOn: "ON", settingsOff: "OFF",
            ftPlaceholder: "メッセージを入力...", ftSend: "送信",
            dayFormat: "{day}日目 - {slot}",
            slots: { morning: "朝", lunch: "昼休み", afterschool: "放課後", night: "夜" },
            galleryTitle: "エンディングギャラリー", galleryBack: "戻る", galleryProgress: "達成率",
            saveComplete: "保存完了",
            slotAuto: "AUTO", slotEmpty: "空きスロット", slotOldFormat: "旧セーブ",
            slotOverwrite: "上書きしますか？", slotYes: "はい", slotNo: "いいえ",
            binauralActivated: "🎧 バイノーラルモード — イヤホン推奨",
            latenightAlone: "……こんな時間に起きているのは、僕だけなのかな。",
            headphoneHint: "……イヤホンなら、もっとよく聞こえるのに。",
            timeDialogue: {
                lateNight:   "今{time}だよ……こんな時間まで起きてるの？",
                dawn:        "早朝{time}……徹夜したの？ そこまでして……",
                morning:     "{time}。朝だね。授業を始めるのにちょうどいい時間。",
                lateMorning: "{time}……授業中じゃないの？ ここにいていいの？",
                noon:        "{time}。昼休みだね。ご飯は食べた？",
                afternoon:   "{time}……もう午後だね。放課後まであと少し。",
                sunset:      "{time}。日が沈んでいく……学校に残るの？",
                evening:     "{time}……夜になってきたね。学校が静かになる時間。",
                night:       "{time}……遅い時間だね。一人でここにいて怖くないの？"
            }
        },
        es: {
            title: "El Aula Sin Graduación", subtitle: "Registro de 5 Días",
            metaTitle: "Nevergrad - El Aula Sin Graduación",
            metaDesc: "El primer día de transferencia, todo era perfecto. Demasiado perfecto para ser normal.",
            newGame: "Nueva Partida", continue: "Continuar", gallery: "Galería",
            namePrompt: "¿Cuál es tu nombre?", namePlaceholder: "Ingresa tu nombre", start: "Iniciar",
            save: "Guardar", load: "Cargar", settings: "Ajustes", toTitle: "Título", resume: "Volver",
            settingsBgm: "Volumen BGM", settingsSfx: "Volumen efectos", settingsTextSpeed: "Velocidad de texto",
            settingsFullscreen: "Pantalla completa", settingsReset: "Restablecer", settingsOn: "ON", settingsOff: "OFF",
            ftPlaceholder: "Escribe un mensaje...", ftSend: "Enviar",
            dayFormat: "Día {day} - {slot}",
            slots: { morning: "Mañana", lunch: "Almuerzo", afterschool: "Después de clases", night: "Noche" },
            galleryTitle: "Galería de Finales", galleryBack: "Volver", galleryProgress: "Progreso",
            saveComplete: "Guardado",
            slotAuto: "AUTO", slotEmpty: "Vacío", slotOldFormat: "Guardado anterior",
            slotOverwrite: "¿Sobrescribir?", slotYes: "Sí", slotNo: "No",
            binauralActivated: "🎧 Modo binaural — auriculares recomendados",
            latenightAlone: "...¿seré la única despierta a estas horas?",
            headphoneHint: "...se oiría mejor con auriculares.",
            timeDialogue: {
                lateNight:   "Son las {time}... ¿todavía despierto a esta hora?",
                dawn:        "{time} de la madrugada... ¿pasaste toda la noche?",
                morning:     "{time}. Es por la mañana. Hora perfecta para empezar clases.",
                lateMorning: "{time}... ¿no deberías estar en clase?",
                noon:        "{time}. Hora del almuerzo. ¿Has comido?",
                afternoon:   "{time}... ya es la tarde. Poco queda hasta el fin de clases.",
                sunset:      "{time}. Se está poniendo el sol... ¿vas a quedarte en la escuela?",
                evening:     "{time}... se está haciendo de noche. La escuela se queda en silencio.",
                night:       "{time}... es tarde. ¿No te da miedo estar aquí a solas?"
            }
        },
        fr: {
            title: "La classe sans diplôme", subtitle: "Journal de cinq jours",
            metaTitle: "Nevergrad - La classe sans diplôme",
            metaDesc: "Le jour de mon transfert, tout était parfait. Trop parfait pour être normal.",
            newGame: "Nouvelle partie", continue: "Continuer", gallery: "Galerie",
            namePrompt: "Quel est votre nom ?", namePlaceholder: "Entrez votre nom", start: "Commencer",
            save: "Sauvegarder", load: "Charger", settings: "Paramètres", toTitle: "Écran titre", resume: "Reprendre",
            settingsBgm: "Volume musique", settingsSfx: "Volume des effets", settingsTextSpeed: "Vitesse du texte",
            settingsFullscreen: "Plein écran", settingsReset: "Réinitialiser", settingsOn: "ON", settingsOff: "OFF",
            ftPlaceholder: "Écrivez un message...", ftSend: "Envoyer",
            dayFormat: "Jour {day} - {slot}",
            slots: { morning: "matin", lunch: "midi", afterschool: "après les cours", night: "nuit" },
            galleryTitle: "Galerie des fins", galleryBack: "Retour", galleryProgress: "Progression",
            saveComplete: "Sauvegardé",
            slotAuto: "AUTO", slotEmpty: "Vide", slotOldFormat: "Ancienne sauvegarde",
            slotOverwrite: "Écraser ?", slotYes: "Oui", slotNo: "Non",
            binauralActivated: "🎧 Mode binaural — écouteurs recommandés",
            latenightAlone: "...suis-je la seule personne éveillée à cette heure-ci ?",
            headphoneHint: "...ce serait plus clair avec des écouteurs.",
            timeDialogue: {
                lateNight:   "Il est {time}... encore éveillé à cette heure ?",
                dawn:        "{time} du matin... t'as veillé toute la nuit ?",
                morning:     "{time}. C'est le matin. Heure idéale pour commencer les cours.",
                lateMorning: "{time}... t'es pas censé être en cours ?",
                noon:        "{time}. L'heure du déjeuner. T'as mangé ?",
                afternoon:   "{time}... déjà l'après-midi. Les cours finissent bientôt.",
                sunset:      "{time}. Le soleil se couche... tu restes à l'école ?",
                evening:     "{time}... il commence à faire nuit. L'école devient silencieuse.",
                night:       "{time}... il est tard. Tu n'as pas peur d'être seule ici ?"
            }
        },
        de: {
            title: "Das Klassenzimmer ohne Abschluss", subtitle: "Fünf-Tage-Protokoll",
            metaTitle: "Nevergrad - Das Klassenzimmer ohne Abschluss",
            metaDesc: "Der erste Tag nach dem Schulwechsel, alles war perfekt. Zu perfekt, um normal zu sein.",
            newGame: "Neues Spiel", continue: "Fortsetzen", gallery: "Galerie",
            namePrompt: "Wie heißt du?", namePlaceholder: "Namen eingeben", start: "Start",
            save: "Speichern", load: "Laden", settings: "Einstellungen", toTitle: "Titelbildschirm", resume: "Zurück",
            settingsBgm: "BGM-Lautstärke", settingsSfx: "Soundeffekte", settingsTextSpeed: "Textgeschwindigkeit",
            settingsFullscreen: "Vollbild", settingsReset: "Zurücksetzen", settingsOn: "AN", settingsOff: "AUS",
            ftPlaceholder: "Nachricht eingeben...", ftSend: "Senden",
            dayFormat: "Tag {day} - {slot}",
            slots: { morning: "Morgen", lunch: "Mittag", afterschool: "Nach der Schule", night: "Nacht" },
            galleryTitle: "Galerie der Enden", galleryBack: "Zurück", galleryProgress: "Fortschritt",
            saveComplete: "Gespeichert",
            slotAuto: "AUTO", slotEmpty: "Leer", slotOldFormat: "Alter Speicherstand",
            slotOverwrite: "Überschreiben?", slotYes: "Ja", slotNo: "Nein",
            binauralActivated: "🎧 Binauraler Modus — Kopfhörer empfohlen",
            latenightAlone: "...bin ich um diese Zeit als einzige wach.",
            headphoneHint: "...mit Kopfhörern würde es klarer klingen.",
            timeDialogue: {
                lateNight:   "Es ist {time}... noch wach um diese Zeit?",
                dawn:        "{time} morgens... hast du die ganze Nacht durchgemacht?",
                morning:     "{time}. Morgen. Perfekte Zeit für den Unterricht.",
                lateMorning: "{time}... solltest du nicht im Unterricht sein?",
                noon:        "{time}. Mittagspause. Hast du gegessen?",
                afternoon:   "{time}... schon Nachmittag. Nicht mehr lange bis Schulschluss.",
                sunset:      "{time}. Die Sonne geht unter... bleibst du in der Schule?",
                evening:     "{time}... es wird dunkel. Die Schule wird still um diese Zeit.",
                night:       "{time}... spät. Hast du keine Angst, allein hier zu sein?"
            }
        },
        pt: {
            title: "A Sala de Aula Sem Formatura", subtitle: "Registro de 5 Dias",
            metaTitle: "Nevergrad - A Sala de Aula Sem Formatura",
            metaDesc: "No primeiro dia de transferência, tudo estava perfeito. Perfeito demais para ser normal.",
            newGame: "Novo Jogo", continue: "Continuar", gallery: "Galeria",
            namePrompt: "Qual é o seu nome?", namePlaceholder: "Digite seu nome", start: "Começar",
            save: "Salvar", load: "Carregar", settings: "Configurações", toTitle: "Título", resume: "Voltar",
            settingsBgm: "Volume BGM", settingsSfx: "Volume efeitos", settingsTextSpeed: "Velocidade do texto",
            settingsFullscreen: "Tela cheia", settingsReset: "Redefinir", settingsOn: "ON", settingsOff: "OFF",
            ftPlaceholder: "Digite uma mensagem...", ftSend: "Enviar",
            dayFormat: "Dia {day} - {slot}",
            slots: { morning: "Manhã", lunch: "Almoço", afterschool: "Depois da Aula", night: "Noite" },
            galleryTitle: "Galeria de Finais", galleryBack: "Voltar", galleryProgress: "Progresso",
            saveComplete: "Salvo",
            slotAuto: "AUTO", slotEmpty: "Slot vazio", slotOldFormat: "Save antigo",
            slotOverwrite: "Sobrescrever?", slotYes: "Sim", slotNo: "Não",
            binauralActivated: "🎧 Modo Binaural — Fones Recomendados",
            latenightAlone: "...será que sou a única pessoa acordada a esta hora.",
            headphoneHint: "...ficaria mais claro com fones de ouvido.",
            timeDialogue: {
                lateNight:   "Já são {time}... você ainda está acordado a esta hora?",
                dawn:        "{time} da manhã... passou a noite em claro?",
                morning:     "{time}. Manhã. Uma boa hora para começar a aula.",
                lateMorning: "{time}... você não deveria estar em aula?",
                noon:        "{time}. Hora do almoço. Você já comeu?",
                afternoon:   "{time}... já é de tarde. Falta pouco para as aulas acabarem.",
                sunset:      "{time}. O sol está se pondo... vai ficar na escola?",
                evening:     "{time}... está escurecendo. A escola fica silenciosa a esta hora.",
                night:       "{time}... está tarde. Não tem medo de ficar aqui sozinho?"
            }
        }
    };

    getSpeakerName(speakerId, playerName) {
        if (!speakerId) return '';
        const names = globalThis.NEVERGRAD_SPEAKER_NAMES || {};
        const labels = names[this.currentLang] || names.en || {};
        const fallbackLabels = names.en || {};
        const label = labels[speakerId]
            || fallbackLabels[speakerId]
            || this.getCharacterName(speakerId);

        if (speakerId === 'me' || speakerId === 'me_watashi') return playerName || label;
        return label;
    }

    /**
     * Character display names used by language-neutral UI effects.
     */
    static CHARACTER_NAMES = {
        ko: {
            eunsu: "\ub2f4\uc784\uad50\uc0ac",
            riin: "\ubcf4\uac74\uad50\uc0ac",
            sea: "\ud55c\uc138\uc544",
            yuna: "\ucd5c\uc720\ub098",
            seolhwa: "\uc774\uc124\ud654",
            me: "\ub098",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("ko")
        },
        en: {
            eunsu: "Homeroom Teacher",
            riin: "School Nurse",
            sea: "Han Sea",
            yuna: "Choi Yuna",
            seolhwa: "Lee Seolhwa",
            me: "Me",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("en")
        },
        ja: {
            eunsu: "\u62c5\u4efb\u6559\u5e2b",
            riin: "\u4fdd\u5065\u6559\u5e2b",
            sea: "\u30cf\u30f3\u30fb\u30bb\u30a2",
            yuna: "\u30c1\u30a7\u30fb\u30e6\u30ca",
            seolhwa: "\u30a4\u30fb\u30bd\u30eb\u30d5\u30a1",
            me: "\u50d5",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("ja")
        },
        es: {
            eunsu: "Profesora tutora",
            riin: "Enfermera escolar",
            sea: "Han Sea",
            yuna: "Choi Yuna",
            seolhwa: "Lee Seolhwa",
            me: "Yo",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("es")
        },
        fr: {
            eunsu: "Professeure principale",
            riin: "Infirmière scolaire",
            sea: "Han Sea",
            yuna: "Choi Yuna",
            seolhwa: "Lee Seolhwa",
            me: "Moi",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("fr")
        },
        de: {
            eunsu: "Klassenlehrerin",
            riin: "Schulkrankenschwester",
            sea: "Han Sea",
            yuna: "Choi Yuna",
            seolhwa: "Lee Seolhwa",
            me: "Ich",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("de")
        },
        pt: {
            eunsu: "Professora orientadora",
            riin: "Enfermeira escolar",
            sea: "Han Sea",
            yuna: "Choi Yuna",
            seolhwa: "Lee Seolhwa",
            me: "Eu",
            unknown: NEVERGRAD_TEXT_MARKERS.unknownName("pt")
        }
    };

    getCharacterName(charId) {
        if (!charId) return '';
        return I18nManager.CHARACTER_NAMES[this.currentLang]?.[charId]
            || I18nManager.CHARACTER_NAMES.en?.[charId]
            || CONFIG.CHAR_NAMES?.[charId]
            || charId;
    }

    static STAT_LABEL_TEXTS = {
        ko: {
            romance: "\ud638\uac10\ub3c4",
            thriller: {
                eunsu: "\uc704\ud5d8\ub3c4",
                sea: "\uc9d1\ucc29\ub3c4",
                riin: "\uc2e0\ub8b0\ub3c4",
                yuna: "\ud638\uac10\ub3c4",
                seolhwa: "\ub3d9\uae30\ud654"
            }
        },
        en: {
            romance: "Affinity",
            thriller: {
                eunsu: "Danger",
                sea: "Obsession",
                riin: "Trust",
                yuna: "Affinity",
                seolhwa: "Sync"
            }
        },
        ja: {
            romance: "\u597d\u611f\u5ea6",
            thriller: {
                eunsu: "\u5371\u967a\u5ea6",
                sea: "\u57f7\u7740\u5ea6",
                riin: "\u4fe1\u983c\u5ea6",
                yuna: "\u597d\u611f\u5ea6",
                seolhwa: "\u540c\u671f"
            }
        },
        es: {
            romance: "Afinidad",
            thriller: {
                eunsu: "Peligro",
                sea: "Obsesión",
                riin: "Confianza",
                yuna: "Afinidad",
                seolhwa: "Sincronía"
            }
        },
        fr: {
            romance: "Affinité",
            thriller: {
                eunsu: "Danger",
                sea: "Obsession",
                riin: "Confiance",
                yuna: "Affinité",
                seolhwa: "Synchronisation"
            }
        },
        de: {
            romance: "Zuneigung",
            thriller: {
                eunsu: "Gefahr",
                sea: "Besessenheit",
                riin: "Vertrauen",
                yuna: "Zuneigung",
                seolhwa: "Synchronisation"
            }
        },
        pt: {
            romance: "Afinidade",
            thriller: {
                eunsu: "Perigo",
                sea: "Obsessao",
                riin: "Confianca",
                yuna: "Afinidade",
                seolhwa: "Sincronia"
            }
        }
    };

    getStatLabel(mode, charId) {
        const fallback = mode === CONFIG.STAT_MODES.THRILLER
            ? CONFIG.STAT_LABELS.thriller[charId]
            : CONFIG.STAT_LABELS.romance;
        const langTexts = I18nManager.STAT_LABEL_TEXTS[this.currentLang]
            || I18nManager.STAT_LABEL_TEXTS.en;

        if (mode === CONFIG.STAT_MODES.THRILLER && fallback) {
            const label = langTexts.thriller?.[charId]
                || I18nManager.STAT_LABEL_TEXTS.en.thriller[charId]
                || fallback.label;
            return { ...fallback, label };
        }

        return {
            ...fallback,
            primary: langTexts.romance || I18nManager.STAT_LABEL_TEXTS.en.romance
        };
    }

    /**
     * 현재 언어의 UI 텍스트 반환
     */
    getUI(key) {
        return I18nManager.UI[this.currentLang]?.[key] || I18nManager.UI.en?.[key] || I18nManager.UI.ko?.[key] || '';
    }
}
