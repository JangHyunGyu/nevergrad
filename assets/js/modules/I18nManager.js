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
     * @param {number} day - 1~5
     */
    async loadDay(day) {
        const key = `day${day}`;
        if (this.loaded[key]) return;

        const slots = ['_morning', '_lunch', '_afterschool', '_night'];
        const basePath = `assets/js/i18n/${this.currentLang}`;
        this.texts[key] = {};

        const fetches = slots.map(async (slot) => {
            const filename = `day${day}${slot}.json`;
            try {
                const res = await fetch(`${basePath}/${filename}`);
                if (!res.ok) return;
                const data = await res.json();
                Object.assign(this.texts[key], data);
            } catch (e) {
                // Slot file may not exist for all days — that's fine
            }
        });

        await Promise.all(fetches);
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
        fr: { label: "Français", flag: "🇫🇷" }
    };
}
