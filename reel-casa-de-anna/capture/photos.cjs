// Récupère depuis le site en ligne l'image source la plus grande (srcset → paramètre url=) :
// couvertures des réalisations, galerie du chalet, photos du showroom de l'accueil.
const { chromium } = require('playwright');
const fs = require('fs');
const src = (s) => { try { const u = new URL(s, 'https://lacasadeanna.com'); const inner = u.searchParams.get('url'); return inner ? new URL(inner, 'https://lacasadeanna.com').href : u.href; } catch { return s; } };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const out = {};
  await p.goto('https://lacasadeanna.com/realisations', { waitUntil: 'networkidle' });
  out.covers = await p.evaluate(() => [...document.querySelectorAll('a[href^="/realisations/"]')].map(a => ({ slug: a.getAttribute('href').split('/').pop(), img: a.querySelector('img')?.getAttribute('src') })).filter(x => x.img));
  await p.goto('https://lacasadeanna.com/realisations/chalet-vue-lac', { waitUntil: 'networkidle' });
  for (let y = 0; y < 20000; y += 800) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(60); }
  out.chalet = await p.evaluate(() => [...document.querySelectorAll('main img')].map(i => i.getAttribute('src')));
  await p.goto('https://lacasadeanna.com/', { waitUntil: 'networkidle' });
  out.home = await p.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), alt: i.alt })));
  for (const k of ['covers']) out[k] = out[k].map(x => ({ ...x, img: src(x.img) }));
  out.chalet = out.chalet.map(src); out.home = out.home.map(x => ({ ...x, src: src(x.src) }));
  fs.writeFileSync('assets/photos/sources.json', JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out.covers, null, 1)); console.log(out.chalet.length, out.chalet.slice(0, 4)); console.log(out.home.filter(x => /showroom|hero/.test(x.src)));
  await b.close();
})();
