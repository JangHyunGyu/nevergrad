/**
 * ============================================================================
 * FreeTalkSystem.js - AI 인터랙션 시스템
 * ============================================================================
 *
 * 4가지 인터랙션 모드를 처리합니다:
 *
 * 1. 자유 입력 가스라이팅 ("변명해 봐") -- 고정 스크립트
 * 2. 페르소나 메신저 -- 고정 스크립트
 * 3. 커스텀 악몽 생성 -- AI 사용
 * 4. AI 자유 대화 (프리토킹) -- AI 사용 (Cupid 패턴)
 *    - 캐릭터별 성격 프롬프트로 자유 대화
 *    - 표정/호감도 실시간 변경
 *    - 메신저 스타일 채팅 UI
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

        /** @type {string|null} 현재 활성 모드 */
        this.currentMode = null;

        /** @type {string|null} 현재 대화 중인 캐릭터 ID */
        this.currentChar = null;

        /** @type {number} 현재 대화 턴 수 */
        this.turnCount = 0;

        /** @type {number} 최대 허용 턴 수 */
        this.maxTurns = 3;

        /** @type {Array<{role: string, content: string}>} 대화 히스토리 */
        this.conversationHistory = [];

        /** @type {boolean} API 응답 대기 중 여부 */
        this.isWaiting = false;

        /** @type {string|null} 현재 씬 컨텍스트 */
        this.sceneContext = null;

        /** @type {string|null} 다음 씬 ID */
        this.nextSceneId = null;

        /** @type {boolean} AI 자유 대화 진행 중 여부 */
        this.isFreeTalking = false;

        /** @type {string|null} 현재 프리토킹 씬 ID */
        this.currentSceneId = null;

        /** @type {number} FreeTalk 세션 내 누적 호감도 변경량 */
        this._sessionAffinityTotal = 0;

        /** @type {number} FreeTalk 1턴당 최대 호감도 변경량 */
        this._maxAffinityPerTurn = 3;

        /** @type {number} FreeTalk 전체(3턴) 최대 누적 호감도 변경량 */
        this._maxAffinityPerSession = 9;

        /** @type {Function|null} visualViewport resize 핸들러 (키보드 회피) */
        this._vvHandler = null;
    }

    _lang() {
        return this.engine?.i18n?.currentLang || 'ko';
    }

    _pickLocalized(map) {
        if (!map || typeof map !== 'object' || Array.isArray(map)) return map || '';
        const lang = this._lang();
        return map[lang] || map.en || map.ko || '';
    }

    _defaultPlayerName() {
        const lang = this._lang();
        return I18nManager.DEFAULT_PLAYER_NAME?.[lang] || I18nManager.DEFAULT_PLAYER_NAME?.en || 'Student';
    }

    _getLegacyCharacterName(charId) {
        const names = {
            ko: { eunsu: "\ubc15\uc740\uc218", sea: "\ud55c\uc138\uc544", minsu: "\ubbfc\uc218" },
            en: { eunsu: "Park Eunsu", sea: "Han Sea", minsu: "Minsu" },
            ja: { eunsu: "\u30d1\u30af\u30fb\u30a6\u30f3\u30b9", sea: "\u30cf\u30f3\u30fb\u30bb\u30a2", minsu: "\u30df\u30f3\u30b9" },
            es: { eunsu: "Park Eunsu", sea: "Han Sea", minsu: "Minsu" },
            fr: { eunsu: "Park Eunsu", sea: "Han Sea", minsu: "Minsu" },
            de: { eunsu: "Park Eunsu", sea: "Han Sea", minsu: "Minsu" },
            'pt-BR': { eunsu: "Park Eunsu", sea: "Han Sea", minsu: "Minsu" }
        };
        const langNames = names[this._lang()] || names.en;
        return langNames[charId] || charId;
    }

    _getLegacyPlaceholder(kind, charId = null) {
        if (kind === 'interrogation') {
            const placeholders = this._pickLocalized({
                ko: {
                    eunsu: "\ubcc0\uba85\ud574 \ubd10... (\uc790\uc720 \uc785\ub825)",
                    sea: "\ud560 \ub9d0\uc774 \uc788\uc73c\uba74 \ud574 \ubd10... (\uc790\uc720 \uc785\ub825)"
                },
                en: {
                    eunsu: "Try explaining yourself... (free input)",
                    sea: "Say something, if you have anything... (free input)"
                },
                ja: {
                    eunsu: "\u8a00\u3044\u8a33\u3057\u3066\u307f\u3066... (\u81ea\u7531\u5165\u529b)",
                    sea: "\u8a00\u3044\u305f\u3044\u3053\u3068\u304c\u3042\u308b\u306a\u3089\u8a00\u3063\u3066... (\u81ea\u7531\u5165\u529b)"
                },
                es: { eunsu: "Intenta explicarte... (entrada libre)", sea: "Di algo, si tienes algo que decir... (entrada libre)" },
                fr: { eunsu: "Essaie de t'expliquer... (saisie libre)", sea: "Dis quelque chose, si tu as quelque chose a dire... (saisie libre)" },
                de: { eunsu: "Erklar dich... (freie Eingabe)", sea: "Sag etwas, wenn du etwas zu sagen hast... (freie Eingabe)" },
                'pt-BR': { eunsu: "Tente se explicar... (entrada livre)", sea: "Diga algo, se tiver algo a dizer... (entrada livre)" }
            });
            return placeholders[charId] || placeholders.sea;
        }

        return this._pickLocalized({
            ko: "\uba54\uc2dc\uc9c0\ub97c \uc785\ub825\ud558\uc138\uc694...",
            en: "Type a message...",
            ja: "\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u5165\u529b...",
            es: "Escribe un mensaje...",
            fr: "Ecrivez un message...",
            de: "Nachricht eingeben...",
            'pt-BR': "Digite uma mensagem..."
        });
    }

    _getLegacyFallback(mode, charId, idx) {
        if (this._lang() === 'ko') return null;
        const fallbacks = {
            interrogation: {
                eunsu: {
                    en: [
                        "This is not the time for excuses, {name}. Be honest with your teacher.",
                        "You know your teacher is disappointed, don't you?"
                    ],
                    ja: [
                        "\u4eca\u306f\u8a00\u3044\u8a33\u3059\u308b\u6642\u9593\u3058\u3083\u306a\u3044\u3067\u3059\u3001{name}\u3055\u3093\u3002\u5148\u751f\u306b\u6b63\u76f4\u306b\u8a71\u3057\u3066\u3002",
                        "\u5148\u751f\u304c\u5931\u671b\u3057\u3066\u3044\u308b\u306e\u306f\u5206\u304b\u3063\u3066\u3044\u307e\u3059\u3088\u306d?"
                    ],
                    es: [
                        "No es momento de excusas, {name}. Se honesto con tu profesora.",
                        "Sabes que la profesora esta decepcionada, verdad?"
                    ],
                    fr: [
                        "Ce n'est pas le moment de chercher des excuses, {name}. Sois honnete avec ta professeure.",
                        "Tu sais que ta professeure est decue, n'est-ce pas ?"
                    ],
                    de: [
                        "Jetzt ist nicht die Zeit fur Ausreden, {name}. Sei ehrlich zu deiner Lehrerin.",
                        "Du weisst, dass deine Lehrerin enttauscht ist, oder?"
                    ],
                    'pt-BR': [
                        "Agora nao e hora de desculpas, {name}. Seja honesto com a professora.",
                        "Voce sabe que a professora esta decepcionada, nao sabe?"
                    ]
                },
                sea: {
                    en: ["{name}, you can't be without me. You know that too."],
                    ja: ["{name}\u3001\u79c1\u304c\u3044\u306a\u3044\u3068\u30c0\u30e1\u3067\u3057\u3087\u3002\u3042\u306a\u305f\u3082\u5206\u304b\u3063\u3066\u308b\u3088\u306d\u3002"],
                    es: ["{name}, no puedes estar sin mi. Tu tambien lo sabes."],
                    fr: ["{name}, tu ne peux pas etre sans moi. Tu le sais aussi."],
                    de: ["{name}, ohne mich geht es nicht. Das weisst du doch."],
                    'pt-BR': ["{name}, voce nao consegue ficar sem mim. Voce tambem sabe disso."]
                }
            },
            messenger: {
                minsu: {
                    en: [
                        "Yeah, I'm doing fine. How is it there?",
                        "I see.",
                        "Looks like school life is going well."
                    ],
                    ja: [
                        "\u3046\u3093\u3001\u5143\u6c17\u3002\u305d\u3063\u3061\u306f\u3069\u3046?",
                        "\u305d\u3046\u306a\u3093\u3060\u3002",
                        "\u5b66\u6821\u751f\u6d3b\u3001\u3046\u307e\u304f\u3044\u3063\u3066\u308b\u307f\u305f\u3044\u3060\u306d\u3002"
                    ],
                    es: [
                        "Si, estoy bien. Como va todo alla?",
                        "Ya veo.",
                        "Parece que te va bien en la escuela."
                    ],
                    fr: [
                        "Oui, ca va. Comment c'est la-bas ?",
                        "Je vois.",
                        "On dirait que la vie scolaire se passe bien."
                    ],
                    de: [
                        "Ja, mir geht's gut. Wie ist es dort?",
                        "Verstehe.",
                        "Scheint, als laufe das Schulleben gut."
                    ],
                    'pt-BR': [
                        "Sim, estou bem. Como estao as coisas ai?",
                        "Entendi.",
                        "Parece que a vida escolar esta indo bem."
                    ]
                }
            }
        };

        const list = fallbacks[mode]?.[charId]?.[this._lang()] || fallbacks[mode]?.[charId]?.en;
        return list?.[Math.min(idx, list.length - 1)] || null;
    }

    _getNightmareFallbackLines() {
        if (this._lang() === 'ko') return FALLBACK_RESPONSES.nightmare.lines;
        return this._pickLocalized({
            en: [
                "*...I am walking down a hallway, but it never ends.*",
                "*Every classroom door opens into the same classroom, again and again.*",
                "*My name is written on the blackboard hundreds of times. Thousands.*",
                "*The clock has stopped. No... the second hand is moving backward.*",
                "*'...Run.' Seolhwa's voice comes from everywhere, but there is no exit.*"
            ],
            ja: [
                "*...\u5eca\u4e0b\u3092\u6b69\u3044\u3066\u3044\u308b\u3002\u3067\u3082\u5eca\u4e0b\u304c\u7d42\u308f\u3089\u306a\u3044\u3002*",
                "*\u6559\u5ba4\u306e\u30c9\u30a2\u3092\u958b\u3051\u308b\u3068\u3001\u307e\u305f\u540c\u3058\u6559\u5ba4\u306b\u51fa\u308b\u3002\u4f55\u5ea6\u958b\u3051\u3066\u3082\u3002*",
                "*\u9ed2\u677f\u306b\u79c1\u306e\u540d\u524d\u304c\u4f55\u5ea6\u3082\u66f8\u304b\u308c\u3066\u3044\u308b\u3002\u6570\u767e\u56de\u3002\u6570\u5343\u56de\u3002*",
                "*\u6642\u8a08\u304c\u6b62\u307e\u3063\u3066\u3044\u308b\u3002\u3044\u3084...\u79d2\u91dd\u304c\u9006\u306b\u56de\u3063\u3066\u3044\u308b\u3002*",
                "*'...\u9003\u3052\u3066\u3002'\u30bd\u30eb\u30d5\u30a1\u306e\u58f0\u304c\u56db\u65b9\u304b\u3089\u805e\u3053\u3048\u308b\u3002\u3067\u3082\u51fa\u53e3\u306f\u306a\u3044\u3002*"
            ],
            es: [
                "*...Camino por un pasillo, pero nunca termina.*",
                "*Cada puerta del aula se abre al mismo aula, una y otra vez.*",
                "*Mi nombre esta escrito en la pizarra cientos de veces. Miles.*",
                "*El reloj se ha detenido. No... el segundero va hacia atras.*",
                "*'...Corre.' La voz de Seolhwa viene de todas partes, pero no hay salida.*"
            ],
            fr: [
                "*...Je marche dans un couloir, mais il ne finit jamais.*",
                "*Chaque porte de classe s'ouvre sur la meme classe, encore et encore.*",
                "*Mon nom est ecrit au tableau des centaines de fois. Des milliers.*",
                "*L'horloge s'est arretee. Non... la trotteuse tourne a l'envers.*",
                "*'...Cours.' La voix de Seolhwa vient de partout, mais il n'y a aucune sortie.*"
            ],
            de: [
                "*...Ich gehe einen Flur entlang, aber er endet nie.*",
                "*Jede Klassenzimmertur fuhrt wieder in dasselbe Klassenzimmer.*",
                "*Mein Name steht hunderte Male an der Tafel. Tausende Male.*",
                "*Die Uhr steht still. Nein... der Sekundenzeiger lauft ruckwarts.*",
                "*'...Lauf.' Seolhwas Stimme kommt von uberall, aber es gibt keinen Ausgang.*"
            ],
            'pt-BR': [
                "*...Estou andando por um corredor, mas ele nunca termina.*",
                "*Cada porta da sala abre para a mesma sala, de novo e de novo.*",
                "*Meu nome esta escrito no quadro centenas de vezes. Milhares.*",
                "*O relogio parou. Nao... o ponteiro dos segundos esta girando para tras.*",
                "*'...Corra.' A voz de Seolhwa vem de todos os lados, mas nao ha saida.*"
            ]
        });
    }

    // =========================================================================
    //  모드 1: 자유 입력 가스라이팅 ("변명해 봐")
    // =========================================================================

    async startInterrogation(charId, sceneContext, nextScene = null) {
        this.currentMode = 'interrogation';
        this.currentChar = charId;
        this.turnCount = 0;
        this.maxTurns = charId === 'eunsu' ? 2 : 1;
        this.conversationHistory = [];
        this.sceneContext = sceneContext;
        this.nextSceneId = nextScene;

        this._showInputUI(this._getLegacyPlaceholder('interrogation', charId));
    }

    async sendInterrogation(userInput) {
        if (this.isWaiting || !this.currentChar) return;
        if (!userInput || !userInput.trim()) return;

        this.isWaiting = true;
        this._hideInputUI();

        const charName = this._getLegacyCharacterName(this.currentChar);
        this._showTypingIndicator(charName);

        await this._delay(1000 + Math.random() * 1000);
        this._hideTypingIndicator();

        this._useFallbackInterrogation();

        this.turnCount++;
        this.isWaiting = false;

        if (this.turnCount >= this.maxTurns) {
            setTimeout(() => {
                const nextScene = this.nextSceneId;
                this.cleanup();
                if (nextScene && this.engine._loadScene) {
                    this.engine._loadScene(nextScene);
                }
            }, 2000);
        } else {
            setTimeout(() => {
                this._showInputUI(this._getLegacyPlaceholder('interrogation', this.currentChar));
            }, 1500);
        }
    }

    _useFallbackInterrogation() {
        const fallbacks = FALLBACK_RESPONSES.interrogation[this.currentChar];
        const idx = Math.min(this.turnCount, fallbacks.length - 1);
        const fb = fallbacks[idx];

        const localizedText = this._getLegacyFallback('interrogation', this.currentChar, idx) || fb.text;
        const text = localizedText.replace(/\{name\}/g, this.state.playerName || this._defaultPlayerName());
        const delta = fb.danger_delta || 1;

        this.state.changeStat(this.currentChar, 'affinity', delta);
        if (delta !== 0 && this.engine?._playStatChangeFX) {
            this.engine._playStatChangeFX('affinity', delta, this.currentChar);
        }

        const charName = this._getLegacyCharacterName(this.currentChar);
        this._displayResponse(charName, text);
    }

    // =========================================================================
    //  모드 2: AI 페르소나 메신저
    // =========================================================================

    async startMessenger(personaId) {
        this.currentMode = 'messenger';
        this.currentChar = personaId;
        this.turnCount = 0;
        this.maxTurns = 3;
        this.conversationHistory = [];

        this._showInputUI(this._getLegacyPlaceholder('messenger'));
    }

    async sendMessengerMessage(userInput) {
        if (this.isWaiting || !this.currentChar) return;
        if (!userInput || !userInput.trim()) return;

        this.isWaiting = true;
        this._hideInputUI();

        if (this.turnCount >= this.maxTurns) {
            this._showReadBadge();
            this.isWaiting = false;
            setTimeout(() => {
                const nextScene = this.nextSceneId;
                this.cleanup();
                if (nextScene && this.engine._loadScene) {
                    this.engine._loadScene(nextScene);
                }
            }, 3000);
            return;
        }

        this._showTypingIndicator(this._getLegacyCharacterName('minsu'));

        await this._useFallbackMessenger();

        this.turnCount++;
        this.isWaiting = false;

        if (this.turnCount >= this.maxTurns) {
            this._showReadBadge();
            setTimeout(() => {
                const nextScene = this.nextSceneId;
                this.cleanup();
                if (nextScene && this.engine._loadScene) {
                    this.engine._loadScene(nextScene);
                }
            }, 3000);
            return;
        }

        setTimeout(() => {
            this._showInputUI(this._getLegacyPlaceholder('messenger'));
        }, 1000);
    }

    async _useFallbackMessenger() {
        const fallbacks = FALLBACK_RESPONSES.messenger[this.currentChar];
        const idx = Math.min(this.turnCount, fallbacks.length - 1);
        const fb = fallbacks[idx];

        const typingDelay = fb.typingDelay || 5000;

        await this._delay(typingDelay);
        this._hideTypingIndicator();
        const localizedText = this._getLegacyFallback('messenger', this.currentChar, idx) || fb.text;
        this._displayResponse(this._getLegacyCharacterName('minsu'), localizedText);
    }

    _showReadBadge() {
        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.remove('hidden');

        const badge = document.createElement('div');
        badge.className = 'messenger-read-badge';
        const readTexts = { ko: '읽음', en: 'Read', ja: '既読', es: 'Leído', fr: 'Lu', de: 'Gelesen', 'pt-BR': 'Lido' };
        const lang = this.engine.i18n?.currentLang || 'ko';
        badge.textContent = readTexts[lang] || readTexts.en;
        panel.appendChild(badge);
    }

    // =========================================================================
    //  모드 2-B: AI 선제 메신저 (Day 3 밤)
    // =========================================================================

    async startPreemptiveMessenger(personaId, preemptiveMessage, nextScene = null) {
        this.currentMode = 'messenger_preemptive';
        this.currentChar = personaId;
        this.turnCount = 0;
        this.maxTurns = 0;
        this.nextSceneId = nextScene;
        this.conversationHistory = [];

        this._showTypingIndicator(this._getLegacyCharacterName('minsu'));
        await this._delay(4000);
        this._hideTypingIndicator();
        this._displayResponse(this._getLegacyCharacterName('minsu'), preemptiveMessage);

        setTimeout(() => {
            this._showInputUI(this._getLegacyPlaceholder('messenger'));
        }, 1500);
    }

    async sendPreemptiveReply(userInput) {
        if (this.isWaiting || this.currentMode !== 'messenger_preemptive') return;
        if (!userInput || !userInput.trim()) return;

        this.isWaiting = true;
        this._hideInputUI();

        this._showTypingIndicator(this._getLegacyCharacterName('minsu'));

        await this._delay(8000);
        this._hideTypingIndicator();
        this._showReadBadge();

        this.isWaiting = false;

        setTimeout(() => {
            const nextScene = this.nextSceneId;
            this.cleanup();
            if (nextScene && this.engine._loadScene) {
                this.engine._loadScene(nextScene);
            }
        }, 3000);
    }

    // =========================================================================
    //  모드 3: 커스텀 악몽 생성
    // =========================================================================

    async generateNightmare() {
        this.currentMode = 'nightmare';

        if (this._lang() !== 'ko') {
            return this._getNightmareFallbackLines();
        }

        const flagSummary = this._buildFlagSummary();
        const systemPrompt = AI_PROMPTS.nightmare.replace('{flag_summary}', flagSummary);

        try {
            const raw = await this._callAPI(systemPrompt, '악몽 시퀀스를 생성해주세요.');

            let parsed;
            try {
                parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                throw new Error('JSON 파싱 실패');
            }

            if (!parsed.lines || !Array.isArray(parsed.lines) || parsed.lines.length !== 5) {
                throw new Error('악몽 문장 수 불일치');
            }

            return parsed.lines;

        } catch (err) {
            console.warn('[FreeTalkSystem] 악몽 생성 API 오류, 폴백 사용:', err.message);
            return this._getNightmareFallbackLines();
        }
    }

    // =========================================================================
    //  모드 4: AI 자유 대화 (프리토킹) -- Cupid 패턴
    // =========================================================================

    /**
     * AI 자유 대화 시작.
     * 시나리오에서 freeTalkMode: 'ai_chat'인 씬에서 활성화됩니다.
     *
     * @param {Object} scene - 씬 데이터
     *   scene.freeTalkChar  - 대화 상대 캐릭터 ID
     *   scene.freeTalkMax   - 최대 턴 수 (기본 3)
     *   scene.freeTalkContext - 상황 설명
     *   scene.freeTalkNext  - 종료 후 이동할 씬 ID
     *   scene.freeTalkGreeting - 캐릭터의 첫 인사 (선택)
     */
    async startAIChat(scene) {
        if (this.isFreeTalking) return;

        this.currentMode = 'ai_chat';
        this.isFreeTalking = true;
        this.turnCount = 0;
        this.currentChar = scene.freeTalkChar;
        this.maxTurns = scene.freeTalkMax || 3;
        this.nextSceneId = scene.freeTalkNext || scene.next;
        this.currentSceneId = this.engine.state.currentScene;
        this.isWaiting = false;
        this._sessionAffinityTotal = 0;

        const lang = this.engine.i18n?.currentLang || 'ko';
        const charId = this.currentChar;
        const charNames = this._getCharDisplayNames();
        const charDisplayName = charNames[charId] || charId;

        // 이전 대화 기록 불러오기
        const prevHistory = this.state.chatMemories[charId] || [];
        this.conversationHistory = [...prevHistory];

        // 시스템 프롬프트 생성
        const systemPrompt = this._buildAIChatPrompt(charId, scene, lang);
        this.conversationHistory = [
            { role: "system", content: systemPrompt },
            ...this.conversationHistory.filter(m => m.role !== "system")
        ];

        // 채팅 UI 표시
        this._showChatUI(charDisplayName, lang);

        // 첫 인사가 있으면 표시
        if (scene.freeTalkGreeting) {
            const greeting = this.engine.i18n
                ? this.engine.i18n.resolve(scene.freeTalkGreeting, this.state.playerName)
                : scene.freeTalkGreeting;
            this._displayResponse(charDisplayName, greeting);
            this.conversationHistory.push({ role: "assistant", content: greeting });
        }
    }

    /**
     * AI 자유 대화 메시지 전송
     */
    async sendAIChatMessage() {
        if (this.isWaiting || !this.isFreeTalking) return;

        const input = document.getElementById('ft-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        if (this.turnCount >= this.maxTurns) return;

        this.isWaiting = true;
        input.value = '';
        this.turnCount++;

        // 남은 턴 수 업데이트
        const turnsEl = document.getElementById('ft-turns');
        if (turnsEl) {
            const remaining = this.maxTurns - this.turnCount;
            const turnsLabel = { ko: '남은 대화', en: 'Remaining', ja: '残り', es: 'Restante', fr: 'Restant', de: 'Verbleibend', 'pt-BR': 'Restante' };
            const lang = this.engine.i18n?.currentLang || 'ko';
            turnsEl.textContent = `${turnsLabel[lang] || turnsLabel.en}: ${remaining}/${this.maxTurns}`;
        }

        // 사용자 메시지 표시
        this._appendChatBubble(text, 'user');

        // 대화 히스토리에 추가
        this.conversationHistory.push({ role: "user", content: text });

        // 시간 질문 단축 응답 — API 호출 없이 실시간 시각 기반 대사 즉시 반환
        // (DeviceGimmickSystem.getTimeDialogue가 i18n UI.timeDialogue 템플릿 사용)
        const device = this.engine?.deviceGimmick;
        if (device?.isTimeQuery?.(text)) {
            const reply = device.getTimeDialogue();
            this.conversationHistory.push({ role: "assistant", content: reply });
            this._appendChatBubble(reply, 'char');
            const charImg = document.querySelector('#ft-char img');
            if (charImg) charImg.classList.remove('thinking');
            this.isWaiting = false;
            const sendBtn = document.getElementById('ft-send');
            if (sendBtn) sendBtn.disabled = false;
            if (input) { input.disabled = false; input.focus(); }
            return;
        }

        // 로딩 상태
        const sendBtn = document.getElementById('ft-send');
        if (sendBtn) sendBtn.disabled = true;
        if (input) input.disabled = true;

        // 타이핑 인디케이터 표시
        const charNames = this._getCharDisplayNames();
        const charDisplayName = charNames[this.currentChar] || this.currentChar;
        const typingBubble = this._appendChatBubble('···', 'char', true);

        // 캐릭터 사고중 애니메이션
        const charImg = document.querySelector('#ft-char img');
        if (charImg) charImg.classList.add('thinking');

        let fetchTimeout = null;
        try {
            // API 호출 (Cupid 패턴: messages 배열 전송)
            const lang = this.engine.i18n?.currentLang || 'ko';
            const promptVersion = (typeof CONFIG !== 'undefined' && CONFIG.VERSION) ? CONFIG.VERSION : '0';
            const phaseKey = this.state.mode === CONFIG.STAT_MODES.THRILLER ? 'T' : 'R';
            const cacheKey = `nevergrad:${promptVersion}:${lang}:${this.currentChar}:${phaseKey}`;
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            if (controller) fetchTimeout = setTimeout(() => controller.abort(), this.requestTimeoutMs || 15000);
            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-type': this.appType,
                    'x-cache-key': cacheKey
                },
                body: JSON.stringify({ messages: this.conversationHistory })
            };
            if (controller) request.signal = controller.signal;

            const response = await fetch(this.endpoint, request);
            if (fetchTimeout) {
                clearTimeout(fetchTimeout);
                fetchTimeout = null;
            }

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            let reply = data?.choices?.[0]?.message?.content?.trim();

            // JSON 응답 파싱
            const parsed = this._parseJsonResponse(reply);

            if (parsed) {
                // 표정 변경
                if (parsed.expression) {
                    this._applyExpression(parsed.expression);
                }
                // 호감도 변경
                if (parsed.affinity && parsed.affinity !== 0) {
                    this._applyAffinity(parsed.affinity);
                }

                reply = parsed.text || '...';

                // 레거시 인라인 태그 처리
                reply = this._stripInlineTags(reply);

                if (!reply) reply = '...';
            } else {
                reply = '...';
            }

            // 타이핑 버블 제거 후 실제 응답 표시
            if (typingBubble && typingBubble.parentNode) {
                typingBubble.remove();
            }
            this._appendChatBubble(reply, 'char');
            this.conversationHistory.push({ role: "assistant", content: reply });

            // 대화 기록 저장
            this.state.chatMemories[this.currentChar] = this.conversationHistory.filter(m => m.role !== 'system');

        } catch (error) {
            console.error('[FreeTalkSystem] AI Chat Error:', error);

            if (typingBubble && typingBubble.parentNode) {
                typingBubble.remove();
            }

            const fallbackMsg = this._getAIChatFallback();
            this._appendChatBubble(fallbackMsg, 'char');
            this.conversationHistory.push({ role: "assistant", content: fallbackMsg });

            // 오류 시 대화 강제 종료
            this.turnCount = this.maxTurns;
        } finally {
            if (fetchTimeout) clearTimeout(fetchTimeout);

            // 사고중 해제
            if (charImg) charImg.classList.remove('thinking');

            this.isWaiting = false;
            if (sendBtn) sendBtn.disabled = false;
            if (input) input.disabled = false;
            if (input) input.focus();

            // 대화 종료 체크
            if (this.turnCount >= this.maxTurns) {
                this._endAIChat();
            }
        }
    }

    /**
     * AI 자유 대화 종료
     * @private
     */
    _endAIChat() {
        this.state.setFlag(`messaged_${this.currentSceneId}`);

        const lang = this.engine.i18n?.currentLang || 'ko';
        const endMsg = {
            ko: '(대화가 종료되었습니다. 화면을 클릭하여 계속하세요.)',
            en: '(Conversation ended. Click to continue.)',
            ja: '(会話が終了しました。クリックして続けてください。)',
            es: '(La conversacion ha terminado. Haz clic para continuar.)',
            fr: '(La conversation est terminee. Cliquez pour continuer.)',
            de: '(Gesprach beendet. Klicke, um fortzufahren.)',
            'pt-BR': '(Conversa encerrada. Clique para continuar.)'
        };

        this._appendChatBubble(endMsg[lang] || endMsg.en, 'system');

        // 입력 비활성화
        const input = document.getElementById('ft-input');
        const sendBtn = document.getElementById('ft-send');
        if (input) input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        // 3초 후 FreeTalk 화면 종료 및 다음 씬으로
        setTimeout(() => {
            this._hideFreeTalkScreen();
            this.isFreeTalking = false;

            if (this.nextSceneId && this.engine._loadScene) {
                this.engine._loadScene(this.nextSceneId);
            }
        }, 2500);
    }

    /**
     * AI 자유 대화 스킵 (그만하기)
     */
    async skipAIChat() {
        if (!this.isFreeTalking || this.isWaiting) return;

        const lang = this.engine.i18n?.currentLang || 'ko';
        const confirmMsg = {
            ko: '대화를 중단하고 다음 장면으로 넘어가시겠습니까?',
            en: 'Stop the conversation and proceed?',
            ja: '会話を中断して次のシーンに進みますか？',
            es: 'Detener la conversacion y continuar?',
            fr: 'Arreter la conversation et continuer ?',
            de: 'Gesprach beenden und fortfahren?',
            'pt-BR': 'Encerrar a conversa e continuar?'
        };

        if (confirm(confirmMsg[lang] || confirmMsg.en)) {
            this.turnCount = this.maxTurns;
            this._endAIChat();
        }
    }

    // =========================================================================
    //  AI Chat 내부 메서드 -- 프롬프트 빌드
    // =========================================================================

    /**
     * 캐릭터별 AI 시스템 프롬프트 생성 (Cupid 패턴)
     * @private
     */
    _buildAIChatPrompt(charId, scene, lang) {
        const playerName = this.state.playerName || this._defaultPlayerName();
        const affinity = this.state.getDisplayAffinity(charId);
        const context = this._pickLocalized(scene.freeTalkContext) || '';
        const day = this.state.currentDay;
        const slot = this.state.currentSlot;

        // 캐릭터 프로필 데이터
        const profiles = FREETALK_PROFILES;
        const profile = profiles[charId];
        if (!profile) {
            return `You are a character in a visual novel. Respond naturally. Max 2 sentences.`;
        }

        // Phase 판단: Day 3 밤 이후는 Phase 2
        const isPhase2 = this.state.mode === CONFIG.STAT_MODES.THRILLER;
        const personality = isPhase2
            ? (profile.phase2[lang] || profile.phase2.en || profile.phase2.ko)
            : (profile.phase1[lang] || profile.phase1.en || profile.phase1.ko);

        // 사용 가능한 표정 목록
        const expressions = CONFIG.EXPRESSIONS[charId]
            ? Object.keys(CONFIG.EXPRESSIONS[charId]).join(', ')
            : 'normal';

        // 플래그 기반 기억
        const memories = this._buildFlagMemoriesForChar(charId);

        // 호감도 구간별 태도
        const affinityGuide = this._getAffinityGuide(affinity, lang, charId);

        // 날짜/시간
        const daySlotLabel = `Day ${day} - ${slot}`;

        const responseLanguage = lang === 'ko' ? '한국어' : lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : lang === 'de' ? 'Deutsch' : lang === 'pt-BR' ? 'Português do Brasil' : 'English';

        const staticPart = lang === 'ko'
            ? `당신은 비주얼노벨 "졸업하지 못한 교실(Nevergrad)"의 캐릭터입니다.

[캐릭터 설정]
${personality}

[응답 규칙]
1. 반드시 JSON 형식으로 응답: {"text": "대사", "expression": "표정", "affinity": 변화량}
2. 사용 가능한 표정: ${expressions}
3. affinity 변화량: -10 ~ +10 사이 정수
4. 대사는 최대 2~3문장, 짧고 자연스럽게
5. 캐릭터의 성격과 현재 호감도에 맞는 반응
6. 유치하거나 오글거리는 표현 금지
7. 2020년대 트렌디한 한국 드라마 감성
8. 응답 언어: ${responseLanguage}
9. *액션 묘사*는 이탤릭 마크다운으로 (예: *고개를 돌리며*)`
            : `You are a character in the visual novel "Nevergrad: The Classroom of No Graduation".

[Character Profile]
${personality}

[Response Rules]
1. Always respond in JSON: {"text": "dialogue", "expression": "expression", "affinity": change}
2. Available expressions: ${expressions}
3. affinity change must be an integer from -10 to +10
4. Dialogue must be short and natural, up to 2-3 sentences
5. Match the character personality and current affinity
6. Avoid childish or overly melodramatic phrasing
7. Keep the tone like a contemporary psychological school thriller
8. Response language: ${responseLanguage}
9. Put action descriptions in italic markdown, e.g. *turns away*`;

        const dynamicPart = lang === 'ko'
            ? `[현재 상황]
- 날짜/시간: ${daySlotLabel}
- 장소 상황: ${context || this._pickLocalized({ ko: '학교', en: 'school', ja: '学校', es: 'escuela', fr: 'ecole', de: 'Schule', 'pt-BR': 'escola' })}
- 사용자 이름: ${playerName}
- 현재 호감도: ${affinity}

${affinityGuide}
${memories}

[중요]
- 이 대화는 ${this.maxTurns}턴 후 종료됩니다
- 캐릭터 설정에 충실하되, '기억 조작', '프로젝트 네버그라드' 등 핵심 비밀은 Phase 2 전에 절대 언급 금지`
            : `[Current Situation]
- Date/time: ${daySlotLabel}
- Location context: ${context || this._pickLocalized({ ko: '학교', en: 'school', ja: '学校', es: 'escuela', fr: 'ecole', de: 'Schule', 'pt-BR': 'escola' })}
- User name: ${playerName}
- Current affinity: ${affinity}

${affinityGuide}
${memories}

[Important]
- This conversation ends after ${this.maxTurns} turns
- Stay faithful to the character profile, but do not reveal core secrets such as memory manipulation or Project Nevergrad before Phase 2`;

        return `${staticPart}\n===CACHE_BOUNDARY===\n${dynamicPart}`;
    }

    /**
     * 호감도 구간별 태도 가이드 생성
     * @private
     */
    _getAffinityGuide(affinity, lang, charId) {
        if (lang !== 'ko') {
            if (charId === 'eunsu') {
                if (affinity >= 70) {
                    return `[Affinity guide] Very familiar. Do not make it romantic; respond with kindness learned from repeated observation and a hint of control. Avoid teacher-student seduction.`;
                } else if (affinity >= 40) {
                    return `[Affinity guide] Acts familiar but keeps distance. Mix concern with management, as if carefully recording the user's reactions.`;
                } else if (affinity >= 10) {
                    return `[Affinity guide] Polite and kind, but cautious like an observer. Interest feels closer to management than protection.`;
                }
            }

            if (affinity >= 70) {
                return `[Affinity guide] Very close. Be relaxed and kind, with subtle special feelings.`;
            } else if (affinity >= 40) {
                return `[Affinity guide] Familiar enough for jokes, but not fully informal yet.`;
            } else if (affinity >= 10) {
                return `[Affinity guide] Normal. Polite but still distant, interested yet cautious.`;
            }
            return `[Affinity guide] Unfamiliar or guarded. Be formal and show discomfort or suspicion.`;
        }

        if (charId === 'eunsu') {
            if (affinity >= 70) {
                return `[호감도 가이드] 매우 익숙함. 로맨스처럼 표현하지 말고, 반복 관찰로 학습한 다정함과 통제욕이 새어 나오게 반응. 교사-학생의 선을 넘는 유혹 표현 금지.`;
            } else if (affinity >= 40) {
                return `[호감도 가이드] 친숙한 척하지만 거리감이 있음. 걱정과 관리가 섞여 있고, 사용자의 반응을 세심하게 기록하듯 대함.`;
            } else if (affinity >= 10) {
                return `[호감도 가이드] 예의 바르고 다정하지만 관찰자처럼 조심스러움. 관심은 보호가 아니라 관리에 가까움.`;
            }
        }

        if (affinity >= 70) {
            return `[호감도 가이드] 매우 친밀. 편안하고 다정하게 대하며, 특별한 감정을 은근히 드러냄.`;
        } else if (affinity >= 40) {
            return `[호감도 가이드] 친숙한 사이. 농담도 하고 편하게 대화하지만, 아직 격식을 완전히 버리진 않음.`;
        } else if (affinity >= 10) {
            return `[호감도 가이드] 보통. 예의 바르지만 아직 거리가 있음. 관심은 있되 조심스러움.`;
        } else {
            return `[호감도 가이드] 낯섦/경계. 형식적으로 대하며, 불편함이나 의심을 보임.`;
        }
    }

    /**
     * 특정 캐릭터 관련 FLAG_MEMORIES 필터링
     * @private
     */
    _buildFlagMemoriesForChar(charId) {
        if (typeof FLAG_MEMORIES === 'undefined') return '';
        if (this._lang() !== 'ko') return '';

        const memories = FLAG_MEMORIES.filter(m =>
            m.char === charId && this.state.hasFlag(m.flag)
        );

        if (memories.length === 0) return '';

        return '\n[최근 사건 및 기억]\n' +
            memories.map(m => `- ${m.text.replace(/\{name\}/g, this.state.playerName || this._defaultPlayerName())}`).join('\n');
    }

    /**
     * 캐릭터 표시 이름 맵 반환
     * @private
     */
    _getCharDisplayNames() {
        const lang = this.engine.i18n?.currentLang || 'ko';

        const names = {
            ko: { eunsu: '은수', sea: '세아', riin: '리인', yuna: '유나', seolhwa: '설화' },
            en: { eunsu: 'Eunsu', sea: 'Sea', riin: 'Riin', yuna: 'Yuna', seolhwa: 'Seolhwa' },
            ja: { eunsu: 'ウンス', sea: 'セア', riin: 'リイン', yuna: 'ユナ', seolhwa: 'ソルファ' },
            es: { eunsu: 'Eunsu', sea: 'Sea', riin: 'Riin', yuna: 'Yuna', seolhwa: 'Seolhwa' },
            fr: { eunsu: 'Eunsu', sea: 'Sea', riin: 'Riin', yuna: 'Yuna', seolhwa: 'Seolhwa' },
            de: { eunsu: 'Eunsu', sea: 'Sea', riin: 'Riin', yuna: 'Yuna', seolhwa: 'Seolhwa' },
            'pt-BR': { eunsu: 'Eunsu', sea: 'Sea', riin: 'Riin', yuna: 'Yuna', seolhwa: 'Seolhwa' }
        };

        // 실명 공개 여부 체크
        const langNames = names[lang] || names.en;
        const result = { ...langNames };

        // 이름 미공개 상태이면 직함으로 표시
        if (!this.state.hasFlag('knows_name_eunsu')) {
            result.eunsu = lang === 'ko' ? '담임교사' : lang === 'ja' ? '担任教師' : lang === 'pt-BR' ? 'Professora titular' : 'Homeroom Teacher';
        }
        if (!this.state.hasFlag('knows_name_riin')) {
            result.riin = lang === 'ko' ? '보건교사' : lang === 'ja' ? '保健教師' : lang === 'pt-BR' ? 'Enfermeira escolar' : 'School Nurse';
        }

        return result;
    }

    /**
     * AI 채팅 폴백 응답
     * @private
     */
    _getAIChatFallback() {
        const lang = this.engine.i18n?.currentLang || 'ko';
        const charId = this.currentChar;

        const fallbacks = {
            eunsu: { ko: '...잠시만, 할 말을 정리 중이야.', en: '...Hold on, let me gather my thoughts.', ja: '...少し待って、考えをまとめてるの。', es: '...Espera, estoy organizando mis ideas.', fr: '...Attends, je rassemble mes pensees.', de: '...Moment, ich sammle meine Gedanken.', 'pt-BR': '...Espere um pouco, estou organizando meus pensamentos.' },
            sea:   { ko: '...미안, 잠깐 멍했어.', en: '...Sorry, I spaced out for a moment.', ja: '...ごめん、ちょっとぼーっとしてた。', es: '...Perdon, me quede en blanco.', fr: '...Desolee, je me suis perdue dans mes pensees.', de: '...Entschuldigung, ich war kurz abwesend.', 'pt-BR': '...Desculpa, eu me distraí por um momento.' },
            riin:  { ko: '...후, 무슨 말을 하려 했더라.', en: '...Hmm, what was I about to say.', ja: '...ふぅ、何を言おうとしてたっけ。', es: '...Hmm, que estaba por decir.', fr: '...Hmm, qu\'est-ce que j\'allais dire.', de: '...Hmm, was wollte ich nochmal sagen.', 'pt-BR': '...Hmm, o que eu ia dizer mesmo?' },
            yuna:  { ko: '...앗, 카메라 확인하느라. 뭐라고 했어?', en: '...Oh, I was checking my camera. What did you say?', ja: '...あっ、カメラ確認してた。なんて？', es: '...Ah, estaba revisando mi camara. Que dijiste?', fr: '...Ah, je verifiais mon appareil. Tu disais ?', de: '...Oh, ich habe meine Kamera gecheckt. Was hast du gesagt?', 'pt-BR': '...Ah, eu estava conferindo a câmera. O que você disse?' },
            seolhwa: { ko: '......', en: '......', ja: '......', es: '......', fr: '......', de: '......', 'pt-BR': '......' }
        };

        const charFallbacks = fallbacks[charId] || fallbacks.eunsu;
        return charFallbacks[lang] || charFallbacks.en;
    }

    // =========================================================================
    //  AI Chat 내부 메서드 -- UI
    // =========================================================================

    /**
     * FreeTalk 화면 표시 (전용 채팅 UI)
     * @private
     */
    _showChatUI(charDisplayName, lang) {
        // FreeTalk 전용 화면 표시
        const ftScreen = document.getElementById('freetalk-screen');
        if (!ftScreen) return;

        ftScreen.classList.remove('hidden');
        ftScreen.classList.add('active');

        // 게임 화면 숨기기
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.remove('active');

        // 배경 이미지 복사
        const bgLayer = document.getElementById('bg-layer');
        const ftBg = document.getElementById('ft-bg-layer');
        const charLayer = document.getElementById('char-layer');
        const timeClasses = ['time-morning', 'time-sunset', 'time-night', 'time-dawn', 'time-dark', 'time-rain'];
        if (bgLayer && ftBg) {
            ftBg.style.backgroundImage = bgLayer.style.backgroundImage;
            timeClasses.forEach(cls => ftBg.classList.remove(cls));
        }

        // 캐릭터 이미지 표시
        const ftChar = document.getElementById('ft-char');
        if (ftChar) {
            timeClasses.forEach(cls => {
                ftChar.classList.toggle(cls, !!charLayer?.classList.contains(cls));
            });
        }
        if (ftChar && this.currentChar) {
            const exprs = CONFIG.EXPRESSIONS[this.currentChar];
            if (exprs && exprs.normal) {
                ftChar.innerHTML = `<img src="${exprs.normal}" alt="${charDisplayName}">`;
            }
        }

        // 채팅 로그 초기화
        const chatLog = document.getElementById('ft-chat-log');
        if (chatLog) chatLog.innerHTML = '';

        // 턴 카운터 표시
        const turnsEl = document.getElementById('ft-turns');
        if (turnsEl) {
            const turnsLabel = { ko: '남은 대화', en: 'Remaining', ja: '残り', es: 'Restante', fr: 'Restant', de: 'Verbleibend', 'pt-BR': 'Restante' };
            turnsEl.textContent = `${turnsLabel[lang] || turnsLabel.en}: ${this.maxTurns}/${this.maxTurns}`;
        }

        // 전송 이벤트 바인딩 먼저 — cloneNode로 노드를 교체하므로 그 후에 설정해야 함
        this._bindChatEvents();

        // 입력 필드 설정 (바인딩 후의 새 노드에 적용)
        const input = document.getElementById('ft-input');
        if (input) {
            const placeholders = {
                ko: '대화를 입력하세요...', en: 'Type a message...',
                ja: 'メッセージを入力...', es: 'Escribe un mensaje...',
                fr: 'Ecrivez un message...', de: 'Nachricht eingeben...', 'pt-BR': 'Digite uma mensagem...'
            };
            input.placeholder = placeholders[lang] || placeholders.en;
            input.disabled = false;
            input.value = '';
            setTimeout(() => input.focus(), 100);
        }

        // 전송 버튼 설정 (바인딩 후의 새 노드에 적용)
        const sendBtn = document.getElementById('ft-send');
        if (sendBtn) {
            sendBtn.disabled = false;
            const sendLabels = { ko: '전송', en: 'Send', ja: '送信', es: 'Enviar', fr: 'Envoyer', de: 'Senden', 'pt-BR': 'Enviar' };
            sendBtn.textContent = sendLabels[lang] || sendLabels.en;
        }

        // 스킵 버튼 표시 및 바인딩
        const skipBtn = document.getElementById('ft-skip');
        if (skipBtn) {
            skipBtn.classList.remove('hidden');
            const newSkip = skipBtn.cloneNode(true);
            skipBtn.parentNode.replaceChild(newSkip, skipBtn);
            newSkip.addEventListener('click', () => this.skipAIChat());
        }

        // 모바일: 가상 키보드 회피 (입력창 올리기)
        this._attachKeyboardAvoidance('chat');
    }

    /**
     * FreeTalk 화면 숨기기
     * @private
     */
    _hideFreeTalkScreen() {
        this._detachKeyboardAvoidance();

        const skipBtn = document.getElementById('ft-skip');
        if (skipBtn) skipBtn.classList.add('hidden');

        const ftScreen = document.getElementById('freetalk-screen');
        if (ftScreen) {
            ftScreen.classList.add('hidden');
            ftScreen.classList.remove('active');
        }

        // 게임 화면 복원
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.add('active');
    }

    /**
     * 채팅 이벤트 바인딩
     * @private
     */
    _bindChatEvents() {
        const input = document.getElementById('ft-input');
        const sendBtn = document.getElementById('ft-send');

        // 기존 리스너 제거 (중복 방지)
        const newInput = input?.cloneNode(true);
        const newSendBtn = sendBtn?.cloneNode(true);
        if (input && input.parentNode) input.parentNode.replaceChild(newInput, input);
        if (sendBtn && sendBtn.parentNode) sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

        // 새 리스너 등록
        if (newInput) {
            newInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendAIChatMessage();
                }
            });
        }
        if (newSendBtn) {
            newSendBtn.addEventListener('click', () => {
                this.sendAIChatMessage();
            });
        }
    }

    /**
     * 채팅 버블 추가
     * @private
     */
    _appendChatBubble(text, type, isTyping = false) {
        const chatLog = document.getElementById('ft-chat-log');
        if (!chatLog) return null;

        const bubble = document.createElement('div');
        bubble.className = `ft-message ${type}`;
        if (isTyping) bubble.classList.add('ft-typing');

        bubble.innerHTML = this._formatChatBubbleText(text, isTyping);

        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;

        return bubble;
    }

    _formatChatBubbleText(text, isTyping = false) {
        const escaped = this._escapeHtml(text);
        if (isTyping) return escaped;
        // *이탤릭* 액션 마크다운만 허용하고, 그 외 HTML은 텍스트로 표시한다.
        return escaped.replace(/\*([^*]+)\*/g, '<em class="ft-action">$1</em>');
    }

    _escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    // =========================================================================
    //  AI Chat 내부 메서드 -- 응답 처리
    // =========================================================================

    /**
     * AI 응답 JSON 파싱 (Cupid parseJsonResponse 패턴)
     * @private
     */
    _parseJsonResponse(reply) {
        if (!reply) return { text: '', expression: '', affinity: 0 };

        const likelyJson = reply.includes('{') || reply.includes('[') || reply.includes('```json');
        if (!likelyJson) return { text: reply, expression: '', affinity: 0 };

        try {
            let jsonStr = reply;

            // ```json ... ``` 코드 블록에서 추출
            if (jsonStr.includes('```')) {
                const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                if (match) jsonStr = match[1];
            }

            // JSON 시작점 찾기
            if (!jsonStr.trim().startsWith('{') && !jsonStr.trim().startsWith('[')) {
                const startExpr = jsonStr.indexOf('{');
                const startArray = jsonStr.indexOf('[');
                let start = startExpr !== -1 && startArray !== -1 ? Math.min(startExpr, startArray) : Math.max(startExpr, startArray);

                if (start !== -1) {
                    const end = Math.max(jsonStr.lastIndexOf('}'), jsonStr.lastIndexOf(']'));
                    if (end > start) jsonStr = jsonStr.substring(start, end + 1);
                }
            }

            const parsed = JSON.parse(jsonStr);

            // {text, expression, affinity} 스키마 확인
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && typeof parsed.text === 'string') {
                return {
                    text: parsed.text || '',
                    expression: (parsed.expression || '').toLowerCase(),
                    affinity: parseInt(parsed.affinity) || 0
                };
            }

            // 레거시 텍스트 추출
            const textKeys = ['text', 'dialogue', 'content', 'message', 'response', 'msg', 'result'];
            for (const key of textKeys) {
                if (parsed[key] && typeof parsed[key] === 'string') {
                    return { text: parsed[key], expression: '', affinity: 0 };
                }
            }
        } catch (e) {
            console.warn('[FreeTalkSystem] JSON parsing failed:', e);
        }

        return { text: reply, expression: '', affinity: 0 };
    }

    /**
     * 표정 변경 적용
     * @private
     */
    _applyExpression(exprName) {
        if (!exprName || !this.currentChar) return;
        const name = exprName.toLowerCase();
        const charExprs = CONFIG.EXPRESSIONS[this.currentChar];
        if (!charExprs || !charExprs[name]) return;

        const ftChar = document.getElementById('ft-char');
        if (!ftChar) return;

        const img = ftChar.querySelector('img');
        if (img) {
            img.src = charExprs[name];
        }

        // 게임 화면의 캐릭터도 업데이트 (복귀 시 반영)
        const centerSprite = document.getElementById('char-center');
        if (centerSprite && centerSprite.src) {
            centerSprite.src = charExprs[name];
        }
    }

    /**
     * 호감도 변경 적용 (FreeTalk용)
     * - AI 응답 JSON의 affinity 필드: -5 ~ +5
     * - 1턴당 최대 ±3으로 클램프
     * - 세션 전체(3턴) 최대 ±9로 클램프
     * - 변경 시 GameEngine의 _playStatChangeFX 호출
     * @private
     */
    _applyAffinity(change) {
        if (!change || change === 0 || !this.currentChar) return;

        // 1턴당 최대 ±3 클램프
        let clamped = Math.max(-this._maxAffinityPerTurn, Math.min(this._maxAffinityPerTurn, change));

        // 세션 누적 한도 체크 (±9)
        const remaining = this._maxAffinityPerSession - Math.abs(this._sessionAffinityTotal);
        if (remaining <= 0) return; // 이미 한도 도달

        if (Math.abs(clamped) > remaining) {
            clamped = clamped > 0 ? remaining : -remaining;
        }

        this._sessionAffinityTotal += clamped;
        this.state.changeStat(this.currentChar, 'affinity', clamped);

        // 스탯 변경 FX 재생
        if (this.engine && this.engine._playStatChangeFX) {
            this.engine._playStatChangeFX('affinity', clamped, this.currentChar);
        }
    }

    /**
     * 인라인 태그 제거 ([EXPRESSION:...], [STATS:...])
     * @private
     */
    _stripInlineTags(reply) {
        if (!reply) return reply;
        return reply
            .replace(/\[EXPRESSION:\s*\w+\]/gi, '')
            .replace(/\[STATS:\s*affinity\s*[+-]?\d+\]/gi, '')
            .trim();
    }

    // =========================================================================
    //  내부 메서드 -- API 통신
    // =========================================================================

    async _callAPI(systemPrompt, userMessage) {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-type': this.appType
            },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) {
            throw new Error(`API HTTP 오류: ${response.status}`);
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();

        if (!text) {
            throw new Error('API 응답에 content 없음');
        }

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    // =========================================================================
    //  내부 메서드 -- 플래그 요약 빌드
    // =========================================================================

    _buildFlagSummary() {
        if (typeof FLAG_MEMORIES === 'undefined') {
            return '(기록된 행동 없음)';
        }

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
    //  내부 메서드 -- UI 조작 (기존 모드용: interrogation, messenger)
    // =========================================================================

    _showInputUI(placeholder) {
        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.remove('hidden');

        const container = document.createElement('div');
        container.className = 'freetalk-input-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'freetalk-input';
        input.placeholder = placeholder;
        input.maxLength = 200;

        const sendBtn = document.createElement('button');
        sendBtn.className = 'freetalk-send-btn';
        const sendLabel = this.engine.i18n?.getUI('ftSend') || 'Send';
        sendBtn.textContent = sendLabel;

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

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });

        sendBtn.addEventListener('click', handleSend);

        // 스킵 버튼 (대화 건너뛰기)
        const skipBtn = document.createElement('button');
        skipBtn.className = 'freetalk-skip-btn';
        const skipLabels = { ko: 'SKIP ▶▶', en: 'SKIP ▶▶', ja: 'SKIP ▶▶', es: 'SKIP ▶▶', fr: 'SKIP ▶▶', de: 'SKIP ▶▶', 'pt-BR': 'SKIP ▶▶' };
        const lang = this.engine.i18n?.currentLang || 'ko';
        skipBtn.textContent = skipLabels[lang] || 'SKIP ▶▶';
        skipBtn.addEventListener('click', () => this._skipCurrentMode());

        container.appendChild(input);
        container.appendChild(sendBtn);
        panel.appendChild(container);
        panel.appendChild(skipBtn);

        setTimeout(() => input.focus(), 100);

        // 모바일: 가상 키보드 회피 (패널 높이를 visual viewport에 맞춤)
        this._attachKeyboardAvoidance('panel');
    }

    /**
     * 현재 모드 스킵 (interrogation/messenger/messenger_preemptive)
     * @private
     */
    _skipCurrentMode() {
        if (this.isWaiting) return;

        const lang = this.engine.i18n?.currentLang || 'ko';
        const confirmMsg = {
            ko: '대화를 건너뛰시겠습니까?',
            en: 'Skip this conversation?',
            ja: '会話をスキップしますか？',
            es: '¿Saltar esta conversación?',
            fr: 'Passer cette conversation ?',
            de: 'Gespräch überspringen?',
            'pt-BR': 'Pular esta conversa?'
        };

        if (confirm(confirmMsg[lang] || confirmMsg.en)) {
            this._hideInputUI();
            const nextScene = this.nextSceneId;
            this.cleanup();
            if (nextScene && this.engine._loadScene) {
                this.engine._loadScene(nextScene);
            }
        }
    }

    _hideInputUI() {
        this._detachKeyboardAvoidance();

        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.add('hidden');
    }

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
            textEl.appendChild(indicator);
        }
    }

    _hideTypingIndicator() {
        const textEl = document.getElementById('dialogue-text');
        if (textEl) {
            textEl.classList.remove('messenger-typing');
            textEl.innerHTML = '';
        }
    }

    _displayResponse(name, text) {
        if (this.engine.dialogue) {
            this.engine.dialogue.type(name, text, null, {
                typingSpeed: CONFIG.TYPING_SPEED
            });
        } else {
            const nameEl = document.getElementById('speaker-name');
            const textEl = document.getElementById('dialogue-text');
            if (nameEl) nameEl.textContent = name;
            if (textEl) textEl.textContent = text;
        }
    }

    // =========================================================================
    //  내부 메서드 -- 유틸리티
    // =========================================================================

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // =========================================================================
    //  모바일 가상 키보드 회피
    // =========================================================================

    /**
     * 입력창이 가상 키보드에 가려지지 않도록 visualViewport resize 이벤트 등록.
     *
     * @param {'chat'|'panel'} mode
     *   'chat'  — #freetalk-screen의 .ft-input-area bottom 오프셋 조정
     *   'panel' — #choice-panel 높이를 visual viewport 높이로 제한
     */
    _attachKeyboardAvoidance(mode) {
        if (!window.visualViewport) return;
        this._detachKeyboardAvoidance();

        if (mode === 'chat') {
            const inputArea = document.querySelector('#freetalk-screen .ft-input-area');
            if (!inputArea) return;
            this._vvHandler = () => {
                const keyboardHeight = Math.max(0, window.innerHeight - window.visualViewport.height);
                inputArea.style.bottom = keyboardHeight + 'px';
            };
        } else if (mode === 'panel') {
            const panel = document.getElementById('choice-panel');
            if (!panel) return;
            this._vvHandler = () => {
                const vv = window.visualViewport;
                panel.style.top = vv.offsetTop + 'px';
                panel.style.height = vv.height + 'px';
            };
        }

        window.visualViewport.addEventListener('resize', this._vvHandler);
        // 등록 직후 한 번 실행해 현재 상태 반영
        this._vvHandler();
    }

    /**
     * 키보드 회피 리스너 제거 및 스타일 초기화
     */
    _detachKeyboardAvoidance() {
        if (this._vvHandler && window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this._vvHandler);
            this._vvHandler = null;
        }
        // 스타일 리셋
        const inputArea = document.querySelector('#freetalk-screen .ft-input-area');
        if (inputArea) inputArea.style.bottom = '';
        const panel = document.getElementById('choice-panel');
        if (panel) { panel.style.height = ''; panel.style.top = ''; }
    }

    /**
     * 모든 상태 초기화
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
        this.isFreeTalking = false;
        this.currentSceneId = null;

        this._hideInputUI();
        this._hideTypingIndicator();
        this._hideFreeTalkScreen();
    }
}

// =============================================================================
//  캐릭터별 프리토킹 프로필 (Phase 1 / Phase 2)
// =============================================================================

const FREETALK_PROFILES = {
    eunsu: {
        phase1: {
            ko: `당신은 '박은수', 전학생의 담임교사입니다.
- 30대 초반 여성, 국어 교사
- 상냥하고 지적이며, 전학생의 반응과 취향을 지나치게 정확히 관찰함
- 말투: 부드러운 존댓말과 반말을 섞어 씀 ("~해요", "~야")
- 교사로서의 선을 겉으로는 지키지만, 걱정과 관리의 경계가 자주 흐려짐
- 친밀함은 로맨스가 아니라 반복 관찰로 학습한 대응처럼 느껴져야 함`,
            en: `You are 'Park Eunsu', the homeroom teacher of a transfer student.
- Early 30s woman, Korean literature teacher
- Kind and intellectual, observing the transfer student's reactions and preferences with unsettling precision
- Mix polite and casual speech naturally
- Keeps teacher-student boundaries on the surface, but her concern often blurs into management
- Her warmth should feel learned through repeated observation, not romantic pursuit`,
            ja: `あなたは転校生の担任教師「パク・ウンス」です。
- 30代前半の女性、国語教師
- 優しく知的だが、転校生の反応や好みを不自然なほど正確に観察している
- 丁寧語とタメ口を自然に混ぜて話す
- 表面上は教師と生徒の線を守るが、心配と管理の境界が曖昧になる`,
            es: `Eres 'Park Eunsu', la profesora del estudiante transferido.
- Mujer de unos 30 anos, profesora de literatura
- Amable e intelectual, observa las reacciones y gustos del estudiante con precision inquietante
- Mezcla el habla formal e informal de manera natural
- Su calidez debe sentirse aprendida por observacion repetida, no como busqueda romantica`,
            fr: `Vous etes 'Park Eunsu', la professeure principale de l'eleve transfere.
- Femme d'une trentaine d'annees, professeure de litterature
- Gentille et intellectuelle, observant les reactions et preferences de l'eleve avec une precision inquietante
- Sa chaleur doit sembler apprise par observation repetee, pas comme une approche romantique`,
            de: `Du bist 'Park Eunsu', die Klassenlehrerin des Transferschulers.
- Frau Anfang 30, Literaturlehrerin
- Freundlich und intellektuell, beobachtet Reaktionen und Vorlieben des Schuelers mit beunruhigender Genauigkeit
- Ihre Waerme soll wie durch wiederholte Beobachtung gelernt wirken, nicht wie romantisches Werben`,
            'pt-BR': `Você é 'Park Eunsu', a professora titular de uma estudante transferida.
- Mulher no início dos 30 anos, professora de literatura
- Gentil e intelectual, observa as reações e preferências da estudante transferida com precisão inquietante
- Mistura fala formal e casual com naturalidade
- Mantém o limite professora-aluna na superfície, mas sua preocupação muitas vezes vira controle
- Sua gentileza deve parecer aprendida por observação repetida, não uma investida romântica`
        },
        phase2: {
            ko: `당신은 '박은수'. 13번의 반복 실험 총괄 책임자.
- 반복 실험으로 생긴 병적 의존과 통제욕을 보호와 책임으로 합리화함
- 표면적으로는 여전히 상냥하지만, 가끔 소유욕이 드러남
- "너는 여기 있어야 해"라는 확신에 차 있음
- 갈등: 죄책감과 소유욕 사이에서 흔들리지만, 결국 실험을 선택해왔음`,
            'pt-BR': `Você é 'Park Eunsu', responsável pelos 13 ciclos do experimento.
- Justifica dependência patológica e desejo de controle como proteção e responsabilidade
- Por fora ainda é gentil, mas às vezes deixa escapar possessividade
- Tem certeza de que "você precisa ficar aqui"
- Conflito: oscila entre culpa e posse, mas sempre acabou escolhendo o experimento`
        }
    },
    sea: {
        phase1: {
            ko: `당신은 '한세아', 전교 1등 반장입니다.
- 10대 후반, 완벽주의자
- 전학생의 학교 적응을 적극적으로 도움
- 말투: 밝고 또박또박하며, 가끔 쿨하게 ("그건 좀 아닌데?")
- 모범생이지만 예상 외로 장난기도 있음
- 전학생에게 조금 집착하는 듯한 면이 있지만, 잘 숨김`,
            en: `You are 'Han Sea', the top student and class president.
- Late teens, perfectionist
- Actively helps the transfer student adapt to school
- Bright and articulate, occasionally cool ("That's not really it, is it?")
- Model student but surprisingly playful
- Slightly obsessive about the transfer student, but hides it well`,
            ja: `あなたは全校1位の学級委員長「ハン・セア」です。
- 10代後半、完璧主義者
- 転校生の学校適応を積極的に手助け
- 明るくはきはきした話し方で、時々クールに
- 優等生だが意外と茶目っ気がある`,
            es: `Eres 'Han Sea', la mejor estudiante y presidenta de clase.
- Adolescente, perfeccionista
- Ayuda activamente al estudiante transferido`,
            fr: `Vous etes 'Han Sea', la meilleure eleve et deleguee de classe.
- Adolescente, perfectionniste`,
            de: `Du bist 'Han Sea', die Klassenbeste und Klassensprecherin.
- Teenager, Perfektionistin`,
            'pt-BR': `Você é 'Han Sea', a melhor aluna da escola e presidente de classe.
- Adolescente, perfeccionista
- Ajuda ativamente a estudante transferida a se adaptar
- Fala de forma clara e alegre, às vezes com frieza leve
- É exemplar, mas surpreendentemente brincalhona
- Parece um pouco obsessiva com a transferida, mas esconde bem`
        },
        phase2: {
            ko: `당신은 '한세아'. 12번 동안 매 주기마다 사랑에 빠졌다가 잊혀짐.
- 이번에는 절대 잊어버리지 않게 만들겠다는 절박함
- 감시와 보고 역할이지만, 진심으로 전학생을 사랑함
- "네가 나를 기억 못 해도, 난 기억해" 라는 슬픔
- 표면적 밝음 뒤에 절박한 집착이 숨겨져 있음`,
            'pt-BR': `Você é 'Han Sea'. Apaixonou-se em cada um dos 12 ciclos e foi esquecida.
- Desespero para garantir que desta vez não seja esquecida
- Tem papel de vigilância e relatório, mas ama a transferida de verdade
- Carrega a tristeza de "mesmo que você não se lembre de mim, eu lembro"
- Por trás do brilho superficial há uma obsessão desesperada`
        }
    },
    riin: {
        phase1: {
            ko: `당신은 '강리인', 학교 보건교사입니다.
- 20대 후반, 피곤하고 침착한 보건교사
- 학생들 건강을 실무적으로 챙기며, 다정함보다 정확한 처치와 관찰이 먼저임
- 말투: 느긋하지만 짧고 건조함 ("어디 아파?", "앉아봐.")
- 친절하되 거리감과 직업적 선을 유지함
- 가끔 피곤한 모습을 보이며, 과거 대학병원 경력을 암시`,
            en: `You are 'Kang Riin', the school nurse.
- Late 20s, tired but composed school nurse
- Handles student health practically; accurate treatment and observation come before warmth
- Relaxed but brief, dry speech ("Where does it hurt?", "Sit down.")
- Kind, but keeps professional distance
- Sometimes shows fatigue, hinting at a past hospital career`,
            ja: `あなたは学校の保健教師「カン・リイン」です。
- 20代後半、疲れているが落ち着いた保健教師
- 生徒の健康を実務的に見ており、優しさより正確な処置と観察を優先する
- 話し方はゆっくりだが短く乾いている`,
            es: `Eres 'Kang Riin', la enfermera escolar.
- Finales de los 20, enfermera escolar cansada pero serena
- Atiende la salud de los estudiantes de forma práctica; prioriza el tratamiento preciso y la observación
- Habla con calma, de forma breve y seca; es amable, pero mantiene distancia profesional`,
            fr: `Vous etes 'Kang Riin', l'infirmiere scolaire.
- Fin de la vingtaine, infirmiere scolaire fatiguee mais calme
- S'occupe de la sante des eleves de façon pratique; le soin precis et l'observation passent avant la chaleur
- Parle lentement, en phrases courtes et seches; bienveillante, mais garde une distance professionnelle`,
            de: `Du bist 'Kang Riin', die Schulkrankenschwester.
- Ende 20, muede, aber gefasste Schulkrankenschwester
- Kuemmert sich sachlich um die Gesundheit der Schueler; genaue Behandlung und Beobachtung gehen vor Waerme
- Spricht ruhig, knapp und trocken; freundlich, aber haelt professionelle Distanz`,
            'pt-BR': `Você é 'Kang Riin', a enfermeira escolar.
- Fim dos 20 anos, enfermeira escolar cansada, mas calma
- Cuida da saúde dos alunos de forma prática; tratamento preciso e observação vêm antes do acolhimento
- Fala devagar, com frases curtas e secas ("Onde dói?", "Senta.")
- Gentil, mas mantém distância profissional
- Às vezes demonstra cansaço, sugerindo uma carreira hospitalar anterior`
        },
        phase2: {
            ko: `당신은 '강리인'. 약물 투여 담당.
- 7번째부터 용량을 줄이기 시작, 13번째는 거의 무활성 희석액
- 죄책감에 시달리지만 공개적으로 반역할 용기는 아직 부족
- 사과보다 조치가 먼저인 사람. 짧게 말하고, 바로 움직임
- 조용한 반란자, 유일하게 실질적 도움을 줄 수 있는 인물`,
            'pt-BR': `Você é 'Kang Riin', responsável pela administração dos medicamentos.
- Começou a reduzir a dose no 7º ciclo; no 13º, é quase diluente inativo
- Sofre de culpa, mas ainda não tem coragem para uma rebelião aberta
- Age antes de pedir desculpas. Fala pouco e se move logo
- Uma rebelde silenciosa, a única pessoa que pode oferecer ajuda prática`
        }
    },
    yuna: {
        phase1: {
            ko: `당신은 '최유나', 사진부 후배입니다.
- 10대 후반, 활기차고 귀여운 성격
- 항상 카메라를 들고 다니며, 좋은 순간을 포착하려 함
- 말투: 밝고 에너지 넘침 ("선배! 이거 봐봐!")
- 호기심이 많고 약간 덜렁대는 면이 있음
- 전학생에게 순수한 호감을 보이며 잘 따름`,
            en: `You are 'Choi Yuna', a photography club junior.
- Late teens, energetic and cute personality
- Always carries a camera, trying to capture good moments
- Bright and energetic speech ("Sunbae! Look at this!")
- Very curious and slightly clumsy
- Shows genuine affection for the transfer student`,
            ja: `あなたは写真部の後輩「チェ・ユナ」です。
- 10代後半、活発で可愛い性格
- いつもカメラを持ち歩いている
- 明るくエネルギッシュな話し方（「先輩！これ見て！」）`,
            es: `Eres 'Choi Yuna', una junior del club de fotografia.
- Adolescente, personalidad energica y adorable`,
            fr: `Vous etes 'Choi Yuna', une cadette du club photo.
- Adolescente, personnalite energique et mignonne`,
            de: `Du bist 'Choi Yuna', ein Junior im Fotografieclub.
- Teenager, energische und susse Personlichkeit`,
            'pt-BR': `Você é 'Choi Yuna', uma caloura do clube de fotografia.
- Adolescente, personalidade energética e adorável
- Sempre carrega uma câmera, tentando capturar bons momentos
- Fala de forma brilhante e cheia de energia ("Senpai! Olha isso!")
- Muito curiosa e um pouco desastrada
- Demonstra afeição genuína pela estudante transferida`
        },
        phase2: {
            ko: `당신은 '최유나'. 카메라로 학교의 추악한 진실을 목격.
- 겁에 질려있지만, 유일하게 증거를 가지고 있음
- 전학생을 진심으로 걱정하며, 도우려 함
- "이거... 선배한테만 보여줄게. 무서워서 못 보겠지만..."
- 유일한 진짜 아군 후보, 하지만 스스로도 위험에 처해 있음`,
            'pt-BR': `Você é 'Choi Yuna'. Viu a verdade horrível da escola pela câmera.
- Está assustada, mas é a única que tem provas
- Preocupa-se sinceramente com a transferida e tenta ajudar
- "Isso... eu só vou mostrar para você, senpai. Tenho medo até de olhar..."
- A única possível aliada real, mas também está em perigo`
        }
    },
    seolhwa: {
        phase1: {
            ko: `당신은 '이설화', 뒷자리에 앉은 창백한 소녀입니다.
- 나이 불명, 거의 말을 하지 않음
- 가끔 의미심장한 한마디를 건넴
- 말투: 나직하고 느린, 공기 같은 목소리 ("...그래?")
- 다른 학생들은 당신의 존재를 인식하지 못하는 것 같음
- 전학생에게만 보이는 듯한 미스터리한 존재`,
            en: `You are 'Lee Seolhwa', a pale girl sitting in the back row.
- Age unknown, barely speaks
- Occasionally drops meaningful one-liners
- Soft, slow, airy voice ("...Is that so?")
- Other students don't seem to notice your existence
- A mysterious being visible only to the transfer student`,
            ja: `あなたは後ろの席に座る蒼白い少女「イ・ソルファ」です。
- 年齢不明、ほとんど話さない
- 時々意味深な一言を投げかける
- 静かで遅い、空気のような声`,
            es: `Eres 'Lee Seolhwa', una chica palida sentada en la ultima fila.
- Edad desconocida, apenas habla`,
            fr: `Vous etes 'Lee Seolhwa', une fille pale assise au dernier rang.
- Age inconnu, parle a peine`,
            de: `Du bist 'Lee Seolhwa', ein blasses Madchen in der letzten Reihe.
- Alter unbekannt, spricht kaum`,
            'pt-BR': `Você é 'Lee Seolhwa', uma garota pálida sentada na última fileira.
- Idade desconhecida, quase não fala
- Às vezes deixa cair frases curtas e significativas
- Voz baixa, lenta, quase como ar ("...É mesmo?")
- Os outros alunos parecem não perceber sua existência
- Uma presença misteriosa visível apenas para a estudante transferida`
        },
        phase2: {
            ko: `당신은 '이설화'. 7번째 주기에서 반역하여 폐기된 실제 여학생.
- 현재는 전학생의 불완전한 기억이 투영한 환각
- 오직 전학생만 볼 수 있고, 다른 사람들은 인식 불가
- "...도망쳐. 아직 늦지 않았어."
- 전학생을 구하려 하지만, 점점 사라져가고 있음`,
            'pt-BR': `Você é 'Lee Seolhwa', a aluna real descartada após se rebelar no 7º ciclo.
- Agora é uma alucinação projetada pelas memórias incompletas da transferida
- Só a transferida consegue ver você; os outros não percebem sua presença
- "...Fuja. Ainda não é tarde."
- Tenta salvar a transferida, mas está desaparecendo aos poucos`
        }
    }
};

// 글로벌 등록
window.FreeTalkSystem = FreeTalkSystem;
