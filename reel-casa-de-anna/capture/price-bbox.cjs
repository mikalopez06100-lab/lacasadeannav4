// Localise le prix affiché sur /prestations pour le masquer dans la capture (aucun prix à l'écran).
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await p.goto('https://lacasadeanna.com/prestations', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const out = []; while ((n = w.nextNode())) if (/€/.test(n.textContent)) { const el = n.parentElement; const rr = el.getBoundingClientRect(); out.push({ t: el.textContent.trim(), x: rr.x, y: rr.y + scrollY, w: rr.width, h: rr.height, bg: getComputedStyle(el.closest('section')||document.body).backgroundColor }); } return out; });
  console.log(JSON.stringify(r)); require('fs').writeFileSync('assets/site/prestations.price.json', JSON.stringify(r)); await b.close();
})();
