/**
 * ============================================================================
 * FreeTalkSystem.js - AI 인터랙션 시스템
 * ============================================================================
 *
 * 3가지 AI 상호작용 모드를 처리합니다:
 *
 * 1. 자유 입력 가스라이팅 ("변명해 봐")
 *    - 플레이어가 자유 텍스트를 입력하면, NPC AI가 개인화된 가스라이팅으로 반응
 *    - 은수(담임) / 세아(반장) 두 캐릭터 지원
 *
 * 2. AI 페르소나 메신저
 *    - '민수'와의 카톡 대화 (실제로는 학교 감시자가 빼앗은 계정)
 *    - 극도로 건조하고 미묘하게 어긋나는 답변
 *
 * 3. 커스텀 악몽 생성
 *    - 플레이어의 플레이 히스토리 플래그를 기반으로 개인화된 악몽 텍스트 생성
 *    - Day 1~3 행동을 뒤틀어 반영한 5문장 악몽 시퀀스
 *
 * [API 구조]
 * - 엔드포인트: CONFIG.API_ENDPOINT (Cloudflare Worker)
 * - 요청: POST { app_type, prompt, message }
 * - 응답: { reply: "JSON 문자열" }
 * - 네트워크 오류 시 항상 하드코딩된 폴백 응답 사용
 * - API 지연은 타이핑 인디케이터 또는 글리치 효과로 위장
 */

class FreeTalkSystem {
    /**
     * FreeTalkSystem 생성자
     * @param {GameEngine} engine - 메인 게임 엔진 인스턴스
     */
    constructor(engine) {
        /** @type {GameEngine} 메인 게임 엔진 참조 */
        this.engine = engine;

        /** @type {StateManager} 상태 매니저 참조 */
        this.state = engine.state;

        /** @type {string} API 엔드포인트 URL */
        this.endpoint = CONFIG.API_ENDPOINT;

        /** @type {string} API 앱 타입 식별자 */
        this.appType = CONFIG.APP_TYPE;

        /** @type {string|null} 현재 활성 모드 ('interrogation' | 'messenger' | 'nightmare') */
        this.currentMode = null;

        /** @type {string|null} 현재 대화 중인 캐릭터 ID */
        this.currentChar = null;

        /** @type {number} 현재 대화 턴 수 */
        this.turnCount = 0;

        /** @type {number} 최대 허용 턴 수 (모드별로 변경됨) */
        this.maxTurns = 3;

        /** @type {Array<{role: string, content: string}>} 대화 히스토리 */
        this.conversationHistory = [];

        /** @type {boolean} API 응답 대기 중 여부 */
        this.isWaiting = false;

        /** @type {string|null} 현재 씬 컨텍스트 (심문 모드용) */
        this.sceneContext = null;

        /** @type {string|null} 심문 종료 후 이동할 다음 씬 ID */
        this.nextSceneId = null;
    }

    // =========================================================================
    //  모드 1: 자유 입력 가스라이팅 ("변명해 봐")
    // =========================================================================

    /**
     * 심문 모드를 시작합니다.
     * 선택지 버튼 대신 텍스트 입력 UI를 표시하고,
     * 플레이어의 자유 입력에 대해 캐릭터가 가스라이팅으로 반박합니다.
     *
     * @param {string} charId - 심문 캐릭터 ('eunsu' 또는 'sea')
     * @param {string} sceneContext - 현재 씬 상황 설명 문자열
     * @param {string} [nextScene] - 심문 종료 후 이동할 씬 ID
     */
    async startInterrogation(charId, sceneContext, nextScene = null) {
        this.currentMode = 'interrogation';
        this.currentChar = charId;
        this.turnCount = 0;
        // 은수: 2턴(반박→압도), 세아: 1턴(최후의 호소→감정 폭발)
        this.maxTurns = charId === 'eunsu' ? 2 : 1;
        this.conversationHistory = [];
        this.sceneContext = sceneContext;
        this.nextSceneId = nextScene;

        const placeholder = charId === 'eunsu'
            ? '변명해 봐... (자유 입력)'
            : '할 말이 있으면 해 봐... (자유 입력)';

        this._showInputUI(placeholder);
    }

