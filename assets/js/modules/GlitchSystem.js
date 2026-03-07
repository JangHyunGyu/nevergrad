/**
 * ============================================================================
 * GlitchSystem.js - 스릴러 연출 시스템
 * ============================================================================
 *
 * 미연시 → 스릴러 장르 전환의 핵심 연출을 담당합니다.
 *
 * [연출 단계]
 * Level 0 (Day 1): 없음 - 완벽한 미연시
 * Level 1 (Day 2 오후): 미세한 위화감 - 선택지 깜빡임, BGM 미세 변조
 * Level 2 (Day 3): 불쾌한 골짜기 - 화면 노이즈, 텍스트 왜곡, 정적
 * Level 3 (Day 4): 장르 전환 - UI 색상 변환, 스탯 이름 변경, 강한 글리치
 * Level 4 (Day 5): 완전 붕괴 - 화면 깨짐, 강제 선택지, 공포 연출
 */

class GlitchSystem {
    constructor() {
        this.overlay = document.getElementById('glitch-overlay');
        this.active = false;
    }

    // ===== Level 1: 미세한 위화감 =====

    /**
     * 선택지가 0.1초간 다른 텍스트로 깜빡이는 연출
     * 예: [고백한다] → 0.1초 → [도망쳐] → [고맙다고 한다]
     */
    flickerChoice(buttonEl, hiddenText, finalText) {
        const original = buttonEl.textContent;
        buttonEl.textContent = hiddenText;
        buttonEl.classList.add('glitch-text');

        setTimeout(() => {
            buttonEl.textContent = finalText || original;
            buttonEl.classList.remove('glitch-text');
        }, 100);
    }

    /**
     * BGM 재생 속도를 미세하게 변조 (0.98~1.02)
     */
    subtleAudioDistort(audioEl, duration = 2000) {
        if (!audioEl) return;
        const original = audioEl.playbackRate;
        audioEl.playbackRate = 0.97;

        setTimeout(() => {
            audioEl.playbackRate = original;
        }, duration);
    }

    // ===== Level 2: 불쾌한 골짜기 =====

    /**
     * BGM이 갑자기 뚝 끊기는 정적 연출
     */
    silenceDrop(audioEl, duration = 3000) {
        if (!audioEl) return;
        const vol = audioEl.volume;
        audioEl.volume = 0;

        return new Promise(resolve => {
            setTimeout(() => {
                audioEl.volume = vol;
                resolve();
            }, duration);
        });
    }

    /**
     * 대사 텍스트 일부가 깨지는 연출
     * "안녕하세요" → "안녕하&#$@요"
     */
    corruptText(text, intensity = 0.1) {
        const glitchChars = ['#', '$', '@', '?', '!', '&', '%', '̷', '̸', '̶'];
        const chars = [...text];

        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < intensity && chars[i] !== ' ') {
                chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
        }
        return chars.join('');
    }

    /**
     * 화면에 짧은 노이즈/스캔라인 효과
     */
    screenNoise(duration = 300) {
        if (!this.overlay) return;
        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('noise');

        return new Promise(resolve => {
            setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('noise');
                resolve();
            }, duration);
        });
    }

    // ===== Level 3: 장르 전환 =====

    /**
     * UI 테마를 점진적으로 전환 (핑크 → 핏빛)
     * CSS custom properties를 transition으로 변경
     */
    shiftTheme(theme) {
        const colors = CONFIG.THEMES[theme];
        if (!colors) return;

        const root = document.documentElement;
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-text', colors.text);
        root.style.setProperty('--color-dialogue-bg', colors.dialogueBg);
        root.style.setProperty('--color-accent', colors.accent);
    }

    /**
     * "호감도" 라벨이 깨지면서 "위험도"로 바뀌는 연출
     */
    async shatterStatLabel(statEl) {
        if (!statEl) return;

        // 1단계: 텍스트가 깨짐
        const original = statEl.textContent;
        for (let i = 0; i < 5; i++) {
            statEl.textContent = this.corruptText(original, 0.3 + i * 0.1);
            await this._sleep(100);
        }

        // 2단계: 화면 깜빡임
        await this.screenNoise(200);

        // 3단계: 새 라벨로 교체
        statEl.textContent = statEl.dataset.thrillerlabel || "위험도";
        statEl.classList.add('stat-revealed');
    }

    /**
     * 캐릭터 이미지가 짧게 "다른 표정"으로 바뀌었다 돌아오는 연출
     * 웃고 있는 세아 → 0.1초간 얀데레 표정 → 다시 웃는 표정
     */
    expressionFlash(charImgEl, flashSrc, duration = 150) {
        if (!charImgEl) return;
        const original = charImgEl.src;
        charImgEl.src = flashSrc;

        setTimeout(() => {
            charImgEl.src = original;
        }, duration);
    }

    // ===== Level 4: 완전 붕괴 =====

    /**
     * 전체 화면 강한 글리치 (흔들림 + 색수차 + 노이즈)
     */
    async heavyGlitch(duration = 1000) {
        if (!this.overlay) return;
        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('heavy-glitch');

        document.getElementById('game-screen')?.classList.add('screen-shake');

        return new Promise(resolve => {
            setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('heavy-glitch');
                document.getElementById('game-screen')?.classList.remove('screen-shake');
                resolve();
            }, duration);
        });
    }

    /**
     * 대화창 밖에서 유령 텍스트가 떠오르는 연출
     */
    ghostText(text, x, y, duration = 2000) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-text';
        ghost.textContent = text;
        ghost.style.left = `${x}%`;
        ghost.style.top = `${y}%`;

        document.getElementById('game-screen')?.appendChild(ghost);

        setTimeout(() => ghost.remove(), duration);
    }

    /**
     * 선택지가 강제로 하나만 남는 연출
     * 다른 선택지들이 하나씩 사라지거나 같은 텍스트로 바뀜
     */
    async forceChoice(buttons, forcedIndex) {
        const forcedText = buttons[forcedIndex]?.textContent;
        if (!forcedText) return;

        for (let i = 0; i < buttons.length; i++) {
            if (i !== forcedIndex) {
                await this._sleep(500);
                buttons[i].textContent = this.corruptText(buttons[i].textContent, 0.5);
                await this._sleep(300);
                buttons[i].textContent = forcedText;
                buttons[i].classList.add('forced-choice');
            }
        }
    }

    // ===== 약물 후유증 =====

    /**
     * 리인의 음료를 마신 뒤 발생하는 시야 흐림 + 짧은 블랙아웃
     * Day 4~5 타이머 선택지 직전에 발동하여 반응 시간을 실질적으로 감소
     */
    drugBlur(duration = 500) {
        if (!this.overlay) return;
        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('drug-blur');

        return new Promise(resolve => {
            setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('drug-blur');
                resolve();
            }, duration);
        });
    }

    // ===== 유틸 =====

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
