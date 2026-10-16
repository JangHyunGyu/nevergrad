(function (global) {
    'use strict';

    class CGTransition {
        constructor(layers, dialogue) {
            this.layers = layers.filter(Boolean);
            this.dialogue = dialogue;
            this.key = '';
            this.isCG = false;
            this.active = null;
        }

        _snapshot(source) {
            const clone = source.cloneNode(true);
            const originals = [source, ...source.querySelectorAll('*')];
            const copies = [clone, ...clone.querySelectorAll('*')];
            originals.forEach((element, index) => {
                const copy = copies[index];
                const computed = getComputedStyle(element);
                copy.removeAttribute('id');
                for (const property of computed) copy.style.setProperty(property, computed.getPropertyValue(property));
                copy.style.animation = 'none';
                copy.style.transition = 'none';
                copy.style.pointerEvents = 'none';
            });
            return clone;
        }

        prepare(key, isCG, instant = false) {
            this.cancel();
            if (key === this.key || instant || (!isCG && !this.isCG)) return null;
            const overlay = document.createElement('div');
            overlay.dataset.cgTransition = 'loading';
            Object.assign(overlay.style, {
                position: 'absolute', inset: '0', zIndex: '4', pointerEvents: 'none',
                overflow: 'hidden', background: this.isCG && isCG ? '#000' : 'transparent'
            });
            overlay.setAttribute('aria-hidden', 'true');
            const picture = document.createElement('div');
            Object.assign(picture.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
            this.layers.forEach(layer => picture.appendChild(this._snapshot(layer)));
            overlay.appendChild(picture);
            this.layers[0].parentNode.appendChild(overlay);
            const state = {
                overlay, picture, incoming: isCG, outgoing: this.isCG, animations: [], timers: [],
                visibility: this.dialogue?.style.visibility ?? ''
            };
            state.cancelled = new Promise(resolve => { state.resolveCancel = resolve; });
            this.active = state;
            if (this.dialogue) {
                if (this.dialogue.animate) state.animations.push(this.dialogue.animate(
                    [{ opacity: getComputedStyle(this.dialogue).opacity }, { opacity: 0 }],
                    { duration: 180, fill: 'forwards' }
                ));
                else this.dialogue.style.visibility = 'hidden';
            }
            return state;
        }

        async _fade(state, element, duration) {
            if (this.active !== state) return;
            state.overlay.dataset.cgTransition = 'fading';
            state.overlay.dataset.duration = String(duration);
            if (element.animate) state.animations.push(element.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration, easing: 'ease-in-out', fill: 'forwards' }
            ));
            else {
                element.style.transition = `opacity ${duration}ms ease-in-out`;
                void element.offsetWidth;
                element.style.opacity = '0';
            }
            await Promise.race([
                new Promise(resolve => state.timers.push(setTimeout(resolve, duration))), state.cancelled
            ]);
        }

        async reveal(state) {
            if (!state || this.active !== state) return;
            if (state.outgoing && state.incoming) {
                await this._fade(state, state.picture, 1000);
                if (this.active !== state) return;
                state.picture.remove();
                await this._fade(state, state.overlay, 2000);
            } else {
                await this._fade(state, state.overlay, state.incoming ? 2000 : 1000);
            }
            if (this.active === state) this.cancel();
        }

        commit(key, isCG) {
            this.key = key;
            this.isCG = isCG;
        }

        cancel() {
            const state = this.active;
            if (!state) return;
            this.active = null;
            state.resolveCancel();
            state.timers.forEach(clearTimeout);
            state.animations.forEach(animation => animation.cancel());
            state.overlay.remove();
            if (this.dialogue) this.dialogue.style.visibility = state.visibility;
        }
    }

    global.CGTransition = CGTransition;
})(window);
