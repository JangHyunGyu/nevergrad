/**
 * ============================================================================
 * StateManager.js - 게임 상태 관리
 * ============================================================================
 *
 * 플레이어 정보, 캐릭터 스탯, 플래그, 장르 전환 상태를 관리합니다.
 *
 * [핵심 설계]
 * - affinity 하나로 통합
 * - Day 1~3: UI에 "♡ 호감도 X" 표시
 * - Day 4+: 캐릭터별 라벨로 전환 (위험도/집착도/신뢰도/호감도/동기화)
 */

class StateManager {
    constructor() {
        this.playerName = "";
        this.currentDay = 1;
        this.currentSlot = "morning"; // morning, lunch, afterschool, night
        this.currentScene = "";

        // 장르 모드 (romance → thriller)
        this.mode = CONFIG.STAT_MODES.ROMANCE;

        // 글리치 강도
        this.glitchLevel = CONFIG.GLITCH_LEVELS.NONE;

        // 캐릭터 스탯 (affinity 하나로 통합)
        this.stats = {};
        for (const [id, initial] of Object.entries(INITIAL_STATS)) {
            this.stats[id] = { ...initial };
        }

        // 플래그 (스토리 진행 추적)
        this.flags = {};

        // 수집한 증거 목록
        this.evidence = [];

        // 대화 기록 (FreeTalk용)
        this.chatMemories = {};

        // UI 테마 (점진적 변환용)
        this.currentTheme = "romance";

        // 포스트크레딧/메타 연출용 플레이 분석 데이터
        this.analytics = this._defaultAnalytics();
    }

    // ===== 플레이 분석 =====

    _defaultAnalytics() {
        return {
            totalPlayMs: 0,
            sessionActiveAt: Date.now(),
            routeSelections: {
                sea: 0,
                yuna: 0,
                riin: 0,
                eunsu: 0,
                alone: 0
            },
            seolhwaAttempts: 0,
            riinVisits: 0,
            lastTimedChoice: null,
            timedChoiceHistory: {},
            generatedNames: {
                new_name: null,
                '14th_name': null
            }
        };
    }

    _ensureAnalytics() {
        if (!this.analytics) {
            this.analytics = this._defaultAnalytics();
            return;
        }

        const defaults = this._defaultAnalytics();
        this.analytics = {
            ...defaults,
            ...this.analytics,
            routeSelections: {
                ...defaults.routeSelections,
                ...(this.analytics.routeSelections || {})
            },
            timedChoiceHistory: {
                ...(this.analytics.timedChoiceHistory || {})
            },
            generatedNames: {
                ...defaults.generatedNames,
                ...(this.analytics.generatedNames || {})
            }
        };
    }

    startNewRun() {
        this.analytics = this._defaultAnalytics();
    }

    resumeRun() {
        this._ensureAnalytics();
        if (!this.analytics.sessionActiveAt) {
            this.analytics.sessionActiveAt = Date.now();
        }
    }

    pauseRun() {
        this._ensureAnalytics();
        if (!this.analytics.sessionActiveAt) return;
        this.analytics.totalPlayMs += Date.now() - this.analytics.sessionActiveAt;
        this.analytics.sessionActiveAt = null;
    }

    getTotalPlayMs() {
        this._ensureAnalytics();
        const activeMs = this.analytics.sessionActiveAt
            ? Date.now() - this.analytics.sessionActiveAt
            : 0;
        return (this.analytics.totalPlayMs || 0) + activeMs;
    }

    recordRouteSelection(routeKey) {
        this._ensureAnalytics();
        if (!(routeKey in this.analytics.routeSelections)) return;
        this.analytics.routeSelections[routeKey]++;
        if (routeKey === 'riin') {
            this.analytics.riinVisits++;
        }
    }

    recordSeolhwaAttempt() {
        this._ensureAnalytics();
        this.analytics.seolhwaAttempts++;
    }

    recordTimedChoice(sceneId, timeLimitMs, elapsedMs, timedOut = false) {
        this._ensureAnalytics();
        const record = {
            sceneId,
            timeLimitMs,
            elapsedMs,
            timedOut,
            recordedAt: Date.now()
        };
        this.analytics.lastTimedChoice = record;
        this.analytics.timedChoiceHistory[sceneId] = record;
    }

    getGeneratedName(key, factory) {
        this._ensureAnalytics();
        if (!this.analytics.generatedNames[key]) {
            this.analytics.generatedNames[key] = factory ? factory() : '';
        }
        return this.analytics.generatedNames[key];
    }

    // ===== 스탯 조작 =====

