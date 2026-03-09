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

    // ===== 약물 텍스트 오염 =====

    /**
     * 내레이션 텍스트에 간헐적 Zalgo 노이즈 삽입
     * 핵심 대사(캐릭터 이름이 있는 대사)는 오염하지 않음
     */
    drugTextCorrupt(textEl, intensity = 0.05) {
        if (!textEl) return;
        const original = textEl.textContent;
        const zalgoChars = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304',
                           '\u0305', '\u0306', '\u0307', '\u0308', '\u030A',
                           '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'];

        const chars = [...original];
        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < intensity && chars[i] !== ' ' && chars[i] !== '*') {
                const numZalgo = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < numZalgo; j++) {
                    chars[i] += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
                }
            }
        }

        textEl.textContent = chars.join('');
        textEl.classList.add('drug-text-corrupt');

        // 0.5초 후 원래 텍스트로 복구
        setTimeout(() => {
            textEl.textContent = original;
            textEl.classList.remove('drug-text-corrupt');
        }, 500);
    }

    /**
     * 선택지 버튼에 물결 효과 적용
     */
    choiceWave(buttons) {
        buttons.forEach((btn, i) => {
            btn.classList.add('choice-wave');
            btn.style.animationDelay = `${i * 0.3}s`;
        });
    }

    /**
     * 선택지 위장 — 1초간 다른 선택지 텍스트로 표시 후 복구
     */
    choiceDisguise(buttons) {
        if (buttons.length < 2) return;
        const targetIdx = Math.floor(Math.random() * buttons.length);
        const otherIdx = (targetIdx + 1) % buttons.length;
        const original = buttons[targetIdx].textContent;

        buttons[targetIdx].textContent = buttons[otherIdx].textContent;
        buttons[targetIdx].classList.add('choice-disguise');

        setTimeout(() => {
            buttons[targetIdx].textContent = original;
            buttons[targetIdx].classList.remove('choice-disguise');
        }, 1000);
    }

    // ===== 가짜 권한 모달 =====

    /**
     * 스마트폰 앱 권한 허용 모달을 표시하고 자동으로 '항상 허용' 클릭
     * Day 2 안전 앱 설치 장면에서 사용
     */
    showFakePermissionModal(appName = '학생 안전') {
        const modal = document.createElement('div');
        modal.className = 'fake-permission-modal';
        modal.innerHTML = `
            <div class="modal-title">"${appName}" 앱이 기기의 위치 정보에 접근하도록 허용하시겠습니까?</div>
            <div class="modal-desc">이 앱은 사용하지 않는 동안에도 위치 정보를 사용합니다.</div>
            <div class="modal-buttons">
                <button class="modal-btn allow">항상 허용</button>
                <button class="modal-btn deny">앱 사용 중에만 허용</button>
                <button class="modal-btn deny">허용 안 함</button>
            </div>
        `;

        document.body.appendChild(modal);

        // 1.5초 후 자동으로 '항상 허용' 클릭
        setTimeout(() => {
            const allowBtn = modal.querySelector('.modal-btn.allow');
            if (allowBtn) {
                allowBtn.classList.add('auto-click');
                setTimeout(() => {
                    modal.style.animation = 'modal-appear 0.2s ease reverse forwards';
                    setTimeout(() => modal.remove(), 200);
                }, 400);
            }
        }, 1500);
    }

    // ===== 브라우저 메타 기믹 =====

    /**
     * 브라우저 탭 제목을 게임 진행 상태에 따라 변경
     * Day 3 밤 이후: 탭을 벗어나면 캐릭터가 인지하는 연출
     *
     * 사용법: glitchSystem.initTabGimmick(stateManager)
     * Day 3 밤 장르 전환 트리거 시 호출
     */
    initTabGimmick(state) {
        if (this._tabGimmickActive) return;
        this._tabGimmickActive = true;
        this._originalTitle = document.title;
        this._tabMessages = [
            '어디 가?',
            '...보고 있어.',
            '{name}, 돌아와.',
            '도망칠 수 없어.',
            '나를 두고 가지 마.',
            '왜 자꾸 다른 데 봐?',
        ];
        this._tabMsgIndex = 0;

        document.addEventListener('visibilitychange', this._onVisibilityChange = () => {
            if (!this._tabGimmickActive) return;

            if (document.hidden) {
                // 탭을 떠날 때 — 메시지 순환
                const msg = this._tabMessages[this._tabMsgIndex % this._tabMessages.length];
                const name = state?.playerName || '';
                document.title = msg.replace('{name}', name);
                this._tabMsgIndex++;
            } else {
                // 탭으로 돌아올 때 — 잠깐 유지 후 복구
                setTimeout(() => {
                    document.title = this._originalTitle;
                }, 1500);
            }
        });
    }

    /**
     * 탭 기믹 해제 (엔딩 도달 시)
     */
    stopTabGimmick() {
        this._tabGimmickActive = false;
        document.title = this._originalTitle || '졸업하지 못한 교실';
        if (this._onVisibilityChange) {
            document.removeEventListener('visibilitychange', this._onVisibilityChange);
        }
    }

    /**
     * 콘솔 이스터에그 — 설화의 숨겨진 메시지
     * 게임 시작 시 호출하면 개발자 도구 콘솔에 메시지가 남음
     *
     * Day별로 다른 메시지가 표시되며,
     * Day 3 이후부터 설화의 경고가 나타남
     */
    initConsoleEasterEgg(day) {
        // 기본 스타일
        const ghostStyle = 'color: #c8a2c8; font-size: 14px; font-style: italic; text-shadow: 0 0 5px #c8a2c8;';
        const warnStyle = 'color: #ff4444; font-size: 12px; font-weight: bold;';
        const dimStyle = 'color: #666; font-size: 11px;';

        // 항상 표시되는 기본 메시지
        console.clear();
        console.log('%c졸업하지 못한 교실', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
        console.log('%c© Project Nevergrad', dimStyle);

        if (day >= 2) {
            console.log('%c\n...누군가 여기를 보고 있다.', dimStyle);
        }

        if (day >= 3) {
            console.log('%c\n' +
                '██████████████████████████████████████\n' +
                '█                                    █\n' +
                '█   ...도망쳐.                        █\n' +
                '█   이 학교에서 나가.                   █\n' +
                '█   5일이야.                          █\n' +
                '█                                    █\n' +
                '█               — 이설화              █\n' +
                '█                                    █\n' +
                '██████████████████████████████████████',
                ghostStyle);
        }

        if (day >= 4) {
            console.log('%c\n[경고] 피험자 #13 — 기억 재구성 프로토콜 진행 중', warnStyle);
            console.log('%c처리 예정일: Day 5 23:00', warnStyle);
        }

        if (day >= 5) {
            console.log('%c\n구관 3층. 비상구. ...그 길로 나가.', ghostStyle);
            console.log('%c나를 기억해줘.', ghostStyle);
        }
    }

    // ===== 유틸 =====

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
