/**
 * ============================================================================
 * GlitchSystemAdvanced.js - 확장 글리치 연출 시스템
 * ============================================================================
 *
 * 기본 GlitchSystem.js의 개별 효과들을 조합하여
 * 시나리오 타임라인에 맞춘 점진적 글리치 연출을 제공합니다.
 *
 * [글리치 레벨]
 * NONE (Day 1): 효과 없음 — 완벽한 미연시
 * SUBTLE (Day 2 오후): 미세한 위화감 — 선택지 깜빡임, BGM 미세 변조
 * UNSETTLING (Day 3): 불쾌한 골짜기 — 노이즈, 텍스트 왜곡, 유령 텍스트
 * BREAKING (Day 4): 장르 전환 — 테마 색상 변환, 스탯 폭로, 강한 글리치
 * NIGHTMARE (Day 5): 완전 붕괴 — 화면 깨짐, 레드 비네트, BGM 왜곡
 *
 * [트리거 키]
 * - 'day2_night_stat_flicker': Day 2 밤 스탯 깜빡임
 * - 'day3_lunch_stat_shift': Day 3 점심 스탯 라벨 변환
 * - 'day3_after_riin_flicker': Day 3 리인 후 선택지 깜빡임
 * - 'day3_night_genre_shift': Day 3 밤 장르 전환
 * - 'day5_nightmare_full': Day 5 전면 붕괴
 */

class GlitchSystemAdvanced {
    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {string} 현재 글리치 레벨 */
        this.level = 'NONE';

        /** @type {HTMLElement|null} 글리치 오버레이 요소 */
        this.overlay = document.getElementById('glitch-overlay');

        /** @type {Array<{text: string, el: HTMLElement}>} 유령 텍스트 대기열 */
        this.ghostTextQueue = [];

        /** @type {number[]} 활성 타이머 ID 목록 (정리용) */
        this._activeTimers = [];

        /** @type {HTMLElement|null} 레드 비네트 요소 */
        this._redVignette = null;

