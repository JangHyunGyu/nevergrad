/**
 * ============================================================================
 * ChoiceSystem.js - 선택지 관리
 * ============================================================================
 * GameEngine에서 직접 처리하는 구조이므로 이 모듈은 확장용.
 * 복잡한 선택지 연출 (타이머, 강제 선택 등)을 여기서 관리.
 */

class ChoiceSystem {
    constructor() {
        this.panel = document.getElementById('choice-panel');
    }

    /**
     * 시간 제한 선택지 (Day 4+)
     * 제한 시간 내에 고르지 않으면 기본 선택지가 자동 선택됨
     */
    showTimedChoices(choices, labels, timeLimit, defaultIndex, onSelect) {
        if (!this.panel) return;

        this.panel.innerHTML = '';
        this.panel.classList.remove('hidden');

        // 타이머 표시
        const timerEl = document.createElement('div');
        timerEl.className = 'choice-timer';
        timerEl.textContent = `${timeLimit}`;
        this.panel.appendChild(timerEl);

        let remaining = timeLimit;
        let selected = false;

        const timer = setInterval(() => {
            remaining--;
            timerEl.textContent = `${remaining}`;

            if (remaining <= 0) {
                clearInterval(timer);
                if (!selected) {
                    selected = true;
                    this.panel.classList.add('hidden');
                    onSelect(defaultIndex);
                }
            }
        }, 1000);

        choices.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = labels?.[i] || `선택 ${i + 1}`;

            // 시차(stagger) 애니메이션
            btn.style.animationDelay = `${i * 80}ms`;

            btn.addEventListener('click', () => {
                if (selected) return;
                selected = true;
                clearInterval(timer);
                this.panel.classList.add('hidden');
                onSelect(i);
            });

            this.panel.appendChild(btn);
        });

        // 렌파이 스타일 연타 방지: 마지막 버튼 애니메이션 완료 후 클릭 활성화
        const totalDelay = (choices.length - 1) * 80 + 1500;
        setTimeout(() => {
            const buttons = this.panel.querySelectorAll('.choice-btn');
            if (buttons) {
                buttons.forEach(b => b.classList.add('choice-ready'));
            }
        }, totalDelay);
    }

    hide() {
        if (this.panel) {
            this.panel.classList.add('hidden');
            this.panel.innerHTML = '';
        }
    }
}
