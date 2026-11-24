// Page formation MasterPrompt (v2) : même protocole que capture/pages.cjs.
const { chromium, devices } = require('playwright');
const URL_FORMATION = process.env.URL_FORMATION || 'https://www.masterprompt.fr/formation';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: devices['iPhone 14 Pro'].userAgent });
  const p = await ctx.newPage();
  await p.goto(URL_FORMATION, { waitUntil: 'networkidle' });
  for (const t of ['Tout accepter', 'Accepter', "J'accepte", 'OK', 'Refuser']) { const btn = p.getByRole('button', { name: t, exact: true }); if (await btn.count()) { await btn.first().click().catch(() => {}); console.log('cookies:', t); break; } }
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 250) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(110); }
  await p.waitForTimeout(1000); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
  const fixed = await p.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().height > 0).map((e) => String(e.className).slice(0, 60) + ' ' + JSON.stringify(e.getBoundingClientRect())));
  console.log('fixed:', fixed);
  await p.screenshot({ path: 'assets/site/formation.png', fullPage: true });
  console.log(await p.evaluate(() => ({ title: document.title, h: document.documentElement.scrollHeight })));
  await b.close();
})();
