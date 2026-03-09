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
        this.bgmAudio = null;
    }

    setBackground(src) {
        if (this.bgLayer) {
            this.bgLayer.style.backgroundImage = `url('${src}')`;
        }
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

    setCharacter(position, src) {
        const el = position === 'left' ? this.charLeft
                  : position === 'right' ? this.charRight
                  : this.charCenter;
        if (!el) return;

        const prevSrc = el.getAttribute('src');
        if (prevSrc && prevSrc !== '') {
            // 표정 변경 — 즉시 교체 (위치 유지)
            el.src = src;
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
        if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
        this.bgmAudio = new Audio(`assets/audio/bgm/${src}`);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.5;
        this.bgmAudio.play().catch(() => {});
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
        }
    }
}
