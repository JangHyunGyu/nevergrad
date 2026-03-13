/**
 * ============================================================================
 * AudioManager.js - Web Audio API 기반 오디오 시스템
 * ============================================================================
 *
 * [기능]
 * - BGM 크로스페이드 재생 (두 트랙 간 부드러운 전환)
 * - SFX 채널 (UI 효과음, 게임 이벤트)
 * - Ambient 채널 (환경음 루프)
 * - 글리치 연출용 오디오 왜곡 (playbackRate, 볼륨 램프, 필터)
 * - 모바일 autoplay 정책 대응 (첫 상호작용 시 AudioContext unlock)
 *
 * [채널 구조]
 * AudioContext
 * ├─ bgmGainA ─ bgmSourceA (현재 BGM)
 * ├─ bgmGainB ─ bgmSourceB (크로스페이드 대상)
 * ├─ sfxGain   ─ (one-shot SFX)
 * ├─ ambGain   ─ ambSource (환경음 루프)
 * └─ masterGain ─ destination
 */

class AudioManager {
    constructor() {
        /** @type {AudioContext|null} */
        this.ctx = null;

        // ── Gain 노드 ──
        /** @type {GainNode|null} */
        this.masterGain = null;
        /** @type {GainNode|null} */
        this.bgmGainA = null;
        /** @type {GainNode|null} */
        this.bgmGainB = null;
        /** @type {GainNode|null} */
        this.sfxGain = null;
        /** @type {GainNode|null} */
        this.ambGain = null;

        // ── 소스 노드 ──
        /** @type {AudioBufferSourceNode|null} */
        this.bgmSourceA = null;
        /** @type {AudioBufferSourceNode|null} */
        this.bgmSourceB = null;
        /** @type {AudioBufferSourceNode|null} */
        this.ambSource = null;

        // ── 글리치 필터 ──
        /** @type {BiquadFilterNode|null} */
        this._glitchFilter = null;

        // ── 상태 ──
        /** @type {boolean} 현재 활성 BGM 슬롯 (true=A, false=B) */
        this._activeSlotA = true;
        /** @type {string|null} 현재 재생 중인 BGM 파일명 */
        this._currentBGM = null;
        /** @type {string|null} 현재 재생 중인 환경음 파일명 */
        this._currentAmbient = null;
        /** @type {boolean} AudioContext가 unlock 되었는지 */
        this._unlocked = false;

        // ── 버퍼 캐시 ──
        /** @type {Map<string, AudioBuffer>} */
        this._bufferCache = new Map();

        // ── 볼륨 설정 ──
        this.volumes = {
            master: 1.0,
            bgm: 0.5,
            sfx: 0.8,
            ambient: 0.3
        };

        // ── 크로스페이드 시간 (초) ──
        this.CROSSFADE_DURATION = 1.5;
    }

    // =========================================================================
    // 초기화
    // =========================================================================

