/**
 * ============================================================================
 * SaveManager.js - 저장/불러오기 + NG+ 감지 + 선택 이력
 * ============================================================================
 *
 * [localStorage 키 구조]
 * - nevergrad_save          : 자동저장 슬롯 (이어하기용, 하위호환)
 * - nevergrad_slot_1 ~ _9   : 수동 저장 슬롯 9개
 * - nevergrad_meta          : 회차 메타데이터 (엔딩 기록, NG+ 감지)
 * - nevergrad_choices       : 1회차 선택 이력 (2회차 선택지 오염용)
 *
 * [세이브 슬롯 설계]
 * - 슬롯 0 (자동): 씬 전환 시 자동저장, "이어하기" 전용
 * - 슬롯 1~9 (수동): 플레이어가 직접 관리 (7개 엔딩 탐색용)
 * - 13개 "피험자 슬롯"은 Day 4 메타호러 연출 전용 (별도)
 *
 * [NG+ 설계]
 * - 1회차 클리어 시 엔딩 종류를 meta에 기록
 * - 2회차 시작 시 meta를 읽어 isNewGamePlus 판별
 * - 1회차 선택 이력은 choices에 별도 보관 (게임 세이브와 독립)
 */

class SaveManager {
    constructor(stateManager) {
        this.state = stateManager;

        // localStorage 키
        this.SAVE_KEY = 'nevergrad_save';        // 자동저장 (슬롯 0)
        this.SLOT_PREFIX = 'nevergrad_slot_';     // 수동슬롯 1~9
        this.META_KEY = 'nevergrad_meta';
        this.CHOICES_KEY = 'nevergrad_choices';
        this.MAX_SLOTS = 9;
    }

    _slotKey(slotIndex) {
        return slotIndex === 0 ? this.SAVE_KEY : `${this.SLOT_PREFIX}${slotIndex}`;
    }

    _isValidGameState(gameState) {
        if (!gameState || typeof gameState !== 'object' || Array.isArray(gameState)) return false;
        if (!Number.isInteger(gameState.currentDay) || gameState.currentDay < 1 || gameState.currentDay > 5) return false;
        if (typeof gameState.currentScene !== 'string' || !gameState.currentScene.trim()) return false;
        if (!gameState.currentScene.startsWith(`day${gameState.currentDay}_`)) return false;
        if (typeof SCENARIO !== 'undefined' && !SCENARIO[gameState.currentDay]?.[gameState.currentScene]) return false;
        return true;
    }

    _readSlot(slotIndex) {
        try {
            const raw = localStorage.getItem(this._slotKey(slotIndex));
            if (!raw) return null;
            const slotData = JSON.parse(raw);
            const gameState = slotData?.gameState || slotData;
            if (!this._isValidGameState(gameState)) return null;
            return { slotData, gameState };
        } catch (_) {
            return null;
        }
    }

    // =========================================================================
    // 멀티슬롯 저장/불러오기
    // =========================================================================

    /**
     * 슬롯에 저장
     * @param {number} slotIndex - 0=자동, 1~9=수동
     * @returns {boolean}
     */
    saveToSlot(slotIndex) {
        try {
            const gameData = this.state.serialize();
            const slotData = {
                gameState: gameData,
                timestamp: Date.now(),
                playerName: gameData.playerName,
                currentDay: gameData.currentDay,
                currentSlot: gameData.currentSlot,
                currentScene: gameData.currentScene
            };
            const key = this._slotKey(slotIndex);
            localStorage.setItem(key, JSON.stringify(slotData));
            return true;
        } catch (e) {
            console.error('[SaveManager] Save to slot', slotIndex, 'failed:', e);
            return false;
        }
    }

    /**
     * 슬롯에서 불러오기
     * @param {number} slotIndex - 0=자동, 1~9=수동
     * @returns {boolean}
     */
    loadFromSlot(slotIndex) {
        try {
            const parsed = this._readSlot(slotIndex);
            if (!parsed) return false;
            // 하위호환: 이전 형식(gameState 래핑 없음)도 지원
            this.state.deserialize(parsed.gameState);
            return true;
        } catch (e) {
            console.error('[SaveManager] Load from slot', slotIndex, 'failed:', e);
            return false;
        }
    }

    /**
     * 슬롯 데이터 읽기 (UI 표시용, 게임 상태에 영향 없음)
     * @param {number} slotIndex
     * @returns {object|null} { playerName, currentDay, currentSlot, timestamp } 또는 null
     */
    getSlotInfo(slotIndex) {
        try {
            const parsed = this._readSlot(slotIndex);
            if (!parsed) return null;
            const data = parsed.slotData;
            // 하위호환
            if (data.gameState) {
                return {
                    playerName: data.playerName,
                    currentDay: data.currentDay,
                    currentSlot: data.currentSlot,
                    timestamp: data.timestamp
                };
            }
            // 이전 형식 (자동저장 하위호환)
            return {
                playerName: data.playerName,
                currentDay: data.currentDay,
                currentSlot: data.currentSlot,
                timestamp: null
            };
        } catch {
            return null;
        }
    }

