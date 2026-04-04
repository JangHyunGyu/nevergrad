/**
 * ============================================================================
 * MetaHorrorSystem.js - 브라우저 레벨 메타 공포 시스템
 * ============================================================================
 *
 * 게임 밖 브라우저 환경을 활용한 공포 연출을 담당합니다.
 * "4번째 벽"을 깨는 연출로, 플레이어가 게임이 자신을 인식하고 있다고 느끼게 합니다.
 *
 * [탭 제목 조작]
 * - Day 3+: 탭을 벗어나면 캐릭터가 인지하는 메시지로 제목 변경
 * - 돌아오면 잠깐 유지 후 원래 제목으로 복구
 *
 * [콘솔 이스터에그]
 * - Day 1~5: 개발자 도구에 설화의 숨겨진 메시지 표시
 * - Day 4+: 내부 프로토콜 문서 유출
 *
 * [푸시 알림]
 * - Day 2 앱 설치 장면에서 권한 요청
 * - 탭을 벗어나면 캐릭터가 푸시 알림 전송
 *
 * [주의사항]
 * - Notification API는 사용자 제스처 내에서만 권한 요청 가능
 * - 푸시 알림은 Service Worker 없이 Notification API만 사용 (게임 내 연출용)
 */

class MetaHorrorSystem {
    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {string} 원본 문서 제목 (복원용) */
        this.originalTitle = document.title;

        /** @type {string[]} 탭 이탈 시 순환 표시할 메시지 목록 */
        this.tabMessages = [
            '어디 가?',
            '...보고 있어.',
            '{name}, 돌아와.',
            '도망칠 수 없어.',
            '나를 두고 가지 마.',
            '왜 자꾸 다른 데 봐?'
        ];

        /** @type {number} 현재 탭 메시지 인덱스 */
        this.tabMessageIndex = 0;

        /** @type {Object.<number, Object[]>} Day별 콘솔 메시지 */
        this.consoleMessages = {
            1: [
                { text: '졸업하지 못한 교실', style: 'color: #ff6b9d; font-size: 20px; font-weight: bold;' },
                { text: '© Project Nevergrad', style: 'color: #666; font-size: 11px;' }
            ],
            2: [
                { text: '졸업하지 못한 교실', style: 'color: #ff6b9d; font-size: 20px; font-weight: bold;' },
                { text: '© Project Nevergrad', style: 'color: #666; font-size: 11px;' },
                { text: '\n...누군가 여기를 보고 있다.', style: 'color: #666; font-size: 11px;' }
            ],
            3: [
                { text: '졸업하지 못한 교실', style: 'color: #d4547a; font-size: 20px; font-weight: bold;' },
                { text: '© Project Nevergrad', style: 'color: #666; font-size: 11px;' },
                { text: '\n...누군가 여기를 보고 있다.', style: 'color: #666; font-size: 11px;' },
                {
                    text: '\n' +
                        '██████████████████████████████████████\n' +
                        '█                                    █\n' +
                        '█   ...도망쳐.                        █\n' +
                        '█   이 학교에서 나가.                   █\n' +
                        '█   5일이야.                          █\n' +
                        '█                                    █\n' +
                        '█               — 이설화              █\n' +
                        '█                                    █\n' +
                        '██████████████████████████████████████',
                    style: 'color: #c8a2c8; font-size: 14px; font-style: italic; text-shadow: 0 0 5px #c8a2c8;'
                }
            ],
            4: [
                { text: '졸업하지 못한 교실', style: 'color: #8B0000; font-size: 20px; font-weight: bold;' },
                { text: '© Project Nevergrad', style: 'color: #666; font-size: 11px;' },
                { text: '\n...누군가 여기를 보고 있다.', style: 'color: #666; font-size: 11px;' },
                {
                    text: '\n' +
                        '██████████████████████████████████████\n' +
                        '█                                    █\n' +
                        '█   ...도망쳐.                        █\n' +
                        '█   이 학교에서 나가.                   █\n' +
                        '█   5일이야.                          █\n' +
                        '█                                    █\n' +
                        '█               — 이설화              █\n' +
                        '█                                    █\n' +
                        '██████████████████████████████████████',
                    style: 'color: #c8a2c8; font-size: 14px; font-style: italic; text-shadow: 0 0 5px #c8a2c8;'
                },
                {
                    text: '\n[경고] 피험자 #13 — 기억 재구성 프로토콜 진행 중',
                    style: 'color: #ff4444; font-size: 12px; font-weight: bold;'
                },
                {
                    text: '처리 예정일: Day 5 23:00',
                    style: 'color: #ff4444; font-size: 12px; font-weight: bold;'
                }
            ],
            5: [
                { text: '졸업하지 못한 교실', style: 'color: #8B0000; font-size: 20px; font-weight: bold;' },
                { text: '© Project Nevergrad', style: 'color: #666; font-size: 11px;' },
                { text: '\n...누군가 여기를 보고 있다.', style: 'color: #666; font-size: 11px;' },
                {
                    text: '\n' +
                        '██████████████████████████████████████\n' +
                        '█                                    █\n' +
                        '█   ...도망쳐.                        █\n' +
                        '█   이 학교에서 나가.                   █\n' +
                        '█   5일이야.                          █\n' +
                        '█                                    █\n' +
                        '█               — 이설화              █\n' +
                        '█                                    █\n' +
                        '██████████████████████████████████████',
                    style: 'color: #c8a2c8; font-size: 14px; font-style: italic; text-shadow: 0 0 5px #c8a2c8;'
                },
                {
                    text: '\n[경고] 피험자 #13 — 기억 재구성 프로토콜 진행 중',
                    style: 'color: #ff4444; font-size: 12px; font-weight: bold;'
                },
                {
                    text: '처리 예정일: Day 5 23:00',
                    style: 'color: #ff4444; font-size: 12px; font-weight: bold;'
                },
                {
                    text: '\n구관 3층. 비상구. ...그 길로 나가.',
                    style: 'color: #c8a2c8; font-size: 14px; font-style: italic; text-shadow: 0 0 5px #c8a2c8;'
                },
                {
                    text: '나를 기억해줘.',
                    style: 'color: #c8a2c8; font-size: 14px; font-style: italic; text-shadow: 0 0 5px #c8a2c8;'
                }
            ]
        };

