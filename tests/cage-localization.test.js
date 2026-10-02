'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const pools=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/cage_end_pool.js'),'utf8')+'\nCAGE_END_POOL;',{});

test('all localized cage loops retain the 65 source positions and repeated refrain',()=>{
    for(const lang of ['ko','en','ja','es','fr','de','pt','zh']){
        const pool=pools[lang];
        assert.equal(pool.length,pools.ko.length,lang);
        assert.equal(pool.length,65,lang);
        assert.equal(pool[0],pool[63],lang);
        assert.equal(pool[0],pool[64],lang);
        assert.ok(pool.every(text=>typeof text==='string'&&text.startsWith('*')&&text.endsWith('*')),lang);
    }
});

test('cage copy retains established names and translated teacher roles',()=>{
    for(const lang of ['en','es','fr','de','pt'])assert.ok(pools[lang][10].includes('Eunsu'),lang);
    assert.equal(pools.en.some(text=>/Eunsoo|Teacher Eunsu/.test(text)),false);
});
