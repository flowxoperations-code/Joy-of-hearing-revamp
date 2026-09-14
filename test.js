import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:4321/joyofhearing/assessment', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  
  const result = await page.evaluate(() => {
    const island = document.querySelector('astro-island');
    if (!island) return { status: 'NO_ISLAND', html: '' };
    const html = island.innerHTML;
    return { status: html.length > 50 ? 'OK' : 'EMPTY', length: html.length, snippet: html.substring(0, 300) };
  });
  
  console.log('RESULT:', JSON.stringify(result, null, 2));
  await browser.close();
})();
