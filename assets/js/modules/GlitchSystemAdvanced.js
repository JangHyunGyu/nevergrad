/**
 * ============================================================================
 * GlitchSystemAdvanced.js - 확장 글리치 연출 시스템
 * ============================================================================
 *
 * 기본 GlitchSystem.js의 개별 효과들을 조합하여
 * 시나리오 타임라인에 맞춘 점진적 글리치 연출을 제공합니다.
 *
 * [글리치 레벨]
 * NONE (Day 1): 효과 없음 — 완벽한 미연시
 * SUBTLE (Day 2 오후): 미세한 위화감 — 선택지 깜빡임, BGM 미세 변조
 * UNSETTLING (Day 3): 불쾌한 골짜기 — 노이즈, 텍스트 왜곡, 유령 텍스트
 * BREAKING (Day 4): 장르 전환 — 테마 색상 변환, 스탯 폭로, 강한 글리치
 * NIGHTMARE (Day 5): 완전 붕괴 — 화면 깨짐, 레드 비네트, BGM 왜곡
 *
 * [트리거 키]
 * - 'day2_night_stat_flicker': Day 2 밤 스탯 깜빡임
 * - 'day3_lunch_stat_shift': Day 3 점심 스탯 라벨 변환
 * - 'day3_after_riin_flicker': Day 3 리인 후 선택지 깜빡임
 * - 'day3_night_genre_shift': Day 3 밤 장르 전환
 * - 'day5_nightmare_full': Day 5 전면 붕괴
 */

class GlitchSystemAdvanced {
    // =========================================================================
    // Interactive photo deck and investigation scenes
    // =========================================================================

    showPhotoDeck(opts = {}) {
        this.hidePhotoDeck();

        const data = this._getPhotoDeckData(opts.deck || 'yuna_13');
        const photos = data.photos;
        const copy = this._getInteractionCopy(this._getLang());
        let index = 0;
        const viewed = new Set([0]);

        const overlay = document.createElement('div');
        overlay.className = 'photo-deck-overlay';
        overlay.id = 'photo-deck-overlay';

        const shell = document.createElement('div');
        shell.className = 'photo-deck-shell';

        const header = document.createElement('div');
        header.className = 'photo-deck-header';

        const title = document.createElement('div');
        title.className = 'photo-deck-title';
        title.textContent = data.title;

        const counter = document.createElement('div');
        counter.className = 'photo-deck-counter';

        header.appendChild(title);
        header.appendChild(counter);

        const viewport = document.createElement('div');
        viewport.className = 'photo-deck-viewport';

        const card = document.createElement('div');
        card.className = 'photo-deck-card';

        const scanline = document.createElement('div');
        scanline.className = 'photo-deck-scanline';

        const face = document.createElement('div');
        face.className = 'photo-deck-face';
        face.appendChild(document.createElement('span'));
        face.appendChild(document.createElement('span'));
        face.appendChild(document.createElement('span'));

        const meta = document.createElement('div');
        meta.className = 'photo-deck-meta';

        const slot = document.createElement('div');
        slot.className = 'photo-deck-slot';
        const name = document.createElement('div');
        name.className = 'photo-deck-name';
        const tag = document.createElement('div');
        tag.className = 'photo-deck-tag';
        const note = document.createElement('div');
        note.className = 'photo-deck-note';

        meta.appendChild(slot);
        meta.appendChild(name);
        meta.appendChild(tag);
        meta.appendChild(note);
        card.appendChild(scanline);
        card.appendChild(face);
        card.appendChild(meta);

        const prev = document.createElement('button');
        prev.className = 'photo-deck-nav photo-deck-prev';
        prev.type = 'button';
        prev.textContent = '\u2039';
        prev.setAttribute('aria-label', copy.previous);

        const next = document.createElement('button');
        next.className = 'photo-deck-nav photo-deck-next';
        next.type = 'button';
        next.textContent = '\u203a';
        next.setAttribute('aria-label', copy.next);

        viewport.appendChild(prev);
        viewport.appendChild(card);
        viewport.appendChild(next);

        const strip = document.createElement('div');
        strip.className = 'photo-deck-strip';

        const hint = document.createElement('div');
        hint.className = 'photo-deck-hint';
        hint.textContent = copy.photoHint;

        const complete = document.createElement('button');
        complete.className = 'photo-deck-complete hidden';
        complete.type = 'button';
        complete.textContent = copy.photoComplete;

        shell.appendChild(header);
        shell.appendChild(viewport);
        shell.appendChild(strip);
        shell.appendChild(hint);
        shell.appendChild(complete);
        overlay.appendChild(shell);
        document.body.appendChild(overlay);

        const render = (direction = 0) => {
            const photo = photos[index];
            viewed.add(index);

            card.classList.remove('photo-deck-card-in', 'photo-deck-card-prev', 'photo-deck-card-next', 'photo-deck-current');
            void card.offsetWidth;
            card.classList.add('photo-deck-card-in', direction < 0 ? 'photo-deck-card-prev' : 'photo-deck-card-next');
            if (photo.current) card.classList.add('photo-deck-current');

            const playerName = this.engine?.state?.playerName || copy.player;
            slot.textContent = `#${String(photo.slot).padStart(2, '0')}`;
            name.textContent = String(photo.name).replace('{name}', playerName);
            tag.textContent = photo.tag;
            note.textContent = photo.note;
            counter.textContent = `${index + 1} / ${photos.length}`;
            face.classList.toggle('photo-deck-face-image', !!photo.image);
            face.style.backgroundImage = photo.image
                ? `url('${new URL(photo.image, document.baseURI).href}')`
                : '';

            strip.innerHTML = '';
            photos.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'photo-deck-dot';
                if (i === index) dot.classList.add('photo-deck-dot-active');
                if (viewed.has(i)) dot.classList.add('photo-deck-dot-seen');
                dot.setAttribute('aria-label', `${copy.photo} ${i + 1}`);
                dot.addEventListener('click', () => {
                    const dir = i > index ? 1 : -1;
                    index = i;
                    render(dir);
                });
                strip.appendChild(dot);
            });

            complete.classList.toggle('hidden', viewed.size < photos.length);
            if (viewed.size >= photos.length) hint.textContent = copy.photoDoneHint;

