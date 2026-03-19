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
     * 마크다운 텍스트 서식을 HTML로 변환
     * **bold** → <strong>bold</strong>
     * *italic* → <em>italic</em>
     * 반드시 ** 를 먼저 처리해야 * 와 충돌하지 않음
     */
    _formatText(text) {
        // 1) **bold** → <strong>
        let result = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // 2) *italic* → <em>  (이미 <strong>으로 변환된 부분은 건드리지 않음)
        result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
        return result;
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
        // 이전 타이머 정리 (재진입 방지)
        clearInterval(this._typeTimer);
        clearTimeout(this._messengerTimer);

        if (this.nameEl) this.nameEl.textContent = name;
        if (this.indicatorEl) this.indicatorEl.style.display = 'none';

        this._fullText = text;
        this._onComplete = onComplete;
        this.isTyping = true;
        this._unskippable = !!options.unskippable;

        // 나레이션 처리 (*로 감싸진 텍스트, **bold**와 충돌 방지)
        const isNarration = text.startsWith('*') && !text.startsWith('**') && text.endsWith('*') && !text.endsWith('**');
        const displayText = isNarration ? text.slice(1, -1) : text;

        if (this.textEl) {
            this.textEl.innerHTML = '';
            if (isNarration) {
                this.textEl.classList.add('narration');
                if (this.nameEl) this.nameEl.classList.add('hidden');
            } else {
                this.textEl.classList.remove('narration');
                if (this.nameEl) this.nameEl.classList.remove('hidden');
            }
        }

        // 마크다운 마커(* **)를 제거한 순수 텍스트 + 서식 완성 HTML
        const plainText = displayText.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
        const formattedFull = this._formatText(displayText);

        let idx = 0;
        const speed = options.typingSpeed || CONFIG.TYPING_SPEED;

        this._typeTimer = setInterval(() => {
            if (idx < plainText.length) {
                if (this.textEl) {
                    // 순수 텍스트 idx 글자까지 잘라서 보여줘야 하지만,
                    // 서식을 유지하려면 원본 마크다운 기준으로 자르고 변환해야 함
                    const partialPlain = plainText.slice(0, idx + 1);
                    // 원본 displayText에서 plainText idx+1 글자에 해당하는 위치 찾기
                    const partialSource = this._sliceByPlainLength(displayText, idx + 1);
                    this.textEl.innerHTML = this._formatText(partialSource);
                }
                idx++;
            } else {
                if (this.textEl) {
                    this.textEl.innerHTML = formattedFull;
                }
                this._finishTyping();
            }
        }, speed);
    }

    /**
     * 마크다운 마커(* **)를 무시하고 순수 글자 count개 만큼의 원본 문자열 잘라내기
     * 마커가 잘리지 않도록 경계 보정
     */
    _sliceByPlainLength(source, count) {
        let plain = 0;
        let i = 0;
        while (i < source.length && plain < count) {
            // ** 패턴 감지 (열기/닫기 마커)
            if (source[i] === '*' && i + 1 < source.length && source[i + 1] === '*') {
                // ** 마커 → 통째로 포함
                i += 2;
                continue;
            }
            // * 패턴 감지 (단일 마커)
            if (source[i] === '*') {
                i += 1;
                continue;
            }
            // 일반 글자
            plain++;
            i++;
        }
        // 남은 마커(*  **)가 있으면 포함시켜 태그가 깨지지 않게 함
        while (i < source.length && source[i] === '*') {
            i++;
        }
        return source.slice(0, i);
    }

    skipTyping() {
        if (!this.isTyping) return;
        // unskippable 장면에서는 스킵 차단 (공포 연출용)
        if (this._unskippable) return;

        const isNarration = this._fullText.startsWith('*') && !this._fullText.startsWith('**') && this._fullText.endsWith('*') && !this._fullText.endsWith('**');
        const displayText = isNarration ? this._fullText.slice(1, -1) : this._fullText;

        if (this.textEl) {
            this.textEl.innerHTML = this._formatText(displayText);
            if (isNarration) {
                this.textEl.classList.add('narration');
                if (this.nameEl) this.nameEl.classList.add('hidden');
            }
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
