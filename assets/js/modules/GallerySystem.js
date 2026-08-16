/**
 * GallerySystem.js - integrated unlockable gallery.
 *
 * Tracks endings, event CG, BGM, and character expression images in localStorage.
 * Items unlock when they are encountered during normal play.
 */

class GallerySystem {
    static STORAGE_KEY = 'nevergrad_gallery';
    static LEGACY_ENDING_STORAGE_KEY = 'nevergrad_endings';
    static VERSION = 2;

    static ENDINGS = [
        'TRUE END',
        'RESIST END',
        'FORGET END',
        'CAGE END',
        'GHOST END',
        'ESCAPE END',
        'COMPLICIT END'
    ];

    static ENDING_DESCRIPTIONS = {
        'TRUE END': {
            ko: '진실을 마주한 끝에 졸업했다.',
            en: 'Faced the truth, and chose to graduate.',
            ja: '真実と向き合い、卒業を選んだ。',
            es: 'Enfrentaste la verdad y elegiste graduarte.',
            fr: 'Tu as fait face a la verite et choisi de partir.',
            de: 'Du hast die Wahrheit erkannt und den Abschluss gewaehlt.',
            pt: 'Voce encarou a verdade e escolheu se formar.'
        },
        'RESIST END': {
            ko: '은수와 함께 교실을 나와 순환을 끊었다.',
            en: 'You resisted to the end, but the classroom never let go.',
            ja: '最後まで抵抗したが、教室は離してくれなかった。',
            es: 'Resististe hasta el final, pero el aula nunca te soltó.',
            fr: "Tu as resiste jusqu'au bout, mais la classe ne t'a pas libere.",
            de: 'Du hast bis zum Ende Widerstand geleistet, aber das Klassenzimmer liess nicht los.',
            pt: 'Voce resistiu ate o fim, mas a sala nunca soltou voce.'
        },
        'FORGET END': {
            ko: '모든 것을 잊고 열네 번째 등교를 시작했다.',
            en: 'You forgot everything and returned to ordinary days.',
            ja: 'すべてを忘れ、普通の日々へ戻った。',
            es: 'Lo olvidaste todo y volviste a la rutina.',
            fr: 'Tu as tout oublie et tu es retourne a ta vie ordinaire.',
            de: 'Du hast alles vergessen und bist in den Alltag zurueckgekehrt.',
            pt: 'Voce esqueceu tudo e voltou aos dias comuns.'
        },
        'CAGE END': {
            ko: '행복한 교실. 영원히.',
            en: 'A happy classroom. Forever.',
            ja: '幸せな教室。永遠に。',
            es: 'Un aula feliz. Para siempre.',
            fr: 'Une classe heureuse. Pour toujours.',
            de: 'Ein glueckliches Klassenzimmer. Fuer immer.',
            pt: 'Uma sala de aula feliz. Para sempre.'
        },
        'GHOST END': {
            ko: '학교를 빠져나왔지만 교실에는 무언가 남았다.',
            en: 'You left, but something stayed behind in the classroom.',
            ja: 'あなたは去ったが、何かが教室に残った。',
            es: 'Te fuiste, pero algo se quedó en el aula.',
            fr: 'Tu es parti, mais quelque chose est reste dans la classe.',
            de: 'Du bist gegangen, aber etwas blieb im Klassenzimmer zurueck.',
            pt: 'Voce foi embora, mas algo ficou na sala de aula.'
        },
        'ESCAPE END': {
            ko: '탈출했지만 증거는 충분하지 않았다.',
            en: 'You escaped. But there was a price.',
            ja: '脱出した。けれど代償があった。',
            es: 'Escapaste. Pero hubo un precio.',
            fr: "Tu t'es echappe. Mais il y a eu un prix.",
            de: 'Du bist entkommen. Aber es hatte seinen Preis.',
            pt: 'Voce escapou. Mas houve um preco.'
        },
        'COMPLICIT END': {
            ko: '공범이 되었다.',
            en: 'You became an accomplice.',
            ja: 'あなたは共犯者になった。',
            es: 'Te convertiste en cómplice.',
            fr: 'Tu es devenu complice.',
            de: 'Du wurdest zum Komplizen.',
            pt: 'Voce se tornou cumplice.'
        }
    };

