const { test, expect } = require('playwright/test');
const fs = require('node:fs');
const path = require('node:path');

for (const lang of ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'pt']) {
    test(`Day 5 companion, farewell, synchronization and save payoffs: ${lang}`, async ({ page }) => {
        await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
        await page.goto(lang === 'ko' ? '/' : `/${lang}/`);
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
        const result = await page.evaluate(async () => {
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
            const shown = [];
            const type = game.dialogue.type.bind(game.dialogue);
            game.dialogue.type = function(name, text, done, options) {
                shown.push({ id: game.state.currentScene, text, voice: options.voicePreset || options.charId });
                return type(name, text, done, options);
            };
            function seed(flags = [], affinity = 0) {
                game._prepareNewRun(); game.state.startNewRun(); game._showScreen('game-screen');
                game.state.currentDay = 5; game.state.currentSlot = 'lunch';
                game.state.stats.seolhwa.affinity = affinity;
                flags.forEach(f => game.state.setFlag(f)); game.settings.set('textSpeed', 0);
                shown.length = 0;
            }
            async function walk(start, stop) {
                game._loadScene(start);
                for (let n = 0; n < 250; n++) {
                    if (game.state.currentScene === stop) return shown.slice();
                    if (game.dialogue.isTyping || game._shouldAutoAdvanceSilentScene(game.currentSceneData, game.i18n.get(game.state.currentScene).text) || game.currentSceneData.skipTextFlags?.some(f => game.state.hasFlag(f))) {
                        await sleep(10); continue;
                    }
                    game._advanceScene();
                    await sleep(10);
                }
                throw new Error(`Stopped at ${game.state.currentScene}; wanted ${stop}`);
            }
            const companions = [];
            for (const ending of ['true', 'escape']) for (const flags of [[], ['sea_companion'], ['riin_companion'], ['sea_companion', 'riin_companion']]) {
                seed([...flags, `route_${ending}`, 'has_evidence']);
                const lines = await walk('day5_night_start', ending === 'true' ? 'day5_ending_true_28' : 'day5_ending_escape_14');
                companions.push({ ending, flags, ids: lines.map(l => l.id), texts: lines.filter(l => /27_(riin|sea)|escape_(riin|sea)$/.test(l.id)) });
            }
            const rewards = [];
            for (const start of ['day5_after_true_11a', 'day5_night_start']) for (const affinity of [24, 25]) {
                seed(['route_true', 'has_evidence'], affinity);
                rewards.push({ start, affinity, lines: await walk(start, 'day5_ending_true_31') });
            }
            seed(['route_true', 'has_evidence', 'sea_companion', 'riin_companion'], 25);
            game.state.currentScene = 'day5_night_start';
            const saved = game.save.saveToSlot(9);
            game.state.clearFlag('sea_companion'); game.state.clearFlag('riin_companion');
            game.state.stats.seolhwa.affinity = 0;
            const loaded = game.save.loadFromSlot(9);
            const restored = { saved, loaded, sea: game.state.hasFlag('sea_companion'), riin: game.state.hasFlag('riin_companion'), affinity: game.state.getDisplayAffinity('seolhwa') };
            const slots = [];
            for (const flag of ['route_true', 'route_escape', 'route_resist', 'route_forget', 'route_ghost', 'ending_bridge_true_done', 'ending_bridge_resist_done', 'ending_bridge_forget_done', 'ending_bridge_ghost_done']) {
                for (const id of ['day5_lunch_end', 'day5_after_start', 'day5_after_end', 'day5_night_start']) {
                    seed([flag, 'has_evidence']);
                    game._loadScene(id);
                    await sleep(5);
                    slots.push({ flag, shown: shown.filter(l => l.id === id) });
                }
            }
            seed(); game._loadScene('day5_lunch_end');
            const ordinary = shown[0];
            return { companions, rewards, restored, slots, ordinary };
        });
        const copy = JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/js/i18n', lang, 'day5_night.json'), 'utf8'));
        for (const c of result.companions) for (const char of ['sea', 'riin']) {
            const id = c.ending === 'true' ? `day5_ending_true_27_${char}` : `day5_ending_escape_${char}`;
            expect(c.ids.filter(v => v === id)).toHaveLength(c.flags.includes(`${char}_companion`) ? 1 : 0);
            for (const line of c.texts) expect(line.text).toBe(copy[line.id].text);
        }
        for (const r of result.rewards) {
            const goodbye = r.lines.filter(l => /^day5_ending_true_16(_clear)?$/.test(l.id));
            expect(goodbye).toHaveLength(1);
            expect(goodbye[0].text).toBe(copy.day5_ending_true_16.text);
            expect(goodbye[0].voice).toBe(r.affinity >= 25 ? 'seolhwa_clear' : 'seolhwa');
            expect(r.lines.some(l => l.id === 'day5_ending_true_30_memory')).toBe(r.affinity >= 25);
        }
        expect(result.restored).toEqual({ saved: true, loaded: true, sea: true, riin: true, affinity: 25 });
        for (const s of result.slots) expect(s.shown, s.flag).toEqual([]);
        expect(result.ordinary.id).toBe('day5_lunch_end'); expect(result.ordinary.text).not.toBe('');
    });
}
