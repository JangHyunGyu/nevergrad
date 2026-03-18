/**
 * ============================================================================
 * CrossoverSystem.js - Cupid × Nevergrad 크로스오버 감지 시스템
 * ============================================================================
 *
 * 게임 시작 시 브라우저 LocalStorage에서 Cupid 플레이 기록을 감지하고,
 * 감지된 정보를 게임 전역에서 접근 가능하도록 제공합니다.
 *
 * [감지 항목]
 * - cupid_cycle_01: 'complete'면 Cupid 1주차 클리어
 * - cupid_heroine: 공략한 히로인 ID (seoyeon, yuna, etc.)
 * - cupid_subject_compliance: 순응도 점수 (0~100)
 *
 * [게임 내 활용]
 * - Day 1 설화 특수 대사 트리거
 * - Day 3 글리치 장면에 Cupid CG 삽입
 * - 진엔딩 서버 파일에서 cycle_01 상태 변경
 *
 * [주의]
 * - LocalStorage 접근 실패 시 graceful fallback (플레이 미감지 상태)
 * - 감지 결과는 읽기 전용 — Nevergrad가 Cupid 데이터를 변경하지 않음
 */

class CrossoverSystem {
    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {boolean} Cupid cycle_01 클리어 여부 */
        this.cupidCompleted = false;

        /** @type {string|null} 공략한 히로인 ID */
        this.cupidHeroine = null;

        /** @type {number|null} 순응도 점수 (0~100) */
        this.cupidCompliance = null;

        /** @type {boolean} 감지 완료 여부 */
        this._detected = false;
    }

    /**
     * LocalStorage에서 Cupid 플레이 기록을 감지
     * 게임 초기화 시 한 번 호출
     */
    detect() {
        if (this._detected) return;
        this._detected = true;

        try {
            // cycle_01 클리어 여부
            const cycle01 = localStorage.getItem('cupid_cycle_01');
            this.cupidCompleted = (cycle01 === 'complete');

            // 공략 히로인
            const heroine = localStorage.getItem('cupid_heroine');
            if (heroine && typeof heroine === 'string' && heroine.length > 0) {
                this.cupidHeroine = heroine;
            }

            // 순응도 점수
            const compliance = localStorage.getItem('cupid_subject_compliance');
            if (compliance !== null) {
                const parsed = parseInt(compliance, 10);
                if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                    this.cupidCompliance = parsed;
                }
            }
        } catch (e) {
            // localStorage 접근 불가 (비활성화, 시크릿 모드 등)
            this.cupidCompleted = false;
            this.cupidHeroine = null;
            this.cupidCompliance = null;
        }
    }

    /**
     * Cupid 플레이 여부 반환
     * @returns {boolean}
     */
    hasPlayedCupid() {
        return this.cupidCompleted;
    }

    /**
     * 크로스오버 데이터 전체 반환 (읽기 전용 복사본)
     * @returns {{ completed: boolean, heroine: string|null, compliance: number|null }}
     */
    getData() {
        return {
            completed: this.cupidCompleted,
            heroine: this.cupidHeroine,
            compliance: this.cupidCompliance
        };
    }
}

window.CrossoverSystem = CrossoverSystem;
