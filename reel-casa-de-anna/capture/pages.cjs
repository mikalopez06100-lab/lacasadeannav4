// Captures pleine page du site en ligne, viewport iPhone 14 Pro (393×852 @3x).
// Les éléments position:fixed (pastille « Menu / Démarrer un projet ») sont masqués
// pour la pleine page puis capturés à part, pour être reposés en fixe dans la maquette.
const { chromium, devices } = require('playwright');
const pages = [['accueil','/'],['realisations','/realisations'],['chalet-vue-lac','/realisations/chalet-vue-lac'],['prestations','/prestations'],['contact','/contact']];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: devices['iPhone 14 Pro'].userAgent });
  for (const [name, path] of pages) {
    const p = await ctx.newPage();
    await p.goto('https://lacasadeanna.com' + path, { waitUntil: 'networkidle' });
    for (const t of ['Tout accepter', 'Accepter', 'J\'accepte', 'OK']) { const btn = p.getByRole('button', { name: t, exact: true }); if (await btn.count()) { await btn.first().click().catch(()=>{}); console.log('cookies fermé'); break; } }
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= h; y += 250) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(110); }
    await p.waitForTimeout(1000);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
    await p.waitForLoadState('networkidle');
    const fixed = await p.evaluate(() => {
      const els = [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 200 && e.getBoundingClientRect().top > 400);
      els.forEach((e, i) => e.setAttribute('data-fx', i));
      return els.map(e => ({ i: e.getAttribute('data-fx'), r: e.getBoundingClientRect().toJSON(), cls: String(e.className).slice(0, 60) }));
    });
    if (name === 'accueil') for (const f of fixed) { await p.locator(`[data-fx="${f.i}"]`).screenshot({ path: `assets/site/bottom-nav.png`, omitBackground: true }); console.log('fixed', JSON.stringify(f)); }
    await p.addStyleTag({ content: '[data-fx]{visibility:hidden!important}' });
    await p.waitForTimeout(300);
    await p.screenshot({ path: `assets/site/${name}.png`, fullPage: true });
    const meta = await p.evaluate(() => ({ title: document.title, desc: document.querySelector('meta[name=description]')?.content, h: document.documentElement.scrollHeight, prices: (document.body.innerText.match(/\d[\d\s]*€/g) || []) }));
    console.log(name, JSON.stringify(meta));
    // positions de repères utiles pour le défilement dans la maquette
    const marks = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('h1,h2,h3')].map(e => [e.textContent.trim().slice(0, 40), Math.round(e.getBoundingClientRect().top + scrollY)])));
    require('fs').writeFileSync(`assets/site/${name}.marks.json`, JSON.stringify(marks, null, 1));
    await p.close();
  }
  await b.close();
})();
