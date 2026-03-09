/**
 * ============================================================================
 * ChoiceSystemAdvanced.js - 고급 선택지 시스템
 * ============================================================================
 *
 * 기본 ChoiceSystem.js를 확장하여 타이머, 강제, 도지, 깜빡임 등
 * 공포 연출에 필요한 모든 선택지 유형을 구현합니다.
 *
 * [선택지 유형]
 * 1. 일반 선택 (showChoice) — 표준 선택지
 * 2. 타이머 선택 (showTimedChoice) — Day 4~5 시간 제한, 약물 패널티 적용
 * 3. 강제 선택 (showForcedChoice) — Day 4 세아: 두 선택지가 같은 텍스트로 변형
 * 4. 도지 선택 (showDodgeChoice) — Day 5 열린 감옥: 버튼이 도망침
 * 5. 깜빡임 선택 (showFlickerChoice) — Day 3 리인: 선택지가 순간적으로 다른 텍스트
 *
 * [약물 디버프]
 * - drank_riin_drink 플래그 + danger >= 40 시:
 *   - 선택지 물결 애니메이션 (choice-wave)
 *   - 선택지 텍스트 위장 (choice-disguise)
 *   - 타이머 -2초 감산
 */

class ChoiceSystemAdvanced {
    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {HTMLElement|null} 선택지 컨테이너 */
        this.choiceContainer = document.getElementById('choice-panel');

        /** @type {HTMLElement|null} 타이머 바 요소 */
        this.timerBar = null;

        /** @type {Function|null} 현재 선택 대기 Promise의 resolve */
        this.currentResolve = null;

        /** @type {number|null} 타이머 인터벌 ID */
        this._timerInterval = null;

