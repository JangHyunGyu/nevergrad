/**
 * ============================================================================
 * DeviceGimmickSystem.js - 디바이스별 공포 기믹 시스템
 * ============================================================================
 *
 * PC와 모바일 환경에 따라 다른 공포 연출을 제공합니다.
 *
 * [PC 전용]
 * - 마우스 호버 추적: 선택지 위에서 망설인 시간을 캐릭터가 인지
 * - 도지 버튼: 커서에서 도망치는 버튼 (Day 5 열린 감옥)
 * - 커서 감속: CSS cursor:wait + 움직임 지연 (Day 5)
 *
 * [모바일 전용]
 * - 진동 패턴: 공포 장면별 맞춤 진동
 * - 빈 영역 터치 감지: NPC가 "왜 자꾸 쓸데없는 데 터치해?"라고 반응
 * - 롱프레스: 탈출 버튼 장시간 누르기 (Day 5)
 * - 가짜 긴급 알림: iOS/Android 스타일 fake alert
 * - 화면 균열 효과: 화면이 깨지는 CSS + 진동
 *
 * [공통]
 * - 배터리 잔량 참조 대사: "배터리 N%밖에 안 남았네..."
 * - 실시간 시간 참조 대사: "이 시간에 아직 깨어있어?"
 */

class DeviceGimmickSystem {
    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {boolean} 모바일 디바이스 여부 */
        this.isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        /** @type {boolean} 진동 API 지원 여부 */
        this.vibrationSupported = 'vibrate' in navigator;

        /** @type {boolean} Battery API 지원 여부 */
        this.batterySupported = 'getBattery' in navigator;

        /** @type {number|null} 현재 배터리 잔량 (0~100) */
        this.batteryLevel = null;

        /** @type {{startTime: number, choiceIndex: number, duration: number}} 호버 추적 데이터 */
        this.hoverTracker = { startTime: 0, choiceIndex: -1, duration: 0 };

        /** @type {number} 빈 영역 터치 횟수 */
        this.emptyTouchCount = 0;

        /** @type {Function[]} 정리할 이벤트 리스너 목록 */
        this._cleanupFns = [];

        /** @type {HTMLElement|null} 커서 감속용 오버레이 */
        this._slowdownOverlay = null;

        /** @type {boolean} 커서 감속 활성 여부 */
        this._cursorSlowdownActive = false;

