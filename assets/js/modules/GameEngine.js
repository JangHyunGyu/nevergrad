/**
 * ============================================================================
 * GameEngine.js - 메인 게임 엔진
 * ============================================================================
 *
 * 모든 모듈을 조율하는 중앙 컨트롤러입니다.
 *
 * [i18n 구조]
 * - 시나리오 파일: 로직만 (배경, 분기, 스탯)
 * - i18n 파일: 텍스트만 (이름, 대사, 선택지)
 * - scene ID가 양쪽을 연결하는 키
 */

class GameEngine {
    constructor() {
        this.state = new StateManager();
        this.save = new SaveManager(this.state);
        this.i18n = new I18nManager();
        this.renderer = new SceneRenderer();
        this.dialogue = new DialogueSystem();
        this.choices = new ChoiceSystem();
        this.glitch = new GlitchSystem();

        this.currentSceneData = null;
        this.isTransitioning = false;

        // Quick menu state
        this.isAutoMode = false;
        this.isSkipMode = false;
        this._autoTimer = null;
        this._skipTimer = null;

        // Backlog
        this.backlog = [];
    }

    async init() {
        // 언어 감지 (URL 파라미터 또는 브라우저 언어)
        const urlLang = new URLSearchParams(location.search).get('lang');
        const lang = window.__NEVERGRAD_LANG__ || urlLang || navigator.language?.slice(0, 2) || 'ko';
        const supported = Object.keys(I18nManager.LANGUAGES);
        this.i18n.setLanguage(supported.includes(lang) ? lang : 'ko');

        // 텍스트 로드
        await this.i18n.loadAll();

        // HTML lang 속성 및 UI 텍스트 동적 적용
        this._applyUILocale();

        this._bindTitleScreen();
        this._bindGameScreen();
        this._bindPauseMenu();
        this._bindQuickMenu();
        this._bindBacklog();

        if (this.save.hasSaveData()) {
            document.getElementById('btn-continue').disabled = false;
        }
    }

    /**
     * UI 텍스트를 현재 언어로 적용 (HTML lang, title, meta, 버튼 등)
     */
    _applyUILocale() {
        const ui = (key) => this.i18n.getUI(key);

        // <html lang>
        document.documentElement.lang = this.i18n.currentLang;

        // <title>, <meta description>
        document.title = ui('metaTitle');
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = ui('metaDesc');

        // 타이틀 화면
        const titleEl = document.querySelector('.title-text');
        const subtitleEl = document.querySelector('.title-subtitle');
        if (titleEl) titleEl.textContent = ui('title');
        if (subtitleEl) subtitleEl.textContent = ui('subtitle');

        // 백로그 타이틀
        const backlogTitle = document.querySelector('.backlog-title');
        if (backlogTitle) backlogTitle.textContent = ui('backlogTitle') || '대사 기록';

        // 메뉴 버튼
        const btnMap = {
            'btn-new-game': 'newGame', 'btn-continue': 'continue', 'btn-gallery': 'gallery',
            'btn-start': 'start', 'btn-save': 'save', 'btn-load': 'load',
            'btn-settings': 'settings', 'btn-title': 'toTitle', 'btn-resume': 'resume',
            'ft-send': 'ftSend'
        };
        for (const [id, key] of Object.entries(btnMap)) {
            const el = document.getElementById(id);
            if (el) el.textContent = ui(key);
        }

        // 이름 입력 화면
        const namePrompt = document.querySelector('.name-prompt');
        const nameInput = document.getElementById('player-name-input');
        if (namePrompt) namePrompt.textContent = ui('namePrompt');
        if (nameInput) nameInput.placeholder = ui('namePlaceholder');

        // FreeTalk 입력
        const ftInput = document.getElementById('ft-input');
        if (ftInput) ftInput.placeholder = ui('ftPlaceholder');
    }

    // ===== Title Screen =====

