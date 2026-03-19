/**
 * ============================================================================
 * BGMSynth.js - Procedural BGM Synthesis Engine
 * ============================================================================
 *
 * Web Audio API OfflineAudioContext를 사용하여 모든 BGM을 프로시저럴 합성.
 * 외부 오디오 파일 없이 브라우저에서 직접 생성.
 *
 * [통합 방식]
 * AudioManager.loadBuffer()에서 파일 fetch 전에 synth registry를 확인.
 * 등록된 BGM 키가 있으면 OfflineAudioContext로 렌더링하여 AudioBuffer 반환.
 * 기존 크로스페이드/글리치/볼륨 시스템과 100% 호환.
 */

class BGMSynth {
    constructor() {
        this._registry = {};
    }

    /**
     * AudioManager에 BGM 합성 레지스트리 등록
     */
    init(audioManager) {
        audioManager._bgmSynthRegistry = this._registry;
        this._registerAll();
    }

    _registerAll() {
        // ── 로맨스 페이즈 (Day 1-2) ──
        this._registry['spring_bright']    = () => this._spring_bright();
        this._registry['morning_bright']   = () => this._morning_bright();
        this._registry['daily_bright']     = () => this._daily_bright();
        this._registry['sunset_warm']      = () => this._sunset_warm();
        this._registry['night_calm']       = () => this._night_calm();
        this._registry['morning_peaceful'] = () => this._morning_peaceful();
        this._registry['sea_theme']        = () => this._sea_theme();
        this._registry['riin_theme']       = () => this._riin_theme();
        this._registry['eunsu_theme']      = () => this._eunsu_theme();

        // ── 스릴러 페이즈 (Day 3-5) ──
        this._registry['morning_uneasy']   = () => this._morning_uneasy();
        this._registry['daily_tense']      = () => this._daily_tense();
        this._registry['tension']          = () => this._tension();
        this._registry['night_ambient']    = () => this._night_ambient();
        this._registry['night_tension']    = () => this._night_tension();
        this._registry['nightmare']        = () => this._nightmare();
        this._registry['thriller_ambient'] = () => this._thriller_ambient();
        this._registry['horror_ambient']   = () => this._horror_ambient();
        this._registry['chase']            = () => this._chase();
        this._registry['chase_intense']    = () => this._chase_intense();
        this._registry['climax']           = () => this._climax();
        this._registry['eunsu_dark_theme'] = () => this._eunsu_dark_theme();

        // ── 시나리오 추가 BGM ──
        this._registry['yuna_theme']           = () => this._yuna_theme();
        this._registry['tension_low']          = () => this._tension_low();
        this._registry['dread']                = () => this._dread();
        this._registry['wind_ambient']         = () => this._wind_ambient();
        this._registry['sea_obsession']        = () => this._sea_obsession();
        this._registry['tension_night']        = () => this._tension_night();
        this._registry['heartbeat_loop']       = () => this._heartbeat_loop();
        this._registry['silence_tension']      = () => this._silence_tension();
        this._registry['music_box_broken']     = () => this._music_box_broken();
        this._registry['seolhwa_theme_broken'] = () => this._seolhwa_theme_broken();
        this._registry['confrontation']        = () => this._confrontation();

        // ── 엔딩 ──
        this._registry['ending_hope']        = () => this._ending_hope();
        this._registry['ending_melancholy']  = () => this._ending_melancholy();
        this._registry['ending_bittersweet'] = () => this._ending_bittersweet();
        this._registry['ending_dark']        = () => this._ending_dark();
        this._registry['ending_ghost']       = () => this._ending_ghost();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 유틸리티
    // ═════════════════════════════════════════════════════════════════════════

    /** 음이름 → 주파수 (예: 'C4' → 261.63, 'F#3' → 185.00) */
    _f(note) {
        const names = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
        let i = 1, semi = names[note[0]];
        if (note[i] === '#') { semi++; i++; }
        else if (note[i] === 'b') { semi--; i++; }
        const oct = parseInt(note.slice(i));
        return 440 * Math.pow(2, (semi + (oct + 1) * 12 - 69) / 12);
    }

    /** OfflineAudioContext 생성 */
    _offline(duration, sr = 44100) {
        return new OfflineAudioContext(2, Math.ceil(sr * duration), sr);
    }

    /** 화이트 노이즈 버퍼 */
    _noise(ctx, duration) {
        const len = Math.ceil(ctx.sampleRate * duration);
        const buf = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const d = buf.getChannelData(ch);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        }
        return buf;
    }

    /** 고급 임펄스 응답 생성 (리버브용) — 초기 반사 + 확산 테일 + 모달 공명 */
    _impulse(ctx, duration = 2, decay = 2) {
        const sr = ctx.sampleRate;
        const len = Math.ceil(sr * duration);
        const buf = ctx.createBuffer(2, len, sr);

        for (let ch = 0; ch < 2; ch++) {
            const d = buf.getChannelData(ch);

            // 1) 초기 반사 (10~60ms 사이 몇 개의 강한 반사)
            const earlyCount = 6;
            for (let e = 0; e < earlyCount; e++) {
                const t = Math.floor(sr * (0.01 + e * 0.008 + Math.random() * 0.005));
                const amp = 0.6 * Math.pow(0.7, e) * (ch === 0 ? 1 : 0.85 + Math.random() * 0.3);
                if (t < len) d[t] += amp * (Math.random() > 0.5 ? 1 : -1);
            }

            // 2) 확산 테일 (지수 감쇠 노이즈)
            for (let i = 0; i < len; i++) {
                const t = i / sr;
                const env = Math.exp(-decay * t / duration * 3);
                d[i] += (Math.random() * 2 - 1) * env * 0.3;
            }

            // 3) 고주파 흡수 (시간이 갈수록 어두워짐 — 실제 공간 특성)
            let prev = 0;
            const dampCoeff = 0.3;
            for (let i = 0; i < len; i++) {
                const progress = i / len;
                const damp = dampCoeff + progress * 0.5;
                d[i] = d[i] * (1 - damp) + prev * damp;
                prev = d[i];
            }
        }
        return buf;
    }

    /** 리버브 ConvolverNode 생성 */
    _reverb(ctx, duration = 2, decay = 2) {
        const conv = ctx.createConvolver();
        conv.buffer = this._impulse(ctx, duration, decay);
        return conv;
    }

