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

/**
 * 사용자 설정(BGM/SFX 볼륨, 텍스트 속도)을 localStorage에 영속화.
 * AudioManager / CONFIG.TYPING_SPEED 와 직접 연결.
 */
class SettingsManager {
    constructor(audio) {
        this.audio = audio;
        this.STORAGE_KEY = 'nevergrad:settings:v1';
        this.defaults = { volBgm: 0.5, volSfx: 0.8, textSpeed: 30 };
        this.values = { ...this.defaults };
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) Object.assign(this.values, JSON.parse(raw));
        } catch (_) { /* 손상된 데이터는 기본값 사용 */ }
    }
    apply() {
        if (this.audio?.setVolume) {
            this.audio.setVolume('bgm', this.values.volBgm);
            this.audio.setVolume('sfx', this.values.volSfx);
        }
        if (typeof CONFIG !== 'undefined') {
            CONFIG.TYPING_SPEED = this.values.textSpeed;
        }
    }
    set(key, value) {
        this.values[key] = value;
        try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.values)); }
        catch (_) {}
        this.apply();
    }
    reset() {
        this.values = { ...this.defaults };
        try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.values)); }
        catch (_) {}
        this.apply();
    }
}

class GameEngine {
    constructor() {
        this.state = new StateManager();
        this.save = new SaveManager(this.state);
        this.i18n = new I18nManager();
        this.renderer = new SceneRenderer();
        this.audio = new AudioManager();
        this.dialogue = new DialogueSystem();
        this.choices = new ChoiceSystem();
        this.choiceAdvanced = typeof ChoiceSystemAdvanced !== 'undefined'
            ? new ChoiceSystemAdvanced(this)
            : null;
        this.glitch = new GlitchSystem();

        this.currentSceneData = null;
        this.isTransitioning = false;
        this._clickLocked = false;

        // Quick menu state
        this.isAutoMode = false;
        this.isSkipMode = false;
        this._autoTimer = null;
        this._autoAdvanceTimer = null;
        this._skipTimer = null;

        // Backlog
        this.backlog = [];

        // CAGE END 상태
        this._cageMode = false;
        this._cageClickCount = 0;
        this._cagePool = [];
        this._cageRepeatEffects = {};
        this._cageSeaVariants = {};
        this._cagePoolIndex = 0;
        this._cageExitBtn = null;
    }

    async init() {
        // 오디오 시스템 초기화
        this.audio.init();
        this.renderer.audio = this.audio;

        // 사용자 설정 로드 + AudioManager·CONFIG.TYPING_SPEED 적용
        this.settings = new SettingsManager(this.audio);
        this.settings.apply();

        // 언어 감지 (URL 파라미터 또는 브라우저 언어)
        const urlLang = new URLSearchParams(location.search).get('lang');
        const requestedLang = window.__NEVERGRAD_LANG__ || urlLang || navigator.language || 'ko';
        const lang = String(requestedLang).toLowerCase().startsWith('pt')
            ? 'pt' : String(requestedLang).slice(0, 2);
        const supported = Object.keys(I18nManager.LANGUAGES);
        this.i18n.setLanguage(supported.includes(lang) ? lang : 'ko');

        // 텍스트 로드
        await this.i18n.loadAll();

        // HTML lang 속성 및 UI 텍스트 동적 적용
        this._applyUILocale();

        this._bindTitleScreen();
        this._bindGameScreen();
        this._bindPauseMenu();
        this._bindSettings();
        this._bindQuickMenu();
        this._bindBacklog();

        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) continueBtn.disabled = !this.save.hasSaveData();
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
        if (backlogTitle) backlogTitle.textContent = ui('backlogTitle') || 'Backlog';

        // 메뉴 버튼
        const btnMap = {
            'btn-new-game': 'newGame', 'btn-continue': 'continue', 'btn-gallery': 'gallery',
            'btn-start': 'start', 'btn-save': 'save', 'btn-load': 'load',
            'btn-settings': 'settings', 'btn-title': 'toTitle', 'btn-resume': 'resume',
            'ft-send': 'ftSend',
            'settings-title': 'settings',
            'settings-bgm-label': 'settingsBgm', 'settings-sfx-label': 'settingsSfx',
            'settings-text-speed-label': 'settingsTextSpeed',
            'settings-fullscreen-label': 'settingsFullscreen',
            'settings-reset': 'settingsReset'
        };
        for (const [id, key] of Object.entries(btnMap)) {
            const el = document.getElementById(id);
            if (el) el.textContent = ui(key);
        }
        // 풀스크린 토글 ON/OFF 라벨은 현재 상태에 따라
        if (typeof this._refreshFullscreenLabel === 'function') this._refreshFullscreenLabel();

        // 이름 입력 화면
        const namePrompt = document.querySelector('.name-prompt');
        const nameInput = document.getElementById('player-name-input');
        if (namePrompt) namePrompt.textContent = ui('namePrompt');
        if (nameInput) nameInput.placeholder = ui('namePlaceholder');

        // FreeTalk 입력
        const ftInput = document.getElementById('ft-input');
        if (ftInput) ftInput.placeholder = ui('ftPlaceholder');

