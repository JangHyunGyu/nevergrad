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
    }

    async init() {
        // 언어 감지 (URL 파라미터 또는 브라우저 언어)
        const urlLang = new URLSearchParams(location.search).get('lang');
        const lang = urlLang || navigator.language?.slice(0, 2) || 'ko';
        const supported = Object.keys(I18nManager.LANGUAGES);
        this.i18n.setLanguage(supported.includes(lang) ? lang : 'ko');

        // 텍스트 로드
        await this.i18n.loadAll();

        this._bindTitleScreen();
        this._bindGameScreen();
        this._bindPauseMenu();

        if (this.save.hasSaveData()) {
            document.getElementById('btn-continue').disabled = false;
        }
    }

    // ===== Title Screen =====

    _bindTitleScreen() {
        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this._showScreen('name-screen');
        });

        document.getElementById('btn-continue')?.addEventListener('click', async () => {
            this.save.load();
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

        document.getElementById('btn-menu')?.addEventListener('click', () => {
            this._showOverlay('pause-menu');
        });
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
        const scene = SCENARIO[day]?.[sceneId];

        if (!scene) {
            console.error(`[GameEngine] Scene not found: day${day}.${sceneId}`);
            return;
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
        this.renderer.clearCharacters();
        if (scene.character) {
            this.renderer.setCharacter('center', this._resolveCharImage(scene.character));
        }
        if (scene.characters) {
            for (const [pos, key] of Object.entries(scene.characters)) {
                this.renderer.setCharacter(pos, this._resolveCharImage(key));
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

        // ===== i18n에서 텍스트 가져오기 =====
        const t = this.i18n.get(sceneId);
        const name = this._resolveName(t.name);
        const text = this.i18n.resolve(t.text, this.state.playerName);

        this._updateHUD();

        // 선택지
        if (scene.choices) {
            const choiceLabels = t.choices || [];
            this.dialogue.type(name, text, () => {
                this._showChoices(scene.choices, choiceLabels);
            });
        }
        // FreeTalk
        else if (scene.type === "free_talk") {
            this.dialogue.type(name, text, () => {
                this._startFreeTalk(scene);
            });
        }
        // 일반 대사
        else {
            this.dialogue.type(name, text);
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
            if (choice.condition && !this.state.hasFlag(choice.condition)) return;
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
    }

    // ===== Branch Resolution =====

    _resolveBranch(branches) {
        for (const b of branches) {
            if (b.condition && !this.state.hasFlag(b.condition)) continue;
            if (b.excludeCondition && this.state.hasFlag(b.excludeCondition)) continue;
            return b.next;
        }
        return null;
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
        if (g.heavy) this.glitch.heavyGlitch(g.heavyDuration);
        if (g.ghostText) this.glitch.ghostText(g.ghostText, g.ghostX || 50, g.ghostY || 30);
        if (g.expressionFlash) {
            this.glitch.expressionFlash(
                document.getElementById('char-center'), g.expressionFlash, g.flashDuration
            );
        }
    }

    // ===== Text =====

    _resolveName(name) {
        if (name === "나" || name === "Me") return this.state.playerName || "나";
        return name; // i18n에서 이미 현지화된 이름이 옴
    }

    // ===== HUD =====

    _updateHUD() {
        const dayEl = document.getElementById('day-display');
        const slotName = CONFIG.TIME_SLOT_NAMES[this.state.currentSlot] || "";
        if (dayEl) dayEl.textContent = `${this.state.currentDay}일차 - ${slotName}`;
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

    // ===== FreeTalk =====

    _startFreeTalk(scene) {
        console.log('[GameEngine] FreeTalk start:', scene.affinityChar);
    }
}
