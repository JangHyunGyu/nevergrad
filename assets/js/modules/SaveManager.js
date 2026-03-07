/**
 * ============================================================================
 * SaveManager.js - 저장/불러오기
 * ============================================================================
 */

class SaveManager {
    constructor(stateManager) {
        this.state = stateManager;
        this.SAVE_KEY = 'nevergrad_save';
    }

    save() {
        try {
            const data = this.state.serialize();
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('[SaveManager] Save failed:', e);
            return false;
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return false;
            this.state.deserialize(JSON.parse(raw));
            return true;
        } catch (e) {
            console.error('[SaveManager] Load failed:', e);
            return false;
        }
    }

    hasSaveData() {
        return !!localStorage.getItem(this.SAVE_KEY);
    }

    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }
}
