(function (global) {
    'use strict';

    class LifecycleManager {
        constructor(name = 'scope', host = global) {
            this.name = name;
            this.host = host;
            this.timeouts = new Set();
            this.intervals = new Set();
            this.listeners = new Set();
            this.cleanups = new Set();
            this.generation = 0;
            this.disposed = false;
        }

        timeout(callback, delay = 0, ...args) {
            if (this.disposed) return null;
            let id = null;
            id = this.host.setTimeout(() => {
                this.timeouts.delete(id);
                if (!this.disposed) callback(...args);
            }, Math.max(0, Number(delay) || 0));
            this.timeouts.add(id);
            return id;
        }

        clearTimeout(id) {
            if (id === null || id === undefined) return;
            this.host.clearTimeout(id);
            this.timeouts.delete(id);
        }

        interval(callback, delay = 0, ...args) {
            if (this.disposed) return null;
            const id = this.host.setInterval(() => {
                if (!this.disposed) callback(...args);
            }, Math.max(0, Number(delay) || 0));
            this.intervals.add(id);
            return id;
        }

        listen(target, type, listener, options) {
            if (this.disposed || !target?.addEventListener) return () => {};
            target.addEventListener(type, listener, options);
            const entry = { target, type, listener, options };
            this.listeners.add(entry);
            return () => {
                target.removeEventListener(type, listener, options);
                this.listeners.delete(entry);
            };
        }

        track(cleanup) {
            if (typeof cleanup !== 'function') return () => {};
            if (this.disposed) {
                cleanup();
                return () => {};
            }
            this.cleanups.add(cleanup);
            return () => this.cleanups.delete(cleanup);
        }

        guard(callback) {
            const generation = this.generation;
            return (...args) => {
                if (!this.disposed && generation === this.generation) return callback(...args);
                return undefined;
            };
        }

        createScope(name) {
            const child = new LifecycleManager(`${this.name}:${name}`, this.host);
            const cleanup = () => child.dispose();
            this.cleanups.add(cleanup);
            child._detachParent = () => this.cleanups.delete(cleanup);
            return child;
        }

        clear() {
            this.generation += 1;
            for (const id of this.timeouts) this.host.clearTimeout(id);
            for (const id of this.intervals) this.host.clearInterval(id);
            for (const entry of this.listeners) {
                entry.target.removeEventListener(entry.type, entry.listener, entry.options);
            }
            for (const cleanup of [...this.cleanups].reverse()) {
                try { cleanup(); } catch (_) { /* cleanup remains best-effort */ }
            }
            this.timeouts.clear();
            this.intervals.clear();
            this.listeners.clear();
            this.cleanups.clear();
        }

        snapshot() {
            return {
                name: this.name,
                timeouts: this.timeouts.size,
                intervals: this.intervals.size,
                listeners: this.listeners.size,
                cleanups: this.cleanups.size,
                generation: this.generation,
                disposed: this.disposed
            };
        }

        dispose() {
            if (this.disposed) return;
            this._detachParent?.();
            this._detachParent = null;
            this.clear();
            this.disposed = true;
        }
    }

    global.LifecycleManager = LifecycleManager;
    if (typeof module !== 'undefined' && module.exports) module.exports = LifecycleManager;
})(typeof window !== 'undefined' ? window : globalThis);
