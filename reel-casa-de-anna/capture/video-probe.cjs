const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1, isMobile: true });
  await p.goto('https://lacasadeanna.com/', { waitUntil: 'networkidle' });
  const v = await p.evaluate(() => { const v = document.querySelector('video'); return v && { src: v.currentSrc, poster: v.poster, dur: v.duration }; });
  console.log(v);
  for (const t of [0, 2, 4, 6, 8]) {
    await p.evaluate(t => { const v = document.querySelector('video'); v.pause(); v.currentTime = t; return new Promise(r => v.addEventListener('seeked', r, { once: true })); }, t);
    await p.screenshot({ path: `/tmp/claude-0/-home-user/decab57b-ac80-5014-82e0-fcc5cdfb80af/scratchpad/v${t}.png` });
  }
  const fixed = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => ['fixed','sticky'].includes(getComputedStyle(e).position)).map(e => e.tagName + '.' + e.className.toString().slice(0, 80) + ' ' + JSON.stringify(e.getBoundingClientRect())));
  console.log(fixed.join('\n'));
  await b.close();
})();
