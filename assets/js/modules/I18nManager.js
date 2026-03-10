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

        const slots = ['_morning', '_lunch', '_afterschool', '_night'];
        this.texts[key] = {};

        // ko를 베이스로 먼저 로드 (번역 미완료 항목 폴백용)
        if (this.currentLang !== 'ko') {
            const koFetches = slots.map(async (slot) => {
                const filename = `day${day}${slot}.json`;
                try {
                    const res = await fetch(`assets/js/i18n/ko/${filename}`);
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
                    const res = await fetch(`assets/js/i18n/${this.currentLang}/${filename}`);
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
                    const res = await fetch(`assets/js/i18n/ko/${filename}`);
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
    resolve(text, playerName) {
        if (!text) return "";
        return text
            .replace(/\{name\}/g, playerName || "전학생")
            .replace(/\{name\?\}/g, playerName || "전학생");
    }

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
        de: { label: "Deutsch", flag: "🇩🇪" }
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
            slots: { morning: "아침", lunch: "점심", afterschool: "방과후", night: "밤" }
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
            slots: { morning: "Morning", lunch: "Lunch", afterschool: "After School", night: "Night" }
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
            slots: { morning: "朝", lunch: "昼", afterschool: "放課後", night: "夜" }
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
            slots: { morning: "Mañana", lunch: "Almuerzo", afterschool: "Después de Clases", night: "Noche" }
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
            slots: { morning: "Matin", lunch: "Midi", afterschool: "Après les Cours", night: "Nuit" }
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
            slots: { morning: "Morgen", lunch: "Mittag", afterschool: "Nach der Schule", night: "Nacht" }
        }
    };

    /**
     * 현재 언어의 UI 텍스트 반환
     */
    getUI(key) {
        return I18nManager.UI[this.currentLang]?.[key] || I18nManager.UI['ko'][key] || '';
    }
}
