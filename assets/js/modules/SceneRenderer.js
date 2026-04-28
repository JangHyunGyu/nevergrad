/**
 * ============================================================================
 * SceneRenderer.js - 화면 렌더링
 * ============================================================================
 */

class SceneRenderer {
    constructor() {
        this.bgLayer = document.getElementById('bg-layer');
        this.bgOverlay = document.getElementById('bg-overlay');
        this.mediaOverlay = document.getElementById('media-overlay');
        this.charLayer = document.getElementById('char-layer');
        this.charLeft = document.getElementById('char-left');
        this.charCenter = document.getElementById('char-center');
        this.charRight = document.getElementById('char-right');

        /** @type {AudioManager|null} Web Audio API 매니저 (외부에서 주입) */
        this.audio = null;

        // 레거시 호환 (GlitchSystem.silenceDrop 등에서 참조)
        this.bgmAudio = null;
        this._backgroundRequestId = 0;
    }

    _getAssetPath(src) {
        if (!src) return '';
        const normalized = String(src).replace(/^\.\//, '');
        if (/^(?:https?:|data:|blob:|\/)/.test(normalized) || normalized.startsWith('../')) {
            return normalized;
        }
        return (window.__NEVERGRAD_LANG__ ? '../' : '') + normalized;
    }

    _getAssetUrl(src) {
        return new URL(this._getAssetPath(src), document.baseURI).href;
    }

    _getBackgroundCandidates(src) {
        return this._getWebpCandidates(src);
    }

    // PNG 경로 → [webp 우선, png 폴백]. 매칭 폴더(background/characters) 외엔 원본 그대로.
    _getWebpCandidates(src) {
        if (!src) return [];

        const raw = String(src);
        const match = raw.match(/^([^?#]+)([?#].*)?$/);
        const pathPart = match ? match[1] : raw;
        const suffix = match?.[2] || '';

        if (!/^(?:\.\.\/)?assets\/images\/(?:background|characters)\/.+\.png$/i.test(pathPart)) {
            return [raw];
        }

        return [
            `${pathPart.replace(/\.png$/i, '.webp')}${suffix}`,
            raw
        ];
    }

    _loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = reject;
            img.src = this._getAssetUrl(src);
        });
    }

    _applyBackground(src) {
        if (!this.bgLayer || !src) return;
        const absoluteSrc = this._getAssetUrl(src);
        const newBg = `url('${absoluteSrc}')`;
        const currentBg = this.bgLayer.style.backgroundImage;

        if (!currentBg || currentBg === 'none' || currentBg === newBg) {
            this.bgLayer.style.backgroundImage = newBg;
            return;
        }

        this.bgLayer.style.backgroundImage = newBg;
    }

    setBackground(src) {
        if (!this.bgLayer || !src) return;

        const requestId = ++this._backgroundRequestId;
        const candidates = this._getBackgroundCandidates(src);
        const applyIfCurrent = (resolvedSrc) => {
            if (requestId !== this._backgroundRequestId) return;
            this._applyBackground(resolvedSrc);
        };

        if (candidates.length < 2) {
            applyIfCurrent(candidates[0]);
            return;
        }

        this._loadImage(candidates[0])
            .then(applyIfCurrent)
            .catch(() => applyIfCurrent(candidates[1]));
    }

    clearOverlays() {
        if (this.bgOverlay) {
            this.bgOverlay.className = 'bg-overlay';
        }
    }

    addOverlay(type) {
        if (this.bgOverlay) {
            this.bgOverlay.classList.add(type);
        }
    }

    _ensureMediaOverlay() {
        if (this.mediaOverlay) return this.mediaOverlay;

        const el = document.createElement('div');
        el.id = 'media-overlay';
        el.className = 'scene-media-layer hidden';
        el.setAttribute('aria-hidden', 'true');

        const parent = this.bgOverlay?.parentNode || this.bgLayer?.parentNode || document.getElementById('game-screen');
        if (parent) {
            if (this.bgOverlay?.nextSibling) {
                parent.insertBefore(el, this.bgOverlay.nextSibling);
            } else {
                parent.appendChild(el);
            }
        }

        this.mediaOverlay = el;
        return el;
    }

    clearMediaOverlay() {
        const el = this.mediaOverlay;
        if (!el) return;
        el.replaceChildren();
        el.className = 'scene-media-layer hidden';
        el.removeAttribute('data-media-type');
    }

    setMediaOverlay(data) {
        if (!data) {
            this.clearMediaOverlay();
            return;
        }

        const el = this._ensureMediaOverlay();
        if (!el) return;

        const typeClass = `scene-media-${String(data.type || 'default').replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`;
        const variantClass = data.variant ? `scene-media-variant-${String(data.variant).replace(/[^a-z0-9_-]/gi, '').toLowerCase()}` : '';
        el.replaceChildren();
        el.className = ['scene-media-layer', typeClass, variantClass].filter(Boolean).join(' ');
        el.dataset.mediaType = data.type || 'default';
        el.setAttribute('aria-hidden', 'true');

        const node = data.type === 'newsArticle'
            ? this._renderNewsArticle(data)
            : this._renderLabDossier(data);
        el.appendChild(node);

        requestAnimationFrame(() => {
            el.classList.add('visible');
        });
    }

    _el(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text != null) el.textContent = String(text);
        return el;
    }

