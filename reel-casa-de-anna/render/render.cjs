// Rendu déterministe image par image : seek(frame/30) puis capture PNG.
// usage : node render/render.cjs <subs|muet> [workers]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const T = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../' + (process.env.TIMINGS || 'timings.json'))));
const variant = process.argv[2] || 'subs'; const W = +(process.argv[3] || 3);
const dir = path.resolve(__dirname, 'frames-' + (process.env.TAG || '') + variant); fs.mkdirSync(dir, { recursive: true });
const N = Math.round(T.duration * T.fps);
(async () => {
  const b = await chromium.launch();
  const t0 = Date.now();
  await Promise.all([...Array(W).keys()].map(async (w) => {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await p.goto('file://' + path.resolve(__dirname, '../scenes/' + (process.env.HTML || 'reel.html')) + (variant === 'muet' ? '?subs=0' : ''));
    await p.evaluate(() => window.ready);
    for (let f = w; f < N; f += W) {
      await p.evaluate((t) => window.seek(t), f / T.fps);
      await p.screenshot({ path: path.join(dir, `f${String(f).padStart(5, '0')}.png`) });
      if (f % 150 === 0) console.log(variant, f, '/', N, Math.round((Date.now() - t0) / 1000) + 's');
    }
  }));
  await b.close();
})();