    /** 스테레오 패너 */
    _pan(ctx, value) {
        const p = ctx.createStereoPanner();
        p.pan.value = value;
        return p;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 악기 시뮬레이션 — 각 함수는 노드를 스케줄링하고 destination에 연결
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * 피아노 — 6배음 인하모니시티 + 벨로시티 감응 필터 + 해머 트랜지언트 + 스테레오
     * 실제 피아노의 현 진동을 근사: 배음이 정수배에서 미세하게 벗어남 (inharmonicity)
     */
    _piano(ctx, dest, note, time, dur, vel = 0.3) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 스테레오 배치 (낮은 음 좌, 높은 음 우 — 실제 피아노 배치)
        const pan = ctx.createStereoPanner();
        pan.pan.value = Math.max(-0.6, Math.min(0.6, (freq - 400) / 800));
        pan.connect(dest);

        // 벨로시티 감응 필터 (세게 치면 밝게)
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(1500 + vel * 6000, time);
        lpf.frequency.exponentialRampToValueAtTime(800 + vel * 1500, time + dur * 0.5);
        lpf.Q.value = 0.8;
        lpf.connect(pan);

        const g = ctx.createGain();
        g.connect(lpf);

        // 인하모니시티 계수 (높은 음일수록 더 큼 — 실제 피아노 특성)
        const B = 0.0004 * (freq / 440);

        // 6개 배음 (피아노 특성 근사)
        const harmonics = [
            { n: 1, amp: 1.0, type: 'triangle' },
            { n: 2, amp: 0.4, type: 'sine' },
            { n: 3, amp: 0.15, type: 'sine' },
            { n: 4, amp: 0.08, type: 'sine' },
            { n: 5, amp: 0.04, type: 'sine' },
            { n: 6, amp: 0.02, type: 'sine' }
        ];

        harmonics.forEach(h => {
            const osc = ctx.createOscillator();
            osc.type = h.type;
            // 인하모니시티: f_n = n * f0 * sqrt(1 + B * n^2)
            osc.frequency.value = h.n * freq * Math.sqrt(1 + B * h.n * h.n);
            const hg = ctx.createGain();
            // 높은 배음은 더 빨리 감쇠 (실제 피아노 특성)
            hg.gain.setValueAtTime(h.amp, time);
            hg.gain.exponentialRampToValueAtTime(h.amp * 0.01, time + dur * (1.2 / h.n));
            osc.connect(hg);
            hg.connect(g);
            osc.start(time);
            osc.stop(time + dur + 0.1);
        });

        // 해머 어택 트랜지언트 (노이즈 + 고주파 클릭)
        const nBuf = this._noise(ctx, 0.025);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nGain = ctx.createGain();
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.value = freq * 4;
        nFilter.Q.value = 2;
        nSrc.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(g);
        nGain.gain.setValueAtTime(vel * 0.2, time);
        nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
        nSrc.start(time);
        nSrc.stop(time + 0.03);

        // 메인 엔벨로프 (자연스러운 피아노 감쇠)
        const attack = 0.005;
        const decayTime = Math.min(dur * 0.7, 1.2);
        const sustainLvl = Math.max(vel * 0.2, 0.001);
        const release = Math.min(dur * 0.3, 0.5);

        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel, time + attack);
        g.gain.exponentialRampToValueAtTime(sustainLvl, time + attack + decayTime);
        if (time + dur - release > time + attack + decayTime) {
            g.gain.setValueAtTime(sustainLvl, time + dur - release);
        }
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    }

    /**
     * 현악기 — 4성부 앙상블, 코러스 디튠, 비브라토, 로진 노이즈, 스테레오 확산
     * 실제 현악 섹션의 여러 주자가 미세하게 다른 피치/타이밍으로 연주하는 효과
     */
    _strings(ctx, dest, note, time, dur, vel = 0.2) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 필터 엔벨로프 (어택 시 밝았다가 부드러워짐)
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(1500, time);
        lpf.frequency.linearRampToValueAtTime(2800, time + dur * 0.15);
        lpf.frequency.exponentialRampToValueAtTime(2000, time + dur * 0.5);
        lpf.Q.value = 0.5;
        lpf.connect(dest);

        const g = ctx.createGain();
        g.connect(lpf);

        // 4성부 앙상블 (각각 다른 디튠 + 비브라토 + 스테레오)
        const voices = [
            { detune: -10, pan: -0.5, vibRate: 4.8, vibAmt: 3.5 },
            { detune: -3,  pan: -0.2, vibRate: 5.2, vibAmt: 2.8 },
            { detune: 3,   pan: 0.2,  vibRate: 5.0, vibAmt: 3.2 },
            { detune: 10,  pan: 0.5,  vibRate: 5.4, vibAmt: 3.0 }
        ];

        voices.forEach(v => {
            const panner = ctx.createStereoPanner();
            panner.pan.value = v.pan;
            panner.connect(g);

            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            osc.detune.value = v.detune;

            // 개별 비브라토 (각 주자가 약간 다른 비브라토)
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = v.vibRate;
            const lfoG = ctx.createGain();
            lfoG.gain.setValueAtTime(0, time);
            lfoG.gain.linearRampToValueAtTime(v.vibAmt, time + dur * 0.3);
            lfo.connect(lfoG);
            lfoG.connect(osc.frequency);
            lfo.start(time);
            lfo.stop(time + dur + 0.2);

            osc.connect(panner);
            osc.start(time);
            osc.stop(time + dur + 0.2);
        });

        // 로진 노이즈 레이어 (활 마찰음)
        const nBuf = this._noise(ctx, dur);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nBpf = ctx.createBiquadFilter();
        nBpf.type = 'bandpass';
        nBpf.frequency.value = freq * 1.5;
        nBpf.Q.value = 3;
        const nG = ctx.createGain();
        nG.gain.value = vel * 0.025;
        nSrc.connect(nBpf);
        nBpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + dur + 0.1);

        // 엔벨로프 (부드러운 어택, 크레센도 가능)
        const attack = Math.min(dur * 0.2, 0.35);
        const release = Math.min(dur * 0.25, 0.6);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel * 0.7, time + attack);
        g.gain.linearRampToValueAtTime(vel, time + dur * 0.4);
        g.gain.setValueAtTime(vel, time + dur - release);
        g.gain.linearRampToValueAtTime(0, time + dur);
    }

    /**
     * 첼로 — 3성부 디튠 + 바디 공명 + 깊은 비브라토 + 활압 시뮬레이션
     */
    _cello(ctx, dest, note, time, dur, vel = 0.25) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 바디 공명 (첼로 고유의 따뜻한 울림)
        const bodyRes = ctx.createBiquadFilter();
        bodyRes.type = 'peaking';
        bodyRes.frequency.value = 220; // 첼로 바디 공명 주파수
        bodyRes.Q.value = 2;
        bodyRes.gain.value = 4;
        bodyRes.connect(dest);

        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(1200, time);
        lpf.frequency.linearRampToValueAtTime(2000, time + dur * 0.2);
        lpf.frequency.exponentialRampToValueAtTime(1500, time + dur * 0.6);
        lpf.Q.value = 0.8;
        lpf.connect(bodyRes);

        const g = ctx.createGain();
        g.connect(lpf);

        // 3성부 (센터 강, 사이드 약)
        [{ dt: -10, amp: 0.35, pan: -0.3 },
         { dt: 0,   amp: 0.6,  pan: 0 },
         { dt: 10,  amp: 0.35, pan: 0.3 }].forEach(v => {
            const panner = ctx.createStereoPanner();
            panner.pan.value = v.pan;
            panner.connect(g);

            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            osc.detune.value = v.dt;
            const og = ctx.createGain();
            og.gain.value = v.amp;
            osc.connect(og);
            og.connect(panner);

            // 깊은 비브라토 (첼로 특유의 넓은 비브라토)
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 5.5 + v.dt * 0.05;
            const lfoG = ctx.createGain();
            lfoG.gain.setValueAtTime(0, time);
            lfoG.gain.linearRampToValueAtTime(5, time + dur * 0.25);
            lfo.connect(lfoG);
            lfoG.connect(osc.frequency);
            lfo.start(time); lfo.stop(time + dur + 0.2);
            osc.start(time); osc.stop(time + dur + 0.2);
        });

        // 활 노이즈 (로진 마찰)
        const nBuf = this._noise(ctx, dur);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nBpf = ctx.createBiquadFilter();
        nBpf.type = 'bandpass';
        nBpf.frequency.value = freq;
        nBpf.Q.value = 4;
        const nG = ctx.createGain();
        nG.gain.value = vel * 0.03;
        nSrc.connect(nBpf); nBpf.connect(nG); nG.connect(g);
        nSrc.start(time); nSrc.stop(time + dur + 0.1);

        // 엔벨로프 (활압 시뮬레이션: 초반에 약간 눌렀다 안정)
        const attack = Math.min(dur * 0.12, 0.2);
        const release = Math.min(dur * 0.2, 0.5);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel * 1.1, time + attack * 0.7);
        g.gain.linearRampToValueAtTime(vel, time + attack);
        g.gain.setValueAtTime(vel, time + dur - release);
        g.gain.linearRampToValueAtTime(0, time + dur);
    }

    /**
     * 글로켄슈필 — 사인파 + 약한 3배음, 빠른 감쇠
     */
    _glock(ctx, dest, note, time, dur, vel = 0.25) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 스테레오 위치 (음높이에 따라 살짝 분산)
        const panner = ctx.createStereoPanner();
        panner.pan.value = ((freq % 200) - 100) / 200;
        panner.connect(dest);

        // 리버브 같은 여운 — 약한 피드백 딜레이
        const dly = ctx.createDelay(0.5);
        dly.delayTime.value = 0.12;
        const dlyG = ctx.createGain();
        dlyG.gain.value = 0.15;
        dly.connect(dlyG);
        dlyG.connect(panner);
        dlyG.connect(dly); // 피드백

        const g = ctx.createGain();
        g.connect(panner);
        g.connect(dly);

        // 글로켄슈필의 비정수 배음 (금속 바 특성)
        // 실제 글록 배음: 1, 2.76, 5.40, 8.93
        const partials = [
            { ratio: 1,    amp: 1.0,   decay: 1.0 },
            { ratio: 2.76, amp: 0.35,  decay: 0.7 },
            { ratio: 5.40, amp: 0.12,  decay: 0.45 },
            { ratio: 8.93, amp: 0.05,  decay: 0.3 },
            { ratio: 4.0,  amp: 0.08,  decay: 0.5 }
        ];

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq * p.ratio;
            const og = ctx.createGain();
            og.gain.setValueAtTime(vel * p.amp, time);
            og.gain.exponentialRampToValueAtTime(vel * p.amp * 0.3, time + dur * p.decay * 0.3);
            og.gain.exponentialRampToValueAtTime(0.001, time + dur * p.decay);
            osc.connect(og);
            og.connect(g);
            osc.start(time);
            osc.stop(time + dur * p.decay + 0.05);
        });

        // 말렛 어택 트랜지언트 (나무/고무 말렛 소리)
        const nBuf = this._noise(ctx, 0.008);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.3, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.008);
        const hpf = ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 5000;
        nSrc.connect(hpf);
        hpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + 0.012);

        // 메인 엔벨로프
        g.gain.setValueAtTime(vel, time);
        g.gain.exponentialRampToValueAtTime(vel * 0.35, time + dur * 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    }

    /**
     * 뮤직박스 — 깨끗한 사인파, 고음역, 빠른 감쇠
     */
    _musicBox(ctx, dest, note, time, dur, vel = 0.3) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 스테레오 — 음높이에 따라 좌우 배치 (높은음 우측)
        const panner = ctx.createStereoPanner();
        panner.pan.value = Math.min(1, Math.max(-1, (freq - 600) / 800));
        panner.connect(dest);

        // 심파세틱 레조넌스 (공명 딜레이)
        const dly = ctx.createDelay(0.3);
        dly.delayTime.value = 0.08;
        const dlyG = ctx.createGain();
        dlyG.gain.value = 0.12;
        dly.connect(dlyG);
        dlyG.connect(panner);

        const g = ctx.createGain();
        g.connect(panner);
        g.connect(dly);

        // 뮤직박스 배음 — 핀이 빗(comb)을 튕기는 구조
        // 기본음 + 약한 2배음 + 미세한 3배음 + 벨 같은 고음
        const partials = [
            { ratio: 1,    amp: 1.0,   decay: 1.0 },
            { ratio: 2.0,  amp: 0.15,  decay: 0.7 },
            { ratio: 3.0,  amp: 0.06,  decay: 0.5 },
            { ratio: 5.04, amp: 0.03,  decay: 0.35 },  // 비정수 배음 (금속 빗)
            { ratio: 8.2,  amp: 0.015, decay: 0.2 }    // 고음 shimmer
        ];

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq * p.ratio;
            const og = ctx.createGain();
            const pDur = dur * p.decay;
            og.gain.setValueAtTime(vel * p.amp, time);
            og.gain.exponentialRampToValueAtTime(vel * p.amp * 0.08, time + pDur * 0.6);
            og.gain.exponentialRampToValueAtTime(0.001, time + pDur);
            osc.connect(og);
            og.connect(g);
            osc.start(time);
            osc.stop(time + pDur + 0.05);
        });

        // 핀 어택 클릭 (기계적 타격음)
        const nBuf = this._noise(ctx, 0.005);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.2, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.005);
        const bpf = ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = freq * 2;
        bpf.Q.value = 8;
        nSrc.connect(bpf);
        bpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + 0.008);

        // 메인 엔벨로프
        g.gain.setValueAtTime(vel, time);
        g.gain.exponentialRampToValueAtTime(vel * 0.12, time + dur * 0.55);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    }

    /**
     * 기타 플럭 — 5배음 + 바디 공명 필터 + 플럭 트랜지언트 + 현 감쇠
     */
    _guitar(ctx, dest, note, time, dur, vel = 0.25) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 바디 공명 (어쿠스틱 기타의 홀 공명 시뮬레이션)
        const bodyLo = ctx.createBiquadFilter();
        bodyLo.type = 'peaking';
        bodyLo.frequency.value = 100; // 저음 바디 공명
        bodyLo.Q.value = 1.5;
        bodyLo.gain.value = 3;
        bodyLo.connect(dest);

        const bodyMid = ctx.createBiquadFilter();
        bodyMid.type = 'peaking';
        bodyMid.frequency.value = 400; // 중음 바디 공명
        bodyMid.Q.value = 2;
        bodyMid.gain.value = 2;
        bodyMid.connect(bodyLo);

        // 플럭 필터 (어택 시 밝았다가 감쇠)
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(freq * 6, time);
        lpf.frequency.exponentialRampToValueAtTime(freq * 2, time + dur * 0.4);
        lpf.Q.value = 0.7;
        lpf.connect(bodyMid);

        const g = ctx.createGain();
        g.connect(lpf);

        // 5개 배음 (기타 특성: 홀수 배음 약간 강함)
        [[1, 1.0, 'triangle'], [2, 0.35, 'sine'], [3, 0.18, 'sine'],
         [4, 0.08, 'sine'], [5, 0.05, 'sine']].forEach(([h, amp, type]) => {
            const osc = ctx.createOscillator();
            osc.type = type;
            osc.frequency.value = freq * h;
            const hg = ctx.createGain();
            // 높은 배음일수록 빨리 감쇠
            hg.gain.setValueAtTime(amp, time);
            hg.gain.exponentialRampToValueAtTime(amp * 0.01, time + dur * (1 / h));
            osc.connect(hg); hg.connect(g);
            osc.start(time); osc.stop(time + dur + 0.05);
        });

        // 플럭 어택 (손가락/피크 소리)
        const nBuf = this._noise(ctx, 0.02);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.25, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
        const hpf = ctx.createBiquadFilter();
        hpf.type = 'highpass'; hpf.frequency.value = 3000;
        nSrc.connect(hpf); hpf.connect(nG); nG.connect(g);
        nSrc.start(time); nSrc.stop(time + 0.025);

        // 메인 엔벨로프
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel, time + 0.003);
        g.gain.exponentialRampToValueAtTime(vel * 0.3, time + dur * 0.25);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    }

    /**
     * 플루트 — 관악기 포먼트 + 숨소리 + 오버블로잉 배음 + 딜레이드 비브라토
     */
    _flute(ctx, dest, note, time, dur, vel = 0.2) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 스테레오 위치
        const panner = ctx.createStereoPanner();
        panner.pan.value = ((freq % 150) - 75) / 150;
        panner.connect(dest);

        // 포먼트 필터 (플루트 관 공명 시뮬레이션)
        const formant1 = ctx.createBiquadFilter();
        formant1.type = 'peaking';
        formant1.frequency.value = freq * 2;
        formant1.Q.value = 3;
        formant1.gain.value = 2;
        formant1.connect(panner);

        const formant2 = ctx.createBiquadFilter();
        formant2.type = 'peaking';
        formant2.frequency.value = freq * 3;
        formant2.Q.value = 4;
        formant2.gain.value = -1;
        formant2.connect(formant1);

        const g = ctx.createGain();
        g.connect(formant2);

        // 기본음 + 오버블로잉 배음
        const harmonics = [
            { ratio: 1,   amp: 1.0,  type: 'sine' },
            { ratio: 2,   amp: 0.12, type: 'sine' },     // 약한 2배음
            { ratio: 3,   amp: 0.04, type: 'sine' },     // 매우 약한 3배음
        ];

        const oscs = [];
        harmonics.forEach(h => {
            const osc = ctx.createOscillator();
            osc.type = h.type;
            osc.frequency.value = freq * h.ratio;
            const og = ctx.createGain();
            og.gain.value = h.amp;
            osc.connect(og);
            og.connect(g);
            oscs.push(osc);
            osc.start(time);
            osc.stop(time + dur + 0.15);
        });

        // 숨소리 레이어 (에어 노이즈)
        const nBuf = this._noise(ctx, dur + 0.1);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        // 두 개의 밴드패스로 더 자연스러운 숨소리
        const bpf1 = ctx.createBiquadFilter();
        bpf1.type = 'bandpass';
        bpf1.frequency.value = freq;
        bpf1.Q.value = 3;
        const bpf2 = ctx.createBiquadFilter();
        bpf2.type = 'bandpass';
        bpf2.frequency.value = freq * 3;
        bpf2.Q.value = 5;
        const nG1 = ctx.createGain();
        nG1.gain.value = vel * 0.05;
        const nG2 = ctx.createGain();
        nG2.gain.value = vel * 0.025;
        nSrc.connect(bpf1); bpf1.connect(nG1); nG1.connect(g);
        nSrc.connect(bpf2); bpf2.connect(nG2); nG2.connect(g);
        nSrc.start(time);
        nSrc.stop(time + dur + 0.1);

        // 에어 어택 (불기 시작 노이즈)
        const aBuf = this._noise(ctx, 0.04);
        const aSrc = ctx.createBufferSource();
        aSrc.buffer = aBuf;
        const aG = ctx.createGain();
        aG.gain.setValueAtTime(vel * 0.15, time);
        aG.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
        const ahpf = ctx.createBiquadFilter();
        ahpf.type = 'highpass';
        ahpf.frequency.value = 2000;
        aSrc.connect(ahpf);
        ahpf.connect(aG);
        aG.connect(g);
        aSrc.start(time);
        aSrc.stop(time + 0.045);

        // 딜레이드 비브라토 (실제 플루티스트처럼 약간 뒤에 시작)
        const vibDelay = Math.min(dur * 0.3, 0.3);
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 5;
        const lfoG = ctx.createGain();
        // 비브라토가 서서히 깊어짐
        lfoG.gain.setValueAtTime(0, time);
        lfoG.gain.linearRampToValueAtTime(0, time + vibDelay);
        lfoG.gain.linearRampToValueAtTime(freq * 0.008, time + vibDelay + 0.2);
        lfo.connect(lfoG);
        oscs.forEach(o => lfoG.connect(o.frequency));
        lfo.start(time);
        lfo.stop(time + dur + 0.15);

        // 엔벨로프 — 부드러운 어택, 서스테인, 릴리즈
        const attack = Math.min(dur * 0.12, 0.12);
        const release = Math.min(dur * 0.2, 0.25);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel, time + attack);
        g.gain.setValueAtTime(vel * 0.9, time + attack + 0.05);
        g.gain.setValueAtTime(vel * 0.85, time + dur - release);
        g.gain.linearRampToValueAtTime(0, time + dur);
    }

    /**
     * 신스 패드 — 5성부 슈퍼소 유니슨 + 코러스 LFO + 필터 모듈레이션 + 스테레오
     */
    _pad(ctx, dest, note, time, dur, vel = 0.15) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 필터 (느린 변동)
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 1200;
        lpf.Q.value = 0.7;
        lpf.connect(dest);

        // 필터 LFO (호흡하는 느낌)
        const flfo = ctx.createOscillator();
        flfo.type = 'sine';
        flfo.frequency.value = 0.2;
        const flfoG = ctx.createGain();
        flfoG.gain.value = 500;
        flfo.connect(flfoG);
        flfoG.connect(lpf.frequency);
        flfo.start(time); flfo.stop(time + dur + 0.2);

        const g = ctx.createGain();
        g.connect(lpf);

        // 5성부 슈퍼소 (넓은 스테레오 이미지)
        const voices = [
            { dt: -18, pan: -0.7, type: 'sawtooth' },
            { dt: -7,  pan: -0.3, type: 'triangle' },
            { dt: 0,   pan: 0,    type: 'sawtooth' },
            { dt: 7,   pan: 0.3,  type: 'triangle' },
            { dt: 18,  pan: 0.7,  type: 'sawtooth' }
        ];

        voices.forEach((v, i) => {
            const panner = ctx.createStereoPanner();
            panner.pan.value = v.pan;
            panner.connect(g);

            const osc = ctx.createOscillator();
            osc.type = v.type;
            osc.frequency.value = freq;
            osc.detune.value = v.dt;

            // 개별 코러스 LFO (각 보이스가 미세하게 움직임)
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.5 + i * 0.15;
            const lfoG = ctx.createGain();
            lfoG.gain.value = 4;
            lfo.connect(lfoG);
            lfoG.connect(osc.detune);
            lfo.start(time); lfo.stop(time + dur + 0.2);

            osc.connect(panner);
            osc.start(time);
            osc.stop(time + dur + 0.2);
        });

        const attack = Math.min(dur * 0.3, 1.2);
        const release = Math.min(dur * 0.3, 1.2);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel, time + attack);
        g.gain.setValueAtTime(vel, time + dur - release);
        g.gain.linearRampToValueAtTime(0, time + dur);
    }

    /**
     * 베이스 — 사인 + 서브 + 새추레이션 + 핑거/프렛 노이즈 + 슬라이드
     */
    _bass(ctx, dest, note, time, dur, vel = 0.3) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 로우패스 필터 (따뜻한 톤)
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(freq * 5, time);
        lpf.frequency.exponentialRampToValueAtTime(freq * 2.5, time + dur * 0.3);
        lpf.Q.value = 0.8;
        lpf.connect(dest);

        // 약간의 새추레이션 (웨이브쉐이퍼)
        const ws = ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const x = (i / 128) - 1;
            curve[i] = Math.tanh(x * 1.5);
        }
        ws.curve = curve;
        ws.oversample = '2x';
        ws.connect(lpf);

        const g = ctx.createGain();
        g.connect(ws);

        // 기본음 (삼각파 — 일렉 베이스 특성)
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(g);

        // 사인 서브 (깊은 저음)
        const sub = ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.value = freq;
        const sg = ctx.createGain();
        sg.gain.value = 0.6;
        sub.connect(sg);
        sg.connect(g);

        // 2배음 (약한 — 베이스의 존재감)
        const h2 = ctx.createOscillator();
        h2.type = 'sine';
        h2.frequency.value = freq * 2;
        const h2g = ctx.createGain();
        h2g.gain.setValueAtTime(0.15, time);
        h2g.gain.exponentialRampToValueAtTime(0.05, time + dur * 0.5);
        h2.connect(h2g);
        h2g.connect(g);

        // 3배음 (프렛 버즈 느낌)
        const h3 = ctx.createOscillator();
        h3.type = 'sine';
        h3.frequency.value = freq * 3;
        const h3g = ctx.createGain();
        h3g.gain.setValueAtTime(0.06, time);
        h3g.gain.exponentialRampToValueAtTime(0.01, time + dur * 0.3);
        h3.connect(h3g);
        h3g.connect(g);

        // 핑거 어택 노이즈
        const nBuf = this._noise(ctx, 0.015);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.12, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
        const nbpf = ctx.createBiquadFilter();
        nbpf.type = 'bandpass';
        nbpf.frequency.value = 1200;
        nbpf.Q.value = 2;
        nSrc.connect(nbpf);
        nbpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + 0.02);

        // 엔벨로프 — 단단한 어택 + 자연스러운 서스테인
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel, time + 0.008);
        g.gain.setValueAtTime(vel * 0.85, time + 0.04);
        g.gain.exponentialRampToValueAtTime(vel * 0.6, time + dur * 0.6);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.start(time); osc.stop(time + dur + 0.05);
        sub.start(time); sub.stop(time + dur + 0.05);
        h2.start(time); h2.stop(time + dur + 0.05);
        h3.start(time); h3.stop(time + dur + 0.05);
    }

    /**
     * 실로폰/마림바 — 비정수 배음 (나무 바) + 공명관 시뮬레이션 + 말렛 트랜지언트
     */
    _xylo(ctx, dest, note, time, dur, vel = 0.3) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 스테레오 배치 (음높이 따라)
        const panner = ctx.createStereoPanner();
        panner.pan.value = Math.min(1, Math.max(-1, (freq - 500) / 600));
        panner.connect(dest);

        // 공명관 시뮬레이션 (bandpass)
        const tube = ctx.createBiquadFilter();
        tube.type = 'peaking';
        tube.frequency.value = freq;
        tube.Q.value = 5;
        tube.gain.value = 4;
        tube.connect(panner);

        const g = ctx.createGain();
        g.connect(tube);

        // 실로폰 비정수 배음 (나무 바의 특성)
        // 이상적인 바 배음: 1, 2.76, 5.40, 8.93 (글록과 비슷하지만 감쇠가 빠름)
        const partials = [
            { ratio: 1,    amp: 1.0,   decay: 1.0 },
            { ratio: 3.0,  amp: 0.28,  decay: 0.5 },
            { ratio: 5.40, amp: 0.1,   decay: 0.3 },
            { ratio: 8.93, amp: 0.04,  decay: 0.2 },
            { ratio: 2.0,  amp: 0.12,  decay: 0.6 }   // 서브하모닉 공명
        ];

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq * p.ratio;
            const og = ctx.createGain();
            const pDur = dur * p.decay;
            og.gain.setValueAtTime(vel * p.amp, time);
            og.gain.exponentialRampToValueAtTime(vel * p.amp * 0.05, time + pDur * 0.5);
            og.gain.exponentialRampToValueAtTime(0.001, time + pDur);
            osc.connect(og);
            og.connect(g);
            osc.start(time);
            osc.stop(time + pDur + 0.05);
        });

        // 말렛 임팩트 (딱딱한 나무 말렛)
        const nBuf = this._noise(ctx, 0.01);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.35, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.01);
        const nbpf = ctx.createBiquadFilter();
        nbpf.type = 'bandpass';
        nbpf.frequency.value = 4000;
        nbpf.Q.value = 3;
        nSrc.connect(nbpf);
        nbpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + 0.015);

        // 메인 엔벨로프 — 매우 빠른 어택, 빠른 감쇠
        g.gain.setValueAtTime(vel, time);
        g.gain.exponentialRampToValueAtTime(vel * 0.06, time + dur * 0.35);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    }

    /**
     * 색소폰 — 리드 시뮬레이션 + 포먼트 필터 + 키 노이즈 + 그로울 + 딜레이드 비브라토
     */
    _sax(ctx, dest, note, time, dur, vel = 0.2) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 스테레오
        const panner = ctx.createStereoPanner();
        panner.pan.value = 0.15;
        panner.connect(dest);

        // 포먼트 필터 체인 (색소폰 벨/관 공명)
        const f1 = ctx.createBiquadFilter();
        f1.type = 'peaking';
        f1.frequency.value = 450;   // 1차 포먼트
        f1.Q.value = 3;
        f1.gain.value = 4;
        f1.connect(panner);

        const f2 = ctx.createBiquadFilter();
        f2.type = 'peaking';
        f2.frequency.value = 1200;  // 2차 포먼트
        f2.Q.value = 4;
        f2.gain.value = 2;
        f2.connect(f1);

        const f3 = ctx.createBiquadFilter();
        f3.type = 'peaking';
        f3.frequency.value = 2800;  // 3차 포먼트 (밝기)
        f3.Q.value = 5;
        f3.gain.value = -2;
        f3.connect(f2);

        // 톤 셰이핑 LPF
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(freq * 8, time);
        lpf.frequency.exponentialRampToValueAtTime(freq * 4, time + dur * 0.3);
        lpf.Q.value = 1.5;
        lpf.connect(f3);

        const g = ctx.createGain();
        g.connect(lpf);

        // 리드 오실레이터 (사각파 기반 — 리드 악기의 홀수 배음)
        const osc1 = ctx.createOscillator();
        osc1.type = 'square';
        osc1.frequency.value = freq;
        const og1 = ctx.createGain();
        og1.gain.value = 0.4;
        osc1.connect(og1);
        og1.connect(g);

        // 톱니파 레이어 (밝은 톤 추가)
        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.value = freq;
        osc2.detune.value = 4;
        const og2 = ctx.createGain();
        og2.gain.value = 0.25;
        osc2.connect(og2);
        og2.connect(g);

        // 서브 레이어 (따뜻함)
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = freq;
        const og3 = ctx.createGain();
        og3.gain.value = 0.2;
        osc3.connect(og3);
        og3.connect(g);

        // 리드 버즈 노이즈 (공기+리드 마찰)
        const nBuf = this._noise(ctx, dur + 0.1);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nbpf = ctx.createBiquadFilter();
        nbpf.type = 'bandpass';
        nbpf.frequency.value = freq * 2;
        nbpf.Q.value = 4;
        const nG = ctx.createGain();
        nG.gain.value = vel * 0.03;
        nSrc.connect(nbpf);
        nbpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + dur + 0.1);

        // 키 클릭 어택
        const kBuf = this._noise(ctx, 0.012);
        const kSrc = ctx.createBufferSource();
        kSrc.buffer = kBuf;
        const kG = ctx.createGain();
        kG.gain.setValueAtTime(vel * 0.2, time);
        kG.gain.exponentialRampToValueAtTime(0.001, time + 0.012);
        kSrc.connect(kG);
        kG.connect(g);
        kSrc.start(time);
        kSrc.stop(time + 0.015);

        // 딜레이드 비브라토 (재즈 색소폰 스타일 — 노트 후반부에서 시작)
        const vibDelay = Math.min(dur * 0.35, 0.4);
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 5.5;
        const lfoG = ctx.createGain();
        lfoG.gain.setValueAtTime(0, time);
        lfoG.gain.linearRampToValueAtTime(0, time + vibDelay);
        lfoG.gain.linearRampToValueAtTime(freq * 0.012, time + vibDelay + 0.15);
        lfo.connect(lfoG);
        lfoG.connect(osc1.frequency);
        lfoG.connect(osc2.frequency);
        lfoG.connect(osc3.frequency);
        lfo.start(time);
        lfo.stop(time + dur + 0.15);

        // 엔벨로프 — 리드 어택 (약간 거친 시작)
        const attack = Math.min(dur * 0.06, 0.05);
        const release = Math.min(dur * 0.15, 0.2);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel * 1.1, time + attack * 0.5);
        g.gain.linearRampToValueAtTime(vel, time + attack);
        g.gain.setValueAtTime(vel * 0.9, time + dur - release);
        g.gain.linearRampToValueAtTime(0, time + dur);

        osc1.start(time); osc1.stop(time + dur + 0.15);
        osc2.start(time); osc2.stop(time + dur + 0.15);
        osc3.start(time); osc3.stop(time + dur + 0.15);
    }

    /**
     * 드럼 킥 — 레이어드 (클릭 + 바디 + 서브) + 새추레이션
     */
    _kick(ctx, dest, time, vel = 0.4) {
        // 약한 새추레이션 (펀치감)
        const ws = ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const x = (i / 128) - 1;
            curve[i] = Math.tanh(x * 2);
        }
        ws.curve = curve;
        ws.connect(dest);

        // 1) 서브 레이어 (깊은 저음 — 사인파)
        const sub = ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(80, time);
        sub.frequency.exponentialRampToValueAtTime(35, time + 0.15);
        const subG = ctx.createGain();
        subG.gain.setValueAtTime(vel * 0.8, time);
        subG.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        sub.connect(subG);
        subG.connect(ws);
        sub.start(time);
        sub.stop(time + 0.35);

        // 2) 바디 레이어 (펀치 — 피치 스윕)
        const body = ctx.createOscillator();
        body.type = 'sine';
        body.frequency.setValueAtTime(160, time);
        body.frequency.exponentialRampToValueAtTime(50, time + 0.08);
        const bodyG = ctx.createGain();
        bodyG.gain.setValueAtTime(vel, time);
        bodyG.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        body.connect(bodyG);
        bodyG.connect(ws);
        body.start(time);
        body.stop(time + 0.25);

        // 3) 클릭/비터 어택 (노이즈 트랜지언트)
        const nBuf = this._noise(ctx, 0.012);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.5, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.012);
        const bpf = ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 3500;
        bpf.Q.value = 2;
        nSrc.connect(bpf);
        bpf.connect(nG);
        nG.connect(ws);
        nSrc.start(time);
        nSrc.stop(time + 0.015);

        // 4) 톤 클릭 (높은 피치 사인파, 매우 짧음)
        const click = ctx.createOscillator();
        click.type = 'sine';
        click.frequency.setValueAtTime(1200, time);
        click.frequency.exponentialRampToValueAtTime(200, time + 0.02);
        const clickG = ctx.createGain();
        clickG.gain.setValueAtTime(vel * 0.3, time);
        clickG.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
        click.connect(clickG);
        clickG.connect(ws);
        click.start(time);
        click.stop(time + 0.03);
    }

    /**
     * 하이햇 — 6개 금속 오실레이터 + 노이즈 레이어 + 밴드패스
     */
    _hihat(ctx, dest, time, dur = 0.05, vel = 0.1) {
        const g = ctx.createGain();
        g.connect(dest);

        // 1) 금속 오실레이터 (비정수 주파수 — 심벌 특성)
        const metalFreqs = [317.2, 438.7, 602.1, 825.4, 1133.8, 1555.6];
        metalFreqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.value = f;
            const og = ctx.createGain();
            og.gain.setValueAtTime(vel * 0.04, time);
            og.gain.exponentialRampToValueAtTime(0.001, time + dur * (0.5 + i * 0.08));
            osc.connect(og);
            og.connect(g);
            osc.start(time);
            osc.stop(time + dur + 0.02);
        });

        // 2) 노이즈 레이어 (시즐)
        const nBuf = this._noise(ctx, dur + 0.02);
        const src = ctx.createBufferSource();
        src.buffer = nBuf;
        const hpf = ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 7000;
        const bpf = ctx.createBiquadFilter();
        bpf.type = 'peaking';
        bpf.frequency.value = 10000;
        bpf.Q.value = 1;
        bpf.gain.value = 3;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.8, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + dur);
        src.connect(hpf);
        hpf.connect(bpf);
        bpf.connect(nG);
        nG.connect(g);
        src.start(time);
        src.stop(time + dur + 0.02);

        // 메인 엔벨로프
        g.gain.setValueAtTime(1, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    }

    /**
     * 스네어 — 쉘 공명 + 스네어 와이어 + 노이즈 버스트 + 림 어택
     */
    _snare(ctx, dest, time, vel = 0.2) {
        const g = ctx.createGain();
        g.gain.setValueAtTime(1, time);
        g.connect(dest);

        // 1) 쉘 톤 (바디 — 두 개의 모드)
        // 상부 헤드 모드
        const shell1 = ctx.createOscillator();
        shell1.type = 'triangle';
        shell1.frequency.value = 185;
        const s1g = ctx.createGain();
        s1g.gain.setValueAtTime(vel * 0.6, time);
        s1g.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        shell1.connect(s1g);
        s1g.connect(g);
        shell1.start(time);
        shell1.stop(time + 0.12);

        // 하부 헤드 모드
        const shell2 = ctx.createOscillator();
        shell2.type = 'sine';
        shell2.frequency.value = 330;
        const s2g = ctx.createGain();
        s2g.gain.setValueAtTime(vel * 0.25, time);
        s2g.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        shell2.connect(s2g);
        s2g.connect(g);
        shell2.start(time);
        shell2.stop(time + 0.08);

        // 2) 스네어 와이어 래틀 (밴드패스 노이즈 — 더 긴 테일)
        const wireBuf = this._noise(ctx, 0.2);
        const wireSrc = ctx.createBufferSource();
        wireSrc.buffer = wireBuf;
        const wireBpf = ctx.createBiquadFilter();
        wireBpf.type = 'bandpass';
        wireBpf.frequency.value = 4000;
        wireBpf.Q.value = 1.5;
        const wireG = ctx.createGain();
        wireG.gain.setValueAtTime(vel * 0.3, time + 0.002);
        wireG.gain.exponentialRampToValueAtTime(vel * 0.15, time + 0.05);
        wireG.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        wireSrc.connect(wireBpf);
        wireBpf.connect(wireG);
        wireG.connect(g);
        wireSrc.start(time);
        wireSrc.stop(time + 0.2);

        // 3) 노이즈 버스트 (어택 — 넓은 대역)
        const nBuf = this._noise(ctx, 0.08);
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = nBuf;
        const hpf = ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 2000;
        const nG = ctx.createGain();
        nG.gain.setValueAtTime(vel * 0.7, time);
        nG.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        nSrc.connect(hpf);
        hpf.connect(nG);
        nG.connect(g);
        nSrc.start(time);
        nSrc.stop(time + 0.08);

        // 4) 림 클릭 (짧은 높은 톤)
        const rim = ctx.createOscillator();
        rim.type = 'sine';
        rim.frequency.setValueAtTime(800, time);
        rim.frequency.exponentialRampToValueAtTime(400, time + 0.01);
        const rimG = ctx.createGain();
        rimG.gain.setValueAtTime(vel * 0.15, time);
        rimG.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
        rim.connect(rimG);
        rimG.connect(g);
        rim.start(time);
        rim.stop(time + 0.02);
    }

    /**
     * 드론 — 6성부 디튠 + 서브하모닉 + 느린 필터 스윕 + 스테레오 확산
     */
    _drone(ctx, dest, note, time, dur, vel = 0.1) {
        const freq = typeof note === 'string' ? this._f(note) : note;

        // 필터 체인 (두 단계 필터링으로 부드러운 특성)
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 250;
        lpf.Q.value = 0.5;
        lpf.connect(dest);

        // 필터 LFO (느리게 호흡하는 느낌)
        const flfo = ctx.createOscillator();
        flfo.type = 'sine';
        flfo.frequency.value = 0.08;
        const flfoG = ctx.createGain();
        flfoG.gain.value = 120;
        flfo.connect(flfoG);
        flfoG.connect(lpf.frequency);
        flfo.start(time); flfo.stop(time + dur + 0.3);

        const g = ctx.createGain();
        g.connect(lpf);

        // 6성부 (기본음 + 5도 위 + 서브옥타브, 각각 디튠 + 스테레오)
        const voices = [
            { ratio: 0.5, dt: -15, pan: -0.4, type: 'sine', amp: 0.4 },     // 서브
            { ratio: 1,   dt: -8,  pan: -0.6, type: 'sawtooth', amp: 0.3 },
            { ratio: 1,   dt: 0,   pan: 0,    type: 'sine', amp: 0.5 },      // 센터
            { ratio: 1,   dt: 8,   pan: 0.6,  type: 'sawtooth', amp: 0.3 },
            { ratio: 1.5, dt: -5,  pan: -0.3, type: 'sine', amp: 0.12 },    // 5도
            { ratio: 0.5, dt: 15,  pan: 0.4,  type: 'sine', amp: 0.35 }     // 서브
        ];

        voices.forEach((v, i) => {
            const panner = ctx.createStereoPanner();
            panner.pan.value = v.pan;
            panner.connect(g);

            const osc = ctx.createOscillator();
            osc.type = v.type;
            osc.frequency.value = freq * v.ratio;
            osc.detune.value = v.dt;

            // 개별 느린 피치 드리프트 (유기적 움직임)
            const drift = ctx.createOscillator();
            drift.type = 'sine';
            drift.frequency.value = 0.05 + i * 0.02;
            const dG = ctx.createGain();
            dG.gain.value = 2;
            drift.connect(dG);
            dG.connect(osc.detune);
            drift.start(time); drift.stop(time + dur + 0.3);

            const vg = ctx.createGain();
            vg.gain.value = v.amp;
            osc.connect(vg);
            vg.connect(panner);
            osc.start(time); osc.stop(time + dur + 0.3);
        });

        const fade = Math.min(dur * 0.2, 2.5);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vel, time + fade);
        g.gain.setValueAtTime(vel, time + dur - fade);
        g.gain.linearRampToValueAtTime(0, time + dur);
    }

    // ═══════════════════════════════════════════════════════════════════
    // 코드 헬퍼
    // ═══════════════════════════════════════════════════════════════════

    /** 코드 연주 (여러 음을 동시에) */
    _playChord(ctx, dest, instrument, notes, time, dur, vel) {
        notes.forEach(n => this['_' + instrument](ctx, dest, n, time, dur, vel));
    }

    /** 아르페지오 (음을 순서대로) */
    _arpeggio(ctx, dest, instrument, notes, time, noteDur, vel, interval = null) {
        const gap = interval || noteDur;
        notes.forEach((n, i) => {
            this['_' + instrument](ctx, dest, n, time + i * gap, noteDur, vel);
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // ═══ 로맨스 페이즈 BGM ═══
    // ═══════════════════════════════════════════════════════════════════

    /**
     * spring_bright — 밝고 경쾌한 봄날 BGM
     * D Major, 120 BPM, 어쿠스틱 기타 + 글로켄슈필
     */
    async _spring_bright() {
        const bpm = 120, dur = 16;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 1.5, 2.5);
        const dry = ctx.createGain(); dry.gain.value = 0.75;
        const wet = ctx.createGain(); wet.gain.value = 0.25;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 코드: D - A - Bm - G
        const chords = [
            ['D3','F#3','A3','D4'],
            ['A2','E3','A3','C#4'],
            ['B2','F#3','B3','D4'],
            ['G2','B2','D3','G3']
        ];
        const bassNotes = ['D2','A1','B1','G1'];
        const melodyPhrases = [
            ['F#5','A5','D6','A5','F#5','D5','E5','F#5'],
            ['E5','C#5','A4','C#5','E5','A5','G#5','E5'],
            ['D5','F#5','B5','F#5','D5','B4','C#5','D5'],
            ['B4','D5','G5','D5','B4','G4','A4','B4']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;
            const chord = chords[ci];

            // 기타 스트럼 (8분음표 패턴)
            for (let i = 0; i < 8; i++) {
                const st = t + i * beat * 0.5;
                const v = i % 2 === 0 ? 0.18 : 0.12;
                chord.forEach((n, j) => {
                    this._guitar(ctx, master, n, st + j * 0.012, beat * 0.45, v);
                });
            }

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 4, 0.2);

            // 글로켄슈필 멜로디 (8분음표)
            const mel = melodyPhrases[ci];
            mel.forEach((n, i) => {
                this._glock(ctx, master, n, t + i * beat * 0.5, beat * 0.45, 0.18);
            });

            // 가벼운 하이햇 (4분음표)
            for (let i = 0; i < 4; i++) {
                this._hihat(ctx, master, t + i * beat, 0.04, 0.06);
            }
        }

        return ctx.startRendering();
    }

    /**
     * morning_bright — 행복한 아침, 피아노 + 플루트
     * C Major, 100 BPM
     */
    async _morning_bright() {
        const bpm = 100, dur = 19.2; // 8 bars
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 2, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.7;
        const wet = ctx.createGain(); wet.gain.value = 0.3;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        const chords = [
            ['C4','E4','G4'],
            ['A3','C4','E4'],
            ['F3','A3','C4'],
            ['G3','B3','D4']
        ];
        const bassNotes = ['C2','A1','F1','G1'];
        const pianoMel = [
            ['E5','G5','C6','G5','E5','D5','E5','C5'],
            ['C5','E5','A5','E5','C5','B4','A4','G4'],
            ['A4','C5','F5','C5','A4','G4','F4','A4'],
            ['B4','D5','G5','D5','B4','A4','G4','B4']
        ];
        const fluteMel = [
            ['C6','','','E6','','','D6',''],
            ['A5','','','C6','','','B5',''],
            ['F5','','','A5','','','G5',''],
            ['G5','','','B5','','','A5','']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 피아노 코드 (아르페지오)
            chords[ci].forEach((n, i) => {
                this._piano(ctx, master, n, t + i * 0.05, beat * 3.5, 0.2);
            });

            // 피아노 멜로디
            pianoMel[ci].forEach((n, i) => {
                if (n) this._piano(ctx, master, n, t + i * beat * 0.5, beat * 0.45, 0.25);
            });

            // 플루트 (길고 느리게)
            fluteMel[ci].forEach((n, i) => {
                if (n) this._flute(ctx, master, n, t + i * beat * 0.5, beat * 1.8, 0.15);
            });

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 4, 0.15);
        }

        return ctx.startRendering();
    }

    /**
     * daily_bright — 일상 학교생활, 우쿨렐레 + 핸드 퍼커션
     * G Major, 110 BPM
     */
    async _daily_bright() {
        const bpm = 110, dur = 17.5;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 1.2, 3);
        const dry = ctx.createGain(); dry.gain.value = 0.8;
        const wet = ctx.createGain(); wet.gain.value = 0.2;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // G - D - Em - C
        const chords = [
            ['G3','B3','D4','G4'],
            ['D3','F#3','A3','D4'],
            ['E3','G3','B3','E4'],
            ['C3','E3','G3','C4']
        ];
        const bassNotes = ['G2','D2','E2','C2'];
        const melody = [
            ['B5','D6','G6','D6','B5','A5','G5','B5'],
            ['A5','F#5','D5','F#5','A5','D6','C#6','A5'],
            ['G5','B5','E6','B5','G5','F#5','E5','G5'],
            ['E5','G5','C6','G5','E5','D5','C5','E5']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 우쿨렐레 (기타 높은 음역으로 시뮬레이션, 16분음표 스트럼)
            for (let i = 0; i < 8; i++) {
                const st = t + i * beat * 0.5;
                const up = i % 2 === 1;
                const notes = up ? [...chords[ci]].reverse() : chords[ci];
                notes.forEach((n, j) => {
                    this._guitar(ctx, master, n, st + j * 0.008, beat * 0.35, 0.15);
                });
            }

            // 실로폰 멜로디
            melody[ci].forEach((n, i) => {
                this._xylo(ctx, master, n, t + i * beat * 0.5, beat * 0.4, 0.15);
            });

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 2, 0.15);
            this._bass(ctx, master, bassNotes[ci], t + beat * 2, beat * 2, 0.12);

            // 핸드 퍼커션 패턴
            for (let i = 0; i < 4; i++) {
                this._hihat(ctx, master, t + i * beat, 0.03, 0.05);
                if (i === 1 || i === 3) {
                    this._snare(ctx, master, t + i * beat, 0.08);
                }
            }
        }

        return ctx.startRendering();
    }

    /**
     * sunset_warm — 따뜻한 방과후, 핑거피킹 기타 + 현악
     * A Major, 80 BPM
     */
    async _sunset_warm() {
        const bpm = 80, dur = 24;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 2.5, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.6;
        const wet = ctx.createGain(); wet.gain.value = 0.4;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // A - E - F#m - D
        const chords = [
            ['A3','C#4','E4'],
            ['E3','G#3','B3'],
            ['F#3','A3','C#4'],
            ['D3','F#3','A3']
        ];
        const bassNotes = ['A2','E2','F#2','D2'];
        // 핑거피킹 패턴 (Travis picking 근사)
        const pickPatterns = [
            [0, 2, 1, 2, 0, 2, 1, 2],
            [0, 2, 1, 2, 0, 2, 1, 2],
            [0, 2, 1, 2, 0, 2, 1, 2],
            [0, 2, 1, 2, 0, 2, 1, 2]
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;
            const chord = chords[ci];

            // 핑거피킹 기타
            pickPatterns[ci].forEach((ni, i) => {
                this._guitar(ctx, master, chord[ni], t + i * beat * 0.5, beat * 0.7, 0.18);
            });

            // 베이스 (홀수 비트)
            this._bass(ctx, master, bassNotes[ci], t, beat * 2, 0.18);
            this._bass(ctx, master, bassNotes[ci], t + beat * 2, beat * 2, 0.15);

            // 현악 패드 (긴 지속음)
            if (bar >= 2) {
                chord.forEach(n => {
                    this._strings(ctx, master, n, t, beat * 4, 0.08);
                });
            }
        }

        // 위에 간단한 멜로디 (피아노, 듬성듬성)
        const sparseNotes = [
            [0, 'C#5'], [2.5, 'E5'], [4, 'A5'], [7, 'F#5'],
            [10, 'G#5'], [12.5, 'E5'], [14, 'C#5'], [18, 'D5'],
            [20, 'A4'], [22, 'E5']
        ];
        sparseNotes.forEach(([bt, note]) => {
            this._piano(ctx, master, note, bt * beat, beat * 2, 0.2);
        });

        return ctx.startRendering();
    }

    /**
     * night_calm — 차분한 밤, 슬로우 피아노 + 앰비언트 패드
     * F Major, 60 BPM, 3/4
     */
    async _night_calm() {
        const bpm = 60, dur = 24; // 8 bars of 3/4
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.65;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.5;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // F - Dm - Bb - C (3/4)
        const chords = [
            ['F3','A3','C4'],
            ['D3','F3','A3'],
            ['Bb2','D3','F3'],
            ['C3','E3','G3']
        ];
        const bassNotes = ['F2','D2','Bb1','C2'];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 3 * beat;

            // 앰비언트 패드 (코드 전체)
            chords[ci].forEach(n => {
                this._pad(ctx, master, n, t, beat * 3, 0.1);
            });

            // 피아노 아르페지오 (3/4 패턴: 1+2+3+)
            const arpNotes = [...chords[ci], chords[ci][1], chords[ci][2], chords[ci][0]];
            arpNotes.forEach((n, i) => {
                this._piano(ctx, master, n, t + i * beat * 0.5, beat * 1.5, 0.18);
            });

            // 베이스 (1박)
            this._bass(ctx, master, bassNotes[ci], t, beat * 3, 0.12);
        }

        // 높은 멜로디 (피아노, 느리고 여백 있게)
        const highMel = [
            [0, 'A5'], [3, 'C6'], [6, 'F5'], [9.5, 'A5'],
            [12, 'D5'], [15, 'F5'], [18, 'E5'], [21, 'C5']
        ];
        highMel.forEach(([bt, n]) => {
            this._piano(ctx, master, n, bt * beat, beat * 2.5, 0.15);
        });

        return ctx.startRendering();
    }

    /**
     * morning_peaceful — 오르골 멜로디 + 부드러운 피아노
     * Eb Major, 72 BPM
     */
    async _morning_peaceful() {
        const bpm = 72, dur = 20;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 2.5, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.55;
        const wet = ctx.createGain(); wet.gain.value = 0.45;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Eb - Cm - Ab - Bb
        const chords = [
            ['Eb3','G3','Bb3'],
            ['C3','Eb3','G3'],
            ['Ab2','C3','Eb3'],
            ['Bb2','D3','F3']
        ];
        const bassNotes = ['Eb2','C2','Ab1','Bb1'];

        // 오르골 멜로디
        const musicBoxMel = [
            ['G5','Bb5','Eb6','Bb5','G5','F5','Eb5','G5'],
            ['Eb5','G5','C6','G5','Eb5','D5','C5','Eb5'],
            ['C5','Eb5','Ab5','Eb5','C5','Bb4','Ab4','C5'],
            ['D5','F5','Bb5','F5','D5','C5','Bb4','D5']
        ];

        for (let bar = 0; bar < 6; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 피아노 코드 (느리게 아르페지오)
            chords[ci].forEach((n, i) => {
                this._piano(ctx, master, n, t + i * beat * 0.3, beat * 3, 0.15);
            });

            // 오르골 멜로디
            musicBoxMel[ci].forEach((n, i) => {
                this._musicBox(ctx, master, n, t + i * beat * 0.5, beat * 0.8, 0.2);
            });

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 4, 0.1);
        }

        return ctx.startRendering();
    }

    /**
     * sea_theme — 귀엽고 활발한 캐릭터 테마 (세아)
     * Bb Major, 132 BPM, 피아노 + 실로폰 + 피치카토
     */
    async _sea_theme() {
        const bpm = 132, dur = 14.5;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 1.2, 3);
        const dry = ctx.createGain(); dry.gain.value = 0.75;
        const wet = ctx.createGain(); wet.gain.value = 0.25;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Bb - F - Gm - Eb
        const chords = [
            ['Bb3','D4','F4'],
            ['F3','A3','C4'],
            ['G3','Bb3','D4'],
            ['Eb3','G3','Bb3']
        ];
        const bassNotes = ['Bb2','F2','G2','Eb2'];

        // 밝고 빠른 멜로디
        const mel = [
            ['D5','F5','Bb5','D6','Bb5','F5','D5','F5'],
            ['C5','F5','A5','C6','A5','F5','C5','A5'],
            ['Bb4','D5','G5','Bb5','G5','D5','Bb4','D5'],
            ['Eb5','G5','Bb5','Eb6','Bb5','G5','Eb5','G5']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 피아노 반주 (비트에 맞춘 블록 코드)
            for (let i = 0; i < 4; i++) {
                chords[ci].forEach(n => {
                    this._piano(ctx, master, n, t + i * beat, beat * 0.8, 0.15);
                });
            }

            // 피치카토 현악 (빠른 플럭, 8분음표)
            const pizzNotes = [chords[ci][0], chords[ci][2], chords[ci][1], chords[ci][2]];
            for (let i = 0; i < 8; i++) {
                const pn = pizzNotes[i % 4];
                // 피치카토: 기타로 시뮬레이션 (매우 짧은 음)
                this._guitar(ctx, master, pn, t + i * beat * 0.5, beat * 0.2, 0.1);
            }

            // 실로폰 멜로디
            mel[ci].forEach((n, i) => {
                this._xylo(ctx, master, n, t + i * beat * 0.5, beat * 0.35, 0.18);
            });

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 2, 0.18);
            this._bass(ctx, master, bassNotes[ci], t + beat * 2, beat * 2, 0.15);

            // 킥 + 하이햇
            for (let i = 0; i < 4; i++) {
                this._kick(ctx, master, t + i * beat, 0.15);
                this._hihat(ctx, master, t + i * beat + beat * 0.5, 0.03, 0.04);
            }
        }

        return ctx.startRendering();
    }

    /**
     * riin_theme — 우아하고 신비로운 재즈 테마 (리인)
     * Db Major, 85 BPM, 재즈 피아노 + 색소폰
     */
    async _riin_theme() {
        const bpm = 85, dur = 22.6;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.65;
        const rev = this._reverb(ctx, 2.5, 1.8);
        const dry = ctx.createGain(); dry.gain.value = 0.6;
        const wet = ctx.createGain(); wet.gain.value = 0.4;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 재즈 보이싱: Dbmaj7 - Bbm7 - Ebm7 - Ab7
        const chords = [
            ['Db3','F3','Ab3','C4'],    // Dbmaj7
            ['Bb2','Db3','F3','Ab3'],   // Bbm7
            ['Eb3','Gb3','Bb3','Db4'],  // Ebm7
            ['Ab2','C3','Eb3','Gb3']    // Ab7
        ];
        const bassNotes = ['Db2','Bb1','Eb2','Ab1'];

        // 색소폰 멜로디 (느리고 표현적인)
        const saxMel = [
            ['F4','Ab4','C5','Db5'],
            ['Db5','Bb4','Ab4','F4'],
            ['Eb4','Gb4','Bb4','Db5'],
            ['C5','Ab4','Eb4','C4']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 재즈 피아노 보이싱 (스윙 리듬)
            for (let i = 0; i < 4; i++) {
                const swing = i % 2 === 1 ? beat * 0.15 : 0;
                chords[ci].forEach(n => {
                    this._piano(ctx, master, n, t + i * beat + swing, beat * 0.7, 0.15);
                });
            }

            // 색소폰 솔로
            saxMel[ci].forEach((n, i) => {
                const swing = i % 2 === 1 ? beat * 0.15 : 0;
                this._sax(ctx, master, n, t + i * beat + swing, beat * 0.9, 0.18);
            });

            // 워킹 베이스
            [0, 1, 2, 3].forEach(i => {
                const swing = i % 2 === 1 ? beat * 0.1 : 0;
                this._bass(ctx, master, bassNotes[ci], t + i * beat + swing, beat * 0.8, 0.15);
            });

            // 가벼운 브러시 (하이햇으로 시뮬레이션)
            for (let i = 0; i < 8; i++) {
                const swing = i % 2 === 1 ? beat * 0.15 : 0;
                this._hihat(ctx, master, t + i * beat * 0.5 + swing, 0.06, 0.03);
            }
        }

        return ctx.startRendering();
    }

    /**
     * eunsu_theme — 따뜻한 돌봄의 왈츠, 첼로 + 피아노
     * Ab Major, 72 BPM, 3/4
     */
    async _eunsu_theme() {
        const bpm = 72, dur = 20;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.65;
        const rev = this._reverb(ctx, 2.5, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.55;
        const wet = ctx.createGain(); wet.gain.value = 0.45;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Ab - Fm - Db - Eb (왈츠)
        const chords = [
            ['Ab3','C4','Eb4'],
            ['F3','Ab3','C4'],
            ['Db3','F3','Ab3'],
            ['Eb3','G3','Bb3']
        ];
        const bassNotes = ['Ab2','F2','Db2','Eb2'];

        // 첼로 멜로디 (레가토, 길게)
        const celloMel = [
            ['C4','Eb4','Ab4','Eb4'],
            ['Ab3','C4','F4','C4'],
            ['F3','Ab3','Db4','Ab3'],
            ['G3','Bb3','Eb4','Bb3']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 3 * beat;

            // 피아노 왈츠 패턴 (쿵-짝-짝)
            this._piano(ctx, master, bassNotes[ci], t, beat * 0.9, 0.22);
            this._playChord(ctx, master, 'piano', chords[ci], t + beat, beat * 0.7, 0.14);
            this._playChord(ctx, master, 'piano', chords[ci], t + beat * 2, beat * 0.7, 0.12);

            // 첼로 멜로디 (3/4에서 각 음 3/4박)
            celloMel[ci].forEach((n, i) => {
                this._cello(ctx, master, n, t + i * beat * 0.75, beat * 1.2, 0.2);
            });

            // 현악 패드 (은밀한 우울함 — 마이너 텐션 살짝)
            if (bar >= 4) {
                const padChord = ci === 0 ? ['Ab3','C4','Eb4','Gb4'] : chords[ci];
                padChord.forEach(n => {
                    this._strings(ctx, master, n, t, beat * 3, 0.06);
                });
            }
        }

        return ctx.startRendering();
    }

    // ═══════════════════════════════════════════════════════════════════
    // ═══ 스릴러 페이즈 BGM ═══
    // ═══════════════════════════════════════════════════════════════════

    /**
     * morning_uneasy — 불안한 아침, 살짝 어긋난 피아노
     * C Major에서 이탈, 92 BPM
     */
    async _morning_uneasy() {
        const bpm = 92, dur = 20.9;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 2, 2.5);
        const dry = ctx.createGain(); dry.gain.value = 0.65;
        const wet = ctx.createGain(); wet.gain.value = 0.35;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 정상적인 학교 BGM처럼 시작하지만 음이 살짝 불협화
        const chords = [
            ['C4','E4','G4'],           // 정상
            ['A3','C4','Eb4'],          // Am에 Eb 추가 (불협화)
            ['F3','A3','C4'],           // 정상
            ['G3','B3','Db4']           // G에 Db (불안)
        ];
        const bassNotes = ['C2','A1','F1','G1'];

        const melody = [
            ['E5','G5','C6','G5','E5','D5','Eb5','C5'],  // Eb = 불협
            ['C5','Eb5','A5','Eb5','C5','B4','A4','Ab4'], // Ab = 이상
            ['A4','C5','F5','C5','A4','G4','F4','A4'],    // 정상
            ['B4','Db5','G5','Db5','B4','A4','Ab4','B4']  // 반음 이탈
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 불안정한 피아노 코드
            chords[ci].forEach((n, i) => {
                this._piano(ctx, master, n, t + i * 0.03, beat * 3, 0.18);
            });

            // 멜로디 (살짝 어긋난 음 포함)
            melody[ci].forEach((n, i) => {
                this._piano(ctx, master, n, t + i * beat * 0.5, beat * 0.45, 0.15);
            });

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 4, 0.12);

            // 아주 미세한 고주파 드론 (불안감)
            if (bar >= 2) {
                const dOsc = ctx.createOscillator();
                dOsc.type = 'sine';
                dOsc.frequency.value = 4200 + Math.random() * 200;
                const dG = ctx.createGain();
                dG.gain.setValueAtTime(0, t);
                dG.gain.linearRampToValueAtTime(0.008, t + beat);
                dG.gain.setValueAtTime(0.008, t + beat * 3);
                dG.gain.linearRampToValueAtTime(0, t + beat * 4);
                dOsc.connect(dG);
                dG.connect(master);
                dOsc.start(t);
                dOsc.stop(t + beat * 4 + 0.1);
            }
        }

        return ctx.startRendering();
    }

    /**
     * daily_tense — 긴장감 있는 학교생활
     * D Minor, 95 BPM
     */
    async _daily_tense() {
        const bpm = 95, dur = 20.2;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 2, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.65;
        const wet = ctx.createGain(); wet.gain.value = 0.35;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Dm - Gm - A7 - Dm
        const chords = [
            ['D3','F3','A3'],
            ['G3','Bb3','D4'],
            ['A3','C#4','E4','G4'],
            ['D3','F3','A3']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 표면: 일상 멜로디 (피아노, 하지만 단조)
            chords[ci].forEach((n, i) => {
                this._piano(ctx, master, n, t + i * 0.05, beat * 2, 0.15);
            });

            // 아래: 첼로 드론 (위협적인 저음)
            this._drone(ctx, master, 'D1', t, beat * 4, 0.08);

            // 현악 트레몰로 (빠른 반복)
            if (bar >= 2) {
                for (let i = 0; i < 16; i++) {
                    const tNote = i % 2 === 0 ? 'A3' : 'F3';
                    this._strings(ctx, master, tNote, t + i * beat * 0.25, beat * 0.2, 0.04);
                }
            }

            // 피아노 상부 멜로디 (마이너)
            const minorMel = ['D5','F5','A5','E5','D5','C5','Bb4','A4'];
            minorMel.forEach((n, i) => {
                if (bar >= 1) {
                    this._piano(ctx, master, n, t + i * beat * 0.5, beat * 0.45, 0.12);
                }
            });
        }

        return ctx.startRendering();
    }

    /**
     * tension — 고조되는 긴장감
     * E Minor, 80 BPM
     */
    async _tension() {
        const bpm = 80, dur = 24;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.6;
        const wet = ctx.createGain(); wet.gain.value = 0.4;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 낮은 드론
        this._drone(ctx, master, 'E1', 0, dur, 0.1);

        // 심장박동 펄스
        for (let i = 0; i < Math.floor(dur / (beat * 2)); i++) {
            const t = i * beat * 2;
            this._kick(ctx, master, t, 0.12);
            this._kick(ctx, master, t + beat * 0.3, 0.08);
        }

        // 간헐적 현악 찌르기 (스타카토)
        const stabs = [2, 5, 8, 10, 14, 17, 20, 22];
        stabs.forEach(bt => {
            const t = bt * beat;
            ['E4','B4','G4'].forEach(n => {
                this._strings(ctx, master, n, t, beat * 0.3, 0.15);
            });
        });

        // 고음 사인 톤 (불안)
        const highOsc = ctx.createOscillator();
        highOsc.type = 'sine';
        highOsc.frequency.value = 3800;
        const hG = ctx.createGain();
        hG.gain.setValueAtTime(0, 0);
        hG.gain.linearRampToValueAtTime(0.015, dur * 0.5);
        hG.gain.linearRampToValueAtTime(0.008, dur);
        highOsc.connect(hG);
        hG.connect(master);
        highOsc.start(0);
        highOsc.stop(dur);

        // 느린 피아노 (단음, 물방울처럼)
        const drops = [3, 7.5, 11, 15.5, 19, 23];
        drops.forEach(bt => {
            this._piano(ctx, master, 'B5', bt * beat, beat * 2, 0.12);
        });

        return ctx.startRendering();
    }

    /**
     * night_ambient — 어둡고 기이한 앰비언트
     * 무조성, 50 BPM
     */
    async _night_ambient() {
        const bpm = 50, dur = 20;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.5;
        const rev = this._reverb(ctx, 4, 1);
        const dry = ctx.createGain(); dry.gain.value = 0.4;
        const wet = ctx.createGain(); wet.gain.value = 0.6;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 깊은 저주파 드론
        this._drone(ctx, master, 30, 0, dur, 0.12);
        this._drone(ctx, master, 45, 0, dur, 0.06);

        // 바람 소리 (필터드 노이즈)
        const windBuf = this._noise(ctx, dur);
        const wind = ctx.createBufferSource();
        wind.buffer = windBuf;
        const wBpf = ctx.createBiquadFilter();
        wBpf.type = 'bandpass';
        wBpf.frequency.value = 300;
        wBpf.Q.value = 0.5;
        const wG = ctx.createGain();
        // 파도처럼 변동
        for (let i = 0; i < dur; i += 3) {
            wG.gain.setValueAtTime(0.02, i);
            wG.gain.linearRampToValueAtTime(0.06, i + 1.5);
            wG.gain.linearRampToValueAtTime(0.02, i + 3);
        }
        wind.connect(wBpf);
        wBpf.connect(wG);
        wG.connect(master);
        wind.start(0);
        wind.stop(dur);

        // 금속 삐걱거림 (간헐적)
        [3, 8, 13, 17].forEach(t => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.linearRampToValueAtTime(80, t + 0.5);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.03, t + 0.1);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            const hpf = ctx.createBiquadFilter();
            hpf.type = 'highpass';
            hpf.frequency.value = 1000;
            osc.connect(hpf);
            hpf.connect(g);
            g.connect(master);
            osc.start(t);
            osc.stop(t + 0.6);
        });

        return ctx.startRendering();
    }

    /**
     * night_tension — 초조한 밤, 심장박동 + 단음 피아노
     * B Minor, 65 BPM
     */
    async _night_tension() {
        const bpm = 65, dur = 22.2;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.55;
        const rev = this._reverb(ctx, 3.5, 1.2);
        const dry = ctx.createGain(); dry.gain.value = 0.5;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 심장박동 (깊은 저음)
        for (let t = 0; t < dur; t += beat * 2) {
            this._kick(ctx, master, t, 0.1);
            this._kick(ctx, master, t + beat * 0.35, 0.06);
        }

        // 불안한 고주파 사인 톤
        const highOsc = ctx.createOscillator();
        highOsc.type = 'sine';
        highOsc.frequency.value = 5500;
        const hG = ctx.createGain();
        hG.gain.value = 0.005;
        highOsc.connect(hG);
        hG.connect(master);
        highOsc.start(0);
        highOsc.stop(dur);

        // 드론 (B1)
        this._drone(ctx, master, 'B1', 0, dur, 0.06);

        // 물방울 피아노 (랜덤한 듯하지만 B minor 스케일)
        const dropNotes = ['B4','D5','F#5','A5','E5','B5','F#4','D5','C#5','A4','E5','B4','G5','D5'];
        dropNotes.forEach((n, i) => {
            const t = (i * 1.5) + Math.random() * 0.3;
            if (t < dur - 2) {
                this._piano(ctx, master, n, t, beat * 3, 0.12);
            }
        });

        return ctx.startRendering();
    }

    /**
     * nightmare — 악몽 호러 시퀀스
     * 무조성, 100 BPM 불규칙
     */
    async _nightmare() {
        const bpm = 100, dur = 16;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.55;

        // 드라이하게 (리버브 적게)
        const rev = this._reverb(ctx, 1.5, 3);
        const dry = ctx.createGain(); dry.gain.value = 0.8;
        const wet = ctx.createGain(); wet.gain.value = 0.2;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 왜곡된 드론
        this._drone(ctx, master, 35, 0, dur, 0.12);

        // 글리치 노이즈 버스트
        for (let i = 0; i < 20; i++) {
            const t = Math.random() * (dur - 0.5);
            const d = 0.05 + Math.random() * 0.3;
            const nBuf = this._noise(ctx, d);
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const g = ctx.createGain();
            const bpf = ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.value = 500 + Math.random() * 5000;
            bpf.Q.value = 2 + Math.random() * 8;
            g.gain.setValueAtTime(0.05 + Math.random() * 0.1, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + d);
            src.connect(bpf);
            bpf.connect(g);
            g.connect(master);
            src.start(t);
            src.stop(t + d + 0.01);
        }

        // 왜곡된 피아노 (역재생 느낌 — 역엔벨로프)
        const reversePianoNotes = ['C2','Eb4','Ab5','B2','F#4','D5','G3','Bb4'];
        reversePianoNotes.forEach((n, i) => {
            const t = i * 2 + Math.random() * 0.5;
            if (t < dur - 2) {
                const freq = this._f(n);
                const g = ctx.createGain();
                g.connect(master);
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                osc.detune.value = (Math.random() - 0.5) * 50;
                osc.connect(g);

                // 역엔벨로프: 조용히 시작 → 크게
                const rDur = 1.5;
                g.gain.setValueAtTime(0.001, t);
                g.gain.exponentialRampToValueAtTime(0.2, t + rDur * 0.8);
                g.gain.exponentialRampToValueAtTime(0.001, t + rDur);
                osc.start(t);
                osc.stop(t + rDur + 0.1);
            }
        });

        // 갑작스러운 크레센도 (정적에서 폭발)
        const burstT = dur * 0.6;
        const burstBuf = this._noise(ctx, 1.5);
        const burst = ctx.createBufferSource();
        burst.buffer = burstBuf;
        const bG = ctx.createGain();
        bG.gain.setValueAtTime(0, burstT);
        bG.gain.linearRampToValueAtTime(0.25, burstT + 0.3);
        bG.gain.exponentialRampToValueAtTime(0.001, burstT + 1.5);
        burst.connect(bG);
        bG.connect(master);
        burst.start(burstT);
        burst.stop(burstT + 1.6);

        return ctx.startRendering();
    }

    /**
     * thriller_ambient — 어두운 수사 분위기
     * C# Minor, 70 BPM
     */
    async _thriller_ambient() {
        const bpm = 70, dur = 22;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.55;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.5;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 인더스트리얼 드론 (C#1)
        this._drone(ctx, master, 'C#1', 0, dur, 0.1);

        // 금속 사운드 (간헐적)
        for (let i = 0; i < 8; i++) {
            const t = i * 2.7 + Math.random() * 0.5;
            if (t < dur - 1) {
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = 150 + Math.random() * 100;
                const hpf = ctx.createBiquadFilter();
                hpf.type = 'highpass';
                hpf.frequency.value = 2000;
                const g = ctx.createGain();
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.04, t + 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
                osc.connect(hpf);
                hpf.connect(g);
                g.connect(master);
                osc.start(t);
                osc.stop(t + 0.9);
            }
        }

        // 깊은 베이스 험 (주기적)
        const humOsc = ctx.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 55;
        const humG = ctx.createGain();
        // 느린 펄스
        for (let t = 0; t < dur; t += 4) {
            humG.gain.setValueAtTime(0.03, t);
            humG.gain.linearRampToValueAtTime(0.08, t + 2);
            humG.gain.linearRampToValueAtTime(0.03, t + 4);
        }
        humOsc.connect(humG);
        humG.connect(master);
        humOsc.start(0);
        humOsc.stop(dur);

        // 현악 (위협적)
        for (let bar = 0; bar < 5; bar++) {
            const t = bar * 4 * beat;
            ['C#3','E3','G#3'].forEach(n => {
                this._strings(ctx, master, n, t, beat * 4, 0.06);
            });
        }

        return ctx.startRendering();
    }

    /**
     * horror_ambient — 지하 실험실 사운드스케이프
     * 무조성 드론, 45 BPM
     */
    async _horror_ambient() {
        const bpm = 45, dur = 20;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.5;
        const rev = this._reverb(ctx, 4, 1);
        const dry = ctx.createGain(); dry.gain.value = 0.3;
        const wet = ctx.createGain(); wet.gain.value = 0.7;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 깊은 드론 (거의 안 들리는)
        this._drone(ctx, master, 28, 0, dur, 0.08);

        // 물방울 소리
        for (let i = 0; i < 12; i++) {
            const t = i * 1.6 + Math.random() * 0.5;
            if (t < dur - 0.5) {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200 + Math.random() * 400, t);
                osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.06, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                osc.connect(g);
                g.connect(master);
                osc.start(t);
                osc.stop(t + 0.2);
            }
        }

        // 형광등 윙윙 (60Hz hum + harmonics)
        const humFreqs = [60, 120, 180];
        humFreqs.forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = ctx.createGain();
            g.gain.value = freq === 60 ? 0.02 : 0.008;
            // 간헐적 깜빡임
            const lfo = ctx.createOscillator();
            lfo.type = 'square';
            lfo.frequency.value = 0.08;
            const lfoG = ctx.createGain();
            lfoG.gain.value = g.gain.value * 0.5;
            lfo.connect(lfoG);
            lfoG.connect(g.gain);
            osc.connect(g);
            g.connect(master);
            osc.start(0);
            osc.stop(dur);
            lfo.start(0);
            lfo.stop(dur);
        });

        // 금속 긁힘 (먼 곳)
        [5, 12, 18].forEach(t => {
            const nBuf = this._noise(ctx, 1.2);
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const bpf = ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.value = 2500;
            bpf.Q.value = 5;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.015, t + 0.3);
            g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
            src.connect(bpf);
            bpf.connect(g);
            g.connect(master);
            src.start(t);
            src.stop(t + 1.3);
        });

        return ctx.startRendering();
    }

    /**
     * chase — 긴박한 추격, 빠른 일렉트로닉
     * 140 BPM
     */
    async _chase() {
        const bpm = 140, dur = 13.7;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 0.8, 4);
        const dry = ctx.createGain(); dry.gain.value = 0.85;
        const wet = ctx.createGain(); wet.gain.value = 0.15;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 4-on-the-floor 킥
        for (let t = 0; t < dur; t += beat) {
            this._kick(ctx, master, t, 0.3);
        }

        // 오프비트 하이햇
        for (let t = beat * 0.5; t < dur; t += beat) {
            this._hihat(ctx, master, t, 0.04, 0.1);
        }

        // 스네어 (2, 4박)
        for (let t = beat; t < dur; t += beat * 2) {
            this._snare(ctx, master, t, 0.15);
        }

        // 신스 아르페지오 (Am → Em → Dm → Am)
        const arpChords = [
            ['A3','C4','E4','A4','C5','E5','A5','C6'],
            ['E3','G3','B3','E4','G4','B4','E5','G5'],
            ['D3','F3','A3','D4','F4','A4','D5','F5'],
            ['A3','C4','E4','A4','C5','E5','A5','C6']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;
            const arp = arpChords[ci];

            // 16분음표 아르페지오
            for (let i = 0; i < 16; i++) {
                const ni = i % arp.length;
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = this._f(arp[ni]);
                const lpf = ctx.createBiquadFilter();
                lpf.type = 'lowpass';
                lpf.frequency.value = 3000;
                const g = ctx.createGain();
                const nt = t + i * beat * 0.25;
                g.gain.setValueAtTime(0.12, nt);
                g.gain.exponentialRampToValueAtTime(0.001, nt + beat * 0.23);
                osc.connect(lpf);
                lpf.connect(g);
                g.connect(master);
                osc.start(nt);
                osc.stop(nt + beat * 0.25);
            }
        }

        // 베이스 라인 (옥타브)
        const bassLine = ['A1','A1','E1','E1','D1','D1','A1','A1'];
        bassLine.forEach((n, i) => {
            const t = i * 4 * beat;
            for (let j = 0; j < 4; j++) {
                this._bass(ctx, master, n, t + j * beat, beat * 0.8, 0.25);
            }
        });

        return ctx.startRendering();
    }

    /**
     * chase_intense — 극도로 강렬한 최종 추격
     * 160 BPM, 더 무겁고 왜곡
     */
    async _chase_intense() {
        const bpm = 160, dur = 12;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        master.connect(ctx.destination);

        // 킥 (4-on-the-floor + 추가 서브킥)
        for (let t = 0; t < dur; t += beat) {
            this._kick(ctx, master, t, 0.35);
            if (Math.random() > 0.5) {
                this._kick(ctx, master, t + beat * 0.5, 0.15);
            }
        }

        // 공격적 하이햇 (16분)
        for (let t = 0; t < dur; t += beat * 0.25) {
            this._hihat(ctx, master, t, 0.03, 0.08 + Math.random() * 0.05);
        }

        // 스네어
        for (let t = beat; t < dur; t += beat * 2) {
            this._snare(ctx, master, t, 0.2);
        }

        // 왜곡된 베이스 (사각파)
        for (let t = 0; t < dur; t += beat) {
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.value = 55;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.2, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.8);
            osc.connect(g);
            g.connect(master);
            osc.start(t);
            osc.stop(t + beat);
        }

        // 글리치 브레이크 (8마디마다)
        const breakBuf = this._noise(ctx, 0.5);
        for (let bar = 0; bar < 3; bar++) {
            const t = (bar * 4 + 3.5) * 4 * beat;
            if (t < dur - 0.5) {
                const src = ctx.createBufferSource();
                src.buffer = breakBuf;
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.15, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                src.connect(g);
                g.connect(master);
                src.start(t);
                src.stop(t + 0.35);
            }
        }

        // 심장박동 오버드라이브 (빠른 펄스)
        for (let t = 0; t < dur; t += beat * 0.5) {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, t);
            osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc.connect(g);
            g.connect(master);
            osc.start(t);
            osc.stop(t + 0.12);
        }

        // 신스 리드 (스크리밍)
        const leadNotes = ['A4','C5','D5','E5','A5','E5','D5','C5'];
        for (let bar = 0; bar < 4; bar++) {
            leadNotes.forEach((n, i) => {
                const t = bar * 8 * beat + i * beat;
                if (t < dur - beat) {
                    const osc = ctx.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.value = this._f(n);
                    const lpf = ctx.createBiquadFilter();
                    lpf.type = 'lowpass';
                    lpf.frequency.value = 4000;
                    const g = ctx.createGain();
                    g.gain.setValueAtTime(0.1, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.9);
                    osc.connect(lpf);
                    lpf.connect(g);
                    g.connect(master);
                    osc.start(t);
                    osc.stop(t + beat);
                }
            });
        }

        return ctx.startRendering();
    }

    /**
     * climax — 에픽 오케스트라 클라이맥스
     * C Minor, 130 BPM
     */
    async _climax() {
        const bpm = 130, dur = 14.8;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 2, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.65;
        const wet = ctx.createGain(); wet.gain.value = 0.35;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Cm - Ab - Eb - Bb (에픽 진행)
        const chords = [
            ['C3','Eb3','G3','C4','Eb4','G4'],
            ['Ab2','C3','Eb3','Ab3','C4','Eb4'],
            ['Eb3','G3','Bb3','Eb4','G4','Bb4'],
            ['Bb2','D3','F3','Bb3','D4','F4']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 현악 (풀 오케스트라 느낌)
            chords[ci].forEach(n => {
                this._strings(ctx, master, n, t, beat * 4, 0.1);
            });

            // 금관 팡파르 (사각파 기반, 높은 음역)
            if (bar >= 2) {
                const brassNotes = chords[ci].slice(3);
                brassNotes.forEach(n => {
                    const freq = this._f(n);
                    const osc = ctx.createOscillator();
                    osc.type = 'square';
                    osc.frequency.value = freq;
                    const lpf = ctx.createBiquadFilter();
                    lpf.type = 'lowpass';
                    lpf.frequency.value = 2000;
                    const g = ctx.createGain();
                    g.gain.setValueAtTime(0, t);
                    g.gain.linearRampToValueAtTime(0.08, t + 0.1);
                    g.gain.setValueAtTime(0.08, t + beat * 3.5);
                    g.gain.linearRampToValueAtTime(0, t + beat * 4);
                    osc.connect(lpf);
                    lpf.connect(g);
                    g.connect(master);
                    osc.start(t);
                    osc.stop(t + beat * 4 + 0.1);
                });
            }

            // 팀파니 롤 (4마디마다)
            if (bar % 4 === 3) {
                for (let i = 0; i < 8; i++) {
                    const rt = t + i * beat * 0.5;
                    this._kick(ctx, master, rt, 0.2 + i * 0.02);
                }
            }

            // 킥 + 스네어
            for (let i = 0; i < 4; i++) {
                this._kick(ctx, master, t + i * beat, 0.2);
                if (i === 1 || i === 3) {
                    this._snare(ctx, master, t + i * beat, 0.12);
                }
            }
        }

        // 베이스 (파워풀)
        const bassLine = ['C2','Ab1','Eb2','Bb1'];
        for (let bar = 0; bar < 8; bar++) {
            const t = bar * 4 * beat;
            this._bass(ctx, master, bassLine[bar % 4], t, beat * 4, 0.25);
        }

        return ctx.startRendering();
    }

    /**
     * eunsu_dark_theme — 뒤틀린 은수 테마 (왈츠가 무너짐)
     * Ab Minor, 60 BPM (점점 느려짐), 3/4
     */
    async _eunsu_dark_theme() {
        const dur = 24;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 3.5, 1.2);
        const dry = ctx.createGain(); dry.gain.value = 0.45;
        const wet = ctx.createGain(); wet.gain.value = 0.55;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 점점 느려지는 템포 (60 → 40 BPM)
        const bars = 8;
        let t = 0;
        for (let bar = 0; bar < bars; bar++) {
            const bpm = 60 - (bar / bars) * 20; // 60 → 40
            const beat = 60 / bpm;
            const barDur = beat * 3;

            // Ab minor 왈츠 (뒤틀린)
            const chords = [
                ['Ab2','Cb3','Eb3'],
                ['E2','Ab2','B2'],     // 불협화
                ['Db2','Fb2','Ab2'],
                ['Eb2','Gb2','Bb2']
            ];
            const ci = bar % 4;

            // 뒤틀린 첼로 멜로디 (디튠 점점 심해짐)
            const detuneAmt = bar * 15; // 점점 더 벗어남
            const melNotes = ['Cb4','Eb4','Ab4','Eb4'];
            melNotes.forEach((n, i) => {
                const freq = this._f(n);
                const g = ctx.createGain();
                const lpf = ctx.createBiquadFilter();
                lpf.type = 'lowpass';
                lpf.frequency.value = 1200 - bar * 80;
                g.connect(lpf);
                lpf.connect(master);

                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = freq;
                osc.detune.value = detuneAmt * (Math.random() - 0.3);
                osc.connect(g);

                const nt = t + i * beat * 0.75;
                const nd = beat * 1.0;
                g.gain.setValueAtTime(0, nt);
                g.gain.linearRampToValueAtTime(0.15, nt + 0.15);
                g.gain.setValueAtTime(0.15, nt + nd - 0.2);
                g.gain.linearRampToValueAtTime(0, nt + nd);

                osc.start(nt);
                osc.stop(nt + nd + 0.1);
            });

            // 피아노 왈츠 (점점 불안정)
            this._piano(ctx, master, chords[ci][0], t, beat * 0.8, 0.18);
            this._playChord(ctx, master, 'piano', chords[ci], t + beat, beat * 0.6, 0.1);
            this._playChord(ctx, master, 'piano', chords[ci], t + beat * 2, beat * 0.6, 0.08);

            // 오르골 (점점 느려지는)
            if (bar >= 3) {
                this._musicBox(ctx, master, melNotes[0], t + beat * 0.5, beat * 0.5, 0.12);
                this._musicBox(ctx, master, melNotes[2], t + beat * 1.5, beat * 0.5, 0.1);
            }

            t += barDur;
        }

        return ctx.startRendering();
    }

    // ═══════════════════════════════════════════════════════════════════
    // ═══ 엔딩 BGM ═══
    // ═══════════════════════════════════════════════════════════════════

    /**
     * ending_hope — 트루 엔딩, 희망찬 감동
     * Eb Major, 88→120 BPM
     */
    async _ending_hope() {
        const dur = 48; // 길게
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.7;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.55;
        const wet = ctx.createGain(); wet.gain.value = 0.45;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 파트 1: 솔로 피아노 인트로 (88 BPM, 16초)
        let t = 0;
        const bpm1 = 88;
        const beat1 = 60 / bpm1;
        const introChords = [
            ['Eb3','G3','Bb3'],
            ['Cm3','Eb3','G3'],
            ['Ab3','C4','Eb4'],
            ['Bb3','D4','F4']
        ];

        for (let bar = 0; bar < 4; bar++) {
            const chord = introChords[bar];
            const bt = t + bar * 4 * beat1;

            // 느린 아르페지오
            chord.forEach((n, i) => {
                this._piano(ctx, master, n, bt + i * beat1 * 0.5, beat1 * 3, 0.2);
            });

            // 상부 멜로디
            const mel = ['G5','Bb5','Eb6','Bb5'];
            mel.forEach((n, i) => {
                this._piano(ctx, master, n, bt + i * beat1, beat1 * 0.9, 0.18);
            });
        }

        // 파트 2: 현악 가세 (100 BPM, 16초)
        t = 16;
        const bpm2 = 100;
        const beat2 = 60 / bpm2;

        for (let bar = 0; bar < 4; bar++) {
            const chord = introChords[bar];
            const bt = t + bar * 4 * beat2;

            // 피아노 계속
            chord.forEach((n, i) => {
                this._piano(ctx, master, n, bt + i * beat2 * 0.5, beat2 * 2, 0.2);
            });

            // 현악 추가
            chord.forEach(n => {
                this._strings(ctx, master, n, bt, beat2 * 4, 0.12);
            });

            // 더 강한 멜로디
            const mel2 = ['Eb5','G5','Bb5','Eb6','D6','C6','Bb5','G5'];
            mel2.forEach((n, i) => {
                this._piano(ctx, master, n, bt + i * beat2 * 0.5, beat2 * 0.45, 0.22);
            });

            this._bass(ctx, master, ['Eb2','C2','Ab1','Bb1'][bar], bt, beat2 * 4, 0.15);
        }

        // 파트 3: 풀 오케스트라 (120 BPM, 16초)
        t = 32;
        const bpm3 = 120;
        const beat3 = 60 / bpm3;

        for (let bar = 0; bar < 4; bar++) {
            const chord = introChords[bar];
            const bt = t + bar * 4 * beat3;

            // 풀 현악
            [...chord, 'Eb4', 'G4', 'Bb4'].forEach(n => {
                this._strings(ctx, master, n, bt, beat3 * 4, 0.15);
            });

            // 첼로 라인
            this._cello(ctx, master, chord[0], bt, beat3 * 4, 0.15);

            // 피아노 (힘차게)
            const mel3 = ['Eb6','G6','Bb5','Eb6','G5','Bb5','D6','Eb6'];
            mel3.forEach((n, i) => {
                this._piano(ctx, master, n, bt + i * beat3 * 0.5, beat3 * 0.45, 0.25);
            });

            // 베이스
            this._bass(ctx, master, ['Eb2','C2','Ab1','Bb1'][bar], bt, beat3 * 4, 0.2);

            // 드럼
            for (let i = 0; i < 4; i++) {
                this._kick(ctx, master, bt + i * beat3, 0.15);
                if (i === 1 || i === 3) this._snare(ctx, master, bt + i * beat3, 0.08);
            }
        }

        return ctx.startRendering();
    }

    /**
     * ending_melancholy — 슬픈 엔딩, 어쿠스틱 기타 + 빗소리
     * F# Minor, 68 BPM
     */
    async _ending_melancholy() {
        const bpm = 68, dur = 36;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.5;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 빗소리 배경
        const rainBuf = this._noise(ctx, dur);
        const rain = ctx.createBufferSource();
        rain.buffer = rainBuf;
        const rLpf = ctx.createBiquadFilter();
        rLpf.type = 'lowpass';
        rLpf.frequency.value = 2500;
        const rG = ctx.createGain();
        rG.gain.value = 0.04;
        rain.connect(rLpf);
        rLpf.connect(rG);
        rG.connect(master);
        rain.start(0);
        rain.stop(dur);

        // F#m - D - A - E
        const chords = [
            ['F#3','A3','C#4'],
            ['D3','F#3','A3'],
            ['A3','C#4','E4'],
            ['E3','G#3','B3']
        ];
        const bassNotes = ['F#2','D2','A2','E2'];

        for (let bar = 0; bar < 10; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 핑거피킹 기타
            const pick = [0, 2, 1, 2, 0, 2, 1, 2];
            pick.forEach((ni, i) => {
                if (t + i * beat * 0.5 < dur - 1) {
                    this._guitar(ctx, master, chords[ci][ni], t + i * beat * 0.5, beat * 0.7, 0.18);
                }
            });

            // 베이스
            if (t < dur - 2) {
                this._bass(ctx, master, bassNotes[ci], t, beat * 4, 0.12);
            }

            // 4마디 이후 현악 추가
            if (bar >= 4 && t < dur - 3) {
                chords[ci].forEach(n => {
                    this._strings(ctx, master, n, t, beat * 4, 0.06);
                });
            }
        }

        return ctx.startRendering();
    }

    /**
     * ending_bittersweet — 씁쓸달콤한 열린 엔딩
     * D Major ↔ B Minor, 76 BPM
     */
    async _ending_bittersweet() {
        const bpm = 76, dur = 32;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 3, 1.8);
        const dry = ctx.createGain(); dry.gain.value = 0.5;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // D → Bm → G → A (밝은) ↔ Bm → G → Em → F#7 (어두운)
        const brightChords = [
            ['D3','F#3','A3'],
            ['B2','D3','F#3'],
            ['G2','B2','D3'],
            ['A2','C#3','E3']
        ];
        const darkChords = [
            ['B2','D3','F#3'],
            ['G2','B2','D3'],
            ['E2','G2','B2'],
            ['F#2','A#2','C#3']
        ];

        for (let bar = 0; bar < 10; bar++) {
            const t = bar * 4 * beat;
            if (t >= dur - 2) break;

            const chords = bar < 5 ? brightChords : darkChords;
            const ci = bar % 4;

            // 피아노 아르페지오
            const chord = chords[ci];
            const arpPattern = [0, 1, 2, 1, 0, 2, 1, 0];
            arpPattern.forEach((ni, i) => {
                const nt = t + i * beat * 0.5;
                if (nt < dur - 1) {
                    this._piano(ctx, master, chord[ni], nt, beat * 1.2, 0.18);
                }
            });

            // 현악 (서서히 사라지는)
            if (bar < 8) {
                const vol = 0.08 * (1 - bar / 10);
                chord.forEach(n => {
                    this._strings(ctx, master, n, t, beat * 4, vol);
                });
            }

            // 베이스
            this._bass(ctx, master, chord[0], t, beat * 4, 0.1);
        }

        return ctx.startRendering();
    }

    /**
     * ending_dark — 감금 엔딩, 오르골이 느려지며 뒤틀림
     * G Minor, 60→40 BPM
     */
    async _ending_dark() {
        const dur = 32;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 4, 1);
        const dry = ctx.createGain(); dry.gain.value = 0.35;
        const wet = ctx.createGain(); wet.gain.value = 0.65;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 오르골 멜로디 (G minor: G-Bb-D)
        const melody = ['G5','Bb5','D6','Bb5','G5','F5','Eb5','D5'];
        const bars = 8;
        let t = 0;

        for (let bar = 0; bar < bars; bar++) {
            const progress = bar / bars;
            const bpm = 60 - progress * 20; // 60 → 40
            const beat = 60 / bpm;
            const detuneAmt = progress * 80; // 점점 뒤틀림

            melody.forEach((n, i) => {
                const nt = t + i * beat * 0.5;
                if (nt < dur - 1) {
                    const freq = this._f(n);
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = freq * (1 + (Math.random() - 0.5) * detuneAmt * 0.001);
                    const g = ctx.createGain();
                    const vol = 0.25 * (1 - progress * 0.4);
                    g.gain.setValueAtTime(vol, nt);
                    g.gain.exponentialRampToValueAtTime(vol * 0.1, nt + beat * 0.7);
                    g.gain.exponentialRampToValueAtTime(0.001, nt + beat);
                    osc.connect(g);
                    g.connect(master);
                    osc.start(nt);
                    osc.stop(nt + beat + 0.1);
                }
            });

            t += melody.length * beat * 0.5;
        }

        // 배경 드론 (점점 커지는)
        this._drone(ctx, master, 'G1', 0, dur, 0.06);
        const droneGain = ctx.createGain();
        droneGain.gain.setValueAtTime(0, 0);
        droneGain.gain.linearRampToValueAtTime(0.08, dur);
        const droneOsc = ctx.createOscillator();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.value = this._f('G1');
        const dLpf = ctx.createBiquadFilter();
        dLpf.type = 'lowpass';
        dLpf.frequency.value = 150;
        droneOsc.connect(dLpf);
        dLpf.connect(droneGain);
        droneGain.connect(master);
        droneOsc.start(0);
        droneOsc.stop(dur);

        return ctx.startRendering();
    }

    /**
     * ending_ghost — 유령 엔딩, 초현실적 합창 패드 + 역재생 피아노
     * Eb Minor, 55 BPM
     */
    async _ending_ghost() {
        const bpm = 55, dur = 36;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.55;
        const rev = this._reverb(ctx, 5, 0.8);
        const dry = ctx.createGain(); dry.gain.value = 0.3;
        const wet = ctx.createGain(); wet.gain.value = 0.7;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 합창 신디사이저 패드 (숨결 같은)
        // Ebm: Eb - Gb - Bb
        const padChords = [
            ['Eb3','Gb3','Bb3'],
            ['Cb3','Eb3','Gb3'],
            ['Ab2','Cb3','Eb3'],
            ['Bb2','Db3','F3']
        ];

        for (let bar = 0; bar < 9; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;
            if (t >= dur - 2) break;

            // 합창 패드 (매우 느린 어택, 이세계적)
            padChords[ci].forEach(n => {
                this._pad(ctx, master, n, t, beat * 4, 0.1);
            });

            // 고음 에테리얼 레이어
            const highNote = padChords[ci][2]; // Bb3 → 옥타브 위
            const freq = this._f(highNote) * 2;
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.04, t + beat * 2);
            g.gain.linearRampToValueAtTime(0, t + beat * 4);
            osc.connect(g);
            g.connect(master);
            osc.start(t);
            osc.stop(t + beat * 4 + 0.1);
        }

        // 역재생 피아노 에코 (역엔벨로프)
        const revNotes = ['Eb5','Gb5','Bb5','Db5','Ab4','Eb5','Gb4','Bb4','Eb4'];
        revNotes.forEach((n, i) => {
            const t = i * 3.8 + Math.random() * 1;
            if (t < dur - 3) {
                const freq = this._f(n);
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                const g = ctx.createGain();
                const rDur = 2.5;
                g.gain.setValueAtTime(0.001, t);
                g.gain.exponentialRampToValueAtTime(0.15, t + rDur * 0.85);
                g.gain.exponentialRampToValueAtTime(0.001, t + rDur);
                osc.connect(g);
                g.connect(master);
                osc.start(t);
                osc.stop(t + rDur + 0.1);
            }
        });

        return ctx.startRendering();
    }

    // ═══════════════════════════════════════════════════════════════════
    // ═══ 시나리오 추가 BGM ═══
    // ═══════════════════════════════════════════════════════════════════

    /**
     * yuna_theme — 유나 캐릭터 테마, 밝고 호기심 많은 사진작가
     * F Major, 108 BPM, 피아노 + 글로켄슈필
     */
    async _yuna_theme() {
        const bpm = 108, dur = 17.8;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.68;
        const rev = this._reverb(ctx, 1.8, 2.5);
        const dry = ctx.createGain(); dry.gain.value = 0.7;
        const wet = ctx.createGain(); wet.gain.value = 0.3;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // F - C - Dm - Bb
        const chords = [
            ['F3','A3','C4'],
            ['C3','E3','G3'],
            ['D3','F3','A3'],
            ['Bb2','D3','F3']
        ];
        const bassNotes = ['F2','C2','D2','Bb1'];
        const mel = [
            ['A5','C6','F6','C6','A5','G5','F5','A5'],
            ['G5','E5','C5','E5','G5','C6','B5','G5'],
            ['F5','A5','D6','A5','F5','E5','D5','F5'],
            ['D5','F5','Bb5','F5','D5','C5','Bb4','D5']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 피아노 코드 (경쾌한 블록)
            for (let i = 0; i < 4; i++) {
                chords[ci].forEach(n => {
                    this._piano(ctx, master, n, t + i * beat, beat * 0.7, 0.15);
                });
            }

            // 글로켄슈필 멜로디
            mel[ci].forEach((n, i) => {
                this._glock(ctx, master, n, t + i * beat * 0.5, beat * 0.4, 0.18);
            });

            // 베이스
            this._bass(ctx, master, bassNotes[ci], t, beat * 4, 0.15);

            // 가벼운 리듬
            for (let i = 0; i < 4; i++) {
                this._hihat(ctx, master, t + i * beat, 0.04, 0.05);
            }

            // 카메라 셔터 느낌 (간헐적 클릭)
            if (bar % 4 === 2) {
                const nBuf = this._noise(ctx, 0.02);
                const src = ctx.createBufferSource();
                src.buffer = nBuf;
                const hpf = ctx.createBiquadFilter();
                hpf.type = 'highpass'; hpf.frequency.value = 5000;
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.06, t + beat * 2);
                g.gain.exponentialRampToValueAtTime(0.001, t + beat * 2 + 0.02);
                src.connect(hpf); hpf.connect(g); g.connect(master);
                src.start(t + beat * 2); src.stop(t + beat * 2 + 0.03);
            }
        }

        return ctx.startRendering();
    }

    /**
     * tension_low — 은은한 저강도 긴장
     * A Minor, 75 BPM
     */
    async _tension_low() {
        const bpm = 75, dur = 19.2;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.5;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.55;
        const wet = ctx.createGain(); wet.gain.value = 0.45;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 저음 드론
        this._drone(ctx, master, 'A1', 0, dur, 0.06);

        // 미세한 피아노 단음 (물방울)
        const dropNotes = ['E4','C5','A4','E5','B4','G4','D5','A4','C5','E4','G4','B4'];
        dropNotes.forEach((n, i) => {
            const t = i * 1.5 + Math.random() * 0.4;
            if (t < dur - 2) this._piano(ctx, master, n, t, beat * 2.5, 0.1);
        });

        // 현악 패드 (매우 조용한)
        for (let bar = 0; bar < 4; bar++) {
            const t = bar * 5;
            ['A2','C3','E3'].forEach(n => {
                this._strings(ctx, master, n, t, 4.5, 0.04);
            });
        }

        return ctx.startRendering();
    }

    /**
     * dread — 커져가는 공포감
     * 무조성, 55 BPM
     */
    async _dread() {
        const dur = 20;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.5;
        const rev = this._reverb(ctx, 4, 1);
        const dry = ctx.createGain(); dry.gain.value = 0.4;
        const wet = ctx.createGain(); wet.gain.value = 0.6;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 점점 커지는 드론
        const droneG = ctx.createGain();
        droneG.gain.setValueAtTime(0.01, 0);
        droneG.gain.linearRampToValueAtTime(0.12, dur);
        droneG.connect(master);
        this._drone(ctx, droneG, 33, 0, dur, 1);

        // 불안한 고주파 (점점 높아지는)
        const highOsc = ctx.createOscillator();
        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(2000, 0);
        highOsc.frequency.linearRampToValueAtTime(6000, dur);
        const hG = ctx.createGain();
        hG.gain.setValueAtTime(0, 0);
        hG.gain.linearRampToValueAtTime(0.012, dur);
        highOsc.connect(hG); hG.connect(master);
        highOsc.start(0); highOsc.stop(dur);

        // 간헐적 심장박동 (점점 빨라지는)
        let t = 0;
        let interval = 1.5;
        while (t < dur) {
            this._kick(ctx, master, t, 0.06);
            t += interval;
            interval = Math.max(0.4, interval * 0.92);
        }

        // 불협화 현악 스탭
        [4, 9, 14, 18].forEach(st => {
            ['C3','F#3','Bb3'].forEach(n => {
                this._strings(ctx, master, n, st, 1.5, 0.06);
            });
        });

        return ctx.startRendering();
    }

    /**
     * wind_ambient — 바람 앰비언트
     */
    async _wind_ambient() {
        const dur = 16;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.45;
        const rev = this._reverb(ctx, 3, 1.5);
        const dry = ctx.createGain(); dry.gain.value = 0.5;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 바람 레이어 (밴드패스 노이즈, 여러 대역)
        [200, 600, 1200].forEach((freq, li) => {
            const nBuf = this._noise(ctx, dur);
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const bpf = ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.value = freq;
            bpf.Q.value = 0.3 + li * 0.2;
            const g = ctx.createGain();
            // 파도 패턴
            for (let t = 0; t < dur; t += 2.5 + li) {
                const v = 0.03 + li * 0.01;
                g.gain.setValueAtTime(v * 0.3, t);
                g.gain.linearRampToValueAtTime(v, t + 1.2 + li * 0.3);
                g.gain.linearRampToValueAtTime(v * 0.3, t + 2.4 + li * 0.5);
            }
            src.connect(bpf); bpf.connect(g); g.connect(master);
            src.start(0); src.stop(dur);
        });

        // 미세한 드론
        this._drone(ctx, master, 55, 0, dur, 0.03);

        return ctx.startRendering();
    }

    /**
     * sea_obsession — 세아의 집착 테마 (sea_theme의 어두운 변주)
     * Bb Minor, 132 BPM → 왜곡
     */
    async _sea_obsession() {
        const bpm = 132, dur = 14.5;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.6;
        const rev = this._reverb(ctx, 2, 2);
        const dry = ctx.createGain(); dry.gain.value = 0.6;
        const wet = ctx.createGain(); wet.gain.value = 0.4;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Bbm - Gb - Db - Ab (원래 테마의 마이너 버전)
        const chords = [
            ['Bb3','Db4','F4'],
            ['Gb3','Bb3','Db4'],
            ['Db3','F3','Ab3'],
            ['Ab2','C3','Eb3']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;
            const detuneAmt = bar * 5;

            // 피아노 (디튠 증가)
            chords[ci].forEach(n => {
                const freq = this._f(n);
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                osc.detune.value = (Math.random() - 0.5) * detuneAmt;
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.15, t);
                g.gain.exponentialRampToValueAtTime(0.04, t + beat * 2);
                g.gain.exponentialRampToValueAtTime(0.001, t + beat * 3.5);
                osc.connect(g); g.connect(master);
                osc.start(t); osc.stop(t + beat * 4);
            });

            // 왜곡된 실로폰 (원래 멜로디 비틀린)
            const mel = ['Db5','F5','Bb5','Db6','Bb5','F5','Db5','F5'];
            mel.forEach((n, i) => {
                const freq = this._f(n) * (1 + (Math.random() - 0.5) * detuneAmt * 0.002);
                this._xylo(ctx, master, freq, t + i * beat * 0.5, beat * 0.35, 0.1);
            });

            // 드론 (점점 커지는)
            if (bar >= 3) {
                this._drone(ctx, master, 'Bb1', t, beat * 4, 0.03 + bar * 0.01);
            }
        }

        return ctx.startRendering();
    }

    /**
     * tension_night — 밤의 긴장 (night_tension 변형)
     * E Minor, 60 BPM
     */
    async _tension_night() {
        const bpm = 60, dur = 20;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.5;
        const rev = this._reverb(ctx, 3.5, 1.2);
        const dry = ctx.createGain(); dry.gain.value = 0.45;
        const wet = ctx.createGain(); wet.gain.value = 0.55;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        this._drone(ctx, master, 'E1', 0, dur, 0.07);

        // 느린 심장박동
        for (let t = 0; t < dur; t += beat * 2.5) {
            this._kick(ctx, master, t, 0.08);
            this._kick(ctx, master, t + beat * 0.4, 0.04);
        }

        // 고주파 불안 톤
        const hOsc = ctx.createOscillator();
        hOsc.type = 'sine'; hOsc.frequency.value = 4800;
        const hG = ctx.createGain(); hG.gain.value = 0.006;
        hOsc.connect(hG); hG.connect(master);
        hOsc.start(0); hOsc.stop(dur);

        // 현악 (으스스한)
        for (let bar = 0; bar < 4; bar++) {
            const t = bar * 5;
            ['E3','G3','B3'].forEach(n => {
                this._strings(ctx, master, n, t, 4.5, 0.05);
            });
        }

        // 피아노 단음 (랜덤)
        ['B4','G4','E5','D5','B5','F#4','A4','E4'].forEach((n, i) => {
            const t = i * 2.4 + Math.random() * 0.5;
            if (t < dur - 2) this._piano(ctx, master, n, t, beat * 2.5, 0.08);
        });

        return ctx.startRendering();
    }

    /**
     * heartbeat_loop — 심장박동 루프
     */
    async _heartbeat_loop() {
        const dur = 8;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.55;
        master.connect(ctx.destination);

        // 심장박동 (더블 펄스)
        for (let t = 0; t < dur; t += 0.8) {
            // 첫 박 (강)
            const osc1 = ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(90, t);
            osc1.frequency.exponentialRampToValueAtTime(30, t + 0.15);
            const g1 = ctx.createGain();
            g1.gain.setValueAtTime(0.35, t);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc1.connect(g1); g1.connect(master);
            osc1.start(t); osc1.stop(t + 0.25);

            // 둘째 박 (약)
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(70, t + 0.25);
            osc2.frequency.exponentialRampToValueAtTime(25, t + 0.35);
            const g2 = ctx.createGain();
            g2.gain.setValueAtTime(0.2, t + 0.25);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc2.connect(g2); g2.connect(master);
            osc2.start(t + 0.25); osc2.stop(t + 0.45);
        }

        // 미세한 저주파 드론
        this._drone(ctx, master, 30, 0, dur, 0.03);

        return ctx.startRendering();
    }

    /**
     * silence_tension — 긴장된 정적
     */
    async _silence_tension() {
        const dur = 16;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.4;
        const rev = this._reverb(ctx, 5, 0.8);
        const dry = ctx.createGain(); dry.gain.value = 0.3;
        const wet = ctx.createGain(); wet.gain.value = 0.7;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 거의 안 들리는 드론
        this._drone(ctx, master, 25, 0, dur, 0.04);

        // 아주 가끔 금속 삐걱 (먼 곳)
        [3, 8, 12].forEach(t => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.4);
            const hpf = ctx.createBiquadFilter();
            hpf.type = 'highpass'; hpf.frequency.value = 1500;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.015, t + 0.1);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.connect(hpf); hpf.connect(g); g.connect(master);
            osc.start(t); osc.stop(t + 0.5);
        });

        // 고주파 사인 (거의 역치)
        const hOsc = ctx.createOscillator();
        hOsc.type = 'sine'; hOsc.frequency.value = 7000;
        const hG = ctx.createGain(); hG.gain.value = 0.003;
        hOsc.connect(hG); hG.connect(master);
        hOsc.start(0); hOsc.stop(dur);

        return ctx.startRendering();
    }

    /**
     * music_box_broken — 고장난 오르골
     * G Minor, 점점 느려지며 뒤틀림
     */
    async _music_box_broken() {
        const dur = 20;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.55;
        const rev = this._reverb(ctx, 4, 1);
        const dry = ctx.createGain(); dry.gain.value = 0.4;
        const wet = ctx.createGain(); wet.gain.value = 0.6;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        const melody = ['G5','Bb5','D6','F6','D6','Bb5','G5','F5'];
        let t = 0;
        let interval = 0.3;

        for (let rep = 0; rep < 5; rep++) {
            const detune = rep * 30;
            melody.forEach((n, i) => {
                if (t >= dur - 1) return;
                const freq = this._f(n) * (1 + (Math.random() - 0.5) * detune * 0.002);
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const g = ctx.createGain();
                const vol = 0.2 * (1 - rep * 0.12);
                g.gain.setValueAtTime(Math.max(vol, 0.03), t);
                g.gain.exponentialRampToValueAtTime(0.001, t + interval * 2);
                osc.connect(g); g.connect(master);
                osc.start(t); osc.stop(t + interval * 2.5);
                t += interval;
            });
            interval *= 1.2; // 점점 느려짐
        }

        // 드론 (불길한)
        this._drone(ctx, master, 'G1', 0, dur, 0.05);

        return ctx.startRendering();
    }

    /**
     * seolhwa_theme_broken — 설화의 깨진 테마
     * F Minor, 느리고 뒤틀린
     */
    async _seolhwa_theme_broken() {
        const bpm = 50, dur = 20;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.5;
        const rev = this._reverb(ctx, 4, 1);
        const dry = ctx.createGain(); dry.gain.value = 0.35;
        const wet = ctx.createGain(); wet.gain.value = 0.65;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // 뒤틀린 피아노 멜로디
        const mel = ['F4','Ab4','C5','Db5','C5','Ab4','F4','Eb4',
                     'Db4','F4','Ab4','Bb4','Ab4','F4','Db4','C4'];
        mel.forEach((n, i) => {
            const t = i * beat * 0.8;
            if (t < dur - 2) {
                const freq = this._f(n);
                const detuned = freq * (1 + (Math.random() - 0.5) * 0.03);
                this._piano(ctx, master, detuned, t, beat * 2, 0.12);
            }
        });

        // 깊은 현악 드론
        ['F2','C3'].forEach(n => {
            this._strings(ctx, master, n, 0, dur, 0.06);
        });

        // 역재생 느낌 피아노 에코
        [5, 10, 15].forEach(st => {
            const freq = this._f('Ab5');
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.001, st);
            g.gain.exponentialRampToValueAtTime(0.1, st + 1.5);
            g.gain.exponentialRampToValueAtTime(0.001, st + 2);
            osc.connect(g); g.connect(master);
            osc.start(st); osc.stop(st + 2.1);
        });

        return ctx.startRendering();
    }

    /**
     * confrontation — 대립/대결 장면
     * C Minor, 115 BPM
     */
    async _confrontation() {
        const bpm = 115, dur = 16.7;
        const beat = 60 / bpm;
        const ctx = this._offline(dur);
        const master = ctx.createGain();
        master.gain.value = 0.65;
        const rev = this._reverb(ctx, 1.5, 2.5);
        const dry = ctx.createGain(); dry.gain.value = 0.75;
        const wet = ctx.createGain(); wet.gain.value = 0.25;
        master.connect(dry); dry.connect(ctx.destination);
        master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);

        // Cm - Ab - Fm - G
        const chords = [
            ['C3','Eb3','G3','C4'],
            ['Ab2','C3','Eb3','Ab3'],
            ['F2','Ab2','C3','F3'],
            ['G2','B2','D3','G3']
        ];

        for (let bar = 0; bar < 8; bar++) {
            const ci = bar % 4;
            const t = bar * 4 * beat;

            // 강한 현악
            chords[ci].forEach(n => {
                this._strings(ctx, master, n, t, beat * 4, 0.12);
            });

            // 킥 + 스네어
            for (let i = 0; i < 4; i++) {
                this._kick(ctx, master, t + i * beat, 0.2);
                if (i === 1 || i === 3) this._snare(ctx, master, t + i * beat, 0.12);
                this._hihat(ctx, master, t + i * beat + beat * 0.5, 0.04, 0.06);
            }

            // 피아노 스타카토 (긴장)
            const pianoNotes = ['C5','Eb5','G5','C6'];
            pianoNotes.forEach((n, i) => {
                this._piano(ctx, master, n, t + i * beat, beat * 0.3, 0.18);
            });

            // 베이스 (파워)
            this._bass(ctx, master, chords[ci][0], t, beat * 2, 0.22);
            this._bass(ctx, master, chords[ci][0], t + beat * 2, beat * 2, 0.2);
        }

        return ctx.startRendering();
    }
}