        /** @type {boolean} 푸시 알림 권한 획득 여부 */
        this.pushPermission = false;

        /** @type {boolean} 메타 공포 시스템 활성 여부 */
        this.active = false;

        /** @type {Function|null} visibilitychange 리스너 참조 (해제용) */
        this._visibilityHandler = null;

        /** @type {number} 현재 활성화된 Day */
        this._currentDay = 0;

        /** @type {number|null} 푸시 알림 인터벌 ID */
        this._pushInterval = null;

        /** @type {number} 현재 푸시 메시지 인덱스 */
        this._pushMsgIndex = 0;

        /** @type {Object[]} 탭 이탈 시 전송할 푸시 메시지 큐 */
        this._pushMessages = [
            { title: '한세아', body: '어디 가? 돌아와.' },
            { title: '한세아', body: '...보고 있어.' },
            { title: '한세아', body: '{name}, 왜 안 돌아와?' },
            { title: '박은수', body: '수업 중인데 어디 갔어요?' },
            { title: '한울 스마트캠퍼스', body: '비정상 이탈 감지. 위치 확인 중...' }
        ];

        /** @type {Function|null} blur 기반 안티캡처 핸들러 */
        this._windowBlurHandler = null;

        /** @type {Function|null} focus 복귀 핸들러 */
        this._windowFocusHandler = null;

        /** @type {HTMLElement|null} 포커스 이탈 차단 오버레이 */
        this._captureBlockOverlay = null;

