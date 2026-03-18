/**
 * ============================================================================
 * SceneRenderer.js - 화면 렌더링
 * ============================================================================
 */

class SceneRenderer {
    constructor() {
        this.bgLayer = document.getElementById('bg-layer');
        this.bgOverlay = document.getElementById('bg-overlay');
        this.charLeft = document.getElementById('char-left');
        this.charCenter = document.getElementById('char-center');
        this.charRight = document.getElementById('char-right');

        /** @type {AudioManager|null} Web Audio API 매니저 (외부에서 주입) */
        this.audio = null;

        // 레거시 호환 (GlitchSystem.silenceDrop 등에서 참조)
        this.bgmAudio = null;
    }

    setBackground(src) {
        if (!this.bgLayer) return;

        // CSS 변수(--bg-next)는 style.css 기준으로 URL이 해석되므로 절대 경로 사용
        const absoluteSrc = new URL(src, document.baseURI).href;
        const newBg = `url('${absoluteSrc}')`;
        const currentBg = this.bgLayer.style.backgroundImage;

        // 첫 배경이거나 같은 배경이면 즉시 적용
        if (!currentBg || currentBg === 'none' || currentBg === newBg) {
            this.bgLayer.style.backgroundImage = newBg;
            return;
        }

        // 즉시 교체
        this.bgLayer.style.backgroundImage = newBg;
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

    // 시간대 설정: bg-layer 필터 + bg-overlay 동시 적용
    // type: 'morning' | 'sunset' | 'night' | 'dawn' | 'dark' | 'rain' | null(낮)
    setTimeOfDay(type) {
        if (!this.bgLayer) return;
        // 기존 시간대 클래스 제거
        this.bgLayer.className = 'bg-layer';
        this.clearOverlays();

        if (type) {
            this.bgLayer.classList.add(`time-${type}`);
            this.addOverlay(type);
        }
    }

    // 캐릭터 이름 프리픽스 추출 (eunsu_smile.png → eunsu)
    _getCharPrefix(src) {
        if (!src) return null;
        const filename = src.split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
        return filename.split('_')[0];
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

        // 목표 opacity 문자열 ('0.35' 등). undefined이면 '' (CSS 기본값 = 1)
        const targetOpacity = (opacity != null && opacity < 1) ? String(opacity) : '';

        // 같은 이미지 + 같은 opacity면 아무것도 안 함 (깜빡임 방지)
        const prevSrc = el.getAttribute('src');
        if (prevSrc === src && el.style.opacity === targetOpacity) return;

        // 이전 클론이 남아있으면 제거
        this._removePrevClone(el);

        // 이전 전환 타이머가 남아있으면 정리
        if (el._charTimer) { clearTimeout(el._charTimer); el._charTimer = null; }

        if (prevSrc && prevSrc !== '') {
            const prevPrefix = this._getCharPrefix(prevSrc);
            const newPrefix = this._getCharPrefix(src);

            if (prevPrefix === newPrefix) {
                // 같은 캐릭터 표정 변화 → 즉시 교체 (깜빡임 없음)
                el.src = src;
                el.style.opacity = targetOpacity;
            } else {
                // 다른 캐릭터 → 페이드아웃 후 페이드인
                el.classList.add('char-fade-out');
                el.style.opacity = '0';
                el._charTimer = setTimeout(() => {
                    el.classList.remove('char-fade-out');
                    el.src = src;
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
            el.src = src;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { el.style.opacity = targetOpacity; });
            });
            setTimeout(() => { el.classList.remove('char-fade-in'); }, 260);
        }
    }

    clearCharacters() {
        [this.charLeft, this.charCenter, this.charRight].forEach(el => {
            if (!el || el.getAttribute('src') === '') return;
            this._removePrevClone(el);
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
