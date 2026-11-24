(async()=>{
const { chromium } = require('playwright');
const fs = require('node:fs');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://lacasadeanna.com/', { waitUntil: 'networkidle' });
const info = await p.evaluate(() => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const pick = (sel) => { const el = document.querySelector(sel); const s = cs(el); return s && { sel, fontFamily: s.fontFamily, fontWeight: s.fontWeight, fontSize: s.fontSize, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color, bg: s.backgroundColor, text: el.textContent.trim().slice(0, 80) }; };
  const out = { body: pick('body'), h1: pick('h1'), h2: pick('h2'), p: pick('main p'), a: pick('main a'), button: pick('main a[href*="contact"]'), header: pick('header'), footer: pick('footer'), em: pick('h1 em, h1 i, h1 .accent-italic, .accent-italic') };
  const rootVars = {}; const rs = getComputedStyle(document.documentElement);
  for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.selectorText === ':root') for (const k of r.style) if (k.startsWith('--')) rootVars[k] = rs.getPropertyValue(k).trim(); } } catch {} }
  const fontFaces = [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style} ${f.status}`);
  const imgs = [...document.querySelectorAll('header img, footer img')].map(i => i.src);
  return { ...out, rootVars, fontFaces: [...new Set(fontFaces)], logos: imgs, metaDescription: document.querySelector('meta[name=description]')?.content };
});
fs.writeFileSync('assets/brand-raw.json', JSON.stringify(info, null, 2));
console.log(JSON.stringify(info, null, 2));
await b.close();
})();
