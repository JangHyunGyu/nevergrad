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
     */
    type(name, text, onComplete = null) {
        if (this.nameEl) this.nameEl.textContent = name;
        if (this.indicatorEl) this.indicatorEl.style.display = 'none';

        this._fullText = text;
        this._onComplete = onComplete;
        this.isTyping = true;

        // 나레이션 처리 (*로 감싸진 텍스트)
        const isNarration = text.startsWith('*') && text.endsWith('*');
        const displayText = isNarration ? text.slice(1, -1) : text;

        if (this.textEl) {
            this.textEl.innerHTML = '';
            if (isNarration) this.textEl.classList.add('narration');
            else this.textEl.classList.remove('narration');
        }

        let idx = 0;
        const speed = CONFIG.TYPING_SPEED;

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
}