        /** @type {boolean} 선택 완료 여부 */
        this._selected = false;
    }

    // =========================================================================
    // 일반 선택지
    // =========================================================================

    /**
     * 표준 선택지 표시 — 선택 인덱스를 Promise로 반환
     *
     * @param {string[]} choices - 선택지 텍스트 배열
     * @returns {Promise<number>} 선택된 인덱스
     */
    async showChoice(choices) {
        this._cleanup();

        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this._selected = false;

            if (!this.choiceContainer) return;

            this.choiceContainer.innerHTML = '';
            this.choiceContainer.classList.remove('hidden');

            choices.forEach((text, index) => {
                const btn = this._createChoiceButton(text, index);
                this.choiceContainer.appendChild(btn);
            });
        });
    }

    // =========================================================================
    // 타이머 선택지 (Day 4~5)
    // =========================================================================

    /**
     * 시간 제한 선택지 — 타이머 바 표시, 제한 시간 초과 시 자동 선택
     * 약물 패널티(drank_riin_drink) 적용: timeMs -= 2000 (최소 2000ms)
     *
     * @param {string[]} choices - 선택지 텍스트 배열
     * @param {number} timeMs - 제한 시간 (ms)
     * @param {number} timeoutIndex - 시간 초과 시 자동 선택될 인덱스 (-1: 타임아웃 이벤트)
     * @returns {Promise<number>} 선택된 인덱스 (-1은 타임아웃)
     */
    async showTimedChoice(choices, timeMs, timeoutIndex = -1) {
        this._cleanup();

        // 약물 패널티: 리인 음료를 마셨으면 타이머 감산
        const state = this.engine?.state;
        if (state && state.hasFlag('drank_riin_drink') && state.currentDay >= 4) {
            timeMs = Math.max(2000, timeMs - 2000);
        }

        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this._selected = false;

            if (!this.choiceContainer) return;

            this.choiceContainer.innerHTML = '';
            this.choiceContainer.classList.remove('hidden');

            // 타이머 바 생성
            this.timerBar = this._createTimerBar(timeMs);
            this.choiceContainer.appendChild(this.timerBar);

            // 선택지 버튼 생성
            const buttons = [];
            choices.forEach((text, index) => {
                const btn = this._createChoiceButton(text, index);
                buttons.push(btn);
                this.choiceContainer.appendChild(btn);
            });

            // 약물 디버프 효과 적용
            if (state && state.hasFlag('drank_riin_drink')) {
                this._applyDrugEffects(buttons);
            }

            // 타이머 시작
            const startTime = Date.now();
            const barFill = this.timerBar.querySelector('.timer-bar-fill');

            this._timerInterval = setInterval(() => {
                if (this._selected) {
                    clearInterval(this._timerInterval);
                    this._timerInterval = null;
                    return;
                }

                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, timeMs - elapsed);
                const progress = remaining / timeMs;

                // 타이머 바 업데이트
                if (barFill) {
                    barFill.style.width = `${progress * 100}%`;

                    // 잔여 시간에 따라 색상 변경
                    if (progress < 0.2) {
                        barFill.style.background = '#ff0000';
                        barFill.style.animation = 'timer-critical 0.3s ease infinite';
                    } else if (progress < 0.5) {
                        barFill.style.background = '#ff6600';
                    }
                }

                // 모바일 타이머 틱 진동 (1초 간격)
                if (this.engine?.deviceGimmick && elapsed > 0 && elapsed % 1000 < 100) {
                    this.engine.deviceGimmick.vibrate('timer_tick');
                }

                // 타임아웃
                if (remaining <= 0) {
                    clearInterval(this._timerInterval);
                    this._timerInterval = null;

                    if (!this._selected) {
                        this._selected = true;
                        this._cleanup();
                        resolve(timeoutIndex);
                    }
                }
            }, 50);
        });
    }

    // =========================================================================
    // 강제 선택지 (Day 4 세아)
    // =========================================================================

    /**
     * 강제 선택지 — 두 번째 선택지가 서서히 첫 번째와 같은 텍스트로 변형
     * 어떤 것을 골라도 같은 결과가 됨을 시각적으로 보여주는 연출
     *
     * @param {string[]} choices - 선택지 텍스트 배열 (2개)
     * @param {string} forcedText - 모든 선택지가 변형될 최종 텍스트
     * @returns {Promise<number>} 선택된 인덱스 (어떤 것이든 같은 결과)
     */
    async showForcedChoice(choices, forcedText) {
        this._cleanup();

        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this._selected = false;

            if (!this.choiceContainer) return;

            this.choiceContainer.innerHTML = '';
            this.choiceContainer.classList.remove('hidden');

            const buttons = [];
            choices.forEach((text, index) => {
                const btn = this._createChoiceButton(text, index);
                buttons.push(btn);
                this.choiceContainer.appendChild(btn);
            });

            // 1.5초 후부터 나머지 선택지를 forcedText로 변형 시작
            setTimeout(() => {
                this._morphChoices(buttons, forcedText, 0);
            }, 1500);
        });
    }

    /**
     * 선택지 텍스트 변형 애니메이션
     * 글리치 효과를 거쳐 강제 텍스트로 변환
     *
     * @param {HTMLElement[]} buttons - 버튼 요소 배열
     * @param {string} forcedText - 변형될 텍스트
     * @param {number} currentIndex - 현재 변형 대상 인덱스
     * @private
     */
    _morphChoices(buttons, forcedText, currentIndex) {
        if (this._selected) return;
        if (currentIndex >= buttons.length) return;

        const btn = buttons[currentIndex];
        if (!btn) return;

        // 이미 forcedText인 버튼은 건너뜀
        if (btn.textContent === forcedText) {
            this._morphChoices(buttons, forcedText, currentIndex + 1);
            return;
        }

        const originalText = btn.textContent;
        const glitchChars = ['#', '$', '@', '?', '!', '&', '%', '̷', '̸'];

        // 단계 1: 텍스트 깨짐 (300ms × 3회)
        let glitchStep = 0;
        const glitchInterval = setInterval(() => {
            if (this._selected) {
                clearInterval(glitchInterval);
                return;
            }

            const chars = [...originalText];
            const intensity = 0.2 + glitchStep * 0.15;

            for (let i = 0; i < chars.length; i++) {
                if (Math.random() < intensity && chars[i] !== ' ') {
                    chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
            }

            btn.textContent = chars.join('');
            btn.classList.add('glitch-text');
            glitchStep++;

            if (glitchStep >= 3) {
                clearInterval(glitchInterval);

                // 단계 2: forcedText로 변환
                setTimeout(() => {
                    if (this._selected) return;
                    btn.textContent = forcedText;
                    btn.classList.remove('glitch-text');
                    btn.classList.add('forced-choice');

                    // 다음 버튼 변형 시작
                    setTimeout(() => {
                        this._morphChoices(buttons, forcedText, currentIndex + 1);
                    }, 500);
                }, 200);
            }
        }, 300);
    }

    // =========================================================================
    // 도지 선택지 (Day 5 열린 감옥)
    // =========================================================================

    /**
     * 도지 선택지 — 특정 버튼이 커서/탭에서 도망치는 연출
     * PC: mouseover로 CSS transform 이동
     * 모바일: touchstart로 랜덤 위치 이동
     * maxAttempts 초과 시 도지 버튼 사라지고 나머지만 선택 가능
     *
     * @param {string[]} choices - 선택지 텍스트 배열
     * @param {Object} dodgeConfig - 도지 설정
     * @param {number} dodgeConfig.dodgeIndex - 도지할 버튼 인덱스
     * @param {number} [dodgeConfig.maxAttempts=5] - 최대 도지 횟수
     * @returns {Promise<number>} 선택된 인덱스
     */
    async showDodgeChoice(choices, dodgeConfig) {
        this._cleanup();

        const { dodgeIndex = 0, maxAttempts = 5 } = dodgeConfig;

        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this._selected = false;

            if (!this.choiceContainer) return;

            this.choiceContainer.innerHTML = '';
            this.choiceContainer.classList.remove('hidden');

            // 컨테이너를 relative로 설정 (도지 버튼 absolute 위치용)
            this.choiceContainer.style.position = 'relative';
            this.choiceContainer.style.minHeight = '120px';

            const buttons = [];
            choices.forEach((text, index) => {
                const btn = this._createChoiceButton(text, index);
                buttons.push(btn);
                this.choiceContainer.appendChild(btn);
            });

            // 도지 버튼 설정
            const dodgeBtn = buttons[dodgeIndex];
            if (dodgeBtn && this.engine?.deviceGimmick) {
                this.engine.deviceGimmick.setupDodgeButton(
                    dodgeBtn,
                    maxAttempts,
                    () => {
                        // 최대 시도 초과 — 도지 버튼 사라짐
                        // 나머지 버튼만 남음
                    }
                );
            }
        });
    }

    // =========================================================================
    // 깜빡임 선택지 (Day 3 리인)
    // =========================================================================

    /**
     * 깜빡임 선택지 — 특정 선택지가 순간적으로 다른 텍스트로 깜빡이는 연출
     * 예: [고맙다고 한다] → 0.1초 → [도망쳐] → [고맙다고 한다]
     *
     * @param {string[]} choices - 선택지 텍스트 배열
     * @param {number} flickerIndex - 깜빡일 선택지 인덱스
     * @param {string} flickerText - 깜빡일 때 표시할 텍스트
     * @param {number} [flickerDuration=100] - 깜빡임 지속 시간 (ms)
     * @returns {Promise<number>} 선택된 인덱스
     */
    async showFlickerChoice(choices, flickerIndex, flickerText, flickerDuration = 100) {
        this._cleanup();

        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this._selected = false;

            if (!this.choiceContainer) return;

            this.choiceContainer.innerHTML = '';
            this.choiceContainer.classList.remove('hidden');

            const buttons = [];
            choices.forEach((text, index) => {
                const btn = this._createChoiceButton(text, index);
                buttons.push(btn);
                this.choiceContainer.appendChild(btn);
            });

            // 1.5초 후 깜빡임 발동
            const targetBtn = buttons[flickerIndex];
            if (targetBtn) {
                setTimeout(() => {
                    if (this._selected) return;

                    const original = targetBtn.textContent;
                    targetBtn.textContent = flickerText;
                    targetBtn.classList.add('glitch-text');

                    setTimeout(() => {
                        if (this._selected) return;
                        targetBtn.textContent = original;
                        targetBtn.classList.remove('glitch-text');
                    }, flickerDuration);
                }, 1500);
            }
        });
    }

    // =========================================================================
    // 과거 선택지 콜백 (Day 5)
    // =========================================================================

    /**
     * 과거 선택에 따라 다른 대사/씬을 반환
     * Day 5에서 이전 선택들을 참조하여 분기
     *
     * @param {Object} callbackConfig - 콜백 설정
     * @param {Object[]} callbackConfig.conditions - 조건 배열
     * @param {string|string[]} callbackConfig.conditions[].flags - 필요한 플래그(들)
     * @param {string} callbackConfig.conditions[].scene - 조건 충족 시 이동할 씬 ID
     * @param {string} callbackConfig.conditions[].dialogue - 조건 충족 시 표시할 대사
     * @param {string} callbackConfig.default - 조건 미충족 시 기본 씬 ID
     * @returns {{ scene: string, dialogue: string|null }}
     */
    getPastChoiceCallback(callbackConfig) {
        const state = this.engine?.state;
        if (!state) return { scene: callbackConfig.default, dialogue: null };

        for (const cond of callbackConfig.conditions) {
            const flags = Array.isArray(cond.flags) ? cond.flags : [cond.flags];
            const allMet = flags.every(flag => state.hasFlag(flag));

            if (allMet) {
                return {
                    scene: cond.scene,
                    dialogue: cond.dialogue || null
                };
            }
        }

        return { scene: callbackConfig.default, dialogue: null };
    }

    // =========================================================================
    // 약물 디버프 효과
    // =========================================================================

    /**
     * 선택지에 약물 디버프 시각 효과 적용
     * - 물결 애니메이션 (choice-wave): drank_riin_drink 플래그 시
     * - 텍스트 위장 (choice-disguise): danger >= 40 시 추가 적용
     *
     * @param {HTMLElement[]} choiceEls - 선택지 버튼 요소 배열
     * @private
     */
    _applyDrugEffects(choiceEls) {
        if (!choiceEls || choiceEls.length === 0) return;

        const state = this.engine?.state;
        if (!state) return;

        // 물결 효과 (기본 약물 디버프)
        choiceEls.forEach((btn, i) => {
            btn.classList.add('choice-wave');
            btn.style.animationDelay = `${i * 0.3}s`;
        });

        // 텍스트 위장 (danger >= 40인 캐릭터가 있을 때)
        const hasDanger40 = Object.values(state.stats).some(s => s.danger >= 40);

        if (hasDanger40 && choiceEls.length >= 2) {
            // 2초 후 랜덤 선택지 텍스트를 다른 선택지 텍스트로 순간 교체
            setTimeout(() => {
                if (this._selected) return;

                const targetIdx = Math.floor(Math.random() * choiceEls.length);
                const otherIdx = (targetIdx + 1) % choiceEls.length;
                const original = choiceEls[targetIdx].textContent;

                choiceEls[targetIdx].textContent = choiceEls[otherIdx].textContent;
                choiceEls[targetIdx].classList.add('choice-disguise');

                // 1초 후 원래 텍스트로 복구
                setTimeout(() => {
                    if (this._selected) return;
                    choiceEls[targetIdx].textContent = original;
                    choiceEls[targetIdx].classList.remove('choice-disguise');
                }, 1000);
            }, 2000);
        }
    }

    // =========================================================================
    // DOM 요소 생성
    // =========================================================================

    /**
     * 선택지 버튼 DOM 요소 생성
     *
     * @param {string} text - 버튼 텍스트
     * @param {number} index - 선택지 인덱스
     * @returns {HTMLElement}
     * @private
     */
    _createChoiceButton(text, index) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = text;
        btn.dataset.index = index;

        // 순차 등장 애니메이션
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // 지연 등장
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 100 + index * 80);

        btn.addEventListener('click', () => {
            if (this._selected) return;
            this._selected = true;

            // 선택 효과
            btn.style.transform = 'scale(0.95)';
            btn.style.opacity = '0.7';

            // 약간의 딜레이 후 resolve
            setTimeout(() => {
                const resolvedIndex = parseInt(btn.dataset.index, 10);
                this._cleanup();
                if (this.currentResolve) {
                    this.currentResolve(resolvedIndex);
                    this.currentResolve = null;
                }
            }, 150);
        });

        return btn;
    }

    /**
     * 타이머 바 DOM 요소 생성
     *
     * @param {number} duration - 전체 시간 (ms)
     * @returns {HTMLElement}
     * @private
     */
    _createTimerBar(duration) {
        const wrapper = document.createElement('div');
        wrapper.className = 'timer-bar-wrapper';
        wrapper.style.cssText = `
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            margin-bottom: 12px;
            overflow: hidden;
        `;

        const fill = document.createElement('div');
        fill.className = 'timer-bar-fill';
        fill.style.cssText = `
            width: 100%;
            height: 100%;
            background: #FFB7C5;
            border-radius: 3px;
            transition: width 0.05s linear;
        `;

        // CSS critical 애니메이션 주입
        if (!document.getElementById('timer-critical-style')) {
            const style = document.createElement('style');
            style.id = 'timer-critical-style';
            style.textContent = `
                @keyframes timer-critical {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }

        wrapper.appendChild(fill);
        return wrapper;
    }

    // =========================================================================
    // 정리
    // =========================================================================

    /**
     * 선택지 UI 정리 — 컨테이너 비우기, 타이머 정지
     * @private
     */
    _cleanup() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }

        if (this.choiceContainer) {
            this.choiceContainer.innerHTML = '';
            this.choiceContainer.classList.add('hidden');
            this.choiceContainer.style.position = '';
            this.choiceContainer.style.minHeight = '';
        }

        this.timerBar = null;
    }
}

window.ChoiceSystemAdvanced = ChoiceSystemAdvanced;
