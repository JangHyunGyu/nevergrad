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