    static LABELS = {
        ko: {
            title: '갤러리',
            progress: '해금률',
            back: '돌아가기',
            tabs: { endings: '엔딩', cg: '이벤트 CG', music: '음악', characters: '캐릭터' },
            locked: '미해금',
            lockedEnding: '아직 도달하지 못한 결말',
            lockedCg: '게임에서 해당 이벤트 CG를 보면 해금됩니다.',
            lockedMusic: '게임에서 해당 BGM이 재생되면 해금됩니다.',
            lockedCharacter: '게임에서 이 인물을 만나면 해금됩니다.',
            lockedExpression: '게임에서 이 표정을 보면 해금됩니다.',
            play: '재생',
            stop: '정지',
            artist: 'Nevergrad OST',
            expressions: '표정',
            close: '닫기'
        },
        en: {
            title: 'Gallery',
            progress: 'Progress',
            back: 'Back',
            tabs: { endings: 'Endings', cg: 'Event CG', music: 'Music', characters: 'Expressions' },
            locked: 'Locked',
            lockedEnding: 'An ending yet to be reached',
            lockedCg: 'Unlocks after this event CG appears in the game.',
            lockedMusic: 'Unlocks after this BGM plays in the game.',
            lockedCharacter: 'Unlocks after meeting this character in the game.',
            lockedExpression: 'Unlocks after seeing this expression in the game.',
            play: 'Play',
            stop: 'Stop',
            artist: 'Nevergrad OST',
            expressions: 'Expressions',
            close: 'Close'
        },
        ja: {
            title: 'ギャラリー',
            progress: '解放率',
            back: '戻る',
            tabs: { endings: 'エンディング', cg: 'イベントCG', music: '音楽', characters: '表情' },
            locked: '未解放',
            lockedEnding: 'まだ到達していないエンディング',
            lockedCg: 'ゲーム内でこのイベントCGを見ると解放されます。',
            lockedMusic: 'ゲーム内でこのBGMが再生されると解放されます。',
            lockedCharacter: 'ゲーム内でこのキャラクターに出会うと解放されます。',
            lockedExpression: 'ゲーム内でこの表情を見ると解放されます。',
            play: '再生',
            stop: '停止',
            artist: 'Nevergrad OST',
            expressions: '表情',
            close: '閉じる'
        },
        es: {
            title: 'Galería',
            progress: 'Progreso',
            back: 'Volver',
            tabs: { endings: 'Finales', cg: 'CG de eventos', music: 'Música', characters: 'Expresiones' },
            locked: 'Bloqueado',
            lockedEnding: 'Final aún no alcanzado',
            lockedCg: 'Se desbloquea al ver este CG de evento en el juego.',
            lockedMusic: 'Se desbloquea cuando este BGM suena en el juego.',
            lockedCharacter: 'Se desbloquea al conocer a este personaje en el juego.',
            lockedExpression: 'Se desbloquea al ver esta expresión en el juego.',
            play: 'Reproducir',
            stop: 'Detener',
            artist: 'Nevergrad OST',
            expressions: 'Expresiones',
            close: 'Cerrar'
        },
        fr: {
            title: 'Galerie',
            progress: 'Progression',
            back: 'Retour',
            tabs: { endings: 'Fins', cg: "CG d’événement", music: 'Musique', characters: 'Expressions' },
            locked: 'Verrouillé',
            lockedEnding: 'Une fin qui reste à atteindre',
            lockedCg: "Se déverrouille après avoir vu ce CG d’événement dans le jeu.",
            lockedMusic: 'Se déverrouille lorsque cette musique est jouée dans le jeu.',
            lockedCharacter: 'Se déverrouille après avoir rencontré ce personnage dans le jeu.',
            lockedExpression: 'Se déverrouille après avoir vu cette expression dans le jeu.',
            play: 'Lire',
            stop: 'Arrêter',
            artist: 'Nevergrad OST',
            expressions: 'Expressions',
            close: 'Fermer'
        },
        de: {
            title: 'Galerie',
            progress: 'Fortschritt',
            back: 'Zurück',
            tabs: { endings: 'Enden', cg: 'Event-CG', music: 'Musik', characters: 'Ausdrücke' },
            locked: 'Gesperrt',
            lockedEnding: 'Ein noch nicht erreichtes Ende',
            lockedCg: 'Wird freigeschaltet, sobald dieses Event-CG im Spiel erscheint.',
            lockedMusic: 'Wird freigeschaltet, sobald diese Musik im Spiel abgespielt wird.',
            lockedCharacter: 'Wird freigeschaltet, nachdem du dieser Figur im Spiel begegnet bist.',
            lockedExpression: 'Wird freigeschaltet, nachdem du diesen Ausdruck im Spiel gesehen hast.',
            play: 'Abspielen',
            stop: 'Stoppen',
            artist: 'Nevergrad OST',
            expressions: 'Ausdrücke',
            close: 'Schließen'
        },
        pt: {
            title: 'Galeria',
            progress: 'Progresso',
            back: 'Voltar',
            tabs: { endings: 'Finais', cg: 'CG de eventos', music: 'Música', characters: 'Expressões' },
            locked: 'Bloqueado',
            lockedEnding: 'Um final ainda não alcançado',
            lockedCg: 'Desbloqueia após este CG de evento aparecer no jogo.',
            lockedMusic: 'Desbloqueia quando esta música tocar no jogo.',
            lockedCharacter: 'Desbloqueia após encontrar este personagem no jogo.',
            lockedExpression: 'Desbloqueia após ver esta expressão no jogo.',
            play: 'Reproduzir',
            stop: 'Parar',
            artist: 'Nevergrad OST',
            expressions: 'Expressões',
            close: 'Fechar'
        }
    };

