/**
 * FX soft-lock fix: signature pad hint + lower threshold.
 */
(function () {
    if (typeof GlitchSystemAdvanced === 'undefined') return;
    GlitchSystemAdvanced.prototype._showSignaturePad = function (onComplete) {
        const container = document.createElement('div');
        container.className = 'signature-pad-container';

        const paper = document.createElement('div');
        paper.className = 'signature-pad-paper';

        const label = document.createElement('div');
        label.className = 'signature-pad-label';
        const lang = document.documentElement.lang || 'ko';
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
            ko: '손가락이나 마우스로 서명란에 그려 주세요',
            en: 'Draw on the line with your finger or mouse',
            ja: '指またはマウスで署名欄に書いてください',
            es: 'Dibuja en la línea con el dedo o el ratón',
            fr: 'Signez sur la ligne avec le doigt ou la souris',
            de: 'Mit Finger oder Maus auf der Linie unterschreiben',
            pt: 'Assine na linha com o dedo ou o mouse'
        };
        hint.textContent = hintTexts[lang] || hintTexts.en;

        const line = document.createElement('div');
        line.className = 'signature-pad-line';

        const canvas = document.createElement('canvas');
        canvas.className = 'signature-pad-canvas';

        paper.appendChild(label);
        paper.appendChild(hint);
        paper.appendChild(canvas);
        paper.appendChild(line);
        container.appendChild(paper);
        document.body.appendChild(container);

        // 캔버스 사이즈 (paper 기준)
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let drawing = false;
        let last = null;
        let drawnPixels = 0;
        let completed = false;
        // 서명 "유효" 기준 — 총 이동 거리 > threshold (너무 길면 진행 막힘으로 완화)
        const threshold = Math.max(120, canvas.width * 0.22);

        const toLocal = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const beginStroke = (x, y) => {
            drawing = true;
            last = { x, y };
            ctx.beginPath();
            ctx.moveTo(x, y);
        };
        const extendStroke = (x, y) => {
            if (!drawing) return;
            ctx.lineTo(x, y);
            ctx.stroke();
            const dx = x - last.x, dy = y - last.y;
            drawnPixels += Math.sqrt(dx * dx + dy * dy);
            last = { x, y };
            if (drawnPixels > threshold && !completed) {
                completed = true;
                setTimeout(() => {
                    container.classList.add('signature-pad-done');
                    setTimeout(() => {
                        window.removeEventListener('resize', resize);
                        container.remove();
                        if (onComplete) onComplete();
                    }, 400);
                }, 200);
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
    };
})();