    /**
     * 플레이어의 심문 응답을 AI에게 전송하고 결과를 처리합니다.
     *
     * 처리 흐름:
     * 1. CHARACTER_PROMPTS + AI_PROMPTS.interrogation 기반 시스템 프롬프트 빌드
     * 2. 대화 히스토리 포함 API 호출
     * 3. 응답 파싱 → { text, emotion, danger_delta }
     * 4. danger_delta를 state에 반영
     * 5. 적절한 표정으로 응답 표시
     * 6. maxTurns 도달 시 자동으로 다음 씬 진행
     * 7. 오류 시 FALLBACK_RESPONSES 사용
     *
     * @param {string} userInput - 플레이어가 입력한 텍스트
     */
    async sendInterrogation(userInput) {
        if (this.isWaiting || !this.currentChar) return;
        if (!userInput || !userInput.trim()) return;

        this.isWaiting = true;
        this._hideInputUI();

        // 대화 히스토리에 유저 메시지 추가
        this.conversationHistory.push({ role: 'user', content: userInput.trim() });

        // 시스템 프롬프트 빌드 — 캐릭터 설정 + AI 심문 프롬프트 결합
        const charPrompt = CHARACTER_PROMPTS[this.currentChar];
        const aiPrompt = AI_PROMPTS.interrogation[this.currentChar]
            .replace(/\{name\}/g, this.state.playerName || '학생');

        const systemPrompt = `[캐릭터 설정]\n표면: ${charPrompt.surface}\n이면: ${charPrompt.hidden}\n\n[상황]\n${this.sceneContext}\n\n${aiPrompt}`;

        // 대화 히스토리를 하나의 메시지로 결합
        const historyText = this.conversationHistory
            .map(h => h.role === 'user' ? `학생: ${h.content}` : `응답: ${h.content}`)
            .join('\n');

        // 타이핑 인디케이터 표시 (API 지연 위장)
        const charName = this.currentChar === 'eunsu' ? '박은수' : '한세아';
        this._showTypingIndicator(charName);

        try {
            const raw = await this._callAPI(systemPrompt, historyText);
            this._hideTypingIndicator();

            /** @type {{ text: string, emotion: string, danger_delta: number }} */
            let parsed;
            try {
                parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                throw new Error('JSON 파싱 실패');
            }

            // 응답 유효성 검증
            if (!parsed.text || !parsed.emotion || parsed.danger_delta == null) {
                throw new Error('응답 형식 불일치');
            }

            // 대화 히스토리에 AI 응답 추가
            this.conversationHistory.push({ role: 'assistant', content: parsed.text });

            // danger_delta를 state에 반영
            const delta = Math.max(1, Math.min(
                this.currentChar === 'sea' ? 5 : 3,
                parseInt(parsed.danger_delta) || 1
            ));
            this.state.changeStat(this.currentChar, 'danger', delta);

            // 대사 표시
            this._displayResponse(charName, parsed.text);

        } catch (err) {
            console.warn('[FreeTalkSystem] API 오류, 폴백 사용:', err.message);
            this._hideTypingIndicator();
            this._useFallbackInterrogation();
        }

        this.turnCount++;
        this.isWaiting = false;

        // 최대 턴 도달 확인
        if (this.turnCount >= this.maxTurns) {
            // 잠시 후 자동으로 다음 씬 진행
            setTimeout(() => {
                this.cleanup();
                if (this.nextSceneId && this.engine._loadScene) {
                    this.engine._loadScene(this.nextSceneId);
                }
            }, 2000);
        } else {
            // 다음 입력 대기
            setTimeout(() => {
                const placeholder = this.currentChar === 'eunsu'
                    ? '변명해 봐... (자유 입력)'
                    : '할 말이 있으면 해 봐... (자유 입력)';
                this._showInputUI(placeholder);
            }, 1500);
        }
    }