        // 갤러리 화면
        const galleryTitle = document.querySelector('.gallery-title');
        const galleryBack = document.getElementById('gallery-back');
        const galleryProgressLabel = document.querySelector('.gallery-progress-label');
        if (galleryTitle) galleryTitle.textContent = ui('galleryTitle');
        if (galleryBack) galleryBack.textContent = ui('galleryBack');
        if (galleryProgressLabel) galleryProgressLabel.textContent = ui('galleryProgress');
    }

    // ===== Title Screen =====

    _bindTitleScreen() {
        // NG+ 타이틀 화면 변조 (SCENARIO.md 5002-5012)
        if (this.glitchAdvanced && this.save.isNewGamePlus()) {
            this.glitchAdvanced.applyNGPlusTitleCorruption(this.save);
            this.glitchAdvanced.applyNGPlusTitleBGM(this.audio);
        }

        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this.audio?.playUIClick();
            // 모바일 풀스크린 진입 (유저 제스처 필요)
            if (typeof requestMobileFullscreen === 'function') requestMobileFullscreen();
            this._showScreen('name-screen');
            this._attachNameScreenKBAvoidance();
        });

        document.getElementById('btn-continue')?.addEventListener('click', async () => {
            this.audio?.playUIClick();
            // 모바일 풀스크린 진입 (유저 제스처 필요)
            if (typeof requestMobileFullscreen === 'function') requestMobileFullscreen();
            this.save.load();
            this.state.resumeRun();
            this._endingReached = false;
            // Cupid 크로스오버 플래그 설정 (세이브 데이터에 포함되지 않으므로 매번 감지)
            if (this.crossover?.hasPlayedCupid()) {
                this.state.setFlag('cupid_played');
                const heroine = this.crossover.getData?.()?.heroine;
                if (heroine) this.state.setFlag(`cupid_heroine_${heroine}`);
            }
            if (this.save.isNewGamePlus()) this.state.setFlag('new_game_plus');
            this.glitch.initConsoleEasterEgg(this.state.currentDay);
            if (this.state.currentDay >= 4) this.glitch.initTabGimmick(this.state);

            // 이미지 프리로드 후 게임 화면 표시
            if (this._preloadImages) {
                await this._preloadImages('game-screen');
            } else {
                this._showScreen('game-screen');
            }
            this._loadScene(this.state.currentScene);
        });

        document.getElementById('btn-start')?.addEventListener('click', async () => {
            this.audio?.playUIClick();
            this._detachNameScreenKBAvoidance();
            const name = document.getElementById('player-name-input')?.value.trim();
            if (!name) return;

            this.state.startNewRun();
            this.state.playerName = this._sanitizeName(name);
            this.state.currentDay = 1;
            this.state.currentSlot = "morning";
            this.state.currentScene = "day1_opening_1";
            this._endingReached = false;

            // Cupid 크로스오버 플래그 설정
            if (this.crossover?.hasPlayedCupid()) {
                this.state.setFlag('cupid_played');
                const heroine = this.crossover.getData?.()?.heroine;
                if (heroine) this.state.setFlag(`cupid_heroine_${heroine}`);
            }
            if (this.save.isNewGamePlus()) this.state.setFlag('new_game_plus');

            this.glitch.initConsoleEasterEgg(1);

            // 이미지 프리로드 후 게임 화면 표시
            if (this._preloadImages) {
                await this._preloadImages('game-screen');
            } else {
                this._showScreen('game-screen');
            }
            this._loadScene("day1_opening_1");
        });
    }

    // ===== Game Screen =====

    _bindGameScreen() {
        document.getElementById('dialogue-box')?.addEventListener('click', () => {
            if (this._clickLocked) return;
            this.audio?.playUIDialogueAdvance();

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
            this.audio?.playUIMenuClose();
            this._hideOverlay('pause-menu');
        });

        document.getElementById('btn-save')?.addEventListener('click', () => {
            this.audio?.playUIClick();
            this._hideOverlay('pause-menu');
            this._openSlotSelector('save');
        });

        document.getElementById('btn-load')?.addEventListener('click', () => {
            this.audio?.playUIClick();
            this._hideOverlay('pause-menu');
            this._openSlotSelector('load');
        });

        document.getElementById('btn-settings')?.addEventListener('click', () => {
            this.audio?.playUIClick();
            this._hideOverlay('pause-menu');
            this._openSettings();
        });

        document.getElementById('btn-title')?.addEventListener('click', () => {
            this.audio?.playUIClick();
            this._hideOverlay('pause-menu');
            this._showScreen('title-screen');
        });
    }

    // ===== Settings Overlay =====

    /**
     * 슬라이더 값(0~100) ↔ TYPING_SPEED(ms) 변환.
     * slider 0 = 100ms(느림), slider 100 = 1ms(즉시), 기본 30ms = slider 70.
     */
    _sliderToTypingSpeed(s) {
        const v = Math.max(0, Math.min(100, Number(s) || 0));
        return Math.max(1, Math.round(100 - v));
    }
    _typingSpeedToSlider(ms) {
        const v = Math.max(1, Math.min(100, Number(ms) || 30));
        return 100 - v;
    }

    _bindSettings() {
        document.getElementById('settings-close')?.addEventListener('click', () => {
            this.audio?.playUIMenuClose?.();
            this._hideOverlay('settings-overlay');
        });

        const bgm = document.getElementById('settings-bgm');
        const bgmVal = document.getElementById('settings-bgm-value');
        bgm?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value, 10);
            this.settings.set('volBgm', v / 100);
            if (bgmVal) bgmVal.textContent = v + '%';
        });

        const sfx = document.getElementById('settings-sfx');
        const sfxVal = document.getElementById('settings-sfx-value');
        sfx?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value, 10);
            this.settings.set('volSfx', v / 100);
            if (sfxVal) sfxVal.textContent = v + '%';
        });

        const ts = document.getElementById('settings-text-speed');
        const tsVal = document.getElementById('settings-text-speed-value');
        ts?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value, 10);
            this.settings.set('textSpeed', this._sliderToTypingSpeed(v));
            if (tsVal) tsVal.textContent = v + '%';
        });

        document.getElementById('settings-fullscreen-toggle')?.addEventListener('click', () => {
            this.audio?.playUIClick?.();
            const inFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
            if (inFs) {
                (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
            } else if (typeof requestMobileFullscreen === 'function') {
                requestMobileFullscreen();
            }
            // 비동기 변경이므로 다음 틱에 라벨 갱신
            setTimeout(() => this._refreshFullscreenLabel(), 50);
        });

        document.getElementById('settings-reset')?.addEventListener('click', () => {
            this.audio?.playUIClick?.();
            this.settings.reset();
            this._populateSettingsOverlay();
        });

        // 풀스크린 상태가 외부 변경(ESC 등)으로 바뀔 때 라벨 동기화
        document.addEventListener('fullscreenchange', () => this._refreshFullscreenLabel());
        document.addEventListener('webkitfullscreenchange', () => this._refreshFullscreenLabel());
    }

    _openSettings() {
        this._populateSettingsOverlay();
        this._showOverlay('settings-overlay');
    }

    _populateSettingsOverlay() {
        const v = this.settings?.values;
        if (!v) return;
        const bgmPct = Math.round((v.volBgm ?? 0.5) * 100);
        const sfxPct = Math.round((v.volSfx ?? 0.8) * 100);
        const tsSlider = this._typingSpeedToSlider(v.textSpeed ?? 30);

        const set = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };
        set('settings-bgm', 'value', String(bgmPct));
        set('settings-bgm-value', 'textContent', bgmPct + '%');
        set('settings-sfx', 'value', String(sfxPct));
        set('settings-sfx-value', 'textContent', sfxPct + '%');
        set('settings-text-speed', 'value', String(tsSlider));
        set('settings-text-speed-value', 'textContent', tsSlider + '%');

        this._refreshFullscreenLabel();
    }

    _refreshFullscreenLabel() {
        const btn = document.getElementById('settings-fullscreen-toggle');
        if (!btn) return;
        const inFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        const ui = (k) => this.i18n?.getUI?.(k) || k;
        btn.textContent = inFs ? ui('settingsOn') : ui('settingsOff');
        btn.classList.toggle('is-on', inFs);
    }

    // ===== Scene Management =====

    _loadScene(sceneId) {
        clearTimeout(this._autoAdvanceTimer);

        // 씬 ID 접두사로 slot 자동 추론 (HUD 시간대 불일치 방지)
        const slotMatch = /^day\d_(morning|lunch|afterschool|night)_/.exec(sceneId);
        if (slotMatch && this.state.currentSlot !== slotMatch[1]) {
            this.state.currentSlot = slotMatch[1];
        }

        // NG+ 기시감 텍스트: SKIP 버튼 제거됨 → 씬 진입 시 자동 표시
        // (SCENARIO.md 5467-5477 "스킵 시스템 변조" 기믹을 일반 플레이에서도 체험)
        if (this.glitchAdvanced && this.save?.isNewGamePlus()) {
            this.glitchAdvanced.checkSkipDejaVu(sceneId, this.save);
        }

        // 자동저장 (슬롯 0) — 씬 전환 시 현재 상태를 저장
        this.state.currentScene = sceneId;
        this.save.save();

        // 거울 fog 상시 연출: 다음 씬이 mirrorFog 포함 안 하면 제거
        const nextScene = SCENARIO[this.state.currentDay]?.[sceneId];
        if (this.glitch?._mirrorFogEl && !nextScene?.glitch?.mirrorFog) {
            this.glitch.hideMirrorFog();
        }

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
        this._applySceneDirectives(sceneId, scene);

        if (this.deviceGimmick?.setupOrientationHijack) {
            this.deviceGimmick.setupOrientationHijack(this.state.currentDay);
        }

        // 배경
        if (scene.background) {
            const bgPath = CONFIG.BACKGROUNDS[scene.background] || scene.background;
            this.renderer.setBackground(bgPath);
        } else if (/^day5_ending_true_2[6-7]$/.test(sceneId)) {
            this.renderer.setBackground(CONFIG.BACKGROUNDS.news_article);
        } else if (/^day5_morning_true_([2-9]|1[0-9]|2[0-7])$/.test(sceneId)) {
            this.renderer.setBackground(CONFIG.BACKGROUNDS.lab_documents);
        }

        // 오버레이
        this.renderer.setTimeOfDay(this._resolveSceneTimeOfDay(sceneId, scene));

        // 캐릭터 (키 기반: "sea_smile" → CONFIG.EXPRESSIONS에서 경로 조회)
        // character/characters가 명시된 경우만 변경, 없으면 이전 상태 유지
        // character: null 로 명시하면 캐릭터 퇴장
        // charOpacity: 0~1 — 메신저/문자 씬에서 캐릭터를 반투명으로 표시
        // 전환 중 빠른 클릭 방지 (300ms 잠금)
        if ('character' in scene || 'characters' in scene) {
            this._clickLocked = true;
            clearTimeout(this._clickLockTimer);
            this._clickLockTimer = setTimeout(() => { this._clickLocked = false; }, 300);
            const opacity = scene.charOpacity;
            if (scene.character === null && !scene.characters) {
                // 명시적 null — 캐릭터 퇴장
                this.renderer.clearCharacters();
            } else {
                if (scene.character) {
                    this.renderer.setCharacter('center', this._resolveCharImage(scene.character), opacity);
                }
                if (scene.characters) {
                    for (const [pos, key] of Object.entries(scene.characters)) {
                        if (key) this.renderer.setCharacter(pos, this._resolveCharImage(key), opacity);
                    }
                }
            }
        }

        if (scene.silhouette) this.renderer.setSilhouette(true);

        // BGM
        if (typeof scene.bgm === 'string') {
            this.renderer.playBGM(scene.bgm);
            this.state.currentBGM = scene.bgm;
        } else if (scene.bgm && typeof scene.bgm === 'object') {
            // { fadeOut: ms } → BGM 정지 with fade
            const fadeOut = (scene.bgm.fadeOut || 1000) / 1000;
            this.audio?.stopBGM(fadeOut);
            this.state.currentBGM = null;
        } else if (scene.bgm === null) {
            this.audio?.stopBGM(1.0);
            this.state.currentBGM = null;
        } else if (this.state.currentBGM && this.audio?.getCurrentBGM?.() !== this.state.currentBGM) {
            // 세이브에서 mid-scene 로드 시 BGM 복원
            // (씬에 bgm 필드가 없고, AudioManager에 재생 중인 BGM이 state와 다르면 = 페이지 새로고침/이어하기)
            this.renderer.playBGM(this.state.currentBGM);
        }

        // SFX 정지 (활성 sfx를 페이드아웃) — 캐릭터 등장/씬 전환 시 잔여 발자국 등 차단용
        // true: 전체 정지 / 문자열: 해당 파일만 정지 / 객체: { file, fadeOut }
        if (scene.stopSfx) {
            if (scene.stopSfx === true) {
                this.audio?.stopSFX(null, 0.5);
            } else if (typeof scene.stopSfx === 'string') {
                this.audio?.stopSFX(scene.stopSfx, 0.5);
            } else if (typeof scene.stopSfx === 'object') {
                this.audio?.stopSFX(scene.stopSfx.file ?? null, scene.stopSfx.fadeOut ?? 0.5);
            }
        }

        // SFX
        if (scene.sfx) {
            const sfxList = Array.isArray(scene.sfx) ? scene.sfx : [scene.sfx];
            sfxList.forEach(s => {
                if (typeof s === 'string') {
                    this.audio.playSFX(s);
                } else if (s && s.file) {
                    this.audio.playSFX(s.file, { volume: s.volume, playbackRate: s.playbackRate });
                }
            });
        }

        // 플래그
        if (scene.setFlag) this.state.setFlag(scene.setFlag);
        if (scene.setFlags) this.state.setFlags(scene.setFlags);
        if (scene.clearFlags) scene.clearFlags.forEach(f => this.state.clearFlag(f));

        // 스탯: 일반 씬의 stats는 무시 (선택지 결과에서만 변경)
        // scene.stats는 기존 호환용으로 남겨두되 적용하지 않음

        // 증거
        if (scene.evidence) this.state.addEvidence(scene.evidence);

        // 지속 오버레이(adminPanel/mirrorReflection/mirrorWipe) 경계 정리
        this._cleanupPersistentOverlays(sceneId, scene);

        // 글리치
        if (scene.glitch) this._handleGlitch(scene.glitch);

        // 실시간 시계 연동 (SCENARIO.md 5652-5658)
        // 자정~새벽 3시 Day 4~5 밤 씬 진입 시 단 1회 팬텀 지문
        this._checkLatenightGimmick(sceneId);

        // 이어폰 미감지 — 거울 씬 직전 팬텀 힌트 (SCENARIO.md 5623)
        this._checkHeadphoneHint(sceneId);

        // 디바이스 기믹: 진동 + PC용 시각 효과
        if (scene.vibrate) {
            if (this.deviceGimmick) this.deviceGimmick.vibrate(scene.vibrate);
            this._vibrateVisual(scene.vibrate);
        }

        // 디바이스 기믹: 가짜 푸시 알림
        if (scene.pushNotif && this.deviceGimmick) {
            const msg = scene.pushNotif.body || scene.pushNotif.title || '';
            this.deviceGimmick.showFakeEmergencyAlert(msg, scene.pushNotif.duration || 4000);
        }

        // 엔딩 타이틀
        if (scene.endingTitle) {
            this._showEndingTitle(scene.endingTitle, scene.endingSubtitle);
            // 갤러리: 엔딩 달성 기록
            if (this.gallery) this.gallery.unlockEnding(scene.endingTitle);
            // 세이브 메타: playCount / endingsSeen / lastEnding 기록
            //   "TRUE END" → "TRUE" 로 정규화 (SaveManager.recordEnding 규약)
            if (this.save) {
                const endingKey = scene.endingTitle.replace(/\s*END\s*$/i, '').trim().toUpperCase();
                this.save.recordEnding(endingKey);
            }
            // 앱 아이콘 변이 재평가 (COMPLICIT → thirteen, 1회차 후 → red 등)
            if (this.favicon) {
                this.favicon.sync({
                    saveMeta: this.save?.getMeta?.(),
                    state: this.state
                });
            }
        }

        // CAGE END 무한 루프 진입
        if (scene.cageLoop) {
            this._enterCageMode();
            return;
        }

        // Day 5 노이즈 필터 (SCENARIO.md 3408)
        if (this.state.currentDay >= 5 && this.glitchAdvanced) {
            this.glitchAdvanced.enableDay5NoiseFilter();
        }

        // 스크린샷 감지 컨텍스트 업데이트
        if (this.metaHorror) {
            if (sceneId.includes('save_slot') || sceneId.includes('day4_night_save')) {
                this.metaHorror.setScreenshotContext('save_slot');
            } else if (sceneId.includes('mirror_13') || sceneId.includes('mirror_2nd')) {
                this.metaHorror.setScreenshotContext('mirror_13faces');
            } else if (sceneId.includes('day5_docs') || sceneId.includes('day5_basement')) {
                this.metaHorror.setScreenshotContext('day5_docs');
            } else if (sceneId.includes('complicit_sign')) {
                this.metaHorror.setScreenshotContext('complicit_sign');
            } else {
                this.metaHorror.setScreenshotContext(null);
            }
        }

        // ===== i18n에서 텍스트 가져오기 =====
        const t = this.i18n.get(sceneId);
        const name = this._resolveName(t.name);
        const extraVars = this._buildSceneVars(sceneId, scene);
        const text = this.i18n.resolve(t.text, this.state.playerName, extraVars);
        this.renderer.setMediaOverlay?.(this._buildSceneMediaOverlay(sceneId, scene, t, text, extraVars));

        this._updateHUD();

        // NG+ 대사 미세 왜곡 (SCENARIO.md 5049-5062)
        if (this.glitchAdvanced && this.save.isNewGamePlus()) {
            const textEl = document.getElementById('dialogue-text');
            this.glitchAdvanced.applyDialogueDistortion(sceneId, textEl, this.save);
        }

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
        if (text) this._addToBacklog(name, text);

        // 선택지가 표시되면 Auto/Skip 중지
        const stopAutoOnChoices = () => {
            this._stopAuto();
            this._stopSkip();
        };

        // 선택지
        if (this._shouldAutoAdvanceSilentScene(scene, text)) {
            this._queueAutoAdvance(scene);
            return;
        }

        if (scene.choices) {
            const choiceLabels = (t.choices || []).map(
                l => this.i18n.resolve(l, this.state.playerName, extraVars)
            );
            typeFn(name, text, () => {
                stopAutoOnChoices();
                if (scene.timedChoice) {
                    this._showTimedChoices(scene, choiceLabels);
                } else {
                    this._showChoices(scene.choices, choiceLabels);
                }
            }, typeOpts);
        }
        // Scene interaction
        else if (scene.interaction) {
            typeFn(name, text, () => {
                stopAutoOnChoices();
                this._startSceneInteraction(scene.interaction);
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
            typeFn(name, text, scene.autoAdvance ? () => this._queueAutoAdvance(scene) : null, typeOpts);
        }
    }

    _applySceneDirectives(sceneId, scene) {
        if (!scene) return;

        if (scene.setMode) {
            const mode = CONFIG.STAT_MODES?.[scene.setMode] || String(scene.setMode).toLowerCase();
            this.state.mode = mode;
            this.glitch.shiftTheme?.(mode);
        }

        if (scene.glitchLevel !== undefined) {
            const rawLevel = scene.glitchLevel;
            const level = typeof rawLevel === 'string'
                ? CONFIG.GLITCH_LEVELS?.[rawLevel]
                : rawLevel;
            if (level !== undefined) this.state.setGlitchLevel?.(level);
        }

        if (scene.dejavu) {
            this.state.setFlag?.(`dejavu_${sceneId}`);
            this.glitch.screenNoise?.(120);
        }

        if (scene.bgm_fade?.to) {
            this.renderer.playBGM(scene.bgm_fade.to);
            this.state.currentBGM = scene.bgm_fade.to;
        }

        if (scene.fadeIn) this._playSceneFade('in', scene.fadeDuration || 700);
        if (scene.fadeOut) this._playSceneFade('out', scene.fadeDuration || 700);

        if (scene.metaEffect && !scene.glitch?.endingCreditSaveUI) {
            this._handleMetaEffect(scene.metaEffect);
        }
    }

    _resolveSceneTimeOfDay(sceneId, scene) {
        if (!scene || scene.noTimeFilter || scene.timeOfDay === false || scene.timeOfDay === null) {
            return null;
        }

        if (typeof scene.timeOfDay === 'string') {
            return scene.timeOfDay || null;
        }

        if (scene.dark) return 'dark';
        if (scene.dawn) return 'dawn';
        if (scene.rain) return 'rain';
        if (scene.night) return 'night';
        if (scene.sunset) return 'sunset';
        if (scene.morning) return 'morning';

        const backgroundKey = scene.background ? String(scene.background) : '';
        const backgroundPath = backgroundKey
            ? (CONFIG.BACKGROUNDS?.[backgroundKey] || backgroundKey)
            : '';

        if (this._isTimeFilterExemptBackground(backgroundPath)) {
            return null;
        }

        const backgroundTime = this._timeOfDayFromBackground(backgroundKey);
        if (backgroundTime) return backgroundTime;

        const slot = this._slotFromSceneId(sceneId) || this.state.currentSlot;
        return this._timeOfDayFromSlot(slot);
    }

    _slotFromSceneId(sceneId) {
        return /^day\d_(morning|lunch|afterschool|night)_/.exec(sceneId || '')?.[1] || null;
    }

    _timeOfDayFromSlot(slot) {
        const slotMap = {
            morning: 'morning',
            lunch: null,
            afterschool: 'sunset',
            night: 'night'
        };
        return Object.prototype.hasOwnProperty.call(slotMap, slot) ? slotMap[slot] : null;
    }

    _timeOfDayFromBackground(backgroundKey) {
        if (!backgroundKey) return null;
        const key = String(backgroundKey).toLowerCase();
        if (/(^|_)dark($|_)/.test(key)) return 'dark';
        if (/(^|_)dawn($|_)/.test(key)) return 'dawn';
        if (/(^|_)rain($|_)/.test(key)) return 'rain';
        if (/(^|_)night($|_)/.test(key)) return 'night';
        if (/(^|_)(sunset|evening|afternoon)($|_)/.test(key)) return 'sunset';
        if (/(^|_)morning($|_)/.test(key)) return 'morning';
        return null;
    }

    _isTimeFilterExemptBackground(backgroundPath) {
        const path = String(backgroundPath || '').replace(/\\/g, '/').toLowerCase();
        return path.includes('/images/cg/')
            || path.includes('/images/evidence/')
            || path.endsWith('/background/black.png');
    }

    _buildSceneMediaOverlay(sceneId, scene, t, resolvedText, extraVars) {
        if (!sceneId || !this.renderer?.setMediaOverlay) return null;

        if (scene.background === 'news_article' || /^day5_ending_true_2[5-7]$/.test(sceneId)) {
            return this._buildNewsArticleMedia(extraVars);
        }

        const labMediaScene = scene.background === 'lab_documents'
            || /^day5_morning_true_([1-9]|1[0-3]|1[6-9]|2[0-7])$/.test(sceneId);
        if (labMediaScene && !scene.character) {
            return this._buildLabDocumentMedia(sceneId, resolvedText);
        }

        return null;
    }

    _mediaLocale() {
        const lang = this.i18n?.currentLang || 'ko';
        const copy = {
            ko: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3개월 후 · 사회', live: '속보',
                investigation: '탐사보도', related: '관련 보도', chart: '피해 신고 추이',
                evidence: '확보된 증거', witness: '주요 제보자 기록',
                newsBadges: ['비인가 시설', '임상시험', '기억장애'],
                org: 'EDINA FOUNDATION', stamp: '대외비', fileId: 'NVG-13 / FINAL',
                reportTitle: '프로젝트 네버그라드 최종 보고서', sideLabel: '피험자 신원 패키지',
                note: '관찰 기록과 투약 기록을 대조 중', footer: '스캔 신뢰도',
                cycle: '주기', subject1: '김도진', subject7: '김태호', done: '처리 완료',
                anomaly: '이설화 접촉 / 탈출 공모', active: '진행 중'
            },
            en: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3 months later · Society', live: 'LIVE',
                investigation: 'Investigation', related: 'Related reports', chart: 'Victim reports',
                evidence: 'Evidence secured', witness: 'Key witness record',
                newsBadges: ['Unlicensed facility', 'Clinical trials', 'Memory disorders'],
                org: 'EDINA FOUNDATION', stamp: 'CONFIDENTIAL', fileId: 'NVG-13 / FINAL',
                reportTitle: 'Project Nevergrad Final Report', sideLabel: 'Subject identity package',
                note: 'Cross-checking observation logs and dosage records', footer: 'Scan confidence',
                cycle: 'Cycle', subject1: 'Kim Dojin', subject7: 'Kim Taeho', done: 'Processed',
                anomaly: 'Seolhwa contact / escape conspiracy', active: 'Active'
            },
            ja: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3か月後 · 社会', live: '速報',
                investigation: '調査報道', related: '関連報道', chart: '被害申告の推移',
                evidence: '確保済み証拠', witness: '主要通報者記録',
                newsBadges: ['無認可施設', '臨床試験', '記憶障害'],
                org: 'EDINA FOUNDATION', stamp: '機密', fileId: 'NVG-13 / FINAL',
                reportTitle: 'プロジェクト・ネバーグラード 最終報告書', sideLabel: '被験者IDパッケージ',
                note: '観察記録と投薬記録を照合中', footer: 'スキャン信頼度',
                cycle: '周回', subject1: 'キム・ドジン', subject7: 'キム・テホ', done: '処理完了',
                anomaly: 'イ・ソルファ接触 / 脱出共謀', active: '進行中'
            },
            es: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3 meses después · Sociedad', live: 'DIRECTO',
                investigation: 'Investigación', related: 'Informes relacionados', chart: 'Reportes de víctimas',
                evidence: 'Pruebas aseguradas', witness: 'Registro de testigo clave',
                newsBadges: ['Instalación no autorizada', 'Ensayos clínicos', 'Trastornos de memoria'],
                org: 'FUNDACIÓN EDINA', stamp: 'CONFIDENCIAL', fileId: 'NVG-13 / FINAL',
                reportTitle: 'Proyecto Nevergrad — Informe Final', sideLabel: 'Paquete de identidad del sujeto',
                note: 'Cotejando registros de observación y dosificación', footer: 'Confianza del escaneo',
                cycle: 'Ciclo', subject1: 'Kim Dojin', subject7: 'Kim Taeho', done: 'Procesado',
                anomaly: 'Contacto con Seolhwa / plan de fuga', active: 'Activo'
            },
            fr: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3 mois plus tard · Société', live: 'DIRECT',
                investigation: 'Enquête', related: 'Articles liés', chart: 'Signalements de victimes',
                evidence: 'Preuves sécurisées', witness: 'Dossier du témoin clé',
                newsBadges: ['Site non agréé', 'Essais cliniques', 'Troubles de mémoire'],
                org: 'FONDATION EDINA', stamp: 'CONFIDENTIEL', fileId: 'NVG-13 / FINAL',
                reportTitle: 'Projet Nevergrad — Rapport Final', sideLabel: "Paquet d'identité du sujet",
                note: "Vérification croisée des observations et des dosages", footer: 'Fiabilité du scan',
                cycle: 'Cycle', subject1: 'Kim Dojin', subject7: 'Kim Taeho', done: 'Traité',
                anomaly: 'Contact avec Seolhwa / complot de fuite', active: 'Actif'
            },
            de: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3 Monate später · Gesellschaft', live: 'LIVE',
                investigation: 'Recherche', related: 'Verwandte Berichte', chart: 'Opfermeldungen',
                evidence: 'Beweise gesichert', witness: 'Schlüsselzeugenakte',
                newsBadges: ['Nicht genehmigte Anlage', 'Klinische Versuche', 'Gedächtnisstörungen'],
                org: 'EDINA-STIFTUNG', stamp: 'VERTRAULICH', fileId: 'NVG-13 / FINAL',
                reportTitle: 'Projekt Nevergrad — Abschlussbericht', sideLabel: 'Identitätspaket des Subjekts',
                note: 'Abgleich von Beobachtungs- und Dosierungsprotokollen', footer: 'Scan-Verlässlichkeit',
                cycle: 'Zyklus', subject1: 'Kim Dojin', subject7: 'Kim Taeho', done: 'Abgeschlossen',
                anomaly: 'Kontakt mit Seolhwa / Fluchtplan', active: 'Aktiv'
            },
            pt: {
                newsSource: 'NEVERGRAD TIMES', newsMeta: '3 meses depois · Sociedade', live: 'AO VIVO',
                investigation: 'Investigação', related: 'Reportagens relacionadas', chart: 'Relatos de vítimas',
                evidence: 'Provas asseguradas', witness: 'Registro da testemunha-chave',
                newsBadges: ['Instalação não autorizada', 'Ensaios clínicos', 'Distúrbios de memória'],
                org: 'FUNDAÇÃO EDINA', stamp: 'CONFIDENCIAL', fileId: 'NVG-13 / FINAL',
                reportTitle: 'Projeto Nevergrad — Relatório Final', sideLabel: 'Pacote de identidade do sujeito',
                note: 'Cruzando registros de observação e dosagem', footer: 'Confiança da varredura',
                cycle: 'Ciclo', subject1: 'Kim Dojin', subject7: 'Kim Taeho', done: 'Processado',
                anomaly: 'Contato com Seolhwa / plano de fuga', active: 'Ativo'
            }
        };
        return copy[lang] || copy.en;
    }

    _stripVNMarkup(text) {
        return String(text || '')
            .trim()
            .replace(/^\*{1,3}/, '')
            .replace(/\*{1,3}$/, '')
            .trim();
    }

    _extractOuterQuote(text) {
        const s = this._stripVNMarkup(text);
        const pairs = [['『', '』'], ['「', '」'], ['“', '”'], ['"', '"'], ["'", "'"]];
        for (const [open, close] of pairs) {
            const start = s.indexOf(open);
            const end = s.lastIndexOf(close);
            if (start >= 0 && end > start) {
                return s.slice(start + open.length, end).replace(/["'』」]\s+["'『「]/g, ' / ').trim();
            }
        }
        return s;
    }

    _buildNewsArticleMedia(extraVars) {
        const copy = this._mediaLocale();
        const headlineRaw = this.i18n.resolve(this.i18n.get('day5_ending_true_26').text, this.state.playerName, extraVars);
        const deckRaw = this.i18n.resolve(this.i18n.get('day5_ending_true_27').text, this.state.playerName, extraVars);
        const deck = this._extractOuterQuote(deckRaw);

        return {
            type: 'newsArticle',
            source: copy.newsSource,
            meta: copy.newsMeta,
            live: copy.live,
            kicker: copy.investigation,
            headline: this._extractOuterQuote(headlineRaw),
            deck,
            badges: copy.newsBadges,
            cardLabel: copy.evidence,
            cardNumber: '#13',
            cardCaption: copy.witness,
            relatedTitle: copy.related,
            related: deck.split(/\s+\/\s+|'\s+'/).filter(Boolean).slice(0, 2),
            chartTitle: copy.chart,
            chart: [18, 31, 58, 94],
            url: 'nevergrad.local/investigation/facility-13'
        };
    }

    _buildLabDocumentMedia(sceneId, resolvedText) {
        const copy = this._mediaLocale();
        const playerName = this.state?.playerName || '{name}';
        const sceneNo = Number((sceneId.match(/_(\d+)$/) || [])[1] || 1);

        return {
            type: 'labDossier',
            variant: sceneNo >= 5 ? 'table' : (sceneNo >= 3 ? 'report' : 'intake'),
            org: copy.org,
            stamp: copy.stamp,
            fileId: copy.fileId,
            title: copy.reportTitle,
            excerpt: this._stripVNMarkup(resolvedText),
            sideLabel: copy.sideLabel,
            subject: '#13',
            note: copy.note,
            footer: `${copy.footer} ${Math.min(98, 48 + sceneNo * 9)}%`,
            scan: 48 + sceneNo * 9,
            rows: [
                { cycle: `${copy.cycle} #1`, name: copy.subject1, status: copy.done },
                { cycle: `${copy.cycle} #7`, name: copy.subject7, status: copy.anomaly, tone: 'warning' },
                { cycle: `${copy.cycle} #13`, name: playerName, status: copy.active, tone: 'active' }
            ]
        };
    }

    _handleMetaEffect(effect) {
        const endingMap = {
            graduationSlots: 'TRUE',
            escapeSlot: 'ESCAPE',
            resistSlot: 'RESIST',
            forgetSlot: 'FORGET',
            ghostSlot: 'GHOST',
            complicitSlot: 'COMPLICIT'
        };
        const endingKey = endingMap[effect];
        if (!endingKey || !this.glitchAdvanced) return;

        document.body?.classList.add('ending-credit-mode');
        this.glitchAdvanced.showEndingCreditSaveUI(
            this.save,
            this.state.playerName || 'Player',
            endingKey
        );
    }

    _playSceneFade(direction, duration = 700) {
        const screen = document.getElementById('game-screen') || document.body;
        if (!screen) return;

        const overlay = document.createElement('div');
        overlay.className = `scene-fade-overlay scene-fade-${direction}`;
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            background: '#000',
            opacity: direction === 'in' ? '1' : '0',
            pointerEvents: 'none',
            transition: `opacity ${duration}ms ease`,
            zIndex: '9998'
        });
        screen.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = direction === 'in' ? '0' : '1';
        });

        setTimeout(() => overlay.remove(), duration + 120);
    }

    _shouldAutoAdvanceSilentScene(scene, text) {
        if (text) return false;
        if (scene.choices || scene.interaction || scene.type === 'free_talk') return false;
        if (scene.endingTitle || scene.cageLoop) return false;
        return Boolean(
            scene.autoAdvance ||
            scene.next ||
            scene.branches ||
            scene.affinityBranches ||
            scene.changeDay ||
            scene.changeSlot
        );
    }

    _queueAutoAdvance(scene, delayOverride) {
        clearTimeout(this._autoAdvanceTimer);
        const delay = typeof delayOverride === 'number'
            ? delayOverride
            : (typeof scene.autoAdvanceDelay === 'number' ? scene.autoAdvanceDelay : (scene.autoAdvance ? 0 : 120));

        this._autoAdvanceTimer = setTimeout(() => {
            if (this.currentSceneData !== scene || this._endingReached) return;
            this._advanceScene();
        }, Math.max(0, delay));
    }

    _advanceScene() {
        // CAGE END 모드에서는 무한 루프 텍스트 출력
        if (this._cageMode) {
            this._cageAdvance();
            return;
        }

        if (!this.currentSceneData) return;
        if (this._endingReached) return;
        const scene = this.currentSceneData;

        if (scene.branches) {
            const next = this._resolveBranch(scene.branches);
            if (next) { this._loadScene(next); return; }
        }

        if (scene.affinityBranches) {
            const next = this._resolveAffinityBranch(scene);
            if (next) { this._loadScene(next); return; }
        }

        // 장르 전환 트리거 — 브라우저 탭 기믹 활성화 + 앱 아이콘 금 간 방패로
        if (scene.triggerGenreShift) {
            this.glitch.initTabGimmick(this.state);
            if (this.favicon) {
                this.favicon.sync({
                    saveMeta: this.save?.getMeta?.(),
                    state: this.state
                });
            }
        }

        // 날짜 변경 (day1_night_end → day2_morning_start 등)
        if (scene.changeDay) {
            this.state.currentDay = scene.changeDay;
            // 콘솔 이스터에그 — Day별 설화 메시지 업데이트
            this.glitch.initConsoleEasterEgg(scene.changeDay);

            // 푸시 알림 스케줄링 (SCENARIO.md 5140-5153)
            if (this.metaHorror) {
                this.metaHorror.scheduleExitNotification(
                    scene.changeDay,
                    this.save.isNewGamePlus(),
                    this.save.getMeta().lastEnding
                );
            }

            // Day 5 노이즈 필터 활성화
            if (scene.changeDay >= 5 && this.glitchAdvanced) {
                this.glitchAdvanced.enableDay5NoiseFilter();
            }
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
        let choiceSelected = false;
        let visibleChoiceIdx = 0;

        choices.forEach((choice, choiceIdx) => {
            if (choice.condition && !this._checkCondition(choice.condition)) return;
            if (choice.excludeCondition && this.state.hasFlag(choice.excludeCondition)) return;

            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            const label = labels?.[choiceIdx] || (this.i18n?.currentLang === 'ko' ? `선택 ${choiceIdx + 1}` : `Choice ${choiceIdx + 1}`);
            const displayedIndex = visibleChoiceIdx++;
            btn.textContent = label;

            // 시차(stagger) 애니메이션: 각 버튼이 80ms 간격으로 순차 등장
            btn.style.animationDelay = `${displayedIndex * 80}ms`;

            // 글리치: 선택지 깜빡임
            if (choice.glitchFlicker) {
                setTimeout(() => {
                    this.glitch.flickerChoice(btn, choice.glitchFlicker, btn.textContent);
                }, choice.glitchDelay || 1500);
            }

            btn.addEventListener('click', () => {
                if (choiceSelected) return;
                choiceSelected = true;
                this.audio?.playUIChoiceSelect();
                this._recordChoiceTelemetry(
                    this.state.currentScene,
                    choice,
                    label,
                    displayedIndex
                );
                panel.classList.add('hidden');
                if (choice.stats) {
                    for (const [charId, changes] of Object.entries(choice.stats)) {
                        for (const [stat, val] of Object.entries(changes)) {
                            this.state.changeStat(charId, stat, val);
                            if (stat === 'affinity' && val !== 0) {
                                this._playStatChangeFX(stat, val, charId);
                            }
                        }
                    }
                }
                if (choice.setFlags) this.state.setFlags(choice.setFlags);
                if (choice.next) this._loadScene(choice.next);
            });

            panel.appendChild(btn);
        });

        // NG+ 선택지 스테이닝 (SCENARIO.md 5036-5047)
        if (this.glitchAdvanced && this.save.isNewGamePlus()) {
            const btns = Array.from(panel.querySelectorAll('.choice-btn'));
            this.glitchAdvanced.applyChoiceStaining(btns, this.state.currentScene, this.save);
        }

        // 씬 글리치에서 예약된 duplicateChoice (SCENARIO.md 5435)
        // 두 번째 선택지가 첫 번째와 같은 텍스트로 변조됨 — "선택 불가" 절망감
        if (this._pendingDuplicateChoice) {
            this._pendingDuplicateChoice = false;
            const btns = panel.querySelectorAll('.choice-btn');
            if (btns.length >= 2) {
                const firstText = btns[0].textContent;
                setTimeout(() => {
                    btns[1].textContent = firstText;
                    btns[1].classList.add('glitch-text');
                    setTimeout(() => btns[1].classList.remove('glitch-text'), 500);
                }, 1200);
            }
        }

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

        // 📌 렌파이 스타일 연타 방지: 마지막 버튼 애니메이션 완료 후 클릭 활성화
        const allBtns = panel.querySelectorAll('.choice-btn');
        const totalDelay = (allBtns.length - 1) * 80 + 1500;
        setTimeout(() => {
            const buttons = panel.querySelectorAll('.choice-btn');
            if (buttons) {
                buttons.forEach(b => b.classList.add('choice-ready'));
            }
        }, totalDelay);
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
            const startedAt = Date.now();
            if (this.choiceAdvanced?.showTimedChoice) {
                this.choiceAdvanced.showTimedChoice(labels, timeMs, -1, { skipDrugPenalty: true })
                    .then((idx) => this._handleTimedResult(
                        scene,
                        idx,
                        labels,
                        timeMs,
                        Date.now() - startedAt
                    ));
                return;
            }

            this.choices.showTimedChoices(
                scene.choices,
                labels,
                Math.round(timeMs / 1000),
                -1, // timeout sentinel
                (idx) => this._handleTimedResult(
                    scene,
                    idx,
                    labels,
                    timeMs,
                    Date.now() - startedAt
                )
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
    _handleTimedResult(scene, idx, labels = [], timeMs = scene.timedChoice, elapsedMs = 0) {
        // 타임아웃 (idx < 0 또는 범위 초과)
        if (idx < 0 || idx >= scene.choices.length) {
            this.state.recordTimedChoice(this.state.currentScene, timeMs, elapsedMs, true);
            if (scene.timeoutFlags) this.state.setFlags(scene.timeoutFlags);
            if (scene.timeoutNext) {
                this._loadScene(scene.timeoutNext);
            }
            return;
        }

        // 정상 선택
        const choice = scene.choices[idx];
        if (!choice) return;

        this._recordChoiceTelemetry(
            this.state.currentScene,
            choice,
            labels?.[idx] || (this.i18n?.currentLang === 'ko' ? `선택 ${idx + 1}` : `Choice ${idx + 1}`),
            idx,
            { timed: true, timeMs, elapsedMs, timedOut: false }
        );

        if (choice.stats) {
            for (const [charId, changes] of Object.entries(choice.stats)) {
                for (const [stat, val] of Object.entries(changes)) {
                    this.state.changeStat(charId, stat, val);
                    if (stat === 'affinity' && val !== 0) {
                        this._playStatChangeFX(stat, val, charId);
                    }
                }
            }
        }
        if (choice.setFlags) this.state.setFlags(choice.setFlags);
        if (choice.next) this._loadScene(choice.next);
    }

    _startSceneInteraction(interaction) {
        if (!interaction) return;

        this._stopAuto();
        this._stopSkip();
        this._clickLocked = true;
        if (this._clickLockTimer) {
            clearTimeout(this._clickLockTimer);
            this._clickLockTimer = null;
        }

        const finish = () => this._finishSceneInteraction(interaction);

        if (interaction.type === 'photo_deck' && this.glitchAdvanced?.showPhotoDeck) {
            this.glitchAdvanced.showPhotoDeck({
                deck: interaction.deck,
                onComplete: finish
            });
            return;
        }

        if (interaction.type === 'locker_search' && this.glitchAdvanced?.showLockerSearch) {
            this.glitchAdvanced.showLockerSearch({
                search: interaction.search,
                onComplete: finish
            });
            return;
        }

        finish();
    }

    _finishSceneInteraction(interaction) {
        this._clickLocked = false;

        if (interaction?.setFlags) this.state.setFlags(interaction.setFlags);
        if (interaction?.evidence) {
            const added = this.state.addEvidence(interaction.evidence);
            if (added) this._showEvidenceToast(interaction.evidence);
        }
        if (interaction?.next) this._loadScene(interaction.next);
    }

    _showEvidenceToast(evidence) {
        const existing = document.querySelector('#evidence-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'evidence-toast';
        toast.className = 'save-toast evidence-toast';
        const lang = this.i18n?.currentLang || 'ko';
        const labels = {
            ko: '증거 확보',
            en: 'Evidence secured',
            ja: '証拠を確保',
            es: 'Prueba asegurada',
            fr: 'Preuve sécurisée',
            de: 'Beweis gesichert',
            pt: 'Prova assegurada'
        };
        const name = evidence?.name ? `: ${evidence.name}` : '';
        toast.textContent = `${labels[lang] || labels.en}${name}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('save-toast-visible'));
        setTimeout(() => {
            toast.classList.remove('save-toast-visible');
            toast.classList.add('save-toast-hiding');
            setTimeout(() => toast.remove(), 400);
        }, 2200);
    }

    _recordChoiceTelemetry(sceneId, choice, label, displayedIndex, options = {}) {
        this.save.recordChoice(sceneId, displayedIndex, label);

        const routeKey = this._detectRouteSelection(choice?.next);
        if (routeKey) {
            this.state.recordRouteSelection(routeKey);
        }

        if (choice?.next && /(?:^|_)seolhwa(?:_|$)/.test(choice.next)) {
            this.state.recordSeolhwaAttempt();
        }

        if (options.timed) {
            this.state.recordTimedChoice(
                sceneId,
                options.timeMs,
                options.elapsedMs,
                !!options.timedOut
            );
        }
    }

    _detectRouteSelection(nextSceneId) {
        if (!nextSceneId || typeof nextSceneId !== 'string') return null;
        if (/(?:^|_)sea(?:_|$)/.test(nextSceneId)) return 'sea';
        if (/(?:^|_)yuna(?:_|$)/.test(nextSceneId)) return 'yuna';
        if (/(?:^|_)riin(?:_|$)/.test(nextSceneId)) return 'riin';
        if (/(?:^|_)eunsu(?:_|$)/.test(nextSceneId)) return 'eunsu';
        if (/(?:^|_)(alone|home)(?:_|$)/.test(nextSceneId)) return 'alone';
        return null;
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
        const idx = key.indexOf('_');
        if (idx === -1) return key;
        const charId = key.substring(0, idx);
        const expression = key.substring(idx + 1);
        return CONFIG.EXPRESSIONS[charId]?.[expression] || key;
    }

    // ===== Glitch =====

    /**
     * 장면 경계에서 지속 오버레이를 정리한다.
     * - adminPanel: save_glitch 구간에서만 표시, mirror 진입 시 제거
     * - mirrorReflection: mirror_hit1 구간에서만 표시
     * - mirrorWipe/photoOverlay: 각각 해당 씬을 벗어나면 제거
     */
    /**
     * SCENARIO.md 5652-5658: 실시간 시계 연동 — 단 하나의 시간 기믹
     * 자정~새벽 3시(로컬 시간) 사이에 Day 4~5 밤 씬에 진입하면
     * 1회만 팬텀 지문을 띄운다. 세션당 1회, 재진입 재표시 없음.
     * @private
     */
    _checkLatenightGimmick(sceneId) {
        if (!this.glitchAdvanced) return;
        // 이미 표시됨 → 스킵
        if (this.state.hasFlag('latenight_shown')) return;
        // 대상: Day 4~5 + 밤 씬 (sceneId에 "_night" 포함)
        if (this.state.currentDay < 4) return;
        if (!/_night/.test(sceneId)) return;
        // 로컬 시간 체크
        const hour = new Date().getHours();
        if (hour < 0 || hour >= 3) return;

        this.state.setFlag('latenight_shown');
        const text = this.i18n?.getUI('latenightAlone') ||
            '...\uC774 \uC2DC\uAC04\uC5D0 \uAE68\uC5B4\uC788\uB294 \uAC74 \uB098\ubfd0\uC77C\uAE4C.';
        // 화면 중앙 위쪽에 2.8초간 팬텀 텍스트
        this.glitchAdvanced.showGhostText(text, 50, 22, 2800);
    }

    /**
     * SCENARIO.md 5623: 이어폰 미감지 시 거울 씬 직전 팬텀 힌트
     * "...이어폰을 끼면 더 잘 들릴 텐데." 0.5초 노출.
     * day4_night_save_glitch_20 (거울 진입 직전 씬)에서 단 1회.
     * @private
     */
    _checkHeadphoneHint(sceneId) {
        if (!this.glitchAdvanced) return;
        if (sceneId !== 'day4_night_save_glitch_20') return;
        if (this.state.hasFlag('headphone_hint_shown')) return;
        // 바이노럴 활성 상태면 이어폰 착용 중 → 힌트 불필요
        if (this.audio?.isBinauralActive?.()) return;

        this.state.setFlag('headphone_hint_shown');
        const text = this.i18n?.getUI('headphoneHint') ||
            '...\uC774\uC5B4\uD3F0\uC744 \uB07C\uBA74 \uB354 \uC798 \uB4E4\uB9B4 \uD150\uB370.';
        this.glitchAdvanced.showGhostText(text, 50, 78, 500);
    }

    _cleanupPersistentOverlays(sceneId, scene) {
        if (!this.glitchAdvanced) return;
        const g = scene?.glitch || {};
        const inSaveGlitch = /day4_night_save_glitch/.test(sceneId);
        if (!inSaveGlitch && !g.adminPanel) {
            this.glitchAdvanced.hideAdminPanel();
        }
        const inMirrorHit1 = /day4_night_mirror_hit1/.test(sceneId);
        if (!inMirrorHit1 && !g.mirrorReflection) {
            this.glitchAdvanced.hideMirrorReflection();
        }
        const inMirrorSwipe = /day4_night_mirror_swipe/.test(sceneId);
        if (!inMirrorSwipe && !g.mirrorWipe) {
            this.glitchAdvanced._teardownMirrorWipe?.();
        }
        if (!g.photoOverlay && !/mirror_hit2|mirror_overlay/.test(sceneId)) {
            this.glitchAdvanced.hidePhotoOverlay();
        }
        // 서명 패드: 전용 씬 밖에서는 즉시 제거
        if (sceneId !== 'day5_ending_complicit_sign' && !g.requireSignature) {
            this.glitchAdvanced.hideSignaturePad?.();
        }
    }

    _handleGlitch(g) {
        if (!g) return;
        if (typeof g === 'string') {
            this._handleNamedGlitch(g);
            return;
        }
        if (g.type === 'flicker') this.glitch.screenNoise(g.duration || g.flickerDuration || 240);
        if (g.noise) this.glitch.screenNoise(g.noiseDuration);
        if (g.screenFlash) this._screenFlash(g.flashDuration || 120);
        if (g.corruptText) this._corruptDialogueText(g);
        if (g.mirrorReveal) this._showMirrorReveal(g.mirrorReveal);
        if (g.drugBlur) this.glitch.drugBlur?.(g.drugBlurDuration || 700);
        if (g.borderPulse) this._pulseDialogueBorder(g.borderPulseDuration || 1200);
        if (g.textReplace) this._applyTitleTextReplace(g.textReplace);
        if (g.silence) {
            // AudioManager 우선, 폴백: 레거시 HTML5 Audio
            if (this.audio?.ctx) {
                this.audio.silenceDrop(g.silenceDuration);
            } else {
                this.glitch.silenceDrop(this.renderer.bgmAudio, g.silenceDuration);
            }
        }
        if (g.themeShift) this.glitch.shiftTheme(g.themeShift);
        if (g.heavy || g.heavyGlitch) this.glitch.heavyGlitch(g.heavyDuration);
        if (g.ghostText) this.glitch.ghostText(this._pickLocalizedValue(g.ghostText), g.ghostX || 50, g.ghostY || 30);
        if (g.ngPlusGhostText && this.save?.isNewGamePlus()) {
            this.glitch.ghostText(
                this._pickLocalizedValue(g.ngPlusGhostText),
                g.ghostX || 50,
                g.ghostY || 60,
                g.ghostDuration || 500
            );
        }
        if (g.mirrorFog) {
            this.glitch.showMirrorFog();
        }
        if (g.endingCreditSaveUI && this.glitchAdvanced) {
            this.glitchAdvanced.showEndingCreditSaveUI(
                this.save,
                this.state.playerName || this.i18n?.getCharacterName?.('me') || 'Player',
                g.endingCreditSaveUI
            );
        }
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
            const statEl = document.getElementById('stat-display');
            if (statEl) this.glitch.shatterStatLabel(statEl);
        }
        if (typeof g.forceChoice === 'number') {
            this._pendingForceChoice = g.forceChoice;
        }
        if (g.duplicateChoice) {
            this._pendingDuplicateChoice = true;
        }
        if (g.phoneFlash && this.deviceGimmick) {
            const phoneFlashText = this._pickLocalizedValue(g.phoneFlashText);
            this.deviceGimmick.flashPhoneNotification(
                phoneFlashText,
                g.phoneFlashDuration || 300
            );
        }
        if (g.appKill && this.deviceGimmick) {
            this.deviceGimmick.simulateAppKill(g.appKillDuration || 1000);
        }
        if (g.ngPlusEmptyFrame && this.glitchAdvanced && this.save?.isNewGamePlus()) {
            this.glitchAdvanced.show14thEmptyFrame(g.ngPlusEmptyFrameDuration || 800);
        }
        if (g.earlyEscape && this.glitchAdvanced) {
            this.glitchAdvanced.playEarlyEscapeSequence();
        }
        if (typeof g.flickerChoice === 'number') {
            this._pendingFlickerChoice = {
                index: g.flickerChoice,
                text: g.flickerText,
                duration: g.flickerDuration || 100
            };
        }

        // ── Day 3 밤: '호감도' → '위험도' 라벨 벗겨내기
        if (g.peelStatLabel && this.glitchAdvanced) {
            this.glitchAdvanced.peelStatLabel(g.revealDuration);
        }

        // ── Day 3 밤: 온도 하강 (푸른 색조 + 서리)
        if (g.temperatureDrop && this.glitchAdvanced) {
            this.glitchAdvanced.temperatureDrop(g.temperatureDuration);
        }

        // ── Day 4 밤: 안전앱 어드민 패널 (13명 피험자 목록)
        if (g.adminPanel && this.glitchAdvanced) {
            this.glitchAdvanced.showAdminPanel(g.subjects || []);
        }

        // ── Day 4 밤: BGM까지 완전 음소거 (거울 스와이프 직전)
        if (g.silenceAll) {
            if (this.audio?.ctx) this.audio.silenceDrop(g.silenceDuration || 0);
            if (this.renderer?.bgmAudio) {
                try { this.renderer.bgmAudio.pause(); } catch (_) {}
            }
        }

        // ── Day 4 밤: 인터랙티브 거울 닦기 (마우스/터치 스와이프)
        if (g.mirrorWipe && this.glitchAdvanced) {
            this.glitchAdvanced.startMirrorWipe({
                requireSwipe: g.requireSwipe === true,
                silenceAll: g.silenceAll === true,
                threshold: g.swipeThreshold,
                verticalSpan: g.swipeVerticalSpan
            });
        }

        // ── Day 4 밤: 거울 속에 특정 캐릭터 미반사 (설화)
        if (g.mirrorReflection && this.glitchAdvanced) {
            this.glitchAdvanced.showMirrorReflection(g.characterAbsentInMirror);
        }

        // ── Day 4 밤: 13장 증명사진 오버레이 + 관리 시스템 라벨
        if (g.photoOverlay && this.glitchAdvanced) {
            this.glitchAdvanced.showPhotoOverlay({
                photoSequence: g.photoSequence || [],
                photoInterval: g.photoInterval,
                overlayText: g.overlayText,
                overlayFadeDuration: g.overlayFadeDuration
            });
        }

        // ── COMPLICIT 서명 패드 (SCENARIO.md 5608)
        if (g.requireSignature && this.glitchAdvanced) {
            this.glitchAdvanced.startSignaturePad({ requireSignature: true });
        }

        // ── Day 5 추격전 발소리 좌→우 스윕 (SCENARIO.md 5622)
        // g.chaseFootsteps: { fromPan, toPan, steps, interval } 또는 true
        if (g.chaseFootsteps && this.audio?.playFootstepsPanSweep) {
            const opts = (typeof g.chaseFootsteps === 'object') ? g.chaseFootsteps : {};
            this.audio.playFootstepsPanSweep(opts);
        }

        // ── 바이노럴 패닝 SFX (SCENARIO.md 5616~5630)
        // 이어폰/헤드폰 연결 시에만 패닝 적용, 모노 출력이면 중앙 재생
        // g.panSFX: "sfx_whisper_seolhwa" 같은 SFX 키(또는 파일명)
        // g.pan: -1(왼쪽) ~ 1(오른쪽), 기본 -1 (설화 속삭임 규약)
        if (g.panSFX && this.audio) {
            const pan = (typeof g.pan === 'number') ? g.pan : -1;
            const effectivePan = this.audio.isBinauralActive?.() ? pan : 0;
            try {
                this.audio.playSFXPanned(g.panSFX, effectivePan);
            } catch (_) {
                // SFX 누락은 치명적이지 않음
            }
        }
    }

    _handleNamedGlitch(name) {
        this.state.setFlag?.(`glitch_${name}`);

        if (name === 'deja_vu_direction' || name === 'deja_vu_desk') {
            this.glitch.screenNoise?.(160);
            this.glitch.ghostText?.('...', 50, 28, 450);
            return;
        }

        if (name === 'loop_truth') {
            this.glitch.screenNoise?.(80);
            if (this.save?.isNewGamePlus?.()) {
                this.glitch.ghostText?.('...', 50, 72, 350);
            }
        }
    }

    _screenFlash(duration = 120) {
        const flash = document.createElement('div');
        flash.className = 'screen-flash-overlay';
        Object.assign(flash.style, {
            position: 'fixed',
            inset: '0',
            background: '#fff',
            opacity: '0.85',
            pointerEvents: 'none',
            transition: `opacity ${duration}ms ease-out`,
            zIndex: '9999'
        });
        document.body.appendChild(flash);
        requestAnimationFrame(() => { flash.style.opacity = '0'; });
        setTimeout(() => flash.remove(), duration + 80);
    }

    _blackoutScreen(duration = 500) {
        const blackout = document.createElement('div');
        blackout.className = 'screen-blackout-overlay';
        Object.assign(blackout.style, {
            position: 'fixed',
            inset: '0',
            background: '#000',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 120ms ease',
            zIndex: '9999'
        });
        document.body.appendChild(blackout);
        requestAnimationFrame(() => { blackout.style.opacity = '1'; });
        setTimeout(() => { blackout.style.opacity = '0'; }, duration);
        setTimeout(() => blackout.remove(), duration + 180);
    }

    _corruptDialogueText(g) {
        const duration = g.corruptDuration || 360;
        const indices = Array.isArray(g.corruptIndices) ? new Set(g.corruptIndices) : null;
        const corruptOnce = () => {
            const textEl = document.getElementById('dialogue-text');
            const original = textEl?.textContent || '';
            if (!textEl || !original) return false;

            const chars = original.split('');
            const noisy = chars.map((ch, idx) => {
                if (ch.trim() === '') return ch;
                if (indices && !indices.has(idx)) return ch;
                if (!indices && Math.random() > 0.22) return ch;
                return '█';
            }).join('');

            textEl.textContent = noisy;
            setTimeout(() => {
                if (textEl.textContent === noisy) textEl.textContent = original;
            }, duration);
            return true;
        };

        setTimeout(() => {
            if (!corruptOnce()) setTimeout(corruptOnce, 300);
        }, 120);
    }

    _showMirrorReveal(stage) {
        this.glitchAdvanced?.showMirrorPlayerReveal?.(stage);
        this.glitch.screenNoise?.(120);
    }

    _pulseDialogueBorder(duration = 1200) {
        const box = document.querySelector('.dialogue-box, #dialogue-box');
        if (!box) return;
        box.classList.add('dialogue-border-pulse');
        setTimeout(() => box.classList.remove('dialogue-border-pulse'), duration);
    }

    _applyTitleTextReplace(replace) {
        replace = this._pickLocalizedValue(replace);
        if (!replace?.to) return;
        const titleEl = document.querySelector('.title-text');
        if (titleEl && (!replace.from || titleEl.textContent.includes(replace.from))) {
            titleEl.textContent = replace.to;
            titleEl.classList.add('title-text-corrupted');
        }
        document.title = replace.to;
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

        // 타이틀 복귀 버튼
        const returnBtn = document.createElement('button');
        returnBtn.className = 'ending-return-btn';
        returnBtn.textContent = this.i18n?.getUI?.('toTitle') || 'Title';
        returnBtn.addEventListener('click', () => {
            overlay.remove();
            this.glitchAdvanced?.disableDay5NoiseFilter();
            this._showScreen('title-screen');
        });
        overlay.appendChild(returnBtn);

        document.getElementById('game-screen')?.appendChild(overlay);

        // 탭 기믹 해제
        this.glitch.stopTabGimmick();

        // 엔딩 도달 — 대화창 클릭 무효화
        this._endingReached = true;
    }

    // ===== Text =====

    _resolveName(name) {
        const selfNames = ["나", "Me", "Ich", "私", "Yo", "Moi"];
        if (selfNames.includes(name)) return this.state.playerName || name;
        return name;
    }

    _pickLocalizedValue(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
        const lang = this.i18n?.currentLang || 'ko';
        return value[lang] || value.en || value.ko || '';
    }

    _buildSceneVars(sceneId, scene) {
        const futureName = this._getFutureSubjectName();
        const vars = {
            new_name: futureName,
            '14th_name': futureName
        };

        if (scene?.dynamicData || sceneId.startsWith('day5_observer_')) {
            Object.assign(vars, this._buildObserverVars());
        }

        return vars;
    }

    _getFutureSubjectName() {
        const koPool = [
            '강하준', '김시온', '박도윤', '서이안',
            '윤태오', '이현우', '정민재', '최도현'
        ];
        const enPool = [
            'Kang Hajun', 'Kim Sion', 'Park Doyun', 'Seo Ian',
            'Yoon Taeo', 'Lee Hyunwoo', 'Jung Minjae', 'Choi Dohyun'
        ];
        const seedSource = this.state.playerName || 'NEVERGRAD';
        const seed = [...seedSource].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const picked = this.state.getGeneratedName('14th_name', () => koPool[seed % koPool.length]);
        this.state.getGeneratedName('new_name', () => picked);
        if (this.i18n?.currentLang === 'ko') return picked;
        const idx = koPool.indexOf(picked);
        return idx >= 0 ? enPool[idx] : picked;
    }

    _buildObserverVars() {
        const analytics = this.state.analytics || {};
        const hasEvidence =
            this.state.hasFlag('has_evidence') ||
            this.state.hasFlag('yuna_memory_card') ||
            this.state.hasFlag('yuna_sd_card_copy') ||
            this.state.hasFlag('evidence_subject_ledger') ||
            this.state.hasFlag('found_photo_fragment') ||
            this.state.hasFlag('found_yuna_camera') ||
            (Array.isArray(this.state.evidence) && this.state.evidence.length > 0);

        const xover = this.crossover?.getData?.() || {};
        return {
            play_time: this._formatPlayTime(this.state.getTotalPlayMs()),
            route_data: String(analytics.routeSelections?.sea || 0),
            met_yuna: this._formatBinaryStatus(this.state.hasFlag('met_yuna')),
            riin_visits: String(analytics.riinVisits || analytics.routeSelections?.riin || 0),
            seolhwa_attempts: String(analytics.seolhwaAttempts || 0),
            evidence_data: this._formatEvidenceStatus(hasEvidence),
            timer_data: this._formatTimedChoice(analytics.lastTimedChoice),
            cupid_heroine: this._formatCupidHeroine(xover.heroine),
            cupid_compliance: xover.compliance != null ? `${xover.compliance}%` : '—'
        };
    }

    _formatCupidHeroine(heroineId) {
        if (!heroineId) return '—';
        const lang = this.i18n.currentLang || 'ko';
        const map = {
            ko: { seoyeon: '서연', dain: '다인', yuna: '유나', jiwoo: '지우', haeun: '하은' },
            en: { seoyeon: 'Seoyeon', dain: 'Dain', yuna: 'Yuna', jiwoo: 'Jiwoo', haeun: 'Haeun' },
            ja: { seoyeon: 'ソヨン', dain: 'ダイン', yuna: 'ユナ', jiwoo: 'ジウ', haeun: 'ハウン' },
            es: { seoyeon: 'Seoyeon', dain: 'Dain', yuna: 'Yuna', jiwoo: 'Jiwoo', haeun: 'Haeun' },
            fr: { seoyeon: 'Seoyeon', dain: 'Dain', yuna: 'Yuna', jiwoo: 'Jiwoo', haeun: 'Haeun' },
            de: { seoyeon: 'Seoyeon', dain: 'Dain', yuna: 'Yuna', jiwoo: 'Jiwoo', haeun: 'Haeun' },
            pt: { seoyeon: 'Seoyeon', dain: 'Dain', yuna: 'Yuna', jiwoo: 'Jiwoo', haeun: 'Haeun' }
        };
        return (map[lang] || map.en)[heroineId] || heroineId;
    }

    _formatPlayTime(totalMs) {
        const totalSec = Math.max(0, Math.floor((totalMs || 0) / 1000));
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        return [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0')
        ].join(':');
    }

    _formatBinaryStatus(value) {
        const lang = this.i18n.currentLang || 'ko';
        const labels = {
            ko: value ? '예' : '아니오',
            en: value ? 'Yes' : 'No',
            ja: value ? 'あり' : 'なし',
            es: value ? 'Sí' : 'No',
            fr: value ? 'Oui' : 'Non',
            de: value ? 'Ja' : 'Nein',
            pt: value ? 'Sim' : 'Não'
        };
        return labels[lang] || labels.en;
    }

    _formatEvidenceStatus(value) {
        const lang = this.i18n.currentLang || 'ko';
        const labels = {
            ko: value ? '확보' : '미확보',
            en: value ? 'Secured' : 'Missing',
            ja: value ? '確保' : '未確保',
            es: value ? 'Asegurada' : 'No asegurada',
            fr: value ? 'Sécurisées' : 'Aucune',
            de: value ? 'Gesichert' : 'Nicht gesichert',
            pt: value ? 'Assegurada' : 'Ausente'
        };
        return labels[lang] || labels.en;
    }

    _formatTimedChoice(record) {
        const lang = this.i18n.currentLang || 'ko';
        if (!record) {
            const empty = {
                ko: '기록 없음',
                en: 'No record',
                ja: '記録なし',
                es: 'Sin registro',
                fr: 'Aucune donnée',
                de: 'Kein Eintrag',
                pt: 'Sem registro'
            };
            return empty[lang] || empty.en;
        }

        const elapsedSec = ((record.elapsedMs || 0) / 1000).toFixed(1);
        const limitSec = Math.round((record.timeLimitMs || 0) / 1000);
        if (record.timedOut) {
            const timeout = {
                ko: `시간 초과 (${limitSec}초 제한)`,
                en: `Timed out (${limitSec}s limit)`,
                ja: `時間切れ（${limitSec}秒制限）`,
                es: `Tiempo agotado (${limitSec}s)`,
                fr: `Temps écoulé (${limitSec}s)`,
                de: `Zeit abgelaufen (${limitSec}s)`,
                pt: `Tempo esgotado (${limitSec}s)`
            };
            return timeout[lang] || timeout.en;
        }

        const values = {
            ko: `${elapsedSec}초 / ${limitSec}초`,
            en: `${elapsedSec}s / ${limitSec}s`,
            ja: `${elapsedSec}秒 / ${limitSec}秒`,
            es: `${elapsedSec}s / ${limitSec}s`,
            fr: `${elapsedSec}s / ${limitSec}s`,
            de: `${elapsedSec}s / ${limitSec}s`,
            pt: `${elapsedSec}s / ${limitSec}s`
        };
        return values[lang] || values.en;
    }

    // ===== HUD =====

    _updateHUD() {
        const dayEl = document.getElementById('day-display');
        if (!dayEl) return;
        const slots = this.i18n.getUI('slots') || {};
        const slotName = slots[this.state.currentSlot] || CONFIG.TIME_SLOT_NAMES[this.state.currentSlot] || "";
        const fmt = this.i18n.getUI('dayFormat') || "Day {day} - {slot}";
        dayEl.textContent = fmt.replace('{day}', this.state.currentDay).replace('{slot}', slotName);

        this._updateStatDisplay();
    }

    /**
     * 스탯 표시 UI 업데이트
     * - romance 모드: 현재 대화 캐릭터의 호감도 (♥)
     * - thriller 모드: 신뢰도(◈) / 위험도(⚠)
     */
    _updateStatDisplay() {
        const statEl = document.getElementById('stat-display');
        if (!statEl) return;

        // peelStatLabel 애니메이션 진행 중엔 덮어쓰지 않는다
        // (async 함수가 구성해둔 peel-layer/base 구조를 보호)
        if (statEl.classList.contains('stat-peeling')) return;

        // 최초 표시 시 hidden → stat-hidden으로 전환 (CSS 트랜지션 활성화)
        if (statEl.classList.contains('hidden')) {
            statEl.classList.remove('hidden');
            statEl.classList.add('stat-hidden');
        }

        const isRevealed = statEl.classList.contains('stat-revealed');

        // 현재 씬에서 대화 중인 캐릭터 파악
        const charKey = this.currentSceneData?.character;
        let charId = null;
        if (charKey && typeof charKey === 'string') {
            const idx = charKey.indexOf('_');
            charId = idx > 0 ? charKey.substring(0, idx) : charKey;
        }

        // 캐릭터가 없으면 (나레이션 등) 스탯 숨김
        // 단, peelStatLabel로 이미 '위험도'가 드러난 상태에서는 라벨을 계속 노출한다
        // (장르 전환의 시각적 앵커를 뺏기지 않도록)
        if (!charId || !this.state.stats[charId]) {
            if (!isRevealed) statEl.classList.add('stat-hidden');
            return;
        }

        statEl.classList.remove('stat-hidden');

        const aff = this.state.getDisplayAffinity(charId);
        const charLabel = this.i18n?.getStatLabel?.(this.state.mode, charId)
            || this.state.getCharLabel(charId);

        let newText;
        if (this.state.mode === CONFIG.STAT_MODES.ROMANCE) {
            // Day 1~3: "♡ 호감도 X"
            newText = `${charLabel.icon} ${charLabel.primary} ${aff}`;
        } else {
            // Day 4+: 캐릭터별 라벨 (위험도/집착도/신뢰도/호감도/동기화)
            newText = `${charLabel.icon} ${charLabel.label} ${aff}`;
        }

        if (statEl.textContent !== newText) {
            statEl.textContent = newText;
            statEl.classList.remove('stat-bump');
            void statEl.offsetWidth; // reflow
            statEl.classList.add('stat-bump');
        }
    }

    // ===== Stat Change Effects =====

    /**
     * 호감도 변화 시 효과음 + 시각 이펙트 (Cupid 스타일)
     * @param {string} stat - 스탯 종류 ('affinity')
     * @param {number} val - 변화량 (양수: 증가, 음수: 감소)
     */
    _playStatChangeFX(stat, val, charId) {
        // 큐에 추가하여 순차 재생 (겹침 방지)
        if (!this._statFXQueue) this._statFXQueue = [];
        this._statFXQueue.push({ val, charId });
        if (this._statFXQueue.length === 1) this._processStatFXQueue();
    }

    _processStatFXQueue() {
        if (!this._statFXQueue?.length) return;
        const { val, charId } = this._statFXQueue[0];

        // 효과음
        if (this.audio?.ctx) {
            this.audio.playSFX(val > 0 ? 'affinity_up.mp3' : 'affinity_down.mp3', { forceFile: true });
        }

        // 시각 이펙트
        this._showStatChangePopup(val, charId);
        if (val > 0) this._showHeartEffect();

        this._statFXQueue.shift();
        if (this._statFXQueue.length > 0) {
            setTimeout(() => this._processStatFXQueue(), 600);
        }
    }

    /**
     * 스탯 증감 팝업 표시 (+5, -3 등)
     * stat-display 옆에 짧게 표시되었다 사라짐
     * @param {number} val - 변화량
     */
    _showStatChangePopup(val, charId) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;

        // 캐릭터 이름 가져오기
        const charName = this.i18n?.getCharacterName?.(charId)
            || (charId ? (CONFIG.CHAR_NAMES[charId] || charId) : '');
        const label = this.state.getCharLabel(charId);
        const icon = label?.icon || '♡';

        const popup = document.createElement('div');
        popup.className = 'stat-change-popup';
        this._activeStatPopups = (this._activeStatPopups || []).filter(el => el.isConnected);
        const occupiedSlots = new Set(this._activeStatPopups.map(el => Number(el.dataset.statPopupSlot)));
        let slot = 0;
        while (occupiedSlots.has(slot) && slot < 5) slot++;
        popup.style.setProperty('--stat-popup-offset', `${slot * 34}px`);
        popup.dataset.statPopupSlot = String(slot);

        if (val > 0) {
            popup.textContent = `${charName} ${icon} +${val}`;
            popup.classList.add('stat-change-up');
        } else {
            popup.textContent = `${charName} ${icon} ${val}`;
            popup.classList.add('stat-change-down');
        }

        gameScreen.appendChild(popup);
        this._activeStatPopups.push(popup);

        // 애니메이션 후 제거 (1.5초)
        setTimeout(() => {
            popup.remove();
            this._activeStatPopups = (this._activeStatPopups || []).filter(el => el.isConnected);
        }, 1500);
    }

    /**
     * 하트 이펙트 — 호감도 증가 시 화면에 하트 파티클
     */
    _showHeartEffect() {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;

        const container = document.createElement('div');
        container.className = 'heart-effect-container';
        gameScreen.appendChild(container);

        // 5개 하트 파티클 생성
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = '\u2665'; // ♥
            heart.style.left = `${40 + Math.random() * 20}%`;
            heart.style.animationDelay = `${i * 0.1}s`;
            heart.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
            container.appendChild(heart);
        }

        // 컨테이너 정리 (2초)
        setTimeout(() => container.remove(), 2000);
    }

    /**
     * 진동 패턴에 맞는 CSS 시각 효과 (PC에서도 진동 느낌 전달)
     */
    _vibrateVisual(pattern) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;

        // 패턴별 CSS 클래스 매핑
        const visualMap = {
            notification: 'vfx-buzz',
            message_buzz: 'vfx-buzz',
            message_frenzy: 'vfx-shake-heavy',
            heartbeat: 'vfx-pulse',
            danger: 'vfx-shake',
            chase: 'vfx-shake-heavy',
            impact: 'vfx-impact',
            stat_crack: 'vfx-crack',
            needle_touch: 'vfx-pulse',
            underground: 'vfx-rumble',
            paralysis: 'vfx-shake-heavy',
            final_needle: 'vfx-impact',
            door_resistance: 'vfx-rumble',
            timer_tick: 'vfx-buzz',
            grip_change: 'vfx-buzz',
            escape_relief: null
        };

        const cls = visualMap[pattern] || 'vfx-shake';
        if (!cls) return;

        gameScreen.classList.remove('vfx-buzz', 'vfx-shake', 'vfx-shake-heavy', 'vfx-pulse', 'vfx-impact', 'vfx-crack', 'vfx-rumble');
        void gameScreen.offsetWidth;
        gameScreen.classList.add(cls);

        // 애니메이션 종료 후 클래스 제거
        const durations = {
            'vfx-buzz': 200,
            'vfx-shake': 400,
            'vfx-shake-heavy': 800,
            'vfx-pulse': 1000,
            'vfx-impact': 300,
            'vfx-crack': 500,
            'vfx-rumble': 600
        };
        setTimeout(() => gameScreen.classList.remove(cls), durations[cls] || 500);
    }

    // ===== Save Toast =====

    /**
     * 저장 완료 토스트 메시지 표시 (1.5초 후 사라짐)
     */
    showSaveToast() {
        // 기존 토스트 제거
        const existing = document.getElementById('save-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'save-toast';
        toast.className = 'save-toast';
        toast.textContent = this.i18n.getUI('saveComplete') || '\uC800\uC7A5 \uC644\uB8CC';

        document.body.appendChild(toast);

        // 강제 리플로우 후 visible 추가 (페이드인)
        requestAnimationFrame(() => {
            toast.classList.add('save-toast-visible');
        });

        // 1.5초 후 페이드아웃 → 제거
        setTimeout(() => {
            toast.classList.remove('save-toast-visible');
            toast.classList.add('save-toast-hiding');
            setTimeout(() => toast.remove(), 400);
        }, 1500);
    }

    /**
     * 플레이어 이름 입력값 살균 (XSS 방지)
     */
    _sanitizeName(name) {
        return name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ===== Save/Load Slot Selector =====

    /**
     * 슬롯 선택 UI 열기
     * @param {'save'|'load'} mode
     */
    _openSlotSelector(mode) {
        this._slotMode = mode;
        const overlay = document.getElementById('sl-overlay');
        const title = document.getElementById('sl-title');
        const slotsEl = document.getElementById('sl-slots');
        if (!overlay || !slotsEl) return;

        // 타이틀 설정
        if (title) {
            title.textContent = mode === 'save'
                ? (this.i18n.getUI('save') || 'Save')
                : (this.i18n.getUI('load') || 'Load');
        }

        // 모드 클래스
        overlay.classList.remove('sl-load-mode');
        if (mode === 'load') overlay.classList.add('sl-load-mode');

        // 슬롯 렌더링
        this._renderSlots(slotsEl, mode);

        // 닫기 버튼
        const closeBtn = document.getElementById('sl-close');
        if (closeBtn) {
            const handler = () => {
                this.audio?.playUIMenuClose();
                this._hideOverlay('sl-overlay');
                closeBtn.removeEventListener('click', handler);
            };
            closeBtn.addEventListener('click', handler);
        }

        this._showOverlay('sl-overlay');
    }

    /**
     * 슬롯 목록 렌더링
     */
    _renderSlots(container, mode) {
        container.innerHTML = '';
        const slots = this.save.getAllSlotInfo();
        const ui = (k) => this.i18n.getUI(k);
        const slotNames = this.i18n.getUI('slots') || {};

        for (let i = 0; i <= this.save.MAX_SLOTS; i++) {
            const info = slots[i];
            const el = document.createElement('div');
            el.className = 'sl-slot' + (i === 0 ? ' sl-slot-auto' : '') + (!info ? ' sl-empty' : '');

            const numEl = document.createElement('div');
            numEl.className = 'sl-slot-num';
            numEl.textContent = i === 0 ? (ui('slotAuto') || 'AUTO') : `${i}`;

            const infoEl = document.createElement('div');
            infoEl.className = 'sl-slot-info';

            if (info) {
                const nameEl = document.createElement('div');
                nameEl.className = 'sl-slot-name';
                const dayText = `Day ${info.currentDay}`;
                const slotLabel = slotNames[info.currentSlot] || info.currentSlot || '';
                nameEl.textContent = `${info.playerName || '???'} — ${dayText} ${slotLabel}`;

                const detailEl = document.createElement('div');
                detailEl.className = 'sl-slot-detail';
                detailEl.textContent = info.timestamp
                    ? new Date(info.timestamp).toLocaleString()
                    : (ui('slotOldFormat') || '');

                infoEl.appendChild(nameEl);
                infoEl.appendChild(detailEl);
            } else {
                const emptyEl = document.createElement('div');
                emptyEl.className = 'sl-slot-empty-label';
                emptyEl.textContent = ui('slotEmpty') || 'Empty slot';
                infoEl.appendChild(emptyEl);
            }

            el.appendChild(numEl);
            el.appendChild(infoEl);

            // 삭제 버튼 (수동 슬롯 + 데이터 있을 때 + save 모드)
            if (i > 0 && info && mode === 'save') {
                const delBtn = document.createElement('button');
                delBtn.className = 'sl-delete';
                delBtn.textContent = '✕';
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.audio?.playUIClick();
                    this.save.deleteSlot(i);
                    this._renderSlots(container, mode);
                });
                el.appendChild(delBtn);
            }

            // 클릭 핸들러
            el.addEventListener('click', () => this._onSlotClick(i, info, mode, container));

            container.appendChild(el);
        }
    }

    /**
     * 슬롯 클릭 처리
     */
    _onSlotClick(slotIndex, info, mode, container) {
        this.audio?.playUIClick();

        if (mode === 'save') {
            // 자동저장 슬롯(0)에도 수동 저장 가능
            if (info) {
                // 덮어쓰기 확인
                this._showSlotConfirm(slotIndex, container);
            } else {
                this._saveToSlotAndClose(slotIndex);
                this.audio?.playUISaveConfirm();
            }
        } else {
            // load 모드
            if (!info) return; // 빈 슬롯은 무시
            if (this.save.loadFromSlot(slotIndex)) {
                this.audio?.playUILoadConfirm();
                this.state.resumeRun();
                this._endingReached = false;
                // Cupid 크로스오버 플래그 재설정
                if (this.crossover?.hasPlayedCupid()) {
                    this.state.setFlag('cupid_played');
                    const heroine = this.crossover.getData?.()?.heroine;
                    if (heroine) this.state.setFlag(`cupid_heroine_${heroine}`);
                }
                if (this.save.isNewGamePlus()) this.state.setFlag('new_game_plus');
                this.glitch.initConsoleEasterEgg(this.state.currentDay);
                if (this.state.currentDay >= 4) this.glitch.initTabGimmick(this.state);
                this._hideOverlay('sl-overlay');
                this._loadScene(this.state.currentScene);
            }
        }
    }

    /**
     * 덮어쓰기 확인 UI
     */
    _showSlotConfirm(slotIndex, container) {
        // 기존 확인 UI 제거
        container.querySelectorAll('.sl-confirm').forEach(c => c.remove());

        const slotEl = container.children[slotIndex];
        if (!slotEl) return;

        const confirm = document.createElement('div');
        confirm.className = 'sl-confirm';

        const text = document.createElement('span');
        text.className = 'sl-confirm-text';
        text.textContent = this.i18n.getUI('slotOverwrite') || 'Overwrite this slot?';

        const yesBtn = document.createElement('button');
        yesBtn.className = 'sl-confirm-btn';
        yesBtn.textContent = this.i18n.getUI('slotYes') || 'Yes';
        yesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio?.playUISaveConfirm();
            this._saveToSlotAndClose(slotIndex);
        });

        const noBtn = document.createElement('button');
        noBtn.className = 'sl-confirm-btn sl-cancel';
        noBtn.textContent = this.i18n.getUI('slotNo') || 'No';
        noBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio?.playUIClick();
            confirm.remove();
        });

        confirm.appendChild(text);
        confirm.appendChild(yesBtn);
        confirm.appendChild(noBtn);
        slotEl.appendChild(confirm);
    }

    /**
     * 슬롯에 저장 후 UI 닫기
     */
    _saveToSlotAndClose(slotIndex) {
        const ok = this.save.saveToSlot(slotIndex);
        this._hideOverlay('sl-overlay');
        if (ok) {
            this.showSaveToast();
        }
    }

    // ===== Screen =====

    _showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        const el = document.getElementById(id);
        if (el) { el.classList.remove('hidden'); el.classList.add('active'); }

        if (id === 'game-screen') {
            this.state.resumeRun();
        } else {
            this.state.pauseRun();
        }

        if (this.deviceGimmick?.setupOrientationHijack) {
            this.deviceGimmick.setupOrientationHijack(this.state.currentDay);
        }

        // GA 가상 페이지뷰 전송
        if (typeof window.sendGAPageView === 'function') {
            window.sendGAPageView(id);
        }

        // 타이틀 복귀 시 이어하기 버튼 상태 갱신
        if (id === 'title-screen') {
            const btn = document.getElementById('btn-continue');
            if (btn) btn.disabled = !this.save.hasSaveData();
            window.playNevergradTitleIntro?.();
        }
    }

    // 모바일: 이름 입력 화면 가상 키보드 회피
    _attachNameScreenKBAvoidance() {
        if (!window.visualViewport) return;
        this._detachNameScreenKBAvoidance();
        const ns = document.getElementById('name-screen');
        if (!ns) return;
        this._nameScreenVVH = () => {
            const vv = window.visualViewport;
            ns.style.height = vv.height + 'px';
            ns.style.top = vv.offsetTop + 'px';
        };
        window.visualViewport.addEventListener('resize', this._nameScreenVVH);
    }
    _detachNameScreenKBAvoidance() {
        if (this._nameScreenVVH && window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this._nameScreenVVH);
            this._nameScreenVVH = null;
        }
        const ns = document.getElementById('name-screen');
        if (ns) { ns.style.height = ''; ns.style.top = ''; }
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
        // AUTO / SKIP / LOG / SAVE / LOAD 전부 UI에서 제거됨.
        // 대사는 클릭/탭으로 진행. 저장·불러오기는 MENU → pause-menu 안에서 접근.
        // NG+ 기시감 텍스트는 _loadScene 진입 시 자동 표시.
        document.getElementById('qm-menu')?.addEventListener('click', () => {
            this.audio?.playUIMenuOpen();
            this._showOverlay('pause-menu');
        });
    }
    // AUTO / SKIP 모드는 UI에서 제거됨. 관련 stub들은 호환성 위해 유지.
    _stopAuto() { this.isAutoMode = false; clearTimeout(this._autoTimer); this._autoTimer = null; }
    _stopSkip() { this.isSkipMode = false; clearTimeout(this._skipTimer); this._skipTimer = null; }

    // ===== Backlog =====

    _bindBacklog() {
        document.getElementById('backlog-close')?.addEventListener('click', () => {
            this.audio?.playUIMenuClose();
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
            // 마크다운 마커 제거 (** → bold, * → italic → 순수 텍스트로)
            const cleanText = entry.text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
            textEl.textContent = cleanText;
            div.appendChild(textEl);

            container.appendChild(div);
        }

        container.scrollTop = container.scrollHeight;
    }

    // ===== FreeTalk =====

    _startFreeTalk(scene) {
        if (!this.freeTalk) {
            console.warn('[GameEngine] FreeTalkSystem not registered');
            return;
        }

        const mode = scene.freeTalkMode || 'interrogation';
        const charId = scene.freeTalkChar;
        const nextScene = scene.freeTalkNext || scene.next;

        if (mode === 'interrogation') {
            const context = scene.freeTalkContext || '';
            this.freeTalk.startInterrogation(charId, context, nextScene);
        } else if (mode === 'messenger') {
            this.freeTalk.startMessenger(charId);
            // messenger 모드는 자동으로 다음 씬 진행 안 함 — freeTalkNext로 수동 설정
            if (nextScene) {
                this.freeTalk.nextSceneId = nextScene;
            }
        } else if (mode === 'messenger_preemptive') {
            const preMsg = scene.freeTalkPreemptive || '';
            this.freeTalk.startPreemptiveMessenger(charId, preMsg, nextScene);
        } else if (mode === 'nightmare') {
            this._startNightmareSequence(nextScene);
        } else if (mode === 'ai_chat') {
            this.freeTalk.startAIChat(scene);
        }
    }

    /**
     * 악몽 시퀀스를 생성하고 순차적으로 표시합니다.
     * @param {string} nextScene - 악몽 종료 후 이동할 씬 ID
     */
    async _startNightmareSequence(nextScene) {
        if (!this.freeTalk) return;

        const lines = await this.freeTalk.generateNightmare();

        // 악몽 문장을 순차적으로 표시
        for (let i = 0; i < lines.length; i++) {
            await new Promise(resolve => {
                const line = lines[i];
                // 이탤릭 마크다운 제거 후 나레이션으로 표시
                const cleanLine = line.replace(/^\*/, '').replace(/\*$/, '');
                this.dialogue.type('', `*${cleanLine}*`, () => {
                    setTimeout(resolve, 800);
                }, { typingSpeed: 50, unskippable: true });
            });
        }

        // 악몽 종료 후 다음 씬으로
        if (nextScene) {
            setTimeout(() => {
                this.freeTalk.cleanup();
                this._loadScene(nextScene);
            }, 1500);
        }
    }

    // ===== CAGE END — 무한 루프 새장 =====

    /**
     * CAGE END 모드 진입.
     * Day 1의 밝은 교실로 되돌리고, 퀵 메뉴를 숨기고, 무한 루프 시작.
     *
     * 구조:
     * - 0~30 클릭: 평화로운 문장만 반복
     * - 30~50: 글리치가 미세하게 섞임
     * - 50~58: 설화의 목소리 등장
     * - 60: 화면 구석에 탈출 버튼 서서히 등장
     */
    _enterCageMode() {
        this._cageMode = true;
        this._cageClickCount = 0;
        this._cageRepeatEffects = this.currentSceneData?.cageRepeatEffects || {};
        this._cageSeaVariants = this.currentSceneData?.seaCageVariants || {};

        // 문장 풀 셔플
        const lang = this.i18n.currentLang || 'ko';
        const pool = (typeof CAGE_END_POOL !== 'undefined' && CAGE_END_POOL[lang])
            ? CAGE_END_POOL[lang]
            : (typeof CAGE_END_POOL !== 'undefined' ? CAGE_END_POOL.ko : []);
        this._cagePool = this._shuffleArray([...pool]);
        this._cagePoolIndex = 0;

        // Day 1 분위기로 복원
        this.renderer.setBackground(CONFIG.BACKGROUNDS.classroom);
        this.renderer.clearOverlays();
        this.renderer.clearCharacters();
        this.renderer.playBGM('spring_bright.mp3');

        // 글리치 테마를 로맨스로 복원
        this.glitch.shiftTheme?.('romance');

        // 퀵 메뉴 숨기기
        const qm = document.getElementById('quick-menu');
        if (qm) qm.classList.add('cage-hidden');

        // HUD 변경 — "행복한 교실"
        const dayEl = document.getElementById('day-display');
        if (dayEl) dayEl.textContent = this._getCageHudText();

        // Auto/Skip 중지
        this._stopAuto();
        this._stopSkip();

        // 메타 공포: 탭 제목 변경
        if (this.metaHorror) {
            this.metaHorror.deactivate();
            document.title = this._getCageTabTitle();
        }

        // 첫 문장 표시
        this._cageAdvance();
    }

    /**
     * CAGE END 모드에서 클릭 시 다음 문장 출력.
     * 클릭 수에 따라 글리치, 설화 목소리, 탈출 버튼 등장.
     */
    _cageAdvance() {
        if (this.dialogue.isTyping) {
            this.dialogue.skipTyping();
            return;
        }

        this._cageClickCount++;
        const count = this._cageClickCount;
        if (this._applyCageRepeatEffects(count)) return;

        // 30~50: 가끔 글리치
        if (count > 30 && count <= 50 && Math.random() < 0.25) {
            this.glitch.screenNoise?.(200);
        }

        // 50~58: 설화 목소리 (5번 중 랜덤)
        if (count > 50 && count <= 58 && Math.random() < 0.4) {
            this._cageSeolhwaWhisper();
            return;
        }

        // 59: 마지막 설화 메시지
        if (count === 59) {
            this._cageSeolhwaFinal();
            return;
        }

        // 60: 탈출 버튼 등장 + 일반 문장 계속
        if (count === 60) {
            this._cageShowExitButton();
        }

        // 문장 풀에서 다음 문장 선택
        const text = this._getNextCageText();
        const isNarration = text.startsWith('*') && text.endsWith('*');
        const display = isNarration ? text.slice(1, -1) : text;

        this.dialogue.type('', `*${display}*`, null, {
            typingSpeed: CONFIG.TYPING_SPEED
        });
    }

    _showMetaFlash(text, duration = 700, x = 50, y = 42) {
        if (!text) return;
        if (this.glitchAdvanced?.showGhostText) {
            this.glitchAdvanced.showGhostText(text, x, y, duration);
        } else {
            this.glitch.ghostText?.(text, x, y, duration);
        }
    }

    _applyCageRepeatEffects(count) {
        const effect = this._cageRepeatEffects?.[count];
        const seaVariant = this._cageSeaVariants?.[count];
        const degradeSeaLunchbox = this._cageSeaVariants?.lunchboxDegrade && count > 1 && count % 10 === 0;

        if (!effect && !seaVariant && !degradeSeaLunchbox) return false;

        if (degradeSeaLunchbox) {
            this.glitch.screenNoise?.(120);
        }

        if (effect?.flashText) {
            this._showMetaFlash(this._pickLocalizedValue(effect.flashText), effect.flashDuration || 700);
        }

        if (effect?.screenBlackout || seaVariant?.emptyLunchbox) {
            this._blackoutScreen(effect?.screenBlackout ? 520 : 260);
        }

        if (Array.isArray(seaVariant?.seaLines)) {
            seaVariant.seaLines.slice(0, 2).forEach((line, idx) => {
                setTimeout(() => this._showMetaFlash(this._pickLocalizedValue(line), 1200, 50, 58 + idx * 8), idx * 450);
            });
        }

        if (effect?.eunsuBreaksFourthWall) {
            const img = CONFIG.EXPRESSIONS.eunsu?.obsessed || CONFIG.EXPRESSIONS.eunsu?.normal;
            if (img) this.renderer.setCharacter('center', img);

            const eunsuLine = this._pickLocalizedValue(effect.eunsuLine) || '...';
            this.dialogue.type('', `*${eunsuLine}*`, () => {
                setTimeout(() => this.renderer.clearCharacters(), 1600);
            }, { typingSpeed: 70, unskippable: true });
            return true;
        }

        return false;
    }

    /**
     * CAGE END 설화 속삭임 (50~58 클릭)
     */
    _cageSeolhwaWhisper() {
        const whispers = this._getCageSeolhwaTexts();
        const idx = Math.floor(Math.random() * whispers.length);

        // 글리치 효과
        this.glitch.screenNoise?.(300);

        // 캐릭터 잠깐 표시
        this.renderer.setCharacter('center', CONFIG.EXPRESSIONS.seolhwa?.fade);

        this.dialogue.type('', `*${whispers[idx]}*`, () => {
            // 1.5초 후 캐릭터 사라짐
            setTimeout(() => {
                this.renderer.clearCharacters();
            }, 1500);
        }, { typingSpeed: 60, unskippable: true });
    }

    /**
     * CAGE END 설화 마지막 메시지 (59 클릭)
     */
    _cageSeolhwaFinal() {
        this.glitch.heavyGlitch?.(500);
        this.renderer.setCharacter('center', CONFIG.EXPRESSIONS.seolhwa?.fade);

        const finalText = this._getCageSeolhwaFinal();

        this.dialogue.type('', `*${finalText}*`, () => {
            setTimeout(() => {
                this.renderer.clearCharacters();
            }, 2000);
        }, { typingSpeed: 80, unskippable: true });
    }

    /**
     * CAGE END 탈출 버튼 표시 (60 클릭)
     * 작고 희미하게 시작하여 서서히 밝아지는 [X] 버튼
     */
    _cageShowExitButton() {
        if (this._cageExitBtn) return;

        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;

        const btn = document.createElement('button');
        btn.className = 'cage-exit-btn';
        btn.textContent = '×';
        btn.title = this._getCageExitTooltip();

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._exitCageMode();
        });

        gameScreen.appendChild(btn);
        this._cageExitBtn = btn;

        // 서서히 나타남 (CSS transition)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                btn.classList.add('cage-exit-visible');
            });
        });
    }

    /**
     * CAGE END 모드에서 탈출. 타이틀 화면으로 복귀.
     */
    _exitCageMode() {
        this._cageMode = false;
        this._cageClickCount = 0;
        this._cageRepeatEffects = {};
        this._cageSeaVariants = {};
        this._cagePool = [];

        // 탈출 버튼 제거
        if (this._cageExitBtn) {
            this._cageExitBtn.remove();
            this._cageExitBtn = null;
        }

        // 퀵 메뉴 복원
        const qm = document.getElementById('quick-menu');
        if (qm) qm.classList.remove('cage-hidden');

        // 탭 제목 복원
        if (this.metaHorror) {
            document.title = this.metaHorror.originalTitle;
        }

        // 글리치 연출 후 타이틀로
        this.glitch.heavyGlitch?.(800);
        setTimeout(() => {
            this._showScreen('title-screen');
        }, 1000);
    }

    /**
     * CAGE END 문장 풀에서 다음 문장을 가져옵니다.
     * 풀 끝에 도달하면 재셔플합니다.
     */
    _getNextCageText() {
        if (this._cagePoolIndex >= this._cagePool.length) {
            this._cagePool = this._shuffleArray(this._cagePool);
            this._cagePoolIndex = 0;
        }
        return this._cagePool[this._cagePoolIndex++];
    }

    /**
     * Fisher-Yates 셔플
     */
    _shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ── CAGE END i18n 텍스트 ──

    _getCageHudText() {
        const map = {
            ko: '행복한 교실', en: 'Happy Classroom', ja: '幸せな教室',
            es: 'Aula Feliz', fr: 'Classe Heureuse', de: 'Glückliches Klassenzimmer',
            pt: 'Sala de Aula Feliz'
        };
        return map[this.i18n.currentLang] || map.en;
    }

    _getCageTabTitle() {
        const map = {
            ko: '졸업하지 못한 교실 — 행복한 매일',
            en: 'The Classroom — Happy Every Day',
            ja: '卒業できない教室 — 幸せな毎日',
            es: 'El Aula — Feliz Cada Día',
            fr: 'La Classe — Heureux Chaque Jour',
            de: 'Das Klassenzimmer — Glücklich Jeden Tag',
            pt: 'A Sala de Aula — Feliz Todos os Dias'
        };
        return map[this.i18n.currentLang] || map.en;
    }

    _getCageSeolhwaTexts() {
        const map = {
            ko: ['...여기서 나가.', '이건 진짜가 아니야.', '기억해. 너는 13번째야.', '눈을 떠.', '...나를 기억해?'],
            en: ['...Get out of here.', 'This isn\'t real.', 'Remember. You are the 13th.', 'Open your eyes.', '...Do you remember me?'],
            ja: ['...ここから出て.', 'これは本物じゃない.', '思い出して。あなたは13番目.', '目を覚まして.', '...私を覚えてる？'],
            es: ['...Sal de aquí.', 'Esto no es real.', 'Recuerda. Eres el 13°.', 'Abre los ojos.', '...¿Me recuerdas?'],
            fr: ['...Sors d\'ici.', 'Ce n\'est pas réel.', 'Souviens-toi. Tu es le 13e.', 'Ouvre les yeux.', '...Tu te souviens de moi ?'],
            de: ['...Geh hier raus.', 'Das ist nicht echt.', 'Erinnere dich. Du bist der 13.', 'Öffne die Augen.', '...Erinnerst du dich an mich?'],
            pt: ['...Saia daqui.', 'Isto não é real.', 'Lembre-se. Você é o 13º.', 'Abra os olhos.', '...Você se lembra de mim?']
        };
        return map[this.i18n.currentLang] || map.en;
    }

    _getCageSeolhwaFinal() {
        const map = {
            ko: '...화면 오른쪽 위를 봐. 내가 길을 열어놨어.',
            en: '...Look at the top right of the screen. I opened a way out.',
            ja: '...画面の右上を見て。道を開けておいたから。',
            es: '...Mira la esquina superior derecha. Abrí una salida.',
            fr: '...Regarde en haut à droite. J\'ai ouvert un passage.',
            de: '...Schau oben rechts. Ich habe einen Weg geöffnet.',
            pt: '...Olhe no canto superior direito. Eu abri uma saída.'
        };
        return map[this.i18n.currentLang] || map.en;
    }

    _getCageExitTooltip() {
        const map = {
            ko: '나가기', en: 'Exit', ja: '出る',
            es: 'Salir', fr: 'Sortir', de: 'Raus', pt: 'Sair'
        };
        return map[this.i18n.currentLang] || map.en;
    }
}
