// Aperçu : capture quelques instants (usage : node render/preview.cjs out_dir t1 t2 ...)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [dir, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, '../scenes/' + (process.env.HTML || 'reel.html')) + '?' + (process.env.SUBS === '0' ? 'subs=0&' : '') + (process.env.TIMINGS_JS ? 'timings=' + process.env.TIMINGS_JS : ''));
  await p.evaluate(() => window.ready);
  for (const t of ts) { await p.evaluate((t) => window.seek(t), +t); await p.screenshot({ path: `${dir}/k-${t}.png` }); }
  await b.close();
})();