    /**
     * 심문 모드의 폴백 응답을 적용합니다.
     * 네트워크 오류 시 FALLBACK_RESPONSES에서 턴에 맞는 응답을 선택합니다.
     * @private
     */
    _useFallbackInterrogation() {
        const fallbacks = FALLBACK_RESPONSES.interrogation[this.currentChar];
        const idx = Math.min(this.turnCount, fallbacks.length - 1);
        const fb = fallbacks[idx];

        const text = fb.text.replace(/\{name\}/g, this.state.playerName || '학생');
        const delta = fb.danger_delta || 1;

        this.state.changeStat(this.currentChar, 'danger', delta);

        const charName = this.currentChar === 'eunsu' ? '박은수' : '한세아';
        this._displayResponse(charName, text);
    }

    // =========================================================================
    //  모드 2: AI 페르소나 메신저
    // =========================================================================

    /**
     * 메신저 모드를 시작합니다.
     * 카톡 스타일 UI를 표시하고, '민수'(실제로는 학교 감시자)와 대화합니다.
     * Day 2: 최대 3턴 (확신 직전 읽씹 전환)
     * Day 3: AI 선제 1턴 → startPreemptiveMessenger() 사용
     *
     * @param {string} personaId - 페르소나 ID ('minsu')
     */
    async startMessenger(personaId) {
        this.currentMode = 'messenger';
        this.currentChar = personaId;
        this.turnCount = 0;
        this.maxTurns = 3;
        this.conversationHistory = [];

        this._showInputUI('메시지를 입력하세요...');
    }

    /**
     * 메신저 메시지를 전송하고 AI 응답을 처리합니다.
     *
     * 처리 흐름:
     * 1. AI_PROMPTS.messenger[personaId] 기반 프롬프트 사용
     * 2. API 호출 후 typingDelay(3000~8000ms)만큼 타이핑 인디케이터 표시
     * 3. 의도적으로 짧고 불안한 응답 표시
     * 4. maxTurns 도달 시 "읽음" 뱃지만 표시, 더 이상 응답 없음
     * 5. 오류 시 FALLBACK_RESPONSES.messenger 사용
     *
     * @param {string} userInput - 플레이어가 입력한 메시지
     */
    async sendMessengerMessage(userInput) {
        if (this.isWaiting || !this.currentChar) return;
        if (!userInput || !userInput.trim()) return;

        this.isWaiting = true;
        this._hideInputUI();

        // 대화 히스토리에 유저 메시지 추가
        this.conversationHistory.push({ role: 'user', content: userInput.trim() });

        // maxTurns 도달 — "읽음" 뱃지만 표시
        if (this.turnCount >= this.maxTurns) {
            this._showReadBadge();
            this.isWaiting = false;
            return;
        }

        // 시스템 프롬프트 빌드
        const aiPrompt = AI_PROMPTS.messenger[this.currentChar];

        // 대화 히스토리 결합
        const historyText = this.conversationHistory
            .map(h => h.role === 'user' ? `유저: ${h.content}` : `민수: ${h.content}`)
            .join('\n');

        // 타이핑 인디케이터 표시 (상대방이 입력 중)
        this._showTypingIndicator('민수');

        try {
            const raw = await this._callAPI(aiPrompt, historyText);

            /** @type {{ text: string, typingDelay: number }} */
            let parsed;
            try {
                parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                throw new Error('JSON 파싱 실패');
            }

            if (!parsed.text) {
                throw new Error('응답 형식 불일치');
            }

            // typingDelay: 3000~8000ms 사이로 클램핑
            const typingDelay = Math.max(3000, Math.min(8000, parsed.typingDelay || 5000));

            // 대화 히스토리에 AI 응답 추가
            this.conversationHistory.push({ role: 'assistant', content: parsed.text });

            // 타이핑 딜레이 후 메시지 표시 (실제 사람이 타이핑하는 것처럼)
            await this._delay(typingDelay);
            this._hideTypingIndicator();
            this._displayResponse('민수', parsed.text);

        } catch (err) {
            console.warn('[FreeTalkSystem] 메신저 API 오류, 폴백 사용:', err.message);
            this._useFallbackMessenger();
        }

        this.turnCount++;
        this.isWaiting = false;

        // 다음 입력 대기 (maxTurns 미도달 시)
        if (this.turnCount < this.maxTurns) {
            setTimeout(() => {
                this._showInputUI('메시지를 입력하세요...');
            }, 1000);
        } else {
            // 마지막 턴 — 다음 입력 시 "읽음"만 표시될 것임
            setTimeout(() => {
                this._showInputUI('메시지를 입력하세요...');
            }, 1000);
        }
    }

