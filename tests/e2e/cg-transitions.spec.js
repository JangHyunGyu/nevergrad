const {test,expect}=require('playwright/test');

async function setup(page) {
    await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
    await page.goto('/');
    await page.waitForFunction(()=>window.game?.i18n?.loaded?.day1);
    await page.evaluate(()=>{
        game.settings.set('textSpeed',0);game.state.currentDay=1;game._showScreen('game-screen');
        Object.assign(SCENARIO[1],{
            day1_qa_before:{background:'classroom',character:null,next:'day1_qa_cg'},
            day1_qa_cg:{background:'cg_cycle07_seolhwa',character:null,next:'day1_qa_same'},
            day1_qa_same:{background:'cg_cycle07_seolhwa',character:null,next:'day1_qa_after'},
            day1_qa_after:{background:'corridor',character:null,next:'day1_qa_before'},
            day1_qa_second:{background:'cg_cycle12_yuna',character:null,next:'day1_qa_after'},
            day1_qa_instant:{background:'cg_cycle12_yuna',cgTransition:false,character:null,next:'day1_qa_after'}
        });
        for(const id of Object.keys(SCENARIO[1]).filter(id=>id.startsWith('day1_qa_')))game.i18n.texts.day1[id]={text:id};
        game._loadScene('day1_qa_before');
    });
    await page.waitForFunction(()=>!game.dialogue.isTyping&&!game._clickLocked);
}

for(const [width,height]of [[1280,800],[1024,768],[768,1024],[375,812],[667,375]]){
    test(`CG fades and click protection at ${width}x${height}`,async({page},info)=>{
        await page.setViewportSize({width,height});await setup(page);
        await page.locator('#dialogue-box').dispatchEvent('click');
        await expect(page.locator('[data-cg-transition]')).toHaveAttribute('data-duration','2000');
        await page.waitForTimeout(450);
        const middle=await page.locator('[data-cg-transition]').evaluate(el=>Number(getComputedStyle(el).opacity));
        expect(middle).toBeGreaterThan(0);expect(middle).toBeLessThan(1);
        expect(await page.evaluate(()=>game._waitingForCG&&!game.dialogue.isTyping)).toBe(true);
        for(let i=0;i<10;i++)await page.locator('#dialogue-box').dispatchEvent('click');
        expect(await page.evaluate(()=>game.state.currentScene)).toBe('day1_qa_cg');
        await page.screenshot({path:info.outputPath('enter-midpoint.png')});
        await page.waitForFunction(()=>!game._waitingForCG&&!game.dialogue.isTyping&&!game._clickLocked);
        await page.locator('#dialogue-box').dispatchEvent('click');
        expect(await page.evaluate(()=>game.state.currentScene)).toBe('day1_qa_same');
        await expect(page.locator('[data-cg-transition]')).toHaveCount(0);
        await page.waitForFunction(()=>!game.dialogue.isTyping&&!game._clickLocked);
        await page.locator('#dialogue-box').dispatchEvent('click');
        await expect(page.locator('[data-cg-transition]')).toHaveAttribute('data-duration','1000');
        for(let i=0;i<10;i++)await page.locator('#dialogue-box').dispatchEvent('click');
        expect(await page.evaluate(()=>game.state.currentScene)).toBe('day1_qa_after');
        await page.waitForFunction(()=>!game._waitingForCG&&!game.dialogue.isTyping);
        await expect(page.locator('[data-cg-transition]')).toHaveCount(0);
        expect(await page.locator('#dialogue-box').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
        await page.screenshot({path:info.outputPath('exit-complete.png'),animations:'disabled'});
    });
}

test('CG replacement, interruption and explicit hard cuts clean up all transitions',async({page})=>{
    await setup(page);
    await page.evaluate(()=>game._loadScene('day1_qa_cg'));
    await page.waitForFunction(()=>!game._waitingForCG&&!game.dialogue.isTyping);
    await page.evaluate(()=>game._loadScene('day1_qa_second'));
    await expect(page.locator('[data-cg-transition]')).toHaveAttribute('data-duration','1000');
    await expect(page.locator('[data-cg-transition]')).toHaveAttribute('data-duration','2000');
    await page.waitForFunction(()=>!game._waitingForCG&&!game.dialogue.isTyping);
    await page.evaluate(()=>{game._loadScene('day1_qa_cg');game._loadScene('day1_qa_after');});
    await page.waitForFunction(()=>!game._waitingForCG&&!game.dialogue.isTyping);
    expect(await page.evaluate(()=>game.state.currentScene)).toBe('day1_qa_after');
    await page.waitForTimeout(2100);
    await expect(page.locator('[data-cg-transition]')).toHaveCount(0);
    expect(await page.locator('#bg-layer').evaluate(el=>el.style.backgroundImage)).toContain('corridor');
    await page.evaluate(()=>game._loadScene('day1_qa_instant'));
    await expect(page.locator('[data-cg-transition]')).toHaveCount(0);
    expect(await page.evaluate(()=>game._waitingForCG)).toBe(false);
});