    /**
     * 모든 슬롯 정보 반환 (0=자동, 1~9=수동)
     * @returns {Array<object|null>}
     */
    getAllSlotInfo() {
        const slots = [];
        for (let i = 0; i <= this.MAX_SLOTS; i++) {
            slots.push(this.getSlotInfo(i));
        }
        return slots;
    }

    /**
     * 슬롯 삭제
     * @param {number} slotIndex
     */
    deleteSlot(slotIndex) {
        localStorage.removeItem(this._slotKey(slotIndex));
    }

    /**
     * 슬롯에 데이터가 있는지 확인
     * @param {number} slotIndex
     * @returns {boolean}
     */
    hasSlotData(slotIndex) {
        return !!this._readSlot(slotIndex);
    }

    // =========================================================================
    // 하위호환 인터페이스 (기존 코드 유지)
    // =========================================================================

    save() {
        return this.saveToSlot(0);
    }

    load() {
        return this.loadFromSlot(0);
    }

    hasSaveData() {
        return this.hasSlotData(0);
    }

    deleteSave() {
        this.deleteSlot(0);
    }

    // =========================================================================
    // 메타데이터 (회차 간 영속)
    // =========================================================================

    /**
     * 메타데이터 읽기
     * @returns {NevergradMeta}
     *
     * @typedef {Object} NevergradMeta
     * @property {number} playCount         - 클리어 횟수
     * @property {string[]} endingsSeen     - 본 엔딩 목록 ['TRUE','ESCAPE','FORGET',...]
     * @property {string|null} lastEnding   - 가장 최근 엔딩
     * @property {number} lastClearTime     - 마지막 클리어 timestamp
     */
    getMeta() {
        try {
            const raw = localStorage.getItem(this.META_KEY);
            if (!raw) return this._defaultMeta();
            return { ...this._defaultMeta(), ...JSON.parse(raw) };
        } catch {
            return this._defaultMeta();
        }
    }

    /**
     * 엔딩 도달 시 메타 기록
     * @param {string} endingType - 엔딩 종류 ('TRUE','ESCAPE','RESIST','CAGE','FORGET','GHOST','COMPLICIT')
     */
    recordEnding(endingType) {
        const meta = this.getMeta();
        meta.playCount++;
        meta.lastEnding = endingType;
        meta.lastClearTime = Date.now();

        if (!meta.endingsSeen.includes(endingType)) {
            meta.endingsSeen.push(endingType);
        }

        try {
            localStorage.setItem(this.META_KEY, JSON.stringify(meta));
        } catch (e) {
            console.error('[SaveManager] Meta save failed:', e);
        }
    }

    /**
     * NG+ 여부 판별
     * @returns {boolean} 1회 이상 클리어했으면 true
     */
    isNewGamePlus() {
        return this.getMeta().playCount > 0;
    }

    /**
     * 특정 엔딩을 본 적 있는지
     * @param {string} endingType
     * @returns {boolean}
     */
    hasSeenEnding(endingType) {
        return this.getMeta().endingsSeen.includes(endingType);
    }

    /** @private */
    _defaultMeta() {
        return {
            playCount: 0,
            endingsSeen: [],
            lastEnding: null,
            lastClearTime: 0
        };
    }

    // =========================================================================
    // 선택 이력 (2회차 선택지 오염용)
    // =========================================================================