    /**
     * 스탯 변경 (affinity만 사용)
     */
    changeStat(charId, statName, delta) {
        if (!this.stats[charId]) return;
        // affinity 외의 스탯은 모두 affinity로 통합
        const key = 'affinity';
        const current = this.stats[charId][key] || 0;
        this.stats[charId][key] = Math.max(
            CONFIG.STAT_MIN,
            Math.min(CONFIG.STAT_MAX, current + delta)
        );
    }

    /**
     * 호감도(affinity) 값 반환
     * Day 1~3: "♡ 호감도 X"
     * Day 4+: 캐릭터별 라벨 (위험도/집착도/신뢰도/호감도/동기화)
     */
    getDisplayAffinity(charId) {
        const s = this.stats[charId];
        if (!s) return 0;
        return s.affinity || 0;
    }

    /**
     * 캐릭터별 라벨 정보 반환 (Day 4+ thriller 모드용)
     */
    getCharLabel(charId) {
        if (this.mode === CONFIG.STAT_MODES.THRILLER && CONFIG.STAT_LABELS.thriller[charId]) {
            return CONFIG.STAT_LABELS.thriller[charId];
        }
        return CONFIG.STAT_LABELS.romance;
    }

    /**
     * 실제 스탯 반환 (affinity만)
     */
    getRealStats(charId) {
        return this.stats[charId] || { affinity: 0 };
    }

    // ===== 플래그 관리 =====

    setFlag(flag) {
        this.flags[flag] = true;
    }

    clearFlag(flag) {
        delete this.flags[flag];
    }

    hasFlag(flag) {
        return !!this.flags[flag];
    }

    setFlags(flagArray) {
        if (!Array.isArray(flagArray)) return;
        flagArray.forEach(f => this.setFlag(f));
    }

    // ===== 증거 수집 =====

    addEvidence(evidence) {
        if (!this.evidence.find(e => e.id === evidence.id)) {
            this.evidence.push(evidence);
        }
    }

    hasEvidence(evidenceId) {
        return this.evidence.some(e => e.id === evidenceId);
    }

    // ===== 장르 전환 =====

    /**
     * 로맨스 → 스릴러 전환
     * Day 3 밤 특정 씬에서 호출
     */
    triggerGenreShift() {
        this.mode = CONFIG.STAT_MODES.THRILLER;
        this.glitchLevel = CONFIG.GLITCH_LEVELS.BREAKING;
        this.currentTheme = "thriller";
    }

    /**
     * 글리치 레벨 점진적 상승
     */
    setGlitchLevel(level) {
        this.glitchLevel = level;
    }

    /**
     * 테마 전환 (점진적)
     */
    setTheme(theme) {
        this.currentTheme = theme;
    }

    // ===== 직렬화 (저장/불러오기) =====

    serialize() {
        this._ensureAnalytics();
        const analytics = {
            ...JSON.parse(JSON.stringify(this.analytics)),
            totalPlayMs: this.getTotalPlayMs(),
            sessionActiveAt: Date.now()
        };

        return {
            playerName: this.playerName,
            currentDay: this.currentDay,
            currentSlot: this.currentSlot,
            currentScene: this.currentScene,
            mode: this.mode,
            glitchLevel: this.glitchLevel,
            stats: JSON.parse(JSON.stringify(this.stats)),
            flags: { ...this.flags },
            evidence: [...this.evidence],
            chatMemories: JSON.parse(JSON.stringify(this.chatMemories)),
            currentTheme: this.currentTheme,
            analytics
        };
    }

    deserialize(data) {
        if (!data) return;
        this.playerName = data.playerName || "";
        this.currentDay = data.currentDay || 1;
        this.currentSlot = data.currentSlot || "morning";
        this.currentScene = data.currentScene || "";
        this.mode = data.mode || CONFIG.STAT_MODES.ROMANCE;
        this.glitchLevel = data.glitchLevel || CONFIG.GLITCH_LEVELS.NONE;
        this.stats = data.stats || {};
        this.flags = data.flags || {};
        this.evidence = data.evidence || [];
        this.chatMemories = data.chatMemories || {};
        this.currentTheme = data.currentTheme || "romance";

        const defaults = this._defaultAnalytics();
        const analytics = data.analytics || {};
        this.analytics = {
            ...defaults,
            ...analytics,
            routeSelections: {
                ...defaults.routeSelections,
                ...(analytics.routeSelections || {})
            },
            timedChoiceHistory: {
                ...(analytics.timedChoiceHistory || {})
            },
            generatedNames: {
                ...defaults.generatedNames,
                ...(analytics.generatedNames || {})
            },
            sessionActiveAt: Date.now()
        };
    }
}