    _append(parent, tag, className, text) {
        const el = this._el(tag, className, text);
        parent.appendChild(el);
        return el;
    }

    _renderNewsArticle(data) {
        const frame = this._el('div', 'media-news-frame');

        const browser = this._append(frame, 'div', 'media-news-browser');
        const dots = this._append(browser, 'div', 'media-news-dots');
        dots.append(this._el('span'), this._el('span'), this._el('span'));
        this._append(browser, 'div', 'media-news-address', data.url || 'nevergrad.local/investigation/13');
        this._append(browser, 'div', 'media-news-live', data.live || 'LIVE');

        const paper = this._append(frame, 'article', 'media-news-paper');
        const masthead = this._append(paper, 'header', 'media-news-masthead');
        this._append(masthead, 'div', 'media-news-source', data.source || 'NEVERGRAD TIMES');
        this._append(masthead, 'div', 'media-news-meta', data.meta || '');

        const hero = this._append(paper, 'section', 'media-news-hero');
        const story = this._append(hero, 'div', 'media-news-story');
        this._append(story, 'div', 'media-news-kicker', data.kicker || '');
        this._append(story, 'h1', 'media-news-headline', data.headline || '');
        this._append(story, 'p', 'media-news-deck', data.deck || '');

        const badges = this._append(story, 'div', 'media-news-badges');
        (data.badges || []).slice(0, 3).forEach(label => this._append(badges, 'span', 'media-news-badge', label));

        const card = this._append(hero, 'aside', 'media-news-card');
        this._append(card, 'div', 'media-news-card-label', data.cardLabel || '');
        this._append(card, 'div', 'media-news-card-number', data.cardNumber || '#13');
        this._append(card, 'div', 'media-news-card-caption', data.cardCaption || '');

        const lower = this._append(paper, 'section', 'media-news-lower');
        const related = this._append(lower, 'div', 'media-news-related');
        this._append(related, 'div', 'media-news-section-title', data.relatedTitle || '');
        (data.related || []).slice(0, 3).forEach(item => this._append(related, 'p', 'media-news-related-item', item));

        const chart = this._append(lower, 'div', 'media-news-chart');
        this._append(chart, 'div', 'media-news-section-title', data.chartTitle || '');
        const bars = this._append(chart, 'div', 'media-news-bars');
        (data.chart || [28, 45, 62, 91]).forEach((value, index) => {
            const bar = this._append(bars, 'div', 'media-news-bar');
            bar.style.setProperty('--bar-height', `${Math.max(8, Math.min(100, Number(value) || 0))}%`);
            this._append(bar, 'span', 'media-news-bar-fill');
            this._append(bar, 'em', '', String(index + 1));
        });

        return frame;
    }