    static BGM_TITLES = {
        spring_bright: 'Spring Bright',
        daily_bright: 'Daily Bright',
        sunset_warm: 'Sunset Warm',
        night_calm: 'Night Calm',
        morning_bright: 'Morning Bright',
        morning_uneasy: 'Morning Uneasy',
        daily_tense: 'Daily Tense',
        riin_theme: 'Riin Theme',
        sea_theme: 'Sea Theme',
        eunsu_theme: 'Eunsu Theme',
        tension: 'Tension',
        tension_low: 'Low Tension',
        wind_ambient: 'Wind Ambient',
        tension_night: 'Night Tension',
        sea_obsession: 'Sea Obsession',
        heartbeat_loop: 'Heartbeat Loop',
        silence_tension: 'Silence Tension',
        music_box_broken: 'Broken Music Box',
        seolhwa_theme_broken: 'Seolhwa Broken Theme',
        confrontation: 'Confrontation',
        ending_dark: 'Ending: Dark',
        ending_ghost: 'Ending: Ghost',
        ending_hope: 'Ending: Hope',
        ending_melancholy: 'Ending: Melancholy',
        ending_bittersweet: 'Ending: Bittersweet',
        morning_peaceful: 'Morning Peaceful',
        chase: 'Chase'
    };

    static EXPRESSION_TITLES = {
        normal: 'Normal',
        smile: 'Smile',
        gentle: 'Gentle',
        warm: 'Warm',
        shy: 'Shy',
        serious: 'Serious',
        angry: 'Angry',
        close: 'Close',
        cold: 'Cold',
        dark: 'Dark',
        obsessed: 'Obsessed',
        shaking: 'Shaking',
        crying: 'Crying',
        seductive: 'Seductive',
        pleased: 'Pleased',
        neutral: 'Neutral',
        pain: 'Pain',
        relief: 'Relief',
        sad: 'Sad',
        hurt: 'Hurt',
        cry: 'Crying',
        yandere: 'Yandere',
        vulnerable: 'Vulnerable',
        broken_smile: 'Broken Smile',
        scared: 'Scared',
        desperate: 'Desperate',
        weak: 'Weak',
        determined: 'Determined',
        fade: 'Fading',
        ghost: 'Ghost',
        quiet: 'Quiet'
    };

    constructor(game) {
        this.game = game;
        this.activeTab = 'endings';
        this.playingBgmId = null;
        this.data = this._load();
        this.isAdmin = new URLSearchParams(window.location.search).has('admin');
        this._bound = false;
        this._tabsBound = false;
    }

    getUnlockedEndings() {
        this.data = this._load();
        return [...new Set(this.data.endings || [])];
    }

    unlockEnding(endingTitle) {
        if (!GallerySystem.ENDINGS.includes(endingTitle)) return false;
        const changed = this._unlockListItem('endings', endingTitle);
        if (changed) this._saveLegacyEndings();
        return changed;
    }

    unlockCGByPath(pathOrKey) {
        const normalized = this._normalizeAsset(pathOrKey);
        const item = this._getCGItems().find(cg => {
            return this._normalizeAsset(cg.file) === normalized
                || this._normalizeAsset(cg.backgroundKey) === normalized
                || cg.id === pathOrKey;
        });
        if (!item) return false;
        return this._unlockObjectItem('cg', item.id);
    }

    unlockBGM(filename) {
        if (!filename || typeof filename !== 'string') return false;
        const item = this._getMusicItems().find(track => {
            return track.file === filename
                || track.id === this._bgmId(filename)
                || track.id === filename;
        });
        if (!item) return false;
        return this._unlockObjectItem('bgm', item.id);
    }