    _bindTitleScreen() {
        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this._showScreen('name-screen');
        });

        document.getElementById('btn-continue')?.addEventListener('click', async () => {
            this.save.load();
            this.glitch.initConsoleEasterEgg(this.state.currentDay);
            if (this.state.currentDay >= 4) this.glitch.initTabGimmick(this.state);
            this._showScreen('game-screen');
            this._loadScene(this.state.currentScene);
        });

        document.getElementById('btn-start')?.addEventListener('click', () => {
            const name = document.getElementById('player-name-input')?.value.trim();
            if (!name) return;

            this.state.playerName = name;
            this.state.currentDay = 1;
            this.state.currentSlot = "morning";
            this.state.currentScene = "day1_opening";

            this.glitch.initConsoleEasterEgg(1);
            this._showScreen('game-screen');
            this._loadScene("day1_opening");
        });
    }

    // ===== Game Screen =====

    _bindGameScreen() {
        document.getElementById('dialogue-box')?.addEventListener('click', () => {
            if (this.isTransitioning) return;

            if (this.dialogue.isTyping) {
                this.dialogue.skipTyping();
                return;
            }

            this._advanceScene();
        });

        // btn-menu removed — replaced by quick menu
    }

    _bindPauseMenu() {
        document.getElementById('btn-resume')?.addEventListener('click', () => {
            this._hideOverlay('pause-menu');
        });

        document.getElementById('btn-save')?.addEventListener('click', () => {
            this.save.save();
            this._hideOverlay('pause-menu');
        });

        document.getElementById('btn-title')?.addEventListener('click', () => {
            this._hideOverlay('pause-menu');
            this._showScreen('title-screen');
        });
    }

    // ===== Scene Management =====

    _loadScene(sceneId) {
        const day = this.state.currentDay;
        const dayScenario = SCENARIO[day];
        let scene = dayScenario?.[sceneId];

        if (!scene) {
            console.error(`[GameEngine] Scene not found: day${day}.${sceneId}`);
            return;
        }

        // Scene-level condition: if not met, try fallback → _alt variant → walk to next sibling
        while (scene.condition && !this._checkCondition(scene.condition)) {
            // fallback 프로퍼티가 있으면 해당 씬으로 이동
            if (scene.fallback && dayScenario[scene.fallback]) {
                sceneId = scene.fallback;
                scene = dayScenario[sceneId];
                break;
            }
            const alt = dayScenario[sceneId + '_alt'];
            if (alt) {
                sceneId = sceneId + '_alt';
                scene = alt;
                break;
            }
            const keys = Object.keys(dayScenario);
            const idx = keys.indexOf(sceneId);
            if (idx < 0 || idx + 1 >= keys.length) break;
            sceneId = keys[idx + 1];
            scene = dayScenario[sceneId];
        }

        this.state.currentScene = sceneId;
        this.currentSceneData = scene;

        // 배경
        if (scene.background) {
            const bgPath = CONFIG.BACKGROUNDS[scene.background] || scene.background;
            this.renderer.setBackground(bgPath);
        }

        // 오버레이
        this.renderer.clearOverlays();
        if (scene.sunset) this.renderer.addOverlay('sunset');
        if (scene.night) this.renderer.addOverlay('night');
        if (scene.rain) this.renderer.addOverlay('rain');

        // 캐릭터 (키 기반: "sea_smile" → CONFIG.EXPRESSIONS에서 경로 조회)
        // character/characters가 명시된 경우만 변경, 없으면 이전 상태 유지
        // character: null 로 명시하면 캐릭터 제거
        if ('character' in scene || 'characters' in scene) {
            this.renderer.clearCharacters();
            if (scene.character) {
                this.renderer.setCharacter('center', this._resolveCharImage(scene.character));
            }
            if (scene.characters) {
                for (const [pos, key] of Object.entries(scene.characters)) {
                    if (key) this.renderer.setCharacter(pos, this._resolveCharImage(key));
                }
            }
        }

        if (scene.silhouette) this.renderer.setSilhouette(true);

        // BGM
        if (scene.bgm) this.renderer.playBGM(scene.bgm);

        // 플래그
        if (scene.setFlag) this.state.setFlag(scene.setFlag);
        if (scene.setFlags) this.state.setFlags(scene.setFlags);
        if (scene.clearFlags) scene.clearFlags.forEach(f => this.state.clearFlag(f));

        // 스탯
        if (scene.stats) {
            for (const [charId, changes] of Object.entries(scene.stats)) {
                for (const [stat, val] of Object.entries(changes)) {
                    this.state.changeStat(charId, stat, val);
                }
            }
        }

        // 증거
        if (scene.evidence) this.state.addEvidence(scene.evidence);

        // 글리치
        if (scene.glitch) this._handleGlitch(scene.glitch);

        // 엔딩 타이틀
        if (scene.endingTitle) {
            this._showEndingTitle(scene.endingTitle, scene.endingSubtitle);
        }

        // ===== i18n에서 텍스트 가져오기 =====
        const t = this.i18n.get(sceneId);
        const name = this._resolveName(t.name);
        const text = this.i18n.resolve(t.text, this.state.playerName);

        this._updateHUD();

        // 타이핑 옵션 (공포 연출: 느린 텍스트, 스킵 불가)
        const typeOpts = {};
        if (scene.typingSpeed) typeOpts.typingSpeed = scene.typingSpeed;
        if (scene.unskippable) typeOpts.unskippable = true;
        if (scene.messengerDelay) typeOpts.messengerDelay = scene.messengerDelay;

        // 타이핑 메서드 선택: 메신저 모드("..." 인디케이터 후 메시지) vs 일반
        const typeFn = scene.messengerDelay
            ? (n, t, cb, o) => this.dialogue.typeMessenger(n, t, cb, o)
            : (n, t, cb, o) => this.dialogue.type(n, t, cb, o);

        // 백로그 기록
        this._addToBacklog(name, text);

        // 선택지가 표시되면 Auto/Skip 중지
        const stopAutoOnChoices = () => {
            this._stopAuto();
            this._stopSkip();
        };

        // 선택지
        if (scene.choices) {
            const choiceLabels = (t.choices || []).map(l => this.i18n.resolve(l, this.state.playerName));
            typeFn(name, text, () => {
                stopAutoOnChoices();
                if (scene.timedChoice) {
                    this._showTimedChoices(scene, choiceLabels);
                } else {
                    this._showChoices(scene.choices, choiceLabels);
                }
            }, typeOpts);
        }
        // FreeTalk
        else if (scene.type === "free_talk") {
            typeFn(name, text, () => {
                stopAutoOnChoices();
                this._startFreeTalk(scene);
            }, typeOpts);
        }
        // 일반 대사
        else {
            typeFn(name, text, null, typeOpts);
        }
    }

    _advanceScene() {
        if (!this.currentSceneData) return;
        const scene = this.currentSceneData;

        if (scene.branches) {
            const next = this._resolveBranch(scene.branches);
            if (next) { this._loadScene(next); return; }
        }

        if (scene.affinityBranches) {
            const next = this._resolveAffinityBranch(scene);
            if (next) { this._loadScene(next); return; }
        }

        // 장르 전환 트리거 — 브라우저 탭 기믹 활성화
        if (scene.triggerGenreShift) {
            this.glitch.initTabGimmick(this.state);
        }

        // 날짜 변경 (day1_night_end → day2_morning_start 등)
        if (scene.changeDay) {
            this.state.currentDay = scene.changeDay;
            // 콘솔 이스터에그 — Day별 설화 메시지 업데이트
            this.glitch.initConsoleEasterEgg(scene.changeDay);
        }
        if (scene.changeSlot) {
            this.state.currentSlot = scene.changeSlot;
        }

        if (scene.next) this._loadScene(scene.next);
    }

    // ===== Choices =====

    _showChoices(choices, labels) {
        const panel = document.getElementById('choice-panel');
        if (!panel) return;

        panel.innerHTML = '';
        panel.classList.remove('hidden');

        let labelIdx = 0;
        choices.forEach((choice) => {
            if (choice.condition && !this._checkCondition(choice.condition)) return;
            if (choice.excludeCondition && this.state.hasFlag(choice.excludeCondition)) return;

            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = labels?.[labelIdx] || `선택 ${labelIdx + 1}`;
            labelIdx++;

            // 글리치: 선택지 깜빡임
            if (choice.glitchFlicker) {
                setTimeout(() => {
                    this.glitch.flickerChoice(btn, choice.glitchFlicker, btn.textContent);
                }, choice.glitchDelay || 1500);
            }

            btn.addEventListener('click', () => {
                panel.classList.add('hidden');
                if (choice.stats) {
                    for (const [charId, changes] of Object.entries(choice.stats)) {
                        for (const [stat, val] of Object.entries(changes)) {
                            this.state.changeStat(charId, stat, val);
                        }
                    }
                }
                if (choice.setFlags) this.state.setFlags(choice.setFlags);
                if (choice.next) this._loadScene(choice.next);
            });

            panel.appendChild(btn);
        });

        // 씬 글리치에서 예약된 forceChoice 처리
        if (typeof this._pendingForceChoice === 'number') {
            const forcedIdx = this._pendingForceChoice;
            this._pendingForceChoice = null;
            const buttons = panel.querySelectorAll('.choice-btn');
            if (buttons.length > 0) {
                this.glitch.forceChoice(Array.from(buttons), forcedIdx);
            }
        }

        // 씬 글리치에서 예약된 flickerChoice 처리
        if (this._pendingFlickerChoice) {
            const { index, text, duration } = this._pendingFlickerChoice;
            this._pendingFlickerChoice = null;
            const buttons = panel.querySelectorAll('.choice-btn');
            const btn = buttons[index];
            if (btn) {
                const flickerLabel = this.i18n.get(text)?.text || text;
                setTimeout(() => {
                    this.glitch.flickerChoice(btn, flickerLabel, btn.textContent);
                }, 1500);
            }
        }
    }

    // ===== Timed Choices (Day 4~5 타이머 선택지) =====

    /**
     * 타이머 선택지 표시 — 약물 패널티(drank_riin_drink) 시 타이머 감산
     */
    _showTimedChoices(scene, labels) {
        let timeMs = scene.timedChoice;

        // 약물 패널티: 리인 음료를 마셨으면 Day 4+ 타이머 -2초
        if (this.state.hasFlag('drank_riin_drink') && this.state.currentDay >= 4) {
            timeMs = Math.max(2000, timeMs - 2000);
        }

        // 약물 시야 흐림: 타이머 시작 직전 블랙아웃
        const startChoices = () => {
            this.choices.showTimedChoices(
                scene.choices,
                labels,
                Math.round(timeMs / 1000),
                -1, // timeout sentinel
                (idx) => this._handleTimedResult(scene, idx)
            );
        };

        if (this.state.hasFlag('drank_riin_drink') && this.state.currentDay >= 4) {
            this.glitch.drugBlur(500).then(startChoices);
        } else {
            startChoices();
        }
    }

    /**
     * 타이머 선택지 결과 처리
     */
    _handleTimedResult(scene, idx) {
        // 타임아웃 (idx < 0 또는 범위 초과)
        if (idx < 0 || idx >= scene.choices.length) {
            if (scene.timeoutNext) {
                this._loadScene(scene.timeoutNext);
            }
            return;
        }

        // 정상 선택
        const choice = scene.choices[idx];
        if (!choice) return;

        if (choice.stats) {
            for (const [charId, changes] of Object.entries(choice.stats)) {
                for (const [stat, val] of Object.entries(changes)) {
                    this.state.changeStat(charId, stat, val);
                }
            }
        }
        if (choice.setFlags) this.state.setFlags(choice.setFlags);
        if (choice.next) this._loadScene(choice.next);
    }

    // ===== Branch Resolution =====

    _resolveBranch(branches) {
        for (const b of branches) {
            if (b.condition && !this._checkCondition(b.condition)) continue;
            if (b.excludeCondition && this.state.hasFlag(b.excludeCondition)) continue;
            return b.next;
        }
        return null;
    }

    /**
     * condition이 문자열이면 단일 플래그, 배열이면 모두 충족 확인
     */
    _checkCondition(cond) {
        if (Array.isArray(cond)) return cond.every(c => this.state.hasFlag(c));
        return this.state.hasFlag(cond);
    }

    _resolveAffinityBranch(scene) {
        const charId = scene.affinityChar;
        if (!charId) return null;
        const aff = this.state.getDisplayAffinity(charId);
        const sorted = [...(scene.affinityBranches || [])].sort((a, b) => b.minAffinity - a.minAffinity);
        for (const b of sorted) {
            if (aff >= b.minAffinity) return b.next;
        }
        return null;
    }

    // ===== Character Image Resolution =====

    /**
     * "sea_smile" → CONFIG.EXPRESSIONS.sea.smile 경로로 변환
     */
    _resolveCharImage(key) {
        if (!key || key.includes('/')) return key; // 이미 경로면 그대로
        const [charId, expression] = key.split('_');
        return CONFIG.EXPRESSIONS[charId]?.[expression] || key;
    }

    // ===== Glitch =====

    _handleGlitch(g) {
        if (!g) return;
        if (g.noise) this.glitch.screenNoise(g.noiseDuration);
        if (g.silence) this.glitch.silenceDrop(this.renderer.bgmAudio, g.silenceDuration);
        if (g.themeShift) this.glitch.shiftTheme(g.themeShift);
        if (g.heavy || g.heavyGlitch) this.glitch.heavyGlitch(g.heavyDuration);
        if (g.ghostText) this.glitch.ghostText(g.ghostText, g.ghostX || 50, g.ghostY || 30);
        if (g.expressionFlash) {
            this.glitch.expressionFlash(
                document.getElementById('char-center'), g.expressionFlash, g.flashDuration
            );
        }
        if (g.screenShake) {
            const gameScreen = document.getElementById('game-screen');
            if (gameScreen) {
                gameScreen.classList.add('screen-shake');
                setTimeout(() => gameScreen.classList.remove('screen-shake'), g.shakeDuration || 500);
            }
        }
        if (g.shatterStatLabel) {
            const statEl = document.querySelector('.stat-label');
            if (statEl) this.glitch.shatterStatLabel(statEl);
        }
        if (typeof g.forceChoice === 'number') {
            this._pendingForceChoice = g.forceChoice;
        }
        if (typeof g.flickerChoice === 'number') {
            this._pendingFlickerChoice = {
                index: g.flickerChoice,
                text: g.flickerText,
                duration: g.flickerDuration || 100
            };
        }
    }

    // ===== Ending Title =====

    _showEndingTitle(title, subtitleKey) {
        const overlay = document.createElement('div');
        overlay.className = 'ending-title-overlay';

        const titleEl = document.createElement('div');
        titleEl.className = 'ending-title';
        titleEl.textContent = title;

        overlay.appendChild(titleEl);

        if (subtitleKey) {
            const subtitleText = this.i18n.get(subtitleKey)?.text || '';
            if (subtitleText) {
                const subEl = document.createElement('div');
                subEl.className = 'ending-subtitle';
                subEl.textContent = subtitleText;
                overlay.appendChild(subEl);
            }
        }

        document.getElementById('game-screen')?.appendChild(overlay);

        // 탭 기믹 해제
        this.glitch.stopTabGimmick();
    }

    // ===== Text =====

    _resolveName(name) {
        const selfNames = ["나", "Me", "Ich", "私", "Yo", "Moi"];
        if (selfNames.includes(name)) return this.state.playerName || name;
        return name;
    }

    // ===== HUD =====

    _updateHUD() {
        const dayEl = document.getElementById('day-display');
        if (!dayEl) return;
        const slots = this.i18n.getUI('slots') || {};
        const slotName = slots[this.state.currentSlot] || CONFIG.TIME_SLOT_NAMES[this.state.currentSlot] || "";
        const fmt = this.i18n.getUI('dayFormat') || "{day}일차 - {slot}";
        dayEl.textContent = fmt.replace('{day}', this.state.currentDay).replace('{slot}', slotName);
    }

    // ===== Screen =====

    _showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        const el = document.getElementById(id);
        if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
    }

    _showOverlay(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
    }

    _hideOverlay(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.add('hidden'); el.classList.remove('active'); }
    }

    // ===== Quick Menu =====

    _bindQuickMenu() {
        document.getElementById('qm-auto')?.addEventListener('click', () => this._toggleAuto());
        document.getElementById('qm-skip')?.addEventListener('click', () => this._toggleSkip());
        document.getElementById('qm-log')?.addEventListener('click', () => this._showOverlay('backlog-panel'));
        document.getElementById('qm-save')?.addEventListener('click', () => {
            this.save.save();
        });
        document.getElementById('qm-load')?.addEventListener('click', () => {
            if (this.save.hasSaveData()) {
                this.save.load();
                this._loadScene(this.state.currentScene);
            }
        });
        document.getElementById('qm-menu')?.addEventListener('click', () => {
            this._stopAuto();
            this._stopSkip();
            this._showOverlay('pause-menu');
        });
    }

    _toggleAuto() {
        if (this.isAutoMode) {
            this._stopAuto();
        } else {
            this._stopSkip();
            this.isAutoMode = true;
            document.getElementById('qm-auto')?.classList.add('active');
            this._autoAdvance();
        }
    }

    _stopAuto() {
        this.isAutoMode = false;
        clearTimeout(this._autoTimer);
        this._autoTimer = null;
        document.getElementById('qm-auto')?.classList.remove('active');
    }

    _autoAdvance() {
        if (!this.isAutoMode) return;
        this._autoTimer = setTimeout(() => {
            if (!this.isAutoMode) return;
            if (this.dialogue.isTyping) {
                this._autoAdvance();
                return;
            }
            this._advanceScene();
            this._autoAdvance();
        }, 2500);
    }

    _toggleSkip() {
        if (this.isSkipMode) {
            this._stopSkip();
        } else {
            this._stopAuto();
            this.isSkipMode = true;
            document.getElementById('qm-skip')?.classList.add('active');
            this._skipAdvance();
        }
    }

    _stopSkip() {
        this.isSkipMode = false;
        clearTimeout(this._skipTimer);
        this._skipTimer = null;
        document.getElementById('qm-skip')?.classList.remove('active');
    }

    _skipAdvance() {
        if (!this.isSkipMode) return;
        this._skipTimer = setTimeout(() => {
            if (!this.isSkipMode) return;
            if (this.dialogue.isTyping) {
                this.dialogue.skipTyping();
            }
            this._advanceScene();
            this._skipAdvance();
        }, 200);
    }

    // ===== Backlog =====

    _bindBacklog() {
        document.getElementById('backlog-close')?.addEventListener('click', () => {
            this._hideOverlay('backlog-panel');
        });

        // Click outside to close
        document.getElementById('backlog-panel')?.addEventListener('click', (e) => {
            if (e.target.id === 'backlog-panel') {
                this._hideOverlay('backlog-panel');
            }
        });
    }

    _addToBacklog(name, text) {
        this.backlog.push({ name, text });
        // Keep max 100 entries
        if (this.backlog.length > 100) this.backlog.shift();
        this._renderBacklog();
    }

    _renderBacklog() {
        const container = document.getElementById('backlog-content');
        if (!container) return;

        container.innerHTML = '';
        for (const entry of this.backlog) {
            const div = document.createElement('div');
            div.className = 'backlog-entry';

            if (entry.name) {
                const nameEl = document.createElement('div');
                nameEl.className = 'backlog-entry-name';
                nameEl.textContent = entry.name;
                div.appendChild(nameEl);
            }

            const textEl = document.createElement('div');
            textEl.className = 'backlog-entry-text';
            textEl.textContent = entry.text;
            div.appendChild(textEl);

            container.appendChild(div);
        }

        container.scrollTop = container.scrollHeight;
    }

    // ===== FreeTalk =====

    _startFreeTalk(scene) {
        console.log('[GameEngine] FreeTalk start:', scene.affinityChar);
    }
}