    _renderLabDossier(data) {
        const frame = this._el('div', 'media-dossier-frame');
        const spread = this._append(frame, 'div', 'media-dossier-spread');

        const main = this._append(spread, 'section', 'media-dossier-sheet media-dossier-main');
        const top = this._append(main, 'header', 'media-dossier-top');
        this._append(top, 'div', 'media-dossier-org', data.org || 'EDINA FOUNDATION');
        this._append(top, 'div', 'media-dossier-stamp', data.stamp || 'CONFIDENTIAL');
        this._append(main, 'div', 'media-dossier-file-id', data.fileId || 'NVG-13-FINAL');
        this._append(main, 'h2', 'media-dossier-title', data.title || '');
        this._append(main, 'p', 'media-dossier-excerpt', data.excerpt || '');

        const table = this._append(main, 'div', 'media-dossier-table');
        (data.rows || []).forEach(row => {
            const rowEl = this._append(table, 'div', `media-dossier-row ${row.tone ? `is-${row.tone}` : ''}`);
            this._append(rowEl, 'span', 'media-dossier-cell cycle', row.cycle || '');
            this._append(rowEl, 'span', 'media-dossier-cell name', row.name || '');
            this._append(rowEl, 'span', 'media-dossier-cell status', row.status || '');
        });

        const side = this._append(spread, 'aside', 'media-dossier-sheet media-dossier-side');
        this._append(side, 'div', 'media-dossier-side-label', data.sideLabel || '');
        const portrait = this._append(side, 'div', 'media-dossier-portrait');
        this._append(portrait, 'div', 'media-dossier-portrait-id', data.subject || '#13');
        this._append(side, 'div', 'media-dossier-note', data.note || '');

        const redactions = this._append(side, 'div', 'media-dossier-redactions');
        for (let i = 0; i < 6; i++) this._append(redactions, 'span');

        const footer = this._append(side, 'div', 'media-dossier-footer', data.footer || '');
        footer.style.setProperty('--scan', `${Math.max(12, Math.min(88, Number(data.scan) || 54))}%`);

        return frame;
    }

    // 시간대 설정: bg-layer 필터 + bg-overlay 동시 적용
    // type: 'morning' | 'sunset' | 'night' | 'dawn' | 'dark' | 'rain' | null(낮)
    setTimeOfDay(type) {
        const timeClasses = [
            'time-morning',
            'time-sunset',
            'time-night',
            'time-dawn',
            'time-dark',
            'time-rain'
        ];

        if (this.bgLayer) {
            this.bgLayer.classList.add('bg-layer');
            this.bgLayer.classList.remove(...timeClasses);
        }

        if (this.charLayer) {
            this.charLayer.classList.remove(...timeClasses);
        }

        this.clearOverlays();

        if (type && this.charLayer) {
            this.charLayer.classList.add(`time-${type}`);
        }
    }

