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

        // 합성 SFX 레지스트리 초기화
        this.initSynthSFX();
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
     * 효과음 재생 (중복 허용)
     * 합성 SFX가 등록되어 있으면 Web Audio API로 합성, 없으면 파일 로드
     * @param {string} filename - SFX 파일명 (예: 'affinity_up.mp3')
     * @param {object} [options]
     * @param {number} [options.volume=1.0] - 상대 볼륨 (0~1, sfxGain에 곱해짐)
     * @param {number} [options.playbackRate=1.0] - 재생 속도
     */
    async playSFX(filename, options = {}) {
        if (!this.ctx) return;

        // 합성 SFX 매핑 확인
        const synthKey = filename.replace(/\.[^.]+$/, ''); // 확장자 제거
        if (this._synthRegistry && this._synthRegistry[synthKey]) {
            this._synthRegistry[synthKey](options);
            return;
        }

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

    // =========================================================================
    // 바이노럴/스테레오 오디오 (SCENARIO.md 5174-5185)
    // =========================================================================

    /**
     * 이어폰/스테레오 출력 감지
     * Web Audio API의 출력 채널 수로 판별
     *
     * @returns {Promise<boolean>} true: 스테레오(이어폰 가능), false: 모노
     */
    async detectStereoOutput() {
        if (!this.ctx) return false;

        try {
            // AudioContext destination의 채널 수로 판별
            const channelCount = this.ctx.destination.channelCount;
            // mediaDevices로 출력 장치 확인 (가능한 경우)
            if (navigator.mediaDevices?.enumerateDevices) {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
                // 이어폰/헤드셋이 있으면 스테레오로 간주
                const hasHeadphones = audioOutputs.some(d =>
                    d.label.toLowerCase().includes('headphone') ||
                    d.label.toLowerCase().includes('earphone') ||
                    d.label.toLowerCase().includes('headset') ||
                    d.label.toLowerCase().includes('airpod') ||
                    d.label.toLowerCase().includes('buds')
                );
                if (hasHeadphones) return true;
            }
            return channelCount >= 2;
        } catch {
            return false;
        }
    }

    /**
     * 바이노럴 모드 활성화 — 설화 목소리를 왼쪽 채널로 패닝
     * StereoPannerNode를 SFX 체인에 삽입
     */
    enableBinauralMode() {
        if (!this.ctx) return;
        if (this._binauralPanner) return; // 이미 활성

        this._binauralPanner = this.ctx.createStereoPanner();
        this._binauralPanner.pan.value = -1; // 완전 왼쪽
        this._binauralPanner.connect(this.masterGain);

        this._binauralActive = true;
    }

    /**
     * 바이노럴 패닝으로 SFX 재생 (설화 전용)
     * @param {string} filename - SFX 파일명
     * @param {number} [pan=-1] - 패닝 값 (-1: 왼쪽, 0: 중앙, 1: 오른쪽)
     */
    async playSFXPanned(filename, pan = -1) {
        if (!this.ctx) return;

        const synthKey = filename.replace(/\.[^.]+$/, '');
        if (this._synthRegistry && this._synthRegistry[synthKey]) {
            // 합성 SFX에 패닝 적용
            const panner = this.ctx.createStereoPanner();
            panner.pan.value = pan;
            panner.connect(this.masterGain);
            // 합성 함수에 destination 전달은 미지원이므로 기본 호출
            this._synthRegistry[synthKey]({});
            return;
        }

        const path = `assets/audio/sfx/${filename}`;
        const buffer = await this.loadBuffer(path);
        if (!buffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const panner = this.ctx.createStereoPanner();
        panner.pan.value = pan;

        const gain = this.ctx.createGain();
        gain.gain.value = this.volumes.sfx;

        source.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
        source.start(0);
    }

    /**
     * 바이노럴 모드 비활성화
     */
    disableBinauralMode() {
        if (this._binauralPanner) {
            try { this._binauralPanner.disconnect(); } catch { /* ok */ }
            this._binauralPanner = null;
        }
        this._binauralActive = false;
    }

    /**
     * 바이노럴 모드 활성 여부
     * @returns {boolean}
     */
    isBinauralActive() {
        return !!this._binauralActive;
    }

    // =========================================================================
    // 전체 페이드아웃
    // =========================================================================

    /**
     * 모든 오디오를 페이드아웃
     * @param {number} [durationMs=2000] - 페이드아웃 시간 (ms)
     */
    fadeOutAll(durationMs = 2000) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const sec = durationMs / 1000;

        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(0, now + sec);
        }

        // 페이드 완료 후 마스터 볼륨 복구
        setTimeout(() => {
            if (this.masterGain) {
                this.masterGain.gain.setValueAtTime(this.volumes.master, this.ctx.currentTime);
            }
        }, durationMs + 100);
    }

    // =========================================================================
    // 내부 헬퍼
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

    // =========================================================================
    // SFX 합성 (Web Audio API)
    // =========================================================================

    /**
     * 합성 SFX 레지스트리 초기화
     * init() 이후 호출 가능
     */
    initSynthSFX() {
        if (!this.ctx) return;

        this._synthRegistry = {
            'sfx_school_bell':       (o) => this._synthSchoolBell(o),
            'sfx_door_open':         (o) => this._synthDoorOpen(o),
            'sfx_door_slam':         (o) => this._synthDoorSlam(o),
            'sfx_footsteps':         (o) => this._synthFootsteps(o),
            'sfx_footsteps_running': (o) => this._synthFootstepsRunning(o),
            'sfx_heartbeat':         (o) => this._synthHeartbeat(o),
            'sfx_heartbeat_fast':    (o) => this._synthHeartbeatFast(o),
            'sfx_glass_break':       (o) => this._synthGlassBreak(o),
            'sfx_thunder':           (o) => this._synthThunder(o),
            'sfx_rain_loop':         (o) => this._synthRainLoop(o),
            'sfx_wind':              (o) => this._synthWind(o),
            'sfx_clock_tick':        (o) => this._synthClockTick(o),
            'sfx_phone_vibrate':     (o) => this._synthPhoneVibrate(o),
            'sfx_knock':             (o) => this._synthKnock(o),
            'sfx_static':            (o) => this._synthStatic(o),
            'sfx_whisper':           (o) => this._synthWhisper(o),
            'sfx_camera_shutter':    (o) => this._synthCameraShutter(o),
            'sfx_scream':            (o) => this._synthScream(o),
            'sfx_notification':      (o) => this._synthNotification(o),
            'sfx_page_turn':         (o) => this._synthPageTurn(o),
            'affinity_up':           (o) => this._synthAffinityUp(o),
            'affinity_down':         (o) => this._synthAffinityDown(o),
        };
    }

    /**
     * 합성 SFX용 gain 노드 생성 헬퍼
     * @private
     * @param {number} [volume=1.0]
     * @returns {GainNode}
     */
    _createSFXGain(volume = 1.0) {
        const gain = this.ctx.createGain();
        gain.gain.value = volume;
        gain.connect(this.sfxGain);
        return gain;
    }

    /**
     * 노이즈 버퍼 생성 헬퍼
     * @private
     * @param {number} duration - 초
     * @returns {AudioBuffer}
     */
    _createNoiseBuffer(duration) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    /**
     * 학교 차임벨 — 4음 멜로디 (솔-미-라-레)
     * @private
     */
    _synthSchoolBell(options = {}) {
        const vol = options.volume || 0.5;
        const now = this.ctx.currentTime;
        const notes = [784, 659, 880, 587]; // G5, E5, A5, D5
        const noteDur = 0.6;

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this._createSFXGain(0);
            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.connect(gain);

            const t = now + i * noteDur;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + noteDur - 0.05);

            osc.start(t);
            osc.stop(t + noteDur);
        });
    }

    /**
     * 문 열림 — 경첩 삐걱 + 공기 이동
     * @private
     */
    _synthDoorOpen(options = {}) {
        const vol = options.volume || 0.4;
        const now = this.ctx.currentTime;
        const gain = this._createSFXGain(vol);

        // 삐걱거리는 경첩 (낮은 주파수 스윕)
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.8);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 200;
        filter.Q.value = 5;

        osc.connect(filter);
        filter.connect(gain);

        gain.gain.setValueAtTime(vol * 0.6, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.start(now);
        osc.stop(now + 0.9);

        // 공기 이동 (노이즈)
        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(0.5);
        const nGain = this._createSFXGain(0);
        const lpf = this.ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 500;
        noise.connect(lpf);
        lpf.connect(nGain);
        nGain.gain.setValueAtTime(0, now + 0.3);
        nGain.gain.linearRampToValueAtTime(vol * 0.2, now + 0.5);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        noise.start(now + 0.3);
        noise.stop(now + 1.0);
    }

    /**
     * 문 쾅 닫힘 — 강한 충격음 + 금속 잔향
     * @private
     */
    _synthDoorSlam(options = {}) {
        const vol = options.volume || 0.7;
        const now = this.ctx.currentTime;

        // 충격음 (노이즈 버스트)
        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(0.3);
        const nGain = this._createSFXGain(vol);
        const hpf = this.ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 100;
        noise.connect(hpf);
        hpf.connect(nGain);
        nGain.gain.setValueAtTime(vol, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.start(now);
        noise.stop(now + 0.3);

        // 금속 울림
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 150;
        const mGain = this._createSFXGain(0);
        osc.connect(mGain);
        mGain.gain.setValueAtTime(vol * 0.5, now);
        mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }

    /**
     * 걷는 발소리 — 4~5걸음, 규칙적
     * @private
     */
    _synthFootsteps(options = {}) {
        const vol = options.volume || 0.35;
        const now = this.ctx.currentTime;
        const steps = 5;
        const interval = 0.5; // 걸음 간격

        for (let i = 0; i < steps; i++) {
            const t = now + i * interval;
            const noise = this.ctx.createBufferSource();
            noise.buffer = this._createNoiseBuffer(0.1);
            const gain = this._createSFXGain(0);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800 + Math.random() * 200;
            filter.Q.value = 2;
            noise.connect(filter);
            filter.connect(gain);

            gain.gain.setValueAtTime(vol * (0.8 + Math.random() * 0.2), t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            noise.start(t);
            noise.stop(t + 0.1);
        }
    }

    /**
     * 달리는 발소리 — 빠르고 다급한
     * @private
     */
    _synthFootstepsRunning(options = {}) {
        const vol = options.volume || 0.45;
        const now = this.ctx.currentTime;
        const steps = 10;
        const interval = 0.2;

        for (let i = 0; i < steps; i++) {
            const t = now + i * interval;
            const noise = this.ctx.createBufferSource();
            noise.buffer = this._createNoiseBuffer(0.08);
            const gain = this._createSFXGain(0);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000 + Math.random() * 400;
            filter.Q.value = 3;
            noise.connect(filter);
            filter.connect(gain);

            const v = vol * (0.6 + Math.random() * 0.4);
            gain.gain.setValueAtTime(v, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            noise.start(t);
            noise.stop(t + 0.08);
        }
    }

    /**
     * 심장박동 — 차분한 두근두근 3~4회
     * @private
     */
    _synthHeartbeat(options = {}) {
        const vol = options.volume || 0.5;
        const now = this.ctx.currentTime;
        const beats = 4;
        const interval = 0.8;

        for (let i = 0; i < beats; i++) {
            const t = now + i * interval;

            // 첫번째 박동 (강)
            const osc1 = this.ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.value = 50;
            const g1 = this._createSFXGain(0);
            osc1.connect(g1);
            g1.gain.setValueAtTime(0, t);
            g1.gain.linearRampToValueAtTime(vol, t + 0.02);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc1.start(t);
            osc1.stop(t + 0.15);

            // 두번째 박동 (약)
            const osc2 = this.ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 45;
            const g2 = this._createSFXGain(0);
            osc2.connect(g2);
            g2.gain.setValueAtTime(0, t + 0.2);
            g2.gain.linearRampToValueAtTime(vol * 0.6, t + 0.22);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            osc2.start(t + 0.2);
            osc2.stop(t + 0.35);
        }
    }

    /**
     * 빠른 심장박동 — 공포/패닉 5~6회
     * @private
     */
    _synthHeartbeatFast(options = {}) {
        const vol = options.volume || 0.6;
        const now = this.ctx.currentTime;
        const beats = 6;
        const baseInterval = 0.5;

        for (let i = 0; i < beats; i++) {
            // 점점 빨라짐
            const interval = baseInterval - (i * 0.04);
            const t = now + i * interval;

            const osc1 = this.ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.value = 55;
            const g1 = this._createSFXGain(0);
            osc1.connect(g1);
            g1.gain.setValueAtTime(0, t);
            g1.gain.linearRampToValueAtTime(vol * (1 + i * 0.05), t + 0.015);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc1.start(t);
            osc1.stop(t + 0.1);

            const osc2 = this.ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 50;
            const g2 = this._createSFXGain(0);
            osc2.connect(g2);
            g2.gain.setValueAtTime(0, t + 0.12);
            g2.gain.linearRampToValueAtTime(vol * 0.7, t + 0.135);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc2.start(t + 0.12);
            osc2.stop(t + 0.22);
        }
    }

    /**
     * 유리 깨짐 — 파열음 + 파편 산란
     * @private
     */
    _synthGlassBreak(options = {}) {
        const vol = options.volume || 0.6;
        const now = this.ctx.currentTime;

        // 파열 충격 (노이즈 버스트)
        const burst = this.ctx.createBufferSource();
        burst.buffer = this._createNoiseBuffer(0.15);
        const bGain = this._createSFXGain(vol);
        const hpf = this.ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 2000;
        burst.connect(hpf);
        hpf.connect(bGain);
        bGain.gain.setValueAtTime(vol, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        burst.start(now);
        burst.stop(now + 0.15);

        // 파편 (고주파 작은 노이즈들)
        for (let i = 0; i < 8; i++) {
            const t = now + 0.05 + Math.random() * 0.4;
            const shard = this.ctx.createOscillator();
            shard.type = 'sine';
            shard.frequency.value = 3000 + Math.random() * 5000;
            const sGain = this._createSFXGain(0);
            shard.connect(sGain);
            const v = vol * (0.1 + Math.random() * 0.2);
            sGain.gain.setValueAtTime(v, t);
            sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03 + Math.random() * 0.05);
            shard.start(t);
            shard.stop(t + 0.1);
        }
    }

    /**
     * 천둥 — 깊은 럼블 + 잔향
     * @private
     */
    _synthThunder(options = {}) {
        const vol = options.volume || 0.7;
        const now = this.ctx.currentTime;

        // 저주파 럼블
        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(3.0);
        const lpf = this.ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 200;
        const gain = this._createSFXGain(0);
        noise.connect(lpf);
        lpf.connect(gain);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.1);
        gain.gain.setValueAtTime(vol * 0.8, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        noise.start(now);
        noise.stop(now + 2.5);

        // 크랙 (순간 밝은 소리)
        const crack = this.ctx.createBufferSource();
        crack.buffer = this._createNoiseBuffer(0.1);
        const cGain = this._createSFXGain(0);
        const bpf = this.ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 1500;
        bpf.Q.value = 1;
        crack.connect(bpf);
        bpf.connect(cGain);
        cGain.gain.setValueAtTime(vol * 0.8, now);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        crack.start(now);
        crack.stop(now + 0.1);
    }

    /**
     * 빗소리 루프 — 약 4초 동안 재생 (원샷, 루프 아님)
     * @private
     */
    _synthRainLoop(options = {}) {
        const vol = options.volume || 0.3;
        const now = this.ctx.currentTime;
        const duration = 4.0;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(duration);
        const lpf = this.ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 3000;
        const gain = this._createSFXGain(0);
        noise.connect(lpf);
        lpf.connect(gain);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.5);
        gain.gain.setValueAtTime(vol, now + duration - 0.8);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        noise.start(now);
        noise.stop(now + duration);

        // 간헐적 빗방울 (높은 틱)
        for (let i = 0; i < 15; i++) {
            const t = now + Math.random() * (duration - 0.5);
            const drop = this.ctx.createOscillator();
            drop.type = 'sine';
            drop.frequency.value = 4000 + Math.random() * 4000;
            const dGain = this._createSFXGain(0);
            drop.connect(dGain);
            dGain.gain.setValueAtTime(vol * (0.05 + Math.random() * 0.1), t);
            dGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01 + Math.random() * 0.02);
            drop.start(t);
            drop.stop(t + 0.05);
        }
    }

    /**
     * 바람 — 옥상에서 부는 강한 바람
     * @private
     */
    _synthWind(options = {}) {
        const vol = options.volume || 0.35;
        const now = this.ctx.currentTime;
        const duration = 3.0;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(duration);
        const bpf = this.ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 400;
        bpf.Q.value = 0.5;
        const gain = this._createSFXGain(0);
        noise.connect(bpf);
        bpf.connect(gain);

        // 돌풍 느낌: 파도처럼 볼륨 변동
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol * 0.5, now + 0.3);
        gain.gain.linearRampToValueAtTime(vol, now + 0.8);
        gain.gain.linearRampToValueAtTime(vol * 0.4, now + 1.5);
        gain.gain.linearRampToValueAtTime(vol * 0.9, now + 2.0);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        // 주파수도 변동
        bpf.frequency.setValueAtTime(400, now);
        bpf.frequency.linearRampToValueAtTime(800, now + 0.8);
        bpf.frequency.linearRampToValueAtTime(300, now + 1.5);
        bpf.frequency.linearRampToValueAtTime(600, now + 2.0);
        bpf.frequency.linearRampToValueAtTime(200, now + duration);

        noise.start(now);
        noise.stop(now + duration);
    }

    /**
     * 시계 초침 — 째깍째깍 4~5초
     * @private
     */
    _synthClockTick(options = {}) {
        const vol = options.volume || 0.3;
        const now = this.ctx.currentTime;
        const ticks = 5;

        for (let i = 0; i < ticks; i++) {
            const t = now + i * 1.0;

            // 째깍 (매우 짧은 클릭)
            const osc = this.ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.value = 1800;
            const gain = this._createSFXGain(0);
            osc.connect(gain);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
            osc.start(t);
            osc.stop(t + 0.02);
        }
    }

    /**
     * 스마트폰 진동 — 짧은 진동 2회
     * @private
     */
    _synthPhoneVibrate(options = {}) {
        const vol = options.volume || 0.3;
        const now = this.ctx.currentTime;

        for (let i = 0; i < 2; i++) {
            const t = now + i * 0.4;
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 150;
            const gain = this._createSFXGain(0);
            const lpf = this.ctx.createBiquadFilter();
            lpf.type = 'lowpass';
            lpf.frequency.value = 300;
            osc.connect(lpf);
            lpf.connect(gain);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.02);
            gain.gain.setValueAtTime(vol, t + 0.15);
            gain.gain.linearRampToValueAtTime(0, t + 0.2);

            osc.start(t);
            osc.stop(t + 0.2);
        }
    }

    /**
     * 노크 — 나무 문에 똑똑똑 3회
     * @private
     */
    _synthKnock(options = {}) {
        const vol = options.volume || 0.5;
        const now = this.ctx.currentTime;
        const knocks = [0, 0.25, 0.5]; // 3회 타이밍

        knocks.forEach((offset) => {
            const t = now + offset;

            // 충격음 (짧은 노이즈)
            const noise = this.ctx.createBufferSource();
            noise.buffer = this._createNoiseBuffer(0.05);
            const bpf = this.ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.value = 600;
            bpf.Q.value = 3;
            const gain = this._createSFXGain(0);
            noise.connect(bpf);
            bpf.connect(gain);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            noise.start(t);
            noise.stop(t + 0.06);

            // 나무 울림 (저주파 감쇠)
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 200 + Math.random() * 30;
            const rGain = this._createSFXGain(0);
            osc.connect(rGain);
            rGain.gain.setValueAtTime(vol * 0.4, t);
            rGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc.start(t);
            osc.stop(t + 0.12);
        });
    }

    /**
     * 정적/글리치 노이즈 — 지지직 전자 잡음
     * @private
     */
    _synthStatic(options = {}) {
        const vol = options.volume || 0.4;
        const now = this.ctx.currentTime;
        const duration = 0.8;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(duration);
        const gain = this._createSFXGain(0);

        // 비트크러셔 효과 (bandpass로 근사)
        const bpf = this.ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 3000;
        bpf.Q.value = 0.5;
        noise.connect(bpf);
        bpf.connect(gain);

        // 간헐적 버스트 (글리치)
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(vol, now + 0.01);
        gain.gain.setValueAtTime(vol * 0.3, now + 0.1);
        gain.gain.setValueAtTime(vol * 0.9, now + 0.15);
        gain.gain.setValueAtTime(vol * 0.1, now + 0.3);
        gain.gain.setValueAtTime(vol * 0.8, now + 0.35);
        gain.gain.setValueAtTime(vol * 0.2, now + 0.5);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        noise.start(now);
        noise.stop(now + duration);
    }

    /**
     * 속삭임 — 알아들을 수 없는 필터드 노이즈
     * @private
     */
    _synthWhisper(options = {}) {
        const vol = options.volume || 0.25;
        const now = this.ctx.currentTime;
        const duration = 2.0;

        // 여러 레이어의 필터드 노이즈로 속삭임 근사
        for (let layer = 0; layer < 3; layer++) {
            const noise = this.ctx.createBufferSource();
            noise.buffer = this._createNoiseBuffer(duration);
            const bpf = this.ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.value = 1500 + layer * 800;
            bpf.Q.value = 8;
            const gain = this._createSFXGain(0);
            noise.connect(bpf);
            bpf.connect(gain);

            // 리듬감 있는 볼륨 변동 (말하는 듯한)
            const segments = 6;
            for (let s = 0; s < segments; s++) {
                const st = now + (s / segments) * duration + layer * 0.05;
                const v = vol * (0.1 + Math.random() * 0.3);
                gain.gain.setValueAtTime(v, st);
                gain.gain.linearRampToValueAtTime(vol * 0.02, st + duration / segments * 0.7);
            }
            gain.gain.linearRampToValueAtTime(0, now + duration);

            noise.start(now);
            noise.stop(now + duration);
        }
    }

    /**
     * 카메라 셔터 — 기계식 찰칵
     * @private
     */
    _synthCameraShutter(options = {}) {
        const vol = options.volume || 0.5;
        const now = this.ctx.currentTime;

        // 셔터 열림 (날카로운 클릭)
        const click1 = this.ctx.createBufferSource();
        click1.buffer = this._createNoiseBuffer(0.02);
        const hpf1 = this.ctx.createBiquadFilter();
        hpf1.type = 'highpass';
        hpf1.frequency.value = 3000;
        const g1 = this._createSFXGain(vol);
        click1.connect(hpf1);
        hpf1.connect(g1);
        g1.gain.setValueAtTime(vol, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        click1.start(now);
        click1.stop(now + 0.03);

        // 미러 업 (약간 더 긴 두번째 클릭)
        const click2 = this.ctx.createBufferSource();
        click2.buffer = this._createNoiseBuffer(0.03);
        const hpf2 = this.ctx.createBiquadFilter();
        hpf2.type = 'highpass';
        hpf2.frequency.value = 2000;
        const g2 = this._createSFXGain(0);
        click2.connect(hpf2);
        hpf2.connect(g2);
        g2.gain.setValueAtTime(vol * 0.7, now + 0.08);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        click2.start(now + 0.08);
        click2.stop(now + 0.13);
    }

    /**
     * 비명 — 짧고 날카로운 합성 (고주파 톤 스윕)
     * @private
     */
    _synthScream(options = {}) {
        const vol = options.volume || 0.5;
        const now = this.ctx.currentTime;

        // 메인 톤 (고주파 스윕)
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.15);
        osc.frequency.linearRampToValueAtTime(600, now + 0.6);

        const gain = this._createSFXGain(0);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 2;
        osc.connect(filter);
        filter.connect(gain);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.03);
        gain.gain.setValueAtTime(vol * 0.8, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.start(now);
        osc.stop(now + 0.6);

        // 잔향 (노이즈 테일)
        const reverb = this.ctx.createBufferSource();
        reverb.buffer = this._createNoiseBuffer(0.5);
        const rGain = this._createSFXGain(0);
        const lpf = this.ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 2000;
        reverb.connect(lpf);
        lpf.connect(rGain);
        rGain.gain.setValueAtTime(vol * 0.15, now + 0.1);
        rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        reverb.start(now + 0.1);
        reverb.stop(now + 0.8);
    }

    /**
     * 알림음 — 짧고 귀여운 전자음 띠링
     * @private
     */
    _synthNotification(options = {}) {
        const vol = options.volume || 0.4;
        const now = this.ctx.currentTime;

        // 2음 상승 (띠-링)
        const freqs = [880, 1320]; // A5 → E6
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const gain = this._createSFXGain(0);
            osc.connect(gain);

            const t = now + i * 0.12;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.start(t);
            osc.stop(t + 0.2);
        });
    }

    /**
     * 책 페이지 넘김 — 부드러운 종이 마찰음
     * @private
     */
    _synthPageTurn(options = {}) {
        const vol = options.volume || 0.25;
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(0.3);
        const bpf = this.ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 5000;
        bpf.Q.value = 1;
        const gain = this._createSFXGain(0);
        noise.connect(bpf);
        bpf.connect(gain);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        // 주파수 스윕 (페이지가 넘어가는 느낌)
        bpf.frequency.setValueAtTime(5000, now);
        bpf.frequency.linearRampToValueAtTime(8000, now + 0.1);
        bpf.frequency.linearRampToValueAtTime(3000, now + 0.25);

        noise.start(now);
        noise.stop(now + 0.3);
    }

    // =========================================================================
    // 호감도 변화 SFX (Cupid 스타일 합성)
    // =========================================================================

    /**
     * 호감도 증가 — 밝고 따뜻한 상승 글로켄슈필 + 하모닉스 + 스파클
     * 레이어 1: 3음 상승 아르페지오 (C6-E6-G6, 사인파 + 약간의 삼각파)
     * 레이어 2: 옥타브 위 하모닉스 스파클 (미세한 고주파 사인파)
     * 레이어 3: 소프트 노이즈 셔머 (공기감)
     * @private
     */
    _synthAffinityUp(options = {}) {
        const vol = options.volume || 0.45;
        const now = this.ctx.currentTime;

        // 레이어 1: 3음 상승 아르페지오 (C6, E6, G6)
        const notes = [1047, 1319, 1568];
        const noteDur = 0.18;

        notes.forEach((freq, i) => {
            const t = now + i * 0.1;

            // 메인 사인파 (글로켄슈필)
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const gain = this._createSFXGain(0);
            osc.connect(gain);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol * (0.6 + i * 0.15), t + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.1);
            osc.start(t);
            osc.stop(t + noteDur + 0.12);

            // 삼각파 서브하모닉 (따뜻함)
            const sub = this.ctx.createOscillator();
            sub.type = 'triangle';
            sub.frequency.value = freq * 0.5;
            const sGain = this._createSFXGain(0);
            sub.connect(sGain);
            sGain.gain.setValueAtTime(0, t);
            sGain.gain.linearRampToValueAtTime(vol * 0.15, t + 0.01);
            sGain.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.05);
            sub.start(t);
            sub.stop(t + noteDur + 0.07);
        });

        // 레이어 2: 옥타브 위 스파클 (하모닉스)
        const sparkles = [2093, 2637, 3136]; // C7, E7, G7
        sparkles.forEach((freq, i) => {
            const t = now + i * 0.1 + 0.03;
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const gain = this._createSFXGain(0);
            osc.connect(gain);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol * 0.08, t + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc.start(t);
            osc.stop(t + 0.14);
        });

        // 레이어 3: 소프트 노이즈 셔머 (공기감)
        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(0.25);
        const nGain = this._createSFXGain(0);
        const hpf = this.ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 6000;
        noise.connect(hpf);
        hpf.connect(nGain);
        nGain.gain.setValueAtTime(0, now);
        nGain.gain.linearRampToValueAtTime(vol * 0.04, now + 0.05);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.start(now);
        noise.stop(now + 0.32);
    }

    /**
     * 호감도 감소 — 어둡고 짧은 하강 톤 + 불협화 + 먹먹한 테일
     * 레이어 1: 2음 하강 (E4-C4, 사인파 디튠)
     * 레이어 2: 불협화 간섭 (미세 디튠 사인파)
     * 레이어 3: 로우패스 노이즈 테일 (먹먹한 울림)
     * @private
     */
    _synthAffinityDown(options = {}) {
        const vol = options.volume || 0.4;
        const now = this.ctx.currentTime;

        // 레이어 1: 2음 하강 (E4 → C4)
        const notes = [330, 262];
        notes.forEach((freq, i) => {
            const t = now + i * 0.12;
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const gain = this._createSFXGain(0);
            osc.connect(gain);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol * 0.55, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.start(t);
            osc.stop(t + 0.27);

            // 디튠 복제 (불안정감)
            const detune = this.ctx.createOscillator();
            detune.type = 'sine';
            detune.frequency.value = freq * 1.015; // 미세 디튠
            const dGain = this._createSFXGain(0);
            detune.connect(dGain);
            dGain.gain.setValueAtTime(0, t);
            dGain.gain.linearRampToValueAtTime(vol * 0.2, t + 0.015);
            dGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            detune.start(t);
            detune.stop(t + 0.22);
        });

        // 레이어 2: 불협화 간섭 (Eb4 — 반음 아래)
        const dissonant = this.ctx.createOscillator();
        dissonant.type = 'triangle';
        dissonant.frequency.value = 311; // Eb4
        const disGain = this._createSFXGain(0);
        dissonant.connect(disGain);
        disGain.gain.setValueAtTime(0, now + 0.05);
        disGain.gain.linearRampToValueAtTime(vol * 0.12, now + 0.07);
        disGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        dissonant.start(now + 0.05);
        dissonant.stop(now + 0.32);

        // 레이어 3: 로우패스 노이즈 테일
        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(0.3);
        const lpf = this.ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 800;
        const nGain = this._createSFXGain(0);
        noise.connect(lpf);
        lpf.connect(nGain);
        nGain.gain.setValueAtTime(0, now + 0.1);
        nGain.gain.linearRampToValueAtTime(vol * 0.08, now + 0.15);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        noise.start(now + 0.1);
        noise.stop(now + 0.42);
    }

    // =========================================================================
    // UI 효과음 (버튼 클릭/호버)
    // =========================================================================

    /**
     * UI 클릭음 — 짧고 깔끔한 멀티레이어 클릭
     * 레이어 1: 고주파 사인파 짧은 틱 (2000~3000Hz, 30ms)
     * 레이어 2: 살짝 낮은 사인파로 따뜻한 느낌 (800~1000Hz, 50ms)
     * 레이어 3: 아주 미세한 노이즈 텍스처 (20ms)
     */
    playUIClick() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const vol = 0.25;

        // 레이어 1: 고주파 틱 (2500Hz, 30ms)
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 2500;
        const g1 = this._createSFXGain(0);
        osc1.connect(g1);
        g1.gain.setValueAtTime(0, now);
        g1.gain.linearRampToValueAtTime(vol * 0.7, now + 0.003);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc1.start(now);
        osc1.stop(now + 0.035);

        // 레이어 2: 따뜻한 중저주파 (900Hz, 50ms)
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 900;
        const g2 = this._createSFXGain(0);
        osc2.connect(g2);
        g2.gain.setValueAtTime(0, now);
        g2.gain.linearRampToValueAtTime(vol * 0.4, now + 0.005);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc2.start(now);
        osc2.stop(now + 0.055);

        // 레이어 3: 미세 노이즈 텍스처 (20ms)
        const noise = this.ctx.createBufferSource();
        noise.buffer = this._createNoiseBuffer(0.02);
        const nGain = this._createSFXGain(0);
        const hpf = this.ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 4000;
        noise.connect(hpf);
        hpf.connect(nGain);
        nGain.gain.setValueAtTime(vol * 0.08, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        noise.start(now);
        noise.stop(now + 0.025);
    }

    /**
     * UI 호버음 — 더 미세한 소프트 틱
     */
    playUIHover() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const vol = 0.1;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 3200;
        const g = this._createSFXGain(0);
        osc.connect(g);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(vol, now + 0.002);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        osc.start(now);
        osc.stop(now + 0.02);
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