        /** @type {number} 최근 안티캡처 반응 timestamp */
        this._lastCaptureReactionAt = 0;
    }

    // =========================================================================
    // 탭 제목 조작
    // =========================================================================

    /**
     * 메타 공포 시스템 활성화 — Day 3 이후부터 작동
     *
     * @param {number} day - 현재 Day (3 이상일 때 탭 기믹 활성화)
     */
    activate(day) {
        this._currentDay = day;

        // Day 3 미만이면 탭 기믹 비활성
        if (day < 3) return;

        if (this.active) return;
        this.active = true;
        this.originalTitle = document.title;

        this._visibilityHandler = () => this._onVisibilityChange();
        document.addEventListener('visibilitychange', this._visibilityHandler);
    }

    /**
     * 탭 가시성 변경 이벤트 핸들러
     * 탭을 벗어나면 캐릭터 메시지로 제목 변경, 돌아오면 잠시 후 복구
     * @private
     */
    _onVisibilityChange() {
        if (!this.active) return;

        const playerName = this.engine?.state?.playerName || '';

        if (document.hidden) {
            // 탭 이탈 — 메시지 순환 표시
            const msg = this.tabMessages[this.tabMessageIndex % this.tabMessages.length];
            document.title = msg.replace('{name}', playerName);
            this.tabMessageIndex++;

            // Day 4+: 탭 이탈 시 푸시 알림 전송 시작
            if (this._currentDay >= 4 && this.pushPermission) {
                this._startPushOnHidden();
            }
        } else {
            // 탭 복귀 — 잠깐 유지 후 원래 제목 복구
            this._stopPushOnHidden();

            setTimeout(() => {
                if (!document.hidden) {
                    document.title = this.originalTitle;
                }
            }, 1500);
        }
    }

    // =========================================================================
    // 콘솔 이스터에그
    // =========================================================================

    /**
     * 개발자 도구 콘솔에 Day별 숨겨진 메시지 출력
     * 설화의 경고, 내부 프로토콜 문서 등이 포함
     *
     * @param {number} day - 현재 Day (1~5)
     */
    printConsoleMessage(day) {
        const messages = this.consoleMessages[day];
        if (!messages) return;

        console.clear();

        messages.forEach(msg => {
            console.log(`%c${msg.text}`, msg.style);
        });

        // Day 5 추가 — 인터랙티브 콘솔 트랩
        if (day >= 5) {
            this._setupConsoleTrap();
        }
    }

    /**
     * Day 5+ 콘솔 트랩 — window.__escape 프로퍼티 감시
     * 개발자 도구에서 특정 명령을 입력하면 반응하는 이스터에그
     * @private
     */
    _setupConsoleTrap() {
        const ghostStyle = 'color: #c8a2c8; font-size: 14px; font-style: italic;';

        // __escape 프로퍼티 정의 — 콘솔에서 __escape = true 입력 시 반응
        if (!Object.getOwnPropertyDescriptor(window, '__escape')) {
            let _escVal = false;
            Object.defineProperty(window, '__escape', {
                get() {
                    console.log('%c...나를 찾았구나.', ghostStyle);
                    console.log('%c구관 3층, 비상구 앞에서 기다릴게.', ghostStyle);
                    return _escVal;
                },
                set(v) {
                    _escVal = v;
                    if (v === true) {
                        console.log('%c고마워. ...꼭 나가.', ghostStyle);
                    }
                },
                configurable: true
            });
        }

        // __help 프로퍼티 정의
        if (!Object.getOwnPropertyDescriptor(window, '__help')) {
            Object.defineProperty(window, '__help', {
                get() {
                    console.log('%c=== 이설화의 메모 ===', ghostStyle);
                    console.log('%c피험자 기록은 관리자 폴더에 있어.', ghostStyle);
                    console.log('%c그런데... 정말 보고 싶은 거야?', ghostStyle);
                    console.log('%c이걸 안다고 해서 나갈 수 있는 건 아니야.', ghostStyle);
                    return undefined;
                },
                configurable: true
            });
        }
    }

    // =========================================================================
    // 푸시 알림
    // =========================================================================

    /**
     * 푸시 알림 권한 요청 — Day 2 앱 설치 장면에서 호출
     * 반드시 사용자 클릭 이벤트 핸들러 내에서 호출해야 함
     *
     * @returns {Promise<boolean>} 권한 획득 성공 여부
     */
    async requestPushPermission() {
        if (!('Notification' in window)) {
            this.pushPermission = false;
            return false;
        }

        // 이미 권한 있음
        if (Notification.permission === 'granted') {
            this.pushPermission = true;
            return true;
        }

        // 이미 거부됨
        if (Notification.permission === 'denied') {
            this.pushPermission = false;
            return false;
        }

        // 권한 요청
        try {
            const result = await Notification.requestPermission();
            this.pushPermission = (result === 'granted');
            return this.pushPermission;
        } catch (e) {
            this.pushPermission = false;
            return false;
        }
    }

    /**
     * 푸시 알림 전송 — 탭이 숨겨져 있을 때만 전송
     *
     * @param {string} title - 알림 제목 (캐릭터 이름)
     * @param {string} body - 알림 본문
     */
    sendPushNotification(title, body) {
        if (!this.pushPermission) return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        const playerName = this.engine?.state?.playerName || '';
        const resolvedBody = body.replace('{name}', playerName);

        try {
            const notification = new Notification(title, {
                body: resolvedBody,
                icon: 'assets/images/icon/notification_icon.png',
                tag: 'nevergrad-meta-' + Date.now(),
                requireInteraction: false,
                silent: false
            });

            // 알림 클릭 시 게임 탭으로 포커스
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // 5초 후 자동 닫기
            setTimeout(() => notification.close(), 5000);
        } catch (e) {
            // Notification 생성 실패 시 무시 (Service Worker 필요한 환경 등)
        }
    }

    /**
     * 탭 이탈 시 주기적 푸시 알림 전송 시작
     * @private
     */
    _startPushOnHidden() {
        if (this._pushInterval) return;

        // 즉시 첫 알림
        this._sendNextPush();

        // 15~30초 간격으로 추가 알림
        this._pushInterval = setInterval(() => {
            this._sendNextPush();
        }, 15000 + Math.random() * 15000);
    }

    /**
     * 푸시 알림 전송 중지
     * @private
     */
    _stopPushOnHidden() {
        if (this._pushInterval) {
            clearInterval(this._pushInterval);
            this._pushInterval = null;
        }
    }

    /**
     * 푸시 메시지 큐에서 다음 메시지 전송
     * @private
     */
    _sendNextPush() {
        const msg = this._pushMessages[this._pushMsgIndex % this._pushMessages.length];
        this.sendPushNotification(msg.title, msg.body);
        this._pushMsgIndex++;
    }

    // =========================================================================
    // 스크린샷 감지 (SCENARIO.md 5189-5202)
    // =========================================================================

    /**
     * 스크린샷/포커스 이탈 감지 초기화
     * - keydown: PrintScreen / Win+Shift+S 보조 감지
     * - blur/focus: 캡처 도구 실행, Alt+Tab, 앱 전환 등 핵심 감지
     */
    initScreenshotDetection() {
        if (this._screenshotHandler) return;

        /** @type {string|null} 현재 활성 씬 컨텍스트 */
        this._screenshotScene = null;

        this._screenshotHandler = (e) => {
            // PrintScreen 키 감지
            const isPrintScreen = e.key === 'PrintScreen';
            // Win+Shift+S (Snipping Tool) — Shift+S with Meta
            const isSnipTool = e.key === 's' && e.shiftKey && e.metaKey;

            if (!isPrintScreen && !isSnipTool) return;

            this._onScreenshotDetected();
        };

        document.addEventListener('keydown', this._screenshotHandler);

        this._windowBlurHandler = () => {
            if (!this._screenshotScene || this._screenshotScene === 'complicit_sign') return;
            this._showCaptureBlockOverlay();
        };

        this._windowFocusHandler = () => {
            this._hideCaptureBlockOverlay();
        };

        window.addEventListener('blur', this._windowBlurHandler);
        window.addEventListener('focus', this._windowFocusHandler);
    }

    /**
     * 현재 씬 컨텍스트 업데이트 (스크린샷 반응 판별용)
     * @param {string} sceneContext - 'save_slot' | 'mirror_13faces' | 'day5_docs' | 'complicit_sign' | null
     */
    setScreenshotContext(sceneContext) {
        this._screenshotScene = sceneContext;
    }

    /**
     * 스크린샷 감지 시 반응
     * @private
     */
    _onScreenshotDetected() {
        const ctx = this._screenshotScene;
        if (!ctx) return;
        if (Date.now() - this._lastCaptureReactionAt < 250) return;
        this._lastCaptureReactionAt = Date.now();

        const reactions = {
            save_slot: {
                text: '[\uAE30\uB85D \uC2DC\uB3C4 \uAC10\uC9C0] ...\uB204\uAD6C\uD55C\uD14C \uBCF4\uC5EC\uC904 \uAC70\uC57C?',
                blackout: true,
                blackoutDuration: 500
            },
            mirror_13faces: {
                text: '\uCC0D\uC5B4\uB3C4 \uC18C\uC6A9\uC5C6\uC5B4',
                blackout: true,
                blackoutDuration: 1000
            },
            day5_docs: {
                text: '[\uC678\uBD80 \uBC18\uCD9C \uAE08\uC9C0]',
                blackout: false
            },
            complicit_sign: null // 반응 없음 — 기록을 허용한다
        };

        const reaction = reactions[ctx];
        if (!reaction) return;

        // 팬텀 텍스트 표시
        const phantom = document.createElement('div');
        phantom.className = 'screenshot-phantom';
        phantom.textContent = reaction.text;
        document.body.appendChild(phantom);

        setTimeout(() => phantom.remove(), reaction.blackout ? 500 : 300);

        // 암전 효과
        if (reaction.blackout) {
            const blackout = document.createElement('div');
            blackout.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: #000; z-index: 199; opacity: 0;
                transition: opacity 0.1s ease;
            `;
            document.body.appendChild(blackout);

            requestAnimationFrame(() => {
                blackout.style.opacity = '1';
                setTimeout(() => {
                    blackout.style.opacity = '0';
                    setTimeout(() => blackout.remove(), 200);
                }, reaction.blackoutDuration);
            });
        }
    }

    _showCaptureBlockOverlay() {
        if (this._captureBlockOverlay) return;
        if (Date.now() - this._lastCaptureReactionAt < 250) return;
        this._lastCaptureReactionAt = Date.now();

        const overlay = document.createElement('div');
        overlay.className = 'capture-block-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9998;
            background: rgba(0, 0, 0, 0.97);
            color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            text-align: center;
            letter-spacing: 0.08em;
        `;

        const label = document.createElement('div');
        label.textContent = '[외부 반출 금지]';
        label.style.cssText = `
            font-size: 1.2rem;
            font-weight: 700;
            color: #ff6b6b;
            text-shadow: 0 0 12px rgba(255, 64, 64, 0.35);
        `;

        const sub = document.createElement('div');
        sub.textContent = '포커스 복귀 시 화면이 복원됩니다.';
        sub.style.cssText = `
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.72);
        `;

        overlay.appendChild(label);
        overlay.appendChild(sub);
        document.body.appendChild(overlay);
        this._captureBlockOverlay = overlay;
    }

    _hideCaptureBlockOverlay() {
        if (!this._captureBlockOverlay) return;
        this._captureBlockOverlay.remove();
        this._captureBlockOverlay = null;
    }

    // =========================================================================
    // 게임 종료 후 푸시 알림 스케줄링 (SCENARIO.md 5140-5153)
    // =========================================================================

    /**
     * visibilitychange + setTimeout 기반 지연 알림 스케줄링
     * Service Worker 없이 가능한 범위: 탭이 숨겨진 상태에서 setTimeout 실행
     *
     * @param {number} day - 현재 Day
     * @param {boolean} isNGPlus - 2회차 여부
     * @param {string} lastEnding - 마지막 엔딩 (COMPLICIT 전용 알림용)
     */
    scheduleExitNotification(day, isNGPlus, lastEnding) {
        if (!this.pushPermission) return;
        if (this._exitNotifScheduled) return;

        const NOTIF_KEY = 'nevergrad_last_exit_notif';

        // 이미 동일 Day에서 알림을 보냈으면 스킵 (최대 1회)
        try {
            const last = localStorage.getItem(NOTIF_KEY);
            if (last) {
                const parsed = JSON.parse(last);
                if (parsed.day === day && Date.now() - parsed.time < 86400000) return;
            }
        } catch (e) { /* ignore */ }

        // Day별 타이밍 및 메시지 결정
        let delayMs, title, body;
        if (day <= 3) {
            delayMs = 30 * 60 * 1000; // 30분
            title = '\uC740\uC218 \uC120\uC0DD\uB2D8';
            body = '\uC5B4\uB514 \uAC14\uC5B4\uC694? \uC218\uC5C5 \uC2DC\uAC04\uC774\uC5D0\uC694 :)';
        } else if (day === 4 && !isNGPlus) {
            delayMs = 15 * 60 * 1000; // 15분
            title = '\uD55C\uC138\uC544';
            body = '...\uC65C \uC548 \uC640?';
        } else if (day === 4 && isNGPlus) {
            delayMs = 10 * 60 * 1000; // 10분
            title = '\uD55C\uC6B8 \uC548\uC804 \uC571';
            body = '\uD53C\uD5D8\uC790 #13 \uC774\uD0C8 \uAC10\uC9C0. \uC704\uCE58 \uCD94\uC801 \uC911.';
        } else if (day === 5) {
            delayMs = 24 * 60 * 60 * 1000; // 24시간
            title = '\uD55C\uC6B8 \uC548\uC804 \uC571';
            body = '\uC81C13\uCC28 \uC8FC\uAE30 \uC2DC\uAC04 \uCD08\uACFC. \uC7AC\uD22C\uC785 \uC900\uBE44.';
        } else {
            return;
        }

        this._exitNotifScheduled = true;

        const scheduleHandler = () => {
            if (!document.hidden) return;

            // 탭이 숨겨지면 타이머 시작
            this._exitNotifTimer = setTimeout(() => {
                const playerName = this.engine?.state?.playerName || '';
                this.sendPushNotification(title, body.replace('{name}', playerName));

                // 기록 저장
                try {
                    localStorage.setItem(NOTIF_KEY, JSON.stringify({ day, time: Date.now() }));
                } catch (e) { /* ignore */ }

                // 리스너 제거
                document.removeEventListener('visibilitychange', scheduleHandler);
                this._exitNotifScheduled = false;
            }, delayMs);

            // 탭으로 돌아오면 취소
            const cancelOnReturn = () => {
                if (!document.hidden && this._exitNotifTimer) {
                    clearTimeout(this._exitNotifTimer);
                    this._exitNotifTimer = null;
                }
            };
            document.addEventListener('visibilitychange', cancelOnReturn, { once: true });
        };

        document.addEventListener('visibilitychange', scheduleHandler);

        // 정리 함수 저장
        this._exitNotifCleanup = () => {
            document.removeEventListener('visibilitychange', scheduleHandler);
            if (this._exitNotifTimer) {
                clearTimeout(this._exitNotifTimer);
                this._exitNotifTimer = null;
            }
            this._exitNotifScheduled = false;
        };
    }

    // =========================================================================
    // 비활성화 / 정리
    // =========================================================================

    /**
     * 메타 공포 시스템 비활성화 — 제목 복구, 모니터링 중지
     * 엔딩 도달 시 또는 타이틀 복귀 시 호출
     */
    deactivate() {
        this.active = false;
        document.title = this.originalTitle;

        if (this._visibilityHandler) {
            document.removeEventListener('visibilitychange', this._visibilityHandler);
            this._visibilityHandler = null;
        }

        this._hideCaptureBlockOverlay();
        this._stopPushOnHidden();
        this.tabMessageIndex = 0;
    }

    /**
     * 전체 정리 — 모든 리소스 해제
     * 게임 종료 시 호출
     */
    destroy() {
        this.deactivate();

        // 스크린샷 감지 정리
        if (this._screenshotHandler) {
            document.removeEventListener('keydown', this._screenshotHandler);
            this._screenshotHandler = null;
        }
        if (this._windowBlurHandler) {
            window.removeEventListener('blur', this._windowBlurHandler);
            this._windowBlurHandler = null;
        }
        if (this._windowFocusHandler) {
            window.removeEventListener('focus', this._windowFocusHandler);
            this._windowFocusHandler = null;
        }
        this._screenshotScene = null;
        this._hideCaptureBlockOverlay();

        // 푸시 알림 스케줄링 정리
        if (this._exitNotifCleanup) {
            this._exitNotifCleanup();
            this._exitNotifCleanup = null;
        }

        // 콘솔 트랩 프로퍼티 정리
        try {
            if (Object.getOwnPropertyDescriptor(window, '__escape')) {
                delete window.__escape;
            }
            if (Object.getOwnPropertyDescriptor(window, '__help')) {
                delete window.__help;
            }
        } catch (e) {
            // 정리 실패 무시
        }

        this._pushMsgIndex = 0;
        this.pushPermission = false;
    }
}

window.MetaHorrorSystem = MetaHorrorSystem;
