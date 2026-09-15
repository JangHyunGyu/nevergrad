/**
 * FX soft-lock fix: mirror wipe accepts any wipe direction, clearer hint, progress feedback.
 * Replaces showMirrorSwipe with a resize-safe implementation.
 */
(function () {
    if (typeof GlitchSystemAdvanced === 'undefined') return;
    const proto = GlitchSystemAdvanced.prototype;
    if (proto.showMirrorSwipe && proto.showMirrorSwipe.__nevergradFxPatchedV2) return;

    proto.showMirrorSwipe = function (mirrorBgUrl, onComplete, options = {}) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.className = 'mirror-swipe-container';

            const canvas = document.createElement('canvas');
            canvas.className = 'mirror-swipe-canvas';
            container.appendChild(canvas);

            const hint = document.createElement('div');
            hint.className = 'mirror-swipe-hint';
            const lang = (document.documentElement.lang || 'ko').slice(0, 2);
            const hintTexts = {
                ko: '손가락이나 마우스로 거울을 닦아 주세요 (어느 방향이든)',
                en: 'Wipe the fog with finger or mouse (any direction)',
                ja: '指やマウスで鏡を拭いてください（どの方向でも）',
                es: 'Limpia el vapor con el dedo o el ratón (cualquier dirección)',
                fr: 'Essuyez la buée avec le doigt ou la souris (toute direction)',
                de: 'Wischen Sie den Beschlag mit Finger oder Maus (jede Richtung)',
                pt: 'Limpe o embaçado com o dedo ou o mouse (qualquer direção)'
            };
            const baseHint = hintTexts[lang] || hintTexts.en;
            hint.textContent = baseHint;
            container.appendChild(hint);

            document.body.appendChild(container);

            const ctx = canvas.getContext('2d');
            let completed = false;
            let targetRect = null;
            let cellSize = 18;
            let targetCols = 1;
            let targetRows = 1;
            let clearedCells = new Set();
            let minClearedY = Infinity;
            let maxClearedY = -Infinity;
            let minClearedX = Infinity;
            let maxClearedX = -Infinity;
            const completeThreshold = Math.max(0.16, Math.min(0.5, Number(options.threshold) || 0.22));
            const requiredSpan = Math.max(0.32, Math.min(0.7, Number(options.verticalSpan) || Number(options.span) || 0.38));
            let brushSize = 40;
            let lastProgressBucket = -1;

            const getTargetRect = () => {
                const width = Math.min(canvas.width * 0.56, 560);
                const height = Math.min(canvas.height * 0.76, 760);
                return {
                    left: (canvas.width - width) / 2,
                    top: (canvas.height - height) / 2,
                    width,
                    height
                };
            };

            const rebuildGridKeepProgress = () => {
                targetRect = getTargetRect();
                cellSize = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.024));
                targetCols = Math.max(1, Math.ceil(targetRect.width / cellSize));
                targetRows = Math.max(1, Math.ceil(targetRect.height / cellSize));
                brushSize = Math.max(40, Math.min(canvas.width, canvas.height) * 0.09);
            };

            const paintFogBase = () => {
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'rgba(200, 210, 220, 0.95)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            };

            const redrawClearedHoles = () => {
                if (!targetRect || clearedCells.size === 0) return;
                ctx.globalCompositeOperation = 'destination-out';
                clearedCells.forEach((key) => {
                    const [col, row] = key.split(':').map(Number);
                    const x = targetRect.left + col * cellSize + cellSize / 2;
                    const y = targetRect.top + row * cellSize + cellSize / 2;
                    ctx.beginPath();
                    ctx.arc(x, y, brushSize * 0.85, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.globalCompositeOperation = 'source-over';
            };

            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                rebuildGridKeepProgress();
                paintFogBase();
                redrawClearedHoles();
            };

            resize();
            window.addEventListener('resize', resize);

            let isDrawing = false;
            const stopDrawing = () => { isDrawing = false; };

            const updateHintProgress = (clearRatio, spanRatio) => {
                const score = Math.min(1, Math.max(clearRatio / completeThreshold, spanRatio / requiredSpan));
                const bucket = Math.floor(score * 10);
                if (bucket === lastProgressBucket) return;
                lastProgressBucket = bucket;
                const pct = Math.min(99, Math.round(score * 100));
                if (pct < 8) {
                    hint.textContent = baseHint;
                } else if (pct < 55) {
                    hint.textContent = lang === 'ko'
                        ? `닦는 중… ${pct}%`
                        : `Wiping… ${pct}%`;
                } else if (pct < 90) {
                    hint.textContent = lang === 'ko'
                        ? `거의 다 닦였다… ${pct}%`
                        : `Almost clear… ${pct}%`;
                } else {
                    hint.textContent = lang === 'ko'
                        ? '조금만 더…'
                        : 'Just a bit more…';
                }
            };

            const markCleared = (x, y) => {
                if (!targetRect) return { clearRatio: 0, spanRatio: 0 };

                const radiusSq = brushSize * brushSize;
                const colStart = Math.max(0, Math.floor((x - brushSize - targetRect.left) / cellSize));
                const colEnd = Math.min(targetCols - 1, Math.floor((x + brushSize - targetRect.left) / cellSize));
                const rowStart = Math.max(0, Math.floor((y - brushSize - targetRect.top) / cellSize));
                const rowEnd = Math.min(targetRows - 1, Math.floor((y + brushSize - targetRect.top) / cellSize));

                for (let row = rowStart; row <= rowEnd; row++) {
                    const cellY = targetRect.top + row * cellSize + cellSize / 2;
                    for (let col = colStart; col <= colEnd; col++) {
                        const cellX = targetRect.left + col * cellSize + cellSize / 2;
                        const dx = cellX - x;
                        const dy = cellY - y;
                        if ((dx * dx + dy * dy) > radiusSq) continue;
                        clearedCells.add(`${col}:${row}`);
                        minClearedY = Math.min(minClearedY, cellY);
                        maxClearedY = Math.max(maxClearedY, cellY);
                        minClearedX = Math.min(minClearedX, cellX);
                        maxClearedX = Math.max(maxClearedX, cellX);
                    }
                }

                const clearRatio = clearedCells.size / Math.max(1, targetCols * targetRows);
                const verticalRatio = Number.isFinite(minClearedY)
                    ? Math.max(0, maxClearedY - minClearedY) / targetRect.height
                    : 0;
                const horizontalRatio = Number.isFinite(minClearedX)
                    ? Math.max(0, maxClearedX - minClearedX) / targetRect.width
                    : 0;
                const spanRatio = Math.max(verticalRatio, horizontalRatio);
                return { clearRatio, spanRatio };
            };

            const finish = () => {
                if (completed) return;
                completed = true;
                hint.remove();
                canvas.style.transition = 'opacity 0.5s ease';
                canvas.style.opacity = '0';
                setTimeout(() => {
                    window.removeEventListener('resize', resize);
                    window.removeEventListener('mouseup', stopDrawing);
                    window.removeEventListener('touchend', stopDrawing);
                    container.remove();
                    if (onComplete) onComplete();
                    resolve();
                }, 500);
            };

            const clearFog = (x, y) => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, brushSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';

                const { clearRatio, spanRatio } = markCleared(x, y);
                updateHintProgress(clearRatio, spanRatio);

                if (clearRatio >= completeThreshold && spanRatio >= requiredSpan) {
                    setTimeout(finish, 220);
                }
            };

            canvas.addEventListener('mousedown', (e) => {
                isDrawing = true;
                clearFog(e.clientX, e.clientY);
            });
            canvas.addEventListener('mousemove', (e) => {
                if (isDrawing) clearFog(e.clientX, e.clientY);
            });
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing);
            window.addEventListener('mouseup', stopDrawing);

            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDrawing = true;
                const t = e.touches[0];
                clearFog(t.clientX, t.clientY);
            }, { passive: false });
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isDrawing) return;
                const t = e.touches[0];
                clearFog(t.clientX, t.clientY);
            }, { passive: false });
            canvas.addEventListener('touchend', stopDrawing);
            window.addEventListener('touchend', stopDrawing);
        });
    };
    proto.showMirrorSwipe.__nevergradFxPatchedV2 = true;

    const origStart = proto.startMirrorWipe;
    if (typeof origStart === 'function' && !origStart.__nevergradFxPatchedV2) {
        proto.startMirrorWipe = function (opts = {}) {
            const eased = Object.assign({}, opts, {
                threshold: opts.threshold != null ? opts.threshold : 0.22,
                verticalSpan: opts.verticalSpan != null ? opts.verticalSpan : 0.38
            });
            return origStart.call(this, eased);
        };
        proto.startMirrorWipe.__nevergradFxPatchedV2 = true;
    }
})();
