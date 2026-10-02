'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('runtime overlay never restores stale JSON text and still supplies missing native scenes',async()=>{
    class Manager {
        constructor(){this.texts={day1:{existing:{text:'Current canonical copy'}}};}
        async loadDay(){return true;}
        async loadAll(){return true;}
    }
    const manager=new Manager();
    const pack={en:{day1:{existing:{text:'Stale copy'},fallback:{text:'English fallback'}}},ja:{day1:{existing:{text:'Stale Japanese'},native:{text:'追加の日本語'}}}};
    const source=fs.readFileSync(path.join(__dirname,'../assets/js/scenario/causality_i18n_overlays.js'),'utf8')
        .replace(/var PACK = \{.*\};/,`var PACK = ${JSON.stringify(pack)};`);
    vm.runInNewContext(source,{I18nManager:Manager,window:{i18nManager:manager},document:{documentElement:{lang:'ja'},addEventListener(){}},setTimeout(){}});
    assert.equal(manager.texts.day1.existing.text,'Current canonical copy');
    assert.equal(manager.texts.day1.native.text,'追加の日本語');
    assert.equal(manager.texts.day1.fallback.text,'English fallback');
    await manager.loadDay(1);await manager.loadAll();
    assert.equal(manager.texts.day1.existing.text,'Current canonical copy');
});