    // 캐릭터 이름 프리픽스 추출 (eunsu_smile.png → eunsu)
    _getCharPrefix(src) {
        if (!src) return null;
        const cleanSrc = String(src).split(/[?#]/)[0];
        const filename = cleanSrc.split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
        return filename.split('_')[0];
    }

    _withAssetVersion(src) {
        if (!src || !/^assets\/images\/characters\//.test(src) || /[?#]/.test(src)) return src;
        const version = (typeof CONFIG !== 'undefined' && CONFIG.VERSION) ? CONFIG.VERSION : '1';
        return `${src}?v=${encodeURIComponent(version)}`;
    }

    /**
     * 크로스페이드용 임시 클론 제거 헬퍼
     * @param {HTMLElement} el - 메인 캐릭터 <img>
     */
    _removePrevClone(el) {
        const prev = el._fadeClone;
        if (prev && prev.parentNode) {
            prev.parentNode.removeChild(prev);
        }
        el._fadeClone = null;
    }

    /**
     * @param {string} position  'left' | 'center' | 'right'
     * @param {string} src       이미지 경로
     * @param {number} [opacity] 0~1 사이 값. 생략하면 1(기본 불투명)
     */
    setCharacter(position, src, opacity) {
        const el = position === 'left' ? this.charLeft
                  : position === 'right' ? this.charRight
                  : this.charCenter;
        if (!el) return;

        // webp 우선 / png 폴백 — 캐싱 비교는 webp 기준 (정상 케이스에서 webp가 늘 성공)
        const candidates = this._getWebpCandidates(src);
        const webpSrc = this._withAssetVersion(candidates[0] || src);
        const pngSrc = this._withAssetVersion(candidates[1] || candidates[0] || src);

        // 목표 opacity 문자열 ('0.35' 등). undefined이면 '' (CSS 기본값 = 1)
        const targetOpacity = (opacity != null && opacity < 1) ? String(opacity) : '';

        // 같은 이미지 + 같은 opacity면 아무것도 안 함 (깜빡임 방지)
        const prevSrc = el.getAttribute('src');
        if ((prevSrc === webpSrc || prevSrc === pngSrc) && el.style.opacity === targetOpacity) return;

        // 이전 클론이 남아있으면 제거
        this._removePrevClone(el);

        // 이전 전환 타이머가 남아있으면 정리
        if (el._charTimer) { clearTimeout(el._charTimer); el._charTimer = null; }

        if (prevSrc && prevSrc !== '') {
            const prevPrefix = this._getCharPrefix(prevSrc);
            const newPrefix = this._getCharPrefix(webpSrc);

            if (prevPrefix === newPrefix) {
                // 같은 캐릭터 표정 변화 → 즉시 교체 (깜빡임 없음)
                this._applyImgWithFallback(el, webpSrc, pngSrc);
                el.style.opacity = targetOpacity;
            } else {
                // 다른 캐릭터 → 페이드아웃 후 페이드인
                el.classList.add('char-fade-out');
                el.style.opacity = '0';
                el._charTimer = setTimeout(() => {
                    el.classList.remove('char-fade-out');
                    this._applyImgWithFallback(el, webpSrc, pngSrc);
                    el.classList.add('char-fade-in');
                    el.style.opacity = '0';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el.style.opacity = targetOpacity;
                        });
                    });
                    el._charTimer = setTimeout(() => {
                        el.classList.remove('char-fade-in');
                        el._charTimer = null;
                    }, 260);
                }, 260);
            }
        } else {
            // 새 등장 — 페이드인
            el.classList.add('char-fade-in');
            el.style.opacity = '0';
            this._applyImgWithFallback(el, webpSrc, pngSrc);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { el.style.opacity = targetOpacity; });
            });
            setTimeout(() => { el.classList.remove('char-fade-in'); }, 260);
        }
    }

    // <img> 요소에 webp 시도 → 실패 시 png 폴백 (배경 webp 정책과 동일한 의도)
    _applyImgWithFallback(el, webpSrc, pngSrc) {
        el.onerror = null;
        if (!webpSrc || webpSrc === pngSrc) {
            el.src = webpSrc || pngSrc;
            return;
        }
        el.onerror = () => {
            el.onerror = null;
            el.src = pngSrc;
        };
        el.src = webpSrc;
    }

    clearCharacters() {
        [this.charLeft, this.charCenter, this.charRight].forEach(el => {
            if (!el || el.getAttribute('src') === '') return;
            this._removePrevClone(el);
            if (el._charTimer) {
                clearTimeout(el._charTimer);
                el._charTimer = null;
            }
            el.classList.add('char-fade-out');
            el.style.opacity = '0';
            setTimeout(() => {
                el.src = '';
                el.style.opacity = '';
                el.classList.remove('char-fade-out');
            }, 260);
        });
    }

    setSilhouette(enabled) {
        const chars = [this.charLeft, this.charCenter, this.charRight];
        chars.forEach(el => {
            if (el) {
                el.classList.toggle('silhouette', enabled);
            }
        });
    }

    playBGM(src) {
        // AudioManager가 있으면 크로스페이드 재생
        if (this.audio) {
            this.audio.playBGM(src);
            return;
        }
        // 폴백: HTML5 Audio
        if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
        this.bgmAudio = new Audio(`assets/audio/bgm/${src}`);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.5;
        this.bgmAudio.play().catch(() => {});
    }

    stopBGM() {
        if (this.audio) {
            this.audio.stopBGM();
            return;
        }
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
        }
    }

    playSFX(src, options) {
        if (this.audio) {
            this.audio.playSFX(src, options);
        }
    }

    playAmbient(src, fadeIn) {
        if (this.audio) {
            this.audio.playAmbient(src, fadeIn);
        }
    }

    stopAmbient(fadeOut) {
        if (this.audio) {
            this.audio.stopAmbient(fadeOut);
        }
    }
}
