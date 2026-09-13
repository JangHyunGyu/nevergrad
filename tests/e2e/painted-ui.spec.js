'use strict';
const { test, expect } = require('playwright/test');
const project = 'nevergrad';
const sizes = [[320,568],[360,640],[390,844],[430,932],[568,320],[844,390],[768,1024],[1024,768],[1280,800],[1920,1080],[2560,1440]];
const languages = ['ko','en','ja','es','fr','de','pt'];
const pathFor = lang => lang === 'ko' ? '/' : '/' + lang + '/';
const menuSelector = '.title-menu';
const controlSelector = '.title-menu .menu-btn, #title-screen .archerlab-link, #title-screen .lang-switcher';
async function boot(page, lang) {
  await page.route(/^https?:\/\//, route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.fallback() : route.abort());
  
  await page.goto(pathFor(lang), {waitUntil:'domcontentloaded'});
  await expect(page.locator('#btn-new-game')).toBeEnabled();
  await expect(page.locator('#title-screen')).toHaveClass(/title-intro-complete/);
}
async function audit(page) {
  // Browser emulation updates innerHeight before dynamic viewport CSS settles.
  await page.waitForFunction(selector => Math.abs(document.querySelector(selector).getBoundingClientRect().height - innerHeight) < 1, '#title-screen');
  const metrics = await page.evaluate(({menuSelector,controlSelector}) => {
    const rect = el => { const b=el.getBoundingClientRect(); return {x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom}; };
    const menu=document.querySelector(menuSelector);
    return {
      width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,
      menu:rect(menu),
      controls:[...document.querySelectorAll(controlSelector)].map(el=>({
        text:el.textContent.trim(),...rect(el),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,
        scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,blur:getComputedStyle(el).backdropFilter
      })),
      buttons:[...menu.querySelectorAll('button')].map(rect)
    };
  },{menuSelector,controlSelector});
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width);
  for(const b of metrics.controls) {
    expect(b.x,b.text).toBeGreaterThanOrEqual(-1);
    expect(b.y,b.text).toBeGreaterThanOrEqual(-1);
    expect(b.right,b.text).toBeLessThanOrEqual(metrics.width+1);
    expect(b.bottom,b.text).toBeLessThanOrEqual(metrics.height+1);
    expect(b.height,b.text).toBeGreaterThanOrEqual(44);
    expect(b.width,b.text).toBeGreaterThanOrEqual(44);
    expect(b.scrollWidth,b.text).toBeLessThanOrEqual(b.clientWidth+1);
    expect(b.scrollHeight,b.text).toBeLessThanOrEqual(b.clientHeight+1);
    expect(b.blur,b.text).toBe('none');
  }
  for(const b of metrics.buttons) {
    expect(b.height).toBeLessThanOrEqual(56);
    expect(b.width).toBeLessThanOrEqual(185);
    expect(Math.abs(b.y-metrics.buttons[0].y)).toBeLessThan(1);
  }
  return metrics;
}
for (const [width,height] of sizes) {
  test(`${project} compact controls at ${width}x${height}`,async({browser},testInfo)=>{
    const context=await browser.newContext({viewport:{width,height},hasTouch:width<=1024,isMobile:width<=1024,locale:'ko-KR',reducedMotion:'reduce',serviceWorkers:'block'});
    const page=await context.newPage();
    await boot(page,'ko');
    await audit(page);
    await page.screenshot({path:testInfo.outputPath('title.png')});
    await context.close();
  });
}
for(const lang of languages) {
  test(`${project} ${lang} labels fit a small phone`,async({page})=>{
    await page.setViewportSize({width:320,height:568});
    await boot(page,lang);
    await audit(page);
  });
}
test('dynamic browser height and safe areas keep controls reachable',async({page})=>{
  let insetsApplied = false;
  await page.route('**/assets/css/buttons.css*',async route=>{
    const response=await route.fetch();
    const css=(await response.text()).replace(/env\(safe-area-inset-top\)/g,'24px').replace(/env\(safe-area-inset-bottom\)/g,'34px').replace(/env\(safe-area-inset-left\)/g,'20px').replace(/env\(safe-area-inset-right\)/g,'20px');
    insetsApplied = css !== await response.text();
    await route.fulfill({response,body:css,contentType:'text/css'});
  });
  await page.setViewportSize({width:390,height:844});
  await boot(page,'ko');
  expect(insetsApplied).toBe(true);
  await audit(page);
  await page.setViewportSize({width:390,height:650});
  await audit(page);
  await page.setViewportSize({width:844,height:390});
  await audit(page);
});
test('painted frame loads and keyboard activation reaches a real control',async({page})=>{
  await boot(page,'ko');
  const frame=await page.locator('#btn-new-game').evaluate(el=>getComputedStyle(el,'::after').backgroundImage);
  expect(frame).toContain('glass-frame.webp');
  const frameResponse=await page.request.get('/assets/images/ui/glass-frame.webp');
  expect(frameResponse.ok()).toBe(true);
  const button=page.locator('#btn-gallery');
  await button.focus();
  await expect(button).toBeFocused();
  await button.press('Enter');
  await expect(page.locator('#gallery-screen')).toBeVisible();
});
