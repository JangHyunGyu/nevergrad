/* Cupid / Nevergrad crossing. Keep the two copies identical. */
(function () {
    'use strict';
    const COPY = {
        ko: ['교문 앞에서', '혀끝에는 아직 단맛이 남아 있다. 분명 보건실에 있었는데 교문 너머에서 등교 종이 울린다.', '눈을 뜨면', '스탠드가 있던 자리에 형광등이 켜져 있다. 같은 목소리인데 침실은 어디에도 없다.', '첫날부터 시작', '이전 기록 이어하기', '타이틀로', '다른 기록을 펼친다', '이곳에 남겨 둔 진행 기록이 있습니다. 이어서 보거나 첫날부터 시작할 수 있습니다.', '이야기는 다시 4월의 첫날에서 시작됩니다.', '넘어가기', '장면으로 돌아가기', '화면이 열리지 않으면 다시 눌러 주세요.', '기록을 저장하지 못했습니다. 이대로 이동할까요?', '저장 없이 이동', '잠시 후'],
        en: ['At the school gate', 'The sweetness is still on your tongue. You were in the infirmary. Now the school bell rings beyond the gate.', 'When you open your eyes', 'A fluorescent light has replaced the bedside lamp. The voice is the same. The bedroom is gone.', 'Start from day one', 'Continue saved story', 'Title screen', 'Open another record', 'You have a saved story here. Continue it, or start from the first day.', 'The story begins again on the first day in April.', 'Cross over', 'Back to the scene', 'If the page has not opened, press again.', 'Your progress could not be saved. Leave anyway?', 'Leave without saving', 'A moment later'],
        ja: ['校門の前で', '舌にはまだ甘さが残っている。保健室にいたはずなのに、校門の向こうで始業の鐘が鳴る。', '目を開けると', 'スタンドのあった場所に蛍光灯が灯っている。同じ声なのに、寝室はどこにもない。', '初日から始める', '前の記録から続ける', 'タイトルへ', '別の記録を開く', 'ここには途中の記録があります。続きから、または初日から始められます。', '物語は再び、4月の初日から始まります。', '向こうへ進む', '場面に戻る', '画面が開かない場合は、もう一度押してください。', '進行を保存できませんでした。このまま移動しますか？', '保存せずに移動', 'しばらくして'],
        es: ['Ante la puerta', 'Aún queda dulzor en la lengua. Estabas en la enfermería, pero ahora suena el timbre al otro lado de la puerta.', 'Al abrir los ojos', 'Un fluorescente ocupa el lugar de la lámpara. La voz es la misma, pero el dormitorio ha desaparecido.', 'Empezar el primer día', 'Continuar la partida', 'Pantalla de título', 'Abrir otro registro', 'Tienes una partida guardada aquí. Puedes continuarla o empezar desde el primer día.', 'La historia vuelve a empezar el primer día de abril.', 'Cruzar', 'Volver a la escena', 'Si no se abre la página, pulsa de nuevo.', 'No se pudo guardar el progreso. ¿Salir de todos modos?', 'Salir sin guardar', 'Un momento después'],
        fr: ['Devant le portail', 'Le goût sucré reste sur ta langue. Tu étais à l’infirmerie. Maintenant, la sonnerie retentit derrière le portail.', 'En ouvrant les yeux', 'Un néon a remplacé la lampe de chevet. La voix est la même, mais la chambre a disparu.', 'Repartir du premier jour', 'Reprendre la sauvegarde', 'Écran titre', 'Ouvrir un autre dossier', 'Une partie est sauvegardée ici. Reprends-la ou recommence au premier jour.', 'L’histoire reprend au premier jour d’avril.', 'Traverser', 'Revenir à la scène', 'Si la page ne s’ouvre pas, appuie à nouveau.', 'La progression n’a pas pu être sauvegardée. Partir quand même ?', 'Partir sans sauvegarder', 'Un instant plus tard'],
        de: ['Vor dem Schultor', 'Der süße Geschmack liegt noch auf deiner Zunge. Du warst im Krankenzimmer. Jetzt läutet hinter dem Tor die Schulglocke.', 'Wenn du die Augen öffnest', 'Anstelle der Nachttischlampe leuchtet eine Leuchtstoffröhre. Dieselbe Stimme, doch das Schlafzimmer ist verschwunden.', 'Am ersten Tag beginnen', 'Spielstand fortsetzen', 'Zum Titel', 'Eine andere Akte öffnen', 'Hier liegt ein Spielstand vor. Setze ihn fort oder beginne am ersten Tag.', 'Die Geschichte beginnt erneut am ersten Tag im April.', 'Hinübergehen', 'Zurück zur Szene', 'Falls die Seite nicht geöffnet wurde, drücke erneut.', 'Der Fortschritt konnte nicht gespeichert werden. Trotzdem wechseln?', 'Ohne Speichern wechseln', 'Einen Moment später'],
        pt: ['Diante do portão', 'O doce ainda está na língua. Estavas na enfermaria, mas agora o sinal toca do outro lado do portão.', 'Ao abrir os olhos', 'Uma luz fluorescente ocupa o lugar do candeeiro. A voz é a mesma, mas o quarto desapareceu.', 'Começar no primeiro dia', 'Continuar a partida', 'Tela inicial', 'Abrir outro registro', 'Há uma partida salva aqui. Podes continuar ou começar no primeiro dia.', 'A história recomeça no primeiro dia de abril.', 'Atravessar', 'Voltar à cena', 'Se a página não abriu, pressiona novamente.', 'Não foi possível salvar o progresso. Sair mesmo assim?', 'Sair sem salvar', 'Um momento depois']
    };
    const STYLE = `
    #cross-world{position:fixed;inset:0;z-index:30000;box-sizing:border-box;color:#eeeae2;background:#080d10;isolation:isolate;overflow:auto;overscroll-behavior:contain;font-family:inherit;opacity:1;transition:opacity .65s ease}
    #cross-world *{box-sizing:border-box}#cross-world.cw-out{opacity:0;pointer-events:none}
    #cross-world.cw-spring{background:#201b22;color:#fff4f1;--cw-accent:#f0b9c9}#cross-world.cw-lab{--cw-accent:#a8d6c2}
    #cross-world .cw-haze{position:absolute;inset:0;background:var(--cw-image) center/cover no-repeat;opacity:.16;pointer-events:none}
    #cross-world .cw-layout{position:relative;min-height:100%;min-height:100dvh;max-width:1600px;margin:auto;display:grid;grid-template-columns:minmax(0, .85fr) minmax(0, 1.15fr);align-items:center;padding:max(32px,env(safe-area-inset-top)) max(48px,env(safe-area-inset-right)) max(32px,env(safe-area-inset-bottom)) max(48px,env(safe-area-inset-left));gap:3vw}
    #cross-world .cw-art{grid-column:2;grid-row:1;position:relative;align-self:stretch;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
    #cross-world .cw-art:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 90px 18px #080d1066;pointer-events:none}
    #cross-world .cw-art img{display:block;width:100%;height:calc(100dvh - 96px);object-fit:contain;object-position:center;opacity:0;transform:scale(1.035);transition:opacity 1.2s ease,transform 3s ease}
    #cross-world.cw-ready .cw-art img{opacity:1;transform:scale(1)}
    #cross-world .cw-copy{grid-column:1;grid-row:1;position:relative;max-width:520px;padding:20px 0;animation:cw-reveal .8s ease both}
    #cross-world .cw-eyebrow{display:flex;align-items:center;gap:12px;margin:0 0 25px;font:11px/1.5 ui-monospace,monospace;letter-spacing:.19em;color:var(--cw-accent)}
    #cross-world .cw-eyebrow:before{content:'';display:block;width:28px;height:1px;background:currentColor}
    #cross-world h2{font-family:Georgia,'Noto Serif KR',serif;font-size:clamp(30px,3.5vw,58px);font-weight:400;line-height:1.3;letter-spacing:-.04em;margin:0 0 24px;word-break:keep-all;overflow-wrap:anywhere}
    #cross-world .cw-story{font-size:clamp(14px,1.3vw,17px);line-height:1.95;color:#f3eee6;word-break:keep-all;overflow-wrap:anywhere;margin:0 0 30px;max-width:38em}
    #cross-world .cw-rule{width:48px;height:1px;background:var(--cw-accent);opacity:.5;margin:0 0 22px}
    #cross-world .cw-note{font-size:12px;line-height:1.65;color:#d0c9c5;margin:0 0 18px;overflow-wrap:anywhere}
    #cross-world .cw-actions{display:flex;flex-wrap:wrap;gap:8px 12px}
    #cross-world button{font:inherit;font-size:13px;line-height:1.4;letter-spacing:0;min-height:46px;max-width:100%;padding:12px 16px;border:1px solid #ffffff40;border-radius:2px;background:#101619d9;color:inherit;cursor:pointer;box-shadow:none;text-shadow:none;white-space:normal;word-break:normal;overflow-wrap:anywhere;touch-action:manipulation;transition:background .2s,border-color .2s}
    #cross-world button.cw-primary{background:var(--cw-accent);border-color:var(--cw-accent);color:#172121}#cross-world button:hover{border-color:var(--cw-accent)}#cross-world button:focus-visible{outline:2px solid #fff;outline-offset:4px}#cross-world button:disabled{opacity:.6;cursor:wait}
    #cross-world .cw-foot{margin:22px 0 0;font:10px/1.6 ui-monospace,monospace;letter-spacing:.12em;color:#b7b5b0}
    @keyframes cw-reveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @media(max-width:650px) and (orientation:portrait){#cross-world .cw-layout{display:flex;flex-direction:column;justify-content:center;gap:0;padding:max(18px,env(safe-area-inset-top)) max(22px,env(safe-area-inset-right)) max(20px,env(safe-area-inset-bottom)) max(22px,env(safe-area-inset-left))}#cross-world .cw-art{width:100%;height:34dvh;min-height:130px;flex:0 1 auto;align-self:center}#cross-world .cw-art img{height:100%;max-height:46dvh;width:100%;object-fit:contain}#cross-world .cw-copy{width:100%;padding:18px 0 0}#cross-world .cw-eyebrow{margin-bottom:12px;font-size:10px}#cross-world h2{font-size:30px;margin-bottom:12px}#cross-world .cw-story{font-size:14px;line-height:1.8;margin-bottom:16px}#cross-world .cw-rule{margin-bottom:14px}#cross-world .cw-note{margin-bottom:12px}#cross-world .cw-foot{margin-top:14px}#cross-world button{flex:1 1 auto}}
    @media(max-height:500px) and (orientation:landscape){#cross-world .cw-layout{padding:max(12px,env(safe-area-inset-top)) max(24px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(24px,env(safe-area-inset-left));grid-template-columns:1.15fr .85fr;gap:18px}#cross-world .cw-copy{padding:0}#cross-world .cw-eyebrow{margin-bottom:8px;font-size:9px}#cross-world h2{font-size:25px;margin-bottom:8px}#cross-world .cw-story{font-size:12px;line-height:1.65;margin-bottom:10px}#cross-world .cw-rule{display:none}#cross-world .cw-note{font-size:11px;margin-bottom:10px}#cross-world .cw-foot{margin-top:10px;font-size:9px}#cross-world .cw-art img{height:calc(100dvh - 24px)}#cross-world button{font-size:12px;padding:9px 12px;min-height:44px}}
    @media(max-width:650px) and (max-height:650px) and (orientation:portrait){#cross-world .cw-layout{padding-top:max(12px,env(safe-area-inset-top));padding-bottom:max(12px,env(safe-area-inset-bottom))}#cross-world .cw-art{height:26dvh;min-height:110px;flex:0 1 auto}#cross-world .cw-art img{max-height:29dvh}#cross-world .cw-copy{padding-top:12px}#cross-world h2{font-size:27px}#cross-world .cw-story{font-size:13px;line-height:1.7;margin-bottom:12px}#cross-world .cw-foot{margin-top:10px}}
    @media(max-width:650px) and (orientation:portrait){#cross-world.cw-spring .cw-art img{object-fit:cover}}
    @media(prefers-reduced-motion:reduce){#cross-world,#cross-world *{animation:none!important;transition:none!important;transform:none!important}}
    `;
    let active = null;
    const cleanName = value => Array.from(String(value || '').replace(/[<>\x00-\x1f\x7f]/g, '').trim()).slice(0, 24).join('');
    function cookieSuffix(age) {
        const host = location.hostname;
        const domain = host === 'archerlab.dev' || host.endsWith('.archerlab.dev') ? '; Domain=.archerlab.dev' : '';
        return `; Path=/; Max-Age=${age}; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
    }
    function remember(target, name) {
        try { document.cookie = `archer_crossing_v1=${encodeURIComponent(JSON.stringify({ target, name: cleanName(name), at: Date.now() }))}${cookieSuffix(600)}`; } catch (_) {}
    }
    function takeArrival(world) {
        const url = new URL(location.href);
        const arrival = world === 'cupid' ? url.searchParams.get('gate') === '1' : url.searchParams.get('from') === 'riin';
        if (!arrival) return null;
        let name = '';
        try {
            const entry = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith('archer_crossing_v1='));
            const data = entry ? JSON.parse(decodeURIComponent(entry.slice('archer_crossing_v1='.length))) : null;
            if (data?.target === world && Number.isFinite(data.at) && Date.now() - data.at >= 0 && Date.now() - data.at < 600000) name = cleanName(data.name);
            document.cookie = `archer_crossing_v1=${cookieSuffix(0)}`;
        } catch (_) {}
        url.searchParams.delete(world === 'cupid' ? 'gate' : 'from');
        try { history.replaceState(history.state, '', url.pathname + url.search + url.hash); } catch (_) {}
        return { name };
    }
    function show(options) {
        if (active) return active;
        const copy = COPY[options.lang] || COPY.en;
        const spring = options.world === 'cupid';
        const previousFocus = document.activeElement;
        if (!document.getElementById('cross-world-style')) {
            const style = document.createElement('style'); style.id = 'cross-world-style'; style.textContent = STYLE; document.head.appendChild(style);
        }
        const root = document.createElement('section');
        root.id = 'cross-world'; root.className = spring ? 'cw-spring' : 'cw-lab';
        root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'cw-title'); root.setAttribute('aria-describedby', 'cw-story');
        root.innerHTML = '<div class="cw-haze" aria-hidden="true"></div><div class="cw-layout"><div class="cw-art" aria-hidden="true"><img alt=""></div><div class="cw-copy"><p class="cw-eyebrow"></p><h2 id="cw-title"></h2><p class="cw-story" id="cw-story"></p><div class="cw-rule"></div><p class="cw-note" role="status" aria-live="polite"></p><div class="cw-actions"></div><p class="cw-foot"></p></div></div>';
        const text = (selector, value) => { root.querySelector(selector).textContent = value; };
        const art = root.querySelector('img');
        art.onload = art.onerror = () => root.classList.add('cw-ready');
        art.src = options.image;
        root.style.setProperty('--cw-image', `url("${new URL(options.image, document.baseURI).href}")`);
        text('.cw-eyebrow', spring ? 'CUPID / 01' : 'NEVERGRAD / 13');
        text('h2', copy[spring ? 0 : 2]); text('.cw-story', copy[spring ? 1 : 3]);
        text('.cw-note', options.departure ? copy[7] : copy[options.hasSave ? 8 : 9]);
        text('.cw-foot', options.departure ? `${options.world.toUpperCase()} ↗` : `CUPID × NEVERGRAD · ${copy[15]}`);
        const inert = [...document.body.children].filter(el => el instanceof HTMLElement && !['SCRIPT','STYLE','LINK'].includes(el.tagName)).map(el => [el, el.inert]);
        inert.forEach(([el]) => { el.inert = true; });
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden'; document.body.appendChild(root);
        const cleanup = () => {
            root.remove(); inert.forEach(([el, value]) => { el.inert = value; }); document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', keys, true); window.removeEventListener('pageshow', restore);
            active = null; if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
        const close = async action => {
            cleanup();
            try { await action?.(); } catch (error) { console.error('[CrossWorld] entry failed', error); options.onTitle?.(); }
        };
        const addButton = (label, action, primary = false) => {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
            if (primary) button.className = 'cw-primary';
            button.addEventListener('click', event => { event.stopPropagation(); action(button); });
            root.querySelector('.cw-actions').appendChild(button); return button;
        };
        let retryTimer = null;
        let leaving = false;
        const restore = () => { clearTimeout(retryTimer); leaving = false; root.classList.remove('cw-out'); root.querySelectorAll('button').forEach(el => { el.disabled = false; }); };
        const depart = async button => {
            if (leaving) return;
            if (!button.dataset.unsaved) {
                let saved = false; try { saved = options.save?.() !== false; } catch (_) {}
                if (!saved) { text('.cw-note', copy[13]); button.textContent = copy[14]; button.dataset.unsaved = '1'; return; }
            }
            remember(options.world, options.name);
            leaving = true; root.querySelectorAll('button').forEach(el => { el.disabled = true; });
            options.onLeave?.(); root.classList.add('cw-out');
            await new Promise(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650));
            try { location.assign(options.url); } catch (_) { restore(); }
            retryTimer = setTimeout(() => { restore(); text('.cw-note', copy[12]); }, 3500);
        };
        if (options.departure) {
            addButton(copy[10], depart, true); addButton(copy[11], () => close(options.onBack));
        } else {
            if (options.hasSave) addButton(copy[5], () => close(options.onContinue), true);
            addButton(copy[4], () => close(options.onNew), !options.hasSave);
            addButton(copy[6], () => close(options.onTitle));
        }
        const keys = event => {
            if (event.key === 'Escape' && !leaving) { event.preventDefault(); close(options.departure ? options.onBack : options.onTitle); }
            if (event.key === 'Tab') {
                const buttons = [...root.querySelectorAll('button:not(:disabled)')];
                const index = buttons.indexOf(document.activeElement);
                if (buttons.length && ((event.shiftKey && index <= 0) || (!event.shiftKey && index === buttons.length - 1))) {
                    event.preventDefault(); buttons[event.shiftKey ? buttons.length - 1 : 0].focus();
                }
            }
            event.stopImmediatePropagation();
        };
        window.addEventListener('keydown', keys, true); window.addEventListener('pageshow', restore);
        active = { close: () => close(), element: root };
        root.querySelector('button')?.focus({ preventScroll: true });
        return active;
    }
    window.CrossWorld = { show, takeArrival, cleanName };
})();
