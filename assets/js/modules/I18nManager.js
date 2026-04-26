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
 *   i18n:    { "day1_opening": { name: "나", text: "..." } }
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
        this.texts = {};       // { day1: { scene_id: { name, text, choices } }, day2: {...} }
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
     * 번역 미완료 항목은 ko 원문으로 폴백
     * @param {number} day - 1~5
     */
    async loadDay(day) {
        const key = `day${day}`;
        if (this.loaded[key]) return;

        const slots = ['_morning', '_lunch', '_afterschool', '_night', '_choco'];
        this.texts[key] = {};

        // ko를 베이스로 먼저 로드 (번역 미완료 항목 폴백용)
        if (this.currentLang !== 'ko') {
            const koFetches = slots.map(async (slot) => {
                const filename = `day${day}${slot}.json`;
                try {
                    const res = await fetch(`${I18nManager.BASE}assets/js/i18n/ko/${filename}`);
                    if (!res.ok) return;
                    const data = await res.json();
                    Object.assign(this.texts[key], data);
                } catch (e) {}
            });
            await Promise.all(koFetches);
        }

        // 대상 언어로 오버레이 (번역된 항목만 덮어씀)
        if (this.currentLang !== 'ko') {
            const fetches = slots.map(async (slot) => {
                const filename = `day${day}${slot}.json`;
                try {
                    const res = await fetch(`${I18nManager.BASE}assets/js/i18n/${this.currentLang}/${filename}`);
                    if (!res.ok) return;
                    const data = await res.json();
                    Object.assign(this.texts[key], data);
                } catch (e) {}
            });
            await Promise.all(fetches);
        } else {
            const fetches = slots.map(async (slot) => {
                const filename = `day${day}${slot}.json`;
                try {
                    const res = await fetch(`${I18nManager.BASE}assets/js/i18n/ko/${filename}`);
                    if (!res.ok) return;
                    const data = await res.json();
                    Object.assign(this.texts[key], data);
                } catch (e) {}
            });
            await Promise.all(fetches);
        }

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
     * @returns {{ name: string, text: string, choices?: string[] }}
     */
    get(sceneId) {
        // scene ID에서 day 번호 추출: "day1_opening" → "day1"
        const dayMatch = sceneId.match(/^day(\d)/);
        if (!dayMatch) return { name: "", text: "" };

        const dayKey = `day${dayMatch[1]}`;
        const entry = this.texts[dayKey]?.[sceneId];

        if (!entry) {
            console.warn(`[I18n] Missing text: ${this.currentLang}/${dayKey}.json → "${sceneId}"`);
            return { name: "???", text: `[MISSING: ${sceneId}]` };
        }

        return entry;
    }

    /**
     * 텍스트 내 플레이스홀더 치환
     * {name} → 플레이어 이름
     */
    resolve(text, playerName, extraVars) {
        if (!text) return "";
        const fallback = I18nManager.DEFAULT_PLAYER_NAME[this.currentLang] || "전학생";
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
        'pt-BR': "Estudante transferido"
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
        'pt-BR': { label: "Português (Brasil)", flag: "🇧🇷" }
    };

    /**
     * UI 텍스트 (버튼, 제목, 메타 등) — 언어별 정적 번역
     */
    static UI = {
        ko: {
            title: "졸업하지 못한 교실", subtitle: "5일의 기록",
            metaTitle: "졸업하지 못한 교실 - 5일의 기록",
            metaDesc: "전학 첫날, 모든 것이 완벽했다. 너무 완벽해서 이상할 정도로.",
            newGame: "새 게임", continue: "이어하기", gallery: "갤러리",
            namePrompt: "당신의 이름은?", namePlaceholder: "이름을 입력하세요", start: "시작",
            save: "저장", load: "불러오기", settings: "설정", toTitle: "타이틀로", resume: "돌아가기",
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
                dawn:        "새벽 {time}... 밤새 한 거야? 그렇게까지...",
                morning:     "{time}. 아침이네. 수업 시작하기 딱 좋은 시간이야.",
                lateMorning: "{time}... 수업 시간 아니야? 여기 있어도 되는 거야?",
                noon:        "{time}. 점심시간이네. 밥은 먹었어?",
                afternoon:   "{time}... 오후네. 방과후까지 얼마 안 남았어.",
                sunset:      "{time}. 해가 지고 있어... 학교에 남아있을 거야?",
                evening:     "{time}... 밤이 되고 있어. 학교가 조용해지는 시간이야.",
                night:       "{time}... 늦은 시간이네. 여기 혼자 있는 거 무섭지 않아?"
            }
        },
        en: {
            title: "The Classroom of No Graduation", subtitle: "5 Days Record",
            metaTitle: "Nevergrad - The Classroom of No Graduation",
            metaDesc: "The first day of transfer, everything was perfect. Too perfect to be normal.",
            newGame: "New Game", continue: "Continue", gallery: "Gallery",
            namePrompt: "What is your name?", namePlaceholder: "Enter your name", start: "Start",
            save: "Save", load: "Load", settings: "Settings", toTitle: "Title", resume: "Resume",
            ftPlaceholder: "Type a message...", ftSend: "Send",
            dayFormat: "Day {day} - {slot}",
            slots: { morning: "Morning", lunch: "Lunch", afterschool: "After School", night: "Night" },
            galleryTitle: "Ending Gallery", galleryBack: "Back", galleryProgress: "Progress",
            saveComplete: "Saved",
            slotAuto: "AUTO", slotEmpty: "Empty Slot", slotOldFormat: "Legacy Save",
            slotOverwrite: "Overwrite this slot?", slotYes: "Yes", slotNo: "No",
            binauralActivated: "🎧 Binaural Mode — Headphones Recommended",
            latenightAlone: "...am I the only one awake at this hour.",
            headphoneHint: "...it'd be clearer with headphones.",
            timeDialogue: {
                lateNight:   "It's {time}... you're still awake at this hour?",
                dawn:        "{time} in the morning... did you pull an all-nighter?",
                morning:     "{time}. A fine hour to start class.",
                lateMorning: "{time}... aren't you supposed to be in class?",
                noon:        "{time}. Lunch time. Have you eaten?",
                afternoon:   "{time}... afternoon already. Not long until school ends.",
                sunset:      "{time}. The sun is setting... you're staying at school?",
                evening:     "{time}... it's getting dark. The school gets quiet around this time.",
                night:       "{time}... getting late. Aren't you scared being here alone?"
            }
        },
        ja: {
            title: "卒業できない教室", subtitle: "5日間の記録",
            metaTitle: "Nevergrad - 卒業できない教室",
            metaDesc: "転校初日、すべてが完璧だった。完璧すぎて不思議なほどに。",
            newGame: "ニューゲーム", continue: "つづきから", gallery: "ギャラリー",
            namePrompt: "あなたの名前は？", namePlaceholder: "名前を入力してください", start: "スタート",
            save: "セーブ", load: "ロード", settings: "設定", toTitle: "タイトルへ", resume: "戻る",
            ftPlaceholder: "メッセージを入力...", ftSend: "送信",
            dayFormat: "{day}日目 - {slot}",
            slots: { morning: "朝", lunch: "昼", afterschool: "放課後", night: "夜" },
            galleryTitle: "エンディングギャラリー", galleryBack: "戻る", galleryProgress: "達成率",
            saveComplete: "保存完了",
            slotAuto: "AUTO", slotEmpty: "空きスロット", slotOldFormat: "旧セーブ",
            slotOverwrite: "上書きしますか？", slotYes: "はい", slotNo: "いいえ",
            binauralActivated: "🎧 バイノーラルモード — イヤホン推奨",
            latenightAlone: "...こんな時間に起きてるのは私だけかな。",
            headphoneHint: "...イヤホンをつけたらもっとよく聞こえそうなのに。",
            timeDialogue: {
                lateNight:   "今{time}だよ…こんな時間まで起きてるの?",
                dawn:        "早朝{time}…一晩中?そこまでして…",
                morning:     "{time}。朝だね。授業を始めるのにちょうどいい時間。",
                lateMorning: "{time}…授業中じゃないの?ここにいていいの?",
                noon:        "{time}。お昼だね。ご飯は食べた?",
                afternoon:   "{time}…午後だね。放課後まであと少し。",
                sunset:      "{time}。日が沈んでいく…学校に残るの?",
                evening:     "{time}…夜になるね。学校が静かになる時間。",
                night:       "{time}…遅い時間だね。一人でここにいて怖くないの?"
            }
        },
        es: {
            title: "El Aula Sin Graduación", subtitle: "Registro de 5 Días",
            metaTitle: "Nevergrad - El Aula Sin Graduación",
            metaDesc: "El primer día de transferencia, todo era perfecto. Demasiado perfecto para ser normal.",
            newGame: "Nueva Partida", continue: "Continuar", gallery: "Galería",
            namePrompt: "¿Cuál es tu nombre?", namePlaceholder: "Ingresa tu nombre", start: "Iniciar",
            save: "Guardar", load: "Cargar", settings: "Ajustes", toTitle: "Título", resume: "Volver",
            ftPlaceholder: "Escribe un mensaje...", ftSend: "Enviar",
            dayFormat: "Día {day} - {slot}",
            slots: { morning: "Mañana", lunch: "Almuerzo", afterschool: "Después de Clases", night: "Noche" },
            galleryTitle: "Galería de Finales", galleryBack: "Volver", galleryProgress: "Progreso",
            saveComplete: "Guardado",
            slotAuto: "AUTO", slotEmpty: "Vacío", slotOldFormat: "Guardado anterior",
            slotOverwrite: "¿Sobrescribir?", slotYes: "Sí", slotNo: "No",
            binauralActivated: "🎧 Modo Binaural — Auriculares Recomendados",
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
                night:       "{time}... tarde. ¿No te da miedo estar aquí sola?"
            }
        },
        fr: {
            title: "La Classe Sans Diplôme", subtitle: "Chronique de 5 Jours",
            metaTitle: "Nevergrad - La Classe Sans Diplôme",
            metaDesc: "Le premier jour de transfert, tout était parfait. Trop parfait pour être normal.",
            newGame: "Nouvelle Partie", continue: "Continuer", gallery: "Galerie",
            namePrompt: "Quel est votre nom ?", namePlaceholder: "Entrez votre nom", start: "Commencer",
            save: "Sauvegarder", load: "Charger", settings: "Paramètres", toTitle: "Titre", resume: "Retour",
            ftPlaceholder: "Écrivez un message...", ftSend: "Envoyer",
            dayFormat: "Jour {day} - {slot}",
            slots: { morning: "Matin", lunch: "Midi", afterschool: "Après les Cours", night: "Nuit" },
            galleryTitle: "Galerie des Fins", galleryBack: "Retour", galleryProgress: "Progression",
            saveComplete: "Sauvegardé",
            slotAuto: "AUTO", slotEmpty: "Vide", slotOldFormat: "Ancienne sauvegarde",
            slotOverwrite: "Écraser ?", slotYes: "Oui", slotNo: "Non",
            binauralActivated: "🎧 Mode Binaural — Écouteurs Recommandés",
            latenightAlone: "...suis-je la seule à être réveillée à cette heure.",
            headphoneHint: "...ce serait plus clair avec des écouteurs.",
            timeDialogue: {
                lateNight:   "Il est {time}... encore éveillé à cette heure ?",
                dawn:        "{time} du matin... t'as veillé toute la nuit ?",
                morning:     "{time}. C'est le matin. Heure idéale pour commencer les cours.",
                lateMorning: "{time}... t'es pas censé être en cours ?",
                noon:        "{time}. L'heure du déjeuner. T'as mangé ?",
                afternoon:   "{time}... déjà l'après-midi. Plus longtemps avant la fin des cours.",
                sunset:      "{time}. Le soleil se couche... tu restes à l'école ?",
                evening:     "{time}... il commence à faire nuit. L'école devient silencieuse.",
                night:       "{time}... il est tard. Tu n'as pas peur d'être seule ici ?"
            }
        },
        de: {
            title: "Das Klassenzimmer ohne Abschluss", subtitle: "Aufzeichnung von 5 Tagen",
            metaTitle: "Nevergrad - Das Klassenzimmer ohne Abschluss",
            metaDesc: "Der erste Tag nach dem Schulwechsel, alles war perfekt. Zu perfekt, um normal zu sein.",
            newGame: "Neues Spiel", continue: "Fortsetzen", gallery: "Galerie",
            namePrompt: "Wie heißt du?", namePlaceholder: "Namen eingeben", start: "Start",
            save: "Speichern", load: "Laden", settings: "Einstellungen", toTitle: "Titelbildschirm", resume: "Zurück",
            ftPlaceholder: "Nachricht eingeben...", ftSend: "Senden",
            dayFormat: "Tag {day} - {slot}",
            slots: { morning: "Morgen", lunch: "Mittag", afterschool: "Nach der Schule", night: "Nacht" },
            galleryTitle: "Ending-Galerie", galleryBack: "Zurück", galleryProgress: "Fortschritt",
            saveComplete: "Gespeichert",
            slotAuto: "AUTO", slotEmpty: "Leer", slotOldFormat: "Alter Speicherstand",
            slotOverwrite: "Überschreiben?", slotYes: "Ja", slotNo: "Nein",
            binauralActivated: "🎧 Binauraler Modus — Kopfhörer Empfohlen",
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
        'pt-BR': {
            title: "A Sala de Aula Sem Formatura", subtitle: "Registro de 5 Dias",
            metaTitle: "Nevergrad - A Sala de Aula Sem Formatura",
            metaDesc: "No primeiro dia de transferência, tudo estava perfeito. Perfeito demais para ser normal.",
            newGame: "Novo Jogo", continue: "Continuar", gallery: "Galeria",
            namePrompt: "Qual é o seu nome?", namePlaceholder: "Digite seu nome", start: "Começar",
            save: "Salvar", load: "Carregar", settings: "Configurações", toTitle: "Título", resume: "Voltar",
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

    /**
     * 현재 언어의 UI 텍스트 반환
     */
    getUI(key) {
        return I18nManager.UI[this.currentLang]?.[key] || I18nManager.UI['ko'][key] || '';
    }
}
