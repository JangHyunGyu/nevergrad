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

        const newBg = `url('${src}')`;
        const currentBg = this.bgLayer.style.backgroundImage;

        // 첫 배경이거나 같은 배경이면 즉시 적용
        if (!currentBg || currentBg === 'none' || currentBg === newBg) {
            this.bgLayer.style.backgroundImage = newBg;
            return;
        }

        // 크로스페이드: ::after에 새 배경 설정 후 페이드인
        this.bgLayer.style.setProperty('--bg-next', newBg);
        this.bgLayer.classList.remove('bg-crossfade');
        void this.bgLayer.offsetWidth; // force reflow
        this.bgLayer.classList.add('bg-crossfade');

        // 페이드 완료 후 메인 배경으로 교체
        this._bgFadeTimer && clearTimeout(this._bgFadeTimer);
        this._bgFadeTimer = setTimeout(() => {
            this.bgLayer.style.backgroundImage = newBg;
            this.bgLayer.classList.remove('bg-crossfade');
        }, 420);
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

    setCharacter(position, src) {
        const el = position === 'left' ? this.charLeft
                  : position === 'right' ? this.charRight
                  : this.charCenter;
        if (!el) return;

        const prevSrc = el.getAttribute('src');
        if (prevSrc && prevSrc !== '') {
            const prevPrefix = this._getCharPrefix(prevSrc);
            const newPrefix = this._getCharPrefix(src);

            if (prevPrefix === newPrefix) {
                // 같은 캐릭터 표정 변화 → 빠른 크로스페이드
                el.style.opacity = '0';
                setTimeout(() => {
                    el.src = src;
                    requestAnimationFrame(() => { el.style.opacity = ''; });
                }, 120);
            } else {
                // 다른 캐릭터 → 페이드아웃 후 페이드인
                el.style.opacity = '0';
                setTimeout(() => {
                    el.src = src;
                    requestAnimationFrame(() => { el.style.opacity = ''; });
                }, 280);
            }
        } else {
            // 새 등장 — fade in
            el.style.opacity = '0';
            el.src = src;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { el.style.opacity = ''; });
            });
        }
    }

    clearCharacters() {
        [this.charLeft, this.charCenter, this.charRight].forEach(el => {
            if (!el || el.getAttribute('src') === '') return;
            el.style.opacity = '0';
            setTimeout(() => {
                el.src = '';
                el.style.opacity = '';
            }, 300);
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