    /**
     * 메신저 모드의 폴백 응답을 적용합니다.
     * 턴에 맞는 FALLBACK_RESPONSES를 선택하고 typingDelay만큼 대기합니다.
     * @private
     */
    async _useFallbackMessenger() {
        const fallbacks = FALLBACK_RESPONSES.messenger[this.currentChar];
        const idx = Math.min(this.turnCount, fallbacks.length - 1);
        const fb = fallbacks[idx];

        const typingDelay = fb.typingDelay || 5000;

        await this._delay(typingDelay);
        this._hideTypingIndicator();
        this._displayResponse('민수', fb.text);
    }

    /**
     * "읽음" 뱃지를 표시합니다.
     * maxTurns 초과 후 메시지를 보내면 읽음만 뜨고 응답이 없습니다.
     * @private
     */
    _showReadBadge() {
        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.remove('hidden');

        const badge = document.createElement('div');
        badge.className = 'messenger-read-badge';
        badge.textContent = '읽음';
        badge.style.cssText = 'text-align: right; color: #999; font-size: 0.85em; padding: 8px 16px;';
        panel.appendChild(badge);
    }

    // =========================================================================
    //  모드 3: 커스텀 악몽 생성
    // =========================================================================

    /**
     * 플레이어의 행동 히스토리를 기반으로 개인화된 악몽을 생성합니다.
     *
     * 처리 흐름:
     * 1. FLAG_MEMORIES에서 현재 state의 플래그를 필터링하여 요약 생성
     * 2. AI_PROMPTS.nightmare에 플래그 요약을 삽입하여 API 호출
     * 3. 5개의 이탤릭 악몽 문장 배열을 반환
     * 4. 오류 시 FALLBACK_RESPONSES.nightmare 반환
     *
     * @returns {Promise<string[]>} 5개의 악몽 문장 배열
     */
    async generateNightmare() {
        this.currentMode = 'nightmare';

        // 플래그 요약 빌드
        const flagSummary = this._buildFlagSummary();

        // 시스템 프롬프트에 플래그 요약 삽입
        const systemPrompt = AI_PROMPTS.nightmare.replace('{flag_summary}', flagSummary);

        try {
            const raw = await this._callAPI(systemPrompt, '악몽 시퀀스를 생성해주세요.');

            /** @type {{ lines: string[] }} */
            let parsed;
            try {
                parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                throw new Error('JSON 파싱 실패');
            }

            // 유효성 검증: lines 배열이 5개인지 확인
            if (!parsed.lines || !Array.isArray(parsed.lines) || parsed.lines.length !== 5) {
                throw new Error('악몽 문장 수 불일치');
            }

            return parsed.lines;

        } catch (err) {
            console.warn('[FreeTalkSystem] 악몽 생성 API 오류, 폴백 사용:', err.message);
            return FALLBACK_RESPONSES.nightmare.lines;
        }
    }

    // =========================================================================
    //  내부 메서드 — API 통신
    // =========================================================================

