/**
 * ============================================================================
 * DialogueSystem.js - 대사 타이핑 시스템
 * ============================================================================
 */

class DialogueSystem {
    constructor() {
        this.nameEl = document.getElementById('speaker-name');
        this.textEl = document.getElementById('dialogue-text');
        this.indicatorEl = document.getElementById('click-indicator');

        this.isTyping = false;
        this._typeTimer = null;
        this._fullText = "";
        this._onComplete = null;
    }

    /**
     * 이름 + 대사를 타이핑 효과로 출력
     * @param {string} name - 화자 이름
     * @param {string} text - 대사 텍스트
     * @param {Function|null} onComplete - 타이핑 완료 콜백
     * @param {object} [options] - 추가 옵션
     * @param {number} [options.typingSpeed] - 글자당 ms (기본: CONFIG.TYPING_SPEED)
     * @param {boolean} [options.unskippable] - true면 클릭으로 스킵 불가
     */
    type(name, text, onComplete = null, options = {}) {
        if (this.nameEl) this.nameEl.textContent = name;
        if (this.indicatorEl) this.indicatorEl.style.display = 'none';

        this._fullText = text;
        this._onComplete = onComplete;
        this.isTyping = true;
        this._unskippable = !!options.unskippable;

        // 나레이션 처리 (*로 감싸진 텍스트)
        const isNarration = text.startsWith('*') && text.endsWith('*');
        const displayText = isNarration ? text.slice(1, -1) : text;

        if (this.textEl) {
            this.textEl.innerHTML = '';
            if (isNarration) this.textEl.classList.add('narration');
            else this.textEl.classList.remove('narration');
        }

        let idx = 0;
        const speed = options.typingSpeed || CONFIG.TYPING_SPEED;

        this._typeTimer = setInterval(() => {
            if (idx < displayText.length) {
                if (this.textEl) {
                    this.textEl.textContent += displayText[idx];
                }
                idx++;
            } else {
                this._finishTyping();
            }
        }, speed);
    }

    skipTyping() {
        if (!this.isTyping) return;
        // unskippable 장면에서는 스킵 차단 (공포 연출용)
        if (this._unskippable) return;

        const isNarration = this._fullText.startsWith('*') && this._fullText.endsWith('*');
        const displayText = isNarration ? this._fullText.slice(1, -1) : this._fullText;

        if (this.textEl) {
            this.textEl.textContent = displayText;
        }
        this._finishTyping();
    }

    _finishTyping() {
        clearInterval(this._typeTimer);
        this.isTyping = false;

        if (this.indicatorEl) {
            this.indicatorEl.style.display = 'block';
        }

        if (this._onComplete) {
            this._onComplete();
            this._onComplete = null;
        }
    }

    /**
     * 메신저 모드 — "..." 타이핑 인디케이터 후 메시지 표시
     * 시나리오에서 messengerDelay 옵션으로 제어
     *
     * @param {string} name - 발신자 이름
     * @param {string} text - 메시지 텍스트
     * @param {Function|null} onComplete - 완료 콜백
     * @param {object} [options] - 추가 옵션
     * @param {number} [options.messengerDelay] - 인디케이터 표시 시간 ms (기본: 1200)
     */
    typeMessenger(name, text, onComplete = null, options = {}) {
        const delay = options.messengerDelay || 1200;

        if (this.nameEl) this.nameEl.textContent = name;
        if (this.indicatorEl) this.indicatorEl.style.display = 'none';

        // 1단계: "..." 타이핑 인디케이터 표시
        if (this.textEl) {
            this.textEl.innerHTML = '';
            this.textEl.classList.remove('narration');
            this.textEl.classList.add('messenger-typing');

            const dots = document.createElement('span');
            dots.className = 'typing-indicator';
            dots.textContent = '···';
            this.textEl.appendChild(dots);
        }

        this.isTyping = true;
        this._unskippable = true; // 인디케이터 중 스킵 차단
        this._fullText = text;
        this._onComplete = onComplete;

        // 2단계: 딜레이 후 실제 메시지 타이핑
        this._messengerTimer = setTimeout(() => {
            if (this.textEl) {
                this.textEl.classList.remove('messenger-typing');
            }
            this._unskippable = false;
            this.type(name, text, onComplete, {
                typingSpeed: options.typingSpeed || CONFIG.TYPING_SPEED
            });
        }, delay);
    }
}