    /**
     * AudioContext 초기화 + gain 노드 구성
     * GameEngine.init() 에서 호출
     */
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('[AudioManager] Web Audio API not supported:', e);
            return;
        }

        // Master gain → destination
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volumes.master;
        this.masterGain.connect(this.ctx.destination);

        // BGM 슬롯 A/B
        this.bgmGainA = this.ctx.createGain();
        this.bgmGainA.gain.value = this.volumes.bgm;
        this.bgmGainA.connect(this.masterGain);

        this.bgmGainB = this.ctx.createGain();
        this.bgmGainB.gain.value = 0;
        this.bgmGainB.connect(this.masterGain);

        // SFX
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.volumes.sfx;
        this.sfxGain.connect(this.masterGain);

        // Ambient
        this.ambGain = this.ctx.createGain();
        this.ambGain.gain.value = this.volumes.ambient;
        this.ambGain.connect(this.masterGain);

        // 글리치 필터 (비활성 상태로 대기)
        this._glitchFilter = this.ctx.createBiquadFilter();
        this._glitchFilter.type = 'lowpass';
        this._glitchFilter.frequency.value = 20000; // 기본값: 필터 없음
        this._glitchFilter.connect(this.masterGain);

        // Autoplay 정책 unlock
        this._setupAutoplayUnlock();
    }

    /**
     * 첫 사용자 상호작용 시 AudioContext를 resume
     * @private
     */
    _setupAutoplayUnlock() {
        if (!this.ctx) return;

        const unlock = () => {
            if (this._unlocked) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().then(() => {
                    this._unlocked = true;
                });
            } else {
                this._unlocked = true;
            }
        };

        // 다양한 이벤트에 바인딩 (모바일 대응)
        const events = ['click', 'touchstart', 'keydown'];
        const handler = () => {
            unlock();
            events.forEach(e => document.removeEventListener(e, handler));
        };
        events.forEach(e => document.addEventListener(e, handler, { once: false }));
    }

    // =========================================================================
    // 오디오 버퍼 로드
    // =========================================================================

    /**
     * 오디오 파일을 로드하여 AudioBuffer로 변환 (캐시)
     * @param {string} path - 오디오 파일 경로
     * @returns {Promise<AudioBuffer|null>}
     */
    async loadBuffer(path) {
        if (!this.ctx) return null;

        // 캐시 확인
        if (this._bufferCache.has(path)) {
            return this._bufferCache.get(path);
        }

        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            this._bufferCache.set(path, audioBuffer);
            return audioBuffer;
        } catch (e) {
            console.warn(`[AudioManager] Failed to load: ${path}`, e);
            return null;
        }
    }

    /**
     * BGM 파일들을 미리 로드 (선택적)
     * @param {string[]} files - BGM 파일명 배열 (예: ['morning_bright.mp3'])
     */
    async preloadBGM(files) {
        const promises = files.map(f => this.loadBuffer(`assets/audio/bgm/${f}`));
        await Promise.allSettled(promises);
    }

    /**
     * SFX 파일들을 미리 로드
     * @param {string[]} files - SFX 파일명 배열
     */
    async preloadSFX(files) {
        const promises = files.map(f => this.loadBuffer(`assets/audio/sfx/${f}`));
        await Promise.allSettled(promises);
    }

    // =========================================================================
    // BGM 재생 (크로스페이드)
    // =========================================================================

    /**
     * BGM 재생 — 이전 BGM과 크로스페이드
     * @param {string} filename - BGM 파일명 (예: 'morning_bright.mp3')
     * @param {object} [options]
     * @param {number} [options.fadeIn=1.5] - 페이드인 시간 (초)
     * @param {number} [options.fadeOut=1.5] - 페이드아웃 시간 (초)
     * @param {boolean} [options.immediate=false] - 즉시 전환 (크로스페이드 없이)
     */
    async playBGM(filename, options = {}) {
        if (!this.ctx) return;
        if (this._currentBGM === filename) return; // 같은 곡이면 무시

        const fadeIn = options.fadeIn ?? this.CROSSFADE_DURATION;
        const fadeOut = options.fadeOut ?? this.CROSSFADE_DURATION;
        const immediate = options.immediate || false;
        const path = `assets/audio/bgm/${filename}`;

        const buffer = await this.loadBuffer(path);
        if (!buffer) return;

        const now = this.ctx.currentTime;

        // 현재 활성 슬롯의 반대 슬롯에 새 BGM 로드
        if (this._activeSlotA) {
            // A가 현재 재생 중 → B에 새 곡 로드
            this._stopSource(this.bgmSourceB);
            this.bgmSourceB = this._createLoopSource(buffer, this.bgmGainB);

            if (immediate) {
                this.bgmGainA.gain.setValueAtTime(0, now);
                this.bgmGainB.gain.setValueAtTime(this.volumes.bgm, now);
            } else {
                // A 페이드아웃
                this.bgmGainA.gain.setValueAtTime(this.bgmGainA.gain.value, now);
                this.bgmGainA.gain.linearRampToValueAtTime(0, now + fadeOut);
                // B 페이드인
                this.bgmGainB.gain.setValueAtTime(0, now);
                this.bgmGainB.gain.linearRampToValueAtTime(this.volumes.bgm, now + fadeIn);
            }

            this.bgmSourceB.start(0);

            // 페이드아웃 완료 후 A 소스 정리
            setTimeout(() => {
                this._stopSource(this.bgmSourceA);
                this.bgmSourceA = null;
            }, (immediate ? 0 : fadeOut) * 1000 + 100);

        } else {
            // B가 현재 재생 중 → A에 새 곡 로드
            this._stopSource(this.bgmSourceA);
            this.bgmSourceA = this._createLoopSource(buffer, this.bgmGainA);

            if (immediate) {
                this.bgmGainB.gain.setValueAtTime(0, now);
                this.bgmGainA.gain.setValueAtTime(this.volumes.bgm, now);
            } else {
                // B 페이드아웃
                this.bgmGainB.gain.setValueAtTime(this.bgmGainB.gain.value, now);
                this.bgmGainB.gain.linearRampToValueAtTime(0, now + fadeOut);
                // A 페이드인
                this.bgmGainA.gain.setValueAtTime(0, now);
                this.bgmGainA.gain.linearRampToValueAtTime(this.volumes.bgm, now + fadeIn);
            }

            this.bgmSourceA.start(0);

            setTimeout(() => {
                this._stopSource(this.bgmSourceB);
                this.bgmSourceB = null;
            }, (immediate ? 0 : fadeOut) * 1000 + 100);
        }

        this._activeSlotA = !this._activeSlotA;
        this._currentBGM = filename;
    }

    /**
     * BGM 정지 (페이드아웃)
     * @param {number} [fadeOut=1.0] - 페이드아웃 시간 (초)
     */
    stopBGM(fadeOut = 1.0) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        [this.bgmGainA, this.bgmGainB].forEach(gain => {
            if (gain) {
                gain.gain.setValueAtTime(gain.gain.value, now);
                gain.gain.linearRampToValueAtTime(0, now + fadeOut);
            }
        });

        setTimeout(() => {
            this._stopSource(this.bgmSourceA);
            this._stopSource(this.bgmSourceB);
            this.bgmSourceA = null;
            this.bgmSourceB = null;
        }, fadeOut * 1000 + 100);

        this._currentBGM = null;
    }

    // =========================================================================
    // SFX 재생 (원샷)
    // =========================================================================

    /**
     * 효과음 재생 (중복 허용, 캐시된 버퍼 사용)
     * @param {string} filename - SFX 파일명 (예: 'affinity_up.mp3')
     * @param {object} [options]
     * @param {number} [options.volume=1.0] - 상대 볼륨 (0~1, sfxGain에 곱해짐)
     * @param {number} [options.playbackRate=1.0] - 재생 속도
     */
    async playSFX(filename, options = {}) {
        if (!this.ctx) return;

        const path = `assets/audio/sfx/${filename}`;
        const buffer = await this.loadBuffer(path);
        if (!buffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = options.playbackRate || 1.0;

        // 개별 SFX에 볼륨 조절이 필요하면 중간 gain 추가
        if (options.volume !== undefined && options.volume !== 1.0) {
            const tempGain = this.ctx.createGain();
            tempGain.gain.value = options.volume;
            source.connect(tempGain);
            tempGain.connect(this.sfxGain);
        } else {
            source.connect(this.sfxGain);
        }

        source.start(0);
    }

    // =========================================================================
    // Ambient 재생 (루프)
    // =========================================================================

    /**
     * 환경음 재생 (루프, 크로스페이드)
     * @param {string} filename - 환경음 파일명
     * @param {number} [fadeIn=2.0] - 페이드인 시간 (초)
     */
    async playAmbient(filename, fadeIn = 2.0) {
        if (!this.ctx) return;
        if (this._currentAmbient === filename) return;

        const path = `assets/audio/bgm/${filename}`; // ambient도 bgm 폴더 내
        const buffer = await this.loadBuffer(path);
        if (!buffer) return;

        const now = this.ctx.currentTime;

        // 기존 환경음 페이드아웃
        if (this.ambSource) {
            this.ambGain.gain.setValueAtTime(this.ambGain.gain.value, now);
            this.ambGain.gain.linearRampToValueAtTime(0, now + 1.0);
            const oldSource = this.ambSource;
            setTimeout(() => this._stopSource(oldSource), 1100);
        }

        this.ambSource = this._createLoopSource(buffer, this.ambGain);
        this.ambGain.gain.setValueAtTime(0, now);
        this.ambGain.gain.linearRampToValueAtTime(this.volumes.ambient, now + fadeIn);
        this.ambSource.start(0);

        this._currentAmbient = filename;
    }

    /**
     * 환경음 정지
     * @param {number} [fadeOut=1.0]
     */
    stopAmbient(fadeOut = 1.0) {
        if (!this.ctx || !this.ambSource) return;
        const now = this.ctx.currentTime;

        this.ambGain.gain.setValueAtTime(this.ambGain.gain.value, now);
        this.ambGain.gain.linearRampToValueAtTime(0, now + fadeOut);

        const oldSource = this.ambSource;
        setTimeout(() => this._stopSource(oldSource), fadeOut * 1000 + 100);
        this.ambSource = null;
        this._currentAmbient = null;
    }

    // =========================================================================
    // 글리치 오디오 연출
    // =========================================================================

    /**
     * BGM 재생 속도 미세 변조 (글리치 위화감)
     * @param {number} [rate=0.97] - 재생 속도 (0.9~1.1)
     * @param {number} [duration=2000] - 지속 시간 (ms)
     */
    distortPlaybackRate(rate = 0.97, duration = 2000) {
        if (!this.ctx) return;

        const source = this._activeSlotA ? this.bgmSourceB : this.bgmSourceA;
        if (!source) return;

        const original = source.playbackRate.value;
        source.playbackRate.setValueAtTime(rate, this.ctx.currentTime);

        setTimeout(() => {
            if (source.playbackRate) {
                source.playbackRate.setValueAtTime(original, this.ctx.currentTime);
            }
        }, duration);
    }

    /**
     * BGM 갑작스러운 정적 (볼륨 0으로 즉시 드롭)
     * @param {number} [duration=3000] - 정적 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    silenceDrop(duration = 3000) {
        if (!this.ctx) return Promise.resolve();

        const now = this.ctx.currentTime;
        const gains = [this.bgmGainA, this.bgmGainB];
        const originals = gains.map(g => g.gain.value);

        // 즉시 0으로
        gains.forEach(g => {
            g.gain.setValueAtTime(0, now);
        });

        return new Promise(resolve => {
            setTimeout(() => {
                const restoreTime = this.ctx.currentTime;
                gains.forEach((g, i) => {
                    g.gain.setValueAtTime(0, restoreTime);
                    g.gain.linearRampToValueAtTime(originals[i], restoreTime + 0.3);
                });
                resolve();
            }, duration);
        });
    }

    /**
     * 로우패스 필터 글리치 (먹먹한 소리)
     * @param {number} [frequency=800] - 컷오프 주파수 (Hz)
     * @param {number} [duration=3000] - 지속 시간 (ms)
     */
    applyLowpassGlitch(frequency = 800, duration = 3000) {
        if (!this.ctx || !this._glitchFilter) return;

        // 현재 BGM gain → glitch filter → masterGain 으로 경로 재연결
        const activeGain = this._activeSlotA ? this.bgmGainB : this.bgmGainA;
        if (!activeGain) return;

        activeGain.disconnect();
        activeGain.connect(this._glitchFilter);

        const now = this.ctx.currentTime;
        this._glitchFilter.frequency.setValueAtTime(frequency, now);

        setTimeout(() => {
            this._glitchFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);
            activeGain.disconnect();
            activeGain.connect(this.masterGain);
        }, duration);
    }

    /**
     * BGM 슬로우다운 (재생 속도 점진적 감소 → 복원)
     * 호러 연출: 시간이 멈추는 느낌
     * @param {number} [targetRate=0.5] - 최저 재생 속도
     * @param {number} [duration=2000] - 전체 지속 시간 (ms)
     */
    slowdown(targetRate = 0.5, duration = 2000) {
        if (!this.ctx) return;

        const source = this._activeSlotA ? this.bgmSourceB : this.bgmSourceA;
        if (!source) return;

        const now = this.ctx.currentTime;
        const half = duration / 2000; // 초 단위

        // 전반: 느려짐
        source.playbackRate.setValueAtTime(1.0, now);
        source.playbackRate.linearRampToValueAtTime(targetRate, now + half);

        // 후반: 복원
        source.playbackRate.linearRampToValueAtTime(1.0, now + half * 2);
    }

    /**
     * 볼륨 펄스 (심장박동 연출)
     * @param {number} [bpm=80] - 분당 박동 수
     * @param {number} [duration=5000] - 지속 시간 (ms)
     * @param {number} [intensity=0.3] - 볼륨 변동 폭 (0~1)
     */
    heartbeatPulse(bpm = 80, duration = 5000, intensity = 0.3) {
        if (!this.ctx) return;

        const interval = 60000 / bpm; // ms per beat
        const beats = Math.floor(duration / interval);
        const activeGain = this._activeSlotA ? this.bgmGainB : this.bgmGainA;
        if (!activeGain) return;

        const baseVol = this.volumes.bgm;
        let beatCount = 0;

        const pulse = () => {
            if (beatCount >= beats) {
                activeGain.gain.setValueAtTime(baseVol, this.ctx.currentTime);
                return;
            }

            const now = this.ctx.currentTime;
            const beatSec = interval / 1000;

            // 강-약-강-약 (심장 두근)
            activeGain.gain.setValueAtTime(baseVol, now);
            activeGain.gain.linearRampToValueAtTime(baseVol + intensity, now + beatSec * 0.1);
            activeGain.gain.linearRampToValueAtTime(baseVol, now + beatSec * 0.3);
            activeGain.gain.linearRampToValueAtTime(baseVol + intensity * 0.6, now + beatSec * 0.4);
            activeGain.gain.linearRampToValueAtTime(baseVol, now + beatSec * 0.7);

            beatCount++;
            setTimeout(pulse, interval);
        };

        pulse();
    }

    // =========================================================================
    // 볼륨 제어
    // =========================================================================

    /**
     * 채널별 볼륨 설정
     * @param {'master'|'bgm'|'sfx'|'ambient'} channel
     * @param {number} value - 0~1
     */
    setVolume(channel, value) {
        value = Math.max(0, Math.min(1, value));
        this.volumes[channel] = value;

        if (!this.ctx) return;

        switch (channel) {
            case 'master':
                this.masterGain.gain.setValueAtTime(value, this.ctx.currentTime);
                break;
            case 'bgm':
                // 활성 슬롯만 볼륨 갱신
                if (this._activeSlotA) {
                    if (this.bgmSourceB) this.bgmGainB.gain.setValueAtTime(value, this.ctx.currentTime);
                } else {
                    if (this.bgmSourceA) this.bgmGainA.gain.setValueAtTime(value, this.ctx.currentTime);
                }
                break;
            case 'sfx':
                this.sfxGain.gain.setValueAtTime(value, this.ctx.currentTime);
                break;
            case 'ambient':
                this.ambGain.gain.setValueAtTime(value, this.ctx.currentTime);
                break;
        }
    }

    /**
     * 전체 음소거 / 해제
     * @param {boolean} muted
     */
    setMute(muted) {
        if (!this.ctx) return;
        this.masterGain.gain.setValueAtTime(muted ? 0 : this.volumes.master, this.ctx.currentTime);
    }

    // =========================================================================
    // 유틸리티
    // =========================================================================

    /**
     * 루프 소스 노드 생성
     * @private
     */
    _createLoopSource(buffer, destination) {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(destination);
        return source;
    }

    /**
     * 소스 노드 안전하게 정지
     * @private
     */
    _stopSource(source) {
        if (!source) return;
        try {
            source.stop();
            source.disconnect();
        } catch {
            // 이미 정지된 소스
        }
    }

    /**
     * 현재 BGM 파일명 반환
     * @returns {string|null}
     */
    getCurrentBGM() {
        return this._currentBGM;
    }

    /**
     * 전체 오디오 정리 (페이지 이탈 시)
     */
    dispose() {
        this.stopBGM(0);
        this.stopAmbient(0);
        this._bufferCache.clear();
        if (this.ctx) {
            this.ctx.close().catch(() => {});
            this.ctx = null;
        }
    }
}
