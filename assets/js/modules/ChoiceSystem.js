/**
 * ==============================================================================
 * ChoiceSystem.js - 선택지 관리
 * ==============================================================================
 *
 * GameEngine에서 직접 처리하는 구조이므로 이 모듈은 확장용.
 * 복잡한 선택지 연출 (타이머, 강제 선택 등)을 여기서 관리.
 */

class ChoiceSystem {
    constructor(engine = null) {
        this.engine = engine;
        this.panel = document.getElementById('choice-panel');
    }

    _fallbackChoiceLabel(index) {
        const lang = document.documentElement.lang || 'ko';
        return String(lang).toLowerCase().startsWith('ko') ? `선택 ${index + 1}` : `Choice ${index + 1}`;
    }

    /**
     * 시간 제한 선택지 (Day 4+)
     * 제한 시간 내에 고르지 않으면 기본 선택지가 자동 선택됨
     */
    showTimedChoices(choices, labels, timeLimit, defaultIndex, onSelect) { var __oc4, __oc5;
        this.hide();
        if (!this.panel) return;

        this.panel.innerHTML = '';
        this.panel.classList.remove('hidden');

        // 타이머 표시
        const timerEl = document.createElement('div');
        timerEl.className = 'choice-timer';
        timerEl.textContent = `${timeLimit}`;
        this.panel.appendChild(timerEl);

        let remaining = timeLimit * 1000;
        let lastTick = Date.now();
        let selected = false;

        const timer = this._timer = setInterval(() => { var __oc0, __oc1;
            const now = Date.now(), delta = now - lastTick;
            lastTick = now;
            if ((((__oc1 = (__oc0 = this.engine) === null || __oc0 === void 0 ? void 0 : __oc0._isGameplayPaused) === null || __oc1 === void 0 ? void 0 : __oc1.call(__oc0)))) return;
            remaining -= delta;
            timerEl.textContent = `${Math.max(0, Math.ceil(remaining / 1000))}`;

            if (remaining <= 0) {
                clearInterval(timer);
                if (!selected) {
                    selected = true;
                    this.panel.classList.add('hidden');
                    onSelect(defaultIndex);
                }
            }
        }, 50);

        choices.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = ((labels === null || labels === void 0 ? void 0 : labels[i])) || this._fallbackChoiceLabel(i);

            // 시차(stagger) 애니메이션
            btn.style.animationDelay = `${i * 80}ms`;

            btn.addEventListener('click', () => { var __oc2, __oc3;
                if (selected) return;
                selected = true;
                clearInterval(timer);
                const finish = () => {
                    this.panel.classList.add('hidden');
                    onSelect(i);
                };
                if ((((__oc3 = (__oc2 = window.NevergradMotion) === null || __oc2 === void 0 ? void 0 : __oc2.choiceSelect) === null || __oc3 === void 0 ? void 0 : __oc3.call(__oc2, btn, this.panel, finish)))) {
                    return;
                }
                finish();
            });

            this.panel.appendChild(btn);
        });

        // Timed choices: enable clicks early (5s Day5 timers). Do not wait ~1.5s.
        this.panel.classList.add('timed-choice');
        const motionButtons = Array.from(this.panel.querySelectorAll('.choice-btn'));
        if ((((__oc5 = (__oc4 = window.NevergradMotion) === null || __oc4 === void 0 ? void 0 : __oc4.choicesIn) === null || __oc5 === void 0 ? void 0 : __oc5.call(__oc4, this.panel, motionButtons)))) {
            motionButtons.forEach((b, i) => {
                setTimeout(() => b.classList.add('choice-ready'), 100 + i * 80);
            });
            return;
        }

        const buttons = this.panel.querySelectorAll('.choice-btn');
        buttons.forEach((b, i) => {
            setTimeout(() => b.classList.add('choice-ready'), 100 + i * 80);
        });
    }

    hide() {
        clearInterval(this._timer);
        this._timer = null;
        if (this.panel) {
            this.panel.classList.add('hidden');
            this.panel.classList.remove('timed-choice');
            this.panel.innerHTML = '';
        }
    }
}