    unlockCharacterExpression(keyOrPath) {
        const parsed = this._parseCharacterExpression(keyOrPath);
        if (!parsed) return false;

        const items = this._getCharacterItems();
        const char = items.find(item => item.id === parsed.charId);
        if (!char) return false;

        const sourcePath = CONFIG.EXPRESSIONS?.[parsed.charId]?.[parsed.expression];
        const expression = char.expressions.find(expr => {
            return expr.id === parsed.expression
                || (sourcePath && this._normalizeAsset(expr.file) === this._normalizeAsset(sourcePath));
        });
        if (!expression) return false;

        if (!this.data.characters[char.id]) {
            this.data.characters[char.id] = { met: false, expressions: {} };
        }

        const entry = this.data.characters[char.id];
        const wasUnlocked = entry.met && entry.expressions?.[expression.id]?.unlocked;
        entry.met = true;
        entry.expressions = entry.expressions || {};
        entry.expressions[expression.id] = entry.expressions[expression.id] || {};
        entry.expressions[expression.id].unlocked = true;
        entry.expressions[expression.id].unlockedAt = entry.expressions[expression.id].unlockedAt || Date.now();

        this._save();
        return !wasUnlocked;
    }

    open() {
        const screen = document.getElementById('gallery-screen');
        if (!screen) return;

        this.data = this._load();
        this._ensureLayout();
        this._render();

        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }

    close() {
        this._stopBgmPreview();
        this._closeModal();

        const screen = document.getElementById('gallery-screen');
        if (screen) {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        }
        const title = document.getElementById('title-screen');
        if (title) {
            title.classList.remove('hidden');
            title.classList.add('active');
        }
    }

    bind() {
        if (this._bound) return;
        this._bound = true;

        document.getElementById('btn-gallery')?.addEventListener('click', () => {
            this.game.audio?.playUIClick();
            this.open();
        });
        document.getElementById('gallery-back')?.addEventListener('click', () => {
            this.game.audio?.playUIClick();
            this.close();
        });
    }

    _render() {
        this._renderHeader();
        this._renderTabs();

        if (this.activeTab === 'endings') this._renderEndings();
        if (this.activeTab === 'cg') this._renderCG();
        if (this.activeTab === 'music') this._renderMusic();
        if (this.activeTab === 'characters') this._renderCharacters();
    }

    _renderHeader() {
        const labels = this._labels();
        const title = document.querySelector('.gallery-title');
        const back = document.getElementById('gallery-back');
        const progressLabel = document.querySelector('.gallery-progress-label');
        if (title) title.textContent = labels.title;
        if (back) back.textContent = labels.back;
        if (progressLabel) progressLabel.textContent = labels.progress;
    }

    _renderTabs() {
        const tabs = document.querySelector('#gallery-tabs');
        if (!tabs) return;
        const labels = this._labels();

        tabs.querySelectorAll('.gallery-tab').forEach(btn => {
            const tab = btn.dataset.tab;
            btn.textContent = labels.tabs[tab] || tab;
            btn.classList.toggle('active', tab === this.activeTab);
        });
    }