    /**
     * Cloudflare Worker API에 POST 요청을 보냅니다.
     *
     * @param {string} systemPrompt - 시스템 프롬프트 (캐릭터 설정 + 규칙)
     * @param {string} userMessage - 유저 메시지 (대화 히스토리 포함)
     * @returns {Promise<object>} 파싱된 API 응답 객체
     * @throws {Error} 네트워크 오류 또는 응답 파싱 실패 시
     * @private
     */
    async _callAPI(systemPrompt, userMessage) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                app_type: this.appType,
                prompt: systemPrompt,
                message: userMessage
            })
        });

        if (!response.ok) {
            throw new Error(`API HTTP 오류: ${response.status}`);
        }

        const data = await response.json();

        if (!data.reply) {
            throw new Error('API 응답에 reply 필드 없음');
        }

        // reply는 JSON 문자열 — 파싱하여 반환
        try {
            return JSON.parse(data.reply);
        } catch {
            // reply가 이미 객체인 경우 그대로 반환
            return data.reply;
        }
    }

    // =========================================================================
    //  내부 메서드 — 플래그 요약 빌드
    // =========================================================================

    /**
     * FLAG_MEMORIES에서 현재 활성화된 플래그만 필터링하여
     * AI에게 전달할 행동 요약 문자열을 생성합니다.
     *
     * @returns {string} 포맷된 플래그 요약 문자열
     * @private
     */
    _buildFlagSummary() {
        const activeMemories = FLAG_MEMORIES.filter(m => this.state.hasFlag(m.flag));

        if (activeMemories.length === 0) {
            return '(기록된 행동 없음)';
        }

        return activeMemories
            .map(m => {
                const charLabel = m.char ? `[${m.char}]` : '[시스템]';
                return `- ${charLabel} ${m.text}`;
            })
            .join('\n');
    }

    // =========================================================================
    //  내부 메서드 — UI 조작
    // =========================================================================

    /**
     * 선택지 패널 영역에 텍스트 입력 필드와 전송 버튼을 표시합니다.
     * 유저가 엔터 또는 전송 버튼을 누르면 현재 모드에 맞는 핸들러를 호출합니다.
     *
     * @param {string} placeholder - 입력 필드의 플레이스홀더 텍스트
     * @private
     */
    _showInputUI(placeholder) {
        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.remove('hidden');

        // 입력 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'freetalk-input-container';
        container.style.cssText = 'display: flex; gap: 8px; padding: 8px;';

        // 텍스트 입력 필드
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'freetalk-input';
        input.placeholder = placeholder;
        input.maxLength = 200;
        input.style.cssText = 'flex: 1; padding: 10px 14px; border: 1px solid #555; border-radius: 6px; background: #1a1a2e; color: #e0e0e0; font-size: 0.95em; outline: none;';

        // 전송 버튼
        const sendBtn = document.createElement('button');
        sendBtn.className = 'freetalk-send-btn';
        sendBtn.textContent = '전송';
        sendBtn.style.cssText = 'padding: 10px 20px; border: none; border-radius: 6px; background: #4a3f6b; color: #e0e0e0; cursor: pointer; font-size: 0.95em; transition: background 0.2s;';

        /**
         * 입력값 전송 핸들러
         * 현재 모드에 따라 적절한 메서드를 호출합니다.
         */
        const handleSend = () => {
            const value = input.value.trim();
            if (!value) return;

            if (this.currentMode === 'interrogation') {
                this.sendInterrogation(value);
            } else if (this.currentMode === 'messenger') {
                this.sendMessengerMessage(value);
            } else if (this.currentMode === 'messenger_preemptive') {
                this.sendPreemptiveReply(value);
            }
        };

        // 엔터키 전송
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });

        // 전송 버튼 클릭
        sendBtn.addEventListener('click', handleSend);

        container.appendChild(input);
        container.appendChild(sendBtn);
        panel.appendChild(container);

        // 자동 포커스
        setTimeout(() => input.focus(), 100);
    }

    /**
     * 텍스트 입력 UI를 제거합니다.
     * @private
     */
    _hideInputUI() {
        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.add('hidden');
    }

    /**
     * "OOO님이 입력 중..." 타이핑 인디케이터를 표시합니다.
     * 애니메이션 점(···)으로 실제 사람이 타이핑하는 느낌을 줍니다.
     *
     * @param {string} name - 타이핑 중인 캐릭터 이름
     * @private
     */
    _showTypingIndicator(name) {
        const textEl = document.getElementById('dialogue-text');
        const nameEl = document.getElementById('speaker-name');

        if (nameEl) nameEl.textContent = name;
        if (textEl) {
            textEl.innerHTML = '';
            textEl.classList.add('messenger-typing');

            const indicator = document.createElement('span');
            indicator.className = 'typing-indicator freetalk-typing';
            indicator.textContent = '···';
            indicator.style.cssText = 'animation: typingDots 1.2s infinite; display: inline-block;';
            textEl.appendChild(indicator);
        }
    }

    /**
     * 타이핑 인디케이터를 제거합니다.
     * @private
     */
    _hideTypingIndicator() {
        const textEl = document.getElementById('dialogue-text');
        if (textEl) {
            textEl.classList.remove('messenger-typing');
            textEl.innerHTML = '';
        }
    }

    /**
     * AI 응답 텍스트를 대화 패널에 표시합니다.
     * DialogueSystem의 type() 메서드를 활용하여 타이핑 효과를 적용합니다.
     *
     * @param {string} name - 화자 이름
     * @param {string} text - 표시할 대사 텍스트
     * @private
     */
    _displayResponse(name, text) {
        if (this.engine.dialogue) {
            this.engine.dialogue.type(name, text, null, {
                typingSpeed: CONFIG.TYPING_SPEED
            });
        } else {
            // DialogueSystem 미연결 시 직접 표시
            const nameEl = document.getElementById('speaker-name');
            const textEl = document.getElementById('dialogue-text');
            if (nameEl) nameEl.textContent = name;
            if (textEl) textEl.textContent = text;
        }
    }

    // =========================================================================
    //  내부 메서드 — 유틸리티
    // =========================================================================

    /**
     * 지정된 시간(ms)만큼 대기합니다.
     * 타이핑 딜레이, 연출 대기 등에 사용됩니다.
     *
     * @param {number} ms - 대기 시간 (밀리초)
     * @returns {Promise<void>}
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // =========================================================================
    //  모드 2-B: AI 선제 메신저 (Day 3 밤)
    // =========================================================================

    /**
     * Day 3 밤: AI(사칭범)가 먼저 의미심장한 메시지를 보내는 모드.
     * 유저가 답장을 시도하면 타이핑 인디케이터(···)만 깜빡이고
     * 실제 응답은 오지 않습니다. (무력감 연출)
     *
     * @param {string} personaId - 페르소나 ID ('minsu')
     * @param {string} preemptiveMessage - AI가 선제로 보내는 메시지
     * @param {string} [nextScene] - 이후 이동할 씬 ID
     */
    async startPreemptiveMessenger(personaId, preemptiveMessage, nextScene = null) {
        this.currentMode = 'messenger_preemptive';
        this.currentChar = personaId;
        this.turnCount = 0;
        this.maxTurns = 0; // 유저 턴 없음
        this.nextSceneId = nextScene;
        this.conversationHistory = [];

        // AI가 먼저 메시지를 보낸다
        this._showTypingIndicator('민수');
        await this._delay(4000);
        this._hideTypingIndicator();
        this._displayResponse('민수', preemptiveMessage);

        // 유저 입력 UI 표시 — 답장 시도 시 타이핑만 깜빡임
        setTimeout(() => {
            this._showInputUI('메시지를 입력하세요...');
        }, 1500);
    }

    /**
     * Day 3 선제 메신저에서 유저가 답장을 시도했을 때:
     * 타이핑 인디케이터만 반복 표시, 실제 응답 없음.
     * 일정 시간 후 자동으로 다음 씬으로 진행.
     *
     * @param {string} userInput - 플레이어가 입력한 메시지
     */
    async sendPreemptiveReply(userInput) {
        if (this.isWaiting || this.currentMode !== 'messenger_preemptive') return;
        if (!userInput || !userInput.trim()) return;

        this.isWaiting = true;
        this._hideInputUI();

        // 타이핑 인디케이터만 깜빡이고 응답은 오지 않음
        this._showTypingIndicator('민수');

        // 8초 후 타이핑 인디케이터 사라지고 "읽음"만 표시
        await this._delay(8000);
        this._hideTypingIndicator();
        this._showReadBadge();

        this.isWaiting = false;

        // 잠시 후 다음 씬 진행
        setTimeout(() => {
            this.cleanup();
            if (this.nextSceneId && this.engine._loadScene) {
                this.engine._loadScene(this.nextSceneId);
            }
        }, 3000);
    }

    /**
     * 시스템의 모든 상태를 초기화합니다.
     * 모드 전환 또는 씬 종료 시 호출됩니다.
     */
    cleanup() {
        this.currentMode = null;
        this.currentChar = null;
        this.turnCount = 0;
        this.maxTurns = 3;
        this.conversationHistory = [];
        this.isWaiting = false;
        this.sceneContext = null;
        this.nextSceneId = null;

        this._hideInputUI();
        this._hideTypingIndicator();
    }
}

// 글로벌 등록 — 다른 모듈에서 접근 가능하도록
window.FreeTalkSystem = FreeTalkSystem;
