(function () {
    'use strict';

    const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

    function gsapInstance() {
        if (!window.gsap) return null;
        if (window.matchMedia && window.matchMedia(REDUCED_MOTION).matches) return null;
        return window.gsap;
    }

    function toSeconds(ms, fallback) {
        const value = Number(ms);
        if (!Number.isFinite(value)) return fallback;
        return Math.max(0, value / 1000);
    }

    function targetOpacity(value) {
        if (value === '' || value == null) return 1;
        const n = Number(value);
        return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 1;
    }

    function animatePanel(el, fromY, fromScale) {
        const gsap = gsapInstance();
        if (!gsap || !el) return false;
        const panel = el.querySelector('.pause-container, .settings-container, .sl-container, .backlog-container, .save-slot-container, .gallery-container, .modal-panel, .modal-card');
        if (!panel) return false;
        gsap.killTweensOf(panel);
        gsap.fromTo(panel,
            { autoAlpha: 0, y: fromY, scale: fromScale },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: 'power3.out' }
        );
        return true;
    }

    function setPlayable(buttons, enabled) {
        buttons.forEach((button) => {
            button.classList.toggle('choice-ready', enabled);
            button.style.pointerEvents = enabled ? '' : 'none';
        });
    }

    window.NevergradMotion = {
        enabled() {
            return !!gsapInstance();
        },

        kill(target) {
            const gsap = window.gsap;
            if (gsap && target) gsap.killTweensOf(target);
        },

        screenEnter(el) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            gsap.killTweensOf(el);
            gsap.fromTo(el,
                { autoAlpha: 0, scale: 0.988 },
                { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'power2.out' }
            );
            return true;
        },

        overlayEnter(el) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            gsap.killTweensOf(el);
            gsap.fromTo(el,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.18, ease: 'power2.out' }
            );
            animatePanel(el, 12, 0.985);
            return true;
        },

        overlayExit(el, onComplete) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            gsap.killTweensOf(el);
            gsap.to(el, {
                autoAlpha: 0,
                duration: 0.16,
                ease: 'power2.in',
                onComplete() {
                    gsap.set(el, { clearProps: 'opacity,visibility' });
                    if (onComplete) onComplete();
                }
            });
            return true;
        },

        titleIntro(stage, titleScreen) {
            const gsap = gsapInstance();
            if (!gsap || !stage) return false;

            window.clearTimeout(window.__nevergradTitleMenuTimer);
            titleScreen?.classList.remove('title-intro-complete');
            stage.classList.remove('title-intro-reset', 'title-intro-active');

            const bg = stage.querySelector('.title-stage-bg');
            const chars = Array.from(stage.querySelectorAll('.title-char-lineup[src]:not([src=""])'))
                .sort((a, b) => Number(a.dataset.titleIntroOrder || 0) - Number(b.dataset.titleIntroOrder || 0));

            gsap.killTweensOf([stage, bg, ...chars, '.title-content', '.title-menu .menu-btn']);
            if (bg) {
                gsap.fromTo(bg, { autoAlpha: 0, scale: 1.045 }, { autoAlpha: 0.92, scale: 1, duration: 1.25, ease: 'power2.out' });
            }
            gsap.fromTo(chars,
                { autoAlpha: 0, y: 28, scale: 0.985 },
                { autoAlpha: (i, el) => Number(el.style.getPropertyValue('--title-opacity')) || 1, y: 0, scale: 1, duration: 0.8, stagger: 0.16, delay: 0.42, ease: 'power3.out' }
            );
            gsap.fromTo('.title-content',
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.58, ease: 'power2.out' }
            );
            gsap.fromTo('.title-menu .menu-btn',
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.08, delay: 1.6, ease: 'power2.out' }
            );
            window.__nevergradTitleMenuTimer = window.setTimeout(() => {
                titleScreen?.classList.add('title-intro-complete');
            }, 1800);
            return true;
        },

        background(bgLayer, absoluteSrc, options = {}) {
            const gsap = gsapInstance();
            if (!gsap || !bgLayer || !absoluteSrc) return false;

            const newBg = `url('${absoluteSrc}')`;
            const currentBg = bgLayer.style.backgroundImage;
            if (!currentBg || currentBg === 'none' || currentBg === newBg) {
                bgLayer.style.backgroundImage = newBg;
                gsap.fromTo(bgLayer, { scale: 1.012 }, { scale: 1, duration: 0.7, ease: 'power2.out' });
                return true;
            }

            const cover = document.createElement('div');
            cover.className = 'ng-gsap-bg-fade';
            Object.assign(cover.style, {
                position: 'absolute',
                inset: '0',
                pointerEvents: 'none',
                backgroundImage: newBg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: '0',
                transform: 'scale(1.03)',
                zIndex: '0'
            });
            bgLayer.appendChild(cover);
            gsap.to(cover, {
                opacity: 1,
                scale: 1,
                duration: options.slow ? 1.4 : 0.58,
                ease: 'power2.out',
                onComplete() {
                    bgLayer.style.backgroundImage = newBg;
                    cover.remove();
                }
            });
            return true;
        },

        mediaEnter(el) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            el.classList.add('visible');
            const child = el.firstElementChild;
            gsap.killTweensOf([el, child]);
            gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: 'power2.out' });
            if (child) {
                gsap.fromTo(child, { y: 24, scale: 0.985, rotate: -0.4 }, { y: 0, scale: 1, rotate: 0, duration: 0.45, ease: 'power3.out' });
            }
            return true;
        },

        characterIn(el, opacity) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            gsap.killTweensOf(el);
            el.style.opacity = '0';
            gsap.fromTo(el,
                { autoAlpha: 0, y: 18, scale: 0.99 },
                { autoAlpha: targetOpacity(opacity), y: 0, scale: 1, duration: 0.34, ease: 'power3.out' }
            );
            return true;
        },

        characterOut(el, onComplete) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            gsap.killTweensOf(el);
            gsap.to(el, {
                autoAlpha: 0,
                y: 10,
                duration: 0.22,
                ease: 'power2.in',
                onComplete() {
                    if (onComplete) onComplete();
                }
            });
            return true;
        },

        characterPulse(el, opacity) {
            const gsap = gsapInstance();
            if (!gsap || !el) return false;
            gsap.killTweensOf(el);
            gsap.fromTo(el,
                { autoAlpha: Math.min(targetOpacity(opacity), 0.72), scale: 0.996 },
                { autoAlpha: targetOpacity(opacity), scale: 1, duration: 0.22, ease: 'power2.out' }
            );
            return true;
        },

        choicesIn(panel, buttons, options = {}) {
            const gsap = gsapInstance();
            if (!gsap || !panel || !buttons.length) return false;
            setPlayable(buttons, false);
            buttons.forEach((button) => {
                button.style.animation = 'none';
            });
            gsap.killTweensOf([panel, ...buttons]);
            gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'power2.out' });
            gsap.fromTo(buttons,
                { autoAlpha: 0, y: 18, scale: 0.985 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.34,
                    stagger: options.stagger ?? 0.075,
                    ease: 'power3.out',
                    onComplete() {
                        setPlayable(buttons, true);
                        if (options.onComplete) options.onComplete();
                    }
                }
            );
            return true;
        },

        choiceSelect(button, panel, onComplete) {
            const gsap = gsapInstance();
            if (!gsap || !button || !panel) return false;
            const buttons = Array.from(panel.querySelectorAll('.choice-btn'));
            setPlayable(buttons, false);
            const others = buttons.filter((item) => item !== button);
            const tl = gsap.timeline({ onComplete });
            tl.to(others, { autoAlpha: 0, y: -8, duration: 0.18, stagger: 0.025, ease: 'power2.in' }, 0)
              .to(button, { scale: 1.035, duration: 0.12, ease: 'power2.out' }, 0)
              .to(button, { autoAlpha: 0, y: -10, scale: 0.99, duration: 0.18, ease: 'power2.in' }, 0.12)
              .to(panel, { autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, 0.16);
            return true;
        },

        screenNoise(overlay, duration = 300, heavy = false, gameScreen = null) {
            const gsap = gsapInstance();
            if (!gsap || !overlay) return null;
            overlay.classList.remove('hidden');
            overlay.classList.add(heavy ? 'heavy-glitch' : 'noise');
            if (gameScreen) gameScreen.classList.add('screen-shake');
            gsap.killTweensOf(overlay);
            return new Promise((resolve) => {
                gsap.fromTo(overlay,
                    { autoAlpha: 0, x: 0 },
                    {
                        autoAlpha: heavy ? 0.9 : 0.72,
                        x: heavy ? 'random(-5, 5)' : 'random(-2, 2)',
                        duration: 0.045,
                        repeat: Math.max(2, Math.floor(duration / 70)),
                        yoyo: true,
                        ease: 'steps(2)',
                        onComplete() {
                            overlay.classList.add('hidden');
                            overlay.classList.remove('noise', 'heavy-glitch');
                            if (gameScreen) gameScreen.classList.remove('screen-shake');
                            gsap.set(overlay, { clearProps: 'opacity,visibility,x' });
                            resolve();
                        }
                    }
                );
            });
        },

        memoryFlash(overlay, duration = 1000, onComplete) {
            const gsap = gsapInstance();
            if (!gsap || !overlay) return false;
            overlay.classList.add('visible');
            gsap.killTweensOf(overlay);
            const tl = gsap.timeline({
                onComplete() {
                    overlay.remove();
                    if (onComplete) onComplete();
                }
            });
            tl.fromTo(overlay, { autoAlpha: 0, scale: 1.045 }, { autoAlpha: 0.94, scale: 1, duration: 0.09, ease: 'power2.out' })
              .to(overlay, { x: 2, yoyo: true, repeat: Math.max(1, Math.floor(duration / 90)), duration: 0.045, ease: 'steps(2)' }, 0)
              .to(overlay, { autoAlpha: 0, scale: 1.018, duration: 0.24, ease: 'power2.in' }, Math.max(0.12, duration / 1000));
            return true;
        },

        cageExit(button) {
            const gsap = gsapInstance();
            if (!gsap || !button) return false;
            button.classList.add('cage-exit-visible');
            gsap.fromTo(button,
                { autoAlpha: 0, scale: 0.5, rotate: -12 },
                { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.8)' }
            );
            gsap.to(button, { scale: 1.08, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });
            return true;
        },

        toast(toast, holdMs, onComplete) {
            const gsap = gsapInstance();
            if (!gsap || !toast) return false;
            gsap.killTweensOf(toast);
            toast.classList.add('save-toast-visible');
            gsap.fromTo(toast,
                { autoAlpha: 0, y: -12 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.22,
                    ease: 'power2.out',
                    onComplete() {
                        gsap.to(toast, {
                            autoAlpha: 0,
                            y: -10,
                            delay: toSeconds(holdMs, 1.2),
                            duration: 0.24,
                            ease: 'power2.in',
                            onComplete
                        });
                    }
                }
            );
            return true;
        }
    };
})();