    /**
     * 선택지 선택 기록
     * @param {string} sceneId    - 씬 ID (예: 'day1_chocomilk')
     * @param {number} choiceIndex - 선택한 버튼 인덱스 (0-based)
     * @param {string} choiceText  - 선택한 텍스트 원문
     */
    recordChoice(sceneId, choiceIndex, choiceText) {
        const history = this.getChoiceHistory();
        history[sceneId] = { index: choiceIndex, text: choiceText, time: Date.now() };

        try {
            localStorage.setItem(this.CHOICES_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('[SaveManager] Choice record failed:', e);
        }
    }

    /**
     * 전체 선택 이력 반환
     * @returns {Object<string, {index: number, text: string, time: number}>}
     */
    getChoiceHistory() {
        try {
            const raw = localStorage.getItem(this.CHOICES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    /**
     * 특정 씬에서의 이전 회차 선택 조회
     * @param {string} sceneId
     * @returns {{index: number, text: string, time: number}|null}
     */
    getPreviousChoice(sceneId) {
        return this.getChoiceHistory()[sceneId] || null;
    }

    /**
     * 선택 이력 초기화 (새 회차 시작 시 현재 이력을 보존하고 새로 시작)
     * 1회차 이력은 meta와 함께 영속됨
     */
    rotateChoiceHistory() {
        // 현재 이력은 이미 localStorage에 있으므로 별도 작업 불필요
        // 2회차에서 참조만 하면 됨. 새 선택은 덮어쓰기.
    }

    // =========================================================================
    // 피험자 슬롯 데이터 (Day 4 세이브파일 글리치 UI용)
    // =========================================================================

    /**
     * 13개 피험자 슬롯 데이터 반환
     * 게임 내 "세이브 파일이 강제로 열리는" 연출에서 사용
     *
     * @param {string} playerName - 현재 플레이어 이름 (13번 슬롯용)
     * @returns {SubjectSlot[]}
     *
     * @typedef {Object} SubjectSlot
     * @property {number} number       - 시행 번호 (1~13)
     * @property {string} name         - 피험자 이름
     * @property {string} status       - 상태 텍스트
     * @property {string} statusClass  - CSS 클래스 (completed, failed, active, corrupted)
     * @property {string} day          - Day 표시
     * @property {string} time         - 시간 표시
     */
    getSubjectSlots(playerName = '{name}') {
        const slots = [
            { number: 1,  name: '김도진', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 2,  name: '이준서', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 3,  name: '박서진', day: 'Day 4', time: '15:30', status: '탈출 시도, 실패', statusClass: 'failed' },
            { number: 4,  name: '정하율', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 5,  name: '강민혁', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 6,  name: '윤재원', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 7,  name: '김태호', day: 'Day 5', time: '22:47', status: '██역효과██ 외부 접촉, 탈출 시도', statusClass: 'corrupted' },
            { number: 8,  name: '최시우', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 9,  name: '한지호', day: 'Day 3', time: '11:20', status: '조기 발각, 강제 처리', statusClass: 'failed' },
            { number: 10, name: '송예준', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 11, name: '오태현', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 12, name: '임서율', day: 'Day 5', time: '23:00', status: '처리 완료', statusClass: 'completed' },
            { number: 13, name: playerName, day: 'Day 4', time: '—', status: '진행 중', statusClass: 'active' }
        ];

        // NG+ 모드: 1회차 엔딩 결과를 슬롯 13에 0.5초간 반영하는 데이터 제공
        const meta = this.getMeta();
        if (meta.lastEnding) {
            slots[12].ngPlusFlash = this._endingToSlotStatus(meta.lastEnding);
        }

        return slots;
    }

    /**
     * TRUE END 이후: 모든 슬롯을 '졸업' 상태로 변환
     * @param {string} playerName
     * @returns {SubjectSlot[]}
     */
    getGraduatedSlots(playerName = '{name}') {
        return this.getSubjectSlots(playerName).map(slot => ({
            ...slot,
            status: '졸업 ✓',
            statusClass: 'graduated'
        }));
    }

    /**
     * 엔딩 종류를 슬롯 표시 텍스트로 변환 (NG+ 플래시용)
     * @private
     */
    _endingToSlotStatus(ending) {
        const map = {
            'TRUE':      { status: '졸업 ✓',    statusClass: 'graduated' },
            'ESCAPE':    { status: '탈출 — 미완료', statusClass: 'failed' },
            'RESIST':    { status: '탈출 — 은수 동행', statusClass: 'failed' },
            'CAGE':      { status: '잔류',       statusClass: 'completed' },
            'FORGET':    { status: '처리 완료',   statusClass: 'completed' },
            'GHOST':     { status: '탈출 — 환각 개입', statusClass: 'corrupted' },
            'COMPLICIT': { status: '공범 전환',   statusClass: 'corrupted' }
        };
        return map[ending] || { status: NEVERGRAD_TEXT_MARKERS.corruptedRecord('ko'), statusClass: 'corrupted' };
    }

    // =========================================================================
    // 전체 초기화 (디버그용)
    // =========================================================================

    /**
     * 모든 저장 데이터 삭제 (게임 + 메타 + 선택 이력 + 모든 슬롯)
     */
    deleteAll() {
        localStorage.removeItem(this.SAVE_KEY);
        for (let i = 1; i <= this.MAX_SLOTS; i++) {
            localStorage.removeItem(`${this.SLOT_PREFIX}${i}`);
        }
        localStorage.removeItem(this.META_KEY);
        localStorage.removeItem(this.CHOICES_KEY);
    }
}