        /** @type {number|null} 롱프레스 타이머 ID */
        this._longPressTimer = null;
    }

    // =========================================================================
    // 진동 패턴 사전
    // =========================================================================

    /** @type {Object.<string, number[]>} 상황별 진동 패턴 (ms 단위) */
    static get VIBRATION_PATTERNS() {
        return {
            /** 메시지 수신 진동 */
            message_buzz: [100, 50, 100, 50, 300],
            /** 메시지 폭주 (Day 4+ 세아 메시지 연타) */
            message_frenzy: [50, 30, 50, 30, 50, 30, 50, 30],
            /** 스탯 균열 (호감도→위험도 전환 시) */
            stat_crack: [50],
            /** 주사 바늘 접촉 (리인 보건실 장면) */
            needle_touch: [1500],
            /** 타이머 틱 (시간 제한 선택지) */
            timer_tick: [100],
            /** 지하 진동 (구관 지하 탐색) */
            underground: [200, 100, 50, 100, 200],
            /** 심장 박동 (공포 절정) */
            heartbeat: [100, 100, 300, 500],
            /** 마비 (약물 효과 발동) */
            paralysis: Array(20).fill(0).flatMap(() => [100, 50]),
            /** 충격 (갑작스러운 이벤트) */
            impact: [300],
            /** 최종 주사 (Day 5 클라이맥스) */
            final_needle: [2000],
            /** 탈출 안도 (진동 정지 = 해방감) */
            escape_relief: [],
            /** 문 저항 (멀티터치 도어 열기 시 에스컬레이션 진동) */
            door_resistance: [100, 50, 200, 50, 400, 50, 800, 50, 1200],
            /** 그립 변화 감지 (디바이스 잡는 방식 변경 시) */
            grip_change: [200, 100, 200]
        };
    }

    // =========================================================================
    // 초기화
    // =========================================================================

    /**
     * 시스템 초기화 — 배터리 모니터링 시작, 디바이스별 트래킹 설정
     * @returns {Promise<void>}
     */
    async init() {
        // 배터리 잔량 모니터링
        if (this.batterySupported) {
            try {
                const battery = await navigator.getBattery();
                this.batteryLevel = Math.round(battery.level * 100);
                const onLevelChange = () => {
                    this.batteryLevel = Math.round(battery.level * 100);
                };
                battery.addEventListener('levelchange', onLevelChange);
                this._cleanupFns.push(() => {
                    battery.removeEventListener('levelchange', onLevelChange);
                });
            } catch (e) {
                // Battery API 미지원 환경 무시
            }
        }

        // 디바이스별 입력 트래킹 초기화
        if (this.isMobile) {
            this._initTouchTracking();
        } else {
            this._initMouseTracking();
        }
    }

    // =========================================================================
    // 진동
    // =========================================================================

    /**
     * 진동 패턴 실행 (모바일 전용)
     * @param {string|number[]} pattern - 패턴 이름(VIBRATION_PATTERNS 키) 또는 직접 배열
     * @returns {boolean} 진동 실행 성공 여부
     */
    vibrate(pattern) {
        if (!this.isMobile || !this.vibrationSupported) return false;

        const resolvedPattern = typeof pattern === 'string'
            ? DeviceGimmickSystem.VIBRATION_PATTERNS[pattern]
            : pattern;

        if (!resolvedPattern) return false;

        // escape_relief: 빈 배열 → 진동 정지
        if (resolvedPattern.length === 0) {
            navigator.vibrate(0);
            return true;
        }

        return navigator.vibrate(resolvedPattern);
    }

    // =========================================================================
    // PC: 마우스 호버 추적
    // =========================================================================

    /**
     * 선택지 버튼 위에서의 마우스 호버 시간을 추적
     * "N초 망설였잖아" 대사 생성에 사용
     * @private
     */
    _initMouseTracking() {
        const onMouseOver = (e) => {
            const btn = e.target.closest('.choice-btn');
            if (!btn) return;

            const panel = btn.closest('#choice-panel');
            if (!panel) return;

            const buttons = Array.from(panel.querySelectorAll('.choice-btn'));
            const index = buttons.indexOf(btn);

            this.hoverTracker.startTime = Date.now();
            this.hoverTracker.choiceIndex = index;
        };

        const onMouseOut = (e) => {
            const btn = e.target.closest('.choice-btn');
            if (!btn) return;

            if (this.hoverTracker.startTime > 0) {
                const elapsed = Date.now() - this.hoverTracker.startTime;
                // 가장 오래 머문 시간을 기록
                if (elapsed > this.hoverTracker.duration) {
                    this.hoverTracker.duration = elapsed;
                }
            }
            this.hoverTracker.startTime = 0;
        };

        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);

        this._cleanupFns.push(() => {
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
        });
    }

    /**
     * 호버 추적 보고서 반환 — 캐릭터 반응 대사 생성용
     * @returns {{ choiceIndex: number, durationSec: number, message: string }}
     */
    getHoverReport() {
        // 아직 호버 중이면 현재까지의 시간 계산
        let duration = this.hoverTracker.duration;
        if (this.hoverTracker.startTime > 0) {
            const current = Date.now() - this.hoverTracker.startTime;
            if (current > duration) duration = current;
        }

        const sec = Math.round(duration / 1000);
        let message = '';

        if (sec >= 10) {
            message = `${sec}초나 망설였잖아... 그만큼 고민했다는 거지?`;
        } else if (sec >= 5) {
            message = `${sec}초... 꽤 망설였네.`;
        } else if (sec >= 3) {
            message = `잠깐 망설였지? 다 봤어.`;
        }

        return {
            choiceIndex: this.hoverTracker.choiceIndex,
            durationSec: sec,
            message
        };
    }

    /**
     * 호버 추적 데이터 초기화
     */
    resetHoverTracker() {
        this.hoverTracker = { startTime: 0, choiceIndex: -1, duration: 0 };
    }

    // =========================================================================
    // 모바일: 터치 패턴 분석
    // =========================================================================

    /**
     * 빈 영역 터치를 감지하여 NPC 반응 트리거
     * @private
     */
    _initTouchTracking() {
        const onTouch = (e) => {
            const target = e.target;

            // 인터랙티브 요소가 아닌 빈 영역 터치
            const isInteractive = target.closest(
                'button, .choice-btn, a, input, textarea, #dialogue-box, .modal-btn'
            );

            if (!isInteractive) {
                this.emptyTouchCount++;
            }
        };

        document.addEventListener('touchstart', onTouch, { passive: true });
        this._cleanupFns.push(() => {
            document.removeEventListener('touchstart', onTouch);
        });
    }

    /**
     * 빈 영역 터치 횟수 반환 — NPC 반응 대사 트리거용
     * @returns {number}
     */
    getEmptyTouchCount() {
        return this.emptyTouchCount;
    }

    /**
     * 빈 영역 터치 횟수 초기화
     */
    resetTouchCount() {
        this.emptyTouchCount = 0;
    }

    // =========================================================================
    // 도지 버튼 시스템 (Day 5 열린 감옥)
    // =========================================================================

    /**
     * 커서/탭에서 도망치는 버튼 설정
     * PC: 마우스가 접근하면 CSS transform으로 이동
     * 모바일: 탭하면 랜덤 위치로 이동
     *
     * @param {HTMLElement} buttonEl - 도지할 버튼 요소
     * @param {number} maxAttempts - 최대 도지 횟수 (초과 시 onFail 호출)
     * @param {Function} onFail - 최대 시도 초과 시 콜백 (버튼 비활성화)
     */
    setupDodgeButton(buttonEl, maxAttempts = 5, onFail = null) {
        if (!buttonEl) return;

        let attempts = 0;
        const parent = buttonEl.parentElement;
        if (!parent) return;

        const parentRect = () => parent.getBoundingClientRect();

        /**
         * 버튼을 랜덤 위치로 이동
         * @private
         */
        const dodgeMove = () => {
            attempts++;

            if (attempts >= maxAttempts) {
                // 최대 시도 초과 — 버튼 제거 또는 비활성화
                buttonEl.style.transition = 'opacity 0.3s ease';
                buttonEl.style.opacity = '0';
                setTimeout(() => {
                    buttonEl.style.display = 'none';
                    if (onFail) onFail();
                }, 300);
                return;
            }

            const pr = parentRect();
            const btnW = buttonEl.offsetWidth;
            const btnH = buttonEl.offsetHeight;

            // 부모 영역 내 랜덤 위치 계산
            const maxX = Math.max(0, pr.width - btnW - 20);
            const maxY = Math.max(0, pr.height - btnH - 20);
            const newX = Math.floor(Math.random() * maxX) + 10;
            const newY = Math.floor(Math.random() * maxY) + 10;

            buttonEl.style.position = 'absolute';
            buttonEl.style.transition = 'transform 0.15s ease-out';
            buttonEl.style.transform = `translate(${newX}px, ${newY}px)`;

            // 모바일 진동
            this.vibrate('stat_crack');
        };

        if (this.isMobile) {
            // 모바일: 탭하면 도망
            const onTouchStart = (e) => {
                e.preventDefault();
                dodgeMove();
            };
            buttonEl.addEventListener('touchstart', onTouchStart);
            this._cleanupFns.push(() => {
                buttonEl.removeEventListener('touchstart', onTouchStart);
            });
        } else {
            // PC: 마우스 접근 시 도망
            const onMouseEnter = () => {
                dodgeMove();
            };
            buttonEl.addEventListener('mouseenter', onMouseEnter);
            this._cleanupFns.push(() => {
                buttonEl.removeEventListener('mouseenter', onMouseEnter);
            });
        }
    }

    // =========================================================================
    // 롱프레스 시스템 (모바일 Day 5 탈출)
    // =========================================================================

    /**
     * 버튼 장시간 누르기 설정 — 탈출 장면에서 사용
     * 지정 시간 이상 누르면 성공, 중간에 떼면 실패
     *
     * @param {HTMLElement} buttonEl - 롱프레스 대상 버튼
     * @param {number} duration - 필요한 누름 시간 (ms)
     * @param {Function} onSuccess - 성공 시 콜백
     * @param {Function} onFail - 실패 시 콜백
     */
    setupLongPress(buttonEl, duration = 3000, onSuccess = null, onFail = null) {
        if (!buttonEl) return;

        let pressStartTime = 0;
        let progressEl = null;
        let animFrame = null;

        // 프로그레스 바 생성
        progressEl = document.createElement('div');
        progressEl.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #ff4444, #ff8888);
            width: 0%;
            transition: none;
            border-radius: 0 0 4px 4px;
        `;
        buttonEl.style.position = 'relative';
        buttonEl.style.overflow = 'hidden';
        buttonEl.appendChild(progressEl);

        /**
         * 프로그레스 업데이트
         * @private
         */
        const updateProgress = () => {
            if (pressStartTime === 0) return;

            const elapsed = Date.now() - pressStartTime;
            const progress = Math.min(100, (elapsed / duration) * 100);
            progressEl.style.width = `${progress}%`;

            if (elapsed >= duration) {
                // 성공
                pressStartTime = 0;
                this.vibrate('escape_relief');
                progressEl.style.background = 'linear-gradient(90deg, #44ff44, #88ff88)';
                if (onSuccess) onSuccess();
                return;
            }

            // 심장 박동 진동 (1초 간격)
            if (elapsed > 0 && elapsed % 1000 < 50) {
                this.vibrate('heartbeat');
            }

            animFrame = requestAnimationFrame(updateProgress);
        };

        const onStart = (e) => {
            e.preventDefault();
            pressStartTime = Date.now();
            progressEl.style.width = '0%';
            progressEl.style.background = 'linear-gradient(90deg, #ff4444, #ff8888)';
            animFrame = requestAnimationFrame(updateProgress);
        };

        const onEnd = () => {
            if (pressStartTime === 0) return;

            const elapsed = Date.now() - pressStartTime;
            pressStartTime = 0;

            if (animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }

            // 프로그레스 리셋
            progressEl.style.width = '0%';

            if (elapsed < duration) {
                // 실패 — 중간에 손 뗌
                this.vibrate('impact');
                if (onFail) onFail();
            }
        };

        // 터치 + 마우스 양쪽 지원
        buttonEl.addEventListener('touchstart', onStart, { passive: false });
        buttonEl.addEventListener('touchend', onEnd);
        buttonEl.addEventListener('touchcancel', onEnd);
        buttonEl.addEventListener('mousedown', onStart);
        buttonEl.addEventListener('mouseup', onEnd);
        buttonEl.addEventListener('mouseleave', onEnd);

        this._cleanupFns.push(() => {
            buttonEl.removeEventListener('touchstart', onStart);
            buttonEl.removeEventListener('touchend', onEnd);
            buttonEl.removeEventListener('touchcancel', onEnd);
            buttonEl.removeEventListener('mousedown', onStart);
            buttonEl.removeEventListener('mouseup', onEnd);
            buttonEl.removeEventListener('mouseleave', onEnd);
            if (animFrame) cancelAnimationFrame(animFrame);
            if (progressEl && progressEl.parentNode) {
                progressEl.parentNode.removeChild(progressEl);
            }
        });
    }

    // =========================================================================
    // 배터리 인식 대사
    // =========================================================================

    /**
     * 실제 배터리 잔량을 참조하는 대사 반환
     * Battery API 미지원 시 null 반환
     *
     * @returns {string|null}
     */
    getBatteryDialogue() {
        if (this.batteryLevel === null) return null;

        const level = this.batteryLevel;

        if (level <= 5) {
            return `배터리 ${level}%... 곧 꺼지겠네. 그럼 나도 사라지는 거야?`;
        }
        if (level <= 15) {
            return `배터리 ${level}%밖에 안 남았어. 서둘러야 하지 않을까?`;
        }
        if (level <= 30) {
            return `배터리 ${level}%... 조금 불안하지 않아?`;
        }
        if (level <= 50) {
            return `배터리 ${level}%. 아직 시간은 있어... 아마.`;
        }
        if (level >= 95) {
            return `배터리 ${level}%... 충전해놓고 왔구나. 오래 있을 생각이야?`;
        }
        if (level >= 80) {
            return `배터리 ${level}%. 여유 있네. 천천히 해도 돼.`;
        }

        return `배터리 ${level}%... 알고 있어, 네 폰 상태.`;
    }

    // =========================================================================
    // 시간 인식 대사
    // =========================================================================

    /**
     * 현재 실제 시각을 참조하는 대사 반환
     *
     * @returns {string}
     */
    getTimeDialogue() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const timeStr = `${hour}시 ${minute}분`;

        if (hour >= 0 && hour < 4) {
            return `지금 ${timeStr}이야... 이 시간까지 깨어있는 거야?`;
        }
        if (hour >= 4 && hour < 6) {
            return `새벽 ${timeStr}... 밤새 한 거야? 그렇게까지...`;
        }
        if (hour >= 6 && hour < 9) {
            return `${timeStr}. 아침이네. 수업 시작하기 딱 좋은 시간이야.`;
        }
        if (hour >= 9 && hour < 12) {
            return `${timeStr}... 수업 시간 아니야? 여기 있어도 되는 거야?`;
        }
        if (hour >= 12 && hour < 14) {
            return `${timeStr}. 점심시간이네. 밥은 먹었어?`;
        }
        if (hour >= 14 && hour < 17) {
            return `${timeStr}... 오후네. 방과후까지 얼마 안 남았어.`;
        }
        if (hour >= 17 && hour < 19) {
            return `${timeStr}. 해가 지고 있어... 학교에 남아있을 거야?`;
        }
        if (hour >= 19 && hour < 22) {
            return `${timeStr}... 밤이 되고 있어. 학교가 조용해지는 시간이야.`;
        }

        // 22시~자정
        return `${timeStr}... 늦은 시간이네. 여기 혼자 있는 거 무섭지 않아?`;
    }

    // =========================================================================
    // 가짜 OS 알림 (모바일 전용)
    // =========================================================================

    /**
     * iOS/Android 스타일의 가짜 긴급 알림 표시
     * 게임 내 연출용으로, 실제 시스템 알림이 아님
     *
     * @param {string} message - 알림 본문
     * @param {number} [duration=4000] - 표시 시간 (ms)
     */
    showFakeEmergencyAlert(message, duration = 4000) {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            width: 92%;
            max-width: 400px;
            background: rgba(30, 30, 30, 0.97);
            color: #fff;
            border-radius: 0 0 14px 14px;
            padding: 16px 20px;
            z-index: 200;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        alert.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <div style="
                    width:28px; height:28px; border-radius:6px;
                    background: ${isIOS ? '#ff3b30' : '#f44336'};
                    display:flex; align-items:center; justify-content:center;
                    font-size:16px; font-weight:bold; color:#fff;
                ">!</div>
                <div style="font-weight:600; font-size:0.9rem;">
                    ${isIOS ? '긴급 알림' : '긴급재난문자'}
                </div>
                <div style="margin-left:auto; font-size:0.75rem; color:#888;">지금</div>
            </div>
            <div style="font-size:0.85rem; line-height:1.4; color:#ddd;">
                ${message}
            </div>
        `;

        document.body.appendChild(alert);

        // 슬라이드 인
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                alert.style.transform = 'translateX(-50%) translateY(0)';
            });
        });

        // 진동
        this.vibrate('message_buzz');

        // 자동 닫기
        setTimeout(() => {
            alert.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => alert.remove(), 400);
        }, duration);
    }

    /**
     * 화면 균열 효과 표시 + 진동
     * 화면 위에 균열 이미지/CSS를 오버레이
     *
     * @param {number} [duration=3000] - 균열 표시 시간 (ms)
     */
    showFakeCrackEffect(duration = 3000) {
        const crack = document.createElement('div');
        crack.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 150;
            pointer-events: none;
            animation: crack-appear 0.1s ease-out forwards;
        `;

        // SVG 기반 균열 패턴
        crack.innerHTML = `
            <svg viewBox="0 0 400 800" style="width:100%;height:100%;opacity:0.7;">
                <defs>
                    <filter id="crack-glow">
                        <feGaussianBlur stdDeviation="1" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                <g filter="url(#crack-glow)" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.8">
                    <path d="M200,0 L195,80 L210,160 L180,250 L205,320 L190,400
                             L210,480 L185,560 L200,650 L195,750 L200,800"/>
                    <path d="M195,80 L150,120 L130,110"/>
                    <path d="M210,160 L260,200 L280,195"/>
                    <path d="M180,250 L120,280 L100,270"/>
                    <path d="M205,320 L250,360 L270,350"/>
                    <path d="M190,400 L140,430 L110,420"/>
                    <path d="M210,480 L260,510 L290,505"/>
                    <path d="M185,560 L130,590 L105,580"/>
                </g>
                <g stroke="rgba(255,255,255,0.15)" stroke-width="8" fill="none">
                    <path d="M200,0 L195,80 L210,160 L180,250 L205,320 L190,400
                             L210,480 L185,560 L200,650 L195,750 L200,800"/>
                </g>
            </svg>
        `;

        // 균열 출현 애니메이션 주입
        const style = document.createElement('style');
        style.textContent = `
            @keyframes crack-appear {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0.9; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(crack);

        // 충격 진동
        this.vibrate('impact');

        // 지정 시간 후 제거
        setTimeout(() => {
            crack.style.transition = 'opacity 0.5s ease';
            crack.style.opacity = '0';
            setTimeout(() => {
                crack.remove();
                style.remove();
            }, 500);
        }, duration);
    }

    // =========================================================================
    // 커서 감속 (PC Day 5)
    // =========================================================================

    /**
     * 커서를 느려지게 만드는 효과 활성화
     * CSS cursor:wait + 마우스 이동에 지연 효과 적용
     */
    enableCursorSlowdown() {
        if (this.isMobile || this._cursorSlowdownActive) return;
        this._cursorSlowdownActive = true;

        // CSS cursor 변경
        document.body.style.cursor = 'wait';

        // 마우스 이동 지연 효과 — 반투명 추적 커서 오버레이
        this._slowdownOverlay = document.createElement('div');
        this._slowdownOverlay.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(139, 0, 0, 0.3);
            border: 1px solid rgba(139, 0, 0, 0.5);
            pointer-events: none;
            z-index: 9999;
            transition: left 0.3s ease-out, top 0.3s ease-out;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(this._slowdownOverlay);

        this._cursorSlowdownHandler = (e) => {
            if (this._slowdownOverlay) {
                // transition으로 지연된 위치 추적 → "무겁다" 느낌
                this._slowdownOverlay.style.left = `${e.clientX}px`;
                this._slowdownOverlay.style.top = `${e.clientY}px`;
            }
        };

        document.addEventListener('mousemove', this._cursorSlowdownHandler);
        this._cleanupFns.push(() => {
            this.disableCursorSlowdown();
        });
    }

    /**
     * 커서 감속 효과 비활성화
     */
    disableCursorSlowdown() {
        if (!this._cursorSlowdownActive) return;
        this._cursorSlowdownActive = false;

        document.body.style.cursor = '';

        if (this._cursorSlowdownHandler) {
            document.removeEventListener('mousemove', this._cursorSlowdownHandler);
            this._cursorSlowdownHandler = null;
        }

        if (this._slowdownOverlay) {
            this._slowdownOverlay.remove();
            this._slowdownOverlay = null;
        }
    }

    // =========================================================================
    // 가로 모드 전용 기믹 (모바일)
    // =========================================================================

    /**
     * 가로 모드(landscape) 전환 감지 및 캐릭터 반응 오버레이 표시
     * Day 1~3: 일반적인 "가로로 회전해주세요" 안내
     * Day 4: 은수 클로즈업 + 적색 경고 텍스트
     * Day 5: 세아 클로즈업 + 집착 대사 + 진동
     *
     * @param {number} day - 현재 게임 일차 (1~5)
     */
    setupOrientationHijack(day) {
        if (!this.isMobile) return;

        /** @type {HTMLElement|null} 현재 표시 중인 오버레이 */
        let overlay = null;

        /**
         * 세로 모드(portrait) 여부 판별
         * @returns {boolean}
         * @private
         */
        const isPortrait = () => {
            return screen.orientation?.type?.includes('portrait') ||
                window.innerHeight > window.innerWidth;
        };

        /**
         * 오버레이 생성 및 표시
         * @private
         */
        const showOverlay = () => {
            // 이미 표시 중이면 무시
            if (overlay) return;
            // 세로 모드에서는 오버레이 불필요
            if (isPortrait()) return;

            overlay = document.createElement('div');
            overlay.className = 'orientation-hijack';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 300;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.95);
                color: #fff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            `;

            if (day <= 3) {
                // Day 1~3: 일반 안내
                overlay.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 20px;">📱</div>
                    <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">
                        가로로 회전해주세요
                    </div>
                    <div style="font-size: 0.85rem; color: #888;">
                        이 게임은 세로 모드에 최적화되어 있습니다.
                    </div>
                `;
            } else if (day === 4) {
                // Day 4: 은수 클로즈업 + 적색 경고
                overlay.innerHTML = `
                    <div style="
                        width: 180px; height: 180px; border-radius: 50%;
                        background: radial-gradient(circle, #1a0000 0%, #000 70%);
                        display: flex; align-items: center; justify-content: center;
                        margin-bottom: 24px;
                        box-shadow: 0 0 40px rgba(139, 0, 0, 0.6);
                    ">
                        <div style="font-size: 4rem;">👁️</div>
                    </div>
                    <div style="
                        font-size: 1.3rem; font-weight: 700;
                        color: #ff2222;
                        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                        line-height: 1.6;
                    ">
                        어딜 보는 거야?<br>다시 똑바로 들어.
                    </div>
                `;
            } else {
                // Day 5: 세아 클로즈업 + 집착 대사 + 진동
                overlay.innerHTML = `
                    <div style="
                        width: 180px; height: 180px; border-radius: 50%;
                        background: radial-gradient(circle, #0a0010 0%, #000 70%);
                        display: flex; align-items: center; justify-content: center;
                        margin-bottom: 24px;
                        box-shadow: 0 0 40px rgba(100, 0, 150, 0.6);
                    ">
                        <div style="font-size: 4rem;">🖤</div>
                    </div>
                    <div style="
                        font-size: 1.3rem; font-weight: 700;
                        color: #cc88ff;
                        text-shadow: 0 0 10px rgba(150, 0, 255, 0.5);
                        line-height: 1.6;
                    ">
                        도망치려고?<br>나를 두고?
                    </div>
                `;
                this.vibrate([500]);
            }

            document.body.appendChild(overlay);
        };

        /**
         * 오버레이 제거
         * @private
         */
        const hideOverlay = () => {
            if (!overlay) return;
            overlay.remove();
            overlay = null;
        };

        /**
         * 방향 변경 시 처리
         * @private
         */
        const handleOrientationChange = () => {
            if (isPortrait()) {
                hideOverlay();
            } else {
                showOverlay();
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        // 초기 상태 확인
        handleOrientationChange();

        // 정리 함수 등록
        this._cleanupFns.push(() => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
            hideOverlay();
        });
    }

    /**
     * 두 엄지 동시 터치로 문 열기 기믹
     * 화면 양쪽 끝을 양 엄지로 동시에 누르고 유지하면 프로그레스 바가 차오름
     * 진동 패턴이 점점 강해지며, 중간에 떼면 리셋
     *
     * @param {HTMLElement} containerEl - 터치 영역을 포함하는 컨테이너 요소
     * @param {number} [duration=5000] - 성공까지 필요한 유지 시간 (ms)
     * @param {Function} [onSuccess] - 성공 시 콜백
     * @param {Function} [onFail] - 실패(중간에 손 뗌) 시 콜백
     */
    setupMultiTouchDoor(containerEl, duration = 5000, onSuccess = null, onFail = null) {
        if (!containerEl) return;

        /** @type {number} 화면 너비의 60% — 양 엄지 최소 간격 */
        const minDistance = window.innerWidth * 0.6;

        /** @type {Map<number, Touch>} 활성 터치를 identifier로 추적 */
        const activeTouches = new Map();

        /** @type {number} 양 엄지 동시 터치 시작 시각 */
        let holdStartTime = 0;

        /** @type {number|null} 프로그레스 애니메이션 프레임 ID */
        let animFrame = null;

        /** @type {number|null} 진동 반복 인터벌 ID */
        let vibrationInterval = null;

        // 프로그레스 바 UI 생성
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 400px;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #ff4444, #ff8888, #ffaaaa);
            border-radius: 4px;
            transition: none;
        `;
        progressContainer.appendChild(progressBar);

        containerEl.style.position = containerEl.style.position || 'relative';
        containerEl.appendChild(progressContainer);

        /**
         * 프로그레스 및 진동 업데이트
         * @private
         */
        const updateProgress = () => {
            if (holdStartTime === 0) return;

            const elapsed = Date.now() - holdStartTime;
            const progress = Math.min(100, (elapsed / duration) * 100);
            progressBar.style.width = `${progress}%`;

            if (elapsed >= duration) {
                // 성공
                holdStartTime = 0;
                stopVibrationLoop();
                this.vibrate('escape_relief');
                progressBar.style.background = 'linear-gradient(90deg, #44ff44, #88ff88)';
                if (onSuccess) onSuccess();
                return;
            }

            animFrame = requestAnimationFrame(updateProgress);
        };

        /**
         * 에스컬레이션 진동 루프 시작
         * @private
         */
        const startVibrationLoop = () => {
            // 즉시 첫 진동
            this.vibrate('door_resistance');
            vibrationInterval = setInterval(() => {
                this.vibrate('door_resistance');
            }, 2600); // door_resistance 패턴 총 길이 ≈ 2550ms
        };

        /**
         * 진동 루프 정지
         * @private
         */
        const stopVibrationLoop = () => {
            if (vibrationInterval !== null) {
                clearInterval(vibrationInterval);
                vibrationInterval = null;
            }
            this.vibrate('escape_relief'); // 진동 정지
        };

        /**
         * 프로그레스 리셋
         * @private
         */
        const resetProgress = () => {
            holdStartTime = 0;
            if (animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
            stopVibrationLoop();
            progressBar.style.width = '0%';
            progressBar.style.background = 'linear-gradient(90deg, #ff4444, #ff8888, #ffaaaa)';
            progressContainer.style.opacity = '0';
        };

        /**
         * 두 터치 간 거리 확인 후 홀드 시작/유지 판별
         * @private
         */
        const evaluateTouches = () => {
            if (activeTouches.size < 2) {
                // 엄지가 떨어졌으면 리셋
                if (holdStartTime > 0) {
                    resetProgress();
                    this.vibrate('impact');
                    if (onFail) onFail();
                }
                return;
            }

            // 두 터치 포인트의 X 좌표 간 거리 계산
            const touches = Array.from(activeTouches.values());
            const distance = Math.abs(touches[0].clientX - touches[1].clientX);

            if (distance >= minDistance) {
                // 양 엄지 조건 충족 — 홀드 시작 또는 유지
                if (holdStartTime === 0) {
                    holdStartTime = Date.now();
                    progressContainer.style.opacity = '1';
                    startVibrationLoop();
                    animFrame = requestAnimationFrame(updateProgress);
                }
            } else {
                // 거리 부족 — 리셋
                if (holdStartTime > 0) {
                    resetProgress();
                    this.vibrate('impact');
                    if (onFail) onFail();
                }
            }
        };

        // 터치 이벤트 핸들러
        const onTouchStart = (e) => {
            for (const touch of e.changedTouches) {
                activeTouches.set(touch.identifier, touch);
            }
            evaluateTouches();
        };

        const onTouchMove = (e) => {
            for (const touch of e.changedTouches) {
                if (activeTouches.has(touch.identifier)) {
                    activeTouches.set(touch.identifier, touch);
                }
            }
            evaluateTouches();
        };

        const onTouchEnd = (e) => {
            for (const touch of e.changedTouches) {
                activeTouches.delete(touch.identifier);
            }
            evaluateTouches();
        };

        containerEl.addEventListener('touchstart', onTouchStart, { passive: true });
        containerEl.addEventListener('touchmove', onTouchMove, { passive: true });
        containerEl.addEventListener('touchend', onTouchEnd);
        containerEl.addEventListener('touchcancel', onTouchEnd);

        // 정리 함수 등록
        this._cleanupFns.push(() => {
            containerEl.removeEventListener('touchstart', onTouchStart);
            containerEl.removeEventListener('touchmove', onTouchMove);
            containerEl.removeEventListener('touchend', onTouchEnd);
            containerEl.removeEventListener('touchcancel', onTouchEnd);
            resetProgress();
            if (progressContainer.parentNode) {
                progressContainer.parentNode.removeChild(progressContainer);
            }
        });
    }

    /**
     * 주변 시야 영역에 유령 이미지를 페이드인/페이드아웃으로 표시
     * 가로 모드에서 화면 가장자리에 나타나는 공포 연출용
     *
     * @param {'left'|'right'} side - 표시 위치 (왼쪽 또는 오른쪽 가장자리)
     * @param {number} duration - 전체 애니메이션 시간 (ms), 페이드인 절반 + 페이드아웃 절반
     * @param {number} opacity - 최대 불투명도 (0~1)
     * @param {string} imageUrl - 유령 이미지 URL
     */
    showPeripheralGhost(side, duration, opacity, imageUrl) {
        const ghost = document.createElement('div');

        // 좌/우 위치 결정
        const positionCSS = side === 'left'
            ? 'left: 2%;'
            : 'right: 2%;';

        ghost.style.cssText = `
            position: fixed;
            ${positionCSS}
            top: 30%;
            width: 80px;
            height: 120px;
            background-image: url(${imageUrl});
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0;
            z-index: 250;
            pointer-events: none;
            transition: opacity ${duration / 2}ms ease-in;
        `;

        document.body.appendChild(ghost);

        // 페이드인
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ghost.style.opacity = String(opacity);
            });
        });

        // 페이드아웃 후 제거
        setTimeout(() => {
            ghost.style.transition = `opacity ${duration / 2}ms ease-out`;
            ghost.style.opacity = '0';

            setTimeout(() => {
                ghost.remove();
            }, duration / 2);
        }, duration / 2);
    }

    /**
     * 엄지 적대적 배치 — 선택지 버튼을 엄지 접근성에 따라 의도적으로 배치
     * 쉬운 선택(easyBtn)은 오른쪽 하단(엄지 도달 쉬움)에 크게,
     * 어려운 선택(hardBtn)은 왼쪽 상단(엄지 데드존)에 작게 배치
     * 추가로 디바이스 흔들림(그립 변경)을 감지하여 콜백 트리거
     *
     * @param {HTMLElement} easyBtn - 쉬운(함정) 선택지 버튼
     * @param {HTMLElement} hardBtn - 어려운(올바른) 선택지 버튼
     */
    setupThumbHostilePlacement(easyBtn, hardBtn) {
        if (!easyBtn || !hardBtn) return;

        // easyBtn: 오른쪽 하단 — 엄지 도달 용이 영역
        easyBtn.style.cssText += `
            position: fixed;
            bottom: 15%;
            right: 8%;
            font-size: 1.2rem;
            padding: 16px 32px;
            z-index: 100;
        `;

        // hardBtn: 왼쪽 상단 — 엄지 데드존
        hardBtn.style.cssText += `
            position: fixed;
            top: 8%;
            left: 5%;
            font-size: 0.75rem;
            padding: 6px 12px;
            z-index: 100;
        `;

        // 디바이스 흔들림(그립 변경) 감지
        if (this.isMobile && window.DeviceMotionEvent) {
            /** @type {boolean} 이미 트리거되었는지 여부 (중복 방지) */
            let gripTriggered = false;

            const onDeviceMotion = (e) => {
                if (gripTriggered) return;

                const acc = e.acceleration || e.accelerationIncludingGravity;
                if (!acc) return;

                const magnitude = Math.sqrt(
                    (acc.x || 0) ** 2 +
                    (acc.y || 0) ** 2 +
                    (acc.z || 0) ** 2
                );

                // 가속도 크기 15 이상 = 그립 변경 감지
                if (magnitude > 15) {
                    gripTriggered = true;
                    this.vibrate('grip_change');

                    // 버튼 위치를 일시적으로 교란 — 한층 더 혼란 유발
                    easyBtn.style.transition = 'all 0.3s ease';
                    hardBtn.style.transition = 'all 0.3s ease';
                    easyBtn.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
                    hardBtn.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;

                    // 1초 후 원위치
                    setTimeout(() => {
                        easyBtn.style.transform = '';
                        hardBtn.style.transform = '';
                        // 재감지 허용
                        setTimeout(() => { gripTriggered = false; }, 2000);
                    }, 1000);
                }
            };

            window.addEventListener('devicemotion', onDeviceMotion);
            this._cleanupFns.push(() => {
                window.removeEventListener('devicemotion', onDeviceMotion);
            });
        }
    }

    // =========================================================================
    // 정리
    // =========================================================================

    /**
     * 모든 리스너 및 효과 정리
     */
    destroy() {
        this._cleanupFns.forEach(fn => fn());
        this._cleanupFns = [];

        this.disableCursorSlowdown();

        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }

        this.hoverTracker = { startTime: 0, choiceIndex: -1, duration: 0 };
        this.emptyTouchCount = 0;

        // 진동 정지
        if (this.vibrationSupported) {
            navigator.vibrate(0);
        }
    }
}

window.DeviceGimmickSystem = DeviceGimmickSystem;