        /** @type {boolean} 위험도 스탯 공개 여부 */
        this._dangerStatsRevealed = false;
    }

    // =========================================================================
    // 글리치 레벨 관리
    // =========================================================================

    /**
     * 글리치 강도 레벨 설정
     * 레벨에 따라 허용되는 효과 범위가 달라짐
     *
     * @param {'NONE'|'SUBTLE'|'UNSETTLING'|'BREAKING'|'NIGHTMARE'} level
     */
    setLevel(level) {
        const validLevels = ['NONE', 'SUBTLE', 'UNSETTLING', 'BREAKING', 'NIGHTMARE'];
        if (!validLevels.includes(level)) return;

        this.level = level;

        // 엔진 상태와 동기화
        if (this.engine?.state) {
            const levelMap = {
                NONE: 0, SUBTLE: 1, UNSETTLING: 2, BREAKING: 3, NIGHTMARE: 4
            };
            this.engine.state.setGlitchLevel(levelMap[level] ?? 0);
        }
    }

    /**
     * 현재 레벨의 수치 값 반환
     * @returns {number} 0~4
     * @private
     */
    _getLevelValue() {
        const map = { NONE: 0, SUBTLE: 1, UNSETTLING: 2, BREAKING: 3, NIGHTMARE: 4 };
        return map[this.level] ?? 0;
    }

    // =========================================================================
    // 오버레이 효과
    // =========================================================================

    /**
     * 노이즈 오버레이 표시
     *
     * @param {number} [duration=300] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showNoise(duration = 300) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('noise');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('noise');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 강한 글리치 오버레이 (스캔라인 + 색수차)
     *
     * @param {number} [duration=1000] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showHeavyGlitch(duration = 1000) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('heavy-glitch');

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.add('screen-shake');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('heavy-glitch');
                if (gameScreen) gameScreen.classList.remove('screen-shake');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 화면 흔들림 효과
     *
     * @param {number} [duration=500] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showScreenShake(duration = 500) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return Promise.resolve();

        gameScreen.classList.add('screen-shake');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                gameScreen.classList.remove('screen-shake');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 전체 화면 블랙아웃 (암전)
     *
     * @param {number} [duration=1000] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showBlackout(duration = 1000) {
        const blackout = document.createElement('div');
        blackout.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000;
            z-index: 60;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        document.body.appendChild(blackout);

        // 페이드 인
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                blackout.style.opacity = '1';
            });
        });

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                // 페이드 아웃
                blackout.style.opacity = '0';
                setTimeout(() => {
                    blackout.remove();
                    resolve();
                }, 200);
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    // =========================================================================
    // 텍스트 효과
    // =========================================================================

    /**
     * 유령 텍스트 — 대화창 밖에서 떠오르는 반투명 텍스트
     *
     * @param {string} text - 표시할 텍스트
     * @param {number} [x=50] - X 위치 (%, 화면 기준)
     * @param {number} [y=30] - Y 위치 (%, 화면 기준)
     * @param {number} [duration=2000] - 표시 시간 (ms)
     */
    showGhostText(text, x = 50, y = 30, duration = 2000) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-text';
        ghost.textContent = text;
        ghost.style.left = `${x}%`;
        ghost.style.top = `${y}%`;

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.appendChild(ghost);
        } else {
            document.body.appendChild(ghost);
        }

        this.ghostTextQueue.push({ text, el: ghost });

        const timer = setTimeout(() => {
            ghost.remove();
            this.ghostTextQueue = this.ghostTextQueue.filter(g => g.el !== ghost);
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 텍스트 요소에 글리치 플래시 적용
     *
     * @param {HTMLElement} element - 대상 요소
     * @param {number} [duration=200] - 효과 지속 시간 (ms)
     */
    showGlitchText(element, duration = 200) {
        if (!element) return;

        element.classList.add('glitch-text');

        const timer = setTimeout(() => {
            element.classList.remove('glitch-text');
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 텍스트에 Zalgo(결합 문자) 삽입하여 깨진 텍스트 생성
     *
     * @param {string} text - 원본 텍스트
     * @param {number} [intensity=0.1] - 오염 강도 (0~1)
     * @returns {string} Zalgo 처리된 텍스트
     */
    corruptText(text, intensity = 0.1) {
        /** @type {string[]} 결합 발음 구별 기호 (위) */
        const zalgoUp = [
            '\u0300', '\u0301', '\u0302', '\u0303', '\u0304',
            '\u0305', '\u0306', '\u0307', '\u0308', '\u030A',
            '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'
        ];
        /** @type {string[]} 결합 발음 구별 기호 (아래) */
        const zalgoDown = [
            '\u0316', '\u0317', '\u0318', '\u0319', '\u031A',
            '\u031B', '\u031C', '\u031D', '\u031E', '\u031F'
        ];
        /** @type {string[]} 대체 기호 */
        const glitchChars = ['#', '$', '@', '?', '!', '&', '%', '̷', '̸', '̶'];

        const chars = [...text];

        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < intensity && chars[i] !== ' ') {
                // Zalgo 추가 또는 문자 대체
                if (Math.random() < 0.5) {
                    // Zalgo 결합 문자 추가
                    const numZalgo = Math.floor(Math.random() * 3) + 1;
                    for (let j = 0; j < numZalgo; j++) {
                        const pool = Math.random() < 0.5 ? zalgoUp : zalgoDown;
                        chars[i] += pool[Math.floor(Math.random() * pool.length)];
                    }
                } else {
                    // 문자 대체
                    chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
            }
        }

        return chars.join('');
    }

    // =========================================================================
    // 스탯 효과
    // =========================================================================

    /**
     * 스탯 라벨 깜빡임 — "호감도"가 순간적으로 "위험도"로 보이는 연출
     *
     * @param {HTMLElement} statEl - 스탯 라벨 요소
     * @param {string} revealText - 깜빡일 때 표시할 텍스트 (예: "위험도")
     * @param {number} [duration=150] - 깜빡임 지속 시간 (ms)
     */
    flickerStat(statEl, revealText, duration = 150) {
        if (!statEl) return;

        const original = statEl.textContent;

        statEl.textContent = revealText;
        statEl.classList.add('glitch-text');

        const timer = setTimeout(() => {
            statEl.textContent = original;
            statEl.classList.remove('glitch-text');
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 위험도 스탯 영구 공개 — 호감도 UI를 신뢰도/위험도로 전환
     * Day 3 밤 장르 전환 시 사용
     */
    async revealDangerStats() {
        if (this._dangerStatsRevealed) return;
        this._dangerStatsRevealed = true;

        // 모든 스탯 라벨 요소 찾기
        const statLabels = document.querySelectorAll('.stat-label, [data-stat-label]');

        for (const label of statLabels) {
            const thrillLabel = label.dataset.thrillerlabel;
            if (!thrillLabel) continue;

            // 글리치 텍스트 애니메이션으로 전환
            const original = label.textContent;

            // 단계 1: 텍스트 깨짐 (3회)
            for (let i = 0; i < 3; i++) {
                label.textContent = this.corruptText(original, 0.3 + i * 0.15);
                label.classList.add('glitch-text');
                await this._sleep(100);
            }

            // 단계 2: 노이즈 플래시
            await this.showNoise(150);

            // 단계 3: 새 라벨로 교체
            label.textContent = thrillLabel;
            label.classList.remove('glitch-text');
            label.classList.add('stat-revealed');

            await this._sleep(300);
        }

        // 스탯 값도 업데이트 (danger 수치 표시)
        const statValues = document.querySelectorAll('[data-stat-danger]');
        statValues.forEach(el => {
            const charId = el.dataset.charId;
            if (charId && this.engine?.state) {
                const stats = this.engine.state.getRealStats(charId);
                el.textContent = stats.danger;
                el.classList.add('stat-revealed');
            }
        });
    }

    // =========================================================================
    // 화면 효과
    // =========================================================================

    /**
     * 레드 비네트 오버레이 추가 (Day 4+)
     * 화면 가장자리에 붉은 비네트 효과
     */
    showRedVignette() {
        if (this._redVignette) return;

        const bgOverlay = document.getElementById('bg-overlay');
        if (bgOverlay) {
            bgOverlay.classList.add('vignette-red');
            this._redVignette = bgOverlay;
        }
    }

    /**
     * 레드 비네트 제거
     */
    hideRedVignette() {
        if (this._redVignette) {
            this._redVignette.classList.remove('vignette-red');
            this._redVignette = null;
        }
    }

    /**
     * 약물 블러 블랙아웃 효과
     * 리인 음료 마신 후 발생하는 시야 흐림
     *
     * @param {number} [duration=500] - 효과 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showDrugBlur(duration = 500) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('drug-blur');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('drug-blur');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    // =========================================================================
    // BGM 조작
    // =========================================================================

    /**
     * BGM 재생 속도를 점진적으로 감속
     *
     * @param {HTMLAudioElement} audioEl - 오디오 요소
     * @param {number} [factor=0.7] - 최종 속도 비율 (1.0 = 정상)
     * @param {number} [duration=3000] - 감속에 걸리는 시간 (ms)
     */
    slowdownBGM(audioEl, factor = 0.7, duration = 3000) {
        if (!audioEl) return;

        const startRate = audioEl.playbackRate;
        const delta = startRate - factor;
        const startTime = Date.now();

        const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);

            // easeOutQuad로 자연스러운 감속
            const eased = 1 - (1 - progress) * (1 - progress);
            audioEl.playbackRate = startRate - (delta * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    /**
     * BGM 즉시 정지 — 갑작스러운 정적 연출
     *
     * @param {HTMLAudioElement} audioEl - 오디오 요소
     */
    stopBGM(audioEl) {
        if (!audioEl) return;

        // 볼륨을 급격히 낮춘 뒤 정지
        const originalVol = audioEl.volume;
        audioEl.volume = 0;

        setTimeout(() => {
            audioEl.pause();
            audioEl.volume = originalVol;
        }, 50);
    }

    // =========================================================================
    // 시나리오 타임라인 트리거
    // =========================================================================

    /**
     * 키 이름으로 사전 정의된 글리치 시퀀스 실행
     *
     * @param {string} key - 트리거 키
     * @returns {Promise<void>}
     *
     * @example
     * glitchAdv.triggerGlitch('day2_night_stat_flicker');
     * glitchAdv.triggerGlitch('day3_night_genre_shift');
     */
    async triggerGlitch(key) {
        switch (key) {

            // ===== Day 2 밤: 스탯 미세 깜빡임 =====
            // "호감도" 라벨이 0.15초간 "위험도"로 깜빡임
            case 'day2_night_stat_flicker': {
                this.setLevel('SUBTLE');

                const statLabels = document.querySelectorAll('.stat-label, [data-stat-label]');
                const randomLabel = statLabels[Math.floor(Math.random() * statLabels.length)];
                if (randomLabel) {
                    this.flickerStat(randomLabel, '위험도', 150);
                }

                // BGM 미세 변조
                const bgm = this.engine?.renderer?.bgmAudio;
                if (bgm) {
                    const origRate = bgm.playbackRate;
                    bgm.playbackRate = 0.97;
                    await this._sleep(2000);
                    bgm.playbackRate = origRate;
                }
                break;
            }

            // ===== Day 3 점심: 스탯 라벨 잠깐 이동 =====
            // "호감도" → 글리치 → "???" → 복구
            case 'day3_lunch_stat_shift': {
                this.setLevel('UNSETTLING');

                const labels = document.querySelectorAll('.stat-label, [data-stat-label]');
                for (const label of labels) {
                    const orig = label.textContent;
                    label.textContent = this.corruptText(orig, 0.4);
                    label.classList.add('glitch-text');
                    await this._sleep(200);
                    label.textContent = '???';
                    await this._sleep(300);
                    label.textContent = orig;
                    label.classList.remove('glitch-text');
                }

                await this.showNoise(200);
                break;
            }

            // ===== Day 3 리인 후: 선택지 잔상 깜빡임 =====
            // 게임 화면 모서리에 유령 텍스트 표시
            case 'day3_after_riin_flicker': {
                this.setLevel('UNSETTLING');

                // 유령 텍스트 연속 표시
                this.showGhostText('...도망쳐', 20, 15, 2500);
                await this._sleep(800);
                this.showGhostText('여기서 나가', 75, 25, 2000);
                await this._sleep(1200);
                this.showGhostText('마시지 마', 30, 70, 1800);

                // 노이즈 플래시
                await this._sleep(500);
                await this.showNoise(150);
                break;
            }

            // ===== Day 3 밤: 장르 전환 =====
            // 핵심 연출 — 로맨스 → 스릴러 전면 전환
            case 'day3_night_genre_shift': {
                this.setLevel('BREAKING');

                // 1) BGM 감속
                const bgmEl = this.engine?.renderer?.bgmAudio;
                if (bgmEl) {
                    this.slowdownBGM(bgmEl, 0.5, 2000);
                }

                // 2) 화면 흔들림
                await this.showScreenShake(800);

                // 3) 강한 노이즈
                await this.showHeavyGlitch(1500);

                // 4) 블랙아웃
                await this.showBlackout(1000);

                // 5) BGM 완전 정지
                if (bgmEl) {
                    this.stopBGM(bgmEl);
                }

                // 6) 스탯 폭로
                await this.revealDangerStats();

                // 7) 테마 색상 전환
                if (this.engine?.glitch) {
                    this.engine.glitch.shiftTheme('thriller');
                }

                // 8) 레드 비네트
                this.showRedVignette();

                // 9) 상태 매니저 동기화
                if (this.engine?.state) {
                    this.engine.state.triggerGenreShift();
                }

                // 10) 콘솔 메시지 업데이트
                if (this.engine?.metaHorror) {
                    this.engine.metaHorror.printConsoleMessage(3);
                    this.engine.metaHorror.activate(3);
                }
                break;
            }

            // ===== Day 5: 전면 붕괴 =====
            // 모든 효과 동시 발동
            case 'day5_nightmare_full': {
                this.setLevel('NIGHTMARE');

                // 진동 (모바일)
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.vibrate('paralysis');
                }

                // 동시 다발 효과
                this.showRedVignette();
                this.showGhostText('졸업하지 못한 교실', 50, 20, 4000);
                this.showGhostText('도망칠 수 없어', 30, 50, 3000);
                this.showGhostText('{name}, 돌아와', 70, 40, 3500);

                await this.showHeavyGlitch(2000);

                // 화면 연속 글리치
                for (let i = 0; i < 3; i++) {
                    await this.showNoise(200);
                    await this._sleep(300);
                    await this.showScreenShake(400);
                    await this._sleep(200);
                }

                // BGM 왜곡
                const audio = this.engine?.renderer?.bgmAudio;
                if (audio) {
                    this.slowdownBGM(audio, 0.3, 4000);
                }

                // 블랙아웃 피날레
                await this._sleep(1000);
                await this.showBlackout(2000);

                // 커서 감속 (PC)
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.enableCursorSlowdown();
                }

                // 콘솔 메시지
                if (this.engine?.metaHorror) {
                    this.engine.metaHorror.printConsoleMessage(5);
                }
                break;
            }

            default:
                console.warn(`[GlitchSystemAdvanced] 알 수 없는 트리거 키: ${key}`);
                break;
        }
    }

    // =========================================================================
    // 정리
    // =========================================================================

    /**
     * 모든 활성 효과 제거 및 초기 상태로 복구
     */
    clearAll() {
        // 모든 타이머 정리
        this._activeTimers.forEach(id => clearTimeout(id));
        this._activeTimers = [];

        // 오버레이 정리
        if (this.overlay) {
            this.overlay.className = 'glitch-overlay hidden';
        }

        // 화면 흔들림 제거
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('screen-shake');
        }

        // 유령 텍스트 정리
        this.ghostTextQueue.forEach(g => {
            if (g.el && g.el.parentNode) {
                g.el.remove();
            }
        });
        this.ghostTextQueue = [];

        // 레드 비네트 제거
        this.hideRedVignette();

        // 글리치 텍스트 클래스 정리
        document.querySelectorAll('.glitch-text').forEach(el => {
            el.classList.remove('glitch-text');
        });

        // stat-revealed 클래스는 제거하지 않음 (영구 전환)

        // 레벨 리셋하지 않음 (호출자가 명시적으로 설정)
    }

    // =========================================================================
    // 유틸리티
    // =========================================================================

    /**
     * 지정 시간만큼 대기
     * @param {number} ms - 대기 시간 (ms)
     * @returns {Promise<void>}
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => {
            const timer = setTimeout(resolve, ms);
            this._activeTimers.push(timer);
        });
    }
}

window.GlitchSystemAdvanced = GlitchSystemAdvanced;
