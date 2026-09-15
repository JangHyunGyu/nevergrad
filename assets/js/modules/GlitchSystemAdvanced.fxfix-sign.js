/**
 * FX soft-lock fix: signature pad hint, progress feedback, lower threshold, window pointer-up.
 */
(function () {
    if (typeof GlitchSystemAdvanced === 'undefined') return;
    if (GlitchSystemAdvanced.prototype._showSignaturePad &&
        GlitchSystemAdvanced.prototype._showSignaturePad.__nevergradFxPatchedV2) return;

    GlitchSystemAdvanced.prototype._showSignaturePad = function (onComplete) {
        const container = document.createElement('div');
        container.className = 'signature-pad-container';

        const paper = document.createElement('div');
        paper.className = 'signature-pad-paper';

        const label = document.createElement('div');
        label.className = 'signature-pad-label';
        const lang = (document.documentElement.lang || 'ko').slice(0, 2);
        const labels = {
            ko: '서명',
            en: 'Signature',
            ja: '署名',
            es: 'Firma',
            fr: 'Signature',
            de: 'Unterschrift',
            pt: 'Assinatura'
        };
        label.textContent = labels[lang] || labels.en;

        const hint = document.createElement('div');
        hint.className = 'signature-pad-hint';
        const hintTexts = {
            ko: '아래 선 위에 손가락이나 마우스로 서명해 주세요',
            en: 'Draw your signature on the line with finger or mouse',
            ja: '線の上に指またはマウスで署名してください',
            es: 'Firma sobre la línea con el dedo o el ratón',
            fr: 'Signez sur la ligne avec le doigt ou la souris',
            de: 'Unterschreiben Sie auf der Linie mit Finger oder Maus',
            pt: 'Assine sobre a linha com o dedo ou o mouse'
        };
        const baseHint = hintTexts[lang] || hintTexts.en;
        hint.textContent = baseHint;

        const progress = document.createElement('div');
        progress.className = 'signature-pad-progress';
        progress.setAttribute('aria-hidden', 'true');

        const line = document.createElement('div');
        line.className = 'signature-pad-line';

        const canvas = document.createElement('canvas');
        canvas.className = 'signature-pad-canvas';

        paper.appendChild(label);
        paper.appendChild(hint);
        paper.appendChild(progress);
        paper.appendChild(canvas);
        paper.appendChild(line);
        container.appendChild(paper);
        document.body.appendChild(container);

        let strokeSnapshot = null;
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) return;
            // Preserve ink across resize when possible
            try {
                strokeSnapshot = canvas.width ? canvas.toDataURL() : strokeSnapshot;
            } catch (_) {}
            canvas.width = rect.width;
            canvas.height = rect.height;
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (strokeSnapshot) {
                const img = new Image();
                img.onload = () => {
                    try { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); } catch (_) {}
                };
                img.src = strokeSnapshot;
            }
        };
        const ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);

        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let drawing = false;
        let last = null;
        let drawnPixels = 0;
        let completed = false;
        let lastBucket = -1;
        // Lower threshold so short signatures still complete
        const threshold = Math.max(90, canvas.width * 0.18);

        const toLocal = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const updateProgress = () => {
            const ratio = Math.min(1, drawnPixels / Math.max(1, threshold));
            progress.style.setProperty('--sig-progress', String(ratio));
            const bucket = Math.floor(ratio * 8);
            if (bucket === lastBucket) return;
            lastBucket = bucket;
            if (ratio < 0.12) {
                hint.textContent = baseHint;
            } else if (ratio < 0.85) {
                hint.textContent = lang === 'ko'
                    ? `서명 중… ${Math.round(ratio * 100)}%`
                    : `Signing… ${Math.round(ratio * 100)}%`;
            } else {
                hint.textContent = lang === 'ko' ? '거의 끝…' : 'Almost done…';
            }
        };

        const beginStroke = (x, y) => {
            drawing = true;
            last = { x, y };
            ctx.beginPath();
            ctx.moveTo(x, y);
        };
        const extendStroke = (x, y) => {
            if (!drawing || completed) return;
            ctx.lineTo(x, y);
            ctx.stroke();
            const dx = x - last.x, dy = y - last.y;
            drawnPixels += Math.sqrt(dx * dx + dy * dy);
            last = { x, y };
            updateProgress();
            if (drawnPixels > threshold && !completed) {
                completed = true;
                hint.textContent = lang === 'ko' ? '확인' : 'OK';
                setTimeout(() => {
                    container.classList.add('signature-pad-done');
                    setTimeout(() => {
                        window.removeEventListener('resize', resize);
                        window.removeEventListener('mouseup', endStroke);
                        window.removeEventListener('touchend', endStroke);
                        container.remove();
                        if (onComplete) onComplete();
                    }, 400);
                }, 180);
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
        window.addEventListener('mouseup', endStroke);

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
        window.addEventListener('touchend', endStroke);
    };
    GlitchSystemAdvanced.prototype._showSignaturePad.__nevergradFxPatchedV2 = true;
})();