            this.engine?.audio?.playUIClick?.();
            if (photo.current) {
                this.engine?.glitch?.screenNoise?.(260);
                this.engine?.deviceGimmick?.vibrate?.('stat_crack');
            }
        };

        const advance = (delta) => {
            const nextIndex = Math.max(0, Math.min(photos.length - 1, index + delta));
            if (nextIndex === index) return;
            index = nextIndex;
            render(delta);
        };

        prev.addEventListener('click', () => advance(-1));
        next.addEventListener('click', () => advance(1));
        card.addEventListener('click', () => advance(1));

        let dragStartX = null;
        const startDrag = (x) => { dragStartX = x; };
        const endDrag = (x) => {
            if (dragStartX == null) return;
            const diff = x - dragStartX;
            dragStartX = null;
            if (Math.abs(diff) < 36) return;
            advance(diff < 0 ? 1 : -1);
        };

        viewport.addEventListener('mousedown', (e) => startDrag(e.clientX));
        viewport.addEventListener('mouseup', (e) => endDrag(e.clientX));
        viewport.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        viewport.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            if (touch) endDrag(touch.clientX);
        }, { passive: true });

        complete.addEventListener('click', () => {
            this.hidePhotoDeck();
            opts.onComplete?.();
        });

        requestAnimationFrame(() => overlay.classList.add('visible'));
        render(1);
    }

    hidePhotoDeck() {
        document.querySelector('#photo-deck-overlay')?.remove();
    }

    showLockerSearch(opts = {}) {
        this.hideLockerSearch();

        const copy = this._getInteractionCopy(this._getLang());
        let panelOpened = false;
        let cameraFound = false;

        const overlay = document.createElement('div');
        overlay.className = 'locker-search-overlay';
        overlay.id = 'locker-search-overlay';

        const shell = document.createElement('div');
        shell.className = 'locker-search-shell';

        const title = document.createElement('div');
        title.className = 'locker-search-title';
        title.textContent = copy.lockerTitle;

        const stage = document.createElement('div');
        stage.className = 'locker-search-stage';

        const lockers = [];
        for (let i = 0; i < 3; i++) {
            const locker = document.createElement('div');
            locker.className = 'locker-search-locker';
            if (i === 1) locker.classList.add('locker-search-target');
            lockers.push(locker);
            stage.appendChild(locker);
        }

        const proof = document.createElement('div');
        proof.className = 'locker-search-proof';
        proof.style.backgroundImage = `url('${new URL(CONFIG.EVIDENCE_IMAGES?.locker_camera || 'assets/images/evidence/locker_hidden_camera.png', document.baseURI).href}')`;
        stage.appendChild(proof);

        const status = document.createElement('div');
        status.className = 'locker-search-status';
        status.textContent = copy.lockerHint;

        const complete = document.createElement('button');
        complete.className = 'locker-search-complete hidden';
        complete.type = 'button';
        complete.textContent = copy.lockerComplete;

        const makeHotspot = (cls, label, text) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `locker-hotspot ${cls}`;
            btn.setAttribute('aria-label', label);
            btn.addEventListener('click', () => {
                status.textContent = text;
                btn.classList.add('locker-hotspot-found');
                this.engine?.audio?.playUIClick?.();
                this.engine?.deviceGimmick?.vibrate?.('timer_tick');
            });
            return btn;
        };

        lockers[0].appendChild(makeHotspot('locker-hotspot-dust', copy.dust, copy.dustFound));
        lockers[1].appendChild(makeHotspot('locker-hotspot-clean', copy.clean, copy.cleanFound));

        const seam = makeHotspot('locker-hotspot-seam', copy.seam, copy.seamFound);
        lockers[1].appendChild(seam);

        const camera = makeHotspot('locker-hotspot-camera hidden', copy.camera, copy.cameraFound);
        lockers[1].appendChild(camera);

        seam.addEventListener('click', () => {
            if (panelOpened) return;
            panelOpened = true;
            stage.classList.add('locker-panel-open');
            camera.classList.remove('hidden');
        });

        camera.addEventListener('click', () => {
            if (cameraFound) return;
            cameraFound = true;
            stage.classList.add('locker-camera-found');
            proof.classList.add('visible');
            complete.classList.remove('hidden');
            this.engine?.glitch?.screenNoise?.(180);
        });

        complete.addEventListener('click', () => {
            this.hideLockerSearch();
            opts.onComplete?.();
        });

        shell.appendChild(title);
        shell.appendChild(stage);
        shell.appendChild(status);
        shell.appendChild(complete);
        overlay.appendChild(shell);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('visible'));
    }

    hideLockerSearch() {
        document.querySelector('#locker-search-overlay')?.remove();
    }

    _getLang() {
        const lang = this.engine?.i18n?.currentLang || document.documentElement.lang || 'ko';
        return String(lang).toLowerCase().startsWith('pt') ? 'pt-BR' : String(lang).slice(0, 2);
    }

    _getInteractionCopy(lang) {
        const map = {
            ko: {
                player: '나',
                previous: '이전 사진',
                next: '다음 사진',
                photo: '사진',
                photoHint: '사진을 클릭하거나 좌우로 넘기세요. 마지막까지 확인해야 내려놓을 수 있습니다.',
                photoDoneHint: '모든 사진을 확인했습니다.',
                photoComplete: '카메라를 내려놓는다',
                lockerTitle: '유나의 사물함',
                lockerHint: '이상한 지점을 눌러 조사하세요.',
                dust: '먼지가 쌓인 사물함',
                clean: '닦인 사물함',
                seam: '들뜬 바닥판',
                camera: '숨겨진 카메라',
                dustFound: '옆 사물함에는 먼지가 그대로 남아 있다.',
                cleanFound: '유나의 사물함만 최근에 닦은 흔적이 있다.',
                seamFound: '바닥 합판이 손톱 하나만큼 떠 있다.',
                cameraFound: '이중 바닥 안쪽에서 카메라를 꺼냈다.',
                lockerComplete: '카메라를 켠다'
            },
            en: {
                player: 'Me',
                previous: 'Previous photo',
                next: 'Next photo',
                photo: 'Photo',
                photoHint: 'Click or swipe through the photos. You cannot put the camera down yet.',
                photoDoneHint: 'Every photo has been checked.',
                photoComplete: 'Put the camera down',
                lockerTitle: "Yuna's locker",
                lockerHint: 'Tap the suspicious spots to inspect them.',
                dust: 'Dusty locker',
                clean: 'Wiped locker',
                seam: 'Raised floor panel',
                camera: 'Hidden camera',
                dustFound: 'The neighboring locker still has dust on it.',
                cleanFound: "Only Yuna's locker was wiped recently.",
                seamFound: 'The plywood floor is raised by a fingernail.',
                cameraFound: 'A camera is hidden under the false bottom.',
                lockerComplete: 'Turn the camera on'
            },
            'pt-BR': {
                player: 'Eu',
                previous: 'Foto anterior',
                next: 'Próxima foto',
                photo: 'Foto',
                photoHint: 'Clique ou deslize pelas fotos. Você ainda não pode abaixar a câmera.',
                photoDoneHint: 'Todas as fotos foram verificadas.',
                photoComplete: 'Abaixar a câmera',
                lockerTitle: 'Armário da Yuna',
                lockerHint: 'Toque nos pontos suspeitos para investigar.',
                dust: 'Armário empoeirado',
                clean: 'Armário limpo',
                seam: 'Painel do piso levantado',
                camera: 'Câmera escondida',
                dustFound: 'O armário ao lado ainda está coberto de poeira.',
                cleanFound: 'Só o armário da Yuna foi limpo recentemente.',
                seamFound: 'O compensado do piso está levantado por uma unha.',
                cameraFound: 'Há uma câmera escondida sob o fundo falso.',
                lockerComplete: 'Ligar a câmera'
            }
        };
        return map[lang] || map.en;
    }

    _getPhotoDeckData(deck) {
        return {
            title: deck === 'yuna_13' ? 'YUNA_CAM / TRANSFER_STUDENTS' : 'CAMERA_ROLL',
            photos: [
                { slot: 1, name: '김도진', tag: '04.03 / 교문', note: '짧은 검은 머리. 새 교복.' },
                { slot: 2, name: '이준서', tag: '04.08 / 교문', note: '안경. 같은 자세.' },
                { slot: 3, name: '박서진', tag: '04.13 / 교문', note: '갈색 머리. 같은 눈.' },
                { slot: 4, name: '정하율', tag: '04.18 / 교문', note: '머리색만 다르다.' },
                { slot: 5, name: '강민혁', tag: '04.23 / 교문', note: '입꼬리의 흉터 위치가 같다.' },
                { slot: 6, name: '윤재원', tag: '04.28 / 교문', note: '이름표만 바뀌었다.' },
                { slot: 7, name: '김태호', tag: '05.03 / 교문', note: '피곤한 얼굴. 눈 밑이 꺼져 있다.' },
                { slot: 8, name: '최시우', tag: '05.08 / 교문', note: '뒷주머니에 접힌 메모.' },
                { slot: 9, name: '한지호', tag: '05.13 / 교문', note: '카메라를 알아본 표정.' },
                { slot: 10, name: '송예준', tag: '05.18 / 교문', note: '시선이 CCTV로 향해 있다.' },
                { slot: 11, name: '오태현', tag: '05.23 / 교문', note: '웃고 있지만 손은 굳어 있다.' },
                { slot: 12, name: '임서율', tag: '05.28 / 교문', note: '교복 깃의 접힌 자국까지 같다.' },
                { slot: 13, name: '{name}', tag: '어제 아침 / 교문', note: '현재 관찰 중.', current: true, image: CONFIG.EVIDENCE_IMAGES?.yuna_photo || 'assets/images/evidence/yuna_photo_evidence.png' }
            ]
        };
    }

    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {string} 현재 글리치 레벨 */
        this.level = 'NONE';

        /** @type {HTMLElement|null} 글리치 오버레이 요소 */
        this.overlay = document.getElementById('glitch-overlay');

        /** @type {Array<{text: string, el: HTMLElement}>} 유령 텍스트 대기열 */
        this.ghostTextQueue = [];

        /** @type {number[]} 활성 타이머 ID 목록 (정리용) */
        this._activeTimers = [];

        /** @type {HTMLElement|null} 레드 비네트 요소 */
        this._redVignette = null;

        /** @type {boolean} 위험도 스탯 공개 여부 */
        this._dangerStatsRevealed = false;
    }

    showMirrorPlayerReveal(stage = 0) {
        const gameScreen = document.getElementById('game-screen') || document.body;
        let mirror = document.getElementById('mirror-player-reflection');
        if (!mirror) {
            mirror = document.createElement('div');
            mirror.id = 'mirror-player-reflection';
            mirror.className = 'mirror-player-reflection mirror-player-stage-0';
            mirror.innerHTML = `
                <div class="mirror-player-glass"></div>
                <div class="mirror-player-face">
                    <span class="mirror-player-hair"></span>
                    <span class="mirror-player-eye mirror-player-eye-left"></span>
                    <span class="mirror-player-eye mirror-player-eye-right"></span>
                    <span class="mirror-player-nose"></span>
                    <span class="mirror-player-mouth"></span>
                </div>
            `;
            gameScreen.appendChild(mirror);
        }

        mirror.classList.remove(
            'mirror-player-stage-0',
            'mirror-player-stage-1',
            'mirror-player-stage-2',
            'mirror-player-stage-3'
        );
        mirror.classList.add(`mirror-player-stage-${Math.max(0, Math.min(3, Number(stage) || 0))}`);
        requestAnimationFrame(() => mirror.classList.add('visible'));
        return mirror;
    }

    // =========================================================================
    // 글리치 레벨 관리
    // =========================================================================

    /**
     * 글리치 강도 레벨 설정
     * 레벨에 따라 허용되는 효과 범위가 달라짐
     *
     * @param {'NONE'|'SUBTLE'|'UNSETTLING'|'BREAKING'|'NIGHTMARE'} level
     */
    setLevel(level) {
        const validLevels = ['NONE', 'SUBTLE', 'UNSETTLING', 'BREAKING', 'NIGHTMARE'];
        if (!validLevels.includes(level)) return;

        this.level = level;

        // 엔진 상태와 동기화
        if (this.engine?.state) {
            const levelMap = {
                NONE: 0, SUBTLE: 1, UNSETTLING: 2, BREAKING: 3, NIGHTMARE: 4
            };
            this.engine.state.setGlitchLevel(levelMap[level] ?? 0);
        }
    }

    /**
     * 현재 레벨의 수치 값 반환
     * @returns {number} 0~4
     * @private
     */
    _getLevelValue() {
        const map = { NONE: 0, SUBTLE: 1, UNSETTLING: 2, BREAKING: 3, NIGHTMARE: 4 };
        return map[this.level] ?? 0;
    }

    // =========================================================================
    // 오버레이 효과
    // =========================================================================

    /**
     * 노이즈 오버레이 표시
     *
     * @param {number} [duration=300] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showNoise(duration = 300) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('noise');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('noise');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 강한 글리치 오버레이 (스캔라인 + 색수차)
     *
     * @param {number} [duration=1000] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showHeavyGlitch(duration = 1000) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('heavy-glitch');

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.add('screen-shake');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('heavy-glitch');
                if (gameScreen) gameScreen.classList.remove('screen-shake');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 화면 흔들림 효과
     *
     * @param {number} [duration=500] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showScreenShake(duration = 500) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return Promise.resolve();

        gameScreen.classList.add('screen-shake');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                gameScreen.classList.remove('screen-shake');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 전체 화면 블랙아웃 (암전)
     *
     * @param {number} [duration=1000] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showBlackout(duration = 1000) {
        const blackout = document.createElement('div');
        blackout.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000;
            z-index: 60;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        document.body.appendChild(blackout);

        // 페이드 인
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                blackout.style.opacity = '1';
            });
        });

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                // 페이드 아웃
                blackout.style.opacity = '0';
                setTimeout(() => {
                    blackout.remove();
                    resolve();
                }, 200);
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    // =========================================================================
    // 텍스트 효과
    // =========================================================================

    /**
     * 유령 텍스트 — 대화창 밖에서 떠오르는 반투명 텍스트
     *
     * @param {string} text - 표시할 텍스트
     * @param {number} [x=50] - X 위치 (%, 화면 기준)
     * @param {number} [y=30] - Y 위치 (%, 화면 기준)
     * @param {number} [duration=2000] - 표시 시간 (ms)
     */
    showGhostText(text, x = 50, y = 30, duration = 2000) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-text';
        ghost.textContent = text;
        ghost.style.left = `${x}%`;
        ghost.style.top = `${y}%`;

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.appendChild(ghost);
        } else {
            document.body.appendChild(ghost);
        }

        this.ghostTextQueue.push({ text, el: ghost });

        const timer = setTimeout(() => {
            ghost.remove();
            this.ghostTextQueue = this.ghostTextQueue.filter(g => g.el !== ghost);
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 텍스트 요소에 글리치 플래시 적용
     *
     * @param {HTMLElement} element - 대상 요소
     * @param {number} [duration=200] - 효과 지속 시간 (ms)
     */
    showGlitchText(element, duration = 200) {
        if (!element) return;

        element.classList.add('glitch-text');

        const timer = setTimeout(() => {
            element.classList.remove('glitch-text');
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 텍스트에 Zalgo(결합 문자) 삽입하여 깨진 텍스트 생성
     *
     * @param {string} text - 원본 텍스트
     * @param {number} [intensity=0.1] - 오염 강도 (0~1)
     * @returns {string} Zalgo 처리된 텍스트
     */
    corruptText(text, intensity = 0.1) {
        /** @type {string[]} 결합 발음 구별 기호 (위) */
        const zalgoUp = [
            '\u0300', '\u0301', '\u0302', '\u0303', '\u0304',
            '\u0305', '\u0306', '\u0307', '\u0308', '\u030A',
            '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'
        ];
        /** @type {string[]} 결합 발음 구별 기호 (아래) */
        const zalgoDown = [
            '\u0316', '\u0317', '\u0318', '\u0319', '\u031A',
            '\u031B', '\u031C', '\u031D', '\u031E', '\u031F'
        ];
        /** @type {string[]} 대체 기호 */
        const glitchChars = ['#', '$', '@', '?', '!', '&', '%', '̷', '̸', '̶'];

        const chars = [...text];

        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < intensity && chars[i] !== ' ') {
                // Zalgo 추가 또는 문자 대체
                if (Math.random() < 0.5) {
                    // Zalgo 결합 문자 추가
                    const numZalgo = Math.floor(Math.random() * 3) + 1;
                    for (let j = 0; j < numZalgo; j++) {
                        const pool = Math.random() < 0.5 ? zalgoUp : zalgoDown;
                        chars[i] += pool[Math.floor(Math.random() * pool.length)];
                    }
                } else {
                    // 문자 대체
                    chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
            }
        }

        return chars.join('');
    }

    // =========================================================================
    // 스탯 효과
    // =========================================================================

    /**
     * 스탯 라벨 깜빡임 — "호감도"가 순간적으로 "위험도"로 보이는 연출
     *
     * @param {HTMLElement} statEl - 스탯 라벨 요소
     * @param {string} revealText - 깜빡일 때 표시할 텍스트 (예: "위험도")
     * @param {number} [duration=150] - 깜빡임 지속 시간 (ms)
     */
    flickerStat(statEl, revealText, duration = 150) {
        if (!statEl) return;

        const original = statEl.textContent;

        statEl.textContent = revealText;
        statEl.classList.add('glitch-text');

        const timer = setTimeout(() => {
            statEl.textContent = original;
            statEl.classList.remove('glitch-text');
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 위험도 스탯 영구 공개 — 호감도 UI를 신뢰도/위험도로 전환
     * Day 3 밤 장르 전환 시 사용
     */
    async revealDangerStats() {
        if (this._dangerStatsRevealed) return;
        this._dangerStatsRevealed = true;

        // 모든 스탯 라벨 요소 찾기
        const statLabels = document.querySelectorAll('.stat-label, [data-stat-label]');

        for (const label of statLabels) {
            const thrillLabel = label.dataset.thrillerlabel;
            if (!thrillLabel) continue;

            // 글리치 텍스트 애니메이션으로 전환
            const original = label.textContent;

            // 단계 1: 텍스트 깨짐 (3회)
            for (let i = 0; i < 3; i++) {
                label.textContent = this.corruptText(original, 0.3 + i * 0.15);
                label.classList.add('glitch-text');
                await this._sleep(100);
            }

            // 단계 2: 노이즈 플래시
            await this.showNoise(150);

            // 단계 3: 새 라벨로 교체
            label.textContent = thrillLabel;
            label.classList.remove('glitch-text');
            label.classList.add('stat-revealed');

            await this._sleep(300);
        }

        // 스탯 값도 업데이트 (danger 수치 표시)
        const statValues = document.querySelectorAll('[data-stat-danger]');
        statValues.forEach(el => {
            const charId = el.dataset.charId;
            if (charId && this.engine?.state) {
                const stats = this.engine.state.getRealStats(charId);
                el.textContent = stats.danger;
                el.classList.add('stat-revealed');
            }
        });
    }

    // =========================================================================
    // 화면 효과
    // =========================================================================

    /**
     * 레드 비네트 오버레이 추가 (Day 4+)
     * 화면 가장자리에 붉은 비네트 효과
     */
    showRedVignette() {
        if (this._redVignette) return;

        const bgOverlay = document.getElementById('bg-overlay');
        if (bgOverlay) {
            bgOverlay.classList.add('vignette-red');
            this._redVignette = bgOverlay;
        }
    }

    /**
     * 레드 비네트 제거
     */
    hideRedVignette() {
        if (this._redVignette) {
            this._redVignette.classList.remove('vignette-red');
            this._redVignette = null;
        }
    }

    /**
     * 약물 블러 블랙아웃 효과
     * 리인 음료 마신 후 발생하는 시야 흐림
     *
     * @param {number} [duration=500] - 효과 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showDrugBlur(duration = 500) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('drug-blur');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('drug-blur');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    // =========================================================================
    // BGM 조작
    // =========================================================================

    /**
     * BGM 재생 속도를 점진적으로 감속
     *
     * @param {HTMLAudioElement} audioEl - 오디오 요소
     * @param {number} [factor=0.7] - 최종 속도 비율 (1.0 = 정상)
     * @param {number} [duration=3000] - 감속에 걸리는 시간 (ms)
     */
    slowdownBGM(audioEl, factor = 0.7, duration = 3000) {
        if (!audioEl) return;

        const startRate = audioEl.playbackRate;
        const delta = startRate - factor;
        const startTime = Date.now();

        const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);

            // easeOutQuad로 자연스러운 감속
            const eased = 1 - (1 - progress) * (1 - progress);
            audioEl.playbackRate = startRate - (delta * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    /**
     * BGM 즉시 정지 — 갑작스러운 정적 연출
     *
     * @param {HTMLAudioElement} audioEl - 오디오 요소
     */
    stopBGM(audioEl) {
        if (!audioEl) return;

        // 볼륨을 급격히 낮춘 뒤 정지
        const originalVol = audioEl.volume;
        audioEl.volume = 0;

        setTimeout(() => {
            audioEl.pause();
            audioEl.volume = originalVol;
        }, 50);
    }

    // =========================================================================
    // 시나리오 타임라인 트리거
    // =========================================================================

    /**
     * 키 이름으로 사전 정의된 글리치 시퀀스 실행
     *
     * @param {string} key - 트리거 키
     * @returns {Promise<void>}
     *
     * @example
     * glitchAdv.triggerGlitch('day2_night_stat_flicker');
     * glitchAdv.triggerGlitch('day3_night_genre_shift');
     */
    async triggerGlitch(key) {
        switch (key) {

            // ===== Day 2 밤: 스탯 미세 깜빡임 =====
            // "호감도" 라벨이 0.15초간 "위험도"로 깜빡임
            case 'day2_night_stat_flicker': {
                this.setLevel('SUBTLE');

                const statLabels = document.querySelectorAll('.stat-label, [data-stat-label]');
                const randomLabel = statLabels[Math.floor(Math.random() * statLabels.length)];
                if (randomLabel) {
                    this.flickerStat(randomLabel, '위험도', 150);
                }

                // BGM 미세 변조
                const bgm = this.engine?.renderer?.bgmAudio;
                if (bgm) {
                    const origRate = bgm.playbackRate;
                    bgm.playbackRate = 0.97;
                    await this._sleep(2000);
                    bgm.playbackRate = origRate;
                }
                break;
            }

            // ===== Day 3 점심: 스탯 라벨 잠깐 이동 =====
            // "호감도" → 글리치 → "???" → 복구
            case 'day3_lunch_stat_shift': {
                this.setLevel('UNSETTLING');

                const labels = document.querySelectorAll('.stat-label, [data-stat-label]');
                for (const label of labels) {
                    const orig = label.textContent;
                    label.textContent = this.corruptText(orig, 0.4);
                    label.classList.add('glitch-text');
                    await this._sleep(200);
                    label.textContent = '???';
                    await this._sleep(300);
                    label.textContent = orig;
                    label.classList.remove('glitch-text');
                }

                await this.showNoise(200);
                break;
            }

            // ===== Day 3 리인 후: 선택지 잔상 깜빡임 =====
            // 게임 화면 모서리에 유령 텍스트 표시
            case 'day3_after_riin_flicker': {
                this.setLevel('UNSETTLING');

                // 유령 텍스트 연속 표시
                this.showGhostText('...도망쳐', 20, 15, 2500);
                await this._sleep(800);
                this.showGhostText('여기서 나가', 75, 25, 2000);
                await this._sleep(1200);
                this.showGhostText('마시지 마', 30, 70, 1800);

                // 노이즈 플래시
                await this._sleep(500);
                await this.showNoise(150);
                break;
            }

            // ===== Day 3 밤: 장르 전환 =====
            // 핵심 연출 — 로맨스 → 스릴러 전면 전환
            case 'day3_night_genre_shift': {
                this.setLevel('BREAKING');

                // 1) BGM 감속
                const bgmEl = this.engine?.renderer?.bgmAudio;
                if (bgmEl) {
                    this.slowdownBGM(bgmEl, 0.5, 2000);
                }

                // 2) 화면 흔들림
                await this.showScreenShake(800);

                // 3) 강한 노이즈
                await this.showHeavyGlitch(1500);

                // 4) 블랙아웃
                await this.showBlackout(1000);

                // 5) BGM 완전 정지
                if (bgmEl) {
                    this.stopBGM(bgmEl);
                }

                // 6) 스탯 폭로
                await this.revealDangerStats();

                // 7) 테마 색상 전환
                if (this.engine?.glitch) {
                    this.engine.glitch.shiftTheme('thriller');
                }

                // 8) 레드 비네트
                this.showRedVignette();

                // 9) 상태 매니저 동기화
                if (this.engine?.state) {
                    this.engine.state.triggerGenreShift();
                }

                // 10) 콘솔 메시지 업데이트
                if (this.engine?.metaHorror) {
                    this.engine.metaHorror.printConsoleMessage(3);
                    this.engine.metaHorror.activate(3);
                }
                break;
            }

            // ===== Day 5: 전면 붕괴 =====
            // 모든 효과 동시 발동
            case 'day5_nightmare_full': {
                this.setLevel('NIGHTMARE');

                // 진동 (모바일)
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.vibrate('paralysis');
                }

                // 동시 다발 효과
                this.showRedVignette();
                this.showGhostText('졸업하지 못한 교실', 50, 20, 4000);
                this.showGhostText('도망칠 수 없어', 30, 50, 3000);
                this.showGhostText('{name}, 돌아와', 70, 40, 3500);

                await this.showHeavyGlitch(2000);

                // 화면 연속 글리치
                for (let i = 0; i < 3; i++) {
                    await this.showNoise(200);
                    await this._sleep(300);
                    await this.showScreenShake(400);
                    await this._sleep(200);
                }

                // BGM 왜곡
                const audio = this.engine?.renderer?.bgmAudio;
                if (audio) {
                    this.slowdownBGM(audio, 0.3, 4000);
                }

                // 블랙아웃 피날레
                await this._sleep(1000);
                await this.showBlackout(2000);

                // 커서 감속 (PC)
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.enableCursorSlowdown();
                }

                // 콘솔 메시지
                if (this.engine?.metaHorror) {
                    this.engine.metaHorror.printConsoleMessage(5);
                }
                break;
            }

            // ===== Day 4 밤: 세이브 파일 강제 오픈 =====
            // 핸드폰 화면이 혼자 켜지며 12개의 이전 주기 폭로
            case 'day4_night_save_slot': {
                this.setLevel('BREAKING');

                // 화면 흔들림 + 노이즈로 시작
                await this.showScreenShake(500);
                await this.showNoise(300);

                // 세이브 슬롯 UI 표시
                const playerName = this.engine?.state?.playerName || '{name}';
                if (this.engine?.save) {
                    await this.showSaveSlotGlitch(this.engine.save, playerName);
                }

                // 닫힌 후 글리치 여운
                await this.showHeavyGlitch(800);
                break;
            }

            default:
                console.warn(`[GlitchSystemAdvanced] 알 수 없는 트리거 키: ${key}`);
                break;
        }
    }

    // =========================================================================
    // 세이브 슬롯 글리치 UI (Day 4 밤 연출)
    // =========================================================================

    /**
     * Day 4 밤: 세이브 파일 강제 오픈 연출
     * 핸드폰 화면이 갑자기 켜지며 13개 슬롯이 드러남
     *
     * @param {SaveManager} saveManager - 세이브 매니저 인스턴스
     * @param {string} playerName - 현재 플레이어 이름
     * @returns {Promise<void>} 유저가 닫을 때까지 대기
     */
    async showSaveSlotGlitch(saveManager, playerName) {
        const overlay = document.getElementById('save-slot-overlay');
        const list = document.getElementById('save-slot-list');
        if (!overlay || !list) return;

        // 슬롯 데이터 생성
        const slots = saveManager.getSubjectSlots(playerName);

        // 기존 내용 클리어
        list.innerHTML = '';

        // 화면 진동 (모바일)
        if (this.engine?.deviceGimmick) {
            this.engine.deviceGimmick.vibrate('pulse');
        }

        // 오버레이 표시
        overlay.classList.remove('hidden');

        // 글리치 사운드 (있으면)
        await this.showNoise(200);

        // 슬롯 하나씩 순차 표시 (타자기 효과)
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const item = document.createElement('div');
            item.className = `save-slot-item ${slot.statusClass}`;
            item.style.animationDelay = `${i * 0.08}s`;
            item.style.position = 'relative';

            item.innerHTML = `
                <span class="slot-number">[${String(slot.number).padStart(2, '0')}]</span>
                <div class="slot-info">
                    <span class="slot-name">${slot.name}</span>
                    <span class="slot-day">${slot.day} ${slot.time}</span>
                </div>
                <span class="slot-status">${slot.status}</span>
            `;

            // 클릭 시 "로드 거절" 연출
            item.addEventListener('click', () => {
                this._handleSlotClick(item, slot);
            });

            list.appendChild(item);

            // 7번 슬롯(corrupted)에서 잠깐 멈춤 + 노이즈
            if (slot.number === 7) {
                await this._sleep(300);
                await this.showNoise(150);
            }
        }

        // NG+ 모드: 슬롯 13이 잠깐 1회차 결과를 보여줌
        if (slots[12].ngPlusFlash) {
            await this._sleep(800);
            const slot13 = list.children[12];
            if (slot13) {
                const statusEl = slot13.querySelector('.slot-status');
                const origStatus = statusEl.textContent;
                const origClass = slot13.className;

                // 0.5초간 1회차 결과 플래시
                statusEl.textContent = slots[12].ngPlusFlash.status;
                slot13.className = `save-slot-item ${slots[12].ngPlusFlash.statusClass} ng-flash`;

                await this._sleep(500);

                // 원래대로 복구
                statusEl.textContent = origStatus;
                slot13.className = origClass;
            }
        }

        // 유저가 닫을 때까지 대기 (ESC 또는 클릭으로 닫기)
        return new Promise((resolve) => {
            const closeHandler = (e) => {
                // 슬롯 아이템 클릭은 무시 (로드 거절 연출이 처리)
                if (e.target.closest('.save-slot-item')) return;

                // ESC 키 또는 배경 클릭으로 닫기
                if (e.type === 'keydown' && e.key !== 'Escape') return;

                overlay.classList.add('hidden');
                document.removeEventListener('keydown', closeHandler);
                overlay.removeEventListener('click', closeHandler);
                resolve();
            };

            // 3초 후에 닫기 활성화 (바로 닫히는 것 방지)
            const timer = setTimeout(() => {
                document.addEventListener('keydown', closeHandler);
                overlay.addEventListener('click', closeHandler);
            }, 3000);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 엔딩 크레딧용 세이브 파일 UI (SCENARIO.md 5436)
     * 메타 내러티브 마무리 — 13개 슬롯이 엔딩에 따라 다른 상태로 표시
     *
     * TRUE END: 전체 슬롯 '졸업 ✓' (13번째가 12번의 자신도 함께 졸업시킴)
     * 기타 END: 슬롯 13만 해당 엔딩 결과
     *
     * @param {SaveManager} saveManager
     * @param {string} playerName
     * @param {string} ending - 'TRUE' | 'ESCAPE' | 'RESIST' | 'CAGE' | 'FORGET' | 'GHOST' | 'COMPLICIT'
     */
    async showEndingCreditSaveUI(saveManager, playerName, ending) {
        const overlay = document.getElementById('save-slot-overlay');
        const list = document.getElementById('save-slot-list');
        if (!overlay || !list) return;

        const slots = saveManager.getSubjectSlots(playerName);

        list.innerHTML = '';
        overlay.classList.remove('hidden');
        overlay.classList.add('ending-credit-mode');

        await this.showNoise(300);

        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const item = document.createElement('div');

            let status, statusClass;
            if (ending === 'TRUE') {
                status = '졸업 ✓';
                statusClass = 'graduated';
            } else if (i === 12) {
                const endingMap = {
                    ESCAPE: { s: '실종', c: 'missing' },
                    RESIST: { s: '동행', c: 'escaped' },
                    CAGE: { s: '잔류', c: 'contained' },
                    FORGET: { s: '처리 완료', c: 'terminated' },
                    GHOST: { s: '소실', c: 'missing' },
                    COMPLICIT: { s: '전환 — 담당자', c: 'converted' }
                };
                const m = endingMap[ending] || { s: slot.status, c: slot.statusClass };
                status = m.s;
                statusClass = m.c;
            } else {
                status = slot.status;
                statusClass = slot.statusClass;
            }

            item.className = `save-slot-item ${statusClass} credit-slot`;
            item.style.animationDelay = `${i * 0.1}s`;
            item.innerHTML = `
                <span class="slot-number">[${String(slot.number).padStart(2, '0')}]</span>
                <div class="slot-info">
                    <span class="slot-name">${slot.name}</span>
                    <span class="slot-day">${slot.day} ${slot.time}</span>
                </div>
                <span class="slot-status">${status}</span>
            `;
            list.appendChild(item);

            await this._sleep(100);
        }

        return new Promise((resolve) => {
            const close = () => {
                overlay.classList.add('hidden');
                overlay.classList.remove('ending-credit-mode');
                document.removeEventListener('keydown', close);
                overlay.removeEventListener('click', close);
                resolve();
            };
            const t = setTimeout(() => {
                document.addEventListener('keydown', close);
                overlay.addEventListener('click', close);
            }, 2500);
            this._activeTimers.push(t);
        });
    }

    /**
     * 슬롯 클릭 시 "로드 불가" 연출
     * @private
     */
    _handleSlotClick(item, slot) {
        // 이미 거절 메시지가 있으면 무시
        if (item.querySelector('.slot-denied-msg')) return;

        // 흔들림 애니메이션
        item.classList.add('load-denied');
        setTimeout(() => item.classList.remove('load-denied'), 400);

        // 거절 메시지
        let msg = '권한이 없습니다.';
        if (slot.number === 7) {
            msg = '해당 데이터는 손상되었습니다.';
        } else if (slot.statusClass === 'active') {
            msg = '진행 중...';
        }

        const msgEl = document.createElement('span');
        msgEl.className = 'slot-denied-msg';
        msgEl.textContent = msg;
        item.appendChild(msgEl);

        setTimeout(() => msgEl.remove(), 1500);
    }

    // =========================================================================
    // NG+ 타이틀 화면 변조 (SCENARIO.md 5002-5012)
    // =========================================================================

    /**
     * 2회차 타이틀 화면 변조 적용
     * - 로고 균열 텍스처
     * - [이어하기] 버튼 아래 서브텍스트
     * - [새 게임] 버튼 엔딩별 깜빡임
     *
     * @param {SaveManager} saveManager
     */
    applyNGPlusTitleCorruption(saveManager) {
        if (!saveManager.isNewGamePlus()) return;

        const meta = saveManager.getMeta();

        // 1. 로고 균열 텍스처
        const titleText = document.querySelector('.title-text');
        if (titleText) {
            titleText.classList.add('ng-plus-cracked');
        }

        // 1-2. 캐릭터 일러스트 시선 변경 (SCENARIO.md 5454)
        // 타이틀 스테이지 전반 채도 하락 + 세아(왼쪽)만 정면 응시 스프라이트로 교체
        const stage = document.getElementById('title-stage');
        if (stage) stage.classList.add('ng-plus-mode');
        const seaChar = document.getElementById('title-char-sea');
        if (seaChar) {
            seaChar.classList.add('ng-plus-stare');
            const ngpSrc = seaChar.dataset.ngp;
            if (ngpSrc) {
                // NG+ 전용 응시 스프라이트가 로드되면 교체, 실패 시 기본 + 필터만 유지
                const probe = new Image();
                probe.onload = () => { seaChar.src = ngpSrc; };
                probe.src = ngpSrc;
            }
        }

        // 2. [이어하기] 버튼 아래 서브텍스트
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn && !continueBtn.querySelector('.ng-plus-load-subtext')) {
            const sub = document.createElement('span');
            sub.className = 'ng-plus-load-subtext';
            // i18n은 한국어 기본, 다국어 HTML에서는 해당 언어 적용
            sub.textContent = '\u200B'; // zero-width space placeholder
            continueBtn.style.position = 'relative';
            continueBtn.appendChild(sub);

            // 매우 작은 글씨로 읽히지 않을 정도로
            const lang = document.documentElement.lang || 'ko';
            const loadSubTexts = {
                ko: '(죽은 자는 덮어쓸 수 없습니다)',
                en: '(the dead cannot be overwritten)',
                ja: '(死者は上書きできません)',
                es: '(los muertos no pueden sobrescribirse)',
                fr: '(les morts ne peuvent pas \u00eatre \u00e9cras\u00e9s)',
                de: '(die Toten k\u00f6nnen nicht \u00fcberschrieben werden)',
                'pt-BR': '(os mortos não podem ser sobrescritos)'
            };
            sub.textContent = loadSubTexts[lang] || loadSubTexts.ko;
        }

        // 3. [새 게임] 버튼 엔딩별 깜빡임
        const newGameBtn = document.getElementById('btn-new-game');
        if (newGameBtn && meta.lastEnding) {
            this._setupNewGameFlicker(newGameBtn, meta.lastEnding);
        }
    }

    /**
     * [새 게임] 버튼에 엔딩별 깜빡임 적용
     * @param {HTMLElement} btn
     * @param {string} lastEnding
     * @private
     */
    _setupNewGameFlicker(btn, lastEnding) {
        const playerName = this.engine?.state?.playerName || '{name}';

        const flickerTexts = {
            FORGET: '#14 \uD22C\uC785 (Load Subject #14)',
            ESCAPE: '...\uC544\uBB34\uAC83\uB3C4 \uBC14\uB00C\uC9C0 \uC54A\uC558\uB2E4.',
            GHOST: '...\uC544\uBB34\uAC83\uB3C4 \uBC14\uB00C\uC9C0 \uC54A\uC558\uB2E4.',
            RESIST: '\uC740\uC218\uB294 \uB5A0\uB0AC\uB2E4. \uC774\uC0AC\uD68C\uB294 \uB0A8\uC558\uB2E4.',
            TRUE: '...\uB2E4 \uB05D\uB0AC\uB294\uB370.',
            COMPLICIT: `#14 \uD22C\uC785 \uC2B9\uC778 \u2014 \uB2F4\uB2F9: ${playerName}`
        };

        // TRUE END 추가 깜빡임 — 본편 감정선 이후의 아주 짧은 잔상
        const trueEndSecondFlicker = '\uAE30\uB85D\uC774 \uC544\uC9C1 \uB2EB\uD788\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.';

        const flickerText = flickerTexts[lastEnding];
        if (!flickerText) return; // CAGE: no flicker

        const originalText = btn.textContent;
        const flickerDuration = (lastEnding === 'TRUE' || lastEnding === 'COMPLICIT') ? 500 : 300;

        // 5초마다 반복 깜빡임 (타이틀 화면에 있는 동안)
        const doFlicker = () => {
            if (!btn.isConnected) return; // DOM에서 제거되면 중단
            btn.textContent = flickerText;
            btn.classList.add('glitch-text');

            if (lastEnding === 'TRUE') {
                // TRUE END: 0.5초 "...다 끝났는데." 후 0.3초 기록 잔상
                setTimeout(() => {
                    if (!btn.isConnected) return;
                    btn.textContent = trueEndSecondFlicker;
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('glitch-text');
                    }, 300);
                }, flickerDuration);
            } else {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('glitch-text');
                }, flickerDuration);
            }
        };

        // 첫 깜빡임은 2초 후
        const t1 = setTimeout(doFlicker, 2000);
        this._activeTimers.push(t1);

        // 이후 8초마다 반복
        const interval = setInterval(() => {
            if (!btn.isConnected) { clearInterval(interval); return; }
            doFlicker();
        }, 8000);
        this._ngPlusTitleInterval = interval;
    }

    /**
     * NG+ 타이틀 BGM 변조 — 피치 다운 + 0.75배속
     * @param {AudioManager} audio
     */
    applyNGPlusTitleBGM(audio) {
        if (!audio?.ctx) return;

        // BGM 피치 다운은 playbackRate로 구현
        // AudioManager의 BGM이 시작된 후 호출해야 함
        const applyPitchDown = () => {
            const activeGain = audio._activeSlotA ? audio.bgmGainA : audio.bgmGainB;
            const activeSource = audio._activeSlotA ? audio.bgmSourceA : audio.bgmSourceB;
            if (activeSource) {
                // 반음 다운 = 2^(-1/12) ≈ 0.9439, * 0.75 배속 = ~0.708
                activeSource.playbackRate.value = 0.75 * Math.pow(2, -1/12);
            }
        };

        // 약간 지연 (BGM 로드 후)
        const t = setTimeout(applyPitchDown, 500);
        this._activeTimers.push(t);

        // SCENARIO.md 5450: 15초마다 불협화음 건반 1타 삽입
        this._startNGPlusDissonantChord(audio);
    }

    /**
     * NG+ 타이틀 — 15초마다 불협화음 1타 (SCENARIO.md 5450)
     * @param {AudioManager} audio
     * @private
     */
    _startNGPlusDissonantChord(audio) {
        if (!audio?.ctx) return;
        if (this._ngPlusDissonanceInterval) return;

        const playChord = () => {
            if (!audio.ctx || audio.ctx.state !== 'running') return;
            try {
                const ctx = audio.ctx;
                const now = ctx.currentCurrentTime !== undefined ? ctx.currentTime : ctx.currentTime;
                // 트라이톤 + 반음 긁기 = 강한 불협화음 (F#4 + G4 + C5)
                const frequencies = [369.99, 392.00, 523.25];
                const master = ctx.createGain();
                master.gain.setValueAtTime(0, now);
                master.gain.linearRampToValueAtTime(0.08, now + 0.02);
                master.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
                master.connect(audio.sfxGain || audio.masterGain || ctx.destination);

                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    osc.type = i === 0 ? 'triangle' : 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    const g = ctx.createGain();
                    g.gain.value = i === 2 ? 0.35 : 0.55;
                    osc.connect(g);
                    g.connect(master);
                    osc.start(now);
                    osc.stop(now + 2.5);
                });
            } catch (e) {
                // 무시 — 실패해도 경고 없이 다음 주기로
            }
        };

        // 15초마다 (SCENARIO.md 명시)
        this._ngPlusDissonanceInterval = setInterval(playChord, 15000);
    }

    // =========================================================================
    // NG+ 선택지 스테이닝 (SCENARIO.md 5036-5047)
    // =========================================================================

    /**
     * 선택지 버튼에 1회차 선택 흔적 표시
     * - 이전 회차에서 선택한 선택지에 붉은 체크마크
     * - 특정 씬에서 고스트 텍스트 표시
     *
     * @param {HTMLElement[]} buttons - 선택지 버튼 배열
     * @param {string} sceneId - 현재 씬 ID
     * @param {SaveManager} saveManager
     */
    applyChoiceStaining(buttons, sceneId, saveManager) {
        if (!saveManager.isNewGamePlus()) return;

        const prevChoice = saveManager.getPreviousChoice(sceneId);
        if (!prevChoice) return;

        const prevIndex = prevChoice.index;
        if (prevIndex < 0 || prevIndex >= buttons.length) return;

        const targetBtn = buttons[prevIndex];
        if (!targetBtn) return;

        // 붉은 체크마크 0.3초간 깜빡임
        targetBtn.style.position = 'relative';
        const check = document.createElement('span');
        check.className = 'ng-plus-check';
        check.textContent = '\u2713';
        targetBtn.appendChild(check);

        const t = setTimeout(() => check.remove(), 300);
        this._activeTimers.push(t);

        // 특정 씬에서 고스트 텍스트 (SCENARIO.md 5485-5488, 전체 게임 3~5회 제한)
        // 실제 시나리오 씬 ID로 매핑
        const ghostTexts = {
            'day1_choco_choice': '...물어봤자 같은 대답이야.',
            'day3_after_riin_choice': '너 이거 맛 알잖아.',
            'day5_morning_proposal_timer': '또?'
        };

        const ghostText = ghostTexts[sceneId];
        if (ghostText) {
            const ghost = document.createElement('span');
            ghost.className = 'choice-ghost-text';
            ghost.textContent = ghostText;
            targetBtn.appendChild(ghost);

            const duration = sceneId === 'day5_morning_proposal_timer' ? 300 : 500;
            const t2 = setTimeout(() => ghost.remove(), duration);
            this._activeTimers.push(t2);
        }
    }

    // =========================================================================
    // NG+ 대사 미세 왜곡 (SCENARIO.md 5049-5062)
    // =========================================================================

    /**
     * 대사 표시 전 깜빡임 단어 삽입
     * 특정 씬에서 대사 앞에 "또" 등의 단어가 0.3초 깜빡임
     *
     * @param {string} sceneId - 현재 씬 ID
     * @param {HTMLElement} textEl - 대사 텍스트 요소
     * @param {SaveManager} saveManager
     * @returns {number} 추가 딜레이 ms (깜빡임이 있으면 300, 없으면 0)
     */
    applyDialogueDistortion(sceneId, textEl, saveManager) {
        if (!saveManager.isNewGamePlus()) return 0;
        if (!textEl) return 0;

        // 씬별 깜빡임 단어 매핑 (SCENARIO.md 5497-5500, 실제 씬 ID)
        const flashWords = {
            'day1_eunsu_1': '또',
            'day1_eunsu_2': '또',
            'day1_choco_1': '이번에도'
        };

        const word = flashWords[sceneId];
        if (!word) return 0;

        // 텍스트 요소 위에 깜빡임 단어 오버레이
        textEl.style.position = 'relative';
        const flash = document.createElement('span');
        flash.className = 'ng-plus-flash-word';
        flash.textContent = word;
        textEl.appendChild(flash);

        const t = setTimeout(() => flash.remove(), 300);
        this._activeTimers.push(t);

        return 300;
    }

    // =========================================================================
    // NG+ Day 1 조기 탈출 (SCENARIO.md 5064-5096)
    // =========================================================================

    /**
     * Day 1 교문에서 뒤로 가기 시도 감지 및 히든 이벤트
     * 3회 이상 시도 시 발동
     *
     * @param {Function} onTrigger - 히든 이벤트 발동 시 콜백 (씬 전환)
     * @param {SaveManager} saveManager
     * @returns {{ increment: Function, getCount: Function }}
     */
    setupEarlyEscape(saveManager) {
        if (!saveManager.isNewGamePlus()) return null;

        let escapeAttempts = 0;

        return {
            increment: () => ++escapeAttempts,
            getCount: () => escapeAttempts,
            shouldTrigger: () => escapeAttempts >= 3
        };
    }

    /**
     * 조기 탈출 히든 이벤트 연출 — 화면 하얘짐 + 교실 복귀
     * @returns {Promise<void>}
     */
    async playEarlyEscapeSequence() {
        // 1. 화면 서서히 하얘짐
        const white = document.createElement('div');
        white.className = 'early-escape-white';
        document.body.appendChild(white);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                white.classList.add('active');
            });
        });

        // BGM 페이드아웃
        const audio = this.engine?.audio;
        if (audio?.ctx) {
            audio.fadeOutAll(2000);
        }

        await this._sleep(2500);

        // 2. 완전 화이트아웃 후 제거
        await this._sleep(500);
        white.remove();

        // 3. 블랙아웃으로 전환
        await this.showBlackout(1500);
    }

    // =========================================================================
    // Day 5 노이즈 필터 (SCENARIO.md 3408)
    // =========================================================================

    /**
     * Day 5 모든 대화창에 노이즈 필터 CSS 적용
     */
    enableDay5NoiseFilter() {
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.classList.add('day5-noise');
        }
    }

    /**
     * Day 5 노이즈 필터 제거
     */
    disableDay5NoiseFilter() {
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.classList.remove('day5-noise');
        }
    }

    // =========================================================================
    // 인터랙티브 거울 스와이프 (SCENARIO.md 3253)
    // =========================================================================

    /**
     * 거울 안개 닦기 인터랙션
     * canvas 마스크로 구현: 위에서 아래로 스와이프하면 안개가 걷힘
     *
     * @param {string} mirrorBgUrl - 거울 아래 배경(반사) 이미지 URL
     * @param {Function} onComplete - 안개 70% 이상 제거 시 콜백
     * @returns {Promise<void>}
     */
    async showMirrorSwipe(mirrorBgUrl, onComplete, options = {}) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.className = 'mirror-swipe-container';

            const canvas = document.createElement('canvas');
            canvas.className = 'mirror-swipe-canvas';
            container.appendChild(canvas);

            // 힌트 텍스트
            const hint = document.createElement('div');
            hint.className = 'mirror-swipe-hint';
            const lang = document.documentElement.lang || 'ko';
            const hintTexts = {
                ko: '\u2191 \uC704\uC5D0\uC11C \uC544\uB798\uB85C \uB2E6\uC73C\uC138\uC694',
                en: '\u2191 Swipe down to wipe',
                ja: '\u2191 \u4E0A\u304B\u3089\u4E0B\u3078\u62ED\u3044\u3066\u304F\u3060\u3055\u3044',
                es: '\u2191 Desliza hacia abajo',
                fr: '\u2191 Glissez vers le bas',
                de: '\u2191 Nach unten wischen',
                'pt-BR': '\u2191 Deslize para baixo'
            };
            hint.textContent = hintTexts[lang] || hintTexts.ko;
            container.appendChild(hint);

            document.body.appendChild(container);

            // Canvas 설정
            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                drawFog();
            };

            const ctx = canvas.getContext('2d');
            let completed = false;
            let targetRect = null;
            let cellSize = 18;
            let targetCols = 1;
            let targetRows = 1;
            let clearedCells = new Set();
            let minClearedY = Infinity;
            let maxClearedY = -Infinity;
            const completeThreshold = Math.max(0.2, Math.min(0.6, Number(options.threshold) || 0.32));
            const requiredVerticalSpan = Math.max(0.45, Math.min(0.75, Number(options.verticalSpan) || 0.58));

            const getTargetRect = () => {
                const width = Math.min(canvas.width * 0.56, 560);
                const height = Math.min(canvas.height * 0.76, 760);
                return {
                    left: (canvas.width - width) / 2,
                    top: (canvas.height - height) / 2,
                    width,
                    height
                };
            };

            const resetProgress = () => {
                targetRect = getTargetRect();
                cellSize = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.024));
                targetCols = Math.max(1, Math.ceil(targetRect.width / cellSize));
                targetRows = Math.max(1, Math.ceil(targetRect.height / cellSize));
                clearedCells = new Set();
                minClearedY = Infinity;
                maxClearedY = -Infinity;
            };

            const drawFog = () => {
                ctx.fillStyle = 'rgba(200, 210, 220, 0.95)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                resetProgress();
            };

            resize();
            window.addEventListener('resize', resize);

            // 스와이프로 안개 제거
            let isDrawing = false;
            const brushSize = Math.max(40, Math.min(canvas.width, canvas.height) * 0.08);

            const markCleared = (x, y) => {
                if (!targetRect) return { clearRatio: 0, verticalRatio: 0 };

                const radiusSq = brushSize * brushSize;
                const colStart = Math.max(0, Math.floor((x - brushSize - targetRect.left) / cellSize));
                const colEnd = Math.min(targetCols - 1, Math.floor((x + brushSize - targetRect.left) / cellSize));
                const rowStart = Math.max(0, Math.floor((y - brushSize - targetRect.top) / cellSize));
                const rowEnd = Math.min(targetRows - 1, Math.floor((y + brushSize - targetRect.top) / cellSize));

                for (let row = rowStart; row <= rowEnd; row++) {
                    const cellY = targetRect.top + row * cellSize + cellSize / 2;
                    for (let col = colStart; col <= colEnd; col++) {
                        const cellX = targetRect.left + col * cellSize + cellSize / 2;
                        const dx = cellX - x;
                        const dy = cellY - y;
                        if ((dx * dx + dy * dy) > radiusSq) continue;
                        clearedCells.add(`${col}:${row}`);
                        minClearedY = Math.min(minClearedY, cellY);
                        maxClearedY = Math.max(maxClearedY, cellY);
                    }
                }

                const clearRatio = clearedCells.size / Math.max(1, targetCols * targetRows);
                const verticalRatio = Number.isFinite(minClearedY)
                    ? Math.max(0, maxClearedY - minClearedY) / targetRect.height
                    : 0;
                return { clearRatio, verticalRatio };
            };

            const clearFog = (x, y) => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, brushSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';

                const { clearRatio, verticalRatio } = markCleared(x, y);

                if (clearRatio >= completeThreshold && verticalRatio >= requiredVerticalSpan && !completed) {
                    completed = true;
                    hint.remove();

                    // 안개 완전 제거 애니메이션
                    const fadeOut = () => {
                        canvas.style.transition = 'opacity 0.5s ease';
                        canvas.style.opacity = '0';
                        setTimeout(() => {
                            window.removeEventListener('resize', resize);
                            container.remove();
                            if (onComplete) onComplete();
                            resolve();
                        }, 500);
                    };

                    setTimeout(fadeOut, 300);
                }
            };

            // 마우스 이벤트
            canvas.addEventListener('mousedown', (e) => { isDrawing = true; clearFog(e.clientX, e.clientY); });
            canvas.addEventListener('mousemove', (e) => { if (isDrawing) clearFog(e.clientX, e.clientY); });
            canvas.addEventListener('mouseup', () => { isDrawing = false; });
            window.addEventListener('mouseup', () => { isDrawing = false; }, { once: true });

            // 터치 이벤트
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDrawing = true;
                const t = e.touches[0];
                clearFog(t.clientX, t.clientY);
            }, { passive: false });
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isDrawing) return;
                const t = e.touches[0];
                clearFog(t.clientX, t.clientY);
            }, { passive: false });
            canvas.addEventListener('touchend', () => { isDrawing = false; });
        });
    }

    // =========================================================================
    // 거울 13명 얼굴 오버레이 (SCENARIO.md 3337)
    // =========================================================================

    /**
     * 거울 2타: 13장의 증명사진을 빠르게 오버레이
     * @param {string[]} faceNames - 13명의 이름 배열
     * @param {string} playerName - 현재 플레이어 이름 (13번째)
     * @param {string} finalText - 최종 표시 텍스트
     * @returns {Promise<void>}
     */
    async showMirror13Faces(faceNames, playerName, finalText) {
        const overlay = document.createElement('div');
        overlay.className = 'mirror-face-overlay';
        document.body.appendChild(overlay);

        // 기본 이름 목록 (이미지가 없으면 텍스트로 대체)
        const names = faceNames || [
            '#1 \uAE40\uB3C4\uC9C4', '#2 \uC774\uC900\uC11C', '#3 \uBC15\uC11C\uC9C4',
            '#4 \uC815\uD558\uC728', '#5 \uAC15\uBBFC\uD601', '#6 \uC724\uC7AC\uC6D0',
            '#7 \uAE40\uD0DC\uD638', '#8 \uCD5C\uC2DC\uC6B0', '#9 \uD55C\uC9C0\uD638',
            '#10 \uC1A1\uC608\uC900', '#11 \uC624\uD0DC\uD604', '#12 \uC784\uC11C\uC728',
            `#13 ${playerName}`
        ];

        // 진동 동기화 (모바일)
        const deviceGimmick = this.engine?.deviceGimmick;

        for (let i = 0; i < names.length; i++) {
            // 이름 텍스트 오버레이
            const nameEl = document.createElement('div');
            nameEl.className = 'mirror-face-name';
            nameEl.textContent = names[i];
            overlay.appendChild(nameEl);

            // 진동 (0.4초 간격)
            if (deviceGimmick) {
                deviceGimmick.vibrate([100]);
            }

            await this._sleep(400);
            nameEl.remove();
        }

        // 최종 텍스트
        const finalEl = document.createElement('div');
        finalEl.className = 'mirror-final-text';
        finalEl.textContent = finalText || '\uB098\uB294 13\uBC88\uC9F8 \uAECD\uB370\uAE30\uB2E4.';
        overlay.appendChild(finalEl);

        await this._sleep(3000);

        // 페이드아웃
        overlay.style.transition = 'opacity 1s ease';
        overlay.style.opacity = '0';
        await this._sleep(1000);
        overlay.remove();
    }

    // =========================================================================
    // NG+ 스킵 시스템 삽입 (SCENARIO.md 5025-5034)
    // =========================================================================

    /**
     * 스킵 중 기시감 텍스트 삽입
     * 2회차 스킵 시 특정 씬에서 0.5초 더 긴 표시 + 기시감 텍스트
     *
     * @param {string} sceneId - 현재 씬 ID
     * @param {SaveManager} saveManager
     * @returns {boolean} true면 스킵 딜레이 적용
     */
    _getDejaVuTexts() {
        // SCENARIO.md 5473-5477 (B. 스킵 시스템 변조)
        // 씬 ID는 실제 시나리오에 존재해야 매칭됨
        return {
            'day1_gate_1': '...이 길을 아는 것 같다. 왜지? 처음 오는 학교인데. ......피곤해서 그런 거겠지.',
            'day1_hallway_1': '...이 웃음. 어딘가에서 봤다. ...아닌가.',
            'day2_morning_gate_1': '...세아의 동작이 어쩐지 익숙하다. 기분 탓이겠지.',
            'day3_after_riin_drink': '...이 맛. 낯설지 않다. 마셔본 적도 없는데.'
        };
    }

    checkSkipDejaVu(sceneId, saveManager) {
        if (!saveManager.isNewGamePlus()) return false;

        const dejaVuTexts = this._getDejaVuTexts();

        const text = dejaVuTexts[sceneId];
        if (!text) return false;

        // 기시감 텍스트 표시
        const el = document.createElement('div');
        el.className = 'skip-dejavu-text';
        el.textContent = text;
        document.body.appendChild(el);

        const t = setTimeout(() => el.remove(), 2000);
        this._activeTimers.push(t);

        return true;
    }

    // =========================================================================
    // COMPLICIT 2회차 서명 인터랙션 (SCENARIO.md 5107-5120)
    // =========================================================================

    /**
     * COMPLICIT END 2회차: 서명란 터치 인터랙션
     * 자동 진행이 아닌 플레이어가 직접 서명란을 클릭해야 진행
     *
     * @param {string} playerName - 서명할 이름
     * @param {SaveManager} saveManager
     * @returns {Promise<void>} 서명 완료 시 resolve
     */
    async showComplicitSignature(playerName, saveManager) {
        if (!saveManager.hasSeenEnding('COMPLICIT')) {
            return; // 1회차에는 자동 진행
        }

        const choicePanel = document.getElementById('choice-panel');
        if (!choicePanel) return;

        return new Promise((resolve) => {
            choicePanel.innerHTML = '';
            choicePanel.classList.remove('hidden');

            const signArea = document.createElement('div');
            signArea.className = 'complicit-sign-area';
            signArea.textContent = playerName;

            choicePanel.appendChild(signArea);

            // 서명 직전 0.5초간 멈춤 + 유령 텍스트
            const ghost = document.createElement('span');
            ghost.className = 'sign-ghost';
            ghost.textContent = '\uB450 \uBC88\uC9F8\uC57C.';
            signArea.appendChild(ghost);

            const t = setTimeout(() => ghost.remove(), 500);
            this._activeTimers.push(t);

            // 진동 (서명 순간)
            signArea.addEventListener('click', () => {
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.vibrate([100]);
                }
                choicePanel.classList.add('hidden');
                choicePanel.innerHTML = '';
                resolve();
            }, { once: true });
        });
    }

    // =========================================================================
    // ★ 인터랙티브 거울 스와이프 래퍼 (Day 4 밤)
    // 기존 showMirrorSwipe()를 scene.glitch.mirrorWipe 키로 호출한다.
    // requireSwipe=true면 스와이프 완료 전까지 대화 진행을 차단한다.
    // =========================================================================

    startMirrorWipe(opts = {}) {
        // 이미 실행 중이면 무시 (swipe_2~5의 silence만 있는 후속 씬)
        if (document.querySelector('.mirror-swipe-container')) return;

        const engine = this.engine;
        if (opts.requireSwipe && engine) {
            // _loadScene이 걸어둔 300ms 자동 해제 타이머를 무효화 — 스와이프 완료까지 유지
            if (engine._clickLockTimer) {
                clearTimeout(engine._clickLockTimer);
                engine._clickLockTimer = null;
            }
            engine._clickLocked = true;
        }

        this.showMirrorSwipe(null, () => {
            if (engine) engine._clickLocked = false;
        });
    }

    // =========================================================================
    // ★ COMPLICIT 서명 패드 (SCENARIO.md 5608)
    // 유저가 직접 드래그/터치로 "서명"해야 진행된다 — 돌이킬 수 없음의 촉감.
    // 완료 시 짧고 날카로운 진동 0.1초 + 스크린샷 컨텍스트 활성화(반응 없음).
    // =========================================================================

    startSignaturePad(opts = {}) {
        if (document.querySelector('.signature-pad-container')) return;
        const engine = this.engine;
        if (opts.requireSignature && engine) {
            if (engine._clickLockTimer) {
                clearTimeout(engine._clickLockTimer);
                engine._clickLockTimer = null;
            }
            engine._clickLocked = true;
        }
        // 스크린샷 감지: '반응 없음'이지만 컨텍스트는 활성화 (SCENARIO.md 5640 — 기록 허용)
        engine?.metaHorror?.setScreenshotContext?.('complicit_sign');
        this._showSignaturePad(() => {
            if (engine) engine._clickLocked = false;
            // 짧고 날카로운 단일 진동 0.1초 (돌이킬 수 없음의 촉감)
            engine?.deviceGimmick?.vibrate?.('complicit_sign');
            engine?._vibrateVisual?.('complicit_sign');
        });
    }

    _showSignaturePad(onComplete) {
        const container = document.createElement('div');
        container.className = 'signature-pad-container';

        const paper = document.createElement('div');
        paper.className = 'signature-pad-paper';

        const label = document.createElement('div');
        label.className = 'signature-pad-label';
        const lang = document.documentElement.lang || 'ko';
        const labels = {
            ko: '서명',
            en: 'Signature',
            ja: '署名',
            es: 'Firma',
            fr: 'Signature',
            de: 'Unterschrift',
            'pt-BR': 'Assinatura'
        };
        label.textContent = labels[lang] || labels.ko;

        const line = document.createElement('div');
        line.className = 'signature-pad-line';

        const canvas = document.createElement('canvas');
        canvas.className = 'signature-pad-canvas';

        paper.appendChild(label);
        paper.appendChild(canvas);
        paper.appendChild(line);
        container.appendChild(paper);
        document.body.appendChild(container);

        // 캔버스 사이즈 (paper 기준)
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let drawing = false;
        let last = null;
        let drawnPixels = 0;
        let completed = false;
        // 서명 "유효" 기준 — 총 이동 거리 > threshold
        const threshold = Math.max(180, canvas.width * 0.35);

        const toLocal = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const beginStroke = (x, y) => {
            drawing = true;
            last = { x, y };
            ctx.beginPath();
            ctx.moveTo(x, y);
        };
        const extendStroke = (x, y) => {
            if (!drawing) return;
            ctx.lineTo(x, y);
            ctx.stroke();
            const dx = x - last.x, dy = y - last.y;
            drawnPixels += Math.sqrt(dx * dx + dy * dy);
            last = { x, y };
            if (drawnPixels > threshold && !completed) {
                completed = true;
                setTimeout(() => {
                    container.classList.add('signature-pad-done');
                    setTimeout(() => {
                        window.removeEventListener('resize', resize);
                        container.remove();
                        if (onComplete) onComplete();
                    }, 400);
                }, 200);
            }
        };
        const endStroke = () => { drawing = false; };

        canvas.addEventListener('mousedown', (e) => {
            const p = toLocal(e.clientX, e.clientY);
            beginStroke(p.x, p.y);
        });
        canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            const p = toLocal(e.clientX, e.clientY);
            extendStroke(p.x, p.y);
        });
        canvas.addEventListener('mouseup', endStroke);
        canvas.addEventListener('mouseleave', endStroke);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            const p = toLocal(t.clientX, t.clientY);
            beginStroke(p.x, p.y);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!drawing) return;
            const t = e.touches[0];
            const p = toLocal(t.clientX, t.clientY);
            extendStroke(p.x, p.y);
        }, { passive: false });
        canvas.addEventListener('touchend', endStroke);
    }

    hideSignaturePad() {
        document.querySelector('.signature-pad-container')?.remove();
    }

    /**
     * Day 3 유나 13장 사진 — NG+ 시 14번째 빈 프레임 0.8초 (SCENARIO.md 5503)
     */
    show14thEmptyFrame(duration = 800) {
        const frame = document.createElement('div');
        frame.id = 'ng-plus-empty-frame';
        frame.style.cssText = `
            position: fixed;
            bottom: 18%;
            right: 14%;
            width: 90px;
            height: 120px;
            border: 2px dashed rgba(220, 220, 230, 0.8);
            background: rgba(15, 15, 20, 0.3);
            z-index: 180;
            pointer-events: none;
            opacity: 0;
            transition: opacity 180ms ease-in;
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(220, 220, 230, 0.6);
            font-family: monospace;
            font-size: 0.72rem;
            letter-spacing: 1px;
        `;
        frame.textContent = '#14';
        document.body.appendChild(frame);

        requestAnimationFrame(() => { frame.style.opacity = '1'; });
        const t1 = setTimeout(() => { frame.style.opacity = '0'; }, duration - 180);
        const t2 = setTimeout(() => frame.remove(), duration);
        this._activeTimers.push(t1, t2);
    }

    /** scenario의 photoOverlay 키를 기존 showMirror13Faces로 연결 */
    async showPhotoOverlay(opts = {}) {
        const sequence = opts.photoSequence || [];
        const playerName = this.engine?.state?.playerName || '';
        const names = sequence.map(p => {
            const display = (p.name === '{name}') ? playerName : p.name;
            return `#${String(p.slot).padStart(2, '0')}  ${display}`;
        });
        const overlayText = (opts.overlayText || '').replace('{name}', playerName);
        await this.showMirror13Faces(names, playerName, overlayText);
    }

    hidePhotoOverlay() {
        document.querySelector('.mirror-face-overlay')?.remove();
    }

    _teardownMirrorWipe() {
        document.querySelector('.mirror-swipe-container')?.remove();
    }

    // =========================================================================
    // ★ 거울 속 반사 (characterAbsentInMirror)
    // 화면 위쪽에 거울 프레임을 띄우고, 캐릭터 레이어의 특정 캐릭터를
    // 반사상에서 제외해 '설화는 거울에 비치지 않는다' 연출
    // =========================================================================

    showMirrorReflection(absentCharId) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        this.hideMirrorReflection();

        const mirror = document.createElement('div');
        mirror.className = 'mirror-reflection';
        mirror.id = 'mirror-reflection';

        const inner = document.createElement('div');
        inner.className = 'mirror-reflection-inner';

        // 현재 캐릭터 레이어 복제 (transform scaleX(-1)로 거울상)
        ['char-left', 'char-center', 'char-right'].forEach(id => {
            const src = document.getElementById(id);
            if (!src?.src || src.src.endsWith('/') || src.style.display === 'none') return;
            if (src.classList.contains('char-fade-out')) return;
            // 스프라이트 URL에서 charId 추출: 파일명 첫 언더스코어 앞 토큰
            // 예) assets/images/characters/seolhwa_sad.png → 'seolhwa'
            const filename = src.src.split(/[?#]/)[0].split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
            const charId = filename.split('_')[0];
            if (absentCharId && charId === absentCharId) return;

            const clone = document.createElement('img');
            clone.src = src.src;
            clone.className = `mirror-reflection-sprite mirror-pos-${id.replace('char-', '')}`;
            inner.appendChild(clone);
        });

        mirror.appendChild(inner);
        gameScreen.appendChild(mirror);

        // 페이드 인
        requestAnimationFrame(() => mirror.classList.add('visible'));
    }

    hideMirrorReflection() {
        document.getElementById('mirror-reflection')?.remove();
    }


    // =========================================================================
    // ★ 피험자 관리 시스템 어드민 패널 (Day 4 밤)
    // 안전앱이 뒤집혀 13명의 피험자 목록이 노출된다
    // save_glitch_7에서 생성, mirror 씬 진입 시 자동 정리
    // =========================================================================

    showAdminPanel(subjects = []) {
        this.hideAdminPanel();

        const panel = document.createElement('div');
        panel.className = 'admin-panel-overlay';
        panel.id = 'admin-panel-overlay';

        const playerName = this.engine?.state?.playerName || '';
        panel.innerHTML = `
            <div class="admin-panel-header">
                <span class="admin-panel-title">NEVERGRAD — 피험자 관리 시스템</span>
                <span class="admin-panel-version">v4.7</span>
            </div>
            <div class="admin-panel-columns">
                <span>ID</span>
                <span>이름</span>
                <span>상태</span>
                <span>비고</span>
            </div>
            <div class="admin-panel-rows" id="admin-panel-rows"></div>
            <div class="admin-panel-footer">
                <span class="admin-panel-tab">▸ 위치 추적 기록</span>
                <span class="admin-panel-tab">▸ 실시간 모니터링</span>
                <span class="admin-panel-live">● LIVE</span>
            </div>
        `;

        const rows = panel.querySelector('#admin-panel-rows');
        subjects.forEach(sub => {
            const row = document.createElement('div');
            row.className = 'admin-panel-row';
            const isActive = sub.status === '진행 중' || sub.status === '이상 반응';
            if (isActive) row.classList.add('admin-row-active');
            if (sub.status === '이상 반응') row.classList.add('admin-row-warning');

            const name = (sub.name === '{name}')
                ? playerName
                : sub.name;

            row.innerHTML = `
                <span class="admin-cell-id">#${String(sub.id).padStart(2, '0')}</span>
                <span class="admin-cell-name">${this._escape(name)}</span>
                <span class="admin-cell-status">${this._escape(sub.status)}</span>
                <span class="admin-cell-note">${this._escape(sub.note || '')}</span>
            `;
            rows.appendChild(row);
        });

        (document.getElementById('game-screen') || document.body).appendChild(panel);
        requestAnimationFrame(() => panel.classList.add('visible'));
    }

    hideAdminPanel() {
        document.getElementById('admin-panel-overlay')?.remove();
    }

    _escape(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // =========================================================================
    // ★ 스탯 라벨 벗겨내기 (peelStatLabel, Day 3 밤)
    // '호감도' 라벨이 얇은 막처럼 벗겨지며 '위험도'가 드러난다
    // =========================================================================

    async peelStatLabel(revealDuration = 300) {
        const statEl = document.getElementById('stat-display');
        if (!statEl) return;

        // 나레이션 씬이라 숨겨진 상태면 강제 노출 (장르 전환 연출의 핵심)
        statEl.classList.remove('hidden', 'stat-hidden');
        if (!statEl.textContent.trim()) {
            // 호감도 UI가 아직 한 번도 표시된 적 없으면 기본값으로 표시
            const last = this.engine?.state?._lastCharLabel;
            const aff = this.engine?.state ? this.engine.state.getDisplayAffinity?.('sea') : 0;
            statEl.textContent = last?.text || `♡ 호감도 ${aff ?? ''}`.trim();
        }

        const original = statEl.textContent;
        // 뒤에 있을 '진짜' 라벨 — 위험도 계열
        const revealed = statEl.dataset.thrillerlabel || '⚠ 위험도 ' + (original.match(/\d+/)?.[0] || '');

        // 벗겨지는 라벨을 감싸기
        statEl.classList.add('stat-peeling');
        const peelLayer = document.createElement('span');
        peelLayer.className = 'stat-peel-layer';
        peelLayer.textContent = original;

        // 원래 텍스트는 revealed로 미리 교체
        statEl.textContent = '';
        const base = document.createElement('span');
        base.className = 'stat-peel-base';
        base.textContent = revealed;
        statEl.appendChild(base);
        statEl.appendChild(peelLayer);

        // 벗겨짐 애니메이션
        await this._sleep(50);
        peelLayer.classList.add('peeling');
        await this._sleep(revealDuration);
        peelLayer.remove();

        await this._sleep(400);
        statEl.textContent = revealed;
        statEl.classList.remove('stat-peeling');
        statEl.classList.add('stat-revealed');
    }

    // =========================================================================
    // ★ 온도 하강 (temperatureDrop, Day 3 밤)
    // 화면 전체가 차갑게 식는 연출 — 푸른 색조 + 미세한 서리 오버레이
    // =========================================================================

    temperatureDrop(duration = 2000) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;

        gameScreen.classList.add('temperature-drop');

        const timer = setTimeout(() => {
            gameScreen.classList.remove('temperature-drop');
        }, duration);
        this._activeTimers.push(timer);
    }

    // =========================================================================
    // 정리
    // =========================================================================

    /**
     * 모든 활성 효과 제거 및 초기 상태로 복구
     */
    clearAll() {
        // 모든 타이머 정리
        this._activeTimers.forEach(id => clearTimeout(id));
        this._activeTimers = [];

        // 오버레이 정리
        if (this.overlay) {
            this.overlay.className = 'glitch-overlay hidden';
        }

        // 화면 흔들림 제거
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('screen-shake');
        }

        // 유령 텍스트 정리
        this.ghostTextQueue.forEach(g => {
            if (g.el && g.el.parentNode) {
                g.el.remove();
            }
        });
        this.ghostTextQueue = [];

        // 레드 비네트 제거
        this.hideRedVignette();

        // Day 5 노이즈 필터 제거
        this.disableDay5NoiseFilter();

        // NG+ 타이틀 인터벌 정리
        if (this._ngPlusTitleInterval) {
            clearInterval(this._ngPlusTitleInterval);
            this._ngPlusTitleInterval = null;
        }
        if (this._ngPlusDissonanceInterval) {
            clearInterval(this._ngPlusDissonanceInterval);
            this._ngPlusDissonanceInterval = null;
        }

        // 글리치 텍스트 클래스 정리
        document.querySelectorAll('.glitch-text').forEach(el => {
            el.classList.remove('glitch-text');
        });

        // 인터랙티브 연출 정리
        this._teardownMirrorWipe();
        this.hideMirrorReflection();
        this.hidePhotoOverlay();
        this.hidePhotoDeck();
        this.hideLockerSearch();
        this.hideAdminPanel();
        document.getElementById('game-screen')?.classList.remove('temperature-drop');

        // stat-revealed 클래스는 제거하지 않음 (영구 전환)

        // 레벨 리셋하지 않음 (호출자가 명시적으로 설정)
    }

    // =========================================================================
    // 유틸리티
    // =========================================================================

    /**
     * 지정 시간만큼 대기
     * @param {number} ms - 대기 시간 (ms)
     * @returns {Promise<void>}
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => {
            const timer = setTimeout(resolve, ms);
            this._activeTimers.push(timer);
        });
    }
}

window.GlitchSystemAdvanced = GlitchSystemAdvanced;