    _renderEndings() {
        const grid = this._grid();
        if (!grid) return;
        const lang = this._lang();
        const labels = this._labels();
        const unlockedCount = GallerySystem.ENDINGS.filter(ending => this.isEndingUnlocked(ending)).length;

        grid.className = 'gallery-grid gallery-grid-endings';
        grid.innerHTML = GallerySystem.ENDINGS.map(ending => {
            const isUnlocked = this.isEndingUnlocked(ending);
            const desc = isUnlocked
                ? (GallerySystem.ENDING_DESCRIPTIONS[ending]?.[lang] || GallerySystem.ENDING_DESCRIPTIONS[ending]?.en || '')
                : labels.lockedEnding;
            return `
                <button class="gallery-card ${isUnlocked ? 'gallery-unlocked' : 'gallery-locked'}" data-kind="ending" data-ending="${this._escape(ending)}">
                    <span class="gallery-card-icon">${isUnlocked ? this._getEndingIcon(ending) : ''}</span>
                    <span class="gallery-card-title">${isUnlocked ? this._escape(ending) : this._escape(labels.locked)}</span>
                    <span class="gallery-card-desc">${this._escape(desc)}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedCount, GallerySystem.ENDINGS.length);
    }

    _renderCG() {
        const grid = this._grid();
        if (!grid) return;
        const labels = this._labels();
        const items = this._getCGItems();
        const unlockedCount = items.filter(item => this.isUnlocked('cg', item.id)).length;

        grid.className = 'gallery-grid gallery-grid-cg';
        grid.innerHTML = items.map(item => {
            const unlocked = this.isUnlocked('cg', item.id);
            const image = `
                ${this._imageTag(item.file, unlocked ? item.name : labels.locked)}
                ${unlocked ? '' : '<div class="gallery-lock-mark">LOCK</div>'}
            `;
            return `
                <button class="gallery-card gallery-media-card ${unlocked ? 'gallery-unlocked' : 'gallery-locked'}" data-kind="cg" data-id="${this._escape(item.id)}">
                    <span class="gallery-thumb">${image}</span>
                    <span class="gallery-card-title">${unlocked ? this._escape(item.name) : this._escape(labels.locked)}</span>
                    <span class="gallery-card-desc">${unlocked ? this._escape(item.description) : this._escape(labels.lockedCg)}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedCount, items.length);
    }

    _renderMusic() {
        const grid = this._grid();
        if (!grid) return;
        const labels = this._labels();
        const items = this._getMusicItems();
        const unlockedCount = items.filter(item => this.isUnlocked('bgm', item.id)).length;

        grid.className = 'gallery-grid gallery-grid-music';
        grid.innerHTML = items.map(item => {
            const unlocked = this.isUnlocked('bgm', item.id);
            const isPlaying = this.playingBgmId === item.id;
            return `
                <button class="gallery-music-row ${unlocked ? 'gallery-unlocked' : 'gallery-locked'} ${isPlaying ? 'playing' : ''}"
                        data-kind="music" data-id="${this._escape(item.id)}">
                    <span class="gallery-music-icon">${isPlaying ? 'II' : 'PLAY'}</span>
                    <span class="gallery-music-main">
                        <span class="gallery-card-title">${unlocked ? this._escape(item.name) : this._escape(labels.locked)}</span>
                        <span class="gallery-card-desc">${unlocked ? this._escape(labels.artist) : this._escape(labels.lockedMusic)}</span>
                    </span>
                    <span class="gallery-music-action">${unlocked ? this._escape(isPlaying ? labels.stop : labels.play) : '--'}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedCount, items.length);
    }

    _renderCharacters() {
        const grid = this._grid();
        if (!grid) return;
        const labels = this._labels();
        const items = this._getCharacterItems();
        const total = items.reduce((sum, item) => sum + item.expressions.length, 0);
        const unlockedTotal = items.reduce((sum, item) => {
            return sum + item.expressions.filter(expr => this.isExpressionUnlocked(item.id, expr.id)).length;
        }, 0);

        grid.className = 'gallery-grid gallery-grid-characters';
        grid.innerHTML = items.map(item => {
            const met = this.isCharacterMet(item.id);
            const charName = this._characterName(item.id);
            const unlocked = item.expressions.filter(expr => this.isExpressionUnlocked(item.id, expr.id)).length;
            const image = `
                ${this._imageTag(item.cover, met ? charName : labels.locked)}
                ${met ? '' : '<div class="gallery-lock-mark">LOCK</div>'}
            `;
            return `
                <button class="gallery-card gallery-character-card ${met ? 'gallery-unlocked' : 'gallery-locked'}" data-kind="character" data-id="${this._escape(item.id)}">
                    <span class="gallery-thumb gallery-character-thumb">${image}</span>
                    <span class="gallery-card-title">${met ? this._escape(charName) : this._escape(labels.locked)}</span>
                    <span class="gallery-card-desc">${met ? `${this._escape(labels.expressions)} ${unlocked} / ${item.expressions.length}` : this._escape(labels.lockedCharacter)}</span>
                </button>
            `;
        }).join('');

        this._updateProgress(unlockedTotal, total);
    }

    _ensureLayout() {
        const container = document.querySelector('#gallery-screen .gallery-container');
        const grid = this._grid();
        if (!container || !grid) return;

        let tabs = document.querySelector('#gallery-tabs');
        if (!tabs) {
            tabs = document.createElement('div');
            tabs.id = 'gallery-tabs';
            tabs.className = 'gallery-tabs';
            tabs.innerHTML = ['endings', 'cg', 'music', 'characters'].map(tab => (
                `<button class="gallery-tab" type="button" data-tab="${tab}"></button>`
            )).join('');
            container.insertBefore(tabs, grid);
        }

        if (!this._tabsBound) {
            this._tabsBound = true;
            tabs.addEventListener('click', event => {
                const tab = event.target.closest('.gallery-tab')?.dataset.tab;
                if (!tab || tab === this.activeTab) return;
                this.game.audio?.playUIClick?.();
                this._stopBgmPreview();
                this.activeTab = tab;
                this._render();
            });
        }

        grid.onclick = event => this._handleGridClick(event);
    }

    _handleGridClick(event) {
        const target = event.target.closest('[data-kind]');
        if (!target) return;

        const kind = target.dataset.kind;
        const id = target.dataset.id;

        if (kind === 'cg') {
            const item = this._getCGItems().find(cg => cg.id === id);
            if (!item) return;
            if (!this.isUnlocked('cg', id)) return this._showMessage(this._labels().lockedCg);
            this._showImageModal(item.name, item.description, item.file);
            return;
        }

        if (kind === 'music') {
            const item = this._getMusicItems().find(track => track.id === id);
            if (!item) return;
            if (!this.isUnlocked('bgm', id)) return this._showMessage(this._labels().lockedMusic);
            this._toggleBgmPreview(item);
            return;
        }

        if (kind === 'character') {
            const item = this._getCharacterItems().find(character => character.id === id);
            if (!item) return;
            if (!this.isCharacterMet(id)) return this._showMessage(this._labels().lockedCharacter);
            this._showCharacterModal(item);
        }
    }

    _showCharacterModal(character) {
        const labels = this._labels();
        const charName = this._characterName(character.id);
        const body = `
            <div class="gallery-character-modal-body">
                <div class="gallery-character-modal-cover">
                    ${this._imageTag(character.cover, charName)}
                </div>
                <div class="gallery-expression-grid">
                    ${character.expressions.map(expr => {
                        const unlocked = this.isExpressionUnlocked(character.id, expr.id);
                        const image = `
                            ${this._imageTag(expr.file, unlocked ? expr.name : labels.locked)}
                            ${unlocked ? '' : '<div class="gallery-lock-mark">LOCK</div>'}
                        `;
                        return `
                            <div class="gallery-expression-card ${unlocked ? 'gallery-unlocked' : 'gallery-locked'}">
                                <div class="gallery-expression-thumb">${image}</div>
                                <div class="gallery-expression-name">${unlocked ? this._escape(expr.name) : this._escape(labels.locked)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        this._showModal(charName, body);
    }

    _showImageModal(title, description, imagePath) {
        this._showModal(title, `
            <div class="gallery-image-modal">
                ${this._imageTag(imagePath, title)}
                <p>${this._escape(description || '')}</p>
            </div>
        `);
    }

    _showMessage(message) {
        this._showModal(this._labels().locked, `<p class="gallery-modal-message">${this._escape(message)}</p>`);
    }

    _showModal(title, bodyHtml) {
        this._closeModal();

        const modal = document.createElement('div');
        modal.id = 'gallery-modal';
        modal.className = 'gallery-modal-overlay';
        modal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-modal-close" type="button" aria-label="${this._escape(this._labels().close)}">x</button>
                <h3>${this._escape(title)}</h3>
                ${bodyHtml}
            </div>
        `;

        modal.addEventListener('click', event => {
            if (event.target === modal || event.target.closest('.gallery-modal-close')) {
                this._closeModal();
            }
        });

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('active'));
    }

    _closeModal() {
        const modal = document.querySelector('.gallery-modal-overlay');
        if (modal) modal.remove();
    }

    _toggleBgmPreview(item) {
        if (this.playingBgmId === item.id) {
            this._stopBgmPreview();
            this._renderMusic();
            return;
        }

        this._stopBgmPreview();
        this.playingBgmId = item.id;
        this.game.audio?.playBGM?.(item.file, { fadeIn: 0.15, fadeOut: 0.15 });
        this._renderMusic();
    }

    _stopBgmPreview() {
        if (!this.playingBgmId) return;
        this.game.audio?.stopBGM?.(0.2);
        this.playingBgmId = null;
    }

    isEndingUnlocked(ending) {
        return this.isAdmin || this.getUnlockedEndings().includes(ending);
    }

    isUnlocked(type, id) {
        if (this.isAdmin) return true;
        this.data = this._load();
        return !!this.data[type]?.[id]?.unlocked;
    }

    isCharacterMet(charId) {
        if (this.isAdmin) return true;
        this.data = this._load();
        return !!this.data.characters?.[charId]?.met;
    }

    isExpressionUnlocked(charId, exprId) {
        if (this.isAdmin) return true;
        this.data = this._load();
        return !!this.data.characters?.[charId]?.expressions?.[exprId]?.unlocked;
    }

    _load() {
        const defaults = this._defaultData();
        let parsed = null;

        try {
            const raw = localStorage.getItem(GallerySystem.STORAGE_KEY);
            if (raw) parsed = JSON.parse(raw);
        } catch (e) {
            console.warn('[Gallery] Failed to load gallery data:', e);
        }

        const data = (!parsed || parsed.version !== GallerySystem.VERSION)
            ? defaults
            : this._mergeDefaults(defaults, parsed);

        const legacy = this._loadLegacyEndings();
        legacy.forEach(ending => {
            if (GallerySystem.ENDINGS.includes(ending) && !data.endings.includes(ending)) {
                data.endings.push(ending);
            }
        });

        return data;
    }

    _save() {
        try {
            localStorage.setItem(GallerySystem.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('[Gallery] Failed to save gallery data:', e);
        }
    }

    _saveLegacyEndings() {
        try {
            localStorage.setItem(GallerySystem.LEGACY_ENDING_STORAGE_KEY, JSON.stringify(this.data.endings || []));
        } catch (_) {}
    }

    _loadLegacyEndings() {
        try {
            const raw = localStorage.getItem(GallerySystem.LEGACY_ENDING_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    _defaultData() {
        const characters = {};
        this._getCharacterItems().forEach(item => {
            characters[item.id] = { met: false, expressions: {} };
        });
        return {
            version: GallerySystem.VERSION,
            endings: [],
            cg: {},
            bgm: {},
            characters
        };
    }

    _mergeDefaults(defaults, parsed) {
        const merged = {
            ...defaults,
            ...parsed,
            cg: { ...defaults.cg, ...(parsed.cg || {}) },
            bgm: { ...defaults.bgm, ...(parsed.bgm || {}) },
            characters: { ...defaults.characters }
        };

        for (const [charId, defaultChar] of Object.entries(defaults.characters)) {
            merged.characters[charId] = {
                ...defaultChar,
                ...(parsed.characters?.[charId] || {}),
                expressions: {
                    ...defaultChar.expressions,
                    ...(parsed.characters?.[charId]?.expressions || {})
                }
            };
        }

        merged.endings = Array.isArray(parsed.endings) ? [...parsed.endings] : [];
        return merged;
    }

    _unlockListItem(key, value) {
        this.data = this._load();
        if (!this.data[key]) this.data[key] = [];
        if (this.data[key].includes(value)) return false;
        this.data[key].push(value);
        this._save();
        return true;
    }

    _unlockObjectItem(type, id) {
        this.data = this._load();
        this.data[type] = this.data[type] || {};
        if (this.data[type][id]?.unlocked) return false;
        this.data[type][id] = { unlocked: true, unlockedAt: Date.now() };
        this._save();
        return true;
    }

    _getCGItems() {
        if (this._cgItems) return this._cgItems;

        const map = {
            ending_true: {
                id: 'ending_true',
                name: 'True Ending CG',
                description: 'The dawn gate beyond Project Nevergrad.'
            },
            ending_escape: {
                id: 'ending_escape',
                name: 'Escape Ending CG',
                description: 'The rain-soaked escape route.'
            },
            ending_cage: {
                id: 'ending_cage',
                name: 'Cage Ending CG',
                description: 'The classroom that never releases you.'
            },
            ending_ghost: {
                id: 'ending_ghost',
                name: 'Ghost Ending CG',
                description: 'A trace left behind in the empty room.'
            },
            ending_forget: {
                id: 'ending_forget',
                name: 'Forget Ending CG',
                description: 'An empty seat in ordinary days.'
            }
        };

        this._cgItems = Object.entries(CONFIG.BACKGROUNDS || {})
            .filter(([, file]) => String(file).includes('/images/cg/'))
            .map(([backgroundKey, file]) => ({
                id: map[backgroundKey]?.id || backgroundKey,
                backgroundKey,
                file,
                name: map[backgroundKey]?.name || this._titleFromId(backgroundKey),
                description: map[backgroundKey]?.description || ''
            }));

        return this._cgItems;
    }

    _getMusicItems() {
        if (this._musicItems) return this._musicItems;

        const seen = new Map();
        const add = (file) => {
            if (!file || typeof file !== 'string') return;
            const id = this._bgmId(file);
            if (seen.has(id)) return;
            seen.set(id, {
                id,
                file,
                name: GallerySystem.BGM_TITLES[id] || this._titleFromId(id)
            });
        };

        for (const day of Object.values(window.SCENARIO || {})) {
            for (const scene of Object.values(day || {})) {
                if (typeof scene.bgm === 'string') add(scene.bgm);
                if (scene.bgm_fade?.to) add(scene.bgm_fade.to);
            }
        }

        this._musicItems = [...seen.values()];
        return this._musicItems;
    }

    _getCharacterItems() {
        if (this._characterItems) return this._characterItems;

        this._characterItems = Object.entries(CONFIG.EXPRESSIONS || {})
            .filter(([charId, expressions]) => charId !== 'classmate' && expressions && Object.values(expressions).some(Boolean))
            .map(([charId, expressions]) => {
                const seenPaths = new Set();
                const items = [];
                for (const [exprId, file] of Object.entries(expressions)) {
                    if (!file) continue;
                    const normalized = this._normalizeAsset(file);
                    if (seenPaths.has(normalized)) continue;
                    seenPaths.add(normalized);
                    items.push({
                        id: exprId,
                        name: GallerySystem.EXPRESSION_TITLES[exprId] || this._titleFromId(exprId),
                        file
                    });
                }

                return {
                    id: charId,
                    name: charId,
                    cover: expressions.normal || items[0]?.file,
                    expressions: items
                };
            });

        return this._characterItems;
    }

    _parseCharacterExpression(keyOrPath) {
        if (!keyOrPath || typeof keyOrPath !== 'string') return null;
        let name = keyOrPath;

        if (keyOrPath.includes('/')) {
            name = keyOrPath.split(/[?#]/)[0].split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
        }

        const idx = name.indexOf('_');
        if (idx <= 0) return null;

        return {
            charId: name.substring(0, idx),
            expression: name.substring(idx + 1)
        };
    }

    _bgmId(filename) {
        return String(filename).split('/').pop().replace(/\.[^.]+$/, '');
    }

    _grid() {
        return document.getElementById('gallery-grid');
    }

    _updateProgress(unlocked, total) {
        const progress = document.getElementById('gallery-progress');
        if (progress) progress.textContent = `${unlocked} / ${total}`;
    }

    _getEndingIcon(ending) {
        const icons = {
            'TRUE END': '\u2605',
            'RESIST END': '\u2694',
            'FORGET END': '\u29BE',
            'CAGE END': '\u25A3',
            'GHOST END': '\u2620',
            'ESCAPE END': '\u2708',
            'COMPLICIT END': '\u2622'
        };
        return icons[ending] || '\u2726';
    }

    _labels() {
        const lang = this._lang();
        return GallerySystem.LABELS[lang] || GallerySystem.LABELS.en;
    }

    _lang() {
        return this.game?.i18n?.currentLang || 'ko';
    }

    _titleFromId(id) {
        return String(id || '')
            .replace(/\.[^.]+$/, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, ch => ch.toUpperCase());
    }

    _characterName(charId) {
        return this.game?.i18n?.getCharacterName?.(charId) || this._titleFromId(charId);
    }

    _normalizeAsset(value) {
        return String(value || '')
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/^\.\.\//, '')
            .split(/[?#]/)[0]
            .toLowerCase();
    }

    _asset(src) {
        if (!src) return '';
        const normalized = String(src).replace(/^\.\//, '');
        if (/^(?:https?:|data:|blob:|\/)/.test(normalized) || normalized.startsWith('../')) {
            return normalized;
        }
        return (window.__NEVERGRAD_LANG__ ? '../' : '') + normalized;
    }

    _versioned(src) {
        const asset = this._asset(src);
        if (!asset || /[?#]/.test(asset) || /^(?:data:|blob:)/.test(asset)) return asset;
        const version = CONFIG.VERSION || '1';
        return `${asset}?v=${encodeURIComponent(version)}`;
    }

    _fallbackImage(src) {
        if (!src || typeof src !== 'string') return '';
        const normalized = src.replace(/\\/g, '/');
        const match = normalized.match(/^([^?#]+)([?#].*)?$/);
        const pathPart = match ? match[1] : normalized;
        const suffix = match?.[2] || '';

        if (!/^(?:\.\.\/)?assets\/images\/(?:background|characters|cg|evidence)\/.+\.webp$/i.test(pathPart)) {
            return '';
        }

        return `${pathPart.replace(/\.webp$/i, '.png')}${suffix}`;
    }

    _imageTag(src, alt) {
        const primary = this._versioned(src);
        const fallback = this._versioned(this._fallbackImage(src));
        const fallbackAttr = fallback && fallback !== primary
            ? ` onerror="this.onerror=null;this.src='${this._escape(fallback)}'"`
            : '';
        return `<img src="${this._escape(primary)}"${fallbackAttr} alt="${this._escape(alt)}">`;
    }

    _escape(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
