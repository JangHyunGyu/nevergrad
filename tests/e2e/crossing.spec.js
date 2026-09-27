'use strict';
const { test, expect } = require('playwright/test');
const cupid = false;
const languages = ['ko','en','ja','es','fr','de','pt'];
const sizes = [[320,568],[390,844],[430,932],[568,320],[844,390],[768,1024],[1024,768],[1440,900]];
const pathFor = lang => cupid ? (lang === 'ko' ? '/index.html?gate=1' : `/index-${lang}.html?gate=1`) : (lang === 'ko' ? '/?from=riin' : `/${lang}/?from=riin`);
async function boot(page, lang = 'ko') {
  await page.route(/^https?:\/\//, route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.fallback() : route.abort());
  await page.goto(pathFor(lang), {waitUntil:'domcontentloaded'});
  await expect(page.locator('#cross-world')).toBeVisible({timeout:30000});
  await page.waitForFunction(() => document.querySelector('#cross-world img')?.complete);
}
async function audit(page) {
  const result = await page.evaluate(() => {
    const root = document.querySelector('#cross-world');
    return {width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth,
      picture:root.querySelector('img').naturalWidth,
      controls:[...root.querySelectorAll('button')].map(el => {
        const b=el.getBoundingClientRect();return {text:el.textContent,x:b.x,y:b.y,right:b.right,bottom:b.bottom,height:b.height,width:b.width,scroll:el.scrollWidth,client:el.clientWidth};
      })};
  });
  expect(result.picture).toBeGreaterThan(0);
  expect(result.scroll).toBeLessThanOrEqual(result.width);
  for (const b of result.controls) {
    expect(b.x,b.text).toBeGreaterThanOrEqual(0);expect(b.y,b.text).toBeGreaterThanOrEqual(0);
    expect(b.right,b.text).toBeLessThanOrEqual(result.width+1);expect(b.bottom,b.text).toBeLessThanOrEqual(result.height+1);
    expect(b.height,b.text).toBeGreaterThanOrEqual(44);expect(b.width,b.text).toBeGreaterThanOrEqual(44);
    expect(b.scroll,b.text).toBeLessThanOrEqual(b.client+1);
  }
}
for (const [width,height] of sizes) test(`crossing arrival ${width}x${height}`,async({browser},info)=>{
  const context=await browser.newContext({viewport:{width,height},isMobile:width<1024,hasTouch:width<1024,reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await boot(page);await audit(page);await page.screenshot({path:info.outputPath('crossing.png')});
  expect(errors).toEqual([]);await context.close();
});
for (const lang of languages) test(`crossing locale ${lang}`,async({page})=>{
  await page.setViewportSize({width:320,height:568});await boot(page,lang);await audit(page);
  expect(new URL(page.url()).searchParams.has(cupid?'gate':'from')).toBe(false);
});
test('keyboard dismissal releases the game and refresh does not replay arrival',async({page})=>{
  await boot(page);await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#cross-world button').last()).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('#cross-world button').first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('#cross-world')).toHaveCount(0);
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
  await page.reload();await page.waitForFunction(cupid=>cupid?window.gameScriptsLoaded:window.game,cupid);
  await expect(page.locator('#cross-world')).toHaveCount(0);
});
test('arrival works with session storage blocked and reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
  await boot(page);await audit(page);
  expect(await page.locator('.cw-copy').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
test('departure waits, cancels safely, and reports failed saves before navigating',async({page})=>{
  await boot(page);await page.keyboard.press('Escape');
  await page.evaluate(cupid=>{
    window.CrossWorld.show({world:cupid?'nevergrad':'cupid',lang:'ko',departure:true,
      image:cupid?'assets/images/background/riin_lab_pills.jpg':'assets/images/background/cg_gate_bloom.jpg',
      url:'https://example.invalid/',save:()=>false});
  },cupid);
  await page.locator('#cross-world .cw-primary').click();
  await expect(page.locator('.cw-note')).toContainText('저장하지 못했습니다');
  await expect(page.locator('#cross-world .cw-primary')).toHaveText('저장 없이 이동');
  await page.keyboard.press('Escape');await expect(page.locator('#cross-world')).toHaveCount(0);
});

for (const lang of languages) test(`saved arrival remains reachable through rotation and viewport changes ${lang}`,async({page},info)=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:320,height:568});await boot(page,lang);
  const image=await page.locator('#cross-world img').getAttribute('src');
  await page.keyboard.press('Escape');
  await page.evaluate(({cupid,lang,image})=>window.CrossWorld.show({world:cupid?'cupid':'nevergrad',lang,image,hasSave:true}),{cupid,lang,image});
  for(const [width,height] of [[320,568],[568,320],[390,664],[390,844]]) {
    await page.setViewportSize({width,height});await audit(page);
  }
  await page.screenshot({path:info.outputPath('saved-arrival.png')});
});

test('async save settles before departure and reports rejection with usable controls', async ({page}) => {
  await boot(page); await page.keyboard.press('Escape');
  await page.evaluate(cupid => {
    window.crossingSaves = 0;
    window.CrossWorld.show({world: cupid ? 'nevergrad' : 'cupid', lang:'ko', departure:true,
      image: cupid ? 'assets/images/background/riin_lab_pills.jpg' : 'assets/images/background/cg_gate_bloom.jpg',
      url:'http://[', save:() => { window.crossingSaves++; return new Promise((resolve,reject) => { window.rejectCrossingSave = reject; }); }});
    const button = document.querySelector('#cross-world .cw-primary');
    button.click(); button.click();
  }, cupid);
  await expect(page.locator('#cross-world')).toHaveAttribute('aria-busy','true');
  await page.keyboard.press('Tab'); await expect(page.locator('#cross-world')).toBeFocused();
  expect(await page.evaluate(() => window.crossingSaves)).toBe(1);
  await page.evaluate(() => window.rejectCrossingSave(new Error('storage unavailable')));
  await expect(page.locator('.cw-note')).toContainText('저장하지 못했습니다');
  await expect(page.locator('#cross-world .cw-primary')).toBeEnabled();
  await expect(page.locator('#cross-world .cw-primary')).toBeFocused();
});

test('failed navigation restores sound and focus without exposing the old screen', async ({page}) => {
  await boot(page); await page.keyboard.press('Escape');
  await page.evaluate(cupid => {
    window.crossingReturnCount = 0;
    window.CrossWorld.show({world:cupid ? 'nevergrad' : 'cupid', lang:'ko', departure:true,
      image:cupid ? 'assets/images/background/riin_lab_pills.jpg' : 'assets/images/background/cg_gate_bloom.jpg',
      url:'http://[', save:() => true, onReturn:() => window.crossingReturnCount++});
  },cupid);
  await page.locator('#cross-world .cw-primary').click();
  await expect(page.locator('#cross-world')).toHaveClass(/cw-out/);
  expect(await page.locator('#cross-world').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.locator('.cw-note')).toContainText('다시 눌러');
  await expect(page.locator('#cross-world .cw-primary')).toBeFocused();
  expect(await page.evaluate(() => window.crossingReturnCount)).toBe(1);
});

test('closing a pending departure prevents later save completion from navigating', async ({page}) => {
  await boot(page); await page.keyboard.press('Escape');
  await page.evaluate(cupid => {
    window.crossingLeft = false;
    window.CrossWorld.show({world:cupid ? 'nevergrad' : 'cupid', lang:'ko', departure:true,
      image:cupid ? 'assets/images/background/riin_lab_pills.jpg' : 'assets/images/background/cg_gate_bloom.jpg',
      url:'https://example.invalid/', save:() => new Promise(resolve => window.finishCrossingSave = resolve),
      onLeave:() => window.crossingLeft = true});
  },cupid);
  await page.locator('#cross-world .cw-primary').click();
  await page.evaluate(async () => { window.CrossWorld.show({}).close(); window.finishCrossingSave(true); await Promise.resolve(); });
  await expect(page.locator('#cross-world')).toHaveCount(0);
  expect(await page.evaluate(() => window.crossingLeft)).toBe(false);
});

test('unavailable crossing artwork leaves readable choices and no broken-image icon', async ({page}) => {
  await boot(page); await page.keyboard.press('Escape');
  await page.evaluate(() => window.CrossWorld.show({world:'nevergrad',lang:'ko',image:'/missing-crossing-art.jpg'}));
  await expect(page.locator('#cross-world')).toHaveClass(/cw-image-error/);
  await expect(page.locator('#cross-world img')).toBeHidden();
  await expect(page.locator('#cross-world .cw-primary')).toBeEnabled();
  await page.keyboard.press('Escape'); await expect(page.locator('#cross-world')).toHaveCount(0);
});

test('arrival name survives a title detour without replacing edited input', async ({page,context}) => {
  await context.addCookies([{name:'archer_crossing_v1',value:encodeURIComponent(JSON.stringify({target:'nevergrad',name:'지민',at:Date.now()})),domain:'127.0.0.1',path:'/'}]);
  await boot(page);
  await page.getByRole('button',{name:'타이틀로',exact:true}).click();
  await page.locator('#btn-new-game').click();
  await expect(page.locator('#player-name-input')).toHaveValue('지민');
  await expect(page.locator('#player-name-input')).toBeFocused();
  await page.locator('#player-name-input').fill('민아');
  await page.evaluate(() => { game._showScreen('title-screen'); document.getElementById('btn-new-game').click(); });
  await expect(page.locator('#player-name-input')).toHaveValue('민아');
});

test('crossing shock affects the background once and leaves dialogue steady', async ({page}) => {
  await boot(page); await page.keyboard.press('Escape');
  const effect = await page.evaluate(() => {
    let cracks = 0; game._crackleAndBuzz = () => cracks++;
    game._pulseCrossGlitch('day5_lunch_pills_pink_2');
    const first = {background:document.getElementById('bg-layer').classList.contains('cross-glitch'),screen:document.getElementById('game-screen').classList.contains('cross-glitch')};
    game._pulseCrossGlitch('day5_lunch_pills_pink_3');
    return {...first,cracks};
  });
  expect(effect).toEqual({background:true,screen:false,cracks:1});
});

for (const pill of ['분홍 알약','검은 알약']) test(`pill choice follows the selected action: ${pill}`, async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await boot(page); await page.keyboard.press('Escape');
  await page.evaluate(() => {
    game._prepareNewRun(); game.state.startNewRun();
    game.state.playerName='지민'; game.state.currentDay=5; game.state.currentSlot='lunch';
    game.settings.set('textSpeed',0); game._showScreen('game-screen');
    game._loadScene('day5_lunch_pills_2');
  });
  await expect(page.locator('#choice-panel')).toBeVisible();
  await expect(page.locator('#choice-panel .choice-btn')).toHaveText(['분홍 알약','검은 알약']);
  await page.getByRole('button',{name:pill,exact:true}).click();
  const black=pill==='검은 알약';
  await page.waitForFunction(black=>game.state.currentScene===(black?'day5_lunch_pills_black_1':'day5_lunch_pills_pink_1')&&!game.dialogue.isTyping&&!game._clickLocked,black);
  await expect(page.locator('#dialogue-box')).toContainText(black?'검은 알약을 삼키자':'분홍 알약을 삼키자');
  await page.locator('#dialogue-box').click();
  await page.waitForFunction(()=>!game.dialogue.isTyping&&!game._clickLocked);
  if(black) {
    await expect(page.locator('#dialogue-box')).toContainText('캐비닛 안에는 뭐가 있어?');
    await page.locator('#dialogue-box').click();
    await page.waitForFunction(()=>game.state.currentScene==='day5_lunch_right_14');
    await expect(page.locator('#cross-world')).toHaveCount(0);
  } else {
    await page.locator('#dialogue-box').click();
    await page.waitForFunction(()=>game.state.currentScene==='day5_lunch_pills_pink_2'&&!game.dialogue.isTyping&&!game._clickLocked);
    await page.locator('#dialogue-box').click();
    await page.waitForFunction(()=>game.state.currentScene==='day5_lunch_pills_pink_3'&&!game.dialogue.isTyping&&!game._clickLocked);
    await page.locator('#dialogue-box').click();
    await expect(page.locator('#cross-world')).toBeVisible();
  }
});
