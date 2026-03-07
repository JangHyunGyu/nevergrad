/**
 * ============================================================================
 * StateManager.js - 게임 상태 관리
 * ============================================================================
 *
 * 플레이어 정보, 캐릭터 스탯, 플래그, 장르 전환 상태를 관리합니다.
 *
 * [핵심 설계]
 * - Phase 1 (Day 1 ~ Day 3 오전): 유저에게 "호감도"만 보여줌
 *   → 내부적으로는 trust/danger가 이미 변동 중
 * - Phase 2 (Day 3 밤 ~): UI가 깨지며 trust/danger가 드러남
 *   → "호감도였던 것"이 사실 위험도의 가중합이었음을 폭로
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

        // 캐릭터 스탯 (내부적으로 항상 3개 축 유지)
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
    }

    // ===== 스탯 조작 =====

    /**
     * 스탯 변경 (내부용 - trust, danger, affinity 모두 조절 가능)
     */
    changeStat(charId, statName, delta) {
        if (!this.stats[charId]) return;
        const current = this.stats[charId][statName] || 0;
        this.stats[charId][statName] = Math.max(
            CONFIG.STAT_MIN,
            Math.min(CONFIG.STAT_MAX, current + delta)
        );
    }

    /**
     * Phase 1에서 유저에게 보여줄 "호감도" 계산
     * 실제로는 (affinity * 0.6 + danger * 0.4)의 가중합
     * → 위험한 캐릭터일수록 "호감도"가 높아 보이는 트릭
     */
    getDisplayAffinity(charId) {
        const s = this.stats[charId];
        if (!s) return 0;

        if (this.mode === CONFIG.STAT_MODES.ROMANCE) {
            // 위장 호감도: danger가 높을수록 호감도도 올라감 (함정)
            return Math.round(s.affinity * 0.6 + s.danger * 0.4);
        }
        return s.affinity;
    }

    /**
     * Phase 2에서 보여줄 실제 수치
     */
    getRealStats(charId) {
        return this.stats[charId] || { trust: 0, danger: 0, affinity: 0 };
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
            currentTheme: this.currentTheme
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
    }
}
